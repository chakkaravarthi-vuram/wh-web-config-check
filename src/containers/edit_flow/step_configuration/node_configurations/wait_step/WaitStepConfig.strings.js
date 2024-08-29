import { STEP_TYPE } from '../../../../../utils/Constants';
import { cloneDeep, translateFunction } from '../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { DEFAULT_STEP_STATUS } from '../../../EditFlow.constants';
import { NODE_CONFIG_TABS } from '../../../node_configuration/NodeConfiguration.constants';
import { DURATION_TYPE_VALUE, TIMER_TYPE } from './WaitStepConfig.constants';

export const WAITSTEP_CONFIG_TAB = (t = translateFunction) => [
  {
    labelText: t('end_step_configuration_strings.end_config_tab.general'),
    value: NODE_CONFIG_TABS.GENERAL,
    tabIndex: NODE_CONFIG_TABS.GENERAL,
  },
  {
    labelText: t(
      'end_step_configuration_strings.end_config_tab.additional_configuration',
    ),
    value: NODE_CONFIG_TABS.ADDITIONAL,
    tabIndex: NODE_CONFIG_TABS.ADDITIONAL,
  },
];

export const SEARCH_DATE_FIELDS = 'wait_step_configuration_strings.search_date_fields';

export const WAIT_STEP_ERRORS = {
  DURATION_MIN_VALUE: 'wait_step_configuration_strings.error_messages.duration_min_value',
  MINUTES_MIN_VALUE: 'wait_step_configuration_strings.error_messages.minutes_min_value',
};

export const TIMER_DURATION_TYPE = {
  DAYS_LABEL: 'wait_step_configuration_strings.general_tab_content.specified_dropdown_options.day',
  HOURS_LABEL: 'wait_step_configuration_strings.general_tab_content.specified_dropdown_options.hour',
  MINUTES_LABEL: 'wait_step_configuration_strings.general_tab_content.specified_dropdown_options.minutes',
};

export const WAITSTEP_RADIO_OPTIONS = (t = translateFunction) => [
  {
    label: t('wait_step_configuration_strings.general_tab_content.radio_group_options.specified'),
    value: TIMER_TYPE.INTERVAL_VALUE,
    id: TIMER_TYPE.INTERVAL,
  },
  {
    label: t(
      'wait_step_configuration_strings.general_tab_content.radio_group_options.atleast',
    ),
    value: TIMER_TYPE.FORM_FIELD_VALUE,
    id: TIMER_TYPE.FORM_FIELD,
  },
];
export const SPECIFIED_DROPDOWN_OPTIONS = (t = translateFunction) => [
  {
    label: t(TIMER_DURATION_TYPE.DAYS_LABEL),
    value: DURATION_TYPE_VALUE.DAY,
    id: DURATION_TYPE_VALUE.DAY,
  },
  {
    label: t(TIMER_DURATION_TYPE.HOURS_LABEL),
    value: DURATION_TYPE_VALUE.HOUR,
    id: DURATION_TYPE_VALUE.HOUR,
  },
  {
    label: t(TIMER_DURATION_TYPE.MINUTES_LABEL),
    value: DURATION_TYPE_VALUE.MINUTE,
    id: DURATION_TYPE_VALUE.MINUTE,
  },
];
export const WAITSTEP_CONFIG_STRINGS = (t = translateFunction) => {
  return {
    MODAL_TITLE: t('wait_step_configuration_strings.modal_title'),
    GENERAL_TAB_CONTENT: {
      TITLE_CONTENT: t(
        'wait_step_configuration_strings.general_tab_content.title_content',
      ),
      RADIO_GROUP_LABEL: t(
        'wait_step_configuration_strings.general_tab_content.radio_group_label',
      ),
      ATLEAST_PLACEHOLDER: t(
        'wait_step_configuration_strings.general_tab_content.atleast_placeholder',
      ),
    },
    ADDITIONAL_TAB_CONTENTS: {
      TITLE: t('wait_step_configuration_strings.additional_tab_contents.title'),
    },
  };
};

export const INITIAL_TIMER_DETAILS = {
  timerType: TIMER_TYPE.INTERVAL_VALUE,
  timerData: {
    duration: EMPTY_STRING,
    durationType: DURATION_TYPE_VALUE.DAY,
  },
};

export const WAIT_CONFIG_INITIAL = {
  errorList: {},
  selectedDateField: EMPTY_STRING,
  timerDetails: { ...cloneDeep(INITIAL_TIMER_DETAILS) },
};

export const WAIT_STEP_INITIAL_STATE = {
  isErrorInLoadingNodeDetails: false,
  isLoadingNodeDetails: true,
  flowId: null,
  stepUuid: null,
  _id: null,
  stepType: STEP_TYPE.WAIT_STEP,
  stepStatus: DEFAULT_STEP_STATUS,
  stepOrder: null,
  coordinateInfo: {
    stepCoordinates: {
      x: 0,
      y: 0,
    },
  },
  reportFieldsList: [],
  dateFieldsList: [],
  ...WAIT_CONFIG_INITIAL,
};
