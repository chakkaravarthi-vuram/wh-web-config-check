import { INITIAL_PAGE } from 'utils/constants/form.constant';
import { translate } from 'language/config';
import LOOK_UP_MANAGEMENT_STRINGS from 'containers/admin_settings/look_up_management/LookUpManagement.strings';
import {
  editLookup,
  getLookupList,
  addNewLookup,
} from '../../axios/apiService/lookUp.apiService';
import {
  generateApiErrorsAndHandleCatchBlock,
  setPointerEvent,
  showToastPopover,
  updatePostLoader,
} from '../../utils/UtilityFunctions';
import {
  addNewLookupFailureAction,
  addNewLookupStartedAction,
  addNewlookUpStateChangeAction,
  addNewLookupSuccessAction,
  toggleAddNewLookupModalVisibility,
} from '../reducer/LookUpReducer';
import { store } from '../../Store';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';
import { isNull, translateFunction } from '../../utils/jsUtility';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export const getLookupListApiThunk = (params, isPaginatedData = false, isSearch = false, t = translateFunction) => (dispatch) => {
  let params_ = params;
  if (isPaginatedData) {
    dispatch(addNewlookUpStateChangeAction({ islookUpListInfiniteScrollLoading: true }));
    params_ = {
      ...params,
      page: (isSearch === true) ? INITIAL_PAGE : params.page + 1,
      size: params.size,
    };
  } else dispatch(addNewLookupStartedAction());
  console.log('PARAMS get', params_, isPaginatedData);
  getLookupList(params_)
    .then((response) => {
      if (!isNull(response)) {
        response = { ...response, isPaginated: isPaginatedData };
        dispatch(addNewLookupSuccessAction(response));
      } else {
        console.log('coneterawer else');
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(addNewLookupFailureAction(errors.common_server_error));
      }
    })
    .catch((error) => {
      const { server_error } = store.getState().LookUpReducer;
      const labels = { [LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_NAME.ID]: t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_NAME.LABEL) };
      console.log('coneterawer action 2nd', server_error, error);
      const errorData = {
        error,
        server_error,
        labels,
      };
      const apiFailureAction = {
        dispatch,
        action: addNewLookupFailureAction,
      };
      const errors = generateApiErrorsAndHandleCatchBlock(
        errorData,
        apiFailureAction,
        false,
        true,
      );
      console.log('errors', errors);
    });
};

export const addNewLookUpApiThunk = (data, t = translateFunction) => (dispatch) => {
  dispatch(addNewLookupStartedAction());
  setPointerEvent(true);
  updatePostLoader(true);
  addNewLookup(data)
    .then((response) => {
      console.log('lookup action 1st', response);
      setPointerEvent(false);
      updatePostLoader(false);
      if (response) {
        const { lookUpListCurrentPage, lookUpListDataCountPerCall } = store.getState().LookUpReducer;
        const params = {
          page: lookUpListCurrentPage,
          size: lookUpListDataCountPerCall,
        };
        dispatch(toggleAddNewLookupModalVisibility());
        dispatch(getLookupListApiThunk(params, false));
        showToastPopover(
          translate('error_popover_status.lookup_added'),
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        console.log('coneterawer action error', errors.common_server_error);
        dispatch(addNewLookupFailureAction(errors.common_server_error));
      }
    })
    .catch((error) => {
      const { server_error } = store.getState().LookUpReducer;
      const labels = { [LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_NAME.ID]: t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_NAME.LABEL) };
      console.log('coneterawer action 2nd', server_error, error);
      const errorData = {
        error,
        server_error,
        labels,
      };
      const apiFailureAction = {
        dispatch,
        action: addNewLookupFailureAction,
      };
      console.log('coneterawer action 2nd', server_error, error);
      const errors = generateApiErrorsAndHandleCatchBlock(
        errorData,
        apiFailureAction,
        false,

        true,
      );
      console.log('coneterawer action 2nd1', errors);
      addNewlookUpStateChangeAction({ isError: true });
    });
};

export const editLookUpApiThunk = (data, t = translateFunction) => (dispatch) => {
  dispatch(addNewLookupStartedAction());
  setPointerEvent(true);
  updatePostLoader(true);
  editLookup(data)
    .then((response) => {
      console.log('lookup action 1st', response);
      setPointerEvent(false);
      updatePostLoader(false);
      if (response) {
        const { lookUpListCurrentPage, lookUpListDataCountPerCall } = store.getState().LookUpReducer;
        const params = {
          page: lookUpListCurrentPage,
          // size: Math.min(params.size, remainingDataCount),
          size: lookUpListDataCountPerCall,
        };
        dispatch(toggleAddNewLookupModalVisibility());
        dispatch(getLookupListApiThunk(params, false));
        showToastPopover(
          translate('error_popover_status.lookup_ended'),
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        console.log('coneterawer action error', errors.common_server_error);
        dispatch(addNewLookupFailureAction(errors.common_server_error));
      }
    })
    .catch((error) => {
      const { server_error } = store.getState().LookUpReducer;
      const labels = { [LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_NAME.ID]: t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_NAME.LABEL) };
      console.log('coneterawer action 2nd', server_error, error);
      const errorData = {
        error,
        server_error,
        labels,
      };
      const apiFailureAction = {
        dispatch,
        action: addNewLookupFailureAction,
      };
      console.log('coneterawer action 2nd', server_error, error);
      const errors = generateApiErrorsAndHandleCatchBlock(
        errorData,
        apiFailureAction,
        false,

        true,
      );
      console.log('coneterawer action 2nd1', errors);
      addNewlookUpStateChangeAction({ isError: true });
    });
};

export default addNewLookUpApiThunk;
