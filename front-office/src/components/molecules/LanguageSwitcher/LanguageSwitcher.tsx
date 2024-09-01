import { useRouter } from 'next/router';

const LANGUAGE_NAME = {
  en: 'English',
  tr: 'Türkçe',
  fr: 'Français'
};

export const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale, asPath } = router;

  const handleChangeLanguage = (e: any) => {
    const newLocale = e.target.value;
    // i18n.changeLanguage(newLocale);
    router.push(asPath, asPath, { locale: newLocale });
  };

  const availableLanguages = router.locales || [];

  return (
    <select
      className="bg-transparent border-gray-400/70 text-black rounded-md px-2 py-0.5 shadow-none box-shadow-none focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
      value={locale}
      onChange={handleChangeLanguage}
    >
      {availableLanguages.map((language) => (
        <option key={language} value={language}>
          {language in LANGUAGE_NAME ? LANGUAGE_NAME[language as keyof typeof LANGUAGE_NAME] : language}
        </option>
      ))}
    </select>
  );
};
