import { INITIAL_STATE } from '../../../../../../components/condition_builder/ConditionBuilder.strings';
import { translate } from '../../../../../../language/config';

export const ACTION_CONSTANTS = {
    ERROR: {
      MAXIMUM: translate('flows.condition_configuration_strings.action_constants.error.maximum'),
      MINIMUM: translate('flows.condition_configuration_strings.action_constants.error.minimum'),
    },
    CONDITION_TYPE: {
       ID: 'condition_type',
       LABEL: translate('flows.condition_configuration_strings.action_constants.condition_type.label'),
       PLACEHOLDER: translate('flows.condition_configuration_strings.action_constants.condition_type.placeholder'),
       OPTION_LIST: [
        {
            value: false,
            label: translate('flows.condition_configuration_strings.action_constants.condition_type.option_list.always_label'),
        },
        {
          value: true,
          label: translate('flows.condition_configuration_strings.action_constants.condition_type.option_list.conditional_label'),
        },
      ],
    },
    ACTION: {
        ID: 'action',
     },
    STEP: {
        ID: 'next_step',
        LABEL: translate('flows.condition_configuration_strings.action_constants.step.label'),
        PLACEHOLDER: translate('flows.condition_configuration_strings.action_constants.step.placeholder'),
        CREATE_STEP: {
          BUTTON_LABEL: translate('flows.condition_configuration_strings.action_constants.step.create_step_label'),
          TEXT_ID: 'newStepValue',
        },
        STEP_LIST: {
          CHOOSE_STEP: translate('flows.condition_configuration_strings.action_constants.step.choose_step'),
          NO_DATA_FOUND: translate('flows.condition_configuration_strings.action_constants.step.no_data_found'),
        },
     },
    INITIAL_STATE: {
      NEXT_STEP_RULE_EXPRESSION: () => {
          return {
                  condition_expression: {
                    ...INITIAL_STATE.GET_CONDITION(),
                  },
                  next_step_name: '',
                  next_output_value: '',
                  err_next_output_value: '',
                  error_list: {},
                };
        },
    },
    KEYS: {
      NEXT_STEP_RULE_EXPRESSION: 'next_step_rule_expression',
      VISIBILITY_RULE_EXPRESSION: 'visibility_rule_expression',
      CONDITION_EXPRESSION: 'condition_expression',
      EXPRESSION_RULE_HAS_VALIDATION: 'expression_rule_has_validation',
    },
};

export const ACTION_CONDITION_CONSTANTS = {
  ADD_CONDITION: translate('flows.query_builder.add_sub_condition'),
  ADD_MORE_CONDITION: translate('flows.query_builder.add_more_condition'),
};

export const ACTION_BUTTON = {
   VALIDATION: {
    LABEL_POP_OVER_TITLE: 'Error - Action Button Label',
    LABEL_ALREADY_EXIST: 'Action button label is already exist',
   },
};

export default ACTION_CONSTANTS;
