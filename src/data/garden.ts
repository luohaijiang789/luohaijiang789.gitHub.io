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
export { reviewCards } from './english/review-cards.mjs';
