export const FLOW_SECURITY_CONSTANTS = (t) => {
    return {
        FLOW_ADMINS: t('flow_create_edit.security.flow_admins'),
        FLOW_OWNERS: t('flow_create_edit.security.flow_owners'),
        FLOW_INITIATORS: t('flow_create_edit.security.flow_initiators'),
        MANAGE_SECURITY_TITLE: t('data_lists.datalist_landing.datalist_details.datalist_security.manage_security_title'),
        DATA_SECURITY: t('data_lists.datalist_create_edit.security.data_security'),
        ADMINISTRATIVE_PERMISSIONS: t('data_lists.datalist_landing.datalist_details.datalist_security.administrative_permissions'),
        NO_RESULTS_FOUND: t('common_strings.no_results_found'),
        VIEW_PERMISSION: t('data_lists.datalist_create_edit.security.view_data_security'),
        DATA_ACCESS_FOR_PARTICIPANTS: {
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
        ADD_ENTRY: {
            ID: 'addSecurity',
            LABEL: t('data_lists.datalist_landing.datalist_details.datalist_security.add_entry.label'),
        },
        EDIT_ENTRY: {
            ID: 'editSecurity',
            LABEL: t('data_lists.datalist_landing.datalist_details.datalist_security.edit_entry.label'),
            SAME_AS_ADD_ENTRY: {
                LABEL: t('data_lists.datalist_landing.datalist_details.datalist_security.edit_entry.same_as_add_entry.label'),
                IS_SAME_AS_ADD_ENTRY: 'sameAsAdd',
                ID: 'entriesAccess',
                IS_ALL_ENTRIES: 'isAllEntries',
                OPTIONS: [
                    {
                        VALUE: 'allEntries',
                        LABEL: t('data_lists.datalist_landing.datalist_details.datalist_security.edit_entry.same_as_add_entry.options.all_entries_label'),
                    },
                    {
                        VALUE: 'addedEntriesOnly',
                        LABEL: t('data_lists.datalist_landing.datalist_details.datalist_security.edit_entry.same_as_add_entry.options.added_entries_only_label'),
                    },
                ],
            },
            SPECIFIED_USERS: {
                MEMBERS: 'members',
                ID: 'specifiedUsers',
                LABEL: t('data_lists.datalist_landing.datalist_details.datalist_security.edit_entry.specified_user.label'),
            },
        },
        DELETE_ENTRY: {
            ID: 'deleteSecurity',
            LABEL: t('data_lists.datalist_landing.datalist_details.datalist_security.delete_entry.label'),
            SAME_AS_ADD_ENTRY: {
                LABEL: t('data_lists.datalist_landing.datalist_details.datalist_security.delete_entry.same_as_add_entry.label'),
                IS_SAME_AS_ADD_ENTRY: 'sameAsAdd',
                ID: 'entriesAccess',
                IS_ALL_ENTRIES: 'isAllEntries',
                OPTIONS: [
                    {
                        VALUE: 'allEntries',
                        LABEL: t('data_lists.datalist_landing.datalist_details.datalist_security.delete_entry.same_as_add_entry.options.all_entries_label'),
                    },
                    {
                        VALUE: 'addedEntriesOnly',
                        LABEL: t('data_lists.datalist_landing.datalist_details.datalist_security.delete_entry.same_as_add_entry.options.added_entries_only_label'),
                    },
                ],
            },
            SPECIFIED_USERS: {
                MEMBERS: 'members',
                ID: 'specifiedUsers',
                LABEL: t('data_lists.datalist_landing.datalist_details.datalist_security.delete_entry.specified_user.label'),
            },
        },
        VIEWERS: {
            ID: 'viewers',
            LABEL: t('data_lists.datalist_landing.datalist_details.datalist_security.view_entry.label'),
        },
        SECURITY_POLICY: {
            ID: 'securityPolicies',
            ADVANCED_DATA_SECURITY: t('data_lists.datalist_landing.datalist_details.datalist_security.advanced_data_security'),
            POLICY_ACCESS_TITLE: t('data_lists.datalist_landing.datalist_details.datalist_security.policy_access_title'),
            CONDITION_POLICY_SECURITY: {
                LABEL: t('data_lists.datalist_landing.datalist_details.datalist_security.condition_policy_security.label'),
            },
            USER_FIELD_POLICY_SECURITY: {
                LABEL: t('data_lists.datalist_landing.datalist_details.datalist_security.user_field_policy_security.label'),
            },
        },
        SECURITY_SUMMARY: {
            TITLE: t('data_lists.datalist_landing.datalist_details.datalist_security.security_summary.title'),
            HEADERS: [
                { label: t('data_lists.datalist_landing.datalist_details.datalist_security.security_summary.headers.user_or_team') },
                { label: t('data_lists.datalist_landing.datalist_details.datalist_security.security_summary.headers.source') },
                { label: t('data_lists.datalist_landing.datalist_details.datalist_security.security_summary.headers.view') },
                { label: t('data_lists.datalist_landing.datalist_details.datalist_security.security_summary.headers.add') },
                { label: t('data_lists.datalist_landing.datalist_details.datalist_security.security_summary.headers.edit') },
                { label: t('data_lists.datalist_landing.datalist_details.datalist_security.security_summary.headers.delete') },
            ],
        },
    };
};
