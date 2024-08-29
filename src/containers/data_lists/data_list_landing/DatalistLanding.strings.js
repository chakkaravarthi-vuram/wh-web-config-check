import { translateFunction } from '../../../utils/jsUtility';

export const DATALIST_LANDING_STRINGS = (t = translateFunction) => {
    return {
        DATALIST_USER_SYSTEMS: {
            RELATED_ACTIONS_USER: t('data_lists.datalist_create_edit.datalist_user_systems.related_actions_user'),
            ADD_SHORTCUT: t('data_lists.datalist_create_edit.datalist_user_systems.add_shortcut'),
            NO_SUB_FLOWS_FOUND: t('data_lists.datalist_create_edit.datalist_user_systems.no_sub_flows_found'),
            ADD_SUB_FLOW: t('data_lists.datalist_create_edit.datalist_user_systems.add_sub_flow'),
            AUTOMATED_SYSTEM_ACTIONS: t('data_lists.datalist_create_edit.datalist_user_systems.automated_system_actions'),
            SUB_FLOWS_TITLE: t('data_lists.datalist_create_edit.user_actions.title'),
            NO_ACTIONS_FOUND: t('data_lists.datalist_create_edit.datalist_user_systems.no_actions_found'),
            ADD_ACTION: t('data_lists.datalist_create_edit.datalist_user_systems.add_action'),
            CREATE_NEW: t('data_lists.datalist_create_edit.datalist_user_systems.create_new'),

        },
        DATALIST_SUMMARY: {
            BASIC_DETAILS: t('create_dashboard_strings.basic_details'),
            NAME: t('create_dashboard_strings.dashboard_name.label'),
            DESCRIPTION: t('create_dashboard_strings.dashboard_description.label'),
            DEVELPOER_ADMIN: t('create_dashboard_strings.dashboard_owners.new_label'),
            BUSINESS_OWNER_DATA_MANAGER: t('create_dashboard_strings.dashboard_viewers.new_label'),
            EDIT: t('datalist.datalist_strings.edit'),
        },
        USER_ACTIONS: {
            TITLE: t('data_lists.datalist_create_edit.user_actions.title'),
            CHOOSE_FLOW: t('data_lists.datalist_create_edit.user_actions.choose_flow'),
            CREATE_NEW_FLOW: t('data_lists.datalist_create_edit.user_actions.create_new_flow'),
            SHORTCUT_NAME: t('data_lists.datalist_create_edit.user_actions.shortcut_name'),
            USER_PERMISSION: t('data_lists.datalist_create_edit.user_actions.user_permission'),
            AUTO_FILL_MESSAGE: t('data_lists.datalist_create_edit.user_actions.auto_fill_message'),
            ADD_FIELD: t('data_lists.datalist_create_edit.user_actions.add_field'),
            CANCEL: t('data_lists.datalist_create_edit.user_actions.cancel'),
            SAVE: t('data_lists.datalist_create_edit.user_actions.save'),
            DELETE: t('common_strings.delete'),
            DELETE_TITLE: t('data_lists.datalist_create_edit.user_actions.delete_title'),
            DELETE_SUBTITLE: t('data_lists.datalist_create_edit.user_actions.delete_subtitle'),
        },
    };
};
