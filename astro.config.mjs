import { defineConfig } from 'astro/config';
import { readdirSync } from 'node:fs';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://luohaijiang789.github.io',
  redirects: Object.fromEntries([
    ['/foundations/http/', '/notes/http/'],
    ['/foundations/software-delivery/', '/notes/software-delivery/'],
    ['/security/tool-boundaries/', '/notes/tool-boundaries/'],
    ['/projects/tool-guard/', '/notes/tool-guard/'],
    ['/thinking/evidence/', '/notes/evidence/'],
    ['/design/visual-explanation/', '/notes/visual-explanation/'],
    ['/global/job-research/', '/notes/job-research/'],
    ['/foundations/', '/'],
    ['/security/', '/'],
    ['/thinking/', '/'],
    ['/design/', '/'],
    ['/global/', '/'],
    ['/projects/', '/'],
    ['/paths/first-project/', '/'],
    ['/review/', '/about/#historical-data'],

    ...readdirSync(new URL('./archive/legacy-jekyll/_posts/', import.meta.url)).filter(name => name.endsWith('.md')).map(name => [`/posts/${name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '')}/`, '/archive/']),
    ...['categories', 'tags', 'archives'].map(name => [`/${name}/`, '/archive/']),
  ]),
  trailingSlash: 'always',
  integrations: [starlight({
    title: '海江的笔记',
    disable404Route: true,
    description: '计算机基础、AI 安全与可复现实验的个人技术笔记。',
    defaultLocale: 'root',
    locales: { root: { label: '简体中文', lang: 'zh-CN' } },
    favicon: '/favicon.svg',
    social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/luohaijiang789' }],
    customCss: ['./src/styles/global.css'],
    components: { ThemeProvider: './src/components/ThemeProvider.astro', ThemeSelect: './src/components/ThemeSelect.astro' },
    sidebar: [
      { label: '全部笔记', link: '/' },
      { label: '笔记目录', items: [{ autogenerate: { directory: 'notes' } }] },
      { label: '关于与数据备份', link: '/about/' },
    ],
    pagination: false,
  })],
});
