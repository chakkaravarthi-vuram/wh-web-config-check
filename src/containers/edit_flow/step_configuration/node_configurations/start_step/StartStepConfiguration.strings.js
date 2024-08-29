import { translateFunction } from '../../../../../utils/jsUtility';
import {
    ADDITIONAL_CONFIG_LABEL,
    GENERAL_LABEL,
} from '../../../../../utils/strings/CommonStrings';
import { NODE_CONFIG_TABS } from '../../../node_configuration/NodeConfiguration.constants';

export const START_STEP_CONFIGURATION_STRINGS = (t = translateFunction) => {
    return {
        TITLE: t('flow_strings.step_configuration.start_step.title'),
        TRIGGER_CONFIG_HEADER: t('flow_strings.step_configuration.start_step.trigger_config_header'),
        GENERAL: {
            TRIGGER: {
                TITLE: t('flow_strings.step_configuration.start_step.general.trigger.title'),
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
            INTIATORS: {
                TITLE: t('flow_strings.step_configuration.start_step.general.initiators.title'),
                ID: 'initiators',
                LABEL: t('flow_strings.step_configuration.start_step.general.initiators.label'),
                NO_USERS_FOUND: t('teams.no_search_team_data.title'),
                USER_OR_TEAM: t('flow_strings.step_configuration.start_step.general.initiators.teams_or_users'),
                USER_OR_TEAM_REQUIRED: t('flow_strings.step_configuration.start_step.general.initiators.teams_or_users_required'),
            },
            getTabOptions: () => [
                {
                    labelText: t(GENERAL_LABEL),
                    value: NODE_CONFIG_TABS.GENERAL,
                    tabIndex: NODE_CONFIG_TABS.GENERAL,
                }, {
                    labelText: t(ADDITIONAL_CONFIG_LABEL),
                    value: NODE_CONFIG_TABS.ADDITIONAL,
                    tabIndex: NODE_CONFIG_TABS.ADDITIONAL,
                },
            ],
        },
        ADDITIONAL: {
            PERMISSION: {
                TITLE: t('flow_strings.step_configuration.start_step.additional.permission.title'),
                SUB_FLOW: {
                    ID: 'allowSubFlow',
                    OPTION: {
                        label: t('flow_strings.step_configuration.start_step.additional.permission.sub_flow.option.label'),
                        value: true,
                    },
                },
                EXTERNAL: {
                    ID: 'allowExternal',
                    OPTION: {
                        label: t('flow_strings.step_configuration.start_step.additional.permission.external.option.label'),
                        value: false,
                    },
                },
            },
        },
        VALIDATION_CONSTANTS: {
            INVALID_USERS_TEAMS: t('error_popover_status.invalid_users_teams'),
        },
    };
};
