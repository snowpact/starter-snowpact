import { FontInitializer } from '@/components/atoms/FontInitializer';
import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <FontInitializer />
      <Component {...pageProps} />
    </>
  );
};

export default appWithTranslation(App);
