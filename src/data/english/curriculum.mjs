import sections from './curriculum.json' with { type: 'json' };
export { sections };
export const lessons = sections.flatMap(section => section.units.flatMap(unit => unit.lessons.map(lesson => ({ ...lesson, section: section.title, sectionSlug: section.slug, unit: unit.title }))));
export const englishSidebar = [
  { label: '英语学习手册', link: '/english/' },
  ...sections.map(section => ({ label: section.title, collapsed: true, items: [
    { label: '章节导读', link: `/english/${section.slug}/` },
    ...section.units.map(unit => ({ label: unit.title, collapsed: true, items: unit.lessons.map(lesson => ({ label: lesson.title.split('：')[0], link: `/english/${lesson.slug}/` })) })),
  ] })),
  { label: '词汇索引与辅助练习', collapsed: true, items: [
    { label: '核心词汇索引', link: '/english/wordbook/' },
    { label: '多方法记忆示范', link: '/english/vocabulary/' },
    { label: '日常对话练习器', link: '/english/daily/' },
    { label: '安全晨会图解', link: '/english/security-standup/' },
    { label: '职场沟通练习', link: '/english/workplace/' },
    { label: '复习卡与备份', link: '/review/' },
  ] },
];
