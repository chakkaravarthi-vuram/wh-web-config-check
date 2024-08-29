import { RESPONSE_VALIDATION_KEYS } from '../../../../../../../../utils/constants/form/form.constant';
import { FIELD_TYPES } from '../../../../FieldConfiguration.strings';

export const DL_VALUE_TYPE_OPTION_LIST = [
    {
      value: false,
      label: 'Static values',
    },
    {
      value: true,
      label: 'Value from field',
    },
];

export const DL_PICKER_FILTER_STRING = {
    VALUE_PLACEHOLDER: 'Select or Enter the value',
    FIELD: 'field',
    DIRECT: 'direct',
    FIELD_PLACEHOLDER: 'Select a field',
};

export const getErrorMessage = (errorList, key, index) => errorList?.[`${RESPONSE_VALIDATION_KEYS.VALIDATION_DATA},${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FILTER_FIELDS},${index},${key}`];
