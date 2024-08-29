import gClasses from 'scss/Typography.module.scss';
import { FLOW_ACTION_VALUE_TYPE, SCHEDULAR_CONSTANTS } from './AutomatedSystems.constants';

export const AUTOMATED_SYSTEM_CONSTANTS = (t) => {
    return {
        TRIGGER_DETAILS: t('automated_systems.trigger_details'),
        COMMON_AUTOMATED_STRINGS: {
          HEADER: t('automated_systems.header'),
          DESCRIPTION: t('automated_systems.description'),
          SUB_HEADER: t('automated_systems.triggering_point.header'),
          ON_DAYS: t('automated_systems.on_days'),
          CONFIG_SYSTEM_ACTION: t('automated_systems.configure_system_action'),
          CHOOSE_FLOW: t('automated_systems.configure_choose_flow'),
          CHOOSE_FLOW_PLACEHOLDER: t('automated_systems.configure_choose_flow_placeholder'),
          CONFIGURE_DATA_NEEDED_FLOW: t('automated_systems.configure_data_to_initiate_flow'),
          CONFIGRE_DATA_DL: t('automated_systems.configure_auto_filled_dl'),
          CONFIGURE_FIRST_STEP: t('automated_systems.configure_first_step'),
          ADD_ACTOR_OPTION: t('automated_systems.add_actors_option'),
          CONDITION: t('automated_systems.condition'),
          ADD_CONDITION: t('automated_systems.add_condition'),
          FIELDS_IN_FLOW: t('automated_systems.flow_action.fields_in_flow'),
          VALUE_TYPE: t('automated_systems.flow_action.value_types_header'),
          FIELDS_IN_DATALIST: t('automated_systems.flow_action.fields_in_data_list'),
          CHOOSE_FLOW_FIELD: t('automated_systems.flow_action.choose_flow_field'),
          CHOOSE_DL_FIELD: t('automated_systems.flow_action.choose_dl_field'),
          ENTER_STATIC_VALUE: t('automated_systems.flow_action.enter_static_value'),
          ADD_MORE_FIELDS: t('automated_systems.flow_action.add_mapping'),
          ADD_COLUMN: t('automated_systems.flow_action.add_column'),
          CANCEL: t('common_strings.cancel'),
          SAVE: t('common_strings.save'),
          DELETE: t('common_strings.delete'),
          DELETE_SYSTEM_ACTION: t('automated_systems.delete_system_action'),
          DELETE_ARE_YOU_SURE: t('automated_systems.delete_are_you_sure'),
          UNABLE_TO_CREATE: t('automated_systems.unable_to_create'),
          NOT_MORE_THAN_3_ACTIONS: t('automated_systems.not_more_than_3_actions'),
          OF: t('automated_systems.repeat_on.of'),
          NO_FIELDS_FOUND: t('form_field_strings.error_text_constant.no_values_found'),
          SELECT: t('form_field_strings.visibility_constant.operator.placeholder'),
        },
        AUTOMATED_STRING_VALUES: {
          DAYS: 'day',
          MONITORING_FIELD: 'monitoringField',
          ALL_DATALIST: 'allDatalist',
          SELECTED_WEEK_DAY: 'selectedWeekDay',
          SELECTED_DATE_MONTH: 'selectedDateMonth',
          REPEAT_MONTH_WEEK: 'triggerRepeatMonth,repeatMonthConfig,repeatMonthWeek',
          REPEAT_MONTH_DAY: 'triggerRepeatMonth,repeatMonthConfig,repeatMonthDay',
          SELECTED_MONTH_DATA_STRING: 'triggerRepeatMonth,repeatMonthConfig,selectedMonthDate',
          START_TIME: 'triggerStartTime',
          TRIGGER_DAY: 'triggerDay',
          REPEAT_MONTH_WEEK_STRING: 'repeatMonthWeek',
          REPEAT_MONTH_DAY_STRING: 'repeatMonthDay',
        },
        AUTOMATED_SYSTEM_ID: {
          TRIGGER_TYPE: 'triggerType',
          TRIGGER_REPEAT_FREQUENCY: 'triggerRepeatFrequency',
          TRIGGER_START_TIME: 'triggerStartTime',
          TRIGGER_DATA_UPDATE: 'triggerDataUpdate',
          TRIGGER_DAY: 'triggerDay',
          TRIGGER_REPEAT_MONTH: 'triggerRepeatMonth',
        },
        TRIGGER_TYPE: {
          TRIGGER_HEADER: t('automated_systems.triggering_point.trigger_type'),
          TRIGGER_OPTION: [
              {
                  label: t('automated_systems.triggering_point.scheduler_or_reccuring'),
                  value: SCHEDULAR_CONSTANTS.TRIGGER_TYPE.SCHEDULER,
              },
              {
                  label: t('automated_systems.triggering_point.trigger_field_change'),
                  value: SCHEDULAR_CONSTANTS.TRIGGER_TYPE.FIELD_VALUE_CHANGE,
              },
          ],
          FREQUENCY_TRIGGER_REPEAT: t('automated_systems.triggering_point.frequency_trigger_repeat'),
          TRIGGER_FIELD: t('automated_systems.triggering_point.trigger_field'),
        },
        REPEAT_ON: {
          REPEAT_ON_HEADER: t('automated_systems.repeat_on.header'),
          REPEAT_ON_OPTIONS: [
              {
                  label: t('automated_systems.repeat_on.first_day_month'),
                  value: SCHEDULAR_CONSTANTS.REPEAT_TYPE.FIRST_DAY,
              },
              {
                  label: t('automated_systems.repeat_on.last_day_month'),
                  value: SCHEDULAR_CONSTANTS.REPEAT_TYPE.LAST_DAY,
              },
              {
                  label: t('automated_systems.repeat_on.selected_week_and_day'),
                  value: SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_WEEK_DAY,
                  customChildElementClassName: gClasses.ML33,
              },
              {
                  label: t('automated_systems.repeat_on.selected_day_month'),
                  value: SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_DATE,
                  customChildElementClassName: gClasses.ML33,
              },
          ],
          TIME_START_TRIGGER: t('automated_systems.time_to_start_trigger.header'),
          REPEAT_EVERY_WEEK_OPTIONS: [
              {
                  label: t('automated_systems.repeat_on.repeat_every_week.first_week'),
                  value: SCHEDULAR_CONSTANTS.SET_WEEK.FIRST_WEEK,
              }, {
                  label: t('automated_systems.repeat_on.repeat_every_week.second_week'),
                  value: SCHEDULAR_CONSTANTS.SET_WEEK.SECOND_WEEK,
              }, {
                  label: t('automated_systems.repeat_on.repeat_every_week.third_week'),
                  value: SCHEDULAR_CONSTANTS.SET_WEEK.THIRD_WEEK,
              }, {
                  label: t('automated_systems.repeat_on.repeat_every_week.fourth_week'),
                  value: SCHEDULAR_CONSTANTS.SET_WEEK.FOURTH_WEEK,
              },
          ],
        },
        TRIGGER_DATA: {
          TRIGGER_DATA_HEADER: t('automated_systems.trigger_data.header'),
          TRIGGER_DATA_OPTIONS: [
              {
                  label: t('automated_systems.trigger_data.all_datalist'),
                  value: SCHEDULAR_CONSTANTS.CONDITION_TYPE.ALL,
              },
              {
                  label: t('automated_systems.trigger_data.data_match'),
                  value: SCHEDULAR_CONSTANTS.CONDITION_TYPE.CONDITION,
              },
          ],
        },
        DAY_OR_MONTH: [
          {
              label: t('automated_systems.day'),
              value: SCHEDULAR_CONSTANTS.TYPE.DAY,
          }, {
              label: t('automated_systems.month'),
              value: SCHEDULAR_CONSTANTS.TYPE.MONTH,
          },
        ],
        DAYS_OPTIONS: [
          {
              label: 'S',
              value: SCHEDULAR_CONSTANTS.DAYS.SUNDAY,
          },
          {
              label: 'M',
              value: SCHEDULAR_CONSTANTS.DAYS.MONDAY,
          },
          {
              label: 'T',
              value: SCHEDULAR_CONSTANTS.DAYS.TUESDAY,
          },
          {
              label: 'W',
              value: SCHEDULAR_CONSTANTS.DAYS.WEDNESDAY,
          },
          {
              label: 'T',
              value: SCHEDULAR_CONSTANTS.DAYS.THURSDAY,
          },
          {
              label: 'F',
              value: SCHEDULAR_CONSTANTS.DAYS.FIRDAY,
          },
          {
              label: 'S',
              value: SCHEDULAR_CONSTANTS.DAYS.SATURDAY,
          },
        ],
        STEP_ACTORS: [
          {
              label: 'User or Team',
              value: 1,
          },
        ],
        VALUE_TYPE: [
          { label: t('automated_systems.flow_action.value_type.static'), value: FLOW_ACTION_VALUE_TYPE.STATIC },
          { label: t('automated_systems.flow_action.value_type.dynamic'), value: FLOW_ACTION_VALUE_TYPE.DYNAMIC },
          { label: t('automated_systems.flow_action.value_type.system'), value: FLOW_ACTION_VALUE_TYPE.SYSTEM },
        ],
        VALIDATION: {
          TRIGGER_TYPE: t('automated_systems.validation.trigger_type'),
          TRIGGER_TYPE_FREQ: t('automated_systems.validation.trigger_repeat_freq'),
          TRIGGER_DAY: t('automated_systems.validation.trigger_day'),
          REPEAT_ON: t('automated_systems.validation.repeat_on'),
          WEEK_AND_DAY: t('automated_systems.validation.week_and_day'),
          WEEK: t('automated_systems.validation.week'),
          DATE_OF_MONTH: t('automated_systems.validation.date_of_month'),
          START_TIME: t('automated_systems.validation.start_time'),
          FLOW: t('automated_systems.validation.flow'),
          TRIGGER_FIELD: t('automated_systems.triggering_point.trigger_field'),
          PLEASE_SELECT_ATLEAST_ONE_DAY: t('scheduler_strings.repeat_every.day_option_error'),
          PLEASE_SELECT_A_DAY: t('scheduler_strings.repeat_every.day.error'),
        },
    };
};
