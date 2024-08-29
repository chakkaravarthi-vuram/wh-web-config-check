import { Chip, ETextSize, SingleDropdown, Text } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditIconV3 from '../../../../../../assets/icons/EditIconV3';
import PlusIconBlueNew from '../../../../../../assets/icons/PlusIconBlueNew';
import Trash from '../../../../../../assets/icons/application/Trash';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { MODULE_TYPES, UTIL_COLOR } from '../../../../../../utils/Constants';
import { RULE_TYPE } from '../../../../../../utils/constants/rule/rule.constant';
import { cloneDeep, get, has, isEmpty, set } from '../../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import FieldVisibilityRuleConfig from '../../../../../form_configuration/field_visibility/field_visibility_rule_config/FieldVisibilityRuleConfig';
import { FOOTER_PARAMS_ID, GET_NEXT_STEP_CONDITION_RULE_IF } from '../../FormFooter.constant';
import { CREATE_FORM_STRINGS, RULE_DEFAULT_OBJECT } from '../../FormFooter.string';
import style from './NextStepRuleBuilder.module.scss';
import { getRuleName } from '../FormFooterConfig.utils';
import SingleStepSelection from '../../../../../edit_flow/step_configuration/node_configurations/branch_parallel_paths/general/SingleStepSelection';

function NextStepRuleBuilder(props) {
  const {
    id = null,
    rule = RULE_DEFAULT_OBJECT,
    metaData,
    stepList = [],
    validationMessage,
    onChange = () => null,
    rules = {
      list: [],
      paginationDetails: {
        total_count: 0,
        page: 1,
      },
      loading: false,
    },
    actionName,
    getRules,
    toggleAddNewNodeDropdown,
    configStrings,
  } = props;
  const { t } = useTranslation();
  const { IF, ELSE_OUTPUT_VALUE, OUTPUT_VALUE, EXPRESSION, RULE_ID, RULE_NAME, NEXT_STEP_RULE_CONTENT } = FOOTER_PARAMS_ID;
  const lstIf = rule?.expression?.if || [];
  const { FORM_BUTTON_CONFIG: { BODY } } = CREATE_FORM_STRINGS(t);
  const [ruleModal, setRuleModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState({});
  const [search, setSearch] = useState(EMPTY_STRING);

  const loadInitialRuleList = (searchValue = null, _listIfs) => {
    let selectedRules = (_listIfs || lstIf)?.map((eachIf) => eachIf?.ruleUUID);
    selectedRules = selectedRules?.filter((eachRule) => !isEmpty(eachRule));
    const params = { page: 1, customParams: { exclude_rules: selectedRules } };
    if (searchValue) params.customParams.search = searchValue;

    if (getRules) getRules(params);
  };

  useEffect(() => {
    loadInitialRuleList();
  }, []);

  const onStepSelect = (_id, value, index) => {
    const cloneRule = cloneDeep(rule);
    if (_id === ELSE_OUTPUT_VALUE) {
      set(cloneRule, [EXPRESSION, ELSE_OUTPUT_VALUE], [value]);
    } else {
      set(cloneRule, [EXPRESSION, IF, index, OUTPUT_VALUE], [value]);
    }
    onChange?.(id, cloneRule);
  };

  const onAddCondition = () => {
    const cloneRule = cloneDeep(rule);
    const ifLst = get(cloneRule, [EXPRESSION, IF], []);
    ifLst.push(GET_NEXT_STEP_CONDITION_RULE_IF());
    set(cloneRule, [EXPRESSION, IF], ifLst);
    onChange?.(id, cloneRule);
  };

  const onDeleteCondition = (index) => {
    const cloneRule = cloneDeep(rule);
    if (has(cloneRule, [EXPRESSION, IF, index])) {
      cloneRule[EXPRESSION][IF].splice(index, 1);
    }
    onChange?.(id, cloneRule);
    loadInitialRuleList(null, cloneDeep(cloneRule[EXPRESSION][IF] || []));
  };

  const onChooseRule = (ruleId, label, index) => {
    const cloneRule = cloneDeep(rule);
    if (cloneRule[EXPRESSION][IF][index]) {
      cloneRule[EXPRESSION][IF][index][RULE_ID] = ruleId;
      cloneRule[EXPRESSION][IF][index][RULE_NAME] = label;
      onChange?.(id, cloneRule);
      loadInitialRuleList(null, cloneDeep(cloneRule[EXPRESSION][IF] || []));
    }
  };

  const onCreateRule = (index) => {
    setRuleModal(true);
    setSelectedRule({ index });
  };

  const onEditRule = (ruleUUID, index) => {
    setRuleModal(true);
    setSelectedRule({ ruleUUID, index });
  };

  const onRemoveRule = (index) => {
    const cloneRule = cloneDeep(rule);
    if (cloneRule[EXPRESSION][IF][index]) {
      cloneRule[EXPRESSION][IF][index][RULE_ID] = '';
      cloneRule[EXPRESSION][IF][index][RULE_NAME] = '';
      cloneRule[EXPRESSION][IF][index][OUTPUT_VALUE] = [''];
      onChange?.(id, cloneRule);
      loadInitialRuleList(null, cloneDeep(cloneRule[EXPRESSION][IF] || []));
    }
  };

  const getRuleModal = () => {
    if (!ruleModal) return null;

    const onSave = (savedRule) => {
      const cloneRule = cloneDeep(rule);
      const { index } = selectedRule;

      if (cloneRule[EXPRESSION][IF][index]) {
        cloneRule[EXPRESSION][IF][index][RULE_ID] = savedRule.rule_uuid;
        cloneRule[EXPRESSION][IF][index][RULE_NAME] = savedRule.rule_name;
        onChange?.(id, cloneRule);
      }

      setRuleModal(false);
      setSelectedRule({});
    };

    const onClose = () => {
      setRuleModal(false);
      setSelectedRule({});
    };
    return (
      <FieldVisibilityRuleConfig
        metaData={metaData}
        moduleType={MODULE_TYPES.FLOW}
        ruleUUID={selectedRule?.ruleUUID}
        onClose={onClose}
        onSave={onSave}
        ruleType={RULE_TYPE.VISIBILITY}
        ruleNameGenerate={actionName}
      />
    );
  };

  const onSearchHandler = (value) => {
    setSearch(value);
    loadInitialRuleList(value);
  };

  const loadMoreRules = () => {
    let selectedRules = lstIf?.map((eachIf) => eachIf?.ruleUUID);

    selectedRules = selectedRules?.filter((eachRule) => !isEmpty(eachRule));

    if (getRules && rules?.paginationDetails?.page) getRules({ page: rules.paginationDetails.page + 1 || 1, customParams: { exclude_rules: selectedRules } });
  };

  const getEachConditionBuilder = (expressionIf, index) => {
    const errorKey = [
      NEXT_STEP_RULE_CONTENT,
      EXPRESSION,
      IF,
      index,
      RULE_ID,
    ].join(',');

    return (
      <div className={cx(style.If, gClasses.TopV)}>
        <div className={cx(gClasses.Flex1)}>
          {!expressionIf[RULE_ID] ? (
            <div className={cx(style.ChooseRule)}>
              <SingleDropdown
                id={`if-${index}`}
                placeholder={BODY.CHOOSE_CONDITION}
                infiniteScrollProps={{
                  hasMore: rules?.list?.length < rules?.paginationDetails?.total_count,
                  dataLength: rules?.list?.length,
                  next: loadMoreRules,
                  scrollableId: BODY.CONDITION_SCROLLABLE_ID,
                  scrollThreshold: BODY.CONDITION_SCROLLABLE_THRESHOLD,
                }}
                searchProps={{ searchValue: search, onChangeSearch: (event) => onSearchHandler(event?.target?.value) }}
                onOutSideClick={() => { setSearch(EMPTY_STRING); loadInitialRuleList(); }}
                optionList={cloneDeep(rules?.list)}
                selectedValue={expressionIf[RULE_ID]}
                onClick={(v, l) => { onChooseRule(v, l, index); setSearch(EMPTY_STRING); }}
                errorMessage={validationMessage[errorKey]}
              />
              <button
                className={gClasses.BlueIconBtn}
                onClick={() => onCreateRule(index)}
              >
                <PlusIconBlueNew className={cx(gClasses.MR3, style.AddIcon)} />
                {BODY.CREATE_CONDITION}
              </button>
            </div>
          ) : (
            <>
              <div className={cx(style.Rule)}>
                <Text
                  content={expressionIf[RULE_NAME] || getRuleName(rules.list, expressionIf[RULE_ID])}
                  className={cx(gClasses.AlignSelfCenter)}
                />
                <div className={style.RuleControls}>
                  <Chip
                    text={BODY.EXPRESSION}
                    textColor={UTIL_COLOR.BLUE_PRIMARY}
                    backgroundColor={UTIL_COLOR.BLUE_10}
                  />
                  <button
                    onClick={() => onEditRule(expressionIf[RULE_ID], index)}
                  >
                    <EditIconV3 />
                  </button>
                  <button onClick={() => onRemoveRule(index)}>
                    <Trash />
                  </button>
                </div>
              </div>

              <div className={cx(style.Step)}>
                <Chip
                  className={cx(gClasses.FlexShrink0, gClasses.MT8)}
                  text={BODY.IS_TRUE_THEN}
                  textColor={UTIL_COLOR.YELLOW_700}
                  backgroundColor={UTIL_COLOR.YELLOW_50}
                />
                <SingleStepSelection
                  addStepLabel={configStrings.PATH.ADD_STEP_LABEL}
                  placeholder={configStrings.STEPS_DROPDOWN.PLACEHOLDER}
                  searchLabel={configStrings.STEPS_DROPDOWN.SEARCH.PLACEHOLDER}
                  selectedValue={expressionIf?.[OUTPUT_VALUE]?.[0]}
                  errorMessage={validationMessage[errorKey]}
                  toggleAddNewNodeDropdown={(data) => toggleAddNewNodeDropdown({ ...data, refIndex: index })}
                  refId={`step-picker-${index}`}
                  stepsList={cloneDeep(stepList)}
                  selectedLabel={stepList?.find((step) =>
                    step.value === expressionIf?.[OUTPUT_VALUE]?.[0])?.label
                  }
                  onClick={(value) => onStepSelect(`step-picker-${index}`, value, index)}
                />

              </div>
            </>
          )}
        </div>
        {lstIf.length > 1 && (
          <button
            className={cx(gClasses.ML16, gClasses.MT6)}
            onClick={() => onDeleteCondition(index)}
          >
            <Trash />
          </button>
        )}
      </div>
    );
  };

  const getOverAllConditionBuilder = () => lstIf.map((expression, index) => getEachConditionBuilder(expression, index));

  const getAddMoreConditionButton = () => {
    if (!get(rule, [EXPRESSION, IF, '0', RULE_ID], true)) return null;

    return (
      <button className={cx(gClasses.BlueIconBtn, gClasses.WidthMinContent)} onClick={onAddCondition}>
        <PlusIconBlueNew className={cx(gClasses.MR3, style.AddIcon)} />
        {BODY.ADD_MORE_CONDITION}
      </button>
    );
  };

  const getElseCondition = () => {
    if (!get(rule, [EXPRESSION, IF, '0', RULE_ID], true)) return null;

    const selectedStep = get(rule, [EXPRESSION, ELSE_OUTPUT_VALUE, '0'], '');
    const errorKey = [NEXT_STEP_RULE_CONTENT, EXPRESSION, ELSE_OUTPUT_VALUE, 0].join(',');
    return (
      <div className={cx(gClasses.DisplayFlex, gClasses.FlexDirectionCol, gClasses.gap6)}>
        <div className={cx(gClasses.CenterV, gClasses.Gap16)}>
          <div className={cx(gClasses.Flex1, style.ElseCondition, { [style.Error]: validationMessage[errorKey] })}>
            <div className={style.Else}>{BODY.ELSE}</div>
            <SingleStepSelection
              addStepLabel={configStrings.PATH.ADD_STEP_LABEL}
              placeholder={configStrings.STEPS_DROPDOWN.PLACEHOLDER}
              searchLabel={configStrings.STEPS_DROPDOWN.SEARCH.PLACEHOLDER}
              selectedValue={selectedStep}
              errorMessage={validationMessage?.[ELSE_OUTPUT_VALUE]}
              toggleAddNewNodeDropdown={toggleAddNewNodeDropdown}
              refId={ELSE_OUTPUT_VALUE}
              stepsList={cloneDeep(stepList)}
              onClick={(value) => onStepSelect(ELSE_OUTPUT_VALUE, value)}
              selectedLabel={stepList?.find((step) =>
                step.value === selectedStep)?.label
              }
            />
          </div>
        </div>
        <Text
          content={validationMessage[errorKey]}
          size={ETextSize.XS}
          className={style.ErrorMessage}
        />
      </div>
    );
  };

  return (
    <div className={cx(style.RuleContainer, gClasses.MB60)}>
      {getOverAllConditionBuilder()}
      {getAddMoreConditionButton()}
      {getElseCondition()}
      {getRuleModal()}
    </div>
  );
}

export default NextStepRuleBuilder;
