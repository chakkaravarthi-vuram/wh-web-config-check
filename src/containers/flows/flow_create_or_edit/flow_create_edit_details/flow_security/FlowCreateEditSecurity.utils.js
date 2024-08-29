import { cloneDeep } from 'lodash';
import { constructIndexingFields, validate } from '../../../../../utils/UtilityFunctions';
import { has, isEmpty } from '../../../../../utils/jsUtility';
import { constructConditionsforPostData, constructPolicyForResponse, validatePolicy } from '../../../../edit_flow/security/policy_builder/PolicyBuilder.utils';
import { flowSecuritySchema } from '../../FlowCreateEdit.schema';

export const formatUserFields = (userTeam) => {
  const _userTeam = {};
  if (!isEmpty(userTeam?.users)) _userTeam.users = userTeam.users.map((u) => u._id);
  if (!isEmpty(userTeam?.teams)) _userTeam.teams = userTeam.teams.map((u) => u._id);
  return _userTeam;
};

export const constructSaveFlowForSecurity = (state) => {
  const { security } = state;
  const postData = {};

  const _security = {
    admins: formatUserFields(security.admins),
    owners: formatUserFields(security.owners),
    is_participants_level_security: security.isParticipantsLevelSecurity || false,
    is_row_security_policy: false,
  };

  if (security.isRowSecurityPolicy) {
    _security.is_row_security_policy = true;
    _security.security_policies = security.securityPolicies.map((sp) => {
      const policy = {
        policy_uuid: sp.policy_uuid,
        type: sp.type,
      };

      if (sp.type === 'condition') {
        policy.access_to = {
          user_team: formatUserFields(sp.access_to?.user_team),
        };
        policy.policy = {
          conditions: constructConditionsforPostData(sp.policy.conditions),
          logical_operator: sp.policy.logical_operator,
        };
      } else {
        policy.access_to = { field_uuids: [] };
        sp.access_to?.field_uuids?.forEach((f) => {
          if (f.key) policy.access_to.field_uuids.push(f.key);
        });
      }

      return policy;
    });
  }

  if (security.entityViewers?.teams || security.entityViewers?.users) {
    _security.entity_viewers = formatUserFields(security.entityViewers);
  }

  if (security.initiators?.teams || security.initiators?.users) {
    _security.initiators = formatUserFields(security.initiators);
  }

  if (security.viewers?.teams || security.viewers?.users) {
    _security.viewers = formatUserFields(security.viewers);
  }

  postData.security = _security;
  return postData;
};

export const deconstructFlowSecurityData = (data) => {
  const security = { ...data.security };
  delete security.participants;

  if (!has(security, ['isParticipantsLevelSecurity'])) {
      security.isParticipantsLevelSecurity = true;
      }
  if (!has(security, ['isRowSecurityPolicy'])) {
      security.isRowSecurityPolicy = false;
  }

  if (!isEmpty(security.securityPolicies)) {
    security.securityPolicies = constructPolicyForResponse(security.securityPolicies, constructIndexingFields(data.policy_fields));
  }

  security.hasAutoTrigger = data?.hasAutoTrigger;

  return security;
};

export const validateFlowSecurity = (security, t) => {
    const securityData = cloneDeep(security);
    delete securityData.securityPolicies;
    delete securityData.entityViewers;
    delete securityData.errorList;
    delete securityData.viewers;

    const errors = validate(securityData, flowSecuritySchema(t));
    let _validatedPolicyList = null;
    if (security.isRowSecurityPolicy) {
      const {
        validatedPolicyList,
        isAnyPolicyHasValidation,
        userFieldPolicyErrorList,
        commonErrorList,
      } = validatePolicy(security.securityPolicies);

      if (isAnyPolicyHasValidation) {
        errors.isAnyPolicyHasValidation = isAnyPolicyHasValidation;
        _validatedPolicyList = validatedPolicyList;
        errors.userFieldPolicyErrorList = userFieldPolicyErrorList;
        errors.commonErrorList = commonErrorList;
      }
    }

    return { errors, validatedPolicyList: _validatedPolicyList };
};
