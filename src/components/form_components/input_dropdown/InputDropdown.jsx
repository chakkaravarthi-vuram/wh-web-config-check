import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

import Dropdown from '../dropdown/Dropdown';
import HelperMessage, { HELPER_MESSAGE_TYPE } from '../helper_message/HelperMessage';
import Label from '../label/Label';
import Input from '../input/Input';

import gClasses from '../../../scss/Typography.module.scss';
import { EMPTY_STRING, SPACE } from '../../../utils/strings/CommonStrings';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import styles from './inputDropdown.module.scss';
import { isEmpty } from '../../../utils/jsUtility';
import Tag from '../tag/Tag';

function InputDropdown(props) {
  const {
    value,
    dropdownValue,
    errorMessage,
    label,
    optionList,
    id,
    onChange,
    onDropdownChange,
    dropdownId,
    hideMessage,
    disabled,
    required,
    // fixedStrategy,
    dropdownListClasses,
    hideLabel,
    helperTooltipMessage,
    helperToolTipId,
    instructionMessage,
    instructionClass,
    isTable,
    editIcon,
    deleteIcon,
    labelClass,
    className,
    inputDropdownClassName,
    innerClassName,
    fieldTypeInstruction,
    referenceName,
    placeholder,
    dropdownPlaceholder,
    inputType,
    isCreationField,
    isNewDropdown,
    selectedTagValue,
    noCloseButton,
    tagUserClass,
    allowOnlySingleSelection,
    removeSelectedTag,
    isHideInput,
    onKeyDownHandler,
    strictlySetSelectedValue,
  } = props;

  const helperMessageId = `${id}_helper_message`;
  const labelId = `${id}_label`;
  const inputAriaLabelledBy = `${labelId}${errorMessage ? SPACE + helperMessageId : EMPTY_STRING}`;

  const selectedList = selectedTagValue && selectedTagValue.map((data, index) => {
    if (isEmpty(data)) return null;
    return (
      <Tag
        className={cx(gClasses.ML10, gClasses.MB3, styles.SelectedOptionTag, tagUserClass, allowOnlySingleSelection && cx(BS.W100, BS.JC_BETWEEN))} // Assign to form height
        id={data && data._id}
        onCloseClick={(event, id) => removeSelectedTag(event, id, data)}
        noCloseButton={noCloseButton}
        key={`tag${index}`}
        onClick={() => { }}
      >
        <div className={cx(gClasses.CenterV, styles.SelectedUserTag)}>
          <div title={data?.label} className={cx(styles.SelectedUsersorTeams, gClasses.Ellipsis)}>{data?.label}</div>
        </div>
      </Tag>
    );
  });
  return (
    <div className={className}>
      {!hideLabel &&
        (
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
            <Label
              content={label}
              labelFor={id}
              id={labelId}
              isRequired={required}
              message={helperTooltipMessage}
              toolTipId={helperToolTipId}
              labelFontClass={labelClass}
              formFieldBottomMargin
              hideLabelClass
            />
            {(fieldTypeInstruction || editIcon || deleteIcon) ? (
            <div className={cx(gClasses.CenterV, gClasses.Height24)}>
                {fieldTypeInstruction}
            </div>
          ) : null}
          </div>
        )
      }
      <div
        className={cx(gClasses.InputBorder, inputDropdownClassName, gClasses.InputBorderRadius, gClasses.CenterV, BS.JC_BETWEEN, innerClassName, {
          [gClasses.ReadOnlyBg]: disabled,
          [gClasses.ErrorInputBorder]: !isEmpty(errorMessage),
        })}
      >
        {selectedList}
        {
          !isHideInput && (
            <Input inputAriaLabelledBy={inputAriaLabelledBy} className={styles.InputWidth} value={value} referenceName={referenceName} onKeyDownHandler={onKeyDownHandler} id={id} onChangeHandler={onChange} readOnly={disabled} hideBorder hideLabel hideMessage inputDropdown placeholder={placeholder} type={inputType} />
          )
        }
        <Dropdown
          popperClasses={styles.DropDownWidth}
          id={dropdownId}
          optionList={optionList}
          onChange={onDropdownChange}
          selectedValue={dropdownValue}
          isBorderLess
          hideLabel
          hideMessage
          dropdownListClasses={dropdownListClasses}
          disabled={disabled}
          isTable={isTable}
          setSelectedValue
          fixedPopperStrategy
          isNewDropdown={isNewDropdown}
          referenceName={referenceName}
          disableClass={styles.Disable}
          customContentStyle={gClasses.FTwo12}
          placeholder={dropdownPlaceholder}
          strictlySetSelectedValue={strictlySetSelectedValue}
        />
      </div>
      <div className={cx(gClasses.FontStyleNormal, !isCreationField && gClasses.MT5, gClasses.Fone12GrayV4, gClasses.WordWrap, instructionClass)}>
          {instructionMessage}
      </div>
      {(hideMessage || !errorMessage) ? null : (
        <HelperMessage
          id={helperMessageId}
          type={HELPER_MESSAGE_TYPE.ERROR}
          message={errorMessage}
          className={gClasses.ErrorMarginV1}
          role={ARIA_ROLES.PRESENTATION}
        />
      )}
    </div>
  );
}
export default InputDropdown;

InputDropdown.defaultProps = {
  value: null,
  errorMessage: EMPTY_STRING,
  label: EMPTY_STRING,
  optionList: [],
  id: null,
  onChange: null,
  onDropdownChange: null,
  dropdownId: EMPTY_STRING,
  dropdownValue: EMPTY_STRING,
  required: false,
  hideLabel: false,
  fixedStrategy: false,
  editIcon: null,
  deleteIcon: null,
  labelClass: null,
  isNewDropdown: null,
  onKeyDownHandler: null,
};

InputDropdown.propTypes = {
  value: PropTypes.string,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  optionList: PropTypes.arrayOf(PropTypes.any),
  id: PropTypes.string,
  onChange: PropTypes.func,
  onDropdownChange: PropTypes.func,
  dropdownId: PropTypes.string,
  dropdownValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  required: PropTypes.bool,
  hideLabel: PropTypes.bool,
  fixedStrategy: PropTypes.bool,
  editIcon: PropTypes.element,
  deleteIcon: PropTypes.element,
  labelClass: PropTypes.element,
  isNewDropdown: PropTypes.bool,
  onKeyDownHandler: PropTypes.func,
};
