import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { TbArrowBack } from 'react-icons/tb';

import { SEO } from '@/components/atoms/SEO';
import { Typography } from '@/components/atoms/Typography';
import { PublicLayout } from '@/components/templates/PublicLayout';
import { defaultSeoValues } from '@/configs/siteSettings';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <PublicLayout>
      <SEO.Page templateTitle="404" defaultMeta={defaultSeoValues} noRobots />

      <div className="flex min-h-full flex-col bg-white lg:relative">
        <div className="flex grow flex-col">
          <div className="mx-auto flex w-full max-w-7xl grow flex-col px-4 sm:px-6 lg:px-8">
            <div className="my-auto shrink-0 py-16 sm:pt-16">
              <Typography variant="h1" weight="extrabold" color="primary">
                404
              </Typography>
              <Typography variant="h1" weight="extrabold" marginClassName="my-5">
                {t('notFoundPage.title')}
              </Typography>

              <Typography variant="paragraph" color="gray">
                {t('notFoundPage.description')}
              </Typography>

              <div className="flex justify-end mt-4">
                <Link href="/" className="flex items-center gap-2 transition duration-300 ease-in-out hover:-translate-x-3">
                  <Typography variant="paragraph">{t('notFoundPage.returnButtonLabel')}</Typography>
                  <TbArrowBack className="md:h-6 md:w-6 h-4 w-4 text-black" />
                </Link>
              </div>
            </div>

            <Image
              height={3000}
              width={3000}
              src="/images/shopbanner.jpg"
              alt="banniere not found"
              className="w-full h-96 relative object-cover"
            />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default NotFound;

export const getStaticProps: GetServerSideProps = async (context) => {
  const translations = await serverSideTranslations(context.locale as string, ['common']);

  return {
    props: {
      ...translations
    }
  };
};
