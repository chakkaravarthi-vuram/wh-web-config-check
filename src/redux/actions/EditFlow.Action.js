import {
  saveFlow,
  getFlowDetailsById,
  apiGetAllFlowSteps,
  getAllSteps,
  publishFlow,
  deleteForm,
  getAllFields,
  apiSaveRule,
  checkFieldDependencyApi,
  checkFormDependencyApi,
  apiGetRuleDetailsById,
  saveFlowStepStatuses,
  apiGetAllFieldsList,
  discardFlow,
  deleteFlow,
  createStep,
  updateStepOrder,
  deleteConnectorLine,
  checkFlowDependencyApi,
  validateFlow,
  getFlowLanguagesTranslationStatus,
} from 'axios/apiService/flow.apiService';
import { translate } from 'language/config';
import {
  get,
  isEmpty,
  isArray,
  has,
  cloneDeep,
  nullCheck,
  isNull,
  set,
  isObject,
  translateFunction,
  uniqBy,
} from 'utils/jsUtility';
import {
  EDIT_FLOW_TAB_INDEX,
  FLOW_STRINGS,
  FLOW_CONFIG_STRINGS,
} from 'containers/edit_flow/EditFlow.strings';
import {
  clearEditFlowData,
  getFlowDataSuccess,
  saveDefaultRuleAction,
  saveRuleAction,
  updateFlowDataChange,
  updateFlowStateChange,
} from 'redux/reducer/EditFlowReducer';
import {
  rearrangeStepList,
  setPointerEvent,
  updatePostLoader,
  routeNavigate,
} from 'utils/UtilityFunctions';
import {
  DROPDOWN_CONSTANTS,
  EMPTY_STRING,
  ERROR_LABEL,
  FORM_POPOVER_STRINGS,
  PUBLISHED_LABEL,
  VALIDATION_ERROR_TYPES,
} from 'utils/strings/CommonStrings';
import {
  getActiveUsers,
  INITIAL_ACTION_VALUE,
} from 'containers/edit_flow/EditFlow.utils';
import {
  generateGetServerErrorMessage,
  generatePostServerErrorMessage,
} from 'server_validations/ServerValidation';
import { FORM_POPOVER_STATUS, STEP_TYPE, ROUTE_METHOD } from 'utils/Constants';
import {
  handleAllStepErrors,
} from 'utils/flowErrorUtils';
import {
  getUpdatedFields,
} from 'utils/formUtils';
import {
  FIELD_KEYS,
  FIELD_TYPE,
} from 'utils/constants/form.constant';
import { PUBLISH_FLOW, PUBLISH_TEST_FLOW } from 'urls/ApiUrls';
import {
  ALL_PUBLISHED_FLOWS,
  EDIT_FLOW,
  LIST_FLOW,
  FLOW_TEST_BED_MANAGED_BY_YOU,
} from 'urls/RouteConstants';
import {
  getDataFromRuleFields,
  getSelectedOperatorInfo,
} from 'utils/rule_engine/RuleEngine.utils';
import { QUERY_BUILDER_INITIAL_STATE } from 'components/query_builder/QueryBuilder.strings';
import { getVisibilityExternalFieldsData } from 'redux/reducer';
import { getNewStepInitData, getStepOrderData } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { FLOW_DROPDOWN } from 'containers/flow/listFlow/listFlow.strings';
import { ACTION_TYPE } from 'utils/constants/action.constant';
import { addNewCategoryApiService, getCategoryApiService } from 'axios/apiService/form.apiService';
import { getStepCoordinates, getStepCoordinatesForNewStep } from 'containers/edit_flow/diagramatic_flow_view/DigramaticFlowView.utils';
import { EToastPosition, EToastType, NodeHandlerPosition, toastPopOver } from '@workhall-pvt-lmt/wh-ui-library';
import { store } from '../../Store';
import { refreshFlowListStarted } from './FlowListActions';
import { externalFieldsDataChange } from './DefaultValueRule.Action';
import { externalFieldDataChange, getExternalFieldsOnSuccess, setOperators, updateTableColConditionList } from './Visibility.Action';
import { getFlowDataByLocale, saveConnectorLineApi, saveFlowDataByLocale, saveStartStepApi, saveStep } from '../../axios/apiService/flow.apiService';
import { getActionPostData, getModifiedLocaleFlowData, getNewActionData } from '../../containers/edit_flow/step_configuration/StepConfiguration.utils';
import { getTableColConditionList } from '../../utils/formUtils';
import { FIELD_LIST_TYPE } from '../../utils/constants/form.constant';
import { DEPENDENCY_ERRORS } from '../../components/dependency_handler/DependencyHandler.constants';
import { calculateActionButtonName, formatGetFlowDataResponse, getCreateFlowValidateData, getFormatStepDataForFlowDiagram, updateSomeoneIsEditingPopover } from '../../containers/edit_flow/EditFlow.utils';
import { ERROR_TYPE_PATTERN_BASE_ERROR, SOMEONE_EDITING } from '../../utils/ServerValidationUtils';
import { getFlowStrings } from '../../containers/flows/Flow.strings';
import { displayErrorToast, getErrorDetailsForCreateStep, handleCommonErrors } from '../../utils/flowErrorUtils';
import { handlePostErrorData, saveActionThunk, saveStepCoordinatesThunk } from './FlowStepConfiguration.Action';
import { DEFAULT_STEP_STATUS, JOIN_STEP_CONDITIONS } from '../../containers/edit_flow/EditFlow.constants';
import { GET_ALL_FIELDS_LIST_BY_FILTER_TYPES, STEP_LABELS } from '../../containers/edit_flow/EditFlow.strings';
import { SETTINGS_PAGE_TAB } from '../../containers/edit_flow/settings_configuration/SettingsConfiguration.utils';
import { constructPolicyForResponse } from '../../containers/edit_flow/security/policy_builder/PolicyBuilder.utils';
import { constructIndexingFields, getFieldLabelWithRefName, showToastPopover } from '../../utils/UtilityFunctions';
import { VALIDATION_CONSTANT } from '../../utils/constants/validation.constant';
import { CONNECTOR_LINE_INIT_DATA, CONNECTOR_LINE_TYPE, MULTI_OUTPUT_NODES } from '../../containers/edit_flow/diagramatic_flow_view/flow_component/FlowComponent.constants';
import { updateLoaderStatus } from '../../containers/edit_flow/node_configuration/NodeConfiguration.utils';

const { ERRORS } = FLOW_CONFIG_STRINGS;
const { FAILED_TO_PUBLISH_FLOW } = FORM_POPOVER_STRINGS;

export const getAllStepsListThunk =
  (flowId, stepId, updatedFlowData, rearrangeSteps = false, currentStepCoordinates = {}, ignoreStepTypeList = [], additionalParams = {}) => (dispatch) => {
    dispatch(updateFlowStateChange({ fetchingAllStepsData: true }));
    if (!additionalParams?.isValidateTwoProgressStep) {
      setPointerEvent(true);
      updatePostLoader(true);
    }
    getAllSteps({ flow_id: flowId, current_step_id: stepId })
      .then((res) => {
        if (!additionalParams?.isValidateTwoProgressStep) {
          setPointerEvent(false);
          updatePostLoader(false);
        }
        if (!isEmpty(res)) {
          const stepsList = [];
          if (!isEmpty(res.steps)) {
            if (!rearrangeSteps) {
              res.steps.forEach((step) => {
                if (!ignoreStepTypeList.includes(step.step_type)) {
                  stepsList.push({
                    [DROPDOWN_CONSTANTS.OPTION_TEXT]: step.step_name,
                    [DROPDOWN_CONSTANTS.VALUE]: step.step_uuid,
                    step_type: step.step_type,
                    _id: step._id,
                  });
                }
              });
            } else {
              const updatedStepList = rearrangeStepList(currentStepCoordinates, res.steps, ignoreStepTypeList);
              updatedStepList.forEach((step) => {
                stepsList.push({
                  [DROPDOWN_CONSTANTS.OPTION_TEXT]: step.step_name,
                  [DROPDOWN_CONSTANTS.VALUE]: step.step_uuid,
                  step_type: step.step_type,
                });
              });
            }
          }
          console.log(stepsList);
          dispatch(updateFlowDataChange({ stepsList }));
          dispatch(updateFlowStateChange({ fetchingAllStepsData: false }));
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generatePostServerErrorMessage(err);
          dispatch(
            updateFlowStateChange({
              common_server_error: errors.common_server_error,
              fetchingAllStepsData: false,
            }),
          );
        }
      })
      .catch((err) => {
        console.log('123333catch', err);
        setPointerEvent(false);
        updatePostLoader(false);
        const errorObject = {};
        const flowState = store.getState().EditFlowReducer;
        console.log(flowState);
        const errors = generatePostServerErrorMessage(
          err,
          flowState.server_error,
          FLOW_STRINGS.FLOW_LABELS,
        );
        errorObject.server_error = errors.state_error ? errors.state_error : [];
        errorObject.common_server_error = errors.common_server_error
          ? errors.common_server_error
          : EMPTY_STRING;
        dispatch(
          updateFlowStateChange({
            ...errorObject,
            savingFlowData: false,
          }),
        );
        showToastPopover(
          translate(ERROR_LABEL),
          translate(ERRORS.FAILED_TO_SAVE_FLOW),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      });
  };

export const updateStepOrderApiThunk = (data, t = translateFunction, noLoader = false) => (dispatch) =>
  new Promise((resolve) => {
    const { isFromPromptCreation } = store.getState().EditFlowReducer;
    if (!isFromPromptCreation || !noLoader) {
      dispatch(updateFlowStateChange({
        updateStepOrderLoading: true,
      }));
      setPointerEvent(true);
      updatePostLoader(true);
    }
    updateStepOrder(data)
      .then((res) => {
        if (!isFromPromptCreation || !noLoader) {
          setPointerEvent(false);
          updatePostLoader(false);
        }
        if (res) {
          resolve(true);
          console.log('Step reorder success');
          resolve(true);
        } else {
          resolve(false);
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generatePostServerErrorMessage(err);
          dispatch(updateFlowStateChange({
            updateStepOrderLoading: false,
            common_server_error: errors.common_server_error,
          }));
        }
        resolve(false);
      })
      .catch((err) => {
        if (!isFromPromptCreation || noLoader) {
          setPointerEvent(false);
          updatePostLoader(false);
        }
        if (err?.response?.data?.errors?.[0]?.type === SOMEONE_EDITING) {
          updateSomeoneIsEditingPopover(err.response.data.errors[0].message);
        } else {
          const errorObject = {};
          const flowState = store.getState().EditFlowReducer;
          const errors = generatePostServerErrorMessage(
            err,
            flowState.server_error,
            FLOW_STRINGS.FLOW_LABELS,
          );
          errorObject.server_error = errors.state_error ? errors.state_error : [];
          errorObject.common_server_error = errors.common_server_error
            ? errors.common_server_error
            : EMPTY_STRING;
          dispatch(updateFlowStateChange({
            updateStepOrderLoading: false,
            ...errorObject,
          }));
          displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.UPDATE_FAILURE(t));
        }
        resolve(false);
      });
  });

export const updateStepCoordinatesAfterLinkChange = (flowData = {}, index = -1, stepData = {}, _isFromSaveStep, isUpdateStepData = true) => (dispatch) => {
  const flowDataCopy = cloneDeep(flowData);
  if (index > -1) {
    if (isUpdateStepData) {
      flowDataCopy.steps[index] = {
        ...stepData,
        connected_steps: flowDataCopy.steps[index]?.connected_steps || [],
      };
    }

    const coordinate_data = getStepCoordinates(flowDataCopy);
    const data = {
      flow_id: flowData.flow_id,
      flow_uuid: flowData.flow_uuid,
      coordinate_data,
    };
    const { steps } = cloneDeep(flowDataCopy);
    (coordinate_data || []).forEach(({ step_id, coordinate_info }) => {
      const stepIndex = steps.findIndex(({ _id }) => _id === step_id);
      if (stepIndex > -1) {
        steps[stepIndex].coordinate_info = coordinate_info;
      }
    });
    set(flowDataCopy, 'steps', steps);
    console.log('check step update action', cloneDeep(steps));
    dispatch(updateFlowDataChange({ ...flowDataCopy }));
    dispatch(saveStepCoordinatesThunk(data));
  }
};

export const updateLinks = ({
  stepData, flowData, index, updatedActionData, saveStepActionCall = true,
}) => async (dispatch) => {
  if (saveStepActionCall) {
    const postData = {
      actions: getActionPostData(updatedActionData),
      _id: stepData._id,
      step_uuid: stepData.step_uuid,
      flow_id: flowData.flow_id,
      connected_steps: stepData.connected_steps || [],
    };
    try {
      const updatedFlowData = await dispatch(saveActionThunk({
        postData,
        hideFlowDropdown: true,
        flowDataCopy: flowData,
      }));
      console.log(updatedFlowData, 'saveActiponRessaveActiponRes');
    } catch (e) {
      console.log(e, 'saveAction failure ');
    }
  } else {
    dispatch(updateStepCoordinatesAfterLinkChange(flowData, index, stepData));
  }
};

export const linkSelectedStep = ({
  newStepUuid,
  connectToStepId,
  flowDataCopy,
  updateConnectedStep = true,
  createNewAction = false,
  newActionType = ACTION_TYPE.FORWARD,
  actionRootString = 'Submit',
  noSaveStep = false,
}) => (dispatch) => {
  const flowData = cloneDeep(flowDataCopy);
  const { steps } = cloneDeep(flowData);
  const index = steps.findIndex((step) => step._id === connectToStepId);
  if (index > -1) {
    const stepData = cloneDeep(steps[index]);
    let connected_steps = [];
    if (!isArray(stepData.connected_steps) || isEmpty(stepData.connected_steps)) {
      connected_steps = [];
    } else {
      connected_steps = cloneDeep(stepData.connected_steps);
    }
    if (updateConnectedStep) {
      if (stepData.step_type === STEP_TYPE.JOIN_STEP || stepData.step_type === STEP_TYPE.FLOW_TRIGGER) {
        connected_steps = [];
      }
      connected_steps.push({
        step_uuid: newStepUuid,
        style: 'step',
      });
    }
    set(stepData, ['connected_steps'], connected_steps);
    const actions = cloneDeep(stepData.actions) || [];
    let updatedActionData = {};
    if (createNewAction &&
      [STEP_TYPE.USER_STEP, STEP_TYPE.FLOW_TRIGGER, STEP_TYPE.INTEGRATION, STEP_TYPE.ML_MODELS].includes(stepData.step_type)) {
      const connectedIndex = flowData.steps.findIndex((step) => step.step_uuid === newStepUuid);
      console.log('DOM exception error 3', connectedIndex, flowData.steps, calculateActionButtonName(stepData?.actions, actionRootString));
      updatedActionData = {
        ...getNewActionData(actions.length),
        isActionConfigPopupVisible: false,
        action_name: calculateActionButtonName(stepData?.actions, actionRootString),
        action_type: newActionType,
        next_step_uuid: [newStepUuid],
        action_next_output_value: newStepUuid,
        ...(connectedIndex > -1) ? { action_next_step_name: flowData.steps[connectedIndex].step_name } : null,
      };
      actions.push(updatedActionData);
      stepData.actions = actions;
    } else if ([STEP_TYPE.PARALLEL_STEP, STEP_TYPE.JOIN_STEP].includes(stepData.step_type)) {
      let actionCopy = cloneDeep(actions?.[0] || {});
      if (!isEmpty(actionCopy)) {
        if (stepData.step_type === STEP_TYPE.PARALLEL_STEP) {
          if (isEmpty(actionCopy?.next_step_uuid)) actionCopy.next_step_uuid = [];
          actionCopy.next_step_uuid.push(newStepUuid);
        }
        if (stepData.step_type === STEP_TYPE.JOIN_STEP) actionCopy.next_step_uuid = [newStepUuid];
      } else {
        actionCopy = cloneDeep(INITIAL_ACTION_VALUE);
        actionCopy.next_step_uuid.push(newStepUuid);
      }
      actionCopy.action_type = newActionType;
      if (newActionType === ACTION_TYPE.END_FLOW) {
        delete actionCopy?.is_next_step_rule;
      }
      updatedActionData = actionCopy;
      stepData.actions = [updatedActionData];
    }
    flowData.steps[index] = cloneDeep(stepData);
    dispatch(updateLinks({
      stepData, flowData, index, updatedActionData, saveStepActionCall: !noSaveStep,
    }));
  }
};

export const createNewStepWithCoordinates = ({
  params, additionalData, firstStep = false, saveStepId, updateConnectedStepAlone = false,
  callbackFunction, createNewAction = false, newActionType = ACTION_TYPE.FORWARD, actionRootString = 'Submit',
  waitForCallback = false,
}) => (dispatch) => {
  const { flowData, isFromPromptCreation } = cloneDeep(store.getState().EditFlowReducer);
  setPointerEvent(true);
  updatePostLoader(true);
  if (!waitForCallback) dispatch(updateFlowDataChange({ isCreateNewStepLoading: true }));
  let createStepAPI = createStep;
  if (params.step_type === STEP_TYPE.JOIN_STEP) {
    createStepAPI = saveStep;
    delete params.flow_uuid;
    delete params?.coordinate_info;
    params.join_condition = { type: JOIN_STEP_CONDITIONS.ALL };
    params.step_order = (flowData?.steps || []).length + 1;
  } else if (!params?.coordinate_info) {
    params.coordinate_info = getStepCoordinatesForNewStep(
      cloneDeep(flowData),
      { step_uuid: 'new_step', step_name: params.step_name, step_type: params.step_type },
    );
  }
  return new Promise((resolve) => {
    createStepAPI({
      ...params,
    })
      .then(async (response) => {
        if (!isFromPromptCreation) {
          setPointerEvent(false);
          updatePostLoader(false);
        }
        const newStepData = getNewStepInitData(response, params);
        if (firstStep) {
          flowData.steps = [newStepData];
        } else {
          flowData.steps.push(newStepData);
        }
        // Link the created step
        let callBackFn = (flowData) => {
          dispatch(linkSelectedStep({
            newStepUuid: response.step_uuid,
            connectToStepId: saveStepId,
            flowDataCopy: flowData,
          }));
        };
        if (saveStepId) {
          if (updateConnectedStepAlone) {
            const { steps } = flowData;
            const index = steps.findIndex((step) => step._id === saveStepId);
            if (index > -1) {
              const stepData = flowData.steps[index];
              let connected_steps = [];
              let actionValue = {};
              if (stepData.step_type !== STEP_TYPE.FLOW_TRIGGER) {
                if (stepData.actions && stepData.actions[0]) {
                  [actionValue] = cloneDeep(stepData.actions);
                } else {
                  actionValue = cloneDeep(INITIAL_ACTION_VALUE);
                }
                actionValue.action_type = newActionType;
                if (newActionType === ACTION_TYPE.END_FLOW) {
                  delete actionValue?.is_next_step_rule;
                }
                if (isEmpty(actionValue.next_step_uuid)) {
                  if ([ACTION_TYPE.FORWARD, ACTION_TYPE.END_FLOW].includes(actionValue.action_type)) {
                    actionValue.next_step_uuid = [];
                    actionValue.next_step_uuid.push(response.step_uuid);
                  }
                } else if (stepData.step_type === STEP_TYPE.PARALLEL_STEP) {
                  actionValue.next_step_uuid.push(response.step_uuid);
                } else if (stepData.step_type === STEP_TYPE.JOIN_STEP) {
                  actionValue.next_step_uuid = [];
                  actionValue.next_step_uuid.push(response.step_uuid);
                }
              }
              connected_steps = isArray(stepData.connected_steps) ? cloneDeep(stepData.connected_steps) : [];
              if ([STEP_TYPE.JOIN_STEP, STEP_TYPE.FLOW_TRIGGER].includes(stepData.step_type)) {
                connected_steps = [{
                  step_uuid: response.step_uuid,
                  style: 'step',
                }];
              } else {
                if (!callbackFunction) {
                  connected_steps.push(
                    {
                      step_uuid: response.step_uuid,
                      style: 'step',
                    });
                }
              }
              const uniqueConnectedSteps = uniqBy(connected_steps, (s) => s.step_uuid);
              set(stepData, ['connected_steps'], uniqueConnectedSteps);
              if (stepData.step_type !== STEP_TYPE.FLOW_TRIGGER) set(stepData, ['actions', 0], actionValue);
              dispatch(
                getAllStepsListThunk(
                  flowData.flow_id,
                  saveStepId,
                  flowData,
                ),
              );
              callBackFn = (flowData, noSaveStep = false, createNewAction = false, newActionType = ACTION_TYPE.FORWARD, actionRootString = 'Submit') => {
                dispatch(linkSelectedStep({
                  newStepUuid: response.step_uuid,
                  connectToStepId: saveStepId,
                  flowDataCopy: flowData,
                  createNewAction,
                  newActionType,
                  actionRootString,
                  noSaveStep,
                }));
              };
            }
          }
          dispatch(
            updateFlowStateChange({
              flowData,
              ...additionalData,
            }),
          );
          if (!updateConnectedStepAlone) {
            dispatch(linkSelectedStep({
              newStepUuid: response.step_uuid,
              connectToStepId: saveStepId,
              flowDataCopy: flowData,
              createNewAction,
              newActionType,
              actionRootString,
            }));
          }
        } else {
          if (!waitForCallback) {
            dispatch(
              updateFlowStateChange({
                flowData,
                ...additionalData,
              }),
            );
          }
        }
        if (callbackFunction) {
          await callbackFunction(response, flowData, callBackFn, newStepData);
        }
        resolve(response);
      })
      .catch((err) => {
        console.log('dvfhjdhjghjd', err);
        if (!waitForCallback) dispatch(updateFlowDataChange({ isCreateNewStepLoading: false }));
        if (!isFromPromptCreation) {
          setPointerEvent(false);
          updatePostLoader(false);
        }
        console.log(err, 'create step error');
        const error = get(err, ['response', 'data', 'errors', 0], {});
        switch (error?.type) {
          case SOMEONE_EDITING:
            return updateSomeoneIsEditingPopover(error?.message);
          case VALIDATION_ERROR_TYPES.LIMIT:
            return displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.LIMIT_EXCEEDED);
          case VALIDATION_ERROR_TYPES.EXIST:
            displayErrorToast({
              title: translate('error_popover_status.step_name_exist'),
              subtitle: translate('error_popover_status.step_name_already_exist'),
            });
            break;
          default:
            displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.NEW_STEP_FAILURE);
            break;
        }
        const errorObject = {};
        const flowState = cloneDeep(store.getState().EditFlowReducer);
        const errors = generatePostServerErrorMessage(
          err,
          flowState.server_error,
          FLOW_STRINGS.FLOW_LABELS,
        );
        let stepNameErrorObj = {};
        if (errors.state_error) {
          if (errors.state_error.step_name) {
            stepNameErrorObj = updateConnectedStepAlone ?
              { [FLOW_STRINGS.SERVER_RESPONSE.NEW_STEP_ERROR_KEYS.FROM_SYSTEM_STEP_CONFIG]: errors.state_error.step_name } :
              { [FLOW_STRINGS.SERVER_RESPONSE.NEW_STEP_ERROR_KEYS.FROM_FLOW_DD]: errors.state_error.step_name };
          }
        }
        errorObject.common_server_error = errors.common_server_error
          ? errors.common_server_error
          : EMPTY_STRING;
        dispatch(
          updateFlowStateChange({
            common_server_error: errorObject.common_server_error,
            // flowData,
            ...additionalData,
            ...stepNameErrorObj,
          }),
        );
        return false;
      });
  });
};

export const saveConnectorLine = (params, updatedFlowData = {}, additionalData = {}, updateCoordinates = false) => async (dispatch) => {
  try {
    updateLoaderStatus(true);
    const response = await saveConnectorLineApi(params);
    let { flowData } = cloneDeep(store.getState().EditFlowReducer);
    const { detailedFlowErrorInfo, stepsWithoutLinks = [] } = cloneDeep(store.getState().EditFlowReducer);
    if (!isEmpty(updatedFlowData)) {
      flowData = updatedFlowData;
    }
    updateLoaderStatus(false);
    const sourceStepIndex = flowData.steps.findIndex((step) => step.step_uuid === params.source_step);
    if (!isEmpty(stepsWithoutLinks)) {
      params.connector_lines?.forEach(({ destination_step }) => {
        const destinationStepIndex = stepsWithoutLinks.findIndex((step) => step === destination_step);
        if (destinationStepIndex > -1) {
          stepsWithoutLinks.splice(destinationStepIndex, 1);
        }
      });
      additionalData.stepsWithoutLinks = stepsWithoutLinks;
    }
    const connectedStepsUpdated = [];
    response.connected_steps?.forEach((connectedStep) => {
      connectedStepsUpdated.push({
        ...connectedStep,
        source_step: params.source_step,
      });
    });
    if (!flowData.steps[sourceStepIndex]?.connected_steps?.length) {
      flowData.steps[sourceStepIndex].connected_steps = [];
    }
    flowData.steps[sourceStepIndex].connected_steps = connectedStepsUpdated;
    const selectedSourceNodeErrorIndex = detailedFlowErrorInfo?.findIndex((errorData) => errorData.stepUuid === params.source_step);
    if (selectedSourceNodeErrorIndex > -1) {
    const errorIndex = detailedFlowErrorInfo[selectedSourceNodeErrorIndex]?.errors?.findIndex((errorData) => errorData === translateFunction(VALIDATION_CONSTANT.CONNECTING_STEP_REQUIRED));
    if (errorIndex > -1) {
      detailedFlowErrorInfo[selectedSourceNodeErrorIndex].errors?.splice(errorIndex, 1);
      additionalData.detailedFlowErrorInfo = detailedFlowErrorInfo;
    }
  }
    if (updateCoordinates) {
      const coordinate_data = getStepCoordinates(flowData);
      const data = {
        flow_id: flowData.flow_id,
        flow_uuid: flowData.flow_uuid,
        coordinate_data,
      };
      const { steps } = cloneDeep(flowData);
      (coordinate_data || []).forEach(({ step_id, coordinate_info }) => {
        const stepIndex = steps.findIndex(({ _id }) => _id === step_id);
        if (stepIndex > -1) {
          steps[stepIndex].coordinate_info = coordinate_info;
        }
      });
      set(flowData, 'steps', steps);
      console.log('check step update action', cloneDeep(steps));
      dispatch(saveStepCoordinatesThunk(data));
    }
    return dispatch(
      updateFlowStateChange({
        flowData,
        ...additionalData,
      }),
    );
  } catch (e) {
    updateLoaderStatus(false);
    let { flowData } = cloneDeep(store.getState().EditFlowReducer);
    if (!isEmpty(updatedFlowData)) {
      flowData = updatedFlowData;
    }
    dispatch(
      updateFlowStateChange({
        flowData,
        ...additionalData,
      }),
    );
    throw new Error(e);
  }
};

export const createNewStepApiThunk = ({ params, additionalData, updatedFlowData, connectorDetails = {} }) => async (dispatch) => {
  try {
    updateLoaderStatus(true);
    let { flowData } = cloneDeep(store.getState().EditFlowReducer);
    if (!isEmpty(updatedFlowData)) {
      flowData = cloneDeep(updatedFlowData);
    }
    const connectedStepsList = [];
    let existingConnectedStepIndex = 0;
    const { linkToStep, sourcePosition = NodeHandlerPosition.BOTTOM } = connectorDetails;
    if (linkToStep) {
      let existingConnectedStep = {};
      const flowDataCopy = cloneDeep(flowData);
      const sourceStepIndex = flowDataCopy.steps.findIndex((step) => (step.step_uuid === linkToStep));
      if (sourceStepIndex > -1) {
        // existingConnectedStepIndex = flowDataCopy.steps[sourceStepIndex]?.connected_steps?.length || 0;
        if (!flowDataCopy.steps[sourceStepIndex]?.connected_steps?.length) {
          flowDataCopy.steps[sourceStepIndex].connected_steps = [];
        }
        if (sourcePosition === NodeHandlerPosition.SPECIAL || (
          [STEP_TYPE.INTEGRATION].includes(flowDataCopy.steps[sourceStepIndex].step_type)
        )) {
          existingConnectedStepIndex = flowDataCopy.steps[sourceStepIndex]?.connected_steps?.findIndex((connectedStep) => (
            connectedStep.source_point === sourcePosition
          ));
          if (existingConnectedStepIndex > -1) {
            existingConnectedStep = flowDataCopy.steps[sourceStepIndex].connected_steps[existingConnectedStepIndex];
            set(flowDataCopy, ['steps', sourceStepIndex, 'connected_steps', existingConnectedStepIndex, 'destination_step'], 'newStepUuid');
          } else {
            flowDataCopy.steps[sourceStepIndex].connected_steps.push({
              ...CONNECTOR_LINE_INIT_DATA,
              source_step: linkToStep,
              destination_step: 'newStepUuid',
              source_point: sourcePosition,
              type: sourcePosition === NodeHandlerPosition.SPECIAL ?
                CONNECTOR_LINE_TYPE.EXCEPTION :
                CONNECTOR_LINE_TYPE.NORMAL,
            });
            existingConnectedStepIndex = flowDataCopy.steps[sourceStepIndex].connected_steps.length - 1;
          }
        } else if (MULTI_OUTPUT_NODES.includes(flowDataCopy.steps[sourceStepIndex].step_type)) {
          existingConnectedStep = CONNECTOR_LINE_INIT_DATA;
          flowDataCopy.steps[sourceStepIndex].connected_steps.push({
            ...existingConnectedStep,
            source_step: linkToStep,
            destination_step: 'newStepUuid',
            source_point: sourcePosition,
          });
          existingConnectedStepIndex = flowDataCopy.steps[sourceStepIndex].connected_steps.length - 1;
        } else {
          existingConnectedStep = flowDataCopy.steps[sourceStepIndex]?.connected_steps?.[0] || CONNECTOR_LINE_INIT_DATA;
          flowDataCopy.steps[sourceStepIndex].connected_steps = [{
            ...existingConnectedStep,
            source_step: linkToStep,
            destination_step: 'newStepUuid',
            source_point: sourcePosition,
          }];
          existingConnectedStepIndex = flowDataCopy.steps[sourceStepIndex].connected_steps.length - 1;
        }
        flowDataCopy.steps.push({
          _id: 'newStepUuid',
          step_uuid: 'newStepUuid',
          step_type: params.step_type,
        });
        // params.coordinate_info = targetStepCoordinates?.coordinate_info;
        flowDataCopy.steps[sourceStepIndex]?.connected_steps?.forEach((connectedLink) => {
          delete connectedLink?.source_step;
          connectedStepsList.push({
            ...connectedLink,
          });
        });
      }
    }
    const response = await createStep(params);
        const newStepData = getNewStepInitData(response, params);
        flowData.steps.push(newStepData);
        if (linkToStep) {
          connectedStepsList[existingConnectedStepIndex].destination_step = response.step_uuid;
          dispatch(saveConnectorLine({
            flow_id: params.flow_id,
            source_step: linkToStep,
            connector_lines: connectedStepsList,
          },
          flowData,
          additionalData,
          true,
        ));
        } else {
          updateLoaderStatus(false);
          dispatch(
            updateFlowStateChange({
              flowData,
              ...additionalData,
            }),
          );
        }
        return { isSuccess: true, response, flowData };
      } catch (error) {
        updateLoaderStatus(false);
        console.log('createNewStepApiThunk error', error);
        const errorData = get(error, ['response', 'data', 'errors'], []);
        switch (errorData[0]?.type) {
            case SOMEONE_EDITING:
                updateSomeoneIsEditingPopover(errorData?.message);
                break;
            case VALIDATION_ERROR_TYPES.LIMIT:
                displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.LIMIT_EXCEEDED);
                break;
            default:
                const customErrors = getErrorDetailsForCreateStep(errorData);
                return { isSuccess: false, errors: customErrors };
        }
        return { isSuccess: false };
      }
};

export const createStartStepApiThunk = ({ data }, flowData) => (dispatch) => new Promise((resolve, reject) => {
  setPointerEvent(true);
  updatePostLoader(true);
  console.log('createStartStepApiThunk data', data);
  saveStartStepApi(data)
    .then((response) => {
      setPointerEvent(false);
      updatePostLoader(false);
      const newStepData = getNewStepInitData(response, { step_type: STEP_TYPE.START_STEP });
      flowData.steps = [newStepData];
      dispatch(updateFlowStateChange({
        flowData,
        isFlowDiagramLoading: false,
      }));
    })
    .catch((error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      console.log('createStartStepApi error', error);
      reject(error);
    });
});

export const getAllFlowStepsById = (flowId, flowUuid, clonedFlowData, stepStatusList = []) => async (dispatch) => {
  const flowData = {};
  flowData.flow_id = flowId;
  flowData.flow_uuid = flowUuid;
  flowData.steps = [];
  if (!isEmpty(stepStatusList)) {
    flowData.stepStatuses = stepStatusList;
  }
  try {
    dispatch(
      updateFlowStateChange({
        isFlowDiagramLoading: true,
        isErrorInFetchingFlowDiagram: false,
      }),
    );
    const response = await apiGetAllFlowSteps(flowId);
    const { flow_steps = [], document_url_details = [] } = response;
    if (isEmpty(flow_steps)) {
      let initiatorPostData = {};
      if (!isEmpty(clonedFlowData?.initiators)) {
        if (
          clonedFlowData?.initiators?.teams &&
          clonedFlowData?.initiators?.teams?.length > 0
        ) {
          initiatorPostData.teams = clonedFlowData?.initiators?.teams.map(
            (team) => team._id,
          );
        }

        if (
          clonedFlowData?.initiators?.users &&
          clonedFlowData?.initiators?.users?.length > 0
        ) {
          initiatorPostData.users = clonedFlowData?.initiators?.users.map((user) => user._id);
        }
      } else {
        initiatorPostData = {
          users: [],
          teams: [],
        };
      }

      dispatch(
        createStartStepApiThunk({
          data: {
            flow_id: flowId,
            initiators: initiatorPostData,
            has_auto_trigger: false,
            system_initiation: {
              allow_call_by_flow: true,
              allow_call_by_api: false,
            },
            step_name: translateFunction(STEP_LABELS[STEP_TYPE.START_STEP]),
            coordinate_info: {
              step_coordinates: { x: 0, y: 0 },
            },
          },
          flowId,
          flowUuid,
        }, flowData),
      );
    } else {
      const resData = cloneDeep(flow_steps);
      const formattedStepsData = [];
      resData.forEach((data) => {
        formattedStepsData.push(getFormatStepDataForFlowDiagram(data, { steps: resData }));
      });
      console.log('Response of fetching all flow steps detail', response, formattedStepsData);
      flowData.steps = formattedStepsData;
      flowData.tabIndex = EDIT_FLOW_TAB_INDEX.STEPS;
      flowData.document_url_details = document_url_details;
      dispatch(
        updateFlowStateChange({
          flowData,
          isFlowDiagramLoading: false,
        }),
      );
    }
  } catch (error) {
    console.log('Error in fetching all flow steps detail', error);
    dispatch(
      updateFlowStateChange({ isFlowDiagramLoading: false, isErrorInFetchingFlowDiagram: true, flowData }),
    );
  }
};

export const saveFlowThunk =
  ({
    data,
    loader = true,
    publishFlowFunc,
    changeSettingsPage = false,
    isNewFlow = false,
    history,
    isInitialLoad = false,
    nextPage = null,
    isPublishTest = false,
    dontProcessResponse,
    moveToNextTab,
    clonedFlowData = {},
    currentSettingsPage,
  }, isDefaultreportFieldsNotNeeded) =>
    async (dispatch) => {
      dispatch(updateFlowStateChange({ savingFlowData: true }));
      setPointerEvent(true);
      if (loader) updatePostLoader(true);
      try {
        const res = await saveFlow(data, loader);
        if (!isEmpty(res)) {
          if (dontProcessResponse) {
            setPointerEvent(false);
            if (loader) updatePostLoader(false);
            return true;
          }
          const { EditFlowReducer } = store.getState();
          const { flowData, promptStepsData, isFromPromptCreation, flowSettingsModalVisibility } = cloneDeep(EditFlowReducer);
          clonedFlowData = changeSettingsPage ? cloneDeep(clonedFlowData) : cloneDeep(flowData);
          if (!isFromPromptCreation || isEmpty(promptStepsData)) {
            setPointerEvent(false);
            if (loader) updatePostLoader(false);
          }
          if (isNewFlow) {
            if (isFromPromptCreation) {
              const flowData = formatGetFlowDataResponse(res);
              dispatch(getFlowDataSuccess(flowData));
            }
            const flowTab = get(history, ['location', 'state', 'flow_tab'], FLOW_DROPDOWN.PUBLISHED_FLOW);
            return routeNavigate(history, ROUTE_METHOD.REPLACE, EDIT_FLOW, EMPTY_STRING, {
              flow_uuid: res.flow_uuid,
              flow_tab: flowTab,
              isFromCreateFlow: true,
            });
          } else {
            const defaultReportFieldErrorList = {};
            const triggerDetailsServerError = {};
            const taskIdentifierError = {};
            let customIdentifierError = null;
            let categoryError = null;
            const invalidOwnersError = [];
            const invalidAdminsError = [];
            const invalidViewersError = [];
            const invalidEntityViewersError = [];

            if (flowSettingsModalVisibility || publishFlowFunc) {
              if (!isEmpty(res.validation_message)) {
                res.validation_message.forEach((errorObj) => {
                  const errorKeys = errorObj.field.split('.');
                  if (errorObj.field.includes('owners')) {
                    invalidOwnersError.push(get(data, [...errorObj.field.split('.')]));
                  }
                  if (errorObj.field.includes('admins')) {
                    invalidAdminsError.push(get(data, [...errorObj.field.split('.')]));
                  }
                  if (errorObj.field.includes('entity_viewers')) {
                    invalidEntityViewersError.push(get(data, [...errorObj.field.split('.')]));
                  } else if (errorObj.field.includes('viewers')) {
                    invalidViewersError.push(get(data, [...errorObj.field.split('.')]));
                  }

                  if (errorObj.field.includes('default_report_fields')) {
                    if ([VALIDATION_ERROR_TYPES.ONLY].includes(errorObj.type)) {
                      defaultReportFieldErrorList[errorObj.field] = translate('error_popover_status.fields_deleted');
                    }
                  }
                  if (errorObj.field.includes('trigger_details')) {
                    if (errorObj.indexes?.includes(translate('error_popover_status.invalid_trigger'))) {
                      triggerDetailsServerError[errorKeys[1]] =
                        translate('error_popover_status.mapped_fields_deleted');
                    }
                    if (errorObj.indexes?.includes('invalid child')) {
                      triggerDetailsServerError[errorKeys[1]] =
                        translate('error_popover_status.child_flow');
                    }
                    if (errorObj.indexes?.includes('trigger_details')) {
                      triggerDetailsServerError[errorKeys[1]] =
                        translate('error_popover_status.error_in_shortcut_name');
                    }
                  }
                  if (errorObj?.field?.includes('custom_identifier')) {
                    if ([VALIDATION_ERROR_TYPES.ONLY, VALIDATION_ERROR_TYPES.UNKNOWN].includes(errorObj?.type)) {
                      customIdentifierError = translate('error_popover_status.fields_deleted');
                    }
                  }
                  if (errorObj?.field?.includes('task_identifier')) {
                    if ([VALIDATION_ERROR_TYPES.ONLY, VALIDATION_ERROR_TYPES.EXCLUDES].includes(errorObj?.type)) {
                      set(taskIdentifierError, [errorKeys[1]], translate('error_popover_status.fields_deleted'));
                    }
                  }
                  if (errorObj?.field.includes('category_id')) {
                     if (errorObj?.type === VALIDATION_ERROR_TYPES.NOT_EXIST) {
                      categoryError = translate('error_popover_status.fields_deleted');
                    }
                  }
                });
              }
              if (clonedFlowData?.isFlowTriggerShortcutModalOpen) {
                clonedFlowData.isFlowTriggerShortcutModalOpen = false;
                if (!isEmpty(triggerDetailsServerError)) {
                  clonedFlowData.triggerDetailsServerError = triggerDetailsServerError;
                }
              }
            }
            if (res.category_id) {
              clonedFlowData.category = {
                category_id: res.category_id,
                category_name: res.category_name,
              };
            }
            clonedFlowData.isFlowShortCodeSaved = res?.version > 1;
            clonedFlowData.isTechnicalRefercenNameSaved = res?.version > 1;
            clonedFlowData.flow_data_server = res;
            clonedFlowData.stepStatuses = res?.step_statuses || [DEFAULT_STEP_STATUS];
            clonedFlowData.reassignedOwners = getActiveUsers(res.owners);
            clonedFlowData.owners = getActiveUsers(res.admins);
            const taskIdentifiers = [];
            (res?.task_identifier || []).forEach((taskIdentifier) => {
              taskIdentifiers.push({
                ...taskIdentifier,
                label: getFieldLabelWithRefName(taskIdentifier?.field_name, taskIdentifier?.reference_name),
              });
            });
            clonedFlowData.task_identifier = taskIdentifiers;
            if (!res?.is_system_identifier) {
              clonedFlowData.custom_identifier = {
                ...res?.custom_identifier || {},
                label: getFieldLabelWithRefName(res?.custom_identifier?.field_name, res?.custom_identifier?.reference_name),
              };
            }
            if (data?.send_policy_fields) {
              const policyList = constructPolicyForResponse(res?.security_policies, constructIndexingFields(res?.policy_fields));
              clonedFlowData.is_row_security_policy = res.is_row_security_policy;
              clonedFlowData.policyList = policyList;
              clonedFlowData.policyListMetaData = policyList;
            }

            if (isEmpty(invalidEntityViewersError)) {
              clonedFlowData.entityViewers = cloneDeep(getActiveUsers(res.entity_viewers));
              clonedFlowData.entityViewersMetaData = cloneDeep(getActiveUsers(res.entity_viewers));
            }

            if (isInitialLoad || data?.send_policy_fields) {
              dispatch(externalFieldsDataChange({ field_metadata: res?.policy_fields }));
            }

            if (isEmpty(defaultReportFieldErrorList) && !isDefaultreportFieldsNotNeeded) {
              const defaultReportFields = [];
              (res?.default_report_fields || []).forEach((field) => {
                defaultReportFields.push({
                  customLabel: field.label,
                  label: getFieldLabelWithRefName(field?.field_name, field?.reference_name),
                  value: field.field_uuid,
                  reference_name: field?.reference_name,
                });
              });
              clonedFlowData.default_report_fields = defaultReportFields;
            }
            clonedFlowData.trigger_details = res.trigger_details || [];
            clonedFlowData.has_related_flows = get(res, 'has_related_flows', false);
            clonedFlowData.activeTriggerData = {};
            if (isInitialLoad && res._id) {
              if (isEmpty(clonedFlowData.steps)) {
                return dispatch(getAllFlowStepsById(res._id, res.flow_uuid, clonedFlowData));
              }
            }
            if (changeSettingsPage) {
              const errorList = {};
              let newSettingsPage = currentSettingsPage;
              switch (currentSettingsPage) {
                case SETTINGS_PAGE_TAB.SECURITY:
                  errorList.invalidOwnersError = invalidOwnersError;
                errorList.invalidAdminsError = invalidAdminsError;
                errorList.invalidViewersError = invalidViewersError;
                errorList.invalidEntityViewersError = invalidEntityViewersError;
                if (!isEmpty(invalidOwnersError) || (!isEmpty(invalidAdminsError)) || (!isEmpty(invalidViewersError)) || (!isEmpty(invalidEntityViewersError))) {
                  dispatch(updateFlowStateChange({ currentSettingsPage: newSettingsPage }));
                  return dispatch(updateFlowDataChange({ ...clonedFlowData, ...errorList }));
                }
                break;
              case SETTINGS_PAGE_TAB.DASHBOARD:
                errorList.triggerDetailsServerError = triggerDetailsServerError;
                errorList.defaultReportFieldErrorList = defaultReportFieldErrorList;
                if (!isEmpty(defaultReportFieldErrorList) || !isEmpty(triggerDetailsServerError)) {
                  dispatch(updateFlowStateChange({ currentSettingsPage: newSettingsPage }));
                  return dispatch(updateFlowDataChange({ ...clonedFlowData, ...errorList }));
                }
                break;
              case SETTINGS_PAGE_TAB.ADDON:
                errorList.task_identifier = taskIdentifierError;
                errorList.custom_identifier = customIdentifierError;
                errorList.category = categoryError;
                if (!isEmpty(errorList.task_identifier) || !isEmpty(errorList.custom_identifier) || !isEmpty(categoryError)) {
                  dispatch(updateFlowStateChange({ currentSettingsPage: newSettingsPage }));
                  return dispatch(updateFlowDataChange({ ...clonedFlowData, error_list: errorList }));
                }
                break;
                default:
                  break;
              }
              if ((nextPage < currentSettingsPage) || (nextPage === currentSettingsPage + 1)) {
                newSettingsPage = nextPage;
              } else if (nextPage > currentSettingsPage + 1) {
                return moveToNextTab?.(nextPage, currentSettingsPage + 1, { ...clonedFlowData, ...errorList });
              }
              dispatch(updateFlowStateChange({ currentSettingsPage: newSettingsPage }));
              return dispatch(updateFlowDataChange({ ...clonedFlowData, ...errorList }));
            }
            if (publishFlowFunc) {
              await publishFlowFunc();
              dispatch(
                updateFlowStateChange({
                  savingFlowData: false,
                  flowSettingsModalVisibility: isPublishTest,
                }),
              );
            }
            return dispatch(updateFlowDataChange(clonedFlowData));
          }
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generatePostServerErrorMessage(err);
          setPointerEvent(false);
          if (loader) updatePostLoader(false);
          dispatch(updateFlowDataChange({ isFromPromptCreation: false }));
          dispatch(
            updateFlowStateChange({
              common_server_error: errors.common_server_error,
              savingFlowData: false,
            }),
          );
          return false;
        }
      } catch (error) {
        setPointerEvent(false);
        updatePostLoader(false);
        const errorData = get(error, ['response', 'data', 'errors', 0], {});
        const flowState = store.getState().EditFlowReducer;
        const { flowSettingsModalVisibility } = flowState;

        dispatch(updateFlowDataChange({ isFromPromptCreation: false }));
        if (errorData.type === SOMEONE_EDITING) {
          return updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
        } else if (errorData.type === VALIDATION_ERROR_TYPES.LIMIT) {
          return displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.LIMIT_EXCEEDED);
        } else if (errorData.type === VALIDATION_ERROR_TYPES.EXIST) {
            dispatch(
              updateFlowStateChange({
                savingFlowData: false,
                server_error: {
                  flow_name: `${translateFunction('flows.flow_name_title')} ${translateFunction('server_validation_constants.already_exist')} `,
                },
              }),
            );
        } else {
          const server_error = cloneDeep(flowState.server_error);
          const errors = generatePostServerErrorMessage(
            error,
            server_error,
            FLOW_STRINGS.FLOW_LABELS,
          );
          dispatch(updateFlowStateChange({ savingFlowData: false, server_error: errors?.state_error }));

          let errorMessage = {};
          if (flowSettingsModalVisibility) {
            // if (currentSettingsPage === SETTINGS_PAGE_TAB.LANGUAGE) {
            //   errorMessage = FLOW_STRINGS.SERVER_RESPONSE.PUBLISH_FLOW_FAILURE;
            // } else
            errorMessage = FLOW_STRINGS.SERVER_RESPONSE.SAVE_FLOW_FAILURE;
          } else {
            errorMessage = FLOW_STRINGS.SERVER_RESPONSE.CREATE_FLOW_FAILURE;
          }
          if (errorData?.field === 'name' &&
            errorData.type === ERROR_TYPE_PATTERN_BASE_ERROR) {
            displayErrorToast(errorMessage);
          }
        }
        dispatch(updateFlowStateChange({ savingFlowData: false }));
        return false;
      }
    };

export const getFlowDetailsByIdApi = (params) => (dispatch) => {
  dispatch(
    updateFlowStateChange({
      editFlowInitialLoading: true,
      isEditFlowView: true,
      isErrorInGettingFlowData: false,
    }),
  );
  dispatch(
    updateFlowDataChange({
      isFlowModalDisabled: true,
      flow_id: params._id,
      isFromPromptCreation: false,
    }),
  );
  getFlowDetailsById(params)
    .then((res) => {
      const flowData = formatGetFlowDataResponse(res);
      dispatch(getFlowDataSuccess(flowData));
      const savePostData = getCreateFlowValidateData(flowData);
      dispatch(saveFlowThunk({
        data: { ...savePostData, send_policy_fields: true },
        loader: false,
        isInitialLoad: true,
      }));
    })
    .catch((err) => {
      console.log('flow changes error', err);
      setPointerEvent(false);
      updatePostLoader(false);
      dispatch(
        updateFlowStateChange({
          isErrorInGettingFlowData: true,
        }),
      );
    });
};

export const validateFlowThunk = (data, t) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  return new Promise((resolve) => {
    validateFlow(data)
      .then((response) => {
        setPointerEvent(false);
        updatePostLoader(false);
        resolve(true);
        console.log('Valiidate flow res', response);
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        const { EditFlowReducer } = store.getState();
        const { flowData } = cloneDeep(EditFlowReducer);
        const { detailedFlowErrorInfo, brokenSteps } = handleAllStepErrors(error, flowData.steps);
        if (!isEmpty(detailedFlowErrorInfo) || !isEmpty(brokenSteps)) {
          displayErrorToast({
            title: t(VALIDATION_CONSTANT.SAVE_FLOW_FAILED),
          });
          resolve(false);
        } else {
          resolve(true);
        }
        console.log('Valiidate flow error', detailedFlowErrorInfo);
        dispatch(updateFlowStateChange({ detailedFlowErrorInfo, brokenSteps }));
        setPointerEvent(false);
        updatePostLoader(false);
      });
  });
};

export const publishFlowThunk = (data, isTestFlow, history, t = translateFunction) => (dispatch) => new Promise((resolve) => {
  setPointerEvent(true);
  updatePostLoader(true);
  const apiUrl = isTestFlow ? PUBLISH_TEST_FLOW : PUBLISH_FLOW;
  publishFlow(data, apiUrl)
    .then((res) => {
      setPointerEvent(false);
      updatePostLoader(false);
      if (!isEmpty(res)) {
        const popoverContent = isTestFlow
          ? {
            title: t(PUBLISHED_LABEL),
            subtitle: t(FORM_POPOVER_STRINGS.TEST_FLOW_PUBLISHED_SUCCESSFULLY),
          }
          : {
            title: t(PUBLISHED_LABEL),
            subtitle: t(FORM_POPOVER_STRINGS.FLOW_PUBLISHED_SUCCESSFULLY),
          };
        toastPopOver({
          ...popoverContent,
          toastType: EToastType.success,
          toastPosition: EToastPosition.BOTTOM_LEFT,
        });
        dispatch(clearEditFlowData());
        dispatch(refreshFlowListStarted());
        const redirectPath = `${LIST_FLOW}${isTestFlow
          ? FLOW_TEST_BED_MANAGED_BY_YOU
          : ALL_PUBLISHED_FLOWS
          }`;
        routeNavigate(history, ROUTE_METHOD.REPLACE, redirectPath);
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generatePostServerErrorMessage(err);
        dispatch(
          updateFlowStateChange({
            common_server_error: errors.common_server_error,
          }),
        );
      }
      resolve();
    })
    .catch(async (err) => {
      console.log('Publish for testing error', err);
      setPointerEvent(false);
      updatePostLoader(false);
      if (get(err, ['response', 'data', 'errors', 'length']) === 1) {
        const error = get(err, ['response', 'data', 'errors', 0], {});
        if (error?.type === 'array.unique' && error.field?.includes('step_order')) {
          const flowData = cloneDeep(
            store.getState().EditFlowReducer.flowData,
          );
          const isUpdatedStepOrder = await dispatch(
            updateStepOrderApiThunk(
              getStepOrderData(cloneDeep(flowData)),
            ),
          );
          if (isUpdatedStepOrder) {
            dispatch(publishFlowThunk(data, isTestFlow, history, t = translateFunction));
            return null;
          }
        } else if (error?.type === VALIDATION_ERROR_TYPES.LIMIT) {
          return displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.LIMIT_EXCEEDED);
        }
      }
      const errorObject = {};
      const errors = generatePostServerErrorMessage(
        err,
        {},
        FLOW_STRINGS.FLOW_LABELS,
      );
      errorObject.server_error = errors.state_error ? errors.state_error : [];
      errorObject.common_server_error = errors.common_server_error
        ? errors.common_server_error
        : EMPTY_STRING;
      const { EditFlowReducer } = store.getState();
      const { flowData } = cloneDeep(EditFlowReducer);
      handleAllStepErrors(err, flowData.steps);
      dispatch(
        updateFlowStateChange({
          common_server_error: errorObject.common_server_error,
        }),
      );
      console.log('publish flow server error', (err, ['response', 'data', 'errors', 0]));
      if (has(err, ['response', 'data', 'errors', 0])) {
        const error = get(err, ['response', 'data', 'errors', 0], {});
        if (error.type === SOMEONE_EDITING) {
          return updateSomeoneIsEditingPopover(error.message);
        } else if (error.type === VALIDATION_ERROR_TYPES.LIMIT) {
          return displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.LIMIT_EXCEEDED);
        } else {
          let errorPopoverData = {};
          get(err, ['response', 'data', 'errors'], []).forEach((eachError) => {
            if (eachError?.field?.includes('trigger_details')) {
              errorPopoverData = FLOW_STRINGS.SERVER_RESPONSE.TRIGGER_DETAILS(t);
            }
          });
          switch (error.field) {
            case 'default_report_fields':
              errorPopoverData = FLOW_STRINGS.SERVER_RESPONSE.METRIC_ERROR_MESSAGE;
              break;
            case 'owners.users':
              if (error.type === 'invalid') {
                errorPopoverData = FLOW_STRINGS.SERVER_RESPONSE.OWNER_ROLE;
              }
              break;
            case 'viewers.users':
              if (error.type === 'invalid') {
                errorPopoverData = FLOW_STRINGS.SERVER_RESPONSE.VIEWER_ROLE;
              }
              break;
            case 'initiators.users':
              if (error.type === 'invalid') {
                errorPopoverData = FLOW_STRINGS.SERVER_RESPONSE.INITIATOR_STATUS;
              }
              break;
            case 'participants.users':
              if (error.type === 'invalid') {
                errorPopoverData = FLOW_STRINGS.SERVER_RESPONSE.PARTICIPANTS_STATUS;
              }
              break;
            case /trigger_details/.test(error.field):
              if (error.indexes === 'invalid trigger mapping') {
                errorPopoverData = FLOW_STRINGS.SERVER_RESPONSE.TRIGGER_DETAILS(t);
              }
              break;
            default:
              if (isEmpty(errorPopoverData)) {
                errorPopoverData = {
                  title: t(ERROR_LABEL),
                  subtitle: t(FAILED_TO_PUBLISH_FLOW),
                };
              }
              break;
          }
          return displayErrorToast(errorPopoverData);
        }
      } else {
        return showToastPopover(
          t(ERROR_LABEL),
          t(FAILED_TO_PUBLISH_FLOW),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
    });
});

export const deleteFormThunk = (stepId) => (dispatch) =>
  new Promise((resolve) => {
    dispatch(updateFlowStateChange({ deletingFormData: true }));
    setPointerEvent(true);
    updatePostLoader(true);
    deleteForm({ step_id: stepId }).then(
      () => {
        setPointerEvent(false);
        updatePostLoader(false);
        const flowData = cloneDeep(
          store.getState().EditFlowReducer.flowData,
        );
        delete flowData.form_details;
        dispatch(updateFlowStateChange({ flowData }));
        resolve(flowData);
      },
      (error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors[0].type === SOMEONE_EDITING
        ) {
          updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
        } else if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.errors.length
        ) {
          dispatch(
            updateFlowStateChange({
              deletingFormData: false,
              server_error: error.response.data.errors,
            }),
          );
        }
      },
    );
  });

export const getAllFieldsThunk =
  (params, is_table_field, isPaginated = false, t = translateFunction) =>
    (dispatch) => {
      let allFields = store.getState().EditFlowReducer.all_fields_details;
      if (!isPaginated) {
        dispatch(updateFlowStateChange({ fetchingAllFields: true }));
      }
      setPointerEvent(true);
      updatePostLoader(true);
      getAllFields({
        ...params,
        page: isPaginated ? params.page + 1 : params.page,
      })
        .then((res = {}) => {
          setPointerEvent(false);
          updatePostLoader(false);
          if (!isEmpty(res)) {
            allFields = store.getState().EditFlowReducer.all_fields_details;
            const { pagination_details = [], pagination_data = [] } = res;
            if (pagination_details.length > 0) {
              const {
                page = 1,
                size = 0,
                total_count = 0,
              } = pagination_details[0];
              const allFieldsList = {
                ...allFields,
                fieldList: isPaginated
                  ? [...allFields.fieldList, ...pagination_data]
                  : pagination_data,
                totalCount: total_count,
                renderedCount: Math.max(page * size, 0),
                hasMore: page * size < total_count,
              };
              if (is_table_field) {
                allFieldsList.is_fields = true;
                dispatch(
                  updateFlowStateChange({
                    all_table_fields_details: allFieldsList,
                  }),
                );
              } else {
                dispatch(
                  updateFlowStateChange({
                    all_table_fields_details: allFieldsList,
                  }),
                );
              }
            }
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            allFields = store.getState().EditFlowReducer.all_fields_details;
            const errors = generateGetServerErrorMessage(err);
            allFields.common_server_error = errors;
            dispatch(updateFlowStateChange({ allFields }));
          }
        })
        .catch((err) => {
          setPointerEvent(false);
          updatePostLoader(false);
          allFields = store.getState().EditFlowReducer.all_fields_details;
          const errors = generateGetServerErrorMessage(err);
          allFields.common_server_error = errors;
          dispatch(updateFlowStateChange({ allFields }));
          showToastPopover(
            FLOW_STRINGS.SERVER_RESPONSE.UPDATE_FAILURE(t).title,
            t(FAILED_TO_PUBLISH_FLOW).subtitle,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        });
    };

export const saveRuleForField =
  (ruleData, id, sectionIndex, fieldListIndex, fieldIndex = null) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        apiSaveRule(ruleData)
          .then((res) => {
            dispatch(
              saveRuleAction(res, id, sectionIndex, fieldListIndex, fieldIndex),
            );
            resolve(true);
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.errors[0].type === SOMEONE_EDITING
            ) {
              updateSomeoneIsEditingPopover(
                error.response.data.errors[0].message,
              );
            } else if (
              error &&
              error.response &&
              error.response.data &&
              error.response.data.errors.length &&
              error.response.data.errors[0].validation_message &&
              error.response.data.errors[0].validation_message ===
              'cyclicDependency'
            ) {
              showToastPopover(
                translate('error_popover_status.cyclic_dependency'),
                translate('error_popover_status.cannot_set_rule'),
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
            } else {
              showToastPopover(
                translate('error_popover_status.save_rule'),
                translate('error_popover_status.rules_not_set'),
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
            }
            reject(error);
          });
      });

export const checkFieldDependencyApiThunk =
  (data, type, name, sectionId, fieldId) => (dispatch) =>
    new Promise((resolve, reject) => {
      setPointerEvent(true);
      updatePostLoader(true);
      checkFieldDependencyApi(data)
        .then((response) => {
          setPointerEvent(false);
          updatePostLoader(false);
          if (!isNull(response)) {
            const { flowData } = cloneDeep(store.getState().EditFlowReducer);
            if (
              [DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.DOCUMENT_GENERATION_DOC_REPLACEMENT,
              DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.DOCUMENT_GENERATION_REMOVE].includes(type)
            ) {
              if (!isEmpty(response.dependency_list)) {
                flowData.showFieldDependencyDialog = {
                  isVisible: true,
                };
                flowData.dependency_data = response;
                flowData.dependency_type = type;
                flowData.dependency_name = name;
                dispatch(updateFlowDataChange(flowData));
              }
            } else {
              flowData.dependency_data = response;
              flowData.dependency_type = type;
              flowData.dependency_name = name;
              flowData.showFieldDependencyDialog = {
                isVisible: true,
                sectionId,
                fieldId,
              };
              dispatch(updateFlowDataChange(flowData));
            }
            resolve(response);
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generatePostServerErrorMessage(err);
            dispatch(
              updateFlowStateChange({
                server_error: errors.common_server_error,
              }),
            );
            reject();
          }
        })
        .catch((error) => {
          setPointerEvent(false);
          updatePostLoader(false);
          const errors = generateGetServerErrorMessage(error);
          dispatch(
            updateFlowStateChange({
              server_error: errors.common_server_error,
            }),
          );
          showToastPopover(
            translate('error_popover_status.somthing_went_wrong'),
            translate('error_popover_status.try_again_later'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          reject(error);
        });
    });

export const checkFormDependencyApiThunk = (data, type, name) => (dispatch) =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    checkFormDependencyApi(data)
      .then((response) => {
        setPointerEvent(false);
        updatePostLoader(false);
        if (!isNull(response)) {
          const { flowData } = store.getState().EditFlowReducer;
          flowData.dependency_data = response;
          flowData.dependency_type = type;
          flowData.dependency_name = name;
          flowData.showFormDependencyDialog = true;
          dispatch(updateFlowDataChange(flowData));
          resolve(response);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generatePostServerErrorMessage(err);
          dispatch(
            updateFlowStateChange({
              server_error: errors.common_server_error,
            }),
          );
          reject();
        }
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        const errors = generateGetServerErrorMessage(error);
        dispatch(
          updateFlowStateChange({
            server_error: errors.common_server_error,
          }),
        );
        showToastPopover(
          translate('error_popover_status.somthing_went_wrong'),
          translate('error_popover_status.try_again_later'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        reject(error);
      });
  });

export const saveDefaultRuleApiThunk =
  (ruleData, sectionId, fieldListIndex, fieldId) => (dispatch) =>
    new Promise((resolve, reject) => {
      apiSaveRule(ruleData)
        .then((res) => {
          dispatch(
            saveDefaultRuleAction(res, sectionId, fieldListIndex, fieldId),
          );
          resolve(true);
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors[0].type === SOMEONE_EDITING
          ) {
            updateSomeoneIsEditingPopover(
              error.response.data.errors[0].message,
            );
          } else if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.errors.length &&
            error.response.data.errors[0].validation_message &&
            error.response.data.errors[0].validation_message ===
            'cyclicDependency'
          ) {
            showToastPopover(
              translate('error_popover_status.cyclic_dependency'),
              translate('error_popover_status.cannot_set_rule'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          } else {
            showToastPopover(
              translate('error_popover_status.save_rule'),
              translate('error_popover_status.rules_not_set'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          }
          reject(error);
        });
    });

export const getDefaultRuleByIdApiThunk =
  (
    ruleId,
    sectionIndex,
    fieldListIndex,
    fieldIndex,
    fieldType,
    onlyUpdateFieldMetadata = false,
  ) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        apiGetRuleDetailsById(ruleId)
          .then((res) => {
            const {
              rule_details: {
                rule: { expression, expression_type, decimal_point, concat_with },
              },
              field_metadata,
              default_operator_details,
            } = res;
            let ruleData = {};
            const selectedOperatorInfo = getSelectedOperatorInfo(
              default_operator_details,
              expression.operator,
              fieldType,
            );
            const { flowData } = cloneDeep(
              store.getState().EditFlowReducer,
            );
            if (!onlyUpdateFieldMetadata) {
              ruleData = getDataFromRuleFields(expression, expression_type, {
                decimal_point,
                concat_with,
              });
              set(
                flowData,
                [
                  'sections',
                  sectionIndex,
                  'field_list',
                  fieldListIndex,
                  'fields',
                  fieldIndex,
                  'draft_default_rule',
                ],
                {
                  ...ruleData,
                },
              );
            }
            set(
              flowData,
              [
                'sections',
                sectionIndex,
                'field_list',
                fieldListIndex,
                'fields',
                fieldIndex,
                'draft_default_rule',
                'operator',
              ],
              expression.operator,
            );
            set(
              flowData,
              [
                'sections',
                sectionIndex,
                'field_list',
                fieldListIndex,
                'fields',
                fieldIndex,
                'draft_default_rule',
                'operatorInfo',
              ],
              selectedOperatorInfo,
            );
            set(
              flowData,
              [
                'sections',
                sectionIndex,
                'field_list',
                fieldListIndex,
                'fields',
                fieldIndex,
                FIELD_KEYS.PREVIOUS_DRAFT_DRAFT_RULE,
              ],
              get(flowData,
                [
                  'sections',
                  sectionIndex,
                  'field_list',
                  fieldListIndex,
                  'fields',
                  fieldIndex,
                  'draft_default_rule',
                ],
                {},
              ),
            );
            dispatch(updateFlowDataChange(flowData));
            dispatch(
              externalFieldsDataChange({
                field_metadata: field_metadata || [],
              }),
            );
            resolve(ruleData);
          })
          .catch((err) => {
            reject(err);
            console.log(err);
          });
      });

export const getRuleDetailsByIdInFieldVisibility =
  (
    ruleId,
    sectionIndex,
    fieldListIndex,
    fieldIndex = null,
    avoidExpressionUpdate = false,
  ) =>
    (dispatch) =>
      new Promise((resolve) => {
        apiGetRuleDetailsById(ruleId)
          .then((res) => {
            const flowData = cloneDeep(store.getState().EditFlowReducer.flowData);
            const {
              rule_details: { rule },
              field_metadata,
              conditional_operator_details,
            } = res;
            const fieldData =
              fieldIndex !== null
                ? flowData.sections[sectionIndex].field_list[fieldListIndex]
                  .fields[fieldIndex]
                : flowData.sections[sectionIndex].field_list[fieldListIndex];
            const clonedFieldData = cloneDeep(fieldData);
            if (clonedFieldData) {
              if ((fieldIndex !== null) && flowData.sections[sectionIndex].field_list[fieldListIndex].field_list_type === FIELD_LIST_TYPE.TABLE) {
                const tableCol = getTableColConditionList(rule.expression, [], field_metadata);
                dispatch(updateTableColConditionList(tableCol));
              }
              if (!avoidExpressionUpdate) {
                clonedFieldData[FIELD_KEYS.RULE_EXPRESSION] = {
                  ...QUERY_BUILDER_INITIAL_STATE,
                  expression: rule.expression,
                };
                clonedFieldData[FIELD_KEYS.PREVIOUS_RULE_EXPRESSION] = cloneDeep(
                  clonedFieldData[FIELD_KEYS.RULE_EXPRESSION],
                );
                if (fieldIndex !== null) {
                  flowData.sections[sectionIndex].field_list[fieldListIndex]
                    .fields[fieldIndex] = clonedFieldData;
                } else {
                  flowData.sections[sectionIndex].field_list[fieldListIndex] = clonedFieldData;
                }
              }
              const externalFields = getVisibilityExternalFieldsData(
                store.getState(),
              );
              dispatch(setOperators([], conditional_operator_details));
              dispatch(externalFieldDataChange(externalFields, field_metadata));
            }
            dispatch(updateFlowDataChange(flowData));
            resolve({});
          })
          .catch((err) => {
            console.log('getRuleDetailsByIdInFieldVisibility error in EditFlow Action', err);
            resolve(false);
            console.log(err);
          });
      });

export const saveStepStatusesAPIThunk = (postData, updateCommonList = true, handleErrors = false) => async (dispatch) => {
  try {
    const response = await saveFlowStepStatuses(postData);
    if (updateCommonList) {
      dispatch(updateFlowDataChange({ stepStatuses: postData?.step_statuses }));
    }
    return response;
  } catch (err) {
    if (handleErrors) {
      const isCommonError = handleCommonErrors(err);
      if (!isCommonError) {
        const errors = generatePostServerErrorMessage(
          err,
          {},
          FLOW_STRINGS.FLOW_LABELS,
          true,
        );
        const { state_error } = errors;
        const popOverStatus = cloneDeep(
          getFlowStrings().CREATE_FLOW_SERVER_RESPONSE
            .STEP_STATUS_FAILURE,
        );
        const errorMessage = Object.values(state_error)?.[0] || EMPTY_STRING;
        let failureStatus = null;
        if (errorMessage.includes('maximum')) {
          failureStatus =
            translate('error_popover_status.character_exceeding_failuer');
        } else if (errorMessage.includes('duplicate')) {
          failureStatus = translate('error_popover_status.status_duplication');
        } else failureStatus = popOverStatus.subTitle;
        popOverStatus.subTitle = failureStatus;
        showToastPopover(
          popOverStatus?.title,
          popOverStatus?.subTitle,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
      return {};
    } else {
      throw err;
    }
  }
};

export const getAllFieldsList =
  (
    paginationData,
    type,
    isPaginated = false,
    setCancelToken = null,
    cancelToken = null,
    callBackFn = null,
  ) =>
    (dispatch) => new Promise((resolve) => {
      dispatch(updateFlowDataChange({
        isAllFieldsLoading: true,
      }));
      apiGetAllFieldsList(paginationData, setCancelToken, cancelToken)
        .then((res) => {
          const { pagination_data = [] } = cloneDeep(res);
          const pagination_detail = get(res, ['pagination_details', 0], {});
          if (pagination_data) {
            const { flowData } = store.getState().EditFlowReducer;
            const clonedFlowData = cloneDeep(flowData);
            pagination_data.map((fieldData) => {
              fieldData.value = fieldData.field_uuid;
              return fieldData;
            });
            const rendered = pagination_detail.size * pagination_detail.page;
            const total = pagination_detail.total_count;
            const hasMore = rendered < total;
            const nextPageData = isPaginated && pagination_detail.page > 1;
            switch (type) {
              case GET_ALL_FIELDS_LIST_BY_FILTER_TYPES.DEFAULT_REPORT_FIELDS:
                clonedFlowData.hasMoreReportFields = hasMore;
                clonedFlowData.lstAllFields = nextPageData ? [
                  ...clonedFlowData.lstAllFields,
                  ...pagination_data,
                ] : [...pagination_data];
                clonedFlowData.defaultReportFieldsCurrentPage = pagination_detail.page;
                break;
              case GET_ALL_FIELDS_LIST_BY_FILTER_TYPES.IDENTIFIERS:
                clonedFlowData.hasMoreFlowIdentifier = hasMore;
                clonedFlowData.allIdentifierFields = nextPageData ? [
                  ...clonedFlowData.allIdentifierFields,
                  ...pagination_data,
                ] : [...pagination_data];
                clonedFlowData.identifierCurrentPage = pagination_detail.page;
                break;
              case GET_ALL_FIELDS_LIST_BY_FILTER_TYPES.TASK_IDENTIFIERS:
                clonedFlowData.hasMore = hasMore;
                clonedFlowData.allTaskIdentifierFields = nextPageData ? [
                  ...clonedFlowData.allTaskIdentifierFields,
                  ...pagination_data,
                ] : [...pagination_data];
                clonedFlowData.taskIdentifierCurrentPage = pagination_detail.page;
                break;
              default:
                clonedFlowData.hasMore = false;
                clonedFlowData.allFields = pagination_data;
            }
            clonedFlowData.isAllFieldsLoading = false;
            if (callBackFn) callBackFn(false);
            dispatch(updateFlowDataChange(clonedFlowData));
          }
          resolve(true);
        })
        .catch((err) => {
          console.log('get all fields list error is', err);
          resolve(false);
        });
    });

export const addMemberToFlow =
  (id, member_name, stepIndex, assigneeIndex) => (dispatch) => {
    const { flowData } = store.getState().EditFlowReducer;
    const clonedFlowData = cloneDeep(flowData);
    if (!(clonedFlowData.steps[stepIndex].step_assignees[assigneeIndex].assignees)) {
      clonedFlowData.steps[stepIndex].step_assignees[assigneeIndex].assignees = {};
    }
    if (clonedFlowData.steps[stepIndex].step_assignees[assigneeIndex].assignees.users) {
      clonedFlowData.steps[stepIndex].step_assignees[assigneeIndex].assignees.users.push({
        _id: id,
        email: member_name,
      });
    } else {
      clonedFlowData.steps[stepIndex].step_assignees[assigneeIndex].assignees.users = [];
      clonedFlowData.steps[stepIndex].step_assignees[assigneeIndex].assignees.users.push({
        _id: id,
        email: member_name,
      });
    }
    clonedFlowData.memberSearchValue = '';
    dispatch(updateFlowDataChange(clonedFlowData));
  };

export const addTeamToFlow = (id, team_name, stepIndex, assigneeIndex) => (dispatch) => {
  const { flowData } = store.getState().EditFlowReducer;
  const clonedFlowData = cloneDeep(flowData);
  if (!(clonedFlowData.steps[stepIndex].step_assignees[assigneeIndex].assignees)) {
    clonedFlowData.steps[stepIndex].step_assignees[assigneeIndex].assignees = {};
  }
  if (clonedFlowData.steps[stepIndex].step_assignees[assigneeIndex].assignees.teams) {
    clonedFlowData.steps[stepIndex].step_assignees[assigneeIndex].assignees.teams.push({
      _id: id,
      team_name,
    });
  } else {
    clonedFlowData.steps[stepIndex].step_assignees[assigneeIndex].assignees.teams = [];
    clonedFlowData.steps[stepIndex].step_assignees[assigneeIndex].assignees.teams.push({
      _id: id,
      team_name,
    });
  }
  clonedFlowData.memberSearchValue = '';
  dispatch(updateFlowDataChange(clonedFlowData));
};

export const discardFlowApi = (params, closeFunction) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  discardFlow(params)
    .then(() => {
      closeFunction();
      setPointerEvent(false);
      updatePostLoader(false);
      dispatch(refreshFlowListStarted());
    })
    .catch((error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      if (error?.response?.data?.errors?.[0]?.type === SOMEONE_EDITING) {
        updateSomeoneIsEditingPopover(error.response.data.errors[0]?.message);
      } else {
        displayErrorToast(
          FLOW_STRINGS.SERVER_RESPONSE.DISCARD_FLOW_FAILURE,
        );
      }
    });
};

export const deleteFlowApi =
  (params, closeFunction) => (dispatch) => {
    setPointerEvent(true);
    updatePostLoader(true);
    deleteFlow(params)
      .then(() => {
        closeFunction();
        setPointerEvent(false);
        updatePostLoader(false);
        dispatch(refreshFlowListStarted());
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors[0].type === SOMEONE_EDITING
        ) {
          updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
        } else {
          displayErrorToast(
            FLOW_STRINGS.SERVER_RESPONSE.DELETE_FLOW_FAILURE,
          );
        }
      });
  };

export const getAllFieldsByFilter =
  (
    paginationData = {},
    currentFieldUuid = '',
    fieldType = null,
    noLstAllFieldsUpdate = false,
    setStateKey = '',
  ) => (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(updateFlowDataChange({ lstAllFieldsLoading: true }));
        getAllFields(paginationData)
          .then((res) => {
            console.log('dsffdsf24234234efsd543', res, setStateKey, paginationData);
            const { pagination_data, pagination_details } = res;
            if (pagination_data) {
              const { flowData } = cloneDeep(
                store.getState().EditFlowReducer,
              );
              flowData.lstAllFieldsLoading = false;
              let fields = [];
              pagination_data.forEach((fieldData) => {
                if (
                  !(currentFieldUuid && fieldData.field_uuid === currentFieldUuid)
                ) {
                  fields.push({
                    ...fieldData,
                    value: fieldData.field_uuid,
                  });
                }
              });
              if (isEmpty(setStateKey)) {
                fields = fields.filter(
                  (eachField) => eachField.field_type !== FIELD_TYPE.DATETIME,
                );
              }
              if (!noLstAllFieldsUpdate) {
                if (isEmpty(setStateKey)) {
                  if (isObject(flowData.lstPaginationData)) {
                    if (
                      flowData.lstPaginationData.page <
                      pagination_details[0].page
                    ) {
                      flowData.lstAllFields = [
                        ...flowData.lstAllFields,
                        ...fields,
                      ];
                      flowData.lstPaginationData = { ...pagination_details[0] };
                    } else if (pagination_details[0].page === 1) {
                      flowData.lstAllFields = [...fields];
                      flowData.lstPaginationData = { ...pagination_details[0] };
                    }
                  } else {
                    flowData.lstAllFields = [...fields];
                    [flowData.lstPaginationData] = pagination_details;
                  }
                } else {
                  const paginationDataKey = `${setStateKey}paginationData`;
                  if (isObject(flowData[paginationDataKey])) {
                    if (
                      flowData[paginationDataKey].page <
                      pagination_details[0].page
                    ) {
                      flowData[setStateKey] = [
                        ...flowData[setStateKey],
                        ...fields,
                      ];
                      flowData[paginationDataKey] = { ...pagination_details[0] };
                    } else if (pagination_details[0].page === 1) {
                      flowData[setStateKey] = [...fields];
                      flowData[paginationDataKey] = { ...pagination_details[0] };
                    }
                  } else {
                    flowData[setStateKey] = [...fields];
                    [flowData[paginationDataKey]] = pagination_details;
                  }
                }
              }
              if (fieldType === FIELD_TYPE.EMAIL) {
                flowData.allEmailFields = fields;
              } else if (fieldType === FIELD_TYPE.USER_TEAM_PICKER) {
                flowData.allUserTeamFields = fields;
              } else if (fieldType === FIELD_TYPE.DATA_LIST) {
                flowData.allDataListFields = fields;
              }
              if (fieldType === FIELD_TYPE.FILE_UPLOAD) {
                flowData.allFileFields = fields;
              }
              console.log('sdf234dfsf234dfsf324rs', cloneDeep(flowData), fieldType);

              if (isEmpty(setStateKey)) {
                flowData.lstAllFields = getUpdatedFields(
                  [...fields],
                  get(flowData, ['lstAllFields'], []),
                );
              } else {
                flowData[setStateKey] = getUpdatedFields(
                  [...fields],
                  get(flowData, [setStateKey], []) || [],
                );
              }
              dispatch(updateFlowDataChange(flowData));
            } else if (fieldType === FIELD_TYPE.DATA_LIST) {
              const { flowData } = store.getState().EditFlowReducer;
              flowData.lstAllFieldsLoading = false;
              flowData.allDataListFields = [];
              dispatch(updateFlowDataChange(flowData));
            }
            resolve(res);
          })
          .catch((err) => {
            const { flowData } = store.getState().EditFlowReducer;
            flowData.lstAllFieldsLoading = false;
            dispatch(updateFlowDataChange(flowData));
            reject(err);
            console.log('sdf23423sdfdsfsd234', err);
            resolve(false);
          });
      });

export const getAllFieldsByFilterAndUpdateOnVisibilityReducer = (
  paginationData = {},
  currentFieldUuid = '',
  fieldType = null,
  noLstAllFieldsUpdate = false,
  setStateKey = '',
  callback = null,
) => (dispatch) => {
  dispatch(
    getAllFieldsByFilter(
      paginationData,
      currentFieldUuid,
      fieldType,
      noLstAllFieldsUpdate,
      setStateKey,
    ),
  ).then(
    (response) => {
      dispatch(getExternalFieldsOnSuccess(paginationData, response));
      callback && callback();
    },
  ).catch((e) => callback && callback(e));
};

export const checkFlowDependencyApiThunk = (data, type, deleteParams, callBackFn) => (dispatch) =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    checkFlowDependencyApi(data)
      .then((response) => {
        setPointerEvent(false);
        updatePostLoader(false);
        console.log('check flow dependency', response);
        if (!isNull(response)) {
          const { dependency_list } = response;
          if (isEmpty(dependency_list)) {
            if (callBackFn) callBackFn();
          } else {
            const { flowData } = cloneDeep(store.getState().EditFlowReducer);
            console.log('response check link dependency', flowData, response);
            flowData.dependency_data = response;
            flowData.dependency_type = type;
            flowData.dependency_name = flowData.flow_name;
            flowData.showFlowDependencyDialog = true;
            flowData.deleteFlowParams = deleteParams;
            dispatch(updateFlowDataChange(flowData));
          }
          resolve(response);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generatePostServerErrorMessage(err);
          dispatch(updateFlowStateChange({
            common_server_error: errors.common_server_error,
          }));
          reject();
        }
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        displayErrorToast({
          title: translate('error_popover_status.somthing_went_wrong'),
          subtitle: translate('error_popover_status.try_again_later'),
        });
        reject(error);
      });
  });

export const deleteConnectorLineApiThunk = (data, sourceStepUuid, t) => (dispatch) =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    deleteConnectorLine(data)
      .then((response) => {
        console.log('deleteConnectorLineApiThunk resonse', response);
        setPointerEvent(false);
        updatePostLoader(false);
        if (!isNull(response)) {
          if (!isEmpty(get(response, ['dependency_list'], []))) {
            const { flowData } = cloneDeep(store.getState().EditFlowReducer);
            const sourceStepName = flowData.steps.find((step) => step.step_uuid === data.from_step_uuid);
            const targetStepName = flowData.steps.find((step) => step.step_uuid === data.to_step_uuid);
            console.log('response check link dependency', flowData, response);
            flowData.dependency_data = response;
            flowData.dependency_name = `${t(FLOW_CONFIG_STRINGS.LINK_DEPENDENCY_TITLE)} ${sourceStepName.step_name} to ${targetStepName.step_name}`;
            flowData.showLinkDependencyDialog = true;
            dispatch(updateFlowDataChange(flowData));
          } else {
            const { flowData } = cloneDeep(store.getState().EditFlowReducer);
            const sourceStepIndex = flowData.steps?.findIndex((step) => step.step_uuid === sourceStepUuid);
            if (sourceStepIndex > -1) {
              const connectedSteps = flowData.steps[sourceStepIndex]?.connected_steps;
              const deletedConnectedLineIndex = connectedSteps.findIndex((link) => link.connector_line_uuid === data.connector_line_uuid);
              if (deletedConnectedLineIndex > -1) {
                connectedSteps.splice(deletedConnectedLineIndex, 1);
              }
              set(flowData, ['steps', sourceStepIndex, 'connected_steps'], connectedSteps);
              dispatch(updateFlowDataChange(flowData));
            }
          }
          resolve(response);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generatePostServerErrorMessage(err);
          dispatch(updateFlowStateChange({
            common_server_error: errors.common_server_error,
          }));
          reject();
        }
      })
      .catch((error) => {
        console.log('catch delete link error', error);
        setPointerEvent(false);
        updatePostLoader(false);
        displayErrorToast({
          title: translate('error_popover_status.somthing_went_wrong'),
          subtitle: translate('error_popover_status.try_again_later'),
        });
        reject(error);
      });
  });

export const getCategoryApiAction =
  (params, setResponse) => () =>
    new Promise((resolve) => {
      getCategoryApiService(params)
        .then((response) => {
          if (nullCheck(response, 'paginationData.length', true)) {
            const dropdownOptionList = response.paginationData.map(
              (eachCategory) => {
                return {
                  label: eachCategory.category_name,
                  value: eachCategory.category_name,
                  id: eachCategory._id,
                };
              },
            );
            console.log('getCurrentPage', response);
            setResponse([dropdownOptionList, response.paginationDetails[0].total_count, response.paginationDetails[0].page]);
          }
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });
export const addNewCategoryApiAction = (params, updateCategoryListInReduxAction, categoryData, setErrros, removeErrors) => (dispatch) =>
  new Promise((resolve) => {
    setPointerEvent(true);
    updatePostLoader(true);
    addNewCategoryApiService(params)
      .then((response) => {
        toastPopOver({
          title: translate('error_popover_status.category_added_successfully'),
          toastType: EToastType.success,
          toastPosition: EToastPosition.BOTTOM_LEFT,
        });
        dispatch(getCategoryApiAction({
          page: 1,
          size: 100,
        }, (res) => {
          const category = {
            category_name: params.category_name,
            category_id: response.result.data._id,
          };
          removeErrors?.();
          dispatch(updateCategoryListInReduxAction({
            category: category,
            categoryData: {
              newCategoryValue: '',
              categoryValueError: '',
              categoryList: res[0],
            },
          }));
        }));
        setPointerEvent(false);
        updatePostLoader(false);
        resolve(true);
      })
      .catch((error) => {
        if (
          nullCheck(error, 'response.data.errors.length', true) &&
          error.response.data.errors.some((eachError) => eachError.field === 'category_name' && eachError.type === 'exist')) {
          setErrros(translate('error_popover_status.category_already_exist'));
          displayErrorToast({ title: translate('error_popover_status.category_already_exist') });
        } else {
          displayErrorToast({ title: translate('error_popover_status.somthing_went_wrong') });
        }
        setPointerEvent(false);
        updatePostLoader(false);
        resolve(false);
      });
  });

export const getFlowLanguagesTranslationStatusApiThunk = (data) => (dispatch) =>
  new Promise((resolve) => {
    setPointerEvent(true);
    updatePostLoader(true);
    dispatch(updateFlowDataChange({ isFlowTranslationStatusLoading: true }));
    getFlowLanguagesTranslationStatus(data)
      .then((localeList) => {
        setPointerEvent(false);
        updatePostLoader(false);
        const translateLanguagesList = {};
        Object.keys(localeList)?.forEach?.((locale) => {
          console.log('getFlowLanguagesStatus loop', locale);
          if (!locale?.includes?.('en')) {
            translateLanguagesList[locale] = {
              ...localeList[locale],
            };
          }
        });
        console.log('getFlowLanguagesStatus', translateLanguagesList);
        dispatch(updateFlowDataChange({ translateLanguagesList: translateLanguagesList, isFlowTranslationStatusLoading: false }));
        resolve(translateLanguagesList);
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        dispatch(updateFlowDataChange({ isFlowTranslationStatusLoading: false }));
        handlePostErrorData(dispatch, error);
      },
      );
  });

export const getFlowDetailsByLocaleApiThunk = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    dispatch(updateFlowDataChange({ isTranslationDataLoading: true }));
    getFlowDataByLocale(data)
      .then((localeFlowData) => {
        setPointerEvent(false);
        updatePostLoader(false);
        console.log('localeFlowData', localeFlowData);
        const modifiedLocaleFlowData = cloneDeep(getModifiedLocaleFlowData(localeFlowData));
        dispatch(updateFlowDataChange({
          localeFlowData: modifiedLocaleFlowData,
          savedLocaleFlowData: modifiedLocaleFlowData,
          originalLocaleData: modifiedLocaleFlowData,
          isTranslationDataLoading: false,
        }));
        resolve(true);
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        dispatch(updateFlowDataChange({ isTranslationDataLoading: false }));
        handlePostErrorData(dispatch, error);
        reject(error);
      },
      );
  });

export const saveFlowDetailsByLocaleApiThunk = (data, closeModal, updateKey = EMPTY_STRING, saveSingleField = false) => (dispatch) =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    saveFlowDataByLocale(data)
      .then((res) => {
        if (res) {
          const { flowData } = cloneDeep(store.getState().EditFlowReducer);
          const { localeFlowData, savedLocaleFlowData } = cloneDeep(flowData);
          let savedData = cloneDeep(savedLocaleFlowData);
          console.log('asdfasdfasdfasdfasfd1', updateKey);
          if (!isEmpty(updateKey)) {
            const updateKeyIndex = localeFlowData?.findIndex((data) => data?.newKey === updateKey);
            const savedKeyIndex = savedData?.findIndex((data) => data?.newKey === updateKey);
            console.log('asdfasdfasdfasdfasfd1', savedKeyIndex, updateKeyIndex);
            if (updateKeyIndex > -1 && savedKeyIndex > -1) {
              savedData[savedKeyIndex][data?.locale] = localeFlowData?.[updateKeyIndex]?.[data?.locale];
            }
          } else {
            savedData = cloneDeep(localeFlowData);
          }
          console.log('asdfasdfasdfasdfasfd1', savedData, 'saveSingleField', saveSingleField);
          if (saveSingleField) {
            dispatch(updateFlowDataChange({
              savedLocaleFlowData: savedData,
              originalLocaleData: savedData,
              isLanguageConfigurationModalOpen: !closeModal,
            }));
          } else {
           dispatch(updateFlowDataChange({
            localeFlowData: savedData,
            savedLocaleFlowData: savedData,
            originalLocaleData: savedData,
            isLanguageConfigurationModalOpen: !closeModal,
           }));
          }
          dispatch(getFlowLanguagesTranslationStatusApiThunk({
            flow_id: flowData?.flow_id,
          }));
        }
        setPointerEvent(false);
        updatePostLoader(false);
        resolve(true);
      })
      .catch((error) => {
        console.log('asdfasdfasdf', error);
        setPointerEvent(false);
        updatePostLoader(false);
        handlePostErrorData(dispatch, error);
        reject(error);
      },
      );
  });
