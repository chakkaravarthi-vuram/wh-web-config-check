import { DEFAULT_STEP_STATUS } from '../../../EditFlow.constants';
import { getCommonNodePostdata, saveStepCommonData } from '../../../node_configuration/NodeConfiguration.utils';
import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from '../end_step/EndStepConfig.constants';
import { JOIN_NODE_REQUEST_KEYS, JOIN_NODE_RESPONSE_KEYS, JOIN_TYPE } from './JoinParallelPaths.constants';
import jsUtility, { cloneDeep } from '../../../../../utils/jsUtility';

const formatJoinConfigData = (response, validSteps) => {
    const joinConfigObject = {
        [JOIN_NODE_RESPONSE_KEYS.TYPE]: response?.type || JOIN_TYPE.ALL_FLOWS,
    };
    switch (response?.[JOIN_NODE_REQUEST_KEYS.TYPE]) {
        case JOIN_TYPE.ATLEAST_N_FLOWS:
            joinConfigObject[JOIN_NODE_RESPONSE_KEYS.STEP_COUNT] =
                response?.[JOIN_NODE_REQUEST_KEYS.STEP_COUNT];
            break;
        case JOIN_TYPE.SPECIFIC_STEPS:
            const stepUuids = [];
            response?.[JOIN_NODE_REQUEST_KEYS.STEP_UUIDS]?.forEach((step) => {
                if (validSteps.includes(step)) {
                    stepUuids.push(step);
                }
            });
            joinConfigObject[JOIN_NODE_RESPONSE_KEYS.STEP_UUIDS] = stepUuids;
            break;
        case JOIN_TYPE.CONDITIONAL:
            const formattedConditionsArray = [];
            response?.[JOIN_NODE_RESPONSE_KEYS.CONDITION]?.forEach((conditionData) => {
                formattedConditionsArray.push({
                    [JOIN_NODE_RESPONSE_KEYS.RULE]: conditionData?.[JOIN_NODE_REQUEST_KEYS.RULE],
                    [JOIN_NODE_RESPONSE_KEYS.JOIN_CONFIG]: formatJoinConfigData(conditionData, validSteps),
                });
            });
            joinConfigObject[JOIN_NODE_RESPONSE_KEYS.CONDITION] = formattedConditionsArray;
            break;
        default:
            break;
    }
    return [joinConfigObject];
};

export const formatJoinParallelPathsApiData = (response, formattedStepDetails) => {
    const validSteps = cloneDeep(formattedStepDetails).map((step) => step.stepUuid);
    const data = {
        flowId: response?.flow_id,
        stepUuid: response?.step_uuid,
        stepId: response?._id,
        stepType: response?.step_type,
        stepName: response?.step_name,
        stepOrder: response?.step_order,
        stepStatus: response?.step_status || DEFAULT_STEP_STATUS, // default should be in progress for every node(check)
    };
    data[JOIN_NODE_RESPONSE_KEYS.JOIN_CONFIG] = formatJoinConfigData(response?.[JOIN_NODE_REQUEST_KEYS.JOIN_CONFIG], validSteps);
    return data;
};

const getJoinConfigPostData = (joinConfigData) => {
    const data = {
        [JOIN_NODE_REQUEST_KEYS.TYPE]: joinConfigData?.[JOIN_NODE_RESPONSE_KEYS.TYPE],
    };
    switch (joinConfigData?.[JOIN_NODE_RESPONSE_KEYS.TYPE]) {
        case JOIN_TYPE.ATLEAST_N_FLOWS:
            data[JOIN_NODE_REQUEST_KEYS.STEP_COUNT] =
                joinConfigData?.[JOIN_NODE_RESPONSE_KEYS.STEP_COUNT];
            break;
        case JOIN_TYPE.SPECIFIC_STEPS:
            data[JOIN_NODE_REQUEST_KEYS.STEP_UUIDS] =
                joinConfigData?.[JOIN_NODE_RESPONSE_KEYS.STEP_UUIDS];
            break;
        case JOIN_TYPE.CONDITIONAL:
            const formattedConditionsArray = [];
            joinConfigData?.[JOIN_NODE_REQUEST_KEYS.CONDITION]?.forEach((data) => {
                formattedConditionsArray.push({
                    rule: data.rule,
                    ...getJoinConfigPostData(data?.joinConfig?.[0]),
                });
            });
            data[JOIN_NODE_REQUEST_KEYS.CONDITION] = formattedConditionsArray;
            break;
        default:
            break;
    }
    return data;
};

export const saveJoinNodePostData = (stateDataParam) => {
    const stateData = cloneDeep(stateDataParam);
    const postData = getCommonNodePostdata(stateData);
    postData[REQUEST_FIELD_KEYS.STEP_STATUS] = stateData[RESPONSE_FIELD_KEYS.STEP_STATUS];
    postData[JOIN_NODE_REQUEST_KEYS.JOIN_CONFIG] = getJoinConfigPostData(stateDataParam?.joinConfig?.[0]);
    return postData;
};

export const getFormattedStepDetails = (response) => {
    if (!jsUtility.isEmpty(response)) {
        const formattedStepDetails = response.map((eachStep) => {
            return {
                label: eachStep.stepName,
                value: eachStep.stepUuid,
                ...eachStep,
            };
        });
        return formattedStepDetails;
    } else {
        return [];
    }
};

export const joinStepValidationData = (state) => {
    return {
        ...saveStepCommonData(state),
        joinConfig: state?.joinConfig,
    };
};
