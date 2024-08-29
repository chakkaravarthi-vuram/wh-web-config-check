import axios from 'axios';
import { axiosMLPostUtils } from '../AxiosMLHelper';
import { COPILOT_INFERENCE } from '../../urls/ApiUrls';
import normalizeCopilotInference from '../apiNormalizer/copilot.apiNormalizer';
import { CancelToken as UtilCancelToken } from '../../utils/UtilityFunctions';

const { CancelToken } = axios;

let copilotInferenceCancelToken;
export const cancelCopilotInference = () => {
  if (copilotInferenceCancelToken?.cancelToken) {
    copilotInferenceCancelToken.cancelToken();
  }
};

const postCopilotInference = (params) =>
  new Promise((resolve, reject) => {
    if (!copilotInferenceCancelToken) {
      copilotInferenceCancelToken = new UtilCancelToken();
    }
    if (copilotInferenceCancelToken?.cancelToken) {
      copilotInferenceCancelToken.cancelToken();
    }
    axiosMLPostUtils(
      COPILOT_INFERENCE,
      { params },
      {
        cancelToken: new CancelToken((c) => {
          if (copilotInferenceCancelToken?.setCancelToken) {
            copilotInferenceCancelToken.setCancelToken(c);
          } else {
            copilotInferenceCancelToken = c;
          }
        }),
      },
    )
      .then((res) => {
        resolve(normalizeCopilotInference(res?.data?.result));
      })
      .catch((err) => {
        reject(err);
      });
  });

export default postCopilotInference;
