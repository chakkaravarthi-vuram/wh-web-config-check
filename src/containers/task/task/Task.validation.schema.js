import { VALIDATION_CONSTANT } from 'utils/constants/validation.constant';
import i18next from 'i18next';
import { isEmpty, translateFunction } from 'utils/jsUtility';
import { validateFixedDateRanges } from 'components/form_builder/field_config/Field.validation.schema';
import moment from 'moment';
import { getUserProfileData } from 'utils/UtilityFunctions';
import { DATE } from 'utils/Constants';
import { LANDING_PAGE } from 'containers/landing_page/LandingPageTranslation.strings';
import {
  SECTION_NAME_VALIDATION,
  TASK_NAME_VALIDATION,
  TASK_DESCRIPTION_VALIDATION,
  STRING_VALIDATION,
} from '../../../utils/ValidationConstants';
import { TASK_STRINGS } from './Task.strings';
import {
  SECTION_TITLE,
} from '../../../components/form_builder/FormBuilder.strings';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

import formSchema, { layoutSectionSchema, publishSectionScheam } from '../../../validation/form/form.validation.schema';

import constants from './Task.validation.schema.constant';

const Joi = require('joi');

export const { commonFieldValidationSchema } = formSchema;
export const { formFieldSchema } = formSchema;
export const { sectionSchema } = formSchema;
export const { basicSectionSchema } = formSchema;

const assigneeSchema = Joi.object()
  .keys({
    teams: constants.TEAMS,
    users: constants.USERS,
  })
  .min(1);

const assigneeSchemaForTaskCreation = Joi.object()
  .keys({
    teams: constants.TEAMS,
    users: constants.USERS,
  });

export const dueDateSchema = () => {
  const userProfileData = getUserProfileData();
  const currentDateTime = userProfileData && userProfileData.pref_timezone ? moment.utc().tz(userProfileData.pref_timezone).format(DATE.UTC_DATE_WITH_TIME_STAMP) : moment.utc().format(DATE.UTC_DATE_WITH_TIME_STAMP);
  return STRING_VALIDATION.custom((value, helper) => {
    if (!isEmpty(value)) {
      const error = validateFixedDateRanges({ end_date: value, start_date: currentDateTime, sub_type: 'after', is_start_date: false, isDateTime: true, shouldBePresentTime: true, currentDateTime });
      if (error) return helper.message(error);
    }
    return value;
  }).allow(EMPTY_STRING, null).label(i18next.t('task_content.due_date'));
};

export const dueDateSchemaForTaskCreation = () => {
  console.log('dueDateSchemaForTaskCreation called');
  return STRING_VALIDATION.custom((value, helper) => {
    console.log(helper);
    return value;
  },
  ).allow(EMPTY_STRING).label(i18next.t('task_content.due_date'));
};

export const TASK_NAME_SCHEMA = TASK_NAME_VALIDATION.required().label(
  TASK_STRINGS.TASK_TITLE.LABEL,
);
export const TASK_DESCRIPTION_SCHEMA = TASK_DESCRIPTION_VALIDATION.allow(
  null,
  EMPTY_STRING,
).trim();

export const saveTaskSchema = Joi.object({
  task_name: TASK_NAME_VALIDATION.required().label(
    TASK_STRINGS.TASK_TITLE.LABEL,
  ),
  task_description: TASK_DESCRIPTION_VALIDATION.allow(
    null,
    EMPTY_STRING,
  ).trim(),
  due_date: dueDateSchema(),
});

export const taskDetailsValidateSchema = (t) => Joi.object().keys({
  form_title: constants.FORM_TITLE,
  form_description: constants.FORM_DESCRIPTION,
  sections: sectionSchema(t),
});

export const taskDetailsValidateSchemaWithOneSection = (t) => Joi.object().keys({
  form_title: constants.FORM_TITLE,
  form_description: constants.FORM_DESCRIPTION,
  sections: basicSectionSchema(t),
});

export const overallTaskDetailsValidateSchema = (t) => (
  Joi.object().keys({
    task_name: TASK_NAME_VALIDATION.required().label(
      t(TASK_STRINGS.TASK_TITLE.LABEL),
    ),
    task_description: TASK_DESCRIPTION_VALIDATION.allow(
      null,
      EMPTY_STRING,
    ).trim(),
    due_date: dueDateSchema(),
    sections: layoutSectionSchema(t),
    assignees: assigneeSchema,
  }));

export const overallTaskDetailsWithSingleSectionSchema = Joi.object().keys({
  task_name: TASK_NAME_VALIDATION.required().label(
    TASK_STRINGS.TASK_TITLE.LABEL,
  ),
  task_description: TASK_DESCRIPTION_VALIDATION.allow(
    null,
    EMPTY_STRING,
  ).trim(),
  due_date: dueDateSchema(),
  sections: basicSectionSchema,
  assignees: assigneeSchema,
});

export const basicDetailsValidateSchema = (t) => (
  Joi.object().keys({
    task_name: TASK_NAME_VALIDATION.required().label(
      t(TASK_STRINGS.TASK_TITLE.LABEL),
    ).messages({ 'string.empty': `${t(TASK_STRINGS.TASK_TITLE.LABEL)} ${t(VALIDATION_CONSTANT.IS_REQUIRED)}` }),
    task_description: TASK_DESCRIPTION_VALIDATION.allow(null, EMPTY_STRING).label(
      t(LANDING_PAGE.TASK_DESCRIPTION),
    ),
    assignees: assigneeSchema,
    due_date: dueDateSchema(),
  }));

export const basicDetailsValidateSchemaForTaskCreation = (t) => (
  Joi.object().keys({
    task_name: TASK_NAME_VALIDATION.required().label(
      t(TASK_STRINGS.TASK_TITLE.LABEL),
    ).messages({ 'string.empty': `${t(TASK_STRINGS.TASK_TITLE.LABEL)} ${t(VALIDATION_CONSTANT.IS_REQUIRED)}` }),
    task_description: TASK_DESCRIPTION_VALIDATION.allow(null, EMPTY_STRING).label(
      t(LANDING_PAGE.TASK_DESCRIPTION),
    ),
    assignees: assigneeSchemaForTaskCreation,
    due_date: Joi.any(),
  }));

export const saveBasicDetailsValidateSchema = (t = translateFunction) => Joi.object().keys({
  task_name: TASK_NAME_VALIDATION.required().label(
    t(TASK_STRINGS.TASK_TITLE.LABEL),
  ).messages({ 'string.empty': `${t(TASK_STRINGS.TASK_TITLE.LABEL)} ${t(VALIDATION_CONSTANT.IS_REQUIRED)}` }),
  task_description: TASK_DESCRIPTION_VALIDATION.allow(null, EMPTY_STRING).label(
    t(LANDING_PAGE.TASK_DESCRIPTION)),
  assignees: assigneeSchema.allow(null, {}),
  due_date: dueDateSchema(),
});

export const publishSectionValidateSchema = Joi.object().keys({
  sections: publishSectionScheam,
});

export const basicDetailsKeys = ['task_name', 'task_description', 'assignees'];

export const overallTaskDetailsValidateSchemaWithoutForm = (t = translateFunction) => Joi.object().keys({
  task_name: TASK_NAME_VALIDATION.required().label(
    TASK_STRINGS.TASK_TITLE.LABEL,
  ),
  task_description: TASK_DESCRIPTION_VALIDATION.allow(null, EMPTY_STRING).label(t(LANDING_PAGE.TASK_DESCRIPTION)),
  assignees: assigneeSchema,
  due_date: dueDateSchema(),
});

export const sectionTitleValidateSchema = Joi.object().keys({
  section_name: SECTION_NAME_VALIDATION.required().label(SECTION_TITLE.LABEL),
});
