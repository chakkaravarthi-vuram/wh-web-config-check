import React, { useState } from 'react';
import cx from 'classnames';
import { cloneDeep, unset } from 'utils/jsUtility';
import gClasses from 'scss/Typography.module.scss';
import {
  SingleDropdown,
  Size,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import styles from './ConditionBased.module.scss';
import PlusIconBlueNew from '../../../../../../assets/icons/PlusIconBlueNew';
import { CONDITION_BASED_STRINGS } from './ConditionBased.strings';
import { MODULE_TYPES } from '../../../../../../utils/Constants';
import { CONDITION_BASED_CONSTANTS } from './ConditionBased.constants';
import FieldVisibilityRuleConfig from '../../../../../form_configuration/field_visibility/field_visibility_rule_config/FieldVisibilityRuleConfig';
import { RULE_TYPE } from '../../../../../../utils/constants/rule/rule.constant';
import { getConditionalRulesApi } from '../../../../../../axios/apiService/rule.apiService';
import { EMPTY_STRING, NO_RESULTS_FOUND } from '../../../../../../utils/strings/CommonStrings';

function useConditionBased(props) {
  const [ruleModal, setRuleModal] = useState(false);
  const { t } = useTranslation();
  const [rules, setRules] = useState({
    list: [],
    paginationDetails: {},
    loading: false,
  });
  const [search, setSearch] = useState(EMPTY_STRING);
  const { STEP_ASSIGNEES, CONDITION_RULE, RULE_PAGE_SIZE } = CONDITION_BASED_CONSTANTS;

  const {
    data,
    selectedRule,
    onAssigneeDataChange,
    assigneeIndex,
    metaData,
    usedRuleUUIDs,
    restrictExistingConditions = false,
    conditionRuleKey = CONDITION_RULE,
    ruleSelectionViewClassName,
  } = props;

  const getRules = ({ page, customParams = {} }, seacrhValue = null) => {
    const params = {
      page: page || 1,
      size: RULE_PAGE_SIZE,
      flow_id: data?.flow_id || metaData.moduleId,
      ...customParams,
    };
    if (seacrhValue) params.search = seacrhValue;

    if (params?.page === 1) {
      setRules(() => {
        return {
          list: [],
          loading: true,
          paginationDetails: {},
        };
      });
    } else {
      setRules((value) => {
        return {
          ...value,
          loading: true,
        };
      });
    }

    getConditionalRulesApi(params)
      .then((res) => {
        const { pagination_data = [], pagination_details = [{}] } = res;

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

  // useEffect(() => {
  //   const currentSelectedRule = selectedRules?.find(
  //     (eachRule) =>
  //       eachRule?.rule_uuid === currentAssigneeData?.[conditionRuleKey],
  //   );

  // }, [selectedRules?.length]);

  const {
    CHOOSE_CONDITION,
    CREATE_CONDITION,
    SEARCH_CONDITION,
  } = CONDITION_BASED_STRINGS(t);

  const getRuleModal = (onSelectRule, removeSelectedRule) => {
    if (!ruleModal) return null;

    const onSave = (savedRule) => {
      onSelectRule(savedRule);
      setRuleModal(false);
    };

    const onClose = () => {
      removeSelectedRule?.();
      setRuleModal(false);
    };

    return (
      <FieldVisibilityRuleConfig
        metaData={metaData}
        moduleType={MODULE_TYPES.FLOW}
        ruleUUID={selectedRule?.rule_uuid}
        onClose={onClose}
        onSave={onSave}
        ruleType={RULE_TYPE.VISIBILITY}
        ruleNameGenerate={data?.step_name}
        isAssigneeRule
      />
    );
  };

  const onCreateRule = () => {
    setRuleModal(true);
  };

  const onEditRule = () => {
    setRuleModal(true);
  };

  const onRemoveRuleClick = () => {
    const clonedData = cloneDeep(data);

    unset(clonedData, [STEP_ASSIGNEES, assigneeIndex, conditionRuleKey]);

    onAssigneeDataChange(clonedData, assigneeIndex);
  };

  const loadInitialRuleList = () => {
    getRules({ page: 1, customParams: { exclude_rules: usedRuleUUIDs } });
  };

  const loadMoreRules = () => {
    if (rules?.paginationDetails?.page) getRules({ page: rules.paginationDetails.page + 1 || 1, customParams: { exclude_rules: usedRuleUUIDs } });
  };

  const onSearchHandler = (value) => {
    setSearch(value);
    getRules({ page: 1, customParams: { exclude_rules: usedRuleUUIDs } }, value);
  };

  const getRuleDropdown = (onClick, errorMessage) => (
    <div className={ruleSelectionViewClassName}>
      {
        !restrictExistingConditions && (
          <SingleDropdown
            id={CHOOSE_CONDITION.ID}
            placeholder={CHOOSE_CONDITION.PLACEHOLDER}
            dropdownViewProps={{
              onClick: loadInitialRuleList,
              onKeyDown: loadInitialRuleList,
              size: Size.md,
            }}
            optionList={cloneDeep(rules?.list)}
            onClick={(value) => {
              const selectedRule = rules.list.find((r) => r.rule_uuid === value) || {};
              onClick(selectedRule);
              // handleRuleChange(generateEventTargetObject(conditionRuleKey, value));
              setSearch(EMPTY_STRING);
            }}
            className={styles.ChooseCondition}
            infiniteScrollProps={{
              next: loadMoreRules,
              dataLength: rules?.list,
              hasMore: rules?.list?.length < rules?.paginationDetails?.total_count,
              scrollableId: CHOOSE_CONDITION.SCROLLABLE_ID,
              scrollThreshold: CHOOSE_CONDITION.SCROLLABLE_THRESOLD,
            }}
            noDataFoundMessage={t(NO_RESULTS_FOUND)}
            searchProps={{
              searchPlaceholder: t(SEARCH_CONDITION),
              searchValue: search,
              onChangeSearch: (event) => onSearchHandler(event?.target?.value),
            }}
            onOutSideClick={() => {
              setSearch(EMPTY_STRING);
              getRules({
                page: 1,
                customParams: { exclude_rules: usedRuleUUIDs },
              });
            }}
            isLoadingOptions={rules?.loading}
            getPopperContainerClassName={() => styles.ConditionPopper}
            errorMessage={errorMessage}
          />
        )
      }
      <button
        className={cx(gClasses.BlueIconBtn)}
        onClick={onCreateRule}
      >
        <PlusIconBlueNew className={cx(gClasses.MR3, styles.AddIcon)} />
        {CREATE_CONDITION}
      </button>
    </div>
  );

  return {
    getRuleDropdown, getRuleModal, onRemoveRuleClick, onEditRule,
  };

  // return (
  //   <div className={cx(styles.ChooseRule)} key={assigneeIndex}>
  //     {currentAssigneeData?.[conditionRuleKey] ? (
  //       ruleChosenView
  //     ) : (

  //     )}

  //     {getRuleModal()}
  //   </div>
  // );
}

export default useConditionBased;
