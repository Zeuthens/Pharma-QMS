// Added by Zeuthen, 2026-10-17
'use strict';

// Shared checks for git-native signature evidence (workflow 2.5) used by the
// training (3.2) and QMS-release (2.7) reconcilers.
//
// A signature attestation comment is accepted only when:
// - it was posted by the Zeuthen QMS GitHub App (not GITHUB_TOKEN / github-actions[bot]);
// - the workflow run named in the signed manifest is a successful
//   workflow_dispatch run of 2.5 on the default branch, started by the signer,
//   for this record number (run-name carries the record number);
// - the Sigstore keyless signature over the exact manifest bytes verifies with
//   a certificate whose identity is 2.5 on the default branch.
// Comments stay editable by write-access users; the verified manifest, its
// signature and certificate are therefore copied to the hash-bound evidence
// release, which is the record of truth.

const QMS_APP_BOT_LOGIN = 'zeuthen-pharma-qms-bot[bot]';
const QMS_APP_SLUG = 'zeuthen-pharma-qms-bot';
const SIGNATURE_WORKFLOW_PATH = '.github/workflows/2.5_signature_git_native_fallback.yml';
const OIDC_ISSUER = 'https://token.actions.githubusercontent.com';

function isQmsAppComment(comment) {
  const login = String(comment?.user?.login || '').toLowerCase();
  if (login !== QMS_APP_BOT_LOGIN) return false;
  const app = comment?.performed_via_github_app;
  if (app && String(app.slug || '').toLowerCase() !== QMS_APP_SLUG) return false;
  return true;
}

function parseSigstoreBlock(body) {
  const match = String(body || '').match(/<!--\s*SIGSTORE_SIGNATURE_V1\s*([\s\S]*?)-->/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1].trim());
    if (!parsed.signature || !parsed.certificate) return null;
    return parsed;
  } catch {
    return null;
  }
}

// The exact bytes 2.5 wrote to signed_attestation.json and signed with cosign.
function signedAttestationBytes(attestation) {
  return `${JSON.stringify(attestation, null, 2)}\n`;
}

// Pure check of a workflow run object from GET /actions/runs/{id}.
function checkSignatureRun(run, { signer, defaultBranch, recordNumber, runId }) {
  const problems = [];
  if (!run) return ['workflow run not found'];
  if (Number(run.id) !== Number(runId)) problems.push(`run id ${run.id} != ${runId}`);
  if (String(run.path || '').split('@')[0] !== SIGNATURE_WORKFLOW_PATH) problems.push(`run path '${run.path}' is not ${SIGNATURE_WORKFLOW_PATH}`);
  if (String(run.event || '') !== 'workflow_dispatch') problems.push(`run event '${run.event}' is not workflow_dispatch`);
  if (String(run.head_branch || '') !== String(defaultBranch || '')) problems.push(`run branch '${run.head_branch}' is not '${defaultBranch}'`);
  if (String(run.status || '') !== 'completed' || String(run.conclusion || '') !== 'success') {
    problems.push(`run status ${run.status}/${run.conclusion} is not completed/success`);
  }
  const want = String(signer || '').toLowerCase();
  if (String(run.actor?.login || '').toLowerCase() !== want) problems.push(`run actor @${run.actor?.login} is not @${want}`);
  if (run.triggering_actor && String(run.triggering_actor.login || '').toLowerCase() !== want) {
    problems.push(`run triggered by @${run.triggering_actor.login}, not @${want}`);
  }
  if (!String(run.display_title || '').endsWith(`#${recordNumber}`)) problems.push(`run '${run.display_title}' is not for #${recordNumber}`);
  return problems;
}

// Verifies one attestation comment end to end. Writes the signed manifest,
// signature and certificate as `${prefix}.json|.sig|.pem` when it succeeds.
async function verifySignatureEvidence({
  actionsClient, owner, repo, repositoryFull, defaultBranch, comment, attestation,
  signer, recordNumber, prefix, exec, fs, core,
  pollAttempts = 20, pollSeconds = 15,
}) {
  const fail = (reason) => ({ ok: false, reason });
  if (!isQmsAppComment(comment)) return fail('comment not posted by the QMS GitHub App');
  const sigstore = parseSigstoreBlock(comment.body);
  if (!sigstore) return fail('no Sigstore signature block');
  const want = String(signer || '').toLowerCase();
  if (String(attestation.actor_login || '').toLowerCase() !== want) return fail('signed actor_login does not match signer');
  if (Number(attestation.record_number || attestation.pr_number || 0) !== Number(recordNumber)) return fail('signed record number mismatch');
  const runId = Number(attestation.workflow_run?.id || 0);
  if (!runId) return fail('no workflow run id in signed manifest');

  let run = null;
  for (let attempt = 0; attempt < pollAttempts; attempt += 1) {
    run = (await actionsClient.rest.actions.getWorkflowRun({ owner, repo, run_id: runId })).data;
    if (String(run.status || '') === 'completed') break;
    await new Promise((resolve) => setTimeout(resolve, pollSeconds * 1000));
  }
  const problems = checkSignatureRun(run, { signer, defaultBranch, recordNumber, runId });
  if (problems.length > 0) return fail(problems.join('; '));

  const bytes = signedAttestationBytes(attestation);
  const crypto = require('crypto');
  if (sigstore.signed_file_sha256 && crypto.createHash('sha256').update(bytes, 'utf8').digest('hex') !== sigstore.signed_file_sha256) {
    return fail('signed manifest bytes do not match the Sigstore block');
  }
  fs.writeFileSync(`${prefix}.json`, bytes, 'utf8');
  fs.writeFileSync(`${prefix}.sig`, `${String(sigstore.signature).trim()}\n`, 'utf8');
  fs.writeFileSync(`${prefix}.pem`, `${String(sigstore.certificate).trim()}\n`, 'utf8');
  const identity = `https://github.com/${repositoryFull}/${SIGNATURE_WORKFLOW_PATH}@refs/heads/${defaultBranch}`;
  const code = await exec.exec('cosign', [
    'verify-blob',
    '--signature', `${prefix}.sig`,
    '--certificate', `${prefix}.pem`,
    '--certificate-identity', identity,
    '--certificate-oidc-issuer', OIDC_ISSUER,
    `${prefix}.json`,
  ], { ignoreReturnCode: true });
  if (code !== 0) return fail(`cosign verify-blob failed for identity ${identity}`);
  if (core) core.info(`Verified signature evidence for @${want} (run ${runId}).`);
  return { ok: true, files: [`${prefix}.json`, `${prefix}.sig`, `${prefix}.pem`] };
}

module.exports = {
  QMS_APP_BOT_LOGIN,
  QMS_APP_SLUG,
  SIGNATURE_WORKFLOW_PATH,
  isQmsAppComment,
  parseSigstoreBlock,
  signedAttestationBytes,
  checkSignatureRun,
  verifySignatureEvidence,
};
