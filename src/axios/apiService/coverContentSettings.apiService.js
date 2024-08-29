import { axiosPostUtils, axiosGetUtils } from '../AxiosHelper';
import { ACCOUNT_COVER_DETAILS, UPDATE_ACCOUNT_COVER_DETAILS } from '../../urls/ApiUrls';
import { getLoaderConfig } from '../../utils/UtilityFunctions';
import {
  normalizeAccountMainDetails,
  normalizeUpdateAccountMainDetails,
} from '../apiNormalizer/accountSettings.apiNormalizer';

export const accountCoverDetails = () => new Promise((resolve, reject) => {
    axiosGetUtils(ACCOUNT_COVER_DETAILS, {
      // cancelToken: new CancelToken((c) => {
      //   cancelForCoverDetails = c;
      // }),
    })
      .then((response) => {
        resolve(normalizeAccountMainDetails(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const updateAccountCoverDetails = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_ACCOUNT_COVER_DETAILS, data, {
      ...getLoaderConfig(),
      // cancelToken: new CancelToken((c) => {
      //   cancelForUpdateCoverDetails = c;
      // }),
    })
      .then((response) => {
        resolve(normalizeUpdateAccountMainDetails(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export default accountCoverDetails;
