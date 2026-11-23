export const domains = [
  { id: 'foundations', icon: 'layers', label: '专业基础', en: 'Foundations', description: '理解系统怎样运作，让每一次排错都有依据。', topics: '网络 · Linux · 编程 · 工程', href: '/foundations/', color: 'blue' },
  { id: 'security', icon: 'shield', label: 'AI × 安全', en: 'AI & Security', description: '看清信任边界，把安全判断变成可验证的实验。', topics: '智能体 · 威胁建模 · 防御', href: '/security/', color: 'green' },
  { id: 'english', icon: 'conversation', label: '英语与沟通', en: 'Language & Connection', description: '在真实场景中理解、记住，然后说出自己的想法。', topics: '图像记忆 · 场景表达 · 词族', href: '/english/', color: 'orange' },
  { id: 'thinking', icon: 'spark', label: '思维与表达', en: 'Thinking & Clarity', description: '提出好问题，用证据思考，把复杂的事情讲清楚。', topics: '逻辑 · 判断 · 沟通 · 复盘', href: '/thinking/', color: 'purple' },
  { id: 'design', icon: 'aperture', label: '审美与创作', en: 'Taste & Creation', description: '观察好的设计，也亲手做出清晰、得体的作品。', topics: '排版 · 图解 · 视觉叙事', href: '/design/', color: 'rose' },
  { id: 'global', icon: 'globe', label: '海外与职业', en: 'Work & World', description: '从岗位要求出发，一步步准备走向更大的世界。', topics: '职业研究 · 简历 · 面试 · 生活', href: '/global/', color: 'teal' },
] as const;
export const pathSteps = [
  { id: 'http', title: '看懂一次请求', detail: '画出客户端、服务器与权限检查。', href: '/foundations/http/' },
  { id: 'boundary', title: '找到信任边界', detail: '分清模型建议与真正的授权。', href: '/security/tool-boundaries/' },
  { id: 'explain', title: '用英语讲清风险', detail: '看场景图、练表达，再脱稿复述。', href: '/english/security-standup/' },
  { id: 'project', title: '交付一个小实验', detail: '完成测试、结论与英文项目介绍。', href: '/projects/tool-guard/' },
];
export const reviewCards = [
  { id: 'permission', kind: '英语 · 场景表达', cue: '同事问：为什么这个工具调用被拒绝？请用英文说明权限不足，并提出下一步。', answer: 'The agent does not have permission to access this file. Let’s check the access policy first.', note: '搭配：have permission to do something。把 file 换成 resource，再说一次。', speech: 'The agent does not have permission to access this file. Let us check the access policy first.' },
  { id: 'clarify', kind: '沟通 · 澄清问题', cue: '会议里你没听懂“access”指什么。怎样礼貌地要求对方说具体一点？', answer: 'Could you clarify what you mean by “access” here?', note: '先确认含义，再讨论方案。换成 “safe” 或 “ready” 继续练习。', speech: 'Could you clarify what you mean by access here?' },
  { id: 'authorize', kind: '英语 · 词族辨析', cue: 'authenticate 和 authorize 分别回答什么问题？各用一个短句解释。', answer: 'Authenticate: verify who you are. Authorize: decide what you are allowed to do.', note: '记住问题比记住中文翻译更实用。前者核验身份，后者决定操作权限；它们不是同一词根。', speech: 'Authenticate: verify who you are. Authorize: decide what you are allowed to do.' },
  { id: 'deny-default', kind: '安全 · 主动回忆', cue: '一个工具名合法，是否就意味着调用安全？你还需要检查什么？', answer: '还要检查调用者身份、操作、资源、参数范围和上下文授权。没有明确授权时，默认拒绝。', note: '模型输出只是输入之一。权限决定由独立的执行层完成。', speech: '' },
  { id: 'evidence', kind: '思维 · 证据与结论', cue: '“这个请求被拦截了，所以系统完全安全。”这个推理缺了什么？', answer: '单个通过的测试不能覆盖全部风险。需要说明威胁模型、测试范围、未覆盖情况和剩余风险。', note: '试着用英文补充：This test passed, but it does not cover every attack path.', speech: 'This test passed, but it does not cover every attack path.' },
  { id: 'project-intro', kind: '职业 · 项目介绍', cue: '用三句话介绍你的工具权限实验：问题、行动、验证。', answer: 'I built a small policy gate for agent tool calls. It checks the action and resource before execution. I tested both allowed and denied requests.', note: '这是练习模板。真正求职时，替换成你实际完成的工作和测试结果。', speech: 'I built a small policy gate for agent tool calls. It checks the action and resource before execution. I tested both allowed and denied requests.' },
] as const;
