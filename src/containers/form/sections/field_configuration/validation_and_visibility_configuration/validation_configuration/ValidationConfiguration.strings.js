import i18next from 'i18next';
import { FIELD_TYPES } from '../../FieldConfiguration.strings';
import { DATE_FIELDS_OPERATOR_VALUES } from './date_field_validation_configuration/DateFieldValidationConfiguration.utils';
import { RESPONSE_VALIDATION_KEYS } from '../../../../../../utils/constants/form/form.constant';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';

export const VALIDATION_CONFIG_STRINGS = (t) => {
    return {
          MINIMUM_CHARCTERS: {
            LABEL: t('form_field_strings.validation_config.minimum_characters.label'),
            ID: 'minimumCharacters',
            PLACEHOLDER: t('form_field_strings.validation_config.minimum_characters.placeholder'),
          },
          MAXIMUM_CHARCTERS: {
            LABEL: t('form_field_strings.validation_config.maximum_characters.label'),
            ID: 'maximumCharacters',
            PLACEHOLDER: t('form_field_strings.validation_config.maximum_characters.placeholder'),
          },
          ALLOW_SPECIAL_CHARACTERS: {
            OPTION_LIST: [{
              label: t('form_field_strings.validation_config.allowed_special_characters.label'),
              value: 1,
            }],
            PLACEHOLDER: t('form_field_strings.validation_config.allowed_special_characters.placeholder'),
            ID: 'allowedSpecialCharacters',
          },
          SHOW_ELLIPSIS: {
            OPTION_LIST: [{ label: t('form_field_strings.validation_config.show_ellipsis.label'), value: 1 }],
            ID: 'isEllipseTrue',
          },
          ELLIPSIS_LENGTH: {
            ID: 'maxEllipseChar',
            PLACEHOLDER: t('form_field_strings.validation_config.show_ellipsis.placeholder'),
          },
          ALLOWED_MINIMUM: {
            LABEL: t('form_field_strings.validation_config.allowed_minimum.label'),
            ID: 'allowedMinimum',
            PLACEHOLDER: t('form_field_strings.validation_config.allowed_minimum.placeholder'),
          },
          ALLOWED_MAXIMUM: {
            LABEL: t('form_field_strings.validation_config.allowed_maximum.label'),
            ID: 'allowedMaximum',
            PLACEHOLDER: t('form_field_strings.validation_config.allowed_maximum.placeholder'),
          },
          DONT_ALLOW_ZERO: {
            OPTION_LIST: [{ label: t('form_field_strings.validation_config.allow_zero.label'), value: 1 }],
            ID: 'dontAllowZero',
          },
          ALLOW_DECIMAL: {
            OPTION_LIST: [{ label: t('form_field_strings.validation_config.allow_decimal.label'), value: 1 }],
            ID: 'allowDecimal',
          },
          ALLOWED_DECIMAL_POINTS: {
            LABEL: t('form_field_strings.validation_config.allowed_decimal_points.label'),
            ID: 'allowedDecimalPoints',
            PLACEHOLDER: t('form_field_strings.validation_config.allowed_decimal_points.placeholder'),
          },
          ALLOW_MULTIPLE_UPLOADS: {
            OPTION_LIST: [{ label: t('form_field_strings.validation_config.allow_miltiple_files.option_list.label'), value: 1 }],
            ID: 'allowMultiple',
          },
          ALLOWED_MINIMUM_FILE_COUNT: {
            LABEL: t('form_field_strings.validation_config.minimum_file_count.label'),
            ID: 'minimumCount',
            PLACEHOLDER: t('form_field_strings.validation_config.minimum_file_count.placeholder'),
          },
          ALLOWED_MAXIMUM_FILE_COUNT: {
            LABEL: t('form_field_strings.validation_config.maximum_file_count.label'),
            ID: 'maximumCount',
            PLACEHOLDER: t('form_field_strings.validation_config.maximum_file_count.placeholder'),
          },
          ALLOWED_FILE_EXTENSIONS: {
            LABEL: t('form_field_strings.validation_config.allowed_file_extension.label'),
            ID: 'allowedExtensions',
            PLACEHOLDER: t('form_field_strings.validation_config.allowed_file_extension.placeholder'),
          },
          MAX_FILE_SIZE: {
            LABEL: t('form_field_strings.validation_config.maximum_file_size.label'),
            ID: 'maximumFileSize',
            PLACEHOLDER: t('form_field_strings.validation_config.maximum_file_size.placeholder'),
            SUFFIX: t('form_field_strings.validation_config.maximum_file_size.suffix'),
            SYSTEM_MAX_ERROR: t('form_field_strings.validation_config.maximum_file_size.system_max_size_error'),
          },
          ALLOW_MULTIPLE_LINKS: {
            OPTION_LIST: [{ label: t('form_field_strings.validation_config.allow_multiple_link.new_label'), value: 1 }],
            ID: 'allowMultiple',
          },
          ALLOWED_MINIMUM_LINK_COUNT: {
            LABEL: t('form_field_strings.validation_config.minimum_count.label'),
            ID: 'minimumCount',
            PLACEHOLDER: t('form_field_strings.validation_config.minimum_count.placeholder'),
          },
          ALLOWED_MAXIMUM_LINK_COUNT: {
            LABEL: t('form_field_strings.validation_config.maximum_count.label'),
            ID: 'maximumCount',
            PLACEHOLDER: t('form_field_strings.validation_config.maximum_count.placeholder'),
          },
          DATE_FIELD_VALIDATION_OPTIONS: {
            MAIN_OPTIONS: [
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.no_limitations'),
                value: 'no_limit',
              },
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.allow_future_date'),
                value: 'future',
              },
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.allow_past_date'),
                value: 'past',
              },
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.allow_fixed_date_range'),
                value: 'date',
              },
            ],
            FIELD_BASED_OPTIONS: [
              {
                label: t('form_field_strings.validation_config.date_validation.allow_date_fields.label'),
                value: 'form_field',
              },
            ],
            DATE_FIELDS_OPERATORS: {
              LABEL: t('form_field_strings.validation_config.date_validation.date_field_operators.field_label'),
              FIELD_LABEL: t('form_field_strings.validation_config.date_validation.date_validation_operator.label'),
              SINGLE_FIELDS_OPTION_LIST: [
                { label: '>', value: DATE_FIELDS_OPERATOR_VALUES.GREATER_THAN },
                { label: '<', value: DATE_FIELDS_OPERATOR_VALUES.LESS_THAN },
                { label: '>=', value: DATE_FIELDS_OPERATOR_VALUES.GREATER_THAN_OR_EQUAL_TO },
                { label: '<=', value: DATE_FIELDS_OPERATOR_VALUES.LESS_THAN_OR_EQUAL_TO },
              ],
              DUAL_FIELDS_OPTION_LIST: [
                {
                  label: t('form_field_strings.validation_config.date_validation.date_field_operators.label'),
                  value: DATE_FIELDS_OPERATOR_VALUES.BETWEEN,
                },
              ],
              ID: 'operator',
              PLACEHOLDER: t('form_field_strings.validation_config.date_validation.date_field_operators.placeholder'),
              DATE_FIELDS_OPERAND_1: {
                ID: 'firstFieldUuid',
                PLACEHOLDER: t('form_field_strings.validation_config.date_validation.date_field_operand_1.placeholder'),
                LABEL_1: t('form_field_strings.validation_config.date_validation.date_field_operand_1.label_1'),
                LABEL_2: t('form_field_strings.validation_config.date_validation.date_field_operand_1.label_2'),
              },
              DATE_FIELDS_OPERAND_2: {
                ID: 'secondFieldUuid',
                PLACEHOLDER: t('form_field_strings.validation_config.date_validation.date_field_operand_2.placeholder'),
                LABEL: t('form_field_strings.validation_config.date_validation.date_field_operand_2.label'),
              },
            },
            OTHER_OPTIONS_ID: 'other_options',
            OTHER_OPTIONS_VALUES: [
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.allow_working_days'),
                value: 'allowWorkingDay',
                description: 'Working days: Mon, Tue, Wed, Thu, Fri',
              },
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.allow_non_working_days'),
                value: 'allowNonWorkingDay',
                description: 'Non-working days: Sat, Sun',
              },
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.custom_working_days'),
                value: 'allowedDay',
              },
            ],
            OTHER_OPTIONS: (workingdays = EMPTY_STRING, nonWorkingDays = EMPTY_STRING) => [
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.allow_working_days'),
                value: 'allowWorkingDay',
                description: `Working days: ${workingdays}`,
              },
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.allow_non_working_days'),
                value: 'allowNonWorkingDay',
                description: `Non-working days: ${nonWorkingDays}`,
              },
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.custom_working_days'),
                value: 'allowedDay',
              },
            ],
            ALLOW_FUTURE_DATE_OPTIONS: [
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.allow_only_future_date'),
                value: 'all_future',
              },
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.allow_today_and_future_date'),
                value: 'all_future_today',
              },
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.within_next_days'),
                value: 'next',
              },
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.after_next_days'),
                value: 'after',
              },
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.from_next_to_days'),
                value: 'between',
              },
            ],

            FUTURE_NEXT_DAY: 'futureNextDay',
            FUTURE_AFTER_DAY: 'futureAfterDay',
            FUTURE_BETWEEN_START_DAY: 'futureBetweenStartDay',
            FUTURE_BETWEEN_END_DAY: 'futureBetweenEndDay',

            ALLOW_PAST_DATE_OPTIONS: [
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.allow_only_past_date'),
                value: 'all_past',
              },
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.allow_past_date_including_today'),
                value: 'all_past_today',
              },
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.within_last_days'),
                value: 'last',
              },
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.before_last_days'),
                value: 'before',
              },
              {
                label: t('form_field_strings.validation_config.updated_date_validation_config.from_last_to_days'),
                value: 'between',
              },
            ],

            PAST_LAST_DAY: 'pastLastDay',
            PAST_BEFORE_DAY: 'pastBeforeDay',
            PAST_BETWEEN_START_DAY: 'pastBetweenStartDay',
            PAST_BETWEEN_END_DAY: 'pastBetweenEndDay',

            TO: t('form_field_strings.validation_config.updated_date_validation_config.to'),
            DAYS: t('form_field_strings.validation_config.updated_date_validation_config.days'),
            FROM_PLACEHOLDER: t('form_field_strings.validation_config.updated_date_validation_config.from_placeholder'),
            TO_PLACEHOLDER: t('form_field_strings.validation_config.updated_date_validation_config.to_placeholder'),
            START_DATE: {
              label: t('form_field_strings.validation_config.updated_date_validation_config.start_date'),
              value: 'startDate',
            },
            END_DATE: {
              label: t('form_field_strings.validation_config.updated_date_validation_config.end_date'),
              value: 'endDate',
            },
            BETWEEN: 'between',
            CUSTOM_WORKING_DAYS: {
              label: t('form_field_strings.validation_config.updated_date_validation_config.custom_working_days'),
              value: 'custom_working_days_dropdown',
            },
            OTHER_PREFERENCES: t('form_field_strings.validation_config.updated_date_validation_config.other_preferences'),
            CUSTOM_WORKING_DAYS_OPTIONS: [
              {
                label: t('form_field_strings.validation_config.date_validation.working_days.day_strings.sunday'),
                value: 7,
              },
              {
                label: t('form_field_strings.validation_config.date_validation.working_days.day_strings.monday'),
                value: 1,
              },
              {
                label: t('form_field_strings.validation_config.date_validation.working_days.day_strings.tuesday'),
                value: 2,
              },
              {
                label: t('form_field_strings.validation_config.date_validation.working_days.day_strings.wednesday'),
                value: 3,
              },
              {
                label: t('form_field_strings.validation_config.date_validation.working_days.day_strings.thursday'),
                value: 4,
              },
              {
                label: t('form_field_strings.validation_config.date_validation.working_days.day_strings.friday'),
                value: 5,
              },
              {
                label: t('form_field_strings.validation_config.date_validation.working_days.day_strings.saturday'),
                value: 6,
              },
            ],
          },
          ALLOWED_CURRENCY_TYPES: {
            LABEL: t('form_field_strings.validation_config.allowed_currency_types.label'),
            ID: 'allowedCurrencyTypes',
            PLACEHOLDER: t('form_field_strings.validation_config.allowed_currency_types.placeholder'),
          },
          ALLOW_MULTIPLE_DATA_LIST: {
            LABEL: t('form_field_strings.validation_config.allow_multiple_datalist.label'),
            ID: 'allowMultiple',
            OPTION_LIST: [
              {
                label: t('form_field_strings.validation_config.allow_multiple_datalist.option_list.label'),
                value: 1,
                id: 'allow_multiple_value_selection',
              },
            ],
          },
          LIMIT_DATALIST: {
            ID: 'isFilter',
            OPTION_LIST: [
              {
                label: t('form_field_strings.validation_config.limit_datalist.label'),
                value: 1,
              },
            ],
            IS_DATALIST_FILTER: 'isDatalistFilter',
            FILTER_FIELDS: {
              ID: 'filterFIelds',
              FIELD: {
                ID: 'fieldUuid',
                LABEL: t('form_field_strings.validation_config.limit_datalist.filter_fields.label'),
                NO_FIELDS_AVAILABLE: t('form_field_strings.validation_config.limit_datalist.filter_fields.no_fields_available'),
                ALLOWED_FIELD_TYPES: {
                  inputFields: [
                    FIELD_TYPES.NUMBER,
                    FIELD_TYPES.DATE,
                    FIELD_TYPES.DATETIME,
                  ],
                  selectionFields: [
                    FIELD_TYPES.YES_NO,
                    FIELD_TYPES.CHECKBOX,
                    FIELD_TYPES.DROPDOWN,
                    FIELD_TYPES.RADIO_GROUP,
                    FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
                  ],
                },
              },
              FIELD_TYPE: {
                id: 'fieldType',
                LABEL: 'FIELD_TYPE',
              },
              OPERATORS: {
                id: 'operator',
                LABEL: t('form_field_strings.validation_config.limit_datalist.filter_fields.operator_label'),
                NO_OPERATORS_AVAILABLE: t('form_field_strings.validation_config.limit_datalist.filter_fields.no_operator'),
                OPTION_LIST: [
                  {
                    label: '>',
                    value: 'greater_than',
                  },
                  {
                    label: '<',
                    value: 'lesser_than',
                  },
                  {
                    label: '>=',
                    value: 'greater_than_or_equal_to',
                  },
                  {
                    label: '<=',
                    value: 'lesser_than_or_equal_to',
                  },
                  {
                    label: '=',
                    value: 'equal_to',
                  },
                ],
              },
              FIELD_VALUE: {
                ID: 'field_value',
                LABEL: t('form_field_strings.validation_config.limit_datalist.filter_fields.field_value_label'),
                NO_VALUES_FOUND: t('form_field_strings.validation_config.limit_datalist.filter_fields.no_values_found'),
                OPTION_LIST: [
                  {
                    value: 'direct',
                    label: 'Static values',
                  },
                  {
                    value: 'field',
                    label: 'Value from field',
                  },
              ],
              },
            },
            CHANGE_DATA: 'changeData',
          },
          MIN_USER_SELECTION: {
            LABEL: t('form_field_strings.validation_config.minimim_user_selection.label'),
            PLACEHOLDER: t('form_field_strings.validation_config.minimim_user_selection.placeholder'),
            ID: 'minimumSelection',
          },
          MAX_USER_SELECTION: {
            LABEL: t('form_field_strings.validation_config.max_user_selection.label'),
            PLACEHOLDER: t('form_field_strings.validation_config.max_user_selection.placeholder'),
            ID: 'maximumSelection',
          },
          MIN_DATALIST_SELECTION: {
            LABEL: t('form_field_strings.validation_config.minimim_datalist_selection.label'),
            PLACEHOLDER: t('form_field_strings.validation_config.minimim_datalist_selection.placeholder'),
            ID: 'minimumSelection',
          },
          MAX_DATALIST_SELECTION: {
            LABEL: t('form_field_strings.validation_config.maximum_datalist_selection.label'),
            PLACEHOLDER: t('form_field_strings.validation_config.maximum_datalist_selection.placeholder'),
            ID: 'maximumSelection',
          },
          IS_RESTRICTED: {
            OPTION_LIST: [{ label: t('form_field_strings.validation_config.is_restricted.label'), value: 1 }],
            ID: 'isRestricted',
          },
          RESTRICTED_USER_TEAM: {
            PLACEHOLDER: t('form_field_strings.validation_config.restricted_user_team.placeholder'),
            ID: 'restrictedUserTeam',
            NO_SEARCH_RESULTS: t('teams.no_search_team_data.subtitle'),
          },
    };
};

// const TABLE_VALIDATION_TYPE = {
//   MIN_ROW_VALIDATION: 'is_minimum_row',
//   MAX_ROW_VALIDATION: 'is_maximum_row',
//   UNIQUE_COLUMN: 'is_unique_column_available',
//   ALLOW_ADDING_NEW_ROW: 'add_new_row',
//   ALLOW_EDITING_EXISTING_ROW: 'allow_modify_existing',
//   ALLOW_DELETING_EXISTING_ROW: 'allow_delete_existing',
// }

export const TABLE_VALIDATION_CONFIG_STRING = (translate = i18next.t) => {
  const {
    ADD_NEW_ROW,
    ALLOW_MODIFY_EXISTING,
    ALLOW_DELETE_EXISTING,
    IS_MINIMUM_ROW,
    IS_MAXIMUM_ROW,
    IS_UNIQUE_COLUMN_AVAILABLE,
 } = RESPONSE_VALIDATION_KEYS[FIELD_TYPES.TABLE];

  return {
  MIN_ROW_VALIDATION: {
      id: IS_MINIMUM_ROW,
      label: translate('form_field_strings.field_list_config.validation_config.min_row_validation.label'),
      value: IS_MINIMUM_ROW,
  },
  MAX_ROW_VALIDATION: {
      id: IS_MAXIMUM_ROW,
      label: translate('form_field_strings.field_list_config.validation_config.max_row_validation.label'),
      value: IS_MAXIMUM_ROW,
  },
  UNIQUE_COLUMN: {
      id: IS_UNIQUE_COLUMN_AVAILABLE,
      label: translate('form_field_strings.field_list_config.validation_config.unique_column.label_1'),
      value: IS_UNIQUE_COLUMN_AVAILABLE,
  },
  ALLOW_ADDING_NEW_ROW: {
    id: ADD_NEW_ROW,
    label: translate('form_field_strings.field_list_config.validation_config.adding_new_row.label'),
    value: ADD_NEW_ROW,
  },
  ALLOW_EDITING_EXISTING_ROW: {
    id: ALLOW_MODIFY_EXISTING,
    label: translate('form_field_strings.field_list_config.validation_config.allow_editing_existing_row.label'),
    value: ALLOW_MODIFY_EXISTING,
  },
  ALLOW_DELETING_EXISTING_ROW: {
    id: ALLOW_DELETE_EXISTING,
    label: translate('form_field_strings.field_list_config.validation_config.allow_delete_existing_row.label'),
    value: ALLOW_DELETE_EXISTING,
  },
};
};

export const TABLE_CONTROL_ACCESS = (translate = i18next.t) => {
 return {
  REVOKE_ADD_AND_EDIT_VALIDATION_CONFIG: translate('form_builder_strings.table_control.revoke_validation_config'),
};
};
