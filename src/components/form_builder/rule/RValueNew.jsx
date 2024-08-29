import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { FIELD_KEYS, PROPERTY_PICKER_ARRAY } from 'utils/constants/form.constant';
import gClasses from 'scss/Typography.module.scss';
import QUERY_BUILDER from 'components/query_builder/QueryBuilder.strings';
import { getFieldType } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { MultiDropdown, SingleDropdown, Size, TextInput, Text, ETextSize, Checkbox, CBAllKeys } from '@workhall-pvt-lmt/wh-ui-library';
import { BS } from '../../../utils/UIConstants';
import { getAccountConfigurationDetailsApiService } from '../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { RULE_FIELD_TYPE } from '../../../utils/constants/rule/field_type.constant';
import { OPERAND_TYPES } from '../../../utils/constants/rule/operand_type.constant';
import { getDropdownData } from '../../../utils/generatorUtils';
import jsUtils, { get, isEmpty, has, uniq, set, cloneDeep, isFiniteNumber } from '../../../utils/jsUtility';
// import { getListValueDropdown } from '../../../utils/rule_engine/RuleEngine.utils';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import DatePicker from '../../form_components/date_picker/DatePicker';
import { getRValueInputMetadata } from './ruleConfig.selectors';
import { getCountryCodeDropdownList } from '../../../utils/UtilityFunctions';
import styles from './RValue.module.scss';
import { R_CONSTANT_OPTION_LIST, formatRValueErrors, formatRvalueUser, generateTimeOptionList } from './RValue.utils';
import { FIELD_TYPES, RULE_VALUE_STRINGS } from '../FormBuilder.strings';
import UserPicker from '../../user_picker/UserPicker';
import { R_CONSTANT_TYPES } from '../../../utils/constants/rule/rule.constant';
import { TEAM_TYPES_PARAMS, USER_TYPES_PARAMS } from '../../../utils/Constants';
import AnchorWrapper from '../../form_components/anchor/AnchorWrapper';
import { getValidationMessage } from '../../../containers/form/sections/form_field/field/Field.util';

const getMultiNumberValue = (_rValue) => {
  if (!isEmpty(_rValue)) {
    return _rValue.join(',');
  }
  return _rValue;
};
function RValue(props) {
  const {
    id,
    selectedOperatorInfo,
    selectedFieldInfo,
    onRValueChangeHandler,
    rValue,
    rConstant,
    onRConstantChangeHandler = () => {},
    errorRValue,
    className,
    ruleError,
    choiceValueTypeBased,
  } = props;
  const [optionList, setOptionList] = useState([]);
  const [isOptionListLoading, setIsOptionListLoading] = useState(true);
  const [selectedUserValue, setSelectedUserValue] = useState({ users: [], teams: [] });

  const [multiDDSelectedLabel, setMultiDDSelectedLabel] = useState([]);
  const { t } = useTranslation();

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
      case RULE_FIELD_TYPE.SINGLE_LINE:
      case RULE_FIELD_TYPE.NUMBER:
      case RULE_FIELD_TYPE.RADIO_GROUP:
      case RULE_FIELD_TYPE.DATE:
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
      case RULE_FIELD_TYPE.YES_NO:
        return [
          {
             label: 'Is True',
             value: 'true',
          },
          {
             label: 'Is False',
             value: 'false',
          },
       ];
      default:
        return [];
    }
  };

  useEffect(() => {
    if (!isEmpty(selectedOperatorInfo) && selectedOperatorInfo.has_operand) {
      const ddOperandList = [OPERAND_TYPES.DROPDOWN, OPERAND_TYPES.MULTI_DROPDOWN];

      if (ddOperandList.includes(selectedOperatorInfo.operand_field)) {
        getOptionList(selectedFieldInfo).then((options) => {
          setOptionList(options);
          if (Array.isArray(rValue)) {
            const selectedLabels = rValue.map((rVal) => {
              const _option = jsUtils.find(options, (o) => o.value === rVal);
              return _option?.label || '';
            });
            setMultiDDSelectedLabel(jsUtils.compact(selectedLabels));
          } else setMultiDDSelectedLabel([]);
          setIsOptionListLoading(false);
        });
      } else if (
        selectedOperatorInfo.operand_field === OPERAND_TYPES.USER_SELECT
      ) {
        if (rValue) setSelectedUserValue(jsUtils.omitBy(rValue, jsUtils.isNil));
      }
    }
  }, [selectedOperatorInfo, selectedFieldInfo, rValue]);

  if (!isEmpty(selectedOperatorInfo) && selectedOperatorInfo.has_operand) {
   // Common Change Handler
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

    // Multi Dropdown Change Handler
    const onChangeMultiHandler = (value, label) => {
      let valueList = isEmpty(rValue) ? [] : [...rValue];
      valueList = [...valueList];
      const index = valueList.findIndex((_value) => _value === value);
      if (index > -1) {
        valueList.splice(index, 1);
        setMultiDDSelectedLabel((existingValue) => { existingValue.splice(index, 1); return existingValue; });
      } else {
        valueList.push(value);
        setMultiDDSelectedLabel((existingValue) => { existingValue.push(label); return existingValue; });
      }
      return onRValueChangeHandler(uniq(valueList));
    };

    // Dual Field Change Handler Depend on Index
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

    // Multi Number Change Handler, onBlur to remove duplicate values
    const onChangeMultiNumberHandler = (event, isOnBlur) => {
      if (isEmpty(event.target.value)) { onRValueChangeHandler([]); return; }

        let enteredValue = event.target.value
          .trim()
          .split(',')
          // eslint-disable-next-line consistent-return, array-callback-return
          .flatMap((value) => {
            const num = parseInt(value, 10);
            if (isFiniteNumber(num)) return parseInt(value, 10);
          });
          if (isOnBlur) {
            enteredValue = uniq(enteredValue.filter((element) => element !== undefined));
          }
          onRValueChangeHandler(enteredValue);
    };
    const onBlurMultiNumberHandler = (event) => {
      onChangeMultiNumberHandler(event, true);
    };

    // User Chnage Handler
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

    const onRangeChange = (event, type) => {
      const { value } = event.target;
      const _rValue = rValue || {};
      if (isEmpty(value.toString())) {
        delete _rValue[type];
      } else {
        _rValue[type] = Number(value);
      }
      onChangeHandler({ target: { value: _rValue } });
    };

    const onPhoneNumberChange = (e) => {
      const { value = '' } = e.target;
      if (value === '' || /^(?!0)[0-9]+$/.test(value)) {
        onRValueChangeHandler(value);
      }
    };

    const getInputComponent = (operandFieldType) => {
      const inputFieldMetaData = getRValueInputMetadata(operandFieldType);
      switch (operandFieldType) {
        case OPERAND_TYPES.SINGLE_LINE:
        case OPERAND_TYPES.MULTI_SINGLE_LINE:
        case OPERAND_TYPES.EMAIL:
          return (
            <TextInput
              id={`${id || EMPTY_STRING}_string`}
              value={rValue || EMPTY_STRING}
              placeholder={inputFieldMetaData.placeHolder}
              onChange={onChangeHandler}
              required
              className={className}
              inputClassName={styles.RoundedField}
              errorMessage={errorRValue}
              size={Size.md}
            />
          );
        case OPERAND_TYPES.NUMBER: {
          const isDateField = [FIELD_TYPES.DATE, FIELD_TYPES.DATETIME].includes(selectedFieldInfo.field_type);
          if (choiceValueTypeBased && isDateField) {
            const isDateTime =
              selectedFieldInfo.field_type === FIELD_TYPES.DATETIME;
            const checkboxOption = {
              label: isDateTime ? 'Now' : 'Today',
              value: isDateTime ? R_CONSTANT_TYPES.NOW : R_CONSTANT_TYPES.TODAY,
            };
            const isRConstantSelected = rConstant === R_CONSTANT_TYPES.NOW || rConstant === R_CONSTANT_TYPES.TODAY;
            return (
              <div
                className={cx(gClasses.DisplayFlex, gClasses.Gap16, gClasses.ML16)}
              >
                {isDateTime ? (
                  <SingleDropdown
                    optionList={cloneDeep(R_CONSTANT_OPTION_LIST)}
                    selectedValue={rConstant || EMPTY_STRING}
                    onClick={(v) => onRConstantChangeHandler(v)}
                    dropdownViewProps={{
                      size: Size.md,
                    }}
                    showReset
                    className={gClasses.Width120}
                  />
                ) :
                  (<Checkbox
                    details={checkboxOption}
                    onClick={() => {
                      onRConstantChangeHandler(rConstant ? null : checkboxOption.value);
                    }}
                    className={gClasses.MT6}
                    isValueSelected={isRConstantSelected}
                  />
                )}
                <Text content="(or)" size={ETextSize.SM} className={cx(gClasses.MT6)} />
                <DatePicker
                  hideLabel
                  id={`${id || EMPTY_STRING}-rConstant`}
                  getDate={(value) => onChangeHandler({ target: { value } })}
                  date={rValue}
                  enableTime={isDateTime}
                  errorMessage={errorRValue}
                  hideMessage={!errorRValue}
                  isScrollIntoView
                  className={cx(styles.RoundedField, className, gClasses.ML4)}
                  helperMessageClass={styles.DateErrMsg}
                  innerClassName={styles.height32}
                  readOnly={isRConstantSelected}
                  disabled={isRConstantSelected}
                />
              </div>
            );
          }

          return (
            <TextInput
              id={`${id || EMPTY_STRING}_number`}
              placeholder={inputFieldMetaData.placeHolder}
              onChange={(event) => onChangeHandler(event, true)}
              value={rValue}
              errorMessage={errorRValue}
              className={className}
              inputClassName={styles.RoundedField}
              type="number"
              size={Size.md}
            />
          );
        }
        case OPERAND_TYPES.DUAL_NUMBER:
          const dualNumberErrors = formatRValueErrors(ruleError, operandFieldType);
          return (
            <div className={styles.DualField}>
              <TextInput
                id={`${id || EMPTY_STRING}-number-one`}
                placeholder={inputFieldMetaData.placeHolder}
                onChange={(event) => onChangeDualHandler(event, 0, true)}
                value={get(rValue, [0])}
                errorMessage={dualNumberErrors.firstFieldError}
                type="number"
                size={Size.md}
                inputClassName={styles.RoundedField}
              />
              <TextInput
                id={`${id || EMPTY_STRING}-number-two`}
                placeholder={inputFieldMetaData.placeHolder}
                onChange={(event) => onChangeDualHandler(event, 1, true)}
                value={get(rValue, [1])}
                errorMessage={dualNumberErrors.secondFieldError}
                type="number"
                size={Size.md}
                inputClassName={styles.RoundedField}

              />
            </div>
          );
        case OPERAND_TYPES.MULTI_NUMBER:
          return (
            <div className={styles.DualField}>
              <TextInput
                  id={`${id || EMPTY_STRING}-multi-number`}
                  placeholder={RULE_VALUE_STRINGS.MULTI_NUMBER.PLACEHOLDER}
                  value={getMultiNumberValue(rValue)}
                  onChange={(event) => onChangeMultiNumberHandler(event)}
                  onBlurHandler={onBlurMultiNumberHandler}
                  errorMessage={errorRValue}
                  size={Size.md}
                  inputClassName={styles.RoundedField}
              />
              {/* <SingleDropdown
                id={`${id || EMPTY_STRING}_multi-number-dropdown`}
                className={BS.W100}
                dropdownViewProps={{
                    className: styles.RoundedField,
                    size: Size.md,
                }}
                placeholder={RULE_VALUE_STRINGS.MULTI_NUMBER.DROPDOWN_PLACEHOLDER}
                optionList={getListValueDropdown(rValue)}
                errorMessage={errorRValue}
              /> */}
            </div>
          );
        case OPERAND_TYPES.DROPDOWN: {
          return (
            <SingleDropdown
                id={`${id || EMPTY_STRING}-dropdown`}
                className={styles.SingleDropdwon}
                dropdownViewProps={{
                    isLoading: isOptionListLoading,
                    className: cx(styles.RoundedField, className),
                    size: Size.md,
                    selectedLabel: optionList.find((o) => o.value === rValue)?.label || '',
                }}
                placeholder={RULE_VALUE_STRINGS.DROPDOWN.PLACEHOLDER}
                optionList={cloneDeep(optionList)}
                onClick={(value) => onChangeHandler(value)}
                selectedValue={rValue || EMPTY_STRING}
                errorMessage={errorRValue}
            />
          );
        }
        case OPERAND_TYPES.MULTI_DROPDOWN: {
          return (
            <MultiDropdown
                id={`${id || EMPTY_STRING}-multi-dropdown`}
                getClassName={() => styles.MultiDropdown}
                dropdownViewProps={{
                    isLoading: isOptionListLoading,
                    className: cx(styles.RoundedField, className),
                    selectedLabel: multiDDSelectedLabel.join(', '),
                    size: Size.md,
                    placeholder: RULE_VALUE_STRINGS.DROPDOWN.MULTI_DD_PLACEHOLDER,
                    errorMessage: errorRValue,
                }}
                placeholder={inputFieldMetaData.placeHolder}
                optionList={cloneDeep(optionList)}
                onClick={onChangeMultiHandler}
                selectedListValue={rValue || []}
            />
          );
        }
        case OPERAND_TYPES.DATE:
          return (
            <div className={BS.P_RELATIVE}>
              <DatePicker
                hideLabel
                id={`${id || EMPTY_STRING}-date`}
                getDate={(value) => onChangeHandler({ target: { value } })}
                date={rValue}
                errorMessage={errorRValue}
                hideMessage={!errorRValue}
                isScrollIntoView
                className={cx(styles.RoundedField, className)}
                helperMessageClass={styles.DateErrMsg}
                innerClassName={styles.height32}
              />
            </div>
          );
        case OPERAND_TYPES.DATE_TIME:
          return (
            <div className={BS.P_RELATIVE}>
              <DatePicker
                hideLabel
                id={`${id || EMPTY_STRING}-date-time`}
                getDate={(value) => onChangeHandler({ target: { value } })}
                date={rValue}
                errorMessage={errorRValue}
                hideMessage={!errorRValue}
                isScrollIntoView
                className={cx(styles.RoundedField, className)}
                helperMessageClass={styles.DateErrMsg}
                enableTime
                fieldType={FIELD_TYPES.DATETIME}
                innerClassName={styles.height32}
              />
            </div>
          );
        case OPERAND_TYPES.USER_SELECT:
            const userError = formatRvalueUser(ruleError);
          return (
            <UserPicker
             id={`${id || EMPTY_STRING}-users`}
             selectedValue={selectedUserValue}
             errorMessage={userError}
             isSearchable
             hideLabel
             allowedUserType={USER_TYPES_PARAMS.ALL_USERS}
             allowedTeamType={TEAM_TYPES_PARAMS.SYSTEM_ORGANISATION_TEAMS}
             onSelect={userOrTeamChangeHandler}
             onRemove={removeUserOrTeamHandler}
             className={styles.UserPicker}
            />
          );
        case OPERAND_TYPES.DUAL_DATE_TIME:
          const dualDateErrorData = formatRValueErrors(ruleError, operandFieldType);
          return (
            <div className={cx(styles.DualField, BS.P_RELATIVE)}>
              <div className={styles.Text}>
                <Text
                  content="From"
                  size={ETextSize.MD}
                />
              </div>
              <DatePicker
                hideLabel
                id={`${id || EMPTY_STRING}-from-date-time`}
                getDate={(value) => onChangeDualHandler({ target: { value } }, 0)}
                date={get(rValue, [0])}
                errorMessage={dualDateErrorData.firstFieldError}
                hideMessage={!dualDateErrorData.firstFieldError}
                isScrollIntoView
                className={className}
                helperMessageClass={styles.DateErrMsg}
                enableTime
                fieldType={FIELD_TYPES.DATETIME}
                innerClassName={styles.height32}
              />
              <div className={styles.Text}>
               <Text
                content="To"
                size={ETextSize.MD}
               />
              </div>
              <DatePicker
                hideLabel
                id={`${id || EMPTY_STRING}-to-date-time`}
                getDate={(value) => onChangeDualHandler({ target: { value } }, 1)}
                date={get(rValue, [1])}
                errorMessage={dualDateErrorData.secondFieldError}
                hideMessage={!dualDateErrorData.secondFieldError}
                isScrollIntoView
                className={className}
                helperMessageClass={styles.DateErrMsg}
                enableTime
                fieldType={FIELD_TYPES.DATETIME}
                innerClassName={styles.height32}
              />
            </div>
          );
        case OPERAND_TYPES.DUAL_DATE:
          const dualDateErrors = formatRValueErrors(ruleError, operandFieldType);
          return (
            <div className={cx(styles.DualField, className)}>
              <div className={styles.Text}>
                <Text
                  content="From"
                  size={ETextSize.MD}
                />
              </div>
              <DatePicker
                hideLabel
                id={`${id || EMPTY_STRING}-from-date`}
                popperClasses={gClasses.ZIndex5}
                getDate={(value) =>
                  onChangeDualHandler({ target: { value } }, 0)
                }
                date={get(rValue, [0])}
                errorMessage={dualDateErrors.firstFieldError}
                hideMessage={!dualDateErrors.firstFieldError}
                isScrollIntoView
                helperMessageClass={styles.DateErrMsg}
                innerClassName={styles.height32}
              />
              <div className={styles.Text}>
                <Text
                  content="To"
                  size={ETextSize.MD}
                />
              </div>
              <DatePicker
                hideLabel
                id={`${id || EMPTY_STRING}-to-date`}
                popperClasses={gClasses.ZIndex5}
                getDate={(value) =>
                  onChangeDualHandler({ target: { value } }, 1)
                }
                date={get(rValue, [1])}
                errorMessage={dualDateErrors.secondFieldError}
                hideMessage={!dualDateErrors.secondFieldError}
                isScrollIntoView
                helperMessageClass={styles.DateErrMsg}
                innerClassName={styles.height32}
              />
            </div>
          );
        case OPERAND_TYPES.DUAL_TIME:
          const dualTimeErrorData = formatRValueErrors(ruleError, operandFieldType);
          const timeOptions = generateTimeOptionList();
          return (
            <div className={cx(styles.DualField)}>
              <div className={styles.Text}>
                <Text
                  content={RULE_VALUE_STRINGS.DUAL_TIME.LABEL_1}
                  size={ETextSize.MD}
                />
              </div>
              <SingleDropdown
                id={`${id || EMPTY_STRING}-from-time`}
                optionList={timeOptions}
                errorMessage={dualTimeErrorData.firstFieldError}
                className={styles.SingleDropdwon}
                dropdownViewProps={{
                    className: cx(styles.RoundedField, className),
                    size: Size.md,
                    selectedLabel: timeOptions.find((o) => o.value === get(rValue, [0]))?.label || '',
                }}
                placeholder={RULE_VALUE_STRINGS.DUAL_TIME.PLACEHOLDER_1}
                onClick={(value) => onChangeDualHandler({ target: { value } }, 0)}
                selectedValue={get(rValue, [0]) || EMPTY_STRING}
              />
              <div className={styles.Text}>
                <Text
                  content={RULE_VALUE_STRINGS.DUAL_TIME.LABEL_2}
                  size={ETextSize.MD}
                />
              </div>
              <SingleDropdown
                id={`${id || EMPTY_STRING}-to-time`}
                optionList={generateTimeOptionList()}
                errorMessage={dualTimeErrorData.secondFieldError}
                className={styles.SingleDropdwon}
                dropdownViewProps={{
                    className: cx(styles.RoundedField, className),
                    size: Size.md,
                    selectedLabel: timeOptions.find((o) => o.value === get(rValue, [1]))?.label || '',
                }}
                placeholder={RULE_VALUE_STRINGS.DUAL_TIME.PLACEHOLDER_2}
                onClick={(value) => onChangeDualHandler({ target: { value } }, 1)}
                selectedValue={get(rValue, [1]) || EMPTY_STRING}
              />
            </div>
          );
        case OPERAND_TYPES.MIN_MAX:
          return (
            <div>
              <div className={styles.DualField}>
                <TextInput
                  id={`${id || EMPTY_STRING}-range-min`}
                  placeholder={inputFieldMetaData.minPlaceholder}
                  onChange={(event) => onRangeChange(event, 'min')}
                  value={get(rValue, 'min')}
                  type="number"
                  size={Size.md}
                  inputClassName={styles.RoundedField}
                />
                <TextInput
                  id={`${id || EMPTY_STRING}-range-max`}
                  placeholder={inputFieldMetaData.maxPlaceholder}
                  onChange={(event) => onRangeChange(event, 'max')}
                  value={get(rValue, 'max')}
                  type="number"
                  size={Size.md}
                  inputClassName={styles.RoundedField}
                />
              </div>
              { errorRValue && <Text className={cx(gClasses.MT4, gClasses.FOne11RedV7)} size={ETextSize.XS} content={errorRValue} /> }
            </div>
          );
        case OPERAND_TYPES.PHONE_NUMBER:
          return (
            <TextInput
              id={`${id || EMPTY_STRING}_string`}
              value={rValue || EMPTY_STRING}
              placeholder={inputFieldMetaData.placeHolder}
              onChange={onPhoneNumberChange}
              required
              className={className}
              inputClassName={styles.RoundedField}
              errorMessage={errorRValue}
              size={Size.md}
            />
          );
        case OPERAND_TYPES.LINK:
          const field = { fieldType: selectedFieldInfo.field_type };
          return (
          <AnchorWrapper
            id={`${id || EMPTY_STRING}_string`}
            value={rValue || []}
            isMultiple
            isDelete
            placeholder={t('form_builder_strings.link_field.link_text_placeholder')}
            valuePlaceholder={t('form_builder_strings.link_field.link_url_placeholder')}
            onChange={onRValueChangeHandler}
            errorMessage={getValidationMessage(errorRValue || {}, field, `${CBAllKeys.R_VALUE}`)}
            size={Size.md}
          />
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
    <TextInput
        id={`${id || EMPTY_STRING}-disabled`}
        readOnly
        placeholder={t(QUERY_BUILDER.ALL_PLACEHOLDERS.VALUES)}
        className={className}
        size={Size.md}
        inputClassName={styles.RoundedField}
    />
  );
}

export default RValue;
