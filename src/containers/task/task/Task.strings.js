import { DATE_VALIDATION } from 'components/form_builder/FormBuilder.strings';
import { translate } from 'language/config';
import { FORM_POPOVER_STATUS, ASSIGNEES_TYPE } from '../../../utils/Constants';
import { store } from '../../../Store';

export const ADD_TASK = {
  DRAFT_TASK: 'create_task.form.add_task.draft_task',
  HOME: 'create_task.form.add_task.home',
  EDIT_TASK: 'create_task.form.add_task.edit_task',
  CREATE_TASK: 'create_task.form.add_task.create_task',
};

export const FILE_DROP_DOWN_STRINGS = {
ATTACH_LABEL: 'file_upload_drop.attach_your_file',
DRAG_LABEL: 'file_upload_drop.drop_files_label',
BROWSE: 'file_upload_drop.browse',
};

export const getBreadcrumbList = (locationHistory, isEditTask, t) => {
  const { pathname } = locationHistory.location;
  const locationState = locationHistory.location.state;
  return ([{
    text: (pathname.includes('draftTasks') && pathname.split('/')[3] && !locationState?.mlAction) ? t(ADD_TASK.DRAFT_TASK)
      : (locationState && !locationState?.mlAction) ? locationState.originalLocation : t(ADD_TASK.HOME),
  },
  {
    text: isEditTask ? t(ADD_TASK.EDIT_TASK) : t(ADD_TASK.CREATE_TASK),
  },
  ]);
};

const CREATE_TASK_STRINGS =
  store.getState().LocalizationReducer.languageSettings.strings.CREATE_TASK;

export const getActorsStrings = () => {
  return {
    ACTOR_TYPE: {
      LABEL: CREATE_TASK_STRINGS.ACTORS_ACTOR_TYPE_LABEL,
      MEMBER_OR_TEAM: 1,
      RULE_BASED: 2,
      OPTION_LIST: [
        {
          value: 1,
          label: CREATE_TASK_STRINGS.ACTORS_ACTOR_TYPE_MEMBER_TEAM,
        },
        {
          value: 2,
          label: CREATE_TASK_STRINGS.ACTORS_ACTOR_TYPE_RULE_BASED,
        },
      ],
    },

    MEMBER_OR_TEAM: {
      ASSIGN_TO: {
        ID: 'assignees',
        PLACEHOLDER:
          CREATE_TASK_STRINGS.ACTORS_MEMBER_OR_TEAM_ASSIGN_TO_PLACEHOLDER,
        LABEL: CREATE_TASK_STRINGS.ACTORS_MEMBER_OR_TEAM_ASSIGN_TO_LABEL,
      },
      DUE_DATE: {
        LABEL: CREATE_TASK_STRINGS.ACTORS_MEMBER_OR_TEAM_DUE_DATE_LABEL,
        ID: 'due_date',
      },
    },
  };
};

export const getTaskStrings = () => {
  return {
    TITLE: translate('create_task.form.add_task.create_task'),
    EDIT_TITLE: translate('create_task.form.add_task.edit_task'),
    TASK_TITLE: {
      LABEL: CREATE_TASK_STRINGS.TASK_TITLE_LABEL,
      ID: 'task_name',
      PLACEHOLDER: CREATE_TASK_STRINGS.TASK_TITLE_PLACEHOLDER,
    },
    TASK_SUB_TITLES: {
      BASIC_DETAILS: { LABEL: 'create_task.form.task_subtitles.basic_details' },
      FORM_BUILDER: { LABEL: 'create_task.form.task_subtitles.form_builder' },
      REMOVE_FORM_BUILDER: { LABEL: 'create_task.form.task_subtitles.remove_form_builder' },
      ATTACHMENTS: { LABEL: 'create_task.form.task_subtitles.attachments_label' },
    },
    TASK_TYPES: {
      LABEL:
      translate('create_task.form.task_types.label'),
      ID: 'is_assign_to_individual_assignees',
      OPTION_LIST: [
        { label: translate('create_task.form.task_types.option_list.all_label'), value: ASSIGNEES_TYPE.ALL },
        { label: translate('create_task.form.task_types.option_list.any_label'), value: ASSIGNEES_TYPE.ANYONE },
      ],
    },
    DRAFT_TASK_SUBMIT_SUCCESS: (t = () => {}) => {
      return {
        title: t('create_task.form.draft_task_submit_success.title'),
        subTitle: '',
        status: FORM_POPOVER_STATUS.SUCCESS,
        isVisible: true,
      };
    },
    SAVE_POPOVER: {
      title: translate('create_task.form.save_popover.title'),
    },
    SAVE_POPOVER_FAILURE: {
      title: translate('create_task.form.save_popover_failure.title'),
      subTitle: translate('create_task.form.save_popover_failure.subTitle'),
    },
    TASK_DESCRIPTION: {
      LABEL: CREATE_TASK_STRINGS.TASK_DESCRIPTION_LABEL,
      ID: 'task_description',
      PLACEHOLDER: CREATE_TASK_STRINGS.TASK_DESCRIPTION_PLACEHOLDER,
    },
    FORM_TITLE: {
      LABEL: CREATE_TASK_STRINGS.FORM_TITLE_LABEL,
      ID: 'form_title',
      PLACEHOLDER: CREATE_TASK_STRINGS.FORM_TITLE_PLACEHOLDER,
    },
    FORM_DESCRIPTION: {
      LABEL: CREATE_TASK_STRINGS.FORM_DESCRIPTION_LABEL,
      ID: 'form_description',
      PLACEHOLDER: CREATE_TASK_STRINGS.FORM_DESCRIPTION_PLACEHOLDER,
    },
    SECTIONS: 'sections',
    SECTION: translate('form_validation_schema.section'),
    PUBLISH: CREATE_TASK_STRINGS.TASK_PUBLISH,
    SAVE: CREATE_TASK_STRINGS.TASK_SAVE,
    ADD_FORM_BUTTON: CREATE_TASK_STRINGS.TASK_ADD_FORM_BUTTON,
    DELETE_FORM_BUTTON: CREATE_TASK_STRINGS.TASK_DELETE_FORM_BUTTON,
    TASK_SUBMIT_SUCCESSFUL_UPDATE: {
      title: CREATE_TASK_STRINGS.TASK_SUBMIT_SUCCESSFUL_UPDATE_TITLE,
      subTitle: CREATE_TASK_STRINGS.TASK_SUBMIT_SUCCESSFUL_UPDATE_SUBTITLE,
      status: FORM_POPOVER_STATUS.SUCCESS,
      isVisible: true,
    },
    PUBLISH_TASK_ERROR_UPDATE_SUBTITLE: translate('create_task.form.publish_task_error_update_subtitle'),
    PUBLISH_TASK_ERROR_UPDATE: {
      title: translate('create_task.form.task_error_update.title'),
      status: FORM_POPOVER_STATUS.SERVER_ERROR,
      isVisible: true,
    },
    SAVE_TASK_ERROR_UPDATE: {
      title: translate('create_task.form.task_error_update.title'),
      status: FORM_POPOVER_STATUS.SERVER_ERROR,
      isVisible: true,
    },
    DEFAULT_RULE_SAVE: {
      title: translate('create_task.form.default_rule_save'),
    },
    ACTION_BUTTONS: {
      BACK: translate('create_task.form.action_buttons.back'),
      CANCEL: 'create_task.form.action_buttons.cancel',
      SAVE_DRAFT: 'create_task.form.action_buttons.save_draft',
      NEXT: translate('create_task.form.action_buttons.next'),
      CREATE: 'create_task.form.action_buttons.create',
      ADD_FORM: 'create_task.form.action_buttons.add_form',
    },
    FORM_CONFIRMATION: {
      ID: 'form_confirmation',
      LABEL: translate('create_task.form.form_confirmation.label'),
      OPTION_LIST: [
        {
          value: true,
          label: translate('create_task.form.form_confirmation.yes_label'),
        },
        {
          value: false,
          label: translate('create_task.form.form_confirmation.no_label'),
        },
      ],
    },
  };
};

export const TASK_DISCARD_POPOVER = {
  TITLE: 'task_content.discard_task_title',
  SUBTITLE: 'task_content.discard_task_subtitle',
};

export const TASK_TAB_INDEX = {
  BASIC_INFO: 1,
  FORMS: 2,
};

export const TASK_VALIDATION_CONSTANTS = {
  POPOVER_CONSTANTS: {
    SECTION_TITLE_EXCEEDS: translate('validation_constants.utility_constant.section_title_exceeds'),
    SECTION_SUB_TITLE_EXCEEDS: translate('validation_constants.utility_constant.section_sub_title_exceeds'),
  },
};

export const getTaskTabsStrings = () => [
  {
    TEXT: translate('create_task.form.basic_info.title'),
    INDEX: TASK_TAB_INDEX.BASIC_INFO,
    SUB_TITLE:
    translate('create_task.form.basic_info.sub_title'),
  },
  {
    TEXT: CREATE_TASK_STRINGS.TASK_TABS_FORM_TEXT,
    INDEX: TASK_TAB_INDEX.FORMS,
    SUB_TITLE: translate('create_task.form.basic_info.sub_title_2'),
  },
];

export const getInputText = () => CREATE_TASK_STRINGS.TASK_INPUT_TEXT;

export const TASK_STRINGS = getTaskStrings();

export const INPUT_TEXT = getInputText();

export const TASK_TABS = getTaskTabsStrings();

export const ACTORS = getActorsStrings();

// store.subscribe(() => {
//   CREATE_TASK_STRINGS =
//     store.getState().LocalizationReducer.languageSettings.strings.CREATE_TASK;
//   TASK_STRINGS = getTaskStrings();
//   INPUT_TEXT = getInputText();
//   TASK_TABS = getTaskTabsStrings();
//   ACTORS = getActorsStrings();
// });
export const DateValidationOptionListId = [DATE_VALIDATION.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.ID, DATE_VALIDATION.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.ID, DATE_VALIDATION.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.ID, DATE_VALIDATION.DATE_VALIDATIONS.ALLOW_PAST_ALL.ID, DATE_VALIDATION.DATE_VALIDATIONS.ALLOW_PAST_LAST.ID, DATE_VALIDATION.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.ID, DATE_VALIDATION.DATE_VALIDATIONS.ALLOW_PAST.ID, DATE_VALIDATION.DATE_VALIDATIONS.ALLOW_ONLY_TODAY.ID, DATE_VALIDATION.DATE_VALIDATIONS.ALLOW_DATE_FIELDS.ID, DATE_VALIDATION.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.ID];
export default TASK_STRINGS;
