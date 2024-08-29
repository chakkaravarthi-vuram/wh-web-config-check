import { translateFunction } from '../../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from '../BasicConfiguration.strings';

export const DEFAULT_OPTION_DATA = {
    label: EMPTY_STRING,
    value: EMPTY_STRING,
};

export const getValueTypeOptions = (t = translateFunction) => [
    {
        label: BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.VALUE_TYPES[0].LABEL,
        value: BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.VALUE_TYPES[0].VALUE,
        header: BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.VALUE_TYPE_LABEL,
    },
    {
        label: BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.VALUE_TYPES[1].LABEL,
        value: BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.VALUE_TYPES[1].VALUE,
    },
    // {
    //     label: BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.VALUE_TYPES[2].LABEL,
    //     value: BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.VALUE_TYPES[2].VALUE,
    // },
   ];
