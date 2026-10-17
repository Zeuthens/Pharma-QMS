// Modified by Zeuthen, 2026-10-17
'use strict';

// Node-only unit test for the shared signer-role matcher. Run: node this file.
// Single JS stack; no test framework needed.
const assert = require('assert');
const { matchRoleSlots } = require('./role-coverage.js');

const M = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([role, users]) => [role, users.map((u) => u.toLowerCase())]));

// Eng-first declaration, author qualifies for both, only a non-author
// engineering lead approved -> author flexibly covers QA. Valid.
let r = matchRoleSlots(
  ['engineering_lead', 'qa_lead'],
  M({ engineering_lead: ['example-dual-lead', 'example-eng-lead'], qa_lead: ['example-dual-lead', 'example-qa-lead'] }),
  'example-dual-lead',
  ['example-eng-lead'],
  1,
);
assert.strictEqual(r.covered, true, 'eng-first declaration should be covered');
assert.strictEqual(r.authorRoleId, 'qa_lead', 'author flexibly covers QA');

// Order-independent: reversed declaration, same approvers -> still covered.
for (const seq of [['engineering_lead', 'qa_lead'], ['qa_lead', 'engineering_lead']]) {
  assert.strictEqual(
    matchRoleSlots(
      seq,
      M({ engineering_lead: ['example-dual-lead', 'example-eng-lead'], qa_lead: ['example-dual-lead', 'example-qa-lead'] }),
      'example-dual-lead',
      ['example-eng-lead'],
      1,
    ).covered,
    true,
    `order ${seq}`,
  );
}

// No non-author approval -> author covers at most one of two slots -> blocked.
assert.strictEqual(
  matchRoleSlots(
    ['engineering_lead', 'qa_lead'],
    M({ engineering_lead: ['example-dual-lead'], qa_lead: ['example-dual-lead', 'example-qa-lead'] }),
    'example-dual-lead',
    [],
    1,
  ).covered,
  false,
);

// Author qualifies ONLY eng; only an engineer approves -> qa_lead unfillable
// (this is the protection a bare count gate would lack).
const w = matchRoleSlots(
  ['engineering_lead', 'qa_lead'],
  M({ engineering_lead: ['example-dual-lead', 'example-eng-lead'], qa_lead: ['example-qa-lead'] }),
  'example-dual-lead',
  ['example-eng-lead'],
  1,
);
assert.strictEqual(w.covered, false);
assert.deepStrictEqual(w.missingRoleIds, ['qa_lead']);

// Automation author (no author): rrs == slots -> every slot needs a distinct
// non-author.
assert.strictEqual(
  matchRoleSlots(
    ['engineering_lead', 'qa_lead'],
    M({ engineering_lead: ['example-eng-lead', 'example-dual-lead'], qa_lead: ['example-qa-lead', 'example-dual-lead'] }),
    '',
    ['example-eng-lead', 'example-qa-lead'],
    2,
  ).covered,
  true,
);
assert.strictEqual(
  matchRoleSlots(
    ['engineering_lead', 'qa_lead'],
    M({ engineering_lead: ['example-eng-lead'], qa_lead: ['example-qa-lead'] }),
    '',
    ['example-eng-lead'],
    2,
  ).covered,
  false,
);

// Duplicate roles ("QA Lead; QA Lead") need two distinct qa signers.
assert.strictEqual(
  matchRoleSlots(['qa_lead', 'qa_lead'], M({ qa_lead: ['example-dual-lead', 'example-qa-lead'] }), 'example-dual-lead', ['example-qa-lead'], 1).covered,
  true,
);
assert.strictEqual(
  matchRoleSlots(['qa_lead', 'qa_lead'], M({ qa_lead: ['example-dual-lead', 'example-qa-lead'] }), 'example-dual-lead', [], 1).covered,
  false,
);

// rrs == slots -> author ineligible to self-cover even if qualified.
assert.strictEqual(
  matchRoleSlots(['engineering_lead', 'qa_lead'], M({ engineering_lead: ['example-dual-lead'], qa_lead: ['example-dual-lead'] }), 'example-dual-lead', [], 2).covered,
  false,
);

// Defensive: the author appearing in the approver list must NOT let them fill a
// second slot via their own login (only the single AUTHOR_NODE slot). With rrs
// == slots the author is ineligible entirely, so a dual-qualified author who is
// (wrongly) passed in as an approver still cannot cover both slots alone.
assert.strictEqual(
  matchRoleSlots(
    ['engineering_lead', 'qa_lead'],
    M({ engineering_lead: ['example-dual-lead'], qa_lead: ['example-dual-lead'] }),
    'example-dual-lead',
    ['example-dual-lead'],
    2,
  ).covered,
  false,
  'author in approver list must not fill two slots',
);

console.log('role-coverage: all assertions passed');
