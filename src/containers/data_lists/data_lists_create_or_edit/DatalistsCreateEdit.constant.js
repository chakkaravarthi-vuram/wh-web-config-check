import React from 'react';
import Trash from '../../../assets/icons/application/Trash';
import DiscardIcon from '../../../assets/icons/datalists/DiscardIcon';
import AllReportIcon from '../../../assets/icons/datalists/stepper/AllReportIcon';
import CaptureDataIcon from '../../../assets/icons/datalists/stepper/CaptureDataIcon';
import DataDashboardIcon from '../../../assets/icons/datalists/stepper/DataDashboardIcon';
import LanguageOthersIcon from '../../../assets/icons/datalists/stepper/LanguageOthersIcon';
import RelatedActionIcon from '../../../assets/icons/datalists/stepper/RelatedActionIcon';
import SetSecurityIcon from '../../../assets/icons/datalists/stepper/SetSecurityIcon';
import BasicDetailsIcon from '../../../assets/icons/teams/BasicDetailsIcon';
import styles from './DatalistsCreateEdit.module.scss';
import jsUtility from '../../../utils/jsUtility';
import { FIELD_TYPE } from '../../../utils/constants/form.constant';

export const EDIT_DATALIST_HEADER_TYPE = {
    DATA: 1,
    SECURITY: 2,
    ALL_DATA_REPORT: 3,
    DATA_DASHBOARD: 4,
    RELATED_ACTIONS: 5,
    ADD_ON: 6,
    DATA_AUDIT: 7,
};

export const ERROR_LIST_TYPE = {
    FORM: 'form_error',
    SECURITY: 'security_error',
    ADD_ON: 'add_on_error',
    BASIC_DETAILS: 'basic_details_error',
    DATA_REPORT: 'data_report_error',
    INDIVIDUAL_ENTRY: 'individual_entry_error',
};

export const DATALISTS_CREATE_EDIT_CONSTANTS = (t) => {
    return {
        HEADER: {
            CREATE_DATALIST: t('data_lists.datalist_create_edit.header.create_datalist'),
            EDIT_DATALIST: t('data_lists.datalist_create_edit.header.edit_datalist'),
            SAVE_CLOSE: t('data_lists.datalist_create_edit.header.save_and_close'),
            PUBLISH: t('data_lists.datalist_create_edit.header.publish'),
        },
        HEADER_POPPER_OPTIONS: (version, isUsersDatalist) => jsUtility.compact([
            {
                label: t('data_lists.datalist_create_edit.header.edit_name_and_descritpion'),
                value: 1,
                icon: <BasicDetailsIcon style={{ width: 16, height: 16 }} />,
                optionLabelClassName: styles.OptionLabelClass,
            }, (version > 1) ? {
                label: t('data_lists.datalist_landing.datalist_header.header_options.discard'),
                value: 2,
                icon: <DiscardIcon />,
                optionLabelClassName: styles.OptionLabelClass,
            } : null,
            (!isUsersDatalist) ? {
                label: t('data_lists.datalist_landing.datalist_header.header_options.delete'),
                value: 3,
                icon: <Trash />,
                optionLabelClassName: styles.OptionLabelClass,
            } : null,
        ]),
        TAB_STEPPER: (errorTabs) => [
            {
                labelText: t('data_lists.datalist_create_edit.header.tab_options.capture_data'),
                value: EDIT_DATALIST_HEADER_TYPE.DATA,
                tabIndex: EDIT_DATALIST_HEADER_TYPE.DATA,
                Icon: CaptureDataIcon,
                hasError: errorTabs.includes(EDIT_DATALIST_HEADER_TYPE.DATA),
            },
            {
                labelText: t('data_lists.datalist_create_edit.header.tab_options.set_security'),
                value: EDIT_DATALIST_HEADER_TYPE.SECURITY,
                tabIndex: EDIT_DATALIST_HEADER_TYPE.SECURITY,
                Icon: SetSecurityIcon,
                hasError: errorTabs.includes(EDIT_DATALIST_HEADER_TYPE.SECURITY),
            },
            {
                labelText: t('data_lists.datalist_create_edit.header.tab_options.related_actions'),
                value: EDIT_DATALIST_HEADER_TYPE.RELATED_ACTIONS,
                tabIndex: EDIT_DATALIST_HEADER_TYPE.RELATED_ACTIONS,
                Icon: RelatedActionIcon,
                hasError: errorTabs.includes(EDIT_DATALIST_HEADER_TYPE.RELATED_ACTIONS),
            },
            {
                labelText: t('data_lists.datalist_create_edit.header.tab_options.all_data_report'),
                value: EDIT_DATALIST_HEADER_TYPE.ALL_DATA_REPORT,
                tabIndex: EDIT_DATALIST_HEADER_TYPE.ALL_DATA_REPORT,
                Icon: AllReportIcon,
                hasError: errorTabs.includes(EDIT_DATALIST_HEADER_TYPE.ALL_DATA_REPORT),
            },
            {
                labelText: t('data_lists.datalist_create_edit.header.tab_options.data_dashboard'),
                value: EDIT_DATALIST_HEADER_TYPE.DATA_DASHBOARD,
                tabIndex: EDIT_DATALIST_HEADER_TYPE.DATA_DASHBOARD,
                Icon: DataDashboardIcon,
                hasError: errorTabs.includes(EDIT_DATALIST_HEADER_TYPE.DATA_DASHBOARD),
            },
            {
                labelText: t('data_lists.datalist_create_edit.header.tab_options.language_and_others'),
                value: EDIT_DATALIST_HEADER_TYPE.ADD_ON,
                tabIndex: EDIT_DATALIST_HEADER_TYPE.ADD_ON,
                Icon: LanguageOthersIcon,
                hasError: errorTabs.includes(EDIT_DATALIST_HEADER_TYPE.ADD_ON),
            },
            // {
            //     labelText: t('data_lists.datalist_create_edit.header.tab_options.data_audit'),
            //     value: EDIT_DATALIST_HEADER_TYPE.DATA_AUDIT,
            //     tabIndex: EDIT_DATALIST_HEADER_TYPE.DATA_AUDIT,
            //     Icon: LanguageOthersIcon,
            // },
        ],
        SECURITY: {
            DATALIST_SECURITY: t('data_lists.datalist_create_edit.security.data_security'),
            ADD_NEW_DATA: t('data_lists.datalist_create_edit.security.add_new_data'),
            EDIT_DATA: t('data_lists.datalist_create_edit.security.edit_data'),
            EDIT_DATA_SAME_AS: t('data_lists.datalist_create_edit.security.edit_data_same_as'),
            EDIT_DATA_SPECIFIED: t('data_lists.datalist_create_edit.security.edit_data_specified'),
            DELETE_DATA: t('data_lists.datalist_create_edit.security.delete_data'),
            DELETE_DATA_SAME_AS: t('data_lists.datalist_create_edit.security.delete_data_same_as'),
            VIEW_DATA_SECURITY: t('data_lists.datalist_create_edit.security.view_data_security'),
            VIEW_ALL_DATA: t('data_lists.datalist_create_edit.security.view_all_data'),
            OWNERS_TOOLTIP: t('data_lists.datalist_create_edit.security.owners_tooltip'),
            ADMINS_TOOLTIP: t('data_lists.datalist_create_edit.security.admins_tooltip'),
            SECURITY_SUMMARY: t('data_lists.datalist_create_edit.security.security_summary'),
            ADMINISTRATIVE_PERMISSIONS: t('data_lists.datalist_landing.datalist_details.datalist_security.administrative_permissions'),
            USER_PERMISSIONS: t('data_lists.datalist_landing.datalist_details.datalist_security.user_permissions'),
            ADVANCED_DATA_SECURITY: t('data_lists.datalist_landing.datalist_details.datalist_security.advanced_data_security'),
            SECURITY_SUMMARY_HEADER: [
                { label: t('data_lists.datalist_create_edit.security.security_summary_header_options.user_or_team') },
                { label: t('data_lists.datalist_create_edit.security.security_summary_header_options.security_source') },
                { label: t('data_lists.datalist_create_edit.security.security_summary_header_options.view') },
                { label: t('data_lists.datalist_create_edit.security.security_summary_header_options.add') },
                { label: t('data_lists.datalist_create_edit.security.security_summary_header_options.edit') },
                { label: t('data_lists.datalist_create_edit.security.security_summary_header_options.delete') },
            ],
            ENTRIES_OPTIONS: [
                {
                    value: true, // all entries
                    label: t('data_lists.datalist_landing.datalist_details.datalist_security.edit_entry.same_as_add_entry.options.all_entries_label'),
                },
                {
                    value: false, // only their entries
                    label: t('data_lists.datalist_landing.datalist_details.datalist_security.edit_entry.same_as_add_entry.options.added_entries_only_label'),
                },
            ],
            DATA_SECURITY: {
                LABEL: t('data_lists.datalist_landing.datalist_details.datalist_security.data_access_permissions'),
                OPTION_LIST: [
                    {
                        value: true, // value changed to true from false after var name change from open visibility to is row level security
                        label: t('publish_settings.security_settings.datalist_security.option_list.tight_security'),
                    },
                    {
                        value: false, // value changed to false from true after var name change from open visibility to is row level security
                        label: t('publish_settings.security_settings.datalist_security.option_list.open_security'),
                    },
                ],
            },
        },
        SUB_FLOW_ACTIONS: {
            SUB_FLOW_TRIGGER_BY_USER: t('data_lists.datalist_create_edit.sub_flow_actions.sub_flow_trigger_by_user'),
            SUB_FLOW_HEADER: {
                SUB_FLOW_NAME: t('data_lists.datalist_create_edit.sub_flow_actions.sub_flow_header.sub_flow_name'),
                TRIGGER_LABEL: t('data_lists.datalist_create_edit.sub_flow_actions.sub_flow_header.trigger_label'),
                PERMISION: t('data_lists.datalist_create_edit.sub_flow_actions.sub_flow_header.permision'),
            },
            ADD_SUB_FLOW: t('data_lists.datalist_create_edit.sub_flow_actions.add_sub_flow'),
            AUTOMATED_SYSTEM_ACTIONS: t('data_lists.datalist_create_edit.sub_flow_actions.automated_system_actions'),
            AUTOMATED_HEADER: {
                ACTION_TYPER: t('data_lists.datalist_create_edit.sub_flow_actions.automated_header.action_typer'),
                TRIGGER_DATA: t('data_lists.datalist_create_edit.sub_flow_actions.automated_header.trigger_data'),
                SYSTEM_ACTION: t('data_lists.datalist_create_edit.sub_flow_actions.automated_header.system_action'),
                FREQUENCY: t('data_lists.datalist_create_edit.sub_flow_actions.automated_header.frequency'),
            },
            ADD_AUTOMATED_SYSTEMS: t('data_lists.datalist_create_edit.sub_flow_actions.add_automated_systems'),
        },
        NO_DATA_FOUND: t('no_data_found_strings.title'),
    };
};
export const LANGUAGE_AND_OTHERS = (t) => {
    return {
        CHECKBOX_OPTIONS: {
            label: t('data_lists.datalist_landing.datalist_details.language_and_others.identifier.unique_identifier.system_generated.options.label'),
            value: 'isSystemIdentifier',
        },
        IGNORE_NULL_CHECKBOX: {
            label: t('data_lists.datalist_create_edit.language_and_others.ignore_null_values'),
            value: 'isIgnoreNull',
        },
        STEP_NAME: t('data_lists.datalist_create_edit.language_and_others.step_name'),
        TRANSLATE_AGAIN: t('data_lists.datalist_create_edit.language_and_others.translate_again'),
        TRANSLATE: t('data_lists.datalist_create_edit.language_and_others.translate'),
        LANGUAGE_HEADERS: [
            { label: t('data_lists.datalist_create_edit.language_and_others.langauge_headers.language') },
            { label: t('data_lists.datalist_create_edit.language_and_others.langauge_headers.translate_status') },
            { label: '' },
        ],
        CREATE_NEW: t('data_lists.datalist_create_edit.language_and_others.create_new'),
        TECHNICAL_CONFIGURATION: {
            TITLE: t('data_lists.datalist_create_edit.language_and_others.technical_configuration.title'),
            SHORT_CODE: {
                LABEL: t('data_lists.datalist_create_edit.language_and_others.technical_configuration.short_code.label'),
            },
            TECHNICAL_REFERENCE_NAME: {
                LABEL: t('data_lists.datalist_create_edit.language_and_others.technical_configuration.technical_reference_name.label'),
                INSTRUCTION: t('data_lists.datalist_create_edit.language_and_others.technical_configuration.technical_reference_name.instruction'),
            },
        },
    };
};

export const DATALIST_SECURITY_CONSTANTS = {
    ADD_SECURITY: 'addSecurity',
    EDIT_SECURITY: 'editSecurity',
    DELETE_SECURITY: 'deleteSecurity',
    VIEWERS: 'viewers',
    SAME_AS_ADD: 'sameAsAdd',
    IS_ALL_ENTRIES: 'isAllEntries',
    SPECIFIED_MEMBERS: 'specifiedMembers',
};

export const CUSTOM_IDENTIFIER_EXCLUDE_FIELDS_PARAMS = [
    FIELD_TYPE.PARAGRAPH,
    FIELD_TYPE.FILE_UPLOAD,
    FIELD_TYPE.CHECKBOX,
    FIELD_TYPE.YES_NO,
    FIELD_TYPE.LINK,
    FIELD_TYPE.INFORMATION,
    FIELD_TYPE.USER_TEAM_PICKER,
    FIELD_TYPE.DATA_LIST,
    FIELD_TYPE.CUSTOM_LOOKUP_CHECKBOX,
    FIELD_TYPE.USER_PROPERTY_PICKER,
    FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
    FIELD_TYPE.TABLE,
];

export const UNIQUE_FIELD_EXCLUDE_FIELDS_PARAMS = [
    ...CUSTOM_IDENTIFIER_EXCLUDE_FIELDS_PARAMS,
    FIELD_TYPE.CURRENCY,
    FIELD_TYPE.SCANNER,
    FIELD_TYPE.DROPDOWN,
    FIELD_TYPE.RADIO_GROUP,
    FIELD_TYPE.CASCADING,
    FIELD_TYPE.CUSTOM_LOOKUP_RADIOBUTTON,
    FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
];

export const IDENTIFIER_TYPES = {
    CUSTOM_IDENTIFIER: 'custom_identifier',
    UNIQUE_FIELD: 'unique_field',
    TASK_IDENTIFIER: 'task_identifier',
};
