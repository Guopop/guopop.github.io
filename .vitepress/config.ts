import { defineConfig } from 'vitepress';
import { usePosts } from '../src/composables/usePosts';
import type { ThemeConfig } from '../src/types';

const { posts, rewrites } = await usePosts({
  pageSize: 6,
  homepage: true,
  srcDir: 'posts',
  autoExcerpt: 150
});

export default defineConfig<ThemeConfig>({
  title: 'guopop',
  rss: {
    title: '我的博客',
    baseUrl: 'https://guopop.github.io',
    description: '技术分享与学习笔记',
    copyright: 'Copyright © 2023',
    language: 'zh-CN',
    author: {
      name: '你的名字',
      email: 'your-email@example.com',
      link: 'https://guopop.github.io'
    },

    // 可选：自定义输出路径
    output: {
      atom: {
        enabled: true,
        path: '/feed.xml'  // 默认路径
      },
      json: {
        enabled: false
      }
    },

    // 可选：自定义排序
    sort: (a, b) => +new Date(b.frontmatter.datetime) - +new Date(a.frontmatter.datetime)
  },
  rewrites,
  cleanUrls: true,
  ignoreDeadLinks: true,
  lastUpdated: true,
  themeConfig: {
    posts,
    page: {
      max: 5
    },
    outline: { level: 2 },
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/docs/doc1' },
      { text: '分类', link: '/category' },
      { text: '归档', link: '/archives' }
    ],
    sidebar: {
      '/docs': [
        {
          text: '如何使用电饭煲',
          items: [
            { text: '选择合适的电饭煲', link: '/docs/doc1' },
            { text: '煮出松软米饭的技巧', link: '/docs/doc2' },
            { text: '电饭煲的多功能用途', link: '/docs/doc3' },
            { text: '电饭煲的清洁与保养', link: '/docs/doc4' },
            { text: '电饭煲常见问题处理', link: '/docs/doc5' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'rss', link: '/feed.xml' }
    ]
  }
});
