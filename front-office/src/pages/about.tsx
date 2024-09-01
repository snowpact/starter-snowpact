import React from 'react';
import { PublicLayout } from '@/components/templates/PublicLayout';
import { ContactInfo } from '@/components/molecules/ContactInfo';
import { TbMapPinFilled } from 'react-icons/tb';
import { DynamicLeafletMap } from '@/components/molecules/LeafletMap/DynamicLeafletMap';
import { HeroBanner } from '@/components/molecules/HeroBanner';
import { SEO } from '@/components/atoms/SEO';
import { useTranslation } from 'next-i18next';
import { defaultSeoValues } from '@/configs/siteSettings';
import { MainContainer } from '@/components/atoms/MainContainer';
import { GetServerSideProps } from 'next';
import { CONTACT_DATA } from '@/configs/contactData';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Typography } from '@/components/atoms/Typography';
import Image from 'next/image';

import velox from '../../public/images/velox.png';

export default function About() {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <SEO.Page templateTitle={t('seo.aboutPage.title')} defaultMeta={defaultSeoValues} description={t('seo.aboutPage.description')} />

      <MainContainer>
        <HeroBanner title={t('aboutPage.title')} />

        <section className="max-w-2xl m-auto">
          <Image width={100} height={70} src={velox} alt="velox logo" className="w-2/5 m-auto mt-10 mb-12" />
          <Typography variant="h4" align="center">
            {t('aboutPage.text1')}
          </Typography>
          <div className="w-1/4 m-auto my-10 h-0.5 bg-black" />
          <Typography variant="h4" align="center">
            {t('aboutPage.text2')}
          </Typography>
          <Typography variant="h4" align="center" marginClassName="mt-10">
            {t('aboutPage.text3')}
          </Typography>

          <Typography variant="h4" align="center" marginClassName="mt-10">
            {t('aboutPage.text4')}
          </Typography>
        </section>
        <section className=" gap-10 pb-20 mt-44">
          <div className="flex flex-col gap-4">
            <ContactInfo
              title={CONTACT_DATA.addressName}
              description={CONTACT_DATA.fabrikaAddress}
              icon={<TbMapPinFilled className="text-3xl text-black" />}
            />
            <div className="w-full h-64">
              <DynamicLeafletMap
                height="100%"
                width="100%"
                initialCenter={{
                  latitude: CONTACT_DATA.addressLatitude,
                  longitude: CONTACT_DATA.addressLongitude
                }}
                defaultZoom={15}
                maxZoom={25}
                minZoom={2}
              />
            </div>
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
