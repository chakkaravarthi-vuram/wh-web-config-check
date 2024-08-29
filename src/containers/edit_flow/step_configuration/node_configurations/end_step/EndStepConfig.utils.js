import jsUtility, { cloneDeep, pick } from '../../../../../utils/jsUtility';
import { getCommonNodePostdata } from '../../../node_configuration/NodeConfiguration.utils';
import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from './EndStepConfig.constants';

export const endStepCommonValidateData = (stateDataParam = {}) => {
    const stateData = cloneDeep(stateDataParam);

    const validationData = pick(stateData, [
        RESPONSE_FIELD_KEYS.ID,
        RESPONSE_FIELD_KEYS.STEP_UUID,
        RESPONSE_FIELD_KEYS.STEP_NAME,
        RESPONSE_FIELD_KEYS.STEP_TYPE,
        RESPONSE_FIELD_KEYS.STEP_STATUS,
        RESPONSE_FIELD_KEYS.STEP_ORDER,
        RESPONSE_FIELD_KEYS.TERMINATE_FLOW,
        RESPONSE_FIELD_KEYS.COORDINATE_INFO,
        RESPONSE_FIELD_KEYS.COORDINATE_INFO_X,
        RESPONSE_FIELD_KEYS.COORDINATE_INFO_Y,
        RESPONSE_FIELD_KEYS.STEP_COORDINATES,
        RESPONSE_FIELD_KEYS.TERMINATE_TYPE,
    ]);

    return validationData;
};

export const constructEndStepPostData = (stateParam) => {
    const stateData = jsUtility.cloneDeep(stateParam);
    const postData = getCommonNodePostdata(stateData);
    jsUtility.set(
        postData,
        [REQUEST_FIELD_KEYS.TERMINATE_FLOW],
        stateData?.[RESPONSE_FIELD_KEYS.TERMINATE_FLOW],
    );

    if (postData?.[REQUEST_FIELD_KEYS.TERMINATE_FLOW]) {
        jsUtility.set(
            postData,
            [REQUEST_FIELD_KEYS.TERMINATE_TYPE],
            stateData?.[RESPONSE_FIELD_KEYS.TERMINATE_TYPE],
        );
    }
    return postData;
};
