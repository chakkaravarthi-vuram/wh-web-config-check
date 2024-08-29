import i18next from 'i18next';
import { validate } from '../../../../../utils/UtilityFunctions';
import { get, isEmpty, pick, uniqBy } from '../../../../../utils/jsUtility';
import { FOOTER_PARAMS_ID, FOOTER_PARAMS_POST_DATA_ID, FORM_ACTION_TYPES } from '../FormFooter.constant';
import { formFooterBasicConfigValidationSchema } from '../../../../../validation/form/form.validation.schema';
import { RULE_ESSENTIAL_KEY } from '../../../../../components/condition_builder/ConditionBuilder.strings';
import { validateRuleData } from '../../../../../components/condition_builder/ConditionBuilder.utils';
import { EMPTY_STRING, VALUE_REQUIRED_ERROR } from '../../../../../utils/strings/CommonStrings';
import { CONNECTOR_LINE_INIT_DATA } from '../../../../edit_flow/diagramatic_flow_view/flow_component/FlowComponent.constants';

export const validateRule = (expression = {}, enableRuleValidation = false) => {
    const { IF, CONDITION_EXPRESSION, OUTPUT_VALUE, ELSE_OUTPUT_VALUE } = RULE_ESSENTIAL_KEY;
    const lstIf = get(expression, [IF], []);
    const lstIfData = [];
    let hasValidation = false;

    // If Condition
    lstIf.map((conditionData) => {
        let condition_expression = conditionData[CONDITION_EXPRESSION];

        if (enableRuleValidation) {
            const validatedConditionObject = validateRuleData({ expression: conditionData[CONDITION_EXPRESSION] });
            condition_expression = validatedConditionObject.validated_expression;
            hasValidation = hasValidation || validatedConditionObject.has_validation;
        }

        const lstConditions = {
            [CONDITION_EXPRESSION]: condition_expression || {},
            [OUTPUT_VALUE]: conditionData[OUTPUT_VALUE],
        };

        if (isEmpty(lstConditions?.output_value)) {
            lstConditions.validationMessage = VALUE_REQUIRED_ERROR;
        }

        lstIfData.push(lstConditions);
        return null;
    });

    // Else Condition

    const nextStepRuleContent = {
        if: lstIfData,
        else_output_value: expression[ELSE_OUTPUT_VALUE],
    };

    if (isEmpty(nextStepRuleContent?.else_output_value)) {
        nextStepRuleContent.validationMessage = VALUE_REQUIRED_ERROR;
    }

    return {
        hasValidation,
        nextStepRuleContent,
    };
};

export const validateBasicConfiguration = (action = {}, t = i18next.t) => {
   const dataToBeValidated = pick(action, [
            FOOTER_PARAMS_ID.ACTION_LABEL,
            FOOTER_PARAMS_ID.ACTION_TYPE,
            FOOTER_PARAMS_ID.ALLOW_COMMENTS,
            FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE,
            FOOTER_PARAMS_ID.NEXT_STEP_UUID,
            FOOTER_PARAMS_ID.NEXT_STEP_RULE_CONTENT,
            FOOTER_PARAMS_ID.CONTROL_TYPE,
        ]);
    const validatedData = validate(dataToBeValidated, formFooterBasicConfigValidationSchema(t));
    return validatedData;
};

export const validateVisibilityConfiguration = (action = {}) => {
    const dataToBeValidated = pick(action, [
            FOOTER_PARAMS_ID.IS_CONDITION_RULE,
            FOOTER_PARAMS_ID.CONDITION_RULE,
        ]);
    const validatedResult = {};

    if (get(dataToBeValidated, [FOOTER_PARAMS_ID.IS_CONDITION_RULE], false)) {
        if (isEmpty(get(dataToBeValidated, [FOOTER_PARAMS_ID.CONDITION_RULE], null))) {
            validatedResult[FOOTER_PARAMS_ID.CONDITION_RULE] = VALUE_REQUIRED_ERROR;
        }
    }

    return validatedResult;
};

export const getRuleName = (rules, ruleUUID) => {
  if (isEmpty(rules) || !ruleUUID) return null;
  const rule = rules.find((r) => r.value === ruleUUID);
  return rule?.label || '';
};

export const constructRuleForPostData = (nextRuleData) => {
  const { IF, RULE_ID, OUTPUT_VALUE, ELSE_OUTPUT_VALUE, EXPRESSION } = FOOTER_PARAMS_ID;
  const lstIf = get(nextRuleData, [EXPRESSION, IF], []);
  const lstIfData = [];
  const connectedSteps = [];

  lstIf.forEach((condition) => {
    const data = {
      output_value: get(condition, [OUTPUT_VALUE], []),
      rule_uuid: get(condition, [RULE_ID]),
    };
    lstIfData.push(data);
    connectedSteps.push({
      ...CONNECTOR_LINE_INIT_DATA,
      destination_step: data.output_value[0],
    });
  });

  const ruleData = {
    expression: {
      if: lstIfData,
      else_output_value: get(nextRuleData, [EXPRESSION, ELSE_OUTPUT_VALUE], []),
   },
   expression_type: nextRuleData.expression_type,
  };

  connectedSteps.push({
    ...CONNECTOR_LINE_INIT_DATA,
    destination_step: ruleData.expression.else_output_value[0],
  });
  return [ruleData, connectedSteps];
};

export const constructActionPostData = (action = {}, metaData, connectedStepsData) => {
    const postData = {
        _id: metaData.stepId,
        flow_id: metaData.moduleId,
        step_uuid: metaData.stepUUID,
    };
  const connectedSteps = [];
  connectedStepsData.forEach((connectedStep) => {
    delete connectedStep.source_step;
    connectedSteps.push(connectedStep);
  });

  const actions = {
    [FOOTER_PARAMS_POST_DATA_ID.ACTION_LABEL]: get(action, [FOOTER_PARAMS_ID.ACTION_LABEL], EMPTY_STRING),
    [FOOTER_PARAMS_POST_DATA_ID.ACTION_TYPE]: get(action, [FOOTER_PARAMS_ID.ACTION_TYPE], EMPTY_STRING),
    [FOOTER_PARAMS_POST_DATA_ID.ALLOW_COMMENTS]: get(action, [FOOTER_PARAMS_ID.ALLOW_COMMENTS], EMPTY_STRING),
    [FOOTER_PARAMS_POST_DATA_ID.BUTTON_COLOR]: get(action, [FOOTER_PARAMS_ID.BUTTON_COLOR], EMPTY_STRING),
    [FOOTER_PARAMS_POST_DATA_ID.BUTTON_POSITION]: get(action, [FOOTER_PARAMS_ID.BUTTON_POSITION], EMPTY_STRING),
    [FOOTER_PARAMS_POST_DATA_ID.IS_CONDITION_RULE]: false,
  };

  if (get(action, [FOOTER_PARAMS_ID.ACTION_UUID])) {
    actions[FOOTER_PARAMS_POST_DATA_ID.ACTION_UUID] = action[FOOTER_PARAMS_ID.ACTION_UUID];
  }

  if (action[FOOTER_PARAMS_ID.ACTION_TYPE] === FORM_ACTION_TYPES.ASSIGN_REVIEW) {
    actions[FOOTER_PARAMS_POST_DATA_ID.CONTROL_TYPE] = get(action, [FOOTER_PARAMS_ID.CONTROL_TYPE]);
  }

  if (action[FOOTER_PARAMS_ID.ACTION_TYPE] === FORM_ACTION_TYPES.FORWARD) {
    if (action[FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE]) {
        const [ruleContent, ruleContentConnectedSteps] = constructRuleForPostData(action[FOOTER_PARAMS_ID.NEXT_STEP_RULE_CONTENT], {});
        actions[FOOTER_PARAMS_POST_DATA_ID.IS_NEXT_STEP_RULE] = true;
        actions[FOOTER_PARAMS_POST_DATA_ID.NEXT_STEP_RULE_CONTENT] = ruleContent;
        connectedSteps.push(...ruleContentConnectedSteps);
    } else {
        const nextStepUUID = get(action, [FOOTER_PARAMS_ID.NEXT_STEP_UUID], []);
        actions[FOOTER_PARAMS_POST_DATA_ID.IS_NEXT_STEP_RULE] = false;
        actions[FOOTER_PARAMS_POST_DATA_ID.NEXT_STEP_UUID] = nextStepUUID;
        connectedSteps.push({
          ...CONNECTOR_LINE_INIT_DATA,
          destination_step: nextStepUUID[0],
        });
    }
  }

  if (action[FOOTER_PARAMS_ID.ACTION_TYPE] === FORM_ACTION_TYPES.END_FLOW) {
    const nextStepUUID = get(action, [FOOTER_PARAMS_ID.NEXT_STEP_UUID], []);
    actions[FOOTER_PARAMS_POST_DATA_ID.NEXT_STEP_UUID] = nextStepUUID;
    connectedSteps.push({
      ...CONNECTOR_LINE_INIT_DATA,
      destination_step: nextStepUUID[0],
    });
  }
  // if (action[FOOTER_PARAMS_ID.ACTION_TYPE] === FORM_ACTION_TYPES.CANCEL) {
  //   const specialConnectorStep = connectedStepsData?.find((link) => link.source_point === NodeHandlerPosition.SPECIAL);
  //   if (!isEmpty(specialConnectorStep)) {
  //     // actions[FOOTER_PARAMS_POST_DATA_ID.NEXT_STEP_UUID] = specialConnectorStep?.destination_step;
  //     connectedSteps.push({
  //       ...CONNECTOR_LINE_INIT_DATA,
  //       ...specialConnectorStep,
  //     });
  //   }
  // }

  if (action[FOOTER_PARAMS_ID.IS_CONDITION_RULE]) {
    actions[FOOTER_PARAMS_POST_DATA_ID.IS_CONDITION_RULE] = true;
    actions[FOOTER_PARAMS_POST_DATA_ID.CONDITION_RULE] = action[FOOTER_PARAMS_ID.CONDITION_RULE][FOOTER_PARAMS_ID.RULE_ID];
  }

  const uniqueConnectedSteps = uniqBy(connectedSteps, (s) => s.destination_step);
  if (uniqueConnectedSteps.length > 0) postData.connected_steps = uniqueConnectedSteps;

  postData.actions = actions;
  // postData.connected_steps = connected_steps;
  return postData;
};
