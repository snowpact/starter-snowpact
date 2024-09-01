import { Product } from '@/pages/product/[id]';
import { useTranslation } from 'next-i18next';

export interface Props {
  product: Product;
}

export const ContactProductForm: React.FC<Props> = ({ product }) => {
  const { t } = useTranslation();
  const inputClass =
    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold';
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-black font-semibold text-lg text-center">{t('productDetailPage.requestPrice')}</h3>
      <div className="flex flex-col gap-12 mx-auto w-full mt-10 md:mt-0">
        <form action="https://formsubmit.co/bilalay@veloxservi.com" method="POST" className="text-center">
          <div className="grid grid-cols-1 gap-y-4">
            <span>
              <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="name">
                {t('contactPage.form.name')}
              </label>
              <input
                className={inputClass}
                id="name"
                name="Name"
                type="text"
                placeholder={t('contactPage.form.namePlaceholder')}
                required
              />
            </span>
            <span>
              <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="email">
                {t('contactPage.form.email')}
              </label>
              <input
                className={inputClass}
                id="email"
                name="E-mail"
                type="email"
                placeholder={t('contactPage.form.emailPlaceholder')}
                required
              />
            </span>
            <span>
              <input
                className={inputClass}
                type="hidden"
                id="subject"
                name={'Title: ' + product.title + ' | ' + 'Description: ' + product.description}
                required
              />
            </span>
          </div>
          <div>
            <input type="hidden" name="_subject" value="VELOX SERVI - Ürün fiyatı isteme"></input>
          </div>
          <div className="flex flex-col items-end justify-end">
            <button
              className="bg-black/90 w-full hover:bg-gold/90 text-white font-bold py-1 px-5 rounded-xl focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {t('productDetailPage.requestPrice')}
            </button>
            <p className="text-xs text-left mt-2 px-2 text-black">{t('contactPage.captcha')}</p>
          </div>
        </form>
      </div>
    </div>
  );
};
