import { EToastPosition, EToastType, toastPopOver } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import { cloneDeep, isEmpty } from '../../../../utils/jsUtility';
import { FOOTER_PARAMS_ID, FORM_ACTION_TYPES } from './FormFooter.constant';
import styles from './FormFooter.module.scss';

export const SAMPLE_ACTIONS = [
    {
      actionUUID: 0,
      [FOOTER_PARAMS_ID.ACTION_TYPE]: FORM_ACTION_TYPES.ASSIGN_REVIEW,
      [FOOTER_PARAMS_ID.ACTION_LABEL]: 'Review',
      value: 'review',
    },
    {
      actionUUID: 1,
      [FOOTER_PARAMS_ID.ACTION_TYPE]: FORM_ACTION_TYPES.END_FLOW,
      [FOOTER_PARAMS_ID.ACTION_LABEL]: 'Submit',
      value: 'submit',
    },
    {
      actionUUID: 2,
      [FOOTER_PARAMS_ID.ACTION_TYPE]: FORM_ACTION_TYPES.SEND_BACK,
      [FOOTER_PARAMS_ID.ACTION_LABEL]: 'Send Back',
      value: 'send_back',
    },
    {
      actionUUID: 3,
      [FOOTER_PARAMS_ID.ACTION_TYPE]: FORM_ACTION_TYPES.CANCEL,
      [FOOTER_PARAMS_ID.ACTION_LABEL]: 'Cancel',
      value: 'cancel',
    },
    {
      actionUUID: 4,
      [FOOTER_PARAMS_ID.ACTION_TYPE]: FORM_ACTION_TYPES.FORWARD,
      [FOOTER_PARAMS_ID.ACTION_LABEL]: 'Forward',
      value: 'forward',
    },
  ];

export const SAMPLE_RULE_LIST = [
  {
      label: 'Rule 001',
      value: '655dcec5565554332996b19a',
  },
  {
      label: 'Rule 002',
      value: '655dcec5565554332996b19b',
  },
  {
      label: 'Rule 003',
      value: '655dcec5565554332996b19c',
  },
  {
      label: 'Rule 004',
      value: '655dcec5565554332996b19d',
  },
];

export const getButtonStyle = (actionType) => {
  let buttonStyle = cx(styles.Button, styles.Primary);

  if (actionType === FORM_ACTION_TYPES.SEND_BACK) buttonStyle = cx(styles.OutlinePrimary, styles.Button);
  else if (actionType === FORM_ACTION_TYPES.ASSIGN_REVIEW) buttonStyle = cx(styles.OutlinePrimary, styles.Button);
  else if (actionType === FORM_ACTION_TYPES.CANCEL) buttonStyle = cx(styles.Negative, styles.Button);

  return buttonStyle;
};

export const getNegativeActionList = (actionList = SAMPLE_ACTIONS) => {
    if (isEmpty(actionList)) return [];
    return actionList.filter((action) => action[FOOTER_PARAMS_ID.ACTION_TYPE] === FORM_ACTION_TYPES.CANCEL);
};

export const getPositiveActionList = (actionList = SAMPLE_ACTIONS) => {
    if (isEmpty(actionList)) return [];
    const consolidatedActionList = actionList.filter((action) => action[FOOTER_PARAMS_ID.ACTION_TYPE] !== FORM_ACTION_TYPES.CANCEL);
    const REVERSE_SORT_ORDER = [
      FORM_ACTION_TYPES.SEND_BACK,
      FORM_ACTION_TYPES.ASSIGN_REVIEW,
      FORM_ACTION_TYPES.FORWARD,
      FORM_ACTION_TYPES.END_FLOW,
    ];
    const sortedActionList = consolidatedActionList.sort((a, b) => (REVERSE_SORT_ORDER.indexOf(a[FOOTER_PARAMS_ID.ACTION_TYPE]) -
        REVERSE_SORT_ORDER.indexOf(b[FOOTER_PARAMS_ID.ACTION_TYPE])));

    return sortedActionList;
};

export const validateActions = (actions, t) => {
  const errors = {};

  const noOfForwardActionButtons = actions.filter((a) =>
    [FORM_ACTION_TYPES.FORWARD, FORM_ACTION_TYPES.END_FLOW].includes(
      a.actionType,
    ),
  ).length || 0;

  if (noOfForwardActionButtons === 0) {
    toastPopOver({
      title: t('form.form_footer.forward_action_required'),
      subtitle: t('form.form_footer.please_configure_a_button'),
      toastType: EToastType.error,
      toastPosition: EToastPosition.BOTTOM_LEFT,
    });
    errors.add_actions = t('form.form_footer.forward_action_required');
  }

  return errors;
};

export const getActionsForTaskContent = (actions) => {
  const clonedActions = cloneDeep(actions)?.map?.((a) => { return { ...a, [FOOTER_PARAMS_ID.ACTION_TYPE]: a.action_type }; });
  const positiveActions = getPositiveActionList(clonedActions);
  const negativeActions = getNegativeActionList(clonedActions);

  return [...negativeActions, ...positiveActions];
};

export const getEllipsesForText = (text, n = 8) => {
  if (text.length < (n + 2)) return text;
  return `${text.slice(0, n)}...`;
};
