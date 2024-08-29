import {
  ErrorVariant,
  TextInput,
  ETextSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useState } from 'react';
import { isEmpty } from '../../../utils/jsUtility';
import {
  constructDecimalZeroValue,
  constructValue,
} from '../../../containers/form/sections/form_field/field/Field.util';
import {
  NUMBERS_COMMA_MINUS_REGEX,
  NUMBERS_DOT_COMMA_MINUS_REGEX,
} from '../../../utils/strings/Regex';
import { COMMA, DOT, HYPHEN } from '../../../utils/strings/CommonStrings';
import { KEY_NAMES } from '../../../utils/Constants';
import { formatEngine } from '../../form_builder/section/form_fields/FormField.utils';

const DOT_REGEX = /\./g;
const MINUS_REGEX = /-/g;
const NON_DIGIT_REGEX = /\D/g;

function NumberField(props) {
  const {
    id,
    labelText,
    required,
    instruction,
    placeholder,
    value,
    prefLocale,
    onChange,
    readOnly,
    errorMessage,
    helpTooltip,
    referenceName,
    className,
    colorScheme,
    innerLabelClass,
    labelClassName,

    size = ETextSize.MD,
    errorVariant = ErrorVariant.direct,
    isDigitFormatted = false,
    allowDecimal = false,
    fieldData = {},
  } = props;

  const [prevCount, setPrevCount] = useState(0);
  const [prevNum, setPrevNum] = useState('');
  const [prevNumber, setPrevNumber] = useState('');
  const [eachKeyStroke, setEachKeyStroke] = useState('');

  useEffect(() => {
    const globalKeyDownHandler = (e) => setEachKeyStroke(e.key);

    document.addEventListener('keydown', globalKeyDownHandler);
    return () => document.removeEventListener('keydown', globalKeyDownHandler);
  }, []);

  const onChangeHandler = (event) => {
    let { value: _value } = event.target;

    if (
      _value &&
      ((allowDecimal && !NUMBERS_DOT_COMMA_MINUS_REGEX.test(_value)) ||
        (!allowDecimal && !NUMBERS_COMMA_MINUS_REGEX.test(_value)))
    ) return;

    const dotOccurrences = (_value.match(DOT_REGEX) || []).length;
    const minusOccurrences = (_value.match(MINUS_REGEX) || []).length;
    const minusPosition = _value.indexOf(HYPHEN);
    const lastDigit = _value[_value.length - 1];
    if (dotOccurrences > 1 || minusOccurrences > 1) return;
    if (minusPosition > 0) return;
    if (lastDigit === COMMA) return;

    if (
      _value.replace(NON_DIGIT_REGEX, '').length <= 15 ||
      eachKeyStroke === KEY_NAMES.BACKSPACE ||
      eachKeyStroke === KEY_NAMES.DELETE
    ) {
      if (isDigitFormatted) {
        _value = formatEngine(
          _value,
          event,
          prevNumber,
          eachKeyStroke,
          prefLocale,
          (val) => setPrevCount(val),
          (val) => setPrevNumber(val),
          (val) => setPrevNum(val),
          fieldData,
          prevCount,
          _value,
          true,
        );
      }
      setPrevNum(_value);
      onChange(_value);
    }
  };

  return (
    <TextInput
      id={id}
      labelText={labelText}
      required={required}
      instruction={instruction}
      placeholder={placeholder}
      value={
        !isEmpty(prefLocale) &&
        !isEmpty(value?.toString()) &&
        isDigitFormatted &&
        value.toString().length > 1 &&
        value.toString().charAt(value.toString().length - 1) !== DOT
          ? constructDecimalZeroValue(value, prefLocale)
          : constructValue(value, prevNum, isDigitFormatted, prefLocale)
      }
      onChange={onChangeHandler}
      readOnly={readOnly}
      size={size}
      errorVariant={errorVariant}
      errorMessage={errorMessage}
      helpTooltip={helpTooltip}
      className={className}
      colorScheme={colorScheme}
      referenceName={referenceName}
      innerLabelClass={innerLabelClass}
      labelClassName={labelClassName}
    />
  );
}

export default NumberField;
