import {
  getAllApps,
  getAppData,
} from 'axios/apiService/application.apiService';
import {
  appListDataChange,
  applicationDataChange,
} from 'redux/reducer/ApplicationReducer';
import { store } from 'Store';
import { ERR_CANCELED } from 'utils/ServerConstants';
import {
  setPointerEvent,
  updateEditConfirmPopOverStatus,
} from 'utils/UtilityFunctions';
import { updatePostLoader } from 'utils/loaderUtils';
import { getFormattedDateFromUTC } from 'utils/dateUtils';
import {
  EMPTY_STRING,
  SOMEONE_IS_EDITING,
  SOMEONE_IS_EDITING_ERROR,
} from 'utils/strings/CommonStrings';
import { getCurrentUserId } from 'utils/userUtils';
import { FORM_POPOVER_STATUS } from 'utils/Constants';
import { getAllFlows } from 'axios/apiService/flowList.apiService';
import jsUtility, { cloneDeep, get, isEmpty, union, has, isArray, translateFunction } from '../../utils/jsUtility';
import { publishApp, deletePage, geComponentsApi, getComponentById, getAppPagesApi, getTeamsAndUsers, saveApp, saveComponent, saveCoordinateAPI, savePage, updateAppSecurity, deleteApp, deleteComponentApi, validateAppApi, discardApp, getSortedViewFlowApi, udpateOrderApi, getAppCurrentVersion, postVerifyWebpageEmbedUrlApi, updateAppHeaderApi, updateAppOrderApi } from '../../axios/apiService/application.apiService';
import { getFullName } from '../../utils/generatorUtils';
import {
  applicationClear,
  applicationPageConfigChange,
  applicationStateChange,
  setApplicationActiveComponentDataChange,
  systemDirectoryDataChange,
} from '../reducer/ApplicationReducer';
import { clearDashboard, setDashboardConfigDataChange } from '../reducer/ApplicationDashboardReportReducer';
import { ERROR_LABEL, FORM_POPOVER_STRINGS, PUBLISHED_LABEL, VALIDATION_ERROR_TYPES } from '../../utils/strings/CommonStrings';
import { CREATE_APP_STRINGS } from '../../containers/application/create_app/CreateApp.strings';
import { CancelToken, getFileNameFromServer, routeNavigate, showToastPopover } from '../../utils/UtilityFunctions';
import { getComponentsStructure, getPageOptions } from '../../containers/application/app_builder/AppBuilder.utils';
import { getAllViewDataList } from '../../axios/apiService/dataList.apiService';
import { APPLICATION_SCREENS, CREATE_APP, HOME } from '../../urls/RouteConstants';
import { getAllFlowCategoryApiService } from '../../axios/apiService/listFlow.apiService';
import { getAllDataListCategoryApiService } from '../../axios/apiService/listDataList.apiService';
import FaqStackIcon from '../../assets/icons/app_builder_icons/FaqStackIcon';
import { APP_MODE, FILE_UPLOAD_STATUS, ROUTE_METHOD } from '../../utils/Constants';
import { APP_COMPONENT_TYPE } from '../../containers/application/app_components/AppComponent.constants';
import { TASK_COMPONENT_CONFIG_KEYS } from '../../containers/application/app_configuration/task_configuration/TaskConfiguration.constants';
import { LINK_CONFIGURATION_STRINGS } from '../../containers/application/app_configuration/link/page_configuration/LinkPageConfiguration.strings';
import { getAllTeamApiService } from '../../axios/apiService/teams.apiService';
import { FLOW_STATUS } from '../../containers/edit_flow/EditFlow.utils';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { APPLICATION_STRINGS, APP_VALIDATION } from '../../containers/application/application.strings';
import { ERROR_TYPE_PATTERN_BASE_ERROR } from '../../utils/ServerValidationUtils';

let cancelForAllTeams;
export const getCancelTokenForAllTeams = (cancelToken) => {
  cancelForAllTeams = cancelToken;
};

const updateSomeoneIsEditingPopover = (errorMessage, dispatch) => {
  const { activeAppData } = store.getState().ApplicationReducer;
  const { time, isMoreThanHoursLimit } = getFormattedDateFromUTC(
    errorMessage.edited_on,
    SOMEONE_IS_EDITING,
  );
  const isCurrentUser = getCurrentUserId() === errorMessage.user_id;
  let editSubtitle = null;
  if (isCurrentUser) {
    editSubtitle = SOMEONE_IS_EDITING_ERROR.SAME_USER;
  } else {
    editSubtitle = `${errorMessage.full_name} (${errorMessage.email}) ${SOMEONE_IS_EDITING_ERROR.DIFFERENT_USER}`;
  }
  dispatch(applicationStateChange({ hideClosePopper: true }));
  updateEditConfirmPopOverStatus({
    title: SOMEONE_IS_EDITING_ERROR.APPLICATION.TITLE,
    subTitle: editSubtitle,
    secondSubTitle: isCurrentUser
      ? EMPTY_STRING
      : `${SOMEONE_IS_EDITING_ERROR.DESCRIPTION_LABEL} ${time}`,
    status: FORM_POPOVER_STATUS.SERVER_ERROR,
    isVisible: false,
    isEditConfirmVisible: true,
    type: SOMEONE_IS_EDITING_ERROR.APPLICATION.TYPE,
    enableDirectEditing: isCurrentUser && isMoreThanHoursLimit,
    params: {
      _id: activeAppData._id,
      app_uuid: activeAppData.app_uuid,
    },
    notShowClose: true,
  });
};
const appListCancelToken = new CancelToken();

export const setAppViewersAndTeams = (res) => {
  const appAdmins = { users: [], teams: [] };
  const appViewers = { users: [], teams: [] };
  if (res?.admins) {
    res?.admins?.users?.forEach((eachUser) => {
      const userData = cloneDeep(eachUser);
      userData.label = getFullName(userData.first_name, userData.last_name);
      userData.name = cloneDeep(userData.label);
      userData.id = cloneDeep(userData._id);
      userData.is_user = true;
      const userOrTeamPic = res?.document_url_details?.find(
        (eachDocument) =>
          eachDocument.document_id === userData.profile_pic ||
          eachDocument.document_id === userData.team_pic,
      );
      if (get(userOrTeamPic, ['signedurl'])) { userData.avatar = userOrTeamPic.signedurl; }
      appAdmins?.users?.push(userData);
    });
    res?.admins?.teams?.forEach((eachTeam) => {
      const teamData = cloneDeep(eachTeam);
      teamData.label = teamData?.team_name;
      teamData.name = cloneDeep(teamData?.label);
      teamData.id = cloneDeep(teamData._id);
      teamData.is_user = false;
      const userOrTeamPic = res?.document_url_details?.find(
        (eachDocument) =>
          eachDocument.document_id === teamData.profile_pic ||
          eachDocument.document_id === teamData.team_pic,
      );
      if (get(userOrTeamPic, ['signedurl'])) { teamData.avatar = userOrTeamPic.signedurl; }
      appAdmins?.teams?.push(teamData);
    });
  }
  if (res?.viewers) {
    res?.viewers?.users?.forEach((eachUser) => {
      const userData = cloneDeep(eachUser);
      userData.label = getFullName(userData.first_name, userData.last_name);
      userData.name = cloneDeep(userData.label);
      userData.id = cloneDeep(userData._id);
      const userOrTeamPic = res?.document_url_details?.find(
        (eachDocument) =>
          eachDocument.document_id === userData.profile_pic ||
          eachDocument.document_id === userData.team_pic,
      );
      if (get(userOrTeamPic, ['signedurl'])) { userData.avatar = userOrTeamPic.signedurl; }
      appViewers?.users?.push(userData);
    });
    res?.viewers?.teams?.forEach((eachTeam) => {
      const teamData = cloneDeep(eachTeam);
      teamData.label = teamData?.team_name;
      teamData.name = cloneDeep(teamData?.label);
      teamData.id = cloneDeep(teamData._id);
      const userOrTeamPic = res?.document_url_details?.find(
        (eachDocument) =>
          eachDocument.document_id === teamData.profile_pic ||
          eachDocument.document_id === teamData.team_pic,
      );
      if (get(userOrTeamPic, ['signedurl'])) { teamData.avatar = userOrTeamPic.signedurl; }
      appViewers?.teams?.push(teamData);
    });
  }
  return {
    appAdmins,
    appViewers,
  };
};

export const getAppsListApiThunk = (params) => (dispatch) => {
    dispatch(
      appListDataChange({
        isLoading: true,
      }),
    );
  getAllApps(params, appListCancelToken)
    .then((response) => {
      const { appListParams } = cloneDeep(store.getState().ApplicationReducer);
      const { appList = [] } = appListParams;
      const newAppsList = response?.pagination_data
        ? response?.pagination_data
        : [];
      if (response?.pagination_data) {
        let updatedAppsList = newAppsList;
        if (get(response, ['pagination_details', 0, 'page'], 0) > 1) {
          updatedAppsList = [...appList, ...newAppsList];
        }

        const paginationDetail = get(response, ['pagination_details', 0], {});
        dispatch(
          appListDataChange({
            appList: updatedAppsList,
            paginationDetails: paginationDetail,
            isLoading: false,
            totalCount: get(paginationDetail, ['total_count'], 0),
            hasMore:
              get(paginationDetail, ['total_count'], 0) >
              get(paginationDetail, ['page'], 0) *
                get(paginationDetail, ['size'], 0),
          }),
        );
      }
    })
    .catch((err) => {
      if (err?.code === ERR_CANCELED) return;
        dispatch(
          appListDataChange({
            isLoading: false,
          }),
        );
    });
};

export const getAppDataApiThunk = (params, callBackFn) => (dispatch) => {
  dispatch(
    appListDataChange({
      isAppDetailsLoading: true,
    }),
  );
  getAppData(params)
    .then((response) => {
      if (!isEmpty(response)) {
        const res = cloneDeep(response?.pagination_data?.[0]) || {};
        const { appAdmins, appViewers } = setAppViewersAndTeams(res);
        const updatedAppData = {
          app_uuid: res?.app_uuid,
          admins: appAdmins,
          viewers: appViewers,
          description: res?.description || EMPTY_STRING,
          name: res?.name,
          id: res?._id,
          status: res?.status,
          url_path: res?.url_path,
        };
        dispatch(applicationDataChange(updatedAppData));
        callBackFn?.(updatedAppData);
      }
    })
    .catch((err) => {
      console.log('Get app data failed', err);
      dispatch(
        appListDataChange({
          isAppDetailsLoading: false,
        }),
      );
    });
};

export const getDraftAppDataApiThunk = (params, callBackFn, publishedAppId) => (dispatch) => {
  dispatch(
    appListDataChange({
      isAppDetailsLoading: true,
    }),
  );
  getAppData(params)
    .then((response) => {
      dispatch(
        appListDataChange({
          isAppDetailsLoading: false,
        }),
      );
      const res = cloneDeep(response?.pagination_data?.[0]) || {};
      if (res?.status === FLOW_STATUS.UNPUBLISHED) {
        callBackFn({
          _id: res?._id,
          status: FLOW_STATUS.UNPUBLISHED,
        });
      } else {
        callBackFn({
          _id: publishedAppId,
          status: FLOW_STATUS.PUBLISHED,
        });
      }
    })
    .catch((err) => {
      console.log('Get app draft data failed', err);
      dispatch(
        appListDataChange({
          isAppDetailsLoading: false,
        }),
      );
    });
};

export const getCurrentAppVersionApiThunk = (params, callBack) => (dispatch) => {
  dispatch(appListDataChange({ isAppDetailsLoading: true }));
  getAppCurrentVersion(params)
    .then((res) => {
      const { appAdmins, appViewers } = setAppViewersAndTeams(res);
        const updatedAppData = {
          app_uuid: res?.app_uuid,
          admins: appAdmins,
          viewers: appViewers,
          description: res?.description || EMPTY_STRING,
          name: res?.name,
          id: res?._id,
          status: res?.status,
          version: res?.version,
          url_path: res?.url_path,
        };
        dispatch(applicationDataChange(updatedAppData));
        dispatch(appListDataChange({ isAppDetailsLoading: false }));
        callBack?.(updatedAppData);
    })
    .catch(() => {
      dispatch(
        appListDataChange({
          isAppDetailsLoading: false,
        }),
      );
    });
};

export const saveAppApiThunk = (params, translate, history, isSaveAndClose = false, isCreateApp = false, callBackFn) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  if (isSaveAndClose) {
    dispatch(applicationStateChange({ hideClosePopper: true }));
  }
  saveApp(params)
    .then((res) => {
      setPointerEvent(false);
      updatePostLoader(false);
      if (!isEmpty(res)) {
        const { activeAppData } = store.getState().ApplicationReducer;
        const admins = cloneDeep(activeAppData?.admins);
        const { appAdmins, appViewers } = setAppViewersAndTeams(res);
        const errorMessage = {};
        let isBasicSettingsModalOpenOrClose = false;
        if (!isEmpty(res?.validation_message)) {
          const validationError = cloneDeep(res?.validation_message);
          const invalidAdmins = [];
          validationError?.forEach((error) => {
            if (error?.field?.includes('admins')) {
              if (error?.field?.includes('users')) {
                const index = Number(error?.field?.[error.field.length - 1]);
                const fullName = getFullName(
                  admins?.users?.[index]?.first_name,
                  admins?.users?.[index]?.last_name,
                );
                invalidAdmins.push(fullName);
              }
            }
          });
          if (!isEmpty(invalidAdmins)) {
            errorMessage.admins = invalidAdmins.join(' ').concat(CREATE_APP_STRINGS(translate).APP_ADMINS.INVALID_ADMINS_ERROR_MESSAGE);
            if (activeAppData?.isBasicSettingsModalOpen) isBasicSettingsModalOpenOrClose = true;
          } else {
            delete errorMessage.admins;
            isBasicSettingsModalOpenOrClose = false;
          }
          dispatch(applicationDataChange({
            errorList: errorMessage,
          }));
        }
        if (isSaveAndClose) routeNavigate(history, ROUTE_METHOD.PUSH, HOME);
        if (isCreateApp) {
          const historyState = {
            app_history_id: res._id,
            app_history_uuid: res.app_uuid,
            app_history_url_path: res.url_path,
            app_history_admins: params.admins,
            app_history_viewers: params.viewers,
            app_history_description: params.description,
            app_history_app_name: res.name,
          };
          routeNavigate(history, ROUTE_METHOD.PUSH, CREATE_APP, EMPTY_STRING, historyState);
        }
        dispatch(applicationStateChange({ hideClosePopper: false }));
        dispatch(applicationDataChange({
          app_uuid: res?.app_uuid,
          id: res?._id,
          admins: appAdmins,
          viewers: appViewers,
          viewersOriginal: params.viewers,
          isBasicSettingsModalOpen: isBasicSettingsModalOpenOrClose,
          errorList: errorMessage,
          isCreateAppModalOpen: false,
        }));
        callBackFn?.(res?._id);
      }
    })
    .catch((error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      dispatch(applicationStateChange({ hideClosePopper: false }));
      const errorData = get(error, ['response', 'data', 'errors', 0], {});
      if (errorData?.type === 'someone_editing') {
        updateSomeoneIsEditingPopover(error.response.data.errors[0].message, dispatch);
        return Promise.resolve();
      }
      let { errorList = {} } = cloneDeep(
        store.getState()?.ApplicationReducer?.activeAppData,
      );
      const errorDetails = error?.response?.data?.errors;
      errorDetails.forEach((errorInfo) => {
        if (
          errorInfo?.field === CREATE_APP_STRINGS(translate).APP_NAME.ID &&
          errorInfo.type === VALIDATION_ERROR_TYPES.EXIST
        ) {
          errorList = {
            ...errorList,
            name: CREATE_APP_STRINGS(translate).APP_NAME.EXIST_ERROR,
          };
        } else if (errorInfo?.field === 'name' &&
        errorInfo.type === ERROR_TYPE_PATTERN_BASE_ERROR) {
          errorList = {
            ...errorList,
            name: CREATE_APP_STRINGS(translate).APP_NAME.ALPHANUMBERIC_ERROR,
          };
        } else if (
          errorInfo?.field === CREATE_APP_STRINGS(translate).APP_URL.ID &&
          errorInfo.type === VALIDATION_ERROR_TYPES.EXIST
        ) {
          errorList = {
            ...errorList,
            url_path: CREATE_APP_STRINGS(translate).APP_URL.EXIST_ERROR,
          };
        }
      });
      if (!isEmpty(errorList)) {
        dispatch(
          applicationDataChange({
            errorList: errorList,
          }),
        );
      }
      const serverErrors = get(error, ['response', 'data', 'errors'], []);
        const { activeAppData } = store.getState().ApplicationReducer;
        let currentErrorList = cloneDeep(activeAppData?.errorList || {});
        const admins = cloneDeep(activeAppData?.admins);
        const pages = cloneDeep(activeAppData?.pages);
        const invalidAdmins = [];
        const invalidViewers = [];
        const invalidPageViewers = [];
        const invalidPageViewersErrorList = {};
        serverErrors.forEach((error) => {
          switch (error?.type) {
            case 'any.only':
              if (error?.field?.includes('admins')) {
                if (error?.field?.includes('users')) {
                  const index = Number(error?.field?.[error.field.length - 1]);
                  const fullName = getFullName(
                    admins?.users?.[index]?.first_name,
                    admins?.users?.[index]?.last_name,
                  );
                  invalidAdmins.push(fullName);
                }
              }
              if (error?.field?.includes('viewers')) {
                if (error?.field?.includes('users')) {
                  if (!error?.field?.includes('pages')) {
                    const index = Number(error?.field?.[error.field.length - 1]);
                    const fullName = getFullName(
                      admins?.users?.[index]?.first_name,
                      admins?.users?.[index]?.last_name,
                    );
                    invalidViewers.push(fullName);
                  } else {
                    const index = Number(error?.field?.split('.')?.[1]);
                    const userIndex = Number(error?.field?.[error.field.length - 1]);
                    const fullName = getFullName(
                      pages?.[index]?.viewers?.users?.[userIndex]?.first_name,
                      pages?.[index]?.viewers?.users?.[userIndex]?.last_name,
                    );
                    invalidPageViewers.push({
                      id: `page_security,${index},viewers`,
                      label: fullName,
                    });
                  }
                }
              }
              break;
            case VALIDATION_ERROR_TYPES.EXIST:
              break;
            default:
        if (!(errorDetails?.[0]?.field === 'name' &&
          errorDetails?.[0]?.type === ERROR_TYPE_PATTERN_BASE_ERROR)) {
            showToastPopover(
              translate(ERROR_LABEL),
              translate(FORM_POPOVER_STRINGS.APP_PUBLISHED_FAILURE),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
        }
          }
        });

        if (!isEmpty(invalidPageViewers)) {
          const uniqueErrorKeys = [...new Set(invalidPageViewers.map((item) => item.id))];
          uniqueErrorKeys?.forEach((key) => {
            const filteredObjects = invalidPageViewers?.filter((pageViewerObj) =>
            pageViewerObj.id === key);
            invalidPageViewersErrorList[key] = filteredObjects?.map((eachObj) => eachObj.label).join(', ').concat(CREATE_APP_STRINGS(translate).APP_VIEWERS.INVALID_VIEWER_ERROR_MESSAGE);
          });
        }

        if (!isEmpty(invalidAdmins)) {
          currentErrorList.admins = invalidAdmins.join(' ').concat(CREATE_APP_STRINGS(translate).APP_ADMINS.INVALID_ADMINS_ERROR_MESSAGE);
        } else delete currentErrorList.admins;
        if (!isEmpty(invalidViewers)) {
          currentErrorList.viewers = invalidViewers.join(' ').concat(CREATE_APP_STRINGS(translate).APP_VIEWERS.INVALID_VIEWER_ERROR_MESSAGE);
        } else delete currentErrorList.viewers;
        if (!isEmpty(invalidPageViewers)) {
          currentErrorList = {
            ...currentErrorList,
            ...invalidPageViewersErrorList || {},
          };
        }
        const errrorUpdateData = { errorList: currentErrorList };
        if (activeAppData?.isPublishModalOpen) errrorUpdateData.isPublishModalOpen = true;
        dispatch(applicationDataChange({
          ...errrorUpdateData,
        }));
      return Promise.resolve();
    });
};

export const deleteAppThunk = (params, translate) => (dispatch) =>
  new Promise((resolve, reject) => {
    deleteApp(params)
      .then((response) => {
        showToastPopover(
          'App Deleted Successfully',
          EMPTY_STRING,
          FORM_POPOVER_STATUS.DELETE,
          true,
        );
        resolve(response);
      })
      .catch((error) => {
        const errorData = get(error, ['response', 'data', 'errors', 0], {});
        if (errorData?.type === 'someone_editing') {
          const isCurrentUser = getCurrentUserId() === errorData?.message?.user_id;
          dispatch(applicationStateChange({
            deleteAnyWayPopper: {
              full_name: errorData?.message?.full_name || EMPTY_STRING,
              isCurrentUserDelete: isCurrentUser,
              isAnywayVisible: true,
              currentUserMessage: translate('error_popover_status.edit_in_another_screen'),
            },
          }));
        }
        reject(error);
      });
  });

// Dashboard and Report
export const getAppsAllFlowsThunk = (params) => (dispatch) => {
  const allFlowsData = cloneDeep(
    store.getState().ApplicationReducer.allFlowsData,
  );
  if (params.page === 1) {
    dispatch(applicationStateChange({
      allFlowsData: {
        ...allFlowsData,
        allFlows: [],
        dashboardDDTotalCount: 0,
        page: params.page,
        isLoading: true,
        hasMore: false,
      },
    }));
  } else {
    dispatch(applicationStateChange({ allFlowsData: {
      ...allFlowsData,
      isLoading: true,
    } }));
  }
  getAllFlows(params)
    .then((res) => {
      if (res) {
        const { pagination_data = [], pagination_details = [] } = res;
        const clonedDashboardConfigData = cloneDeep(
          store.getState().ApplicationDashboardReportReducer.dashboardConfig,
        );
        if (pagination_data && pagination_data.length > 0) {
          if (pagination_details[0].page > 0) {
            clonedDashboardConfigData.dashboardDDTotalCount = get(res, [
              'pagination_details',
              0,
              'total_count',
            ]);
          }
          const arrResOptions = [];
          pagination_data.forEach((pData) => {
            const { flow_name, flow_uuid } = pData;
            arrResOptions.push({
              label: flow_name,
              value: flow_uuid,
              isCheck: false,
            });
          });
          clonedDashboardConfigData.dashboardDDOptionList =
            pagination_details[0].page > 1
              ? union(clonedDashboardConfigData.dashboardDDOptionList, arrResOptions)
              : arrResOptions;
              clonedDashboardConfigData.dashboardDDCurrentPage = params.page;
        } else {
          clonedDashboardConfigData.dashboardDDOptionList = [];
          clonedDashboardConfigData.dashboardDDTotalCount = 0;
          clonedDashboardConfigData.page = 0;
        }
        dispatch(applicationStateChange({ allFlowsData: {
          allFlows: clonedDashboardConfigData.dashboardDDOptionList,
          total_count: clonedDashboardConfigData.dashboardDDTotalCount,
          page: pagination_details?.[0]?.page,
          hasMore: (clonedDashboardConfigData?.dashboardDDOptionList?.length < clonedDashboardConfigData?.dashboardDDTotalCount),
          isLoading: false,
        } }));
        dispatch(setDashboardConfigDataChange(clonedDashboardConfigData));
      }
    })
    .catch((err) => {
      if (err?.code === ERR_CANCELED) return;
      console.log('getAppsAllFlows failed', err);
    });
};

export const getDashboardAppsAllDataListsThunk = (params) => (dispatch) => {
  getAllViewDataList(params)
    .then((res) => {
      if (res) {
        const { pagination_data = [], pagination_details = [] } = res;
        const clonedDashboardConfigData = cloneDeep(
          store.getState().ApplicationDashboardReportReducer.dashboardConfig,
        );
        if (pagination_data && pagination_data.length > 0) {
          if (pagination_details[0].page > 0) {
            clonedDashboardConfigData.dashboardDDTotalCount = get(res, [
              'pagination_details',
              0,
              'total_count',
            ]);
          }
          const arrResOptions = [];
          pagination_data.forEach((pData) => {
            const { data_list_name, data_list_uuid } = pData;
            arrResOptions.push({
              label: data_list_name,
              value: data_list_uuid,
              isCheck: false,
            });
          });
          clonedDashboardConfigData.dashboardDDOptionList =
            pagination_details[0].page > 1
              ? union(clonedDashboardConfigData.dashboardDDOptionList, arrResOptions)
              : arrResOptions;
              clonedDashboardConfigData.dashboardDDCurrentPage = params.page;
        } else {
          clonedDashboardConfigData.dashboardDDOptionList = [];
          clonedDashboardConfigData.dashboardDDTotalCount = 0;
          clonedDashboardConfigData.padashboardDDCurrentPagege = 0;
        }
        dispatch(setDashboardConfigDataChange(clonedDashboardConfigData));
      }
    })
    .catch((err) => {
      if (err?.code === ERR_CANCELED) return;
      console.log('getDashboardAppsAllDataListsThunk failed', err);
    });
};

export const getAppsAllDataListsThunk = (params) => (dispatch) => {
  const allDataListsData = cloneDeep(
    store.getState().ApplicationReducer.allDataListsData,
  );
  if (params.page === 1) {
    dispatch(applicationStateChange({
      allDataListsData: {
        ...allDataListsData,
        allDataLists: [],
        totalCount: 0,
        page: params.page,
        isLoading: true,
        hasMore: false,
      },
    }));
  } else {
    dispatch(applicationStateChange({ allDataListsData: {
      ...allDataListsData,
      isLoading: true,
    } }));
  }
  getAllViewDataList(params)
    .then((res) => {
      if (res) {
        const { pagination_data = [], pagination_details = [] } = res;
        const allDataListsData = cloneDeep(
          store.getState().ApplicationReducer.allDataListsData,
        );
        if (pagination_data && pagination_data.length > 0) {
          if (pagination_details[0].page > 0) {
            allDataListsData.total_count = get(res, [
              'pagination_details',
              0,
              'total_count',
            ]);
          }
          const arrResOptions = [];
          pagination_data.forEach((pData) => {
            const { data_list_name, data_list_uuid } = pData;
            arrResOptions.push({
              label: data_list_name,
              value: data_list_uuid,
              isCheck: false,
            });
          });
          allDataListsData.allDataLists =
            pagination_details[0].page > 1
              ? union(allDataListsData.allDataLists, arrResOptions)
              : arrResOptions;
          allDataListsData.page = params.page + 1;
          if (
            allDataListsData.total_count >
            allDataListsData?.allDataLists?.length
          ) allDataListsData.hasMore = true;
          else allDataListsData.hasMore = false;
        } else {
          allDataListsData.allDataLists = [];
          allDataListsData.page = 0;
          allDataListsData.total_count = 0;
          allDataListsData.hasMore = false;
        }
        dispatch(
          applicationStateChange({ allDataListsData: allDataListsData }),
        );
      }
    })
    .catch((err) => {
      if (err?.code === ERR_CANCELED) return;
      console.log('getAppsAllFlows failed', err);
    });
};

export const getUsersApiThunk = (params, setCancelToken) => (dispatch) => {
  getTeamsAndUsers(params, setCancelToken)
      .then((res) => {
        if (!isEmpty(res)) {
          const { usersAndTeamsData = {}, activeAppData = {} } = cloneDeep(store.getState().ApplicationReducer);
          const { pagination_data = [], pagination_details = {}, document_url_details = [] } = res;
          if (!isEmpty(pagination_data)) {
            const usersAndTeamsList = [];
            pagination_data.forEach((eachUserOrTeam) => {
              if (!([...get(activeAppData, ['admins', 'users'], []),
              ...get(activeAppData, ['admins', 'teams'], [])])?.find((existingUserOrTeam) =>
                existingUserOrTeam._id === eachUserOrTeam._id)) {
                const userOrTeamData = cloneDeep(eachUserOrTeam);
                if (userOrTeamData?.is_user) {
                  userOrTeamData.label = getFullName(
                  userOrTeamData.first_name,
                  userOrTeamData.last_name,
                  );
                } else userOrTeamData.label = userOrTeamData?.team_name;
                userOrTeamData.name = cloneDeep(userOrTeamData.label);
                userOrTeamData.id = cloneDeep(userOrTeamData._id);
                const userOrTeamPic = document_url_details.find(
                  (eachDocument) => eachDocument.document_id === userOrTeamData.profile_pic || eachDocument.document_id === userOrTeamData.team_pic,
                );
                if (get(userOrTeamPic, ['signedurl'])) userOrTeamData.avatar = userOrTeamPic.signedurl;
                usersAndTeamsList.push(userOrTeamData);
              }
            });
            if (get(pagination_details, [0, 'page'], 0) === 1) usersAndTeamsData.users = cloneDeep(usersAndTeamsList);
            else usersAndTeamsData.users = [...(usersAndTeamsData.users || []), ...cloneDeep(usersAndTeamsList)];
          } else usersAndTeamsData.users = [];
          usersAndTeamsData.usersTotalCount = get(pagination_details, [0, 'total_count'], 0);
          usersAndTeamsData.usersPage = get(pagination_details, [0, 'page'], 0) + 1;
          dispatch(applicationStateChange({ usersAndTeamsData: usersAndTeamsData }));
        }
      })
      .catch((err) => {
        console.log('!resssss', err);
      });
};

export const getUsersAndTeamsApiThunk =
  (params, setCancelToken) => (dispatch) => {
    getTeamsAndUsers(params, setCancelToken)
      .then((res) => {
        if (!isEmpty(res)) {
          const { usersAndTeamsData = {}, activeAppData = {} } = cloneDeep(
            store.getState().ApplicationReducer,
          );
          const {
            pagination_data = [],
            pagination_details = {},
            document_url_details = [],
          } = res;
          if (!isEmpty(pagination_data)) {
            const usersAndTeamsList = [];
            pagination_data.forEach((eachUserOrTeam) => {
              if (!([...get(activeAppData, ['viewrs', 'users'], []),
              ...get(activeAppData, ['viewrs', 'teams'], [])])?.find((existingUserOrTeam) =>
                existingUserOrTeam._id === eachUserOrTeam._id)) {
                const userOrTeamData = cloneDeep(eachUserOrTeam);
                if (userOrTeamData?.is_user) {
                  userOrTeamData.label = getFullName(
                    userOrTeamData.first_name,
                    userOrTeamData.last_name,
                  );
                } else userOrTeamData.label = userOrTeamData?.team_name;
                userOrTeamData.name = cloneDeep(userOrTeamData.label);
                userOrTeamData.id = cloneDeep(userOrTeamData._id);
                const userOrTeamPic = document_url_details.find(
                  (eachDocument) =>
                    eachDocument.document_id === userOrTeamData.profile_pic ||
                    eachDocument.document_id === userOrTeamData.team_pic,
                );
                if (get(userOrTeamPic, ['signedurl'])) userOrTeamData.avatar = userOrTeamPic.signedurl;
                usersAndTeamsList.push(userOrTeamData);
              }
            });
            if (get(pagination_details, [0, 'page'], 0) === 1) usersAndTeamsData.usersAndTeams = cloneDeep(usersAndTeamsList);
            else {
              usersAndTeamsData.usersAndTeams = [
                ...(usersAndTeamsData.usersAndTeams || []),
                ...cloneDeep(usersAndTeamsList),
              ];
            }
          } else usersAndTeamsData.usersAndTeams = [];
          usersAndTeamsData.usersAndTeamsTotalCount = get(
            pagination_details,
            [0, 'total_count'],
            0,
          );
          usersAndTeamsData.usersAndTeamsPage =
            get(pagination_details, [0, 'page'], 0) + 1;
          dispatch(
            applicationStateChange({ usersAndTeamsData: usersAndTeamsData }),
          );
        }
      })
      .catch((err) => {
        console.log('!resssss', err);
      });
  };

export const publishAppApiThunk = (params, translate, history) => (dispatch) => {
  dispatch(applicationStateChange({ hideClosePopper: true }));
  publishApp(params)
    .then((res) => {
      console.log('publish app api success', res);
      dispatch(applicationClear());
      dispatch(clearDashboard());
      showToastPopover(
        translate(PUBLISHED_LABEL),
        FORM_POPOVER_STRINGS.APP_PUBLISHED_SUCCESSFULLY,
        FORM_POPOVER_STATUS.SUCCESS,
        true,
      );
      routeNavigate(history, ROUTE_METHOD.PUSH, HOME);
      dispatch(applicationStateChange({ hideClosePopper: false }));
    })
    .catch((error) => {
      if (error?.code === ERR_CANCELED) return;
      dispatch(applicationStateChange({ hideClosePopper: false }));
      const errorData = get(error, ['response', 'data', 'errors', 0], {});
      if (errorData?.type === 'someone_editing') {
        updateSomeoneIsEditingPopover(error.response.data.errors[0].message, dispatch);
      } else {
        const serverErrors = get(error, ['response', 'data', 'errors'], []);
        const { activeAppData } = store.getState().ApplicationReducer;
        let currentErrorList = cloneDeep(activeAppData?.errorList || {});
        const admins = cloneDeep(activeAppData?.admins);
        const pages = cloneDeep(activeAppData?.pages);
        const invalidAdmins = [];
        const invalidViewers = [];
        const invalidPageViewers = [];
        const invalidPageViewersErrorList = {};
        serverErrors.forEach((error) => {
          switch (error?.type) {
            case 'any.only':
              if (error?.field?.includes('admins')) {
                if (error?.field?.includes('users')) {
                  const index = Number(error?.field?.[error.field.length - 1]);
                  const fullName = getFullName(
                    admins?.users?.[index]?.first_name,
                    admins?.users?.[index]?.last_name,
                  );
                  invalidAdmins.push(fullName);
                }
              }
              if (error?.field?.includes('viewers')) {
                if (error?.field?.includes('users')) {
                  if (!error?.field?.includes('pages')) {
                    const index = Number(error?.field?.[error.field.length - 1]);
                    const fullName = getFullName(
                      admins?.users?.[index]?.first_name,
                      admins?.users?.[index]?.last_name,
                    );
                    invalidViewers.push(fullName);
                  } else {
                    const index = Number(error?.field?.split('.')?.[1]);
                    const userIndex = Number(error?.field?.[error.field.length - 1]);
                    const fullName = getFullName(
                      pages?.[index]?.viewers?.users?.[userIndex]?.first_name,
                      pages?.[index]?.viewers?.users?.[userIndex]?.last_name,
                    );
                    invalidPageViewers.push({
                      id: `page_security,${index},viewers`,
                      label: fullName,
                    });
                  }
                }
              }
              break;
            default:
            showToastPopover(
              translate(ERROR_LABEL),
              translate(FORM_POPOVER_STRINGS.APP_PUBLISHED_FAILURE),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          }
        });

        if (!isEmpty(invalidPageViewers)) {
          const uniqueErrorKeys = [...new Set(invalidPageViewers.map((item) => item.id))];
          uniqueErrorKeys?.forEach((key) => {
            const filteredObjects = invalidPageViewers?.filter((pageViewerObj) =>
            pageViewerObj.id === key);
            invalidPageViewersErrorList[key] = filteredObjects?.map((eachObj) => eachObj.label).join(', ').concat(CREATE_APP_STRINGS(translate).APP_VIEWERS.INVALID_VIEWER_ERROR_MESSAGE);
          });
        }

        if (!isEmpty(invalidAdmins)) {
          currentErrorList.admins = invalidAdmins.join(' ').concat(CREATE_APP_STRINGS(translate).APP_ADMINS.INVALID_ADMINS_ERROR_MESSAGE);
        } else delete currentErrorList.admins;
        if (!isEmpty(invalidViewers)) {
          currentErrorList.viewers = invalidViewers.join(' ').concat(CREATE_APP_STRINGS(translate).APP_VIEWERS.INVALID_VIEWER_ERROR_MESSAGE);
        } else delete currentErrorList.viewers;
        if (!isEmpty(invalidPageViewers)) {
          currentErrorList = {
            ...currentErrorList,
            ...invalidPageViewersErrorList || {},
          };
        }
        dispatch(applicationDataChange({
          isPublishModalOpen: true,
          errorList: currentErrorList,
        }));
      }
      dispatch(
        appListDataChange({
          isAppListLoading: false,
        }),
      );
    });
};

export const getAppComponentsThunk = (params, isBasicUser) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  dispatch(applicationStateChange({ isLoading: true }));
  geComponentsApi(params, isBasicUser)
    .then((res) => {
      setPointerEvent(false);
      updatePostLoader(false);
      if (!isEmpty(res)) {
        const { customizedPagesData, errorPerPageComp } = cloneDeep(store.getState().ApplicationReducer);
        const currentPageData = customizedPagesData.find((pages) => pages.value === params.page_id);
        dispatch(applicationStateChange({ layoutsDetails: getComponentsStructure(res, isBasicUser, currentPageData, errorPerPageComp), componentDetails: res, isLoading: false }));
      } else dispatch(applicationStateChange({ layoutsDetails: [], isLoading: false }));
    })
    .catch(() => {
      setPointerEvent(false);
      updatePostLoader(false);
      dispatch(applicationStateChange({ layoutsDetails: [], isLoading: false }));
    });
};

export const validateAppApiThunk = (params, isBasicUser, t) => (dispatch) => {
  validateAppApi(params)
    .then(() => {
      dispatch(applicationDataChange({
        isPublishModalOpen: true,
      }));
    })
    .catch((error) => {
      if (error?.code === ERR_CANCELED) return;
      const errorData = get(error, ['response', 'data', 'errors', 0], {});
      if (errorData?.type === 'someone_editing') {
        updateSomeoneIsEditingPopover(error.response.data.errors[0].message, dispatch);
      } else {
        const serverErrors = get(error, ['response', 'data', 'errors'], []);
        const pagesData = cloneDeep(store.getState().ApplicationReducer.customizedPagesData);
        const errorPerPageComponent = {};
        const { activeAppData } = store.getState().ApplicationReducer;
        let currentErrorList = cloneDeep(activeAppData?.errorList || {});
        const admins = cloneDeep(activeAppData?.admins);
        const pages = cloneDeep(activeAppData?.pages);
        const invalidAdmins = [];
        const invalidViewers = [];
        const invalidPageViewers = [];
        const invalidPageViewersErrorList = {};
        serverErrors.forEach((error) => {
          switch (error?.type) {
            case 'array.min':
              if (error?.field?.includes('components')) {
                const errorPageIndex = Number(error?.field.split('.')[1]);
                pagesData[errorPageIndex].error = true;
                showToastPopover(
                  CREATE_APP_STRINGS(t).APP_ERROR_MESSAGES.APP_ERROR,
                  CREATE_APP_STRINGS(t).APP_ERROR_MESSAGES.APP_ERROR_COMPONENT_SUBTEXT,
                  FORM_POPOVER_STATUS.SERVER_ERROR,
                  true,
                );
              }
              break;
            case 'any.invalid':
            case 'any.only':
              if (error?.field?.includes('component_info')) {
                showToastPopover(
                  CREATE_APP_STRINGS(t).APP_ERROR_MESSAGES.APP_ERROR,
                  CREATE_APP_STRINGS(t).APP_ERROR_MESSAGES.APP_ERROR_CONFIG_SUBTEXT,
                  FORM_POPOVER_STATUS.SERVER_ERROR,
                  true,
                );
                const errorPageIndex = Number(error?.field.split('.')[1]);
                const errorCompIndex = Number(error?.field.split('.')[3]);
                let fieldError = error?.field.split('.')[5];
                pagesData[errorPageIndex].error = true;
                if (error?.field?.includes('links')) {
                  fieldError = `component_info,links,${error?.field.split('.')[6]},source_uuid`;
                } else if (error?.field.split('.').length === 6) {
                  fieldError = 'component_info,source_uuid';
                } else if (error?.field.split('.').length === 7 && error?.field.includes(TASK_COMPONENT_CONFIG_KEYS.FLOW_UUIDS || TASK_COMPONENT_CONFIG_KEYS.DATA_LISTS_UUIDS)) {
                  fieldError = 'component_info,choose_flow_or_data_list';
                }
                errorPerPageComponent[errorPageIndex] = [...errorPerPageComponent[errorPageIndex] || [], { errorCompIndex: errorCompIndex, errorIn: fieldError }];
              }
              if (error?.field?.includes('admins')) {
                if (error?.field?.includes('users')) {
                  const index = Number(error?.field?.[error.field.length - 1]);
                  const fullName = getFullName(
                    admins?.users?.[index]?.first_name,
                    admins?.users?.[index]?.last_name,
                  );
                  invalidAdmins.push(fullName);
                  showToastPopover(
                    CREATE_APP_STRINGS(t).APP_ERROR_MESSAGES.ADMIN_ERROR,
                    CREATE_APP_STRINGS(t).APP_ERROR_MESSAGES.ADMIN_ERROR_SUBTEXT,
                    FORM_POPOVER_STATUS.SERVER_ERROR,
                    true,
                  );
                }
              }
              if (error?.field?.includes('viewers')) {
                if (error?.field?.includes('users')) {
                  if (!error?.field?.includes('pages')) {
                    const index = Number(error?.field?.[error.field.length - 1]);
                    const fullName = getFullName(
                      admins?.users?.[index]?.first_name,
                      admins?.users?.[index]?.last_name,
                    );
                    invalidViewers.push(fullName);
                  } else {
                    const index = Number(error?.field?.split('.')?.[1]);
                    const userIndex = Number(error?.field?.[error.field.length - 1]);
                    const fullName = pages?.[index]?.viewers?.users?.[userIndex]?.team_name;
                    invalidPageViewers.push({
                      id: `page_security,${index},viewers`,
                      label: fullName,
                    });
                  }
                  showToastPopover(
                    CREATE_APP_STRINGS(t).APP_ERROR_MESSAGES.VIEWER_ERROR,
                    CREATE_APP_STRINGS(t).APP_ERROR_MESSAGES.VIEWER_ERROR_SUBTEXT,
                    FORM_POPOVER_STATUS.SERVER_ERROR,
                    true,
                  );
                } else if (error?.field?.includes('teams')) {
                  if (error?.field?.includes('pages')) {
                    const index = Number(error?.field?.split('.')?.[1]);
                    const userIndex = Number(error?.field?.[error.field.length - 1]);
                    const fullName = pages?.[index]?.viewers?.teams?.[userIndex]?.team_name;
                    pagesData[index].error = true;
                    invalidPageViewers.push({
                      id: `page_security,${index},viewers`,
                      label: fullName,
                    });
                    showToastPopover(
                      CREATE_APP_STRINGS(t).APP_ERROR_MESSAGES.PAGE_ERROR,
                      `${CREATE_APP_STRINGS(t).APP_ERROR_MESSAGES.PAGE_ERROR_TEAMS_DELETED}${fullName}`,
                      FORM_POPOVER_STATUS.SERVER_ERROR,
                      true,
                    );
                  }
                }
              }
              break;
            case 'any.required':
              if (error?.field?.includes('url_path')) {
                const errorPageIndex = Number(error?.field.split('.')[1]);
                pagesData[errorPageIndex].error = true;
                showToastPopover(
                  CREATE_APP_STRINGS(t).APP_ERROR_MESSAGES.PAGE_ERROR,
                  CREATE_APP_STRINGS(t).APP_ERROR_MESSAGES.PAGE_ERROR_URL_SUBTEXT,
                  FORM_POPOVER_STATUS.SERVER_ERROR,
                  true,
                );
              } else if (error?.field?.includes('page_viewers')) {
                const errorPageIndex = Number(error?.field.split('.')[1]);
                pagesData[errorPageIndex].error = true;
                showToastPopover(
                  CREATE_APP_STRINGS(t).APP_ERROR_MESSAGES.PAGE_ERROR,
                  CREATE_APP_STRINGS(t).APP_ERROR_MESSAGES.PAGE_ERROR_MISSING_SUBTEXT,
                  FORM_POPOVER_STATUS.SERVER_ERROR,
                  true,
                );
              } else {
                const errorPageIndex = Number(error?.field.split('.')[1]);
                pagesData[errorPageIndex].error = true;
                showToastPopover(
                  CREATE_APP_STRINGS(t).APP_ERROR_MESSAGES.PAGE_ERROR,
                  CREATE_APP_STRINGS(t).APP_ERROR_MESSAGES.PAGE_ERROR_CONFIG_SUBTEXT,
                  FORM_POPOVER_STATUS.SERVER_ERROR,
                  true,
                );
              }
            break;
            default: break;
          }
        });

        if (!isEmpty(invalidPageViewers)) {
          const uniqueErrorKeys = [...new Set(invalidPageViewers.map((item) => item.id))];
          uniqueErrorKeys?.forEach((key) => {
            const filteredObjects = invalidPageViewers?.filter((pageViewerObj) =>
            pageViewerObj.id === key);
            invalidPageViewersErrorList[key] = filteredObjects?.map((eachObj) => eachObj.label).join(', ').concat(CREATE_APP_STRINGS(t).APP_VIEWERS.INVALID_VIEWER_ERROR_MESSAGE);
          });
        }

        if (!isEmpty(invalidAdmins)) {
          currentErrorList.admins = invalidAdmins.join(' ').concat(CREATE_APP_STRINGS(t).APP_ADMINS.INVALID_ADMINS_ERROR_MESSAGE);
        } else delete currentErrorList.admins;
        if (!isEmpty(invalidViewers)) {
          currentErrorList.viewers = invalidViewers.join(' ').concat(CREATE_APP_STRINGS(t).APP_VIEWERS.INVALID_VIEWER_ERROR_MESSAGE);
        } else delete currentErrorList.viewers;
        if (!isEmpty(invalidPageViewers)) {
          currentErrorList = {
            ...currentErrorList,
            ...invalidPageViewersErrorList || {},
          };
        }
        dispatch(applicationDataChange({
          errorList: currentErrorList,
        }));

        const updateData = {
          customizedPagesData: pagesData,
        };
        if (!isEmpty(errorPerPageComponent)) {
          updateData.errorPerPageComp = errorPerPageComponent;
          const currentPage = store.getState().ApplicationReducer.current_page_id;
          const appId = store.getState().ApplicationReducer.activeAppData.id;
          const params = {
            app_id: appId,
            page_id: currentPage,
          };
          dispatch(getAppComponentsThunk(params, isBasicUser));
        }
        dispatch(applicationStateChange({ ...updateData }));
      }
      dispatch(
        appListDataChange({
          isAppListLoading: false,
        }),
      );
    });
};

export const discardAppApiThunk = (params, history) => (dispatch) => {
  dispatch(applicationStateChange({ hideClosePopper: true }));
  discardApp(params)
    .then(() => {
      routeNavigate(history, ROUTE_METHOD.PUSH, APPLICATION_SCREENS.PUBLISHED_LIST);
      dispatch(applicationStateChange({ hideClosePopper: false }));
    })
    .catch((error) => {
      if (error?.code === ERR_CANCELED) return;
      dispatch(applicationStateChange({ hideClosePopper: false }));
      const errorData = get(error, ['response', 'data', 'errors', 0], {});
      if (errorData?.type === 'someone_editing') {
        updateSomeoneIsEditingPopover(error.response.data.errors[0].message, dispatch);
      }
      dispatch(
        appListDataChange({
          isAppListLoading: false,
        }),
      );
    });
};

export const updateAppSecurityApiThunk = (params, translate, publishParams, history, callBack = null) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  updateAppSecurity(params)
    .then((res) => {
      setPointerEvent(false);
      updatePostLoader(false);
      if (!isEmpty(publishParams)) {
        dispatch(publishAppApiThunk(publishParams, translate, history));
      } else {
        callBack && callBack();
      }
      console.log('update app security success', res);
    })
    .catch((error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      const errorData = get(error, ['response', 'data', 'errors', 0], {});
      if (errorData?.type === 'someone_editing') {
        updateSomeoneIsEditingPopover(error.response.data.errors[0].message, dispatch);
        return Promise.resolve();
      }
      if (
        errorData?.field === CREATE_APP_STRINGS(translate).APP_NAME.ID &&
        errorData.type === VALIDATION_ERROR_TYPES.EXIST
      ) {
        let { errorList = {} } = cloneDeep(
          store.getState()?.ApplicationReducer?.activeAppData,
        );
        errorList = {
          ...errorList,
          name: CREATE_APP_STRINGS(translate).APP_NAME.EXIST_ERROR,
        };
        dispatch(
          applicationDataChange({
            errorList: errorList,
          }),
        );
      }
      return Promise.resolve();
    });
};

export const getAppPagesThunk = (params, callBack, isBasicUser, holdCurrentPage = false, pageInFocus = null) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  getAppPagesApi(params, isBasicUser)
  .then((res) => {
    setPointerEvent(false);
    updatePostLoader(false);
    if (!isEmpty(res)) {
      const resData = {
        pages: res,
        customizedPagesData: getPageOptions(res),
        current_page_id: res[0]._id,
        current_page_uuid: res[0].page_uuid,
        customPageSecurity: !res?.[0]?.is_inherit_from_app,
      };
      if (holdCurrentPage) {
        delete resData.current_page_id;
        delete resData.current_page_uuid;
        delete resData.customPageSecurity;
        if (pageInFocus !== null && pageInFocus >= 0) {
          resData.current_page_id = res[pageInFocus]._id;
          resData.current_page_uuid = res[pageInFocus].page_uuid;
          resData.customPageSecurity = !res?.[pageInFocus]?.is_inherit_from_app;
        }
      }
      dispatch(applicationStateChange(resData));
      dispatch(applicationDataChange({ pages: res }));
    } else {
      callBack?.();
    }
  })
  .catch((error) => {
    console.log('app page api failed', error);
    setPointerEvent(false);
    updatePostLoader(false);
  });
};

export const deleteAppPagesThunk = (params, appId, isBasicUser, updateOrder) => () => {
  setPointerEvent(true);
  updatePostLoader(true);
  deletePage(params)
  .then((res) => {
    if (res) {
      showToastPopover('Page Deleted Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);
      updateOrder();
    }
  })
  .catch((err) => {
    setPointerEvent(false);
    updatePostLoader(false);
    console.log('delete app page api failed', err);
  });
};

export const saveCoordinatesThunk = (params) => () => {
  saveCoordinateAPI(params)
  .then((res) => {
    if (!isEmpty(res)) {
      console.log(res);
    }
  })
  .catch((err) => {
    console.log('save coordinates api failed', err);
  });
};

export const savePagesThunk = (params, indexOrder, isInitial = false, newTab = [], getPageCall, isBasicUser, pageScroll, translate = translateFunction, isFromAppCreationPrompt) => (dispatch) =>
  new Promise((resolve, reject) => {
    if (!isFromAppCreationPrompt) {
      setPointerEvent(true);
      updatePostLoader(true);
    }
  savePage(params)
  .then((res) => {
    if (!isEmpty(res)) {
      const { customizedPagesData, activeAppData } = cloneDeep(store.getState().ApplicationReducer);
      if (isFromAppCreationPrompt) {
        return resolve(res);
      }
      setPointerEvent(false);
      updatePostLoader(false);
      let updatedValue = cloneDeep(customizedPagesData);
      if (!isInitial) updatedValue = [...updatedValue, newTab];
      updatedValue[indexOrder].value = res._id;
      updatedValue[indexOrder].uuid = res.page_uuid;
      if (!isEmpty(newTab)) {
        const newPageData = {};
        newPageData.current_page_id = res._id;
        newPageData.current_page_uuid = res.page_uuid;
        newPageData.customPageSecurity = !res?.is_inherit_from_app;
        dispatch(applicationStateChange({ ...newPageData }));
      }
      const pagesData = cloneDeep(activeAppData?.pages);
      if (!isEmpty(pagesData) && isArray(pagesData) && pagesData.length > 0 && !has(pagesData[0], 'viewers')) {
       if (has(res, 'viewers')) {
         pagesData[0].viewers = cloneDeep(res.viewers);
       }
      }
      pagesData.push(res);
      dispatch(applicationStateChange({ customizedPagesData: updatedValue }));
      if (isInitial) dispatch(applicationStateChange({ current_page_id: res._id, current_page_uuid: res.page_uuid }));
      if (getPageCall) dispatch(getAppPagesThunk({ app_id: params.app_id }, null, isBasicUser, true));
      dispatch(applicationDataChange({ pages: pagesData }));
      pageScroll?.();
      return resolve();
    }
    return reject();
  })
  .catch((error) => {
    if (!isFromAppCreationPrompt) {
      setPointerEvent(false);
      updatePostLoader(false);
    }
    const errorData = get(error, ['response', 'data', 'errors', 0], {});
    if (errorData?.type === 'someone_editing') {
      updateSomeoneIsEditingPopover(error.response.data.errors[0].message, dispatch);
      resolve();
    }
    if (errorData?.type === 'number.max') {
      showToastPopover(
        'Maximum of 10 page creation is only allowed',
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
      resolve();
    }
    const errors = get(error, ['response', 'data', 'errors'], []);
    const errorObj = {};
    errors?.forEach((errorDetails) => {
      if (errorDetails?.field === 'url_path') {
        errorObj.url_path = translate(APP_VALIDATION.PAGE_URL_EXIST);
      } else if (errorDetails?.field === 'name') {
        errorObj.name = translate(APP_VALIDATION.PAGE_NAME_EXIST);
      }
    });
    if (!isEmpty(errorObj)) {
      dispatch(applicationPageConfigChange({ errorList: errorObj }));
    }
    return reject();
  });
});

export const getAppComponentByIdThunk = (id) => (dispatch) => new Promise(
  (resolve, reject) => {
      setPointerEvent(true);
      updatePostLoader(true);
      getComponentById(id)
      .then((res) => {
        setPointerEvent(false);
        updatePostLoader(false);
        const { activeComponent } = store.getState().ApplicationReducer;
        if (!isEmpty(res?.component_info)) {
          dispatch(setApplicationActiveComponentDataChange({
            ...activeComponent,
            component_info: {
              ...(activeComponent?.component_info || {}),
              ...(res?.component_info || {}),
            },
          }));
          resolve(res);
        }
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        reject(error);
      });
  });

export const saveComponentApiThunk = (params, translate, isEdit, getComponents, isFromAppCreationPrompt = false) => async (dispatch) => {
  if (!isFromAppCreationPrompt) {
    setPointerEvent(true);
    updatePostLoader(true);
  }
  await saveComponent(params)
    .then((res) => {
      // const { activeUpdatedLayout } = store.getState().ApplicationReducer;
      if (isFromAppCreationPrompt) {
        return res;
      } else {
        setPointerEvent(false);
        updatePostLoader(false);
      }
      if (!isEdit) {
        // dispatch(applicationStateChange({ layoutsDetails: activeUpdatedLayout, activeUpdatedLayout: [] }));
        getComponents?.();
      } else {
        // dispatch(applicationStateChange({ layoutsDetails: res, activeUpdatedLayout: [] }));
        getComponents?.();
      }
      dispatch(applicationStateChange({ isConfigurationOpen: false, activeComponent: {} }));
      return res;
    })
    .catch((error) => {
      if (!isFromAppCreationPrompt) {
        setPointerEvent(false);
        updatePostLoader(false);
      }
      const errorData = get(error, ['response', 'data', 'errors', 0], {});
      if (errorData?.type === 'someone_editing') {
        updateSomeoneIsEditingPopover(error.response.data.errors[0].message, dispatch);
        return Promise.resolve();
      }
      if (
        errorData?.field === CREATE_APP_STRINGS(translate).APP_NAME.ID &&
        errorData.type === VALIDATION_ERROR_TYPES.EXIST
      ) {
        let { errorList = {} } = cloneDeep(
          store.getState()?.ApplicationReducer?.activeAppData,
        );
        errorList = {
          ...errorList,
          name: CREATE_APP_STRINGS(translate).APP_NAME.EXIST_ERROR,
        };
        dispatch(
          applicationDataChange({
            errorList: errorList,
          }),
        );
      }
      return Promise.resolve();
    });
};

export const savePageApiThunk = (params, componentSaveParams, translate) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  savePage(params)
    .then((res) => {
        setPointerEvent(false);
        updatePostLoader(false);
        dispatch(
          saveComponentApiThunk(
            { ...componentSaveParams, page_id: res?._id },
            translate,
          ),
        );
    })
    .catch((error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      const errorData = get(error, ['response', 'data', 'errors', 0], {});
      if (errorData?.type === 'someone_editing') {
        updateSomeoneIsEditingPopover(error.response.data.errors[0].message, dispatch);
        return Promise.resolve();
      }
      if (errorData?.field === CREATE_APP_STRINGS(translate).APP_NAME.ID && errorData.type === VALIDATION_ERROR_TYPES.EXIST) {
          let { errorList = {} } = cloneDeep(store.getState()?.ApplicationReducer?.activeAppData);
          errorList = {
            ...errorList,
            name: CREATE_APP_STRINGS(translate).APP_NAME.EXIST_ERROR,
          };
          dispatch(
            applicationDataChange({
              errorList: errorList,
            }),
          );
        }
        return Promise.resolve();
      });
  };

export const getComponentDetailsByApiThunk = (componentId, t) => (dispatch) => {
  getComponentById(componentId)
    .then((res) => {
      if (!isEmpty(res)) {
        const document = [];
        const { document_url_details = [], component_info } = cloneDeep(res);
        document_url_details && document_url_details.forEach((eachDocument) => {
          if (component_info && component_info.image_id === eachDocument.document_id) {
            document.push(eachDocument);
          }
        });
        const documentFieldValue = [];
        document.forEach((eachDocument) => {
          if (eachDocument && eachDocument.original_filename) {
            documentFieldValue.push(
              {
                ref_uuid: eachDocument.original_filename.ref_uuid,
                fileName: getFileNameFromServer(eachDocument.original_filename),
                link: eachDocument.signedurl,
                id: eachDocument.document_id,
                file: {
                  name: getFileNameFromServer(eachDocument.original_filename),
                  type: eachDocument.original_filename.content_type,
                  url: eachDocument.signedurl,
                  size: eachDocument.original_filename.file_size,
                },
                url: eachDocument.signedurl,
                status: FILE_UPLOAD_STATUS.SUCCESS,
                fileId: eachDocument.document_id,
                newDocument: false,
              },
            );
          }
        });

        const componentData = cloneDeep(res);
        if (res?.type === APP_COMPONENT_TYPE.IMAGE && componentData?.component_info) {
          componentData.component_info.document_details = {
            documents: documentFieldValue,
            ref_uuid: documentFieldValue?.[0]?.ref_uuid,
            removed_doc_list: [],
          };
        }

        if (res?.type === APP_COMPONENT_TYPE.LINK && componentData?.component_info) {
          if (!isEmpty(get(res, ['component_info', 'read_preference_data', 'flow_metadata'], [])) ||
          !isEmpty(get(res, ['component_info', 'read_preference_data', 'data_list_metadata'], []))) {
            componentData?.component_info?.links?.forEach((link, linkIndex) => {
              if (link?.type === LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[1].value) {
                const metadataIndex = get(res,
                  ['component_info', 'read_preference_data', 'flow_metadata'],
                  [])?.findIndex((flow) => flow.flow_uuid === link?.source_uuid);
                if (metadataIndex > -1) {
                  componentData.component_info.links[linkIndex].source_name =
                  get(res,
                    ['component_info', 'read_preference_data', 'flow_metadata', metadataIndex],
                    {})?.flow_name;
                }
              } else if (link?.type === LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[2].value) {
                const metadataIndex = get(res,
                  ['component_info', 'read_preference_data', 'data_list_metadata'],
                  [])?.findIndex((datalist) => datalist.data_list_uuid === link?.source_uuid);
                if (metadataIndex > -1) {
                  componentData.component_info.links[linkIndex].source_name =
                  get(res,
                    ['component_info', 'read_preference_data', 'data_list_metadata', metadataIndex],
                    [])?.data_list_name;
                }
              }
            });
          }
        }

        dispatch(
          applicationStateChange({
            isConfigurationOpen: true,
            activeComponent: componentData,
          }),
        );
      }
    })
    .catch((err) => {
      if (err?.code === ERR_CANCELED) return;
      console.log('Get all apps list failed', err);
      dispatch(
        appListDataChange({
          isAppListLoading: false,
        }),
      );
    });
};

export const getAllFlowForSystemDirectory = (params) => (dispatch) => {
  dispatch(systemDirectoryDataChange({ loading: true }));
  getAllFlowCategoryApiService(params, APP_MODE.USER).then((res) => {
    dispatch(systemDirectoryDataChange({ loading: false, data: res.all_flow_details }));
  }).catch((err) => {
    console.log('ERROR getAllFlowForSystemDirectory', err);
    dispatch(systemDirectoryDataChange({ loading: false, data: [] }));
  });
};

export const getAllDataListsForSystemDirectory = (params) => (dispatch) => {
  dispatch(systemDirectoryDataChange({ loading: true }));
  getAllDataListCategoryApiService(params, APP_MODE.USER).then((res) => {
    dispatch(systemDirectoryDataChange({ loading: false, data: res.all_data_list_details }));
  }).catch((err) => {
    console.log('ERROR getAllDataListsForSystemDirectory', err);
    dispatch(systemDirectoryDataChange({ loading: false, data: [] }));
  });
};

export const getAllAppTeamsForSystemDirectory = (params) => (dispatch) => {
  dispatch(systemDirectoryDataChange({ loading: true }));
  if (cancelForAllTeams) cancelForAllTeams();
  getAllTeamApiService(params, getCancelTokenForAllTeams).then((res) => {
    dispatch(systemDirectoryDataChange({ loading: false, data: res?.pagination_data }));
  }).catch(() => {
    dispatch(systemDirectoryDataChange({ loading: false, data: [] }));
  });
};

export const deleteComponentApiThunk = (params, getComponentCallback) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  deleteComponentApi(params)
  .then((res) => {
    if (res) {
      showToastPopover('Component Deleted Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);
      getComponentCallback();
      dispatch(applicationStateChange({ isConfigurationOpen: false, activeComponent: {} }));
    }
  })
  .catch((err) => {
    setPointerEvent(false);
    updatePostLoader(false);
    console.log('delete component api failed', err);
  });
};

export const updatePageOrderApiThunk = (params, getPages) => () => {
  setPointerEvent(true);
  updatePostLoader(true);
  udpateOrderApi(params)
  .then((res) => {
    if (res) {
      getPages();
    }
  })
  .catch((err) => {
    setPointerEvent(false);
    updatePostLoader(false);
    console.log('update page order api failed', err);
  });
};

export const getFreqUsedApiThunk = () => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  getSortedViewFlowApi()
  .then((res) => {
    setPointerEvent(false);
    updatePostLoader(false);
    if (!isEmpty(res)) {
      const freqFormat = res?.map((freq) => {
        return {
          ...freq,
          hovered: false,
          icon: FaqStackIcon,
        };
      });
      dispatch(applicationStateChange({ FreqUsed: freqFormat }));
    }
  })
  .catch((err) => {
    setPointerEvent(false);
    updatePostLoader(false);
    console.log('freq used api failed', err);
  });
};

export const postVerifyWebpageEmbedUrlApiThunk = (url) => () =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    postVerifyWebpageEmbedUrlApi(url)
      .then((res) => {
        setPointerEvent(false);
        updatePostLoader(false);
        resolve(res.url);
      })
      .catch((err) => {
        setPointerEvent(false);
        updatePostLoader(false);
        reject(err);
      });
  });

export const updateAppHeaderApiThunk = (params, callBack) => () => {
  setPointerEvent(true);
  updatePostLoader(true);
  updateAppHeaderApi(params)
  .then((res) => {
    setPointerEvent(false);
    updatePostLoader(false);
    callBack?.();
    console.log('update app header', res);
  })
  .catch((err) => {
    setPointerEvent(false);
    updatePostLoader(false);
    console.log('update app header api failed', err);
  });
};

export const updateAppOrderApiThunk = (params, t, closeModal) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  updateAppOrderApi(params)
  .then((res) => {
    setPointerEvent(false);
    updatePostLoader(false);
    dispatch(applicationStateChange({ appOrder: res }));
    closeModal?.();
    showToastPopover(
      APPLICATION_STRINGS(t).ERROR_VALIDATION.ORDER_SUCCESS,
      EMPTY_STRING,
      FORM_POPOVER_STATUS.SUCCESS,
      true,
    );
  })
  .catch(() => {
    setPointerEvent(false);
    updatePostLoader(false);
    showToastPopover(
      APPLICATION_STRINGS(t).ERROR_VALIDATION.ORDER_FAILED,
      EMPTY_STRING,
      FORM_POPOVER_STATUS.SERVER_ERROR,
      true,
    );
  });
};

export const getAllTeamsAppDataThunk = (params, isAllDeveloper) => (dispatch) =>
  new Promise((resolve, reject) => {
    getAllTeamApiService(params)
      .then((response) => {
        if (!jsUtility.isEmpty(response)) {
          if (isAllDeveloper) {
            const allDeveloperTeam = { ...response?.pagination_data?.[0], label: response?.pagination_data?.[0]?.teamName, team_name: response?.pagination_data?.[0]?.teamName, name: response?.pagination_data?.[0]?.teamName, is_user: false };
            dispatch(applicationStateChange({ allDeveloperTeam }));
          }
          resolve(response);
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
