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
      { text: 'SwiftData', link: '/swiftData/swiftDataWithICloud' }
    ],

    sidebar: {
      '/swiftData/': [
        {
          text: 'SwiftData',
          items: [
            { text: 'SwiftData 集成 iCloud', link: '/swiftData/swiftDataWithICloud'}
          ]
        }
      ]
    }
  }
})
