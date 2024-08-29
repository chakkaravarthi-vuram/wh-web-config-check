import Joi from 'joi';
import { translate } from 'language/config';
import { REASSIGN_REASON } from '../../utils/ValidationConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { get } from '../../utils/jsUtility';

export const REASSIGN_MODAL = {
    POPUP_LABEL: translate('reassign_modal.popup_label'),
    TITLE: 'reassign_modal.title',
    ADD_MEMBERS: {
      PLACEHOLDER: translate('reassign_modal.add_members.placeholder'),
      LABEL: translate('reassign_modal.add_members.label'),
      SELECT_REASSIGN_USERS: translate('reassign_modal.add_members.select_reassign_users'),
    },
    REASON: {
        LABEL: translate('reassign_modal.reason.label'),
        PLACEHOLDER: translate('reassign_modal.reason.placeholder'),
    },
    REASSIGN_EMAIL_LABEL: translate('reassign_modal.reassign_email_label'),
    RECORD_ID: translate('reassign_modal.record_id'),
    TASK_NAME: translate('reassign_modal.task_name'),
    OPEN_WITH: translate('reassign_modal.open_with'),
    PENDING_SINCE: translate('reassign_modal.pending_since'),
  };

  export const getReassigneeValidation = (_t, usersAndTeamsData) => {
    if (
      (get(usersAndTeamsData, ['users'], []) || []).length === 0 &&
      (get(usersAndTeamsData, ['teams'], []) || []).length === 0
    ) {
      return REASSIGN_MODAL.ADD_MEMBERS.SELECT_REASSIGN_USERS;
    } else return null;
  };

export const TaskReassignValidateSchema = Joi.object().keys({
  reassign_reason: REASSIGN_REASON.label('Reassign Reason').allow(
    EMPTY_STRING,
    null,
  ),
});
