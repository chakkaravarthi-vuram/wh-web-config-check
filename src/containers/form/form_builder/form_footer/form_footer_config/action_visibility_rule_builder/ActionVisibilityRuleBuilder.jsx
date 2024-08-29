import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from '../../../../../../scss/Typography.module.scss';
import FieldVisibilityRuleConfig from '../../../../../form_configuration/field_visibility/field_visibility_rule_config/FieldVisibilityRuleConfig';
import { RULE_TYPE } from '../../../../../../utils/constants/rule/rule.constant';
import { FOOTER_PARAMS_ID } from '../../FormFooter.constant';
import { cloneDeep, isEmpty } from '../../../../../../utils/jsUtility';
import PlusIconBlueNew from '../../../../../../assets/icons/PlusIconBlueNew';
import { MODULE_TYPES } from '../../../../../../utils/Constants';
import { getModuleIdByModuleType } from '../../../../Form.utils';
import { getConditionalRulesApi } from '../../../../../../axios/apiService/rule.apiService';
import SelectFormConfigurationRule from '../../../../sections/field_configuration/select_form_configuration_rule/SelectFormConfigurationRule';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';

function ActionVisibilityRuleBuilder(props) {
  const { moduleType, ruleDetails = {}, onChangeHandler, metaData, actionName } = props;
  const [isModalOpen, setModalVisibility] = useState(false);
  const [rules, setRules] = useState({ list: [], paginationDetails: {}, loading: false });
  const [selectedRule, setSelectedRule] = useState();
  const [search, setSearch] = useState(EMPTY_STRING);

  const getRules = (page = 1, searchValue = null) => {
    const params = {
      page,
      size: 50,
      ...(getModuleIdByModuleType(metaData, MODULE_TYPES.FLOW)),
    };
    if (searchValue) params.search = searchValue;
    delete params.step_id;
    setRules({ ...rules, loading: true });
    getConditionalRulesApi(params)
      .then((data) => {
        const { pagination_data = [], pagination_details = [{}] } = data;
        const getLocalRulesList = !searchValue ? rules?.list : [];
        const combinedRules = (page === 1) ? cloneDeep(pagination_data) : [...getLocalRulesList || [], ...pagination_data];
        const list = combinedRules.map((r) => {
          return {
            label: r.rule_name,
            value: r.rule_uuid,
            ...r,
          };
        });
        const paginationDetails = pagination_details[0];
        setRules(() => {
          return {
            list,
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
    getRules(1);
  }, []);

  const onAddRule = () => setModalVisibility(true);
  const onSaveRule = (rule) => {
    const _rule = {
      [FOOTER_PARAMS_ID.RULE_ID]: rule.value,
      [FOOTER_PARAMS_ID.RULE_NAME]: rule.label,
    };
    onChangeHandler(FOOTER_PARAMS_ID.CONDITION_RULE, _rule);
  };

  const onEditRule = () => {
    setSelectedRule(ruleDetails[FOOTER_PARAMS_ID.RULE_ID]);
    setModalVisibility(true);
  };
  const onDeleteRule = () => {
    onChangeHandler(FOOTER_PARAMS_ID.CONDITION_RULE, undefined);
  };

  const loadMoreRules = () => {
    if (rules?.paginationDetails?.page) getRules(rules.paginationDetails.page + 1 || 1);
  };

  const onSearchHandler = (value) => {
    setSearch(value);
    getRules(1, value);
  };

  const getAddRule = () => (
    <div className={gClasses.DisplayFlex}>
      <SingleDropdown
        id="existing-rule"
        placeholder="Choose Rule"
        optionList={cloneDeep(rules.list)}
        onClick={(value, label) => { onSaveRule({ label, value }); setSearch(EMPTY_STRING); getRules(1); }}
        infiniteScrollProps={{
          next: loadMoreRules,
          dataLength: rules?.list,
          hasMore: rules?.list?.length < rules?.paginationDetails?.total_count,
          scrollableId: 'button_visibility_config_infinite_scrollable_id',
        }}
        searchProps={{ searchValue: search, onChangeSearch: (event) => onSearchHandler(event?.target?.value) }}
        onOutSideClick={() => { setSearch(EMPTY_STRING); getRules(1); }}
      />
      <button
        className={cx(
         gClasses.BlueIconBtn,
         gClasses.ML16,
        )}
        onClick={onAddRule}
      >
        <PlusIconBlueNew />
         Add Rule
      </button>
    </div>
  );

  const getRuleDisplayer = () => (
    <SelectFormConfigurationRule
      onDelete={onDeleteRule}
      onEdit={onEditRule}
      savedRuleData={{
        ruleName: ruleDetails[FOOTER_PARAMS_ID.RULE_NAME],
      }}
    />
  );

  const getRuleModal = () => {
    if (!isModalOpen) return null;

    const onClose = () => {
      setModalVisibility(false);
      setSelectedRule(null);
    };

      const onSave = (savedRule) => {
        setRules((p) => {
          const _rules = { ...p };
          if (p.list.findIndex((r) => r.value === savedRule.rule_uuid) === -1) {
            _rules.list = [..._rules.list, { label: savedRule.rule_name, value: savedRule.rule_uuid, _id: savedRule._id }];
          }
          return _rules;
        });
        onSaveRule({ label: savedRule.rule_name, value: savedRule.rule_uuid });
      };

    return (
      <FieldVisibilityRuleConfig
        onClose={onClose}
        onSave={onSave}
        ruleUUID={selectedRule}
        moduleType={moduleType}
        metaData={metaData}
        ruleType={RULE_TYPE.VISIBILITY}
        ruleNameGenerate={actionName}
      />
    );
  };

  return (
    <div>
      {getRuleModal()}
      {!isEmpty(ruleDetails) ? getRuleDisplayer() : getAddRule()}
      {/* <RadioGroup
        id={FOOTER_PARAMS_ID.VISIBILITY}
        className={gClasses.MT10}
        labelText={FORM_BUTTON_CONFIG.BODY.HIDE_OR_DISABLE.LABEL}
        selectedValue={visibility}
        options={FORM_BUTTON_CONFIG.BODY.HIDE_OR_DISABLE.OPTIONS}
        onChange={(e, id, v) => onChangeHandler(id, v)}
        onKeyDown={(e, id, v) =>
          keydownOrKeypessEnterHandle(e) && onChangeHandler(id, v)
        }
      /> */}
    </div>
  );
}

export default ActionVisibilityRuleBuilder;
