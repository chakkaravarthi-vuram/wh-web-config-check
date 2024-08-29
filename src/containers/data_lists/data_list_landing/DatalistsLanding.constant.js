import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames';
import styles from './DatalistLanding.module.scss';
import Trash from '../../../assets/icons/application/Trash';
import DiscardIcon from '../../../assets/icons/datalists/DiscardIcon';
import { HOME, LIST_DATA_LIST, DATALIST_OVERVIEW } from '../../../urls/RouteConstants';
import { getRouteLink } from '../../../utils/UtilityFunctions';
import { CHARACTERS_STRING, DESCRIPTION_PLACEHOLDER_PART1, NAME_PLACEHOLDER_PART1 } from '../../../utils/strings/CommonStrings';
import { APP_MIN_MAX_CONSTRAINT } from '../../../utils/Constants';
import jsUtility, { translateFunction } from '../../../utils/jsUtility';

export const DATALIST_HEADER_TYPE = {
    SUMMARY: 'summary',
    DATA: 'data',
    SECURITY: 'security',
    ALL_DATA_REPORT: 'report',
    DATA_DASHBOARD: 'dashboard',
    RELATED_ACTIONS: 'actions',
    ADD_ON: 'add_on',
    DATA_AUDIT: 'data_audit',
};

const DATALISTS_CONSTANTS = (t) => {
    return {
        BREADCRUMB: {
            HOME: t('data_lists.datalist_landing.datalist_header.breadcrumb.home'),
            DATALISTS: t('data_lists.datalist_landing.datalist_header.breadcrumb.data_lists'),
        },
        DRAFT_LABEL: t('data_lists.datalist_landing.datalist_header.draft'),
        DRAFT: 'unpublished',
        PUBLISHED_LABEL: t('data_lists.datalist_landing.datalist_header.published'),
        PUBLISHED: 'published',
        HEADER_OPTIONS: (showDiscard, isUsersDatalist) => jsUtility.compact([
            (showDiscard) ? {
                label: t('data_lists.datalist_landing.datalist_header.header_options.discard'),
                value: 1,
                icon: <DiscardIcon />,
            } : null,
            (!isUsersDatalist) ? {
                label: t('data_lists.datalist_landing.datalist_header.header_options.delete'),
                value: 2,
                icon: <Trash />,
            } : null,
        ]),
        DATALIST_HEADER_TAB: [
            {
                labelText: t('data_lists.datalist_landing.datalist_header.datalist_tabs.summary'),
                value: DATALIST_HEADER_TYPE.SUMMARY,
                tabIndex: 1,
            }, {
                labelText: t('data_lists.datalist_landing.datalist_header.datalist_tabs.data'),
                value: DATALIST_HEADER_TYPE.DATA,
                tabIndex: 2,
            }, {
                labelText: t('data_lists.datalist_landing.datalist_header.datalist_tabs.security'),
                value: DATALIST_HEADER_TYPE.SECURITY,
                tabIndex: 3,
            }, {
                labelText: t('data_lists.datalist_landing.datalist_header.datalist_tabs.related_actions'),
                value: DATALIST_HEADER_TYPE.RELATED_ACTIONS,
                tabIndex: 4,
            }, {
                labelText: t('data_lists.datalist_landing.datalist_header.datalist_tabs.all_data_report'),
                value: DATALIST_HEADER_TYPE.ALL_DATA_REPORT,
                tabIndex: 5,
            }, {
                labelText: t('data_lists.datalist_landing.datalist_header.datalist_tabs.data_dashboard'),
                value: DATALIST_HEADER_TYPE.DATA_DASHBOARD,
                tabIndex: 6,
            }, {
                labelText: t('data_lists.datalist_landing.datalist_header.datalist_tabs.language_and_others'),
                value: DATALIST_HEADER_TYPE.ADD_ON,
                tabIndex: 7,
            },
            {
                labelText: t('data_lists.datalist_landing.datalist_header.datalist_tabs.version_history'),
                value: DATALIST_HEADER_TYPE.DATA_AUDIT,
                tabIndex: DATALIST_HEADER_TYPE.DATA_AUDIT,
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

const datalistBreadCrumb = (history, t, datalistName = '[Datalist name]') => { // Default value for [Datalist name] to be removed and replaced by EMPTY string
    const { BREADCRUMB } = DATALISTS_CONSTANTS(t);
    return (
        [
            {
                text: BREADCRUMB.HOME,
                isText: false,
                route: getRouteLink(HOME, history),
                className: gClasses.FTwo12,
            }, {
                text: BREADCRUMB.DATALISTS,
                isText: false,
                route: getRouteLink(LIST_DATA_LIST + DATALIST_OVERVIEW, history),
                className: gClasses.FTwo12,
            }, {
                text: datalistName,
                className: cx(gClasses.FTwo12GrayV98Imp, styles.BreadCrumb),
                isText: true,
            },
        ]
    );
};

export {
    DATALISTS_CONSTANTS,
    datalistBreadCrumb,
};
export const DATALISTS_STRINGS = {
    DELETE_DATALIST_HEADER: 'data_lists.delete_datalists_strings.delete_datalist_header',
    DELETE_DATALIST_SUCCESS_TITLE: 'data_lists.delete_datalists_strings.success_title',
    DELETE_DATALIST: 'data_lists.delete_datalists_strings.delete_datalists',
    CANCEL_BUTTON: 'data_lists.delete_datalists_strings.cancel_button',
    DELETE_BUTTON: 'data_lists.delete_datalists_strings.delete_button',
    DISCARD_DRAFT_DATALISTS: {
        DISCARD_DRAFT_DATALISTS_HEADER: 'data_lists.discard_draft_datalists_strings.discard_draft_datalists_header',
        DISCARD_DRAFT_DATALISTS: 'data_lists.discard_draft_datalists_strings.discard_draft_datalists',
        DISCARD_DATALIST_SUCCESS_TITLE: 'data_lists.discard_draft_datalists_strings.success_title',
        CANCEL_BUTTON: 'data_lists.discard_draft_datalists_strings.cancel_button',
        DELETE_BUTTON: 'data_lists.discard_draft_datalists_strings.delete_button',
    },
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
            DATALIST_NAME: {
                ID: 'dataListName',
                LABEL: t('data_lists.edit_basic_details.datalists_name.label'),
                PLACEHOLDER: `${t(NAME_PLACEHOLDER_PART1)} ${APP_MIN_MAX_CONSTRAINT.APP_NAME_MAX_VALUE} ${t(CHARACTERS_STRING)}`,
            },
            DATALIST_DESCRIPTION: {
                ID: 'dataListDescription',
                LABEL: t('data_lists.edit_basic_details.datalist_description.label'),
                PLACEHOLDER: `${t(DESCRIPTION_PLACEHOLDER_PART1)} ${APP_MIN_MAX_CONSTRAINT.APP_DESCRIPTION_MAX_VALUE} ${t(CHARACTERS_STRING)}`,
            },
            DATALIST_ADMINS: {
                ID: 'dataListAdmins',
                LABEL: t('data_lists.edit_basic_details.datalist_admins.label'),
            },
            DATALIST_VIEWERS: {
                ID: 'dataListOwners',
                LABEL: t('data_lists.edit_basic_details.datalist_manager.label'),
            },
            BUTTONS: {
                CANCEL: t('data_lists.edit_basic_details.buttons.cancel'),
                SAVE: t('data_lists.edit_basic_details.buttons.save'),
            },
            NO_DATA_FOUND: t('no_data_found_strings.title'),
        };
    };

export const AUTOMATED_TABLE_HEADER = (t = translateFunction) => [
    {
        label: t('automated_systems.triggering_point.trigger_type'),
        // component?: React.ReactNode,
    }, {
        label: t('automated_systems.trigger_data.header'),
        // component?: React.ReactNode,
    }, {
        label: t('automated_systems.system_action'),
        // component?: React.ReactNode,
    }, {
        label: t('automated_systems.triggering_point.frequency'),
        // component?: React.ReactNode,
    }, {
        label: '',
        // component?: React.ReactNode,
    },
];

export const AUTOMATED_SYSTEM_ACTIONS_TABLE_DATA = (t) => {
    return {
        SCHEDULED_TRIGGER: t('automated_systems.triggering_point.scheduler_or_reccuring'),
        FIELD_TRIGGER: t('automated_systems.triggering_point.field_value_trigger'),
        ALL_DATALIST: t('automated_systems.triggering_point.all_datalist'),
        DATA_MATCHES: t('automated_systems.triggering_point.data_matches'),
        INITIATE_A_FLOW: t('automated_systems.triggering_point.initiate_a_flow'),
    };
};
