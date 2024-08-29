import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { ACTION_CONSTANTS, DATA_LIST_CONSTANTS } from './ExternalSource.constants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

const ExternalSourceContext = createContext();

export const externalSourceDataChange = (data) => {
  return {
    type: ACTION_CONSTANTS.EXTERNAL_SOURCE_DATA_CHANGE,
    payload: data,
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.EXTERNAL_SOURCE_DATA_CHANGE:
      return {
        ...state,
        ...action?.payload,
      };
    default:
      return state;
  }
};

const INTEGRATION_DATA = {
  selectedConnector: {},
  connectorUuid: null,
  selectedEvent: {},
  eventUuid: null,
  relativePath: [],
  queryParams: [],
  isLoadingIntegrationDetail: true,
  isErrorInIntegrationDetail: false,
};

const DATA_LIST_DATA = {
  selectedDataList: {},
  dataListUuid: null,
  dataListName: null,
  filter: {},
  queryResult: DATA_LIST_CONSTANTS.QUERY_RESULT.MULTIPLE_VALUE,
  distinctField: null,
};

export const INITIAL_STATE = {
  selectedExternalSource: null,
  ruleName: EMPTY_STRING,
  ruleType: EMPTY_STRING,
  ruleId: null,
  ruleUuid: null,
  taskMetaDataId: null,
  flowId: null,
  dataListId: null,
  isRuleDetailsLoading: true,
  ruleDataListId: null,

  isIntegrationListLoading: false,
  integrationList: [],
  integrationListHasMore: false,
  integrationListTotalCount: 0,
  integrationListPaginationDetails: {},
  integrationListErrorList: {},
  integrationListCurrentPage: 1,

  isEventListLoading: false,
  eventList: [],
  eventListHasMore: false,
  eventListTotalCount: 0,
  eventListPaginationDetails: {},
  eventListErrorList: {},
  eventListCurrentPage: 1,

  isFieldListLoading: false,
  fieldList: [],
  fieldListHasMore: false,
  fieldListTotalCount: 0,
  fieldListPaginationDetails: {},
  fieldListErrorList: {},
  fieldListCurrentPage: 1,

  isDataListLoading: false,
  dataList: [],
  dataListHasMore: false,
  dataListTotalCount: 0,
  dataListPaginationDetails: {},
  dataListErrorList: {},
  dataListCurrentPage: 1,

  isDLFieldListLoading: false,
  dlFieldList: [],
  dlFieldListHasMore: false,
  dlFieldListTotalCount: 0,
  dlFieldListPaginationDetails: {},
  dlFieldListErrorList: {},
  dlFieldListCurrentPage: 1,

  outputFormat: [],

  errorList: {},
  outputFormatErrorList: {},
  type: DATA_LIST_CONSTANTS.QUERY_TYPE.ALL,
  sortOrder: 1,
  sortField: null,
  isLimitFields: false,

  // Sub Table Query
  fieldListForTableSubQuery: [],
  tableUUID: null,
  // integration data
  ...INTEGRATION_DATA,

  // datalist data
  ...DATA_LIST_DATA,
};

function ExternalSourceProvider({ children }) {
  const [state, dispatcher] = useReducer(
    (state, action) => reducer(state, action),
    { ...INITIAL_STATE },
  );

  const dispatch = ({ type, payload }) => {
    dispatcher({ type, payload });
  };

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <ExternalSourceContext.Provider value={contextValue}>
      {children}
    </ExternalSourceContext.Provider>
  );
}

const useExternalSource = () => useContext(ExternalSourceContext);

export { ExternalSourceProvider, useExternalSource };

export default useExternalSource;
