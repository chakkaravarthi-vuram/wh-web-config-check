import { translate } from 'language/config';
import { SERVER_ERROR_CODES } from 'utils/ServerConstants';
import { FORM_POPOVER_STATUS } from 'utils/Constants';
import { FORMULA_BUILDER, FORMULA_BUILDER_ALLOWED_FIELDS } from 'components/formula_builder/FormulaBuilder.strings';
import { constructFormulaRule, getFormulaValidationData, replaceDecodeWithEncodedUUID, replaceEncodeWithDecodedUUID, replaceNonBreakCharacterToEmpty, updateFormulaBuilderValidationPopOver } from 'components/formula_builder/formula_tokenizer_utils/formulaBuilder.utils';
import { apiGetRuleDetailsById } from 'axios/apiService/flow.apiService';
import { store } from 'Store';
import { DEFAULT_RULE_KEYS } from 'utils/constants/form.constant';
import { EXPRESSION_TYPE } from 'utils/constants/rule/rule.constant';
import { FIELD_CONFIG } from 'components/form_builder/FormBuilder.strings';
import jsUtility, { get, isEmpty, translateFunction } from '../../utils/jsUtility';
import { getFormulaBuilderFunctionsApi, verifyExpressionApi, getExternalFields } from '../../axios/apiService/formulaBuilder.apiService';
import { setFormulaTokenChange, externalFieldSuccess } from '../reducer/FormulaBuilderReducer';
import { showToastPopover } from '../../utils/UtilityFunctions';

export const handleSyntaxError = (errors = [], dispatch, updateCodeDOM = true, t = translateFunction) => {
   let syntax_error = null;
   errors.forEach((error) => {
    if (error.type === 'SyntaxError') {
        const error_data = error.details;
        const consolidatedError = { [`${error_data.row + 1},${error_data.column}`]: error_data.message };
        syntax_error = { ...syntax_error, ...consolidatedError };
        // syntax_error.push(error.details);
        }
    });

    if (!isEmpty(syntax_error)) {
      const redux_data = { serverErrorList: syntax_error };
      if (updateCodeDOM) {
        const existingRefreshOnCodeChange = get(store.getState(), ['FormulaBuilderReducer', 'refreshOnCodeChange'], false);
        redux_data.refreshOnCodeChange = !existingRefreshOnCodeChange;
      }
        dispatch(setFormulaTokenChange(redux_data));
        if (updateCodeDOM) {
          updateFormulaBuilderValidationPopOver(
            {},
            { [DEFAULT_RULE_KEYS.INPUT]: FORMULA_BUILDER(t).VALIDATION.LABEL.INCORRECT_SYNTAX });
          }
      }
    return syntax_error;
};

export const getFormulaBuilderFunctionsThunk = () => (dispatch) => {
    getFormulaBuilderFunctionsApi()
      .then((res) => {
          const { data = {} } = res;
          const _functions = [];
          Object.keys(data).forEach((key) => {
            data[key].forEach((fn) =>
              _functions.push({ ...fn, type: key }),
            );
          });
          dispatch(setFormulaTokenChange({ lstFunctions: _functions }));
      }).catch((err) => {
          console.log('error in FormulaBuilder Functions', err);
      });
};
export const verifyExpressionThunk = (expression_) => (dispatch) => new Promise((resolve, reject) => {
    const post_data = constructFormulaRule(expression_);
    verifyExpressionApi(post_data)
        .then((response) => {
            resolve(response.data.success);
        })
        .catch((error) => {
            const statusCode = get(error, ['response', 'status'], null);
            const err_response = get(error, ['response', 'data'], {});
            const errors = get(err_response, ['errors'], []);
            const popOverStatus = {
                title: null,
                subTitle: null,
                isVisible: false,
                status: FORM_POPOVER_STATUS.SERVER_ERROR,
            };

            let syntax_error = {};
            if (statusCode === SERVER_ERROR_CODES.VALIDATION_ERROR) {
              syntax_error = handleSyntaxError(errors, dispatch, false);
            } else if (statusCode === SERVER_ERROR_CODES.SOMETHING_WENT_WRONG) {
                  popOverStatus.title = translate('error_popover_status.somthing_went_wrong');
                  popOverStatus.isVisible = true;
            }

            if (popOverStatus.title && popOverStatus.isVisible) {
                showToastPopover(
                  popOverStatus?.title,
                  popOverStatus?.subTitle,
                  FORM_POPOVER_STATUS.SERVER_ERROR,
                  true,
                );
            }
            reject(syntax_error);
        });
});
export const getAllExternalFieldsThunk =
  (
    paginationDetails,
    id = null,
    { isTaskForm, isDataListForm },
    isDlPicker,
    t = translateFunction,
  ) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      let params = {
        ...paginationDetails,
        allowed_field_types: !isDlPicker ? FORMULA_BUILDER_ALLOWED_FIELDS :
        [...FIELD_CONFIG(t).VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD.ALLOWED_FIELD_TYPES.inputFields,
          ...FIELD_CONFIG(t).VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD.ALLOWED_FIELD_TYPES.selectionFields],
      };
      // const isFlowForm = !(isTaskForm || isDataListForm);
      if (isTaskForm) params.task_metadata_id = id;
      else if (isDataListForm) params.data_list_id = id;
      else {
        params = {
          ...params,
          flow_id: id,
        };
      }
      getExternalFields(params)
        .then((response) => {
            if (!isDlPicker) dispatch(externalFieldSuccess(response));
          resolve(response);
        })
        .catch(() => {
          reject();
        });
    });

export const getRuleDetailforExpression = (ruleId, callBackFn = null) => (dispatch) => new Promise((resolve, reject) => {
  apiGetRuleDetailsById(ruleId)
    .then((response) => {
      const expression_type = get(response, ['rule_details', 'rule', 'expression_type'], null);
      const expression = get(response, ['rule_details', 'rule', 'expression'], {});
      if (expression_type === EXPRESSION_TYPE.FORMULA_EXPRESSION) {
          const field_metadata = get(response, ['field_metadata'], []);
          callBackFn && callBackFn(field_metadata);
          const code = replaceDecodeWithEncodedUUID(expression.input);
          if (!jsUtility.isEmpty(expression)) {
            dispatch(setFormulaTokenChange(
              {
                field_metadata: field_metadata,
                code: code,
            }));
          }
          resolve({ code, field_metadata });
      } else {
        // eslint-disable-next-line no-throw-literal
        throw 'Not a formula expression';
      }
    })
    .catch((error) => {
      reject(error);
    });
});

export const globalFormulaBuilderEvaluateThunk = (code, t = translateFunction) => (dispatch) => new Promise((resolve, reject) => {
  const existingRefreshOnCodeChange = get(store.getState(), ['FormulaBuilderReducer', 'refreshOnCodeChange'], false);
  const serverError = get(store.getState(), ['FormulaBuilderReducer', 'serverErrorList'], {});
  const validatingCode = replaceNonBreakCharacterToEmpty(code);
  const validationError = getFormulaValidationData(validatingCode);

  updateFormulaBuilderValidationPopOver(serverError, validationError);
  if (validatingCode && isEmpty(serverError) && isEmpty(validationError)) {
    const formattedCode = code;
    const post_code = replaceEncodeWithDecodedUUID(formattedCode);
      dispatch(verifyExpressionThunk(post_code))
      .then((success) => {
         resolve(formattedCode, success);
          // dispatch(setFormulaTokenChange({
          //   code: formattedCode,
          //   refreshOnCodeChange: !existingRefreshOnCodeChange,
          // }));
      })
      .catch((error) => {
        const rejectData = { formattedCode, error };
         reject(rejectData);
         dispatch(setFormulaTokenChange({
          // code: formattedCode,
          refreshOnCodeChange: !existingRefreshOnCodeChange,
        }));
        updateFormulaBuilderValidationPopOver({ [DEFAULT_RULE_KEYS.INPUT]: FORMULA_BUILDER(t).VALIDATION.LABEL.INCORRECT_SYNTAX }, validationError);
      });
  }
});
