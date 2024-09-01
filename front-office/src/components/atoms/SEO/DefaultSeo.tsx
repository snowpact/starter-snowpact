import Head from 'next/head';

import { MetaKeys } from './type';

export type DefaultSeoProps = {
  title: string;
  description: string;
  shareImage: string;
  websiteUrl: string;
  siteName: string;
  robots?: string;
  twitterHandle?: string;
  rssUrl?: string;
  sitemapUrl?: string;
  keywords?: string;
};

/**
 * PLEASE first can generate your own from https://realfavicongenerator.net/ then replace the whole /public/favicon folder and favicon.ico
 * @param {
 * title: string;
 * description: string;
 * shareImage: string;
 * websiteUrl: string; Without additional '/' on the end, e.g. https://google.com
 * robots: string;
 * siteName: string;
 * twitterHandle?: string;
 * }
 * @returns
 */
export const DefaultSeo = ({
  title,
  robots,
  description,
  websiteUrl,
  siteName,
  shareImage,
  twitterHandle,
  sitemapUrl,
  rssUrl,
  keywords
}: DefaultSeoProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta key={MetaKeys.ROBOTS} name="robots" content={robots ?? 'index, follow'} />
      <meta key={MetaKeys.DESCRIPTION} content={description} name="description" />
      <link key={MetaKeys.CANONICAL} rel="canonical" href={websiteUrl} />
      {keywords && <meta key={MetaKeys.KEYWORDS} content={keywords} name="keywords" />}

      {/* Open Graph */}
      <meta key={MetaKeys.OG_URL} property="og:url" content={websiteUrl} />
      <meta key={MetaKeys.OG_TYPE} property="og:type" content="Website" />
      <meta key={MetaKeys.OG_SITE_NAME} property="og:site_name" content={siteName} />
      <meta key={MetaKeys.OG_DESCRIPTION} property="og:description" content={description} />
      <meta key={MetaKeys.OG_TITLE} property="og:title" content={title} />
      <meta key={MetaKeys.OG_IMAGE} name="image" property="og:image" content={shareImage} />

      {/* Twitter */}
      <meta key={MetaKeys.TWITTER_CARD} name="twitter:card" content="summary_large_image" />
      {twitterHandle && <meta key={MetaKeys.TWITTER_SITE} name="twitter:site" content={twitterHandle} />}
      <meta key={MetaKeys.TWITTER_TITLE} name="twitter:title" content={title} />
      <meta key={MetaKeys.TWITTER_DESCRIPTION} name="twitter:description" content={description} />
      <meta key={MetaKeys.TWITTER_IMAGE} name="twitter:image" content={shareImage} />

      {/* Favicons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
      <link rel="mask-icon" href="/favicon//safari-pinned-tab.svg" color="#5bbad5" />
      <link rel="shortcut icon" href="/favicon.ico" />

      {/* Microsoft */}
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#ffffff" />

      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />

      {/* Sitemap & RSS */}
      {rssUrl && <link rel="alternate" type="application/rss+xml" title={`RSS Feed for ${siteName}`} href={rssUrl} />}
      {sitemapUrl && <link rel="sitemap" type="application/xml" title="Sitemap" href={sitemapUrl} />}

      {/* Responsive */}
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
    </Head>
  );
};
