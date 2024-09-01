import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { PiInstagramLogoBold } from 'react-icons/pi';
import { TbClockFilled } from 'react-icons/tb';
import { TbMapPinFilled } from 'react-icons/tb';
import { TbPhoneFilled } from 'react-icons/tb';

import { MainContainer } from '@/components/atoms/MainContainer';
import { SEO } from '@/components/atoms/SEO';
import { Typography } from '@/components/atoms/Typography';
import { ContactForm } from '@/components/molecules/ContactForm';
import { ContactInfo } from '@/components/molecules/ContactInfo';
import { HeroBanner } from '@/components/molecules/HeroBanner';
import { DynamicLeafletMap } from '@/components/molecules/LeafletMap/DynamicLeafletMap';
import { PublicLayout } from '@/components/templates/PublicLayout';
import { contactData, defaultSeoValues } from '@/configs/siteSettings';

export default function Contact() {
  const { t } = useTranslation();
  return (
    <PublicLayout>
      <SEO.Page templateTitle={t('seo.contactPage.title')} defaultMeta={defaultSeoValues} description={t('seo.contactPage.description')} />

      <MainContainer>
        <HeroBanner title={t('contactPage.title')} />
        <section className="grid md:grid-cols-2 grid-cols-1 pt-20">
          <div className="flex flex-col gap-10">
            <ContactInfo
              title={t('contactPage.phone')}
              description={t('contactPage.mobile') + ' : ' + contactData.phoneNumber}
              icon={<TbPhoneFilled className="text-3xl text-black" />}
            />
            <ContactInfo
              title={t('contactPage.workTime')}
              description={t('contactPage.workDays') + contactData.workTime}
              icon={<TbClockFilled className="text-3xl text-black" />}
            />

            <Link target="_blank" href={contactData.instagramLink} className="items-center flex gap-2">
              <PiInstagramLogoBold className="text-3xl text-black" />
              <Typography color="gray">Instagram Velox Servi</Typography>
              <HiOutlineExternalLink className="text-gray-600 text-xl" />
            </Link>
          </div>
          <ContactForm />
        </section>

        <section className=" gap-10 pb-20">
          <div className="flex flex-col gap-4">
            <ContactInfo
              title={contactData.addressName}
              description={contactData.fabrikaAddress}
              icon={<TbMapPinFilled className="text-3xl text-black" />}
            />
            <div className="w-full h-64">
              <DynamicLeafletMap
                height="100%"
                width="100%"
                initialCenter={{
                  latitude: contactData.addressLatitude,
                  longitude: contactData.addressLongitude
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
