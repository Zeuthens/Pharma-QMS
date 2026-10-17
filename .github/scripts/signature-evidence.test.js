// Added by Zeuthen, 2026-10-17
'use strict';

// Node-only unit test for the git-native signature evidence checks. Run: node --test
const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const ev = require('./signature-evidence.js');

const okRun = {
  id: 11,
  path: '.github/workflows/2.5_signature_git_native_fallback.yml',
  event: 'workflow_dispatch',
  head_branch: 'main',
  status: 'completed',
  conclusion: 'success',
  actor: { login: 'Zeuthens' },
  triggering_actor: { login: 'Zeuthens' },
  display_title: '2.5 Manual Signature Fallback #42',
};
const opts = { signer: 'zeuthens', defaultBranch: 'main', recordNumber: 42, runId: 11 };

test('only the QMS GitHub App counts as signature bot', () => {
  assert.ok(ev.isQmsAppComment({ user: { login: 'zeuthen-pharma-qms-bot[bot]' }, performed_via_github_app: { slug: 'zeuthen-pharma-qms-bot' } }));
  assert.ok(ev.isQmsAppComment({ user: { login: 'zeuthen-pharma-qms-bot[bot]' } }));
  assert.ok(!ev.isQmsAppComment({ user: { login: 'github-actions[bot]' } }));
  assert.ok(!ev.isQmsAppComment({ user: { login: 'zeuthen-pharma-qms-bot' } }));
  assert.ok(!ev.isQmsAppComment({ user: { login: 'zeuthen-pharma-qms-bot[bot]' }, performed_via_github_app: { slug: 'other' } }));
});

test('signature run must be a successful 2.5 dispatch on main by the signer for this record', () => {
  assert.deepStrictEqual(ev.checkSignatureRun(okRun, opts), []);
  for (const [field, value] of [
    ['head_branch', 'feature'],
    ['path', '.github/workflows/evil.yml'],
    ['event', 'push'],
    ['conclusion', 'failure'],
    ['status', 'in_progress'],
    ['actor', { login: 'mallory' }],
    ['triggering_actor', { login: 'mallory' }],
    ['display_title', '2.5 Manual Signature Fallback #43'],
  ]) {
    assert.notDeepStrictEqual(ev.checkSignatureRun({ ...okRun, [field]: value }, opts), [], field);
  }
});

test('verifySignatureEvidence writes signed bytes and runs cosign with the main-branch identity', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sigev-'));
  const attestation = { actor_login: 'Zeuthens', record_number: 42, workflow_run: { id: 11 }, target_hash: 'h' };
  const bytes = ev.signedAttestationBytes(attestation);
  const comment = {
    user: { login: 'zeuthen-pharma-qms-bot[bot]' },
    body: `<!-- SIGSTORE_SIGNATURE_V1\n${JSON.stringify({ signature: 'c2ln', certificate: 'Y2VydA==', signed_file_sha256: crypto.createHash('sha256').update(bytes).digest('hex') })}\n-->`,
  };
  const calls = [];
  const exec = { exec: async (cmd, args) => { calls.push([cmd, ...args]); return 0; } };
  const actionsClient = { rest: { actions: { getWorkflowRun: async () => ({ data: okRun }) } } };
  const prefix = path.join(dir, 'signer_attestation');
  const res = await ev.verifySignatureEvidence({
    actionsClient, owner: 'Zeuthens', repo: 'Pharma-QMS', repositoryFull: 'Zeuthens/Pharma-QMS', defaultBranch: 'main',
    comment, attestation, signer: 'zeuthens', recordNumber: 42, prefix, exec, fs,
  });
  assert.ok(res.ok, res.reason);
  assert.strictEqual(fs.readFileSync(`${prefix}.json`, 'utf8'), bytes);
  assert.ok(calls[0].includes('https://github.com/Zeuthens/Pharma-QMS/.github/workflows/2.5_signature_git_native_fallback.yml@refs/heads/main'));

  const forged = await ev.verifySignatureEvidence({
    actionsClient, owner: 'Zeuthens', repo: 'Pharma-QMS', repositoryFull: 'Zeuthens/Pharma-QMS', defaultBranch: 'main',
    comment: { ...comment, user: { login: 'github-actions[bot]' } }, attestation, signer: 'zeuthens', recordNumber: 42, prefix, exec, fs,
  });
  assert.ok(!forged.ok);
  const badCosign = await ev.verifySignatureEvidence({
    actionsClient, owner: 'Zeuthens', repo: 'Pharma-QMS', repositoryFull: 'Zeuthens/Pharma-QMS', defaultBranch: 'main',
    comment, attestation, signer: 'zeuthens', recordNumber: 42, prefix, exec: { exec: async () => 1 }, fs,
  });
  assert.ok(!badCosign.ok);
});
