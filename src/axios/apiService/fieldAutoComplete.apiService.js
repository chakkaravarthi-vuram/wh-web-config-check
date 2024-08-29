import axios from 'axios';

import { axiosMLGetUtils, axiosMLPostUtils } from '../AxiosMLHelper';
import { GET_FIELD_AUTOCOMPLETE, WELCOME_MESSAGE_GENERATION } from '../../urls/ApiUrls';
import { normalizeFieldName, normalizeTrackingData, normalizeWelcomeMessage } from '../apiNormalizer/fieldnameAutocomplete.apiNormalizer';

const { CancelToken } = axios;
// commmon form related apis
let sourceGetFieldAutocomplete;
let cancelWelcomeMessage;
export const getCancelTokenForWelcomeMessage = (cancelToken) => {
    cancelWelcomeMessage = cancelToken;
};
export const getFieldAutocomplete = (params, cancelToken) => {
  console.log('getFieldAutocomplete api service', params);
  return new Promise((resolve, reject) => {
    axiosMLGetUtils(GET_FIELD_AUTOCOMPLETE, {
      params,
      cancelToken: new CancelToken((c) => {
        (cancelToken) && cancelToken(c);
      }),
    })
      .then((res) => {
          console.log('ML res', res);
        resolve(normalizeFieldName(res));
      })
      .catch((err) => {
        console.log('ML err', err);
        reject(err);
      });
  });
};

export const cancelFieldAutoComplete = () => () => {
  sourceGetFieldAutocomplete && sourceGetFieldAutocomplete.cancel('Canceled fieldAUtoComplete');
};

export const postFieldAutocomplete = (params) => {
  console.log('postFieldAutocomplete api service', params);
  return new Promise((resolve, reject) => {
    axiosMLPostUtils(GET_FIELD_AUTOCOMPLETE, {
      params,
    })
      .then((res) => {
          console.log('ML rescdvdsvdsvd', res);
        resolve(normalizeTrackingData(res));
      })
      .catch((err) => {
        console.log('ML err', err);
        reject(err);
      });
  });
};

export const welcomeMessageApi = () => {
  if (cancelWelcomeMessage) cancelWelcomeMessage();
  return new Promise((resolve, reject) => {
    axiosMLGetUtils(WELCOME_MESSAGE_GENERATION, {
      cancelToken: new CancelToken((c) => {
        getCancelTokenForWelcomeMessage(c);
    }),
    })
      .then((res) => {
        resolve(normalizeWelcomeMessage(res));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default getFieldAutocomplete;
