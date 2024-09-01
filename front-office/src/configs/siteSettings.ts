import { DefaultSeoProps } from '@/components/atoms/SEO/DefaultSeo';
import { urlJoin } from '@/utils/url';

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

export const contactData = {
  phoneNumber: '0(533) 949 16 13',
  instagramLink: 'https://www.instagram.com/velox.servi/',
  workTime: '8:00 – 18:00',
  contactEmail: 'info@veloxservi.com',
  addressName: 'Velox Servi',
  fabrikaAddress: 'İkitelli Mah. Aykosan San. Sit. 6 lı D blok. No:60 Başakşehir / İstanbul',
  addressLatitude: '41.0722837',
  addressLongitude: '28.7948445'
};
