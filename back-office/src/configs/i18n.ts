import dayjs from 'dayjs';
import DayjsEnModule from 'dayjs/locale/en';
import DayjsFrModule from 'dayjs/locale/fr';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import zodFRTranslation from 'zod-i18n-map/locales/fr/zod.json';

import fr from '@/locales/fr.json';

const FALLBACK_LANGUAGE = 'fr';

const resources = {
  fr: {
    translation: fr,
    zod: zodFRTranslation,
  },
};

const initializeLanguage = (language: string) => {
  if (language.startsWith('en')) {
    dayjs.locale(DayjsEnModule);
  } else {
    dayjs.locale(DayjsFrModule);
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init(
    {
      resources,
      // lng: defaultLocale,
      fallbackLng: FALLBACK_LANGUAGE,

      // keySeparator: false, // we do not use keys in form messages.welcome

      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    },
    () => {
      if (i18n.language) {
        initializeLanguage(i18n.language);
      }
      dayjs.extend(localizedFormat);
    }
  );

i18n.on('languageChanged', function (lng) {
  initializeLanguage(lng);
});

export default i18n;
