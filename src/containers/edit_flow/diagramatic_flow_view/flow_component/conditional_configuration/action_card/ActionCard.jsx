import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import { cloneDeep, isEmpty, get, set, pick } from 'utils/jsUtility';
import { RadioGroup, Skeleton, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import {
  flowSetStepData,
  updateFlowDataChange,
  updateFlowStateChange,
} from '../../../../../../redux/reducer/EditFlowReducer';
import { FLOW_STRINGS } from '../../../../EditFlow.strings';
import { MODULE_TYPES, STEP_TYPE } from '../../../../../../utils/Constants';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { getAllStepsListThunk } from '../../../../../../redux/actions/EditFlow.Action';
import styles from './ActionCard.module.scss';
import { ACTION_CONSTANTS } from './ActionCard.constants';
import { ACTION_TYPE } from '../../../../../../utils/constants/action.constant';
import { DATALIST_STRINGS } from '../../../../../form/external_source_data/ExternalSource.strings';
import StepPicker from '../../../../../form/form_builder/form_footer/form_footer_config/step_picker/StepPicker';
import CreateStepPopover from '../../../../../form/form_builder/form_footer/form_footer_config/next_step_rule_builder/create_step_popover/CreateStepPopover';
import {
  FIELD_IDS,
  POST_DATA_KEYS,
  getNextStepConditionRule,
} from '../ConditionalConfiguration.constants';
import { normalizer } from '../../../../../../utils/normalizer.utils';
import { getStepActionApi } from '../../../../../../axios/apiService/flow.apiService';
import NextStepRuleBuilder from '../../../../../form/form_builder/form_footer/form_footer_config/next_step_rule_builder/NextStepRuleBuilder';
import {
  conditionalConfigDataChange,
  useConditionalConfig,
} from '../useConditionalConfiguration';
import { getConditionalRulesApi } from '../../../../../../axios/apiService/rule.apiService';
import { getModuleIdByModuleType } from '../../../../../form/Form.utils';
import {
  updatePostLoader,
  validate,
} from '../../../../../../utils/UtilityFunctions';
import { conditionalConfigValidationSchema } from '../ConditionalConfiguration.validation.schema';

function ActionCard(props) {
  const {
    flowData,
    flowData: { steps = [], stepsList = [] },
    currentStepId,
    getAllSteps,
  } = props;

  const [rules, setRules] = useState({
    list: [],
    paginationDetails: {},
    loading: false,
  });

  const { state, dispatch } = useConditionalConfig();

  const { forwardActions, isActionLoading } = state;

  const { t } = useTranslation();

  const currentStep = steps?.find(
    (eachStep) => eachStep.step_uuid === currentStepId,
  );

  const metaData = {
    moduleId: flowData?.flow_id,
    moduleUUID: flowData?.flow_uuid,
    stepId: currentStep?._id,
  };

  let filteredEndStepList = [];
  let filteredForwardStepList = [];

  filteredForwardStepList = stepsList?.filter(
    (step) =>
      step.step_type === STEP_TYPE.USER_STEP ||
      step.step_type === STEP_TYPE.JOIN_STEP ||
      step.step_type === STEP_TYPE.PARALLEL_STEP ||
      step.step_type === STEP_TYPE.FLOW_TRIGGER ||
      step.step_type === STEP_TYPE.INTEGRATION,
  );

  filteredEndStepList = stepsList?.filter(
    (step) => step.step_type === STEP_TYPE.END_FLOW,
  );

  const getRules = ({ page = 1, customParams = {} }) => {
    const params = {
      page,
      size: 15,
      ...getModuleIdByModuleType(metaData, MODULE_TYPES.FLOW),
      ...customParams,
    };
    delete params.step_id;
    setRules({ ...rules, loading: true });
    getConditionalRulesApi(params)
      .then((data) => {
        const { pagination_data = [], pagination_details = [{}] } = data;
        const list = pagination_data.map((r) => {
          return {
            label: r.rule_name,
            value: r.rule_uuid,
            ...r,
          };
        });
        const paginationDetails = pagination_details[0];

        if (paginationDetails?.page === 1) {
          setRules(() => {
            return {
              list,
              loading: false,
              paginationDetails,
            };
          });
        } else {
          setRules(() => {
            return {
              list: [...rules.list, ...list],
              loading: false,
              paginationDetails,
            };
          });
        }
      })
      .catch(() => {
        setRules({ list: [], loading: false, paginationDetails: {} });
      });
  };

  useEffect(() => {
    if (isEmpty(currentStep)) return;

    getAllSteps(
      flowData.flow_id,
      currentStep?._id,
      undefined,
      true,
      currentStep?.coordinate_info,
    );

    updatePostLoader(true);
    dispatch(conditionalConfigDataChange({ isActionLoading: true }));
    getStepActionApi({
      step_id: currentStep?._id,
    })
      .then((res) => {
        updatePostLoader(false);
        const currentStepActions = res?.actions;
        const currentStepRules = res?.rule_data;

        const actionForwardOnly = [];
        currentStepActions?.forEach((eachAction = {}) => {
          if (
            eachAction?.action_type === ACTION_TYPE.FORWARD ||
            eachAction?.action_type === ACTION_TYPE.END_FLOW
          ) {
            const modifiedAction = normalizer(
              eachAction,
              POST_DATA_KEYS,
              FIELD_IDS,
            );

            const currentRule = currentStepRules?.find(
              (rule = {}) =>
                modifiedAction[FIELD_IDS.NEXT_STEP_RULE] === rule?.rule_uuid,
            );

            const modifiedRule = normalizer(
              currentRule,
              POST_DATA_KEYS,
              FIELD_IDS,
            );

            let lstIf = get(
              modifiedRule,
              [FIELD_IDS.RULE, FIELD_IDS.EXPRESSION, FIELD_IDS.IF],
              [],
            );

            lstIf = lstIf?.map((currentIf = {}) => {
              const currentIfRule = currentStepRules?.find(
                (rule = {}) => currentIf[FIELD_IDS.RULE_ID] === rule?.rule_uuid,
              );

              return {
                ...currentIf,
                [FIELD_IDS.RULE_NAME]: currentIfRule?.rule_name,
              };
            });

            set(
              modifiedRule,
              [FIELD_IDS.RULE, FIELD_IDS.EXPRESSION, FIELD_IDS.IF],
              lstIf,
            );

            actionForwardOnly.push({
              ...modifiedAction,
              [FIELD_IDS.NEXT_STEP_RULE_CONTENT]: modifiedRule?.rule,
            });
          }
        });

        console.log('getStepActionApi', res, actionForwardOnly, stepsList);

        dispatch(
          conditionalConfigDataChange({
            forwardActions: actionForwardOnly,
            isActionLoading: false,
          }),
        );
      })
      .catch((err) => {
        updatePostLoader(false);
        dispatch(conditionalConfigDataChange({ isActionLoading: false }));
        console.log(err);
      });
  }, [currentStep?._id]);

  const onAddStep = () => {
    if (currentStep?._id) {
      getAllSteps(
        flowData.flow_id,
        currentStep?._id,
        undefined,
        true,
        currentStep?.coordinate_info,
      );
    }
  };

  // Change Handler
  const onChangeHandler = (id, value, eachAction = {}, actionIndex = 0) => {
    const clonedAction = cloneDeep(eachAction);
    const clonedForwardActions = cloneDeep(forwardActions);

    switch (id) {
      case FIELD_IDS.IS_NEXT_STEP_RULE:
        if (value) {
          clonedAction[FIELD_IDS.NEXT_STEP_RULE_CONTENT] =
            getNextStepConditionRule();
          delete clonedAction[FIELD_IDS.NEXT_STEP_UUID];
        } else {
          delete clonedAction[FIELD_IDS.NEXT_STEP_RULE_CONTENT];
          clonedAction[FIELD_IDS.IS_NEXT_STEP_RULE_HAS_VALIDATION] = false;
        }
        clonedAction[FIELD_IDS.IS_NEXT_STEP_RULE] = value;
        set(clonedForwardActions, [actionIndex], clonedAction);
        break;
      case FIELD_IDS.NEXT_STEP_UUID: {
        clonedAction[FIELD_IDS.NEXT_STEP_UUID] = [value];
        clonedAction[FIELD_IDS.IS_NEXT_STEP_RULE] = false;
        set(clonedForwardActions, [actionIndex], clonedAction);
        break;
      }
      default:
        clonedAction[id] = value;
        set(clonedForwardActions, [actionIndex], clonedAction);
        break;
    }

    if (!isEmpty(clonedAction?.validationMessage)) {
      const dataToBeValidated = pick(clonedAction, [
        FIELD_IDS.ACTION_UUID,
        FIELD_IDS.NEXT_STEP_UUID,
        FIELD_IDS.IS_NEXT_STEP_RULE,
        FIELD_IDS.NEXT_STEP_RULE_CONTENT,
      ]);

      const errorList = validate(
        dataToBeValidated,
        conditionalConfigValidationSchema(t),
      );

      clonedAction[FIELD_IDS.VALIDATION_MESSAGE] = errorList;
      set(clonedForwardActions, [actionIndex], clonedAction);
    }

    dispatch(
      conditionalConfigDataChange({ forwardActions: clonedForwardActions }),
    );
  };

  if (isActionLoading) {
    return Array(3)
      .fill()
      .map((_, index) => (
        <div className={styles.EachConditionCard} key={index}>
          <div className={gClasses.MB20}>
            <Skeleton width="100%" height={200} />
          </div>
        </div>
      ));
  }

  const actionCards = forwardActions?.map(
    (eachAction = {}, actionIndex = 0) => {
      const { isNextStepRule } = eachAction;

      const optionList =
        eachAction.actionType === ACTION_TYPE.END_FLOW
          ? filteredEndStepList
          : filteredForwardStepList;

      const onCreateStepSuccess = (step, eachAction, actionIndex) => {
        const { step_uuid } = step;
        onAddStep(step);
        onChangeHandler(
          FIELD_IDS.NEXT_STEP_UUID,
          step_uuid,
          eachAction,
          actionIndex,
        );
      };

      return (
        <div className={styles.EachConditionCard} key={actionIndex}>
          <div className={gClasses.MB20}>
            <Text content={ACTION_CONSTANTS.CONDITION_TYPE.LABEL} />
            <Text content={eachAction?.actionName} className={gClasses.MB6} />

            <RadioGroup
              id={FIELD_IDS.IS_NEXT_STEP_RULE}
              labelText={DATALIST_STRINGS.ALWAYS_OR_CONDITIONALLY.LABEL}
              options={cloneDeep(ACTION_CONSTANTS.CONDITION_TYPE.OPTION_LIST)}
              onChange={(_event, id, value) =>
                onChangeHandler(id, value, eachAction, actionIndex)
              }
              selectedValue={get(
                eachAction,
                [FIELD_IDS.IS_NEXT_STEP_RULE],
                EMPTY_STRING,
              )}
              className={gClasses.MB15}
              disabled={eachAction.actionType === ACTION_TYPE.END_FLOW}
            />

            {isNextStepRule ? (
              <NextStepRuleBuilder
                id={FIELD_IDS.NEXT_STEP_RULE_CONTENT}
                rule={get(
                  eachAction,
                  [FIELD_IDS.NEXT_STEP_RULE_CONTENT],
                  EMPTY_STRING,
                )}
                metaData={metaData}
                stepList={cloneDeep(optionList)}
                onAddStep={onAddStep}
                onChange={(id, value) =>
                  onChangeHandler(id, value, eachAction, actionIndex)
                }
                rules={rules}
                setRules={setRules}
                getRules={getRules}
                validationMessage={get(
                  eachAction,
                  [FIELD_IDS.VALIDATION_MESSAGE],
                  {},
                )}
                currentAction={eachAction}
              />
            ) : (
              <div className={cx(gClasses.Gap16, gClasses.BottomV)}>
                <StepPicker
                  id={FIELD_IDS.NEXT_STEP_UUID}
                  label={ACTION_CONSTANTS.STEP.LABEL}
                  stepList={cloneDeep(optionList)}
                  selectedStep={get(
                    eachAction,
                    [FIELD_IDS.NEXT_STEP_UUID, 0],
                    EMPTY_STRING,
                  )}
                  onChange={(id, value) =>
                    onChangeHandler(id, value, eachAction, actionIndex)
                  }
                  validationMessage={get(
                    eachAction?.validationMessage,
                    [FIELD_IDS.NEXT_STEP_UUID],
                    EMPTY_STRING,
                  )}
                />
                <CreateStepPopover
                  id="else-step"
                  metaData={metaData}
                  onSuccess={(step) =>
                    onCreateStepSuccess(step, eachAction, actionIndex)
                  }
                  className={gClasses.MB8}
                  currentAction={eachAction}
                />
              </div>
            )}
          </div>
        </div>
      );
    },
  );
  return actionCards;
}

const mapStateToProps = (state) => {
  return {
    flowData: state.EditFlowReducer.flowData,
    isConditionConfigurationModalOpen:
      state.EditFlowReducer.isConditionConfigurationModalOpen,
    currentStepId: state.EditFlowReducer.conditionConfigurationStepId,
    stepNameError:
      state.EditFlowReducer[
        FLOW_STRINGS.SERVER_RESPONSE.NEW_STEP_ERROR_KEYS.FROM_SYSTEM_STEP_CONFIG
      ],
  };
};

const mapDispatchToProps = {
  updateFlowState: updateFlowStateChange,
  onFlowDataChange: updateFlowDataChange,
  setFlowStepData: flowSetStepData,
  getAllSteps: getAllStepsListThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionCard, 20);
