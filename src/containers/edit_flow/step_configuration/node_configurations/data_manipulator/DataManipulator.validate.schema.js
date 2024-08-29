import Joi from 'joi';
import { translateFunction } from '../../../../../utils/jsUtility';
import { RESPONSE_KEYS } from './DataManipulator.constants';
import {
  DATA_MANIPULATOR_ERRORS,
  DATA_MANIPULATOR_STEP_CONFIGURATION,
} from './DataManipulator.strings';
import { ARRAY_FIELDS } from './general/flow_field/FlowField.constants';
import { FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';

const {
    SOURCE_VALUE,
    CHILD_MAPPING,
    SOURCE_FIELD_TYPE,
    SOURCE_TYPE,
    OPERATOR,
    SAVE_TO,
    TABLE_COLUMN_MAPPING,
    MANIPULATION_DETAILS,
    IS_MULTIPLE,
  } = RESPONSE_KEYS;

export const manipulatorStepValidationSchema = (t = translateFunction, isSaveClicked = false) => Joi.object().keys({
  [MANIPULATION_DETAILS]: Joi.array().items(
    Joi.object().keys({
        [SAVE_TO]: Joi.when(SOURCE_TYPE, {
          is: DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[1].value,
          then: Joi.when(IS_MULTIPLE, {
            is: false,
            then: Joi.string().optional(),
            otherwise: Joi.string().required().label('Flow field'),
          }),
          otherwise: Joi.string().required().label('Flow field'),
        }),
        [IS_MULTIPLE]: Joi.bool().required(),
        allowDecimal: Joi.bool().optional(),
        [SOURCE_VALUE]: Joi.when(SOURCE_TYPE, {
          is: DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[4].value,
          then: Joi.when(SOURCE_FIELD_TYPE, {
            is: FIELD_TYPE.FILE_UPLOAD,
            then: Joi.object().keys({
              doc_ids: Joi.array().required().min(1).label('Source value'),
            })
            .label('Source value'),
            otherwise: Joi.when(SOURCE_FIELD_TYPE, {
              is: FIELD_TYPE.NUMBER,
              then: Joi.when('allowDecimal', {
                is: false,
                then: Joi.number().integer().required().label('Source value'),
                otherwise: Joi.number().required().label('Source value'),
              }),
              otherwise: Joi.when(SOURCE_FIELD_TYPE, {
                is: 'boolean',
                then: Joi.bool().required().label('Source value'),
                otherwise: Joi.when(SOURCE_FIELD_TYPE, {
                  is: 'object',
                  then: Joi.optional(),
                  otherwise: Joi.when(IS_MULTIPLE, {
                    is: true,
                    then: Joi.string().required().label('Source value'),
                    otherwise: Joi.string().optional().label('Source value'),
                  }),
                }),
              }),
            }),
          }),
          otherwise: Joi.string().required().label('Source value'),
        }),
        [OPERATOR]: Joi.string().required(),
        [SOURCE_TYPE]: Joi.string().required().label('Source type'),
        [SOURCE_FIELD_TYPE]: Joi.when(SOURCE_TYPE, {
          is: DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[4].value,
          then: Joi.string().required().label('Type'),
          otherwise: Joi.string().optional(),
        }),
        [CHILD_MAPPING]: Joi.when(SOURCE_FIELD_TYPE, {
          is: Joi.valid(...ARRAY_FIELDS),
          then: Joi.array().items(
            Joi.object().keys({
              [IS_MULTIPLE]: Joi.bool().required(),
              [SAVE_TO]: Joi.string().required().label('Flow field'),
              allowDecimal: Joi.bool().optional(),
              [SOURCE_VALUE]: Joi.when(SOURCE_TYPE, {
                is: DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[4].value,
                then: Joi.when(SOURCE_FIELD_TYPE, {
                  is: FIELD_TYPE.FILE_UPLOAD,
                  then: Joi.object().keys({
                    doc_ids: Joi.array().required().min(1).label('Source value'),
                  })
                  .label('Source value'),
                  otherwise: Joi.when(SOURCE_FIELD_TYPE, {
                    is: FIELD_TYPE.NUMBER,
                    then: Joi.when('allowDecimal', {
                      is: false,
                      then: Joi.number().integer().required().label('Source value'),
                      otherwise: Joi.number().required().label('Source value'),
                    }),
                    otherwise: Joi.when(SOURCE_FIELD_TYPE, {
                      is: 'boolean',
                      then: Joi.bool().required().label('Source value'),
                      otherwise: Joi.when(SOURCE_FIELD_TYPE, {
                        is: 'object',
                        then: Joi.forbidden(),
                        otherwise: Joi.string().required().label('Source value'),
                      }),
                    }),
                  }),
                }),
                otherwise: Joi.string().required().label('Source value'),
              }),
              [OPERATOR]: Joi.string().required(),
              [SOURCE_TYPE]: Joi.string().required().label('Source type'),
              [SOURCE_FIELD_TYPE]: Joi.when(SOURCE_TYPE, {
                is: DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[4].value,
                then: Joi.string().required().label('Type'),
                otherwise: Joi.string().optional(),
              }),
              [TABLE_COLUMN_MAPPING]: Joi.when(SOURCE_FIELD_TYPE, {
                is: Joi.valid(ARRAY_FIELDS[1], ARRAY_FIELDS[6]),
                then: Joi.array().items(
                  Joi.object().keys({
                      [SAVE_TO]: Joi.string().required().label('Flow field'),
                      [SOURCE_VALUE]: Joi.string().required().label('Source value'),
                      [OPERATOR]: Joi.string().required(),
                      [SOURCE_TYPE]: Joi.string().required().label('Source type'),
                      [SOURCE_FIELD_TYPE]: Joi.when(SOURCE_TYPE, {
                        is: DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[4].value,
                        then: Joi.string().required().label('Type'),
                        otherwise: Joi.string().optional(),
                      }),
                    }),
                ),
                otherwise: Joi.forbidden(),
              }),
              }),
          ),
          otherwise: Joi.forbidden(),
        }),
      }),
    ).min(1).required()
    .messages({
      'array.min': DATA_MANIPULATOR_ERRORS(t).MIN_ONE_REQUIRED,
    })
    .label(MANIPULATION_DETAILS),
    ...(isSaveClicked) ? basicNodeValidationSchema(t) : {},
});
