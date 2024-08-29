import React from 'react';
import cx from 'classnames/bind';
import { AvatarGroup, AvatarSizeVariant, Checkbox, EPopperPlacements } from '@workhall-pvt-lmt/wh-ui-library';
import { TASK_OPTION_LIST_STRINGS } from '../../listFlow/listFlow.strings';
import CheckboxGroup, { CHECK_BOX_GROUP_TYPE } from '../../../../components/form_components/checkbox_group/CheckboxGroup';
import { TASK_TAB_INDEX } from '../../../landing_page/LandingPage.strings';
import { TASKS } from '../../../../urls/RouteConstants';
import { getTaskUrl } from '../../../../utils/taskContentUtils';
import { ARIA_ROLES } from '../../../../utils/UIConstants';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { translate } from '../../../../language/config';
import { constructAvatarOrUserDisplayGroupList, getPopperContent, getRouteLink } from '../../../../utils/UtilityFunctions';
import UpDownArrowIcon from '../../../../assets/icons/UpDownArrowIcon';
import gClasses from '../../../../scss/Typography.module.scss';
import jsUtils, { nullCheck, isEmpty } from '../../../../utils/jsUtility';
import { replaceNullWithNA } from '../../../landing_page/my_tasks/task_content/TaskContent.utils';
import { dateDuration } from '../../../data_list/view_data_list/data_list_entry_task/DataListEntryTask.utils';
import { getSignedUrlFromDocumentUrlDetails } from '../../../../utils/profileUtils';

export const taskOptionList = [
  {
    value: 0,
    label: 'Open',
  },
  {
    value: 1,
    label: 'Closed',
  },
];

const headerCheckBox = (isHeaderCheckBoxChecked, handleHeaderCheckboxChange) => (
  <CheckboxGroup
    id="select_all_task"
    optionList={[{
      label: '',
      value: 'header_checkbox',
    }]}
    onClick={handleHeaderCheckboxChange}
    selectedValues={isHeaderCheckBoxChecked ? ['header_checkbox'] : []}
    hideLabel
    hideMessage
    hideOptionLabel
    checkboxViewClassName={gClasses.MR0}
  />
);

export const tableHeaderList = (isHeaderCheckBoxChecked, handleHeaderCheckboxChange, visibleReassign, taskDropdown) => [
  {
    value: taskDropdown === 0 && visibleReassign && headerCheckBox(isHeaderCheckBoxChecked, handleHeaderCheckboxChange),
  },
  {
    value: translate('flow_dashboard.tasks_strings.task_table_header_strings.record_id'),
  },
  {
    value: translate('flow_dashboard.tasks_strings.task_table_header_strings.task_name'),
  },
  {
    value: translate('flow_dashboard.tasks_strings.task_table_header_strings.open_with'),
  },
  {
    value: translate('flow_dashboard.tasks_strings.task_table_header_strings.pending_since'),
  },
];

export const tableHeader = (headers, recordId, taskStatus1) => {
  const upDownArrowIcon = <UpDownArrowIcon className={cx(gClasses.ML5)} role={ARIA_ROLES.IMG} ariaLabel="Sort by" />;
  if (recordId) {
    return headers.map((header, index) => {
      if (index <= 1) {
        return [header.value];
      }
      if (header.value === 'Open with' && taskStatus1 === 1) {
        return [TASK_OPTION_LIST_STRINGS.CLOSED_BY, upDownArrowIcon];
      }
      if (header.value === 'Pending Since' && taskStatus1 === 1) {
        return [TASK_OPTION_LIST_STRINGS.COMPLETED_ON, upDownArrowIcon];
      } else {
        return [header.value, upDownArrowIcon];
      }
    });
  }
  const headersValue = headers.filter((header, index) => index !== 1);
  return headersValue.map((header, index) => {
    if (index === 0) {
      return [header.value];
    }
    if (header.value === 'Open with' && taskStatus1 === 1) {
      return [TASK_OPTION_LIST_STRINGS.CLOSED_BY, upDownArrowIcon];
    }
    if (header.value === 'Pending Since' && taskStatus1 === 1) {
      return [TASK_OPTION_LIST_STRINGS.COMPLETED_ON, upDownArrowIcon];
    } else {
      return [header.value, upDownArrowIcon];
    }
  });
};

export const TASK_STRINGS = (translate = () => {}) => {
return {
  SEARCH_TASK_PLACEHOLDER: translate('flow_dashboard.tasks_strings.search_task_placeholder'),
  ADD_NEW_BUTTON: translate('flow_dashboard.tasks_strings.add_new_button'),
  FOUND: translate('flow_dashboard.tasks_strings.found'),
  OPEN: translate('flow_dashboard.tasks_strings.open'),
  ClOSED: translate('flow_dashboard.tasks_strings.closed'),
  TASK: translate('flow_dashboard.tasks_strings.task'),
  TASKS: translate('flow_dashboard.tasks_strings.tasks'),
  TASK_DETAILS: translate('flow_dashboard.tasks_strings.task_details'),
  REASSIGNMENT_DETAILS: translate('flow_dashboard.tasks_strings.reassignment_details'),
  WARNING_CONTENT: translate('flow_dashboard.tasks_strings.warning_content'),
  CANCEL: translate('flow_dashboard.tasks_strings.cancel'),
  REASSIGN: translate('flow_dashboard.tasks_strings.reassign'),
  REASSIGN_TASK: translate('flow_dashboard.tasks_strings.reassign_task'),
  RESULT: translate('flow_dashboard.tasks_strings.result'),
  RESULTS: translate('flow_dashboard.add_notes_strings.results'),
  REASON_LABEL: translate('flow_dashboard.tasks_strings.reason_label'),
  REASON_PLACEHOLDER: translate('flow_dashboard.tasks_strings.reason_placeholder'),
  CANCEL_INSTANCE: translate('flow_dashboard.tasks_strings.cancel_instance'),
};
};

export const ENTRY_TASK_OPTIONS = [
  // {
  //   value: -1,
  //   label: 'All',
  // },
  {
    value: 0,
    label: translate('flow_dashboard.tasks_strings.open'),
  },
  {
    value: 1,
    label: translate('flow_dashboard.tasks_strings.closed'),
  },
];

export const messageObject = {
  title: translate('flow_dashboard.message_object.title'),
  subTitle: translate('flow_dashboard.message_object.sub_title'),
  type: 3,
};

// export const tableHeader = (headers, recordId) => headers.map((eachheader, headerIndex) => {
//   console.log('recordid', recordId);

// if ((headerIndex === 0 && recordId) || headerIndex === 1) {
//   return [eachheader.value];
// }
// if (headerIndex === 0 && !recordId) {
//   return null;
// }

//   const upDownArrowIcon = <UpDownArrowIcon className={cx(gClasses.ML5)} />;
//   return [eachheader.value, upDownArrowIcon];
// });

export const constructReassignTaskTableData = (
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
  if (!jsUtils.isEmpty(taskList) && jsUtils.isArray(taskList)) {
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
      if (!jsUtils.isEmpty(eachTask.accepted_by)) {
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

export const constructTableData = (
  taskList,
  recordId,
  dataListEntryTaskDocumentUrl,
  taskStatus,
  selectedTaskList,
  handleCheckboxChange,
  visibleReassign,
  taskDropdown,
  history,
  colorSchema,
  changeAvatarVisibility,
  showCreateTask = true,
) => {
  const pref_locale = localStorage.getItem('application_language');
  if (!jsUtils.isEmpty(taskList)) {
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
                dataListEntryTaskDocumentUrl,
                eachTask.closed_by.profile_pic,
              ),
              _id: eachTask.closed_by._id,
            });
        }
      } else if (nullCheck(eachTask, 'assigned_users_teams.users.length', true)) {
          eachTask.assigned_users_teams.users.forEach((user) => {
            userImage.push({
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              profile_pic: getSignedUrlFromDocumentUrlDetails(
                dataListEntryTaskDocumentUrl,
                user.profile_pic,
              ),
              _id: user._id,
            });
          });
        } else if (nullCheck(eachTask, 'assigned_users_teams.teams.length', true)) {
          eachTask.assigned_users_teams.teams.forEach((team) => {
            teamImage.push({
              team_name: team.team_name,
              profile_pic: getSignedUrlFromDocumentUrlDetails(
                dataListEntryTaskDocumentUrl,
                team.team_name,
              ),
              _id: team._id,
            });
          });
        }
      if (!jsUtils.isEmpty(eachTask.accepted_by)) {
        userImage = [{ ...eachTask.accepted_by,
          profile_pic: getSignedUrlFromDocumentUrlDetails(
          dataListEntryTaskDocumentUrl,
          eachTask.accepted_by.profile_pic,
        ) }];
      }
      const avatarGroup = (
        <AvatarGroup
          colorScheme={colorSchema}
          size={AvatarSizeVariant.sm}
          allAvatarData={constructAvatarOrUserDisplayGroupList({ users: userImage, teams: teamImage })}
          popperPlacement={EPopperPlacements.RIGHT}
          getPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide, history, showCreateTask)}
          onMouseOver={() => changeAvatarVisibility(true)}
          onMouseOut={() => changeAvatarVisibility(false)}
          className={cx(gClasses.ZIndex2, gClasses.PositionRelative)}
        />
      );
      let taskName;
      const tableCheckboxGroup = (
        <CheckboxGroup
        className={gClasses.MB0}
        optionList={[{
          label: '',
          value: eachTask._id,
        }]}
        onClick={handleCheckboxChange}
        selectedValues={selectedTaskList.includes(eachTask._id) ? [eachTask._id] : []}
        hideLabel
        hideMessage
        type={CHECK_BOX_GROUP_TYPE.TYPE_2}
        checkboxViewClassName={gClasses.MR0}
        />
      );
      if (eachTask.is_task_accessible) {
        taskName = (
          <a
            href={getRouteLink(`${TASKS}/${
              eachTask.task_status === 'completed'
                ? getTaskUrl(TASK_TAB_INDEX.COMPLETED)
                : getTaskUrl(TASK_TAB_INDEX.OPEN)
            }/${eachTask._id}`, history)}
            target="_blank"
            rel="noreferrer"
          >
            {eachTask?.translation_data?.[pref_locale]?.task_name || eachTask.task_name}
          </a>
        );
      } else {
        taskName = (
          <span>
            {eachTask?.translation_data?.[pref_locale]?.task_name || eachTask.task_name}
          </span>
        );
      }
      const tableCheckBoxContent = taskDropdown === 0 && visibleReassign && tableCheckboxGroup;
      const tasksId = taskDropdown === 0 && visibleReassign && eachTask._id;
      const durationDisplay = ((taskStatus === 1) && eachTask.closed_on) ? dateDuration(eachTask.closed_on.duration_display) : dateDuration(eachTask.assigned_on.duration_display);
      if (recordId) {
        return [
          tableCheckBoxContent,
          replaceNullWithNA(eachTask.instance_identifier),
          taskName,
          avatarGroup,
          durationDisplay,
          tasksId,
        ];
      }

      return [tableCheckBoxContent, taskName, avatarGroup, durationDisplay, tasksId];
    });
  }
  return [];
};

export const getValidationData = (rawData) => {
  if (!rawData || isEmpty(rawData)) return {};

  const formattedData = {
    reassign_reason: rawData.reassignReason || EMPTY_STRING,
  };

  return formattedData;
};
