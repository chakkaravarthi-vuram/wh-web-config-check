import { translateFunction } from '../../../../../utils/jsUtility';
import { REQ_BODY_KEY_TYPES } from './RowComponents.constants';

export const FIELD_VALUE_TYPE_LABELS = (t = translateFunction) => {
  return {
    USER_DEFINED_FIELDS: t('flows.field_mapping.user_defined_fields'),
    ITERATIVE_FIELDS: t('flows.field_mapping.iterative_fields'),
    DATALIST_ENTRY: t('flows.field_mapping.datalist_entry'),
    USER_ENTRY: t('flows.field_mapping.user_entry'),
    SYSTEM_FIELDS: t('flows.field_mapping.system_fields'),
    STATIC_VALUE: t('flows.field_mapping.static_value'),
  };
};

export const ROW_COMPONENT_STRINGS = () => {
  return {
    RESPONSE_BODY: {
      PLACEHOLDER: 'Choose Field',
      SEARCH_PLACEHOLDER: 'Search Field',
    },
    REQUEST_BODY: {
      IS_MULTIPLE: {
        ID: 'is_multiple',
        LABEL:
          'integration.integration_strings.add_integration.add_event.event_category.request_body_headers.is_multiple_values_allowed',
        OPTIONS: [
          {
            value: true,
            label: '',
          },
        ],
      },
    },
    KEY_TYPE: {
      OPTIONS: (t = () => {}) => [
        {
          label: t(
            'integration.integration_strings.add_integration.add_event.event_category.request_body.options.text',
          ),
          value: REQ_BODY_KEY_TYPES.TEXT,
        },
        {
          label: t(
            'integration.integration_strings.add_integration.add_event.event_category.request_body.options.number',
          ),
          value: REQ_BODY_KEY_TYPES.NUMBER,
        },
        {
          label: t(
            'integration.integration_strings.add_integration.add_event.event_category.request_body.options.boolean',
          ),
          value: REQ_BODY_KEY_TYPES.BOOLEAN,
        },
        {
          label: t(
            'integration.integration_strings.add_integration.add_event.event_category.request_body.options.date_and_time',
          ),
          value: REQ_BODY_KEY_TYPES.DATE_AND_TIME,
        },
        {
          label: t(
            'integration.integration_strings.add_integration.add_event.event_category.request_body.options.object',
          ),
          value: REQ_BODY_KEY_TYPES.OBJECT,
        },
        {
          label: t(
            'integration.integration_strings.add_integration.add_event.event_category.request_body.options.stream',
          ),
          value: REQ_BODY_KEY_TYPES.STREAM,
        },
      ],
    },
    ERROR_MESSAGES: {
      ROW_REQUIRED: 'Atleast one child row is required',
      DUPLICATE_KEY_NAME: 'Duplicate Key/Name found in the same level',
    },
  };
};
