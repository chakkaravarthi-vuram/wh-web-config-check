import Joi from 'joi';
import { DATALISTS_CREATE_EDIT_CONSTANTS } from '../../DatalistsCreateEdit.constant';
import { EDIT_BASIC_DETAILS } from '../../../data_list_landing/DatalistsLanding.constant';

// comments - can we split the repeated code into function and reuse those schema - userTeamSchema
export const securityDataValidationSchema = (t) => Joi.object().keys({
  addSecurity: Joi.object().keys({
    users: Joi.array().allow(null),
    teams: Joi.array().allow(null),
  })
  .or('users', 'teams')
  .required()
  .label(DATALISTS_CREATE_EDIT_CONSTANTS(t).SECURITY.ADD_NEW_DATA)
  .messages({
    'object.missing': t('validation_constants.utility_constant.one_user_team_required'),
  }),
  editSecurity: Joi.object().keys({
    specifiedMembers: Joi.bool(),
    members: Joi.when('specifiedMembers', {
      is: true,
      then: Joi.object().keys({
        users: Joi.array().allow(null),
        teams: Joi.array().allow(null),
      }).or('users', 'teams').required(),
      otherwise: Joi.object(),
    }).label(DATALISTS_CREATE_EDIT_CONSTANTS(t).SECURITY.EDIT_DATA_SPECIFIED)
    .messages({
      'object.missing': t('validation_constants.utility_constant.one_user_team_required'),
    }),
    sameAsAdd: Joi.bool(),
    isAllEntries: Joi.bool(),
  }).custom((value, helpers) => {
    if (!value.sameAsAdd && !value.specifiedMembers) {
        return helpers.error('object.bothFalse', { sameAsAdd: value.sameAsAdd, specifiedMembers: value.specifiedMembers });
    }
    return value;
  }).messages({
      'object.bothFalse': t('validation_constants.utility_constant.atleast_one_is_required'),
  }),
  deleteSecurity: Joi.object().keys({
    specifiedMembers: Joi.bool(),
    members: Joi.when('specifiedMembers', {
      is: true,
      then: Joi.object().keys({
        users: Joi.array().allow(null),
        teams: Joi.array().allow(null),
      }).or('users', 'teams').required(),
      otherwise: Joi.object(),
    }).label(DATALISTS_CREATE_EDIT_CONSTANTS(t).SECURITY.EDIT_DATA_SPECIFIED)
    .messages({
      'object.missing': t('validation_constants.utility_constant.one_user_team_required'),
    }),
    sameAsAdd: Joi.bool(),
    isAllEntries: Joi.bool(),
  }).custom((value, helpers) => {
    if (!value.sameAsAdd && !value.specifiedMembers) {
        return helpers.error('object.bothFalse', { sameAsAdd: value.sameAsAdd, specifiedMembers: value.specifiedMembers });
    }
    return value;
  }).messages({
      'object.bothFalse': t('validation_constants.utility_constant.atleast_one_is_required'),
  }),
  viewers: Joi.object().keys({
    users: Joi.array().allow(null),
    teams: Joi.array().allow(null),
  }),
  entityViewers: Joi.object().keys({
    users: Joi.array().allow(null),
    teams: Joi.array().allow(null),
  }),
  isRowSecurityPolicy: Joi.bool().optional(),
  security_policies: Joi.array().optional(),
  isParticipantsLevelSecurity: Joi.bool().optional(),
  dataListAdmins: Joi.object().keys({
    users: Joi.array().allow(null),
    teams: Joi.array().allow(null),
  })
  .or('users', 'teams')
  .required()
  .label(EDIT_BASIC_DETAILS(t).DATALIST_ADMINS.LABEL)
  .messages({
    'object.missing': t('validation_constants.utility_constant.one_user_team_required'),
  }),
  dataListOwners: Joi.object().keys({
    users: Joi.array().allow(null),
    teams: Joi.array().allow(null),
  })
  .or('users', 'teams')
  .required()
  .label(EDIT_BASIC_DETAILS(t).DATALIST_VIEWERS.LABEL)
  .messages({
    'object.missing': t('validation_constants.utility_constant.one_user_team_required'),
  }),
}).unknown(true);
