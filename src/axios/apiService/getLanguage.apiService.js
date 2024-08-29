import axios from 'axios';
import normalizeLanguage from '../apiNormalizer/getLanguage.apiNormalizer';

export const getLanguage = (languageUrl) => new Promise((resolve, reject) => {
    axios(languageUrl)
      .then((response) => {
        console.log('urlrul response', response);
        resolve(normalizeLanguage(response.data));
      })
      .catch((error) => {
        reject(error);
      });
  });
export default getLanguage;
