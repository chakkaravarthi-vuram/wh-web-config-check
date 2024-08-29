// import { translate } from 'language/config';
import { translateFunction } from 'utils/jsUtility';

export const OTHER_CONFIG_STRINGS = (t = translateFunction) => {
  return {
    DEFAULT_CALCULATION: {
      OPTION_LIST: [
        {
          value: false,
          label: t('form_field_strings.form_field_constants.basic_calculation'),
        },
        {
          value: true,
          label: t('form_field_strings.form_field_constants.advanced_calculation'),
        },
      ],
      TYPE: {
        BASIC: 'basic',
        ADVANCE: 'advance',
      },
    },
    USER_SELECTOR_DEFAULT_VALUE: {
      OPTION_LIST: [
        {
          value: 'replace',
          label: t('form_field_strings.form_field_constants.replace'),
        },
        {
          value: 'append',
          label: t('form_field_strings.form_field_constants.merge'),
        },
      ],
    },
  };
};

export const CONFIRMATION_MODAL_ACTION_TYPE = {
  CALCULATION_TYPE: 'calculation_type',
  DEFAULT_CALCULATION_CHECKBOX: 'default_calculation_type',
};
