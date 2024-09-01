import Head from 'next/head';
import { useRouter } from 'next/router';

import { DefaultSeoProps } from './DefaultSeo';
import { MetaKeys } from './type';
import { getPathWithoutTrailingSlash } from './utils';

type SeoProps = {
  articleDate?: string;
  articleAuthor?: string;
  title?: string;
  templateTitle?: string;
  description?: string;
  withRobots?: boolean;
  noRobots?: boolean;
  defaultMeta: DefaultSeoProps;
};

export const PageSeo = ({ defaultMeta, ...props }: SeoProps) => {
  const router = useRouter();
  const meta = props;

  // Use siteName if there is templateTitle
  // but show full title if there is none
  meta['title'] = props.templateTitle ? `${props.templateTitle} | ${defaultMeta.siteName}` : meta.title ?? defaultMeta.title;
  meta['description'] = meta.description ?? defaultMeta.description;

  return (
    <Head>
      <title key={MetaKeys.TITLE}>{meta.title}</title>
      <meta key={MetaKeys.DESCRIPTION} content={meta.description} name="description" />
      <meta key={MetaKeys.OG_URL} property="og:url" content={getPathWithoutTrailingSlash(defaultMeta.websiteUrl, router.asPath)} />
      <link key={MetaKeys.CANONICAL} rel="canonical" href={getPathWithoutTrailingSlash(defaultMeta.websiteUrl, router.asPath)} />

      {props.noRobots === true && <meta key={MetaKeys.ROBOTS} name="robots" content="noindex" />}
      {props.withRobots === true && <meta key={MetaKeys.ROBOTS} name="robots" content="index, follow" />}

      {/* Open Graph */}
      <meta key={MetaKeys.OG_DESCRIPTION} property="og:description" content={meta.description} />
      <meta key={MetaKeys.OG_TITLE} property="og:title" content={meta.title} />

      {/* Twitter */}
      <meta key={MetaKeys.TWITTER_TITLE} name="twitter:title" content={meta.title} />
      <meta key={MetaKeys.TWITTER_DESCRIPTION} name="twitter:description" content={meta.description} />

      {/* Article */}
      {meta.articleDate && (
        <>
          <meta key={MetaKeys.ARTICLE_PUBLISHED_TIME} property="article:published_time" content={meta.articleDate} />
          <meta key={MetaKeys.OG_PUBLISH_DATE} name="publish_date" property="og:publish_date" content={meta.articleDate} />
          {meta.articleAuthor && (
            <meta key={MetaKeys.ARTICLE_AUTHOR} name="author" property="article:author" content={meta.articleAuthor} />
          )}
        </>
      )}
    </Head>
  );
};
