import axios from 'axios';
import { axiosPostUtils } from '../AxiosHelper';
import { CHANGE_PASSWORD_API } from '../../urls/ApiUrls';
import { getLoaderConfig } from '../../utils/UtilityFunctions';
import { normalizeChangePassword } from '../apiNormalizer/changePassword.apiNormalizer';

let cancelForChangePassword;
const { CancelToken } = axios;

export const changePassword = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(CHANGE_PASSWORD_API, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        cancelForChangePassword = c;
      }),
    })
      .then((response) => {
        resolve({ response: normalizeChangePassword(response), headers: response.headers });
      })
      .catch((error) => {
        reject(error);
      });
  });

export const cancelChangePassword = () => {
  if (cancelForChangePassword) cancelForChangePassword();
};

export default changePassword;
