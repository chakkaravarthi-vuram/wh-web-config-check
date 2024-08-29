import { set, cloneDeep, uniq, isEmpty } from 'utils/jsUtility';
import { v4 as uuidV4 } from 'uuid';
import TriangleDownIcon from '../../assets/icons/app_builder_icons/TriangleDown';
import { postCreateDatalistFromPrompt } from '../../axios/apiService/createDatalistFromPrompt.apiService';
import { saveDataList, publishDataList } from '../../axios/apiService/dataList.apiService';
import { postFlowCreationPrompt } from '../../axios/apiService/FlowCreationPrompt.apiService';
import { saveFlow, createStep, saveFlowStepStatuses, updateStepOrder, saveStep, saveStepCoordinates, publishFlow, generateEntityReferenceNameAPI } from '../../axios/apiService/flow.apiService';
import { AppBuilderElementDefaultDimensions, getAppPageUrl } from '../../containers/application/app_builder/AppBuilder.utils';
import { APP_CONFIGURATION_DASHBOARD_TYPE, APP_CONFIGURATION_TYPE } from '../../containers/application/app_configuration/AppConfiguration.constants';
import { getStepCoordinates } from '../../containers/edit_flow/diagramatic_flow_view/DigramaticFlowView.utils';
import { CREATE_STEP_INIT_DATA, FLOW_PROMPT_STEP_CREATION_STATUS } from '../../containers/edit_flow/EditFlow.constants';
import { getStepOrderData } from '../../containers/edit_flow/step_configuration/StepConfiguration.utils';
import { store } from '../../Store';
import { PUBLISH_FLOW } from '../../urls/ApiUrls';
import { FORM_POPOVER_STATUS, ROUTE_METHOD, SYSTEM_TEAMS_CODE, TEAM_TYPES } from '../../utils/Constants';
import { updatePostLoader } from '../../utils/loaderUtils';
import { COLOR_CONSTANTS } from '../../utils/UIConstants';
import { getShortCode, routeNavigate, setPointerEvent, showToastPopover } from '../../utils/UtilityFunctions';
import { applicationStateChange } from '../reducer/ApplicationReducer';
import { createTaskSetState } from '../reducer/CreateTaskReducer';
import { getAllTeamsAppDataThunk, saveComponentApiThunk, savePagesThunk } from './Appplication.Action';
import { getSaveStepPostData, getUserAndTeamsId, saveFormAndHandleResponse, updateCreateStepResponse } from './FlowCreationPrompt.Action';
import { postAppCreationPromptApiService } from '../../axios/apiService/AppCreationWithPrompt.apiService';
import { PROMPT_HEADERS, PROMPT_TYPE } from '../../components/prompt_input/PromptInput.constants';
import { APP_CREATION_NLP } from '../../containers/application/application.strings';
import { ERR_CANCELED } from '../../utils/ServerConstants';
import { saveFormWithField } from '../../axios/apiService/createTaskFromPrompt.apiService';
import { DATA_LIST_TECHNICAL_CONFIG_ID, FLOW_TECHNICAL_CONFIG_ID } from '../../containers/edit_flow/settings/technical_configuration/TechnicalConfiguration.strings';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const INITIAL_PAGE_FOR_TASKS = {
    name: 'All Tasks',
    task: PROMPT_TYPE.TASK,
};

export const postAppCreationPrompt = (params, controller, history, pathdata, t) => async (dispatch) => {
    try {
        const mlCorrelationId = uuidV4();
        dispatch(createTaskSetState({ isMlTaskLoading: true, promptType: PROMPT_TYPE.APP, controller }));
        const response = await postAppCreationPromptApiService(params, { [PROMPT_HEADERS.CORRELATION_ID]: mlCorrelationId }, controller?.signal);
        const normalizedAppData = response;
        const developerAndAdminTeams = await dispatch(getAllTeamsAppDataThunk({
            team_code: [SYSTEM_TEAMS_CODE.DEVELOPER, SYSTEM_TEAMS_CODE.ADMIN],
            team_type: [TEAM_TYPES.SYSTEM],
            size: 5,
            page: 1,
        }));
        let allDeveloperTeam = {};
        let allAdminTeam = {};
        if (developerAndAdminTeams?.pagination_data?.length === 2) {
            [allDeveloperTeam = {}, allAdminTeam = {}] = developerAndAdminTeams.pagination_data;
            const { teamName: devTeamName } = allDeveloperTeam;
            const { teamName: adminTeamName } = allAdminTeam;

            allDeveloperTeam = {
                ...allDeveloperTeam,
                label: devTeamName,
                team_name: devTeamName,
                name: devTeamName,
                is_user: false,
            };

            allAdminTeam = {
                ...allAdminTeam,
                label: adminTeamName,
                team_name: adminTeamName,
                name: adminTeamName,
                is_user: false,
            };
            dispatch(applicationStateChange({ allDeveloperTeam, allAdminTeam }));
        }
        console.log(developerAndAdminTeams, 'allDeveloperTeam allDeveloperTeam allDeveloperTeam', allDeveloperTeam, allAdminTeam);
        dispatch(applicationStateChange({
            activeAppData: {
                name: normalizedAppData.app_name,
                url_path: getAppPageUrl(normalizedAppData?.app_name),
                description: normalizedAppData.app_description,
                admins: { users: [], teams: [allDeveloperTeam, allAdminTeam] },
                viewers: { users: [], teams: [allDeveloperTeam, allAdminTeam] },
                isCreateAppModalOpen: true,
                currentPageConfig: {
                    viewers: {
                        users: [],
                        teams: [],
                    },
                    url_path: '',
                    name: '',
                    inheritFromApp: true,
                    order: 1,
                    errorList: {},
                    page_id: '',
                    page_uuid: '',
                    isPageSettingsModelOpen: false,
                },
                promptPagesData: [
                    INITIAL_PAGE_FOR_TASKS,
                    ...normalizedAppData.prompts,
                ],
            },
            isFromAppCreationPrompt: true,
            mlCorrelationId,
        }));
        dispatch(createTaskSetState({ isMlTaskLoading: false, promptType: null }));
        routeNavigate(history, ROUTE_METHOD.PUSH, pathdata.pathname, pathdata?.search, {}, true);
        return true;
    } catch (err) {
        console.log(err, 'jkhjkhk');
        if (err.code === ERR_CANCELED) return null;
        dispatch(createTaskSetState({ isMlTaskLoading: false, promptType: null }));
        showToastPopover(
            t(APP_CREATION_NLP.FAILURE),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
        );
        return null;
    }
};

const getInitiateCoordinates = (type, index, y) => {
    const coordinates = AppBuilderElementDefaultDimensions(type, index);
    coordinates.y = y;
    coordinates.is_moved = coordinates.moved;
    coordinates.is_static = coordinates.static;
    delete coordinates.moved;
    delete coordinates.static;
    delete coordinates.type;
    delete coordinates.add;
    return coordinates;
};
const addDefaultTeams = (usersAndTeams, defaultTeams = []) => {
    const usersAndTeamsCopy = cloneDeep(usersAndTeams) || {};
    usersAndTeamsCopy.teams = [...(usersAndTeamsCopy?.teams || [])];
    if (defaultTeams.length > 0) {
        usersAndTeamsCopy.teams = [...usersAndTeamsCopy.teams, ...defaultTeams];
    }
    return usersAndTeamsCopy;
};

const createAndPublishDataList = (promptText, mlCorrelationId, defaultTeams = [], callback = () => {}) => async () => {
    try {
        const dataListPromptResponse = await postCreateDatalistFromPrompt({ prompt: promptText }, { [PROMPT_HEADERS.CORRELATION_ID]: mlCorrelationId });
        console.log(dataListPromptResponse, 'dataListPromptResponse dataListPromptResponse');
        const createDataListPostData = {
            data_list_name: dataListPromptResponse.data_list_name,
            data_list_short_code: getShortCode(dataListPromptResponse.data_list_name),
            add_form: true,
        };
        if (dataListPromptResponse.data_list_description) {
            createDataListPostData.data_list_description = dataListPromptResponse.data_list_description;
        }
        const createDataListResponse = await saveDataList(createDataListPostData);
        console.log(createDataListResponse, 'createDataListResponse createDataListResponse');
        if (dataListPromptResponse?.sections?.length > 0) {
            await saveFormWithField({
                data_list_id: createDataListResponse._id,
                sections: dataListPromptResponse.sections,
                form_uuid: createDataListResponse?.form_metadata?.form_uuid,
            });

            const technicalReferenceName = await generateEntityReferenceNameAPI({ [DATA_LIST_TECHNICAL_CONFIG_ID.ENTITY_UUID]: createDataListResponse.data_list_uuid, entity_name: createDataListResponse.data_list_name });

            await saveDataList({
                data_list_name: createDataListResponse.data_list_name,
                data_list_description: createDataListResponse.data_list_description,
                data_list_short_code: createDataListResponse.data_list_short_code,
                data_list_uuid: createDataListResponse.data_list_uuid,
                is_system_identifier: createDataListResponse.is_system_identifier,
                has_related_flows: createDataListResponse.has_related_flows || false,
                default_report_fields: null,
                is_participants_level_security: createDataListResponse.is_participants_level_security || false,
                is_row_security_policy: createDataListResponse.is_row_security_policy || false,
                admins: getUserAndTeamsId(createDataListResponse.admins),
                owners: getUserAndTeamsId(createDataListResponse.admins),
                entry_adders: getUserAndTeamsId(addDefaultTeams(createDataListResponse.admins, defaultTeams)),
                viewers: getUserAndTeamsId(addDefaultTeams(createDataListResponse.viewers, defaultTeams)),
                technical_reference_name: technicalReferenceName,
            });
            await publishDataList({ data_list_uuid: createDataListResponse.data_list_uuid });
            callback?.({ data_list_uuid: createDataListResponse.data_list_uuid });
            return createDataListResponse;
        }
        return null;
    } catch (error) {
        console.log(error, 'data list failed');
        return null;
    }
};

const createAndPublishFlow = (promptText, mlCorrelationId, defaultTeams = [], callBack = () => {}) => async () => {
    try {
        const flowPromptResponse = await postFlowCreationPrompt({ prompt: promptText }, { [PROMPT_HEADERS.CORRELATION_ID]: mlCorrelationId });
        console.log(flowPromptResponse, 'flowPromptResponse');
        const createFlowPostData = {
            has_auto_trigger: false,
            is_system_identifier: true,
            flow_short_code: getShortCode(flowPromptResponse.flow_name),
            flow_name: flowPromptResponse.flow_name,
        };
        if (flowPromptResponse.flow_description) {
            createFlowPostData.flow_description = flowPromptResponse.flow_description;
        }
        const createFlowResponse = await saveFlow(createFlowPostData);
        console.log(flowPromptResponse, createFlowResponse, 'createFlowResponse');

        const flowParams = {
            flow_id: createFlowResponse._id,
            flow_uuid: createFlowResponse.flow_uuid,
        };
        console.log(createFlowResponse, 'flow prompt in App');
        const createStepPromises = [];
        if (flowPromptResponse?.steps?.length > 0) {
            const promptStepsData = flowPromptResponse.steps;
            flowPromptResponse.steps.forEach((step) => {
                const data = {
                    step_name: step.step_name,
                    step_type: step.step_type || CREATE_STEP_INIT_DATA.step_type,
                    coordinate_info: step.coordinate_info || CREATE_STEP_INIT_DATA.coordinate_info,
                };
                createStepPromises.push(createStep({ ...flowParams, ...data }));
            });
            const createStepPromisesData = await Promise.allSettled(createStepPromises);
            const stepIdAndNameList = [];
            let stepStatuses = [];
            console.log(createStepPromisesData, 'createStepPromisesData createStepPromisesData');
            createStepPromisesData.forEach(({ status, value: response }, index) => {
                if (status === 'fulfilled') {
                    updateCreateStepResponse(promptStepsData, index, response, stepIdAndNameList, stepStatuses);
                }
            });
            stepStatuses = uniq(stepStatuses || []);
            if (stepStatuses.length > 0) {
                const postData = {
                    flow_id: flowParams.flow_id,
                    step_statuses: stepStatuses,
                };
                await saveFlowStepStatuses(postData);
            }
            const updateStepOrderPostData = {
                flow_id: flowParams.flow_id,
                steps: promptStepsData,
            };
            await updateStepOrder(getStepOrderData(updateStepOrderPostData));
            const saveStepPromises = [];
            promptStepsData?.forEach((promptStep) => {
                const saveStepPromiseData = getSaveStepPostData(promptStep, stepIdAndNameList);
                if (saveStepPromiseData) {
                    saveStepPromises.push(saveStep({
                        ...saveStepPromiseData,
                        flow_id: flowParams.flow_id,
                    }));
                }
            });
            const saveStepResponsesData = await Promise.allSettled(saveStepPromises);
            saveStepResponsesData.forEach(({ status }, index) => {
                if (status === 'fulfilled') {
                    set(promptStepsData, [index, 'creation_status'], FLOW_PROMPT_STEP_CREATION_STATUS.SAVE_STEP);
                }
            });
            console.log(saveStepResponsesData, 'saveStepResponses saveStepResponses');
            const coordinate_data = getStepCoordinates({ steps: promptStepsData });
            console.log('positioning steps', cloneDeep(promptStepsData), coordinate_data);
            coordinate_data.forEach((coordinateInfo) => {
                const stepIndex = promptStepsData.findIndex((stepData) => stepData._id === coordinateInfo.step_id);
                if (stepIndex > -1) {
                    set(promptStepsData, [stepIndex, 'coordinate_info'], coordinateInfo.coordinate_info);
                }
            });
            await saveStepCoordinates({ coordinate_data, ...flowParams });
            const initialStep = promptStepsData.find((stepData) => stepData.is_initiation);
            const formFieldsIdAndName = [];
            await saveFormAndHandleResponse({ stepData: initialStep, formFieldsIdAndName, flowParams, stepsListWithForm: promptStepsData });
            // eslint-disable-next-line no-restricted-syntax
            for (const element of promptStepsData) {
                const stepData = element;
                if (!stepData.is_initiation) {
                    // eslint-disable-next-line no-await-in-loop
                    await saveFormAndHandleResponse({ stepData, formFieldsIdAndName, flowParams, stepsListWithForm: promptStepsData });
                }
            }
            const technicalReferenceName = await generateEntityReferenceNameAPI({ [FLOW_TECHNICAL_CONFIG_ID.ENTITY_UUID]: createFlowResponse.flow_uuid, entity_name: createFlowResponse.flow_name });
            const saveFlowPostData = {
                flow_uuid: createFlowResponse.flow_uuid,
                flow_name: createFlowResponse.flow_name,
                flow_description: createFlowResponse.flow_description,
                has_auto_trigger: createFlowResponse.has_auto_trigger,
                is_system_identifier: createFlowResponse.is_system_identifier,
                has_related_flows: createFlowResponse.has_related_flows || false,
                default_report_fields: null,
                is_participants_level_security: createFlowResponse.is_participants_level_security || false,
                is_row_security_policy: createFlowResponse.is_row_security_policy || false,
                flow_short_code: createFlowResponse.flow_short_code,
                step_statuses: stepStatuses,
                admins: getUserAndTeamsId(createFlowResponse.admins),
                owners: getUserAndTeamsId(addDefaultTeams(createFlowResponse.admins, defaultTeams)),
                viewers: getUserAndTeamsId(addDefaultTeams(createFlowResponse.viewers, defaultTeams)),
                technical_reference_name: technicalReferenceName,
            };
            await saveFlow(saveFlowPostData);
            await publishFlow({ flow_uuid: createFlowResponse.flow_uuid }, PUBLISH_FLOW);
            callBack?.({ flow_uuid: createFlowResponse.flow_uuid });
            return createFlowResponse;
        }
        return null;
    } catch (error) {
        console.log(error, 'craeteAndPublishflow error');
        throw Error(error);
    }
};

export const savePagesList = (pagesData = [], updatePagesInAppState, t) => async (dispatch) => {
    const {
        activeAppData,
        mlCorrelationId,
        allDeveloperTeam,
        allAdminTeam,
    } = cloneDeep(store.getState().ApplicationReducer);
    setPointerEvent(true);
    updatePostLoader(true);
    const defaultTeams = [];
    if (!isEmpty(allDeveloperTeam)) {
        defaultTeams.push(allDeveloperTeam);
    }
    if (!isEmpty(allAdminTeam)) {
        defaultTeams.push(allAdminTeam);
    }
    console.log(activeAppData, 'activeAppData activeAppData activeAppData');
    const pagesList = [];
    const customizedPagesData = [];
    const createPagePromises = [];
    const promptPagesData = cloneDeep(pagesData);
    const appParamsData = {
        app_id: activeAppData.id,
        app_uuid: activeAppData.app_uuid,
    };
    promptPagesData.forEach((page, index) => {
        const params = {
            name: page.name,
            app_id: activeAppData.id,
            is_inherit_from_app: true,
            order: index + 1,
            url_path: getAppPageUrl(page.name, true),
        };
        createPagePromises.push(dispatch(savePagesThunk(params, index, index === 0, [], null, false, false, t, true)));
    });
    const resolveSavePagePromisesData = await Promise.allSettled(createPagePromises);
    resolveSavePagePromisesData.forEach(({ status, value: response }, index) => {
        if (status === 'fulfilled') {
            customizedPagesData.push({
                labelText: response.name,
                tabIndex: pagesList.length,
                Icon: TriangleDownIcon,
                isEditable: false,
                error: false,
                uuid: response.page_uuid,
                value: response._id,
            });
            pagesList.push({
                ...appParamsData,
                _id: response._id,
                is_inherit_from_app: response.is_inherit_from_app,
                name: response.name,
                order: response.order,
                page_uuid: response.page_uuid,
                url_path: response.url_path,
            });
            promptPagesData[index].page_id = response._id;
        }
    });
    updatePagesInAppState({ customizedPagesData, current_page_id: customizedPagesData?.[0]?.value }, pagesList);

    console.log(promptPagesData, 'promptPagesData');

    const createComponentPromises = [];
    promptPagesData.forEach(async (page) => {
        let componentsCount = 0;
        let componentY = 0;
        if (page?.page_id) {
            if (page?.text) {
                const coordination = getInitiateCoordinates(APP_CONFIGURATION_TYPE.TEXT_STYLE, componentsCount, componentY);
                const componentData = {
                    ...appParamsData,
                    page_id: page.page_id,
                    page_uuid: page.page_uuid,
                    type: APP_CONFIGURATION_TYPE.TEXT_STYLE,
                    alignment: 'left',
                    coordination: coordination,
                    label_position: 'adjacent',
                    component_info: {
                        formatter: page.text,
                    },
                    color: COLOR_CONSTANTS.WHITE,
                };
                componentsCount++;
                componentY += coordination.h;
                createComponentPromises.push(
                    dispatch(saveComponentApiThunk(componentData, t, false, null, true)),
                );
            }
            if (page?.task) {
                const coordination = getInitiateCoordinates(APP_CONFIGURATION_TYPE.TASK, componentsCount, componentY);
                const componentData = {
                    ...appParamsData,
                    page_id: page.page_id,
                    page_uuid: page.page_uuid,
                    type: APP_CONFIGURATION_TYPE.TASK,
                    alignment: 'left',
                    coordination: coordination,
                    label_position: 'adjacent',
                    component_info: {
                        type: 'open',
                        type_of_task: 'all',
                        select_columns: [
                            'task_name',
                            'created_by',
                            'assigned_on',
                            'due_date',
                        ],
                        assigned_to: 'assigned_to_me',
                    },
                    color: COLOR_CONSTANTS.WHITE,
                };
                componentsCount++;
                componentY += coordination.h;
                createComponentPromises.push(
                    dispatch(saveComponentApiThunk(componentData, t, false, null, true)),
                );
            }
            if (page?.type) {
                let componentInfo = {};
                const coordination = getInitiateCoordinates(APP_CONFIGURATION_TYPE.DASHBOARDS, componentsCount, componentY);
                if (page.type === PROMPT_TYPE.FLOW) {
                    if (page?.prompt) {
                        createComponentPromises.push(
                            dispatch(createAndPublishFlow(page?.prompt, mlCorrelationId, defaultTeams, async (publishFlowResponse) => {
                                console.log(publishFlowResponse, 'publishFlowResponse publishFlowResponse');
                                if (publishFlowResponse?.flow_uuid) {
                                    componentInfo = {
                                        type: APP_CONFIGURATION_DASHBOARD_TYPE.FLOW,
                                        source_uuid: publishFlowResponse.flow_uuid,
                                    };
                                    const componentData = {
                                        ...appParamsData,
                                        page_id: page.page_id,
                                        page_uuid: page.page_uuid,
                                        type: APP_CONFIGURATION_TYPE.DASHBOARDS,
                                        alignment: 'left',
                                        coordination: coordination,
                                        label_position: 'adjacent',
                                        component_info: componentInfo,
                                        color: COLOR_CONSTANTS.WHITE,
                                    };
                                    componentsCount++;
                                    await dispatch(saveComponentApiThunk(componentData, t, false, null, true));
                                }
                            })),
                        );
                    }
                } else if (page.type === PROMPT_TYPE.DATA_LIST) {
                    createComponentPromises.push(
                        dispatch(createAndPublishDataList(page?.prompt, mlCorrelationId, defaultTeams, async (publishDataListResponse) => {
                            console.log(publishDataListResponse, 'publishDataListResponse publishDataListResponse');
                            if (publishDataListResponse?.data_list_uuid) {
                                componentInfo = {
                                    type: APP_CONFIGURATION_DASHBOARD_TYPE.DATA_LIST,
                                    source_uuid: publishDataListResponse.data_list_uuid,
                                };
                                const componentData = {
                                    ...appParamsData,
                                    page_id: page.page_id,
                                    page_uuid: page.page_uuid,
                                    type: APP_CONFIGURATION_TYPE.DASHBOARDS,
                                    alignment: 'left',
                                    coordination: coordination,
                                    label_position: 'adjacent',
                                    component_info: componentInfo,
                                    color: COLOR_CONSTANTS.WHITE,
                                };
                                componentsCount++;
                                await dispatch(saveComponentApiThunk(componentData, t, false, null, true));
                            }
                        })),
                    );
                }
            }
        }
    });
    const resolveSaveComponentPromisesData = await Promise.allSettled(createComponentPromises);
    console.log(resolveSaveComponentPromisesData, 'resolveSaveComponentPromisesData resolveSaveComponentPromisesData');
    await dispatch(applicationStateChange({ isFromAppCreationPrompt: false, mlCorrelationId: null }));
    setPointerEvent(false);
    updatePostLoader(false);
};
