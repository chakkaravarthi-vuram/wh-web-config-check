import { translate } from 'language/config';
import { OPERAND_TYPES } from '../../../utils/constants/rule/operand_type.constant';
import { isEmpty } from '../../../utils/jsUtility';
import { RULE_CONFIG } from '../section/form_fields/FormField.strings';

export const getSelectedFieldInfo = (externalFieldsInfo, selectedLfieldUuid) => (!externalFieldsInfo || isEmpty(externalFieldsInfo)) ? {} : externalFieldsInfo.find((externalFieldInfo) => externalFieldInfo.field_uuid === selectedLfieldUuid);
export const getSelectedOperatorInfo = (operatorDetails, selectedOperator) => operatorDetails.find((operator) => operator.operator === selectedOperator);
export const getSelectedFieldVisibility = (externalFieldsInfo, selectedLfieldUuid) => {
  console.log('getSelectedFieldVisibility', externalFieldsInfo, selectedLfieldUuid);
  externalFieldsInfo.find((externalFieldInfo) => externalFieldInfo.field_uuid === selectedLfieldUuid);
};

export const getRValueInputMetadata = (operandFieldType) => {
  switch (operandFieldType) {
    case OPERAND_TYPES.SINGLE_LINE:
    case OPERAND_TYPES.MULTI_SINGLE_LINE:
      return {
        label: translate('rule_value_strings.operand_types.single_line.label'),
        placeHolder: translate('rule_value_strings.operand_types.single_line.placeholder'),
      };
    case OPERAND_TYPES.EMAIL:
      return {
        label: translate('rule_value_strings.operand_types.email.label'),
        placeHolder: translate('rule_value_strings.operand_types.email.placeholder'),
      };
    case OPERAND_TYPES.NUMBER:
    case OPERAND_TYPES.DUAL_NUMBER:
      return {
        label: translate('rule_value_strings.operand_types.number.label'),
        placeHolder: translate('rule_value_strings.operand_types.number.placeholder'),
      };
    case OPERAND_TYPES.MULTI_NUMBER:
      return {
        label: translate('rule_value_strings.operand_types.multi_number.label'),
        placeHolder: translate('rule_value_strings.operand_types.multi_number.placeholder'),
      };
    case OPERAND_TYPES.DROPDOWN:
      return {
        label: translate('rule_value_strings.operand_types.dropdown.label'),
        placeHolder: translate('rule_value_strings.operand_types.dropdown.label'),
      };
    case OPERAND_TYPES.MULTI_DROPDOWN:
      return {
        label: translate('rule_value_strings.operand_types.multi_dropdown.label'),
        placeHolder: translate('rule_value_strings.operand_types.multi_dropdown.placeholder'),
      };
    case OPERAND_TYPES.DATE:
      return {
        label: translate('rule_value_strings.operand_types.date.label'),
      };
    case OPERAND_TYPES.DUAL_DATE:
      return { label: [RULE_CONFIG.DATE_FROM, RULE_CONFIG.DATE_TO] };
    case OPERAND_TYPES.DUAL_DATE_TIME:
      return { label: [RULE_CONFIG.DATE_FROM, RULE_CONFIG.DATE_TO] };
    case OPERAND_TYPES.MIN_MAX:
      return { minPlaceholder: 'Min value', maxPlaceholder: 'Max value' };
    case OPERAND_TYPES.PHONE_NUMBER:
      return {
        label: 'Phone number',
        placeHolder: 'Enter Phone number',
      };
    default:
      return null;
  }
};
