import { appWithTranslation } from 'next-i18next';

import { FontInitializer } from '@/components/atoms/FontInitializer';

import type { AppProps } from 'next/app';

import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <FontInitializer />
      <Component {...pageProps} />
    </>
  );
};

export default appWithTranslation(App);
