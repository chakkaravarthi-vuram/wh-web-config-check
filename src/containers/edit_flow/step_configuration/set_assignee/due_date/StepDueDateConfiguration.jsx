import React from 'react';
import FieldValueRuleConfig from '../../../../form_configuration/field_value/field_value_rule_config/FieldValueRuleConfig';
import { RULE_TYPE } from '../../../../../utils/constants/rule/rule.constant';

function StepDueDateConfiguration(props) {
  return (
    <FieldValueRuleConfig
      isModalOpen
      ruleType={RULE_TYPE.DUE_DATA}
      {...props}
    />
  );
}

export default StepDueDateConfiguration;
