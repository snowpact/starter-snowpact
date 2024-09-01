import { Typography } from '@/components/atoms/Typography';
import clsx from 'clsx';
import { Navbar as FlowbiteNavbar } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { TbAlignCenter, TbAlignRight, TbChevronUp } from 'react-icons/tb';
import { useRouter } from 'next/router';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { SubNavbar } from './SubNavbar';

export const Navbar = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState<boolean>(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState<boolean>(false);

  const handleMainDropdown = () => {
    setIsMainDropdownOpen(!isMainDropdownOpen);
  };

  const handleShopDropdown = () => {
    setIsShopDropdownOpen(!isShopDropdownOpen);
  };

  const isActive = (path: string) => router.pathname === path;

  return (
    <FlowbiteNavbar fluid className="fixed w-full z-[20000] shadow-md">
      <div className="flex items-center justify-between w-full">
        {/* Logo pour les mobiles */}
        <Link href="/" className="md:hidden flex-shrink-0">
          <Image src="/images/velox.png" alt="Logo de Velox" width={158} height={40} className="w-32 object-cover" />
        </Link>

        {/* Navbar pour les écrans de bureau */}
        <div className="hidden relative md:flex gap-16 items-center w-full justify-center">
          <Link href="/">
            <Typography variant="paragraph" color={isActive('/') ? 'gold' : 'black'}>
              {t('navbar.home')}
            </Typography>
          </Link>

          <button onClick={handleShopDropdown} className="flex items-center justify-between rounded ">
            <Typography variant="paragraph" color={isActive('/product' || '/product/industrial') ? 'gold' : 'black'}>
              {t('navbar.shop')}
            </Typography>
            <TbChevronUp
              size={19}
              className={clsx(
                'ml-1 text-black',
                isShopDropdownOpen || isActive('/product' || '/product/industrial')
                  ? 'rotate-180 transform duration-300 ease-in-out text-gold'
                  : 'text-black'
              )}
            />
          </button>

          <Link href="/">
            <Image src="/images/velox.png" alt="Logo de Velox" width={158} height={40} className="hidden md:block w-full h-16 py-1" />
          </Link>

          <Link href="/about">
            <Typography variant="paragraph" color={isActive('/about') ? 'gold' : 'black'}>
              {t('navbar.about')}
            </Typography>
          </Link>
          <Link href="/contact">
            <Typography variant="paragraph" color={isActive('/contact') ? 'gold' : 'black'}>
              {t('navbar.contact')}
            </Typography>
          </Link>
          <div className="absolute right-0">
            <LanguageSwitcher />
          </div>
        </div>

        {isShopDropdownOpen && (
          <SubNavbar
            items={[
              {
                title: t('navbar.veloxShop'),
                href: '/product',
                imageUrl: '/images/velox.png'
              },
              {
                title: t('navbar.veloxIndustrial'),
                href: '/product/industrial',
                imageUrl: '/images/veloxEquipement.png'
              }
            ]}
          />
        )}

        {/* Menu burger pour les appareils mobiles */}
        <div className="md:hidden flex items-center justify-end flex-grow">
          <button className="p-2 text-black" onClick={handleMainDropdown}>
            {isMainDropdownOpen ? <TbAlignRight size={25} /> : <TbAlignCenter size={25} />}
          </button>
        </div>
      </div>

      {/* Dropdown Menu pour les appareils mobiles */}
      {isMainDropdownOpen && (
        <div className="md:hidden animate-fade-down animate-duration-300 right-0 absolute top-14 w-full bg-gray-100/80 h-screen backdrop-blur-md">
          <ul className="px-8 py-10 mx-auto">
            <li className="mb-6">
              <Link href="/" className="text-xl font-medium block w-full">
                <Typography variant="paragraph" color={isActive('/') ? 'gold' : 'black'}>
                  {t('navbar.home')}
                </Typography>
              </Link>
            </li>
            <li className="mb-6">
              <button onClick={handleShopDropdown} className="flex items-center">
                <Typography variant="paragraph" color={isActive('/product' || '/product/industrial') ? 'gold' : 'black'}>
                  {t('navbar.shop')}
                </Typography>
                <TbChevronUp
                  size={19}
                  className={clsx('ml-1', isShopDropdownOpen ? 'rotate-180 transform duration-300 ease-in-out text-gold' : 'text-black')}
                />
              </button>
              {isShopDropdownOpen && (
                <ul className="pl-4 mt-2">
                  <li className="mb-2">
                    <Link href="/product" className="text-xl">
                      <Typography variant="paragraph" color={isActive('/product' || '/product/industrial') ? 'gold' : 'black'}>
                        {t('navbar.veloxShop')}
                      </Typography>
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/product/industrial">
                      <Typography variant="paragraph" color={isActive('/product/industrial') ? 'gold' : 'black'}>
                        {t('navbar.veloxIndustrial')}
                      </Typography>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="mb-6">
              <Link href="/about">
                <Typography variant="paragraph" color={isActive('/about') ? 'gold' : 'black'}>
                  {t('navbar.about')}
                </Typography>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <Typography variant="paragraph" color={isActive('/contact') ? 'gold' : 'black'}>
                  {t('navbar.contact')}
                </Typography>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </FlowbiteNavbar>
  );
};
