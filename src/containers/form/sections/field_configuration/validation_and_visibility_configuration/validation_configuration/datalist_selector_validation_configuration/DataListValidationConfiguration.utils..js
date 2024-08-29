import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../../../utils/constants/form/form.constant';
import { EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';
import { FIELD_TYPES } from '../../../FieldConfiguration.strings';

export const FILTER_FIELD_INITIAL_STATE_OBJECT = {
    [RESPONSE_FIELD_KEYS.FIELD_UUID]: EMPTY_STRING,
    [RESPONSE_FIELD_KEYS.FIELD_TYPE]: EMPTY_STRING,
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].OPERATOR]: EMPTY_STRING,
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD_VALUE]: EMPTY_STRING,
};

export const getChoiceValuePairs = (optionList = []) => optionList?.map((choice) => { return { label: choice?.label || choice, value: choice?.value || choice }; });
