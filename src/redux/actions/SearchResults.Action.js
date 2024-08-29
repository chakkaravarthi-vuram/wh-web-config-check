import { SEARCH_CONSTANTS } from 'utils/Constants';
import axios from 'axios';
import { getGlobalSearchApi } from 'axios/apiService/search.apiService';
import { store } from 'Store';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { SEARCH_RESULT } from './ActionConstants';
import jsUtils from '../../utils/jsUtility';
import { TEAM_TYPES_PARAMS } from '../../utils/Constants';

export const SearchTextChange = (text) => {
    return {
        type: SEARCH_RESULT.SEARCH_TEXT,
        payload: text,
    };
};

export const taskSearchApiStarted = () => {
    return {
        type: SEARCH_RESULT.SEARCH_TASK_SUCCESS,
    };
};
export const taskSearchApiFailure = (error) => {
    return {
        type: SEARCH_RESULT.SEARCH_TASK_FAILURE,
        payload: error,
    };
};

export const getAllSearchDataAction = (value) => {
    return {
        type: SEARCH_RESULT.SEARCH_GLOBAL_DATA,
        payload: value,
    };
};
const formatTaskDetails = ({ pagination_data, pagination_details }, taskResults, size, page) => {
    const remainingTasksCount = pagination_details[0].total_count - size;
    const taskList = pagination_data.map((task) => {
        const { translation_data } = task;
        const pref_locale = localStorage.getItem('application_language');
        return {
            id: task._id,
            uuid: task.task_log_id,
            name: translation_data?.[pref_locale]?.task_name || task.task_name,
        };
    });
    taskResults.count = pagination_details[0].total_count;
    taskResults.isLoading = false;
    taskResults.showMore = remainingTasksCount > 0;
    taskResults.list = (jsUtils.isEmpty(taskResults.list) || (page === 1)) ? taskList : [...taskResults.list, ...taskList];
    return taskResults;
};
const formatFlowDetails = ({ pagination_data, pagination_details }, flowResults, size, page) => {
    const remainingFlowCount = pagination_details[0].total_count - size;

    const flowList = pagination_data.map((flow) => {
        const { translation_data } = flow;
        const pref_locale = localStorage.getItem('application_language');

        return {
            id: flow._id,
            uuid: flow.flow_uuid,
            name: translation_data?.[pref_locale]?.flow_name || flow.flow_name,
            code: flow.flow_short_code,
            color: flow.flow_color,
        };
    });
    flowResults.count = pagination_details[0].total_count;
    flowResults.isLoading = false;
    flowResults.showMore = remainingFlowCount > 0;
    flowResults.list = (jsUtils.isEmpty(flowResults.list) || (page === 1)) ? flowList : [...flowResults.list, ...flowList];
    return flowResults;
};
const formatDatalistDetails = ({ pagination_data, pagination_details }, datalistResults, size, page) => {
    const remainingDatalistCount = pagination_details[0].total_count - size;
    const datalistList = pagination_data.map((datalist) => {
        return {
            id: datalist._id,
            uuid: datalist.data_list_uuid,
            name: datalist.data_list_name,
            code: datalist.data_list_short_code,
            color: datalist.data_list_color,
        };
    });
    datalistResults.count = pagination_details[0].total_count;
    datalistResults.isLoading = false;
    datalistResults.showMore = remainingDatalistCount > 0;
    datalistResults.list = (jsUtils.isEmpty(datalistResults.list) || (page === 1)) ? datalistList : [...datalistResults.list, ...datalistList];
    return datalistResults;
};
const formatUserDetails = ({ pagination_data, pagination_details }, userResults, size, page) => {
    const remainingUsersCount = pagination_details[0].total_count - size;
    const userList = pagination_data.map((user) => {
        return {
            id: user._id,
            // uuid: user,
            name: user.full_name ? user.full_name : user.email,
            firstName: user.first_name ? user.first_name : user.email,
            lastName: user.last_name,
            // color: user.data_list_color,
        };
    });
    userResults.count = pagination_details[0].total_count;
    userResults.isLoading = false;
    userResults.showMore = remainingUsersCount > 0;
    userResults.list = (jsUtils.isEmpty(userResults.list) || (page === 1)) ? userList : [...userResults.list, ...userList];
    return userResults;
};
const formatTeamDetails = ({ pagination_data, pagination_details }, teamResults, size, page) => {
    const remainingTeamsCount = pagination_details[0].total_count - size;
    const teamList = pagination_data.map((team) => {
        return {
            id: team._id,
            name: team.team_name,
            isPrivateTeam: team.team_type === 3,
        };
    });
    teamResults.count = pagination_details[0].total_count;
    teamResults.isLoading = false;
    teamResults.showMore = remainingTeamsCount > 0;
    teamResults.list = (jsUtils.isEmpty(teamResults.list) || (page === 1)) ? teamList : [...teamResults.list, ...teamList];
    return teamResults;
};
const getLoaderStatus = ({ taskResults, flowResults, datalistResults, userResults, teamResults }, type, isLoading) => {
    switch (type) {
        case SEARCH_CONSTANTS.ALLOW_TASK_ONLY:
            return ({ taskResults: { ...taskResults, isLoading } });
        case SEARCH_CONSTANTS.ALLOW_FLOW_ONLY:
            return ({ flowResults: { ...flowResults, isLoading } });
        case SEARCH_CONSTANTS.ALLOW_DATALIST_ONLY:
            return ({ datalistResults: { ...datalistResults, isLoading } });
        case SEARCH_CONSTANTS.ALLOW_USER_ONLY:
            return ({ userResults: { ...userResults, isLoading } });
        case SEARCH_CONSTANTS.ALLOW_TEAM_ONLY:
            return ({ teamResults: { ...teamResults, isLoading } });
        default:
            return {};
    }
};
export const getAllSearchApiThunk =
    (params, type, isNormalMode) =>
        (dispatch) => {
            const taskResults = jsUtils.cloneDeep(store.getState().SearchResultsReducer.taskResults);
            const flowResults = jsUtils.cloneDeep(store.getState().SearchResultsReducer.flowResults);
            const datalistResults = jsUtils.cloneDeep(store.getState().SearchResultsReducer.datalistResults);
            const teamResults = jsUtils.cloneDeep(store.getState().SearchResultsReducer.teamResults);
            const userResults = jsUtils.cloneDeep(store.getState().SearchResultsReducer.userResults);
            if (isNormalMode) {
                params.team_type = TEAM_TYPES_PARAMS.PRIVATE;
            } else params.team_type = TEAM_TYPES_PARAMS.SYSTEM_ORGANISATION_TEAMS;
            if (type === SEARCH_CONSTANTS.ALLOW_ALL) {
                dispatch(getAllSearchDataAction({ isSearchDataLoading: true }));
            } else {
                dispatch(getAllSearchDataAction(getLoaderStatus({ taskResults, flowResults, datalistResults, userResults, teamResults }, type, true)));
            }
            getGlobalSearchApi(params, isNormalMode)
                .then((response) => {
                    if (!jsUtils.isEmpty(response)) {
                        switch (type) {
                            case SEARCH_CONSTANTS.ALLOW_TASK_ONLY:
                                dispatch(getAllSearchDataAction({
                                    isSearchDataLoading: false,
                                    taskResults: formatTaskDetails(response.task_details, taskResults, params.size, params.page),
                                }));
                                break;
                            case SEARCH_CONSTANTS.ALLOW_FLOW_ONLY:
                                dispatch(getAllSearchDataAction({
                                    isSearchDataLoading: false,
                                    flowResults: formatFlowDetails(response.flow_details, flowResults, params.size, params.page),
                                }));
                                break;
                            case SEARCH_CONSTANTS.ALLOW_DATALIST_ONLY:
                                dispatch(getAllSearchDataAction({
                                    isSearchDataLoading: false,
                                    datalistResults: formatDatalistDetails(response.data_list_details, datalistResults, params.size, params.page),
                                }));
                                break;
                            case SEARCH_CONSTANTS.ALLOW_USER_ONLY:
                                dispatch(getAllSearchDataAction({
                                    isSearchDataLoading: false,
                                    userResults: formatUserDetails(response.user_details, userResults, params.size, params.page),
                                }));
                                break;
                            case SEARCH_CONSTANTS.ALLOW_TEAM_ONLY:
                                dispatch(getAllSearchDataAction({
                                    isSearchDataLoading: false,
                                    teamResults: formatTeamDetails(response.team_details, teamResults, params.size, params.page),
                                }));
                                break;
                            default:
                                dispatch(getAllSearchDataAction({
                                    isSearchDataLoading: false,
                                    taskResults: formatTaskDetails(response.task_details, taskResults, params.size, params.page),
                                    flowResults: formatFlowDetails(response.flow_details, flowResults, params.size, params.page),
                                    datalistResults: formatDatalistDetails(response.data_list_details, datalistResults, params.size, params.page),
                                    userResults: formatUserDetails(response.user_details, userResults, params.size, params.page),
                                    teamResults: formatTeamDetails(response.team_details, teamResults, params.size, params.page),
                                }));
                                break;
                        }
                    } else {
                        const err = {
                            response: {
                                status: 500,
                            },
                        };
                        const errors = generateGetServerErrorMessage(err);
                        dispatch(taskSearchApiFailure(errors));
                        dispatch(getAllSearchDataAction(getLoaderStatus({ taskResults, flowResults, datalistResults, userResults, teamResults }, type, false)));
                    }
                })
                .catch((error) => {
                    console.log('ERRRRR', error);
                    if (axios.isCancel(error)) {
                        console.log('cancelled api error');
                    } else {
                        const errors = generateGetServerErrorMessage(error);
                        dispatch(taskSearchApiFailure(errors));
                        dispatch(getAllSearchDataAction(getLoaderStatus({ taskResults, flowResults, datalistResults, userResults, teamResults }, type, false)));
                    }
                });
        };

export const getSearchInitialState = () => {
    return {
        type: SEARCH_RESULT.SEARCH_CLEAR,
    };
};
