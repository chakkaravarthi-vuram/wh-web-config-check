import { getAllDataListFields, getDataListFieldValues } from 'axios/apiService/form.apiService';
import { getVisibilityExternalFieldsData } from 'redux/reducer';
import { store } from 'Store';
import { getVisibilityFieldMetaData } from 'redux/reducer/VisibilityReducer';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import i18next from 'i18next';
import { EToastType, toastPopOver } from '@workhall-pvt-lmt/wh-ui-library';
import { apiGetRuleOperatorsByFieldType } from '../../axios/apiService/flow.apiService';
import jsUtility, { get, findIndex } from '../../utils/jsUtility';

import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { VISIBILITY_CONSTANTS } from './ActionConstants';
import { getRuleDetailsByIdApi, getRulesApi, importRulesApi, removeRuleApi, saveRuleApi } from '../../axios/apiService/rule.apiService';
import { externalSourceUpdateRuleList, fieldDefaultValueDataChange, fieldDefaultValueUpdateRuleList, fieldVisibilityDataChange, fieldVisibilityUpdateRuleList, setDefaultValueActiveRuleError, setVisibilityActiveRuleError } from '../reducer/VisibilityReducer';
import { MODULE_TYPES } from '../../utils/Constants';
import { FIELD_VISIBILITY_STRINGS } from '../../containers/form_configuration/field_visibility/FieldVisibilityRule.strings';
import { BUILDER_TYPES, getDeFormattedConditionalExpression, getSelectedFields, getSelectedTables } from '../../containers/form_configuration/field_visibility/FieldVisibilityRule.utils';
import { EXPRESSION_TYPE, RULE_TYPE } from '../../utils/constants/rule/rule.constant';
import { setFormulaTokenChange } from '../reducer/FormulaBuilderReducer';
import { getDataFromRuleFields, getSelectedOperatorInfo } from '../../utils/rule_engine/RuleEngine.utils';
import { defaultValueRuleOperatorSuccess, externalFieldsDataChange } from './DefaultValueRule.Action';
import { replaceDecodeWithEncodedUUID } from '../../components/formula_builder/formula_tokenizer_utils/formulaBuilder.utils';
import { RESPONSE_FIELD_KEYS } from '../../utils/constants/form/form.constant';
import { SOMEONE_EDITING } from '../../utils/ServerValidationUtils';
import { updateSomeoneIsEditingPopover as updateSomeoneIsEditingPopoverForFlow } from '../../containers/edit_flow/EditFlow.utils';
import { updateSomeoneIsEditingPopover as updateSomeoneIsEditingPopoverForTask } from './CreateTask.Action';
import { updateSomeoneIsEditingPopover as updateSomeoneIsEditingPopoverForDataList } from './CreateDataList.action';
import { setPointerEvent } from '../../utils/loaderUtils';

const externalFieldStarted = (page) => {
  return { type: VISIBILITY_CONSTANTS.EXTERNAL_FIELDS_STARTED, page };
};

const externalFieldsSuccess = (response, isSearch = false) => {
  return {
    type: VISIBILITY_CONSTANTS.EXTERNAL_FIELDS_SUCCESS,
    payload: { response: response, isSearch: isSearch },
  };
};
const externalFieldsFailure = (error) => {
  return { type: VISIBILITY_CONSTANTS.EXTERNAL_FIELDS_FAILURE, error };
};

const tableValidationFieldStarted = (page) => {
  return { type: VISIBILITY_CONSTANTS.TABLE_VALIDATION_FIELDS_STARTED, page };
};

const tableValidationFieldsSuccess = (response) => {
  return { type: VISIBILITY_CONSTANTS.TABLE_VALIDATION_FIELDS_SUCCESS, response };
};

const tableValidationFieldsFailure = (error) => {
  return { type: VISIBILITY_CONSTANTS.TABLE_VALIDATION_FIELDS_FAILURE, error };
};

const datalistFieldStarted = () => {
  return { type: VISIBILITY_CONSTANTS.DATALIST_FIELDS_STARTED };
};

const datalistFieldsSuccess = (response, t) => {
  return { type: VISIBILITY_CONSTANTS.DATALIST_FIELDS_SUCCESS, response, t };
};

const datalistFieldsFailure = (error) => {
  return { type: VISIBILITY_CONSTANTS.DATALIST_FIELDS_FAILURE, error };
};

export const datalistFieldsClear = () => {
  return { type: VISIBILITY_CONSTANTS.DATALIST_FIELDS_CLEAR };
};

const datalistFieldValuesStarted = (page) => {
  return { type: VISIBILITY_CONSTANTS.DATALIST_FIELD_VALUES_STARTED, page };
};

export const datalistFieldValuesSuccess = (response, field_type, filterIndex) => {
  return { type: VISIBILITY_CONSTANTS.DATALIST_FIELD_VALUES_SUCCESS, response, field_type, filterIndex };
};

const datalistFieldValuesFailure = (error) => {
  return { type: VISIBILITY_CONSTANTS.DATALIST_FIELD_VALUES_FAILURE, error };
};

export const datalistFieldValuesClear = () => {
  return { type: VISIBILITY_CONSTANTS.DATALIST_FIELD_VALUES_CLEAR };
};

export const externalFieldsClear = () => {
  return { type: VISIBILITY_CONSTANTS.EXTERNAL_FIELDS_CLEAR };
};

export const externalFieldReducerDataChange = (updatedExternalFieldReducer = {}) => {
  return {
    type: VISIBILITY_CONSTANTS.EXTERNAL_FIELD_REDUCER_DATA_CHANGE,
    payload: { updatedExternalFieldReducer: updatedExternalFieldReducer },
  };
};

export const updateTableColConditionList = (payload = []) => {
  return {
    type: VISIBILITY_CONSTANTS.TABLE_COLUMN_VISIBILITY,
    payload,
  };
};

export const clearExternalFields = () => (dispatch) => dispatch(externalFieldReducerDataChange({
  externalFields: {
    pagination_details: [],
    hasMore: false,
  },
  field_metadata: [],
 }));

export const setOperators = (operators, all_fields_operator) => {
  return { type: VISIBILITY_CONSTANTS.VISIBILITY_OPERATORS_SUCCESS, payload: { operators, all_fields_operator } };
};

export const clearVisibilityOperators = () => { return { type: VISIBILITY_CONSTANTS.CLEAR_VISIBILITY_OPERATORS }; };

const operatorsStarted = () => {
  return { type: VISIBILITY_CONSTANTS.VISIBILITY_OPERATORS_STARTED };
};

const operatorsFailed = (erorr) => {
  return { type: VISIBILITY_CONSTANTS.VISIBILITY_OPERATORS_FAILURE, erorr };
};

export const externalFieldDataChange = (modifiedExternalFields, field_metadata = []) => {
    return {
      type: VISIBILITY_CONSTANTS.VISIBILITY_EXTERNAL_FIELD_DATA_CHANGE,
      payload: {
          updatedExternalFields: modifiedExternalFields,
          fieldMetadata: field_metadata,
    },
  };
};

export const updateExternalFieldsFromDeletedFieldUUID = (field_uuid) => {
  const externalFields = getVisibilityExternalFieldsData(store.getState());

  const field_index = findIndex(externalFields, { field_uuid: field_uuid });
  if (field_index > -1) {
     externalFields.splice(field_index, 1);
  }
  return {
    type: VISIBILITY_CONSTANTS.VISIBILITY_EXTERNAL_FIELD_DATA_CHANGE,
      payload: {
          updatedExternalFields: externalFields,
   },
 };
};

export const updateFieldMetaData = (updatedFields = []) => {
  const fieldMetadata = getVisibilityFieldMetaData(store.getState().VisibilityReducer);
  const updatedExternalFieldReducer = {
    field_metadata: jsUtility.uniqBy([
      ...(fieldMetadata || []),
      ...(updatedFields || []),
    ], (field) => field.field_uuid),
  };
  return {
    type: VISIBILITY_CONSTANTS.EXTERNAL_FIELD_REDUCER_DATA_CHANGE,
    payload: { updatedExternalFieldReducer },
  };
};

export const getExternalFieldsOnSuccess = (params, response) => (dispatch) => {
  const pagination_data = get(response, ['pagination_data'], []);
  const search = get(params, ['search'], EMPTY_STRING);
  // if (isPaginated && _params.page > 1) {
  // }
  // const exisiting_external_fields = getVisibilityExternalFieldsData(store.getState());
  // const consolidated_pagination_data = uniqBy([...(pagination_data || []), ...(exisiting_external_fields || [])], (field) => field.field_uuid);
  response.pagination_data = pagination_data;
  dispatch(externalFieldsSuccess(response, search !== EMPTY_STRING));
};

export const visibilityExternalFieldsThunk = (_params, fieldListType, ignoreFields, getExternalFieldApi = false) => (dispatch) => new Promise((resolve) => {
  const params = { ..._params, field_list_type: fieldListType };
  dispatch(externalFieldStarted(_params.page));
  getExternalFieldApi(params).then((response) => {
    dispatch(getExternalFieldsOnSuccess(_params, response));
    // const pagination_data = get(response, ['pagination_data'], []);
    // const search = get(params, ['search'], EMPTY_STRING);
    // if (isPaginated && _params.page > 1) {
    // }
    // const exisiting_external_fields = getVisibilityExternalFieldsData(store.getState());
    // const consolidated_pagination_data = uniqBy([...(pagination_data || []), ...(exisiting_external_fields || [])], (field) => field.field_uuid);
    // response.pagination_data = pagination_data;
    // dispatch(externalFieldsSuccess(response, search !== EMPTY_STRING));
    // .then(() => resolve(response));
    resolve(response);
  }, (error) => {
    dispatch(externalFieldsFailure(generateGetServerErrorMessage(error)));
    resolve();
  });
});

export const tableValidationExternalFieldsThunk = (params, getExternalFieldApi) => (dispatch) => new Promise((resolve) => {
  dispatch(tableValidationFieldStarted(params.page));
  getExternalFieldApi(params).then((response) => {
    dispatch(tableValidationFieldsSuccess(response));
    resolve(response);
  }, (error) => {
    dispatch(tableValidationFieldsFailure(generateGetServerErrorMessage(error)));
    resolve();
  });
});

export const datalistFieldsThunk = (params, setDataListFieldsCancelToken, t) => (dispatch) => new Promise((resolve) => {
  dispatch(datalistFieldStarted());
  getAllDataListFields(params, setDataListFieldsCancelToken).then((response) => {
    dispatch(datalistFieldsSuccess(response, t));
    resolve(response);
  }, (error) => {
    console.log('check datalistfields failure', error);
    dispatch(datalistFieldsFailure(generateGetServerErrorMessage(error)));
    resolve();
  });
});

export const datalistFieldValuesThunk = (params, setDataListFieldValuesCancelToken) => (dispatch) => new Promise((resolve) => {
  dispatch(datalistFieldValuesStarted(params.apiParams));
  getDataListFieldValues(params.apiParams, setDataListFieldValuesCancelToken).then((response) => {
    dispatch(datalistFieldValuesSuccess(response, params.field_type, params.filterIndex));
    console.log('success value datalist', response);
    resolve(response);
  }, (error) => {
    console.log('check datalistfields failure', error);
    dispatch(datalistFieldValuesFailure(generateGetServerErrorMessage(error)));
    resolve();
  });
});

export const getVisibilityOperatorsApiThunk = (fieldTypes) => (dispatch) => new Promise((resolve) => {
  dispatch(operatorsStarted());
  apiGetRuleOperatorsByFieldType(fieldTypes).then((response) => {
    const operatorData = response[fieldTypes[0]];
    dispatch(setOperators(operatorData, response));
    resolve(operatorData);
  }, (err) => {
    const errors = generateGetServerErrorMessage(err);
    dispatch(operatorsFailed(errors));
    resolve(false);
  });
});

// *************************************** Revamp  *****************************************************

const visibilityCancelToken = null;

// Field Visibility
export const getVisibilityRulesThunk = (params) => (dispatch) => {
  getRulesApi(params, visibilityCancelToken)
    .then((response) => {
      const pagination_detail = get(response, ['pagination_details', 0], {});
      const pagination_data = get(response, ['pagination_data'], []);

      const ruleList = pagination_data.map((rule = {}) => {
        const ruleObject = {};
        const field_names_array = [];
        ruleObject._id = rule._id;
        ruleObject.rule_uuid = rule.rule_uuid;
        ruleObject.rule_name = rule.rule_name;
        ruleObject.visibility = rule.visibility;

        rule?.table_metadata?.forEach((table) => field_names_array.push({ label: table?.table_name }));
        rule?.field_metadata?.forEach((field) => field_names_array.push({ label: field?.field_name }));
        ruleObject.field_names = field_names_array;
        ruleObject.dependents = (rule.dependents || [])?.map((d) => {
          return {
            field_uuid: d.field_uuids?.[0],
            action_uuid: d.action_uuids?.[0],
          };
        });

        ruleObject.config_type = rule?.form_uuids?.length > 1 ? 'existing' : 'new';
        return ruleObject;
      });

      dispatch(fieldVisibilityUpdateRuleList({
        pagination_data: ruleList,
        pagination_detail,
      }));
    })
    .catch((error) => {
       console.log('Get Rule Visibility', error);
    });
};

export const getVisibilityRuleDetailsById = (params) =>
    (dispatch) =>
      new Promise((resolve) => {
        dispatch(fieldVisibilityDataChange({ activeRuleLoading: true }));
        getRuleDetailsByIdApi(params)
          .then((res) => {
            const {
              rule_details,
              field_metadata,
              table_metadata,
              conditional_operator_details,
            } = res;
            const isFormulaExpression =
            rule_details.rule?.expression_type ===
            EXPRESSION_TYPE.FORMULA_EXPRESSION;

            const activeRule = {
              _id: rule_details._id,
              ruleUUID: rule_details.rule_uuid,
              ruleName: rule_details.rule_name,
              ruleType:
                rule_details.rule?.expression_type ===
                EXPRESSION_TYPE.FORMULA_EXPRESSION
                  ? BUILDER_TYPES.EXPRESSION
                  : BUILDER_TYPES.CONDITIONAL,
              ruleExpression: rule_details.rule,
              selectedFields: [
                ...getSelectedTables(rule_details.table_uuids || [], table_metadata),
                ...getSelectedFields(rule_details.field_uuids || [], field_metadata),
              ],
              fieldVisible: rule_details.visibility,
              isExistingRule: rule_details.form_uuids?.length > 1,
            };

            if (!isFormulaExpression) {
              activeRule.ruleExpression = { ...rule_details.rule, expression: getDeFormattedConditionalExpression(rule_details.rule.expression) };
            }

            const externalFields = getVisibilityExternalFieldsData(store.getState());
            dispatch(setOperators([], conditional_operator_details));
            dispatch(externalFieldDataChange(externalFields, field_metadata));
            dispatch(
              fieldVisibilityDataChange({
                activeRule,
                activeRuleLoading: false,
              }),
            );
            if (isFormulaExpression) {
              dispatch(
                setFormulaTokenChange({
                  field_metadata,
                  code: replaceDecodeWithEncodedUUID(
                    rule_details.rule?.expression?.input,
                  ),
                }),
              );
            }
            resolve({});
          })
          .catch(() => {
            resolve(false);
            dispatch(fieldVisibilityDataChange({ activeRuleLoading: false }));
          });
});

const valueCancelToken = null;
// Field Default Value
export const getDefaultValueRulesThunk = (params) => (dispatch) => {
  getRulesApi(params, valueCancelToken)
    .then((response) => {
      const pagination_detail = get(response, ['pagination_details', 0], {});
      const pagination_data = get(response, ['pagination_data'], []);
      const ruleList = pagination_data.map((rule) => {
        const ruleObject = {};
        const field_names_array = [];
        ruleObject._id = rule._id;
        ruleObject.rule_uuid = rule.rule_uuid;
        ruleObject.rule_name = rule.rule_name;

        rule.field_metadata.forEach((field) => field_names_array.push({ label: field.field_name }));
        ruleObject.field_names = field_names_array;

        return ruleObject;
    });

      dispatch(fieldDefaultValueUpdateRuleList({
        pagination_data: ruleList,
        pagination_detail,
      }));
    })
    .catch((error) => {
       console.log('Get Rule Default Value', error);
    });
};

export const getDefaultRuleByIdApiThunk = (params, field, defaultOperatorDetails = {}) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(fieldDefaultValueDataChange({ activeRuleLoading: true }));
      getRuleDetailsByIdApi(params)
        .then((res) => {
          const { rule_details, field_metadata } =
            res;
          const isFormulaExpression =
            rule_details.rule?.expression_type ===
            EXPRESSION_TYPE.FORMULA_EXPRESSION;

          const activeRule = {
            _id: rule_details._id,
            ruleUUID: rule_details.rule_uuid,
            ruleName: rule_details.rule_name,
            ruleType: isFormulaExpression
              ? BUILDER_TYPES.EXPRESSION
              : BUILDER_TYPES.CONFIGURATION_RULE,
            selectedFields: getSelectedFields(
              rule_details.field_uuids,
              field_metadata,
            ),
            isExistingRule: rule_details.form_uuids?.length > 1,
          };

          if (isFormulaExpression) {
            activeRule.ruleExpression = rule_details.rule;
            dispatch(
              setFormulaTokenChange({
                field_metadata,
                code: replaceDecodeWithEncodedUUID(
                  rule_details.rule?.expression?.input,
                ),
              }),
            );
          } else {
            const {
              rule: {
                expression = {},
                expression_type = null,
                decimal_point = null,
                concat_with = null,
              },
            } = rule_details;
            const fieldType = get(field, [RESPONSE_FIELD_KEYS.FIELD_TYPE], '');
            const selectedOperatorInfo = getSelectedOperatorInfo(
              defaultOperatorDetails,
              expression?.operator,
              fieldType,
            );
            const operatorList = get(defaultOperatorDetails, [fieldType], []);
            const rule = getDataFromRuleFields(expression, expression_type, {
              decimal_point,
              concat_with,
            });
            const ruleData = {
              ...rule,
              operatorInfo: selectedOperatorInfo,
              operator: expression.operator,
            };
            activeRule.ruleExpression = ruleData;
            dispatch(externalFieldsDataChange({ field_metadata }));
            dispatch(
              defaultValueRuleOperatorSuccess({ [fieldType]: operatorList }),
            );
          }

          dispatch(
            fieldDefaultValueDataChange({
              activeRule,
              activeRuleLoading: false,
            }),
          );

          resolve(res);
        })
        .catch((err) => {
          reject(err);
          console.log(err);
          dispatch(fieldDefaultValueDataChange({ activeRuleLoading: false }));
        });
});

export const saveRuleThunk = (params, onSuccess, moduleType) => (dispatch) =>
      new Promise((resolve, reject) => {
        const isVisibilityRule = params.rule_type === RULE_TYPE.VISIBILITY;
        setPointerEvent(true);
        saveRuleApi(params)
          .then((response) => {
            setPointerEvent(false);
            resolve(response);
            onSuccess?.(response);
          })
          .catch((error) => {
            setPointerEvent(false);
            const all_error = get(error, ['response', 'data', 'errors']);
            if (get(all_error, [0, 'type']) === SOMEONE_EDITING) {
              if (moduleType === MODULE_TYPES.FLOW) {
                updateSomeoneIsEditingPopoverForFlow(all_error[0].message);
              } else if (moduleType === MODULE_TYPES.DATA_LIST) {
                updateSomeoneIsEditingPopoverForDataList(all_error[0].message);
              } else if (moduleType === MODULE_TYPES.TASK) {
                updateSomeoneIsEditingPopoverForTask(all_error[0].message);
              }
            } else if (
              get(all_error, [0, 'validation_message']) === 'cyclicDependency'
            ) {
              toastPopOver({
                title: i18next.t('error_popover_status.cyclic_dependency'),
                subtitle: i18next.t('error_popover_status.cannot_set_rule'),
                toastType: EToastType.error,
              });
            } else if (
              get(all_error, [0, 'type']) === 'exist' &&
              get(all_error, [0, 'field']) === 'rule_name'
            ) {
              const { ERRORS } = FIELD_VISIBILITY_STRINGS();
              if (isVisibilityRule) {
                dispatch(setVisibilityActiveRuleError({ ruleName: ERRORS.RULE_NAME_EXISTS }));
              } else {
                dispatch(setDefaultValueActiveRuleError({ ruleName: ERRORS.RULE_NAME_EXISTS }));
              }
              toastPopOver({
                title: ERRORS.RULE_NAME_EXISTS,
                toastType: EToastType.error,
              });
            } else if (
              get(all_error, [0, 'type']) === 'exist' &&
              get(all_error, [0, 'field']) === 'field_uuid'
            ) {
              const { fieldVisibilityReducer, fieldDefaultValueReducer } = store.getState().VisibilityReducer;
              const activeRule = isVisibilityRule ? fieldVisibilityReducer.activeRule : fieldDefaultValueReducer.activeRule;
              const value = get(all_error, [0, 'values']);
              const selectedFields = get(activeRule, ['selectedFields'], []);
              const field = selectedFields.find((f) => f.value === value);
              if (isVisibilityRule) {
                dispatch(setVisibilityActiveRuleError({ selectedFields: `${i18next.t('error_popover_status.rule_field_exists')} '${field?.label || ''}'` }));
              } else {
                dispatch(setDefaultValueActiveRuleError({ selectedFields: `${i18next.t('error_popover_status.rule_field_exists')} '${field?.label || ''}'` }));
              }
              toastPopOver({
                title: `${i18next.t('error_popover_status.rule_field_exists')} '${field?.label || ''}'`,
                subtitle: i18next.t('error_popover_status.rule_field_change'),
                toastType: EToastType.error,
              });
            } else {
              toastPopOver({
                title: i18next.t('error_popover_status.save_rule'),
                subtitle: i18next.t('error_popover_status.rules_not_set'),
                toastType: EToastType.error,
              });
            }
            reject(error);
          });
});

export const deleteRule = (params, onSuccess = null, onError = null) => {
   removeRuleApi(params)
   .then(() => {
     onSuccess?.();
   })
   .catch((error) => {
     onError(error);
   });
};

// External Data Source
export const getExternalSourceRulesThunk = (params) => (dispatch) => {
  getRulesApi(params, valueCancelToken)
    .then((response) => {
      const pagination_detail = get(response, ['pagination_details', 0], {});
      const pagination_data = get(response, ['pagination_data'], []);

      dispatch(externalSourceUpdateRuleList({
        pagination_data,
        pagination_detail,
      }));
    })
    .catch((error) => {
       console.log('External Data Source', error);
    });
};

// Import
const importCancelToken = null;
export const getRulesListThunk = (params, onSuccess = null) => {
  getRulesApi(params, importCancelToken)
    .then((response) => {
      const pagination_detail = get(response, ['pagination_details', 0], {});
      const pagination_data = get(response, ['pagination_data'], []);
      onSuccess({
        pagination_detail,
        pagination_data,
      });
    })
    .catch((error) => {
       console.log('Get Rule Visibility', error);
    });
};

export const importRulesApiThunk = (params, onSuccess, onError) => {
  importRulesApi(params)
    .then(() => onSuccess?.())
    .catch((error) => onError?.(error));
};

// Configuration Rule

export const getConfigurationRuleDetailById = (id, fieldType) => (dispatch) => new Promise((resolve, reject) => {
  getRuleDetailsByIdApi(id, { field_type: fieldType })
  .then((response) => {
      const {
        rule_details: {
          rule_type,
          rule: {
            expression = {},
            expression_type = null,
            decimal_point = null,
            concat_with = null,
          },
        },
        field_metadata = [],
        default_operator_details = {},
      } = response;

      const selectedOperatorInfo = getSelectedOperatorInfo(
        default_operator_details,
        expression?.operator,
        fieldType,
      );
      const rule = getDataFromRuleFields(expression, expression_type, {
                                                decimal_point,
                                                concat_with,
                                              });
      const ruleData = {
        ...rule,
        operatorInfo: selectedOperatorInfo,
        operator: expression.operator,
      };
      dispatch(externalFieldsDataChange(field_metadata));
      resolve({
        _id: id,
        ruleType: rule_type,
        ruleData,
      });
  })
  .catch((error) => {
    reject(error);
  });
});
