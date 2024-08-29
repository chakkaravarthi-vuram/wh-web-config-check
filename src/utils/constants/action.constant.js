import { translate } from '../../language/config';

export const ACTION_TYPE = {
  // END_FLOW: 'end_flow',
  SYSTEM: 'system',
  SEND_BACK: 'send_back',
  CANCEL: 'cancel',
  ASSIGN_REVIEW: 'assign_review',
  DEFAULT_SEND_BACK: 'default_send_back',
  CANCELLED_DUE_TO_SEND_BACK: 'cancelled_due_to_send_back',
  // NEXT: 'forward',
  COMPLETED: 'end_task',
  FORWARD: 'forward',
  END_FLOW: 'end_flow',
  FORWARD_ON_FAILURE: 'forward_on_failure',
  REVIEW_COMPLETED: 'Review completed, assign to review requestor',
  REASSIGN_FOR_ANOTHER_REVIEW: 'Reassign for another review',
  FAILURE: 'failure',
  SUCCESS: 'success',
  SCHEDULED: 'scheduled',
  TRIGGERED: 'triggered',
};

export const USER_ACTIONS = {
  POST_UPDATE: 'task_update',
  POST_NOTES: 'note',
  INITAITED: 'initiated',
  COMPLETED: 'completed',
  SNOOZED: 'snooze_task',
  REJECT: 'reject',
  ASSIGN_BACK: 'assign_back',
  REASSIGNED: 'reassigned',
  CANCELLED: 'cancel',
  SUBMIT_TASK: 'submit_task',
  INTEGRATION: 'integration',
  ML_INTEGRATION: 'ml_integration',
};

export const FORWARD_ACTIONS =
[
  ACTION_TYPE.NEXT,
  ACTION_TYPE.NEXT_STEP,
  ACTION_TYPE.NEXT_STEP_ON_RULE,
  ACTION_TYPE.NEXT_PARALLEL,
  ACTION_TYPE.NEXT_PARALLEL_ON_RULE];

export const CANCEL_MESSAGE = {
  DELETED: translate('validation_constants.cancel_message.deleted'),
  CANCELLED: translate('validation_constants.cancel_message.cancelled'),
};

export default ACTION_TYPE;
