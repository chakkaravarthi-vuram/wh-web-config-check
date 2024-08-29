import { FORM_POPOVER_STATUS } from 'utils/Constants';
import { DEFAULT_RULE_KEYS } from 'utils/constants/form.constant';
import { EXPRESSION_TYPE } from 'utils/constants/rule/rule.constant';
import { getFormattedDateFromUTC } from 'utils/dateUtils';
import { EMPTY_STRING, SOMEONE_IS_EDITING } from 'utils/strings/CommonStrings';
import { getCurrentUserId } from 'utils/userUtils';
import { updateEditConfirmPopOverStatus, validate } from 'utils/UtilityFunctions';
import { advanceDefaultValueExpressionValidationSchema } from 'validation/default_rule/defaultRule.schema';
import { find, uniqBy, isEmpty, translateFunction } from '../../../utils/jsUtility';
import { showToastPopover } from '../../../utils/UtilityFunctions';
import { FORMULA_BUILDER } from '../FormulaBuilder.strings';
import { FIELD } from './constants';

export const encodeField = (uuid = null) => {
    if (uuid) {
      return uuid.replaceAll('-', '_');
    }
    return uuid;
 };

 export const decodeField = (uuid = null) => {
     if (uuid) {
       return uuid.replaceAll('_', '-');
     }
     return uuid;
  };

  export const UUID_REEGEX = /f\$[a-f0-9]{8}_[a-f0-9]{4}_[a-f0-9]{4}_[a-f0-9]{4}_[a-f0-9]{12}\$/ig;

  export const UUID_DECODE_REGEX = /f\$[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\$/ig;

  // /f\$[a-f0-9]{8}_[a-f0-9]{4}_[a-f0-9]{4}_[a-f0-9]{4}_[a-f0-9]{12}\$/ig

  export const replaceEncodeWithDecodedUUID = (code) => {
      let modifiedCode = code;
     if (modifiedCode) {
       const matchArray = modifiedCode.match(UUID_REEGEX) || [];
       matchArray.forEach((eachMatch) => {
            modifiedCode = modifiedCode.replaceAll(eachMatch, eachMatch.replaceAll('_', '-'));
       });
     }
     return modifiedCode;
  };

  export const replaceDecodeWithEncodedUUID = (code = EMPTY_STRING) => {
    let modifiedCode = code;
   if (modifiedCode) {
     const matchArray = modifiedCode.match(UUID_DECODE_REGEX) || [];
     matchArray.forEach((eachMatch) => {
          modifiedCode = modifiedCode.replaceAll(eachMatch, eachMatch.replaceAll('-', '_'));
     });
   }
   return modifiedCode;
};

  export const constructFormulaRule = (expression_) => {
    return {
        expression_type: EXPRESSION_TYPE.FORMULA_EXPRESSION,
        expression: {
            input: expression_,
        },
    };
  };

  export const showFormulaRuleCustomError = (error, params, type) => {
      if (error.type === 'someone_editing') {
          const { time, isMoreThanHoursLimit } = getFormattedDateFromUTC(error.message.edited_on, SOMEONE_IS_EDITING);
          const isCurrentUser = getCurrentUserId() === error.message.user_id;

          let editSubtitle = null;
          if (isCurrentUser) {
            editSubtitle = 'You may be editing this in another screen/device';
          } else {
            editSubtitle = `${error.message.full_name} (${error.message.email}) is editing`;
          }

          updateEditConfirmPopOverStatus({
            title: `Error in ${type}`,
            subTitle: editSubtitle,
            secondSubTitle: isCurrentUser ? EMPTY_STRING : `last edited this ${time}`,
            status: FORM_POPOVER_STATUS.SERVER_ERROR,
            isEditConfirmVisible: true,
            type: type,
            enableDirectEditing: isCurrentUser && isMoreThanHoursLimit,
            params: { ...params },
          });
      }
  };

  export const constructFieldDisplayValue = (field) => {
    let field_label = field.field_name;
    if (field.field_name !== field.reference_name) {
        field_label = `${field.field_name}(Ref: ${field.reference_name})`;
    }
    return field_label;
  };

  export const updateUnsupportedDataInStringLiteral = (code, allFields = [], t = translateFunction) => {
    let modifiedCode = replaceEncodeWithDecodedUUID(code);
   if (modifiedCode) {
     const matchArray = modifiedCode.match(UUID_DECODE_REGEX) || [];
     matchArray.forEach((eachMatch) => {
          const field = find(allFields, { field_uuid: eachMatch.slice(FIELD.PREFIX.length, eachMatch.length - 1) });
          modifiedCode = modifiedCode.replaceAll(
            eachMatch,
            (field === -1 || !field) ? FORMULA_BUILDER(t).ALL_LABELS.UNSUPPORTED_DATA : `${constructFieldDisplayValue(field)}`,
          );
     });
   }
   return modifiedCode;
  };

  export const replaceNonBreakCharacterToEmpty = (code) => code.replace(/\uFEFF|\u200C/gi, '');

  export const getFormulaValidationData = (code = EMPTY_STRING) => {
     const validation_data = validate(
        { input: replaceNonBreakCharacterToEmpty(code) },
        advanceDefaultValueExpressionValidationSchema,
      );
      return validation_data.input || EMPTY_STRING;
  };

  export const combineFieldsAndMetadata = (allFields = [], fieldMetadata = [], callBackFn = null) => new Promise((resolve) => {
    const combinedFieldList = uniqBy(
      [...fieldMetadata, ...allFields],
      (field) => field.field_uuid,
    );
    callBackFn && callBackFn(combinedFieldList);
    resolve();
  });

  export const updateFormulaBuilderValidationPopOver = (server_error = {}, client_error = {}) => {
    if (!isEmpty(server_error) || !isEmpty(client_error)) {
      let validationMessage = EMPTY_STRING;
      if (!isEmpty(client_error)) {
        validationMessage = typeof client_error === 'string' ? client_error : client_error[DEFAULT_RULE_KEYS.INPUT];
      } else if (!isEmpty(server_error)) {
        validationMessage = server_error[DEFAULT_RULE_KEYS.INPUT];
      }
      if (validationMessage) {
        showToastPopover(
          'Validation - Default advance calculation',
          validationMessage,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
       }
    }
  };
