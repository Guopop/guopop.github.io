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
      { text: 'Article', link: '/article/幸福的无关' },
      { text: 'Book', link: '/book/西西弗神话' },
      { text: 'Tech', link: '/tech/swiftZeroToOne' },
    ],

    sidebar: {
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
      '/book/': [
        {
          text: 'Book',
          items: [
            { text: '西西弗神话', link: '/book/西西弗神话'}
          ]
        }
      ],
      '/tech/': [
        {
          text: 'Tech',
          items: [
            { text: 'Apple Develop', link: '/tech/AppleDevelop'},
            { text: 'SwiftData 注意事项', link: '/tech/SwiftDataNotice'},
            { text: 'SwiftData 集成 CloudKit', link: '/tech/SwiftDataWithCloudKit'},
            { text: 'SwiftUI + SwiftData 项目骨架', link: '/tech/SwiftUISwiftDataArchitecture'},
          ]
        }
      ]
    }
  }
})
