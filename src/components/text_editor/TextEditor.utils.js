import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export const EDITOR_CONFIGS = {
  extendedValidElements:
    'img[*],table[id|data-id|style|contenteditable|border],span[id|data-id|contenteditable|field-type|class|style|action-id|parent-id|child-id],button[id|onclick|class|style|title],svg[xmlns|width|height|viewbox|style|action-id|parent-id],path[fill|fill-rule|d|stroke-width|action-id|parent-id]',
  plugins: 'searchreplace table advlist lists link autolink',
  table_toolbar: 'tabledelete',
  scriptSrc: '/tinymce/tinymce.min.js',
  templateFontSizes: '8px 10px 12px 14px 16px 18px 24px 36px',
  headerFooterFontSizes: '8pt 10pt 12pt 14pt 18pt 24pt',
  BASIC_TOOLBAR: 'bold italic underline',
  DOC_TOOLBAR1: 'bold italic underline fontSize align forecolor backcolor link hr lineheight bullist numlist',
  BODY_TOOLBAR1:
    'bold italic underline | fontSize align | forecolor backcolor | link hr lineheight | bullist numlist',
  BODY_TOOLBAR2: 'insertFieldMenu insertTableMenu insertImageMenu',
  HEADER_FOOTER_TOOLBAR1:
    'bold italic underline fontSize align forecolor backcolor link hr lineheight bullist numlist',
  HEADER_FOOTER_TOOLBAR2: 'insertImageMenu',
  INSERT_FIELD_TOOLBAR: 'insertFieldMenu',
};

export const LOCALE_LIST = {
  EN: 'en',
  EN_IN: 'en_IN',
  EN_US: 'en_US',
  EN_GB: 'en_GB',
  ES: 'es',
  ES_MX: 'es_MX',
};

export const getLanguageUrl = () => {
  const currentLanguage = localStorage.getItem('application_language');

  if (currentLanguage?.includes('en')) {
    return EMPTY_STRING;
  } else {
    return `${process.env.PUBLIC_URL}/tinymce_languages/es_MX.js`;
  }
};

export const getLanguageLocale = () => {
  const currentLanguage = localStorage.getItem('application_language');

  if (currentLanguage?.includes('en')) {
    return LOCALE_LIST.EN;
  } else {
    return LOCALE_LIST.ES_MX;
  }
};

export const CHARMAP = [
  [0x021, 'exclamation-mark'],
  [0x022, 'quotation-mark'],
  [0x023, 'number-sign'],
  [0x024, 'dollar-sign'],
  [0x025, 'percent'],
  [0x026, 'ampersand'],
  [0x027, 'apostrophe'],
  [0x028, 'left-parenthesis'],
  [0x029, 'right-parenthesis'],
  [0x02a, 'asterisk'],
  [0x02b, 'plus-sign'],
  [0x02c, 'comma'],
  [0x02d, 'hyphen'],
  [0x02e, 'period'],
  [0x02f, 'slash'],
  [0x24d8, 'information'],
  [0x27f3, 'restart'],
  [0x05c, 'backslash'],
];
