import { store } from '../../Store';
import postCopilotInference from '../../axios/apiService/copilot.apiService';
import { getActiveTaskList } from '../../axios/apiService/task.apiService';
import CHAT_STRINGS from '../../containers/copilot/chat/Chat.strings';
import getChatListByResponse from '../../containers/copilot/chat/Chat.utils';
import getTaskList from '../../containers/copilot/search_result/task/Task.utils';
import jsUtility from '../../utils/jsUtility';
import {
  setCopilotChatDataChange,
  setCopilotChatError,
  setCopilotTaskDataChange,
  setCopilotTaskError,
  startCopilotChatLoader,
  startCopilotTaskLoader,
  stopCopilotChatLoader,
  stopCopilotTaskLoader,
} from '../reducer/CopilotReducer';

export const getActiveTaskListActionThunk =
  (params, cancelToken) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(startCopilotTaskLoader());
      getActiveTaskList(params, cancelToken)
        .then((res) => {
          if (!jsUtility.isEmpty(res)) {
            const { pagination_data, pagination_details } = res;
            const clonedCopilotTaskData = jsUtility.cloneDeep(
              store.getState().CopilotReducer.task,
            );
            clonedCopilotTaskData.data.list = getTaskList(pagination_data);
            clonedCopilotTaskData.data.details = pagination_details;
            dispatch(setCopilotTaskDataChange(clonedCopilotTaskData));
          }
          dispatch(stopCopilotTaskLoader());
          resolve(res);
        })
        .catch((err) => {
          if (err?.response?.data?.errors) {
            const arrErrors = err?.response?.data?.errors;
            if (arrErrors && arrErrors.length > 0) {
              const [errors] = arrErrors;
              dispatch(setCopilotTaskError(errors));
            }
          }
          dispatch(stopCopilotTaskLoader());
          reject(err);
        });
    });

export const postCopilotInferenceActionThunk =
  (params, t) => (dispatch) =>
    new Promise((resolve, reject) => {
      const clonedCopilotChatData = jsUtility.cloneDeep(
        store.getState().CopilotReducer.chat,
      );
      dispatch(startCopilotChatLoader());
      postCopilotInference(params)
        .then((res) => {
          if (!jsUtility.isEmpty(res)) {
            const clonedArrChatList = jsUtility.cloneDeep(
              clonedCopilotChatData.data.list,
            );
            clonedCopilotChatData.data.list = getChatListByResponse(
              res,
              clonedArrChatList,
              t,
            );
            dispatch(setCopilotChatDataChange(clonedCopilotChatData));
          }
          dispatch(stopCopilotChatLoader());
          resolve(res);
        })
        .catch((err) => {
          const error = err?.response?.data;
          if (error?.errors) {
            const arrErrors = error?.errors;
            if (arrErrors && arrErrors.length > 0) {
              const [errors] = arrErrors;
              dispatch(setCopilotChatError(errors));
            }
          }
          if (error?.status_code) {
            if (error.status_code === CHAT_STRINGS.STATUS_CODE_TYPE.QUOTA_EXCEEDED) {
              const chatError = {
                status_code: error.status_code,
                message: error.error_message,
              };
              dispatch(setCopilotChatError(chatError));
            } else if (error.status_code === CHAT_STRINGS.STATUS_CODE_TYPE.API_FAILED) {
              const apiFailedError = {
                type: CHAT_STRINGS.TYPE.RECEIVER,
                isError: true,
                status_code: error.status_code,
              };
              clonedCopilotChatData.data.list.push(apiFailedError);
              dispatch(setCopilotChatDataChange(clonedCopilotChatData));
            }
          }
          dispatch(stopCopilotChatLoader());
          reject(err);
        });
    });
