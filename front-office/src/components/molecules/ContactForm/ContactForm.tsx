import { useTranslation } from 'next-i18next';

export const ContactForm: React.FC = () => {
  const { t } = useTranslation();
  const inputClass =
    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold';

  return (
    <div className="flex flex-col gap-12 mx-auto w-full mt-10 md:mt-0">
      <form action="https://formsubmit.co/bilalay@veloxservi.com" method="POST" className="text-center">
        <div className="grid grid-cols-1 gap-y-4">
          <span>
            <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="name">
              {t('contactPage.form.name')}
            </label>
            <input className={inputClass} id="name" name="Name" type="text" placeholder={t('contactPage.form.namePlaceholder')} required />
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
            <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="subject">
              {t('contactPage.form.subject')}
            </label>
            <input
              className={inputClass}
              id="subject"
              name="Suject"
              type="text"
              placeholder={t('contactPage.form.subjectPlaceholder')}
              required
            />
          </span>
          <span>
            <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="message">
              {t('contactPage.form.message')}
            </label>
            <textarea
              className={inputClass}
              id="message"
              name="Message"
              placeholder={t('contactPage.form.messagePlaceholder')}
              rows={6}
              required
            ></textarea>
          </span>
        </div>
        <div>
          <input type="hidden" name="_subject" value="VELOX SERVI - Yeni e-mail"></input>
        </div>
        <div className="flex flex-col items-end justify-end py-3">
          <p className="text-xs text-right mb-1 text-black">{t('contactPage.captcha')}</p>
          <button
            className="bg-black w-fit hover:bg-gold text-white font-bold py-1.5 px-5 rounded-xl focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {t('contactPage.form.sendButtonLabel')}
          </button>
        </div>
      </form>
    </div>
  );
};
