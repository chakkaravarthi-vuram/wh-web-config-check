import { translate } from 'language/config';
import { apiGetReportDownloadDocs } from '../../axios/apiService/flowList.apiService';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { showToastPopover } from '../../utils/UtilityFunctions';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';
import {
  downloadWindowApiStarted,
  downloadWindowApiFailure,
  downloadWindowApiSuccess,
} from '../reducer/DownloadWindowReducer';

const getReportDownloadDocsThunk = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(downloadWindowApiStarted());
    apiGetReportDownloadDocs()
      .then((response) => {
        if (response) {
          dispatch(downloadWindowApiSuccess(response));
          resolve(response);
        }
      })
      .catch((error) => {
        if (error && error.code === 'ERR_CANCELED') return;
        const errors = generateGetServerErrorMessage(error);
        dispatch(downloadWindowApiFailure(errors));
        showToastPopover(
          errors?.common_server_error || translate('error_popover_status.somthing_went_wrong'),
          translate('error_popover_status.try_again'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        reject(errors);
      });
  });

export default getReportDownloadDocsThunk;
