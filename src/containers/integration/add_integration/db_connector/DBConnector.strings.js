export const DB_CONNECTION_AUTHTICATION_STRINGS = (t) => {
  return {
    TITLE: t('integration.external_db_connector.authentication.title'),
    CONNECTOR_NAME: {
      ID: 'db_connector_name',
      LABEL: t(
        'integration.external_db_connector.authentication.connector_name_label',
      ),
    },
    EXTERNAL_DB_TYPE: {
      ID: 'db_type',
      LABEL: t(
        'integration.external_db_connector.authentication.external_db_type_label',
      ),
    },
    DATABASE_HOST_NAME: {
      ID: 'host',
      LABEL: t(
        'integration.external_db_connector.authentication.database_host_name_label',
      ),
    },
    PORT: {
      ID: 'port',
      LABEL: t('integration.external_db_connector.authentication.port_label'),
    },
    USERNAME: {
      ID: 'username',
      LABEL: t(
        'integration.external_db_connector.authentication.username_label',
      ),
    },
    PASSWORD: {
      ID: 'password',
      LABEL: t(
        'integration.external_db_connector.authentication.password_label',
      ),
    },
    DATABASE_NAME: {
      ID: 'db_name',
      LABEL: t(
        'integration.external_db_connector.authentication.database_name_label',
      ),
    },
    SERVICE_NAME: {
      ID: 'service_name',
      LABEL: t(
        'integration.external_db_connector.authentication.service_name_label',
      ),
    },
    BUTTON: {
      TEST_AND_SAVE: t(
        'integration.external_db_connector.authentication.button.test_and_save',
      ),
      TEST_AGAIN: t(
        'integration.external_db_connector.authentication.button.test_again',
      ),
    },
  };
};

export const TEST_SUCCESS_STRINGS = (t) => {
  return {
    TITLE: t('integration.external_db_connector.test_success.title'),
    AUTH_DESCRIPTION: t(
      'integration.external_db_connector.test_success.auth_description',
    ),
    QUERY_DESCRIPTION: t(
      'integration.external_db_connector.test_success.query_description',
    ),
  };
};

export const DB_CONNECTION_QUERIES_STRINGS = (t) => {
  return {
    QUERY_CONFIG: {
      TITLE: t('integration.external_db_connector.queries.query_config.title'),
      QUERY_NAME: {
        ID: 'db_query_name',
        LABEL: t(
          'integration.external_db_connector.queries.query_config.query_name_label',
        ),
      },
      QUERY_SOURCE: {
        ID: 'data_source_type',
        LABEL: t(
          'integration.external_db_connector.queries.query_config.query_source_label',
        ),
      },
      SOURCE_NAME: {
        ID: 'table_name',
        LABEL: t(
          'integration.external_db_connector.queries.query_config.source_name_label',
        ),
      },
      QUERY_ACTION: {
        ID: 'query_action',
        LABEL: t(
          'integration.external_db_connector.queries.query_config.query_action_label',
        ),
      },
      FIELD_TO_FETCH_TITLE: t(
        'integration.external_db_connector.queries.query_config.field_to_fetch_title',
      ),
      FILTER_DATA_BY_TITLE: t(
        'integration.external_db_connector.queries.query_config.filter_data_by_title',
      ),
      FIELD_NAME: {
        ID: 'field_name',
        LABEL: t(
          'integration.external_db_connector.queries.query_config.field_name',
        ),
      },
      FIELD_TYPE: {
        ID: 'field_type',
        LABEL: t(
          'integration.external_db_connector.queries.query_config.field_type',
        ),
      },
      TYPE_CAST: {
        ID: 'type_cast',
        LABEL: t(
          'integration.external_db_connector.queries.query_config.type_cast',
        ),
      },
      DISPLAY_NAME: {
        ID: 'display_name',
        LABEL: t(
          'integration.external_db_connector.queries.query_config.display_name',
        ),
      },
      OPERATOR: {
        ID: 'operator',
        LABEL: t(
          'integration.external_db_connector.queries.query_config.operator',
        ),
      },
      VALUES: {
        ID: 'values',
        LABEL: t(
          'integration.external_db_connector.queries.query_config.values',
        ),
      },
      DELETE: {
        ID: 'delete',
      },
      ADD_MORE_FIELD: {
        ID: 'add_more_child',
        LABEL: t(
          'integration.external_db_connector.queries.query_config.add_more_fields',
        ),
      },
      ADD_MORE_FILTER: {
        ID: 'add_more_child',
        LABEL: t(
          'integration.external_db_connector.queries.query_config.add_more_filter',
        ),
        OBJECT_LABEL: 'Add More Filter Object',
      },
      SORT_PARAMETERS: {
        TITLE: t(
          'integration.external_db_connector.queries.query_config.sort_parameters.title',
        ),
        SORT_DATA_BY: {
          ID: 'sort_data_by',
          LABEL: t(
            'integration.external_db_connector.queries.query_config.sort_parameters.sort_data_by_label',
          ),
        },
        SORT_TYPE: {
          ID: 'order_type',
          LABEL: t(
            'integration.external_db_connector.queries.query_config.sort_parameters.sort_type_label',
          ),
        },
        SKIP: {
          ID: 'skip_data',
          LABEL: t(
            'integration.external_db_connector.queries.query_config.sort_parameters.skip_label',
          ),
        },
        LIMIT: {
          ID: 'limit_data',
          LABEL: t(
            'integration.external_db_connector.queries.query_config.sort_parameters.limit_label',
          ),
        },
      },
      BUTTON: {
        FETCH_COLUMN_NAMES: {
          LABEL: t(
            'integration.external_db_connector.queries.query_config.button.fetch_column_names.label',
          ),
          LABEL2: t(
            'integration.external_db_connector.queries.query_config.button.fetch_column_names.label2',
          ),
          INSTRUCTION: t(
            'integration.external_db_connector.queries.query_config.button.fetch_column_names.instruction',
          ),
        },
        TEST_QUERY: {
          LABEL: t(
            'integration.external_db_connector.queries.query_config.button.test_query.label',
          ),
          LABEL2: t(
            'integration.external_db_connector.queries.query_config.button.test_query.label2',
          ),
        },
        SAVE_QUERY: t(
          'integration.external_db_connector.queries.query_config.button.save_query',
        ),
        NEXT: t(
          'integration.external_db_connector.queries.query_config.button.next',
        ),
        BACK: t(
          'integration.external_db_connector.queries.query_config.button.back',
        ),
        CANCEL: t(
          'integration.external_db_connector.queries.query_config.button.cancel',
        ),
      },
      ERROR_MESSAGE: {
        VALUE_DATE_FORMAT: t('integration.external_db_connector.queries.query_config.error_message.value_date_format'),
      },
    },
    NO_QUERY_FOUND: {
      TITLE: t(
        'integration.external_db_connector.queries.no_query_found.title',
      ),
      DESCRIPTION: t(
        'integration.external_db_connector.queries.no_query_found.description',
      ),
      ERROR_VALUE: t(
        'integration.external_db_connector.queries.no_query_found.error_value',
      ),
    },
    ADD_QUERY: t('integration.external_db_connector.queries.add_query'),
    QUERY_LIST: {
      ID: 'query_listing',
    },
    DELETE: {
      ID: 'delete_query_model',
      TITLE: t('integration.external_db_connector.queries.delete.title'),
      CONFIRM: t('integration.external_db_connector.queries.delete.confirm'),
      CANCEL: t('integration.external_db_connector.queries.delete.cancel'),
    },
  };
};

export const QUERY_LIST_HEADER_SETINGS = (t) => {
  return {
    NAME: t('integration.external_db_connector.queries.list_header.name'),
    QUERY_ACTION: t(
      'integration.external_db_connector.queries.list_header.query_action',
    ),
    LAST_UPDATED_BY: t(
      'integration.external_db_connector.queries.list_header.last_updated_by',
    ),
    LAST_UPDATED_ON: t(
      'integration.external_db_connector.queries.list_header.last_updated_on',
    ),
  };
};

export const DB_CONNECTOR_INCORRECT_MESSAGE = (t) => {
  return {
    PORT_OR_HOST_NAME: t('integration.external_db_connector.incorrect_message.port_or_host_name'),
    USERNAME_OR_PASSWORD: t('integration.external_db_connector.incorrect_message.username_or_password'),
    DATABASE: t('integration.external_db_connector.incorrect_message.database'),
    SOMETHING_WENT_WRONG: t('integration.external_db_connector.incorrect_message.something_went_wrong'),
  };
};
