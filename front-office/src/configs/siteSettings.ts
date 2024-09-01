import { DefaultSeoProps } from '@/components/atoms/SEO/DefaultSeo';
import { urlJoin } from '../../utils/url';

export const defaultSeoValues: DefaultSeoProps = {
  title: 'Velox Servi',
  description: '',
  siteName: 'Velox Servi',
  websiteUrl: '',
  shareImage: urlJoin('/images/large-og.webp'),
  robots: 'index, follow',
  sitemapUrl: '/sitemap.xml',
  rssUrl: undefined,
  twitterHandle: undefined,
  keywords: 'velox, wood, table, industrial'
};
