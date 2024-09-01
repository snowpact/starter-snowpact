import { useTranslation } from 'next-i18next';

import { SEO } from '@/components/atoms/SEO';
import { Typography } from '@/components/atoms/Typography';
import { FeatureCard } from '@/components/molecules/FeatureCard';
import { TextBlock } from '@/components/molecules/TextBlock';
import PublicLayout from '@/components/templates/PublicLayout/PublicLayout';
import { defaultSeoValues } from '@/configs/siteSettings';
import { MainContainer } from '@/components/organisms/MainContainer';
import { TextCards } from '@/components/molecules/TextCards';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ImageCarousel } from '@/components/molecules/ImageCarousel';

import header1 from '../../public/images/header1.webp';
import header2 from '../../public/images/header2.webp';
import header3 from '../../public/images/header3.webp';

const IMAGES_DATA = [header1, header2, header3];

export default function Home() {
  const { t } = useTranslation();

  const handleClickScroll = () => {
    const element = document.getElementById('section-a-aller');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const WHO_WE_ARE = [
    {
      title: t('homePage.blockText.1.title'),
      description: t('homePage.blockText.1.description')
    },
    {
      title: t('homePage.blockText.2.title'),
      description: t('homePage.blockText.2.description')
    }
  ];

  const FEATURES_LIST = [
    {
      name: t('homePage.featureBlock.1.title'),
      description: t('homePage.blockText.3.description'),
      imageSrc: header3
    }
  ];

  return (
    <PublicLayout>
      <SEO.Page templateTitle={t('seo.homePage.title')} defaultMeta={defaultSeoValues} description={t('seo.homePage.description')} />

      <div onClick={handleClickScroll} className="w-full ">
        <div className="flex md:gap-5 w-full md:flex-row flex-col justify-center mt-32 md:my-20 ">
          <Typography variant="heroTitleXL" align="center">
            {t('homePage.firstBlock')}
          </Typography>
          <Typography variant="heroTitleXL" align="center" color="gold">
            {t('homePage.secondBlock')}
          </Typography>
        </div>
        <ImageCarousel images={IMAGES_DATA} />
      </div>

      <MainContainer>
        <section className="mt-24">
          <FeatureCard features={FEATURES_LIST} />
        </section>

        <section className="mb-24 flex flex-col mx-auto">
          <TextBlock title={t('homePage.whoWeAreTitle.title')} description={t('homePage.whoWeAreTitle.subtitle')} />
          <div className="max-w-4xl m-auto">
            <TextCards items={WHO_WE_ARE} />
          </div>
        </section>
      </MainContainer>
    </PublicLayout>
  );
}

export const getStaticProps: GetServerSideProps = async (context) => {
  const translations = await serverSideTranslations(context.locale as string, ['common']);

  return {
    props: {
      ...translations
    }
  };
};
