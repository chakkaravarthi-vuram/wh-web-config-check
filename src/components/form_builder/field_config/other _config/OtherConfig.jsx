import React, { useContext, useEffect, useRef, useState } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FormulaBuilder from 'components/formula_builder/FormulaBuilder';
import { BS } from 'utils/UIConstants';
// import { FORMULA_BUILDER } from 'components/formula_builder/FormulaBuilder.strings';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { FORMULA_EXPRESSION_COMMON_STRINGS, FORMULA_BUILDER_REDUX_KEYS } from 'components/formula_builder/FormulaBuilder.strings';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import { clearFormulaBuilderValues, setFormulaTokenChange } from 'redux/reducer/FormulaBuilderReducer';
import { KEY_CODES } from 'utils/Constants';
import Input from '../../../form_components/input/Input';
import INPUT_VARIANTS from '../../../form_components/input/Input.strings';
import gClasses from '../../../../scss/Typography.module.scss';

import { FIELD_CONFIG, FIELD_TYPES } from '../../FormBuilder.strings';
import { defaultValueRuleOperatorThunk } from '../../../../redux/actions/DefaultValueRule.Action';
import { getAccountConfigurationDetailsApiService } from '../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';

import { isEmpty, get, set, isUndefined, isNull, isObject, has, cloneDeep } from '../../../../utils/jsUtility';
import CheckboxGroup from '../../../form_components/checkbox_group/CheckboxGroup';
import DefaultValueRule from '../basic_config/DefaultValueRule';
import { getDefaultRuleValueDropdownList } from '../../../../redux/reducer';
import { arryToDropdownData } from '../../../../utils/UtilityFunctions';
import Dropdown from '../../../form_components/dropdown/Dropdown';
import RadioGroup, {
  RADIO_GROUP_TYPE,
} from '../../../form_components/radio_group/RadioGroup';
import DatePicker from '../../../form_components/date_picker/DatePicker';
import {
  FIELD_KEYS,
  DEFAULT_CALCULATOR_APPLICABLE_FIELD_TYPES,
  PLACEHOLDER_APPLICABLE_FIELD_TYPES,
  DEFAULT_RULE_KEYS,
  TABLE_DEFAULT_CALCULATOR_APPLICABLE_FIELD_TYPES,
} from '../../../../utils/constants/form.constant';
import { getDropdownData } from '../../../../utils/generatorUtils';
import LinkFieldDefaultValue from './LinkFieldDefaultValue';
import InfoField from '../../../form_components/info_field/InfoField';
import FormBuilderContext from '../../FormBuilderContext';
import MobileNumber from '../../../form_components/mobile_number/MobileNumber';
import { CONFIRMATION_MODAL_ACTION_TYPE, OTHER_CONFIG_STRINGS } from './OtherConfig.strings';
import styles from '../FieldConfig.module.scss';

function OtherConfig(props) {
  const { t } = useTranslation();
  const { BASIC_CONFIG, OTHER_CONFIG } = FIELD_CONFIG(t);
  const {
    sectionId,
    tableUuid,
    fieldId,
    fieldListIndex,
    onOtherConfigChangeHandler,
    onOtherConfigBlurHandler,
    fieldData,
    isTableField,
    error_list,
    defaultValueApi,
    fieldType,
    defaultValueOptionList,
    onDefaultChangeHandler,
    onDefaultRuleOperatorDropdownHandler,
    onDefaultLValueRuleHandler,
    onDefaultRValueRuleHandler,
    onDefaultExtraOptionsRuleHandler,
    onDefaultRuleOperatorInfoHandler,
    onDefaultValueRuleHandler,
    getDefaultRuleDetailsByIdApiThunk,
    onClearFormulaBuilderValue,
    onFormulaBuilderDataChange,
    formulaBuilderState,
    codeData,
  } = props;
  const {
    setAdditionalErrorList,
    userDetails,
    isTaskForm,
    taskId,
    stepOrder,
    isDataListForm,
    disableDefaultValueConfig,
    onDefaultValueCalculationTypeHandler,
    onDefaultRuleAdvanceCodeInputHandler,
    onDefaultRuleAdvanceCodeErrortHandler,
    onUserSelectorDefaultValueChangeHandler,
  } = useContext(FormBuilderContext);

  const isPlaceholder = PLACEHOLDER_APPLICABLE_FIELD_TYPES.includes(fieldType);
  const [allowedCurrencyList, setAllowedCurrencyList] = useState([]);
  const [confirmationModalActionType, setConfirmationModalActionType] = useState(null);
  const [calculationType, setCalculationType] = useState(null);
  const remainToSaveBtnRef = useRef();
  useEffect(() => {
          defaultValueApi(fieldType);
          if (fieldType === FIELD_TYPES.CURRENCY) {
            getAccountConfigurationDetailsApiService().then((response) => {
              if (response.allowed_currency_types) {
                let allowedCurrencyOptionList = [];
                if (response.allowed_currency_types) {
                  allowedCurrencyOptionList = [
                    { value: null, label: 'None' },
                    ...arryToDropdownData(response.allowed_currency_types),
                  ];
                }
                setAllowedCurrencyList(allowedCurrencyOptionList);
              }
            });
          }
        }, []);

  useEffect(() => {
    if (confirmationModalActionType) {
      setTimeout(() => remainToSaveBtnRef.current?.focus(), 5);
    }
  }, [confirmationModalActionType]);

  // Below helps to handle error.
  let defaultCurrencyTypeError = null;
  let defaultPhoneNumberTypeError = null;
  let defaultValueError = null;
  let instructionError = null;
  let placeholderError = null;
  let helperTextError = null;
  if (!isEmpty(error_list)) {
    const { fieldListIndex } = props;
    Object.keys(error_list).forEach((id) => {
      if (id.includes('default_value')) {
        if (
          fieldType === FIELD_TYPES.LINK &&
          (id.includes('link_text') ||
            id.includes('link_url') ||
            id.includes('default_value'))
        ) {
          const idArray = id.split(',');
          if (
            parseInt(idArray[1], 10) === sectionId - 1 &&
            parseInt(idArray[3], 10) === fieldListIndex &&
            parseInt(idArray[5], 10) === fieldId - 1
          ) {
            if (isEmpty(defaultValueError)) defaultValueError = {};
            const index = Number(idArray[7]);
            let key = idArray[8];
            let position = [index, key];
            if (Number.isNaN(index) && isUndefined(key)) {
              key = 'default_value';
              position = key;
            }
            set(defaultValueError, position, error_list[id]);
          }
        } else if (id.includes('currency_type')) {
          const idArray = id.split(',');
          if (
            parseInt(idArray[1], 10) === sectionId - 1 &&
            parseInt(idArray[3], 10) === fieldListIndex &&
            parseInt(idArray[5], 10) === fieldId - 1
          ) {
            defaultCurrencyTypeError = error_list[id];
          }
        } else if (id.includes('phone_number') || id.includes('country_code')) {
          const idArray = id.split(',');
          if (
            parseInt(idArray[1], 10) === sectionId - 1 &&
            parseInt(idArray[3], 10) === fieldListIndex &&
            parseInt(idArray[5], 10) === fieldId - 1
          ) {
            defaultPhoneNumberTypeError = error_list[id];
          }
        } else {
          const idArray = id.split(',');

          if (
            parseInt(idArray[1], 10) === sectionId - 1 &&
            parseInt(idArray[3], 10) === fieldListIndex &&
            parseInt(idArray[5], 10) === fieldId - 1
          ) {
            defaultValueError = error_list[id];
          }
        }
      }
      if (id.includes('instructions')) {
        instructionError = error_list[id];
      }
      if (id.includes('place_holder')) {
        placeholderError = error_list[id];
      }
      if (id.includes('help_text')) {
        helperTextError = error_list[id];
      }
    });
  }
  if (fieldType === FIELD_TYPES.CURRENCY) {
    const allowedCurrency = allowedCurrencyList.map((currency) => currency.value);
    if (!isEmpty(get(fieldData, ['default_value', 'currency_type'], []))) {
      console.log('defaultCurrencyTypeError1',
      allowedCurrencyList,
      allowedCurrency,
      [get(fieldData, ['default_value', 'currency_type'])],
      [get(fieldData, ['default_value', 'currency_type'])].every((elem) => allowedCurrency.includes(elem)));
    if (!isEmpty(allowedCurrency) && ![get(fieldData, ['default_value', 'currency_type'])].every((elem) => allowedCurrency.includes(elem))) {
      const notAllowedTypes = [get(fieldData, ['default_value', 'currency_type'])].filter((x) => !allowedCurrency.includes(x));
      defaultCurrencyTypeError = `Default currency type contains unsupported type ${notAllowedTypes.toString()} `;
    }
  }
  }
  const onClearFormulaBuilderState = (isTabSwitch) => {
    if (isTabSwitch) {
      const { refreshOnCodeChange } = formulaBuilderState;
      onClearFormulaBuilderValue([
        FORMULA_BUILDER_REDUX_KEYS.LIST_FUNCTION,
        FORMULA_BUILDER_REDUX_KEYS.FIELD_METADATA,
        FORMULA_BUILDER_REDUX_KEYS.REFRESH_ON_CODE_CHANGE,
      ]);
      onFormulaBuilderDataChange({
        refreshOnCodeChange: !refreshOnCodeChange,
      });
    } else {
      onClearFormulaBuilderValue([
        FORMULA_BUILDER_REDUX_KEYS.LIST_FUNCTION,
      ]);
    }
  };

  const onFormulaBuilderCodeChange = (code = EMPTY_STRING, isInitial = false) => {
    onDefaultRuleAdvanceCodeInputHandler(sectionId - 1, fieldListIndex, fieldId - 1, code, isInitial);
  };

  const onFormulaBuilderErrorChange = (error = null) => {
    onDefaultRuleAdvanceCodeErrortHandler(sectionId - 1, fieldListIndex, fieldId - 1, error);
  };

  const checkIfDefaultCalculationValueEdited = () => {
      const default_value = fieldData[FIELD_KEYS.DEFAULT_DRAFT_VALUE] ? cloneDeep(fieldData[FIELD_KEYS.DEFAULT_DRAFT_VALUE]) : null;
      const previous_default_value = fieldData[FIELD_KEYS.PREVIOUS_DRAFT_DRAFT_RULE] ?
      cloneDeep(fieldData[FIELD_KEYS.PREVIOUS_DRAFT_DRAFT_RULE]) : null;

      if ((!default_value && previous_default_value) || (previous_default_value && !default_value)) return true;
      if (isObject(previous_default_value) && isObject(default_value)) {
          if (has(previous_default_value, [DEFAULT_RULE_KEYS.ERRORS], false)) {
              delete previous_default_value[DEFAULT_RULE_KEYS.ERRORS];
          }

          if (has(default_value, [DEFAULT_RULE_KEYS.ERRORS], false)) {
              delete default_value[DEFAULT_RULE_KEYS.ERRORS];
          }

          return !(JSON.stringify(previous_default_value) === JSON.stringify(default_value));
      }
      return true;
  };

  const onCalculationTypeChange = (value) => {
    if (!isNull(value) && value !== fieldData[FIELD_KEYS.IS_ADVANCED_EXPRESSION]) {
    onDefaultValueCalculationTypeHandler(sectionId - 1, fieldListIndex, fieldId - 1, value);
    onClearFormulaBuilderState(true);
    }
  };

  const onDefaultValueCheckBoxHandler = (force_update = false) => {
    if (
         !checkIfDefaultCalculationValueEdited() ||
         force_update ||
         !fieldData.is_field_default_value_rule
         ) {
            if (fieldData.is_field_default_value_rule) {
              onClearFormulaBuilderState();
            }
            onDefaultValueRuleHandler();
            return;
          }

    if (checkIfDefaultCalculationValueEdited() && !force_update) {
      setConfirmationModalActionType(CONFIRMATION_MODAL_ACTION_TYPE.DEFAULT_CALCULATION_CHECKBOX);
    }
  };

  const onCalculationTypeRadioChangeHandler = (value) => {
    if (checkIfDefaultCalculationValueEdited()) {
       setConfirmationModalActionType(CONFIRMATION_MODAL_ACTION_TYPE.CALCULATION_TYPE);
       setCalculationType(value);
    } else {
       onCalculationTypeChange(value);
    }
  };

  // renderDefaultValueInput function helps to render field specific default value input to configure default value.
  const renderDefaultValueInput = () => {
    let configInputs = null;

    switch (fieldType) {
      case FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN:
      case FIELD_TYPES.DROPDOWN:
        configInputs = (
          <Dropdown
            optionList={
              !isEmpty(fieldData.values)
                ? getDropdownData(
                    fieldData.values,
                    fieldType === FIELD_TYPES.DROPDOWN,
                  )
                : []
            }
            showReset
            onChange={onDefaultChangeHandler}
            id={BASIC_CONFIG.DEFAULT_DD_VALUE.ID}
            label={BASIC_CONFIG.DEFAULT_DD_VALUE.LABEL}
            selectedValue={fieldData.default_value}
            errorMessage={defaultValueError}
            disabled={!!fieldData[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]}
            disablePopper
          />
        );
        break;
      case FIELD_TYPES.RADIO_GROUP:
        configInputs = (
          <RadioGroup
            optionList={
              !isEmpty(fieldData.values) ? getDropdownData(fieldData.values) : []
            }
            onClick={onDefaultChangeHandler}
            placeholder={BASIC_CONFIG.DEFAULT_RB_VALUE.PLACEHOLDER}
            id={BASIC_CONFIG.DEFAULT_RB_VALUE.ID}
            label={BASIC_CONFIG.DEFAULT_RB_VALUE.LABEL}
            selectedValue={fieldData.default_value}
            errorMessage={defaultValueError}
            disabled={!!fieldData[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]}
            type={RADIO_GROUP_TYPE.TYPE_6}
          />
        );
        break;
      case FIELD_TYPES.YES_NO:
        configInputs = (
          <RadioGroup
            id={BASIC_CONFIG.DEFAULT_BOOLEAN_VALUE.ID}
            label={BASIC_CONFIG.DEFAULT_BOOLEAN_RADIO.LABEL}
            optionList={BASIC_CONFIG.DEFAULT_BOOLEAN_RADIO.OPTION_LIST}
            onClick={onDefaultChangeHandler}
            selectedValue={fieldData.default_value}
            readOnly={!!fieldData[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]}
          />
        );
        break;
      case FIELD_TYPES.SINGLE_LINE:
      case FIELD_TYPES.PARAGRAPH:
      case FIELD_TYPES.EMAIL:
        configInputs = (
          <Input
            label={BASIC_CONFIG.DEFAULT_VALUE.LABEL}
            id={BASIC_CONFIG.DEFAULT_VALUE.ID}
            onChangeHandler={onDefaultChangeHandler}
            value={fieldData.default_value}
            errorMessage={defaultValueError}
            disabled={!!fieldData[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]}
            readOnly={!!fieldData[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]}
          />
        );
        break;
      case FIELD_TYPES.NUMBER:
        configInputs = (
          <>
            <CheckboxGroup
              id={OTHER_CONFIG.VALUE_FORMATER.ID}
              label={OTHER_CONFIG.VALUE_FORMATER.ID}
              optionList={OTHER_CONFIG.VALUE_FORMATER.OPTION_LIST}
              hideLabel
              onClick={() => {
                const event = {
                  target: { id: OTHER_CONFIG.VALUE_FORMATER.ID, value: 1 },
                };
                onOtherConfigChangeHandler(event);
              }}
              selectedValues={fieldData.is_digit_formatted ? [1] : []}
            />
            <Input
              label={BASIC_CONFIG.DEFAULT_VALUE.LABEL}
              id={BASIC_CONFIG.DEFAULT_VALUE.ID}
              onChangeHandler={(event) => {
                event.target.value = event.target.value.replace(/[^0-9.]/g, '');
                onDefaultChangeHandler(event);
              }}
              value={fieldData.default_value}
              errorMessage={defaultValueError}
              // type="number"
              disabled={!!fieldData[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]}
              readOnly={!!fieldData[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]}
              onKeyDownHandler={(event) =>
                event.key === 'e' && event.preventDefault()
              }
            />
          </>
        );
        break;
      case FIELD_TYPES.DATETIME:
        configInputs = (
          <DatePicker
            label={BASIC_CONFIG.DEFAULT_DATE_VALUE.LABEL}
            placeholder={BASIC_CONFIG.DEFAULT_DATE_VALUE.PLACEHOLDER}
            id={BASIC_CONFIG.DEFAULT_DATE_VALUE.ID}
            getDate={onDefaultChangeHandler}
            date={fieldData.default_value}
            errorMessage={defaultValueError}
            readOnly={!!fieldData.is_default_value_rule}
            fixedStrategy
            showReset
            // popperPlacement={POPPER_PLACEMENTS.TOP_START}
            // popperFallbackPlacements={[POPPER_PLACEMENTS.BOTTOM_START]}
            enableTime
            setDateTimeErrorMessage={(errObj) => setAdditionalErrorList(errObj)}
          />
        );
        break;
      case FIELD_TYPES.DATE:
        configInputs = (
          <Row>
            <Col sm="8">
              <DatePicker
                label={BASIC_CONFIG.DEFAULT_DATE_VALUE.LABEL}
                placeholder={BASIC_CONFIG.DEFAULT_DATE_VALUE.PLACEHOLDER}
                id={BASIC_CONFIG.DEFAULT_DATE_VALUE.ID}
                getDate={onDefaultChangeHandler}
                date={fieldData.default_value}
                errorMessage={defaultValueError}
                readOnly={!!fieldData.is_default_value_rule}
                fixedStrategy
                showReset
                // popperPlacement={POPPER_PLACEMENTS.TOP_START}
                // popperFallbackPlacements={[POPPER_PLACEMENTS.BOTTOM_START]}
              />
            </Col>
          </Row>
        );
        break;
      case FIELD_TYPES.CURRENCY:
        configInputs = (
          <Row>
            <Col>
              <Input
                label={BASIC_CONFIG.DEFAULT_VALUE.LABEL}
                id={BASIC_CONFIG.DEFAULT_VALUE.ID}
                // onChangeHandler={onDefaultChangeHandler}
                onChangeHandler={(event) => {
                  event.target.value = event.target.value.replace(
                    /[^0-9.-]/g,
                    '',
                  );
                  onDefaultChangeHandler(event);
                }}
                value={get(fieldData, ['default_value', 'value'])}
                errorMessage={defaultValueError}
                // type="number"
                disabled={!!fieldData[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]}
                readOnly={!!fieldData[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]}
              />
              <Dropdown
                optionList={allowedCurrencyList}
                onChange={onDefaultChangeHandler}
                selectedValue={get(fieldData, ['default_value', 'currency_type'])}
                placeholder={BASIC_CONFIG.DEFAULT_CURRENCY_TYPE.PLACEHOLDER}
                id={BASIC_CONFIG.DEFAULT_CURRENCY_TYPE.ID}
                errorMessage={defaultCurrencyTypeError}
                label={BASIC_CONFIG.DEFAULT_CURRENCY_TYPE.LABEL}
                disabled={!!fieldData[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]}
                showNoDataFoundOption
                disablePopper
                setSelectedValue
                strictlySetSelectedValue
              />
            </Col>
          </Row>
        );
        break;
      case FIELD_TYPES.PHONE_NUMBER:
        const defaultPhoneNumberData = {
          phone_number: get(fieldData, ['default_value', 'phone_number']),
          country_code:
            get(fieldData, ['default_value', 'country_code']) ||
            get(userDetails, ['default_country_code']),
        };
        configInputs = (
          <MobileNumber
            label={BASIC_CONFIG.DEFAULT_VALUE.LABEL}
            id={BASIC_CONFIG.DEFAULT_PHONE_NUMBER_TYPE.ID}
            onChangeHandler={onDefaultChangeHandler}
            onCountryCodeChange={onDefaultChangeHandler}
            mobile_number={defaultPhoneNumberData.phone_number}
            countryCodeId={defaultPhoneNumberData.country_code}
            disabled={!!fieldData[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]}
            placeholder={BASIC_CONFIG.DEFAULT_PHONE_NUMBER_TYPE.PLACEHOLDER}
            errorMessage={defaultPhoneNumberTypeError}
            isFromDefaultValue
          />
        );
        break;
      case FIELD_TYPES.LINK:
        configInputs = (
          <LinkFieldDefaultValue
            fieldData={fieldData}
            onDefaultChangeHandler={onDefaultChangeHandler}
            defaultValueError={defaultValueError}
          />
        );
        break;
      case FIELD_TYPES.USER_TEAM_PICKER:
        configInputs = (
          <Dropdown
            optionList={OTHER_CONFIG.USER_SELECTOR_DEFAULT_VALUE.OPTION_LIST}
            onChange={onDefaultChangeHandler}
            id={BASIC_CONFIG.DEFAULT_DD_VALUE.ID}
            label={BASIC_CONFIG.DEFAULT_DD_VALUE.LABEL}
            selectedValue={fieldData.default_value ? fieldData.default_value.system_field : null}
            disabled={!!fieldData[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]}
            disablePopper
            showReset
          />
        );
        break;
      default:
        break;
    }
    return configInputs;
  };

  const onUserDefaultValueSelectHandler = (event) => {
    onUserSelectorDefaultValueChangeHandler(event, sectionId - 1, fieldListIndex, fieldId - 1);
  };

  const userSelecterDefaultValueConfigHandler = () => {
    if (fieldData.default_value && fieldType === FIELD_TYPES.USER_TEAM_PICKER) {
      return (
        <RadioGroup
        hideLabel
        enableOptionDeselect
        optionList={OTHER_CONFIG_STRINGS(t).USER_SELECTOR_DEFAULT_VALUE.OPTION_LIST}
        onClick={onUserDefaultValueSelectHandler}
        selectedValue={get(fieldData, [FIELD_KEYS.DEFAULT_VALUE, FIELD_KEYS.DEFAULT_VALUE_OPERATION])}
        type={RADIO_GROUP_TYPE.TYPE_1}
        readOnlyField={!fieldData.validations.allow_multiple ? 'append' : null}
        errorMessage={defaultValueError}
        />
      );
    }
    return null;
  };
  // renderDefaultCalculator function helps to render default value calculator .
  const renderDefaultCalculator = () => {
    if (
      !DEFAULT_CALCULATOR_APPLICABLE_FIELD_TYPES.includes(fieldType) ||
      (isTableField && !TABLE_DEFAULT_CALCULATOR_APPLICABLE_FIELD_TYPES.includes(fieldType))
    ) {
      return null;
    }

    let default_calculator_component = null;
    // const is_new_default_value_calculator = get(fieldType, ['is_new_default_value_calculator', false]);

    if (
      fieldData.is_field_default_value_rule &&
      fieldData[FIELD_KEYS.IS_ADVANCED_EXPRESSION]
    ) {
      default_calculator_component = (
        <FormulaBuilder
          isTaskForm={isTaskForm}
          taskId={taskId}
          stepOrder={stepOrder}
          isDataListForm={isDataListForm}
          fieldError={get(fieldData, [FIELD_KEYS.DEFAULT_DRAFT_VALUE, DEFAULT_RULE_KEYS.ERRORS], {})}
          existingData={codeData}
          ruleId={fieldData.field_default_value_rule}
          currentFieldUUID={fieldData.field_uuid}
          onCodeChange={onFormulaBuilderCodeChange}
          onErrorChange={onFormulaBuilderErrorChange}
        />
      );
    } else if (
      fieldData.is_field_default_value_rule &&
      (!fieldData[FIELD_KEYS.IS_ADVANCED_EXPRESSION]) &&
      !isEmpty(defaultValueOptionList)
    ) {
      default_calculator_component = (
        <DefaultValueRule
          isEnabled={fieldData.is_field_default_value_rule}
          operator={
            fieldData.draft_default_rule
              ? fieldData.draft_default_rule.operator
              : null
          }
          savedLValue={
            fieldData.draft_default_rule
              ? fieldData.draft_default_rule.lValue
              : null
          }
          savedRValue={
            fieldData.draft_default_rule
              ? fieldData.draft_default_rule.rValue
              : null
          }
          extraOptions={get(fieldData, ['draft_default_rule', 'extraOptions'], null)}
          previous_draft_default_rule={get(fieldData, ['previous_draft_default_rule'], null)}
          ruleErrors={
            fieldData.draft_default_rule
              ? fieldData.draft_default_rule.errors
              : null
          }
          fieldType={fieldType}
          fieldId={fieldId}
          fieldUUID={fieldData.field_uuid}
          defaultRuleId={fieldData.field_default_value_rule}
          sectionId={sectionId}
          serverFieldId={fieldData.field_id}
          tableUuid={tableUuid}
          isTableField={isTableField}
          getDefaultRuleByIdApiThunk={getDefaultRuleDetailsByIdApiThunk}
          onDefaultRuleOperatorDropdownHandler={
            onDefaultRuleOperatorDropdownHandler
          }
          onDefaultLValueRuleHandler={onDefaultLValueRuleHandler}
          onDefaultRValueRuleHandler={onDefaultRValueRuleHandler}
          onDefaultExtraOptionsRuleHandler={onDefaultExtraOptionsRuleHandler}
          onDefaultRuleOperatorInfoHandler={onDefaultRuleOperatorInfoHandler}
        />
      );
    }
    return (
      <div className={gClasses.MB12}>
          <div className={gClasses.MB12}>
            <CheckboxGroup
              id={BASIC_CONFIG.DEFAULT_VALUE_CB_ID}
              label={BASIC_CONFIG.DEFAULT_VALUE_CB_ID}
              optionList={BASIC_CONFIG.DEFAULT_VALUE_RULE}
              onClick={() => onDefaultValueCheckBoxHandler()}
              selectedValues={fieldData.is_field_default_value_rule ? [1] : []}
              hideLabel
              hideMessage
              disabled={disableDefaultValueConfig}
            />
          </div>
        <div className={BS.P_RELATIVE}>
          {
             (confirmationModalActionType) ?
             (<div
               className={cx(
                   BS.D_FLEX,
                   BS.ALIGN_ITEM_CENTER,
                   BS.JC_CENTER,
                   BS.P_ABSOLUTE,
                   styles.DefaultCalculationConfirmationModal,
                )}
             >
              <div className={cx(styles.ModalContent)}>
                <h3 className={cx(gClasses.FTwo13GrayV3, gClasses.FontWeight500)}>
                  {FORMULA_EXPRESSION_COMMON_STRINGS(t).CALCULATION_TYPE_CONFIRMATION_MESSAGE}
                </h3>
                <div className={cx(BS.D_FLEX, BS.JC_CENTER, gClasses.MT15)}>
                    <Button
                        buttonType={BUTTON_TYPE.SECONDARY}
                        className={cx(gClasses.FTwo11, gClasses.FontWeight600, styles.ConfirmButton, gClasses.MR8)}
                        onClick={() => {
                          if (confirmationModalActionType === CONFIRMATION_MODAL_ACTION_TYPE.CALCULATION_TYPE) {
                            onCalculationTypeChange(calculationType);
                          } else if (confirmationModalActionType === CONFIRMATION_MODAL_ACTION_TYPE.DEFAULT_CALCULATION_CHECKBOX) {
                            onDefaultValueCheckBoxHandler(true);
                          }

                          setConfirmationModalActionType(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.keyCode === KEY_CODES.TAB && e.shiftKey) {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }}
                    >
                       {FORMULA_EXPRESSION_COMMON_STRINGS(t).LOOSE_AND_PROCEED}
                    </Button>
                    <Button
                        buttonType={BUTTON_TYPE.PRIMARY}
                        className={cx(gClasses.FTwo11, gClasses.FontWeight600, styles.ConfirmButton)}
                        buttonRef={remainToSaveBtnRef}
                        onKeyDown={(e) => {
                          if (e.keyCode === KEY_CODES.TAB && !e.shiftKey) {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }}
                        onClick={() => setConfirmationModalActionType(null)}
                    >
                       {FORMULA_EXPRESSION_COMMON_STRINGS(t).REMAIN_TO_SAVE}
                    </Button>
                </div>
              </div>
              </div>) : null
          }
          <div className={confirmationModalActionType ? styles.DefaultCalculationBlurEffect : null}>
            {
              fieldData.is_field_default_value_rule &&
              !([FIELD_TYPES.DATE, FIELD_TYPES.DATETIME].includes(fieldType)) &&
              (
                  <RadioGroup
                    hideLabel
                    enableOptionDeselect
                    optionList={OTHER_CONFIG_STRINGS(t).DEFAULT_CALCULATION.OPTION_LIST}
                    onClick={onCalculationTypeRadioChangeHandler}
                    selectedValue={get(fieldData, [FIELD_KEYS.IS_ADVANCED_EXPRESSION], false)}
                    type={RADIO_GROUP_TYPE.TYPE_1}
                  />
              )
            }
            {default_calculator_component}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderDefaultValueInput()}
      {renderDefaultCalculator()}
      {userSelecterDefaultValueConfigHandler()}
      {isPlaceholder && (
        <Input
          id={OTHER_CONFIG.PLACEHOLDER_VALUE.ID}
          placeholder={OTHER_CONFIG.PLACEHOLDER_VALUE.PLACEHOLDER}
          label={OTHER_CONFIG.PLACEHOLDER_VALUE.LABEL}
          onChangeHandler={onOtherConfigChangeHandler}
          onBlurHandler={onOtherConfigBlurHandler}
          value={fieldData.place_holder}
          errorMessage={error_list ? placeholderError : null}
        />
      )}
      <InfoField
        // id={OTHER_CONFIG.INSTRUCTION.ID}
        placeholder={OTHER_CONFIG.INSTRUCTION.PLACEHOLDER}
        label={OTHER_CONFIG.INSTRUCTION.LABEL}
        onChangeHandler={onOtherConfigChangeHandler}
        description={fieldData.instructions}
        noToolbar
        errorMessage={error_list ? instructionError : null}
        isInstruction
      />
      <Input
        id={OTHER_CONFIG.HELPER_TOOL_TIP.ID}
        placeholder={OTHER_CONFIG.HELPER_TOOL_TIP.PLACEHOLDER}
        label={OTHER_CONFIG.HELPER_TOOL_TIP.LABEL}
        onChangeHandler={onOtherConfigChangeHandler}
        onBlurHandler={onOtherConfigBlurHandler}
        value={fieldData.help_text}
        className={gClasses.PT15}
        inputVariant={INPUT_VARIANTS.TYPE_5}
        errorMessage={error_list ? helperTextError : null}
      />
    </>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    createTaskServerError: state.CreateTaskReducer.server_error,
    createFlowServerError: state.EditFlowReducer.server_error,
    codeData: state.FormulaBuilderReducer.code,
    formulaBuilderState: state.FormulaBuilderReducer,
    defaultValueOptionList: getDefaultRuleValueDropdownList(
      state,
      ownProps.fieldType,
      ownProps.isTableField,
    ),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    defaultValueApi: (fieldType) =>
      dispatch(defaultValueRuleOperatorThunk(fieldType)),
      onClearFormulaBuilderValue: (persist_data_keys = []) => dispatch(
        clearFormulaBuilderValues(persist_data_keys),
      ),
      onFormulaBuilderDataChange: (updated_data = {}) => dispatch(setFormulaTokenChange(updated_data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherConfig);
OtherConfig.defaultProps = {
  fieldData: {},
  onOtherConfigChangeHandler: null,
  onOtherConfigBlurHandler: null,
};
OtherConfig.propTypes = {
  onOtherConfigChangeHandler: PropTypes.func,
  onOtherConfigBlurHandler: PropTypes.func,
  fieldData: PropTypes.objectOf(PropTypes.any),
};
