import { cloneDeep, isEmpty } from 'utils/jsUtility';
import { DEFAULT_STEP_STATUS } from '../../../EditFlow.constants';
import { getCommonNodePostdata, getCommonNodeValidateData } from '../../../node_configuration/NodeConfiguration.utils';
import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from '../end_step/EndStepConfig.constants';
import { CONDITION_ROUTER_REQUEST_KEYS, CONDITION_ROUTER_RESPONSE_KEYS } from './BranchParallelPaths.constants';

export const constructBranchParallelValidationData = (state) => {
    const stateData = cloneDeep(state);
    const validationData = getCommonNodeValidateData(stateData);
    validationData.isConditional = stateData.isConditional;
    if (stateData.isConditional) {
        validationData.condition = stateData.condition;
        validationData.defaultSteps = stateData.defaultSteps;
    } else {
        validationData.stepUuids = stateData.stepUuids;
    }
    return {
        ...validationData,
    };
};

export const saveConditionRouterPostData = (stateDataParam) => {
    const stateData = cloneDeep(stateDataParam);
    const postData = getCommonNodePostdata(stateData);
    postData[REQUEST_FIELD_KEYS.STEP_STATUS] = stateData[RESPONSE_FIELD_KEYS.STEP_STATUS];
    postData[CONDITION_ROUTER_REQUEST_KEYS.BRANCH_CONFIG] = {
        [CONDITION_ROUTER_REQUEST_KEYS.IS_CONDITIONAL]:
            stateDataParam[CONDITION_ROUTER_RESPONSE_KEYS.IS_CONDITIONAL],
    };

    if (stateDataParam[CONDITION_ROUTER_RESPONSE_KEYS.IS_CONDITIONAL]) {
        postData[CONDITION_ROUTER_REQUEST_KEYS.BRANCH_CONFIG].condition = stateData?.condition?.map((eachCondition) => {
            return {
                [CONDITION_ROUTER_REQUEST_KEYS.STEPS]: eachCondition[CONDITION_ROUTER_RESPONSE_KEYS.STEPS]?.map((step) => step.value),
                [CONDITION_ROUTER_REQUEST_KEYS.RULE_DETAILS]:
                    eachCondition[CONDITION_ROUTER_RESPONSE_KEYS.RULE_DETAILS]?.[CONDITION_ROUTER_RESPONSE_KEYS.RULE_UUID],
            };
        });
        postData[CONDITION_ROUTER_REQUEST_KEYS.BRANCH_CONFIG][CONDITION_ROUTER_REQUEST_KEYS.DEFAULT_STEPS] =
            stateData?.[CONDITION_ROUTER_RESPONSE_KEYS.DEFAULT_STEPS]?.map((step) => step.value);
    } else {
        postData[CONDITION_ROUTER_REQUEST_KEYS.BRANCH_CONFIG][CONDITION_ROUTER_REQUEST_KEYS.STEPS] = stateData[CONDITION_ROUTER_RESPONSE_KEYS.STEPS].map((step) => step.value);
    }
    return postData;
};

export const formatBranchParallelPathsData = (apiData, stepsList, isParallel) => {
    const data = {
        flowId: apiData?.flow_id,
        stepUuid: apiData?.step_uuid,
        stepId: apiData?._id,
        stepName: apiData?.step_name,
        stepOrder: apiData?.step_order,
        stepStatus: apiData?.step_status || DEFAULT_STEP_STATUS,
        stepType: apiData?.step_type,
        connectedSteps: apiData.connected_steps,
        [CONDITION_ROUTER_RESPONSE_KEYS.IS_CONDITIONAL]:
            apiData?.[CONDITION_ROUTER_REQUEST_KEYS.BRANCH_CONFIG]?.[CONDITION_ROUTER_REQUEST_KEYS.IS_CONDITIONAL] ||
            !isParallel,
    };
    if (data?.[CONDITION_ROUTER_RESPONSE_KEYS.IS_CONDITIONAL]) {
        data[CONDITION_ROUTER_RESPONSE_KEYS.DEFAULT_STEPS] = [];
        apiData?.[CONDITION_ROUTER_REQUEST_KEYS.BRANCH_CONFIG]?.[CONDITION_ROUTER_REQUEST_KEYS.DEFAULT_STEPS]?.forEach((stepUuid) => {
            const selectedStep = stepsList.find((stepData) => stepData.value === stepUuid);
            if (selectedStep) {
                data[CONDITION_ROUTER_RESPONSE_KEYS.DEFAULT_STEPS].push({
                    ...selectedStep,
                });
            }
        });
        const condition = apiData[CONDITION_ROUTER_REQUEST_KEYS.BRANCH_CONFIG]?.condition ||
        [
            {
                [CONDITION_ROUTER_RESPONSE_KEYS.STEPS]: [],
                [CONDITION_ROUTER_RESPONSE_KEYS.RULE_DETAILS]: {},
            },
        ];
        data.condition = condition?.map((eachCondition) => {
            const conditionData = {};
            const ruleData = apiData?.rule_details?.find((eachRule) => eachRule?.[CONDITION_ROUTER_REQUEST_KEYS.RULE_UUID] === eachCondition?.[CONDITION_ROUTER_REQUEST_KEYS.RULE_DETAILS]);
            if (!isEmpty(ruleData)) {
                conditionData[CONDITION_ROUTER_RESPONSE_KEYS.RULE_DETAILS] = {
                    [CONDITION_ROUTER_RESPONSE_KEYS.RULE_NAME]: ruleData?.[CONDITION_ROUTER_REQUEST_KEYS.RULE_NAME],
                    [CONDITION_ROUTER_RESPONSE_KEYS.RULE_UUID]: ruleData?.[CONDITION_ROUTER_REQUEST_KEYS.RULE_UUID],
                };
            } else {
                conditionData[CONDITION_ROUTER_RESPONSE_KEYS.RULE_DETAILS] = {};
            }
            conditionData[CONDITION_ROUTER_RESPONSE_KEYS.STEPS] = [];
            eachCondition?.[CONDITION_ROUTER_REQUEST_KEYS.STEPS]?.forEach((stepUuid) => {
                const selectedStep = stepsList.find((stepData) => stepData.value === stepUuid);
                if (selectedStep) {
                    conditionData[CONDITION_ROUTER_RESPONSE_KEYS.STEPS].push({
                        ...selectedStep,
                    });
                }
            });
            return conditionData;
        });
    } else {
        data[CONDITION_ROUTER_RESPONSE_KEYS.STEPS] = [];
        apiData?.[CONDITION_ROUTER_REQUEST_KEYS.BRANCH_CONFIG]?.[CONDITION_ROUTER_REQUEST_KEYS.STEPS]?.forEach((stepUuid) => {
            const selectedStep = stepsList.find((stepData) => stepData.value === stepUuid);
            if (selectedStep) {
                data[CONDITION_ROUTER_RESPONSE_KEYS.STEPS].push({
                    ...selectedStep,
                });
            }
        });
    }
    return data;
};
