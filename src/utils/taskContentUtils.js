/* eslint-disable consistent-return */
import React from 'react';
import cx from 'classnames/bind';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import { Col, Row } from 'reactstrap';
import i18next from 'i18next';
import { FIELD_TYPES } from 'components/form_builder/FormBuilder.strings';
import { DRAFT_TASK, SNOOZED_TASK } from 'urls/RouteConstants';
import { constructFileUpload } from 'containers/landing_page/my_tasks/task_content/TaskContent.utils';
import { getFieldType } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { Button, EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import styles from '../components/form_components/radio_group/RadioGroup.module.scss';
import {
  M_T_STRINGS,
  TASK_ACCORDION_INDEX,
  TASK_CONTENT_STRINGS,
  TASK_TAB_INDEX,
} from '../containers/landing_page/LandingPage.strings';
import buttonstyles from '../containers/task/task/Task.module.scss';
import gClasses from '../scss/Typography.module.scss';

import { BOX_STYLE } from './constants/myTask.constant';
import { BS } from './UIConstants';

import AvatarGroup from '../components/avatar_group/AvatarGroup';
import UserImage from '../components/user_image/UserImage';
import { FLOW_DROPDOWN } from '../containers/flow/listFlow/listFlow.strings';
import jsUtils, { cloneDeep, isBoolean, isFiniteNumber, isNullishCoalesce, isEmpty, get, formFieldEmptyCheckObjSensitive, formFieldEmptyCheck, translateFunction, isObject, isArray } from './jsUtility';
import { getCurrentUser } from './userUtils';
import {
  getFileNameFromServer,
  getSplittedUsersAndTeamsIdObjFromArray,
  getUserImagesForAvatar,
  hasOwn,
  priorityTask,
} from './UtilityFunctions';

import { store } from '../Store';
import {
  ALL_PUBLISHED_FLOWS,
  ASSIGNED_TO_OTHERS_TASKS,
  COMPLETED_TASKS,
  DATALIST_OVERVIEW,
  MY_DRAFT_DATALIST,
  MY_PUBLISHED_DATALIST,
  OPEN_TASKS,
  FLOW_DRAFT_MANAGED_BY_YOU,
  FLOW_TEST_BED_MANAGED_BY_YOU,
  SELF_TASK,
  TASKS,
} from '../urls/RouteConstants';
import { FILE_UPLOAD_STATUS, LINK_FIELD_PROTOCOL, MODULE_TYPES, RESPONSE_TYPE } from './Constants';
import { FIELD_LIST_TYPE, FIELD_TYPE, PROPERTY_PICKER_ARRAY } from './constants/form.constant';
import { getExtensionFromFileName, getFullName } from './generatorUtils';
import { DOCUMENT_TYPES, EMPTY_STRING, ENTITY, TABLE_ACTION_TYPE } from './strings/CommonStrings';
import { DEFAULT_CURRENCY_TYPE } from './constants/currency.constant';
import { ACTION_TYPE } from './constants/action.constant';
import { VALIDATION_CONSTANT } from './constants/validation.constant';
import { TASK_LIST_TYPE } from '../containers/application/app_components/task_listing/TaskList.constants';
import { getIsFlowBasedTask, getTaskBasicDetails } from '../containers/landing_page/my_tasks/task_content/TaskContent.utils';
import { getFileUrl } from './attachmentUtils';
import { POPPER_PLACEMENTS } from '../components/auto_positioning_popper/AutoPositioningPopper';
import Tooltip from '../components/tooltip/Tooltip';
import { CHECKBOX_SELECT_ALL } from '../components/form_builder/FormBuilder.strings';
import { dateDuration } from '../containers/data_list/view_data_list/data_list_entry_task/DataListEntryTask.utils';
import { getButtonStyle } from '../containers/form/form_builder/form_footer/FormFooter.utils';

export const TASK_CATEGORY_FLOW_TASK = 1;
export const TASK_CATEGORY_ADHOC_TASK = 2;
export const TASK_CATEGORY_DATALIST_ADHOC_TASK = 3;
export const TASK_CATEGORY_FLOW_ADHOC_TASK = 4;

export const completedUsersSeach = (searchText, completedAssignees) => {
  const searchTextCap = jsUtils.capitalize(searchText);
  return completedAssignees.filter((assignee) => !!((!isEmpty(assignee.closed_by)) &&
      (
        jsUtils.startsWith(
          jsUtils.capitalize(assignee.closed_by.first_name),
          searchTextCap,
        ) ||
        jsUtils.startsWith(
          jsUtils.capitalize(assignee.closed_by.last_name),
          searchTextCap,
        ) ||
        jsUtils.startsWith(
          jsUtils.capitalize(
            `${assignee.closed_by.first_name} ${assignee.closed_by.last_name}`,
          ),
          searchTextCap,
        )
      )));
};

export const getTabFromUrlForBasicUserMode = (url) => {
  const allRouteLabels = (url || EMPTY_STRING).split('/');
  const moduleIndex = allRouteLabels.findIndex((label) => `/${label}` === TASKS);
  if (moduleIndex !== -1) {
    const tab = allRouteLabels[moduleIndex + 1];
    switch (tab) {
      case TASK_LIST_TYPE.OPEN: return TASK_TAB_INDEX.OPEN;
      case TASK_LIST_TYPE.ASSIGNED_TO_OTHERS: return TASK_TAB_INDEX.ASSIGNED_TO_OTHERS;
      case TASK_LIST_TYPE.DRAFT_TASKS: return TASK_TAB_INDEX.DRAFT_TASK;
      case TASK_LIST_TYPE.SNOOZE_TASKS: return TASK_TAB_INDEX.SNOOZED_TASK;
      case TASK_LIST_TYPE.COMPLETED_TASKS: return TASK_TAB_INDEX.COMPLETED;
      default: return null;
    }
  }
};

export const isAssigneedToOtherTab = (selectedCardTab, url) =>
  Number(selectedCardTab) === TASK_ACCORDION_INDEX.ASSIGNED_TO_OTHERS ||
  Number(selectedCardTab) === TASK_TAB_INDEX.ASSIGNED_TO_OTHERS ||
  getTabFromUrlForBasicUserMode(url) === TASK_TAB_INDEX.ASSIGNED_TO_OTHERS;
export const isCompletedTab = (selectedCardTab) =>
  Number(selectedCardTab) === TASK_ACCORDION_INDEX.COMPLETED ||
  Number(selectedCardTab) === TASK_TAB_INDEX.COMPLETED;
export const isOpenTab = (selectedCardTab) =>
  Number(selectedCardTab) === TASK_ACCORDION_INDEX.OPEN ||
  Number(selectedCardTab) === TASK_TAB_INDEX.OPEN;
export const isSnoozedTab = (selectedCardTab) =>
  Number(selectedCardTab) === TASK_ACCORDION_INDEX.SNOOZED_TASK ||
  Number(selectedCardTab) === TASK_TAB_INDEX.SNOOZED_TASK;
export const isSelfTaskTab = (selectedCardTab) =>
  Number(selectedCardTab) === TASK_ACCORDION_INDEX.SELF_TASK ||
  Number(selectedCardTab) === TASK_TAB_INDEX.SELF_TASK;
export const getAssignedOn = (
  taskMetadata,
  selectedCardTab,
  active_task_details,
  isTaskDataLoading,
) => {
  if (isTaskDataLoading) {
    return <Skeleton width={200} />;
  }
  if (
    jsUtils.nullCheckObject(taskMetadata, ['published_on']) &&
    isAssigneedToOtherTab(selectedCardTab)
  ) {
    return (
      <div
        className={cx(
          gClasses.FTwo12GrayV66,
          BS.W100,
          // BS.D_FLEX, BS.JC_START
        )}
      >
        <div className={cx(gClasses.CenterV, BS.JC_START, BS.D_FLEX)}>
          {i18next.t('task_content.initiated_on')}
        </div>
        <div
          className={cx(
            gClasses.CenterV,
            BS.JC_BETWEEN,
            gClasses.MT1,
            gClasses.FTwo13GrayV3,
            gClasses.FontWeight500,
            styles.AssignedDate,
          )}
        >
          {taskMetadata.published_on.pref_datetime_display}
        </div>
      </div>
    );
  }
  if (
    active_task_details?.task_log_info?.initiated_on
  ) {
    const date = `${moment(
      active_task_details.task_log_info.initiated_on.pref_tz_datetime,
    ).format('DD MMM h:mm A')}`;
    console.log('date check', date);
    return (
      <div
        className={cx(
          gClasses.FTwo12GrayV66,
          BS.W100,
          // BS.D_FLEX, BS.JC_START
        )}
      >
        <div className={cx(gClasses.CenterV, BS.JC_START, BS.D_FLEX)}>
          {i18next.t('task_content.initiated_on')}
        </div>
        <div
          className={cx(
            gClasses.CenterV,
            BS.JC_BETWEEN,
            gClasses.MT1,
            gClasses.FTwo13GrayV3,
            gClasses.FontWeight500,
            styles.AssignedDate,
          )}
        >
          {active_task_details.task_log_info.initiated_on.pref_datetime_display}
        </div>
      </div>
    );
  }
  return null;
};

export const getDueDate = (
  taskMetadata,
  active_task_details,
  isTaskDataLoading,
) => {
  if (isTaskDataLoading) {
    return <Skeleton width={200} />;
  }
  let date_string = '';
  let date = '';
  if (jsUtils.nullCheckObject(taskMetadata, ['due_date'])) {
    date = `${taskMetadata.due_date.pref_datetime_display}`;
    date_string = date || i18next.t('task_content.no_due_date');
  }

  if (
    active_task_details?.task_log_info?.due_date
  ) {
    date = active_task_details.task_log_info.due_date;
    date_string =
      (date &&
        `${date.pref_datetime_display}`) ||
      i18next.t('task_content.no_due_date');
  }
  return (
    <div
      className={cx(
        gClasses.FTwo12GrayV66,
        BS.W100,
      )}
    >
      <div className={cx(gClasses.CenterV, BS.JC_START, BS.D_FLEX)}>
        {i18next.t('task_content.due_date')}
      </div>
      <div
        className={cx(
          gClasses.CenterV,
          BS.JC_BETWEEN,
          gClasses.MT1,
          date ? gClasses.FTwo13RedV11 : gClasses.FTwo13GrayV3,
          gClasses.FontWeight500,
          styles.AssignedDate,
        )}
      >
        {date_string || i18next.t('task_content.no_due_date')}
      </div>
    </div>
  );
};

export const getProfilePic = (user, document) => {
  let profile_pic = null;
  user &&
    document &&
    document.forEach((doc) => {
      if (doc.document_id === user.profile_pic) profile_pic = doc.signedurl;
    });
  return user ? (
    <div className={cx(BS.D_FLEX, gClasses.CenterV, BS.JC_END)}>
      <div className={cx(BS.D_FLEX)}>
        <UserImage
          src={profile_pic}
          className={cx(buttonstyles.UserIcon2, gClasses.CursorPointer)}
          firstName={user.first_name}
          lastName={user.last_name}
        />
      </div>
      <div
        className={cx(gClasses.ML15, gClasses.FTwo13GrayV3)}
        style={{
          width: '100px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {getFullName(user.first_name, user.last_name)}
      </div>
    </div>
  ) : null;
};

export const getAcceptedOn = (
  taskMetadata,
  selectedCardTab,
  active_task_details,
  isTaskDataLoading,
  label,
) => {
  if (isTaskDataLoading) {
    return <Skeleton width={200} />;
  }
  if (
    active_task_details?.task_log_info?.accepted_on
  ) {
    const date = `${moment(
      active_task_details.task_log_info.accepted_on.pref_tz_datetime,
    ).format('DD MMM h:mm A')} (${active_task_details.task_log_info.accepted_on.duration_display
      })`;
    return (
      <>
        {/* <div className={cx(gClasses.FOne12GrayV4)}>Assigned on:</div> */}
        <div
          className={cx(
            gClasses.Fone12GrayV4,
            gClasses.ML5,
            gClasses.Ellipsis,
            BS.TEXT_RIGHT,
            BS.W100,
          )}
        >
          {`${label} ${date}`}
        </div>
      </>
    );
  }
  return null;
};

export const dueDaysViewBuilder = (
  textStyle,
  boxViewStyle,
  isLoading,
  displayDate,
  styles,
) => (
  <div
    className={cx(
      styles.DueBox,
      textStyle,
      gClasses.CenterVH,
      boxViewStyle,
      BS.TEXT_CENTER,
    )}
  >
    {isLoading ? <Skeleton /> : displayDate}
  </div>
);

export const dueBoxStyleSetter = (style, textToDisplay, styles) => {
  let dueBoxStyle;
  let dueDaysTextStyle;
  let dueDisplay;
  switch (style) {
    case BOX_STYLE.HIGH_PRIORITY_BOX: {
      dueBoxStyle = styles.HighPriorityDueBox;
      dueDaysTextStyle = cx(styles.DueDaysText, gClasses.FOne11RedV7);
      dueDisplay = textToDisplay;
      break;
    }
    case BOX_STYLE.MEDIUM_PRIORITY_BOX: {
      dueBoxStyle = styles.MediumPriorityDueBox;
      dueDaysTextStyle = cx(styles.DueDaysText, gClasses.FOne11OrangeV2);
      dueDisplay = textToDisplay;
      break;
    }
    case BOX_STYLE.COMPLETED_BOX: {
      dueBoxStyle = styles.LowPriorityDueBox;
      dueDaysTextStyle = cx(styles.DueDaysText, gClasses.FOne11GreenV4);
      dueDisplay = textToDisplay;
      break;
    }
    case BOX_STYLE.OVER_DUE_BOX: {
      dueBoxStyle = styles.OverDueBox;
      dueDaysTextStyle = cx(gClasses.FOne11White);
      dueDisplay = textToDisplay;
      break;
    }
    case BOX_STYLE.NO_DUE_BOX: {
      dueBoxStyle = styles.NoDueBox;
      dueDaysTextStyle = cx(styles.DueDaysText, gClasses.FTwo12GrayV3);
      dueDisplay = textToDisplay;
      break;
    }
    default:
      break;
  }
  return { dueBoxStyle, dueDaysTextStyle, dueDisplay };
};

export const avatar = (
  active_task_details,
  taskMetadata,
  isTaskDataLoading,
  styles,
) => {
  if (jsUtils.has(active_task_details, ['task_log_info', 'accepted_by'])) {
    const imageUrlObject = jsUtils.find(
      active_task_details.document_url_details,
      {
        document_id: active_task_details.task_log_info.accepted_by.profile_pic,
      },
    );
    return (
      <UserImage
        className={cx(styles.UserImage, gClasses.MR10)}
        src={imageUrlObject?.signedurl}
        firstName={active_task_details.task_log_info.accepted_by.first_name}
        lastName={active_task_details.task_log_info.accepted_by.last_name}
      />
    );
  }
  if (jsUtils.nullCheckObject(taskMetadata, ['assignees'])) {
    const { assignees, document_url_details } = taskMetadata;
    return (
      <AvatarGroup
        isDataLoading={isTaskDataLoading}
        customZIndexStart={2}
        userImages={getUserImagesForAvatar(
          assignees.users,
          assignees.teams,
          document_url_details,
        )}
        isToolTipRequired
        enableUserOrTeamDetailToolTip
      />
    );
  }
  return null;
};

export const getTaskCategory = (active_task_details) => active_task_details &&
    jsUtils.get(active_task_details, [
      TASK_CONTENT_STRINGS.TASK_INFO.TASKS_LOG_INFO,
      TASK_CONTENT_STRINGS.TASK_INFO.TASK_CATEGORY,
    ]);

export const getSubHeading = (data) => {
  const { taskCategory, createdBy, user, on, date } = data;
  // let subHeading = `${taskCategory} ${createdBy}  ${user?.first_name} ${user?.last_name}  ${on} ${date}`
  const subHeading =
    <p>
      {taskCategory}
      {createdBy}
      {' '}
      <span style={{ fontWeight: 'bold' }}>
        {user?.first_name}
        {user?.last_name}
      </span>
      {' '}
      {on}
      {date}
    </p>;
  return subHeading;
};

export const getTaskDescription = (
  taskMetadata,
  active_task_details,
  isTaskDataLoading,
  selectedCardTab,
) => {
  const pref_locale = localStorage.getItem('application_language');
  const taskCategory =
    active_task_details &&
    jsUtils.get(active_task_details, ['task_log_info', 'task_category']);

  const reference_name =
    jsUtils.get(active_task_details, ['metadata_info', 'flow_name']) ||
    jsUtils.get(active_task_details, ['metadata_info', 'data_list_name']);

  const { initiatorName, publisherName } = getTaskBasicDetails(taskMetadata, selectedCardTab, active_task_details, isTaskDataLoading);
  const isFlowBasedTask = getIsFlowBasedTask(active_task_details);
  let user = EMPTY_STRING;
  if (isFlowBasedTask) {
    user = initiatorName;
  } else {
    user = publisherName;
  }

  let assignedOn = EMPTY_STRING;
  if (
    jsUtils.nullCheckObject(taskMetadata, ['published_on']) &&
    isAssigneedToOtherTab(selectedCardTab)
  ) {
    assignedOn = taskMetadata.published_on.pref_datetime_display;
  }
  if (
    active_task_details?.task_log_info?.initiated_on
  ) {
    assignedOn = active_task_details.task_log_info.initiated_on.pref_datetime_display;
  }
  console.log('###', user, assignedOn);
  // if is assigned to other tab - adhoc task
  if (!isTaskDataLoading && isAssigneedToOtherTab(selectedCardTab)) {
    let taskDescription;
    if (jsUtils.isObject(taskMetadata)) {
      taskDescription = jsUtils.get(taskMetadata, ['task_description'], null);
      if (taskDescription) {
        taskDescription = (
          <div
            className={cx(
              gClasses.FTwo12GrayV3,
              gClasses.FontWeight500,
              BS.TEXT_JUSTIFY,
            )}
          >
            {jsUtils.capitalizeEachFirstLetter(jsUtils.get(active_task_details, [
              'task_log_info',
              'translation_data',
              pref_locale,
              'task_description',
            ], EMPTY_STRING) || taskDescription)}
          </div>
        );
      }
    }
    console.log('### adhoc task');

    const subHeading = getSubHeading({
      taskCategory: i18next.t('task_content.adhoc_task'),
      createdBy: 'created by',
      user: user,
      on: 'on',
      date: assignedOn,
    });
    return [taskDescription, subHeading];
  } else if (!isTaskDataLoading) {
      let subHeading;
      // flow task
      if (
        jsUtils.get(
          active_task_details,
          ['task_log_info', 'flow_id'],
          false,
        ) &&
        ![
          TASK_CATEGORY_FLOW_ADHOC_TASK,
          TASK_CATEGORY_DATALIST_ADHOC_TASK,
        ].includes(taskCategory)
      ) {
        console.log('### flow task');
        subHeading = getSubHeading({
          taskCategory: (jsUtils.get(active_task_details, [
            'task_log_info',
            'translation_data',
            pref_locale,
            'task_definition',
          ], EMPTY_STRING) || jsUtils.get(active_task_details, [
            'metadata_info',
            'flow_name',
          ])),
          createdBy: 'created by',
          user: user,
          on: 'on',
          date: assignedOn,
        });
      } else if (
        jsUtils.nullCheckObject(active_task_details, [
          'metadata_info',
          'published_by',
        ])
      ) {
        const published_by = jsUtils.get(
          active_task_details,
          ['metadata_info', 'published_by'],
          null,
        );
        if (
          ![
            TASK_CATEGORY_FLOW_ADHOC_TASK,
            TASK_CATEGORY_DATALIST_ADHOC_TASK,
          ].includes(taskCategory) &&
          published_by.email === getCurrentUser(published_by)
        ) {
          console.log('### self');
          subHeading = getSubHeading({
            taskCategory: i18next.t('task_content.self_task'),
            createdBy: 'created by',
            user: user,
            on: 'on',
            date: assignedOn,
          });
        } else {
          console.log('### adhoc');
          subHeading = getSubHeading({
            taskCategory: i18next.t('task_content.adhoc_task'),
            createdBy: 'created by',
            user: user,
            on: 'on',
            date: assignedOn,
          });
        }
      }
      let taskDescription = active_task_details.task_log_info.task_description
        ? active_task_details.task_log_info.task_description
        : null;
      if (taskDescription) {
        if (
          jsUtils.get(
            active_task_details,
            ['task_log_info', 'flow_id'],
            false,
          )
        ) {
          taskDescription = (
            <div
              className={cx(
                gClasses.FTwo12GrayV3,
                gClasses.wordWrap,
                BS.TEXT_JUSTIFY,
                gClasses.MinHeight16,
              )}
            >
              {jsUtils.capitalizeFirstLetter(jsUtils.get(active_task_details, [
                'task_log_info',
                'translation_data',
                pref_locale,
                'task_description',
              ]) || taskDescription)}
            </div>
          );
        } else {
          taskDescription = (
            <div
              className={cx(
                gClasses.FTwo12GrayV3,
                BS.TEXT_JUSTIFY,
                gClasses.FontWeight500,
              )}
            >
              {jsUtils.get(active_task_details, [
                'task_log_info',
                'translation_data',
                pref_locale,
                'task_description',
              ]) || jsUtils.capitalizeFirstLetter(taskDescription)}
            </div>
          );
        }
      }

      if (
        [
          TASK_CATEGORY_FLOW_ADHOC_TASK,
          TASK_CATEGORY_DATALIST_ADHOC_TASK,
        ].includes(taskCategory)
      ) {
        console.log('### datalist or flow adhoc task');
        subHeading = getSubHeading({
          taskCategory: `${reference_name} (${i18next.t('task_content.adhoc_task')})`,
          createdBy: 'created by',
          user: user,
          on: 'on',
          date: assignedOn,
        });
      }

      return [taskDescription, subHeading];
    }
  return [<Skeleton key={2} count={2} />, <Skeleton key={50} width={50} />];
};

export const getTaskName = (
  isTaskDataLoading,
  active_task_details,
  taskMetadata,
) => {
  const pref_locale = localStorage.getItem('application_language');
  console.log(active_task_details.task_log_info.translation_data?.[pref_locale], 'active_task_detailsactive_task_details');
  return isTaskDataLoading ? (
    <Skeleton width={200} />
  ) : (
    jsUtils.get(active_task_details, ['task_log_info', 'translation_data', pref_locale, 'task_name']) ||
    jsUtils.get(active_task_details, ['task_log_info', 'task_name']) ||
    jsUtils.get(taskMetadata, ['task_name'])
  );
};

export const isAssignedToOthersTaskCompleted = () => {
  const { total_tasks = 0, completed_tasks = 0 } =
    store.getState().TaskContentReducer.taskMetadata;
  return !!(total_tasks && (total_tasks === completed_tasks));
};

export const getDueDay = (
  taskMetadata,
  active_task_details,
  selectedCardTab,
  isTaskDataLoading,
  styles,
) => {
  if (isTaskDataLoading) {
    return dueDaysViewBuilder(null, styles.NoDueBox, true, null, styles);
  }
  let due_date;
  let dueStyle;
  if (jsUtils.nullCheckObject(taskMetadata, ['due_date'])) {
    due_date = taskMetadata.due_date;
  } else if (active_task_details.task_log_info.due_date) {
    due_date = active_task_details.task_log_info.due_date;
  }
  if (
    jsUtils.isObject(taskMetadata) &&
    isAssigneedToOtherTab(selectedCardTab)
  ) {
    if (taskMetadata.total_tasks === taskMetadata.cancelled_tasks) {
      dueStyle = dueBoxStyleSetter(
        BOX_STYLE.COMPLETED_BOX,
        TASK_CONTENT_STRINGS.CANCELLED,
        styles,
      );
    } else if (taskMetadata.total_tasks === taskMetadata.completed_tasks) {
      dueStyle = dueBoxStyleSetter(
        BOX_STYLE.COMPLETED_BOX,
        TASK_CONTENT_STRINGS.COMPLETED,
        styles,
      );
    } else {
      dueStyle = dueBoxStyleSetter(
        BOX_STYLE.OVER_DUE_BOX,
        TASK_CONTENT_STRINGS.OPEN_TASK,
        styles,
      );
    }
  } else if (due_date) {
    const priority = priorityTask(
      due_date.duration_days,
      M_T_STRINGS.TASK_LIST.DEADLINE_HIGH_PRIORITY_VALUE,
      styles,
    );
    if (priority === 1) {
      dueStyle = dueBoxStyleSetter(
        BOX_STYLE.HIGH_PRIORITY_BOX,
        TASK_CONTENT_STRINGS.DUE.LABEL + dateDuration(due_date.duration_display),
        styles,
      );
    } else if (!priority) {
      dueStyle = dueBoxStyleSetter(
        BOX_STYLE.MEDIUM_PRIORITY_BOX,
        TASK_CONTENT_STRINGS.DUE.LABEL + dateDuration(due_date.duration_display),
        styles,
      );
    } else {
      dueStyle = dueBoxStyleSetter(
        BOX_STYLE.OVER_DUE_BOX,
        TASK_CONTENT_STRINGS.OVER_DUE,
        styles,
      );
    }
  } else {
    dueStyle = dueBoxStyleSetter(
      BOX_STYLE.NO_DUE_BOX,
      TASK_CONTENT_STRINGS.NO_DUE,
      styles,
    );
  }
  return dueDaysViewBuilder(
    dueStyle.dueDaysTextStyle,
    dueStyle.dueBoxStyle,
    false,
    dueStyle.dueDisplay,
    styles,
  );
};

export const getPublisherName = (
  taskMetadata,
  active_task_details,
  isTaskDataLoading,
  hideIfSelfTask = false,
) => {
  if (isTaskDataLoading) {
    return <Skeleton height={18} width={150} />;
  }
  let firstName = '';
  let lastName = '';
  let email = '';
  let publishedBy = null;
  let isSelfTask = false;
  if (jsUtils.nullCheckObject(taskMetadata, ['published_by'])) {
    firstName = taskMetadata.published_by.first_name;
    lastName = taskMetadata.published_by.last_name;
    email = taskMetadata.published_by.email;
    publishedBy = taskMetadata.published_by;
  } else if (
    jsUtils.nullCheckObject(active_task_details, 'metadata_info.published_by')
  ) {
    firstName = active_task_details.metadata_info.published_by.first_name;
    lastName = active_task_details.metadata_info.published_by.last_name;
    email = active_task_details.metadata_info.published_by.email;
    publishedBy = active_task_details.metadata_info.published_by;
  }
  if (publishedBy && email === getCurrentUser(publishedBy)) isSelfTask = true;
  console.log('#### by', publishedBy);
  return [
    publishedBy,
    !hideIfSelfTask || (hideIfSelfTask && !isSelfTask) ? (
      <div className={cx(gClasses.FOne13, gClasses.Ellipsis)}>
        <span className={gClasses.GrayV4}>Assigned By: </span>
        <span style={{ color: '#228bb5' }} className={gClasses.GrayV3}>
          {getFullName(firstName, lastName)}
        </span>
      </div>
    ) : null,
  ];
};

export const getInitiatorName = (
  taskMetadata,
  isTaskDataLoading,
  hideIfInitiationTask = false,
) => {
  if (isTaskDataLoading) {
    return <Skeleton height={18} width={150} />;
  }
  let firstName = '';
  let lastName = '';
  let email = '';
  let initiatedBy = null;
  let isInitiationTask = false;
  if (
    jsUtils.nullCheckObject(taskMetadata, ['task_log_info', 'initiated_by'])
  ) {
    firstName = taskMetadata.task_log_info.initiated_by.first_name;
    lastName = taskMetadata.task_log_info.initiated_by.last_name;
    email = taskMetadata.task_log_info.initiated_by.email;
    initiatedBy = taskMetadata.task_log_info.initiated_by;
    if (initiatedBy && email === getCurrentUser(initiatedBy)) isInitiationTask = true; // if both initiator and current user are same
    console.log('getInitiatorName', taskMetadata, initiatedBy);
    return [
      initiatedBy,
      !hideIfInitiationTask || (hideIfInitiationTask && !isInitiationTask) ? (
        <div
          className={cx(gClasses.FOne13, gClasses.Ellipsis, gClasses.Flex1)}
        >
          {/* <span className={gClasses.GrayV4}>Created By: </span> */}
          <span style={{ color: '#228bb5' }} className={gClasses.GrayV3}>
            {getFullName(firstName, lastName)}
          </span>
        </div>
      ) : null,
    ];
  }
  return [initiatedBy, null];
};

export const generateTaskContentButton = (
  is_button_enabled,
  active_task_details,
  isTaskDataLoading,
  clickHandler,
  taskActionOptionList,
  is_initiated_task,
  buttonClick,
  isTestBed = false,
  t = translateFunction,
  colorScheme,
) => {
  const pref_locale = localStorage.getItem('application_language');
  if (isTaskDataLoading) {
    return (
      <Row
        className={cx(
          gClasses.MT20,
          gClasses.MB30,
          BS.JC_CENTER,
          BS.TEXT_CENTER,
        )}
      >
        <Col sm={12}>
          <Skeleton width={120} height={34} style={{ borderRadius: '26px' }} />
        </Col>
      </Row>
    );
  }

  const buttonView = (option) => (
    <div
      className={cx(
        hasOwn(option, 'isVisible') && !option.isVisible
          ? styles.HalfOpacity
          : styles.FullOpacity,
      )}
    />
    );
  const secondaryButtons = [];
  const primaryButtons = [];
  const rejectAndCancelButons = [];
  console.log('taskActionOptionListtaskActionOptionList', taskActionOptionList);
  taskActionOptionList.forEach((item, index) => {
    console.log('taskActionOptionListtaskActionOptionList1', item?.type, pref_locale, item?.isSystemAction);
    if (item.isVisible) {
      let itemLabel = jsUtils.capitalizeEachFirstLetter(item.label);
      if (!(pref_locale?.includes('en'))) {
        if (item?.type === ACTION_TYPE.CANCEL && item?.isSystemAction) {
          itemLabel = t('task_content.cancel_buton_label');
        } else if (item?.type === ACTION_TYPE.ASSIGN_REVIEW && !item?.control_type && item?.isSystemAction) {
          itemLabel = t('task_content.reassign_review_button_label');
          } else if (item?.type === ACTION_TYPE.DEFAULT_SEND_BACK && item?.isSystemAction) {
            itemLabel = t('task_content.review_completed_button_label');
            } else itemLabel = item?.translation_data?.[pref_locale]?.action_name || itemLabel;
      }
      console.log('item labelwll', itemLabel);
      switch (item.type) {
        case ACTION_TYPE.ASSIGN_REVIEW:
          primaryButtons.push(
            <>
              <Button
                id={item.type + index}
                type={EButtonType.SECONDARY}
                className={cx(
                  buttonView(item),
                  styles.OptionPadding,
                  gClasses.WidthFitContent,
                  !!isTestBed && gClasses.Opacity5,
                )}
                onClickHandler={(event) =>
                  buttonClick(event, item)
                }
                disabled={!!isTestBed}
                buttonText={jsUtils.truncate(itemLabel, { length: 23 })}
                colorSchema={{ ...colorScheme }}
              />
              <Tooltip
                id={item.type + index}
                placement={POPPER_PLACEMENTS.BOTTOM}
                isCustomToolTip
                customInnerClasss={styles.ToolTipContainer}
                outerClass={gClasses.OpacityFull}
                content={itemLabel}
              />
            </>,
          );
          break;
        //  case ACTION_TYPE.NEXT:
        case ACTION_TYPE.END_FLOW:
        case ACTION_TYPE.FORWARD:
        case ACTION_TYPE.DEFAULT_SEND_BACK:
          primaryButtons.push(
            <>
              <Button
                id={item.type + index}
                type={EButtonType.PRIMARY}
                className={cx(
                  gClasses.WidthFitContent,
                  buttonView(item),
                  styles.OptionPadding,
                )}
                onClickHandler={(event) =>
                  buttonClick(event, item)
                }
                buttonText={jsUtils.truncate(itemLabel, { length: 23 })}
                colorSchema={colorScheme}
              />
              <Tooltip
                id={item.type + index}
                placement={POPPER_PLACEMENTS.BOTTOM}
                isCustomToolTip
                customInnerClasss={styles.ToolTipContainer}
                outerClass={gClasses.OpacityFull}
                content={itemLabel}
              />
            </>,
          );
          break;
        case ACTION_TYPE.CANCEL:
          rejectAndCancelButons.push(
            <>
              <button
                id={item.type + index}
                onClick={(event) => buttonClick(event, item)}
                className={cx(getButtonStyle(item.type))}
              >
                {jsUtils.truncate(itemLabel, { length: 23 })}
              </button>
              {/* <Button
                id={item.type + index}
                type={EButtonType.SECONDARY}
                className={cx(
                  buttonView(item),
                  styles.OptionPadding,
                  gClasses.WidthFitContent,
                )}
                onClickHandler={(event) =>
                  buttonClick(event, item.value, item.isVisible, item.type)
                }
                buttonText={jsUtils.truncate(itemLabel, { length: 23 })}
                colorSchema={{ ...colorScheme, activeColor: 'red' }}
              /> */}
              <Tooltip
                id={item.type + index}
                placement={POPPER_PLACEMENTS.BOTTOM}
                isCustomToolTip
                customInnerClasss={styles.ToolTipContainer}
                outerClass={gClasses.OpacityFull}
                content={itemLabel}
              />
            </>,
          );
          break;
        case ACTION_TYPE.SEND_BACK:
          primaryButtons.push(
            <>
              <Button
                id={item.type + index}
                type={EButtonType.SECONDARY}
                className={cx(
                  buttonView(item),
                  styles.OptionPadding,
                  gClasses.WidthFitContent,
                )}
                onClickHandler={(event) =>
                  buttonClick(event, item)
                }
                buttonText={jsUtils.truncate(itemLabel, { length: 23 })}
                colorSchema={{ ...colorScheme }}
              />
              <Tooltip
                id={item.type + index}
                placement={POPPER_PLACEMENTS.BOTTOM}
                isCustomToolTip
                customInnerClasss={styles.ToolTipContainer}
                outerClass={gClasses.OpacityFull}
                content={itemLabel}
              />
            </>,
          );
          break;
        default:
          break;
      }
    }
  });
  if (
    is_button_enabled &&
    jsUtils.get(active_task_details, ['task_log_info', 'task_status'], null) !== 'completed'
  ) {
    if (active_task_details?.task_log_info?.task_category === 1) {
      return (
        <div
          className={cx(styles.ModalFooter, BS.D_FLEX, BS.JC_END, BS.W100)}
        >
          <div
            className={cx(BS.D_FLEX, BS.JC_BETWEEN)}
            style={{ width: '100%' }}
          >
            <div
              style={{
                display: 'flex',
                gridGap: '5px',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
              }}
              className={(BS.JC_START, styles.BtnContainer)}
            >
              {secondaryButtons}
              {rejectAndCancelButons}
            </div>
            <div
              style={{
                display: 'flex',
                gridGap: '5px',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
              }}
              className={cx(BS.JC_END, BS.D_FLEX, BS.JC_END)}
            >
              {primaryButtons}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div
        className={cx(
          gClasses.MT15,
          gClasses.MB15,
          BS.W100,
        )}
      >
        <div className={cx(BS.D_FLEX, BS.JC_END)} style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              gridGap: '5px',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
            className={cx(BS.JC_END, BS.D_FLEX, BS.JC_END)}
          >
            <Button
              id={TASK_CONTENT_STRINGS.SUMBMIT_TASK_ID}
              type={EButtonType.PRIMARY}
              className={cx(
                gClasses.WidthFitContent,
              )}
              onClickHandler={clickHandler}
              buttonText={TASK_CONTENT_STRINGS.SUBMIT_TASK}
              colorSchema={colorScheme}
            />
            <Tooltip
              id={TASK_CONTENT_STRINGS.SUMBMIT_TASK_ID}
              placement={POPPER_PLACEMENTS.BOTTOM}
              isCustomToolTip
              customInnerClasss={styles.ToolTipContainer}
              outerClass={gClasses.OpacityFull}
              content={TASK_CONTENT_STRINGS.SUBMIT_TASK}
            />
          </div>
        </div>
      </div>
    );
  }
};

export const getAllSearchParams = (urlSearchParam) => {
  const obj = {};
  urlSearchParam.forEach((value, key) => jsUtils.set(obj, [key], value));
  return obj;
};

export const hasRequiredSearchParam = (urlSearchParam, requiredSearchParam) =>
  requiredSearchParam.every((param) => urlSearchParam.has(param));

export const getTaskUrl = (selectedCardTab) => {
  if (isCompletedTab(selectedCardTab)) return COMPLETED_TASKS;
  if (isAssigneedToOtherTab(selectedCardTab)) return ASSIGNED_TO_OTHERS_TASKS;
  if (selectedCardTab === 4) return SELF_TASK;
  if (selectedCardTab === 5) return DRAFT_TASK;
  if (selectedCardTab === 6) return SNOOZED_TASK;
  return OPEN_TASKS;
};

export const getFlowUrl = (selectedCardTab) => {
  if (selectedCardTab === FLOW_DROPDOWN.PUBLISHED_FLOW) return ALL_PUBLISHED_FLOWS;
  if (selectedCardTab === FLOW_DROPDOWN.UNDER_TESTING) return FLOW_TEST_BED_MANAGED_BY_YOU;
  if (selectedCardTab === FLOW_DROPDOWN.DRAFT_FLOW) return FLOW_DRAFT_MANAGED_BY_YOU;
  return null;
};

export const getDatalistUrl = (selectedCardTab) => {
  if (selectedCardTab === 1) return DATALIST_OVERVIEW;
  if (selectedCardTab === 2) return MY_PUBLISHED_DATALIST;
  if (selectedCardTab === 3) return MY_DRAFT_DATALIST;
  return null;
};

export const getTabFromUrl = (url) => {
  const tab = jsUtils.get(url.split('/'), [3]);
  if (tab) {
    if (tab === COMPLETED_TASKS) return TASK_TAB_INDEX.COMPLETED;
    if (tab === ASSIGNED_TO_OTHERS_TASKS) return TASK_TAB_INDEX.ASSIGNED_TO_OTHERS;
    if (tab === SELF_TASK) return TASK_TAB_INDEX.SELF_TASK;
    if (tab === OPEN_TASKS) return TASK_TAB_INDEX.OPEN;
    if (tab === DRAFT_TASK) return TASK_TAB_INDEX.DRAFT_TASK;
    if (tab === SNOOZED_TASK) return TASK_TAB_INDEX.SNOOZED_TASK;
  }
  return null;
};

export const getTaskIdFromUrl = (url) => jsUtils.get(url.split('/'), [4]);

export const getTaskListResponseHandler = (server_error, list_data, tab, t = translateFunction) => {
  let messageObject = null;
  if (!isEmpty(server_error)) {
    messageObject = {
      title: 'Oops',
      subTitle: server_error,
      type: RESPONSE_TYPE.SERVER_ERROR,
    };
  } else if (list_data.length === 0) {
    if (isCompletedTab(tab)) {
      messageObject = {
        title: t(VALIDATION_CONSTANT.NO_COMPLETE_TASK),
        type: RESPONSE_TYPE.NO_TASK_FOUND,
      };
    } else if (tab === 4) {
      messageObject = {
        title: t(VALIDATION_CONSTANT.NO_SELF_TASK),
        type: RESPONSE_TYPE.NO_TASK_FOUND,
      };
    } else if (isAssigneedToOtherTab(tab)) {
      messageObject = {
        title: t(VALIDATION_CONSTANT.NO_ASSIGN_TO_OTHERS_TASK),
        type: RESPONSE_TYPE.NO_TASK_FOUND,
      };
    } else {
      messageObject = {
        title: t(VALIDATION_CONSTANT.NO_OPEN_TASK),
        type: RESPONSE_TYPE.NO_TASK_FOUND,
      };
    }
  }
  return messageObject;
};

export const getDocumentMetaData = (
  docDetails,
  fileRefUUID,
  entity,
  active_task_details,
  type,
  uploadFileId,
  refUuid,
) => {
  console.log(
    'active_task_detailsactive_task_details',
    docDetails,
    active_task_details,
    fileRefUUID,
    refUuid,
    uploadFileId,
  );
  const file_metadata = docDetails.map((docDetail) => {
    console.log('dummy console', docDetail.name, docDetail.name.length - docDetail.name.lastIndexOf('.'));
    const metadata = {
      type,
      file_type: getExtensionFromFileName(docDetail.name),
      file_name: docDetail.name.slice(0, -1 * (docDetail.name.length - docDetail.name.lastIndexOf('.'))),
      file_size: docDetail.size,
      file_ref_id: fileRefUUID,
    };
    if (type === DOCUMENT_TYPES.FORM_DOCUMENTS) {
      metadata.context_uuid = uploadFileId;
    }
    return metadata;
  });
  const metadata = {
    file_metadata,
    entity,
    entity_id: jsUtils.get(active_task_details, [
      'task_log_info',
      'instance_id',
    ]),
    ...(refUuid ? { ref_uuid: refUuid } : {}),
  };
  if (type === DOCUMENT_TYPES.FORM_DOCUMENTS) {
    metadata.context_id = jsUtils.get(active_task_details, [
      'form_metadata',
      'form_id',
    ]);
  }
  return metadata;
};

export const formatData = (
  field_value,
  field_type,
  searchActiveTaskContent,
  state,
  isVisibility,
  isTable,
  tableRow,
  tableUuid,
) => {
  let f_value = jsUtils.cloneDeep(field_value);

  // [], {}, "", null, undefined, NaN
  if (!isBoolean(f_value) && !isFiniteNumber(f_value) && isEmpty(f_value)) {
    return isVisibility ? null : undefined;
  }

  switch (field_type) {
    case FIELD_TYPE.NUMBER: // decimal, number
      if (f_value.toString().includes('.')) return parseFloat(f_value);
      return parseInt(f_value, 10);

    case FIELD_TYPE.USER_TEAM_PICKER: // {users: [id...], teasms: [id...]} or {}
      return getSplittedUsersAndTeamsIdObjFromArray(f_value);

    case FIELD_TYPE.DATA_LIST: // ['value'..., n] or null
      if (jsUtils.isArray(f_value)) f_value = f_value.map((dataListInstance) => jsUtils.get(dataListInstance, 'value'));
      else f_value = null;
      break;
    case FIELD_TYPE.CHECKBOX:
      if (jsUtils.isArray(f_value)) f_value = f_value.filter((data) => data !== CHECKBOX_SELECT_ALL.VALUE);
      break;
    case FIELD_TYPE.CURRENCY: // feeds currency.value with decimal, number.
      if (f_value.value || f_value.value === 0) { // As 0 is a valid value for currency, allow zero
        if (f_value.value.toString().includes('.')) {
          f_value.value = parseFloat(f_value.value);
          return f_value;
        }
        f_value.value = parseInt(f_value.value, 10);
      } else {
        f_value = null;
      }
      break;

    case FIELD_TYPE.PHONE_NUMBER: // null, if phone no is empty or 0.
      if (!f_value.phone_number && (f_value.phone_number !== 0)) f_value = null;
      break;

    case FIELD_TYPE.FILE_UPLOAD:
      let found = false;
      const filePostData = [];
      const newfilePostData = [];
      console.log('fileuploadstate', state, f_value);
      if (jsUtils.has(state, ['document_details', 'file_metadata'])) {
          state?.document_details?.file_metadata?.some?.((file_info) => {
            f_value.forEach((eachFile) => {
              if (eachFile) {
                if (eachFile.file_uuid === file_info.file_ref_id) {
                  found = true;
                  filePostData.push(file_info._id);
                  return true;
                }
                return false;
              }
            });
            return null;
          });
      }
      if (
        jsUtils.has(state, ['document_url_details'])
        // && !jsUtils.isArray(f_value)
      ) {
        state?.document_url_details?.some?.((file_info) => {
          f_value.forEach((eachFile) => {
            if (eachFile) {
              if (eachFile.file.url === file_info.signedurl) {
                found = true;
                newfilePostData.push(file_info.document_id);
                return true;
              }
            }
            return false;
          });
          return null;
        });
        f_value = newfilePostData;
        console.log('foundfoundfound', f_value);
      }
      f_value = [...new Set([...newfilePostData, ...filePostData])];
      if (!found && searchActiveTaskContent) {
        let fileId;
        if (isTable) {
          if (jsUtils.has(state, ['active_task_details'])) {
            fileId = jsUtils.get(state, [
              'active_task_details',
              'active_form_content',
              tableUuid,
              tableRow,
              f_value.fileId,
            ]);
          } else if (jsUtils.has(state, ['active_form_content'])) {
            fileId = jsUtils.get(state, [
              'active_form_content',
              tableUuid,
              tableRow,
              f_value.fileId,
            ]);
          }
        } else if (jsUtils.has(state, ['active_task_details'])) {
            fileId = jsUtils.get(state, [
              'active_task_details',
              'active_form_content',
              f_value.fileId,
            ]);
          } else if (jsUtils.has(state, ['active_form_content'])) {
            fileId = jsUtils.get(state, [
              'active_form_content',
              f_value.fileId,
            ]);
          }
          // file upload imported not read only but not updated return doc id
        if (fileId) {
          f_value = fileId;
        }
      }
      break;

    case FIELD_TYPE.LINK: // feeds link.link_url with  protocol eg: https://link.link_url, if link has no protocal
      let url = null;
      f_value = f_value.map((link) => {
        url = link?.link_url;
        if (url) {
          link.link_url = url.trim();
          if (link.link_url.includes(':/') || link.link_url.includes('://')) {
            return link;
          } else {
            link.link_url = `${LINK_FIELD_PROTOCOL.HTTP}${url}`;
            return link;
          }
        }
        return link;
      });
      return f_value;

    default:
      break;
  }
  console.log('currency format return', f_value, field_type);
  return f_value;
};

export const checkAllFieldsAreReadOnly = (fields = []) => {
  const is_read_only = fields.every((field) => field.read_only);
  return is_read_only;
};
export const checkAllFieldsAreReadOnlyExcludingCurrentField = (fields = [], exclude_field_uuid) => {
  const fieldsToCheck = fields.filter((each_field) => each_field.field_uuid !== exclude_field_uuid);
  if (isEmpty(fieldsToCheck)) return false;
  const is_read_only = fieldsToCheck.every((field) => field.read_only);
  return is_read_only;
};

export const getTableFieldsTaskContentData = (
  state_data,
  isVisibility,
  formVisibility = {},
  eachFieldList,
  fieldPostData,
  formatData,
  tableRowUpdateAction,
  moduleType = EMPTY_STRING,
  modified_readonly_field_uuid = [],
) => {
  // when the table is hidden with document, need to remove the document from  file_metadata in document_details .
  // update in state_data - since the state_data is not cloned, state_data work like call by reference
  let formUploadData = {};
  let all_visible_documents = [];

  const { visible_disable_fields = {}, visible_fields = {} } = formVisibility;

  if (moduleType === MODULE_TYPES.DATA_LIST) {
    formUploadData = jsUtils.get(state_data, ['form_data'], {});
  } else if (moduleType === MODULE_TYPES.TASK) {
    formUploadData = jsUtils.get(state_data, ['formUploadData'], {});
  }
  if (
    formVisibility &&
    !formVisibility.visible_tables[eachFieldList.table_uuid]
  ) {
    jsUtils.get(formUploadData, [eachFieldList.table_uuid], []).forEach((tableRow) => {
      jsUtils.forEach(tableRow, (_value, key) => {
        const currentField = eachFieldList?.fields?.find((field) => field.field_uuid === key);
        const fieldType = currentField?.field_type;

        if (fieldType === FIELD_TYPES.FILE_UPLOAD) {
          if (state_data?.document_details?.file_metadata) {
            const file_metadata = cloneDeep(state_data?.document_details?.file_metadata);
            file_metadata.forEach((file_info, fileIndex) => {
              if (!isNullishCoalesce(tableRow[key])) {
                tableRow[key].forEach(
                  (eachFile) =>
                    eachFile?.file_uuid === file_info.file_ref_id &&
                    file_metadata.splice(fileIndex, 1),
                );
              }
            });
            state_data.document_details.file_metadata = cloneDeep(file_metadata);
          }
        }
      });
    },
    );
    return { fieldPostData: [], all_visible_documents: all_visible_documents };
  }
  const server_form_data = jsUtils.get(state_data, ['temporaryFormUploadData'], {});
  fieldPostData = jsUtils.get(formUploadData, [eachFieldList.table_uuid], []).flatMap(
    (tableRow, index) => {
      let isEmptyRow = true;
      let checkAllFieldsAreEditable = true;
      jsUtils.forEach(tableRow, (_value, key) => {
        const currentField = eachFieldList?.fields?.find((field) => field.field_uuid === key);
        const fieldType = currentField?.field_type;

        const isDisabled = get(visible_disable_fields, [eachFieldList.table_uuid, index, key], false);
        const isVisibile = currentField?.is_visible;
        const isFieldShowWhenRule = currentField?.is_field_show_when_rule;

        const isFieldValidatable = !isFieldShowWhenRule || ((isVisibile && visible_fields[key]) || (!isVisibile && !isDisabled));

        // Below code happens for hidden fields.
        if (formVisibility && !isFieldValidatable) {
          if (fieldType === FIELD_TYPES.FILE_UPLOAD) {
            if (state_data?.document_details?.file_metadata) {
              const file_metadata = cloneDeep(state_data?.document_details?.file_metadata);
              const updated_file_metadata = cloneDeep(file_metadata);
              file_metadata.forEach((file_info) => {
                if (!isNullishCoalesce(tableRow[key])) {
                  tableRow[key].forEach(
                    (eachFile) => {
                      if (eachFile?.file_uuid === file_info.file_ref_id) {
                        const remove_file_index = jsUtils.findIndex(updated_file_metadata, { file_ref_id: file_info.file_ref_id });
                        (remove_file_index > -1) && updated_file_metadata.splice(remove_file_index, 1);
                      }
                    },
                  );
                }
              });
              state_data.document_details.file_metadata = cloneDeep(updated_file_metadata);
            }
          }

          if (!['_id', 'temp_row_uuid'].includes(key) && !isEmpty(currentField)) {
            if (currentField?.is_visible === false) {
              checkAllFieldsAreEditable = false;
            }
          }

          // !tableRow._id // commented to remove hidden fields in imported table
          if (key !== '_id' && (isVisibility ? key !== 'temp_row_uuid' : true)) jsUtils.unset(tableRow, [key]);
          if (key === '_id') isEmptyRow = false;
        } else if (!isEmpty(currentField) && (tableRow[key] !== null || isVisibility)) {
            if (!(currentField?.read_only)) {
              const formattedData = formatData(
                tableRow[key],
                fieldType,
                true,
                state_data,
                isVisibility,
                true,
                index,
                eachFieldList.table_uuid,
              );
              if (
                !isBoolean(formattedData) &&
                !isFiniteNumber(formattedData) &&
                ((jsUtils.isString(formattedData)) ? isEmpty(formattedData.trim()) : isEmpty(formattedData))
              ) {
                tableRow[key] = null;
              } else {
                isEmptyRow = false;
                tableRow[key] = formattedData;
                if (getFieldType(currentField) === FIELD_TYPE.FILE_UPLOAD) {
                  all_visible_documents = [...(formattedData || []), ...all_visible_documents];
                }
              }
            } else {
              checkAllFieldsAreEditable = false;
              const current_row = jsUtils.find(
                get(server_form_data, [eachFieldList.table_uuid], []),
                { temp_row_uuid: tableRow.temp_row_uuid },
              );

              if (
                moduleType === MODULE_TYPES.TASK &&
                currentField?.read_only &&
                current_row &&
                JSON.stringify(current_row[key]) !== JSON.stringify(tableRow[key]) &&
                !PROPERTY_PICKER_ARRAY.includes(currentField?.field_type)
              ) {
                modified_readonly_field_uuid.push(key);
              }

              if (key !== '_id' && (isVisibility ? key !== 'temp_row_uuid' : true)) jsUtils.unset(tableRow, [key]);
            }
        } else if (tableRow._id) {
          if (tableRow[key] === null) jsUtils.unset(tableRow, [key]);
          isEmptyRow = false;
          if (tableRow[key] === EMPTY_STRING) tableRow[key] = null;
          if (fieldType && PROPERTY_PICKER_ARRAY.includes(fieldType) && tableRow[key] === null) {
            jsUtils.unset(tableRow, [key]);
          } else if (key !== '_id' && (key === 'temp_row_uuid' ? !isVisibility : (currentField?.read_only))) {
            jsUtils.unset(tableRow, [key]);
          }
        } else if (key !== '_id' && (key === 'temp_row_uuid' ? !isVisibility : (currentField?.read_only))) {
          checkAllFieldsAreEditable = false;
          jsUtils.unset(tableRow, [key]);
        }
        if (key === 'temp_row_uuid' &&
          (
            isVisibility ||
            [TABLE_ACTION_TYPE.ADD_ROW, TABLE_ACTION_TYPE.DELETE_ROW].includes(tableRowUpdateAction)
          )
        ) isEmptyRow = false;
      });
      if (
        [TABLE_ACTION_TYPE.ADD_ROW, TABLE_ACTION_TYPE.DELETE_ROW].includes(tableRowUpdateAction) &&
        !isEmptyRow
      ) {
        return tableRow;
      }

      // if all the field inside the table is disbaled and has no id , then return {};
      if (
        !checkAllFieldsAreEditable &&
        isEmptyRow
      ) return tableRow;
      return isEmptyRow ? [] : tableRow;
    },
  );
  return { fieldPostData: [{ [eachFieldList.table_uuid]: fieldPostData }], all_visible_documents: all_visible_documents };
};

const getFormPostData = (
  sections = [],
  state_data = {},
  isVisibility = false,
  tableRowUpdateAction = EMPTY_STRING,
  module_type = EMPTY_STRING,
) => {
  let formVisibility = null;
  let form_metadata = {};
  let formUploadData = {};
  let server_form_data = {};
  if (module_type === MODULE_TYPES.TASK) {
    form_metadata = jsUtils.get(state_data, ['active_task_details', 'form_metadata'], {});
    formUploadData = state_data.formUploadData || {};
    server_form_data = jsUtils.get(state_data, ['temporaryFormUploadData'], {});
  } else if (module_type === MODULE_TYPES.DATA_LIST) {
    form_metadata = jsUtils.get(state_data, ['form_metadata'], {});
    formUploadData = state_data.form_data || {};
  }

  if (form_metadata?.fields) {
    formVisibility = form_metadata.fields.form_visibility;
  }
  const table_uuid = [];
  const modified_readonly_field_uuid = [];
  let all_visible_documents = [];
  const formPostData = sections.flatMap((section) => {
    let fieldListPostData = null;
    fieldListPostData = section.field_list.flatMap((eachFieldList) => {
      let fieldPostData = [];
      if (eachFieldList.field_list_type === FIELD_LIST_TYPE.TABLE) {
        table_uuid.push(eachFieldList.table_uuid);
        const tableTaskContent = getTableFieldsTaskContentData(
          state_data,
          isVisibility,
          formVisibility,
          eachFieldList,
          fieldPostData,
          formatData,
          tableRowUpdateAction,
          module_type,
          modified_readonly_field_uuid,
        );
        fieldPostData = tableTaskContent.fieldPostData || [];
        if (!isEmpty(tableTaskContent.all_visible_documents)) {
          all_visible_documents = [
            ...(tableTaskContent.all_visible_documents),
            ...all_visible_documents,
          ];
        }
      } else if (eachFieldList.fields) {
        fieldPostData = eachFieldList.fields
          .flatMap((field) => {
            let dependentField;
            let action_dependet_field;
            const has_property_field = jsUtils.get(field, ['data_list', 'has_property_field'], false) || jsUtils.get(field, ['has_property_field'], false);
            // Helps to remove the value of hidden field.
            if (formVisibility && !formVisibility.visible_fields[field.field_uuid]) {
              // Helps to remove the hidden document from post data.
              if (field.field_type === FIELD_TYPES.FILE_UPLOAD) {
                const value = jsUtils.get(formUploadData, [field.field_uuid]);
                if (state_data?.document_details?.file_metadata) {
                  const file_metadata = cloneDeep(get(state_data, ['document_details', 'file_metadata'], []));
                  const updated_file_metadata = cloneDeep(file_metadata);
                  file_metadata.forEach((file_info) => {
                    if (!isNullishCoalesce(value)) {
                      value.forEach(
                        (eachFile) => {
                          if (eachFile?.file_uuid === file_info.file_ref_id) {
                            const remove_file_index = jsUtils.findIndex(updated_file_metadata, { file_ref_id: file_info.file_ref_id });
                            (remove_file_index > -1) && updated_file_metadata.splice(remove_file_index, 1);
                          }
                        },
                      );
                    }
                  });
                  state_data.document_details.file_metadata = cloneDeep(updated_file_metadata);
                }
              }
              return [];
            }

            if (isVisibility) {
              dependentField = jsUtils.includes(
                jsUtils.get(form_metadata, [
                  'fields',
                  'dependent_fields',
                ]),
                field.field_uuid,
              );
              action_dependet_field = jsUtils.includes(
                jsUtils.get(form_metadata, [
                  'actions',
                  'dependent_field',
                ]),
                field.field_uuid,
              );
            }

            if (
              !field.read_only &&
              ((isVisibility) ? (dependentField || action_dependet_field || has_property_field) : true)
            ) {
              const formatedData = formatData(
                jsUtils.get(formUploadData, [field.field_uuid], []),
                field.field_type,
                (field.field_type === FIELD_TYPE.FILE_UPLOAD),
                state_data,
                isVisibility,
              );
              if (isBoolean(formatedData) || isFiniteNumber(formatedData) || !jsUtils.isEmpty(formatedData)) {
                if (getFieldType(field) === FIELD_TYPE.FILE_UPLOAD) {
                  all_visible_documents = [...(formatedData || []), ...all_visible_documents];
                }
                return {
                  [field.field_uuid]: formatedData,
                };
              }

              return {
                [field.field_uuid]: null,
              };
            } else if (
              module_type === MODULE_TYPES.TASK && // works for both flow and task
              field.read_only &&
              (JSON.stringify(formUploadData[field.field_uuid]) !== JSON.stringify(server_form_data[field.field_uuid])) &&
              !PROPERTY_PICKER_ARRAY.includes(field.field_type)
            ) {
              modified_readonly_field_uuid.push(field.field_uuid);
            }
            return [];
          });
      }
      if (jsUtils.isEmpty(fieldPostData) && eachFieldList.field_list_type === FIELD_LIST_TYPE.TABLE) {
        jsUtils.get(formUploadData, [eachFieldList.table_uuid], []).flatMap((tableRow, tableRowIndex) => {
          Object.keys(tableRow).forEach((key) => {
            const fields = eachFieldList?.fields;
            const currentField = !isEmpty(fields)
              ? fields.find((field) => field.field_uuid === key)
              : -1;
            if (!isEmpty(currentField) && ![null, EMPTY_STRING].includes(tableRow[key])) {
              const fieldType = currentField?.field_type;
              const { visible_disable_fields = {}, visible_fields = {} } = formVisibility;

              const isDisabled = get(visible_disable_fields, [eachFieldList.table_uuid, tableRowIndex, key], false);
              const isVisibile = currentField?.is_visible;
              const isFieldShowWhenRule = currentField?.is_field_show_when_rule;

              const isFieldValidatable = !isFieldShowWhenRule || ((isVisibile && visible_fields[key]) || (!isVisibile && !isDisabled));

              if (fieldType === FIELD_TYPE.FILE_UPLOAD) {
                if (state_data?.document_details?.file_metadata) {
                  const file_metadata = cloneDeep(state_data.document_details.file_metadata);
                  state_data.document_details.file_metadata.forEach((file_info, fileIndex) => {
                    if (!jsUtils.isUndefined(tableRow[key]) && !jsUtils.isNull(tableRow[key])) {
                      tableRow[key].forEach((eachFile) => {
                        if (eachFile && eachFile.file_uuid === file_info.file_ref_id && !isFieldValidatable) {
                          file_metadata.splice(fileIndex, 1);
                        }
                      });
                    }
                  });
                  state_data.document_details.file_metadata = jsUtils.cloneDeep(file_metadata);
                }
              }
            }
          });
          return [];
        });
        jsUtils.unset(fieldPostData, [eachFieldList.table_uuid]);
      } else return fieldPostData;
      return [];
    });
    return fieldListPostData;
  });
  return { formPostData, table_uuid, modified_readonly_field_uuid: jsUtils.uniq(modified_readonly_field_uuid || []), all_visible_documents: all_visible_documents };
};

export const getEditableFormSubmissionData = (
  sections,
  statedata,
  isVisibility,
  finalSubmission,
  isCancelClicked = false,
  tableRowUpdateAction = EMPTY_STRING,
  dataListEntryId = null,
  moduleType = EMPTY_STRING,
) => {
  const state_data = cloneDeep(statedata);

  const isNotCancelAction = (moduleType === MODULE_TYPES.TASK) ? !isCancelClicked : true;
  const finalPostData = {};
  const finalPostPreviewData = {};
  const { formPostData, table_uuid, modified_readonly_field_uuid, all_visible_documents } = getFormPostData(
    sections,
    state_data,
    isVisibility,
    tableRowUpdateAction,
    moduleType,
  );
  if (!isEmpty(state_data.document_details) && isNotCancelAction) {
    const { document_details = {}, removed_doc_list = [] } = state_data;
    finalPostPreviewData.document_details = {
      entity: document_details.entity,
      entity_id: document_details.entity_id,
      ref_uuid: document_details.ref_uuid,
    };

    if (moduleType === MODULE_TYPES.DATA_LIST) {
      if (dataListEntryId) {
        finalPostPreviewData._id = dataListEntryId;
      } else {
        finalPostPreviewData._id = document_details.entity_id;
      }
    }

    if (document_details.file_metadata) {
      finalPostPreviewData.document_details.uploaded_doc_metadata = [];
      document_details.file_metadata.forEach((file_info) => {
        if (removed_doc_list) {
          if (
            !removed_doc_list.includes(file_info._id) &&
            (all_visible_documents || []).includes(file_info._id) &&
            (moduleType === MODULE_TYPES.TASK ?
              file_info.type !== ENTITY.TASK_REFERENCE_DOCUMENTS :
              true
            )
          ) {
            finalPostPreviewData.document_details.uploaded_doc_metadata.push({
              upload_signed_url: getFileUrl(file_info?.upload_signed_url),
              type: file_info.type,
              document_id: file_info._id,
            });
          }
        } else if ((all_visible_documents || []).includes(file_info._id)) {
          finalPostPreviewData.document_details.uploaded_doc_metadata.push({
            upload_signed_url: getFileUrl(file_info?.upload_signed_url),
            type: file_info.type,
            document_id: file_info._id,
          });
        }
      });
      if (isEmpty(finalPostPreviewData.document_details.uploaded_doc_metadata)) {
        delete finalPostPreviewData.document_details.uploaded_doc_metadata;
        delete finalPostPreviewData.document_details.entity;
        delete finalPostPreviewData.document_details.entity_id;
        delete finalPostPreviewData.document_details.ref_uuid;
      }
    }
  }
  if (isNotCancelAction) {
    formPostData.forEach((fields) => {
      if (!jsUtils.isEmpty(fields)) {
        const keys = Object.keys(fields);
        const key = Array.isArray(keys) ? keys[0] : keys;
        const active_form_content = get(state_data, ['active_task_details', 'active_form_content'], {});
        if (finalSubmission) {
          if (formFieldEmptyCheckObjSensitive(fields[key])) finalPostPreviewData[key] = fields[key];
        } else if (
          formFieldEmptyCheck(fields[key]) ||
          (table_uuid.includes(key) && isEmpty(fields[key])) ||
          isEmpty(fields[key])
        ) finalPostPreviewData[key] = fields[key];
        if (
          (
            !isFiniteNumber(fields[key]) &&
            !Array.isArray(fields[key]) &&
            (
              (active_form_content[key] && !isBoolean(active_form_content[key])) ||
              (isVisibility && !isBoolean(fields[key]))
            ) &&
            isEmpty(fields[key])
          )
        ) finalPostPreviewData[key] = null;
      }
    });
  }
  finalPostData.data = cloneDeep(finalPostPreviewData);
  if (!isEmpty(modified_readonly_field_uuid)) finalPostData.modified_readOnly_fields = modified_readonly_field_uuid;
  return finalPostData;
};

export const getCurrencyFromAllowedCurrencyTypes = (field, defaultCurrencyType) => {
  if (jsUtils.get(field, ['validations', 'allowed_currency_types'], []).includes(defaultCurrencyType)) return defaultCurrencyType;
  else return jsUtils.get(field, ['validations', 'allowed_currency_types', 0], null);
};

export const getCurrencyFromAllowedCurrencyTypesNew = (field, defaultCurrencyType) => {
  if (isEmpty(field.validations)) return defaultCurrencyType;
  if (jsUtils.get(field, ['validations', 'allowedCurrencyTypes'], []).includes(defaultCurrencyType)) return defaultCurrencyType;
  else return jsUtils.get(field, ['validations', 'allowedCurrencyTypes', 0], null);
};

export const getDirectFieldUuidData = (
  field,
  activeFormContent,
  fieldValue,
  environment_specific_default_currency,
  documentUrlDetails,
  getDataListPickerFieldFromActiveForm,
) => {
  switch (field.field_type) {
    case FIELD_TYPE.DATA_LIST:
      return {
        [field.field_uuid]: getDataListPickerFieldFromActiveForm(
          jsUtils.get(activeFormContent, [field.field_uuid], null),
        ),
      };
    case FIELD_TYPE.USER_TEAM_PICKER:
      if (isObject(activeFormContent?.[field.field_uuid])) {
        return {
          [field.field_uuid]: { users: get(activeFormContent, [field.field_uuid, 'users'], []) || [] },
        };
      } else {
        return {
          [field.field_uuid]: {
            users: [],
          },
        };
      }
    case FIELD_TYPE.CURRENCY:
      if (field.read_only) {
        return {
          [field.field_uuid]: fieldValue,
        };
      }
      let currencyFieldValue = null;
      if (jsUtils.has(activeFormContent, [field.field_uuid, 'value'])) {
        currencyFieldValue = jsUtils.get(activeFormContent, [field.field_uuid, 'value']);
      }
      const currencyObject = {
        value: currencyFieldValue?.toString(),
        currency_type:
          jsUtils.get(activeFormContent, [field.field_uuid, 'currency_type']) ||
          jsUtils.get(field, ['default_value', 'currency_type'], null) ||
          getCurrencyFromAllowedCurrencyTypes(field, environment_specific_default_currency) ||
          environment_specific_default_currency ||
          DEFAULT_CURRENCY_TYPE,
      };
      return {
        [field.field_uuid]: currencyObject,
      };
    case FIELD_TYPE.NUMBER: {
      return {
        [field.field_uuid]: fieldValue?.toString() || null,
      };
    }
    case FIELD_TYPE.CHECKBOX: {
      let value = activeFormContent?.[field.field_uuid] || [];
      if (field.choice_value_type === FIELD_TYPE.DATE && !isEmpty(value)) {
        value = value.map((v) => field.choice_values?.find((c) => c.value.startsWith(v))?.value);
      }
      return {
        [field.field_uuid]: value || [],
      };
    }
    case FIELD_TYPE.DROPDOWN:
    case FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN:
    case FIELD_TYPE.RADIO_GROUP: {
      let value = activeFormContent?.[field.field_uuid];
      if (field?.choice_value_type === FIELD_TYPE.DATE && !isEmpty(value)) {
        const _value = field.choice_values?.find((c) => c.value.startsWith(value))?.value;
        value = _value;
      }
      // if (!field?.choice_values?.find((eachValue) => (eachValue?.value || eachValue) === value)) value = null;
      return {
        [field.field_uuid]: value,
      };
    }
    case FIELD_TYPE.FILE_UPLOAD:
      const documentFieldValue = constructFileUpload(documentUrlDetails, fieldValue, field);
      if (documentFieldValue) {
        return {
          [field.field_uuid]: documentFieldValue,
        };
      }
      break;
    case FIELD_TYPE.INFORMATION:
      return {
        [field.field_uuid]: field.default_value || EMPTY_STRING,
      };
    case FIELD_TYPE.DATA_LIST_PROPERTY_PICKER:
      if (getFieldType(field) === FIELD_TYPE.FILE_UPLOAD) {
        const document = [];
         documentUrlDetails?.forEach?.((eachDocument) => {
          if (fieldValue?.includes?.(eachDocument.document_id)) {
            console.log('eachDocumentcheck', fieldValue, fieldValue.indexOf(eachDocument.document_id));
            document.push(eachDocument);
          }
        });
        const documentFieldValue = [];
        document.forEach((eachDocument) => {
          if (eachDocument?.original_filename) {
            documentFieldValue.push(
              {
                fileName: getFileNameFromServer(eachDocument.original_filename),
                link: eachDocument.signedurl,
                id: eachDocument.document_id,
                file: {
                  name: getFileNameFromServer(eachDocument.original_filename),
                  type: eachDocument.original_filename.content_type,
                  url: eachDocument.signedurl,
                },
                url: eachDocument.signedurl,
                status: FILE_UPLOAD_STATUS.SUCCESS,
                fileId: field.field_uuid,
              },
            );
          }
        });
        console.log('docufieldValue', documentFieldValue, document, fieldValue, documentUrlDetails, fieldValue);
        if (documentFieldValue) {
          return {
            [field.field_uuid]: documentFieldValue,
          };
        }
      } else {
        return {
          [field.field_uuid]: fieldValue,
        };
      }
      break;
    case FIELD_TYPE.USER_PROPERTY_PICKER:
      if (getFieldType(field) === FIELD_TYPE.FILE_UPLOAD) {
        const document = [];
         documentUrlDetails?.forEach?.((eachDocument) => {
          if (fieldValue?.includes(eachDocument.document_id)) {
            console.log('eachDocumentcheck', fieldValue, fieldValue.indexOf(eachDocument.document_id));
            document.push(eachDocument);
          }
        });
        const documentFieldValue = [];
        document.forEach((eachDocument) => {
          if (eachDocument?.original_filename) {
            documentFieldValue.push(
              {
                fileName: getFileNameFromServer(eachDocument.original_filename),
                link: eachDocument.signedurl,
                id: eachDocument.document_id,
                file: {
                  name: getFileNameFromServer(eachDocument.original_filename),
                  type: eachDocument.original_filename.content_type,
                  url: eachDocument.signedurl,
                },
                url: eachDocument.signedurl,
                status: FILE_UPLOAD_STATUS.SUCCESS,
                fileId: field.field_uuid,
              },
            );
          }
        });
        console.log('docufieldValue', documentFieldValue, document, fieldValue, documentUrlDetails, fieldValue);
        if (documentFieldValue) {
          return {
            [field.field_uuid]: documentFieldValue,
          };
        }
      } else {
        return {
          [field.field_uuid]: fieldValue,
        };
      }
      break;
    case FIELD_TYPE.LINK:
      if (isArray(fieldValue) && !(field?.read_only)) {
        return {
          [field.field_uuid]: fieldValue?.map((link) => { return { link_text: link?.link_text || '', link_url: link?.link_url || '', isEditEnabled: (!isEmpty(link?.link_text) && !isEmpty(link?.link_url)) }; }),
        };
      } else return { [field.field_uuid]: fieldValue };
    default:
      return {
        [field.field_uuid]: fieldValue,
      };
  }
};
