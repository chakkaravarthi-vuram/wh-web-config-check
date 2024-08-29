import React from 'react';
import Joi from 'joi';
import cx from 'classnames/bind';
import {
  AvatarGroup,
  AvatarSizeVariant,
  Checkbox,
  EPopperPlacements,
} from '@workhall-pvt-lmt/wh-ui-library';
import ReassignIcon from 'assets/icons/reassign_task/ReassignIcon';
import gClasses from 'scss/Typography.module.scss';
import { getSignedUrlFromDocumentUrlDetails } from 'utils/profileUtils';
import {
  constructAvatarOrUserDisplayGroupList,
  getPopperContent,
  getRouteLink,
} from 'utils/UtilityFunctions';
import { TASKS } from 'urls/RouteConstants';
import { getTaskUrl } from 'utils/taskContentUtils';
import { ARIA_ROLES } from 'utils/UIConstants';
import { translate } from 'language/config';
import { TASK_TAB_INDEX } from 'containers/landing_page/LandingPage.strings';
import { REASSIGN_MODAL } from 'components/reassign_modal/ReassignModal.strings';
import jsUtility, {
  nullCheck,
  translateFunction,
  isNaN,
  get,
} from '../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { REASSIGN_REASON } from '../../../../utils/ValidationConstants';
import ENTRY_TASK_STRINGS from './EntryTask.strings';
import { getEntryTaskListApi } from '../../../../redux/actions/IndividualEntry.Action';

export const ENTRY_TASK_OPTIONS = [
  {
    value: 0,
    label: ENTRY_TASK_STRINGS(translate).TASK_TYPE.OPEN,
  },
  {
    value: 1,
    label: ENTRY_TASK_STRINGS(translate).TASK_TYPE.CLOSED,
  },
];

export const reassignPopUp = [
  {
    label: REASSIGN_MODAL.POPUP_LABEL,
    value: 1,
    icon: (
      <ReassignIcon
        role={ARIA_ROLES.IMG}
        ariaHidden
        ariaLabel={ENTRY_TASK_STRINGS(translate).BUTTON.REASSIGN_TASK}
      />
    ),
  },
];

export const tableHeaderList = (
  t,
  isHeaderCheckBoxChecked,
  handleHeaderCheckboxChange,
  isCheckBoxVisible,
  taskTypeDropdown = ENTRY_TASK_OPTIONS[0].value,
) => {
  const taskHeaderList = [];
  if (isCheckBoxVisible) {
    taskHeaderList.push({
      label: EMPTY_STRING,
      component: (
        <Checkbox
          details={{
            label: '',
            value: 'header_checkbox',
          }}
          isValueSelected={isHeaderCheckBoxChecked}
          onClick={handleHeaderCheckboxChange}
          hideLabel
        />
      ),
      widthWeight: 1,
    });
  }
  taskHeaderList.push(
    {
      label: ENTRY_TASK_STRINGS(t).TABLE_HEADER.TASK_NAME,
      widthWeight: 3,
    },
    {
      label: taskTypeDropdown === ENTRY_TASK_OPTIONS[0].value ? ENTRY_TASK_STRINGS(t).TABLE_HEADER.OPEN_WITH : ENTRY_TASK_STRINGS(t).TABLE_HEADER.CLOSED_BY,
      widthWeight: 1,
    },
    {
      label: taskTypeDropdown === ENTRY_TASK_OPTIONS[0].value ? ENTRY_TASK_STRINGS(t).TABLE_HEADER.PENDING_SINCE : ENTRY_TASK_STRINGS(t).TABLE_HEADER.COMPLETED_ON,
      widthWeight: 1,
    },
  );
  return taskHeaderList;
};

const DATE_TIME_DURATION_DISPLAY = (t = translateFunction) => {
  return {
    AN: t('date_time_duration_display.an'),
    YEAR: t('date_time_duration_display.year'),
    MONTH: t('date_time_duration_display.month'),
    A: t('date_time_duration_display.a'),
    DAY: t('date_time_duration_display.day'),
    HOUR: t('date_time_duration_display.hour'),
    FEW: t('date_time_duration_display.few'),
    MINUTE: t('date_time_duration_display.minute'),
    SECONDS: t('date_time_duration_display.seconds'),
    YEARS: t('date_time_duration_display.years'),
    MONTHS: t('date_time_duration_display.months'),
    DAYS: t('date_time_duration_display.days'),
    HOURS: t('date_time_duration_display.hours'),
    MINUTES: t('date_time_duration_display.minutes'),
    AGO: t('date_time_duration_display.ago'),
    IN: t('date_time_duration_display.in'),
  };
};
const durationTextDisplay = (duration_display, t) => {
  let dateText;
  switch (duration_display) {
    case 'an':
      dateText = DATE_TIME_DURATION_DISPLAY(t).AN;
      break;
    case 'year':
      dateText = DATE_TIME_DURATION_DISPLAY(t).YEAR;
      break;
    case 'month':
      dateText = DATE_TIME_DURATION_DISPLAY(t).MONTH;
      break;
    case 'a':
      dateText = DATE_TIME_DURATION_DISPLAY(t).A;
      break;
    case 'day':
      dateText = DATE_TIME_DURATION_DISPLAY(t).DAY;
      break;
    case 'hour':
      dateText = DATE_TIME_DURATION_DISPLAY(t).HOUR;
      break;
    case 'few':
      dateText = DATE_TIME_DURATION_DISPLAY(t).FEW;
      break;
    case 'minute':
      dateText = DATE_TIME_DURATION_DISPLAY(t).MINUTE;
      break;
    case 'seconds':
      dateText = DATE_TIME_DURATION_DISPLAY(t).SECONDS;
      break;
    case 'years':
      dateText = DATE_TIME_DURATION_DISPLAY(t).YEARS;
      break;
    case 'months':
      dateText = DATE_TIME_DURATION_DISPLAY(t).MONTHS;
      break;
    case 'days':
      dateText = DATE_TIME_DURATION_DISPLAY(t).DAYS;
      break;
    case 'hours':
      dateText = DATE_TIME_DURATION_DISPLAY(t).HOURS;
      break;
    case 'minutes':
      dateText = DATE_TIME_DURATION_DISPLAY(t).MINUTES;
      break;
    case 'ago':
      dateText = DATE_TIME_DURATION_DISPLAY(t).AGO;
      break;
    case 'in':
      dateText = DATE_TIME_DURATION_DISPLAY(t).IN;
      break;
    default:
      break;
  }
  return dateText;
};
export const dateDuration = (duration_display, t) => {
  if (!duration_display) return null;
  const parts = duration_display.split(' ');
  const modifiedParts = parts.map((value) => {
    if (!isNaN(Number(value))) {
      return value;
    } else {
      return durationTextDisplay(value, t);
    }
  });
  const modifiedString = modifiedParts.join(' ');
  return modifiedString;
};

export const constructTaskTableData = (
  taskList,
  taskDocumentUrl,
  taskStatus,
  selectedTaskList,
  handleCheckboxChange,
  isCheckBoxVisible,
  history,
  colorSchema,
  showCreateTask,
) => {
  if (!jsUtility.isEmpty(taskList) && jsUtility.isArray(taskList)) {
    return taskList.map((eachTask) => {
      let userImage = [];
      const teamImage = [];
      if (taskStatus === 1) {
        if (nullCheck(eachTask, 'closed_by', true)) {
          userImage.push({
            first_name: eachTask.closed_by.first_name,
            last_name: eachTask.closed_by.last_name,
            email: eachTask.closed_by.email,
            profile_pic: getSignedUrlFromDocumentUrlDetails(
              taskDocumentUrl,
              eachTask.closed_by.profile_pic,
            ),
            _id: eachTask.closed_by._id,
          });
        }
      } else if (
        nullCheck(eachTask, 'assigned_users_teams.users.length', true)
      ) {
        eachTask.assigned_users_teams.users.forEach((user) => {
          userImage.push({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            profile_pic: getSignedUrlFromDocumentUrlDetails(
              taskDocumentUrl,
              user.profile_pic,
            ),
            _id: user._id,
          });
        });
      } else if (
        nullCheck(eachTask, 'assigned_users_teams.teams.length', true)
      ) {
        eachTask.assigned_users_teams.teams.forEach((team) => {
          teamImage.push({
            team_name: team.team_name,
            profile_pic: getSignedUrlFromDocumentUrlDetails(
              taskDocumentUrl,
              team.team_name,
            ),
            _id: team._id,
          });
        });
      }
      if (!jsUtility.isEmpty(eachTask.accepted_by)) {
        userImage = [
          {
            ...eachTask.accepted_by,
            profile_pic: getSignedUrlFromDocumentUrlDetails(
              taskDocumentUrl,
              eachTask.accepted_by.profile_pic,
            ),
          },
        ];
      }
      const avatarGroup = (
        <AvatarGroup
          colorScheme={colorSchema}
          size={AvatarSizeVariant.sm}
          allAvatarData={constructAvatarOrUserDisplayGroupList({
            users: userImage,
            teams: teamImage,
          })}
          popperPlacement={EPopperPlacements.RIGHT}
          getPopperContent={(id, type, onShow, onHide) =>
            getPopperContent(id, type, onShow, onHide, history, showCreateTask)
          }
          className={cx(gClasses.ZIndex2, gClasses.PositionRelative)}
        />
      );
      let taskName;
      if (eachTask.is_task_accessible) {
        taskName = (
          <a
            href={getRouteLink(
              `${TASKS}/${
                eachTask.task_status === 'completed'
                  ? getTaskUrl(TASK_TAB_INDEX.COMPLETED)
                  : getTaskUrl(TASK_TAB_INDEX.OPEN)
              }/${eachTask._id}`,
              history,
            )}
            target="_blank"
            rel="noreferrer"
            className={cx(gClasses.anchorTag)}
            title={`${eachTask.task_name}`}
          >
            {eachTask.task_name}
          </a>
        );
      } else {
        taskName = <span>{eachTask.task_name}</span>;
      }
      const durationDisplay =
        taskStatus === 1 && eachTask.closed_on
          ? dateDuration(eachTask.closed_on.duration_display)
          : dateDuration(eachTask.assigned_on.duration_display);

      if (!isCheckBoxVisible) {
        return {
          id: eachTask._id,
          component: [taskName, avatarGroup, durationDisplay],
        };
      }
      const tableCheckbox = (
        <Checkbox
          className={gClasses.MB0}
          details={{
            label: '',
            value: eachTask._id,
          }}
          isValueSelected={selectedTaskList.includes(eachTask._id)}
          onClick={handleCheckboxChange}
          hideLabel
        />
      );
      return {
        id: eachTask._id,
        component: [tableCheckbox, taskName, avatarGroup, durationDisplay],
      };
    });
  }
  return [];
};

export const taskReassignValidateSchema = Joi.object().keys({
  reassign_reason: REASSIGN_REASON.label(
    ENTRY_TASK_STRINGS(translate).REASSIGN_TASK.REASON.LABEL,
  ).allow(EMPTY_STRING, null),
});

export const getAssigneeValidation = (t, usersAndTeamsData) => {
  if (
    (get(usersAndTeamsData, ['users'], []) || []).length === 0 &&
    (get(usersAndTeamsData, ['teams'], []) || []).length === 0
  ) {
    return ENTRY_TASK_STRINGS(t).REASSIGN_TASK.REASSIGN_TO.ERROR;
  } else return null;
};

export const getEntryTaskList = (paramsData, dispatch) => {
  const params = {
    page: 1,
    size: 5,
    is_closed: 0,
    assigned_to_me: 0,
    ...paramsData,
  };
  dispatch(getEntryTaskListApi(params));
};
