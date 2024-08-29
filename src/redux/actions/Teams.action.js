import { store } from 'Store';
import { TEAMS_STRINGS, TEAM_MEMBER_PATH } from '../../containers/team/teams.strings';
import { checkTeamNameApi, getAllTeamApiService, getSeparateUsersOrTeamsApi, getTeamMembersListApiService, getTeamDetailsApiService, createTeamApi, updateTeamMemberApi, getTeamsAndUsers, getTeamDependencyDetailsApi, deactivateTeamApi } from '../../axios/apiService/teams.apiService';
import { getUserPickerOptionList } from '../../components/user_picker/UserPicker.utils';
import { getCurrentTeamLabel, setEditTeamData } from '../../containers/team/teams.utils';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { ADD_TEAM_MEMBER, GET_ALL_USERS, GET_ALL_USERS_OR_TEAMS, REMOVE_TEAM_MEMBER } from '../../urls/ApiUrls';
import { DEFAULT_APP_ROUTE, PUBLIC_TEAMS } from '../../urls/RouteConstants';
import jsUtility, { isEmpty } from '../../utils/jsUtility';
import { EMPTY_STRING, VALIDATION_ERROR_TYPES } from '../../utils/strings/CommonStrings';
import { isBasicUserMode, routeNavigate, setPointerEvent, showToastPopover, updatePostLoader } from '../../utils/UtilityFunctions';
import { teamListingDataChange, teamDetailsDataChange, clearCreateEditDetails, createEditDataChange } from '../reducer/TeamsReducer';
import { FORM_POPOVER_STATUS, MEMBER_TYPE, ROUTE_METHOD } from '../../utils/Constants';
import { DEPENDENCY_ERRORS } from '../../components/dependency_handler/DependencyHandler.constants';

export const getAllTeamsDataThunk = (params, isLoadMore) => (dispatch) =>
  new Promise((resolve, reject) => {
    getAllTeamApiService(params)
      .then((response) => {
        if (!jsUtility.isEmpty(response)) {
          const { teamsListData } = jsUtility.cloneDeep(store.getState().TeamsReducer.teamListing);
          let updatedTeamsList = response?.pagination_data
          ? response?.pagination_data
          : [];
          if (isLoadMore && response?.pagination_details?.[0]?.page > 1) {
            updatedTeamsList = [...teamsListData, ...updatedTeamsList];
          }
          const teamsData = {
            teamsCount: response.pagination_details[0].totalCount,
            isTeamListLoading: false,
            teamsListData: updatedTeamsList,
            isInitialLoading: false,
            hasMore: updatedTeamsList?.length < response.pagination_details[0].totalCount,
          };
          if (isEmpty(params?.search)) teamsData.totalTeams = response.pagination_details[0].totalCount;
          dispatch(
            teamListingDataChange(teamsData),
          );
          resolve(true);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          reject(errors);
        }
      })
      .catch((error) => {
        if (error && error.code === 'ERR_CANCELED') return;
        const errors = generateGetServerErrorMessage(error);
        reject(errors);
      });
  });

export const getTeamDetailsThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(
      teamDetailsDataChange({
        isTeamMembersListLoading: true,
      }),
    );
    getTeamDetailsApiService(params)
      .then((response) => {
        if (!jsUtility.isEmpty(response)) {
          const { ownerData, visibilityData, common } = setEditTeamData(response);
          dispatch(
            teamDetailsDataChange({
              id: response?._id,
              isTeamMembersListLoading: false,
              teamName: response?.teamName,
              teamDesc: response?.description,
              createdOn: response?.createdOn,
              documentUrlDetails: response?.document_url_details,
              createdBy: common?.createdBy,
              isEditTeam: response?.isEditTeam,
              teamDetails: response,
              isTeamDetailsLoading: false,
              security: { owner: ownerData, visibility: visibilityData },
            }),
          );
          resolve(response);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(
            teamDetailsDataChange({
              isTeamDetailsLoading: false,
            }),
          );
          reject(errors);
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(
          teamDetailsDataChange({
            isTeamDetailsLoading: false,
          }),
        );
        reject(errors);
      });
  });

export const getTeamMembersListThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    getTeamMembersListApiService(params)
      .then((response) => {
        if (!jsUtility.isEmpty(response)) {
          dispatch(
            teamDetailsDataChange({
              membersList: response.pagination_data,
              membersTotalItemsCount: response.pagination_details[0].totalCount,
              isTeamMembersListLoading: false,
            }),
          );
          resolve(true);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          reject(errors);
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        reject(errors);
      });
  });

export const teamNameExistCheckAction = (teamName, callback, t) => (dispatch) =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    checkTeamNameApi(teamName)
      .then((res) => {
        setPointerEvent(false);
        updatePostLoader(false);
        if (res?.exist) {
          const errorData = `${TEAMS_STRINGS(t).ACTION_STRINGS.TEAM_NAME_EXIST_IN} ${getCurrentTeamLabel(res?.team_type, t)} ${t(TEAM_MEMBER_PATH.TEAMS)}`;
          dispatch(createEditDataChange({ errorMessage: { teamName: errorData } }));
          resolve(true);
        } else {
          callback?.();
          resolve(false);
        }
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        reject(error);
      });
  });

export const getSeparateAllUserOrTeamsDataThunk = (params, url, isUser, actionUpdate, prevData, isCurrentMember, initialTeamsCall) => () =>
  new Promise(() => {
    const memberLoadingData = {
      memberLoading: true,
    };
    if (isCurrentMember) {
      memberLoadingData.manageMemberLoading = true;
    }
    actionUpdate(memberLoadingData);
    setPointerEvent(true);
    getSeparateUsersOrTeamsApi(params, url)
    .then((res) => {
      setPointerEvent(false);
      if (!jsUtility.isEmpty(res)) {
        const updateData = { memberLoading: false };
        updateData.memberPaginationDetails = res?.pagination_details?.[0];
        updateData.memberDocumentDetails = res?.document_url_details || [];
        if (isUser) updateData.userArray = res?.pagination_data;
        else updateData.teamsArray = res?.pagination_data;
        if (isCurrentMember) {
          if (isUser) {
            updateData.memberUserPaginationDetails = res?.pagination_details?.[0];
            updateData.memberUserDocumentDetails = res?.document_url_details || [];
          } else {
            updateData.memberTeamPaginationDetails = res?.pagination_details?.[0];
            updateData.memberTeamDocumentDetails = res?.document_url_details || [];
          }
          actionUpdate({ currentMembersData: { ...prevData, ...updateData }, memberLoading: false, manageMemberLoading: false });
          if (isUser && isEmpty(updateData?.userArray) && initialTeamsCall) initialTeamsCall?.({ ...updateData });
        } else actionUpdate({ manageMembersData: { ...prevData, ...updateData }, memberLoading: false, manageMemberLoading: false });
      }
    })
    .catch((error) => {
      setPointerEvent(false);
      actionUpdate({ memberLoading: false, manageMemberLoading: false });
      console.error(error);
    });
  });

// Common function for User Picker Component - don't change
export const getUsersPickerDataApiThunk = (url = GET_ALL_USERS_OR_TEAMS, params, setCancelToken = () => {}) => new Promise((resolve) => {
  getTeamsAndUsers(url, params, setCancelToken)
    .then((response) => {
      const optionList = getUserPickerOptionList(response?.pagination_data, response?.document_url_details, url === GET_ALL_USERS);
      resolve(optionList);
    })
    .catch((err) => {
      console.error(err);
    });
});

export const createTeamApiThunk = (postData, history, isEdit, t) => (dispatch) => {
    dispatch(createEditDataChange({ blockRoute: true }));
    setPointerEvent(true);
    updatePostLoader(true);
    createTeamApi(postData, isEdit)
      .then((res) => {
        setPointerEvent(false);
        updatePostLoader(false);
        if (res._id) {
          showToastPopover(TEAMS_STRINGS(t).ACTION_STRINGS.TOAST_SUCCESS, isEdit ? TEAMS_STRINGS(t).ACTION_STRINGS.TEAM_UPDATED : TEAMS_STRINGS(t).ACTION_STRINGS.TEAM_CREATED, FORM_POPOVER_STATUS.SUCCESS, true);
          routeNavigate(history, ROUTE_METHOD.PUSH, isBasicUserMode(history) ? DEFAULT_APP_ROUTE : PUBLIC_TEAMS);
          dispatch(clearCreateEditDetails());
        }
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        dispatch(createEditDataChange({ blockRoute: false }));
        const isOwners = error?.response?.data?.errors[0]?.field?.includes(MEMBER_TYPE.OWNERS);
         if (error?.response?.data?.errors[0]?.type === VALIDATION_ERROR_TYPES.LIMIT) {
          showToastPopover(TEAMS_STRINGS(t).ACTION_STRINGS.LIMIT_EXCEEDED, EMPTY_STRING, FORM_POPOVER_STATUS.SERVER_ERROR, true);
        } else if (error?.response?.data?.errors[0]?.type === VALIDATION_ERROR_TYPES.EXIST) {
          const errorData = TEAMS_STRINGS(t).ACTION_STRINGS.TEAM_NAME_EXIST;
          dispatch(createEditDataChange({ errorMessage: { teamName: errorData } }));
          showToastPopover(errorData, EMPTY_STRING, FORM_POPOVER_STATUS.SERVER_ERROR, true);
       } else if (error?.response?.data?.errors[0]?.type === VALIDATION_ERROR_TYPES.NOT_EXIST) {
        if (isOwners) {
          const errorData = TEAMS_STRINGS(t).ACTION_STRINGS.DEVELOPER_NOT_EXIST;
          dispatch(createEditDataChange({ errorMessage: { teamName: errorData } }));
          showToastPopover(errorData, EMPTY_STRING, FORM_POPOVER_STATUS.SERVER_ERROR, true);
        } else {
          const isUser = error?.response?.data?.errors[0]?.field?.includes(MEMBER_TYPE.USERS);
          const errorData = isUser ? TEAMS_STRINGS(t).ACTION_STRINGS.USER_NOT_EXIST : TEAMS_STRINGS(t).ACTION_STRINGS.TEAM_NOT_EXIST;
          dispatch(createEditDataChange({ errorMessage: { teamName: errorData } }));
          showToastPopover(errorData, EMPTY_STRING, FORM_POPOVER_STATUS.SERVER_ERROR, true);
        }
     }
      });
  };

  export const addOrRemoveTeamMemberApiThunk = (postData, callbackData, url, t) => (dispatch) => {
    setPointerEvent(false);
    updatePostLoader(true);
    updateTeamMemberApi(postData, url)
      .then(async (res) => {
        setPointerEvent(false);
        updatePostLoader(false);
        if (res._id) {
          await dispatch(getTeamDetailsThunk({ _id: res._id }));
          showToastPopover((url === ADD_TEAM_MEMBER) ? TEAMS_STRINGS(t).ACTION_STRINGS.TEAM_UPDATED : TEAMS_STRINGS(t).ACTION_STRINGS.TEAM_MEMBER_DELETED, EMPTY_STRING, FORM_POPOVER_STATUS.SUCCESS, true);
          callbackData?.();
        }
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        if (url === REMOVE_TEAM_MEMBER) {
          showToastPopover((url === ADD_TEAM_MEMBER) ? TEAMS_STRINGS(t).ACTION_STRINGS.UPDATE_MEMBER_FAILED : TEAMS_STRINGS(t).ACTION_STRINGS.DELETE_MEMBER_FAILED, (url === ADD_TEAM_MEMBER) ? EMPTY_STRING : TEAMS_STRINGS(t).ACTION_STRINGS.DELETE_MEMBER_FAILED_SUBTITLE, FORM_POPOVER_STATUS.SERVER_ERROR, true);
        } else if (error?.response?.data?.errors?.[0]?.validation_message === 'cyclicDependency') {
          showToastPopover(TEAMS_STRINGS(t).ACTION_STRINGS.UPDATE_MEMBER_FAILED, TEAMS_STRINGS(t).ACTION_STRINGS.CYCLIC_DEPENDENCY_DETECTED, FORM_POPOVER_STATUS.SERVER_ERROR, true);
        }
      });
  };

  export const getDependencyListThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    getTeamDependencyDetailsApi(params)
      .then((response) => {
        if (!isEmpty(response)) {
            const updatedResponse = {
              is_blocker: false,
            };
            const dependency_list = [];
            if (response?.dependency_list) {
              (response.dependency_list).forEach((dep) => {
                if (dep?.type === DEPENDENCY_ERRORS.CONNECTOR) {
                  dependency_list.push({
                    type: DEPENDENCY_ERRORS.CONNECTOR,
                    name: dep?.name,
                    dependencies: dep?.dependencies || [],
                  });
                }
                if (dep?.type === DEPENDENCY_ERRORS.API_CONFIGURATION) {
                  dependency_list.push({
                    type: DEPENDENCY_ERRORS.API_CONFIGURATION,
                    name: dep?.name,
                    dependencies: dep?.dependencies || [],
                  });
                }
                if (dep?.type === DEPENDENCY_ERRORS.FLOW) {
                  const dependencies = [];
                  (dep?.dependencies || []).forEach((childDep) => {
                    if (childDep.type === DEPENDENCY_ERRORS.STEP_ASSIGNEE) {
                      dependencies.push({
                        type: DEPENDENCY_ERRORS.FLOW_TYPE.STEP_DEPENDENCY,
                        name: childDep?.step_name,
                      });
                    } else {
                      dependencies.push(childDep);
                    }
                  });
                  dependency_list.push({
                    type: DEPENDENCY_ERRORS.FLOW,
                    name: dep?.name,
                    dependencies: dependencies,
                  });
                }
                if (dep?.type === DEPENDENCY_ERRORS.DATALIST) {
                  dependency_list.push({
                    type: DEPENDENCY_ERRORS.DATALIST,
                    name: dep?.name,
                    dependencies: dep?.dependencies || [],
                  });
                }
              });
            }
            updatedResponse.dependency_list = dependency_list;
            dispatch(
              teamDetailsDataChange({
                dependencyData: updatedResponse,
                isDependencyListLoading: false,
              }),
            );
            resolve(true);
          } else {
            dispatch(
              teamDetailsDataChange({
                dependencyData: {},
                isDependencyListLoading: false,
              }),
            );
            resolve(true);
          }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        reject(errors);
      });
  });

  export const deactivateTeamApiThunk = (teamId, t) => (dispatch) =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    deactivateTeamApi(teamId)
      .then((response) => {
        setPointerEvent(false);
        updatePostLoader(false);
        if (response) {
          dispatch(
            teamDetailsDataChange({
              isDependencyListLoading: false,
              deactivateTeamModalVisibility: false,
            }),
          );
          showToastPopover(TEAMS_STRINGS(t).ACTION_STRINGS.DELETE, TEAMS_STRINGS(t).ACTION_STRINGS.DELETE_TEAM_SUCCESS, FORM_POPOVER_STATUS.DELETE, true);
          resolve(true);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          reject(errors);
        }
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        const errors = generateGetServerErrorMessage(error);
        console.error(errors);
        reject(errors);
      });
  });
