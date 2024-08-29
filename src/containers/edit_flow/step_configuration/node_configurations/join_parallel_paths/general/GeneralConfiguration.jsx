import { Title, RadioGroup, ETitleSize, RadioGroupLayout, SingleDropdown, CheckboxGroup, ECheckboxSize, Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import styles from '../JoinParallelPaths.module.scss';
import {
  INITIAL_JOIN_CONDITION,
  JOIN_CONDITION,
  JOIN_NODE_OBJECT_KEYS,
  JOIN_PARALLEL_PATHS,
  JOIN_PARALLEL_PATHS_STRINGS,
  JOIN_TYPE,
} from '../JoinParallelPaths.constants';
import { cloneDeep, isEmpty, set } from '../../../../../../utils/jsUtility';
import RuleBasedRecipient from '../../../../../../components/rule_based_recipient/RuleBasedRecipient';
import useApiCall from '../../../../../../hooks/useApiCall';
import { INITIAL_PAGE } from '../../../../../../utils/constants/form.constant';
import { getConditionalRulesApi } from '../../../../../../axios/apiService/rule.apiService';
import WarningIcon from '../../../../../../assets/icons/step_configuration_icons/WarningIcon';

function GeneralConfiguration(props) {
  const {
    isRuleBased = false,
    configData = {},
    updateJoinConfig,
    stepsList = [],
    metaData,
    metaData: { flowId },
    stepUuid,
    errorList = {},
    parentKey,
    index = 0,
  } = props;
  const { t } = useTranslation();

  const strings = JOIN_PARALLEL_PATHS_STRINGS(t);
  const [newlyAddedSelectedRules, setNewlyAddedSelectedRules] = useState([]);

  const { RADIO_OPTIONS } = JOIN_PARALLEL_PATHS(t);
  const { data: selectedRulesList, fetch: getConditionalRules, isLoading: isLoadingSelectedRules } = useApiCall({}, true);

  const stepCountOptions = (stepsList?.length > 0 ? [...Array(stepsList.length).keys()] : [])?.map((value) => {
    return ({
      label: value + 1,
      value: value + 1,
    });
  });

  const stepsOptionList = cloneDeep(stepsList)?.map((step) => {
    if ((configData?.stepUuids || []).includes(step.value)) {
      step.selected = true;
    }
    return step;
  });

  const getAllSelectedConditionRules = (rulesData) => {
    const selectedConditionalRules = rulesData?.map((eachAssignee) => eachAssignee?.[JOIN_NODE_OBJECT_KEYS.conditionRuleKey]);
    return selectedConditionalRules?.filter((eachRule) => !isEmpty(eachRule));
  };

  const getConditionalRulesList = (rulesData) => {
    const selectedRules = getAllSelectedConditionRules(rulesData);
    const params = {
      page: INITIAL_PAGE,
      size: selectedRules?.length,
      flow_id: flowId,
      rule_uuids: selectedRules,
    };
    getConditionalRules(getConditionalRulesApi(params));
  };

  useEffect(() => {
    if (!isRuleBased) {
      if (!isEmpty(configData?.[index]?.condition) && isEmpty(selectedRulesList) && !isLoadingSelectedRules) {
        getConditionalRulesList(configData?.[index]?.condition);
      }
    }
  }, []);

  const onConditionDataChange = (data, index, newRule) => {
    const configDataDataCloned = cloneDeep(configData);
    set(configDataDataCloned, index, data);
    if (!isEmpty(newRule)) {
      const selectedRulesCopy = cloneDeep(newlyAddedSelectedRules);
      selectedRulesCopy.push(newRule);
      setNewlyAddedSelectedRules(selectedRulesCopy);
  }
    updateJoinConfig(configDataDataCloned);
  };

  const onRuleConfigDataChange = (value, ruleIndex, index, errorList) => {
    const configDataDataCloned = cloneDeep(configData);
    set(configDataDataCloned, [index, JOIN_NODE_OBJECT_KEYS.ruleBased, ruleIndex, JOIN_NODE_OBJECT_KEYS.parentKey], value);
    updateJoinConfig(configDataDataCloned, errorList);
  };

  const onTypeChange = (event, id, value) => {
    console.log('event_onJoinTypeChange', event, 'id', id, 'value', value);
    const clonedConfigData = cloneDeep(configData);
    const data = {
      type: value,
    };
    switch (value) {
      case JOIN_TYPE.ATLEAST_N_FLOWS:
        data.stepCount = null;
        break;
      case JOIN_TYPE.SPECIFIC_STEPS:
        data.stepUuids = [];
        break;
      case JOIN_TYPE.CONDITIONAL:
        data.condition = [{
          rule: null,
          joinConfig: INITIAL_JOIN_CONDITION,
        }];
        break;
      default:
        break;
    }
    set(clonedConfigData, index, data);
    updateJoinConfig(clonedConfigData);
  };

  const onStepCountChange = (value) => {
    const clonedConfigData = cloneDeep(configData);
    const clonedErrorList = cloneDeep(errorList);
    delete clonedErrorList?.[`${parentKey},${index},${JOIN_NODE_OBJECT_KEYS.stepCount}`];
    set(clonedConfigData, [index, 'stepCount'], value);
    updateJoinConfig(clonedConfigData, clonedErrorList);
  };

  const getStepUuidsError = () => {
    let errorKey = `${parentKey},${index},${JOIN_NODE_OBJECT_KEYS.stepUuids}`;
    if (isEmpty(errorList[`${parentKey},${index},${JOIN_NODE_OBJECT_KEYS.stepUuids}`])) {
      const newErrorKey = Object.keys(errorList)?.find((key) => {
        const errorKeyArr = key.split(',');
        errorKeyArr?.splice(errorKeyArr.length - 1, 1);
        return (
          errorKeyArr.join(',') ===
          `${parentKey},${index},${JOIN_NODE_OBJECT_KEYS.stepUuids}`
        );
      });
      if (!isEmpty(newErrorKey)) {
        errorKey = newErrorKey;
      }
    }
    return errorList[errorKey];
  };

  const onStepUuidsChange = (value) => {
    const clonedConfigData = cloneDeep(configData);
    const clonedErrorList = cloneDeep(errorList);
    Object.keys(clonedErrorList)?.forEach((key) => {
      const errorKeyArr = key.split(',');
      if ((errorKeyArr?.splice(errorKeyArr.length - 1, 1))?.join(',') === `${parentKey},${index},${JOIN_NODE_OBJECT_KEYS.stepUuids}`) {
        delete clonedErrorList[key];
      }
    });
    const stepUuidsCloned = cloneDeep(clonedConfigData?.[index]?.stepUuids || []);
    const stepIndex = stepUuidsCloned?.findIndex((step) => step === value);
    if (stepIndex > -1) {
      stepUuidsCloned.splice(stepIndex, 1);
    } else {
      stepUuidsCloned.push(value);
    }
    set(clonedConfigData, [index, 'stepUuids'], stepUuidsCloned);
    updateJoinConfig(clonedConfigData, clonedErrorList);
  };

  const getRadioOptions = () =>
    RADIO_OPTIONS(isRuleBased)?.map((radioOptionsList) => {
      switch (radioOptionsList?.value) {
        case JOIN_TYPE.ALL_FLOWS:
          return {
            ...radioOptionsList,
          };
        case JOIN_TYPE.ATLEAST_N_FLOWS:
          return {
            ...radioOptionsList,
            customElement: (
              <div className={cx(gClasses.MT8, gClasses.ML32)}>
                <SingleDropdown
                  className={cx(styles.SpecifiedMaxWidth)}
                  dropdownViewProps={{
                    selectedLabel: configData?.[index]?.stepCount,
                  }}
                  optionList={stepCountOptions}
                  placeholder={strings.CHOOSE}
                  onClick={onStepCountChange}
                  selectedValue={configData?.[index]?.stepCount}
                  errorMessage={errorList[`${parentKey},${index},${JOIN_NODE_OBJECT_KEYS.stepCount}`]}
                  noDataFoundMessage={strings.NO_INPUT_STEPS}
                />
              </div>
            ),
          };
        case JOIN_TYPE.SPECIFIC_STEPS:
          return {
            ...radioOptionsList,
            customElement: (
              <div className={cx(gClasses.MT12, gClasses.ML32)}>
                {
                  !isEmpty(stepsOptionList) ? (
                    <CheckboxGroup
                      options={cloneDeep(stepsOptionList)?.map((step) => {
                        if (configData?.[index]?.stepUuids?.includes(step.value)) {
                          step.selected = true;
                        }
                        return step;
                      })}
                      onClick={onStepUuidsChange}
                      size={ECheckboxSize.LG}
                      className={styles.CheckBoxGroupLabel}
                      checkboxGroupClassName={gClasses.gap12}
                      errorMessage={getStepUuidsError()}
                      // errorMessage={errorList[`${parentKey},${index},${JOIN_NODE_OBJECT_KEYS.stepUuids}`]}
                    />
                  ) : (
                    <div className={cx(styles.NoInputSteps, gClasses.MT16)}>
                      <WarningIcon />
                      <Text
                        content={strings.NO_INPUT_STEPS}
                        className={styles.NoInputStepsLabel}
                        size={ETextSize.SM}
                      />
                    </div>
                  )
                }
              </div>
            ),
          };
        case JOIN_TYPE.CONDITIONAL:
          return {
            ...radioOptionsList,
            customElement: (
              <RuleBasedRecipient
                headers={strings.CONDITION_HEADERS}
                assigneeKey={JOIN_NODE_OBJECT_KEYS.parentKey}
                assigneeIndex={0}
                rulesKey={JOIN_NODE_OBJECT_KEYS.ruleBased}
                conditionRuleKey={JOIN_NODE_OBJECT_KEYS.conditionRuleKey}
                ruleAssigneeKey={JOIN_NODE_OBJECT_KEYS.parentKey}
                initialAssigneeData={INITIAL_JOIN_CONDITION}
                data={configData?.[index]}
                metaData={{
                  moduleId: flowId,
                  stepUUID: stepUuid,
                }}
                selectedRules={[...selectedRulesList, ...newlyAddedSelectedRules]}
                onDataChange={onConditionDataChange}
                assigneeErrorList={errorList}
                recipientsComponent={({ ruleIndex }) => (
                  <GeneralConfiguration
                    id={`ruleConfig-${ruleIndex}`}
                    key={ruleIndex}
                    isRuleBased
                    configData={configData?.[index]?.[JOIN_NODE_OBJECT_KEYS.ruleBased]?.[ruleIndex]?.[JOIN_NODE_OBJECT_KEYS.parentKey]}
                    stepUuid={stepUuid}
                    metaData={metaData}
                    updateJoinConfig={(data, errorList) => onRuleConfigDataChange(data, ruleIndex, index, errorList)}
                    stepsList={stepsList}
                    ruleIndex={ruleIndex}
                    errorList={errorList}
                    index={0}
                    parentKey={`${JOIN_NODE_OBJECT_KEYS.parentKey},${index},${JOIN_NODE_OBJECT_KEYS.ruleBased},${ruleIndex},${JOIN_NODE_OBJECT_KEYS.parentKey}`}
                  />
                )}
              />
            ),
          };
        default:
          return { ...radioOptionsList };
      }
    });

  return (
    <>
      {
        !isRuleBased && (
          <Title
            content={strings.GENERALTAB.TITLE_CONTENT}
            className={cx(gClasses.MB12, styles.TitleClass)}
            size={ETitleSize.xs}
          />
        )
      }
      <RadioGroup
        id={isRuleBased ? JOIN_CONDITION.RULE_BASED_ID : JOIN_CONDITION.ID}
        labelText={!isRuleBased && JOIN_PARALLEL_PATHS(t).LABEL}
        labelClassName={cx(gClasses.MB4)}
        selectedValue={configData?.[index]?.type}
        options={getRadioOptions()}
        optionClassName={styles.RadioGroupOptions}
        onChange={(event, id, value) => onTypeChange(event, id, value)}
        layout={RadioGroupLayout.stack}
      />
    </>
  );
}

export default GeneralConfiguration;
