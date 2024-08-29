import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { ML_MODELS_LIST, ML_MODEL_DETAIL, ML_MODEL_FLOW_LIST } from '../actions/ActionConstants';

const initialState = {
  isDataLoading: true,
  modelList: [],
  modelListCount: 0,
  listSearchText: EMPTY_STRING,
  isErrorInDataLoading: false,
  modelData: null,
  outputResponseData: null,
  isDataLoadingOnTryIt: false,
  common_server_error: {},
  isModelDetailLoading: false,
  model_details_error: false,
  flowListParams: {
    flowList: [],
    isLoading: false,
    totalCount: 0,
    pagination_details: {},
    hasMore: false,
  },
};

export default function MlModelListReducer(state = initialState, action) {
  switch (action.type) {
    case ML_MODELS_LIST.FAILURE:
      return {
        ...state,
        isDataLoading: false,
      };
    case ML_MODELS_LIST.STARTED:
      return {
        ...state,
        ...action.payload,
        isDataLoading: true,
      };
    case ML_MODELS_LIST.SUCCESS:
      return {
        ...state,
        ...action.payload,
        isDataLoading: false,
      };
    case ML_MODEL_DETAIL.SUCCESS:
      return {
        ...state,
        ...action.payload,
        isModelDetailLoading: false,
      };
    case ML_MODEL_DETAIL.UPDATED:
      return {
        ...state,
        ...action.payload,
      };
    case ML_MODEL_DETAIL.STARTED:
      return {
        ...state,
        ...action.payload,
        isModelDetailLoading: true,
      };
    case ML_MODEL_DETAIL.FAILURE:
      return {
        ...state,
        ...action.payload,
      };
    case ML_MODEL_FLOW_LIST.STARTED:
    case ML_MODEL_FLOW_LIST.SUCCESS:
    case ML_MODEL_FLOW_LIST.FAILURE:
      return {
        ...state,
        flowListParams: {
          ...state.flowListParams,
          ...action.payload,
        },
      };
    case ML_MODEL_FLOW_LIST.UPDATED:
      return {
        ...state,
        flowListParams: {
          ...action.payload,
        },
      };
    default:
      return state;
  }
}
