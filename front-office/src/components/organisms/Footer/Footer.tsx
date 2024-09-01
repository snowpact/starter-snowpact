import { PiInstagramLogoBold } from 'react-icons/pi';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { CONTACT_DATA } from '@/configs/contactData';
import { Typography } from '@/components/atoms/Typography';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-white border-t border-gray-200 px-8 md:px-16">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex flex-col items-start gap-5">
              <Image src="/images/velox.png" alt="Logo de Velox" width={158} height={40} />
            </Link>
            <div className="max-w-sm mt-5 ml-2">
              <Typography variant="h3">{CONTACT_DATA.addressName}</Typography>
              <Typography variant="h4" weight="semibold" color="gray" marginClassName="mt-3">
                {CONTACT_DATA.fabrikaAddress}
              </Typography>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase ">{t('footer.links')}</h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-4">
                  <Link href="/product" className="hover:underline">
                    {t('footer.products')}
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/about" className="hover:underline">
                    {t('footer.about')}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline">
                    {t('footer.contact')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase "> {t('footer.legal')}</h2>
              <ul className="text-gray-500  font-medium">
                <li className="mb-4">
                  <Link href="#" className="hover:underline">
                    {t('footer.privacyPolicy')}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    {t('footer.termsConditions')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto  lg:my-8" />
        <div className="flex md:flex-row flex-col gap-5 items-center sm:justify-between">
          <span className="text-sm text-gray-500 text-center">
            © 2024{' '}
            <Link href="https://snowpact.com/" className="hover:underline">
              Snowpact
            </Link>
            . {t('footer.allRights')}.
          </span>
          <div className="flex gap-10 items-center justify-center">
            <LanguageSwitcher />
            <Link target="_blank" href={CONTACT_DATA.instagramLink} className="text-gray-500 hover:cursor-pointer hover:text-gray-900">
              <PiInstagramLogoBold className="text-2xl" />
              <span className="sr-only">Instagram page</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
