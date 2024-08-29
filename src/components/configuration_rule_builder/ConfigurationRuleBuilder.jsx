import { SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import cx from 'classnames';

import { CONFIGURATION_RULE_BUILDER, FIELD_LABEL, INITIAL_PAGE, MAX_PAGINATION_SIZE, VALUE_LABEL } from './ConfigurationRuleBuilder.strings';
import { cloneDeep, get, isEmpty } from '../../utils/jsUtility';
import { getExtraParams, getOpertorList, isAddValueVisible, isUnaryOperand } from './ConfigurationRuleBuilder.utils';
import { getConfigurationRuleDetailById } from '../../redux/actions/Visibility.Action';
import { arryToDropdownData, showToastPopover } from '../../utils/UtilityFunctions';
import { FORM_POPOVER_STATUS, MODULE_TYPES } from '../../utils/Constants';
import { getAccountConfigurationDetailsApiService } from '../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { DEFAULT_CURRENCY_TYPE } from '../../utils/constants/currency.constant';
import gClasses from '../../scss/Typography.module.scss';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { DEFAULT_RULE_KEYS, FIELD_LIST_TYPE } from '../../utils/constants/form.constant';
import { externalFieldsThunk } from '../../redux/actions/DefaultValueRule.Action';
import usePaginationApi from '../../hooks/usePaginationApi';
import { getDefaultRuleExternalFieldsData, getDefaultRuleExternalFieldsPaginationDetails, getOperatorsInfoByFieldType } from '../../redux/reducer';
import ConfigurationRuleFieldDropdown from './configuration_rule_field_dropdwon/ConfigurationRuleFieldDropdown';
import styles from './ConfigurationRuleBuilder.module.scss';
import Trash from '../../assets/icons/application/Trash';
import Plus from '../../assets/icons/configuration_rule_builder/Plus';
import { FIELD_TYPE } from '../../utils/constants/form_fields.constant';

let cancelTokenForExternalFields;

function ConfigurationRuleBuilder(props) {
  const {
    moduleType = MODULE_TYPES.FLOW,
    moduleId = null,
    rule = {},
    ruleError = {},
    fieldType = null,
    fieldUUID = null,
    tableUUID = null,
    isTableField = false,
    onRuleReduxUpdator = null,

    lstAllFields = [],
    fieldsPaginationDetails = {},
    operatorsInfoByFieldType = [],
    getExternalFieldsApi = null,
  } = props;

  const { t } = useTranslation();
  const [currencyUtil, setCurrencyUtils] = useState({
    allowedCurrencyList: [],
    defaultCurrency: DEFAULT_CURRENCY_TYPE,
  });

  const getCurrencyOptionListUpdate = async () => {
       if (!isEmpty(currencyUtil.allowedCurrencyList)) return;
       try {
            let { allowedCurrencyList, defaultCurrency } = currencyUtil;
            const accountConfig = await getAccountConfigurationDetailsApiService();
            if (accountConfig.allowed_currency_types) {
              allowedCurrencyList = arryToDropdownData(accountConfig.allowed_currency_types);
            }
            if (accountConfig.allowed_currency_types) {
              defaultCurrency = accountConfig.default_currency_type || currencyUtil.defaultCurrency;
            }
            setCurrencyUtils((previousState) => {
                return {
                    ...previousState,
                    allowedCurrencyList,
                    defaultCurrency,
                  };
            });
       } catch (e) {
          showToastPopover(
            'Something went wrong',
            'Error in getting allowed currency',
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
       }
  };

  const getExternalFields = (page = null, isSearch = false, searchText = EMPTY_STRING) => {
    let paginationDetails = {
      page: (isSearch) ? INITIAL_PAGE : (page || INITIAL_PAGE),
      size: MAX_PAGINATION_SIZE,
      include_property_picker: 1,
      // is_table: 1,
    };
    if (fieldUUID) paginationDetails.exclude_field_uuids = [fieldUUID];
    if (tableUUID || rule?.operatorInfo?.is_table_field_allowed) {
      paginationDetails = {
        ...paginationDetails,
        field_list_type: FIELD_LIST_TYPE.TABLE,
        ...((tableUUID) ? { table_uuid: tableUUID } : {}),
      };
    } else {
      paginationDetails = {
        ...paginationDetails,
        field_list_type: FIELD_LIST_TYPE.DIRECT,
      };
    }
    if (isSearch && searchText) paginationDetails.search = searchText;
    return getExternalFieldsApi?.(
        paginationDetails,
        get(rule?.operatorInfo, ['allowed_field_types'], []),
        moduleId,
        {
          isTaskForm: moduleType === MODULE_TYPES.TASK,
          isDataListForm: moduleType === MODULE_TYPES.DATA_LIST,
         },
      );
  };

  const { hasMore, onLoadMoreData: onLoadMoreExternalFields } = usePaginationApi(getExternalFields, {
    paginationDetails: fieldsPaginationDetails,
    currentData: lstAllFields,
    cancelToken: cancelTokenForExternalFields,
  });

  useEffect(() => {
    if (!isEmpty(rule?.operatorInfo)) getExternalFields();
  }, [rule?.operator]);

  useEffect(() => {
    if (fieldType === FIELD_TYPE.CURRENCY) getCurrencyOptionListUpdate();
    else {
      setCurrencyUtils({
        allowedCurrencyList: [],
        defaultCurrency: DEFAULT_CURRENCY_TYPE,
      });
    }
  }, [fieldType]);

  const { FIELDS: { OPERATOR, ADD_NEW_R_VALUE, ROUNDING_LIST, CONCAT_WITH, CURRENCY_TYPE } } = CONFIGURATION_RULE_BUILDER;
  const extraParams = getExtraParams(rule?.operatorInfo, currencyUtil?.allowedCurrencyList, rule?.extraOptions);

  // Handler
  const onExtraOptionChange = (value, label, modifiedOptionList, id) => {
    const clonedRule = cloneDeep(rule);
    let selectedValue = null;
    switch (id) {
      case ROUNDING_LIST.ID:
        selectedValue = { [ROUNDING_LIST.ID]: value === 'zero' ? 0 : value };
        break;
      case CONCAT_WITH.ID:
        selectedValue = { [CONCAT_WITH.ID]: value === 'noSpace' ? '' : value };
        break;
      case CURRENCY_TYPE.ID:
        selectedValue = { [CURRENCY_TYPE.ID]: value };
        break;
      default: return null;
    }
    clonedRule[DEFAULT_RULE_KEYS.EXTRA_OPTIONS] = selectedValue;
    onRuleReduxUpdator?.(clonedRule);
    return null;
  };
  const onOperatorChange = (value) => {
    if (value !== rule?.operator) {
       const clonedRule = cloneDeep(rule);
       clonedRule.rValue = [null];
       clonedRule.lValue = null;
       clonedRule.operator = value;
       clonedRule.operatorInfo = operatorsInfoByFieldType.find((eachOperatorInfo) => eachOperatorInfo.operator === value);
       const { id, optionList } = getExtraParams(
         clonedRule?.operatorInfo,
         currencyUtil?.allowedCurrencyList,
         clonedRule?.extraOptions,
       );
       if (id && optionList?.length > 0) clonedRule.extraOptions = { [id]: get(optionList, ['0', 'value']) };
       else delete clonedRule?.extraOptions;
       onRuleReduxUpdator?.(clonedRule, OPERATOR.ID);
    }
  };
  const onLValueChange = (value, isField) => {
    const clonedRule = cloneDeep(rule);
    if (isTableField) {
      const existingIndex = clonedRule.lValue?.value?.findIndex?.((v) => v === value);
      if (existingIndex > -1) {
        clonedRule.lValue?.value?.splice(existingIndex, 1);
      } else {
        clonedRule.lValue = { value: [...clonedRule.lValue?.value || [], value], isField };
      }
    } else {
      clonedRule.lValue = { value, isField };
    }

    const _value = value.toString().trim();
    if (!isField && _value === '') {
      clonedRule.lValue = null;
    }
        onRuleReduxUpdator?.(clonedRule, FIELD_LABEL(t).ID);
  };
  const onRValueChange = (value, isField, index) => {
        const clonedRule = cloneDeep(rule);
    clonedRule.rValue[index] = { value, isField };
    const _value = value.toString().trim();
    if (!isField && _value === '') {
      clonedRule.rValue[index] = null;
    }
    onRuleReduxUpdator?.(clonedRule, VALUE_LABEL(t).ID);
  };

  const getExtraParamsOptionList = (optionList, id) => {
    switch (id) {
      case CONFIGURATION_RULE_BUILDER.FIELDS.CONCAT_WITH.ID:
        const newConcatOptionList = optionList.map((option) => {
          if (option.value === EMPTY_STRING) {
            return {
              label: option.label,
              value: 'noSpace',
            };
          } else { return option; }
        });
        return newConcatOptionList;
      case CONFIGURATION_RULE_BUILDER.FIELDS.ROUNDING_LIST.ID:
        const newRoundingOptionList = optionList.map((option) => {
          if (option.value === 0) {
            return {
              label: option.label,
              value: 'zero',
            };
          } else { return option; }
        });
        return newRoundingOptionList;
      default:
        return optionList;
    }
  };

  const getSelectedValue = (value, id) => {
    switch (id) {
      case CONFIGURATION_RULE_BUILDER.FIELDS.CONCAT_WITH.ID:
        if (value === EMPTY_STRING) return 'noSpace';
        else return value;
      case CONFIGURATION_RULE_BUILDER.FIELDS.ROUNDING_LIST.ID:
        if (value === 0) return 'zero';
        else return value;
      default:
        return value;
    }
  };

  // Component
  const getDeleteRValue = (index, hasError) => {
    if (
      !isAddValueVisible(rule?.operatorInfo) ||
      !((rule?.rValue || []).length > 1)
    ) return null;

    const onRValueDeleteHandler = (index) => {
      const clonedRule = cloneDeep(rule);
      clonedRule.rValue = (clonedRule.rValue || []).filter((_value, eachIndex) => eachIndex !== index);
      onRuleReduxUpdator?.(clonedRule);
    };

    return (
      <button
        className={cx(styles.DeleteIconContainer, hasError ? gClasses.MB25 : gClasses.MB5)}
        onClick={() => onRValueDeleteHandler(index)}
      >
         <Trash />
      </button>);
  };

  const getAddRValue = () => {
    if (!isAddValueVisible(rule?.operatorInfo)) return null;

    const onAddNewClick = () => {
      const clonedRule = cloneDeep(rule);
      if (isEmpty(clonedRule.rValue)) clonedRule.rValue = [];
      clonedRule.rValue = [...clonedRule.rValue, null];
      onRuleReduxUpdator?.(clonedRule);
    };

    return (
      <button
        className={cx(gClasses.CursorPointer, gClasses.FTwo13, gClasses.MB10, styles.AddNew)}
        onClick={onAddNewClick}
        id={ADD_NEW_R_VALUE.ID}
      >
        <Plus />
        {t(ADD_NEW_R_VALUE.LABEL)}
      </button>
    );
  };

  const operatorList = getOpertorList(operatorsInfoByFieldType, isTableField);
    const selectedOperator = get(rule, [OPERATOR.ID], null);
  return (
  <div className={styles.ConfigurationRuleBuilder}>
    <div className={styles.OperatorContainer}>
      <div className={styles.FieldWidth}>
        <SingleDropdown
            id={OPERATOR.ID}
            selectedValue={selectedOperator}
            errorMessage={get(ruleError, [OPERATOR.ID], null)}
            optionList={operatorList}
            onClick={onOperatorChange}
            placeholder={t(OPERATOR.PLACEHOLDER)}
            dropdownViewProps={{
              labelName: t(OPERATOR.LABEL),
              disabled: !fieldType,
              selectedLabel: operatorList.find((o) => o.value === selectedOperator)?.label || '',
            }}
        />
      </div>
      {(!isEmpty(extraParams)) && (
        <div className={styles.FieldWidth}>
          <SingleDropdown
                id={extraParams.id}
                selectedValue={getSelectedValue(extraParams.selectedValue, extraParams.id)}
                optionList={getExtraParamsOptionList(extraParams.optionList, extraParams.id)}
                onClick={onExtraOptionChange}
                dropdownViewProps={{
                  labelName: extraParams.label,
                }}
          />
        </div>)
      }
    </div>
    <div className={styles.ValueAndActionContainer}>
      <div className={styles.Value}>
           {rule?.operator && (
            <div className={styles.FieldWidth}>
             <ConfigurationRuleFieldDropdown
              id={FIELD_LABEL(t).ID}
              fieldType={fieldType}
              tableUUID={tableUUID}
              isTableField={isTableField}
              value={rule.lValue}
              operator={rule.operator}
              selectedOperatorInfo={rule.operatorInfo}
              validationMessage={get(ruleError, [FIELD_LABEL().ID]) || get(ruleError, [`${FIELD_LABEL().ID},value`])}
              hasMore={hasMore}
              loadMoreData={onLoadMoreExternalFields}
              onChangeHandler={onLValueChange}
              getExternalFields={getExternalFields}
              isMultiSelect={isTableField}
             />
            </div>
           )}
           {
            !isEmpty(rule?.operatorInfo) && !isUnaryOperand(rule?.operatorInfo) && (
               rule?.rValue?.map((value, index) => (
                <div key={index} className={cx(styles.FieldWidth, styles.RValue)}>
                   <ConfigurationRuleFieldDropdown
                    isRValue
                    id={VALUE_LABEL(t).ID}
                    fieldType={fieldType}
                    tableUUID={tableUUID}
                    isTableField={isTableField}
                    value={value}
                    operator={rule.operator}
                    selectedOperatorInfo={rule.operatorInfo}
                    validationMessage={get(ruleError, [`${VALUE_LABEL(t).ID},${index}`])}
                    hasMore={hasMore}
                    loadMoreData={onLoadMoreExternalFields}
                    onChangeHandler={(value, isField) => onRValueChange(value, isField, index)}
                    getExternalFields={getExternalFields}
                   />
                   {getDeleteRValue(index, get(ruleError, [`${VALUE_LABEL(t).ID},${index}`]))}
                </div>
               ))
            )
           }
      </div>
      {getAddRValue()}
    </div>
  </div>);
}

const mapStateToProps = (state, ownProps) => {
  return {
    fieldsPaginationDetails: getDefaultRuleExternalFieldsPaginationDetails(state),
    lstAllFields: getDefaultRuleExternalFieldsData(state),
    operatorsInfoByFieldType: getOperatorsInfoByFieldType(state, ownProps.fieldType),
  };
};
const mapStateToDispatch = (dispatch) => {
   return {
    getRuleDetailsById: (...params) => dispatch(getConfigurationRuleDetailById(...params)),
    getExternalFieldsApi: (...params) => dispatch(externalFieldsThunk(...params)),
   };
};

export default connect(mapStateToProps, mapStateToDispatch)(ConfigurationRuleBuilder);
