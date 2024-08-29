import { useRef, useCallback, useReducer, useLayoutEffect } from 'react';
import { API_STATUS } from 'redux/actions/ActionConstants';
import jsUtils from 'utils/jsUtility';

function useDispatchWrapper(dispatch) {
  const mountedRef = useRef(false);
  useLayoutEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return useCallback(
    (...args) => (mountedRef.current ? dispatch(...args) : null),
    [dispatch],
  );
}

function apiReducer(state, action) {
  switch (action.type) {
    case API_STATUS.STARTED: {
      return { ...state, status: API_STATUS.STARTED, error: null };
    }
    case API_STATUS.SUCCESS: {
      let dispatchData;
      if (action.paginationDetails) {
        if (jsUtils.get(action.paginationDetails, ['page'], 1) > 1) {
          dispatchData = {
            data: [
              ...(!jsUtils.isEmpty(state.data) ? state.data : []),
              ...jsUtils.get(action, ['data'], []),
            ],
            paginationDetails: action.paginationDetails,
          };
        } else {
          dispatchData = {
            paginationDetails: action.paginationDetails,
            data: action.data,
          };
        }
      } else {
        dispatchData = {
          data: {
            ...state.data,
            ...action.data,
          },
          error: null,
        };
      }
      return { status: API_STATUS.SUCCESS, ...dispatchData, error: null };
    }
    case API_STATUS.FAILURE: {
      return { ...state, status: API_STATUS.FAILURE, error: action.error };
    }
    case 'CLEAR': {
      return { ...action.payload };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function useApiCall(initialState, isPaginated, normalizer) {
  const [state, useDispatch] = useReducer(apiReducer, {
    status: null,
    data: [],
    ...(isPaginated ? { paginationDetails: {} } : {}),
    error: null,
    ...initialState,
  });

  const dispatch = useDispatchWrapper(useDispatch);

  const clearData = () => dispatch({ type: 'CLEAR', payload: { ...initialState } });
  const { data, error, status } = state;
  let paginationDetails = null;
  if (isPaginated) paginationDetails = state.paginationDetails;

  const fetch = useCallback(
    (promise, callBackFn = null) => {
      dispatch({ type: API_STATUS.STARTED });
      promise.then(
        (response) => {
          if (isPaginated) {
            let dispatchData = [
              ...jsUtils.get(response, ['pagination_data'], []),
            ];
            if (normalizer) {
              dispatchData = normalizer(dispatchData);
            }
            if (jsUtils.get(response, ['pagination_details', 0, 'page'], 1) > 1) {
              const responsePaginationDetails = jsUtils.get(response, ['pagination_details', 0], {});

              return dispatch({ type: API_STATUS.SUCCESS, data: dispatchData, paginationDetails: responsePaginationDetails });
            }
            callBackFn && callBackFn(jsUtils.get(response, ['pagination_data']));
            return dispatch(
              {
                type: API_STATUS.SUCCESS,
                paginationDetails: jsUtils.get(response, ['pagination_details', 0], {}),
                data: dispatchData,
              },
            );
          }
          return dispatch({ type: API_STATUS.SUCCESS, data: response });
        },
        (error) => {
          dispatch({ type: API_STATUS.FAILURE, error });
        },
      );
    },
    [dispatch],
  );
  return {
    error,
    status,
    isLoading: status === API_STATUS.STARTED,
    data,
    paginationDetails,
    clearData,
    fetch,
    page: paginationDetails?.page || 0,
    hasMore: data?.length < paginationDetails?.total_count,
  };
}

export default useApiCall;
