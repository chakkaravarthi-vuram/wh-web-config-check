import { GET_RULES } from '../../urls/ApiUrls';
import { CancelToken } from '../../utils/UtilityFunctions';
import { axiosGetUtils } from '../AxiosHelper';
import { normalizeGetRules } from '../apiNormalizer/rules.apiNormalizer';

export const getRules = (params, cancelToken) => new Promise((resolve, reject) => {
  if (cancelToken?.cancelToken) cancelToken.cancelToken();
  axiosGetUtils(GET_RULES, {
    params,
    cancelToken: new CancelToken((c) => {
      cancelToken.setCancelToken(c);
    }),
  })
    .then((response) => {
      resolve(normalizeGetRules(response));
    })
    .catch((error) => {
      reject(error);
    });
});
