import Joi from 'joi';
import moment from 'moment-business-days';
import { FIELD_CONFIG } from '../../../../../../../components/form_builder/FormBuilder.strings';
import { COMMA, EMPTY_STRING, SPACE } from '../../../../../../../utils/strings/CommonStrings';
import { DATE } from '../../../../../../../utils/Constants';
import { cloneDeep, isEmpty, safeTrim, translateFunction } from '../../../../../../../utils/jsUtility';
import { DATE_FIELDS_OPERATOR_VALUES, isTimeValid, DAY_LIST } from './DateFieldValidationConfiguration.utils';
import { getDaysDifference, isAfterDateTimeCheck, isBeforeDateTimeCheck } from '../../../../../../../utils/dateUtils';
import { getUserProfileData } from '../../../../../../../utils/UtilityFunctions';
import { getHolidays, getDatePickerFieldsRangeForValidations } from '../../../../../../../utils/formUtils';
import { store } from '../../../../../../../Store';
import { LANDING_PAGE_VALIDATION } from '../../../../../../landing_page/LandingPageTranslation.strings';
import { RESPONSE_VALIDATION_KEYS } from '../../../../../../../utils/constants/form/form.constant';
import { FIELD_TYPES } from '../../../FieldConfiguration.strings';
import { VALIDATION_CONFIG_STRINGS } from '../ValidationConfiguration.strings';

export const dateFieldValidation = ({ read_only, workingDays, validations, minDateString, maxDateString, firstFieldValue, firstFieldData, secondFieldValue, secondFieldData, withFixedDifference, minDiff, minDiffUnit, shouldBePresentTime, currentDateTime }, dateString, isEnableTime, t = () => {}) => {
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
        const date_selection = isEmpty(validations[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION]) ? [] : validations[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION];
        const { allowToday, allowWorkingDay } = validations;
        let isNotInValidRange = false;
        if (!isEmpty(date_selection) && !isEmpty(date_selection[0])) {
          const dateValidation = date_selection[0];
          const isFixed = dateValidation[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].TYPE] === FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE.VALUE;
          if (dateValidation[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].SUB_TYPE]) {
            switch (dateValidation[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].SUB_TYPE]) {
              case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_ALL.VALUE:
                isNotInValidRange = isEnableTime ? isBeforeDateTimeCheck(dateString, minDateString, true) : moment.utc(dateString).isBefore(minDate);
                if (isNotInValidRange) {
                  if (allowToday) {
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
                  console.log('validateStartDate valid', minDateString, isNotInValidRange, dateString);
                  if (isNotInValidRange) {
                    return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_GREATER_DATE} ${SPACE}${minDateString}${SPACE}`;
                  }
                }
                break;
              case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_ALL.VALUE:
                if (moment.utc(dateString).isAfter(maxDate)) {
                  if (allowToday) {
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
                    if (allowToday) return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_DATE_BETWEEN}${SPACE}${minDateString}${SPACE}  ${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.TO} ${SPACE}${maxDateString} ${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.OR_TODAY}`;
                    return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_DATE_BETWEEN}${SPACE}${minDateString}${SPACE} ${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.TO} ${SPACE}${maxDateString}`;
                  }
                }
                break;
              default:
                break;
            }
          }
          if (dateValidation[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].TYPE] === FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_DATE_FIELDS.VALUE) {
            const allowEqualValues = (dateValidation.operator !== DATE_FIELDS_OPERATOR_VALUES.GREATER_THAN) &&
              (dateValidation.operator !== DATE_FIELDS_OPERATOR_VALUES.LESS_THAN);
            switch (dateValidation.operator) {
              case DATE_FIELDS_OPERATOR_VALUES.LESS_THAN:
              case DATE_FIELDS_OPERATOR_VALUES.LESS_THAN_OR_EQUAL_TO:
                if (firstFieldValue && moment(firstFieldValue, ['YYYY-MM-DD', moment.ISO_8601], true).isValid()) {
                  const lessThanDate = firstFieldData.isDateTimeField ? maxDateString : moment.utc(maxDateString).format(DATE.DATE_FORMAT);
                  if (moment.utc(dateString).isAfter(maxDate) || (isEnableTime && isAfterDateTimeCheck(dateString, lessThanDate, allowEqualValues))) {
                    if (allowEqualValues) {
                      return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_LESSER_EQUAL_DATE} ${firstFieldData.fieldName} (Ref: ${firstFieldData.fieldRefName})`;
                    }
                    return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_LESSER_DATE} ${firstFieldData.fieldName} (Ref: ${firstFieldData.fieldRefName})`;
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
                      return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_GREATER_EQUAL_DATE} ${firstFieldData.fieldName} (Ref: ${firstFieldData.fieldRefName})`;
                    }
                    return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_GREATER_DATE} ${firstFieldData.fieldName} (Ref: ${firstFieldData.fieldRefName})`;
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
                      return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_DATE_BETWEEN} ${firstFieldData.fieldName} (Ref: ${firstFieldData.fieldRefName}) ${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.AND} ${secondFieldData.fieldName} (Ref: ${secondFieldData.fieldRefName})`;
                    }
                  } else {
                    if (moment.utc(dateString).isBefore(minDate) || (isEnableTime && isBeforeDateTimeCheck(dateString, firstDateValue, allowEqualValues))) {
                      return `${LANDING_PAGE_VALIDATION.FIELD_VALIDATION_SCHEMA.ENTER_GREATER_EQUAL_DATE} ${firstFieldData.fieldName} (Ref: ${firstFieldData.fieldRefName})`;
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
          if (dateValidation[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].TYPE] === FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_ONLY_TODAY.VALUE) {
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

        if (allowWorkingDay) {
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
      }
      return EMPTY_STRING;
    }
  };

export const validateFixedDateRanges = ({ startDate, endDate, subType, isStartDate, isDateTime, withFixedDifference, minDiff, minDiffUnit, shouldBePresentTime, currentDateTime }, t = translateFunction) => {
    const value = isStartDate ? startDate : endDate;
    let validations = {
      [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION]: [{ [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].TYPE]: 'noLimit' }],
    };
    if (subType === FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE_OPTIONS.BETWEEN) {
      if (isStartDate) {
        validations = {
          [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION]: [{ [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].TYPE]: 'date', [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].SUB_TYPE]: 'before', [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DATE]: moment.utc(endDate).format() }],
          date_selection: [{ [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].TYPE]: 'date', sub_type: 'before', end_date: moment.utc(endDate).format() }],
        };
      } else {
        validations = {
          [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION]: [{ [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].TYPE]: 'date', [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].SUB_TYPE]: 'after', [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DATE]: moment.utc(startDate).format() }],
          date_selection: [{ [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].TYPE]: 'date', sub_type: 'after', start_date: moment.utc(startDate).format() }],
        };
      }
    }
    console.log('getDatePickerFieldsRangeForValidations ins', cloneDeep(validations), getDatePickerFieldsRangeForValidations({
      date: value,
      readOnly: false,
      validations: cloneDeep(validations),
      workingDaysArray: [],
      isEnableTime: isDateTime,
    }));
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
        validations: cloneDeep(validations),
        workingDaysArray: [],
        isEnableTime: isDateTime,
      }),
    }, value, isDateTime, t);
  };

const dateValdiationTypeSchema = (t) => (
    Joi.object().keys({
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].TYPE]: Joi.required(),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].SUB_TYPE]: Joi.string(),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].OPERATOR]: Joi.string().when('type', {
      is: 'form_field',
      then: Joi.string().required()
      .label(VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.FIELD_LABEL),
      otherwise: Joi.string().allow(null),
    }),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].FIRST_FIELD_UUID]: Joi.string().when('type', {
      is: 'form_field',
      then: Joi.string().required(),
      otherwise: Joi.string().allow(null),
    })
    .label(VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_1.LABEL_2),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].SECOND_FIELD_UUID]: Joi.string().when(RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].OPERATOR, {
      is: 'between',
      then: Joi.string().disallow(Joi.ref(RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].FIRST_FIELD_UUID)).required(),
      otherwise: Joi.string().allow(null),
    })
    .label(VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_2.LABEL),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DAY]: Joi.number().when('type', {
      is: 'date',
      then: Joi.number().allow(null),
      otherwise: Joi.number().when('subType', {
        switch: [
          { is: 'after',
            then: Joi.number().min(1).required().messages({
              'any.required': t('form_field_strings.validation_config.updated_date_validation_config.days_required_error'),
            })
            .label(t('form_field_strings.validation_config.updated_date_validation_config.days_required_error')),
          },
          { is: 'next',
            then: Joi.number().min(1).required().messages({
              'any.required': t('form_field_strings.validation_config.updated_date_validation_config.days_required_error'),
            })
            .label(t('form_field_strings.validation_config.updated_date_validation_config.days_required_error')),
          },
          { is: 'last',
            then: Joi.number().min(1).required().messages({
              'any.required': t('form_field_strings.validation_config.updated_date_validation_config.days_required_error'),
            })
            .label(t('form_field_strings.validation_config.updated_date_validation_config.days_required_error')),
          },
          { is: 'before',
            then: Joi.number().min(1).required().messages({
              'any.required': t('form_field_strings.validation_config.updated_date_validation_config.days_required_error'),
            })
            .label(t('form_field_strings.validation_config.updated_date_validation_config.days_required_error')),
          },
          { is: 'between',
            then: Joi.number().min(1).required().messages({
              'any.required': t('form_field_strings.validation_config.updated_date_validation_config.days_required_error'),
            })
            .label(t('form_field_strings.validation_config.updated_date_validation_config.days_required_error')),
            otherwise: Joi.number().allow(null),
          },
        ],
      }),
    }),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DAY]: Joi.number().when('type', {
      is: 'date',
      then: Joi.number().allow(null),
      otherwise: Joi.number().when('subType', {
        is: 'between',
        then: Joi.number().required().greater(Joi.ref(RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DAY))
        .label(t('form_field_strings.validation_config.updated_date_validation_config.days_required_error'))
        .messages({
          'any.ref': `${t('form_field_strings.validation_config.updated_date_validation_config.days_required_error')} ${t('admin_settings.security_settings.error_messages.is_required')}`,
          'number.greater': `${t('form_field_strings.validation_config.updated_date_validation_config.end_day_greater_error')}`,
        }),
        otherwise: Joi.number().allow(null),
      }),
    }),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DATE]: Joi.string().label(t('form_field_strings.validation_config.date_validation.start_date.label')).when('type', {
      is: 'date',
      then: Joi.string().when('subType', {
        switch: [
          {
            is: 'after',
            then: Joi.string().custom((value, helper) => {
              const error = validateFixedDateRanges({
                [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DATE]: value,
                [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DATE]: helper.state.ancestors[0][RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DATE],
                subType: helper.state.ancestors[0][RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION],
                isStartDate: true,
                isDateTime: false,
              },
              t);
              if (error) return helper.message(error);
              return value;
            }),
          },
          {
            is: 'between',
            then: Joi.string().custom((value, helper) => {
              const error = validateFixedDateRanges({ [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DATE]: value, [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DATE]: helper.state.ancestors[0][RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DATE], subType: helper.state.ancestors[0][RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].SUB_TYPE], isStartDate: true, isDateTime: false }, t);
              if (error) return helper.message(error);
              return value;
            }),
            otherwise: Joi.string().allow(null),
          },
        ],
      }),
      otherwise: Joi.string().allow(null),
    }),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DATE]: Joi.string().label(t('form_field_strings.validation_config.date_validation.end_date.label')).when('type', {
      is: 'date',
      then: Joi.string().when('subType', {
        switch: [
          {
            is: 'before',
            then: Joi.string().custom((value, helper) => {
              const error = validateFixedDateRanges({ [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DATE]: helper.state.ancestors[0][RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DATE], [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DATE]: value, subType: helper.state.ancestors[0][RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].SUB_TYPE], isDateTime: false }, t);
              if (error) return helper.message(error);
              return value;
            }),
          },
          {
            is: 'between',
            then: Joi.string().custom((value, helper) => {
              const error = validateFixedDateRanges({ [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DATE]: helper.state.ancestors[0][RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DATE], [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DATE]: value, subType: helper.state.ancestors[0][RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].SUB_TYPE], isDateTime: false }, t);
              console.log('validateStartDate', helper, value, error);
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
      [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION]: Joi.array().items(dateValdiationTypeSchema(t)).min(1).required(),
      [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].ALLOW_TODAY]: Joi.bool().allow(null),
      [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].ALLOW_WORKING_DAY]: Joi.bool().allow(null),
      [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].ALLOW_NON_WORKING_DAY]: Joi.bool().allow(null),
      [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].ALLOW_CUSTOM_WORKING_DAY]: Joi.bool().allow(null),
      [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].CUSTOM_WORKING_DAY]: Joi.when(RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].ALLOW_CUSTOM_WORKING_DAY, {
        is: true,
        then: Joi.array().min(1).required().label('At least one day'),
        otherwise: Joi.forbidden(),
      }),
}));
