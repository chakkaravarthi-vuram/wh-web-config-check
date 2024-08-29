import React from 'react';
import SingleLineIcon from '../../../assets/icons/form_field_icons_v2/SingleLineIcon';
import jsUtility, { translateFunction } from '../../../utils/jsUtility';
import ParagraphIcon from '../../../assets/icons/form_field_icons_v2/ParagraphIcon';
import NumberIcon from '../../../assets/icons/form_field_icons_v2/NumberIcon';
import YesOrNoIcon from '../../../assets/icons/form_field_icons_v2/YesOrNoIcon';
import DropdownIcon from '../../../assets/icons/form_field_icons_v2/DropdownIcon';
import CheckboxIcon from '../../../assets/icons/form_field_icons_v2/CheckboxIcon';
import RadioIcon from '../../../assets/icons/form_field_icons_v2/RadioIcon';
import LookupIcon from '../../../assets/icons/form_field_icons_v2/LookupIcon';
import DateIcon from '../../../assets/icons/form_field_icons_v2/DateIcon';
import DateTimeIcon from '../../../assets/icons/form_field_icons_v2/DateTimeIcon';
import ImageCompIcon from '../../../assets/icons/app_builder_icons/ImageCompIcon';
import TableIcon from '../../../assets/icons/form_field_icons_v2/TableIcon';
import UserSelectorIcon from '../../../assets/icons/form_field_icons_v2/UserSelectorIcon';
import UserPropertyPickerIcon from '../../../assets/icons/form_field_icons_v2/UserPropertyPickerIcon';
import DataListSelectorIcon from '../../../assets/icons/form_field_icons_v2/DataListSelectorIcon';
import DataListPropertyPickerIcon from '../../../assets/icons/form_field_icons_v2/DataListPropertyPicker';
import EmailFieldIcon from '../../../assets/icons/form_field_icons_v2/EmailIcon';
import PhoneIcon from '../../../assets/icons/form_field_icons_v2/PhoneIcon';
import CurrencyIcon from '../../../assets/icons/form_field_icons_v2/CurrencyIcon';
import LinkIcon from '../../../assets/icons/form_field_icons_v2/LinkIcon';
import InfoIcon from '../../../assets/icons/form_field_icons_v2/InfoIcon';
import ScannerIcon from '../../../assets/icons/form_field_icons_v2/ScannerIcon';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { FIELD_LIST_TYPE } from '../../../utils/constants/form.constant';

export const MANAGE_FLOW_FIELDS_CONFIG_TABS = {
    GENERAL: '1',
    ADDITIONAL: '2',
};

export const COMMON_CONSTANTS = {
    DEFAULT_DECIMAL_VALUES: 2,
};

export const MANAGE_FLOW_FIELDS_TAB_OPTIONS = (t = translateFunction) => [
    {
        labelText: t('end_step_configuration_strings.end_config_tab.general'),
        value: MANAGE_FLOW_FIELDS_CONFIG_TABS.GENERAL,
        tabIndex: MANAGE_FLOW_FIELDS_CONFIG_TABS.GENERAL,
    },
    {
        labelText: t(
            'end_step_configuration_strings.end_config_tab.additional_configuration',
        ),
        value: MANAGE_FLOW_FIELDS_CONFIG_TABS.ADDITIONAL,
        tabIndex: MANAGE_FLOW_FIELDS_CONFIG_TABS.ADDITIONAL,
    },
];

export const FIELD_TYPE_IDS = {
    FIELD_NAME: {
        ID: 'fieldName',
        LABEL: 'Field Name',
        PLACEHOLDER: 'Select',
    },
    FIELD_TYPE: {
        ID: 'fieldType',
        LABEL: 'Field Type',
        PLACEHOLDER: 'Select',
    },
    DATA_LISTS: {
        ID: 'dataListUuid',
        LABEL: 'Datalists',
        PLACEHOLDER: 'Select',
    },
    DATA_LISTS_FIELD: {
        ID: 'displayFields',
        LABEL: "Datalists' field",
        PLACEHOLDER: 'Select',
    },
    ERROR: {
        COLUMN_ERROR_ID: 'column_error',
    },
    CHOICE_VALUES: {
        ID: 'selectionOptions',
        LABEL: 'Selection Options',
    },
    CHOICE_VALUE_TYPE: {
        ID: 'choiceValueType',
        LABEL: 'Choice Value Type',
    },
    LOOKUP_ID: {
        ID: 'customLookupId',
        LABEL: 'Lookup Field',
    },
    ALLOW_DECIMAL_CHECKBOX_ID: 'allowDecimal',
    ALLOW_MULTIPLE_CHECKBOX_ID: 'allowMultiple',
    ALLOW_ZERO_CHECKBOX_ID: 'dontAllowZero',
    ALLOWED_DECIMAL_ID: 'allowedDecimal',
    MINIMUM_COUNT: 'minimumCount',
    MAXIMUM_COUNT: 'maximumCount',
    ALLOWED_MINIMUM: 'allowedMinimum',
    ALLOWED_MAXIMUM: 'allowedMaximum',
};

export const FIELD_TYPES = {
    SINGLE_LINE: 'singleline',
    PARAGRAPH: 'paragraph',
    NUMBER: 'number',
    EMAIL: 'email',
    DATE: 'date',
    FILE_UPLOAD: 'fileupload',
    CURRENCY: 'currency',
    DROPDOWN: 'dropdown',
    CHECKBOX: 'checkbox',
    RADIO_GROUP: 'radiobutton',
    CASCADING: 'cascading',
    USER_TEAM_PICKER: 'userteampicker',
    USER_PROPERTY_PICKER: 'userpropertypicker',
    YES_NO: 'yesorno',
    LINK: 'link',
    INFORMATION: 'information',
    SCANNER: 'barcodescanner',
    CUSTOM_LOOKUP_CHECKBOX: 'lookupcheckbox',
    CUSTOM_LOOKUP_DROPDOWN: 'lookupdropdown',
    CUSTOM_LOOKUP_RADIOBUTTON: 'lookupradiobutton',
    DATETIME: 'datetime',
    TIME: 'time',
    USERS: 'users',
    TEAMS: 'teams',
    ADDRESS: 'address',
    RATING: 'rating',
    PERCENTAGE: 'percentage',
    TABLE: 'table',
    DATA_LIST: 'datalistpicker',
    DATA_LIST_PROPERTY_PICKER: 'datalistpropertypicker',
    PHONE_NUMBER: 'phonenumber',
};

export const ALLOWED_DATA_LISTS_FIELD_TYPES = [
    FIELD_TYPES.SINGLE_LINE,
    FIELD_TYPES.NUMBER,
    FIELD_TYPES.RADIO_GROUP,
    FIELD_TYPES.DROPDOWN,
    FIELD_TYPES.EMAIL,
    FIELD_TYPES.SCANNER,
];

export const FIELD_LIST = (t, isTable = false) => jsUtility.compact([
    {
        value: FIELD_TYPES.SINGLE_LINE,
        label: t('form_field_strings.dropdown_list_text.single_line'),
        isCheck: false,
        header: 'Text Fields',
        icon: <SingleLineIcon />,
    },
    {
        header: 'Text Fields',
        value: FIELD_TYPES.PARAGRAPH,
        label: t('form_field_strings.dropdown_list_text.Paragraph'),
        isCheck: false,
        icon: <ParagraphIcon />,
    },
    {
        header: 'Text Fields',
        value: FIELD_TYPES.NUMBER,
        label: t('form_field_strings.dropdown_list_text.number'),
        isCheck: false,
        icon: <NumberIcon />,
    },
    {
        header: 'Selection Fields',
        label: t('form_field_strings.dropdown_list_text.yes_or_no'),
        isCheck: false,
        icon: <YesOrNoIcon />,
        value: FIELD_TYPES.YES_NO,
    },
    {
        header: 'Selection Fields',
        label: t('form_field_strings.dropdown_list_text.dropdown'),
        isCheck: false,
        icon: <DropdownIcon />,
        value: FIELD_TYPES.DROPDOWN,
    },
    {
        header: 'Selection Fields',
        label: t('form_field_strings.dropdown_list_text.Checkbox'),
        isCheck: false,
        icon: <CheckboxIcon />,
        value: FIELD_TYPES.CHECKBOX,
    },
    {
        header: 'Selection Fields',
        label: t('form_field_strings.dropdown_list_text.radio'),
        isCheck: false,
        icon: <RadioIcon />,
        value: FIELD_TYPES.RADIO_GROUP,
    },
    {
        header: 'Selection Fields',
        label: t('form_field_strings.dropdown_list_text.custom_dropdown'),
        isCheck: false,
        icon: <LookupIcon />,
        value: FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
    },
    {
        label: t('form_field_strings.dropdown_list_text.date'),
        isCheck: false,
        icon: <DateIcon />,
        value: FIELD_TYPES.DATE,
        header: 'Date Fields',
    },
    {
        header: 'Date Fields',
        label: t('form_field_strings.dropdown_list_text.date_time'),
        isCheck: false,
        icon: <DateTimeIcon />,
        value: FIELD_TYPES.DATETIME,
    },
    {
        header: 'Media Fields',
        label: t('form_field_strings.dropdown_list_text.document'),
        isCheck: false,
        icon: <ImageCompIcon />,
        value: FIELD_TYPES.FILE_UPLOAD,
    },
    !isTable ? {
        header: 'Layout Fields',
        label: t('form_field_strings.dropdown_list_text.table'),
        isCheck: false,
        icon: <TableIcon />,
        value: FIELD_TYPES.TABLE,
    } : null,
    {
        header: 'Data Reference Fields',
        label: t('form_field_strings.dropdown_list_text.user_selector'),
        isCheck: false,
        icon: <UserSelectorIcon />,
        value: FIELD_TYPES.USER_TEAM_PICKER,
    },
    {
        header: 'Data Reference Fields',
        label: t('form_field_strings.dropdown_list_text.user_property_picker'),
        isCheck: false,
        icon: <UserPropertyPickerIcon />,
        value: FIELD_TYPES.USER_PROPERTY_PICKER,
        disabled: true,
    },
    {
        header: 'Data Reference Fields',
        label: t('form_field_strings.dropdown_list_text.datalist_selector'),
        isCheck: false,
        icon: <DataListSelectorIcon />,
        value: FIELD_TYPES.DATA_LIST,
    },
    {
        header: 'Data Reference Fields',
        label: t('form_field_strings.dropdown_list_text.datalist_property_picker'),
        isCheck: false,
        icon: <DataListPropertyPickerIcon />,
        value: FIELD_TYPES.DATA_LIST_PROPERTY_PICKER,
        disabled: true,
    },
    {
        header: 'Other Fields',
        label: t('form_field_strings.dropdown_list_text.email'),
        isCheck: false,
        icon: <EmailFieldIcon />,
        value: FIELD_TYPES.EMAIL,
    },
    {
        header: 'Other Fields',
        label: t('form_field_strings.dropdown_list_text.phone_number'),
        isCheck: false,
        icon: <PhoneIcon />,
        value: FIELD_TYPES.PHONE_NUMBER,
    },
    {
        header: 'Other Fields',
        label: t('form_field_strings.dropdown_list_text.currency'),
        isCheck: false,
        icon: <CurrencyIcon />,
        value: FIELD_TYPES.CURRENCY,
    },
    {
        header: 'Other Fields',
        label: t('form_field_strings.dropdown_list_text.link'),
        isCheck: false,
        icon: <LinkIcon />,
        value: FIELD_TYPES.LINK,
    },
    !isTable ? {
        header: 'Other Fields',
        label: t('form_field_strings.dropdown_list_text.information'),
        isCheck: false,
        icon: <InfoIcon />,
        value: FIELD_TYPES.INFORMATION,
        disabled: true,
    } : null,
    {
        header: 'Other Fields',
        label: t('form_field_strings.dropdown_list_text.scanner'),
        isCheck: false,
        icon: <ScannerIcon />,
        value: FIELD_TYPES.SCANNER,
    },
]);

export const FIELD_TYPE_SEARCH = (t = translateFunction) => {
    return {
        PLACEHOLDER: t('manage_flow_fields.field_type_dropdown.placeholder'),
    };
};

export const FIELD_TYPE_KEYS = {

    ADD_OPTIONS_BUTTON_ID: 'add_options_button',
    CREATE_FLOW_FIELD_BUTTON_ID: 'create_fields_button',

};

export const FIELD_KEYS = {
    FIELD_DETAILS: 'fieldDetails',
    COLUMN_DETAILS: 'columnDetails',
};

export const ALLOW_DECIMAL_CHECKBOX = (t = translateFunction) => {
    return {
        OPTION: {
            label: t('manage_flow_fields.allow_decimal_checkbox_options.label'),
            value: false,
        },
    };
};

export const ALLOW_ZERO_CHECKBOX = (t = translateFunction) => {
    return {
        OPTION: {
            label: t('manage_flow_fields.allow_zero_checkbox_options.label'),
            value: false,
        },
    };
};

export const ALLOW_MULTIPLE_CHECKBOX = (t = translateFunction) => {
    return {
        OPTION: {
            label: t('manage_flow_fields.allow_multiple_checkbox_options.label'),
            value: false,
        },
    };
};

export const FORM_LAYOUT_TYPE = {
    ROOT: 'root',
    FIELD: 'field',
    TABLE: 'table',
    ROW: 'container',
    COLUMN: 'column',
    ADD_FIELD: 'add-field',
    FIELD_TEMPLATE: 'field-template',
};

export const REQUEST_FIELD_KEYS = {
    FIELD_NAME: 'field_name',
    FIELD_TYPE: 'field_type',
    FIELD_LIST_TYPE: 'field_list_type',
    FLOW_ID: 'flow_id',
    IS_GLOBAL_FIELD: 'is_global_field',
    IS_SAVE: 'is_save',
    TABLE_UUID: 'table_uuid',
    CHOICE_VALUES: 'choice_values',
    CHOICE_VALUE_TYPE: 'choice_value_type',
    TEXT: 'text',
    VALUE_METADATA: 'value_metadata',
    CUSTOM_LOOKUP_ID: 'custom_lookup_id',
    LOOKUP_NAME: 'lookup_name',
    IS_DIGIT_FORMATTED: 'is_digit_formatted',
    ALLOW_DECIMAL: 'allow_decimal',
    DATA_LIST_DETAILS: 'data_list_details',
    DATA_LIST_UUID: 'data_list_uuid',
    DISPLAY_FIELDS: 'display_fields',
    ALLOW_MULTIPLE: 'allow_multiple',
    ID: '_id',
    FIELD_UUID: 'field_uuid',
    COLUMNS: 'columns',
    REFERENCE_NAME: 'reference_name',
    LABEL: 'label',
    PAGINATION_DATA: 'pagination_data',
    FIELD_DETAILS: 'field_details',
    DATA_LIST: 'data_list',
    DATA_LIST_NAME: 'data_list_name',
    OTHER_FIELD_DETAIL: 'other_field_detail',
    VALIDATIONS: 'validations',
    EDIT_REFERENCE_NAME: 'edit_reference_name',
    TEMPORARY_REFERENCE_NAME: 'temporary_reference_name',
};

export const RESPONSE_FIELD_KEYS = {
    FIELD_NAME: 'fieldName',
    FIELD_TYPE: 'fieldType',
    FIELD_LIST_TYPE: 'fieldListType',
    FLOW_ID: 'flowId',
    IS_GLOBAL_FIELD: 'isGlobalField',
    IS_SAVE: 'isSave',
    TABLE_UUID: 'tableUuid',
    CHOICE_VALUES: 'choiceValues',
    CHOICE_VALUE_TYPE: 'choiceValueType',
    VALUE_METADATA: 'valueMetadata',
    CUSTOM_LOOKUP_ID: 'customLookupId',
    LOOKUP_NAME: 'lookupName',
    IS_DIGIT_FORMATTED: 'isDigitFormatted',
    ALLOW_DECIMAL: 'allowDecimal',
    DATA_LIST_DETAILS: 'dataListDetails',
    DATA_LIST_UUID: 'dataListUuid',
    DISPLAY_FIELDS: 'displayFields',
    ALLOW_MULTIPLE: 'allowMultiple',
    ID: '_id',
    FIELD_UUID: 'fieldUuid',
    COLUMNS: 'columns',
    REFERENCE_NAME: 'referenceName',
    LABEL: 'label',
    PAGINATION_DATA: 'paginationData',
    ADD_ON_FIELD_LABEL: 'addOnFieldLabel',
    DATA_LIST_FIELD_LABEL: 'dataListFieldLabel',
    FIELD_DETAILS: 'fieldDetails',
    DATA_LIST: 'dataList',
    DATA_LIST_NAME: 'dataListName',
    OTHER_FIELD_DETAIL: 'otherFieldDetail',
    VALIDATIONS: 'validations',
    EDIT_REFERENCE_NAME: 'editReferenceName',
    TEMPORARY_REFERENCE_NAME: 'temporaryReferenceName',
};

export const DATA_LISTS_REQUEST_FIELD_KEYS = {
    PAGINATION_DATA: 'pagination_data',
    DATA_LIST_NAME: 'data_list_name',
    DATA_LIST_UUID: 'data_list_uuid',
};

export const DATA_LISTS_RESPONSE_FIELD_KEYS = {
    PAGINATION_DATA: 'paginationData',
    DATA_LIST_NAME: 'dataListName',
    DATA_LIST_UUID: 'dataListUuid',
};

export const TAB_FIELD_DEFAULT_VALIDATIONS = {
    add_new_row: true,
    allow_delete_existing: true,
    allow_modify_existing: true,
    is_maximum_row: false,
    is_minimum_row: false,
    is_pagination: false,
    is_unique_column_available: false,
};

const commonFieldDetails = {
    fieldName: EMPTY_STRING,
    fieldType: EMPTY_STRING,
    fieldUuid: null,
    allowMultiple: false,
    allowDecimal: false,
    dontAllowZero: false,
    isDigitFormatted: false,
    referenceName: EMPTY_STRING,
    isNewField: true,
    editReferenceName: false,
    path: EMPTY_STRING,
    isSave: false,
    isGlobalField: true,
    errorList: {},
    choiceValueType: REQUEST_FIELD_KEYS.TEXT,
    choiceValues: [
        {
            label: EMPTY_STRING,
            value: EMPTY_STRING,
        },
    ],
    valueMetadata: {
        customLookupId: EMPTY_STRING,
    },
    dataListDetails: {
        dataListUuid: null,
        displayFields: [EMPTY_STRING],
    },
    dependencyData: {},
};

export const MANAGE_FLOW_FIELD_INITIAL_STATE = {
    fieldDetails: {
        ...commonFieldDetails,
        fieldListType: FIELD_LIST_TYPE.DIRECT,
        columns: [],
    },
    columnDetails: {
        ...commonFieldDetails,
        fieldListType: FIELD_LIST_TYPE.TABLE,
        tableUuid: null,
    },
    isTableColConfigOpen: false,
    isFieldsLoading: true,
    isDependencyListLoading: false,
    isDependencyModalVisible: false,
    flowId: null,
    fieldsList: [],
    activeAccordionList: [],
    isSaveClicked: false,
};

export const PATHS = {
    DATA_LIST_FIELD: 'displayFields,0',
    ADD_ON_FIELD: 'displayFields,1',
};
