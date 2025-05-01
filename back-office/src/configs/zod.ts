import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';

// Initialize zod with i18n. For better error messages see better config : https://github.com/aiji42/zod-i18n
z.setErrorMap(zodI18nMap);
