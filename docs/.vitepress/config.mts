import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "guopop documents",
  description: "some documents",
  base: "/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'SwiftData', link: '/swiftData/swiftDataWithICloud' },
      { text: 'Article', link: '/article/幸福的无关.md' },
      { text: 'Book', link: '/book/西西弗神话.md' }
    ],

    sidebar: {
      '/swiftData/': [
        {
          text: 'SwiftData',
          items: [
            { text: 'SwiftData 集成 iCloud', link: '/swiftData/swiftDataWithICloud'}
          ]
        }
      ],
      '/article/': [
        {
          text: 'Article',
          items: [
            { text: '幸福的无关', link: '/article/幸福的无关'},
            { text: '人人想做他们人', link: '/article/人人想做他们人'},
            { text: '罗素：一九二零', link: '/article/罗素：一九二零'},
            { text: '万物从容', link: '/article/万物从容'}
          ]
        }
      ],
      '/Book/': [
        {
          text: 'Book',
          items: [
            { text: '西西弗神话', link: '/book/西西弗神话.md'}
          ]
        }
      ]
    }
  }
})
