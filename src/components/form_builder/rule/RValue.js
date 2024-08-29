import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FIELD_KEYS, PROPERTY_PICKER_ARRAY } from 'utils/constants/form.constant';
import gClasses from 'scss/Typography.module.scss';
import QUERY_BUILDER from 'components/query_builder/QueryBuilder.strings';
import { BS } from 'utils/UIConstants';
import AddMembers from 'components/member_list/add_members/AddMembers';
import { getFieldType } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { getAccountConfigurationDetailsApiService } from '../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { RULE_FIELD_TYPE } from '../../../utils/constants/rule/field_type.constant';
import { OPERAND_TYPES } from '../../../utils/constants/rule/operand_type.constant';
import { getDropdownData } from '../../../utils/generatorUtils';
import jsUtils, { get, isEmpty, has, uniq, set, cloneDeep } from '../../../utils/jsUtility';
import { getListValueDropdown } from '../../../utils/rule_engine/RuleEngine.utils';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import DatePicker from '../../form_components/date_picker/DatePicker';
import Dropdown from '../../form_components/dropdown/Dropdown';
import Input from '../../form_components/input/Input';
import { getRValueInputMetadata } from './ruleConfig.selectors';
import { getCountryCodeDropdownList } from '../../../utils/UtilityFunctions';
import styles from '../../query_builder/QueryBuilder.module.scss';
import { formatRValueErrors, formatRvalueUser } from './RValue.utils';
import { FIELD_TYPES, RULE_VALUE_STRINGS } from '../FormBuilder.strings';

const getMultiNumberValue = (_rValue) => {
  if (!isEmpty(_rValue)) {
    return _rValue.join(',');
  }
  return _rValue;
};
function RValue(props) {
  const {
    selectedOperatorInfo,
    selectedFieldInfo,
    onRValueChangeHandler,
    rValue,
    errorRValue,
    className,
    labelClassName,
    ruleError,
  } = props;
  const [optionList, setOptionList] = useState([]);
  const [isOptionListLoading, setIsOptionListLoading] = useState(true);
  const [userSearchVal, setUserSearchVal] = useState(EMPTY_STRING);
  const [selectedUserValue, setSelectedUserValue] = useState(rValue);
  const { t } = useTranslation();

  useEffect(() => {
    setSelectedUserValue(rValue);
  }, [selectedOperatorInfo?.operator]);

let arrTeamOrUser = [];
if (selectedUserValue?.teams) {
    arrTeamOrUser = jsUtils.union(arrTeamOrUser, selectedUserValue.teams);
  }
if (selectedUserValue?.users) {
  arrTeamOrUser = jsUtils.union(arrTeamOrUser, selectedUserValue.users);
}

  const getOptionList = async (_selectedFieldInfo = {}) => {
    switch (getFieldType(_selectedFieldInfo)) {
      case RULE_FIELD_TYPE.CURRENCY: {
        if (
          !isEmpty(
            get(_selectedFieldInfo, ['validations', 'allowed_currency_types']),
          )
        ) {
          return getDropdownData(
            _selectedFieldInfo.validations.allowed_currency_types,
          );
        }
        return getAccountConfigurationDetailsApiService().then((response) => {
          if (response.allowed_currency_types) {
            return getDropdownData(response.allowed_currency_types);
          }
          return [];
        });
      }
      case RULE_FIELD_TYPE.FILE_UPLOAD: {
        return getAccountConfigurationDetailsApiService().then((response) => {
          if (response.allowed_extensions) {
            return getDropdownData(response.allowed_extensions);
          }
          return [];
        });
      }
      case RULE_FIELD_TYPE.DROPDOWN:
      case RULE_FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN:
      case RULE_FIELD_TYPE.CHECKBOX:
      case RULE_FIELD_TYPE.RADIO_GROUP:
        console.log('RULE FIELD CUSTOM', _selectedFieldInfo);
        {
          let values = [];
          if (PROPERTY_PICKER_ARRAY.includes(_selectedFieldInfo.field_type)) {
            values = get(_selectedFieldInfo, [FIELD_KEYS.PROPERTY_PICKER_DETAILS, 'values'], []);
          } else {
            values = get(_selectedFieldInfo, ['values'], []);
          }
          if (!isEmpty(values)) return getDropdownData(values);
          return [];
        }
      case RULE_FIELD_TYPE.PHONE_NUMBER:
        return getCountryCodeDropdownList();
      default:
        return [];
    }
  };
  useEffect(() => {
    const optionListOperandFields = [OPERAND_TYPES.DROPDOWN, OPERAND_TYPES.MULTI_DROPDOWN];
    if (!isEmpty(selectedOperatorInfo) && selectedOperatorInfo.has_operand && optionListOperandFields.includes(selectedOperatorInfo.operand_field)) {
      getOptionList(selectedFieldInfo).then((options) => { setOptionList(options); setIsOptionListLoading(false); }, () => { setOptionList([]); setIsOptionListLoading(false); });
    }
  }, [selectedOperatorInfo, selectedFieldInfo]);

  if (!isEmpty(selectedOperatorInfo) && selectedOperatorInfo.has_operand) {
    // ON_CHANGE_HANDLERS
    const onChangeMultiHandler = (event) => {
      let valueList = isEmpty(rValue) ? [] : [...rValue];
      valueList = [...valueList];
      if (valueList.find((_value) => _value === event.target.value)) valueList.splice(valueList.indexOf(event.target.value), 1);
      else {
        valueList.push(event.target.value);
      }
      return onRValueChangeHandler(uniq(valueList));
    };
    const onChangeDualHandler = (event, index, isNumber) => {
      const eValue = event.target.value;
      let inputValue = eValue;
      if (eValue) {
        if (isNumber) {
          inputValue = eValue.includes('.') ? parseFloat(eValue) : parseInt(eValue, 10);
        }
      }
      if (inputValue === undefined || inputValue === null) return EMPTY_STRING;
      const valueList = isEmpty(rValue) ? [] : [...rValue];
      return onRValueChangeHandler(set(valueList, [index], inputValue));
    };
    const onChangeMultiNumberHandler = (event, isOnBlur) => {
      if (!isEmpty(event.target.value)) {
        let enteredValue = event.target.value
          .trim()
          .split(',')
          // eslint-disable-next-line consistent-return, array-callback-return
          .flatMap((value) => {
            const num = parseInt(value, 10);
            if (num) return num;
          });
        if (isOnBlur) {
          enteredValue = enteredValue.filter((element) => element !== undefined);
          onRValueChangeHandler(uniq(enteredValue));
        } else onRValueChangeHandler(enteredValue);
      } else { onRValueChangeHandler([]); }
    };
    const onBlurMultiNumberHandler = (event) => {
      onChangeMultiNumberHandler(event, true);
    };
    const onChangeHandler = (event, isNumber) => {
      let enteredValue;
      if (has(event, 'target')) {
        const eValue = event.target.value;
        if (eValue) {
          if (isNumber) {
              enteredValue = eValue.includes('.') ? parseFloat(eValue) : parseInt(eValue, 10);
              return onRValueChangeHandler(enteredValue);
          } else enteredValue = eValue;
        } else if (eValue === EMPTY_STRING) {
          enteredValue = eValue;
        }
      } else {
        enteredValue = event;
      }
      if (enteredValue !== undefined && enteredValue !== null) {
        onRValueChangeHandler(enteredValue);
      }
      return null;
    };

    const userOrTeamChangeHandler = (currentUserOrTeam) => {
      const rValueLocal = !isEmpty(cloneDeep(selectedUserValue)) ? cloneDeep(selectedUserValue) : { users: [], teams: [] };
      if (currentUserOrTeam.is_user) {
        if (!jsUtils.find(rValueLocal.users, { _id: currentUserOrTeam._id })) {
          if (jsUtils.isEmpty(rValueLocal.users)) rValueLocal.users = [];
          rValueLocal.users.push(currentUserOrTeam);
        }
      } else if (!currentUserOrTeam.is_user) {
        if (!jsUtils.find(rValueLocal.teams, { _id: currentUserOrTeam._id })) {
          if (jsUtils.isEmpty(rValueLocal.teams)) rValueLocal.teams = [];
          rValueLocal.teams.push(currentUserOrTeam);
        }
      }
      setSelectedUserValue(rValueLocal);
      onChangeHandler({ target: { value: rValueLocal } });
    };

    const removeUserOrTeamHandler = (id) => {
      const rValueLocal = !isEmpty(cloneDeep(selectedUserValue)) ? cloneDeep(selectedUserValue) : { users: [], teams: [] };
      if (jsUtils.find(rValueLocal.users, { _id: id })) {
        jsUtils.remove(rValueLocal.users, { _id: id });
      } else if (jsUtils.find(rValueLocal.teams, { _id: id })) {
        jsUtils.remove(rValueLocal.teams, { _id: id });
      }
      setSelectedUserValue(rValueLocal);
      onChangeHandler({ target: { value: rValueLocal } });
    };

    const getInputComponent = (operandFieldType) => {
      const inputFieldMetaData = getRValueInputMetadata(operandFieldType);
      console.log('operand field type2w23', operandFieldType);
      switch (operandFieldType) {
        case OPERAND_TYPES.SINGLE_LINE:
        case OPERAND_TYPES.MULTI_SINGLE_LINE:
        case OPERAND_TYPES.EMAIL:
          return (
            <Input
              id="rvalue-string"
              placeholder={inputFieldMetaData.placeHolder}
              label={inputFieldMetaData.label}
              onChangeHandler={onChangeHandler}
              value={rValue || EMPTY_STRING}
              errorMessage={errorRValue}
              errorRValue={errorRValue}
              hideMessage={!errorRValue}
              className={className}
              inputContainerClasses={gClasses.InputHeight32Important}
              labelClass={labelClassName}
            />
          );
        case OPERAND_TYPES.NUMBER: {
          return (
            <Input
              id="rvalue-num"
              placeholder={inputFieldMetaData.placeHolder}
              label={inputFieldMetaData.label}
              onChangeHandler={(event) => onChangeHandler(event, true)}
              value={rValue}
              type="number"
              errorMessage={errorRValue}
              hideMessage={!errorRValue}
              className={className}
              inputContainerClasses={gClasses.InputHeight32Important}
              labelClass={labelClassName}
            />
          );
        }
        case OPERAND_TYPES.DUAL_NUMBER:
          const dualNumberErrors = formatRValueErrors(ruleError, operandFieldType);
          return (
            <>
              <Input
                id="rvalue-dualnum-1"
                placeholder={inputFieldMetaData.placeHolder}
                label={RULE_VALUE_STRINGS.DUAL_NUMBER.LABEL_1}
                onChangeHandler={(event) =>
                  onChangeDualHandler(event, 0, true)
                }
                value={get(rValue, [0])}
                type="number"
                errorMessage={dualNumberErrors.firstFieldError}
                hideMessage={!dualNumberErrors.firstFieldError}
                inputContainerClasses={gClasses.InputHeight32Important}
                labelClass={labelClassName}
              />
              <Input
                id="rvalue-dualnum-2"
                className={gClasses.MT15}
                placeholder={inputFieldMetaData.placeHolder}
                label={RULE_VALUE_STRINGS.DUAL_NUMBER.LABEL_2}
                onChangeHandler={(event) =>
                  onChangeDualHandler(event, 1, true)
                }
                value={get(rValue, [1])}
                type="number"
                errorMessage={dualNumberErrors.secondFieldError}
                hideMessage={!dualNumberErrors.secondFieldError}
                inputContainerClasses={gClasses.InputHeight32Important}
                labelClass={labelClassName}
              />
            </>
          );
        case OPERAND_TYPES.MULTI_NUMBER:
          return (
            <>
              <Input
                id="rvalue-multinum"
                placeholder={inputFieldMetaData.placeHolder}
                label={inputFieldMetaData.label}
                value={getMultiNumberValue(rValue)}
                errorMessage={errorRValue}
                hideMessage={!errorRValue}
                onChangeHandler={(event) => onChangeMultiNumberHandler(event)}
                onBlurHandler={onBlurMultiNumberHandler}
                inputContainerClasses={gClasses.InputHeight32Important}
                labelClass={labelClassName}
              />
              <Dropdown
                optionList={getListValueDropdown(rValue)}
                className={gClasses.MT10}
                placeholder={RULE_VALUE_STRINGS.MULTI_NUMBER.DROPDOWN_PLACEHOLDER}
                label={RULE_VALUE_STRINGS.MULTI_NUMBER.DROPDOWN_LABEL}
                errorMessage={errorRValue}
                hideMessage={!errorRValue}
                inputDropdownContainer={gClasses.InputHeight32Important}
                labelClass={labelClassName}
                disableFocusFilter
               disablePopper
              />
            </>
          );
        case OPERAND_TYPES.DROPDOWN: {
          return (
            <Dropdown
              optionList={optionList}
              isDataLoading={isOptionListLoading}
              placeholder={inputFieldMetaData.placeHolder}
              label={inputFieldMetaData.label}
              selectedValue={rValue || EMPTY_STRING}
              onChange={onChangeHandler}
              errorMessage={errorRValue}
              hideMessage={!errorRValue}
              isCountryCodeList={selectedFieldInfo.field_type === RULE_FIELD_TYPE.PHONE_NUMBER}
              inputDropdownContainer={gClasses.InputHeight32Important}
              className={className}
              labelClass={labelClassName}
             disablePopper
            />
          );
        }
        case OPERAND_TYPES.MULTI_DROPDOWN: {
          console.log('errorRvalue multidropdown2w2ddscw', errorRValue);
          return (
            <Dropdown
              optionList={optionList}
              isDataLoading={isOptionListLoading}
              placeholder={inputFieldMetaData.placeHolder}
              label={inputFieldMetaData.label}
              selectedValue={rValue || []}
              onChange={(event) => onChangeMultiHandler(event)}
              isMultiSelect
              errorMessage={errorRValue}
              hideMessage={!errorRValue}
              isCountryCodeList={selectedFieldInfo.field_type === RULE_FIELD_TYPE.PHONE_NUMBER}
              className={className}
              inputDropdownContainer={gClasses.InputHeight32Important}
              labelClass={labelClassName}
             disablePopper
            />
          );
        }
        case OPERAND_TYPES.DATE:
          return (
            <div className={BS.P_RELATIVE}>
              <DatePicker
                id="Date"
                label={inputFieldMetaData.label}
                getDate={(value) => onChangeHandler({ target: { value } })}
                date={rValue}
                errorMessage={errorRValue}
                hideMessage={!errorRValue}
                isScrollIntoView
                className={className}
                labelClass={labelClassName}
                helperMessageClass={styles.DateErrMsg}
              />
            </div>
          );
        case OPERAND_TYPES.DATE_TIME:
          return (
            <div className={BS.P_RELATIVE}>
              <DatePicker
                id="DateTime"
                label="Values"
                labelClass={labelClassName}
                getDate={(value) => onChangeHandler({ target: { value } })}
                date={rValue}
                errorMessage={errorRValue}
                hideMessage={!errorRValue}
                isScrollIntoView
                className={className}
                helperMessageClass={styles.DateErrMsg}
                enableTime
                fieldType={FIELD_TYPES.DATETIME}
              />
            </div>
          );
        case OPERAND_TYPES.USER_SELECT:
          const userError = formatRvalueUser(ruleError);
          return (
            <AddMembers
              label="Values"
              id="Users"
              onUserSelectHandler={(event) => {
                const { value } = event.target;
                userOrTeamChangeHandler(value);
              }}
              selectedData={arrTeamOrUser}
              removeSelectedUser={(id) => {
                removeUserOrTeamHandler(id);
              }}
              errorText={userError}
              hideErrorMessage={!userError}
              selectedSuggestionData={[]}
              memberSearchValue={userSearchVal}
              setMemberSearchValue={(e) => setUserSearchVal(e.target.value)}
              placeholder="Select the Users here.."
              getTeamsAndUsers
              isActive
              popperFixedStrategy
            />
          );
        case OPERAND_TYPES.DUAL_DATE_TIME:
          const dualDateErrorData = formatRValueErrors(ruleError, operandFieldType);
          return (
            <div className={BS.P_RELATIVE}>
              <DatePicker
                id="DateTime"
                label={RULE_VALUE_STRINGS.DUAL_DATE.LABEL_1}
                labelClass={labelClassName}
                getDate={(value) => onChangeDualHandler({ target: { value } }, 0)}
                date={get(rValue, [0])}
                errorMessage={dualDateErrorData.firstFieldError}
                hideMessage={!dualDateErrorData.firstFieldError}
                isScrollIntoView
                className={className}
                helperMessageClass={styles.DateErrMsg}
                enableTime
                fieldType={FIELD_TYPES.DATETIME}
              />
              <DatePicker
                id="DateTime"
                label={RULE_VALUE_STRINGS.DUAL_DATE.LABEL_2}
                labelClass={labelClassName}
                getDate={(value) => onChangeDualHandler({ target: { value } }, 1)}
                date={get(rValue, [1])}
                errorMessage={dualDateErrorData.secondFieldError}
                hideMessage={!dualDateErrorData.secondFieldError}
                isScrollIntoView
                className={className}
                helperMessageClass={styles.DateErrMsg}
                enableTime
                fieldType={FIELD_TYPES.DATETIME}
              />
            </div>
          );
        case OPERAND_TYPES.DUAL_DATE:
          const dualDateErrors = formatRValueErrors(ruleError, operandFieldType);
          return (
            <div className={className}>
              <DatePicker
                id="Date_From"
                popperClasses={gClasses.ZIndex5}
                label={RULE_VALUE_STRINGS.DUAL_DATE.LABEL_1}
                getDate={(value) =>
                  onChangeDualHandler({ target: { value } }, 0)
                }
                date={get(rValue, [0])}
                errorMessage={dualDateErrors.firstFieldError}
                hideMessage={!dualDateErrors.firstFieldError}
                isScrollIntoView
                labelClass={labelClassName}
                helperMessageClass={styles.DateErrMsg}
              />
              <DatePicker
                id="Date_To"
                popperClasses={gClasses.ZIndex5}
                label={RULE_VALUE_STRINGS.DUAL_DATE.LABEL_2}
                getDate={(value) =>
                  onChangeDualHandler({ target: { value } }, 1)
                }
                date={get(rValue, [1])}
                errorMessage={dualDateErrors.secondFieldError}
                hideMessage={!dualDateErrors.secondFieldError}
                isScrollIntoView
                labelClass={labelClassName}
                helperMessageClass={styles.DateErrMsg}
              />
            </div>
          );
        default:
          return null;
      }
    };
    return getInputComponent(selectedOperatorInfo.operand_field);
  } else if (!isEmpty(selectedOperatorInfo) && !selectedOperatorInfo.has_operand) {
    return null;
  }
  // dummy input component
  return (
    <Input
      id="rvalue"
       readOnly
      label={t(QUERY_BUILDER.ALL_LABELS.VALUES)}
      placeholder={t(QUERY_BUILDER.ALL_PLACEHOLDERS.VALUES)}
      className={className}
      inputContainerClasses={gClasses.InputHeight32Important}
      labelClass={labelClassName}
      hideMessage
      disabled
    />
  );
}

export default RValue;
