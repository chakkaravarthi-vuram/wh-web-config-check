import { FIELD_TYPES, FORM_STRINGS } from 'components/form_builder/FormBuilder.strings';
import { TABLE_FIELD_LIST_TYPE } from 'utils/ValidationConstants';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { REQ_BODY_KEY_TYPES } from '../../../../../integration/Integration.utils';

export const CREATE_FIELDS_ALLOWED_FOR_RESPONSE_MAPPING = [
  FIELD_TYPES.SINGLE_LINE,
  FIELD_TYPES.PARAGRAPH,
  FIELD_TYPES.NUMBER,
  FIELD_TYPES.YES_NO,
  FIELD_TYPES.DATE,
  FIELD_TYPES.DATETIME,
  FIELD_TYPES.EMAIL,
  FIELD_TYPES.SCANNER,
  TABLE_FIELD_LIST_TYPE,
];
export const REQUEST_CONFIGURATION_STRINGS = {
    ADD_EVENT: {
        ID: 'add_event_modal',
        TITLE: 'Add Event & Request Body',
        EVENT_HEADER: 'Event',
        ADD_KEY: 'Add Key',
        ADD_MORE_KEY: 'Add More Keys to Object',
        EVENT_CATEGORY: {
          ID: 'category',
          PLACEHOLDER: 'Add Category',
          NEW_CATEGORY_LABEL: 'New Category',
        },
        EVENT_NAME: {
          ID: 'name',
          LABEL: 'Name',
          PLACEHOLDER: 'Enter event name',
        },
        EVENT_SEARCH: {
          ID: 'event_search',
          PLACEHOLDER: 'Search events...',
        },
        EVENT_METHOD: {
          ID: 'method',
          LABEL: 'Type',
          PLACEHOLDER: 'Choose Method',
          TYPES: {
            GET: 'GET',
            POST: 'POST',
            PUT: 'PUT',
            PATCH: 'PATCH',
            DELETE: 'DELETE',
          },
          OPTIONS: [
            {
              label: 'Get',
              value: 'GET',
            },
            {
              label: 'Post',
              value: 'POST',
            },
            {
              label: 'Put',
              value: 'PUT',
            },
            {
              label: 'Patch',
              value: 'PATCH',
            },
            {
              label: 'Delete',
              value: 'DELETE',
            },
          ],
        },
        END_POINT: {
          ID: 'end_point',
          LABEL: 'End Point',
          PLACEHOLDER: 'Enter End Point',
        },
        QUERY_PARAMS: {
          TITLE: 'Query Parameters',
          SUB_TITLE: 'Map the inputs needs to be passed to of system.',
          ID: 'event_query_params',
          IS_REQUIRED: {
            ID: 'is_required',
            OPTIONS: [
              {
                value: 1,
                label: '',
              },
            ],
          },
        },
        API_HEADERS_VALUE: ['Key', 'Is Required', ''],
        EVENTS_TABLE_HEADERS: ['Name', 'Method', 'End Point', ''],
        REQUEST_BODY: {
          TITLE: 'Request Body',
          KEY_INPUT: {
            ID: 'key',
            LABEL: 'Key',
          },
          KEY_TYPE: {
            ID: 'type',
            LABEL: 'Type',
            OPTIONS: [
              {
                label: 'Text',
                value: 'text',
              },
              {
                label: 'Number',
                value: 'number',
              },
              {
                label: 'Boolean',
                value: 'boolean',
              },
              {
                label: 'Object',
                value: 'object',
              },
              {
                label: 'Date & Time',
                value: 'datetime',
              },
            ],
          },
          FIELD_VALUE: {
            ID: 'field_value',
            PLACEHOLDER: 'Choose field',
          },
          FIELD_TYPE: {
            ID: 'field_type',
            PLACEHOLDER: 'Choose field type',
          },
          IS_MULTIPLE: {
            ID: 'is_multiple',
            LABEL: 'Is Multiple Values Allowed',
            OPTIONS: [
              {
                value: 1,
                label: '',
              },
            ],
          },
          IS_REQUIRED: {
            ID: 'is_required',
            LABEL: 'Is Required',
            OPTIONS: [
              {
                value: 1,
                label: '',
              },
            ],
          },
          ADD_MORE_CHILD: {
            ID: 'add_more_child',
          },
          DELETE: {
            ID: 'delete',
          },
          VALUE: {
            ID: 'value',
          },
          TEST: {
            ID: 'test_value',
            ADD_FILE: 'add_test_file',
            DELETE_FILE: 'delete_test_file',
            RETRY_UPLOAD: 'retry_upload_file',
          },
        },
        SAVE_RESPONSE: {
          ID: 'field_value',
          PLACEHOLDER: 'integration.integration_constants.save_response_config.new_field_placeholder',
          NEW_FIELD_LABEL: 'integration.integration_constants.save_response_config.new_field_label',
          NO_DATA: 'integration.integration_constants.save_response_config.no_fields',
          CHILD_ROW_FIELD_TYPES: [
            {
              label: FIELD_TYPES.SINGLE_LINE,
              value: FIELD_TYPES.SINGLE_LINE,
            },
            {
              label: FIELD_TYPES.EMAIL,
              value: FIELD_TYPES.EMAIL,
            },
            {
              label: FIELD_TYPES.SCANNER,
              value: FIELD_TYPES.SCANNER,
            },
            {
              label: FIELD_TYPES.DATETIME,
              value: FIELD_TYPES.DATETIME,
            },
            {
              label: FIELD_TYPES.DATE,
              value: FIELD_TYPES.DATE,
            },
            {
              label: FIELD_TYPES.YES_NO,
              value: FIELD_TYPES.YES_NO,
            },
            {
              label: FIELD_TYPES.NUMBER,
              value: FIELD_TYPES.NUMBER,
            },
            {
              label: FIELD_TYPES.PARAGRAPH,
              value: FIELD_TYPES.PARAGRAPH,
            },
            {
              label: FIELD_TYPES.DROPDOWN,
              value: FIELD_TYPES.DROPDOWN,
            },
            {
              label: FIELD_TYPES.RADIO_GROUP,
              value: FIELD_TYPES.RADIO_GROUP,
            },
            {
              label: FIELD_TYPES.CHECKBOX,
              value: FIELD_TYPES.CHECKBOX,
            },
          ],
          TEST: {
            ID: 'test_value',
          },
          PARENT_ROW_FIELD_TYPES: (t) => [
            {
              label: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_ST),
              value: FIELD_TYPES.SINGLE_LINE,
            },
            {
              label: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_EF),
              value: FIELD_TYPES.EMAIL,
            },
            {
              label: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_SCANNER),
              value: FIELD_TYPES.SCANNER,
            },
            {
              label: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_DATE_AND_TIME),
              value: FIELD_TYPES.DATETIME,
            },
            {
              label: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_DATE),
              value: FIELD_TYPES.DATE,
            },
            {
              label: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_YN),
              value: FIELD_TYPES.YES_NO,
            },
            {
              label: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_NF),
              value: FIELD_TYPES.NUMBER,
            },
            {
              label: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_LT),
              value: FIELD_TYPES.PARAGRAPH,
            },
            {
              label: t(FORM_STRINGS.FILE_UPLOAD),
              value: FIELD_TYPES.FILE_UPLOAD,
            },
            {
              label: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_TABLE),
              value: TABLE_FIELD_LIST_TYPE,
            },
          ],
          PARENT_ROW_NON_CREATE_FIELD_TYPES: [
            {
              label: FIELD_TYPES.DROPDOWN,
              value: FIELD_TYPES.DROPDOWN,
            },
            {
              label: FIELD_TYPES.RADIO_GROUP,
              value: FIELD_TYPES.RADIO_GROUP,
            },
            {
              label: FIELD_TYPES.CHECKBOX,
              value: FIELD_TYPES.CHECKBOX,
            },
          ],
          TITLE: 'Request Body',
          KEY_INPUT: {
            ID: 'response_key',
            LABEL: 'Key',
            PLACEHOLDER: 'Choose Response Key',
            SEARCH_FIELDS: 'Search Fields',
          },
          KEY_TYPE: {
            ID: 'response_type',
            LABEL: 'Type',
            OPTIONS: [
              {
                label: 'Text',
                value: 'text',
              },
              {
                label: 'Number',
                value: 'number',
              },
              {
                label: 'Boolean',
                value: 'boolean',
              },
              {
                label: 'Object',
                value: 'object',
              },
              {
                label: 'Date & Time',
                value: 'datetime',
              },
              {
                label: 'Stream',
                value: REQ_BODY_KEY_TYPES.STREAM,
              },
            ],
          },
          FIELD_VALUE: {
            ID: 'field_value',
            PLACEHOLDER: 'integration.integration_constants.save_response_config.choose_field',
          },
          FIELD_TYPE: {
            ID: 'field_type',
            PLACEHOLDER: 'integration.integration_constants.save_response_config.choose_field_type',
          },
          IS_MULTIPLE: {
            ID: 'is_multiple',
            LABEL: 'Is Multiple Values Allowed',
            OPTIONS: [
              {
                value: 1,
                label: '',
              },
            ],
          },
          IS_REQUIRED: {
            ID: 'is_required',
            LABEL: 'Is Required',
            OPTIONS: [
              {
                value: 1,
                label: '',
              },
            ],
          },
          ADD_MORE_CHILD: {
            ID: 'add_more_child',
          },
          DELETE: {
            ID: 'delete',
          },
          VALUE: {
            ID: 'value',
          },
          NEW_CATEGORY_LABEL: 'integration.integration_constants.new_field_strings.new_category_label',
          SEARCH_PLACHOLDER: 'integration.integration_constants.new_field_strings.search_placeholder',
          CREATE_NEW_LABEL: 'integration.integration_constants.new_field_strings.create_new_label',
          EDIT_FIELD_LABEL: 'integration.integration_constants.new_field_strings.edit_field_label',
          INPUT_PLACEHOLDER: 'integration.integration_constants.new_field_strings.input_placeholder',
          CANCEL_BTN: 'integration.integration_constants.new_field_strings.cancel_btn',
          CREATE_BTN: 'integration.integration_constants.new_field_strings.create_btn',
          UPDATE_BTN: 'integration.integration_constants.new_field_strings.update_btn',
        },
        REQUEST_ALLOWED_FIELD_TYPES: [FIELD_TYPES.SINGLE_LINE, FIELD_TYPES.PARAGRAPH, FIELD_TYPES.NUMBER,
          FIELD_TYPES.YES_NO, FIELD_TYPES.DATE, FIELD_TYPES.DATETIME,
          FIELD_TYPES.RADIO_GROUP, FIELD_TYPES.CHECKBOX, FIELD_TYPES.DROPDOWN,
          FIELD_TYPES.EMAIL, FIELD_TYPES.SCANNER, FIELD_TYPES.FILE_UPLOAD, FIELD_TYPES.TABLE],
        SAVE_RESPONSE_ALLOWED_FIELD_TYPES: [FIELD_TYPES.SINGLE_LINE, FIELD_TYPES.PARAGRAPH, FIELD_TYPES.NUMBER,
        FIELD_TYPES.YES_NO, FIELD_TYPES.DATE, FIELD_TYPES.DATETIME, FIELD_TYPES.EMAIL, FIELD_TYPES.SCANNER, FIELD_TYPES.DROPDOWN,
      FIELD_TYPES.CHECKBOX, FIELD_TYPES.RADIO_GROUP, FIELD_TYPES.FILE_UPLOAD, FIELD_TYPES.TABLE],
      ERROR_MESSAGES: {
        CHILD_REQUIRED: 'integration.integration_constants.request_configuration.child_required_error',
      },
    },
};

export const saveResonseInitialData = {
  response_key: EMPTY_STRING,
  response_type: EMPTY_STRING,
  // field_value: {},
  // field_type: EMPTY_STRING,
  is_deleted: false,
  new_field: false,
  field_type: EMPTY_STRING,
};

export const initialRowData = {
  key: EMPTY_STRING,
  type: EMPTY_STRING,
  is_required: false,
  value: EMPTY_STRING,
};
