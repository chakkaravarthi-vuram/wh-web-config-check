import { createAction, createReducer } from '@reduxjs/toolkit';
import { INTEGRATION_ACTIONS } from 'redux/actions/ActionConstants';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { INTEGRATION_CONSTANTS } from '../../containers/integration/Integration.constants';

const API_CONFIG_INITIAL_DATA = {
  _id: null,
  api_configuration_uuid: null,
  api_configuration_id: null,
  flow_uuid: null,
  data_list_uuid: null,
  flow_id: null,
  data_list_id: null,
  data_list_name: null,
  flow_name: null,
  api_type: null,
  workhall_api_type: null,
  credentialsList: [],
  disabledCredList: [],
  disabledAdminUsers: [],
  disabledAdminTeams: [],
  allFlows: [],
  allDataLists: [],
  allFields: [],
  selected_authentication_list: [],
  authentication_id: [],
};

const DB_CONNECTION_INITIAL_DATA = {
  _id: null,
  db_connector_uuid: null,
  authentication: {},
  queryList: [],
  queryListSearchText: EMPTY_STRING,
  totalQueryCount: 0,
  remainingQueryCount: 0,
  currentQueryPage: 0,
  hasMoreQuery: false,
  isQueryListLoading: false,
  isErrorInQueryListLoading: false,
  query: {},
  isQueryConfigModelOpen: false,
  allowed_db_types: [],
  db_allowed_options: {},
  table_list: [],
  table_info: [],
  query_data: [],
  query_details: [],
  error_list: {},
  field_error_list: {},
  filter_error_list: {},
};

const EVENTS_LIST_DATA = {
  events_current_page: 1,
  events_page_size: 5,
  events_total_count: 0,
  events_pagination_data: [],
  events_pagination_details: {},
  sortBy: 1,
  sortField: 'category',
};

export const INTEGRATION_DETAILS_INIT_DATA = {
  connector_uuid: null,
  name: EMPTY_STRING,
  description: EMPTY_STRING,
  authentication: {},
  events: [],
  connector_events_count: 0,
  active_event: {},
  error_list: {},
  response_error_list: {},
  selected_connector: null,
  base_url: EMPTY_STRING,
  api_headers: false,
  headers: [],
  api_query_params: false,
  query_params: [],
  isAddEventVisible: false,
  isEventEdit: false,
  selected_template_details: {},
  template_id: null,
  isExternalIntegration: false,
  templateSearhText: EMPTY_STRING,
  isErrorInIntegrationDetail: false,
  dbConnector: DB_CONNECTION_INITIAL_DATA,
  ...API_CONFIG_INITIAL_DATA,
  ...EVENTS_LIST_DATA,
};
const initialState = {
  isBasicDetailsModalOpen: false,
  credentialData: {
    name: EMPTY_STRING,
    description: EMPTY_STRING,
    scope: [],
  },
  scope_labels: [],
  initialCredData: {},
  tab_index: 1,
  template_filter_type: EMPTY_STRING,
  isInvalidUserModalOpen: false,
  initial_template_filter: EMPTY_STRING,
  show_by_value: INTEGRATION_CONSTANTS.API_TYPE.EXTERNAL,
  remainingIntegrationsCount: 0,
  isEditableCredential: false,
  isEditCredentialModalOpen: false,
  totalIntegrationsCount: 0,
  isSingleOauthClicked: false,
  hasMoreIntegrations: false,
  integrationsList: [],
  isCreateCredentialModalOpen: false,
  isLoadingIntegrationsList: true,
  isErrorInLoadingIntegrationsList: false,
  listSearchText: EMPTY_STRING,
  sortType: 'last_updated_on',
  sortBy: -1,
  sortLabel: 'Published On (DESC)',
  remainingTemplatesCount: 0,
  totalTemplatesCount: 0,
  hasMoreTemplates: false,
  integrationsTemplates: [],
  usersAndTeamsData: {
    usersAndTeams: [],
    users: [],
    usersPage: 1,
    usersAndTeamsPage: 1,
    size: 5,
    usersTotalCount: 1,
    usersAndTeamsTotalCount: 1,
  },
  admins: {
    users: [],
    teams: [],
  },
  isLoadingIntegrationsTemplates: false,
  isErrorInLoadingIntegrationsTemplates: false,
  templateSearhText: EMPTY_STRING,
  isCategoryListLoading: true,
  // Workhall API
  workhall_api_method: EMPTY_STRING,
  isAllFlowListLoading: false,
  isAllDataListLoading: false,
  isInitiationActionsLoading: false,
  ...INTEGRATION_DETAILS_INIT_DATA,
  ...EVENTS_LIST_DATA,
};

export const integrationDataChange = createAction(
  INTEGRATION_ACTIONS.INTEGRATION_DATA_UPDATE,
  (payload) => {
    return {
      payload,
    };
  },
);

export const dbConnectorDataChange = createAction(
  INTEGRATION_ACTIONS.DB_CONNECTOR_DATA_UPADTE,
  (payload) => {
    return {
      payload,
    };
  },
);

const IntegrationReducer = createReducer(initialState, (builder) => {
  builder.addCase(integrationDataChange, (state, action) => {
    return {
      ...state,
      ...action.payload,
    };
  });
  builder.addCase(dbConnectorDataChange, (state, action) => {
    return {
      ...state,
      dbConnector: {
        ...state.dbConnector,
        ...action.payload,
      },
    };
  });
});

export default IntegrationReducer;
