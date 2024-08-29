import { PROMPT_TYPE } from '../../components/prompt_input/PromptInput.constants';
import { FORM_POPOVER_STATUS, ROUTE_METHOD } from '../../utils/Constants';
import { routeNavigate, showToastPopover } from '../../utils/UtilityFunctions';
import { createTaskSetState } from '../reducer/CreateTaskReducer';
import { isEmpty } from '../../utils/jsUtility';
import { postCreateTaskFromPrompt } from '../../axios/apiService/createTaskFromPrompt.apiService';
import { TASK_CREATION_NLP } from '../../containers/landing_page/my_tasks/MyTasks.strings';
import { GET_SECTION_INITIAL_DATA } from '../../utils/constants/form.constant';
import { ERR_CANCELED } from '../../utils/ServerConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export const postTaskCreationPromptThunk = (params, controller, history, pathdata, t) => async (dispatch) => {
    try {
        dispatch(createTaskSetState({ isMlTaskLoading: true, promptType: PROMPT_TYPE.TASK, controller }));
        const response = await postCreateTaskFromPrompt(params, controller?.signal);
        dispatch(createTaskSetState({ isMlTaskLoading: false, promptType: null }));
        if (isEmpty(response)) {
            showToastPopover(
                t(TASK_CREATION_NLP.FAILURE),
                EMPTY_STRING,
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
            );
        } else {
            await dispatch(createTaskSetState({
                ...response,
                sections: response?.sections || GET_SECTION_INITIAL_DATA(),
                isFromPromptCreation: true,
                fields: {},
            }));
            routeNavigate(history, ROUTE_METHOD.PUSH, pathdata.pathname, pathdata?.search, { mlAction: true }, true);
        }
        return response;
    } catch (e) {
        console.log('failed ml prompt', e);
        if (e.code === ERR_CANCELED) return null;
        dispatch(createTaskSetState({ isMlTaskLoading: false, promptType: null }));
        showToastPopover(
            t(TASK_CREATION_NLP.FAILURE),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
        );
        return null;
    }
};
