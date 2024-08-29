import { translate } from 'language/config';
import { translateFunction } from '../../../../utils/jsUtility';

export const FIELD = {
   METRICS: {
       LABEL: 'Metrics',
       ID: 'metrics',
       PLACEHOLDER: translate('publish_settings.dashboard_settings.metrics.choose_metrics'),
   },
   ALTERNATE_LABEL: {
       LABEL: 'Label',
       ID: 'alternate_label',
       PLACEHOLDER: translate('publish_settings.dashboard_settings.metrics.enter_label'),
   },
};

export const METRICS = {
    HEADER: translate('publish_settings.dashboard_settings.metrics.header'),
    TITLE: 'Add Data',
    SUBTITLE: translate('publish_settings.dashboard_settings.metrics.title'),
    BUTTON_ADD: 'ADD',
    SEARCH_FIELD: 'Search field',
    CHOOSE_FIELD: 'Choose field',
    ID: 'defaultReportField',
    EDIT_DASHBOARD_DATA_LABEL: 'publish_settings.dashboard_settings.metrics.edit_dashboard_data',
    DELETE_DASHBOARD_DATA_LABEL: 'publish_settings.dashboard_settings.metrics.delete_dashboard_data',
  };

export const ERROR_MESSAGES = {
    LABEL_DUPLICATE: 'The label has already been entered.',
    METRICS_DUPLICATE: 'The field has already been chosen.',
    LABEL_EMPTY: 'The label should not be empty.',
    METRICS_EMPTY: 'The metrics should not be empty.',
    MAX_LIMIT: 'You cannot choose more than ten',
};

export const FIELD_KEY_DATA_METRICS = [
    {
      l_value: 'field_uuid',
      validate_with: 'field_uuid',
      error_message: ERROR_MESSAGES.METRICS_DUPLICATE,
    },
    {
      l_value: 'label',
      validate_with: 'label',
      error_message: ERROR_MESSAGES.LABEL_DUPLICATE,
    },
  ];
export const DEFAULT_REPORT_FIELD_ACTION = {
  ADD: translate('publish_settings.dashboard_settings.metrics.buttons.add'),
  DELETE: 'DELETE',
  DISCARD: translate('publish_settings.dashboard_settings.metrics.buttons.discard'),
  SAVE: translate('publish_settings.dashboard_settings.metrics.buttons.save'),
  EDIT: 'EDIT',
  CANCEL: translate('publish_settings.dashboard_settings.metrics.buttons.cancel'),
};

export const ADD_METRIC_MAX_LIMIT_MESSAGE = 'Metrics should not exceed the maxiumum limit of 10';

export const TRIGGER_NAMES_ERROR = (t = translateFunction) => {
  return {
ALREADY_EXIST: t('error_popover_status.name_already_exist'),
  };
};
