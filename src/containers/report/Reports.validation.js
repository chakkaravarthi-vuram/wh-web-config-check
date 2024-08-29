import Joi from 'joi';
import {
  STRING_VALIDATION,
  constructJoiObject,
} from '../../utils/ValidationConstants';
import jsUtility from '../../utils/jsUtility';
import { validate } from '../../utils/UtilityFunctions';
import CONFIG_PANEL_STRINGS from './report_creation/config_panel/ConfigPanel.strings';
import { REPORT_CATEGORY_TYPES, REPORT_STRINGS } from './Report.strings';
import { START_WITH_ONLY_ALPHABETS_REGEX } from '../../utils/strings/Regex';
import { FLOW_MIN_MAX_CONSTRAINT } from '../../utils/Constants';

export const CREATE_REPORT_VALIDATION_SCHEMA = () =>
  constructJoiObject({
    primaryDataSource: STRING_VALIDATION.required().label('Primary Source'),
    secondaryDataSource: Joi.when('isAddOneMore', {
      is: true,
      then: STRING_VALIDATION.required(),
      otherwise: Joi.optional(),
    }).label('Secondary Source'),
    primaryField: Joi.when('isAddOneMore', {
      is: true,
      then: STRING_VALIDATION.required(),
      otherwise: Joi.optional(),
    }).label('Primary Field'),
    secondaryField: Joi.when('isAddOneMore', {
      is: true,
      then: STRING_VALIDATION.required(),
      otherwise: Joi.optional(),
    }).label('Secondary Field'),
    isAddOneMore: Joi.optional(),
  });

export const axisValidateSchema = (axis) => {
  const axisSchema = constructJoiObject({
    [`${axis}_axis`]: Joi.array()
      .items(
        Joi.object({
          axis: Joi.string().required().equal(axis),
        }).unknown(true),
      )
      .min(1)
      .required()
      .label(`${axis} axis`),
  });
  return axisSchema;
};

export const savePublishReportValidation = (report_category, reports, t) => {
  const { COLUMNS } = CONFIG_PANEL_STRINGS(t);
  let error_list = {};
  const { selectedFieldsFromReport } = jsUtility.cloneDeep(reports);

  if (report_category === REPORT_CATEGORY_TYPES.CHART) {
    const validateSchemaX = axisValidateSchema('x');
    const validateSchemaY = axisValidateSchema('y');
    const validateX = {
      x_axis: selectedFieldsFromReport.filter((d) => d.axis === 'x'),
    };
    const validateY = {
      y_axis: selectedFieldsFromReport.filter((d) => d.axis === 'y'),
    };
    const xError = validate(validateX, validateSchemaX);
    const yError = validate(validateY, validateSchemaY);
    error_list = { ...xError, ...yError };
  } else {
    const validateSchema = constructJoiObject({
      selectedFieldsFromReport: Joi.array()
        .items()
        .min(1)
        .required()
        .label(COLUMNS),
    });
    const validateObject = { selectedFieldsFromReport };
    const errors = validate(validateObject, validateSchema);
    error_list = { ...errors };
  }

  return error_list;
};

export const securityDetailsValidation = (reportConfig, t) => {
  const {
    REPORT_CREATION: { SECURITY },
  } = REPORT_STRINGS(t);
  const data = {
    report_name: reportConfig.name,
    report_description: reportConfig.description,
    report_admins: [...reportConfig.admins.users, ...reportConfig.admins.teams],
    report_viewers: [
      ...reportConfig.viewers.users,
      ...reportConfig.viewers.teams,
    ],
  };

  const securityDetailsSchema = constructJoiObject({
    report_name: Joi.string()
      .required()
      .min(1)
      .max(255)
      .label(SECURITY.NAME.LABEL),
    report_description: Joi.string()
      .allow(null, '')
      .min(1)
      .max(2000)
      .label(SECURITY.DESCRIPTION.LABEL),
    report_admins: Joi.array()
      .items()
      .min(1)
      .required()
      .label(SECURITY.ADMINS.LABEL),
    report_viewers: Joi.array()
      .items()
      .min(1)
      .required()
      .label(SECURITY.VIEWERS.LABEL),
  });

  const errors = validate(data, securityDetailsSchema);
  return errors;
};

export const fieldAddReportValidateSchema = constructJoiObject({
  fieldDisplayNameSelectedValue: Joi.string()
    .regex(START_WITH_ONLY_ALPHABETS_REGEX)
    .required()
    .min(FLOW_MIN_MAX_CONSTRAINT.FIELD_NAME_MIN_VALUE)
    .max(FLOW_MIN_MAX_CONSTRAINT.FIELD_NAME_MAX_VALUE)
    .label('Label'),
});
export const constructValidationData = (data) => {
  const constructedData = data.map((item) => {
    return {
      label: item.label,
      leftRange: item.boundary[0] !== undefined ? item.boundary[0] : null,
      rightRange: item.boundary[1] !== undefined ? item.boundary[1] : null,
      index: item.index,
    };
  });
  return constructedData;
};
export const dataSchema = Joi.array().items(
  Joi.object({
    label: Joi.string().required().min(1).label('Label'),
    leftRange: Joi.number().required().label('Left Range'),
    rightRange: Joi.number().required().label('Right Range'),
    index: Joi.number().required().label('Index is required'),
  }),
);
