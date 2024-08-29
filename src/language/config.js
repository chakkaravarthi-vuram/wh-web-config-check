import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import English from './english/English.json';
import Spanish from './spanish/Spanish.json';
import Slovene from './slovene/Slovene.json';

export const language = {
  spanish_mexico: 'es-MX',
  english_united_kingdom: 'en-GB',
  solvene: 'sl-SI',
};

export const resources = {
  [language.english_united_kingdom]: English,
  [language.spanish_mexico]: Spanish,
  [language.solvene]: Slovene,
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  fallbackLng: language.english_united_kingdom,
  debug: true,
  lng: localStorage.getItem('application_language'),
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export const translate = (translateText) => i18next.t(translateText);

export const changeLanguage = (language) => i18next.changeLanguage(language);

export default i18next;
