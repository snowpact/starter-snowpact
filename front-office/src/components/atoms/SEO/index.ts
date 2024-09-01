import { DefaultSeo } from './DefaultSeo';
import { PageSeo } from './PageSeo';

export const SEO = Object.assign(
  {},
  {
    Default: DefaultSeo,
    Page: PageSeo
  }
);
