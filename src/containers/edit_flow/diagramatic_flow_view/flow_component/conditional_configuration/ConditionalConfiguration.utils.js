import { pick, get, uniqBy, isEmpty } from 'utils/jsUtility';
import {
  FIELD_IDS,
  POST_DATA_KEYS,
} from './ConditionalConfiguration.constants';
import { constructRuleForPostData } from '../../../../form/form_builder/form_footer/form_footer_config/FormFooterConfig.utils';
import { FORM_ACTION_TYPES } from '../../../../form/form_builder/form_footer/FormFooter.constant';
import { conditionalConfigValidationSchema } from './ConditionalConfiguration.validation.schema';
import { validate } from '../../../../../utils/UtilityFunctions';

export const constructSaveStepActionValidateData = ({ forwardActions, t }) => {
  let hasErrorValidation = false;

  const validatedActions = forwardActions?.map((eachAction) => {
    const dataToBeValidated = pick(eachAction, [
      FIELD_IDS.ACTION_UUID,
      FIELD_IDS.NEXT_STEP_UUID,
      FIELD_IDS.IS_NEXT_STEP_RULE,
      FIELD_IDS.NEXT_STEP_RULE_CONTENT,
    ]);

    const errorList = validate(
      dataToBeValidated,
      conditionalConfigValidationSchema(t),
    );

    if (!isEmpty(errorList)) hasErrorValidation = true;

    return {
      ...eachAction,
      validationMessage: errorList,
    };
  });

  return {
    validatedActions,
    hasErrorValidation,
  };
};

export const constructEachActionPostData = (action = {}) => {
  const connectedSteps = [];

  const actions = {
    [POST_DATA_KEYS.ACTION_UUID]: action[FIELD_IDS.ACTION_UUID],
    [POST_DATA_KEYS.ACTION_TYPE]: action[FIELD_IDS.ACTION_TYPE],
  };

  if (action[FIELD_IDS.ACTION_TYPE] === FORM_ACTION_TYPES.FORWARD) {
    if (action[FIELD_IDS.IS_NEXT_STEP_RULE]) {
      const [ruleContent, ruleContentConnectedSteps] = constructRuleForPostData(
        action[FIELD_IDS.NEXT_STEP_RULE_CONTENT],
        {},
      );
      actions[POST_DATA_KEYS.IS_NEXT_STEP_RULE] = true;
      actions[POST_DATA_KEYS.NEXT_STEP_RULE_CONTENT] = ruleContent;
      connectedSteps.push(...ruleContentConnectedSteps);
    } else {
      const nextStepUUID = get(action, [FIELD_IDS.NEXT_STEP_UUID], []);
      actions[POST_DATA_KEYS.IS_NEXT_STEP_RULE] = false;
      actions[POST_DATA_KEYS.NEXT_STEP_UUID] = nextStepUUID;
      connectedSteps.push({ step_uuid: nextStepUUID[0], style: 'step' });
    }
  }

  if (action[FIELD_IDS.ACTION_TYPE] === FORM_ACTION_TYPES.END_FLOW) {
    const nextStepUUID = get(action, [FIELD_IDS.NEXT_STEP_UUID], []);
    actions[POST_DATA_KEYS.NEXT_STEP_UUID] = nextStepUUID;
    connectedSteps.push({ step_uuid: nextStepUUID[0], style: 'step' });
  }

  return { actions, connectedSteps };
};

export const constructSaveStepActionPostData = ({
  currentStep,
  forwardActions,
  flowData,
}) => {
  let postData = pick(currentStep, ['_id', 'step_uuid']);

  postData = {
    ...postData,
    flow_id: flowData?.flow_id,
  };

  const allConnectedSteps = [];

  const modifiedActions = forwardActions?.map((eachAction) => {
    const { actions, connectedSteps } = constructEachActionPostData(eachAction);

    allConnectedSteps.push(...connectedSteps);

    return actions;
  });

  postData.actions = modifiedActions;

  postData.connected_steps = uniqBy(allConnectedSteps, (s) => s.step_uuid);

  return postData;
};
