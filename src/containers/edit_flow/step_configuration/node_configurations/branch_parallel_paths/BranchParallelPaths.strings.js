import { translateFunction } from '../../../../../utils/jsUtility';

export const BRANCH_PARALLEL_PATHS_STRINGS = (t = translateFunction) => {
    return {
        TITLE: t('flow_strings.step_configuration.branch_parallel.title'),
        GENERAL: {
            TITLE: t('flow_strings.step_configuration.branch_parallel.general.title'),
            CONDITIONAL_SPLIT_LABEL: t('flow_strings.step_configuration.branch_parallel.general.conditional_split_label'),
            STEP_LABEL: t('flow_strings.step_configuration.branch_parallel.general.step_label'),
            VALIDATION: {
                STEPS: t('flow_strings.step_configuration.branch_parallel.general.validation.steps'),
                RULE: t('flow_strings.step_configuration.branch_parallel.general.validation.rule'),
            },
            PATH: {
                OR: t('flow_strings.step_configuration.branch_parallel.general.direct.or'),
                ADD_BRANCH: t('flow_strings.step_configuration.branch_parallel.general.direct.add_branch'),
                LABEL: t('flow_strings.step_configuration.branch_parallel.general.direct.label'),
            },
            STEPS_DROPDOWN: {
                LABEL: t('flow_strings.step_configuration.branch_parallel.general.direct.label'),
                SEARCH: {
                    PLACEHOLDER: t('flow_strings.step_configuration.branch_parallel.general.direct.search.placeholder'),
                    NO_STEPS_FOUND: t('flow_strings.step_configuration.branch_parallel.general.direct.search.no_steps_found'),
                },
                CHOOSE_LABEL: t('flow_strings.step_configuration.branch_parallel.general.direct.choose_label'),
                SELECTED_LABEL: t('flow_strings.step_configuration.branch_parallel.general.direct.selected_label'),
                SUGGESTION_LABEL: t('flow_strings.step_configuration.branch_parallel.general.direct.suggestion_label'),
            },
            CONDITIONAL: {
                TITLE: t('flow_strings.step_configuration.branch_parallel.general.conditional.title'),
                ADD_CONDITION: t('flow_strings.step_configuration.branch_parallel.general.conditional.add_condition'),
                CONDITION_LABEL: t('flow_strings.step_configuration.branch_parallel.general.conditional.condition_label'),
                CONDITION_TRUE_LABEL: t('flow_strings.step_configuration.branch_parallel.general.conditional.condition_true_label'),
                ELSE_LABEL: t('flow_strings.step_configuration.branch_parallel.general.conditional.else_label'),
            },
            SWITCH_CONFIRMATION: {
                TITLE: t('flow_strings.step_configuration.branch_parallel.general.switch_confirmation.title'),
                SUBTITLE: t('flow_strings.step_configuration.branch_parallel.general.switch_confirmation.subtitle'),
            },
        },
    };
};

export const CONDITION_PATH_ROUTER_STRINGS = (t = translateFunction) => {
    return {
        TITLE: t('flow_strings.step_configuration.condition_path_router.title'),
        GENERAL: {
            TITLE: t('flow_strings.step_configuration.condition_path_router.general.title'),
            CONDITIONAL: {
                TITLE: t('flow_strings.step_configuration.condition_path_router.general.condition.title'),
                ADD_CONDITION: t('flow_strings.step_configuration.condition_path_router.general.condition.add_condition_button_label'),
                ELSE_LABEL: t('flow_strings.step_configuration.condition_path_router.general.condition.else_label'),
                ELSE_DESCRIPTION: t('flow_strings.step_configuration.condition_path_router.general.condition.else_description'),
                CONDITION_LABEL: t('flow_strings.step_configuration.condition_path_router.general.condition.title'),
                CONDITION_TRUE_LABEL: t('flow_strings.step_configuration.condition_path_router.general.path.label'),
            },
            STEPS_DROPDOWN: {
                PLACEHOLDER: t('flow_strings.step_configuration.condition_path_router.general.path.choose.placeholder'),
                    SEARCH: {
                        PLACEHOLDER: t('flow_strings.step_configuration.condition_path_router.general.path.choose.search.placeholder'),
                    },
            },
            DIRECT: {
                LABEL: t('flow_strings.step_configuration.condition_path_router.general.condition.else_description'),
            },
            PATH: {
                TITLE: t('flow_strings.step_configuration.condition_path_router.general.path.title'),
                LABEL: t('flow_strings.step_configuration.condition_path_router.general.path.label'),
                CHOOSE: {
                    PLACEHOLDER: t('flow_strings.step_configuration.condition_path_router.general.path.choose.placeholder'),
                    SEARCH: {
                        PLACEHOLDER: t('flow_strings.step_configuration.condition_path_router.general.path.choose.search.placeholder'),
                    },
                },
                ADD_STEP_LABEL: t('flow_strings.step_configuration.condition_path_router.general.path.add_step_label'),
            },
        },
    };
};
