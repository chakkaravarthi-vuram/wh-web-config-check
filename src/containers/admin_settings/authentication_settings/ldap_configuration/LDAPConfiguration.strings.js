import { translateFunction } from '../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';

export const LDAPStrings = (t = translateFunction) => {
    return {
        ID: t('admin_settings.ldap_settings.id'),
        TITLE: t('admin_settings.ldap_settings.title'),
        LDAP_DETAILS: {
            TITLE: t('admin_settings.ldap_settings.ldap_details.title'),
            STATUS: {
                ID: t('admin_settings.ldap_settings.ldap_details.status.id'),
                LABEL: t('admin_settings.ldap_settings.ldap_details.status.label'),
                ACTIVE: t('admin_settings.ldap_settings.ldap_details.status.active'),
                INACTIVE: t('admin_settings.ldap_settings.ldap_details.status.inactive'),
                DISABLE: t('admin_settings.ldap_settings.ldap_details.status.disable'),
                ENABLE: t('admin_settings.ldap_settings.ldap_details.status.enable'),
            },
            SERVERS: {
                LABEL: t('admin_settings.ldap_settings.ldap_details.servers.label'),
                ID: t('admin_settings.ldap_settings.ldap_details.servers.id'),
                VALUE_PLACEHOLDER: t('admin_settings.ldap_settings.ldap_details.servers.value_placeholder'),
                PLACEHOLDER: t('admin_settings.ldap_settings.ldap_details.servers.placeholder'),
            },
            ADMIN: {
                USER: {
                    ID: t('admin_settings.ldap_settings.ldap_details.admin.user.id'),
                    LABEL: t('admin_settings.ldap_settings.ldap_details.admin.user.label'),
                    PLACEHOLDER: t('admin_settings.ldap_settings.ldap_details.admin.user.placeholder'),
                },
                PASSWORD: {
                    ID: t('admin_settings.ldap_settings.ldap_details.admin.password.id'),
                    LABEL: t('admin_settings.ldap_settings.ldap_details.admin.password.label'),
                    PLACEHOLDER: t('admin_settings.ldap_settings.ldap_details.admin.password.placeholder'),
                },
            },
        },
        USER_SEARCH_INFO: {
            TITLE: t('admin_settings.ldap_settings.user_search_info.title'),
            BASE_DN: {
                ID: t('admin_settings.ldap_settings.user_search_info.base.id'),
                LABEL: t('admin_settings.ldap_settings.user_search_info.base.label'),
                PLACEHOLDER: t('admin_settings.ldap_settings.user_search_info.base.placeholder'),
            },
            FILTERS: {
                ID: t('admin_settings.ldap_settings.user_search_info.filter.id'),
                LABEL: t('admin_settings.ldap_settings.user_search_info.filter.label'),
                PLACEHOLDER: t('admin_settings.ldap_settings.user_search_info.filter.placeholder'),
            },
        },
        ATTRIBUTE_MAPPING: {
            TITLE: t('admin_settings.ldap_settings.atttibute_mapping.title'),
            USERNAME: {
                ID: t('admin_settings.ldap_settings.atttibute_mapping.username.id'),
                LABEL: t('admin_settings.ldap_settings.atttibute_mapping.username.label'),
                PLACEHOLDER: t('admin_settings.ldap_settings.atttibute_mapping.username.placeholder'),
            },
            EMAIL: {
                ID: t('admin_settings.ldap_settings.atttibute_mapping.email.id'),
                LABEL: t('admin_settings.ldap_settings.atttibute_mapping.email.label'),
                PLACEHOLDER: t('admin_settings.ldap_settings.atttibute_mapping.email.placeholder'),
            },
            FIRST_NAME: {
                ID: t('admin_settings.ldap_settings.atttibute_mapping.first_name.id'),
                LABEL: t('admin_settings.ldap_settings.atttibute_mapping.first_name.label'),
                PLACEHOLDER: t('admin_settings.ldap_settings.atttibute_mapping.first_name.placeholder'),
            },
            LAST_NAME: {
                ID: t('admin_settings.ldap_settings.atttibute_mapping.last_name.id'),
                LABEL: t('admin_settings.ldap_settings.atttibute_mapping.last_name.label'),
                PLACEHOLDER: t('admin_settings.ldap_settings.atttibute_mapping.last_name.placeholder'),
            },
            BUISNESS_UNIT: {
                ID: t('admin_settings.ldap_settings.atttibute_mapping.buisness_unit.id'),
                LABEL: t('admin_settings.ldap_settings.atttibute_mapping.buisness_unit.label'),
                PLACEHOLDER: t('admin_settings.ldap_settings.atttibute_mapping.buisness_unit.placeholder'),
            },
            ROLE: {
                ID: t('admin_settings.ldap_settings.atttibute_mapping.role.id'),
                LABEL: t('admin_settings.ldap_settings.atttibute_mapping.role.label'),
                PLACEHOLDER: t('admin_settings.ldap_settings.atttibute_mapping.role.placeholder'),
            },
        },
        OTHER_ATTRIBUTE_MAPPING: {
            TITLE: t('admin_settings.ldap_settings.other_atttibute_mapping.title'),
            HEADERS: [
                t('admin_settings.ldap_settings.other_atttibute_mapping.user_field.label'),
                t('admin_settings.ldap_settings.other_atttibute_mapping.attribute.label'),
            ],
            USER_FIELD: {
                ID: t('admin_settings.ldap_settings.other_atttibute_mapping.user_field.id'),
                PLACEHOLDER: t('admin_settings.ldap_settings.other_atttibute_mapping.user_field.placeholder'),
            },
            ATTRIBUTE: {
                ID: t('admin_settings.ldap_settings.other_atttibute_mapping.attribute.id'),
                PLACEHOLDER: t('admin_settings.ldap_settings.other_atttibute_mapping.attribute.placeholder'),
            },
        },
        OTHER_CONFIGURATION: {
            TITLE: t('admin_settings.ldap_settings.other_configuration.title'),
            RESTRICT_USERS: {
                OPTIONS: [{
                    label: t('admin_settings.ldap_settings.other_configuration.restrict_users.label'),
                    value: 1,
                    selected: true,
                    disabled: false,
                    description: EMPTY_STRING,
                }],
                ID: t('admin_settings.ldap_settings.other_configuration.restrict_users.label'),
            },
            TLS: {
                OPTIONS: [{
                    label: t('admin_settings.ldap_settings.other_configuration.tls.label'),
                    value: 1,
                    selected: true,
                    disabled: false,
                    description: EMPTY_STRING,
                }],
                ID: t('admin_settings.ldap_settings.other_configuration.tls.label'),
                PLACEHOLDER: t('admin_settings.ldap_settings.other_configuration.tls.placeholder'),
                CHOOSE_FILE: t('admin_settings.ldap_settings.other_configuration.tls.choose_file'),
            },
        },
        TEST_CONFIGURATION: {
            TITLE: t('admin_settings.ldap_settings.test_configuration.title'),
            TEST: {
                LABEL: t('admin_settings.ldap_settings.test_configuration.test.label'),
            },
        },
        FOOTER: {
            SAVE: t('admin_settings.ldap_settings.footer.save'),
            CANCEL: t('admin_settings.ldap_settings.footer.cancel'),
            DELETE: t('admin_settings.ldap_settings.footer.delete'),
        },
    };
};

export default LDAPStrings;
