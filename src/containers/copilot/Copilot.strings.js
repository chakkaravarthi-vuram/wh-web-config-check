import React from 'react';
import CopilotIcon from 'assets/icons/copilot/CopilotIcon';
import ClipboardCheckIcon from 'assets/icons/application/ClipboardCheckIcon';
import gClasses from 'scss/Typography.module.scss';
import { translateFunction } from '../../utils/jsUtility';
import { COLOR_CONSTANTS } from '../../utils/UIConstants';

export const COPILOT_STRINGS = (t = translateFunction) => {
  return {
    PLACEHOLDER: t('copilot.placeholder'),
    ID: 'copilot_search',
    INSTRUCTION: {
      TITLE: t('copilot.instruction.title'),
      RESULT_MAY_CHANGE: t('copilot.instruction.result_may_change'),
      COPILOT_LIST: t('copilot.instruction.copilot_list', { returnObjects: true }),
      TASK_LIST: t('copilot.instruction.task_list', { returnObjects: true }),
    },
    RESULTS: {
      TAB: {
        AI_SEARCH: t('copilot.results.tab.ai_search'),
        TASKS: t('copilot.results.tab.tasks'),
      },
      AI_SEARCH_RECOMMEND: t('copilot.results.ai_search_recommend'),
      OPEN_TASKS: t('copilot.results.open_tasks'),
      OPEN_TASKS_NO_DATA_FOUND: t('copilot.results.open_tasks_no_data_found'),
    },
    CHAT: {
      CONFIRM_SOURCE: t('copilot.chat.confirm_source'),
      OTHER_SOURCE: t('copilot.chat.other_source'),
      SOURCE: t('copilot.chat.source'),
      ERRORS: {
        NO_DATA_FOUND: t('copilot.chat.errors.no_data_found'),
        DATA_RETRIEVAL_TIMEOUT: t('copilot.chat.errors.data_retrieval_timeout'),
        DATA_LOADING_ISSUE: t('copilot.chat.errors.data_loading_issue'),
        SUBSCRIPTION_LIMIT_REACHED: {
          TITLE: t('copilot.chat.errors.subscription_limit_reached.title'),
          DESCRIPTION: t('copilot.chat.errors.subscription_limit_reached.description'),
        },
      },
    },
  };
};

export const RESULT_TAB_VALUES = {
  AI_SEARCH: 1,
  TASKS: 2,
};

export const RESULT_TAB_LIST = (t = translateFunction, selectedTab = null) => {
  const { RESULTS: { TAB } } = COPILOT_STRINGS(t);
  return [
    {
      text: TAB.AI_SEARCH,
      avatar: <CopilotIcon fillColor={selectedTab === RESULT_TAB_VALUES.AI_SEARCH && COLOR_CONSTANTS.WHITE} />,
      value: RESULT_TAB_VALUES.AI_SEARCH,
    },
    {
      text: TAB.TASKS,
      avatar: <ClipboardCheckIcon className={gClasses.WH16} fillColor={selectedTab === RESULT_TAB_VALUES.TASKS && COLOR_CONSTANTS.WHITE} />,
      value: RESULT_TAB_VALUES.TASKS,
    },
  ];
};

export const RESULT_TYPE = {
  COPILOT: 'copilot',
  TASK: 'task',
};
