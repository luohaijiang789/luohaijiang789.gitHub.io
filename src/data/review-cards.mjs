export const reviewTopics = [
  { id: 'all', label: '全部专题' },
  { id: 'foundations', label: '工程基础' },
  { id: 'security', label: 'AI 安全' },
  { id: 'research', label: '证据与复盘' },
];
export const reviewCards = [
  { id: 'tech-permission', topic: 'security', kind: '安全 · 授权', cue: '登录成功，是否就能读取所有资源？', answer: '不能。身份认证确认是谁；授权判断该身份能对指定资源执行哪些操作。', note: '授权检查需要绑定可信会话、操作与资源，不能只检查是否登录。' },
  { id: 'tech-delivery', topic: 'foundations', kind: '工程 · 安装与运行', cue: 'git clone、npm ci 和 docker run 分别做什么？', answer: '获取仓库；按锁文件安装项目依赖；从镜像创建并运行容器。它们可以组合使用。', note: '获取源码不等于完成安装；依赖隔离不等于运行时安全隔离。' },
  { id: 'tech-deny-default', topic: 'security', kind: '安全 · 默认拒绝', cue: '模型在参数中声称自己是管理员，执行层应相信吗？', answer: '不应相信。权限来自可信身份与授权策略，不来自模型输出或外部文档。未明确允许的调用默认拒绝。', note: '授权之后仍需考虑参数校验、资源映射和执行时的状态变化。' },
  { id: 'tech-isolation', topic: 'foundations', kind: '工程 · 隔离边界', cue: 'Python 虚拟环境能阻止恶意包读取本机文件吗？', answer: '不能。虚拟环境主要隔离 Python 包依赖，不是安全沙箱。程序通常仍以当前用户的权限执行。', note: '容器提供另一组隔离机制，实际安全边界仍取决于权限、挂载、内核和配置。' },
  { id: 'tech-evidence', topic: 'research', kind: '复盘 · 证据', cue: '一组权限测试全部通过，可以证明系统安全吗？', answer: '只能支持这些输入与条件下的观察，不能证明未测试路径或整个系统安全。', note: '记录前提、输入、预期、实际结果、反例以及尚未覆盖的风险。' },
  { id: 'tech-reproduce', topic: 'research', kind: '复盘 · 可复现', cue: '技术实验除了截图，还需要记录什么？', answer: '代码版本、运行环境、依赖与配置、操作命令、输入输出和结论范围。', note: '截图辅助理解，复现步骤与原始结果才让别人能够检验结论。' },
];
export function selectReviewCards(cards, topic = 'all', focusId = '') {
  const filtered = cards.filter(card => topic === 'all' || card.topic === topic);
  const focus = filtered.find(card => card.id === focusId);
  return focus ? [focus, ...filtered.filter(card => card.id !== focusId)] : filtered;
}
