import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'TianGong LCA Data System',
  tagline: 'Open Source & AI Powered',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://tidas.tiangong.earth',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'TianGong LCA', // Usually your GitHub org/user name.
  projectName: 'tidas', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en', 'ja'],

  },
  
  themes: ["docusaurus-json-schema-plugin"],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/tiangong-lca/tidas/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/tiangong-lca/tidas/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'TianGong LCA',
      logo: {
        alt: 'TianGong LCA Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/tiangong-lca/tidas',
          className: 'header-github-link',
          position: 'right',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          // dropdownItemsAfter: [{to: '/versions', label: 'All versions'}],
          dropdownActiveClassDisabled: true,
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Open Source',
          items: [
            {
              label: 'TianGong LCA GitHub',
              href: 'https://github.com/tiangong-lca',
            },
            {
              label: 'TianGong LCA Platform',
              href: 'https://lca.tiangong.earth/',
            },
            {
              label: 'TianGong LCA Platform Docs',
              href: 'https://docs.tiangong.earth/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'LinkedIn',
              href: 'http://linkedin.com/company/tiangonglca',
            },
            {
              label: 'TianGong Initiative',
              href: 'https://www.tiangong.earth/',
            },
          ],
        },
        {
          title: 'Technical Support',
          items: [
            {
              label: 'Carbon Footprint Industry Alliance',
              href: 'https://www.carbonfootprint.network/',
            },
            {
              label: 'TianGong Think Tank',
              href: 'http://www.tsinghua-riet.com/page/aicenter2/index.php/',
            },
            {
              label: 'HiQLCD',
              href: 'https://www.hiqlcd.com/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} TianGong LCA. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      // The application ID provided by Algolia
      appId: 'LUUPJIAL12',

      // Public API key: it is safe to commit it
      apiKey: 'd3c06654d99e1cca92a36a1feb65137b',

      indexName: 'tidas-tiangong',

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      // externalUrlRegex: 'external\\.com|domain\\.com',

      // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      // replaceSearchResultPathname: {
      //   from: '/docs/', // or as RegExp: /\/docs\//
      //   to: '/',
      // },

      // Optional: Algolia search parameters
      // searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      // searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: true,

      //... other Algolia params
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
