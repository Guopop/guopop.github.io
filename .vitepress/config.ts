import { defineConfig } from 'vitepress';
import { usePosts } from '../src/composables/usePosts';
import type { ThemeConfig } from '../src/types';
import { RSSOptions, RssPlugin } from 'vitepress-plugin-rss'

const baseUrl = 'https://guopop.github.io'
const RSS: RSSOptions = {
  title: 'guopop',
  baseUrl,
  copyright: 'Copyright (c) 2018-present, guopop',
  author: {
    name: 'guopop',
    email: 'guopopsolo@163.com',
    link: 'https://guopop.github.io'
  },
  icon: true
}


const { posts, rewrites } = await usePosts({
  pageSize: 6,
  homepage: true,
  srcDir: 'posts',
  autoExcerpt: 150,
  prev: false,
  next: false
});

export default defineConfig<ThemeConfig>({
  title: 'guopop',
  rewrites,
  cleanUrls: true,
  ignoreDeadLinks: true,
  lastUpdated: true,
  themeConfig: {
    posts,
    page: {
      max: 5
    },
    outline: false,
    nav: [
      { text: '首页', link: '/' },
      { text: '分类', link: '/category' },
      { text: '归档', link: '/archives' }
    ]
  },
  vite: {
    plugins: [RssPlugin(RSS)]
  }
});
