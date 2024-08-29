import Joi from 'joi';
import DASHBOARD_CONFIG_STRINGS from './DashboardConfig.strings';

export const tableColumnConfigValidationSchema = (t = () => {}) =>
  Joi.object().keys({
    field_source: Joi.string(),
    field: Joi.string(),
    label: Joi.string()
      .required()
      .label(
        DASHBOARD_CONFIG_STRINGS(t).CONFIG_PANEL.TABLE_COLUMN_CONFIG.GENERAL
          .COLUMN_DETAILS.LABEL.LABEL,
      ),
    width: Joi.string()
      .required()
      .label(
        DASHBOARD_CONFIG_STRINGS(t).CONFIG_PANEL.TABLE_COLUMN_CONFIG.GENERAL
          .COLUMN_WIDTH.TITLE,
      ),
  });

export const dashboardConfigSaveSchema = (t = () => {}) =>
  Joi.object().keys({
    _id: Joi.string().required(),
    report: Joi.object().keys({
      table_columns: Joi.array()
        .min(1)
        .max(15)
        .required()
        .items(tableColumnConfigValidationSchema(t))
        .label(
          DASHBOARD_CONFIG_STRINGS(t).CONFIG_PANEL.FIELDS.TABLE_COLUMNS.LABEL,
        ),
      sorting: Joi.array()
        .min(1)
        .required()
        .items(
          Joi.object().keys({
            field_source: Joi.string()
              .required()
              .label(
                DASHBOARD_CONFIG_STRINGS(t).CONFIG_PANEL.FIELDS.SORTING.LABEL,
              ),
            field: Joi.string()
              .required()
              .label(
                DASHBOARD_CONFIG_STRINGS(t).CONFIG_PANEL.FIELDS.SORTING.LABEL,
              ),
            order: Joi.number()
              .required()
              .label(
                DASHBOARD_CONFIG_STRINGS(t).CONFIG_PANEL.FIELDS.SORTING.LABEL,
              ),
          }),
        ),
    }),
    features: Joi.object().keys({
      show_task_list: Joi.bool()
        .required()
        .label(
          DASHBOARD_CONFIG_STRINGS(t).CONFIG_PANEL.FIELDS.ADDITIONAL_CONFIG
            .LABEL,
        ),
      report_name: Joi.when('show_task_list', {
        is: true,
        then: Joi.string()
          .required()
          .label(
            DASHBOARD_CONFIG_STRINGS(t).CONFIG_PANEL.FIELDS.ADDITIONAL_CONFIG
              .INPUT_NAME,
          ),
        otherwise: Joi.optional(),
      }),
      show_download: Joi.bool()
        .required()
        .label(
          DASHBOARD_CONFIG_STRINGS(t).CONFIG_PANEL.FIELDS.ADDITIONAL_CONFIG
            .LABEL,
        ),
      show_submit: Joi.bool()
        .required()
        .label(
          DASHBOARD_CONFIG_STRINGS(t).CONFIG_PANEL.FIELDS.ADDITIONAL_CONFIG
            .LABEL,
        ),
      submit_button_label: Joi.when('show_submit', {
        is: true,
        then: Joi.string()
          .required()
          .label(
            DASHBOARD_CONFIG_STRINGS(t).CONFIG_PANEL.FIELDS.ADDITIONAL_CONFIG
              .INPUT_NAME,
          ),
        otherwise: Joi.optional(),
      }),
    }),
  });
