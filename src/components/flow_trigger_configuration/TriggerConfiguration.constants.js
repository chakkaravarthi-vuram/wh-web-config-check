import { FIELD_TYPES } from 'components/form_builder/FormBuilder.strings';
import { FIELD_LIST_TYPE } from 'utils/constants/form.constant';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
// import { translate } from 'language/config';

export const FIELD_MAPPING_TYPES = {
    STATIC: 'static',
    DYNAMIC: 'dynamic',
    SYSTEM: 'system',
};

export const FLOW_TRIGGER_CONSTANTS = {
    FLOW_SELECTION: {
        ID: 'child_flow_uuid',
        PLACEHOLDER: 'flow_trigger.trigger_config_constants.choose_flow_placeholder',
        LABEL: 'flow_trigger.trigger_config_constants.choose_flow_label',
        STEP: 'step_name',
        SHORTCUT_NAME: 'trigger_name',
    },
    STEP_NAME: {
        ID: 'step_name',
        LABEL: 'flow_trigger.trigger_config_constants.step_name_label',
    },
    SAVE_BUTTON: 'publish_settings.dashboard_settings.metrics.buttons.save',
    CANCEL_BUTTON: 'publish_settings.dashboard_settings.metrics.buttons.cancel',
    DELETE_BUTTON: 'parallel_step_config.footer.delete',
    TRIGGER_CONFIG_MODAL_ID: 'adhoc_create_task_modal',
    CREATE_FLOW_LINK: 'flow_trigger.trigger_config_constants.create_flow_link',
    TRIGGER_SHORTCUT_HEADER: 'publish_settings.dashboard_settings.trigger_shortcut.title',
    TRIGGER_CONFIG_HEADER: 'flow_trigger.trigger_config_constants.modal_header',
    PARENT_FLOW_FIELDS_SET_STATE_KEY: 'parentFlowlstAllFields',
    PARENT_FLOW_FIELDS_METADATA_SET_STATE_KEY: 'parentFlowlstAllFieldsMetaData',
    CHILD_FLOW_FIELDS_SET_STATE_KEY: 'childFlowlstAllFields',
    CHILD_FLOW_FIELDS_METADATA_SET_STATE_KEY: 'childFlowlstAllFieldsMetaData',
    FILE_UPLOAD: 'task_content.landing_page_translation.file',
    FIELD_MATCH_CATEGORY: {
        CATEGORY_1: [FIELD_TYPES.NUMBER],
        CATEGORY_2: [FIELD_TYPES.SINGLE_LINE, FIELD_TYPES.DROPDOWN, FIELD_TYPES.RADIO_GROUP, FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN],
    },
    INITIAL_STEP_ACTORS: {
        ID: 'trigger_initial_step_actors',
        LABEL: 'publish_settings.security_settings.permitted_actors_teams.label',
    },
    SHORTCUT_NAME: {
        ID: 'trigger_name',
        LABEL: 'flow_trigger.trigger_config_constants.shortcut_name',
    },
    TRIGGER_HELPER_TOOLTIP_ID: 'triggerStepActorTooltip',
    FIRST_STEP_ACTOR_TOOLTIP: 'flow_trigger.trigger_config_constants.first_step_actor_tooltip',
    TRIGGER_NAME_STRING: 'flow_trigger.trigger_config_constants.trigger_name_string',
    CHILD_FIELD_STRING: 'flow_trigger.trigger_config_constants.child_field_string',
    PARENT_FIELD_STRING: 'flow_trigger.trigger_config_constants.parent_field_string',
    SYSTEM_FIELD_LIST: (t) => [
        { id: 'identifier', label: t('flows.system_field_options_list.flow_id'), value: 'flow_id', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.SINGLE_LINE },
        { id: 'initiated_by', label: t('flows.system_field_options_list.created_by'), value: 'created_by', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.USER_TEAM_PICKER },
        { id: 'created_on', label: t('flows.system_field_options_list.created_on'), value: 'created_on', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.DATETIME },
        { id: 'last_updated_on', label: t('flows.system_field_options_list.updated_on'), value: 'last_updated_on', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.DATETIME },
        { id: 'last_updated_by', label: t('flows.system_field_options_list.updated_by'), value: 'last_updated_by', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.USER_TEAM_PICKER },
        { id: 'flow_link', label: t('flows.system_field_options_list.flow_link'), value: 'flow_link', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.LINK },
        { id: 'data_list_id', label: t('flows.system_field_options_list.data_list_id'), value: 'data_list_id', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.SINGLE_LINE },
        { id: 'data_list_link', label: t('flows.system_field_options_list.data_list_link'), value: 'data_list_link', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.LINK },
    ],
    FLOW_SYSTEM_FIELD_OPTIONS_LIST: (t) => [
        { label: t('configuration_strings.all_labels.System_fields'), value: 'System Fields', optionType: 'Title', disabled: true },
        { id: 'identifier', label: t('flows.system_field_options_list.flow_id'), value: 'flow_id', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.SINGLE_LINE },
        { id: 'initiated_by', label: t('flows.system_field_options_list.created_by'), value: 'created_by', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.USER_TEAM_PICKER },
        { id: 'created_on', label: t('flows.system_field_options_list.created_on'), value: 'created_on', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.DATETIME },
        { id: 'last_updated_on', label: t('flows.system_field_options_list.updated_on'), value: 'last_updated_on', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.DATETIME },
        { id: 'last_updated_by', label: t('flows.system_field_options_list.updated_by'), value: 'last_updated_by', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.USER_TEAM_PICKER },
        { id: 'flow_link', label: t('flows.system_field_options_list.flow_link'), value: 'flow_link', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.LINK },
    ],
    DATALIST_SYSTEM_FIELD_OPTIONS_LIST: (t) => [
        { label: t('configuration_strings.all_labels.System_fields'), value: 'System Fields', optionType: 'Title', disabled: true },
        { id: 'data_list_id', label: t('flows.system_field_options_list.data_list_id'), value: 'data_list_id', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.SINGLE_LINE },
        { id: 'initiated_by', label: t('flows.system_field_options_list.created_by'), value: 'created_by', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.USER_TEAM_PICKER },
        { id: 'created_on', label: t('flows.system_field_options_list.created_on'), value: 'created_on', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.DATETIME },
        { id: 'last_updated_on', label: t('flows.system_field_options_list.updated_on'), value: 'last_updated_on', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.DATETIME },
        { id: 'last_updated_by', label: t('flows.system_field_options_list.updated_by'), value: 'last_updated_by', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.USER_TEAM_PICKER },
        { id: 'data_list_link', label: t('flows.system_field_options_list.data_list_link'), value: 'data_list_link', system_field_type: FIELD_MAPPING_TYPES.SYSTEM, field_type: FIELD_TYPES.LINK },
    ],
};

export const NEW_MAPPING_DATA = {
    value_type: FIELD_MAPPING_TYPES.DYNAMIC,
    mapping_field_type: FIELD_LIST_TYPE.DIRECT,
    parent_field_details: {
        field_uuid: EMPTY_STRING,
        field_name: EMPTY_STRING,
    },
    child_field_details: {
        field_uuid: EMPTY_STRING,
        field_name: EMPTY_STRING,
    },
    static_value: EMPTY_STRING,
    parent_table_field_details: {
        field_uuid: EMPTY_STRING,
        field_name: EMPTY_STRING,
    },
    child_table_field_details: {
        field_uuid: EMPTY_STRING,
        field_name: EMPTY_STRING,
    },
    // field_mapping: {
    //     value_type: FIELD_MAPPING_TYPES.DYNAMIC,
    //     parent_field_details: {
    //         field_uuid: EMPTY_STRING,
    //         field_name: EMPTY_STRING,
    //     },
    //     child_field_details: {
    //         field_uuid: EMPTY_STRING,
    //         field_name: EMPTY_STRING,
    //     },
    //     static_value: EMPTY_STRING,
    // },
};
