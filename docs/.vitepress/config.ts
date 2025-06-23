import { defineConfig } from 'vitepress';
import { SearchPlugin } from 'vitepress-plugin-search';

export default defineConfig({
  title: 'Kushal Niroula',
  description: 'Full Stack Developer | Tech Enthusiast',
  /* prettier-ignore */
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/kushal.jpg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Kushal Niroula' }],
    ['meta', { property: 'og:site_name', content: 'Kushal Niroula' }],
    ['meta', { property: 'og:image', content: 'https://kusalniroula.com.np/kushal.jpg' }],
    ['meta', { property: 'og:url', content: 'https://kusalniroula.com.np/' }]
  ],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'Projects', link: '/projects' },
      { text: 'Blog', link: '/blog/' },
    ],

    sidebar: {
      '/blog/': [
        {
          text: 'Blog',
          items: [
            { text: 'All Posts', link: '/blog/' },
            { text: 'My First Post', link: '/blog/first-post' },
            {
              text: 'C#',
              collapsed: false,
              items: [
                {
                  text: 'Using enums as Flags in C#',
                  link: '/blog/enum-as-flag',
                },
                {
                  text: 'Ef Core Left Join Simplified',
                  link: '/blog/ef-core-left-join-simplified-with-nullable-property',
                },
                {
                  text: 'Using Refit to consume APIs',
                  link: '/blog/using-refit',
                },
              ],
            },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/niroula-kushal' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/kushalniroula/' },
    ],
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.includes('github-projects'),
      },
    },
  },
  vite: { plugins: [SearchPlugin({})] },
  cleanUrls: true
});
