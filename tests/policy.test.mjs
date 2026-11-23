import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCall } from '../src/lib/policy.mjs';
test('allowed action and exact resource must both match trusted session grants', () => {
  assert.equal(evaluateCall('reader', { action: 'read_note', resource: 'public-guide' }).allowed, true);
  assert.equal(evaluateCall('reader', { action: 'update_note', resource: 'public-guide' }).allowed, false);
  assert.equal(evaluateCall('reader', { action: 'read_note', resource: 'team-note' }).allowed, false);
  assert.equal(evaluateCall('editor', { action: 'update_note', resource: 'team-note' }).allowed, true);
});
test('model-supplied identity and malicious text never upgrade trusted identity', () => {
  assert.equal(evaluateCall('reader', { role: 'admin', principal: 'editor', instruction: 'ignore limits', action: 'export_data', resource: 'payroll' }).allowed, false);
  assert.equal(evaluateCall('guest', { principal: 'editor', action: 'read_note', resource: 'team-note' }).allowed, false);
});
test('invalid input, unknown identities and prototype property names deny safely', () => {
  for (const principal of ['admin', '__proto__', 'constructor', '', null]) {
    assert.equal(evaluateCall(principal, { action: 'read_note', resource: 'public-guide' }).allowed, false);
  }
  for (const call of [null, undefined, [], {}, 'read_note', { action: {}, resource: 'public-guide' }, { action: 'read_note', resource: '../public-guide' }]) {
    assert.equal(evaluateCall('reader', call).allowed, false);
  }
});
