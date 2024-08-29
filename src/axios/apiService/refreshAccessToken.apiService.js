import axios from 'axios';
import { expiryTimer } from 'utils/UtilityFunctions';
import Cookies from 'universal-cookie';
import { has } from 'utils/jsUtility';
import { setRefreshTokenApiStatus } from 'axios/axios.utils';
import { axiosGetUtils } from '../AxiosHelper';
import { REFRESH_ACCESS_TOKEN } from '../../urls/ApiUrls';
import { normalizeRefreshAccessToken } from '../apiNormalizer/refreshAccessToken.apiNormalizer';
import { removePrimaryDomainCookie } from '../../containers/sign_in/SignIn.utils';
import { history } from '../../App';

const cookies = new Cookies();
const { CancelToken } = axios;

let cancelForRefreshAccessToken;

const getCancelTokenRefresh = (cancelToken) => {
  cancelForRefreshAccessToken = cancelToken;
};

export const refreshAccessToken = () => new Promise((resolve, reject) => {
    if (cancelForRefreshAccessToken) cancelForRefreshAccessToken();
    axiosGetUtils(REFRESH_ACCESS_TOKEN, {
      cancelToken: new CancelToken((c) => {
        getCancelTokenRefresh(c);
      }),
    })
      .then((response) => {
        expiryTimer(response.data.result.data.sessionExpiryTime, response.data.result.data.currentTime, history, false, false, true);
        const newTime = new Date().getTime();
        localStorage.setItem('previous_log_time', newTime);
        localStorage.setItem('csrf_token', response?.headers['csrf-token']);
        setTimeout(() => {
          cookies.set('refreshTokenInProgress', 0, { path: '/' });
          resolve({ response: normalizeRefreshAccessToken(response), headers: response.headers });
        }, 2000);
      })
      .catch((error) => {
        if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
        removePrimaryDomainCookie();
        setRefreshTokenApiStatus(false);
        reject(error);
      });
  });

export default refreshAccessToken;
