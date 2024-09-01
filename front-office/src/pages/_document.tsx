import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
export const getStaticProps = async ({ params }: any) => {
  return {
    props: {}
  };
};
