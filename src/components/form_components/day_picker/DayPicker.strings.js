import { translateFunction } from 'utils/jsUtility';

const DAY_LIST = (t = translateFunction) =>
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

export default DAY_LIST;
