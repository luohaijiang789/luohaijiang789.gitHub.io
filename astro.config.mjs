import { defineConfig } from 'astro/config';
import { readdirSync } from 'node:fs';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://luohaijiang789.github.io',
  redirects: Object.fromEntries([
    ...readdirSync(new URL('./archive/legacy-jekyll/_posts/', import.meta.url)).filter(name => name.endsWith('.md')).map(name => [`/posts/${name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '')}/`, '/archive/']),
    ...['categories', 'tags', 'archives'].map(name => [`/${name}/`, '/archive/']),
  ]),
  trailingSlash: 'always',
  integrations: [starlight({
    title: '海江 · Learning Lab',
    disable404Route: true,
    description: 'AI 与安全、英语与沟通，以及走向海外工作的持续学习实验室。',
    defaultLocale: 'root',
    locales: { root: { label: '简体中文', lang: 'zh-CN' } },
    favicon: '/favicon.svg',
    social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/luohaijiang789' }],
    customCss: ['./src/styles/global.css'],
    components: { Hero: './src/components/Hero.astro', ThemeProvider: './src/components/ThemeProvider.astro', ThemeSelect: './src/components/ThemeSelect.astro' },
    sidebar: [
      { label: '学习工作台', link: '/' },
      { label: '学习路径', items: [{ label: '从第一个项目开始', link: '/paths/first-project/' }, { label: '复习与学习记录', link: '/review/' }] },
      { label: '专业基础', items: [{ autogenerate: { directory: 'foundations' } }] },
      { label: 'AI × 安全', items: [{ autogenerate: { directory: 'security' } }] },
      { label: '英语与沟通', items: [
        { label: '英语训练站', link: '/english/' },
        { label: '词汇记忆实验室', link: '/english/vocabulary/' },
        { label: '日常英语场景', link: '/english/daily/' },
        { label: '职场与专业沟通', items: [{ label: '职场沟通路线', link: '/english/workplace/' }, { label: '图解安全晨会', link: '/english/security-standup/' }] },
        { label: '听力与口语', link: '/english/listening-speaking/' },
        { label: '阅读与写作', link: '/english/reading-writing/' },
        { label: '方法与学习记录', link: '/english/methods/' },
      ] },
      { label: '思维与表达', items: [{ autogenerate: { directory: 'thinking' } }] },
      { label: '审美与创作', items: [{ autogenerate: { directory: 'design' } }] },
      { label: '海外与职业', items: [{ autogenerate: { directory: 'global' } }] },
      { label: '项目实验室', items: [{ autogenerate: { directory: 'projects' } }] },
    ],
    pagination: false,
  })],
});
