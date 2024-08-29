import moment from 'moment';
import { DATE } from '../../../../../../../utils/Constants';
import { translateFunction } from '../../../../../../../utils/jsUtility';
import { RESPONSE_VALIDATION_KEYS } from '../../../../../../../utils/constants/form/form.constant';

export const isTimeValid = (time) => {
    if (moment(time, [DATE.TIME_FORMAT], true).isValid()) return true;
    if (moment(time, ['HH:mm:ss']).isValid()) return true;
    return false;
};

export const DATE_FIELDS_OPERATOR_VALUES = Object.freeze({
  LESS_THAN: 'lesser_than',
  LESS_THAN_OR_EQUAL_TO: 'lesser_than_or_equal_to',
  GREATER_THAN: 'greater_than',
  GREATER_THAN_OR_EQUAL_TO: 'greater_than_or_equal_to',
  BETWEEN: 'between',
});

export const DAY_LIST = (t = translateFunction) =>
   [
  {
    LABEL: 'S',
    TITLE: t('form_field_strings.validation_config.date_validation.working_days.day_strings.sunday'),
    SUBTITLE: t('form_field_strings.validation_config.date_validation.working_days.sun'),
    VALUE: 7,
  },
  {
    LABEL: 'M',
    TITLE: t('form_field_strings.validation_config.date_validation.working_days.day_strings.monday'),
    SUBTITLE: t('form_field_strings.validation_config.date_validation.working_days.mon'),
    VALUE: 1,
  },
  {
    LABEL: 'T',
    TITLE: t('form_field_strings.validation_config.date_validation.working_days.day_strings.tuesday'),
    SUBTITLE: t('form_field_strings.validation_config.date_validation.working_days.tue'),
    VALUE: 2,
  },
  {
    LABEL: 'W',
    TITLE: t('form_field_strings.validation_config.date_validation.working_days.day_strings.wednesday'),
    SUBTITLE: t('form_field_strings.validation_config.date_validation.working_days.wed'),
    VALUE: 3,
  },
  {
    LABEL: 'T',
    TITLE: t('form_field_strings.validation_config.date_validation.working_days.day_strings.thursday'),
    SUBTITLE: t('form_field_strings.validation_config.date_validation.working_days.thu'),
    VALUE: 4,
  },
  {
    LABEL: 'F',
    TITLE: t('form_field_strings.validation_config.date_validation.working_days.day_strings.friday'),
    SUBTITLE: t('form_field_strings.validation_config.date_validation.working_days.fri'),
    VALUE: 5,
  },
  {
    LABEL: 'S',
    TITLE: t('form_field_strings.validation_config.date_validation.working_days.day_strings.saturday'),
    SUBTITLE: t('form_field_strings.validation_config.date_validation.working_days.sat'),
    VALUE: 6,
  },
];

export const getDateFieldsValidationErrorMessage = (errorList, errorKey) => {
  console.log('getDateFieldsValidationErrorMessage', errorList, errorKey, errorList[`${RESPONSE_VALIDATION_KEYS.VALIDATION_DATA},${errorKey}`]);
  return errorList[`${RESPONSE_VALIDATION_KEYS.VALIDATION_DATA},${errorKey}`];
};
