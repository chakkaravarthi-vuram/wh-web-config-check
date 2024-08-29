import { FORM_POPOVER_STATUS } from 'utils/Constants';
import { translate } from 'language/config';

export const ADD_OR_REMOVE_ASSIGNEE_STRINGS = (t) => {
  return {
    TITLE: translate('task_content.add_or_remove_assignee.title'),
    SUB_TITLE: translate('task_content.add_or_remove_assignee.sub_title'),
    ADD_ASSIGNEE: {
      LABEL: translate('task_content.add_or_remove_assignee.add_assignee.label'),
      PLACEHOLDER: translate('task_content.add_or_remove_assignee.add_assignee.placeholder'),
      ADD_BUTTON: {
        LABEL: translate('task_content.add_or_remove_assignee.add_assignees.add_button.label'),
      },
      CANCEL_BUTTON: {
        LABEL: translate('task_content.add_or_remove_assignee.add_assignees.cancel_button.label'),
      },
    },
    CURRENT_ASSIGNEES: {
      LABEL: translate('task_content.add_or_remove_assignee.current_assignees.label'),
      SEARCH_BAR: {
        PLACEHOLDER: translate('task_content.add_or_remove_assignee.current_assignees.search_bar.placeholder'),
      },
    },
    ACTION_BUTTONS: {
      SAVE: {
        LABEL: translate('task_content.add_or_remove_assignee.action_buttons.save.label'),
      },
      CANCEL: {
        LABEL: translate('task_content.add_or_remove_assignee.action_buttons.cancel.label'),
      },
    },
    REMOVE_LAST_USER: {
      title: translate('task_content.add_or_remove_assignee.remove_last_user.title'),
      isVisible: true,
      status: FORM_POPOVER_STATUS.SERVER_ERROR,
    },
    ADDING_EXISTING_USER_ERROR: t('task_content.add_or_remove_assignee.add_existing_user_error'),
    REVIEW_DETAILS: t('task_content.review_details_strings.review_details'),
    REVIEWER_REQUIRED: t('task_content.review_details_strings.reviewer_required'),
    REVIEW_COMMENT: t('task_content.review_details_strings.review_comment'),
    REVIEW_OWNER_ERROR: t('task_content.review_details_strings.review_owner_error'),
    SEND_BACK_COMMENTS: t('task_validation_strings.send_back_comments'),
    PRECEEDING_STEPS_REQUIRED: t('task_validation_strings.preceeding_step_required'),
  };
};

export default ADD_OR_REMOVE_ASSIGNEE_STRINGS;
