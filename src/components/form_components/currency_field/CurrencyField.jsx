import { InputDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './CurrencyField.module.scss';
import { arryToDropdownData } from '../../../utils/UtilityFunctions';
import { getLocale, isEmpty, isFiniteNumber } from '../../../utils/jsUtility';
import { formatEngine } from '../../form_builder/section/form_fields/FormField.utils';
import { constructDecimalZeroValue, constructValue } from '../../../containers/form/sections/form_field/field/Field.util';

const DECIMAL_VALUE_REGEX = /^[0-9]\d*(\.\d+)?$/;
const NUMBERS_AND_DOT_ONLY_REGEX = /^[0-9.]+$/;
const NUMBERS_DOT_COMMA_ONLY_REGEX = /^[0-9.,]+$/;

function CurrencyField(props) {
  const {
    id,
    label,
    className,
    labelClassName,
    errorMessage,
    popperClassName,
    errorVariant,
    instruction,
    placeholder,
    helpTooltip,
    hideLabel,
    required,
    onChange,
    value,
    optionList,
    defaultCurrencyType,
    allowedCurrencyTypes = [],
    disabled,
    size,
    colorScheme,
    referenceName,
    popperStyle,
    allowFormatting,
    fieldData,
  } = props;

  const [prevCount, setPrevCount] = useState(0);
  const [prevNum, setPrevNum] = useState('');
  const [prevNumber, setPrevNumber] = useState('');
  const [eachKeyStroke, seteachKeyStroke] = useState('');

  const globalKeyDownHandler = (event) => {
      seteachKeyStroke(event.key);
  };

  useEffect(() => {
      document.addEventListener('keydown', globalKeyDownHandler);
      return (() => document.removeEventListener('keydown', globalKeyDownHandler));
  }, []);

  const currencyType = value?.currency_type || defaultCurrencyType;
  const currLocale = getLocale(currencyType);
  const _optionList = arryToDropdownData(optionList || allowedCurrencyTypes || []);
  const currencyValue = useMemo(() => {
    if (allowFormatting) {
      if (!isEmpty(currLocale) && !isEmpty(value?.value?.toString()) && value?.value?.toString()?.length > 0) {
        const currencyValue =
          value?.value?.toString()?.charAt(value.value.toString().length - 1) !== '.'
            ? constructDecimalZeroValue(value.value, currLocale)
            : constructValue(value && value.value, prevNum, true, currLocale);
        return currencyValue;
      } else {
        return '';
      }
    }

    return isFiniteNumber(Number(value?.value)) ? value?.value : '';
  }, [value]);

  const formattedInputChangeHandler = (event) => {
    let _value = event.target.value;
    if (_value && !NUMBERS_DOT_COMMA_ONLY_REGEX.test(_value)) return;

    if (_value.replace(/[^0-9]/g, '').length <= 15 || eachKeyStroke === 'Backspace' || eachKeyStroke === 'Delete') {
      _value = formatEngine(_value, event, prevNumber, eachKeyStroke, currLocale, (val) => { setPrevCount(val); }, (val) => { setPrevNumber(val); }, (val) => { setPrevNum(val); }, fieldData, prevCount, value, true);
      setPrevNum(value && value.value);
      onChange({ value: _value, currency_type: currencyType });
    }
  };

  const onInputChange = (e) => {
    const { value = '' } = e.target;
    if (value && !NUMBERS_AND_DOT_ONLY_REGEX.test(value)) return;

    const dotOccurrences = (value.match(/\./g) || []).length;
    if (dotOccurrences > 1) return;
    let _value = '';

    if (value) {
      if (DECIMAL_VALUE_REGEX.test(value)) {
        if (dotOccurrences === 0) _value = Number(value).toString();
        else _value = value;
      } else if (value !== '.' && value.endsWith('.')) {
        _value = value;
      } else if (value.startsWith('.')) {
        _value = value.split('.')[1] || '';
      }
    } else {
      _value = '';
    }
    onChange({ currency_type: currencyType, value: _value });
  };

  const onDropdownClick = (currency) => {
    onChange({ currency_type: currency, value: value?.value || '' });
  };

  return (
    <InputDropdown
      id={id}
      className={className}
      labelClassName={labelClassName}
      labelName={label}
      required={required}
      placeholder={placeholder}
      helpTooltip={helpTooltip}
      hideLabel={hideLabel}
      optionList={_optionList}
      inputValue={currencyValue}
      selectedValue={currencyType}
      selectedLabel={_optionList.find((o) => o.value === currencyType)?.label}
      onInputChange={allowFormatting ? formattedInputChangeHandler : onInputChange}
      onDropdownClick={onDropdownClick}
      dropdownMaxWidth={25}
      errorMessage={errorMessage}
      errorVariant={errorVariant}
      instruction={instruction}
      disabled={disabled}
      searchProps={{
        showLink: true,
      }}
      reverseLayout
      size={size}
      colorScheme={colorScheme}
      referenceName={referenceName}
      popperClassName={popperClassName}
      popperStyle={popperStyle}
      dropdownViewClass={styles.CurrencyDropdown}
    />
  );
}

export default CurrencyField;
