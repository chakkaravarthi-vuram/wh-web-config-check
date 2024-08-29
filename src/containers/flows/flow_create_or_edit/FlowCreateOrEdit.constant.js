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
import styles from './FlowCreateOrEdit.module.scss';
import ManageFlowFieldsIcon from '../../../assets/icons/flow/ManageFlowFieldsIcon';
import { translateFunction } from '../../../utils/jsUtility';

export const EDIT_FLOW_HEADER_TYPE = {
    DATA: 0,
    SECURITY: 1,
    RELATED_ACTIONS: 2,
    ALL_DATA_REPORT: 3,
    DATA_DASHBOARD: 4,
    LANGUAGE: 5,
};

export const FLOW_CREATE_EDIT_CONSTANTS = (t = translateFunction) => {
    return {
        HEADER: {
            CREATE_FLOW: t('flow_create_edit.header.create_flow'),
            EDIT_FLOW: t('flow_create_edit.header.edit_flow'),
            SAVE_CLOSE: t('data_lists.datalist_create_edit.header.save_and_close'),
            PUBLISH: t('data_lists.datalist_create_edit.header.publish'),
        },
        HEADER_POPPER_OPTIONS: [
            {
                label: t('data_lists.datalist_create_edit.header.edit_name_and_descritpion'),
                value: 1,
                icon: <BasicDetailsIcon style={{ width: 16, height: 16 }} />,
                optionLabelClassName: styles.OptionLabelClass,
            }, {
                label: t('data_lists.datalist_landing.datalist_header.header_options.manage_fields'),
                value: 4,
                icon: <ManageFlowFieldsIcon />,
                optionLabelClassName: styles.OptionLabelClass,
            }, {
                label: t('data_lists.datalist_landing.datalist_header.header_options.discard'),
                value: 2,
                icon: <DiscardIcon />,
                optionLabelClassName: styles.OptionLabelClass,
            }, {
                label: t('data_lists.datalist_landing.datalist_header.header_options.delete'),
                value: 3,
                icon: <Trash />,
                optionLabelClassName: styles.OptionLabelClass,
            },
        ],
        TAB_STEPPER: [
            {
                labelText: t('data_lists.datalist_create_edit.header.tab_options.capture_data'),
                value: EDIT_FLOW_HEADER_TYPE.DATA,
                tabIndex: EDIT_FLOW_HEADER_TYPE.DATA,
                Icon: CaptureDataIcon,
            },
            {
                labelText: t('data_lists.datalist_create_edit.header.tab_options.set_security'),
                value: EDIT_FLOW_HEADER_TYPE.SECURITY,
                tabIndex: EDIT_FLOW_HEADER_TYPE.SECURITY,
                Icon: SetSecurityIcon,
            },
            {
                labelText: t('data_lists.datalist_create_edit.header.tab_options.related_actions'),
                value: EDIT_FLOW_HEADER_TYPE.RELATED_ACTIONS,
                tabIndex: EDIT_FLOW_HEADER_TYPE.RELATED_ACTIONS,
                Icon: RelatedActionIcon,
            },
            {
                labelText: t('data_lists.datalist_create_edit.header.tab_options.all_data_report'),
                value: EDIT_FLOW_HEADER_TYPE.ALL_DATA_REPORT,
                tabIndex: EDIT_FLOW_HEADER_TYPE.ALL_DATA_REPORT,
                Icon: AllReportIcon,
            },
            {
                labelText: t('data_lists.datalist_create_edit.header.tab_options.data_dashboard'),
                value: EDIT_FLOW_HEADER_TYPE.DATA_DASHBOARD,
                tabIndex: EDIT_FLOW_HEADER_TYPE.DATA_DASHBOARD,
                Icon: DataDashboardIcon,
            },
            {
                labelText: t('data_lists.datalist_create_edit.header.tab_options.language_and_others'),
                value: EDIT_FLOW_HEADER_TYPE.LANGUAGE,
                tabIndex: EDIT_FLOW_HEADER_TYPE.LANGUAGE,
                Icon: LanguageOthersIcon,
            },
        ],
        SECURITY: {
            DATALIST_SECURITY: t('data_lists.datalist_create_edit.security.data_security'),
            ADD_NEW_DATA: t('data_lists.datalist_create_edit.security.add_new_data'),
            EDIT_DATA: t('data_lists.datalist_create_edit.security.edit_data'),
            EDIT_DATA_SAME_AS: t('data_lists.datalist_create_edit.security.edit_data_same_as'),
            EDIT_DATA_SPECIFIED: t('data_lists.datalist_create_edit.security.edit_data_specified'),
            DELETE_DATA: t('data_lists.datalist_create_edit.security.delete_data'),
            VIEW_DATA_SECURITY: t('data_lists.datalist_create_edit.security.view_data_security'),
            VIEW_ALL_DATA: t('data_lists.datalist_create_edit.security.view_all_data'),
            SECURITY_SUMMARY: t('data_lists.datalist_create_edit.security.security_summary'),
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
        },
        NO_DATA_FOUND: t('no_data_found_strings.title'),
        ERRORS: {
            UNIQUE_IDENTIFIER_DELETED: t('flow_create_edit.errors.unique_identifier_deleted'),
            TASK_IDENTIFIER_DELETED: t('flow_create_edit.errors.task_identifier_deleted'),
            FLOW_SHORT_CODE_REQUIRED: t('flow_create_edit.errors.flow_short_code_required'),
            TASK_REFERENCE_NAME_REQUIRED: t('flow_create_edit.errors.task_reference_name_required'),
            SAVE_FLOW_FAIL_TITLE: t('flow_create_edit.errors.save_flow_fail_title'),
            SAVE_FLOW_FAIL_SUBTITLE: t('flow_create_edit.errors.save_flow_fail_subtitle'),
            VALIDATE_FLOW_TITLE: t('flow_create_edit.errors.validate_flow_title'),
            VALIDATE_FLOW_SUBTITLE: t('flow_create_edit.errors.validate_flow_subtitle'),
            OWNERS_REQUIRED: t('flow_create_edit.errors.owners_required'),
        },
        TOAST_MESSAGES: {
            FLOW_PUBLISHED: t('flow_create_edit.toast_message.flow_published'),
            FLOW_SAVED: t('flow_create_edit.toast_message.flow_saved'),
        },
    };
};

export const VALIDATE_FLOW_HEADER_KEY_MAP = {
  flow_details: EDIT_FLOW_HEADER_TYPE.DATA,
  security: EDIT_FLOW_HEADER_TYPE.SECURITY,
  related_actions: EDIT_FLOW_HEADER_TYPE.RELATED_ACTIONS,
  all: EDIT_FLOW_HEADER_TYPE.ALL_DATA_REPORT,
  report: EDIT_FLOW_HEADER_TYPE.ALL_DATA_REPORT,
  dashboard: EDIT_FLOW_HEADER_TYPE.DATA_DASHBOARD,
  add_on_config: EDIT_FLOW_HEADER_TYPE.LANGUAGE,
};
export const LANGUAGE_AND_OTHERS = (t) => {
    return {
        CHECKBOX_OPTIONS: {
            label: t('data_lists.datalist_landing.datalist_details.language_and_others.identifier.unique_identifier.system_generated.options.label'),
            value: 'isSystemIdentifier',
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
        ADD_FIELD: t('common_strings.add_field'),
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

export const FLOW_SECURITY_CONSTANTS = (t = translateFunction) => {
    return {
      ADMINS: 'admins',
      OWNERS: 'owners',
      INITIATORS: 'initiators',
      ENTITY_VIEWERS: 'entityViewers',
      POLICY: 'policy',
      IS_PARTICIPANTS_LEVEL_SECURITY: 'isParticipantsLevelSecurity',
      VIEWERS: 'viewers',
      IS_ROW_SECURITY_POLICY: 'isRowSecurityPolicy',

      ADMINISTRATIVE_PERMISSIONS: t('data_lists.datalist_landing.datalist_details.datalist_security.administrative_permissions'),
      FLOW_ADMINS: t('flow_create_edit.security.flow_admins'),
      FLOW_OWNERS: t('flow_create_edit.security.flow_owners'),
      FLOW_INITIATORS: t('flow_create_edit.security.flow_initiators'),
      OWNERS_TOOLTIP: t('data_lists.datalist_create_edit.security.owners_tooltip'),
      ADMINS_TOOLTIP: t('data_lists.datalist_create_edit.security.admins_tooltip'),
      DATA_SECURITY: t('data_lists.datalist_create_edit.security.data_security'),
      DATA_ACCESS_PERMISSIONS: t('data_lists.datalist_landing.datalist_details.datalist_security.data_access_permissions'),
      PERMISSION_OPTIONS: [
        {
          label: t('publish_settings.security_settings.datalist_security.option_list.tight_security'),
          value: true,
        },
        { label: t('publish_settings.security_settings.datalist_security.option_list.open_security'), value: false },
      ],

      VIEW_PERMISSION: t('data_lists.datalist_create_edit.security.view_data_security'),
      TO_START_FLOW: t('flow_strings.step_configuration.start_step.general.initiators.alt_label'),

      VIEW_ALL_DATA_LABEL: t('data_lists.datalist_create_edit.security.view_all_data'),
      TRIGGER: {
        ID: 'hasAutoTrigger',
        LABEL: t('flow_strings.step_configuration.start_step.general.trigger.label'),
        OPTIONS: [
            {
                label: t('flow_strings.step_configuration.start_step.general.trigger.options.no_option_label'),
                value: false,
            },
            {
                label: t('flow_strings.step_configuration.start_step.general.trigger.options.yes_option_label'),
                value: true,
            },
        ],
      },
    };
};

export const FLOW_RELATED_ACTIONS = (t = translateFunction) => {
    return {
      SUB_FLOWS_TITLE: t('data_lists.datalist_create_edit.user_actions.title'),
      NO_SUB_FLOWS_FOUND: t('data_lists.datalist_create_edit.datalist_user_systems.no_sub_flows_found'),
      ADD_SUB_FLOW: t('data_lists.datalist_create_edit.datalist_user_systems.add_sub_flow'),
      SUB_FLOW_TABLE_HEADER: [
        {
          label: t('data_lists.datalist_create_edit.user_actions.sub_flow_name'),
        },
        {
          label: t('data_lists.datalist_create_edit.user_actions.trigger_label'),
        },
        {},
      ],
    };
};
