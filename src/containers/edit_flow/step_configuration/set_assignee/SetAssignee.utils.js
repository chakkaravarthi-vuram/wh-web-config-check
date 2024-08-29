import { UserPicker } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import React from 'react';
import Edit from '../../../../assets/icons/application/EditV2';
import Trash from '../../../../assets/icons/application/Trash';
import gClasses from '../../../../scss/Typography.module.scss';
import { BS } from '../../../../utils/UIConstants';
import {
  getActionAndRecipient,
} from '../configurations/Configuration.utils';
import { getUserPickerOptionList } from '../../../../components/form_components/user_picker/UserPicker.utils';
import jsUtility from '../../../../utils/jsUtility';
import { TEAM_TYPES_PARAMS, USER_TYPES_PARAMS } from '../../../../utils/Constants';
import { CONFIGURATION_TYPE_ID } from '../configurations/Configuration.strings';
import AssigneeGroups from '../../diagramatic_flow_view/flow_component/custom_nodes/assignee_group/AssigneeGroup';
import { POPPER_PLACEMENTS } from '../../../../components/auto_positioning_popper/AutoPositioningPopper';
import styles from './SetAssignee.module.scss';
import { getPopperContent } from '../../../../utils/UtilityFunctions';

export const getDueDateTableData = (rules, onEdit, onDelete) => {
  const data = rules.map((rule) => [
    rule.rule_name,
    <div key={0} className={cx(BS.D_FLEX_JUSTIFY_CENTER, BS.ALIGN_ITEM_CENTER)}>
      <button
        className={cx(gClasses.ClickableElement, gClasses.MR16)}
        onClick={() => onEdit(rule._id)}
      >
        <Edit />
      </button>
      <button
        className={cx(gClasses.ClickableElement)}
        onClick={() => onDelete(rule._id)}
      >
        <Trash />
      </button>
    </div>,
  ]);

  return data;
};

export const getDirectRecipient = (recipientObj) => {
  if (jsUtility.isEmpty(jsUtility.get(recipientObj, ['direct_recipients'], {}))) {
    return null;
  }

  const recipients = [];
  const users = jsUtility.get(
    recipientObj,
    ['direct_recipients', 'users'],
    [],
  );
  const teams = jsUtility.get(
    recipientObj,
    ['direct_recipients', 'teams'],
    [],
  );

  !jsUtility.isEmpty(users) &&
    users.forEach((user) => recipients.push(user));
  !jsUtility.isEmpty(teams) &&
    teams.forEach((team) => recipients.push(team));

  return jsUtility.compact(recipients);
};

export const getEscalationData = (action) => {
  let dueDate = {};

  const [actionTypeOrDueDate, recipients] = getActionAndRecipient(action, CONFIGURATION_TYPE_ID.SEND_ESCALATION);
  dueDate = actionTypeOrDueDate;
  console.log('getEscalationData_action', action, 'dueDate', dueDate, 'recipients', recipients);
  return [jsUtility.compact(dueDate), jsUtility.compact(recipients)];
};

export const getEscalationTableData = (escalations, onEdit, onDelete, history, showCreateTask) => {
  const data = escalations.map((e) => {
    const [emailActions, recipients] = getEscalationData(e);
    console.log('getEscalationTableData_escalations', escalations, 'recipients', recipients, 'emailActions', emailActions);

    const users = [];
    const teams = [];
    const otherRecipients = [];
    recipients.forEach((user) => {
      if (user.username) {
          users.push({ ...user, is_user: true, first_name: user.first_name || user.username });
      } else if (user.team_name) {
          teams.push(user);
      } else {
          otherRecipients.push({ label: user });
      }
    });
    const userTeams = getUserPickerOptionList([...users, ...teams]);

    return [
      <div className={cx(BS.D_FLEX)}>
        {!jsUtility.isEmpty(userTeams) && <UserPicker
          hideLabel
          selectedValue={userTeams}
          maxCountLimit={1}
          disabled
          maxDisplayCountLimit={1}
          maxLimit={userTeams?.length}
          allowedUserType={USER_TYPES_PARAMS.ALL_USERS}
          allowedTeamType={TEAM_TYPES_PARAMS.SYSTEM_ORGANISATION_TEAMS}
          getPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide, history, showCreateTask)}
        />}
        {otherRecipients.length > 0 &&
          <AssigneeGroups
            outerClassName={styles.W260}
            assigneesList={otherRecipients}
            assigneeLabels={otherRecipients}
            className={cx(styles.MailId)}
            userDisplayClassname={styles.UserDisplay}
            hideUserIcon
            popperPlacements={POPPER_PLACEMENTS.RIGHT}
            maxUserLimit={1}
          />
        }
      </div>,
      emailActions,
      <div
        key={0}
        className={cx(BS.D_FLEX_JUSTIFY_CENTER, BS.ALIGN_ITEM_CENTER)}
      >
        <button
          className={cx(gClasses.ClickableElement, gClasses.MR16)}
          onClick={() => onEdit(e)}
        >
          <Edit />
        </button>
        <button
          className={cx(gClasses.ClickableElement)}
          onClick={() => onDelete(e)}
        >
          <Trash />
        </button>
      </div>,
    ];
  });
  return data;
};

export const USER_STEP_ASSIGNEE_OBJECT_KEYS = {
  type: 'assignee_type',
  userOrTeams: 'assignees',
  formFields: 'assignee_field_uuids',
  systemFields: 'assignee_system_fields',
  ruleBased: 'rules',
  ruleBasedRecipient: 'rule_assignees',
  formReportingManager: 'assignee_field_uuids',
  parentKey: 'step_assignees',
};

export const USER_STEP_ASSIGNEE_KEYS_RESPONSE = {
  type: 'assignee_type',
  userOrTeams: 'assignees',
  formFields: 'assignee_field_uuids',
  systemFields: 'assignee_system_fields',
  ruleBased: 'rules',
  ruleBasedRecipient: 'rule_assignees',
  formReportingManager: 'reporting_manager_assignee_field_uuids',
  parentKey: 'step_assignees',
};
