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
      { text: 'Article', link: '/article/幸福的无关.md' }
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
            { text: '幸福的无关', link: '/article/幸福的无关'}
          ]
        }
      ]
    }
  }
})
