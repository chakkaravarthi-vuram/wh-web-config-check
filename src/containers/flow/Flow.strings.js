import React from 'react';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import DeleteIconV2 from '../../assets/icons/form_fields/DeleteIconV2';
// import { translate } from 'language/config';
import SettingsIcon from '../../assets/icons/flow/SettingsIcon';
import { ACTION_TYPE } from '../../utils/constants/action.constant';
import { REASSIGN_MODAL as REASSIGN_MODAL_STRINGS } from '../../components/reassign_modal/ReassignModal.strings';

export const CREATE_FLOW_TAB_INDEX = {
  BASIC_INFO: 1,
  STEPS: 2,
  SECURITY: 3,
};

export const GET_ALL_FIELDS_LIST_BY_FILTER_TYPES = {
  DEFAULT_REPORT_FIELDS: 1,
  IDENTIFIERS: 2,
  TASK_IDENTIFIERS: 3,
  GET_ALL_FIELDS: 4,
};

export const RULE_CONDITIONS = {
      RULE_NAME: 'Rule name',
      RULE_NAME_ID: 'rule_name_id',
      RULE_NAME_PLACEHOLDER: 'Type rule name here…',
      RULE_TYPE: 'Rule type',
      RULE_TYPE_ID: 'rule_type_id',
      RULE_TYPE_PLACEHOLDER: 'Type rule type here…',
      RULE_TYPE_VALUE: 'Actor selection',
};

export const FLOW_WORKFLOW_ALGORITHM = {
  OPTION_LIST: [
    {
      value: 0,
      label: 'Any one of the actors to accept and complete if the step is assigned to more than one person',
    },
    {
      value: 1,
      label: 'Distribute the task to the single person based on the workload',
    },
  ],
};

export const GET_RECURSIVE_DATA_CONSTANTS = {
  REPEAT: {
    ID: 'repeat_every',
    LABEL: 'Repeat Trigger Every', // not used
    DAY: {
      LABEL: ('scheduler_strings.repeat_every.day_option'),
      VALUE: 'day',
    },
    MONTH: {
      LABEL: ('scheduler_strings.repeat_every.month_option'),
      VALUE: 'month',
    },
  },
};

export const FLOW_ACTION_TYPES = {
  END_FLOW: {
    action: 'Mark as Completed',
    action_type: ACTION_TYPE.END_FLOW,
  },
  SEND_BACK: {
    action: 'Reject Back to Previous Step',
    action_type: ACTION_TYPE.SEND_BACK,
  },
  CANCEL: {
    action: 'Cancel',
    action_type: ACTION_TYPE.CANCEL,
  },
  ASSIGN_REVIEW: {
    action: 'Assign this step for further review',
    action_type: ACTION_TYPE.ASSIGN_REVIEW,
  },
  DEFAULT_SEND_BACK: {
    action: 'Send Back to Review Requestor',
    action_type: ACTION_TYPE.DEFAULT_SEND_BACK,
  },
  NEXT: {
    action: 'Submit',
    action_type: ACTION_TYPE.NEXT,
  },
};

const getFlowStrings = (translate = () => {}) => {
  return {
    CREATE_FLOW: {
      TITLE: 'Create Flow',
      IS_FINAL_STEP_TRUE: 1,
      IS_FINAL_STEP_FALSE: 2,
      ALLOW_VIEWERS_TRUE: 1,
      ALLOW_VIEWERS_FALSE: 2,
      ALLOW_ADDITIONAL_OWNERS_TRUE: 1,
      ALLOW_ADDITIONAL_OWNERS_FALSE: 2,
      TABS: [
        {
          TEXT: 'Basic Info',
          INDEX: CREATE_FLOW_TAB_INDEX.BASIC_INFO,
          SUB_TITLE:
            'Creating your flow is just a few steps away, enter your flow name to continue.',
          EDIT_VIEW_SUB_TITLE:
            'Editing your flow is just a few steps away, edit your flow name to continue.',
        },
        {
          TEXT: 'Steps',
          INDEX: CREATE_FLOW_TAB_INDEX.STEPS,
          SUB_TITLE: 'Creating your flow is just a few steps away.',
          EDIT_VIEW_SUB_TITLE:
            'Editing your flow is just a few steps away.',
        },
        {
          TEXT: 'Settings',
          INDEX: CREATE_FLOW_TAB_INDEX.SECURITY,
          SUB_TITLE:
            'Setup your metrics, secure your flow visibility and sharing with easy way.',

        },
      ],
      BASIC_INFO: {
        FLOW_NAME: {
          LABEL: 'Name',
          ID: 'flow_name',
          PLACEHOLDER: 'Enter flow name not exceeding 50 characters',
        },
        SHORT_CODE: {
          LABEL: 'Short code',
          ID: 'flow_short_code',
          PLACEHOLDER: 'Enter short code',
        },
        FLOW_DESCRIPTION: {
          LABEL: 'Description',
          ID: 'flow_description',
          PLACEHOLDER: 'Enter flow description not exceeding 2000 characters',
        },
        FLOW_COLOR: {
          LABEL: 'Choose colour for your flow',
          ID: 'create_flow_color',
          HELPER_TOOLTIP_MESSAGE: 'To uniquely identify the Flow',
        },
        FLOW_CATEGORY: {
          LABEL: 'Category',
          ID: 'create_flow_category',
          PLACEHOLDER: 'Choose flow category',
        },
      },
      STEPS: {
        INITIAL_CONFIGURATION_STEP: {
          FLOW_INITIATION: 'Flow Initiation',
          FLOW_WORKFLOW: 'Flow Workflow',
          FLOW_WORKFLOW_DESCRIPTION:
            'Once the start step for flow is configured, you will get option to configure workflow',
        },
        ADD_STEP: {
          ADD_NEW_STEP: 'Add new step',
          ADD_BUTTON: 'Add',
        },
        STEP: {
          ACTION_CONFIG: {
            CREATE: 'Create Step',
            CHOOSE: 'Choose Step',
            BUTTON_TEXT: 'Add',
            NO_DATA: 'No steps found',
          },
          BASIC_INFO_AND_ACTORS: {
            INDEX: 0,
            PROGRESS_COMMENT: '33.3%',
            TITLE: 'Actors',
            BASIC_INFO_AND_ACTORS_TITLE: 'Step Details & Actors',
            ID: 'create_flow_actors_helper_tooltip',
            HELPER_TOOLTIP_MESSAGE: 'To configure who will be performing this step',
            BASIC_INFO: {
              TITLE: 'Basic Info',
              SUB_TITLE: 'Add your step name and description.',
              STEP_TITLE: {
                PLACEHOLDER: 'Enter step name',
                LABEL: 'Step Name',
                HELPER_TOOLTIP_MESSAGE: 'This is the name that the actor of this step will be as the task title when its get assigned to them',
                ID: 'create_flow_step_name_helper_tooltip',
              },
              STEP_DESCRIPTION: {
                PLACEHOLDER: 'Enter step description',
                LABEL: 'Step Description',
              },
            },
            ACTORS: {
              TITLE: 'Actors',
              SUB_TITLE: 'Add your actors to perform this task.',
              ADD_ACTORS_LABLE: 'Add actors with other options',
              ASSIGNEE_TYPE: {
                LABEL: 'Choose how you like to set actor',
                RADIO_GROUP_OPTION_LIST: [
                  {
                    label: 'Any user(s) or team(s)',
                    value: 'users_or_teams',
                  },
                  {
                    label: 'User who completed any of the previous steps',
                    value: 'other_step_assignee',
                  },
                  {
                    label: 'User value captured in any of the previous steps form field',
                    value: 'form_field_assignee',
                  },
                  {
                    label: 'Reporting manager of the user who completed any of the previous step',
                    value: 'initiator_reporting_manager_assignee',
                  },
                  {
                    label: 'Reporting manager of the user value captured in any of the previous step form field',
                    value: 'form_reporting_manager_assignee',
                  },
                  {
                    label: 'Rule based',
                    value: 'rule_assignee',
                  },
                ],
                OPTION_LIST: [
                  {
                    label: 'Choosing any user(s) or team(s) from my organisation',
                    value: 'users_or_teams',
                    error_text: 'Any user(s) or teams(s) is required',
                  },
                  {
                    label: 'Choose user who completed any of the previous steps',
                    value: 'other_step_assignee',
                    error_text: 'Any of the previous steps is required',
                  },
                  {
                    label: 'Rule Based',
                    value: 'rule_assignee',
                    error_text: 'Any one rule is required',
                  },
                  {
                    label: 'Pick users from user picker form field',
                    value: 'form_field_assignee',
                    error_text: 'User picker form field is required',
                  },
                  {
                    label: 'Reporting manager of the user who completed any of the previous step',
                    value: 'initiator_reporting_manager_assignee',
                    error_text: 'Any of the previous steps is required',
                  },
                  {
                    label: 'Reporting manager of the user value captured in any of the previous step form field',
                    value: 'form_reporting_manager_assignee',
                    error_text: 'Any of the previous step form field is required',
                  },
                ],
              },
              ACTORS_TEAMS: {
                ACTORS_TEAMS_SUGGESTION: {
                  LABEL: 'Choose user(s) or team(s)',
                  PLACEHOLDER: 'Type users(s) or teams(s) name here…',
                },
                CREATE_ADD_ACTORS: 'Create & add users',
                CREATE_ADD_TEAMS: 'Create & add teams',
              },
              FORM_FIELD_ASSIGNEE: {
                CHOOSE_FIELD: {
                  LABEL: 'Choose any one of user picker fields',
                  ID: 'assignee_field_uuid',
                },
                DEFAULT_FIELD_ASSIGNEE: {
                  ID: 'assignee_field_default',
                  LABEL: 'Choose Default User(s)',
                  HELP_TEXT: "Default User(s) will be considered as Actors if selected User Picker field doesn't receive any value",
                },
                REPORTING_MANAGER_DEFAULT_ASSIGNEE: {
                  ID: 'assignee_field_default',
                  LABEL: "If above condition doesn't return a value then assign to",
                  HELP_TEXT: "Default User(s) will be considered as Actors if selected field doesn't receive any value",
                },
              },
              OTHER_STEP_ASSIGNEE: {
                CHOOSE_STEP: {
                  ID: 'other_step_id',
                  PLACEHOLDER: 'Choose step, so the system can assign the user',
                  LABEL: 'Choose step, so the system can assign the user dynamically based on who completed that step',
                },
                DUE_DATA: {
                  ID: 'due_data',
                  LABEL: 'How many days you like to provide as due to complete this step?',
                  DUE_DURATION_TYPES: [{ TYPE: 'days', SUFFIX_LABEL: 'Days' }],
                },
              },
            },
            SCHEDULE_FLOW: {
              CHECKBOX: {
                ID: 'schedule_flow',
                OPTIONS: [
                  {
                    label: translate('flows.start_node_config.schedule_flow.yes_label'),
                    value: true,
                  },
                  {
                    label: translate('flows.start_node_config.schedule_flow.no_label'),
                    value: false,
                  },
                ],
              },
              MULTIPLE_ASSIGNEES: {
                ID: 'is_assign_to_individual_assignees',
                LABEL: 'Task is being assigned to more than one user. Who should complete it?', // this label not used
                OPTIONS: [
                  {
                    label: translate('common_strings.multiple_assignees.any_one_label'),
                    value: true,
                  },
                  {
                    label: translate('common_strings.multiple_assignees.all_assignees_label'),
                    value: false,
                  },
                ],
              },
              REPEAT_EVERY: {
                ID: GET_RECURSIVE_DATA_CONSTANTS.REPEAT.ID,
                LABEL: GET_RECURSIVE_DATA_CONSTANTS.REPEAT.LABEL,
                OPTIONS: [
                  {
                    label: translate(GET_RECURSIVE_DATA_CONSTANTS.REPEAT.DAY.LABEL),
                    value: GET_RECURSIVE_DATA_CONSTANTS.REPEAT.DAY.VALUE,
                  },
                  {
                    label: translate(GET_RECURSIVE_DATA_CONSTANTS.REPEAT.MONTH.LABEL),
                    value: GET_RECURSIVE_DATA_CONSTANTS.REPEAT.MONTH.VALUE,
                  },
                ],
                TIME: {
                  ID: 'at',
                  LABEL: 'At',
                },
                DAY: {
                  ID: 'on_day',
                  LABEL: 'On Days',
                },
                MONTH: {
                  ID: 'repeat_type',
                  LABEL: 'Repeat on',
                  OPTIONS: [
                    {
                      label: translate('scheduler_strings.repeat_every.month.options.first_day'),
                      value: 'first_day',
                    },
                    {
                      label: translate('scheduler_strings.repeat_every.month.options.last_day'),
                      value: 'last_day',
                    },
                    {
                      label: translate('scheduler_strings.repeat_every.month.options.selected_week_day'),
                      value: 'selected_week_day',
                    },
                    {
                      label: translate('scheduler_strings.repeat_every.month.options.selected_date'),
                      value: 'selected_date',
                    },
                  ],
                },
                WEEK: {
                  ID: 'set_week',
                  OPTIONS: [
                    {
                      label: translate('scheduler_strings.repeat_every_week.first_week'),
                      value: 1,
                    },
                    {
                      label: translate('scheduler_strings.repeat_every_week.second_week'),
                      value: 2,
                    },
                    {
                      label: translate('scheduler_strings.repeat_every_week.third_week'),
                      value: 3,
                    },
                    {
                      label: translate('scheduler_strings.repeat_every_week.fourth_week'),
                      value: 4,
                    },
                  ],
                },
              },
            },
          },
          FORMS: {
            INDEX: 1,
            TITLE: 'Forms',
            FORM_TITLE: 'Design Form',
            ID: 'create_flow_forms_helper_tooltip',
            HELPER_TOOLTIP_MESSAGE: 'To configure the data that the user need to provide or look into during this step',
            SUB_TITLE: 'Add form fields to capture information.',
            PROGRESS_COMMENT: '66.6%',
            DATA_COLLECTION_CONFIRMATION: {
              LABEL:
                'Do you wish to collect any data from the user on this step?:',
              OPTION_LIST: [
                { value: 1, label: 'Yes' },
                { value: 2, label: 'No' },
              ],
            },
            NO_SOURCE: {
              TITLE: 'Create New Form',
              SUB_TITLE: 'Helps you to build new form from scratch',
              INDEX: 1,
            },
            IMPORT_SOURCE: {
              TITLE: 'Import Existing Form',
              SUB_TITLE: 'Helps you to get previous steps form fields and sections',
              INDEX: 2,
            },
            IMPORT_FORM_POP_UP: {
              TITLE: 'Import Task Form',
              SUB_TITLE: 'Copy and Import first task form as read only',
              CANCEL: 'Cancel',
              IMPORT: 'Import',
            },
            FIELD_SUGGESTIONS: {
              TITLE: 'Field suggestions',
              DESC:
                'Choose the below fields. if it suits for your requirement.',
              MORE_SUGGESTIONS: 'More Suggessions',
              HIDE: 'Hide suggestions',
              UNHIDE: 'Show suggestions',
            },
          },
          CONFIGURATION: {
            INDEX: 2,
            TITLE: 'Additional Configuration',
            ID: 'create_flow_addon_configuration',
            HELPER_TOOLTIP_MESSAGE: 'To configure what action that this step actor can take when he completes the form of this step',

          },
          ACTIONS: {
            INDEX: 2,
            TITLE: 'Actions',
            CONFIGURATION_TITLE: 'Additional Configuration',
            ID: 'create_flow_actions_helper_tooltip',
            HELPER_TOOLTIP_MESSAGE: 'To configure what action that this step actor can take when he completes the form of this step',
            SUB_TITLE: 'Set the next action once the actor complete this step',
            PROGRESS_COMMENT: '100%',
            FINAL_STEP_CONFIRMATION: {
              LABEL: 'Is this the final step in the flow?',
              OPTION_LIST: [
                { value: 1, label: 'Yes' },
                { value: 2, label: 'No' },
              ],
            },
            ADD_ACTION: 'Add more task actions',
            ACTION: {
              ACTION_DD: {
                LABEL: 'If the user clicks the button take to',
                PLACEHOLDER: 'Choose next step',
              },
              ADVANCED_OPTION: 'Advanced options',
            },
            ACTION_CARD: {
              DIALOG_BOX_TITLE: {
                FORWARD_ACTION: 'Next Step Action Configuration',
                END_ACTION: 'End Action Configuration',
                REJECT_ACTION: 'Reject Action Configuration',
                CANCEL_ACTION: 'Cancel Action Configuration',
              },
              DESCRIPTION: {
                END_ACTION: 'It will complete the Flow Flow',
                REJECT_ACTION: 'It will reject Back to Previous Step',
                CANCEL_ACTION: 'It will cancel the Flow Flow',
              },
            },
          },

          ACTION_BUTTONS: {
            START: 'Next',
            ADD_ACTORS: 'Next',
            BACK: 'Back',
            NEXT: 'Next',
            CREATE_STEP: 'Update',
            FINISH: 'Finish',

            NEXT_FORM: 'Next: Form',
            NEXT_ACTIONS: 'Next: Actions',
            BACK_FORM: 'Back: Form',
            BACK_ACTORS: 'Back: Actors',
            UPDATE: 'Update',

            FORM: 'Form',
            ACTIONS: 'Actions',
            ACTORS: 'Actors',
            SAVE_STEP: 'Save Step',
          },
        },
      },
      SECURITY: {
        READ_ONLY_ACCESS_CONFIRMATION: {
          LABEL:
            'Flow Data Security',
          OPTION_LIST: [
            { value: false, label: 'Tight security, participants of an instance will have access to see only their instance data' },
            { value: true, label: 'Open security, all people who have access to the flow will be able to see all instance data' },
          ],
        },
        ACTORS_TEAMS_SUGGESTION: {
          LABEL: 'User(s) or Team(s) who have permission to view all the data of this flow',
        },
        ADDITIONAL_OWNER_CONFIRMATION: {
          LABEL:
            'Do you like to add additional owner to administrate this flow?',
          OPTION_LIST: [
            { value: 1, label: 'Yes' },
            { value: 2, label: 'No' },
          ],
        },
      },
      ACTION_BUTTONS: {
        BACK: translate('publish_settings.footer_buttons.back'),
        CANCEL: 'Cancel',
        SAVE: 'Save',
        SAVE_CHANGES: 'Save Changes',
        NEXT: translate('publish_settings.footer_buttons.next'),
        CREATE_STEP: 'Update',
        PUBLISH: translate('publish_settings.footer_buttons.publish'),
        PUBLISH_CHANGES: 'Publish Changes',
        SAVE_AND_CLOSE: translate('publish_settings.footer_buttons.save_and_close'),
        START: 'Start',
        CONTINUE: translate('publish_settings.footer_buttons.continue'),
        DISCARD: 'Discard',
        PUBLISH_FOR_TESTING: 'Publish for Testing',
      },
      SETTINGS: {
        METRIC_ERROR_MESSAGE: 'The value that has been selected earlier has been marked as invalid and removed from the value list. Please select a value from the current list.',
        SECURITY_SETTINGS: {
          LABEL: 'Security Settings',
          ID: 'security_settings',
        },
        CONGIFURE_SCHEDULER: {
          LABEL: 'Configure Scheduler',
          ID: 'configure_scheduler',
        },
        ADDON_SETTINGS: {
          LABEL: 'Addon Settings',
          ID: 'addon_settings',
        },
        ADD_DATA: {
          ADD_NEW_DATA: translate('publish_settings.dashboard_settings.metrics.add_data.add_new_data'),
          ADD_BUTTON: 'Add',
        },
        IDENTIFIER: {
          DROPDOWN: {
            ID: 'custom_identifier',
            DATALIST_LABEL: translate('publish_settings.addon_settings.identifier.dl_title'),
            LABEL: 'Choose a field in the flow by which you like to uniquely identify each flow entries',
          },
          CHECKBOX: {
            ID: 'is_system_identifier',
            OPTIONS: [
              {
                label: translate('publish_settings.addon_settings.identifier.checkbox_label'),
                value: 1,
              },
            ],
          },
        },
        TASK_IDENTIFIER: {
          DROPDOWN: {
            ID: 'task_identifier',
            LABEL: 'Configure how the tasks of this flow should be displayed to the user in their task queue?*',
          },
        },
        CATEGORY: {
          LABEL: 'Category',
          PLACEHOLDER: 'Select',
          ID: 'category',
          ADD_NEW_CATEGORY: {
            ID: 'newCategoryValue',
          },
          CREATE_LABEL: 'Create Category',
          CHOOSE_LABEL: 'Choose Category',
          BUTTON_TEXT: 'Create',
          NO_DATA: 'No category found',
        },
      },
    },
    EDIT_FLOW: (isDraftFlowView, status, version) => (isDraftFlowView ? {
      TITLE: 'Edit Flow',
      MENU_DROPDOWN_LIST: ((status === 'published') || (version > 1)) ? [
        {
          label: 'Flow Settings',
          icon: <SettingsIcon />,
          value: 2,
        },
        {
          label: translate('flows.form_field_design.discard_flow'),
          icon: <SettingsIcon />,
          value: 3,
        },
      ] : [
        {
          label: 'Flow Settings',
          icon: <SettingsIcon />,
          value: 2,
        },
      ],
    } : {
      TITLE: 'Edit Flow',
      MENU_DROPDOWN_LIST: ((status === 'published') || (version > 1)) ? [
        {
          label: translate('flows.form_field_design.discard_flow'),
          icon: <SettingsIcon />,
          value: 3,
        },
        {
          label: 'Delete this Flow',
          icon: <DeleteIconV2 />,
          value: 1,
        },
      ] : [
        {
          label: 'Delete this Flow',
          icon: <DeleteIconV2 />,
          value: 1,
        },
      ],
    }),
    EDIT_DATA_LIST: (isDraftDataListView, status, version) => (isDraftDataListView ? {
      TITLE: 'Create a Datalist',
      MENU_DROPDOWN_LIST: ((status === 'published') || (version > 1)) ? [
        {
          label: 'Datalist Settings',
          icon: <SettingsIcon />,
          value: 2,
        },
        {
          label: 'Discard Datalist',
          icon: <SettingsIcon />,
          value: 3,
        },
      ] : [
        {
          label: 'Datalist Settings',
          icon: <SettingsIcon />,
          value: 2,
        },
      ],
    } : {
      TITLE: 'Edit Datalist',
      MENU_DROPDOWN_LIST: ((status === 'published') || (version > 1)) ? [
        {
          label: translate('datalist.create_data_list.discard_datalist'),
          icon: <SettingsIcon />,
          value: 3,
        },
        {
          label: translate('datalist.create_data_list.delete_datalist'),
          icon: <DeleteIconV2 />,
          value: 1,
        },
      ] : [
        {
          label: translate('datalist.create_data_list.delete_datalist'),
          icon: <DeleteIconV2 />,
          value: 1,
        },
      ],
    }),
    DELETE_FLOW: {
      TITLE: 'Delete Flow',
      RADIO_GROUP_OPTION_LIST: [
        {
          label: 'Remove all the instances that are active for this flow',
          value: 1,
        },
        {
          label:
            'Keep the active instances and prevent to start the new instance of the flow',
          value: 2,
        },
      ],
    },
    DELETE_DATALIST: {
      TITLE: translate('datalist.delete.title'),
      DEL_DRAFT_DATALIST: translate('datalist.delete.del_draft_datalist'),
      DEL_DATALIST: translate('datalist.delete.del_datalist'),
      CANCEL: translate('datalist.delete.cancel'),
      DELETE: translate('datalist.delete.delete'),
      RADIO_GROUP_OPTION_LIST: [
        {
          label: 'Remove all the instances that are active for this datalist',
          value: 1,
        },
        {
          label:
            'Keep the active instances and prevent to start the new instance of the datalist',
          value: 2,
        },
      ],
    },
    FLOW_DASHBOARD: {
      // TITLE: 'Flow Dashboard',
      ACTION_BUTTONS: {
        EDIT: translate('flow_dashboard.action_button.edit'),
        VIEW: translate('flow_dashboard.action_button.view'),
        START: translate('flow_dashboard.action_button.start'),
        START_TEST: translate('flow_dashboard.action_button.start_test'),
        DOWNLOAD_DOCUMENT: translate('flow_dashboard.action_button.download_document'),
        PUBLISH: translate('flow_dashboard.action_button.publish_for_live'),
      },
      TABLE_HEADER_STRINGS: {
        FLOW_ID: translate('flow_dashboard.table_header_strings.flow_id'),
        STEP_NAME: translate('flow_dashboard.table_header_strings.step_name'),
        FIRST_STEP_STARTED_ON: translate('flow_dashboard.table_header_strings.first_step_started_on'),
        CREATED_BY: translate('flow_dashboard.table_header_strings.created_by'),
        CREATED_ON: translate('flow_dashboard.table_header_strings.created_on'),
        UPDATED_ON: translate('flow_dashboard.table_header_strings.updated_on'),
        UPDATED_BY: translate('flow_dashboard.table_header_strings.updated_by'),
        OPEN_WITH: translate('flow_dashboard.table_header_strings.open_with'),
        STATUS: translate('flow_dashboard.table_header_strings.status'),
      },
      REASSIGNED_VALIDATION_STRINGS: {
        REASSIGN_FAILED: 'Task Reassign Failed',
        REASSIGNED_SUCCESSFULLY: translate('flow_dashboard.tasks_strings.reassigned_successfully'),
        REASSIGNED_ASSIGNEES: 'Selected User(s) or Team(s) Already having the tasks',
      },
    },
    RULE: {
      ADD_RULE: 'Select data field for the rule',
      ADD_BUTTON: 'Add',
      IF_LABEL: 'When',
      ELSE_IF_LABEL: 'Then assign to',
      ADD_CONDITION: '+ Add Another Condition',
      ADD_MULTI_CONDITION: 'Add Multi Condition',
      ELSE_LABEL: 'If above conditions are not satisfied then assign to',
      ADDMEMBER_PLACEHOLDER: 'Select user or team',
      RULE_NAME: 'Rule name',
      RULE_NAME_ID: 'rule_name_id',
      RULE_NAME_PLACEHOLDER: 'Type rule name here…',
      RULE_TYPE: 'Rule type',
      RULE_TYPE_ID: 'rule_type_id',
      RULE_TYPE_PLACEHOLDER: 'Type rule type here…',
    },
    CREATE_DATA_LIST: {
      TITLE: translate('datalist.create_data_list.title'),
      SUBTITLE: translate('datalist.create_data_list.subtitle'),
      EDIT_TITLE: translate('datalist.create_data_list.edit_title'),
      BASIC_INFO: {
        DATA_SET_NAME: {
          LABEL: translate('datalist.create_data_list.basic_info.data_set_name.label'),
          ID: 'data_list_name',
          PLACEHOLDER: translate('datalist.create_data_list.basic_info.data_set_name.placeholder'),
        },
        REFERENCE_NAME: {
          LABEL: translate('datalist.create_data_list.basic_info.reference_name.label'),
          ID: 'technical_reference_name',
          PLACEHOLDER: translate('datalist.create_data_list.basic_info.reference_name.placeholder'),
        },
        SHORT_CODE: {
          LABEL: translate('datalist.create_data_list.basic_info.short_code.label'),
          ID: 'data_list_short_code',
          PLACEHOLDER: translate('datalist.create_data_list.basic_info.short_code.placeholder'),
        },
        DATA_SET_DESCRIPTION: {
          LABEL: translate('datalist.create_data_list.basic_info.data_set_description.label'),
          ID: 'data_list_description',
          PLACEHOLDER: translate('datalist.create_data_list.basic_info.data_set_description.placeholder'),
        },
        DATA_SET_COLOR: {
          ID: 'data_list_color',
          LABEL: 'Choose a Color',
          HELPER_TOOLTIP_MESSAGE: 'To uniquely identify the Datalist',
        },
        DATA_LIST_CATEGORY: {
          LABEL: translate('publish_settings.addon_settings.category.dropdown.label'),
          ID: 'category',
          PLACEHOLDER: translate('publish_settings.addon_settings.category.dropdown.dl_placeholder'),
          FLOW_PLACEHOLDER: translate('publish_settings.addon_settings.category.dropdown.flow_placeholder'),
          DROPDOWN: {
            CREATE_LABEL: translate('publish_settings.addon_settings.category.dropdown.create_label'),
            CHOOSE_LABEL: translate('publish_settings.addon_settings.category.dropdown.choose_label'),
            BUTTON_TEXT: translate('publish_settings.addon_settings.category.dropdown.button_text'),
            NO_DATA: translate('publish_settings.addon_settings.category.dropdown.no_data'),
          },
        },
      },
      DATA_LIST_DESCRIPTION: translate('datalist.create_data_list.data_list_desc_placeholder'),
      SECTION_WITHOUT_FIELDLIST_TITLE: translate('datalist.create_data_list.section_without_fieldlist_title'),
      SECTION_WITHOUT_FIELDLIST_SUBTITLE: translate('datalist.create_data_list.section_without_fieldlist_subtitle'),
      SECTION_WITHOUT_CONTENT: translate('datalist.create_data_list.section_without_content'),
      DATA_LIST_PLACEHOLDER: translate('datalist.create_data_list.data_list_placeholder'),
    },
  };
};

export const PUBLISH_TO_TEST_STRINGS = {
  TITLE: 'Publish for Testing',
  BUTTON: {
    SECONDARY: 'Go Back',
    PRIMARY: 'Publish for Testing',
  },
  CONTENT: [
    {
      ID: '1',
      QUESTION: 'What is test mode?',
      ANSWER:
        'Test mode lets you publish your flows for testing. Only a selected few people can access these flows under test mode. Once you feel like you are done testing the flow you can publish the flow for live to be accessed by everyone in Workhall.',
    },
    {
      ID: '2',
      QUESTION: 'How test mode works?',
      ANSWER:
        "When you publish something on test mode, it is available for only a selected few to view. These flows, and the task associated with them will be available in the dashboard along with all other flows/ tasks. To switch off test mode, open the particular flow. There will be an option called 'Publish for live' in the top-right corner. Clicking this will switch off the test mode and publish the flow. It can be switched back on at any time - even after publishing.",
    },
  ],
};

export const PUBLISH_TO_LIVE_STRINGS = (translate) => {
  return {
  TITLE: translate('flows.publish_to_live_strings.title'),
  BUTTON: {
    SECONDARY: translate('flows.publish_test_strings.button.primary'),
    PRIMARY: translate('flows.publish_to_live_strings.title'),
  },
  CONTENT: [
    {
      ID: '1',
      TITLE: translate('flows.publish_to_live_strings.content.title'),
      POINTS: [
        {
          ID: '1',
          TEXT: translate('flows.publish_to_live_strings.content.point_text'),
        },
      ],
    },
  ],
};
};

export const EDIT_TEST_FLOW_STRINGS = (translate) => {
  return {
  TITLE: translate('flows.edit_test_flow_strings.title'),
  BUTTON: {
    SECONDARY: translate('flows.publish_test_strings.button.primary'),
    PRIMARY: translate('flows.edit_test_flow_strings.proceed_button'),
  },
  CONTENT: [
    {
      ID: '1',
      TITLE: translate('flows.edit_test_flow_strings.content_title'),
    },
  ],
};
};

export const EDIT_LIVE_FLOW_STRINGS = (translate) => {
  return {
  TITLE: translate('flows.edit_live_flow_strings.title'),
  BUTTON: {
    PRIMARY: translate('flows.edit_live_flow_strings.close_button'),
  },
  URI_INDEX: 2,
  CONTENT: [
    {
      ID: '1',
      TITLE: translate('flows.edit_live_flow_strings.content.title_1'),
    },
    {
      ID: '2',
      TITLE: translate('flows.edit_live_flow_strings.content.title_2'),
    },
    {
      ID: '3',
      TITLE: translate('flows.edit_live_flow_strings.content.title_3'),
      IS_DYNAMIC_LINK: true,
      URI: '',
    },
  ],
};
};

export const REASSIGNED_VALUES = {
  SEND_EMAIL: {
    ID: 'send_email',
    OPTION_LIST: [{ label: REASSIGN_MODAL_STRINGS.REASSIGN_EMAIL_LABEL, value: 1 }],
  },
};

export const taskReassignmentHeaders = [REASSIGN_MODAL_STRINGS.TASK_NAME, REASSIGN_MODAL_STRINGS.OPEN_WITH, REASSIGN_MODAL_STRINGS.PENDING_SINCE];

export const INTIALLSTFORWARDREJECTCANCEL =
{
  l_selectedFieldValue: '',
  l_field: '',
  err_l_field: EMPTY_STRING,
  arrOperatorData: [],
  operator: '',
  err_operator: '',
  selectedOperatorData: '',
  r_value: '',
  err_r_value: '',
  is_hide_show_action: false,
  condition_rule: '',
  error_list: {},
};

export const REASSIGN_MODAL = {
  SUMMARY: {
    OPEN: {
      ID: 'reassign_meatBball_menu_open',
    },
    REASSIGNED: {
      ID: 'reassign_meatball_menu_reassigned',
    },
  },
  HEADER: {
    REASSIGN_MODALVIEW: 'reassign_modal',
    REASSIGN_MODAL_OUTER: 'reassign_modal_div',
  },
};

export const FLOW_STRINGS = (translate) => getFlowStrings(translate);
