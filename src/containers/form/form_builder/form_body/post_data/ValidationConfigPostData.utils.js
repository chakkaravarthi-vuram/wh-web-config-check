import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../utils/constants/form/form.constant';
import { has, isEmpty, translateFunction } from '../../../../../utils/jsUtility';
import { FIELD_TYPES } from '../../../sections/field_configuration/FieldConfiguration.strings';
import { VALIDATION_CONFIG_STRINGS } from '../../../sections/field_configuration/validation_and_visibility_configuration/validation_configuration/ValidationConfiguration.strings';
import { DATE_FIELDS_OPERATOR_VALUES } from '../../../sections/field_configuration/validation_and_visibility_configuration/validation_configuration/date_field_validation_configuration/DateFieldValidationConfiguration.utils';

export const getTextFieldsPostData = (fieldData) => {
    const validationData = {};
    if (has(
        fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
        [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].MINIMUM_CHARACTERS])
        ) {
            validationData.minimum_characters = fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].MINIMUM_CHARACTERS];
        }
    if (has(
        fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
        [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].MAXIMUM_CHARACTERS])
        ) {
            validationData.maximum_characters = fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].MAXIMUM_CHARACTERS];
        }
    if (has(
        fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
        [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOWED_SPECIAL_CHARACTERS])
        ) {
            validationData.allowed_special_characters = fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOWED_SPECIAL_CHARACTERS];
        }
    return validationData;
};

export const getNumberFieldPostData = (fieldData) => {
    const validationData = {};
    if (has(
        fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
        [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_MINIMUM])
        ) {
            validationData.allowed_minimum = fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_MINIMUM];
        }
        if (has(
            fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
            [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_MAXIMUM])
            ) {
                validationData.allowed_maximum = fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_MAXIMUM];
            }
        validationData.dont_allow_zero = fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].DONT_ALLOW_ZERO] || false;
        if (fieldData?.allowDecimal) {
                validationData.allowed_decimal_points = fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_DECIMAL_POINTS];
            }
    return validationData;
};

export const getDateFieldsValidationData = (fieldValidationData, t = translateFunction) => {
    const validationData = {
        allow_today: false,
        date_selection: [{
            type: VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[0].value,
        }],
    };
    switch (fieldValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].OTHER]) {
        case VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.OTHER_OPTIONS_VALUES[0].value:
            validationData.allow_working_day = true;
        break;
        case VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.OTHER_OPTIONS_VALUES[1].value:
            validationData.allow_non_working_day = true;
        break;
        case VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.OTHER_OPTIONS_VALUES[2].value:
            validationData.allowed_day = fieldValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].CUSTOM_WORKING_DAY];
        break;
        default:
        break;
    }

        if (!validationData.allow_non_working_day && fieldValidationData?.[VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.OTHER_OPTIONS_VALUES[0].value]) {
            validationData.allow_working_day = true;
        } else if (!validationData.allow_working_day && fieldValidationData?.[VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.OTHER_OPTIONS_VALUES[1].value]) {
            validationData.allow_non_working_day = true;
        } else if (!validationData.allow_non_working_day && !validationData.allow_working_day && fieldValidationData?.[VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.OTHER_OPTIONS_VALUES[2].value]) {
            validationData.allowed_day = fieldValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].CUSTOM_WORKING_DAY];
        }

    const typeData = {};
    const subTypeData = {};
    let subType = fieldValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].SUB_TYPE];
    switch (fieldValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].TYPE]) {
        case VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[1].value:
        case VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[2].value:
            const type = fieldValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].TYPE];
            if (
                (subType === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.ALLOW_FUTURE_DATE_OPTIONS[2].value)
                ||
                (subType === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.ALLOW_FUTURE_DATE_OPTIONS[3].value)
                ||
                (subType === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.ALLOW_PAST_DATE_OPTIONS[2].value)
                ||
                (subType === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.ALLOW_PAST_DATE_OPTIONS[3].value)
                ||
                (subType === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.ALLOW_FUTURE_DATE_OPTIONS[4].value)) {
                subTypeData.start_day = fieldValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DAY];
            }
            if (subType === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.ALLOW_FUTURE_DATE_OPTIONS[4].value) {
                subTypeData.end_day = fieldValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DAY];
            }
            if (subType === 'all_future_today' || subType === 'all_past_today') {
                subType = (subType === 'all_future_today') ? 'all_future' : 'all_past';
                validationData.allow_today = true;
            }

            validationData.date_selection = [{
                type: type,
                sub_type: subType,
                ...subTypeData,

            }];
        break;
        case VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[3].value:
            typeData.start_date = fieldValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DATE];
            typeData.end_date = fieldValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DATE];
            validationData.date_selection = [{
                type: VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[3].value,
                sub_type: subType,
                ...typeData,

            }];
        break;
        case VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.FIELD_BASED_OPTIONS[0].value:
            typeData.first_field_uuid = fieldValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].FIRST_FIELD_UUID];
            typeData.operator = fieldValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].OPERATOR];
            if (typeData.operator === DATE_FIELDS_OPERATOR_VALUES.BETWEEN) {
                typeData.second_field_uuid = fieldValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].SECOND_FIELD_UUID];
            }
            validationData.date_selection = [{
                type: VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.FIELD_BASED_OPTIONS[0].value,
                ...typeData,

            }];
        break;
        default: break;
    }

    return validationData;
};

export const getCurrencyFieldValidationData = (fieldValidationData) => {
    const validationData = {};
    if (!isEmpty(fieldValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.CURRENCY].ALLOWED_CURRENCY_TYPES])) {
        validationData.allowed_currency_types = fieldValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.CURRENCY].ALLOWED_CURRENCY_TYPES];
    }
    return validationData;
};

export const getLinkFieldValidationData = (fieldValidationData, allowMultiple) => {
    const validationData = {
        ...(allowMultiple && fieldValidationData?.minimumCount) ? { minimum_count: fieldValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].MINIMUM_COUNT] } : null,
        ...(allowMultiple && fieldValidationData?.maximumCount) ? { maximum_count: fieldValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].MAXIMUM_COUNT] } : null,
    };
    return validationData;
};

export const getDocumentFieldValidationData = (fieldValidationData, allowMultiple) => {
    const validationData = {
        ...(allowMultiple && fieldValidationData?.minimumCount) ? { minimum_count: fieldValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MINIMUM_COUNT] } : null,
        ...(allowMultiple && fieldValidationData?.maximumCount) ? { maximum_count: fieldValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MAXIMUM_COUNT] } : null,
    };

    if (fieldValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MAXIMUM_FILE_SIZE]) {
        validationData.maximum_file_size = fieldValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MAXIMUM_FILE_SIZE];
    }
    if (!isEmpty(fieldValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].ALLOWED_EXTENSIONS])) {
        validationData.allowed_extensions = fieldValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].ALLOWED_EXTENSIONS];
    }
    return validationData;
};

export const getUserSelectorFieldValidationData = (fieldValidationData, allowMultiple) => {
    const validationData = {
        allow_minimum_selection: allowMultiple && !isEmpty(fieldValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.USER_TEAM_PICKER].MINIMUM_SELECTION]?.toString()), // unnecessary param -> now necessary
        allow_maximum_selection: allowMultiple && !isEmpty(fieldValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.USER_TEAM_PICKER].MAXIMUM_SELECTION]?.toString()), // unnecessary param -> now necessary
        allow_users: true, // hardcoded post param
        allow_teams: false, // hardcoded post param
        is_restricted: fieldValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.USER_TEAM_PICKER].IS_RESTRICTED] || false,
    };

    if (allowMultiple) {
        if (fieldValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.USER_TEAM_PICKER].MAXIMUM_SELECTION]) {
            validationData.maximum_selection = Number(fieldValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.USER_TEAM_PICKER].MAXIMUM_SELECTION]);
        }
        if (fieldValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.USER_TEAM_PICKER].MINIMUM_SELECTION]) {
            validationData.minimum_selection = Number(fieldValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.USER_TEAM_PICKER].MINIMUM_SELECTION]);
        }
    }
    if (validationData?.is_restricted) {
        validationData.restricted_user_team = {};
        if (!isEmpty(fieldValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.USER_TEAM_PICKER].RESTRICTED_USER_TEAM]?.users)) {
            validationData.restricted_user_team.users =
            fieldValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.USER_TEAM_PICKER].RESTRICTED_USER_TEAM]?.users?.map((user) => user._id);
        }
        if (!isEmpty(fieldValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.USER_TEAM_PICKER].RESTRICTED_USER_TEAM]?.teams)) {
            validationData.restricted_user_team.teams =
            fieldValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.USER_TEAM_PICKER].RESTRICTED_USER_TEAM]?.teams?.map((team) => team._id);
        }
    }
    return validationData;
};

export const getDatalistSelectorFieldValidationData = (fieldValidationData, allowMultiple) => {
    const validationData = {
        filter_fields: [],
    };

    if (allowMultiple) {
        if (fieldValidationData?.maximumSelection) {
            validationData.maximum_selection = Number(fieldValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].MAXIMUM_SELECTION]);
        }
        if (fieldValidationData?.minimumSelection) {
            validationData.minimum_selection = Number(fieldValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].MINIMUM_SELECTION]);
        }
    }
    if (!isEmpty(fieldValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FILTER_FIELDS])) {
        validationData.filter_fields = fieldValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FILTER_FIELDS]?.map((eachFilter) => {
            const filterPostData = {
                field_uuid: eachFilter?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
                field_type: eachFilter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE],
                operator: eachFilter?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.OPERATOR],
                value_type: eachFilter?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.VALUE_TYPE],
            };
            if ([FIELD_TYPES.CHECKBOX, FIELD_TYPES.DROPDOWN, FIELD_TYPES.RADIO_GROUP].includes(filterPostData?.field_type)) {
                filterPostData.choice_value_type = eachFilter?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE];
            }
            if (filterPostData.value_type === 'direct') {
                filterPostData.field_value = eachFilter?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD_VALUE];
            } else {
                filterPostData.field = eachFilter?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD];
            }
            return filterPostData;
        });
    }
    return validationData;
};
