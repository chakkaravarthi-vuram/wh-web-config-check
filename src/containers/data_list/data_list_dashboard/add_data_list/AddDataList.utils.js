import { SERVER_ERROR_CODE_TYPES } from 'utils/ServerConstants';
import { DATA_LIST_ERROR_MESSAGES } from './AddDataList.strings';

export const getErrorDetails = (error_message, t) => {
  let errorObject = {};
  if (error_message === SERVER_ERROR_CODE_TYPES.AUTH_ERROR) {
    errorObject = DATA_LIST_ERROR_MESSAGES(t).AUTHORIZATION_ERROR;
  } else if (error_message.includes('not_exist')) {
    errorObject = DATA_LIST_ERROR_MESSAGES(t).ACCESS_DELETED_INSTANCE;
  } else {
    errorObject = DATA_LIST_ERROR_MESSAGES(t).SOMETHING_WENT_WRONG;
  }

  return {
    title: errorObject.TITLE,
    subTitle: errorObject.SUB_TITLE,
  };
};
