import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import ConfigModal from '../../../../../components/config_modal/ConfigModal';
import { STEP_TYPE } from '../../../../../utils/Constants';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../node_configuration/use_node_reducer/useNodeReducer';
import StatusDropdown from '../status_dropdown/StatusDropdown';
import { BRANCH_PARALLEL_PATHS_STRINGS, CONDITION_PATH_ROUTER_STRINGS } from './BranchParallelPaths.strings';
import GeneralConfiguration from './general/GeneralConfiguration';
import { isEmpty, cloneDeep } from '../../../../../utils/jsUtility';
import { NODE_CONFIG_TABS } from '../../../node_configuration/NodeConfiguration.constants';
import NodeConfigError from '../../../node_configuration/node_config_error/NodeConfigError';
import { DELETE_STEP_LABEL } from '../../../../../utils/strings/CommonStrings';
import { constructBranchParallelValidationData, formatBranchParallelPathsData, saveConditionRouterPostData } from './BranchParallelPaths.utils';
import { validate } from '../../../../../utils/UtilityFunctions';
import { parallelBranchValidationSchema } from './BranchParallelPaths.validation.schema';
import styles from './BranchParallelPaths.module.scss';
import { CONDITION_ROUTER_RESPONSE_KEYS } from './BranchParallelPaths.constants';
import { CONNECTOR_LINE_INIT_DATA } from '../../../diagramatic_flow_view/flow_component/FlowComponent.constants';
import { CONFIG_BUTTON_ARRAY, ENDSTEP_CONFIG_TAB, RESPONSE_FIELD_KEYS } from '../end_step/EndStepConfig.constants';
import { displayErrorBasedOnActiveTab, getErrorTabsList } from '../../../node_configuration/NodeConfiguration.utils';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';
import { displayErrorToast } from '../../../../../utils/flowErrorUtils';
import { FLOW_STRINGS } from '../../../EditFlow.strings';

function BranchParallelPaths(props) {
    const { updateFlowStateChange, stepId, stepType,
        steps = [], metaData, saveStepNode, getStepNodeDetails,
        isLoadingNodeDetails,
        isErrorInLoadingNodeDetails,
        addNewNode,
        onDeleteStepClick,
        saveConnectorLines,
    } = props;

    const { t } = useTranslation();
    const isParallelStep = stepType === STEP_TYPE.PARALLEL_STEP;
    const configStrings = isParallelStep ? BRANCH_PARALLEL_PATHS_STRINGS(t) : CONDITION_PATH_ROUTER_STRINGS(t);
    const [tabIndex, setTabIndex] = useState(NODE_CONFIG_TABS.GENERAL);
    const { state, dispatch } = useFlowNodeConfig();

    const {
        stepStatus,
        stepName,
        errorList,
    } = state;

    const onDataChangeHandler = (data = {}) => {
        dispatch(nodeConfigDataChange({
            ...data,
        }));
    };

    const onCancelClick = () => {
        updateFlowStateChange({
            selectedStepType: null,
            activeStepId: null,
            isNodeConfigOpen: false,
        });
    };

    const handleServerErrors = (errorList) => {
        dispatch(nodeConfigDataChange({
          errorList,
        }));
      };

    const saveConnectedSteps = (connectedSteps) => {
        try {
            saveConnectorLines(
                {
                    flow_id: metaData.flowId,
                    source_step: state?.stepUuid,
                    connector_lines: connectedSteps,
                },
                {
                isNodeConfigOpen: false,
                activeStepId: null,
                },
                true,
            );
        } catch (e) {
            displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.CONNECTOR_LINE_API_ERROR);
        }
    };

    const onSaveClicked = () => {
        const errorList = validate(constructBranchParallelValidationData(state), parallelBranchValidationSchema(t));
        dispatch(nodeConfigDataChange({
            errorList,
            isSaveClicked: true,
        }));
        if (isEmpty(errorList)) {
            const postData = saveConditionRouterPostData({ ...state, flow_id: metaData.flowId }, t);
            saveStepNode(postData, handleServerErrors)
                .then(async () => {
                    const stateData = cloneDeep(state);
                    const connectedSteps = state?.connectedSteps || [];
                    if (stateData[CONDITION_ROUTER_RESPONSE_KEYS.IS_CONDITIONAL]) {
                        stateData[CONDITION_ROUTER_RESPONSE_KEYS.DEFAULT_STEPS].forEach((step) => {
                            if (isEmpty(connectedSteps?.find((connectedStep) => connectedStep.destination_step === step.value))) {
                                connectedSteps.push({
                                    ...CONNECTOR_LINE_INIT_DATA,
                                    destination_step: step.value,
                                });
                            }
                        });
                        stateData?.condition?.forEach((eachCondition) => {
                            eachCondition[CONDITION_ROUTER_RESPONSE_KEYS.STEPS].forEach((step) => {
                                if (isEmpty(connectedSteps?.find((connectedStep) => connectedStep.destination_step === step.value))) {
                                    connectedSteps.push({
                                        ...CONNECTOR_LINE_INIT_DATA,
                                        destination_step: step.value,
                                    });
                                }
                            });
                        });
                    } else {
                        stateData[CONDITION_ROUTER_RESPONSE_KEYS.STEPS].forEach((step) => {
                            if (isEmpty(connectedSteps?.find((connectedStep) => connectedStep.destination_step === step.value))) {
                                connectedSteps.push({
                                    ...CONNECTOR_LINE_INIT_DATA,
                                    destination_step: step.value,
                                });
                            }
                        });
                    }
                    saveConnectedSteps(connectedSteps);
                })
                .catch((error) => {
                    console.log('save step error', error);
                });
        } else {
            displayErrorBasedOnActiveTab(tabIndex, state?.stepType, errorList, t);
        }
    };
    const onStepNameChangeHandler = (e, isOnBlur) => {
        const { target: { id } } = e;
        let { target: { value } } = e;
        let errors = {};
        const { errorList = {} } = cloneDeep(state);
        if (isOnBlur) {
          value = value?.trim?.();
        }
        if (errorList?.[id] || isOnBlur) {
          errors = validate({ stepName: value?.trim?.() }, constructJoiObject({ [id]: basicNodeValidationSchema(t)?.[id] }));
        }
        console.log('onStepNameChangeEvent_Parallel', e, 'value', value, 'errors', errors, 'id', id);
        if (isEmpty(errors)) {
          delete errorList?.[id];
        }
        dispatch(
          nodeConfigDataChange({
            [id]: value,
            errorList: {
              ...errorList,
              ...errors,
            },
          }),
        );
    };

    const onStatusChangeHandler = (id, value) => {
        dispatch(
          nodeConfigDataChange({
            [id]: value,
          }),
        );
    };

    const getConditionRouterDetails = async () => {
        try {
            const apiStepDetails = await getStepNodeDetails(stepId);
            const stepsList = [];
            steps?.forEach?.((eachStep) => {
                if (
                    (eachStep?._id !== stepId) &&
                    (eachStep.step_type !== STEP_TYPE.START_STEP) &&
                    !((eachStep.step_type === STEP_TYPE.JOIN_STEP) && isParallelStep)
                ) {
                    stepsList.push({
                        id: eachStep.step_uuid,
                        label: eachStep?.step_name,
                        value: eachStep?.step_uuid,
                    });
                }
            });
            const modifiedStepDetails = formatBranchParallelPathsData(apiStepDetails, stepsList, isParallelStep);
            console.log('modiedstep', apiStepDetails, modifiedStepDetails);
            dispatch(
                nodeConfigDataChange({
                    ...modifiedStepDetails,
                    stepsList: stepsList,
                }),
            );
        } catch (e) {
            console.log('modiedstep e', e);
        }
    };

    useEffect(() => {
        if (!isEmpty(stepId)) {
            getConditionRouterDetails();
        }
    }, [stepId]);

    let currentTabDetails = null;

    if (!isLoadingNodeDetails) {
        if (isErrorInLoadingNodeDetails) {
            currentTabDetails = (
                <NodeConfigError />
            );
        } else if (tabIndex === NODE_CONFIG_TABS.GENERAL) {
            currentTabDetails = (
                <GeneralConfiguration
                    configStrings={configStrings.GENERAL}
                    isParallelStep={isParallelStep}
                    isConditional={state?.isConditional}
                    state={state}
                    onDataChangeHandler={onDataChangeHandler}
                    addNewNode={addNewNode}
                    updateFlowStateChange={updateFlowStateChange}
                    metaData={metaData}
                />
            );
        } else {
            currentTabDetails = (
                <StatusDropdown
                    selectedValue={stepStatus}
                    onChangeHandler={onStepNameChangeHandler}
                    stepName={stepName}
                    stepNameError={errorList?.stepName}
                    onClickHandler={(value) =>
                        onStatusChangeHandler(RESPONSE_FIELD_KEYS.STEP_STATUS, value)
                    }
                />
            );
        }
    }

    const footerContent = (
        <div className={gClasses.MRA}>
          <Button
            buttonText={t(DELETE_STEP_LABEL)}
            noBorder
            className={styles.DeleteStepButton}
            onClickHandler={() => onDeleteStepClick(stepId)}
          />
        </div>
      );

    return (
        <ConfigModal
            isModalOpen
            errorTabList={state?.isSaveClicked && getErrorTabsList(
                state?.stepType,
                state?.errorList,
              )}
            onCloseClick={onCancelClick}
            modalBodyContent={currentTabDetails}
            modalTitle={configStrings.TITLE}
            currentTab={tabIndex}
            tabOptions={ENDSTEP_CONFIG_TAB(t)}
            onTabSelect={(tabValue) => setTabIndex(tabValue)}
            footercontent={footerContent}
            footerButton={CONFIG_BUTTON_ARRAY(onSaveClicked, onCancelClick, t)}
        />
    );
}

export default BranchParallelPaths;
