import { translate } from 'language/config';
import { OPERAND_TYPES } from 'utils/constants/rule/operand_type.constant';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { get, has, isEmpty } from '../../../utils/jsUtility';
import { RULE_VALUE_STRINGS } from '../FormBuilder.strings';
import { R_CONSTANT_TYPES, VALUE_TYPE_KEY } from '../../../utils/constants/rule/rule.constant';

export const R_CONSTANT_OPTION_LIST = [
    { label: 'Today', value: R_CONSTANT_TYPES.TODAY },
    { label: 'Now', value: R_CONSTANT_TYPES.NOW },
];

export const formatRValueErrors = (ruleError, operandFieldType, valueType = VALUE_TYPE_KEY.STATIC_VALUE) => {
    let firstFieldError;
    let secondFieldError;
    if (has(ruleError, ['r_value,0'], null)) {
        firstFieldError = get(ruleError, ['r_value,0'], null);
        if (firstFieldError.includes('match')) {
            firstFieldError = (operandFieldType === OPERAND_TYPES.DUAL_DATE || operandFieldType === OPERAND_TYPES.DUAL_DATE_TIME) ? RULE_VALUE_STRINGS.DUAL_DATE.ERRORS.DATE_FORMAT : RULE_VALUE_STRINGS.DUAL_NUMBER.ERRORS.REQUIRED;
        }
    }
    if (has(ruleError, ['r_value,1'], null)) {
        secondFieldError = get(ruleError, ['r_value,1'], null);
        if (secondFieldError.includes('match')) {
            secondFieldError = (operandFieldType === OPERAND_TYPES.DUAL_DATE || operandFieldType === OPERAND_TYPES.DUAL_DATE_TIME) ? RULE_VALUE_STRINGS.DUAL_DATE.ERRORS.DATE_FORMAT : RULE_VALUE_STRINGS.DUAL_NUMBER.ERRORS.REQUIRED;
        }
        if (secondFieldError.includes('duplicate')) {
            if (firstFieldError) secondFieldError = EMPTY_STRING;
            else {
                // secondFieldError = (operandFieldType === OPERAND_TYPES.DUAL_DATE || operandFieldType === OPERAND_TYPES.DUAL_DATE_TIME) ? RULE_VALUE_STRINGS.DUAL_DATE.ERRORS.VALID_RANGE : RULE_VALUE_STRINGS.DUAL_NUMBER.ERRORS.VALID_RANGE;
                if ((operandFieldType === OPERAND_TYPES.DUAL_DATE || operandFieldType === OPERAND_TYPES.DUAL_DATE_TIME) && valueType === VALUE_TYPE_KEY.STATIC_VALUE) secondFieldError = RULE_VALUE_STRINGS.DUAL_DATE.ERRORS.VALID_RANGE;
                else if (operandFieldType === OPERAND_TYPES.DUAL_TIME) secondFieldError = RULE_VALUE_STRINGS.DUAL_TIME.ERRORS.VALID_RANGE;
                else if (operandFieldType === OPERAND_TYPES.DUAL_NUMBER && valueType === VALUE_TYPE_KEY.STATIC_VALUE) secondFieldError = RULE_VALUE_STRINGS.DUAL_NUMBER.ERRORS.VALID_RANGE;
            }
        }
    }
    return {
        firstFieldError,
        secondFieldError,
    };
};

export const formatRvalueUser = (ruleError) => {
    if (!isEmpty(ruleError)) return translate('form_field_strings.error_text_constant.user_team_required');
    return null;
};

export const generateTimeOptionList = () => {
  const options = [];
  const startTime = new Date(0, 0, 0, 0, 0);
  const endTime = new Date(0, 0, 0, 23, 45);

  while (startTime <= endTime) {
      const label = startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const value = startTime.toLocaleTimeString('en-us', { hour12: false });
      options.push({ label, value });
      startTime.setMinutes(startTime.getMinutes() + 15);
  }

  return options;
};

export default formatRValueErrors;
