import CheckboxIcon from '../../../../assets/icons/form_field_icons_v2/CheckboxIcon';
import DataListPropertyPickerIcon from '../../../../assets/icons/form_field_icons_v2/DataListPropertyPicker';
import DataListSelectorIcon from '../../../../assets/icons/form_field_icons_v2/DataListSelectorIcon';
import EmailIcon from '../../../../assets/icons/form_field_icons_v2/EmailIcon';
import DateIcon from '../../../../assets/icons/form_field_icons_v2/DateIcon';
import DateTimeIcon from '../../../../assets/icons/form_field_icons_v2/DateTimeIcon';
import DropdownIcon from '../../../../assets/icons/form_field_icons_v2/DropdownIcon';
import LookupIcon from '../../../../assets/icons/form_field_icons_v2/LookupIcon';
import NumberIcon from '../../../../assets/icons/form_field_icons_v2/NumberIcon';
import ParagraphIcon from '../../../../assets/icons/form_field_icons_v2/ParagraphIcon';
import RadioIcon from '../../../../assets/icons/form_field_icons_v2/RadioIcon';
import SingleLineIcon from '../../../../assets/icons/form_field_icons_v2/SingleLineIcon';
import TableIcon from '../../../../assets/icons/form_field_icons_v2/TableIcon';
import UserPropertyPickerIcon from '../../../../assets/icons/form_field_icons_v2/UserPropertyPickerIcon';
import UserSelectorIcon from '../../../../assets/icons/form_field_icons_v2/UserSelectorIcon';
import YesOrNoIcon from '../../../../assets/icons/form_field_icons_v2/YesOrNoIcon';
import { translateFunction } from '../../../../utils/jsUtility';
import PhoneIcon from '../../../../assets/icons/form_field_icons_v2/PhoneIcon';
import CurrencyIcon from '../../../../assets/icons/form_field_icons_v2/CurrencyIcon';
import LinkIcon from '../../../../assets/icons/form_field_icons_v2/LinkIcon';
import InfoIcon from '../../../../assets/icons/form_field_icons_v2/InfoIcon';
import ScannerIcon from '../../../../assets/icons/form_field_icons_v2/ScannerIcon';
import { FIELD_TYPE } from '../../../../utils/constants/form.constant';
import DocumentUploadIcon from '../../../../assets/icons/form_field_icons_v2/DocumentUploadIcon';
// import { FORM_LAYOUT_TYPE } from '../../Form.string';

export const FORM_FIELD_LIST_STRINGS = (t = translateFunction) => {
    return {
        SEARCH: {
            ID: 'search_field',
            PLACEHOLDER: t('form_field_strings.field_search.placeholder'),
            NO_FIELDS_ON_SEARCH: t('teams.no_search_team_data.title'),
            TRY_SEARCHING: t('teams.no_search_team_data.subtitle'),
        },
        FIELD_LIST: {
            'Text Fields': [
                {
                    elementName: t('form_field_strings.dropdown_list_text.single_line'),
                    elementDesc: t('form_field_strings.dropdown_list_text.single_line_text'),
                    icon: SingleLineIcon,
                    type: FIELD_TYPE.SINGLE_LINE,
                },
                {
                    elementName: t('form_field_strings.dropdown_list_text.Paragraph'),
                    elementDesc: t('form_field_strings.dropdown_list_text.Paragraph_text'),
                    icon: ParagraphIcon,
                    type: FIELD_TYPE.PARAGRAPH,
                },
                {
                    elementName: t('form_field_strings.dropdown_list_text.number'),
                    elementDesc: t('form_field_strings.dropdown_list_text.number_text'),
                    icon: NumberIcon,
                    type: FIELD_TYPE.NUMBER,
                },
            ],
            'Selection Fields': [
                {
                    elementName: t('form_field_strings.dropdown_list_text.yes_or_no'),
                    elementDesc: t('form_field_strings.dropdown_list_text.yes_or_no_text'),
                    icon: YesOrNoIcon,
                    type: FIELD_TYPE.YES_NO,
                },
                {
                    elementName: t('form_field_strings.dropdown_list_text.dropdown'),
                    elementDesc: t('form_field_strings.dropdown_list_text.dropdown_text'),
                    icon: DropdownIcon,
                    type: FIELD_TYPE.DROPDOWN,
                },
                {
                    elementName: t('form_field_strings.dropdown_list_text.Checkbox'),
                    elementDesc: t('form_field_strings.dropdown_list_text.checkbox_text'),
                    icon: CheckboxIcon,
                    type: FIELD_TYPE.CHECKBOX,
                },
                {
                    elementName: t('form_field_strings.dropdown_list_text.radio'),
                    elementDesc: t('form_field_strings.dropdown_list_text.radio_text'),
                    icon: RadioIcon,
                    type: FIELD_TYPE.RADIO_GROUP,
                },
                {
                    elementName: t('form_field_strings.dropdown_list_text.custom_dropdown'),
                    elementDesc: t('form_field_strings.dropdown_list_text.custom_dropdown_text'),
                    icon: LookupIcon,
                    type: FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
                },
            ],
            'Date Fields': [
                {
                    elementName: t('form_field_strings.dropdown_list_text.date'),
                    elementDesc: t('form_field_strings.dropdown_list_text.date_text'),
                    icon: DateIcon,
                    type: FIELD_TYPE.DATE,
                },
                {
                    elementName: t('form_field_strings.dropdown_list_text.date_time'),
                    elementDesc: t('form_field_strings.dropdown_list_text.date_time_text'),
                    icon: DateTimeIcon,
                    type: FIELD_TYPE.DATETIME,
                },
            ],
            'Media Fields': [
                {
                    elementName: t('form_field_strings.dropdown_list_text.document'),
                    elementDesc: t('form_field_strings.dropdown_list_text.document_text'),
                    icon: DocumentUploadIcon,
                    type: FIELD_TYPE.FILE_UPLOAD,
                },
            ],
            'Layout Fields': [
                {
                    elementName: t('form_field_strings.dropdown_list_text.table'),
                    elementDesc: t('form_field_strings.dropdown_list_text.table_text'),
                    icon: TableIcon,
                    type: FIELD_TYPE.TABLE,
                },
                // {
                //     elementName: 'Box Layout',
                //     elementDesc: 'A container to wrap multiple elements together',
                //     icon: TableIcon,
                //     type: FORM_LAYOUT_TYPE.LAYOUT,
                //     layoutType: FORM_LAYOUT_TYPE.BOX,
                // },
            ],
            'Data Reference Fields': [
                {
                    elementName: t('form_field_strings.dropdown_list_text.user_selector'),
                    elementDesc: t('form_field_strings.dropdown_list_text.user_selector_text'),
                    icon: UserSelectorIcon,
                    type: FIELD_TYPE.USER_TEAM_PICKER,
                },
                {
                    elementName: t('form_field_strings.dropdown_list_text.user_property_picker'),
                    elementDesc: t('form_field_strings.dropdown_list_text.user_property_picker_text'),
                    icon: UserPropertyPickerIcon,
                    type: FIELD_TYPE.USER_PROPERTY_PICKER,
                },
                {
                    elementName: t('form_field_strings.dropdown_list_text.datalist_selector'),
                    elementDesc: t('form_field_strings.dropdown_list_text.datalist_selector_text'),
                    icon: DataListSelectorIcon,
                    type: FIELD_TYPE.DATA_LIST,
                },
                {
                    elementName: t('form_field_strings.dropdown_list_text.datalist_property_picker'),
                    elementDesc: t('form_field_strings.dropdown_list_text.datalist_property_picker_text'),
                    icon: DataListPropertyPickerIcon,
                    type: FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
                },
            ],
            'Other Fields': [
                {
                    elementName: t('form_field_strings.dropdown_list_text.email'),
                    elementDesc: t('form_field_strings.dropdown_list_text.email_text'),
                    icon: EmailIcon,
                    type: FIELD_TYPE.EMAIL,
                },
                {
                    elementName: t('form_field_strings.dropdown_list_text.phone_number'),
                    elementDesc: t('form_field_strings.dropdown_list_text.phone_number_text'),
                    icon: PhoneIcon,
                    type: FIELD_TYPE.PHONE_NUMBER,
                },
                {
                    elementName: t('form_field_strings.dropdown_list_text.currency'),
                    elementDesc: t('form_field_strings.dropdown_list_text.currency_text'),
                    icon: CurrencyIcon,
                    type: FIELD_TYPE.CURRENCY,
                },
                {
                    elementName: t('form_field_strings.dropdown_list_text.link'),
                    elementDesc: t('form_field_strings.dropdown_list_text.link_text'),
                    icon: LinkIcon,
                    type: FIELD_TYPE.LINK,
                },
                {
                    elementName: t('form_field_strings.dropdown_list_text.information'),
                    elementDesc: t('form_field_strings.dropdown_list_text.information_text'),
                    icon: InfoIcon,
                    type: FIELD_TYPE.INFORMATION,
                },
                {
                    elementName: t('form_field_strings.dropdown_list_text.scanner'),
                    elementDesc: t('form_field_strings.dropdown_list_text.scanner_subtext'),
                    icon: ScannerIcon,
                    type: FIELD_TYPE.SCANNER,
                },
            ],
        },
        TAB_OPTIONS: [
            {
                labelText: t('flows.form_field_design.form_fields_title'),
                value: 1,
                tabIndex: 1,
                isEditable: false,
            },
            {
                labelText: t('create_team_users.suggestions'),
                value: 2,
                tabIndex: 2,
                isEditable: false,
            },
        ],
    };
};
