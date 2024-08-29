import { TASK_ACTION_HISTORY } from './ActionConstants';
import { apiGetActionHistoryByInstanceId } from '../../axios/apiService/task.apiService';
import {
    updateErrorPopoverInRedux,
} from '../../utils/UtilityFunctions';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { EMPTY_STRING, ERROR_TEXT } from '../../utils/strings/CommonStrings';

const taskActionHistoryStarted = (params) => {
 return {
    type: TASK_ACTION_HISTORY.STARTED,
    payload: params,
};
};

const taskActionHistoryFailure = () => {
 return {
    type: TASK_ACTION_HISTORY.FAILURE,
};
};

export const taskActionHistorySuccess = (actionHistory) => {
    return {
       type: TASK_ACTION_HISTORY.SUCCESS,
       payload: actionHistory,
   };
};

export const taskActionHistoryCancel = () => {
 return {
    type: TASK_ACTION_HISTORY.CANCEL,
};
};

export const taskActionHistoryClear = () => {
 return {
    type: TASK_ACTION_HISTORY.CLEAR,
};
};

const throwError = (err, isGet) => {
    if (isGet) {
        const getError = generateGetServerErrorMessage(err);
        const commonServerError = getError.common_server_error ? getError.common_server_error : EMPTY_STRING;
        updateErrorPopoverInRedux(ERROR_TEXT.UPDATE_FAILURE, commonServerError);
        return taskActionHistoryFailure();
    } else {
        // const { server_error } = store.getState().TeamReducer;
        // const postError = generatePostServerErrorMessage(err, [], CREATE_TEAM_LABELS);
        // const commonServerError = postError.common_server_error ? postError.common_server_error : EMPTY_STRING;
        // const serverError = postError.state_error ? postError.state_error : [];
        // updateErrorPopoverInRedux(TEAMS.UPDATE_FAILURE, postError.common_server_error);
        // return teamFailure(commonServerError, serverError);
    }
    return null;
};

export const GetActionHistoryByInstanceId = (params) => (dispatch) => new Promise((resolve, reject) => {
        dispatch(taskActionHistoryStarted(params));
        apiGetActionHistoryByInstanceId(params)
            .then((res) => {
                dispatch(taskActionHistorySuccess(res));
                resolve(res);
            })
            .catch((err) => {
                console.log('cathc the error', err);
                dispatch(throwError(err, true));
                dispatch(taskActionHistoryFailure());
                reject(err);
            });
    });
