import { staticValueSchema } from '../../containers/edit_flow/step_configuration/StepConfiguration.validations';
import { SEND_DATA_TO_DATALIST } from '../../containers/edit_flow/step_configuration/configurations/Configuration.constants';
import { FIELD_TYPE } from '../../utils/constants/form.constant';
import { translateFunction } from '../../utils/jsUtility';
import { AUTOMATION_SYSTEM_FIELD_MAPPING_ERRORS, FLOW_ACTION_VALUE_TYPE, SCHEDULAR_CONSTANTS } from './AutomatedSystems.constants';
import { AUTOMATED_SYSTEM_CONSTANTS } from './AutomatedSystems.strings';

const Joi = require('joi');

const rowLevelBasisMappingSchema = (t = translateFunction) => {
    const {
            FIELDS_IN_DATALIST,
            FIELDS_IN_FLOW,
            VALUE_TYPE: VALUE_TYPE_LABEL,
        } = AUTOMATED_SYSTEM_CONSTANTS(t).COMMON_AUTOMATED_STRINGS;
    return Joi.object().keys({
        flowFieldType: Joi.when('valueType', {
            is: FLOW_ACTION_VALUE_TYPE.DYNAMIC,
            then: Joi.when('dataListFieldType', {
                is: Joi.valid(...SEND_DATA_TO_DATALIST.FIELD_MATCH_CATEGORY.CATEGORY_1),
                then: Joi.string().valid(...SEND_DATA_TO_DATALIST.FIELD_MATCH_CATEGORY.CATEGORY_1),
                otherwise: Joi.when('dataListFieldType', {
                    is: Joi.valid(...SEND_DATA_TO_DATALIST.FIELD_MATCH_CATEGORY.CATEGORY_2),
                    then: Joi.string().valid(...SEND_DATA_TO_DATALIST.FIELD_MATCH_CATEGORY.CATEGORY_2),
                    otherwise: Joi.string().valid(Joi.ref('dataListFieldType')).label('Datalist Field'),
                }),
            }).messages({
                'any.only': `${t(AUTOMATION_SYSTEM_FIELD_MAPPING_ERRORS.TYPE_MISMATCH_TEXT)} ({{flowFieldType}})`,
            }),
            otherwise: Joi.string().required().valid(...Object.values(FIELD_TYPE)).label(FIELDS_IN_FLOW),
        }),
        flowFieldUUID: Joi.when('flowFieldType', {
            is: Joi.string().invalid(FIELD_TYPE.TABLE),
            then: Joi.string().required().label(FIELDS_IN_FLOW),
            otherwise: Joi.optional(),
        }),
        flowTableUUID: Joi.when('flowFieldType', {
            is: Joi.string().valid(FIELD_TYPE.TABLE),
            then: Joi.string().required().label(FIELDS_IN_FLOW),
            otherwise: Joi.optional(),
        }),

         // Value Type
        valueType: Joi.string().required().valid(...Object.values(FLOW_ACTION_VALUE_TYPE)).label(VALUE_TYPE_LABEL),

        // Dynamic, System - value type
        dataListFieldType: Joi.when('valueType', {
            is: Joi.string().valid(FLOW_ACTION_VALUE_TYPE.DYNAMIC),
            then: Joi.string().required().valid(...Object.values(FIELD_TYPE)).label(FIELDS_IN_DATALIST),
            otherwise: Joi.optional(),
        }),
        dataListFieldUUID: Joi.when('valueType', {
            is: Joi.string().valid(FLOW_ACTION_VALUE_TYPE.DYNAMIC, FLOW_ACTION_VALUE_TYPE.SYSTEM),
            then: Joi.when('dataListFieldType', {
                is: Joi.string().invalid(FIELD_TYPE.TABLE),
                then: Joi.string().required().label(FIELDS_IN_DATALIST),
                otherwise: Joi.optional(),
            }),
            otherwise: Joi.optional(),
        }),
        dataListTableUUID: Joi.when('valueType', {
            is: Joi.string().valid(FLOW_ACTION_VALUE_TYPE.DYNAMIC),
            then: Joi.when('dataListFieldType', {
                is: Joi.string().valid(FIELD_TYPE.TABLE),
                then: Joi.string().required().label(FIELDS_IN_DATALIST),
                otherwise: Joi.optional(),
            }),
            otherwise: Joi.optional(),
        }),

         // Static - value type
         staticValue: Joi.when('valueType', {
            is: Joi.string().valid(FLOW_ACTION_VALUE_TYPE.STATIC),
            then: staticValueSchema(t, null, 'flowFieldType', { isOnlyRequired: true }),
            otherwise: Joi.optional(),
         }),
    });
};
export const overallRowLevelMappingSchema = (t = translateFunction) => {
    const rowLevelSchema = rowLevelBasisMappingSchema(t);
    return rowLevelSchema.append({
        fieldMapping: Joi.when('flowFieldType', {
            is: Joi.string().valid(FIELD_TYPE.TABLE),
            then: Joi.array().items(rowLevelBasisMappingSchema(t)).required(),
            otherwise: Joi.optional(),
        }),
    });
};

export const automatedTriggerBasicSchema = (t = translateFunction) => {
    const AUTOMATION_VALIDATION = AUTOMATED_SYSTEM_CONSTANTS(t)?.VALIDATION;

    return {
        eventType: Joi.number().valid(SCHEDULAR_CONSTANTS.TRIGGER_TYPE.SCHEDULER, SCHEDULAR_CONSTANTS.TRIGGER_TYPE.FIELD_VALUE_CHANGE).default(SCHEDULAR_CONSTANTS.TRIGGER_TYPE.SCHEDULER),
        schedulerType: Joi.when('eventType', {
            is: SCHEDULAR_CONSTANTS.TRIGGER_TYPE.SCHEDULER,
            then: Joi.string().valid(SCHEDULAR_CONSTANTS.TYPE.DAY, SCHEDULAR_CONSTANTS.TYPE.MONTH).label(AUTOMATION_VALIDATION.TRIGGER_TYPE_FREQ).required(),
            otherwise: Joi.forbidden(),
        }),
        schedulerTimeAt: Joi.when('eventType', {
            is: SCHEDULAR_CONSTANTS.TRIGGER_TYPE.SCHEDULER,
            then: Joi.string().label(AUTOMATION_VALIDATION.START_TIME).required(),
            otherwise: Joi.forbidden(),
        }),
        onDays: Joi.when('schedulerType', {
            is: SCHEDULAR_CONSTANTS.TYPE.DAY,
            then: Joi.array().label(AUTOMATION_VALIDATION.TRIGGER_DAY).required().min(1)
            .items(Joi.number().integer().min(1).max(7)),
            otherwise: Joi.forbidden(),
        }),
        repeatType: Joi.when('schedulerType', {
            is: SCHEDULAR_CONSTANTS.TYPE.MONTH,
            then: Joi.string()
            .label(AUTOMATION_VALIDATION.REPEAT_ON)
            .required(),
            otherwise: Joi.forbidden(),
        }),
        onDay: Joi.when('repeatType', {
            is: SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_WEEK_DAY, // selected week and day of the month
            then: Joi.number()
            .integer().min(1).max(7)
            .label(AUTOMATION_VALIDATION.TRIGGER_DAY)
            .required(),
            otherwise: Joi.forbidden(),
        }),
        onWeek: Joi.when('repeatType', {
            is: SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_WEEK_DAY, // selected week and day of the month
            then: Joi.number().integer()
            .min(1)
            .max(7)
            .label(AUTOMATION_VALIDATION.WEEK)
            .required(),
            otherwise: Joi.forbidden(),
        }),
        onDate: Joi.when('repeatType', {
            is: SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_DATE, // selected date of the month
            then: Joi.date().label(AUTOMATION_VALIDATION.DATE_OF_MONTH).required(),
            otherwise: Joi.forbidden(),
        }),
    };
};

const automatedSystemsSchema = (t = translateFunction) => {
    const AUTOMATION_VALIDATION = AUTOMATED_SYSTEM_CONSTANTS(t)?.VALIDATION;
    return (
        Joi.object().keys({
            ...automatedTriggerBasicSchema(t),
            monitoringField: Joi.when('eventType', {
               is: SCHEDULAR_CONSTANTS.TRIGGER_TYPE.FIELD_VALUE_CHANGE,
               then: Joi.string().label(AUTOMATION_VALIDATION.TRIGGER_FIELD).required(),
               otherwise: Joi.forbidden(),
            }),
            conditionType: Joi.number().integer()
            .valid(SCHEDULAR_CONSTANTS.CONDITION_TYPE.ALL, SCHEDULAR_CONSTANTS.CONDITION_TYPE.CONDITION)
            .required(),
            condition: Joi.when('conditionType', {
                is: SCHEDULAR_CONSTANTS.CONDITION_TYPE.CONDITION,
                then: Joi.any(),
                otherwise: Joi.forbidden(),
            }),
            trigger: Joi.string().valid(SCHEDULAR_CONSTANTS.TRIGGER.FLOW, SCHEDULAR_CONSTANTS.TRIGGER.EMAIL).required(),
            flowActions: Joi.when('trigger', {
                is: SCHEDULAR_CONSTANTS.TRIGGER.FLOW,
                then: Joi.object().keys({
                    childFlowUUID: Joi.string().label(AUTOMATION_VALIDATION.FLOW).required(),
                    // triggerMapping: Joi.array().items(overallRowLevelMappingSchema(t)).optional(),
                }),
                otherwise: Joi.forbidden(),
            }),
            emailActions: Joi.when('trigger', {
                is: SCHEDULAR_CONSTANTS.TRIGGER.EMAIL,
                then: Joi.object(),
                otherwise: Joi.forbidden(),
            }),
        }).unknown()
    );
};

export { automatedSystemsSchema };
