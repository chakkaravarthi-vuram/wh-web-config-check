import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ETextSize, RadioGroup, SingleDropdown, Text, RadioGroupLayout, Variant, Label } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import FieldVisibilityRuleConfig from '../../../../../form_configuration/field_visibility/field_visibility_rule_config/FieldVisibilityRuleConfig';
import { VISIBILITY_CONFIG_STRINGS } from './VisibilityConfiguration.strings';
import SelectFormConfigurationRule from '../../select_form_configuration_rule/SelectFormConfigurationRule';
import { keydownOrKeypessEnterHandle } from '../../../../../../utils/UtilityFunctions';
import { cloneDeep, get, isEmpty, uniqBy } from '../../../../../../utils/jsUtility';
import { RESPONSE_FIELD_KEYS } from '../../../../../../utils/constants/form/form.constant';
import gClasses from '../../../../../../scss/Typography.module.scss';
import style from './VisibilityConfiguration.module.scss';
import PlusIconBlueNew from '../../../../../../assets/icons/PlusIconBlueNew';
import { RULE_TYPE } from '../../../../../../utils/constants/rule/rule.constant';
import { getConditionalRulesApi } from '../../../../../../axios/apiService/rule.apiService';
import { getModuleIdByModuleType } from '../../../../Form.utils';
import { FIELD_CONFIG } from '../../../../../../components/form_builder/FormBuilder.strings';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';

function VisibilityConfiguration(props) {
  const {
    setFieldDetails,
    fieldDetails = {},
    metaData,
    moduleType,
    noOfFields,
    tableUUID,
    isTableField,
  } = props;
  const { t } = useTranslation();
  const { VISIBILITY_CONFIG } = FIELD_CONFIG(t);
  const [isVisibilityModalOpen, setVisibilityModalOpen] = useState(false);
  const [selectedRuleName, setSelectedRuleName] = useState();
  const [rules, setRules] = useState({ list: [], paginationDetails: {}, loading: false });
  const { IS_FIELD_SHOW_WHEN_RULE, FIELD_SHOW_WHEN_RULE, IS_VISIBLE, RULE_ID, FIELD_UUID, RULE_DETAILS, RULE_NAME, RULE_UUID } = RESPONSE_FIELD_KEYS;
  const isRulePossible = noOfFields >= 2 || (noOfFields === 1 && isEmpty(fieldDetails[FIELD_UUID]));
  const [search, setSearch] = useState(EMPTY_STRING);

    useEffect(() => {
    const ruleDetails = get(fieldDetails, [RULE_DETAILS], []);
    if (isEmpty(fieldDetails[FIELD_SHOW_WHEN_RULE]) || isEmpty(ruleDetails)) return;

    const rule = ruleDetails.find((r) => r[RULE_UUID] === fieldDetails[FIELD_SHOW_WHEN_RULE]);
    if (rule) setSelectedRuleName(rule[RULE_NAME]);
  }, [fieldDetails?.ruleDetails?.length]);

  const getRules = (page = 1, searchValue = null) => {
    const params = {
      page,
      size: 50,
      ...(getModuleIdByModuleType(metaData, moduleType)),
    };
    if (searchValue) params.search = searchValue;
    delete params.step_id;
    setRules({ ...rules, loading: true });
    getConditionalRulesApi(params)
      .then((data) => {
        const { pagination_data = [], pagination_details = [{}] } = data;
        const addRules = [{
          label: <div className={cx(gClasses.P0, gClasses.CenterV)}>
                    <PlusIconBlueNew />
                    <Text className={cx(gClasses.BlueIconBtn, gClasses.ML12, gClasses.FTwo13Important)} content="Add Condition" />
                 </div>,
          value: VISIBILITY_CONFIG_STRINGS(t).ADD_CONDITION_ID,
          header: VISIBILITY_CONFIG_STRINGS(t).ADD_CONDITION,
        }];

        const getLocalRulesList = !searchValue ? rules?.list?.slice(1) : [];
        let combinedRules = [...getLocalRulesList, ...pagination_data];
        combinedRules = uniqBy(combinedRules, (r) => r.rule_uuid);
        const allRules = combinedRules.map((rule, index) => {
          return {
            label: rule.rule_name,
            value: rule.rule_uuid,
            header: index === 0 && VISIBILITY_CONFIG_STRINGS(t).SHOW_EXISTING_CONDITION,
            ...rule,
          };
        });
        const paginationDetails = pagination_details[0];
        setRules(() => {
          return {
            list: [...addRules, ...allRules],
            loading: false,
            paginationDetails,
          };
        });
      })
      .catch(() => {
        setRules({ list: [], loading: false, paginationDetails: {} });
      });
  };

  useEffect(() => {
    if (isRulePossible) getRules(1);
  }, []);

  const onVisibilityTypeChange = (_id, value) => {
    setFieldDetails({
      ...fieldDetails,
      [IS_VISIBLE]: value,
    });
  };

  const onSaveRule = (rule) => {
    const existigRuleUUIDS = fieldDetails?.ruleDetails?.map((rule) => rule.ruleUUID) || [];
    const clonedRuleDetails = cloneDeep(fieldDetails?.ruleDetails) || [];
    if (existigRuleUUIDS.includes(rule.ruleUUID)) {
     clonedRuleDetails.map((x, index) => (x.ruleUUID === rule.ruleUUID) && delete clonedRuleDetails.splice(index, 1));
    }
    const ruleDetails = [
      ...clonedRuleDetails,
      { [RULE_UUID]: rule.ruleUUID, [RULE_NAME]: rule.ruleName },
    ];
    setSelectedRuleName(rule.ruleName);
    const isVisible = isTableField
      ? VISIBILITY_CONFIG_STRINGS(t).HIDE_OR_DISABLE.OPTIONS[1].value // disabled
      : fieldDetails?.[IS_VISIBLE] ?? VISIBILITY_CONFIG_STRINGS(t).HIDE_OR_DISABLE.OPTIONS[0].value; // hide
    setFieldDetails({
      ...fieldDetails,
      [IS_FIELD_SHOW_WHEN_RULE]: true,
      [FIELD_SHOW_WHEN_RULE]: rule.ruleUUID,
      [IS_VISIBLE]: isVisible,
      [RULE_DETAILS]: ruleDetails,
    });
    getRules(1);
  };

  const onDeleteRule = () => {
    const clonedFieldDetails = cloneDeep(fieldDetails);
    clonedFieldDetails[IS_FIELD_SHOW_WHEN_RULE] = false;
    delete clonedFieldDetails[FIELD_SHOW_WHEN_RULE];
    delete clonedFieldDetails[IS_VISIBLE];
    clonedFieldDetails[RULE_DETAILS] = get(
      fieldDetails,
      [RULE_DETAILS],
      [],
    ).filter((r) => r[RULE_UUID] !== fieldDetails[FIELD_SHOW_WHEN_RULE]);
    setFieldDetails({ ...clonedFieldDetails });
    // getRules(1);
  };

  const onSearchHandler = (value) => {
    setSearch(value);
    getRules(1, value);
  };

  const getVisibilityRuleConfigModal = () => {
    if (!isVisibilityModalOpen) return null;

    const onClose = () => {
      setVisibilityModalOpen(false);
    };

    const onSave = (rule) => {
      onSaveRule({ ruleUUID: rule.rule_uuid, ruleName: rule.rule_name });
    };

    return (
      <FieldVisibilityRuleConfig
        ruleUUID={get(fieldDetails, [FIELD_SHOW_WHEN_RULE])}
        metaData={metaData}
        moduleType={moduleType}
        isModalOpen={isVisibilityModalOpen}
        setIsModalOpen={setVisibilityModalOpen}
        onClose={onClose}
        onSave={onSave}
        ruleType={RULE_TYPE.VISIBILITY}
        tableUUID={tableUUID}
        ruleNameGenerate={fieldDetails?.fieldName}
      />
    );
  };

  const onRuleClick = (value, label) => {
    if (value === VISIBILITY_CONFIG_STRINGS(t).ADD_CONDITION_ID) setVisibilityModalOpen(true);
    else onSaveRule({ ruleUUID: value, ruleName: label });
    setSearch(EMPTY_STRING);
  };

  const getVisibilityCheckbox = () => (
    <RadioGroup
      id={IS_VISIBLE}
      className={gClasses.MT10}
      labelText={VISIBILITY_CONFIG_STRINGS(t).HIDE_OR_DISABLE.LABEL}
      selectedValue={fieldDetails[IS_VISIBLE]}
      options={VISIBILITY_CONFIG_STRINGS(t).HIDE_OR_DISABLE.OPTIONS}
      onChange={(e, id, v) => onVisibilityTypeChange(id, v)}
      disabled={isTableField || !fieldDetails[FIELD_SHOW_WHEN_RULE]}
      onKeyDown={(e, id, v) =>
        keydownOrKeypessEnterHandle(e) && onVisibilityTypeChange(id, v)
      }
    />
  );

  const loadMoreRules = () => {
    if (rules?.paginationDetails?.page) getRules(rules.paginationDetails.page + 1 || 1);
  };

  const getRuleSelectionDropdown = () => {
    if (!isRulePossible) {
      return <Text content="No Fields Present" size={ETextSize.SM} />;
    } else {
      return (
        <div className={style.VisibilityContainer}>
          <SingleDropdown
            id="existing-rule"
            placeholder="Choose Rule"
            optionList={cloneDeep(rules.list)}
            onClick={(value, label) => onRuleClick(value, label)}
            selectedValue={get(fieldDetails, [FIELD_SHOW_WHEN_RULE, RULE_ID])}
            isLoadingOptions={rules.loading}
            className={gClasses.MB16}
            dropdownViewProps={{
              variant: Variant.borderLess,
              iconOnly: true,
              icon: (
                <button
                  className={cx(
                    gClasses.P0,
                    gClasses.PT10,
                    gClasses.PR12,
                    gClasses.CenterV,
                    style.RuleSelection,
                  )}
                >
                  <PlusIconBlueNew />
                  <Text className={cx(gClasses.BlueIconBtn, gClasses.ML12, gClasses.FTwo13Important)} content={VISIBILITY_CONFIG_STRINGS(t).ADD_EXPRESSION} />
                </button>
              ),
            }}
            searchProps={{ searchValue: search, onChangeSearch: (event) => onSearchHandler(event?.target?.value) }}
            onOutSideClick={() => { setSearch(EMPTY_STRING); getRules(1); }}
            getPopperContainerClassName={() => cx(style.VisibilityPopper)}
            infiniteScrollProps={{
              next: loadMoreRules,
              dataLength: rules?.list,
              hasMore: rules?.list?.length < rules?.paginationDetails?.total_count,
              scrollableId: 'visibility_config_infinite_scroll',
            }}
          />
          {getVisibilityCheckbox()}
        </div>
      );
    }
  };

  const getSelectedRule = () => (
    <SelectFormConfigurationRule
      onDelete={onDeleteRule}
      onEdit={() => setVisibilityModalOpen(true)}
      savedRuleData={{
        ruleUUID: fieldDetails[FIELD_SHOW_WHEN_RULE],
        ruleName: selectedRuleName,
      }}
      fromVisibility
    />
  );

  return (
    <div>
      {fieldDetails?.[RESPONSE_FIELD_KEYS.READ_ONLY] &&
        <RadioGroup
          labelText={VISIBILITY_CONFIG.HIDE_VALUE_IF_NULL.LABEL}
          labelClassName={style.RadioGroupLabelClass}
          selectedValue={fieldDetails?.[RESPONSE_FIELD_KEYS.HIDE_FIELD_IF_NULL]}
          options={VISIBILITY_CONFIG.HIDE_VALUE_IF_NULL.OPTION_LIST}
          onChange={(_event, _id, value) => setFieldDetails({
            ...fieldDetails,
            [RESPONSE_FIELD_KEYS.HIDE_FIELD_IF_NULL]: value,
          })}
          layout={RadioGroupLayout.inline}
          className={cx(gClasses.MT16, gClasses.MB16)}
        />
      }
      <Label className={cx(gClasses.FTwo13BlackV12, gClasses.MB16)} labelName={VISIBILITY_CONFIG.CONDITION_BASED_VISIBILITY} />
      {!fieldDetails[FIELD_SHOW_WHEN_RULE]
        ? getRuleSelectionDropdown()
        : (
            <div className={cx(style.VisibilityContainer)}>
              {getSelectedRule()}
              {getVisibilityCheckbox()}
            </div>
        )
      }

      {getVisibilityRuleConfigModal()}
    </div>
  );
  }

  export default VisibilityConfiguration;
