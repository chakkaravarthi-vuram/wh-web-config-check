import { translateFunction } from '../../../../../utils/jsUtility';
import { NODE_CONFIG_TABS } from '../../../node_configuration/NodeConfiguration.constants';

export const DATA_MANIPULATOR_STEP_CONFIGURATION = (t = translateFunction) => {
    return {
        TAB_OPTIONS: [
            {
                labelText: t('end_step_configuration_strings.end_config_tab.general'),
                value: NODE_CONFIG_TABS.GENERAL,
                tabIndex: NODE_CONFIG_TABS.GENERAL,
            },
            {
                labelText: t(
                    'end_step_configuration_strings.end_config_tab.additional_configuration',
                  ),
                value: NODE_CONFIG_TABS.ADDITIONAL,
                tabIndex: NODE_CONFIG_TABS.ADDITIONAL,
            },
        ],
        TITLE: t('flow_strings.step_configuration.data_manipulator.title'),
        FLOW_FIELDS_ID: 'flowFields',
        CREATE_FLOW_FIELD: t('flow_strings.step_configuration.data_manipulator.create_flow_field'),
        INSTRUCTION: t('flow_strings.step_configuration.data_manipulator.instruction'),
        ADD_MAPPING: 'Add Mapping',
        ADD_MANIPULATION: {
            BUTTON_LABEL: t('flow_strings.step_configuration.data_manipulator.add_manipulation.button_label'),
            OPTIONS: [
                {
                    label: t('flow_strings.step_configuration.data_manipulator.add_manipulation.options.expression.label'),
                    value: 'calculated_rule',
                    type: t('flow_strings.step_configuration.data_manipulator.add_manipulation.options.expression.type'),
                    header: t('flow_strings.step_configuration.data_manipulator.add_manipulation.options.expression.header'),
                    isHeaderWithBg: true,
                    disabled: false,
                    index: 0,
                    sourceType: 'calculated_rule',
                    ADD_EXPRESSION: t('flow_strings.step_configuration.data_manipulator.add_manipulation.options.expression.add_expression'),
                },
                {
                    label: t('flow_strings.step_configuration.data_manipulator.add_manipulation.options.external_source.label'),
                    value: 'external_data',
                    type: t('flow_strings.step_configuration.data_manipulator.add_manipulation.options.external_source.type'),
                    disabled: false,
                    index: 1,
                    sourceType: 'external_data',
                },
                {
                    label: t('flow_strings.step_configuration.data_manipulator.add_manipulation.options.system_field.label'),
                    value: 'system',
                    type: t('flow_strings.step_configuration.data_manipulator.add_manipulation.options.system_field.type'),
                    disabled: false,
                    index: 2,
                    sourceType: 'system',
                },
                {
                    label: t('flow_strings.step_configuration.data_manipulator.add_manipulation.options.user_field.label'),
                    value: 'dynamic',
                    type: t('flow_strings.step_configuration.data_manipulator.add_manipulation.options.user_field.type'),
                    disabled: false,
                    index: 3,
                    sourceType: 'dynamic',
                },
                {
                    label: t('flow_strings.step_configuration.data_manipulator.add_manipulation.options.static_value.label'),
                    value: 'static',
                    type: t('flow_strings.step_configuration.data_manipulator.add_manipulation.options.static_value.type'),
                    disabled: false,
                    index: 4,
                    sourceType: 'static',
                },
            ],
        },
        HEADERS: [
            t('flow_strings.step_configuration.data_manipulator.headers.type'),
            t('flow_strings.step_configuration.data_manipulator.headers.manipulation'),
            t('flow_strings.step_configuration.data_manipulator.headers.save_to'),
        ],
        EXPRESSION: {
            TOOLTIP_ID: 'ruleName',
            TYPE: t('flow_strings.step_configuration.data_manipulator.expression.type'),
            SAVE_TO: {
                PLACEHOLDER: t('flow_strings.step_configuration.data_manipulator.expression.save_to.placeholder'),
            },
        },
        EXTERNAL_SOURCE: {
            PLACEHOLDER: 'Choose external field',
            TYPE: t('flow_strings.step_configuration.data_manipulator.external_source.type'),
            MAPPING: {
                FIELD: {
                    PLACEHOLDER: t('flow_strings.step_configuration.data_manipulator.external_source.mapping.field.placeholder'),
                },
                SAVE_TO: {
                    PLACEHOLDER: t('flow_strings.step_configuration.data_manipulator.external_source.mapping.save_to.placeholder'),
                },
            },
            ADD_COLUMN_MAPPING: 'Add Column Mapping',
            SAVE_MORE: t('flow_strings.step_configuration.data_manipulator.external_source.save_more'),
        },
        FLOW_FIELD_MAPPING: {
            TYPE: t('flow_strings.step_configuration.data_manipulator.flow_field_mapping.type'),
            PLACEHOLDER: t('flow_strings.step_configuration.data_manipulator.flow_field_mapping.placeholder'),
        },
        STATIC_VALUE: {
            ID: 'static_value',
            TYPE: t('flow_strings.step_configuration.data_manipulator.static_value.type'),
            MANIPULATION: {
                TYPE_OPTIONS: (isChildMapping = false) => [
                    {
                      label: 'Text',
                      value: 'text',
                    },
                    {
                      label: 'Number',
                      value: 'number',
                    },
                    {
                      label: 'Boolean',
                      value: 'boolean',
                    },
                    !isChildMapping && {
                      label: 'Object',
                      value: 'object',
                    },
                    {
                      label: 'Date',
                      value: 'date',
                    },
                    {
                        label: 'Date & Time',
                        value: 'datetime',
                      },
                    {
                      label: 'Stream',
                      value: 'fileupload',
                    },
                  ].filter(Boolean),
            },
            BOOLEAN_OPTIONS: [
                { label: 'True', value: true },
                { label: 'False', value: false },
            ],
            PLACEHOLDER: 'Enter static value',
        },
        MANIPULATION: {
            PLACEHOLDER: 'Choose flow field',
            OPERATOR_OPTIONS: (isArrayField) => [
                {
                    label: 'Update',
                    value: 'assign',
                },
                isArrayField && {
                    label: 'Append',
                    value: 'append',
                },
            ].filter(Boolean),
        },
    };
};

export const DATA_MANIPULATOR_ERRORS = (t = translateFunction) => {
    return {
        MIN_ONE_REQUIRED: t('flow_strings.step_configuration.data_manipulator.min_one_required'),
    };
};
