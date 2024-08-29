import { translate } from 'language/config';
import { isEmpty } from 'utils/jsUtility';
import Joi from 'joi';
import { translateFunction } from '../../../utils/jsUtility';
import { validate } from '../../../utils/UtilityFunctions';
import { FIELD_NAME_VALIDATION, FLOW_DESCRIPTION_VALIDATION, FLOW_NAME_VALIDATION, SECTION_NAME_VALIDATION, STEP_DESCRIPTION_VALIDATION, STEP_NAME_VALIDATION } from '../../../utils/ValidationConstants';
import { FLOW_STRINGS } from '../EditFlow.strings';
import { FIELD_NAME, SECTION_TITLE } from '../../../components/form_builder/FormBuilder.strings';
import { FORM_MIN_MAX_CONSTRAINTS } from '../../../utils/Constants';
import { HELP_TEXT, INSTRUCTIONS, PLACE_HOLDER } from '../../../validation/form/form.validation.schema.constant';

export const SETTINGS_STRINGS = (translate) => {
  return {
  HEADER: {
    pageTitle: translate('publish_settings.header.page_title'),
    subTitle: translate('publish_settings.header.sub_title'),
  },
  TRIGGER: {
    TITLE: translate('publish_settings.dashboard_settings.trigger_shortcut.title'),
    DL_SUBTITLE: translate('publish_settings.dashboard_settings.trigger_shortcut.dl_subtitle'),
    SUB_TITLE:
      translate('publish_settings.dashboard_settings.trigger_shortcut.subtitle'),
    CARD_TEXT: { // for common component
      ACTIONS: {
        ADD: translate('publish_settings.dashboard_settings.trigger_shortcut.add_new'),
      },
      FIELDS_CONFIGURED: translate('publish_settings.dashboard_settings.trigger_shortcut.fields_configured'),
    },
    EDIT_LABEL: translate('publish_settings.dashboard_settings.trigger_shortcut.edit_label'),
    DELETE_LABEL: translate('publish_settings.dashboard_settings.trigger_shortcut.delete_label'),
  },
};
};
export const SETTINGS_PAGE_TAB = {
  SECURITY: 0,
  DASHBOARD: 1,
  ADDON: 2,
  LANGUAGE: 3,
};

export const getStepperDetails = (onClick, localeList = []) => {
  const stepperDetails = [
    {
      text: translate('publish_settings.page_stepper_strings.security_settings'),
      onClick: () => onClick(0),
    },
    {
      text: translate('publish_settings.page_stepper_strings.dashboard_settings'),
      onClick: () => onClick(1),
    },
    {
      text: translate('publish_settings.page_stepper_strings.addon_settings'),
      onClick: () => onClick(2),
    },
  ];

  if (!isEmpty(localeList)) {
    stepperDetails.push({
      text: translate('publish_settings.page_stepper_strings.langauge_settings'),
      onClick: () => onClick(3),
    });
  }

  return stepperDetails;
};

export const SECURITY_SETTINGS_STRINGS = {
  FLOW_ADMINS: {
    LABEL: translate('publish_settings.security_settings.flow_admins.label'),
  },
  FLOW_OWNERS: {
    LABEL: translate('publish_settings.security_settings.flow_owners.label'),
    REQUIRED_ERROR: translate('publish_settings.security_settings.flow_owners.required_error'),
  },
};

export const validateLanguageTranslationFlowData = (translationData = [], t = translateFunction, locale) => {
  const errorList = {};
  let validationSchema = {};
  translationData?.forEach((data) => {
    const localeValue = data?.[locale];
    if (!isEmpty(localeValue)) {
      switch (true) {
        case data?.key?.includes('flow_name'):
          validationSchema = FLOW_NAME_VALIDATION.label(
            t(FLOW_STRINGS.BASIC_INFO.FLOW_NAME.LABEL),
          );
        break;
        case data?.key?.includes('flow_description'):
        validationSchema = FLOW_DESCRIPTION_VALIDATION.label(
          t(FLOW_STRINGS.BASIC_INFO.FLOW_NAME.LABEL),
        );
        break;
        case data?.key?.includes('step_name'):
        validationSchema = STEP_NAME_VALIDATION.label(
          t(FLOW_STRINGS.BASIC_INFO.FLOW_NAME.LABEL),
        );
        break;
        case data?.key?.includes('step_description'):
        validationSchema = STEP_DESCRIPTION_VALIDATION(t).label(
          t(FLOW_STRINGS.BASIC_INFO.FLOW_NAME.LABEL),
        );
        break;
        case data?.key?.includes('section_name'):
        validationSchema = SECTION_NAME_VALIDATION.label(SECTION_TITLE.LABEL);
        break;
        case data?.key?.includes('field_name'):
        validationSchema = FIELD_NAME_VALIDATION.label(t(FIELD_NAME.LABEL));
        break;
        case data?.key?.includes('table_name'):
        validationSchema = Joi.string()
        .min(FORM_MIN_MAX_CONSTRAINTS.TABLE_NAME_MIN_VALUE)
        .max(FORM_MIN_MAX_CONSTRAINTS.TABLE_NAME_MAX_VALUE);
        break;
        case data?.key?.includes('help_text'):
        validationSchema = HELP_TEXT;
        break;
        case data?.key?.includes('instructions'):
        validationSchema = INSTRUCTIONS;
        break;
        case data?.key?.includes('place_holder'):
        validationSchema = PLACE_HOLDER;
        break;
        case data?.key?.includes('action'):
        validationSchema =
        Joi.string()
        .min(FORM_MIN_MAX_CONSTRAINTS.TABLE_NAME_MIN_VALUE)
        .max(FORM_MIN_MAX_CONSTRAINTS.TABLE_NAME_MAX_VALUE)
        .label(t('flow_dashboard.pd_summary_strings.action'));
        break;
        default: break;
      }
      const newErrorList = validate(data?.[locale]?.trim(), validationSchema);
      if (!isEmpty(newErrorList)) {
        const errorMessage = newErrorList?.[Object?.keys?.(newErrorList)?.[0]];
        if (errorMessage) {
          errorList[data?.newKey] = errorMessage;
        }
      }
    }
  });
  return errorList;
};
