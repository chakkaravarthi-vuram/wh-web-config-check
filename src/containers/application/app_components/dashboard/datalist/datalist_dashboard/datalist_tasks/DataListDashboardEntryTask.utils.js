import React from 'react';
import cx from 'classnames/bind';
import { TASK_TAB_INDEX } from 'containers/landing_page/LandingPage.strings';
import { TASKS } from 'urls/RouteConstants';
import { getTaskUrl } from 'utils/taskContentUtils';
import { ARIA_ROLES } from 'utils/UIConstants';
import { ICON_ARIA_LABELS } from 'utils/strings/CommonStrings';
import CheckboxGroup, { CHECK_BOX_GROUP_TYPE } from 'components/form_components/checkbox_group/CheckboxGroup';
import ReassignIcon from 'assets/icons/reassign_task/ReassignIcon';
import { translate } from 'language/config';
import { REASSIGN_MODAL } from 'components/reassign_modal/ReassignModal.strings';
import { TASK_OPTION_LIST_STRINGS } from 'containers/flow/listFlow/listFlow.strings';
import UpDownArrowIcon from 'assets/icons/UpDownArrowIcon';
import gClasses from 'scss/Typography.module.scss';
import jsUtils, { nullCheck } from 'utils/jsUtility';
import { getSignedUrlFromDocumentUrlDetails } from 'utils/profileUtils';
import { AvatarGroup, AvatarSizeVariant, Checkbox, EPopperPlacements } from '@workhall-pvt-lmt/wh-ui-library';
import { replaceNullWithNA } from '../../../../../../landing_page/my_tasks/task_content/TaskContent.utils';
import { constructAvatarOrUserDisplayGroupList, getPopperContent, getRouteLink } from '../../../../../../../utils/UtilityFunctions';
import { EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';
import { dateDuration } from '../../../../../../data_list/view_data_list/data_list_entry_task/DataListEntryTask.utils';
import jsUtility from '../../../../../../../utils/jsUtility';

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

export const reassignPopUp = [
  {
    label: REASSIGN_MODAL.POPUP_LABEL,
    value: 1,
    icon: <ReassignIcon role={ARIA_ROLES.IMG} ariaHidden ariaLabel="Reassign Task" />,
  },
];

export const reassignPopUpTbl = (t) => [
  {
    label: t('task_content.landing_page.reassign.reassign_task_popup'),
    value: 1,
    icon: <ReassignIcon />,
  },
];

const headerCheckBox = (isHeaderCheckBoxChecked, handleHeaderCheckboxChange) => (
  <CheckboxGroup
    id="select_all_task"
    optionList={[{
      label: EMPTY_STRING,
      value: 'header_checkbox',
    }]}
    onClick={handleHeaderCheckboxChange}
    selectedValues={isHeaderCheckBoxChecked ? ['header_checkbox'] : []}
    hideLabel
    hideMessage
    hideOptionLabel
  />
);

export const tableHeaderList = (isHeaderCheckBoxChecked, handleHeaderCheckboxChange, visibleReassign, taskDropdown) => [
  {
    value: taskDropdown === 0 && visibleReassign && headerCheckBox(isHeaderCheckBoxChecked, handleHeaderCheckboxChange),
  },
  {
    value: REASSIGN_MODAL.RECORD_ID,
  },
  {
    value: REASSIGN_MODAL.TASK_NAME,
  },
  {
    value: REASSIGN_MODAL.OPEN_WITH,
  },
  {
    value: REASSIGN_MODAL.PENDING_SINCE,
  },
];

export const tableHeader = (headers, recordId, selectedValue1) => {
  const upDownArrowIcon = <UpDownArrowIcon className={cx(gClasses.ML5)} role={ARIA_ROLES.IMG} ariaLabel={ICON_ARIA_LABELS.UP_DOWN_ICON} />;
  if (recordId) {
    return headers.map((header, index) => {
      if (index <= 1) {
        return [header.value];
      }
      if (header.value === REASSIGN_MODAL.OPEN_WITH && selectedValue1 === 1) {
        return [TASK_OPTION_LIST_STRINGS.CLOSED_BY, upDownArrowIcon];
      }
      if (header.value === REASSIGN_MODAL.PENDING_SINCE && selectedValue1 === 1) {
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
    if (header.value === REASSIGN_MODAL.OPEN_WITH && selectedValue1 === 1) {
      return [TASK_OPTION_LIST_STRINGS.CLOSED_BY, upDownArrowIcon];
    }
    if (header.value === REASSIGN_MODAL.PENDING_SINCE && selectedValue1 === 1) {
      return [TASK_OPTION_LIST_STRINGS.COMPLETED_ON, upDownArrowIcon];
    } else {
      return [header.value, upDownArrowIcon];
    }
  });
};

export const DATA_LIST_ENTRY_TASK_STRING = (translate) => {
  return {
  SEARCH_TASK_PLACEHOLDER: translate('datalist.data_list_entry_task.data_list_entry_task_string.search_task_placeholder'),
  ADD_NEW_BUTTON: translate('datalist.data_list_entry_task.data_list_entry_task_string.add_new_button'),
  FOUND: translate('datalist.data_list_entry_task.data_list_entry_task_string.found'),
  OPEN: translate('datalist.data_list_entry_task.data_list_entry_task_string.open'),
  CLOSED: translate('datalist.data_list_entry_task.data_list_entry_task_string.closed'),
  TASK: translate('datalist.data_list_entry_task.data_list_entry_task_string.task'),
  TASKS: translate('datalist.data_list_entry_task.data_list_entry_task_string.tasks'),
  RESULT: translate('datalist.data_list_entry_task.data_list_entry_task_string.result'),
  RESULTS: translate('datalist.data_list_entry_task.data_list_entry_task_string.results'),
  TASK_DETAILS: translate('datalist.data_list_entry_task.data_list_entry_task_string.task_details'),
  REASSIGNMENT_DETAILS: translate('datalist.data_list_entry_task.data_list_entry_task_string.reassignment_details'),
  WARNING_CONTENT: translate('datalist.data_list_entry_task.data_list_entry_task_string.warning_content'),
  CANCEL: translate('datalist.data_list_entry_task.data_list_entry_task_string.cancel'),
  REASSIGN: translate('datalist.data_list_entry_task.data_list_entry_task_string.reassign'),
  REASSIGN_TASK: translate('datalist.data_list_entry_task.data_list_entry_task_string.reassign_task'),
  };
};

export const messageObject = {
  title: translate('flow_dashboard.message_object.title'),
  subTitle: translate('flow_dashboard.message_object.sub_title'),
  type: 3,
};

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
          label: EMPTY_STRING,
          value: eachTask._id,
        }]}
        onClick={handleCheckboxChange}
        selectedValues={selectedTaskList.includes(eachTask._id) ? [eachTask._id] : []}
        hideLabel
        hideMessage
        type={CHECK_BOX_GROUP_TYPE.TYPE_2}
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
            className={cx(gClasses.anchorTag)}
            title={`${eachTask.task_name}`}
          >
            {eachTask.task_name}
          </a>
        );
      } else {
        taskName = (
          <span>
            {eachTask.task_name}
          </span>
        );
      }
      const tableCheckBoxContent = taskDropdown === 0 && visibleReassign && tableCheckboxGroup;
      const tasksId = taskDropdown === 0 && visibleReassign && eachTask._id;
      const durationDisplay = ((taskStatus === 1) && eachTask.closed_on) ? dateDuration(eachTask.closed_on.duration_display) : dateDuration(eachTask.assigned_on.duration_display);
      if (recordId) {
        return [
          tableCheckBoxContent,
          replaceNullWithNA(eachTask.data_list_entry_identifier),
          taskName,
          avatarGroup,
          durationDisplay,
          tasksId,
        ];
      }

      return [tableCheckBoxContent, taskName, avatarGroup, durationDisplay, tasksId];
    });
  }
  return null;
};

export const calculateRowCountForTable = (ref) => {
  const minCount = 5;
  if (nullCheck(ref, 'current.clientHeight')) {
    const height = ref.current.clientHeight - 83 - 62;
    return Math.max(Math.floor(height / 45), minCount);
  }
  return minCount;
};

export default taskOptionList;
