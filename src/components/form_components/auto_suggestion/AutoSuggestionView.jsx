import React, { useContext } from 'react';
import cx from 'classnames/bind';

import propTypes from 'prop-types';
import ThemeContext from '../../../hoc/ThemeContext';
import Input, { INPUT_VARIANTS } from '../input/Input';

import gClasses from '../../../scss/Typography.module.scss';
import styles from '../dropdown/dropdown_list/DropdownList.module.scss';

import { BS } from '../../../utils/UIConstants';
import { DROPDOWN_CONSTANTS, EMPTY_STRING } from '../../../utils/strings/CommonStrings';

const AUTO_SUGGESTION_TYPES = {
  TYPE_1: 1,
  TYPE_2: 2,
};
function AutoSuggestionView(props) {
  const { buttonColor } = useContext(ThemeContext);
  let list = null;
  const {
    id,
    label,
    placeholder,
    onChangeHandler,
    onKeyDownHandler,
    onBlurHandler,
    data,
    children,
    readOnlyPrefix,
    readOnlySuffix,
    errorText,
    optionList,
    innerRef,
    onOptionSelectHandler,
    className,
    type,
  } = props;
  const { searchValue, isDropdownVisible, activeSuggestion } = data;
  if (isDropdownVisible) {
    const optionLists = optionList.map((option, index) => {
      const labels = option[DROPDOWN_CONSTANTS.OPTION_TEXT];
      let ref = null;
      let backgroundColor = null;
      if (activeSuggestion === index) {
        ref = innerRef;
        backgroundColor = buttonColor;
      }
      return (
        <li
          className={cx(BS.P_RELATIVE, styles.Option, gClasses.InputPaddingV2)}
          key={option[DROPDOWN_CONSTANTS.VALUE] || index}
          onMouseDown={() => onOptionSelectHandler(option[DROPDOWN_CONSTANTS.VALUE])}
          ref={ref}
          style={{ backgroundColor }}
          value={option[DROPDOWN_CONSTANTS.VALUE]}
          role="presentation"
        >
          {labels}
          <div style={{ backgroundColor: buttonColor }} className={cx(BS.P_ABSOLUTE)} />
        </li>
      );
    });
    list = (
      <div
        className={cx(
          styles.DropdownContainer,
          gClasses.InputBorder,
          gClasses.InputBorderRadius,
          gClasses.FOne13BlackV1,
          BS.P_ABSOLUTE,
          BS.W100,
          className,
        )}
      >
        <ul className={cx(styles.OptionList, gClasses.CursorPointer, BS.W100)}>{optionLists}</ul>
      </div>
    );
  }
  let inputVariant = null;
  switch (type) {
    case AUTO_SUGGESTION_TYPES.TYPE_1:
      inputVariant = INPUT_VARIANTS.TYPE_2;
      break;
    case AUTO_SUGGESTION_TYPES.TYPE_2:
      inputVariant = INPUT_VARIANTS.TYPE_4;
      break;
    default:
      break;
  }
  return (
    <div className={cx(BS.P_RELATIVE, BS.D_FLEX)}>
      <Input
        id={id}
        label={label}
        placeholder={placeholder}
        onChangeHandler={onChangeHandler}
        onKeyDownHandler={onKeyDownHandler}
        onFocusHandler={onChangeHandler}
        onBlurHandler={onBlurHandler}
        value={searchValue}
        errorMessage={errorText}
        readOnlyPrefix={readOnlyPrefix}
        readOnlySuffix={readOnlySuffix}
        inputVariant={inputVariant}
        className={BS.W100}
      >
        {children}
      </Input>

      {list}
    </div>
  );
}
export default React.forwardRef((props, ref) => <AutoSuggestionView innerRef={ref} {...props} />);

AutoSuggestionView.defaultProps = {
  id: null,
  label: null,
  placeholder: null,
  innerRef: propTypes.shape({
    current: null,
  }),
  optionList: [],
  className: EMPTY_STRING,
  readOnlyPrefix: EMPTY_STRING,
  readOnlySuffix: EMPTY_STRING,
};

AutoSuggestionView.propTypes = {
  children: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node,
    propTypes.string,
  ]).isRequired,
  id: propTypes.string,
  label: propTypes.string,
  readOnlyPrefix: propTypes.string,
  readOnlySuffix: propTypes.string,
  placeholder: propTypes.string,
  data: propTypes.shape({
    isDropdownVisible: propTypes.bool,
    searchValue: propTypes.string,
    activeSuggestion: propTypes.number,
  }).isRequired,
  innerRef: propTypes.oneOfType([
    propTypes.func,
    propTypes.shape({
      current: propTypes.instanceOf(Element),
    }),
  ]),
  type: propTypes.number.isRequired,
  onBlurHandler: propTypes.func.isRequired,
  onChangeHandler: propTypes.func.isRequired,
  onKeyDownHandler: propTypes.func.isRequired,
  onOptionSelectHandler: propTypes.func.isRequired,
  errorText: propTypes.string.isRequired,
  optionList: propTypes.arrayOf(
    propTypes.shape({
      _id: propTypes.string,
      email: propTypes.string,
      first_name: propTypes.string,
      is_active: propTypes.bool,
      last_name: propTypes.string,
      user_type: propTypes.number,
      username: propTypes.string,
    }),
  ),
  className: propTypes.string,
};
