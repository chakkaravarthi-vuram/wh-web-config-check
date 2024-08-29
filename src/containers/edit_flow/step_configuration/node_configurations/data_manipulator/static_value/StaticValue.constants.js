import { compact } from '../../../../../../utils/jsUtility';
import { FIELD_TYPES } from '../../../../manage_flow_fields/ManageFlowFields.constants';

export const FIELD_LIST = (t, isTable = false) => compact([
    {
        value: FIELD_TYPES.SINGLE_LINE,
        label: t('form_field_strings.dropdown_list_text.single_line'),
        isCheck: false,
    },
    {
        value: FIELD_TYPES.PARAGRAPH,
        label: t('form_field_strings.dropdown_list_text.Paragraph'),
        isCheck: false,
    },
    {
        value: FIELD_TYPES.NUMBER,
        label: t('form_field_strings.dropdown_list_text.number'),
        isCheck: false,
    },
    {
        label: t('form_field_strings.dropdown_list_text.yes_or_no'),
        isCheck: false,
        value: FIELD_TYPES.YES_NO,
    },
    {
        label: t('form_field_strings.dropdown_list_text.dropdown'),
        isCheck: false,
        value: FIELD_TYPES.DROPDOWN,
    },
    {
        label: t('form_field_strings.dropdown_list_text.Checkbox'),
        isCheck: false,
        value: FIELD_TYPES.CHECKBOX,
    },
    {
        label: t('form_field_strings.dropdown_list_text.radio'),
        isCheck: false,
        value: FIELD_TYPES.RADIO_GROUP,
    },
    {
        label: t('form_field_strings.dropdown_list_text.custom_dropdown'),
        isCheck: false,
        value: FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
    },
    {
        label: t('form_field_strings.dropdown_list_text.date'),
        isCheck: false,
        value: FIELD_TYPES.DATE,
    },
    {
        label: t('form_field_strings.dropdown_list_text.date_time'),
        isCheck: false,
        value: FIELD_TYPES.DATETIME,
    },
    {
        label: t('form_field_strings.dropdown_list_text.document'),
        isCheck: false,
        value: FIELD_TYPES.FILE_UPLOAD,
    },
    !isTable ? {
        label: t('form_field_strings.dropdown_list_text.table'),
        isCheck: false,
        value: FIELD_TYPES.TABLE,
    } : null,
    {
        label: t('form_field_strings.dropdown_list_text.user_selector'),
        isCheck: false,
        value: FIELD_TYPES.USER_TEAM_PICKER,
    },
    // {
    //     label: t('form_field_strings.dropdown_list_text.user_property_picker'),
    //     isCheck: false,
    //     value: FIELD_TYPES.USER_PROPERTY_PICKER,
    //     disabled: true,
    // },
    {
        label: t('form_field_strings.dropdown_list_text.datalist_selector'),
        isCheck: false,
        value: FIELD_TYPES.DATA_LIST,
    },
    // {
    //     label: t('form_field_strings.dropdown_list_text.datalist_property_picker'),
    //     isCheck: false,
    //     value: FIELD_TYPES.DATA_LIST_PROPERTY_PICKER,
    //     disabled: true,
    // },
    {
        label: t('form_field_strings.dropdown_list_text.email'),
        isCheck: false,
        value: FIELD_TYPES.EMAIL,
    },
    // {
    //     label: t('form_field_strings.dropdown_list_text.phone_number'),
    //     isCheck: false,
    //     value: FIELD_TYPES.PHONE_NUMBER,
    // },
    // {
    //     label: t('form_field_strings.dropdown_list_text.currency'),
    //     isCheck: false,
    //     value: FIELD_TYPES.CURRENCY,
    // },
    // {
    //     label: t('form_field_strings.dropdown_list_text.link'),
    //     isCheck: false,
    //     value: FIELD_TYPES.LINK,
    // },
    // !isTable ? {
    //     label: t('form_field_strings.dropdown_list_text.information'),
    //     isCheck: false,
    //     value: FIELD_TYPES.INFORMATION,
    // } : null,
    {
        label: t('form_field_strings.dropdown_list_text.scanner'),
        isCheck: false,
        value: FIELD_TYPES.SCANNER,
    },
]);
