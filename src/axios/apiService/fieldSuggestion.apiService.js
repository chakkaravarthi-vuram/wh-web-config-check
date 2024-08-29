import { axiosMLPostUtils, axiosMLGetUtils } from 'axios/AxiosMLHelper';
import { GET_FIELD_SUGGESTION } from '../../urls/ApiUrls';
import { getLoaderConfig } from '../../utils/UtilityFunctions';
import { normalizeFieldSuggestion } from '../apiNormalizer/fieldSuggestion.apiNormalizer';

export const getFieldSuggestionApi = (data) => new Promise((resolve, reject) => {
  axiosMLGetUtils(GET_FIELD_SUGGESTION, data, {
      ...getLoaderConfig(),
      // cancelToken: new CancelToken((c) => {
      //   cancelForFieldSuggestion = c;
      // }),
    })
      .then((response) => {
        resolve(normalizeFieldSuggestion(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const postFieldSuggestionApi = (params) => {
  console.log('postFieldSuggestion api service', params);
  let apiCancelToken;
  return new Promise((resolve, reject) => {
      axiosMLPostUtils(GET_FIELD_SUGGESTION, {
          params,
          cancelToken: apiCancelToken,
      })
          .then((res) => {
              console.log('ML res', res);
          })
          .catch((err) => {
              console.log('ML err', err);
              reject(err);
          });
  });
};

export default getFieldSuggestionApi;
