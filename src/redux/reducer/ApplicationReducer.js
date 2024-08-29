import { createAction, createReducer } from '@reduxjs/toolkit';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { APP_LIST_SORT_FIELD_KEYS } from '../../containers/application/app_listing/AppList.constants';
import { APPLICATION } from '../actions/ActionConstants';

const initState = {
  apps: [],
  appListParams: {
    appList: [],
    isLoading: false,
    totalCount: 0,
    pagination_details: {},
    hasMore: false,
    selectedTab: 0,
    sortBy: -1,
    sortName: 'Published On (DESC)',
    sortField: APP_LIST_SORT_FIELD_KEYS.LAST_UPDATED_ON,
  },
  activeAppData: {
    inheritAppSecurity: false,
    pages: [],
    activePageData: {
      page_id: EMPTY_STRING,
      page_uuid: EMPTY_STRING,
      name: EMPTY_STRING,
      url_path: EMPTY_STRING,
      viewers: {
        users: [],
        teams: [],
      },
      order: 1,
      activeComponentData: {},
      errorList: {},
    },
    currentPageConfig: {
      viewers: {
        users: [],
        teams: [],
      },
      url_path: EMPTY_STRING,
      name: EMPTY_STRING,
      inheritFromApp: true,
      order: 1,
      errorList: {},
      page_id: EMPTY_STRING,
      page_uuid: EMPTY_STRING,
      isPageSettingsModelOpen: false,
    },
    isCreateAppModalOpen: false,
    isBasicSettingsModalOpen: false,
    isSecuritySettingsModalOpen: false,
    isPublishModalOpen: false,
    isAppDetailsLoading: false,
    name: EMPTY_STRING,
    description: EMPTY_STRING,
    url_path: EMPTY_STRING,
    admins: {
      users: [],
      teams: [],
    },
    viewers: {
      users: [],
      teams: [],
    },
    errorList: {},
    closeInstructionMessage: false,
  },
  usersAndTeamsData: {
    usersAndTeams: [],
    users: [],
    usersPage: 1,
    usersAndTeamsPage: 1,
    size: 6,
    usersTotalCount: 1,
    usersAndTeamsTotalCount: 1,
  },
  allFlowsData: {
    allFlows: [],
    total_count: 0,
    page: 1,
    isLoading: false,
  },
  allDataListsData: {
    allDataLists: [],
    total_count: 0,
    page: 1,
  },
  server_error: {},
  error_list_config: {},
  pages: [],
  customizedPagesData: [],
  errorPerPageComp: {},
  current_page_id: EMPTY_STRING,
  isConfigurationOpen: false,
  isComponentError: false,
  componentIndex: EMPTY_STRING,
  pageIndex: EMPTY_STRING,
  activeComponent: { label: EMPTY_STRING, component_info: { type: EMPTY_STRING } },
  activeTextCompElementText: EMPTY_STRING,
  layoutsDetails: [],
  isComponentLoading: false,
  systemDirectory: {
    loading: true,
    data: [],
  },
  activeUpdatedLayout: [],
  FreqUsed: [],
  customPageSecurity: false,
  hideClosePopper: false,
  deleteAnyWayPopper: {
    full_name: EMPTY_STRING,
    isCurrentUserDelete: false,
    isAnywayVisible: false,
    currentUserMessage: EMPTY_STRING,
  },
  homeTaskCompLoading: false,
  isPageTaskLoading: false,
  appOrder: {
    isAppOrderLoading: false,
    details: [],
  },
  allDeveloperTeam: {},
};

export const appDeleteAnywayInitial = createAction(
  APPLICATION.APPLICATION_DELETE_ANYWAY_RESET,
);

export const appListDataChange = createAction(
  APPLICATION.APPLICATION_LIST_DATA_CHANGE,
  (data) => {
    return {
      payload: data,
    };
  },
);

export const applicationDataChange = createAction(
  APPLICATION.APPLICATION_DATA_CHANGE,
  (data) => {
    return {
      payload: data,
    };
  },
);

export const applicationDataClear = createAction(
  APPLICATION.APPLICATION_DATA_CLEAR,
  (data) => {
    return {
      payload: data,
    };
  },
);
export const applicationClear = createAction(
  APPLICATION.APPLICATION_CLEAR,
);

export const applicationPageSettingClear = createAction(
  APPLICATION.APPLICATION_PAGE_SETTING_CLEAR,
);

export const applicationStateChange = createAction(
  APPLICATION.APPLICATION_STATE_CHANGE,
  (data) => {
    return {
      payload: data,
    };
  },
);

export const applicationComponentDataChange = createAction(
  APPLICATION.COMPONENT_DATA_CHANGE,
  (data) => {
    return {
      payload: data,
    };
  },
);

export const applicationPageConfigChange = createAction(
  APPLICATION.CONFIG_DATA_CHANGE,
  (data) => {
    return {
      payload: data,
    };
  },
);

export const systemDirectoryDataChange = createAction(
  APPLICATION.SYSTEM_DIRECTORY_STATE_CHANGE,
  (data) => {
    return {
      payload: data,
    };
  },
);

export const resetAppListing = createAction(
  APPLICATION.RESET_APP_LISTING,
);

export const setApplicationActiveComponentDataChange = createAction(
  APPLICATION.APP_ACTIVE_COMPONENT_DATA_CHANGE,
  (data) => {
    return {
      payload: data,
    };
  },
);

const ApplicationReducer = createReducer(initState, (builder) => {
  builder
  .addCase(appDeleteAnywayInitial, (state) => {
    return {
      ...state,
      deleteAnyWayPopper: {
        full_name: EMPTY_STRING,
        isCurrentUserDelete: false,
        isAnywayVisible: false,
        currentUserMessage: EMPTY_STRING,
      },
    };
  })
    .addCase(applicationStateChange, (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    })
    .addCase(appListDataChange, (state, action) => {
      state.appListParams = {
        ...state.appListParams,
        ...action.payload,
      };
    })
    .addCase(applicationDataChange, (state, action) => {
      state.activeAppData = {
        ...state.activeAppData,
        ...action.payload,
      };
    })
    .addCase(applicationComponentDataChange, (state, action) => {
      return {
        ...state,
        activeAppData: {
          ...state.activeAppData,
          activePageData: {
            ...state?.activeAppData?.activePageData,
            ...action.payload,
          },
        },
      };
    })
    .addCase(applicationPageConfigChange, (state, action) => {
      return {
        ...state,
        activeAppData: {
          ...state.activeAppData,
          currentPageConfig: {
            ...state?.activeAppData?.currentPageConfig,
            ...action.payload,
          },
        },
      };
    })
    .addCase(applicationPageSettingClear, (state) => {
      return {
        ...state,
        activeAppData: {
          ...state.activeAppData,
          currentPageConfig: initState.activeAppData.currentPageConfig,
        },
      };
    })
    .addCase(applicationDataClear, (state) => {
      state.activeAppData = initState.activeAppData;
    })
    .addCase(setApplicationActiveComponentDataChange, (state, action) => {
      console.log('getAppsAllFlows success change', action);
      state.activeComponent = action.payload;
    })
    .addCase(systemDirectoryDataChange, (state, action) => {
      return {
        ...state,
        systemDirectory: {
          ...action.payload,
        },
      };
    })
  .addCase(resetAppListing, (state) => {
    return {
       ...state,
       appListParams: {
        appList: [],
        isLoading: false,
        totalCount: 0,
        pagination_details: {},
        hasMore: false,
      },
    };
  })
  .addCase(applicationClear, () => initState);
});
export default ApplicationReducer;
