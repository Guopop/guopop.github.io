import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Guopop",
  description: "Guopop document",
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'MySQL',
        items: [
          { text: '基础', link: '/mysql/mysql_base' },
          { text: '进阶', link: '/mysql/mysql_advance' },
          { text: '运维', link: '/mysql/mysql_ops' }
        ]
      },
      {
        text: '软件工程',
        items: [
          { text: '设计模式之美', link: '/software_engineering/design_pattern' },
        ]
      }
    ],

    sidebar: {
      '/mysql/': [
        {
          text: 'MySQL',
          items: [
            { text: '基础', link: '/mysql/mysql_base' },
            { text: '进阶', link: '/mysql/mysql_advance' },
            { text: '运维', link: '/mysql/mysql_ops' }
          ]
        },
      ],
      '/software_engineering/': [
        {
          text: '软件工程',
          items: [
            { text: '设计模式之美', link: '/software_engineering/design_pattern' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/guopop' }
    ],

    footer: {
      copyright: 'Copyright © 2024-present Guopop',
      message: 'Released under the MIT License.',
    }
  }
})
