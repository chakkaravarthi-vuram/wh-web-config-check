import { EToastPosition, EToastType, toastPopOver } from '@workhall-pvt-lmt/wh-ui-library';
import { cloneDeep, get, isEmpty, set, unset, has, isObject, isUndefined, isNull } from 'utils/jsUtility';
import { getCategorisedEvents } from 'containers/edit_flow/diagramatic_flow_view/flow_component/flow_integration_configuration/basic_integration_configuration/BasicIntegrationConfiguration.utils';
import { FLOW_TRIGGER_CONSTANTS } from 'components/flow_trigger_configuration/TriggerConfiguration.constants';
import {
    apiGetAllFieldsList, apiGetFlowStepDetailsById, checkStepDependencyApi, deleteDocumentGenerationApi, deleteFlowEscalationsApi,
    deleteSendDataToDatalistApi, deleteSendEmailApi, deleteStep, getAllFields, getSendDataToDatlistApi, getTriggerDetails, saveDocumentGenerationApi,
    saveFlowEscalationsApi, saveSendDataToDatlistApi, saveSendEmailApi, saveStep, saveActionApi, saveStepCoordinates, testIntegration, saveStepActionApi,
} from '../../axios/apiService/flow.apiService';
import { getAllFlows, apiGetFlowDetailsByUUID } from '../../axios/apiService/flowList.apiService';
import { getAllIntegrationEventsApi, getIntegrationConnectorApi } from '../../axios/apiService/Integration.apiService';
import { getStepCoordinates } from '../../containers/edit_flow/diagramatic_flow_view/DigramaticFlowView.utils';
import { FLOW_STRINGS } from '../../containers/edit_flow/EditFlow.strings';
import { getConnectedStepsFromActions, getFormattedStepDetail, getFormattedStepDetails, removeDeletedStepFromConnectedSteps, updateSomeoneIsEditingPopover } from '../../containers/edit_flow/EditFlow.utils';
import {
    constructSaveResponseFromApiData, constructSubProcessMappingFromApiData, constructTriggerMappingFieldMetadata,
    formatInitialEventData, getDeletedFieldsErrorList, getGroupedFieldListForMapping, getStepOrderData,
} from '../../containers/edit_flow/step_configuration/StepConfiguration.utils';
import { translate } from '../../language/config';
import { generateError, generatePostServerErrorMessage } from '../../server_validations/ServerValidation';
import { store } from '../../Store';
import { FORM_POPOVER_STATUS, STEP_TYPE } from '../../utils/Constants';
import { VALIDATION_CONSTANT } from '../../utils/constants/validation.constant';
import { constructDetailedFlowErrorInfo, constructDetailedFlowErrorList, displayErrorToast, handleSaveStepNodeErrors } from '../../utils/flowErrorUtils';
import { getUpdatedFields } from '../../utils/formUtils';
import { translateFunction } from '../../utils/jsUtility';
import { setPointerEvent, updatePostLoader } from '../../utils/loaderUtils';
import { ERROR_TYPE_STRING_GUID_ERROR, SOMEONE_EDITING } from '../../utils/ServerValidationUtils';
import { EMPTY_STRING, FLOW_TO_DATALIST, SERVER_ERROR_MESSAGES, VALIDATION_ERROR_TYPES } from '../../utils/strings/CommonStrings';
import { flowSetStepData, updateFlowDataChange, updateFlowStateChange } from '../reducer/EditFlowReducer';
import { validateAndExtractRelativePathFromEndPoint } from '../../containers/integration/Integration.utils';
import { updateStepCoordinatesAfterLinkChange, updateStepOrderApiThunk } from './EditFlow.Action';
import { deleteAction } from '../../axios/apiService/form.apiService';
import { getModelListThunk } from './MlModelList.Action';
import { EDIT_FLOW_STEP_TABS } from '../../containers/application/app_components/dashboard/flow/Flow.utils';
import { showToastPopover } from '../../utils/UtilityFunctions';

let cancelTokenForFieldMetadataForDocumentGeneration = null;

const setCancelTokenForFieldMetadataForDocumentGeneration = (token) => {
    cancelTokenForFieldMetadataForDocumentGeneration = token;
};

export const getIntegrationListApiThunk = ({ postData, isSelectEvent = false, details = {} }) => async (dispatch) => {
    try {
        const response = await getIntegrationConnectorApi(postData);
        if (response) {
            const { flowData } = cloneDeep(store.getState().EditFlowReducer);
            if (postData?.connector_uuid) {
                const { events = [] } = response;
                let integrationDetails = { query_params: [], body: [], relative_path: [] };
                let fieldDetails = [];
                let validateParams = false;
                let activeIntegrationData;
                if (details) {
                    activeIntegrationData = cloneDeep(details);
                } else {
                    activeIntegrationData = cloneDeep(flowData)?.activeIntegrationData || {};
                }
                activeIntegrationData.selected_connector = response._id;
                if (postData?.event_uuid) {
                    if (!isEmpty(events) && events?.length) {
                        [activeIntegrationData.event_details] = events;
                    }
                    if (isSelectEvent) {
                        delete activeIntegrationData.event_headers;
                        delete activeIntegrationData.test_event_headers;
                        delete activeIntegrationData.query_params;
                        delete activeIntegrationData.test_query_params;
                        delete activeIntegrationData.relative_path;
                        delete activeIntegrationData.test_relative_path;
                        delete activeIntegrationData.request_body;
                        delete activeIntegrationData.test_body;
                        delete activeIntegrationData.test_response;
                        delete activeIntegrationData.response_format;
                        delete activeIntegrationData.dataFields;
                        delete activeIntegrationData.response_body;
                    } else {
                        integrationDetails = activeIntegrationData.integration_details || {};
                        fieldDetails = activeIntegrationData.field_details || [];
                        validateParams = !!activeIntegrationData._id;
                    }
                    const { relative_path_params } = validateAndExtractRelativePathFromEndPoint(events[0].end_point, events[0].relative_path || []);
                    if (!isEmpty(relative_path_params)) events[0].relative_path = cloneDeep(relative_path_params);
                    activeIntegrationData = {
                        ...activeIntegrationData,
                        ...formatInitialEventData(events[0], integrationDetails, fieldDetails, validateParams),
                    };
                }
                return activeIntegrationData;
            } else {
                dispatch(
                    updateFlowDataChange({
                        integerationList: [...(response?.pagination_data || [])],
                        allIntegrationList: [...(response?.pagination_data || [])],
                        pagination_details: response?.pagination_details,
                    }),
                );
            }
        }
        return response;
    } catch (error) {
        console.log('error', error);
        return null;
    }
};

export const getStepNodeDetailsByIdThunk = ({ stepId }, t) => async (dispatch) => {
    try {
        console.log('stepIdgetStepNodeThunk', stepId);
        const response = await apiGetFlowStepDetailsById(stepId);
        const { flowData } = cloneDeep(store.getState().EditFlowReducer);
        const stepIndex = flowData.steps.findIndex((step) => step._id === stepId);
        const details = getFormattedStepDetails(response, t);
        set(flowData, ['steps', stepIndex], details);
        await dispatch(updateFlowDataChange({ ...flowData }));
        return response;
    } catch (error) {
        throw new Error(error);
    }
};

export const getFlowStepDetailsApiThunk = ({ stepId, label }, t, systemFields) => async (dispatch) => {
    try {
        const { flowData } = cloneDeep(store.getState().EditFlowReducer);
        const stepIndex = flowData.steps.findIndex((step) => step._id === stepId);
        if (stepIndex > -1) {
            dispatch(updateFlowStateChange({
                isLoadingStepDetails: true,
            }));
            const response = await apiGetFlowStepDetailsById(stepId);
            let details = getFormattedStepDetails(response, t, systemFields);
            if (label) details.step_name = label;
            if (response.step_type === STEP_TYPE.INTEGRATION) {
                let mappedResponseFields = [];
                const { integration_details = {}, field_details = [] } = response;
                if (integration_details?.event_uuid) {
                    details = await dispatch(getIntegrationListApiThunk({
                        postData: {
                            connector_uuid: integration_details?.connector_uuid,
                            status: 'published',
                            event_uuid: integration_details?.event_uuid,
                        },
                        details,
                    }));
                    // const eventData = details.event_details;
                    if (details.errorList) {
                        details.integration_error_list =
                            { ...details.integration_error_list || {}, ...cloneDeep(details.errorList) };
                        delete details.errorList;
                    }
                    if (integration_details?.response_format) {
                        details.response_format =
                            constructSaveResponseFromApiData(
                                integration_details?.response_format,
                                field_details,
                                (mappedTableFields) => {
                                    mappedResponseFields = mappedTableFields;
                                });
                    }
                    set(flowData, ['mappedIntegrationResponseFields'], mappedResponseFields);
                }
                set(flowData, ['activeIntegrationData'], details);
            }
            if (response.step_type === STEP_TYPE.ML_MODELS) {
                const { activeMLIntegrationData = {} } = cloneDeep(flowData);
                const clonedMlIntegrationData = cloneDeep(activeMLIntegrationData);
                clonedMlIntegrationData.ml_integration_details = response?.ml_integration_details;
                clonedMlIntegrationData.selected_ml_model = response?.ml_integration_details?.model_code;
                store.dispatch(getModelListThunk())
                .then((res) => {
                    store.dispatch(updateFlowDataChange({
                        activeMLIntegrationData: { MLModelList: res, ...response },
                    }));
                });

                updateFlowStateChange({ activeMLIntegrationData: clonedMlIntegrationData });
            }
            set(flowData, ['steps', stepIndex], details);
            await dispatch(updateFlowDataChange({ ...flowData }));
            dispatch(updateFlowStateChange({ isLoadingStepDetails: false }));
            return details;
        }
        return null;
    } catch (error) {
        console.log('get flow step details response', error);
        dispatch(updateFlowStateChange({ isLoadingStepDetails: false }));
        return null;
    }
};

export const getUserStepDetailsApiThunk = ({ stepId, label }, t, systemFields) => async (dispatch) => {
    try {
        const { flowData } = cloneDeep(store.getState().EditFlowReducer);
        const stepIndex = flowData.steps.findIndex((step) => step._id === stepId);
        if (stepIndex > -1) {
            dispatch(updateFlowStateChange({
                isLoadingStepDetails: true,
            }));
            const response = await apiGetFlowStepDetailsById(stepId);
            const details = getFormattedStepDetails(response, t, systemFields);
            if (label) details.step_name = label;
            set(flowData, ['steps', stepIndex], details);
            dispatch(updateFlowStateChange({ flowData, isLoadingStepDetails: false }));
            return details;
        }
        return null;
    } catch (error) {
        console.log('get flow step details response', error);
        dispatch(updateFlowStateChange({ isLoadingStepDetails: false }));
        return null;
    }
};

export const handleSaveStepAndSaveActionError = (err, data) => (dispatch) => {
    const errorList = get(err, ['response', 'data', 'errors'], []);
    let toastMessageDetails = {};
    if (errorList?.[0]?.type === SOMEONE_EDITING) {
        updateSomeoneIsEditingPopover(err.response.data.errors[0]?.message);
    } else if (get(errorList, ['0', 'type'], null) === VALIDATION_ERROR_TYPES.LIMIT) {
        toastMessageDetails = FLOW_STRINGS.SERVER_RESPONSE.LIMIT_EXCEEDED;
    } else {
        if (
            get(errorList, [0, 'validation_message'], null) === 'cyclicDependency'
        ) {
            toastMessageDetails = {
                title: translateFunction('error_popover_status.cyclic_dependency_detect'),
                subtitle: translateFunction('error_popover_status.cyclic_dependency_exist'),
            };
        } else {
            const errorObject = {};
            const flowState = cloneDeep(store.getState().EditFlowReducer);
            const errors = generateError(
                err,
                flowState.server_error,
                FLOW_STRINGS.FLOW_LABELS,
                true,
                data.step_type === STEP_TYPE.INTEGRATION,
            );
            dispatch(constructDetailedFlowErrorInfo({ errors: err, step_order: data.step_order, step_id: data._id }));
            errorObject.server_error = errors.state_error
                ? errors.state_error
                : [];
            errorObject.common_server_error = errors.common_server_error
                ? errors.common_server_error
                : {};
            if (get(errorList, ['0', 'type'], null) === 'array.unique') {
                const field = get(errorList, ['0', 'field'], '');
                if (field.includes('integration_details.response_format') && field.includes('table_uuid')) {
                    toastMessageDetails = FLOW_STRINGS.SERVER_RESPONSE.RESPONSE_KEY_MAPPING;
                }
            }
            const flowData = cloneDeep(flowState.flowData);
            dispatch(
                updateFlowDataChange({
                    error_list: { ...flowData.error_list, ...errors.state_error },
                    savingStepData: false,
                }),
            );
        }
    }
    if (!isEmpty(toastMessageDetails)) {
        toastPopOver({
            ...toastMessageDetails,
            toastType: EToastType.error,
            toastPosition: EToastPosition.BOTTOM_LEFT,
        });
    }
};

export const saveStepCoordinatesThunk = (data) => () => {
    saveStepCoordinates(data);
};

const removeSystemEnds = (systemEndsTobeRemoved = [], flowData) => async (dispatch) => {
    const updatedFlowData = cloneDeep(flowData);
        const updatedSteps = removeDeletedStepFromConnectedSteps(updatedFlowData, systemEndsTobeRemoved);
        updatedFlowData.steps = cloneDeep(updatedSteps);
        await dispatch(
          updateStepOrderApiThunk(getStepOrderData(updatedFlowData), true),
        );
        return updatedFlowData;
};

export const saveActionThunk = ({
    postData,
    flowDataCopy,
    returnUpdatedData,
}) => async (dispatch) => {
    try {
        // loader
        let flowData = cloneDeep(flowDataCopy);
        const res = await saveActionApi(postData);
        if (!isEmpty(res?.removed_system_ends)) {
            flowData = await dispatch(removeSystemEnds(res?.removed_system_ends, flowData));
        }
        const { stepsWithoutLinks } = store.getState().EditFlowReducer;
        if (!isEmpty(stepsWithoutLinks) && !isEmpty(postData.actions.next_step_uuid)) {
            const nextStepUuids = (postData.actions.next_step_uuid || []);
            const updatedBrokenSteps = cloneDeep(stepsWithoutLinks);
            stepsWithoutLinks.forEach((brokenStep) => {
                if (nextStepUuids.includes(brokenStep)) {
                    const index = updatedBrokenSteps.findIndex((updatedBrokenStep) => brokenStep === updatedBrokenStep);
                    if (index > -1) updatedBrokenSteps.splice(index, 1);
                }
            });
            dispatch(updateFlowStateChange({ stepsWithoutLinks: updatedBrokenSteps }));
        }
        const stepIndex = flowData.steps.findIndex((step) => step._id === postData._id);
        if (stepIndex > -1) {
            const actionIndex = flowData.steps[stepIndex]?.actions?.findIndex(({ action_name }) => action_name === postData?.actions?.action_name);
            if (actionIndex > -1) {
                set(flowData, ['steps', stepIndex, 'actions', actionIndex, 'action_uuid'], res.action_uuid);
            }
            flowData.steps[stepIndex] = {
                ...flowData.steps[stepIndex],
                connected_steps: res?.connected_steps || [],
            };
            const coordinate_data = getStepCoordinates(flowData);
            const { steps } = cloneDeep(flowData);
            (coordinate_data || []).forEach(({ step_id, coordinate_info }) => {
                const stepIndex = steps.findIndex(({ _id }) => _id === step_id);
                if (stepIndex > -1) {
                    steps[stepIndex].coordinate_info = coordinate_info;
                }
            });
            // update coordinate_info for activeStep
            res.coordinate_info = steps[stepIndex].coordinate_info;
            // res - handle removed_system_ends
            set(flowData, 'steps', steps);
            dispatch(saveStepCoordinatesThunk({
                flow_id: flowData.flow_id,
                flow_uuid: flowData.flow_uuid,
                coordinate_data,
            }));
        }
        if (returnUpdatedData) {
            return flowData;
        } else {
            dispatch(updateFlowDataChange(flowData));
        }
        return res;
    } catch (err) {
        handleSaveStepAndSaveActionError();
        throw Error(err);
    }
};

// params = { flow_id, field_uuid}
export const getFieldMetadataForDocumentGeneration = (params) => (dispatch) => new Promise((resolve, reject) => {
    const activeStepDetails = cloneDeep(store.getState().EditFlowReducer.activeStepDetails);
    apiGetAllFieldsList(params,
        setCancelTokenForFieldMetadataForDocumentGeneration,
        cancelTokenForFieldMetadataForDocumentGeneration,
    )
        .then((repsonse) => {
            const { pagination_data } = repsonse;
            let allFields = [];
            if (pagination_data && (pagination_data || []).length > 0) {
                allFields = pagination_data.map((each_field) => {
                    return {
                        ...each_field,
                        label: each_field.reference_name,
                        value: each_field.field_uuid,
                    };
                });
            }
            set(activeStepDetails, ['active_document_action', 'field_metadata'], allFields);
            dispatch(updateFlowStateChange({ activeStepDetails }));
            resolve(allFields);
        })
        .catch((error) => {
            reject(error);
        });
});

export const saveStepNodeApiThunk = ({ postData, updatedFlowData, handleErrors }) => async (dispatch) => {
    setPointerEvent(true);
    updatePostLoader(true);
    try {
        const response = await saveStep(postData);
        setPointerEvent(false);
        updatePostLoader(false);
        let { flowData, detailedFlowErrorInfo } = cloneDeep(store.getState().EditFlowReducer);
        if (!isEmpty(updatedFlowData)) {
            flowData = cloneDeep(updatedFlowData);
        }
        const stepIndex = flowData?.steps?.findIndex((step) => step._id === postData._id);
        if (stepIndex > -1) {
            set(flowData, ['steps', stepIndex], {
                    ...flowData.steps[stepIndex],
                    ...postData,
                });
        }
        detailedFlowErrorInfo = constructDetailedFlowErrorList(response.validation_message, flowData.steps, translateFunction, detailedFlowErrorInfo, postData.step_uuid);
        dispatch(
            updateFlowStateChange({
                flowData,
                detailedFlowErrorInfo,
            }),
        );
        return response;
    } catch (error) {
        setPointerEvent(false);
        updatePostLoader(false);
        const errorData = get(error, ['response', 'data', 'errors'], []);
        switch (errorData[0]?.type) {
            case SOMEONE_EDITING:
                updateSomeoneIsEditingPopover(errorData?.message);
                break;
            case VALIDATION_ERROR_TYPES.LIMIT:
                displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.LIMIT_EXCEEDED);
                break;
            default:
                handleSaveStepNodeErrors({ errors: errorData, stepType: postData.step_type, callback: handleErrors });
                break;
        }
        throw Error(error);
    }
};

export const saveStepAPIThunk = ({
    postData,
    nextTabIndex,
    dontUpdateData,
    isSaveAndClose,
    validateCurrentTab,
    isNewStep,
    label,
    updateConnectedSteps,
    activeStepDetails,
    updatedFlowData,
}) => async (dispatch) => {
    dispatch(updateFlowStateChange({ savingStepData: true }));
    setPointerEvent(true);
    updatePostLoader(true);
    try {
        const res = await saveStep(postData);
        let flowData = {};
        if (!isEmpty(updatedFlowData)) {
            flowData = cloneDeep(updatedFlowData);
        } else {
            flowData = cloneDeep(store.getState().EditFlowReducer?.flowData);
        }
        const { isNodeConfigOpen } = cloneDeep(store.getState().EditFlowReducer);
        const stepIndex = flowData?.steps?.findIndex((step) => step._id === postData._id);
        if (isEmpty(activeStepDetails)) {
            if (isNodeConfigOpen) {
                activeStepDetails = cloneDeep(store.getState().EditFlowReducer.activeStepDetails);
            } else if (stepIndex > -1) {
                activeStepDetails = cloneDeep(get(flowData, ['steps', stepIndex], {}));
            }
        }
        if (stepIndex > -1) {
            // update active step data to flow steps list
            if (label) activeStepDetails.step_name = label;
            const formattedStepDetail = getFormattedStepDetail(activeStepDetails, flowData, postData);
            set(flowData, ['steps', stepIndex], formattedStepDetail);
        }
        if (updateConnectedSteps) {
            setPointerEvent(false);
            updatePostLoader(false);
            return dispatch(updateFlowStateChange({
                flowData,
                savingStepData: false,
            }));
        }
        let isValidationPassed = isSaveAndClose;
        if (postData.step_type === STEP_TYPE.USER_STEP) {
            if (nextTabIndex) {
                if (nextTabIndex < activeStepDetails.progress) {
                    activeStepDetails.progress = nextTabIndex;
                } else {
                    let isErrorInAssignee = false;
                    if (
                        (nextTabIndex === EDIT_FLOW_STEP_TABS.SET_ASSIGNEE) ||
                        (activeStepDetails.progress === EDIT_FLOW_STEP_TABS.SET_ASSIGNEE && validateCurrentTab)
                        ) {
                        const escalationErrorList = {};
                        if (!isEmpty(res.validation_message)) {
                            res.validation_message.forEach((eachMessage) => {
                              if (eachMessage?.field?.includes('escalations')) {
                                const esclationIndex = eachMessage.field.split('.')[1];
                                escalationErrorList[esclationIndex] = isEmpty(cloneDeep(escalationErrorList)[esclationIndex]) ? {} : cloneDeep(escalationErrorList)[esclationIndex];
                                if (eachMessage.field.includes('recipient')) {
                                  escalationErrorList[esclationIndex].error = translate('error_popover_status.invalid_escalation');
                                  escalationErrorList[esclationIndex].recipients = translate('error_popover_status.invalid_recipients');
                                  if (eachMessage.field.includes('escalation_recipients')) {
                                    escalationErrorList[esclationIndex].error_list = eachMessage.field;
                                    escalationErrorList[esclationIndex].escalation_uuid = activeStepDetails.escalations[esclationIndex].escalation_uuid;
                                  }
                                }
                              } else if (eachMessage?.field?.includes('step_assignees')) {
                                  if (!isErrorInAssignee) {
                                      isErrorInAssignee = true;
                                  }
                              }
                            });
                          }
                          activeStepDetails.escalationErrorList = { ...escalationErrorList };
                          if (isEmpty(escalationErrorList) && (!isErrorInAssignee)) {
                            activeStepDetails.progress = nextTabIndex;
                            if (activeStepDetails.savedProgress < EDIT_FLOW_STEP_TABS.SET_ASSIGNEE) {
                                activeStepDetails.savedProgress = EDIT_FLOW_STEP_TABS.SET_ASSIGNEE;
                            }
                          } else {
                            isValidationPassed = false;
                            activeStepDetails.progress = EDIT_FLOW_STEP_TABS.SET_ASSIGNEE;
                          }
                    }
                    if ((isValidationPassed && nextTabIndex === EDIT_FLOW_STEP_TABS.ADD_ON_CONFIGURATION) || (
                       (activeStepDetails.progress === EDIT_FLOW_STEP_TABS.ADD_ON_CONFIGURATION && validateCurrentTab)
                    )) {
                        const emailActionsErrorList = {};
                        const datalistMappingErrorList = {};
                        const docGenerationErrorList = [];
                        if (!isEmpty(res.validation_message)) {
                          res.validation_message.forEach((eachMessage) => {
                            if (eachMessage.field.includes('email_actions')) {
                              const emailIndex = eachMessage.field.split('.')[1];
                              emailActionsErrorList[emailIndex] = isEmpty(cloneDeep(emailActionsErrorList)[emailIndex]) ? {} : cloneDeep(emailActionsErrorList)[emailIndex];
                              if (eachMessage.field.includes('recipients')) {
                                emailActionsErrorList[emailIndex].recipients = translate('error_popover_status.invalid_recipients');
                                emailActionsErrorList[emailIndex].error = translate('error_popover_status.invalid_send_email');
                                if (eachMessage.field.includes('to_recipients')) {
                                  emailActionsErrorList[emailIndex].error_list = eachMessage.field;
                                  emailActionsErrorList[emailIndex].email_uuid = activeStepDetails.email_actions[emailIndex].email_uuid;
                                }
                              }
                              if (eachMessage.field.includes('action_type')) {
                                if (!isEmpty(res?.email_actions?.action_type || [])) {
                                  emailActionsErrorList[emailIndex].actions = translate('error_popover_status.invalid_email_action');
                                } else {
                                  emailActionsErrorList[emailIndex].actions = 'Email action is required';
                                }
                                emailActionsErrorList[emailIndex].error = translate('error_popover_status.invalid_send_email');
                              }
                            }
                            if (eachMessage.field.includes('document_generation')) {
                              const docGenerationIndex = eachMessage.field.split('.')[1];
                              docGenerationErrorList[docGenerationIndex] = isEmpty(cloneDeep(docGenerationErrorList)[docGenerationIndex]) ? {} : cloneDeep(docGenerationErrorList)[docGenerationIndex];
                              if (eachMessage.field.includes('action_type')) {
                                if (!isEmpty(res?.document_generation?.action_type || [])) {
                                  docGenerationErrorList[docGenerationIndex].actions = translate('error_popover_status.invalid_doc_action');
                                } else {
                                  docGenerationErrorList[docGenerationIndex].actions = 'Document generation action required';
                                }
                                docGenerationErrorList[docGenerationIndex].error = translate('error_popover_status.invalid_doc_config');
                              }
                            }
                            if (eachMessage.field.includes('data_list_mapping')) {
                              const datalistMappingIndex = eachMessage.field.split('.')[1];
                              datalistMappingErrorList[datalistMappingIndex] = isEmpty(cloneDeep(datalistMappingErrorList)[datalistMappingIndex]) ? {} : cloneDeep(datalistMappingErrorList)[datalistMappingIndex];
                              if (eachMessage.field.includes('button_action')) {
                                if (!isEmpty(res?.data_list_mapping?.button_action || [])) {
                                  datalistMappingErrorList[datalistMappingIndex].actions = translate('error_popover_status.invalid_datalist_mapping');
                                } else {
                                  datalistMappingErrorList[datalistMappingIndex].actions = ' Send Data to Datalist mapping action is required';
                                }
                                datalistMappingErrorList[datalistMappingIndex].error = translate('error_popover_status.invalid_datalist_config');
                              }
                              if (eachMessage.field.includes('mapping_uuid')) {
                                datalistMappingErrorList[datalistMappingIndex].mapping_error = translateFunction(VALIDATION_CONSTANT.SEND_DATALIST_FIELDS_DELETED);
                              }
                            }
                          });
                        }
                        activeStepDetails.emailActionsErrorList = { ...emailActionsErrorList };
                        activeStepDetails.docGenerationErrorList = [...docGenerationErrorList];
                        activeStepDetails.datalistMappingErrorList = { ...datalistMappingErrorList };
                        if (isEmpty(emailActionsErrorList) && isEmpty(docGenerationErrorList) && isEmpty(datalistMappingErrorList)) {
                            activeStepDetails.progress = nextTabIndex;
                            if (activeStepDetails.savedProgress < EDIT_FLOW_STEP_TABS.ADD_ON_CONFIGURATION) {
                                activeStepDetails.savedProgress = EDIT_FLOW_STEP_TABS.ADD_ON_CONFIGURATION;
                            }
                          } else {
                            isValidationPassed = false;
                            activeStepDetails.progress = EDIT_FLOW_STEP_TABS.ADD_ON_CONFIGURATION;
                          }
                      }
                }
            }
            if (dontUpdateData) {
                return activeStepDetails;
            }
            if (isSaveAndClose && isValidationPassed) {
                dispatch(updateFlowStateChange({
                    activeStepDetails: {},
                    selectedStepType: null,
                    activeStepId: null,
                    isNodeConfigOpen: false,
                    savingStepData: false,
                    flowData,
                }));
            } else {
                console.log(activeStepDetails, 'updated flow data after save step', flowData);
                dispatch(updateFlowStateChange({
                    flowData,
                    savingStepData: false,
                    ...isNodeConfigOpen ? { activeStepDetails } : {},
                }));
            }
        } else {
            if (isNewStep) {
                if (postData.step_type === STEP_TYPE.FLOW_TRIGGER) {
                    flowData.steps.push({
                        ...flowData?.activeTriggerData,
                        _id: res.step_id,
                        step_uuid: res.step_uuid,
                    });
                } else if (postData.step_type === STEP_TYPE.INTEGRATION) {
                    set(activeStepDetails, ['_id'], res.step_id);
                    set(activeStepDetails, ['step_uuid'], res.step_uuid);
                    set(activeStepDetails, ['skip_during_testbed'], postData.skip_during_testbed);
                    set(flowData, ['activeIntegrationData'], activeStepDetails);
                    flowData.steps.push({
                        ...activeStepDetails,
                    });
                } else if (postData.step_type === STEP_TYPE.ML_MODELS) {
                    set(activeStepDetails, ['_id'], res.step_id);
                    set(activeStepDetails, ['step_uuid'], res.step_uuid);
                    set(flowData, ['activeMLIntegrationData'], activeStepDetails);
                    flowData.steps.push({
                        ...activeStepDetails,
                    });
                } else {
                    flowData.steps.push({
                        ...postData,
                        _id: res.step_id,
                        step_uuid: res.step_uuid,
                    });
                }
                return flowData;
            }
            return flowData;
        }
        if (postData.step_type === STEP_TYPE.INTEGRATION) {
            return flowData;
        }

        const errors = {
            response: {
              data: {
                errors: res?.validation_message || [],
              },
            },
          };
          dispatch(constructDetailedFlowErrorInfo({ errors, step_order: postData.step_order, step_id: postData._id }));

        setPointerEvent(false);
        updatePostLoader(false);
        return res;
    } catch (err) {
        console.log(err, 'save step API error');
        setPointerEvent(false);
        updatePostLoader(false);
        const errorData = get(err, ['response', 'data', 'errors', 0], {});
        switch (errorData.type) {
            case SOMEONE_EDITING:
                return updateSomeoneIsEditingPopover(errorData?.message);
            case VALIDATION_ERROR_TYPES.LIMIT:
                return displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.LIMIT_EXCEEDED);
            case VALIDATION_ERROR_TYPES.ARRAY_UNIQUE:
                const field = get(errorData, ['0', 'field'], '');
                if (field.includes('integration_details.response_format') && field.includes('table_uuid')) {
                    displayErrorToast({
                        ...FLOW_STRINGS.SERVER_RESPONSE.RESPONSE_KEY_MAPPING,
                    });
                }
                break;
            default:
                dispatch(constructDetailedFlowErrorInfo({ errors: err, step_order: postData.step_order, step_id: postData._id }));
                break;
        }
        const flowState = cloneDeep(store.getState().EditFlowReducer);
        const errors = generateError(
            err,
            flowState.server_error,
            FLOW_STRINGS.FLOW_LABELS,
            true,
            postData.step_type === STEP_TYPE.INTEGRATION,
        );
        set(flowState, ['activeStepDetails', 'error_list'], errors?.state_error || {});
        dispatch(updateFlowStateChange({ ...flowState, savingStepData: false }));
        throw Error(err);
    }
};

export const handlePostErrorData = (dispatch, error, t = translateFunction, errorMessage = {}) => {
    if (error?.response?.data?.errors?.[0]?.type === SOMEONE_EDITING) {
        return updateSomeoneIsEditingPopover(error.response.data.errors[0]?.message);
    }
    const errorObject = {};
    const flowState = store.getState().EditFlowReducer;
    console.log(flowState);
    const errors = generatePostServerErrorMessage(
        error,
        {},
        FLOW_STRINGS.FLOW_LABELS,
    );
    errorObject.server_error = errors.state_error ? errors.state_error : [];
    errorObject.common_server_error = errors.common_server_error
        ? errors.common_server_error
        : null;
    dispatch(
        updateFlowStateChange({
            ...errorObject,
        }),
    );
    displayErrorToast(
        errorMessage || FLOW_STRINGS.SERVER_RESPONSE.UPDATE_FAILURE(t),
    );
    return error;
};

export const saveEscalationsThunk = (data) => (dispatch) =>
    new Promise((resolve, reject) => {
        setPointerEvent(true);
        updatePostLoader(true);
        saveFlowEscalationsApi(data)
            .then((resData) => {
                setPointerEvent(false);
                updatePostLoader(false);
                resolve(resData);
            })
            .catch((error) => {
                setPointerEvent(false);
                updatePostLoader(false);
                handlePostErrorData(dispatch, error);
                reject(error);
            },
            );
    });

export const saveDocumentGenerationThunk = (data, isAddOnConfig) => (dispatch) =>
    new Promise((resolve, reject) => {
        setPointerEvent(true);
        updatePostLoader(true);
        saveDocumentGenerationApi(data)
            .then((resData) => {
                setPointerEvent(false);
                updatePostLoader(false);
                if (isAddOnConfig) {
                    const { activeStepDetails } = cloneDeep(store.getState().EditFlowReducer);
                    console.log('resDatasaveEmailConfigThunk', resData, 'activeStepDetails', activeStepDetails);
                    if (!isEmpty(activeStepDetails)) {
                        const { error_list } = activeStepDetails;
                        unset(error_list, 'email_actions');
                        activeStepDetails.progress = EDIT_FLOW_STEP_TABS.ADD_ON_CONFIGURATION;
                        activeStepDetails.document_generation = resData.document_generation;
                        activeStepDetails.document_url_details = resData.document_url_details || [];
                        activeStepDetails.active_document_action = {};
                        if (has(activeStepDetails, ['active_document_action_mapping_index']) &&
                            !isEmpty(get(activeStepDetails, ['docGenerationErrorList'], {}))) {
                            const { docGenerationErrorList = [] } = cloneDeep(activeStepDetails);
                            delete docGenerationErrorList[activeStepDetails.active_document_action_mapping_index];
                            activeStepDetails.docGenerationErrorList = docGenerationErrorList;
                        }
                        dispatch(updateFlowStateChange({
                            activeStepDetails: { ...activeStepDetails, error_list },
                        }));
                    }
                }
                console.log(resData);
                resolve(resData);
            })
            .catch((error) => {
                setPointerEvent(false);
                updatePostLoader(false);
                handlePostErrorData(dispatch, error);
                reject(error);
            },
            );
    });

export const saveSendEmailThunk = (data) => (dispatch) =>
    new Promise((resolve, reject) => {
        setPointerEvent(true);
        updatePostLoader(true);
        saveSendEmailApi(data)
            .then((resData) => {
                setPointerEvent(false);
                updatePostLoader(false);
                const { activeStepDetails } = cloneDeep(store.getState().EditFlowReducer);
                if (!isEmpty(activeStepDetails)) {
                    const { error_list } = activeStepDetails;
                    unset(error_list, 'email_actions');
                    set(activeStepDetails, 'error_list', error_list);
                    activeStepDetails.email_actions = resData.email_actions;
                    activeStepDetails.document_url_details = resData.document_url_details || [];
                    if (has(activeStepDetails, ['active_email_action_index']) &&
                        !isEmpty(get(activeStepDetails, ['emailActionsErrorList'], []))) {
                        const { emailActionsErrorList = {} } = cloneDeep(activeStepDetails);
                        delete emailActionsErrorList[activeStepDetails.active_email_action_index];
                        activeStepDetails.emailActionsErrorList = emailActionsErrorList;
                    }
                    if (!isEmpty(resData.validation_message)) {
                        const emailActionsErrorList = {};
                        let isEmailActionError = false;
                        resData.validation_message.forEach((eachMessage) => {
                            if (eachMessage.field.includes('email')) {
                                const emailIndex = eachMessage.field.split('.')[1];
                                if (emailIndex) {
                                    if (data.email_actions.email_uuid === activeStepDetails.email_actions[emailIndex].email_uuid) isEmailActionError = true;
                                    emailActionsErrorList[emailIndex] = isEmpty(cloneDeep(emailActionsErrorList)[emailIndex]) ? {} : cloneDeep(emailActionsErrorList)[emailIndex];
                                    if (eachMessage.field.includes('recipients')) {
                                        emailActionsErrorList[emailIndex].recipients = translate('error_popover_status.invalid_recipients');
                                        emailActionsErrorList[emailIndex].error = translate('error_popover_status.invalid_send_email');
                                        if (eachMessage.field.includes('to_recipients')) {
                                            emailActionsErrorList[emailIndex].error_list = eachMessage.field;
                                            emailActionsErrorList[emailIndex].email_uuid = activeStepDetails.email_actions[emailIndex].email_uuid;
                                        }
                                    }
                                    if (eachMessage.field.includes('action_type')) {
                                        if (!isEmpty(resData?.email_actions?.action_type || [])) {
                                            emailActionsErrorList[emailIndex].actions = translate('error_popover_status.invalid_email_action');
                                        } else {
                                            emailActionsErrorList[emailIndex].actions = translate('error_popover_status.email_action_required');
                                        }
                                        emailActionsErrorList[emailIndex].error = translate('error_popover_status.invalid_send_email');
                                    }
                                }
                            }
                        });
                        activeStepDetails.emailActionsErrorList = { ...emailActionsErrorList };
                        if (!isEmpty(emailActionsErrorList) && isEmailActionError) {
                            displayErrorToast({
                                title: translate('error_popover_status.somthing_went_wrong'),
                                subtitle: translate('error_popover_status.invalid_recipients'),
                            });
                        }
                    }
                    dispatch(updateFlowStateChange({
                        activeStepDetails,
                    }));
                }
                console.log(resData);
                resolve(resData);
            })
            .catch((error) => {
                setPointerEvent(false);
                updatePostLoader(false);
                handlePostErrorData(dispatch, error);
                reject(error);
            },
            );
    });

export const saveSendDataToDatalistThunk = (data, stepData, t) => (dispatch) =>
    new Promise((resolve, reject) => {
        setPointerEvent(true);
        updatePostLoader(true);
        saveSendDataToDatlistApi(data)
            .then((resData) => {
                setPointerEvent(false);
                updatePostLoader(false);
                const activeStepDetails = cloneDeep(stepData);
                const { error_list } = activeStepDetails;
                unset(error_list, 'data_list_mapping');
                if (!isEmpty(activeStepDetails)) {
                    activeStepDetails.data_list_mapping = resData.data_list_mapping;
                    activeStepDetails.document_url_details = resData.document_url_details || [];
                    activeStepDetails.active_data_list_mapping = {};
                    if (has(activeStepDetails, ['active_data_list_mapping_index']) &&
                        !isEmpty(get(activeStepDetails, ['datalistMappingErrorList'], []))) {
                        const { datalistMappingErrorList = {} } = cloneDeep(activeStepDetails);
                        delete datalistMappingErrorList[activeStepDetails.active_data_list_mapping_index];
                        activeStepDetails.datalistMappingErrorList = datalistMappingErrorList;
                    }
                    dispatch(updateFlowStateChange({
                        activeStepDetails: { ...activeStepDetails, error_list },
                    }));
                }
                const updatedData = {
                    activeStepDetails: { ...activeStepDetails, error_list },
                };

                resolve(updatedData);
            })
            .catch((error) => {
                setPointerEvent(false);
                updatePostLoader(false);
                const errorObj = get(error, ['response', 'data', 'errors', 0], {});
                if (
                    (errorObj.type === VALIDATION_ERROR_TYPES.UNIQUE) &&
                    (errorObj.field === FLOW_TO_DATALIST)
                ) {
                    displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.SEND_DATALIST_CONFIG_EXIST);
                } else {
                    handlePostErrorData(dispatch, error, translateFunction, FLOW_STRINGS.SERVER_RESPONSE.SEND_DATA_LIST_FAILURE(t));
                }
                reject(error);
            },
            );
    });

export const saveEmailConfigThunk = (data) => async (dispatch) => {
    setPointerEvent(true);
    updatePostLoader(true);
    try {
        const resData = await saveSendEmailApi(data);
        setPointerEvent(false);
        updatePostLoader(false);
        const { activeStepDetails } = cloneDeep(store.getState().EditFlowReducer);
        console.log('resDatasaveEmailConfigThunk', resData, 'activeStepDetails', activeStepDetails);
        if (!isEmpty(activeStepDetails)) {
            const { error_list } = activeStepDetails;
            unset(error_list, 'email_actions');
            set(activeStepDetails, 'error_list', error_list);
            activeStepDetails.email_actions = resData.email_actions;
            activeStepDetails.document_url_details = resData.document_url_details || [];
            dispatch(updateFlowStateChange({
                activeStepDetails,
            }));
        }
        console.log(resData);
        return resData;
    } catch (error) {
        setPointerEvent(false);
        updatePostLoader(false);
        handlePostErrorData(dispatch, error);
        throw Error(error);
    }
};

    export const saveSendDataToDlConfigThunk = (data, closeAddOnConfig) => (dispatch) =>
         new Promise((resolve, reject) => {
            setPointerEvent(true);
            updatePostLoader(true);
            saveSendDataToDatlistApi(data)
            .then((response) => {
                setPointerEvent(false);
                updatePostLoader(false);
                const { activeStepDetails } = cloneDeep(store.getState().EditFlowReducer);
                if (!isEmpty(activeStepDetails)) {
                    const { error_list } = activeStepDetails;
                    unset(error_list, 'mapping_error_list');
                    set(activeStepDetails, 'error_list', error_list);
                    activeStepDetails.data_list_mapping = response?.data_list_mapping;
                    activeStepDetails.document_url_details = response?.document_url_details || [];
                    dispatch(updateFlowStateChange({
                        activeStepDetails,
                    }));
                    closeAddOnConfig?.();
                }
                console.log('kansjjakjansdjkasj', activeStepDetails, response);
                resolve(response);
            })
            .catch((error) => {
                setPointerEvent(false);
                updatePostLoader(false);
                if (!isEmpty(error)) {
                    if (error?.response?.data?.errors?.[0]?.type === VALIDATION_ERROR_TYPES.ARRAY_UNIQUE) {
                        toastPopOver({
                            title: 'Configuration already exist',
                            subtitle: 'The configuration for the same action, datalist and action type already exist',
                            toastType: EToastType.error,
                          });
                    }
                    handleSaveStepAndSaveActionError(error);
                }
                reject(error);
            });
        });

export const deleteEscalationsThunk = (data, cb) => (dispatch) =>
    new Promise((resolve, reject) => {
        setPointerEvent(true);
        updatePostLoader(true);
        deleteFlowEscalationsApi(data)
            .then((resData) => {
                setPointerEvent(false);
                updatePostLoader(false);
                cb?.(data);
                resolve(resData);
            })
            .catch((error) => {
                setPointerEvent(false);
                updatePostLoader(false);
                handlePostErrorData(dispatch, error);
                reject(error);
            },
            );
    });

export const deleteDocumentGenerationThunk = (data, actionCards) => (dispatch) =>
    new Promise((resolve, reject) => {
        setPointerEvent(true);
        updatePostLoader(true);
        deleteDocumentGenerationApi(data)
            .then((resData) => {
                setPointerEvent(false);
                updatePostLoader(false);
                console.log(resData);
                const { activeStepDetails } = cloneDeep(store.getState().EditFlowReducer);
                if (!isEmpty(get(activeStepDetails, ['document_generation_error_list'], []))) {
                    const { document_generation_error_list = {} } = cloneDeep(activeStepDetails);
                    delete document_generation_error_list[activeStepDetails.active_document_action_mapping_index];
                    activeStepDetails.document_generation_error_list = document_generation_error_list;
                }
                activeStepDetails.document_generation = actionCards;
                dispatch(updateFlowStateChange({ activeStepDetails }));
                resolve(resData);
            })
            .catch((error) => {
                setPointerEvent(false);
                updatePostLoader(false);
                handlePostErrorData(dispatch, error);
                reject(error);
            });
    });

export const deleteSendEmailThunk = (data) => (dispatch) =>
    new Promise((resolve, reject) => {
        setPointerEvent(true);
        updatePostLoader(true);
        deleteSendEmailApi(data)
            .then((resData) => {
                showToastPopover('Send Email Deleted Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);
                setPointerEvent(false);
                updatePostLoader(false);
                console.log(resData);
                resolve(resData);
            })
            .catch((error) => {
                setPointerEvent(false);
                updatePostLoader(false);
                handlePostErrorData(dispatch, error);
                reject(error);
            },
            );
    });

export const deleteSendDataToDatalistThunk = (data) => (dispatch) =>
    new Promise((resolve, reject) => {
        setPointerEvent(true);
        updatePostLoader(true);
        deleteSendDataToDatalistApi(data)
            .then((resData) => {
                showToastPopover('Send Data to Datalist Deleted Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);
                setPointerEvent(false);
                updatePostLoader(false);
                console.log(resData);
                resolve(resData);
            })
            .catch((error) => {
                setPointerEvent(false);
                updatePostLoader(false);
                handlePostErrorData(dispatch, error);
                reject(error);
            },
            );
    });

export const checkStepDependencyApiThunk = (data, type, name) => async (dispatch) => {
    setPointerEvent(true);
    updatePostLoader(true);
    const { flowData } = cloneDeep(store.getState().EditFlowReducer);
    flowData.showStepDependencyDialog = true;
    flowData.isDependencyListLoading = true;
    flowData.dependencyType = type;
    flowData.dependencyName = name;
    flowData.isErrorInLoadingDependencyList = false;
    dispatch(updateFlowDataChange(flowData));
    try {
        const response = await checkStepDependencyApi(data);
        setPointerEvent(false);
        updatePostLoader(false);
        if (!isNull(response)) {
            flowData.dependencyData = response;
            flowData.isDependencyListLoading = false;
            console.log('deleteFromFlowdeleteFromFlowdeleteFromFlow', flowData);
            flowData.deleteStepDetails = data;
            dispatch(updateFlowDataChange(flowData));
            return response;
        } else {
            flowData.isDependencyListLoading = false;
            flowData.isErrorInLoadingDependencyList = true;
            dispatch(updateFlowDataChange(flowData));
            return null;
        }
    } catch (error) {
        setPointerEvent(false);
        updatePostLoader(false);
        flowData.isDependencyListLoading = false;
        flowData.isErrorInLoadingDependencyList = true;
        dispatch(updateFlowDataChange(flowData));
        throw new Error(error);
    }
};

export const getSendDataToDatalistThunk = (data) => (dispatch) =>
    new Promise((resolve, reject) => {
        setPointerEvent(true);
        updatePostLoader(true);
        getSendDataToDatlistApi(data)
            .then((resData) => {
                setPointerEvent(false);
                updatePostLoader(false);
                resolve(resData);
            })
            .catch((error) => {
                setPointerEvent(false);
                updatePostLoader(false);
                handlePostErrorData(dispatch, error);
                reject(error);
            });
    });

export const getIntegrationMappingFields =
    (
        paginationData = {},
        setStateKey = '',
        mappedFieldUuids = [],
        fieldListDropdownType,
        tableUuid = null,
        getCancelToken = () => { },
    ) => (dispatch) =>
            new Promise((resolve, reject) => {
                dispatch(updateFlowStateChange({ loadingMappingFields: true }));
                if (paginationData.page === 1) {
                    const { flowData } = cloneDeep(
                        store.getState().EditFlowReducer,
                    );
                    flowData[`all${setStateKey}`] = [];
                    flowData[`${setStateKey}paginationData`] = {};
                    dispatch(updateFlowDataChange(flowData));
                }
                getAllFields(paginationData, getCancelToken)
                    .then((res) => {
                        const { pagination_data, pagination_details } = res;
                        if (pagination_data) {
                            const { flowData } = cloneDeep(
                                store.getState().EditFlowReducer,
                            );
                            console.log('mappedFieldUuids', mappedFieldUuids, pagination_data);
                            const fields = getGroupedFieldListForMapping(tableUuid || paginationData.table_uuid, pagination_data, mappedFieldUuids, fieldListDropdownType);
                            console.log('groupedTriggerFields trigger', setStateKey, fields);
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
                                    flowData[`all${setStateKey}`] = pagination_data;
                                    flowData[paginationDataKey] = { ...pagination_details[0] };
                                } else if (pagination_details[0].page === 1) {
                                    flowData[setStateKey] = [...fields];
                                    flowData[`all${setStateKey}`] = pagination_data;
                                    flowData[paginationDataKey] = { ...pagination_details[0] };
                                }
                            } else {
                                flowData[setStateKey] = [...fields];
                                flowData[`all${setStateKey}`] = pagination_data;
                                [flowData[paginationDataKey]] = pagination_details;
                            }
                            flowData[setStateKey] = getUpdatedFields(
                                [...fields],
                                get(flowData, [setStateKey], []) || [],
                            );
                            dispatch(updateFlowDataChange(flowData));
                        }
                        dispatch(updateFlowStateChange({ loadingMappingFields: false }));
                        resolve(res);
                    })
                    .catch((err) => {
                        if (err && (err.code === 'ERR_CANCELED')) return;
                        reject(err);
                        dispatch(updateFlowStateChange({ loadingMappingFields: false }));
                        resolve(false);
                    });
            });

export const testIntegrationApiThunk = (params, stepId) => (dispatch) =>
    new Promise((resolve, reject) => {
        dispatch(updateFlowDataChange({ isTestLoading: true }));
        testIntegration(params)
            .then((response) => {
                const { flowData } = cloneDeep(store.getState().EditFlowReducer);
                const { activeIntegrationData } = flowData;
                if (stepId) {
                    const apiResponse = get(response, ['success'], false) ?
                        get(response, ['result', 'response_info', 'data'], {}) :
                        get(response, ['result', 'response_info', 'data'], {});
                    if (activeIntegrationData) {
                        activeIntegrationData.test_response = cloneDeep(apiResponse);
                        activeIntegrationData.testStatus = {
                            status: get(response, ['success'], false),
                            code: get(response, ['statusCode'], 200),
                            time: get(response, ['result', 'response_time'], 60),
                            isTested: true,
                            showResponseWindow: has(response, ['result', 'response_info', 'data']),
                        };
                        dispatch(updateFlowDataChange({ activeIntegrationData, isTestLoading: false }));
                    }
                }
                updatePostLoader(false);
                setPointerEvent(false);
                resolve(response);
            })
            .catch((error) => {
                if (stepId) {
                    const { flowData } = cloneDeep(store.getState().EditFlowReducer);
                    const { activeIntegrationData } = flowData;
                    if (activeIntegrationData) {
                        activeIntegrationData.testStatus = {
                            status: false,
                            code: EMPTY_STRING,
                            time: EMPTY_STRING,
                            isTested: true,
                            showResponseWindow: false,
                        };
                        activeIntegrationData.test_response = cloneDeep(activeIntegrationData.testStatus);
                        dispatch(updateFlowDataChange({ activeIntegrationData, isTestLoading: false }));
                    }
                }
                updatePostLoader(false);
                setPointerEvent(false);
                reject(error);
            });
    });

export const getAllIntegrationEventsApiThunk =
    (params = {}, currentConnector, setCancelToken, additionalProps = {}) => (dispatch) =>
        new Promise((resolve, reject) => {
            dispatch(
                updateFlowDataChange({
                    isEventsLoading: true,
                }),
            );
            getAllIntegrationEventsApi(params, setCancelToken)
                .then((response) => {
                    const { flowData } = cloneDeep(store.getState().EditFlowReducer);
                    const { stepId, events_list = [] } = cloneDeep(additionalProps);

                    const eventsObj = {
                        events_current_page: params.page + 1,
                        events_pagination_details: response?.pagination_details,
                        events_total_count: get(response, ['pagination_details', 0, 'total_count'], 0),
                        isEventsLoading: false,
                    };

                    let rawEventsList = [];

                    if (params?.page === 1) {
                        rawEventsList = response?.pagination_data;
                        eventsObj.events_list = getCategorisedEvents(rawEventsList);
                    } else {
                        rawEventsList = [...events_list, ...get(response, 'pagination_data', [])];
                        eventsObj.events_list = getCategorisedEvents(rawEventsList);
                    }
                    eventsObj.events_list_has_more = rawEventsList?.length < eventsObj?.events_total_count;
                    let { activeIntegrationData = {} } = cloneDeep(flowData);
                    const { steps } = cloneDeep(flowData);
                    activeIntegrationData = { ...activeIntegrationData, ...eventsObj };
                    if (stepId) {
                        const stepIndex = steps.findIndex((step) => step._id === stepId);
                        if (stepIndex > -1) {
                            steps[stepIndex] = activeIntegrationData;
                        }
                    }
                    dispatch(updateFlowDataChange({ activeIntegrationData: activeIntegrationData, steps: steps }));
                    resolve(response);
                })
                .catch((error) => {
                    if (error && error.code === 'ERR_CANCELED') return;
                    const errorList = error?.response?.data?.errors || [];
                    switch (errorList?.[0]?.type) {
                        case SOMEONE_EDITING:
                            updateSomeoneIsEditingPopover(
                                error.response.data.errors[0].message,
                                currentConnector?.connector_uuid,
                            );
                            break;
                        case ERROR_TYPE_STRING_GUID_ERROR:
                            displayErrorToast({ title: translate(SERVER_ERROR_MESSAGES.ERROR_TYPE_STRING_GUID_ERROR.TITLE) });
                            break;
                        default:
                            displayErrorToast({
                                title: translate('error_popover_status.somthing_went_wrong'),
                                subtitle: translate('error_popover_status.refresh_try_again'),
                            });
                            break;
                    }
                    dispatch(
                        updateFlowDataChange({
                            isEventsLoading: false,
                        }),
                    );
                    reject(error);
                });
        });

export const getAllFlowListApiThunk = (params, savedData) => (dispatch) => {
    if (params.page === 1) {
        dispatch(updateFlowStateChange({
            isChildFlowListLoading: true,
        }));
    }
    getAllFlows(params)
        .then((res) => {
            const { flowData } = cloneDeep(store.getState().EditFlowReducer);
            const { allFlowsList, flowsTotalCount } = cloneDeep(flowData);
            const newFlowsList = [];
            res.pagination_data.forEach((flow) => {
                if (flow.flow_uuid !== flowData.flow_uuid) {
                    newFlowsList.push({
                        label: flow.flow_name,
                        value: flow.flow_uuid,
                        flow_id: flowData.flow_id,
                    });
                }
            });
            let updatedFlowList = newFlowsList;
            if (res.pagination_details[0].page > 1) updatedFlowList = [...allFlowsList, ...newFlowsList];
            console.log('API CALL PARAMS', updatedFlowList);
            const savedStepData = savedData;
            console.log('API CALL BEING MADE SUCCESS ACTION', res.pagination_details[0].total_count, res, allFlowsList);
            dispatch(updateFlowDataChange({
                // isFlowListLoading: false,
                allFlowsList: updatedFlowList,
                flowsTotalCount: get(res, ['pagination_details', 0, 'total_count'], flowsTotalCount),
                savedStepData: savedStepData,
            }));
            dispatch(updateFlowStateChange({
                isChildFlowListLoading: false,
            }));
        })
        .catch((err) => {
            if (has(err, ['code']) && err.code === 'ERR_CANCELED') return;
            console.log('API CALL ERROR', err);
            dispatch(updateFlowStateChange({
                isChildFlowListLoading: false,
            }));
        });
};

export const getChildFlowDetailsByUUID =
    (flow_uuid, isTestBed, currentTriggerData, enableLoader = true) => (dispatch) =>
        new Promise((resolve, reject) => {
            if (enableLoader) {
                dispatch(updateFlowDataChange({
                    isChildFlowDetailsLoading: true,
                }));
            }
            apiGetFlowDetailsByUUID({
                flow_uuid,
                is_test_bed: isTestBed ? 1 : 0,
                initiation_step_details: 1, // to fetch details of first step of child flow
            })
                .then((res) => {
                    const { flowData } = cloneDeep(store.getState().EditFlowReducer);
                    console.log('published flow result', res);
                    if (currentTriggerData && currentTriggerData._id) {
                        const currentStepIndex = flowData.steps.findIndex(
                            (step) => step._id === currentTriggerData._id);
                        const currentStep = cloneDeep(flowData.steps[currentStepIndex]);
                        const { initiation_step } = res;
                        let initiationStepDetails = {};
                        if (initiation_step) {
                            initiationStepDetails = {
                                child_flow_initial_step_name: initiation_step.step_name,
                                child_flow_initial_step_assignees: initiation_step.step_assignees,
                            };
                        }
                        const updatedChildFlowDetails = {
                            ...currentStep.child_flow_details,
                            child_flow_id: res._id,
                            child_flow_name: res.flow_name,
                            child_flow_uuid: res.flow_uuid,
                            ...initiationStepDetails,
                        };
                        dispatch(flowSetStepData(
                            'child_flow_details',
                            updatedChildFlowDetails,
                            currentStepIndex,
                        ));
                    } else {
                        const currentTrigger = cloneDeep(currentTriggerData);
                        const { initiation_step } = res;
                        let initiationStepDetails = {};
                        if (initiation_step) {
                            initiationStepDetails = {
                                child_flow_initial_step_name: initiation_step.step_name,
                                child_flow_initial_step_assignees: initiation_step.step_assignees,
                            };
                        }
                        const updatedChildFlowDetails = {
                            ...currentTrigger.child_flow_details,
                            child_flow_id: res._id,
                            child_flow_name: res.flow_name,
                            child_flow_uuid: res.flow_uuid,
                            ...initiationStepDetails,
                        };
                        currentTrigger.child_flow_details = updatedChildFlowDetails;
                        dispatch(updateFlowDataChange({ activeTriggerData: currentTrigger }));
                    }
                    dispatch(updateFlowDataChange({
                        isChildFlowDetailsLoading: false,
                    }));
                    resolve(true);
                })
                .catch((err) => {
                    console.log('errr in fetching sub flow details', err);
                    displayErrorToast({
                        title: translate('error_popover_status.trigger_flow'),
                    });
                    dispatch(updateFlowDataChange({
                        isChildFlowDetailsLoading: false,
                    }));
                    reject();
                });
        });

export const getTriggerDetailsByUUID =
    (trigger_uuid, currentTriggerData, entity, documentType, entityId, isShortcut = false, t = translateFunction) => (dispatch) =>
        new Promise((resolve, reject) => {
            dispatch(updateFlowDataChange({
                isChildFlowDetailsLoading: true,
            }));
            const { flowData } = cloneDeep(store.getState().EditFlowReducer);
            getTriggerDetails({ flow_id: flowData.flow_id, trigger_uuid: [trigger_uuid] })
                .then((res) => {
                    console.log('trigger data fetched', res);
                    const { flowData } = cloneDeep(store.getState().EditFlowReducer);
                    console.log('published flow result', currentTriggerData, res, cloneDeep(flowData));
                    if (currentTriggerData && currentTriggerData._id) {
                        const currentStepIndex = flowData.steps.findIndex(
                            (step) => step._id === currentTriggerData._id);
                        const updatedStepData = cloneDeep(flowData.steps);
                        const currentStep = isShortcut ? cloneDeep(flowData.activeTriggerData) : cloneDeep(flowData.steps[currentStepIndex]);
                        const { trigger_metadata, field_metadata = [], table_metadata = [] } = res;
                        let initiationStepDetails = {};
                        if (trigger_metadata && trigger_metadata[0]) {
                            const { initiation_step } = trigger_metadata[0];
                            if (initiation_step) {
                                initiationStepDetails = {
                                    child_flow_initial_step_name: initiation_step.step_name,
                                    child_flow_initial_step_assignees: initiation_step.step_assignees,
                                };
                            }
                        }
                        const { trigger_mapping = [] } = currentTriggerData;
                        let updatedTriggerMapping = cloneDeep(trigger_mapping);
                        if ((!isEmpty(field_metadata) || !isEmpty(table_metadata))) {
                            console.log('trigger data fetched', res, documentType);
                            const { modifiedMappingData, document_details } =
                                constructTriggerMappingFieldMetadata(
                                    constructSubProcessMappingFromApiData(cloneDeep(trigger_metadata[0]?.trigger_mapping || [])),
                                    field_metadata,
                                    table_metadata,
                                    res.document_url_details || [],
                                    entityId,
                                    entity,
                                    documentType,
                                    t);
                            updatedTriggerMapping = modifiedMappingData;
                            currentStep.document_details = document_details;
                        }
                        const updatedChildFlowDetails = {
                            ...currentStep.child_flow_details,
                            child_flow_uuid: trigger_metadata?.[0]?.child_flow_uuid,
                            child_flow_id: trigger_metadata?.[0]?.child_flow_id,
                            child_flow_name: trigger_metadata?.[0]?.child_flow_name,
                            ...initiationStepDetails,
                        };
                        currentStep.child_flow_details = updatedChildFlowDetails;
                        currentStep.trigger_mapping = updatedTriggerMapping;
                        currentStep.trigger_mapping_error_list = getDeletedFieldsErrorList(currentStep?.trigger_mapping_error_list, updatedTriggerMapping, t);
                        if (isUndefined(updatedChildFlowDetails.child_flow_name)) {
                            currentStep.trigger_mapping_error_list[FLOW_TRIGGER_CONSTANTS.FLOW_SELECTION.ID] =
                                t(VALIDATION_CONSTANT.CHILD_FLOW_DELETED);
                        }
                        console.log('updatedTriggerMapping activeTriggerData', updatedChildFlowDetails);
                        if (isShortcut) {
                            dispatch(updateFlowDataChange({ activeTriggerData: currentStep }));
                        } else {
                            updatedStepData[currentStepIndex] = currentStep;
                            console.log('updatedTriggerMapping', cloneDeep(currentStep), updatedChildFlowDetails);
                            dispatch(updateFlowDataChange({ steps: updatedStepData, savedStepData: currentStep }));
                        }
                    } else {
                        const currentTrigger = cloneDeep(currentTriggerData);
                        const { trigger_metadata, field_metadata = [], table_metadata = [] } = res;
                        let initiationStepDetails = {};
                        if (trigger_metadata && trigger_metadata[0]) {
                            const { initiation_step } = trigger_metadata[0];
                            if (initiation_step) {
                                initiationStepDetails = {
                                    child_flow_initial_step_name: initiation_step.step_name,
                                    child_flow_initial_step_assignees: initiation_step.step_assignees,
                                };
                            }
                        }
                        const { trigger_mapping } = currentTriggerData;
                        let updatedTriggerMapping = cloneDeep(trigger_mapping);
                        if ((!isEmpty(field_metadata) || !isEmpty(table_metadata))) {
                            const { modifiedMappingData, document_details } =
                                constructTriggerMappingFieldMetadata(
                                    constructSubProcessMappingFromApiData(cloneDeep(trigger_metadata[0]?.trigger_mapping || [])),
                                    field_metadata,
                                    table_metadata,
                                    res.document_url_details || [],
                                    entityId,
                                    entity,
                                    documentType,
                                    t);
                            updatedTriggerMapping = modifiedMappingData;
                            currentTrigger.document_details = document_details;
                        }
                        const updatedChildFlowDetails = {
                            ...currentTrigger.child_flow_details,
                            child_flow_uuid: trigger_metadata?.[0]?.child_flow_uuid,
                            child_flow_id: trigger_metadata?.[0]?.child_flow_id,
                            child_flow_name: trigger_metadata?.[0]?.child_flow_name,
                            ...initiationStepDetails,
                        };
                        console.log('updatedTriggerMapping', updatedChildFlowDetails);
                        currentTrigger.child_flow_details = updatedChildFlowDetails;
                        currentTrigger.trigger_mapping = updatedTriggerMapping;
                        currentTrigger.trigger_mapping_error_list = getDeletedFieldsErrorList(currentTrigger.trigger_mapping_error_list, updatedTriggerMapping, t);
                        if (isUndefined(updatedChildFlowDetails.child_flow_name)) {
                            currentTrigger.trigger_mapping_error_list[FLOW_TRIGGER_CONSTANTS.FLOW_SELECTION.ID] =
                                t(VALIDATION_CONSTANT.CHILD_FLOW_DELETED);
                        }
                        dispatch(updateFlowDataChange({ activeTriggerData: currentTrigger }));
                    }
                    dispatch(updateFlowDataChange({
                        isChildFlowDetailsLoading: false,
                    }));
                    resolve(true);
                })
                .catch((err) => {
                    console.log('errr in fetching trigger details', err);
                    displayErrorToast({
                        title: translate('error_popover_status.fetch_details'),
                    });
                    dispatch(updateFlowDataChange({
                        isChildFlowDetailsLoading: false,
                    }));
                    reject();
                });
        });

export const getTriggerMappingFields =
    (
        paginationData = {},
        setStateKey = '',
        mapping = [],
        fieldListDropdownType = null,
        tableUuid = null,
        cancelToken = null,
        t = translateFunction,
    ) => (dispatch) =>
            new Promise((resolve, reject) => {
                if (paginationData.page === 1) {
                    dispatch(updateFlowDataChange({
                        [`all${setStateKey}`]: [],
                        [setStateKey]: [],
                        [`loading${setStateKey}`]: true,
                    }));
                }
                getAllFields(paginationData, cancelToken)
                    .then((res) => {
                        console.log('dsffdsf24234234efsd543', res, setStateKey, paginationData);
                        const { pagination_data, pagination_details } = res;
                        if (pagination_data) {
                            const { flowData } = cloneDeep(
                                store.getState().EditFlowReducer,
                            );
                            const mappedFieldUuids = [];
                            mapping.forEach((eachMapping) => {
                                if (!isEmpty(get(eachMapping, ['child_field_details', 'field_uuid'], []))) {
                                    mappedFieldUuids.push(get(eachMapping, ['child_field_details', 'field_uuid'], []));
                                }
                                if (!isEmpty(get(eachMapping, ['child_table_details', 'table_uuid'], []))) {
                                    mappedFieldUuids.push(get(eachMapping, ['child_table_details', 'table_uuid'], []));
                                }
                                if (!isEmpty(get(eachMapping, ['field_mapping'], []))) {
                                    get(eachMapping, ['field_mapping'], []).forEach((eachSubMapping) => {
                                        if (!isEmpty(get(eachSubMapping, ['child_field_details', 'field_uuid'], []))) {
                                            mappedFieldUuids.push(get(eachSubMapping, ['child_field_details', 'field_uuid'], []));
                                        }
                                    });
                                }
                            });
                            console.log('mappedFieldUuids groupedTriggerFields trigger', mappedFieldUuids, pagination_data, fieldListDropdownType, tableUuid);
                            const fields = getGroupedFieldListForMapping(tableUuid || paginationData.table_uuid, pagination_data, mappedFieldUuids, fieldListDropdownType, t);
                            console.log('groupedTriggerFields trigger', setStateKey, fields);
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
                                    flowData[`${setStateKey}MetaData`] = [
                                        ...flowData[setStateKey],
                                        ...fields,
                                    ];
                                    flowData[`all${setStateKey}`] = [
                                        ...pagination_data,
                                        ...fields,
                                    ];
                                    flowData[paginationDataKey] = { ...pagination_details[0] };
                                } else if (pagination_details[0].page === 1) {
                                    flowData[setStateKey] = [...fields];
                                    flowData[`${setStateKey}MetaData`] = [...fields];
                                    flowData[`all${setStateKey}`] = pagination_data;
                                    flowData[paginationDataKey] = { ...pagination_details[0] };
                                }
                            } else {
                                flowData[setStateKey] = [...fields];
                                flowData[`${setStateKey}MetaData`] = [...fields];
                                flowData[`all${setStateKey}`] = pagination_data;
                                [flowData[paginationDataKey]] = pagination_details;
                            }
                            console.log('sdf234dfsf234dfsf324rs', cloneDeep(flowData));
                            flowData[setStateKey] = getUpdatedFields(
                                [...fields],
                                get(flowData, [setStateKey], []) || [],
                            );
                            flowData[`${setStateKey}MetaData`] = getUpdatedFields(
                                [...fields],
                                get(flowData, [setStateKey], []) || [],
                            );
                            flowData[`loading${setStateKey}`] = false;
                            flowData.triggerMappedUuids = mappedFieldUuids;
                            dispatch(updateFlowDataChange(flowData));
                        } else {
                            dispatch(updateFlowDataChange({
                                [`loading${setStateKey}`]: false,
                            }));
                        }
                        resolve(res);
                    })
                    .catch((err) => {
                        if (has(err, ['code']) && err.code === 'ERR_CANCELED') return;
                        reject(err);
                        dispatch(updateFlowDataChange({
                            [`loading${setStateKey}`]: false,
                        }));
                        resolve(false);
                    });
            });

export const deleteStepAPIThunk = (index, t = translateFunction) => async (dispatch) => {
    const flowData = cloneDeep(
        store.getState().EditFlowReducer.flowData,
    );
    if (flowData.steps?.[index]?.step_uuid) {
        dispatch(updateFlowStateChange({
            deleteStepLoading: true,
        }));
        setPointerEvent(true);
        updatePostLoader(true);
        try {
            const deleteStepId = flowData.steps[index]._id;
            const deleteStepUuid = flowData.steps[index].step_uuid;
            await deleteStep({ _id: deleteStepId });
            showToastPopover('Step Deleted Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);
            setPointerEvent(false);
            updatePostLoader(false);
            flowData.steps.splice(index, 1);
            if (flowData.steps.length > 0) {
                flowData.steps.forEach((step, stepIndex) => {
                    flowData.steps[stepIndex].step_order = stepIndex + 1;
                    const { connected_steps } = step;
                    const connectedStepIndex = connected_steps && connected_steps.findIndex((connectedStep) => connectedStep.destination_step === deleteStepUuid);
                    if (connectedStepIndex > -1) {
                        connected_steps.splice(connectedStepIndex, 1);
                        flowData.steps[stepIndex].connected_steps = connected_steps;
                    }
                });
                dispatch(
                    updateStepOrderApiThunk(
                        getStepOrderData(cloneDeep(flowData)),
                    ),
                );
            }
            flowData.showStepDependencyDialog = false;
            dispatch(updateFlowStateChange({
                flowData,
                selectedStepType: null,
                activeStepId: null,
                isNodeConfigOpen: false,
            }));
        } catch (err) {
            console.log('catch delete step error', err);
            setPointerEvent(false);
            updatePostLoader(false);
            if (err?.response?.data?.errors[0]?.type === SOMEONE_EDITING) {
                updateSomeoneIsEditingPopover(err.response.data.errors[0]?.message);
            } else {
                const errorObject = {};
                const flowState = store.getState().EditFlowReducer;
                const errors = generatePostServerErrorMessage(
                    err,
                    flowState.server_error,
                    FLOW_STRINGS.FLOW_LABELS,
                );
                errorObject.server_error = errors.state_error
                    ? errors.state_error
                    : [];
                errorObject.common_server_error = errors.common_server_error
                    ? errors.common_server_error
                    : EMPTY_STRING;
                dispatch(updateFlowStateChange(errorObject));
                displayErrorToast(
                    FLOW_STRINGS.SERVER_RESPONSE
                        .UPDATE_FAILURE(t),
                );
            }
        }
    }
};

export const deleteActionApiThunk = ({ postData, flowData }) => async (dispatch) => {
    try {
        const res = await deleteAction(postData);
        if (isEmpty(flowData)) {
            flowData = cloneDeep(store.getState().EditFlowReducer.flowData);
        }
        if (!isEmpty(res?.removed_system_ends)) {
            flowData = await dispatch(removeSystemEnds(res?.removed_system_ends, flowData));
        }
        const stepIndex = flowData?.steps.findIndex((step) => step._id === postData._id);
        if (stepIndex > -1) {
            const stepDetails = flowData?.steps?.[stepIndex] || {};
            const deletedActionIndex = stepDetails?.actions.findIndex((action) => action.action_uuid === postData.action_uuid);
            if (deletedActionIndex > -1) {
                stepDetails.actions.splice(deletedActionIndex, 1);
                stepDetails.connected_steps = getConnectedStepsFromActions(stepDetails?.actions);
                set(flowData, ['steps', stepIndex], stepDetails);
            }
        }
        return flowData;
    } catch (e) {
        throw Error(e);
    }
};

export const saveStepActionThunk =
  ({ data, currentStepId }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      updatePostLoader(true);
      saveStepActionApi(data)
        .then((res) => {
          updatePostLoader(false);
          const { flowData } = cloneDeep(store.getState().EditFlowReducer);
          const stepIndex = flowData.steps.findIndex(
            (step) => step.step_uuid === currentStepId,
          );

          set(flowData, ['steps', stepIndex, 'actions'], res?.actions);
          set(flowData, ['steps', stepIndex, 'connected_steps'], data?.connected_steps);

          dispatch(updateStepCoordinatesAfterLinkChange(flowData, stepIndex, {}, false, false));

          dispatch(
            updateFlowStateChange({
              isConditionConfigurationModalOpen: false,
            }),
          );

          console.log('saveStepActionThunk', res);
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          handleSaveStepAndSaveActionError(err);
          updatePostLoader(false);
          reject(err);
        });
    });
