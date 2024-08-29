import { getDefaultValueRuleOperator, getExternalFields } from '../../axios/apiService/defaultValueRule.apiService';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { DEFAULT_VALUE_RULE_CONSTANTS, EXTERNAL_FIELD_VALUES_CONSTANTS } from './ActionConstants';

const defaultValueRuleOperatorStarted = () => {
  return { type: DEFAULT_VALUE_RULE_CONSTANTS.STARTED };
};

export const defaultValueRuleOperatorSuccess = (response) => {
  return { type: DEFAULT_VALUE_RULE_CONSTANTS.SUCCESS, response };
};

const defaultValueRuleOperatorFailure = (error) => {
  return { type: DEFAULT_VALUE_RULE_CONSTANTS.FAILURE, error };
};

export const defaultValueRuleOperatorClear = () => {
  return { type: DEFAULT_VALUE_RULE_CONSTANTS.CLEAR };
};

const externalFieldStarted = () => {
  return { type: EXTERNAL_FIELD_VALUES_CONSTANTS.STARTED };
};

const externalFieldsSuccess = (response) => {
  return { type: EXTERNAL_FIELD_VALUES_CONSTANTS.SUCCESS, response };
};
export const externalFieldsDataChange = (response) => {
  return { type: EXTERNAL_FIELD_VALUES_CONSTANTS.DATA_CHANGE, response };
};

const externalFieldsFailure = (error) => {
  return { type: EXTERNAL_FIELD_VALUES_CONSTANTS.FAILURE, error };
};

export const externalFieldsClear = () => {
  return { type: EXTERNAL_FIELD_VALUES_CONSTANTS.CLEAR };
};

export const defaultValueRuleOperatorThunk = (fieldType) => (dispatch) => new Promise((resolve) => {
  const params = { field_types: [fieldType] };
  dispatch(defaultValueRuleOperatorStarted());
  getDefaultValueRuleOperator(params).then((response) => {
    dispatch(defaultValueRuleOperatorSuccess(response));
    resolve(response);
  }, (error) => {
    dispatch(defaultValueRuleOperatorFailure(generateGetServerErrorMessage(error)));
    resolve(false);
  });
});

export const externalFieldsThunk = (paginationDetails, allowedFields, id, { isTaskForm, isDataListForm }) => (dispatch) => new Promise((resolve) => {
  let params;
  if (isTaskForm) {
    params = { ...paginationDetails, allowed_field_types: [...allowedFields], task_metadata_id: id };
  } else if (isDataListForm) {
    params = { ...paginationDetails, allowed_field_types: [...allowedFields], data_list_id: id };
  } else {
    params = {
      ...paginationDetails, allowed_field_types: [...allowedFields], flow_id: id, // for api data
    };
  }
  console.log('jhvdsjhkbjasn', params);
  dispatch(externalFieldStarted());
  getExternalFields(params, isTaskForm || isDataListForm).then((response) => {
    dispatch(externalFieldsSuccess(response));
    resolve(response);
  }, (error) => {
    dispatch(externalFieldsFailure(generateGetServerErrorMessage(error)));
    resolve();
  });
});
