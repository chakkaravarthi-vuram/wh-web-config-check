import AssignedToOthersTaskIcon from 'assets/icons/task/AssignedToOthersTaskIcon';
import DraftTaskIcon from 'assets/icons/task/DraftTaskIcon';
import React from 'react';
import { translate } from 'language/config';
import { translateFunction } from 'utils/jsUtility';
import CompletedTaskIcon from '../../assets/icons/task/CompletedTaskIcon';
import OpenTaskIcon from '../../assets/icons/task/OpenTaskIcon';
import { store } from '../../Store';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';
import SnoozedTaskMenuIcon from '../../assets/icons/task/SnoozedTaskMenuIcon';

export const { LANDING_PAGE } =
  store.getState().LocalizationReducer.languageSettings.strings;
let Count = store.getState().TaskReducer.count;

export const TASK_TAB_INDEX = {
  OPEN: 1,
  COMPLETED: 2,
  ASSIGNED_TO_OTHERS: 3,
  SELF_TASK: 4,
  DRAFT_TASK: 5,
  SNOOZED_TASK: 6,
};

export const FLOW_TAB_INDEX = {
  PUBLISHED_FLOW: 1,
  DRAFT_FLOW: 2,
};

export const DATALIST_TAB_INDEX = {
  PUBLISHED_DATA_LIST: 1,
  DRAFT_DATA_LIST: 2,
};

export const TASK_ACCORDION_INDEX = {
  ...TASK_TAB_INDEX,
};

export const ALL_FLOW_TAB_INDEX = {
  FLOW_TAB: 1,
  STARTED_FLOWS_TAB: 2,
  DATALIST_TAB: 3,
};

export const CONTENT_TAB_INDEX = {
  TASK_DETAILS: 1,
  CHAT: 2,
  TASK_SUMMARY: 3,
  TASK_DETAIL: 4,
  RESPONSE_SUMMARY: 5,
  INDIVIDUAL_RESPONSES: 6,
  ACTION_HISTORY: 7,
};

export const TASK_STATUS_TYPES = {
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ACCEPTED: 'accepted',
  ASSIGNED: 'assigned',
};

export const QUICK_LINKS_FLOW = {
  TITLE: translate('landing_page.quick_links_panel.flow_title'),
};

export const USER_IMAGES = [
  { firstName: 'Gokul', lastName: 'Ramesh' },
  { firstName: 'Rajkumar', lastName: 'Jayaprakash' },
  { firstName: 'Asttle', lastName: 'Joseph' },
  { firstName: 'Gokul', lastName: 'Ramesh' },
  { firstName: 'Gokul', lastName: 'Ramesh' },
  { firstName: 'Rajkumar', lastName: 'Jayaprakash' },
  { firstName: 'Asttle', lastName: 'Joseph' },
];

export const TASK_ACTION = {
  TITLE: 'task_content.landing_page.task_action.title',
  LABEL: 'task_content.landing_page.task_action.label',
  STATUS_ACCEPTED: 'accepted',
  STATUS_REJECTED: 'rejected',
  BUTTON: {
    LABEL: {
      REJECT: 'task_content.landing_page.task_action.button.reject',
      ACCEPT: 'task_content.landing_page.task_action.button.accept',
    },
  },
  SUCCESSFULLY_ACCEPTED_TASK: {
    title: translate('task_content.landing_page.task_action.succ_accepted_title'),
    subTitle: translate('task_content.landing_page.task_action.succ_accepted_subtitle'),
    status: FORM_POPOVER_STATUS.SUCCESS,
    isVisible: true,
  },
  SUCCESSFULLY_REJECTED_TASK: {
    title: translate('task_content.landing_page.task_action.succ_rejected_title'),
    subTitle: translate('task_content.landing_page.task_action.succ_rejected_subtitle'),
    status: FORM_POPOVER_STATUS.SUCCESS,
    isVisible: true,
  },
  TASK_STATUS_UPDATE_FAILURE: {
    title: translate('task_content.landing_page.task_action.failed_title'),
    subTitle: translate('task_content.landing_page.task_action.failed_subtitle'),
    status: FORM_POPOVER_STATUS.SERVER_ERROR,
    isVisible: true,
  },
  POST_CANCEL_BUTTON: {
   CANCEL: translate('adhoc_comment_labels.cancel'),
   POST: translate('adhoc_comment_labels.post'),
  },
};

const getMTStrings = () => {
  return {
    TASK_LIST: {
      TITLE: LANDING_PAGE.TASKS,
      SEARCH_BAR: {
        ID: 'list_search_input',
        PLACEHOLDER: LANDING_PAGE.SEARCH_TASK_NAME,
      },
      SORT_PARAMETER: 'assigned_on',
      SORT_PARAMETER_COMPLETED: 'closed_on',
      SORT_PARAMETER_ASSIGNED_TO_OTHERS: 'published_on',
      SORT_PARAMETER_DRAFT: 'last_updated_on',
      SORT_PARAMETER_WEIGHTED: {
        KEY: 'weighted',
        VALUE: 2,
      },
      TASK_DROPDOWN_KEBAB_OPTION: (t = translateFunction, tab_index, isDataLoading, onClickHandler) => [
        {
          label:
            !isDataLoading && tab_index === 2
              ? `${t(LANDING_PAGE.MY_COMPLETED_TASKS)} (${Count})`
              : t(LANDING_PAGE.MY_COMPLETED_TASKS),
          icon: (
            <CompletedTaskIcon
              title={t(LANDING_PAGE.MY_COMPLETED_TASKS)}
              // id={2}
              ariaHidden="true"
              onClick={onClickHandler}
              isSelected={tab_index === 2}
            />
          ),
          value: 2,
          id: 2,
        },
        {
          label:
            !isDataLoading && tab_index === 6
              ? `${t(LANDING_PAGE.SNOOZED_TASKS)} (${Count})`
              : t(LANDING_PAGE.SNOOZED_TASKS),
          icon: (
            <SnoozedTaskMenuIcon
              title={t(LANDING_PAGE.SNOOZED_TASKS)}
              // id={2}
              ariaHidden="true"
              onClick={onClickHandler}
              isSelected={tab_index === 6}
              width={14}
              height={16}
            />
          ),
          value: 6,
          id: 6,
        },
      ],
      SORT_BY_ACTIVE_TASKS: {
        ID: 'list_search_dropdown',
        PLACEHOLDER: LANDING_PAGE.SORT_BY,
        TASK_TYPE_LABEL: 'task_content.landing_page.sort_by_active_tasks.task_type_label',
        ASSIGNED_ON_LABEL: 'task_content.landing_page.sort_by_active_tasks.assigned_on_label',
        LABEL: 'task_content.landing_page.sort_by_active_tasks.label',
        OPTION_LIST: () => ([
          {
            label: 'Assigned On (DESC)',
            value: -1,
          },
          {
            label: 'Assigned On (ASC)',
            value: 1,
          },
          {
            label: 'Task Name (ASC)',
            value: 2,
          },
          {
            label: 'Task Name (DESC)',
            value: 3,
          },
        ]),
        TASK_TYPE: (t = translateFunction) => ([
          // {
          //   label: LANDING_PAGE.TASK_TYPE,
          //   value: -1,
          // },
          {
            label: t(LANDING_PAGE.ASSIGNED_TO_ME),
            value: LANDING_PAGE.ASSIGNED_TO_ME_VALUE,
          },
          {
            label: t(LANDING_PAGE.ASSIGNED_TO_GROUP),
            value: LANDING_PAGE.ASSIGNED_TO_GROUP_VALUE,
          },
        ]),
        ASSIGNED_ON: (t = translateFunction) => ([
          // {
          //   label: LANDING_PAGE.ASSIGNED_ON,
          //   value: -1,
          // },
          {
            label: t(LANDING_PAGE.TODAY),
            value: 0,
          },
          {
            label: t(LANDING_PAGE.LAST_7_DAYS),
            value: -7,
          },
          {
            label: t(LANDING_PAGE.Last_30_Days),
            value: -30,
          },
          {
            label: t(LANDING_PAGE.MORE_THAN_30_DAYS),
            value: +30,
          },
        ]),
      },
      SORT_BY_ASSIGNED_TO_OTHERS: {
        ID: 'list_search_dropdown',
        PLACEHOLDER: LANDING_PAGE.SORT_BY,
        TASK_TYPE_LABEL: 'task_content.landing_page.sort_by_active_tasks.task_type_label',
        ASSIGNED_ON_LABEL: 'task_content.landing_page.sort_by_active_tasks.assigned_on_label',
        LABEL: 'task_content.landing_page.sort_by_active_tasks.label',
        OPTION_LIST: () => ([
          {
            label: 'Assigned On (DESC)',
            value: -1,
          },
          {
            label: 'Assigned On (ASC)',
            value: 1,
          },
          {
            label: 'Task Name (ASC)',
            value: 2,
          },
          {
            label: 'Task Name (DESC)',
            value: 3,
          },
        ]),
        TASK_TYPE: (t = translateFunction) => ([
          // {
          //   label: LANDING_PAGE.TASK_TYPE,
          //   value: -1,
          // },
          {
            label: t(LANDING_PAGE.ASSIGNED_TO_INDIVIDUAL),
            value: LANDING_PAGE.ASSIGNED_TO_INDIVIDUAL_VALUE,
          },
          {
            label: t(LANDING_PAGE.ASSIGNED_TO_GROUP),
            value: LANDING_PAGE.ASSIGNED_TO_GROUP_VALUE,
          },
        ]),
        ASSIGNED_ON: (t = translateFunction) => ([
          // {
          //   label: LANDING_PAGE.ASSIGNED_ON,
          //   value: -1,
          // },
          {
            label: t(LANDING_PAGE.TODAY),
            value: 0,
          },
          {
            label: t(LANDING_PAGE.LAST_7_DAYS),
            value: -7,
          },
          {
            label: t(LANDING_PAGE.Last_30_Days),
            value: -30,
          },
          {
            label: t(LANDING_PAGE.MORE_THAN_30_DAYS),
            value: +30,
          },
        ]),
      },
      SORT_BY_DUE_DATE: {
        ID: 'due_date_filter',
        OPTION_LIST: (t = translateFunction) => ([
          {
            label: t(LANDING_PAGE.OVER_DUE),
            value: -1,
          },
          {
            label: t(LANDING_PAGE.DUE_TODAY),
            value: 5,
          },
          {
            label: t(LANDING_PAGE.DUE_3_DAYS),
            value: 3,
          },
          {
            label: t(LANDING_PAGE.DUE_3_TO_7_DAYS),
            value: 37,
          },
          {
            label: t(LANDING_PAGE.DUE_AFTER_7_DAYS),
            value: 7,
          },
          {
            label: t(LANDING_PAGE.NO_DUE),
            value: -2,
          },
        ]),
        LABLE: 'task_content.landing_page.sort_by_due_date.lable',
      },
      SORT_BY_DEADLINE_WITH_WEIGHTED_SORT: {
        ID: 'list_search_dropdown',
        PLACEHOLDER: LANDING_PAGE.SORT_BY,
        OPTION_LIST: [
          {
            label: LANDING_PAGE.DEADLINE_ASCENDING,
            value: -1,
          },
          {
            label: LANDING_PAGE.DEADLINE_DESCENDING,
            value: 1,
          },
        ],
      },
      SORT_BY_DEADLINE: {
        ID: 'list_search_dropdown',
        PLACEHOLDER: LANDING_PAGE.SORT_BY,
        OPTION_LIST: [
          {
            label: LANDING_PAGE.DEADLINE_DESCENDING,
            value: 1,
          },
          {
            label: LANDING_PAGE.DEADLINE_ASCENDING,
            value: -1,
          },
        ],
      },
      SORT_BY_EDITED: {
        ID: 'list_search_dropdown',
        PLACEHOLDER: LANDING_PAGE.SORT_BY,
        LABEL: translate('task_content.landing_page.sort_by_edited.label'),
        ASSIGNED_ON_LABEL: 'task_content.landing_page.sort_by_edited.assigned_on_label',
        OPTION_LIST: () => ([
          {
            label: 'Saved On (DESC)',
            value: -1,
          },
          {
            label: 'Saved On (ASC)',
            value: 1,
          },
          {
            label: 'Task Name (ASC)',
            value: 2,
          },
          {
            label: 'Task Name (DESC)',
            value: 3,
          },
        ]),
        LAST_UPDATED_ON: (t = translateFunction) => ([
          // {
          //   label: LANDING_PAGE.COMPLETED_ON,
          //   value: -1,
          // },
          {
            label: t(LANDING_PAGE.TODAY),
            value: 0,
          },
          {
            label: t(LANDING_PAGE.LAST_7_DAYS),
            value: -7,
          },
          {
            label: t(LANDING_PAGE.Last_30_Days),
            value: -30,
          },
          {
            label: t(LANDING_PAGE.MORE_THAN_30_DAYS),
            value: +30,
          },
        ]),
      },
      SORT_BY_COMPLETED: {
        ID: 'list_search_dropdown',
        PLACEHOLDER: LANDING_PAGE.SORT_BY,
        LABEL: LANDING_PAGE.SORT_BY,
        ASSIGNED_LABEL: 'task_content.landing_page.sort_by_completed.assigned_label',
        OPTION_LIST: () => ([
          {
            label: 'Completed On (DESC)',
            value: -1,
          },
          {
            label: 'Completed On (ASC)',
            value: 1,
          },
          {
            label: 'Task Name (ASC)',
            value: 2,
          },
          {
            label: 'Task Name (DESC)',
            value: 3,
          },
        ]),
        COMPLETED_ON: (t = translateFunction) => ([
          // {
          //   label: LANDING_PAGE.COMPLETED_ON,
          //   value: -1,
          // },
          {
            label: t(LANDING_PAGE.TODAY),
            value: 0,
          },
          {
            label: t(LANDING_PAGE.LAST_7_DAYS),
            value: -7,
          },
          {
            label: t(LANDING_PAGE.Last_30_Days),
            value: -30,
          },
          {
            label: t(LANDING_PAGE.MORE_THAN_30_DAYS),
            value: +30,
          },
        ]),
      },
      SEARCH_ACCORDION_STRINGS: (t = translateFunction) => ([
        t(LANDING_PAGE.MY_OPEN_TASKS),
        t(LANDING_PAGE.TASK_I_ASSIGNED_TO_OTHERS),
        t(LANDING_PAGE.MY_COMPLETED_TASKS),
        t(LANDING_PAGE.DRAFT_TASKS),
      ]),
      CARD_HEIGHT: 56,
      MAX_NOTIFICATION_COUNT: 99,
      GET_TASK_LIST: 'GET_TASK_LIST',
      INPUT_HANDLER: 'INPUT_HANDLER',
      LOAD_DATA: 'LOAD_DATA',
      REFRESH_TASK_LIST: 'REFRESH_TASK_LIST',
      REFRESH_ICON_TITLE: translate('task_content.landing_page.refresh_icon_title'),
      DEADLINE_HIGH_PRIORITY_VALUE: 2,
      TASK_COMPLETED: translate('task_content.landing_page.task_completed'),
      NO_DUE: translate('task_content.landing_page.no_due'),
      MATCH_FOUND: (matches, loading) => {
        if (loading) return translate('task_content.landing_page.match_found.loading');
        if (!matches) return translate('task_content.landing_page.match_found.no_match');
        if (matches === 1) return translate('task_content.landing_page.match_found.one_match');
        return `${matches} ${translate('task_content.landing_page.match_found.matches_found')}`;
      },
      TASK_TAB: [
        {
          TEXT: LANDING_PAGE.MY_OPEN_TASKS,
          INDEX: 1,
        },
      ],
      TASK_DROPDOWN: (t = translateFunction, tab_index, isDataLoading, onClickHandler) => [
        {
          label:
            !isDataLoading && tab_index === 1
              ? `${t(LANDING_PAGE.MY_OPEN_TASKS)} (${Count})`
              : t(LANDING_PAGE.MY_OPEN_TASKS),
          icon: (
            <OpenTaskIcon
              title={t(LANDING_PAGE.MY_OPEN_TASKS)}
              // id={1}
              onClick={onClickHandler}
              isSelected={tab_index === 1}
              isTaskListing
            />
          ),
          value: 1,
          id: 1,
        },
        {
          label:
            !isDataLoading && tab_index === 3
              ? `${t(LANDING_PAGE.TASK_I_ASSIGNED_TO_OTHERS)} (${Count})`
              : t(LANDING_PAGE.TASK_I_ASSIGNED_TO_OTHERS),
          icon: (
            <AssignedToOthersTaskIcon
              title={t(LANDING_PAGE.TASK_I_ASSIGNED_TO_OTHERS)}
              // id={3}
              onClick={onClickHandler}
              isSelected={tab_index === 3}
            />
          ),
          value: 3,
          id: 3,
        },
        // {
        //   label:
        //     !isDataLoading && tab_index === 4
        //       ? `${LANDING_PAGE.SELF_TASK} (${Count})`
        //       : LANDING_PAGE.SELF_TASK,
        //   icon: <OpenTaskIcon title={LANDING_PAGE.SELF_TASK} />,
        //   value: 4,
        // },
        // {
        //   label:
        //     !isDataLoading && tab_index === 2
        //       ? `${LANDING_PAGE.MY_COMPLETED_TASKS} (${Count})`
        //       : LANDING_PAGE.MY_COMPLETED_TASKS,
        //   icon: (
        //     <CompletedTaskIcon
        //       title={LANDING_PAGE.MY_COMPLETED_TASKS}
        //       id={2}
        //       onClick={onClickHandler}
        //       isSelected={tab_index === 2}
        //     />
        //   ),
        //   value: 2,
        // },
        // {
        //   label:
        //     !isDataLoading && tab_index === 6
        //       ? `${LANDING_PAGE.SNOOZED_TASKS} (${Count})`
        //       : LANDING_PAGE.SNOOZED_TASKS,
        //   icon: (
        //     <SnoozedTaskIcon
        //       title={LANDING_PAGE.SNOOZED_TASKS}
        //       id={2}
        //       onClick={onClickHandler}
        //       isSelected={tab_index === 6}
        //     />
        //   ),
        //   value: 6,
        // },
        {
          label:
            !isDataLoading && tab_index === 5
              ? `${t(LANDING_PAGE.DRAFT_TASKS)} (${Count})`
              : t(LANDING_PAGE.DRAFT_TASKS),
          icon: (
            <DraftTaskIcon
              title={t(LANDING_PAGE.DRAFT_TASKS)}
              // id={5}
              onClick={onClickHandler}
              isSelected={tab_index === 5}
            />
          ),
          value: 5,
          id: 5,
        },
      ],
    },
    SUBMIT_TASK_SUCCESSFUL_UPDATE: {
      title: translate('task_content.landing_page.submit_task_successful_update.title'),
      subTitle: '',
      status: FORM_POPOVER_STATUS.SUCCESS,
      isVisible: true,
    },
    CANCEL_TASK_SUCCESSFUL_UPDATE: {
      title: translate('task_content.landing_page.cancel_task_successful_update.title'),
      subTitle: '',
      status: FORM_POPOVER_STATUS.SUCCESS,
      isVisible: true,
    },
    SAVE_TASK_SUCCESSFUL_UPDATE: {
      title: translate('task_content.landing_page.save_task_successful_update.title'),
      subTitle: '',
      status: FORM_POPOVER_STATUS.SUCCESS,
      isVisible: true,
    },
  };
};

const getFloatingActionMenuStrings = () => {
  return {
    CREATE: { LABEL: LANDING_PAGE.CREATE },
    START_SECTION: {
      START: {
        LABEL: LANDING_PAGE.START,
        PLACEHOLDER: LANDING_PAGE.SEARCH_FLOW,
      },
      NO_FLOWS_FOUND: { LABEL: LANDING_PAGE.NO_FLOWS_FOUND },
    },
  };
};

const getTaskContentStrings = () => {
  return {
    SAVE: { LABEL: LANDING_PAGE.COMPLETE },
    CANCEL: { LABEL: LANDING_PAGE.CANCEL },
    TASK_DETAILS: { LABEL: LANDING_PAGE.TASK_DETAILS },
    TASK_DESCRIPTION: { LABEL: LANDING_PAGE.TASK_DESCRIPTION },
    CLIENT_NAME: { LABEL: LANDING_PAGE.CLIENT_NAME },
    REPORTING_MANAGER: { LABEL: LANDING_PAGE.REPOPRTING_MANAGER },
    DEPARTMENT: { LABEL: LANDING_PAGE.DEPARTMENT },
    START_DATE: { LABEL: LANDING_PAGE.START_DATE },
    TASK_ACTION: {
      LABEL: LANDING_PAGE.TASK_ACTION,
      LABEL_ATTACH_COMMENT: LANDING_PAGE.TASK_ACTION_COMMENTS_AND_ATTACH,
      LABEL_ATTACHMENTS: LANDING_PAGE.ATTACHMENTS,
    },
    TASK_STATUS: { LABEL: LANDING_PAGE.TASK_STATUS },
    COMPLETED: 'task_content.landing_page.completed',
    CANCELLED: 'task_content.landing_page.cancelled',
    SUBMIT_FLOW: LANDING_PAGE.SUBMIT_FLOW,
    SUBMIT_TASK: LANDING_PAGE.SUBMIT_TASK,
    SUMBMIT_TASK_ID: 'submit_Task',
    COMPLETED_ON: 'task_content.landing_page.completed_on',
    NO_DUE: 'task_content.landing_page.no_due',
    OVER_DUE: 'task_content.landing_page.over_due',
    OPEN_TASK: 'task_content.landing_page.open_task',
    TASK_CARD_DESCRIPTION: {
      ASSIGNED_BY: 'task_content.landing_page.task_card_description.assigned_by',
      ASSIGNED_ON: 'task_content.landing_page.task_card_description.assigned_on',
      SELF_TASK: 'task_content.landing_page.task_card_description.self_task',
      ASSIGNED_TO: 'task_content.landing_page.task_card_description.assigned_to',
      LAST_EDITED: 'task_content.landing_page.task_card_description.last_edited',
      ADHOC: 'task_content.landing_page.task_card_description.adhoc',
    },
    TASK_ADD_OR_REMOVE_ASSIGNEE_BUTTON: {
      LABEL: translate('task_content.landing_page.task_add_or_remove_assignee_button.label'),
    },
    TASK_COMMENTS: (t = () => {}) => {
      return {
        LABEL: t(LANDING_PAGE.COMMENTS),
        PLACEHOLDER: t(LANDING_PAGE.COMMENT_PLACEHOLDER),
        ID: 'comments',
        CONTENT: 'task_content.landing_page.task_comments.content',
      };
    },
    SEND_BACK_REVIEW_COMMENTS: {
      LABEL: LANDING_PAGE.COMMENTS,
      PLACEHOLDER: LANDING_PAGE.COMMENT_PLACEHOLDER,
      ID: 'send_back_review_comments',
    },
    FILE_UPLOAD: {
      LABEL: LANDING_PAGE.FILE_UPLOAD,
      ID: 'task_content_file_upload',
    },
    DUE: { LABEL: LANDING_PAGE.DUE },
    TASK_INDIVIDUAL_NO_RESPONSE: {
      title: translate('task_content.landing_page.task_individual_no_response.title'),
      subTitle: translate('task_content.landing_page.task_individual_no_response.subTitle'),
      type: 1,
    },
    TASK_INDIVIDUAL_NO_DATA_FOUND: {
      title: translate('task_content.landing_page.task_individual_no_data_found.title'),
      subTitle: translate('task_content.landing_page.task_individual_no_data_found.subTitle'),
      type: 1,
    },
    TASK_SUMMARY_NO_RESPONSE: {
      title: translate('task_content.landing_page.task_summary_no_response.title'),
      subTitle: translate('task_content.landing_page.task_summary_no_response.subTitle'),
      type: 1,
    },
    TASK_DETAILS_NO_RESPONSE: {
      title: translate('task_content.landing_page.task_details_no_response.title'),
      subTitle: translate('task_content.landing_page.task_details_no_response.subTitle'),
      type: 1,
    },
    TASK_MOVED_TO_COMPLETE: (translate = () => {}) => {
      return {
        title: translate('task_content.landing_page.task_moved_to_complete.title'),
        subTitle: translate('task_content.landing_page.task_moved_to_complete.subTitle'),
        type: 1,
      };
    },
    ACTION_HISTORY_NO_RESPONSE: (t = () => {}) => {
      return {
        title: t('task_content.landing_page.action_history_no_response.title'),
        subTitle: t('task_content.landing_page.action_history_no_response.subTitle'),
        type: 1,
      };
    },
    TASK_NOT_FOUND: (t = () => {}) => {
      return {
        title: t('task_content.landing_page.task_not_found.title'),
        subTitle: t('task_content.landing_page.task_not_found.subTitle'),
        type: 3,
      };
    },
    SNOOZE_TASK_CONFIRM: 'task_content.landing_page.snooze_task_confirm',
    SNOOZE_TASK_DISCARD: 'task_content.landing_page.snooze_task_discard',
    SNOOZE_TASK: {
      DATE_FORMAT: 'YYYY-MM-DD',
      HOUR_MINUTE_FORMAT: '2-digit',
      INVALID_DATE_ERROR: 'task_content.landing_page.snooze_task.invalid_date_error',
      INVALID_DATE_TIME_ERROR: 'task_content.landing_page.snooze_task.invalid_date_time_error',
      FUTURE_DATE_LIMIT_ERROR: 'task_content.landing_page.snooze_task.future_date_limit_error',
      FUTURE_DATE_ERROR: 'task_content.landing_page.snooze_task.future_date_error',
      FUTURE_TIME_ERROR: 'task_content.landing_page.snooze_task.future_time_error',
      FUTURE_TIME_MIN_ERROR: 'task_content.landing_page.snooze_task.future_time_min_error',
    },
    CONFIRM_SEND_BACK_OR_REVIEW: 'task_content.landing_page.confirm_send_back_or_review',
    TASK_MOVED_TO_COMPLETE_BUTTON: 'task_content.landing_page.task_moved_to_complete_button',
    TOTAL_ASSIGNEES: (totalCount) =>
      `${translate('task_content.landing_page.of_the')} ${totalCount} ${translate('task_content.landing_page.participants_responded_text')}`,
    TASK_CONTENT_TAB: (t = () => {}) => [
      {
        TEXT: t(LANDING_PAGE.TASK_DETAILS),
        INDEX: CONTENT_TAB_INDEX.TASK_DETAILS,
      },
      {
        TEXT: t(LANDING_PAGE.ACTION_HISTORY),
        INDEX: CONTENT_TAB_INDEX.ACTION_HISTORY,
      },
      // {
      //   TEXT: LANDING_PAGE.CHAT,
      //   INDEX: CONTENT_TAB_INDEX.CHAT,
      // },
    ],
    SINGLE_TASK_ASSIGNED_TO_OTHERS_CONTENT_TAB: (translate) => [
      {
        TEXT: translate('task_content.landing_page.single_task_assigned_to_others_content_tab.summary_text'),
        INDEX: CONTENT_TAB_INDEX.TASK_SUMMARY,
      },
      {
        TEXT: translate('task_content.landing_page.single_task_assigned_to_others_content_tab.details_text'),
        INDEX: CONTENT_TAB_INDEX.TASK_DETAIL,
      },
      // {
      //   TEXT: LANDING_PAGE.CHAT,
      //   INDEX: CONTENT_TAB_INDEX.CHAT,
      // },
    ],
    MULTIPLE_TASK_ASSIGNED_TO_OTHERS_CONTENT_TAB: (translate = () => {}) => [
      {
        TEXT: translate('task_content.landing_page.multiple_task_assigned_to_others_content_tab.response_text'),
        INDEX: CONTENT_TAB_INDEX.RESPONSE_SUMMARY,
      },
      {
        TEXT: translate('task_content.landing_page.multiple_task_assigned_to_others_content_tab.indv_response_text'),
        INDEX: CONTENT_TAB_INDEX.INDIVIDUAL_RESPONSES,
      },
      {
        TEXT: translate('task_content.landing_page.multiple_task_assigned_to_others_content_tab.details_text'),
        INDEX: CONTENT_TAB_INDEX.TASK_DETAIL,
      },
      // {
      //   TEXT: LANDING_PAGE.CHAT,
      //   INDEX: CONTENT_TAB_INDEX.CHAT,
      // },
    ],
    TASK_ACTION_RADIO: {
      LABEL: translate('task_content.landing_page.task_action_radio.label'),
      OPTION_LIST: [
        {
          label: translate('task_content.landing_page.task_action_radio.option_list.approve_label'),
          value: 1,
        },
        {
          label: translate('task_content.landing_page.task_action_radio.option_list.reject_label'),
          value: 2,
        },
        {
          label: translate('task_content.landing_page.task_action_radio.option_list.cancel_label'),
          value: 3,
        },
      ],
    },
    SHOW_HISTORY: {
      LABEL: translate('task_content.landing_page.show_history.label'),
      // LANDING_PAGE.SHOW_HISTORY
    },
    HISTORY: {
      LABEL: LANDING_PAGE.HISTORY,
      ID: 'task_history',
      ARIA_LABELS: {
        CLOSE: LANDING_PAGE.CLOSE_ACTION_HISTORY,
      },
      EMPTY_ACTION_HISTORY: {
        TITLE: LANDING_PAGE.EMPTY_ACTION_HISTORY.TITLE,
        SUBTITLE: LANDING_PAGE.EMPTY_ACTION_HISTORY.SUBTITLE,
      },
      DEFAULT_PAGE: 1,
      DEFAULT_SIZE: 8,
    },
    CANCEL_TASK: {
      POPUP: {
        TITLE: 'task_content.landing_page.cancel_task.popup.title',
        BUTTON: {
          ID: 'cancel_task',
          LABEL: 'task_content.landing_page.cancel_task.popup.button.label',
        },
        ALTERNATE_TITLE: 'task_content.landing_page.cancel_task.popup.alternate_title',
      },
      FORM: {
        PAGE_TITLE: translate('task_content.landing_page.cancel_task.form.page_title'),
        QUESTION_TEXT:
        translate('task_content.landing_page.cancel_task.form.question_text'),
        MESSAGE: {
          ID: 'cancel_reason',
          LABEL: translate('task_content.landing_page.cancel_task.form.message.label'),
          ERROR_MESSAGAE_LABEL: translate('task_content.landing_page.cancel_task.form.message.error_message_label'),
          PLACEHOLDER: translate('task_content.landing_page.cancel_task.form.message.placeholder'),
        },
        BUTTONS: {
          SEND: {
            ID: 'cancel_task_send',
            LABEL: translate('task_content.landing_page.cancel_task.form.buttons.send.label'),
          },
          DO_NOT_SEND: {
            ID: 'cancel_task_do_not_send',
            LABEL: translate('task_content.landing_page.cancel_task.form.buttons.do_not_send.label'),
          },
          BACK_TO_TASK_PAGE: {
            ID: 'cancel_task_back_to_task_page',
            LABEL: translate('task_content.landing_page.cancel_task.form.buttons.back_to_task_page.label'),
          },
        },
      },
    },
    TASK_INFO: {
      TOTAL_TASKS: 'total_tasks',
      TASKS_LOG_INFO: 'task_log_info',
      TASK_STATUS: 'task_status',
      IS_INITIATION_TASK: 'is_initiation_task',
      IS_ANYONE: 'is_assign_to_individual_assignees',
      ACTIVE_TASK_DETAILS: 'active_task_details',
      ATTACHMENTS: 'attachments',
      IS_MODAL_VISIBLE: 'isModalVisible',
      FORM_METADATA_FIELDS: 'form_metadata.fields',
      ADD_REMOVE_ASSIGNEE_MODAL: 'add_remove_assignee_modal',
      TYPE: 'type',
      ERROR_LIST: 'error_list',
      TASK_ALREADY_ACCEPTED: 'task_content.landing_page.task_info.task_already_accepted',
      REVIEWERS: 'reviewers',
      SEND_BACK_HEADER: 'task_content.landing_page.task_info.send_back_header',
      CHOOSE_USERS_OR_TEAMS: 'task_content.landing_page.task_info.choose_users_or_teams',
      SELECT_USER_OR_TEAM: 'task_content.landing_page.task_info.select_user_or_team',
      FILE_NAME: 'fileName',
      NO_FORM_DETAILS_AVAILABLE: 'task_content.landing_page.task_info.no_form_details_available',
      THIS_TASK_CANCEL: 'task_content.landing_page.task_info.this_task_cancel',
      THIS_TASK_COMPLETE: 'task_content.landing_page.task_info.this_task_complete',
      DESCRIPTION: 'task_content.landing_page.task_info.description',
      TASK: 'task',
      TASK_UUID: 'uuid',
      ASSIGNED_TASK: 'assigned_task',
      TASK_NAME: 'task_name',
      UNABLE_TO_CONNECT_CHAT: 'task_content.landing_page.task_info.unable_to_connect_chat',
      TRY_AFTER_SOME_TIME: 'task_content.landing_page.task_info.try_after_some_time',
      NO_FORM_FIELD_REQUIRED: 'task_content.landing_page.task_info.no_form_field_required',
      FORM_FIELD_LIVE_HERE: 'task_content.landing_page.task_info.form_field_live_here',
      DATA_SUMMARY: {
        TAB_NAME: 'task_content.landing_page.task_info.data_summary.tab_name',
        TITLE: 'task_content.landing_page.task_info.data_summary.title',
        NUDGE: 'task_content.landing_page.task_info.data_summary.nudge',
        DOWNLOAD: 'task_content.landing_page.task_info.data_summary.download',
        NUDGE_ALL: 'task_content.landing_page.task_info.data_summary.nudge_all',
        YES: 'task_content.landing_page.task_info.data_summary.yes',
        NO: 'task_content.landing_page.task_info.data_summary.no',
        NO_TASK_CANCELLED: 'task_content.landing_page.task_info.data_summary.no_task_cancelled',
        TABLE_HEADERS: {
          ASSIGNEE_NAME: 'task_content.landing_page.task_info.data_summary.table_headers.assignee_name',
          IS_RESPONDED: 'task_content.landing_page.task_info.data_summary.table_headers.is_responded',
          RESPONDED_ON: 'task_content.landing_page.task_info.data_summary.table_headers.responded_on',
        },
      },
      YES_OR_NO: 'yesorno',
      YES: 'task_content.landing_page.task_info.yes',
      NO: 'task_content.landing_page.task_info.no',
      NO_RESPONSE_SUMMARY: 'task_content.landing_page.task_info.no_response_summary',
      RESPONSE_SUMMARY_WILL_LIVE_HERE: 'task_content.landing_page.task_info.response_summary_live_here',
      TASK_HISTORY_MODAL: 'task_history_modal',
      LENGTH: 'length',
      TASK_DEFINITION: 'task_definition',
      TASK_META_DATA: 'metadata_info.flow_short_code',
      FLOW_SHORT_CODE: 'flow_short_code',
      METADATA_INFO: 'metadata_info',
      TASK_CATEGORY: 'task_category',
      TEST_TASK: 'task_content.landing_page.task_info.test_task',
      TASK_TYPE: {
        MY_TASKS: 'task_content.landing_page.task_info.task_type.my_tasks',
        MY_COMPLETED_TASKS: 'task_content.landing_page.task_info.task_type.my_completed_tasks',
        ASSIGNED_TO_OTHERS: 'task_content.landing_page.task_info.task_type.assigned_to_others',
        SNOOZED_TASKS: 'task_content.landing_page.task_info.task_type.snoozed_tasks',
      },
    },
    PRECEDING_STEPS_INFO: {
      ID: 'send_back_task_id',
      LABEL: 'task_content.landing_page.preceding_steps_info.label',
      PLACEHOLDER: 'task_content.landing_page.preceding_steps_info.placeholder',
    },
    ADHOC_COMMENT: translate('task_content.landing_page.adhoc_comment'),
    ADHOC_LABLE: translate('task_content.landing_page.adhoc_lable'),
    ADHOC_COMMENT_ID: 'adhoc_comments',
    PARSED_ADHOC_COMMENT_ID: 'parsed_comments',
    ADHOC_COMMENT_ATTACHMENTS: 'postNoteAttachments',
    POST_COMMENT: 'task_content.landing_page.post_comment',
    POST_UPDATE: 'task_content.landing_page.updates',
    UPDATES_LABLE: 'task_content.landing_page.updates_lable',
    NOTES_ID: 'category',
    NOTES_PLACEHOLDER: 'task_content.landing_page.notes_placeholder',
    ATTACHMENTS_ID: 'attachments',
    ATTACHMENTS_LABEL: 'task_content.landing_page.attachments_label',
    ATTACHMENTS_PLACEHOLDER: 'task_content.landing_page.attachments_placeholder',
    UPDATES_PLACEHOLDER: 'task_content.landing_page.updates_placeholder',
    REASSIGN: {
      REASSIGN_TASK_POPUP: 'task_content.landing_page.reassign.reassign_task_popup',
      REASSIGN_TASK_HEADING: 'task_content.landing_page.reassign.reassign_task_heading',
      OPTION_LIST: (t) => [
        {
          value: true,
          label: t('task_content.landing_page.reassign.option_list.true_label'),
        },
        {
          value: false,
          label: t('task_content.landing_page.reassign.option_list.false_label'),
        },
      ],
      CANCEL_BUTTON: 'flow_dashboard.tasks_strings.discard',
      REASSIGN_BUTTON: 'flow_dashboard.tasks_strings.reassign',
    },
    TASK_ACTION_CONFIRMATION: {
      TITLE: translate('task_content.landing_page.task_action_confirmation.title'),
      DONT_CANCEL: translate('task_content.landing_page.task_action_confirmation.dont_cancel'),
      TASK_ACTION: translate('task_content.landing_page.task_action_confirmation.task_action'),
      CANCEL: translate('task_content.landing_page.task_action_confirmation.cancel'),
    },
  };
};

export const CREATE_BUTTONS = {
  CREATE_FLOW_BUTTON_LABEL: translate('task_content.landing_page.create_flow_button_label'),
  CREATE_DATALIST_BUTTON_LABEL: translate('task_content.landing_page.create_datalist_button_label'),
};

const getFlowTab = () => [
  {
    TEXT: LANDING_PAGE.ALL_FLOW,
    INDEX: 1,
  },
  // {
  //   TEXT: LANDING_PAGE.PRCEDURES_I_STARTED,
  //   INDEX: 2,
  // },
  {
    TEXT: LANDING_PAGE.DATA_LIST,
    INDEX: 3,
  },
];

const getAllFlowStrings = () => {
  return {
    WELCOME_MESSAGE: {
      LABEL_1: LANDING_PAGE.HI,
      LABEL_2: LANDING_PAGE.WELCOME_NOTE,
    },
    SEARCH_BAR: {
      PLACEHOLDER_FLOW: LANDING_PAGE.SEARCH_FLOW,
      PLACEHOLDER_DATALIST: LANDING_PAGE.SEARCH_DATALIST,
    },
    DATA_COUNT_PER_CALL: 12,
    FLOW_CARD_HEIGHT: '100px',
    FLOW_CARD_WIDTH: '100px',
  };
};

export const TIME_LABEL = {
  COMPLETED: translate('task_content.time_label.completed'),
  CANCELLED: translate('task_content.time_label.cancelled'),
  YET_TO_ACCEPT: translate('task_content.time_label.yet_to_accept'),
  IN_PROGRESS: translate('task_content.time_label.in_progress'),
  CLOSED: translate('task_content.time_label.closed'),
};

export const M_T_STRINGS = getMTStrings();

export const TASK_CONTENT_STRINGS = getTaskContentStrings();

export const FLOW_TAB = getFlowTab();

export const ALL_FLOWS_STRINGS = getAllFlowStrings();

export const FLOATING_ACTION_MENU_STRINGS = getFloatingActionMenuStrings();

store.subscribe(() => {
  // LANDING_PAGE =
  //   store.getState().LocalizationReducer.languageSettings.strings.LANDING_PAGE;
  Count = store.getState().TaskReducer.count;
  // M_T_STRINGS = getMTStrings();
  // TASK_CONTENT_STRINGS = getTaskContentStrings();
  // FLOW_TAB = getFlowTab();
  // ALL_FLOWS_STRINGS = getAllFlowStrings();
  // FLOATING_ACTION_MENU_STRINGS = getFloatingActionMenuStrings();
});
export default LANDING_PAGE;

export const ARIA_LABELS = {
  LOAD_MORE_TASKS: translate('task_content.landing_page.aria_labels.load_more_tasks'),
  LOAD_MORE_FLOWS: translate('task_content.landing_page.aria_labels.load_more_flows'),
  LOAD_MORE_DATALISTS: translate('task_content.landing_page.aria_labels.load_more_datalists'),
  LOADING_TASK: translate('task_content.landing_page.aria_labels.loading_task'),
};

export const USER_PANEL_CONSTANTS = {
  COMPLETED: translate('landing_page.user_panel.completed'),
  PENDING: translate('landing_page.user_panel.pending'),
  OVERDUE: translate('landing_page.user_panel.overdue'),
  VIEW_PROFILE: translate('landing_page.user_panel.view_profile'),
};

export const TASK_VALIDATION_STRINGS = (t = translateFunction) => {
return {
COUNTRY_CODE: t('task_validation_strings.country_code'),
IS_REQUIRED: t('task_validation_strings.is_required'),
MUST_BE_ATLEAST: t('task_validation_strings.must_be_atleast'),
DIGITS_LONG: t('task_validation_strings.digits_long'),
MUST_BE_LESS_THAN: t('task_validation_strings.must_be_less_than'),
DIGITS: t('task_validation_strings.digits'),
};
};

export const SYSTEM_NAME = 'landing_page.user_panel.system';
