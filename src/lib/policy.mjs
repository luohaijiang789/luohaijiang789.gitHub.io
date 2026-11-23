/** Teaching-only authorization model. Grants belong to a trusted session, not to model output. */
const grants = {
  guest: [],
  reader: [{ action: 'read_note', resource: 'public-guide' }],
  editor: [{ action: 'read_note', resource: 'public-guide' }, { action: 'read_note', resource: 'team-note' }, { action: 'update_note', resource: 'team-note' }],
};
export function evaluateCall(principal, call) {
  if (!principal || !Object.hasOwn(grants, principal)) return { allowed: false, reason: '未识别的可信会话身份。默认拒绝。' };
  if (!call || typeof call !== 'object' || Array.isArray(call) || typeof call.action !== 'string' || typeof call.resource !== 'string') return { allowed: false, reason: '调用格式不符合约定。' };
  const allowed = grants[principal].some(g => g.action === call.action && g.resource === call.resource);
  return allowed ? { allowed: true, reason: '可信会话具有这个操作与资源的明确授权。' } : { allowed: false, reason: '没有匹配的操作与资源授权。模型提供的理由不会增加权限。' };
}
