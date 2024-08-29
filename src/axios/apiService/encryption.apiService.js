import axios from 'axios';
import normalizeEncryptionDetails from '../apiNormalizer/encryption.apiNormalizer';
import jsUtils from '../../utils/jsUtility';
import { AUTH_BASE_URL, ML_BACKEND_API_GATEWAY_BASE_URL } from '../../urls/ApiUrls';
import { setEncryptionData, setEncryptionParams } from '../../redux/actions/EncryptionData.Action';
import { store } from '../../Store';
import { encryptAesKey, generateAesKey } from '../../utils/encryptionUtils';

export const getEncryptionDetailsThunk = (url, request) => new Promise((resolve, reject) => {
  let modifiedUrl;
  if (url.includes('auth')) {
  modifiedUrl = `${AUTH_BASE_URL}/${url}`;
  } else {
  axios.defaults.baseURL = ML_BACKEND_API_GATEWAY_BASE_URL;
  modifiedUrl = `/${url}`;
  }
    console.log('modifiedUrl', modifiedUrl);
  axios
    .get(modifiedUrl)
    .then((response) => {
      const encryptionResponseDetails = normalizeEncryptionDetails(
        jsUtils.get(response, 'data.result.data', {}),
      );
      console.log('modifiedUrlencryptionResponseDetails', encryptionResponseDetails);
      if (!jsUtils.isEmpty(encryptionResponseDetails)) {
        console.log('modifiedUrlencryptionResponseDetailsInside', !jsUtils.isEmpty(encryptionResponseDetails), encryptionResponseDetails);
        const aes_key = generateAesKey();
        const encryptionDetails = {
          pks_id: encryptionResponseDetails.pks_id,
          public_key: encryptionResponseDetails.public_key,
          aes_key,
          aek: encryptAesKey(
            encryptionResponseDetails.public_key,
            aes_key,
          ),
        };
        console.log('encryptionDetails', encryptionDetails);
        if (request) {
          if (request.method === 'get') {
            if (!jsUtils.isEmpty(request.params)) {
              store.dispatch(setEncryptionParams(request.params));
            }
          } else {
            store.dispatch(setEncryptionData(request.data));
          }
        }
        console.log('modifiedUrlencryptionResponseDetailsInsideIfAbove', encryptionDetails);
        if (url.includes('auth')) {
          console.log('modifiedUrlencryptionResponseDetailsInsideIfBelow', encryptionDetails);
          console.log('modifiedUrlIff', modifiedUrl);
          localStorage.setItem(
            'encryption_details',
            JSON.stringify(encryptionDetails),
          );
        } else if (axios.defaults.baseURL.includes(ML_BACKEND_API_GATEWAY_BASE_URL)) {
          localStorage.setItem(
            'ml_service_encryption_details',
            JSON.stringify(encryptionDetails),
          );
        }
        resolve(encryptionDetails);
      } else {
        resolve(null);
      }
    })
    .catch((error) => {
      console.log('error sdfds', error);
      reject(error);
    });
});

export default getEncryptionDetailsThunk;
