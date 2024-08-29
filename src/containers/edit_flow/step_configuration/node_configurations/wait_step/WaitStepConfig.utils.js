import { cloneDeep, isNull, pick, isEmpty } from '../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from '../end_step/EndStepConfig.constants';
import {
    EVENT_TYPE,
    TIMER_TYPE,
} from './WaitStepConfig.constants';
import {
    INITIAL_TIMER_DETAILS,
} from './WaitStepConfig.strings';

export const getFieldInfo = (selectedFieldParam, optionList, getFieldLabel = false) => {
    console.log('getFieldInfoselectedField', selectedFieldParam, 'optionList', optionList);
    if (isNull(selectedFieldParam)) return EMPTY_STRING;
    let requiredInfo = null;
    optionList.forEach((option) => {
        if (getFieldLabel) {
            if (option?.field_uuid === selectedFieldParam) {
                requiredInfo = option?.field_name;
            }
        } else {
            if (option?.field_name === selectedFieldParam) {
                console.log('selectedUuidgetFieldInfo', option?.field_uuid);
                requiredInfo = option?.field_uuid;
            }
        }
    });
    console.log('requiredInfogetFieldInfo', requiredInfo);
    return requiredInfo;
};

export const constructGetApiTimerDetails = (timerDetails = {}) => {
    if (isEmpty(timerDetails)) return { ...cloneDeep(INITIAL_TIMER_DETAILS) };
    const clonedDetails = cloneDeep(timerDetails);
    let newTimerData = null;
    const {
        timer_data = {},
        timer_type,
    } = clonedDetails;
    const formattedTimerDetails = {
        timerType: Number(timer_type),
        timerData: {},
    };
    if (timer_type === TIMER_TYPE.FORM_FIELD_VALUE) {
        newTimerData = {
            fieldUuid: timer_data?.field_uuid,
            eventType: timer_data?.event_type,
        };
    } else {
        newTimerData = {
            durationType: timer_data?.duration_type,
            duration: Number(timer_data?.duration),
        };
    }
    formattedTimerDetails.timerData = newTimerData;
    console.log('getTimerDetailsGETApi', formattedTimerDetails);
    return formattedTimerDetails;
};

export const constructSaveStepTimerDetails = (state) => {
    const clonedState = cloneDeep(state);
    console.log('stateDataConstructWaitStep', clonedState);
    const {
        timerDetails: { timerData, timerType },
    } = clonedState;

    let newTimerData = null;
    const waitConfigData = {
        timer_details: {
            timer_type: timerType,
            timer_data: {},
        },
    };
    if (timerType === TIMER_TYPE.FORM_FIELD_VALUE) {
        newTimerData = {
            field_uuid: timerData?.fieldUuid,
            event_type: EVENT_TYPE.ON_TIME,
        };
    } else {
        newTimerData = {
            duration_type: timerData?.durationType,
            duration: Number(timerData?.duration),
        };
    }
    waitConfigData.timer_details.timer_data = newTimerData;
    return waitConfigData;
};

export const constructWaitStepPostData = (state) => {
    const stateData = cloneDeep(state);
    const timerData = constructSaveStepTimerDetails(state);
    console.log('stateDataConstructWaitStep', stateData, 'timerData', timerData);

    const postData = {
        [REQUEST_FIELD_KEYS.FLOW_ID]: stateData?.[RESPONSE_FIELD_KEYS.FLOW_ID],
        [REQUEST_FIELD_KEYS.ID]: stateData?.[RESPONSE_FIELD_KEYS.ID],
        [REQUEST_FIELD_KEYS.STEP_UUID]: stateData?.[RESPONSE_FIELD_KEYS.STEP_UUID],
        [REQUEST_FIELD_KEYS.STEP_NAME]: stateData?.[RESPONSE_FIELD_KEYS.STEP_NAME],
        [REQUEST_FIELD_KEYS.STEP_TYPE]: stateData?.[RESPONSE_FIELD_KEYS.STEP_TYPE],
        [REQUEST_FIELD_KEYS.STEP_ORDER]: stateData?.[RESPONSE_FIELD_KEYS.STEP_ORDER],
        [REQUEST_FIELD_KEYS.STEP_STATUS]: stateData?.[RESPONSE_FIELD_KEYS.STEP_STATUS],
        ...timerData,
    };
    return postData;
};

export const WaitStepCommonValidateData = (state = {}) => {
    const stateData = cloneDeep(state);

    const validationData = pick(stateData, [
        RESPONSE_FIELD_KEYS.ID,
        RESPONSE_FIELD_KEYS.STEP_NAME,
        RESPONSE_FIELD_KEYS.STEP_UUID,
        RESPONSE_FIELD_KEYS.STEP_TYPE,
        RESPONSE_FIELD_KEYS.COORDINATE_INFO,
        RESPONSE_FIELD_KEYS.COORDINATE_INFO_X,
        RESPONSE_FIELD_KEYS.COORDINATE_INFO_Y,
        RESPONSE_FIELD_KEYS.STEP_COORDINATES,
        RESPONSE_FIELD_KEYS.STEP_STATUS,
        RESPONSE_FIELD_KEYS.STEP_ORDER,
    ]);

    return validationData;
};
