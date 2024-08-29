import moment from 'moment-business-days';
import { translate } from 'language/config';
import { isEmpty, safeTrim, translateFunction } from 'utils/jsUtility';
import { getUserProfileData } from 'utils/UtilityFunctions';
import { getDatePickerFieldsRangeForValidations, getHolidays } from 'utils/formUtils';
import { COMMA, EMPTY_STRING, SPACE } from 'utils/strings/CommonStrings';
import { DATE } from 'utils/Constants';
import { store } from 'Store';
import DAY_LIST from 'components/form_components/day_picker/DayPicker.strings';
import { isTimeValid } from 'components/form_components/date_picker/DatePicker.utils';
import { getDaysDifference, isAfterDateTimeCheck, isBeforeDateTimeCheck } from 'utils/dateUtils';
import { LANDING_PAGE_VALIDATION } from 'containers/landing_page/LandingPageTranslation.strings';
import { DATE_FIELDS_OPERATOR_VALUES, FIELD_CONFIG, FIELD_TYPES } from '../FormBuilder.strings';

const Joi = require('joi');

export const dateFieldValidation = ({ read_only, workingDays, validations, minDateString, maxDateString, firstFieldValue, firstFieldData, secondFieldValue, secondFieldData, withFixedDifference, minDiff, minDiffUnit, shouldBePresentTime, currentDateTime }, dateString, isEnableTime, t = translateFunction) => {
  if (read_only) return EMPTY_STRING;
  if (isEmpty(dateString)) return EMPTY_STRING;
  let isDateValid = moment(dateString, ['YYYY-MM-DD', moment.ISO_8601], true).isValid();
  if (isDateValid) {
    isDateValid = moment(dateString, ['YYYY-MM-DD', moment.ISO_8601], true).format('YYYY') >= 1000;
  }
  const minDate = minDateString ? moment.utc(minDateString).format() : EMPTY_STRING;
  const maxDate = maxDateString ? moment.utc(maxDateString).endOf('day').format() : EMPTY_STRING;
  if (!isDateValid) {
    const timeString = !isEmpty(dateString) ? dateString.split('T')[1] : EMPTY_STRING;
    const timeStringTrimmed = safeTrim(timeString);
    if (isEnableTime && (isEmpty(timeStringTrimmed) || (timeStringTrimmed.length < 8) || !isTimeValid(timeString))) return t(LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.VALID_DATE_TIME);
    return t(LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.VALID_DATE);
  } else {
    const timeString = !isEmpty(dateString) ? dateString.split('T')[1] : EMPTY_STRING;
    const timeStringTrimmed = safeTrim(timeString);
    if (isEnableTime && (isEmpty(timeStringTrimmed) || (timeStringTrimmed.length < 8) || !isTimeValid(timeString))) return t(LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.VALID_DATE_TIME);
    if (shouldBePresentTime) {
      console.log(dateString, currentDateTime, 'kjhjkhjkhjkhjkhj');
      const isNotInValidRange = isBeforeDateTimeCheck(dateString, currentDateTime, true);
      if (isNotInValidRange) {
        return LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.FUTURE_DATE;
      }
    }
    if (validations) {
      const date_selection = isEmpty(validations.date_selection) ? [] : validations.date_selection;
      const { allow_today, allow_working_day, allow_non_working_day, allowed_day = [] } = validations;
      let isNotInValidRange = false;
      if (!isEmpty(date_selection) && !isEmpty(date_selection[0])) {
        const dateValidation = date_selection[0];
        const isFixed = dateValidation.type === FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE.VALUE;
        if (dateValidation.sub_type) {
          switch (dateValidation.sub_type) {
            case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_ALL.VALUE:
              isNotInValidRange = isEnableTime ? isBeforeDateTimeCheck(dateString, minDateString, true) : moment.utc(dateString).isBefore(minDate);
              if (isNotInValidRange) {
                if (allow_today) {
                  return LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.TODAY_FUTURE_DATE;
                } else return LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.FUTURE_DATE;
              }
              break;
            case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.VALUE:
              if (isFixed && isEnableTime) {
                if (isBeforeDateTimeCheck(dateString, minDateString)) {
                  return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_GREATER_DATE} ${SPACE}${minDateString}${SPACE}`;
                } else if (withFixedDifference) {
                  const daysDiff = getDaysDifference(dateString, minDateString);
                  if (daysDiff > withFixedDifference) {
                    return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.MAX_DIFF} ${withFixedDifference} ${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.DAYS}`;
                  }
                }
              } else {
                isNotInValidRange = isEnableTime ? isBeforeDateTimeCheck(dateString, minDateString, true) : moment.utc(dateString).isBefore(minDate);
                if (isNotInValidRange) {
                  return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_GREATER_DATE} ${SPACE}${minDateString}${SPACE}`;
                }
              }
              break;
            case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_ALL.VALUE:
              if (moment.utc(dateString).isAfter(maxDate)) {
                if (allow_today) {
                  return LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.TODAY_PAST_DATE;
                } else return LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.PAST_DATE;
              }
              break;
            case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.VALUE:
              if (isFixed && isEnableTime) {
                if (isAfterDateTimeCheck(dateString, maxDateString)) {
                  return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_LESSER_DATE} ${SPACE}${maxDateString}${SPACE}`;
                } else if (withFixedDifference) {
                  const daysDiff = getDaysDifference(maxDateString, dateString);
                  if (daysDiff > withFixedDifference) {
                    return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.MAX_DIFF} ${withFixedDifference} ${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.DAYS}`;
                  }
                }
                if (minDiff) {
                  const minDifference = getDaysDifference(maxDateString, dateString, minDiffUnit);
                  if (minDifference < minDiff) {
                    return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ATLEAST} ${minDiff}${minDiffUnit} ${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.DIFF_ADDED}`;
                  }
                }
              } else {
                if (moment.utc(dateString).isAfter(maxDate)) {
                  return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_LESSER_DATE} ${SPACE}${maxDateString}${SPACE}`;
                }
              }
              break;
            case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.VALUE:
            case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.VALUE:
            case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.VALUE:
              if (isFixed && isEnableTime) {
                if (isBeforeDateTimeCheck(dateString, minDateString) || isAfterDateTimeCheck(dateString, maxDateString)) {
                  return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_DATE_BETWEEN}${SPACE}${minDateString}${SPACE} ${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.TO} ${SPACE}${maxDateString}`;
                }
              } else {
                isNotInValidRange = isEnableTime ?
                  (isBeforeDateTimeCheck(dateString, minDateString, true) || isAfterDateTimeCheck(dateString, maxDate, true)) :
                  (moment.utc(dateString).isBefore(minDate) || moment.utc(dateString).isAfter(maxDate));
                if (isNotInValidRange) {
                  if (allow_today) return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_DATE_BETWEEN}${SPACE}${minDateString}${SPACE}  ${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.TO} ${SPACE}${maxDateString} ${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.OR_TODAY}`;
                  return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_DATE_BETWEEN}${SPACE}${minDateString}${SPACE} ${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.TO} ${SPACE}${maxDateString}`;
                }
              }
              break;
            default:
              break;
          }
        }
        if (dateValidation.type === FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_DATE_FIELDS.VALUE) {
          const allowEqualValues = (dateValidation.operator !== DATE_FIELDS_OPERATOR_VALUES.GREATER_THAN) &&
            (dateValidation.operator !== DATE_FIELDS_OPERATOR_VALUES.LESS_THAN);
          switch (dateValidation.operator) {
            case DATE_FIELDS_OPERATOR_VALUES.LESS_THAN:
            case DATE_FIELDS_OPERATOR_VALUES.LESS_THAN_OR_EQUAL_TO:
              if (firstFieldValue && moment(firstFieldValue, ['YYYY-MM-DD', moment.ISO_8601], true).isValid()) {
                const lessThanDate = firstFieldData.isDateTimeField ? maxDateString : moment.utc(maxDateString).format(DATE.DATE_FORMAT);
                if (moment.utc(dateString).isAfter(maxDate) || (isEnableTime && isAfterDateTimeCheck(dateString, lessThanDate, allowEqualValues))) {
                  if (allowEqualValues) {
                    return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_LESSER_EQUAL_DATE} ${firstFieldData.fieldName}`;
                  }
                  return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_LESSER_DATE} ${firstFieldData.fieldName}`;
                }
              }
              break;
            case DATE_FIELDS_OPERATOR_VALUES.GREATER_THAN:
            case DATE_FIELDS_OPERATOR_VALUES.GREATER_THAN_OR_EQUAL_TO:
              if (firstFieldValue && moment(firstFieldValue, ['YYYY-MM-DD', moment.ISO_8601], true).isValid()) {
                const daysToBeAdded = allowEqualValues ? 0 : 1;
                const greaterThanDate = firstFieldData.isDateTimeField ? minDateString : moment.utc(minDateString).add(daysToBeAdded, 'days').format(DATE.DATE_FORMAT);
                if (moment.utc(dateString).isBefore(minDate) || (isEnableTime && isBeforeDateTimeCheck(dateString, greaterThanDate, !firstFieldData.isDateTimeField || allowEqualValues))) {
                  if (allowEqualValues) {
                    return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_GREATER_EQUAL_DATE} ${firstFieldData.fieldName}`;
                  }
                  return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_GREATER_DATE} ${firstFieldData.fieldName}`;
                }
              }
              break;
            case DATE_FIELDS_OPERATOR_VALUES.BETWEEN:
              const isFirstFieldValid = firstFieldValue && moment(firstFieldValue, ['YYYY-MM-DD', moment.ISO_8601], true).isValid();
              const isSecondFieldValid = secondFieldValue && moment(secondFieldValue, ['YYYY-MM-DD', moment.ISO_8601], true).isValid();
              let firstDateValue;
              let secondDateValue;
              if (isFirstFieldValid) {
                firstDateValue = firstFieldData.isDateTimeField ? minDateString : moment.utc(minDateString).format(DATE.DATE_FORMAT);
                if (isSecondFieldValid) {
                  secondDateValue = secondFieldData.isDateTimeField ? maxDateString : moment.utc(maxDateString).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
                  if (
                    (moment.utc(dateString).isBefore(minDate) || moment.utc(dateString).isAfter(maxDate)) ||
                    (
                      isEnableTime && (
                        isBeforeDateTimeCheck(dateString, firstDateValue, allowEqualValues) ||
                        isAfterDateTimeCheck(dateString, secondDateValue, allowEqualValues)
                      )
                    )
                  ) {
                    return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_DATE_BETWEEN} ${firstFieldData.fieldName} ${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.AND} ${secondFieldData.fieldName}`;
                  }
                } else {
                  if (moment.utc(dateString).isBefore(minDate) || (isEnableTime && isBeforeDateTimeCheck(dateString, firstDateValue, allowEqualValues))) {
                    return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_GREATER_EQUAL_DATE} ${firstFieldData.fieldName}`;
                  }
                }
              } else if (isSecondFieldValid) {
                secondDateValue = secondFieldData.isDateTimeField ? maxDateString : moment.utc(maxDateString).format(DATE.DATE_FORMAT);
                console.log(moment.utc(dateString).isAfter(maxDate), isAfterDateTimeCheck(dateString, secondDateValue, allowEqualValues), maxDate, maxDateString, 'isAfterDateTimeCheck(dateString, maxDateString, allowEqualValues)');
                if (moment.utc(dateString).isAfter(maxDate) || (isEnableTime && isAfterDateTimeCheck(dateString, secondDateValue, allowEqualValues))) {
                  return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_LESSER_EQUAL_DATE} ${secondFieldData.fieldName} (Ref: ${secondFieldData.fieldRefName})`;
                }
              }
              break;
            default:
              break;
          }
        }
        if (dateValidation.type === FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_ONLY_TODAY.VALUE) {
          const userProfileData = getUserProfileData();
          let dateWithTimezone;
          if (userProfileData.pref_timezone) {
            dateWithTimezone = moment.utc().tz(userProfileData.pref_timezone).format(DATE.DATE_FORMAT);
          } else {
            dateWithTimezone = moment.utc().format(DATE.DATE_FORMAT);
          }
          const startOfDay = moment.utc(dateWithTimezone).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
          const endOfDay = moment.utc(dateWithTimezone).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
          isNotInValidRange = isEnableTime ?
            (isBeforeDateTimeCheck(dateString, startOfDay, true) || isAfterDateTimeCheck(dateString, endOfDay, true)) :
            (moment.utc(dateString).isBefore(startOfDay) || moment.utc(dateString).isAfter(endOfDay));
          console.log(isBeforeDateTimeCheck(dateString, startOfDay, true), isAfterDateTimeCheck(dateString, endOfDay, true), dateString, startOfDay, endOfDay, 'startOfDay startOfDay');
          if (isNotInValidRange) return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ONLY_TODAY} ${"'"}${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.DATE_ALLOWED}`;
        }
      }

      if (allow_working_day) {
        const workingWeekDaysString = [];
        const workingWeekDays = [];
        if (!isEmpty(workingDays)) {
          DAY_LIST(t).map((day) => {
            if (workingDays.some((selectedDay) => day.VALUE === selectedDay)) {
              workingWeekDaysString.push(day.SUBTITLE);
              if (day.VALUE === 7) {
                workingWeekDays.push(0);
              } else {
                workingWeekDays.push(day.VALUE);
              }
            }
            return null;
          });
        }
        const { holiday_list } = store.getState().HolidayListReducer;
        const holidays = getHolidays(holiday_list);
        moment.updateLocale('us', {
          workingWeekdays: workingWeekDays,
          holidays: holidays,
          holidayFormat: DATE.DATE_FORMAT,
        });
        if (moment.utc(dateString).isBusinessDay()) {
          return EMPTY_STRING;
        } else {
          const string = workingWeekDaysString.join(COMMA + SPACE);
          return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.SELECT_WORKING_DAY} ${SPACE} ${string}`;
        }
      }
      if (allow_non_working_day) {
        const nonWorkingWeekDaysString = [];
        const nonWorkingWeekDays = [];
        if (!isEmpty(workingDays)) {
          DAY_LIST(t).map((day) => {
            if (!workingDays.includes(day.VALUE)) {
              nonWorkingWeekDaysString.push(day.SUBTITLE);
              if (day.VALUE === 7) {
                nonWorkingWeekDays.push(0);
              } else {
                nonWorkingWeekDays.push(day.VALUE);
              }
            }
            return null;
          });
        }
        const { holiday_list } = store.getState().HolidayListReducer;
        const holidays = getHolidays(holiday_list);
        moment.updateLocale('us', {
          workingWeekdays: nonWorkingWeekDays,
          holidays: holidays,
          holidayFormat: DATE.DATE_FORMAT,
        });
        if (moment.utc(dateString).isBusinessDay()) {
          return EMPTY_STRING;
        } else {
          const string = nonWorkingWeekDaysString.join(COMMA + SPACE);
          return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.SELECT_NON_WORKING_DAY} ${SPACE} ${string}`;
        }
      }
      if (!isEmpty(allowed_day)) {
        const workingDays = allowed_day;
        const workingWeekDaysString = [];
        const workingWeekDays = [];
        if (!isEmpty(workingDays)) {
          DAY_LIST(t).map((day) => {
            if (workingDays.includes(day.VALUE)) {
              workingWeekDaysString.push(day.SUBTITLE);
              if (day.VALUE === 7) {
                workingWeekDays.push(0);
              } else {
                workingWeekDays.push(day.VALUE);
              }
            }
            return null;
          });
        }
        const { holiday_list } = store.getState().HolidayListReducer;
        const holidays = getHolidays(holiday_list);
        moment.updateLocale('us', {
          workingWeekdays: workingWeekDays,
          holidays: holidays,
          holidayFormat: DATE.DATE_FORMAT,
        });
        if (moment.utc(dateString).isBusinessDay()) {
          return EMPTY_STRING;
        } else {
          const string = workingWeekDaysString.join(COMMA + SPACE);
          return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.SELECT_WORKING_DAY} ${SPACE} ${string}`;
        }
      }
    }
    return EMPTY_STRING;
  }
};

export const singlelineValidationSchema = Joi.object().keys({
  minimum_characters: Joi.number().default(0).min(1),
  maximum_characters: Joi.number()
    .default(255)
    .min(Joi.ref('minimum_characters'))
    .greater(0),
  allowed_special_characters: Joi.string(),
});

export const paragraphValidationSchema = Joi.object().keys({
  minimum_characters: Joi.number().default(0).min(1),
  maximum_characters: Joi.number()
    .default(4000)
    .min(Joi.ref('minimum_characters'))
    .greater(0),
  allowed_special_characters: Joi.string(),
});

export const numberValidationSchema = Joi.object().keys({
  allow_decimal: Joi.bool().default(false),
  dont_allow_zero: Joi.bool().default(false),
  allowed_minimum: Joi.when('dont_allow_zero', {
    is: true,
    then: Joi.number().custom((value, helpers) => {
      if (helpers.state.ancestors[0].dont_allow_zero && value === 0) return helpers.message(translate('form_field_strings.error_text_constant.invalid_minimum_value'));
      return value;
    }),
    otherwise: Joi.number(),
  }).label(translate('form_field_strings.validation_config.minimum_value.label')),
  allowed_maximum: Joi.number().when('allowed_minimum', {
    is: Joi.number().valid(),
    then: Joi.number().custom((value, helpers) => {
      if (helpers.state.ancestors[0].dont_allow_zero && value === 0) return helpers.message(translate('form_field_strings.error_text_constant.invalid_maximum_value'));
      if (value < helpers.state.ancestors[0].allowed_minimum) return helpers.message(translate('form_field_strings.error_text_constant.maximium_greater_than_minimum'));
      return value;
    }),
    otherwise: Joi.number().greater(0),
  }).label(translate('form_field_strings.validation_config.maximum_value.label')),
  // min(Joi.ref('allowed_minimum')).greater(0),
  allowed_decimal_points: Joi.number().default(2).min(1).max(10)
  .label(translate('form_field_strings.error_text_constant.decimal'))
  .messages({
    'number.min': translate('form_field_strings.error_text_constant.greate_than_0'),
  }),
});
export const linkValidationSchema = Joi.object().keys({
  is_multiple: Joi.bool(),
  maximum_count: Joi.when('is_multiple', {
    is: true,
    then: Joi.when('is_multiple', {
      is: true,
      then: Joi.number().min(Joi.ref('minimum_count')).required(),
      otherwise: Joi.number().min(1).required(),
    }),
    otherwise: Joi.forbidden(),
  }),
  minimum_count: Joi.when('is_multiple', {
    is: true,
    then: Joi.number().min(1).max(Joi.ref('maximum_count')).required(),
    otherwise: Joi.forbidden(),
  }),
});
export const validateFixedDateRanges = ({ start_date, end_date, sub_type, is_start_date, isDateTime, withFixedDifference, minDiff, minDiffUnit, shouldBePresentTime, currentDateTime }, t = translateFunction) => {
  const value = is_start_date ? start_date : end_date;
  let validations = {
    date_selection: [{ type: 'no_limit' }],
  };
  if (sub_type === FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE_OPTIONS.BETWEEN) {
    if (is_start_date) {
      validations = {
        date_selection: [{ type: 'date', sub_type: 'before', end_date: moment.utc(end_date).format() }],
      };
    } else {
      validations = {
        date_selection: [{ type: 'date', sub_type: 'after', start_date: moment.utc(start_date).format() }],
      };
    }
  }
  return dateFieldValidation({
    workingDays: [],
    validations,
    withFixedDifference,
    minDiff,
    minDiffUnit,
    shouldBePresentTime,
    currentDateTime,
    ...getDatePickerFieldsRangeForValidations({
      date: value,
      readOnly: false,
      validations,
      workingDaysArray: [],
      isEnableTime: isDateTime,
    }),
  }, value, isDateTime, t);
};
const dateTimeValdiationTypeSchema = (t) => (
  Joi.object().keys({
  type: Joi.required(),
  sub_type: Joi.string(),
  operator: Joi.string().label(translate('form_field_strings.visibility_constant.operator.label')).when('type', {
    is: 'form_field',
    then: Joi.string().required(),
    otherwise: Joi.string().allow(null),
  }),
  first_field_uuid: Joi.string().when('type', {
    is: 'form_field',
    then: Joi.string().required(),
    otherwise: Joi.string().allow(null),
  }),
  second_field_uuid: Joi.string().when('operator', {
    is: 'between',
    then: Joi.string().required(),
    otherwise: Joi.string().allow(null),
  }),
  start_day: Joi.number().when('type', {
    is: 'date',
    then: Joi.number().allow(null),
    otherwise: Joi.number().when('sub_type', {
      switch: [
        { is: 'after', then: Joi.number().min(1).required() },
        { is: 'next', then: Joi.number().min(1).required() },
        { is: 'last', then: Joi.number().min(1).required() },
        { is: 'before', then: Joi.number().min(1).required() },
        { is: 'between', then: Joi.number().min(1).required(), otherwise: Joi.number().allow(null) },
      ],
    }),
  }),
  end_day: Joi.number().when('type', {
    is: 'date',
    then: Joi.number().allow(null),
    otherwise: Joi.number().when('sub_type', { is: 'between', then: Joi.number().greater(Joi.ref('start_day')), otherwise: Joi.number().allow(null) }),
  }),
  start_date: Joi.string().label(translate('form_field_strings.validation_config.date_validation.start_date.label')).when('type', {
    is: 'date',
    then: Joi.string().when('sub_type', {
      switch: [
        {
          is: 'after',
          then: Joi.string().custom((value, helper) => {
            const error = validateFixedDateRanges({ start_date: value, end_date: helper.state.ancestors[0].end_date, sub_type: helper.state.ancestors[0].sub_type, is_start_date: true, isDateTime: true }, t);
            if (error) return helper.message(error);
            return value;
          }),
        },
        {
          is: 'between',
          then: Joi.string().custom((value, helper) => {
            const error = validateFixedDateRanges({ start_date: value, end_date: helper.state.ancestors[0].end_date, sub_type: helper.state.ancestors[0].sub_type, is_start_date: true, isDateTime: true }, t);
            if (error) return helper.message(error);
            return value;
          }),
          otherwise: Joi.string().allow(null),
        },
      ],
    }),
    otherwise: Joi.string().allow(null),
  }),
  end_date: Joi.string().label(translate('form_field_strings.validation_config.date_validation.end_date.label')).when('type', {
    is: 'date',
    then: Joi.string().when('sub_type', {
      switch: [
        {
          is: 'before',
          then: Joi.string().custom((value, helper) => {
            const error = validateFixedDateRanges({ start_date: helper.state.ancestors[0].start_date, end_date: value, sub_type: helper.state.ancestors[0].sub_type, isDateTime: true }, t);
            if (error) return helper.message(error);
            return value;
          }),
        },
        {
          is: 'between',
          then: Joi.string().custom((value, helper) => {
            const error = validateFixedDateRanges({ start_date: helper.state.ancestors[0].start_date, end_date: value, sub_type: helper.state.ancestors[0].sub_type, isDateTime: true }, t);
            if (error) return helper.message(error);
            return value;
          }),
          otherwise: Joi.string().allow(null),
        },
      ],
    }),
    otherwise: Joi.string().allow(null),
  }),
}));
const dateValdiationTypeSchema = (t) => (
  Joi.object().keys({
  type: Joi.required(),
  sub_type: Joi.string(),
  operator: Joi.string().when('type', {
    is: 'form_field',
    then: Joi.string().required(),
    otherwise: Joi.string().allow(null),
  }),
  first_field_uuid: Joi.string().when('type', {
    is: 'form_field',
    then: Joi.string().required(),
    otherwise: Joi.string().allow(null),
  }),
  second_field_uuid: Joi.string().when('operator', {
    is: 'between',
    then: Joi.string().disallow(Joi.ref('first_field_uuid')).required(),
    otherwise: Joi.string().allow(null),
  }),
  start_day: Joi.number().when('type', {
    is: 'date',
    then: Joi.number().allow(null),
    otherwise: Joi.number().when('sub_type', {
      switch: [
        { is: 'after', then: Joi.number().min(1).required() },
        { is: 'next', then: Joi.number().min(1).required() },
        { is: 'last', then: Joi.number().min(1).required() },
        { is: 'before', then: Joi.number().min(1).required() },
        { is: 'between', then: Joi.number().min(1).required(), otherwise: Joi.number().allow(null) },
      ],
    }),
  }),
  end_day: Joi.number().when('type', {
    is: 'date',
    then: Joi.number().allow(null),
    otherwise: Joi.number().when('sub_type', { is: 'between', then: Joi.number().greater(Joi.ref('start_day')), otherwise: Joi.number().allow(null) }),
  }),
  start_date: Joi.string().label(translate('form_field_strings.validation_config.date_validation.start_date.label')).when('type', {
    is: 'date',
    then: Joi.string().when('sub_type', {
      switch: [
        {
          is: 'after',
          then: Joi.string().custom((value, helper) => {
            const error = validateFixedDateRanges({ start_date: value, end_date: helper.state.ancestors[0].end_date, sub_type: helper.state.ancestors[0].sub_type, is_start_date: true, isDateTime: false }, t);
            if (error) return helper.message(error);
            return value;
          }),
        },
        {
          is: 'between',
          then: Joi.string().custom((value, helper) => {
            const error = validateFixedDateRanges({ start_date: value, end_date: helper.state.ancestors[0].end_date, sub_type: helper.state.ancestors[0].sub_type, is_start_date: true, isDateTime: false }, t);
            if (error) return helper.message(error);
            return value;
          }),
          otherwise: Joi.string().allow(null),
        },
      ],
    }),
    otherwise: Joi.string().allow(null),
  }),
  end_date: Joi.string().label(translate('form_field_strings.validation_config.date_validation.end_date.label')).when('type', {
    is: 'date',
    then: Joi.string().when('sub_type', {
      switch: [
        {
          is: 'before',
          then: Joi.string().custom((value, helper) => {
            const error = validateFixedDateRanges({ start_date: helper.state.ancestors[0].start_date, end_date: value, sub_type: helper.state.ancestors[0].sub_type, isDateTime: false }, t);
            if (error) return helper.message(error);
            return value;
          }),
        },
        {
          is: 'between',
          then: Joi.string().custom((value, helper) => {
            const error = validateFixedDateRanges({ start_date: helper.state.ancestors[0].start_date, end_date: value, sub_type: helper.state.ancestors[0].sub_type, isDateTime: false }, t);
            if (error) return helper.message(error);
            return value;
          }),
          otherwise: Joi.string().allow(null),
        },
      ],
    }),
    otherwise: Joi.string().allow(null),
  }),
}));
export const dateValidationSchema = (t) => (
  Joi.object().keys({
  date_selection: Joi.array().items(dateValdiationTypeSchema(t)).min(1).required(),
  allow_today: Joi.bool().allow(null),
  allow_working_day: Joi.bool().allow(null),
}));

export const dateTimeValidationSchema = (t) => (
  Joi.object().keys({
  date_selection: Joi.array().items(dateTimeValdiationTypeSchema(t)).min(1).required(),
  allow_today: Joi.bool().allow(null),
  allow_working_day: Joi.bool().allow(null),
}));

export const fileUploadValidationSchema = Joi.object().keys({
  is_multiple: Joi.bool(),
  maximum_count: Joi.when('is_multiple', {
    is: true,
    then: Joi.when('is_multiple', {
      is: true,
      then: Joi.number().min(Joi.ref('minimum_count')).required(),
      otherwise: Joi.number().min(1).required(),
    }),
    otherwise: Joi.forbidden(),
  }),
  minimum_count: Joi.when('is_multiple', {
    is: true,
    then: Joi.number().min(1).max(Joi.ref('maximum_count')).required(),
    otherwise: Joi.forbidden(),
  }),
  maximum_file_size: Joi.number().integer().min(1),
  allowed_extensions: Joi.array().items(Joi.string()),
});

export const currencyValidationSchema = Joi.object().keys({
  allowed_minimum: Joi.number().min(0),
  allowed_maximum: Joi.number().greater(Joi.ref('allowed_minimum')).min(1),
  default_currency_type: Joi.string(),
  allowed_currency_types: Joi.array().items(Joi.string()),
});
export const phoneNumberValidationSchema = Joi.object().keys({
  allowed_minimum: Joi.string().min(5),
  allowed_maximum: Joi.string().max(12),
});

export const dropdownValidationSchema = Joi.object().keys({
  // maximum_count: Joi.number(),
  // minimum_count: Joi.number(),
  values: Joi.string().required().replace(',', ''),
});

export const checkboxValidationSchema = Joi.object().keys({
  // maximum_count: Joi.number(),
  // minimum_count: Joi.number(),
  values: Joi.string().required().replace(',', ''),
});

export const radiobuttonValidationSchema = Joi.object().keys({
  values: Joi.string().required().replace(',', ''),
});

export const yesOrNoValidationSchema = Joi.object().keys({
  values: Joi.string(),
});

export const tableValidationSchema = Joi.object().keys({
  add_new_row: Joi.bool().default(true),
  is_unique_column_available: Joi.bool().optional(),
  allow_modify_existing: Joi.bool().optional(),
  allow_delete_existing: Joi.bool().optional(),
  unique_column_uuid: Joi.when('is_unique_column_available', {
    is: true,
    then: Joi.string().required().custom((value, helpers) => {
      if (!isEmpty(helpers.state.ancestors[1].fields)) {
        const index = helpers.state.ancestors[1].fields.findIndex((field) => field.field_uuid === value);
        if (index > -1) {
          if (helpers.state.ancestors[1].fields[index].read_only) return helpers.message(translate('form_field_strings.error_text_constant.read_only_fields_not_unique'));
          else return value;
        } return value;
        // return helpers.message('Deleted fields can not be set as unique column');
      }
      return value;
      // return helpers.message('Add table fields');
    }),
    otherwise: Joi.forbidden(),
  }),
  read_only: Joi.bool().default(false),
  is_pagination: Joi.bool().default(false),
  is_maximum_row: Joi.bool().default(false),
  maximum_row: Joi.when('is_maximum_row', {
    is: true,
    then: Joi.when('is_minimum_row', {
      is: true,
      then: Joi.number().min(Joi.ref('minimum_row')).required(),
      otherwise: Joi.number().min(1).required(),
    }),
    otherwise: Joi.forbidden(),
  }),
  is_minimum_row: Joi.bool().default(false),
  minimum_row: Joi.when('is_minimum_row', {
    is: true,
    then: Joi.number().min(1).required(),
    otherwise: Joi.forbidden(),
  }),
});

export const userTeamPickerValidationSchema = Joi.object().keys({
  allow_users: Joi.bool().default(true),
  allow_teams: Joi.bool().default(false),
  allow_maximum_selection: Joi.bool().default(false),
  maximum_selection: Joi.when('allow_maximum_selection', {
    is: true,
    then: Joi.when('allow_minimum_selection', {
      is: true,
      then: Joi.number().min(Joi.ref('minimum_selection')).required(),
      otherwise: Joi.number().min(1).required(),
    }),
    otherwise: Joi.forbidden(),
  }),
  allow_minimum_selection: Joi.bool().default(false),
  allow_multiple: Joi.bool().default(false),
  minimum_selection: Joi.when('allow_minimum_selection', {
    is: true,
    then: Joi.number().min(1).required(),
    otherwise: Joi.forbidden(),
  }),
  is_restricted: Joi.bool().default(false),
  restricted_user_team: Joi.when('is_restricted', {
    is: true,
    then: Joi.when('allow_teams', {
      is: true,
      then: Joi.when('allow_users', {
        is: false,
        then: Joi.object()
          .keys({
            teams: Joi.array().min(1).required(),
            users: Joi.array(),
          })
          .required(),
        otherwise: Joi.object()
          .keys({
            teams: Joi.array().min(1),
            users: Joi.array().min(1),
          })
          .or('users', 'teams')
          .required(),
      }),
      otherwise: Joi.object()
        .keys({
          teams: Joi.array().min(1),
          users: Joi.array().min(1),
        })
        .or('users', 'teams'),
    }),
  }),
});

const validateDataListFilterDate = (value, isDateTime) => {
  const data = {
    futureDate: false,
    pastDate: false,
    specificDate: null,
    fromDate: null,
    toDate: null,
    today: false,
    isFixedDateTime: false,
  };
  console.log('validateDataListFilterDate', value);
  return dateFieldValidation({
    workingDaysOnly: false,
    workingDays: [],
    ...data,
  }, value, isDateTime);
};

export const datalistFilterValidationSchema = Joi.object().keys({
  field_uuid: Joi.string().required().label(translate('form_field_strings.validation_config.limit_datalist.filter_fields.label')),
  field_type: Joi.string().required().label(translate('form_field_strings.validation_config.limit_datalist.filter_fields.field_type')),
  operator: Joi.string().required().label(translate('form_field_strings.validation_config.limit_datalist.filter_fields.operator_label')),
  field_value: Joi.when('value_type', {
    is: 'field',
    then: Joi.optional(),
    otherwise: Joi.when('field_type', {
    is: '',
    then: Joi.optional(),
    otherwise: Joi.when('field_type', {
      is: Joi.equal(
        FIELD_TYPES.CHECKBOX,
        FIELD_TYPES.DROPDOWN,
        FIELD_TYPES.RADIO_GROUP,
        FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
      ),
      then: Joi.array().required().label(translate('form_field_strings.form_field_constants.value')),
      otherwise: Joi.when('field_type', {
        is: FIELD_TYPES.NUMBER,
        then: Joi.number().required().label(translate('form_field_strings.form_field_constants.value')),
        otherwise: Joi.when('field_type', {
          is: Joi.equal(FIELD_TYPES.CURRENCY),
          then: Joi.object().keys({
            value: Joi.number().greater(0).label(translate('form_field_strings.form_field_constants.value')).required(),
            currency_type: Joi.string().label(translate('form_field_strings.field_config.currency_type_dd.label')).required(),
          }),
          otherwise: Joi.when('field_type', {
            is: Joi.equal(FIELD_TYPES.DATE, FIELD_TYPES.DATETIME),
            // then: validateDataListFilterDate(this.field_value),
            then: Joi.string().custom((value, helper) => {
              const error = validateDataListFilterDate(helper.state.ancestors[0].field_value, helper.state.ancestors[0].field_type === FIELD_TYPES.DATETIME);
              if (error) return helper.message(error);
              return value;
            }).label(translate('form_field_strings.form_field_constants.value')),
            otherwise: Joi.when('field_type', {
              is: FIELD_TYPES.YES_NO,
              then: Joi.bool().required().label(translate('form_field_strings.form_field_constants.value')),
              otherwise: Joi.forbidden(),
            }),
          }),
        }),
      }),
    }),
  }),
  }),
  value_type: Joi.string(),
  field: Joi.when('value_type', {
    is: 'field',
    then: Joi.string().required().label(translate('form_field_strings.error_text_constant.field_name')),
    otherwise: Joi.when('value_type', {
      is: 'direct',
      then: Joi.optional(),
    }),
  }),
});

export const dataListFieldValidationSchem = Joi.object().keys({
  allow_multiple: Joi.bool(),
  is_datalist_filter: Joi.any(),
  maximum_selection: Joi.when(
    'allow_multiple',
    {
      is: true,
      then: Joi.number().min(2),
      otherwise: Joi.forbidden(),
    },
  ),
  filter_fields: Joi.array().items(datalistFilterValidationSchema).unique().label(translate('form_field_strings.error_text_constant.filter')),
});

export const emailFieldValidationSchema = Joi.optional();
