import axios from 'axios';
import { axiosPostUtils } from '../AxiosHelper';

const { CancelToken } = axios;

export const editAnyway = (params, apiUrl, setCancelToken) => new Promise((resolve, reject) => {
    axiosPostUtils(
      apiUrl,
      params,
      {
        cancelToken: new CancelToken((c) => {
          setCancelToken(c);
        }),
      },
    )
      .then((response) => {
        resolve(response.data.result.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
