import { store } from '../../Store';
import { ERR_CANCELED } from '../../utils/ServerConstants';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { updateErrorPopoverInRedux, setPointerEvent, updatePostLoader, CancelToken } from '../../utils/UtilityFunctions';
import { ML_MODELS_LIST, ML_MODEL_DETAIL, ML_MODEL_FLOW_LIST } from './ActionConstants';
import { GET_ML_MODEL_REPONSE_STRING } from '../../containers/ml_models/MlModels.constants';
import {
  getModelListApi,
  getModelDetailsApi,
  postCallModelApi,
  getMLModelFlowList,
} from '../../axios/apiService/mlModel.apiService';
import { cloneDeep, get } from '../../utils/jsUtility';

const flowListCancelToken = new CancelToken();

export const getModelListSuccess = (data) => {
  return {
    type: ML_MODELS_LIST.SUCCESS,
    payload: { modelList: data, isDataLoading: false },
  };
};

const getModelListStarted = () => {
  return {
    type: ML_MODELS_LIST.STARTED,
    payload: { isDataLoading: true },
  };
};

const getModelListFailure = (common_server_error) => {
  return {
    type: ML_MODELS_LIST.FAILURE,
    payload: { common_server_error },
  };
};

const getModelDetailsSuccess = (data) => {
  return {
    type: ML_MODEL_DETAIL.SUCCESS,
    payload: { modelData: data, isModelDetailLoading: false },
  };
};

const getModelDetailsFailure = (common_server_error) => {
  return {
    type: ML_MODEL_DETAIL.FAILURE,
    payload: { common_server_error },
  };
};
const getModelDetailsApiStarted = () => {
  return {
    type: ML_MODEL_DETAIL.STARTED,
    payload: { isModelDetailLoading: true },
  };
};
const updateMLModelDetail = (data) => {
  return {
    type: ML_MODEL_DETAIL.UPDATED,
    payload: { outputResponseData: data, isDataLoadingOnTryIt: false, common_server_error: {} },
  };
};

const updateMLModelDetailFailure = (common_server_error) => {
  return {
    type: ML_MODEL_DETAIL.UPDATED,
    payload: { ...common_server_error, isDataLoadingOnTryIt: false },
  };
};
export const updateMlModelDetailStarted = () => {
  return {
    type: ML_MODEL_DETAIL.UPDATED,
    payload: { outputResponseData: null, isDataLoadingOnTryIt: true },
  };
};

export const getFlowListApiStarted = () => {
  return {
    type: ML_MODEL_FLOW_LIST.STARTED,
    payload: { isLoading: true },
  };
};

export const getFlowListApiSuccess = (data) => {
  return {
    type: ML_MODEL_FLOW_LIST.SUCCESS,
    payload: data,
  };
};

export const getFlowListApiFailure = () => {
  return {
    type: ML_MODEL_FLOW_LIST.FAILURE,
    payload: { isLoading: false },
  };
};

export const resetFlowList = () => {
  return {
    type: ML_MODEL_FLOW_LIST.UPDATED,
    payload: {
      appList: [],
      isLoading: false,
      totalCount: 0,
      pagination_details: {},
      hasMore: false,
    },
  };
};

export const getModelListThunk = (data) => (dispatch) => {
  dispatch(getModelListStarted());
  return new Promise((resolve, reject) => {
    getModelListApi(data)
      .then((response) => {
        if (response) {
          dispatch(getModelListSuccess(response));
          resolve(response);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(getModelListFailure({ ...errors.common_server_error }));
          resolve(errors);
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(getModelListFailure({ ...errors.common_server_error }));
        updateErrorPopoverInRedux(GET_ML_MODEL_REPONSE_STRING.FAILURE, errors.common_server_error);
        setPointerEvent(false);
        updatePostLoader(false);
        reject(error);
      });
  });
};

export const getModelDetailsThunk = (data) => (dispatch) => {
  dispatch(getModelDetailsApiStarted());
  return new Promise((resolve, reject) => {
    getModelDetailsApi(data)
      .then((response) => {
        if (response) {
          dispatch(getModelDetailsSuccess(response));
          resolve(response);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(getModelDetailsFailure({ ...errors.common_server_error }));
          resolve(errors);
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(getModelDetailsFailure({ ...errors.common_server_error }));
        updateErrorPopoverInRedux(GET_ML_MODEL_REPONSE_STRING.FAILURE, errors.common_server_error);
        reject(error);
      });
  });
};

export const getMLModelOutputResponseThunk = (params) => (dispatch) => {
  dispatch(updateMlModelDetailStarted());
  postCallModelApi(params)
    .then((response) => {
      if (response) {
        dispatch(updateMLModelDetail(response));
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(getModelDetailsFailure({ ...errors.common_server_error }));
      }
    })
    .catch((error) => {
      const errors = generateGetServerErrorMessage(error);
      dispatch(updateMLModelDetailFailure(errors));
      updateErrorPopoverInRedux(GET_ML_MODEL_REPONSE_STRING.FAILURE, error?.response?.data?.errors);
    });
};

export const getMLFlowListApiThunk = (params) => (dispatch) => {
  dispatch(getFlowListApiStarted());
  getMLModelFlowList(params, flowListCancelToken)
    .then((response) => {
      const { flowListParams } = cloneDeep(store.getState().MlModelListReducer);
      const { flowList = [] } = flowListParams;
      const newFlowList = response?.pagination_data
        ? response?.pagination_data
        : [];
      if (response?.pagination_data) {
        let updatedFlowList = newFlowList;
        if (get(response, ['pagination_details', 0, 'page'], 0) > 1) {
          updatedFlowList = [...flowList, ...newFlowList];
        }

        const paginationDetail = get(response, ['pagination_details', 0], {});
        dispatch(
          getFlowListApiSuccess({
            flowList: updatedFlowList,
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
        getFlowListApiFailure(),
      );
    });
};
