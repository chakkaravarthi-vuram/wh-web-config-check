const { ROLES } = require('../../../../../../utils/Constants');
const {
  STRING_VALIDATION,
  OBJECT_VALIDATION,
} = require('../../../../../../utils/ValidationConstants');

export const SCHEMA_CONSTANTS = Object.freeze({
  EMAIL: STRING_VALIDATION.email({ tlds: false }),
  USER_PERMISSION: STRING_VALIDATION.valid(
    ROLES.ADMIN,
    ROLES.FLOW_CREATOR,
    ROLES.MEMBER,
  ),
  REPORTING_MANAGER: OBJECT_VALIDATION,
});
