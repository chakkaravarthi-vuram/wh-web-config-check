import { PAC_URL_STRING } from '../../utils/strings/CommonStrings';

const getGoogleClientId = () => {
  if (window.location.href.includes('workhall.io') || window.location.hostname.includes(PAC_URL_STRING)) {
    return '153499168256-im1i9t8pd1mr6sd32mucd6tplp8n7t4v.apps.googleusercontent.com';
  } else if (window.location.href.includes('workhall.digital')) {
    return '195148357649-mje4kmcma0e37hb727q5qcnmmrvoiefc.apps.googleusercontent.com';
  } else {
    return '842975076333-cbroff6jmug7j50m3agovnqb5n74b7g4.apps.googleusercontent.com';
  }
};

export const POPUP_OPTIONS = {
  scopes: ['user.read'],
  responseMode: 'query',
};

export const GOOGLE_CONFIG = {
  clientId: getGoogleClientId(),
  responseType: 'code',
  scope: 'email',
  redirectUri: `${window.location.origin}`,
};
