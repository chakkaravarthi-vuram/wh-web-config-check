import { axiosGetUtils } from '../AxiosHelper';
import { CLEAR_SESSION_DETAILS } from '../../urls/ApiUrls';
import { normalizeClearSessionDetails } from '../apiNormalizer/clearSessionDetails.apiNormalizer';
import { removePrimaryDomainCookie } from '../../containers/sign_in/SignIn.utils';

export const clearSessionDetails = () => new Promise((resolve, reject) => {
    removePrimaryDomainCookie();
    axiosGetUtils(CLEAR_SESSION_DETAILS, {
      // cancelToken: new CancelToken((c) => {
      //   cancelForClearSessionDetails = c;
      // }),
    })
      .then((response) => {
        resolve(normalizeClearSessionDetails(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export default clearSessionDetails;
