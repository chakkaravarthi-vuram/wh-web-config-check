import { cloneDeep, set, isEmpty, uniq, uniqBy, get } from 'utils/jsUtility';
import { store } from '../../Store';
import { createNewStepWithCoordinates, saveStepStatusesAPIThunk, updateStepOrderApiThunk } from './EditFlow.Action';
import { FORM_POPOVER_STATUS, ROUTE_METHOD, STEP_TYPE } from '../../utils/Constants';
import { clearFlowCreationPromptData, updateFlowDataChange, updateFlowStateChange } from '../reducer/EditFlowReducer';
import { translateFunction } from '../../utils/jsUtility';
import { getStepOrderData } from '../../containers/edit_flow/step_configuration/StepConfiguration.utils';
import { getStepCoordinates } from '../../containers/edit_flow/diagramatic_flow_view/DigramaticFlowView.utils';
import { getShortCode, routeNavigate, setPointerEvent, showToastPopover, updatePostLoader } from '../../utils/UtilityFunctions';
import { saveForm } from '../../axios/apiService/flow.apiService';
import { FIELD_LIST_TYPE } from '../../utils/constants/form.constant';
import { CREATE_STEP_INIT_DATA, FLOW_PROMPT_STEP_CREATION_STATUS, STEP_CONFIG_PROGRESS } from '../../containers/edit_flow/EditFlow.constants';
import { ACTION_TYPE } from '../../utils/constants/action.constant';
import { ASSIGNEE_TYPE } from '../../containers/edit_flow/EditFlow.utils';
import { postFlowCreationPrompt } from '../../axios/apiService/FlowCreationPrompt.apiService';
import { createTaskSetState } from '../reducer/CreateTaskReducer';
import { CREATE_FLOW_INIT_DATA } from '../../containers/flow/Flow.constants';
import { PROMPT_TYPE } from '../../components/prompt_input/PromptInput.constants';
import { FLOW_CREATION_NLP } from '../../containers/flow/listFlow/listFlow.strings';
import { ERR_CANCELED } from '../../utils/ServerConstants';
import { saveStepActionThunk, saveStepAPIThunk, saveStepCoordinatesThunk } from './FlowStepConfiguration.Action';
import { saveFormWithField } from '../../axios/apiService/createTaskFromPrompt.apiService';
import { FORM_LAYOUT_TYPE } from '../../containers/form/Form.string';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export const postFlowCreationPromptThunk = (params, controller, history, pathdata, t) => async (dispatch) => {
    try {
        dispatch(createTaskSetState({ isMlTaskLoading: true, promptType: PROMPT_TYPE.FLOW, controller }));
        const response = await postFlowCreationPrompt(params, {}, controller?.signal);
        dispatch(createTaskSetState({ isMlTaskLoading: false, promptType: null }));
        if (isEmpty(response)) {
            showToastPopover(
                t(FLOW_CREATION_NLP.FAILURE),
                EMPTY_STRING,
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
            );
        } else {
            const { flowData } = cloneDeep(store.getState().EditFlowReducer);
            await dispatch(updateFlowStateChange({
                ...CREATE_FLOW_INIT_DATA,
                isFromPromptCreation: true,
                promptStepsData: response.steps,
                flowData: {
                    ...flowData,
                    flow_name: response.flow_name,
                    flow_short_code: getShortCode(response.flow_name),
                },
            }));
            routeNavigate(history, ROUTE_METHOD.PUSH, pathdata.pathname, pathdata?.search, {}, true);
        }
        return response;
    } catch (e) {
        console.log('failed ml prompt', e);
        if (e.code === ERR_CANCELED) return null;
        dispatch(createTaskSetState({ isMlTaskLoading: false, promptType: null }));
        showToastPopover(
            t(FLOW_CREATION_NLP.FAILURE),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
        );
        return null;
    }
};

export const saveFormAndHandleResponse = async ({ stepData, formFieldsIdAndName, flowParams, stepsListWithForm }) => {
    console.log(stepData.creation_status, stepData, 'klgjljdlkfjgkljfkljdj');
    let isImportFailed = false;
    if (
        (stepData.step_type === STEP_TYPE.USER_STEP) &&
        (stepData.creation_status === FLOW_PROMPT_STEP_CREATION_STATUS.SAVE_STEP) &&
        stepData?.form?.sections
    ) {
        const formData = cloneDeep(stepData.form);
        if (!stepData.is_initiation) {
            (formData.sections || []).map((section) => {
                (section?.field_list || []).map((fieldList) => {
                    if (
                        (fieldList.field_list_type === FIELD_LIST_TYPE.TABLE) &&
                        (fieldList?.table_import_details)
                    ) {
                        const tableToBeImported = formFieldsIdAndName.find(({ step_name, table_name }) => (
                            (fieldList.table_import_details?.step_name === step_name) &&
                            (fieldList.table_import_details?.table_name === table_name)
                        ));
                        if (tableToBeImported) {
                            fieldList.table_name = tableToBeImported.table_name;
                            fieldList.table_uuid = tableToBeImported.table_uuid;
                            delete fieldList.table_import_details;
                        } else isImportFailed = true;
                    }
                    (fieldList?.fields || []).map((field) => {
                        if (field?.import_details) {
                            const fieldToBeImported = formFieldsIdAndName.find(({ step_name, section_name, field_name }) => (
                                (field.import_details?.step_name === step_name) &&
                                (field.import_details?.section_name === section_name) &&
                                (field.import_details?.field_name === field_name)
                            ));
                            if (fieldToBeImported) {
                                field.field_name = fieldToBeImported.field_name;
                                field.field_uuid = fieldToBeImported.field_uuid;
                                field.field_id = fieldToBeImported.field_id;
                                delete field.import_details;
                            } else isImportFailed = true;
                        }
                        return field;
                    });
                    return fieldList;
                });
                return section;
            });
        }
        if (!isImportFailed) {
            try {
                const formResponseData = await saveForm({
                    ...flowParams,
                    ...formData,
                    step_id: stepData._id,
                    step_uuid: stepData.step_uuid,
                });
                if (formResponseData?.sections) {
                    (formResponseData.sections || []).forEach((section) => {
                        const sectionDetails = {
                            section_name: section.section_name,
                            section_uuid: section.section_uuid,
                        };
                        (section?.field_list || []).forEach((fieldList) => {
                            if (fieldList.field_list_type === FIELD_LIST_TYPE.TABLE) {
                                const savedFieldListIndex = formFieldsIdAndName.findIndex(({ identifier }) => (
                                    identifier === `${stepData.step_name},${fieldList.table_name}`
                                ));
                                if (savedFieldListIndex === -1) {
                                    formFieldsIdAndName.push({
                                        step_name: stepData.step_name,
                                        ...sectionDetails,
                                        table_uuid: fieldList.table_uuid,
                                        table_name: fieldList.table_name,
                                        identifier: `${stepData.step_name},${fieldList.table_name}`,
                                    });
                                }
                            }
                            (fieldList?.fields || []).forEach(({ field_id, field_uuid, field_name }) => {
                                const savedFieldIndex = formFieldsIdAndName.findIndex(({ identifier }) => (
                                    identifier === `${stepData.step_name},${sectionDetails.section_name},${field_name}`
                                ));
                                if (savedFieldIndex === -1) {
                                    formFieldsIdAndName.push({
                                        step_name: stepData.step_name,
                                        ...sectionDetails,
                                        field_id,
                                        field_uuid,
                                        field_name,
                                        identifier: `${stepData.step_name},${sectionDetails.section_name},${field_name}`,
                                    });
                                }
                            });
                        });
                    });
                    const selectedStepIndex = stepsListWithForm.findIndex((stepWithForm) => (stepWithForm._id === stepData._id));
                    if (
                        (selectedStepIndex > -1) &&
                        !isEmpty(stepsListWithForm[selectedStepIndex]?.actions) &&
                        (stepsListWithForm[selectedStepIndex].savedProgress === STEP_CONFIG_PROGRESS.STEP_DETAILS_AND_ACTORS)
                    ) {
                        await set(stepsListWithForm, [selectedStepIndex, 'savedProgress'], STEP_CONFIG_PROGRESS.ADDITIONAL_CONFIG);
                        return {
                            stepsListWithForm,
                            stepData,
                            formFieldsIdAndName,
                        };
                    }
                }
                return {};
            } catch (err) {
                console.log('Save form failed', err);
                return {};
            }
        }
        return {};
    }
    return {};
};

export const updateCreateStepResponse = (promptStepsData, index, response, stepIdAndNameList, stepStatuses) => {
    set(promptStepsData, [index, 'step_uuid'], response.step_uuid);
    set(promptStepsData, [index, '_id'], response._id);
    set(promptStepsData, [index, 'step_order'], stepIdAndNameList.length + 1);
    set(promptStepsData, [index, 'creation_status'], FLOW_PROMPT_STEP_CREATION_STATUS.CREATE_STEP);
    if (promptStepsData[index]?.step_status) {
        stepStatuses.push(promptStepsData[index].step_status);
    }
    stepIdAndNameList.push({
        step_id: response._id,
        step_uuid: response.step_uuid,
        step_name: response.step_name,
    });
};

export const getUserAndTeamsId = ({ users = [], teams = [] }) => {
    const assignees = {};
    if (teams?.length > 0) {
        const teamsUuid = [];
        teams.forEach(({ _id }) => { teamsUuid.push(_id); });
        assignees.teams = teamsUuid;
    }
    if (users?.length > 0) {
        const usersUuid = [];
        users.forEach(({ _id }) => { usersUuid.push(_id); });
        assignees.users = usersUuid;
    }
    return assignees;
};

export const getSaveActionsData = (step, stepIdAndNameList) => {
    const data = {};
    if (step?.actions?.length > 0) {
        const formattedActionData = [];
        (step.actions || []).forEach((action) => {
            const additionalActionData = {};
            if ([ACTION_TYPE.FORWARD, ACTION_TYPE.END_FLOW].includes(action.action_type)) {
                additionalActionData.is_condition_rule = false;
                const next_step_uuid = [];
                (action?.next_step_uuid || []).forEach((nextStepUuid) => {
                    const selectedStep = stepIdAndNameList.find((savedStep) => (nextStepUuid === savedStep.step_name));
                    if (selectedStep && selectedStep.step_uuid) {
                        next_step_uuid.push(selectedStep.step_uuid);
                    }
                });
                if ([ACTION_TYPE.FORWARD].includes(action.action_type)) {
                    additionalActionData.is_next_step_rule = false;
                }
                // If all actions are updated with step id, push action data
                if (action?.next_step_uuid?.length === next_step_uuid.length) {
                    formattedActionData.push({
                        ...action,
                        next_step_uuid,
                        ...additionalActionData,
                    });
                }
            } else if (
                [ACTION_TYPE.CANCEL, ACTION_TYPE.SEND_BACK, ACTION_TYPE.ASSIGN_REVIEW].includes(action.action_type)
            ) {
                formattedActionData.push({
                    ...action,
                });
            }
        });
        if (formattedActionData?.length > 0) {
            data.actions = formattedActionData;
        }
    }
    if (step?.connected_steps) {
        const formattedConnectedSteps = [];
        (step?.connected_steps || []).forEach((connectedStep) => {
            const connectedStepsList = [];
            (connectedStep?.step_id || []).forEach((stepId) => {
                const selectedStep = stepIdAndNameList.find((savedStep) => (stepId === savedStep.step_name));
                if (selectedStep && selectedStep.step_id) {
                    connectedStepsList.push(selectedStep.step_id);
                }
            });
            if (connectedStepsList.length > 0) {
                formattedConnectedSteps.push({
                    ...connectedStep,
                    step_id: connectedStepsList[0],
                });
            }
        });
        if (formattedConnectedSteps.length > 0) {
            const uniqueConnectedSteps = uniqBy(formattedConnectedSteps, (s) => s.step_uuid);
            data.connected_steps = uniqueConnectedSteps;
        }
    }
    return {
        ...data,
        step_uuid: step.step_uuid,
        _id: step._id,
    };
};

export const getSaveStepPostData = (step, stepIdAndNameList) => {
    if (
        (step.step_type === STEP_TYPE.USER_STEP) &&
        (step.step_name) &&
        (step?.creation_status === FLOW_PROMPT_STEP_CREATION_STATUS.CREATE_STEP)
    ) {
        if (step.step_assignees?.length > 0) {
            const formattedStepAssigneeData = [];
            (step?.step_assignees || []).forEach((stepAssignee) => {
                const assignees = {};
                if (stepAssignee?.assignees?.teams?.length > 0) assignees.teams = stepAssignee.assignees.teams;
                if (stepAssignee?.assignees?.users?.length > 0) assignees.users = stepAssignee.assignees.users;
                if (!isEmpty(assignees.teams) || !isEmpty(assignees.users)) {
                    formattedStepAssigneeData.push({
                        assignee_type: ASSIGNEE_TYPE.DIRECT_ASSIGNEE,
                        assignees,
                    });
                }
            });
            if (formattedStepAssigneeData.length > 0) {
                step.step_assignees = formattedStepAssigneeData;
            } else delete step.step_assignees;
        }
        // if (step?.actions?.length > 0) {
        //     const formattedActionData = [];
        //     (step.actions || []).forEach((action) => {
        //         const additionalActionData = {};
        //         if ([ACTION_TYPE.FORWARD, ACTION_TYPE.END_FLOW].includes(action.action_type)) {
        //             additionalActionData.is_condition_rule = false;
        //             const next_step_uuid = [];
        //             (action?.next_step_uuid || []).forEach((nextStepUuid) => {
        //                 const selectedStep = stepIdAndNameList.find((savedStep) => (nextStepUuid === savedStep.step_name));
        //                 if (selectedStep && selectedStep.step_uuid) {
        //                     next_step_uuid.push(selectedStep.step_uuid);
        //                 }
        //             });
        //             if ([ACTION_TYPE.FORWARD].includes(action.action_type)) {
        //                 additionalActionData.is_next_step_rule = false;
        //             }
        //             // If all actions are updated with step id, push action data
        //             if (action?.next_step_uuid?.length === next_step_uuid.length) {
        //                 formattedActionData.push({
        //                     ...action,
        //                     next_step_uuid,
        //                     ...additionalActionData,
        //                 });
        //             }
        //         } else if (
        //             [ACTION_TYPE.CANCEL, ACTION_TYPE.SEND_BACK, ACTION_TYPE.ASSIGN_REVIEW].includes(action.action_type)
        //         ) {
        //             formattedActionData.push({
        //                 ...action,
        //             });
        //         }
        //     });
        //     if (formattedActionData?.length > 0) {
        //         step.actions = formattedActionData;
        //     } else delete step.actions;
        // }
        if (step?.connected_steps) {
            const formattedConnectedSteps = [];
            (step?.connected_steps || []).forEach((connectedStep) => {
                const connectedStepsList = [];
                (connectedStep?.step_id || []).forEach((stepId) => {
                    const selectedStep = stepIdAndNameList.find((savedStep) => (stepId === savedStep.step_name));
                    if (selectedStep && selectedStep.step_id) {
                        connectedStepsList.push(selectedStep.step_id);
                    }
                });
                if (connectedStepsList.length > 0) {
                    formattedConnectedSteps.push({
                        ...connectedStep,
                        step_id: connectedStepsList[0],
                    });
                }
            });
            if (formattedConnectedSteps.length > 0) {
                const uniqueConnectedSteps = uniqBy(formattedConnectedSteps, (s) => s.step_uuid);
                step.connected_steps = uniqueConnectedSteps;
            } else delete step.connected_steps;
        }
        const formattedSaveStepData = cloneDeep(step);
        delete formattedSaveStepData.creation_status;
        delete formattedSaveStepData.form;
        delete formattedSaveStepData.is_timer;
        delete formattedSaveStepData.is_workload_assignment;
        delete formattedSaveStepData.coordinate_info;
        delete formattedSaveStepData.actions;
        delete formattedSaveStepData.step_description;
        delete formattedSaveStepData.collect_data;

        console.log('step data after adding next step', step, formattedSaveStepData);
        return formattedSaveStepData;
    }
    return null;
};

export const processDataFromPromptCreation = () => async (dispatch) => {
    try {
        await dispatch(updateFlowDataChange({ isFlowModalDisabled: true }));
        const {
            flowData,
            promptStepsData,
        } = cloneDeep(store.getState().EditFlowReducer);
        const flowParams = {
            flow_id: flowData.flow_id,
            flow_uuid: flowData.flow_uuid,
        };

        const stepIdAndNameList = [];
        const createdStepsData = [];
        const createStepPromises = [];
        const stepStatuses = [];
        promptStepsData?.forEach(async (step, index) => {
            const data = {
                step_name: step.step_name,
                step_type: step.step_type || CREATE_STEP_INIT_DATA.step_type,
                is_initiation: step.is_initiation || CREATE_STEP_INIT_DATA.is_initiation,
                coordinate_info: step.coordinate_info || CREATE_STEP_INIT_DATA.coordinate_info,
            };
            createStepPromises.push(
                dispatch(createNewStepWithCoordinates({
                    params: { ...flowParams, ...data },
                    flowData,
                    additionalData: { editFlowInitialLoading: false },
                    firstStep: false,
                    callbackFunction: async (response, updatedFlowData, callback, newStepData) => {
                        updateCreateStepResponse(promptStepsData, index, response, stepIdAndNameList, stepStatuses);

                        const mlSections = get(step, ['form', 'sections'], []);
                        let hasFields = false;
                        for (let sectionIndex = 0; sectionIndex < mlSections.length; sectionIndex++) {
                            const contents = get(mlSections, [sectionIndex, 'contents'], []) || [];
                            hasFields = hasFields || contents?.some((eachLayout) => eachLayout.type === FORM_LAYOUT_TYPE.FIELD);

                            if (hasFields) break;
                        }

                        if (hasFields) {
                            const postData = {
                              sections: mlSections,
                              flow_id: get(response, ['flow_id'], null),
                              step_id: get(response, ['_id'], null),
                              form_uuid: get(response, ['form_metadata', 'form_uuid'], null),
                            };
                            await saveFormWithField(postData);
                          }

                        createdStepsData.push({
                            ...newStepData,
                            coordinate_info: step.coordinate_info,
                            step_order: createdStepsData.length + 1,
                        });
                    },
                    waitForCallback: true,
                })),
            );
        });
        const data = await Promise.allSettled(createStepPromises);
        console.log(data, 'create step promises list response');
        flowData.steps = createdStepsData;
        flowData.step_statuses = uniq(stepStatuses || []);
        if (flowData.step_statuses.length > 0) {
            const postData = {
                flow_id: flowData.flow_id,
                step_statuses: flowData.step_statuses,
            };
            await dispatch(saveStepStatusesAPIThunk(postData, flowData, true));
        }
        await dispatch(updateFlowDataChange(flowData));
        const isUpdateStatusSuccess = await dispatch(
            updateStepOrderApiThunk(
                getStepOrderData(flowData),
                translateFunction,
            ),
        );
        if (isUpdateStatusSuccess) {
            console.log(stepIdAndNameList, 'update step order success', data, promptStepsData, createdStepsData, flowData);
            const saveStepPromises = [];
            const saveActionPromises = [];
            const savedStepsData = cloneDeep(createdStepsData);
            promptStepsData?.forEach((promptStep) => {
                const saveStepPromiseData = getSaveActionsData(promptStep, stepIdAndNameList);
                    if (saveStepPromiseData) {
                        saveActionPromises.push(
                            dispatch(saveStepActionThunk({
                                data: {
                                    ...saveStepPromiseData,
                                    flow_id: flowParams.flow_id,
                                },
                                currentStepId: saveStepPromiseData._id,
                            })),
                        );
                    }
            });
            const saveActionPromisesResponseData = await Promise.allSettled(saveActionPromises);
            console.log(saveActionPromisesResponseData, 'save step action responses', cloneDeep(savedStepsData), savedStepsData);

            promptStepsData?.forEach((promptStep) => {
                const saveStepPromiseData = getSaveStepPostData(promptStep, stepIdAndNameList);
                    if (saveStepPromiseData) {
                        saveStepPromises.push(
                            dispatch(saveStepAPIThunk({
                                postData: {
                                        ...saveStepPromiseData,
                                        flow_id: flowParams.flow_id,
                                    },
                                // nextTabIndex,
                                dontUpdateData: true,
                                // isSaveAndClose,
                                // validateCurrentTab,
                                // isNewStep,
                                // label,
                                // updateConnectedSteps,
                                promptStep,
                            })),
                        );
                    }
            });
            const savePromisesResponseData = await Promise.allSettled(saveStepPromises);
            console.log(savePromisesResponseData, 'save step responses', cloneDeep(savedStepsData), savedStepsData);
            const coordinate_data = getStepCoordinates({ steps: savedStepsData });
            console.log('positioning steps', cloneDeep(savedStepsData), coordinate_data);
            const positionedStepsData = cloneDeep(savedStepsData);
            coordinate_data.forEach((coordinateInfo) => {
                const stepIndex = positionedStepsData.findIndex((stepData) => stepData._id === coordinateInfo.step_id);
                if (stepIndex > -1) {
                    set(positionedStepsData, [stepIndex, 'coordinate_info'], coordinateInfo.coordinate_info);
                }
            });
            flowData.steps = positionedStepsData;
            await dispatch(updateFlowDataChange(flowData));
            await dispatch(saveStepCoordinatesThunk({
                coordinate_data,
                ...flowParams,
            }));
            const initialStep = promptStepsData.find((stepData) => stepData.is_initiation);
            const stepsListWithForm = cloneDeep(positionedStepsData);
            const formFieldsIdAndName = [];
            await saveFormAndHandleResponse({ stepData: initialStep, formFieldsIdAndName, flowParams, stepsListWithForm });
            // eslint-disable-next-line no-restricted-syntax
            for (const element of promptStepsData) {
                const stepData = element;
                if (!stepData.is_initiation) {
                    // eslint-disable-next-line no-await-in-loop
                    await saveFormAndHandleResponse({ stepData, formFieldsIdAndName, flowParams, stepsListWithForm });
                }
            }
            flowData.steps = stepsListWithForm;
            console.log(cloneDeep(stepsListWithForm), 'steps list with form');
            await dispatch(updateFlowDataChange(flowData));
            dispatch(clearFlowCreationPromptData());
            setPointerEvent(false);
            updatePostLoader(false);
        }
    } catch (error) {
        console.log(error);
    }
};
