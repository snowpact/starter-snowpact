import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { MainContainer } from '@/components/atoms/MainContainer';
import { Section } from '@/components/atoms/Section';
import { SEO } from '@/components/atoms/SEO';
import { Typography } from '@/components/atoms/Typography';
import { FeatureCard } from '@/components/molecules/FeatureCard';
import { ImageCarousel } from '@/components/molecules/ImageCarousel';
import { TextCards } from '@/components/molecules/TextCards';
import { PublicLayout } from '@/components/templates/PublicLayout';
import { defaultSeoValues } from '@/configs/siteSettings';

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
        <Section className="mt-24">
          <FeatureCard features={FEATURES_LIST} />
        </Section>

        <Section className="pb-24" title={t('homePage.whoWeAreTitle.title')} description={t('homePage.whoWeAreTitle.subtitle')}>
          <div className="max-w-4xl m-auto">
            <TextCards items={WHO_WE_ARE} />
          </div>
        </Section>
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
