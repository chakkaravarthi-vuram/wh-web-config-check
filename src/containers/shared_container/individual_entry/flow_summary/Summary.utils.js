import React from 'react';
import cx from 'classnames/bind';
import moment from 'moment';
import ReassignIcon from '../../../../assets/icons/task/ReassignIcon';
import gClasses from '../../../../scss/Typography.module.scss';
import { nullCheck } from '../../../../utils/jsUtility';
import { getFormattedDateFromUTC } from '../../../../utils/dateUtils';
import { FLOW_STRINGS } from '../../../flows/Flow.strings';
import ENTRY_TASK_STRINGS from '../entry_tasks/EntryTask.strings';
import { DASHBOARD_INSTANCE_STRINGS } from '../../../flow/flow_dashboard/FlowDashboard.string';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { BS } from '../../../../utils/UIConstants';

export const TASK_TYPE = {
  JOIN_STEP: 3,
  SPLIT_PARALLEL_STEP: 4,
  TRIGGER: 5,
  INTEGRATION: 6,
  ML_INTEGRATION: 7,
  WAIT_NODE: 8,
  DOCUMENT_GENERATION: 9,
  SYSTEM_STEP_DOCUMENT: 10,
  SEND_DATA_TO_DATALIST: 11,
  DATA_MANIPULATOR: 12,
  CONDITIONAL_ROUTE_STEP: 13,
};

export const getFormattedDateAndTimeLabel = (dateTimeObject, label) => {
  if (
    nullCheck(dateTimeObject, 'pref_tz_datetime') &&
    nullCheck(dateTimeObject, 'duration_display')
  ) {
    const dateFormatted = getFormattedDateFromUTC(
      dateTimeObject.utc_tz_datetime,
      FLOW_STRINGS.TEAM_CREATED_DATE_TIME,
    );
    const formattedDate = `${moment(dateFormatted).format(
      'DD MMM YYYY h:mm A',
    )}`;
    const date = `${moment(dateTimeObject.pref_tz_datetime).format(
      'DD MMM YYYY h:mm A',
    )} (${dateTimeObject.duration_display})`;
    return (
      <div
        className={cx(
          gClasses.FTwo12GrayV53,
          gClasses.Ellipsis,
          BS.TEXT_RIGHT,
          BS.W100,
        )}
        title={date}
      >
        {label && <span className={gClasses.MR5}>{label}</span>}
        {formattedDate}
      </div>
    );
  }
  return null;
};

export const TASK_REASSIGN_OPTIONS = (t) => [
  {
    value: 1,
    label: ENTRY_TASK_STRINGS(t).REASSIGN_TASK.BUTTON.REASSIGN,
    icon: <ReassignIcon />,
  },
];

export const getCurrentStatusDisplay = (status, t) => {
  switch (status) {
    case 'completed':
      return t(DASHBOARD_INSTANCE_STRINGS.COMPLETED);
    case 'inprogress':
      return t(DASHBOARD_INSTANCE_STRINGS.IN_PROGRESS);
    case 'assigned':
      return t(DASHBOARD_INSTANCE_STRINGS.STARTED);
    case 'cancelled':
      return t(DASHBOARD_INSTANCE_STRINGS.CANCELLED);
    case 'skipped':
      return t(DASHBOARD_INSTANCE_STRINGS.SKIPPED);
    default:
      return EMPTY_STRING;
  }
};
