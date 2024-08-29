import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import Trash from '../../../assets/icons/application/Trash';
import DiscardIcon from '../../../assets/icons/datalists/DiscardIcon';
import { HOME, LIST_FLOW, ALL_PUBLISHED_FLOWS } from '../../../urls/RouteConstants';
import { getRouteLink } from '../../../utils/UtilityFunctions';
import { CHARACTERS_STRING, DESCRIPTION_PLACEHOLDER_PART1, NAME_PLACEHOLDER_PART1 } from '../../../utils/strings/CommonStrings';
import { APP_MIN_MAX_CONSTRAINT } from '../../../utils/Constants';
import jsUtility from '../../../utils/jsUtility';

export const FLOW_HEADER_TYPE = {
    SUMMARY: 'summary',
    DATA: 'data',
    SECURITY: 'security',
    LANGUAGE: 'language',
    ALL_DATA_REPORT: 'report',
    DATA_DASHBOARD: 'dashboard',
    RELATED_ACTIONS: 'actions',
};

const FLOW_CONSTANTS = (t) => {
    return {
        BREADCRUMB: {
            HOME: t('data_lists.datalist_landing.datalist_header.breadcrumb.home'),
            DATALISTS: t('data_lists.datalist_landing.datalist_header.breadcrumb.data_lists'),
            FLOW: 'Flow',
        },
        DRAFT_LABEL: t('data_lists.datalist_landing.datalist_header.draft'),
        DRAFT: 'unpublished',
        PUBLISHED_LABEL: t('data_lists.datalist_landing.datalist_header.published'),
        PUBLISHED: 'published',
        HEADER_OPTIONS: (showDraft) => jsUtility.compact([
            (showDraft) ? {
                label: t('data_lists.datalist_landing.datalist_header.header_options.discard'),
                value: 1,
                icon: <DiscardIcon />,
            } : null, {
                label: t('data_lists.datalist_landing.datalist_header.header_options.delete'),
                value: 2,
                icon: <Trash />,
            },
        ]),
        FLOW_HEADER_TAB: [
            {
                labelText: t('data_lists.datalist_landing.datalist_header.datalist_tabs.summary'),
                value: FLOW_HEADER_TYPE.SUMMARY,
                tabIndex: 1,
            },
            // {
            //     labelText: t('data_lists.datalist_landing.datalist_header.datalist_tabs.data'),
            //     value: FLOW_HEADER_TYPE.DATA,
            //     tabIndex: 2,
            // },
            {
                labelText: t('data_lists.datalist_landing.datalist_header.datalist_tabs.security'),
                value: FLOW_HEADER_TYPE.SECURITY,
                tabIndex: 3,
            }, {
                labelText: t('data_lists.datalist_landing.datalist_header.datalist_tabs.related_actions'),
                value: FLOW_HEADER_TYPE.RELATED_ACTIONS,
                tabIndex: 4,
            }, {
                labelText: t('data_lists.datalist_landing.datalist_header.datalist_tabs.all_data_report'),
                value: FLOW_HEADER_TYPE.ALL_DATA_REPORT,
                tabIndex: 5,
            }, {
                labelText: t('data_lists.datalist_landing.datalist_header.datalist_tabs.data_dashboard'),
                value: FLOW_HEADER_TYPE.DATA_DASHBOARD,
                tabIndex: 6,
            }, {
                labelText: t('data_lists.datalist_landing.datalist_header.datalist_tabs.language_and_others'),
                value: FLOW_HEADER_TYPE.LANGUAGE,
                tabIndex: 7,
            },
        ],
        DATALIST_DETAILS_TAB: [
            {
                labelText: 'Summary',
                value: 1,
                tabIndex: 1,
                isEditable: false,
            },
            {
                labelText: 'Data Content',
                value: 2,
                tabIndex: 2,
                isEditable: false,
            },
            {
                labelText: 'Data Security',
                value: 3,
                tabIndex: 3,
                isEditable: false,
            },
            {
                labelText: 'Report & Dashboard',
                value: 4,
                tabIndex: 4,
                isEditable: false,
            },
            {
                labelText: 'User & System Action',
                value: 5,
                tabIndex: 5,
                isEditable: false,
            },
            {
                labelText: 'Add On Settings ',
                value: 6,
                tabIndex: 6,
                isEditable: false,
            },
        ],
        DATALIST_DEPENDANT_APPS_STATUS: {
            APP_NAME: t('data_lists.datalist_landing.datalist_details.datalist_summary.dependant_app_status.app_name'),
            UPDATED_BY: t('data_lists.datalist_landing.datalist_details.datalist_summary.dependant_app_status.updated_by'),
            STATUS: t('data_lists.datalist_landing.datalist_details.datalist_summary.dependant_app_status.status'),
        },
        DATALIST_SUMMARY: {
            NAME: t('data_lists.datalist_landing.datalist_details.datalist_summary.name'),
            DESCRIPTION: t('data_lists.datalist_landing.datalist_details.datalist_summary.description'),
            DEV_OR_ADMIN: t('data_lists.datalist_landing.datalist_details.datalist_summary.dev_or_admin'),
            BUSINESS_OR_DATA_MANAGER: t('data_lists.datalist_landing.datalist_details.datalist_summary.buisiness_owner_or_manager'),
            DEPENDANT_APPS: t('data_lists.datalist_landing.datalist_details.datalist_summary.dependant_apps'),
        },
        SHOWING: t('data_lists.datalist_landing.datalist_details.datalist_summary.showing'),
        OF: t('data_lists.datalist_landing.datalist_details.datalist_summary.of'),
        EDIT: t('data_lists.datalist_landing.datalist_header.edit'),
    };
};

const flowBreadCrumb = (history, t, datalistName = '') => {
    const { BREADCRUMB } = FLOW_CONSTANTS(t);
    return (
        [
            {
                text: BREADCRUMB.HOME,
                isText: false,
                route: getRouteLink(HOME, history),
                className: gClasses.FTwo12,
            }, {
                text: BREADCRUMB.FLOW,
                isText: false,
                route: getRouteLink(LIST_FLOW + ALL_PUBLISHED_FLOWS, history),
                className: gClasses.FTwo12,
            }, {
                text: datalistName,
                className: gClasses.FTwo12GrayV98Imp,
                isText: true,
            },
        ]
    );
};

export {
    FLOW_CONSTANTS,
    flowBreadCrumb,
};

export const DELETE_DISCARD_FLOW_STRINGS = (t) => {
    return {
      DELETE: {
        TITLE: t('flow_landing.delete_flow.title'),
        SUBTITLE: t('flow_landing.delete_flow.subtitle'),
        CANCEL_BUTTON: t('flow_landing.delete_flow.cancel_button'),
        DELETE_BUTTON: t('flow_landing.delete_flow.delete_button'),
        SUCCESS_TITLE: t('flow_landing.delete_flow.success_title'),
        RADIO_GROUP_OPTION_LIST: [
            {
              label: t('flows.delete_flow.radio_group_option_list.label_1'),
              value: 1,
            },
            {
              label:
              t('flows.delete_flow.radio_group_option_list.label_2'),
              value: 2,
            },
        ],
      },
      DISCARD_DRAFT: {
        TITLE: t('flow_landing.discard_draft.title'),
        SUBTITLE: t('flow_landing.discard_draft.subtitle'),
        CANCEL_BUTTON: t('flow_landing.discard_draft.cancel_button'),
        DELETE_BUTTON: t('flow_landing.discard_draft.delete_button'),
        SUCCESS_TITLE: t('flow_landing.discard_draft.success_title'),
      },
    };
};

export const BASIC_DETAILS = {
    NAME: 'name',
    DESCRIPTION: 'description',
    ADMIN: 'admin',
    DATA_MANAGER: 'data_manager',
    };
    export const EDIT_BASIC_DETAILS = (t) => {
        return {
            EDIT_BASIC_DETAILS_HEADER: t('data_lists.edit_basic_details.header'),
            BASIC_DETAILS: t('data_lists.edit_basic_details.basic_details'),
            NAME: {
                ID: 'datalistName',
                LABEL: t('data_lists.edit_basic_details.datalists_name.label'),
                PLACEHOLDER: `${t(NAME_PLACEHOLDER_PART1)} ${APP_MIN_MAX_CONSTRAINT.APP_NAME_MAX_VALUE} ${t(CHARACTERS_STRING)}`,
            },
            DESCRIPTION: {
                ID: 'datalistDescription',
                LABEL: t('data_lists.edit_basic_details.datalist_description.label'),
                PLACEHOLDER: `${t(DESCRIPTION_PLACEHOLDER_PART1)} ${APP_MIN_MAX_CONSTRAINT.APP_DESCRIPTION_MAX_VALUE} ${t(CHARACTERS_STRING)}`,
            },
            ADMINS: {
                ID: 'datalistAdmins',
                LABEL: t('data_lists.edit_basic_details.datalist_admins.label'),
            },
            VIEWERS: {
                ID: 'datalistManagers',
                LABEL: t('data_lists.edit_basic_details.datalist_manager.label'),
            },
            BUTTONS: {
                CANCEL: t('data_lists.edit_basic_details.buttons.cancel'),
                SAVE: t('data_lists.edit_basic_details.buttons.save'),
            },
        };
    };

export const AUTOMATED_TABLE_HEADER = [
    {
        label: 'Trigger type',
        // component?: React.ReactNode,
    }, {
        label: 'Trigger Data',
        // component?: React.ReactNode,
    }, {
        label: 'System Action',
        // component?: React.ReactNode,
    }, {
        label: 'Frequency',
        // component?: React.ReactNode,
    }, {
        label: '',
        // component?: React.ReactNode,
    },
];
