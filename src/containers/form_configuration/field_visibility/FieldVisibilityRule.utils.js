import React from 'react';
import { cloneDeep } from 'lodash';
import Joi from 'joi';
import { CBConditionType } from '@workhall-pvt-lmt/wh-ui-library';
import { store } from '../../../Store';
import { getAllFieldsOperator, getVisibilityExternalFieldsDropdownList } from '../../../redux/reducer';
import { constructRuleDataForFinalSubmission, expressionValidator, hasValidation } from '../../../components/condition_builder/ConditionBuilder.utils';
import { constructJoiObject } from '../../../utils/ValidationConstants';
import { clearAlertPopOverStatus, updateAlertPopverStatus, validate } from '../../../utils/UtilityFunctions';
import { EXPRESSION_TYPE, RULE_TYPE } from '../../../utils/constants/rule/rule.constant';
import { replaceEncodeWithDecodedUUID } from '../../../components/formula_builder/formula_tokenizer_utils/formulaBuilder.utils';
import { getConfigurationRulePostData } from '../../../components/configuration_rule_builder/ConfigurationRuleBuilder.utils';
import UpdateConfirmPopover from '../../../components/update_confirm_popover/UpdateConfirmPopover';
import BigAlertIcon from '../../../assets/icons/BigAlertNew';
import { FIELD_VISIBILITY_STRINGS } from './FieldVisibilityRule.strings';
import { getModuleIdByModuleType } from '../../form/Form.utils';
import { MODULE_TYPES } from '../../../utils/Constants';

export const BUILDER_TYPES = {
  CONDITIONAL: 0,
  EXPRESSION: 1,
  CONFIGURATION_RULE: 2,
};

export const FIELD_VISIBILITY_HEADER_STRINGS = {
  FIELD_NAME: 'default_value_rule_strings.field_visibility_header_strings.field_name',
  CONFIG_TYPE: 'default_value_rule_strings.field_visibility_header_strings.config_type',
  HIDE_OR_DISABLE: 'default_value_rule_strings.field_visibility_header_strings.hide_or_disable',
  RULE_NAME: 'default_value_rule_strings.field_visibility_header_strings.rule_name',
};

export const RULE_BUILDER_OPTIONS = [
  {
    label: 'Condition Builder',
    value: 0,
  },
  {
    label: 'Expression Builder',
    value: 1,
  },
];

export const HIDE_DISABLE_OPTIONS = [
  {
    label: 'Hide field',
    value: true,
  },
  {
    label: 'Disable field',
    value: false,
  },
];

export const validateVisibilityRuleCondition = (expression, systemFields = []) => {
  const store_data = store.getState();
  const allFieldOperator = getAllFieldsOperator(store_data);
  const external_fields = getVisibilityExternalFieldsDropdownList(store_data, null, false);

  const fieldList = [...external_fields, ...(systemFields || [])];

  const validated_expression = expressionValidator(
      cloneDeep(expression),
      fieldList || [],
      allFieldOperator || [],
    );
  const has_validation = hasValidation(validated_expression);
  return { has_validation, validated_expression: validated_expression.expression };
};

export const validateVisibilityBasicFields = (activeRule) => {
  const { ruleName } = activeRule;
  const validateObj = { ruleName: (ruleName || '').trim() };
  // const isNotDueDate = rule_type !== RULE_TYPE.DUE_DATA;
  const { MODAL } = FIELD_VISIBILITY_STRINGS();
  const validateSchema = constructJoiObject({
    ruleName: Joi.string().required().min(1).max(255)
      .label(MODAL.RULE_NAME),
    // ...(isFormConfiguration
    //   ? {
    //       selectedFields: Joi.array()
    //         .items()
    //         .min(1)
    //         .message(ERRORS.FIELD_REQUIRED)
    //         .required(),
    //     }
    //   : {}),
  });

  // if (isFormConfiguration) validateObj.selectedFields = selectedFields;
  return validate(validateObj, validateSchema);
};

export const constructSaveRuleData = (activeRule, metaData, moduleType, ruleType, isDataManipulatorRule = false) => {
  const { ruleExpression, ruleName, ruleType: builderType, ruleUUID } = activeRule;
  const moduleIdObj = getModuleIdByModuleType(metaData, moduleType);
  delete moduleIdObj.step_id;
  if (moduleType === MODULE_TYPES.SUMMARY) {
    delete moduleIdObj.dashboard_id;
    delete moduleIdObj.data_list_id;
    delete moduleIdObj.flow_id;
  }
  const data = {
    ...moduleIdObj,
    rule: {},
    rule_type: isDataManipulatorRule ? RULE_TYPE.DATA_MANIPULATOR_RULE : ruleType,
    rule_name: ruleName.trim(),
  };

  if (ruleType === RULE_TYPE.DUE_DATA) {
    data.step_uuid = [metaData.stepUUID];
  }

  if (ruleUUID) {
    data.rule_uuid = ruleUUID;
  }

  switch (builderType) {
    case BUILDER_TYPES.CONDITIONAL:
     data.rule = constructRuleDataForFinalSubmission(ruleExpression);
     // eslint-disable-next-line no-use-before-define
     data.rule = { ...data.rule, expression: getFormattedConditionalExpression(data.rule.expression) };
     break;
    case BUILDER_TYPES.EXPRESSION:
      data.rule = {
        expression_type: EXPRESSION_TYPE.FORMULA_EXPRESSION,
        expression: {
          input: replaceEncodeWithDecodedUUID(ruleExpression.expression),
        },
      };
     break;
    case BUILDER_TYPES.CONFIGURATION_RULE:
     data.rule = getConfigurationRulePostData(ruleExpression);
     break;
    default: break;
  }

  if (ruleType === RULE_TYPE.NEXT_STEP_ACTION) {
    data.rule.expression_type = EXPRESSION_TYPE.DECISION_EXPRESSION;
    data.step_uuid = [metaData.stepUUID];
  }

  return data;
};

export const getSelectedFields = (field_uuids = [], field_metadata = []) => {
  const selectedFields = [];
  field_uuids?.forEach((field_uuid) => {
    field_metadata.forEach((field) => {
      if (field.field_uuid === field_uuid) {
        selectedFields.push({
          id: field.field_uuid,
          label: field.field_name,
          value: field.field_uuid,
          type: field.field_type,
        });
      }
    });
  });
  return selectedFields;
};

export const getSelectedTables = (table_uuids = [], table_metadata = []) => {
  const selectedFields = [];
  table_uuids?.forEach((table_uuid) => {
    table_metadata.forEach((table) => {
      if (table.table_uuid === table_uuid) {
        selectedFields.push({
          id: table.table_uuid,
          label: table.table_name,
          value: table.table_uuid,
          type: table.field_list_type,
        });
      }
    });
  });
  return selectedFields;
};

export const confirmBuilderChangePopover = (cb, t) => {
  const { MODAL } = FIELD_VISIBILITY_STRINGS(t);
  updateAlertPopverStatus({
    isVisible: true,
    customElement: (
      <UpdateConfirmPopover
        alertIcon={<BigAlertIcon />}
        onYesHandler={() => {
          cb?.();
          clearAlertPopOverStatus();
        }}
        onNoHandler={clearAlertPopOverStatus}
        subTitle={MODAL.CONFIRM_BUILDER_TYPE_CHANGE}
      />
    ),
  });
};

export const getFormattedConditionalExpression = (expression) => {
    const updatedExpression = { ...expression };
    const { conditions } = expression;

    const updatedConditions = conditions.map((condition) => {
      if (condition.condition_type === CBConditionType.CONDITION) return condition;
      const clonedCondition = cloneDeep(condition);
      const expressions = [getFormattedConditionalExpression(condition.expression)];
      clonedCondition.expressions = expressions;
      delete clonedCondition.expression;
      return clonedCondition;
    });

    updatedExpression.conditions = updatedConditions;

    return updatedExpression;
  };

export const getDeFormattedConditionalExpression = (expression) => {
  const updatedExpression = { ...expression };
  const { conditions } = expression;

  const updatedConditions = conditions.map((condition) => {
    if (condition.condition_type === CBConditionType.CONDITION) return condition;
    const clonedCondition = cloneDeep(condition);
    const expression = getDeFormattedConditionalExpression(condition.expressions[0]);
    clonedCondition.expression = expression;
    delete clonedCondition.expressions;
    return clonedCondition;
  });

  updatedExpression.conditions = updatedConditions;

  return updatedExpression;
};
