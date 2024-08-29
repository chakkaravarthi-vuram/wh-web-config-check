import { postCreateDatalistFromPrompt } from '../../axios/apiService/createDatalistFromPrompt.apiService';
import { PROMPT_TYPE } from '../../components/prompt_input/PromptInput.constants';
import { FORM_POPOVER_STATUS, ROUTE_METHOD } from '../../utils/Constants';
import { getShortCode, routeNavigate, showToastPopover } from '../../utils/UtilityFunctions';
import { createTaskSetState } from '../reducer/CreateTaskReducer';
import { isEmpty } from '../../utils/jsUtility';
import { createDatalistChange } from '../reducer/CreateDataListReducer';
import { DATA_LIST_CREATION_NLP } from '../../containers/data_list/listDataList/listDataList.strings';
import { ERR_CANCELED } from '../../utils/ServerConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export const postDataListCreationPromptThunk = (params, controller, history, pathdata, t) => async (dispatch) => {
    try {
        dispatch(createTaskSetState({ isMlTaskLoading: true, promptType: PROMPT_TYPE.DATA_LIST, controller }));
        const response = await postCreateDatalistFromPrompt(params, {}, controller?.signal);
        dispatch(createTaskSetState({ isMlTaskLoading: false, promptType: null }));
        if (isEmpty(response)) {
            showToastPopover(
                t(DATA_LIST_CREATION_NLP.FAILURE),
                EMPTY_STRING,
                FORM_POPOVER_STATUS.SUCCESS,
                true,
            );
        } else {
            await dispatch(createDatalistChange({
                data_list_name: response.data_list_name,
                data_list_description: response.data_list_description,
                data_list_short_code: getShortCode(response.data_list_name),
                sections: response?.sections,
                isFromPromptCreation: true,
            }));
            routeNavigate(history, ROUTE_METHOD.PUSH, pathdata.pathname, pathdata?.search, {}, true);
        }
        return response;
    } catch (e) {
        console.log('failed ml prompt', e);
        if (e.code === ERR_CANCELED) return null;
        dispatch(createTaskSetState({ isMlTaskLoading: false, promptType: null }));
        showToastPopover(
            t(DATA_LIST_CREATION_NLP.FAILURE),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SUCCESS,
            true,
        );
        return null;
    }
};
