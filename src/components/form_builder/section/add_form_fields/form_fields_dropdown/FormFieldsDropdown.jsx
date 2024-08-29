import React, { useContext, useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ADD_FORM_FIELDS_CUSTOM_DROPDOWN_SECTION_TITLE_TYPE } from 'utils/Constants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import FieldSuggestions from '../field_suggestions/FieldSuggestions';
import ThemeContext from '../../../../../hoc/ThemeContext';

import {
  ADD_NEW_FIELD_ID,
  EXISTING_FORM_FIELD_ID,
  EXISTING_TABLE_FIELD_ID,
  FF_DROPDOWN_LIST,
  FF_DROPDOWN_MENU,
  FF_DROPDOWN_LIST_SECTION_TITLE_TYPE,
} from '../../../FormBuilder.strings';
import { BS } from '../../../../../utils/UIConstants';

import styles from './FormFieldsDropdown.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import FormTitle, { FORM_TITLE_TYPES } from '../../../../form_components/form_title/FormTitle';

function FormFieldsDropdown(props) {
  const { buttonColor } = useContext(ThemeContext);
  const { t } = useTranslation();
  const {
    className,
    isDropdownVisible,
    getInputId,
    blackListFields,
    addFormFieldsDropdownId,
    allFieldsDetails,
    allTableFieldDetails,
    onHeaderClick,
    showOnlyNewFormFieldsDropdown,
    addExistingFieldsDropdownHandler, onSelectExistingFieldHandler, sectionIndex, isCustomDropdownList,
    customDropdownList,
  } = props;

  const [activeDropdownIndex, setDropdownIndex] = useState(0);

  const onDropdownMenuSelect = (id, indexValue) => {
    if (activeDropdownIndex !== indexValue) setDropdownIndex(indexValue);
    if (addFormFieldsDropdownId !== id) addExistingFieldsDropdownHandler(id);
  };

  const dropdownMenu = FF_DROPDOWN_MENU.map((input, index) => {
    const id = `add_form_fields_menu_item_${index}`;
    let isHovered = true;
    return (
      <li key={id}>
        <button
          id={id}
          className={cx(
            styles.ListContainer,
            gClasses.ClickableElement,
            gClasses.CursorPointer,
            activeDropdownIndex === index + 1 && styles.SelectedMenuItem,
          )}
          onMouseEnter={() => {
            isHovered = true;
            setTimeout(() => {
              if (isHovered) onDropdownMenuSelect(input.ID, index + 1);
            }, 500);
          }}
          onFocus={() => {}}
          onMouseLeave={() => {
            isHovered = false;
          }}
          onBlur={() => {}}
        >
          <div className={cx(gClasses.CenterV, BS.JC_BETWEEN)}>
            <div className={cx(gClasses.CenterV)}>
              {input.ICON}
              <div className={cx(gClasses.FTwo13BlackV6, gClasses.ML15)}>{input.TITLE}</div>
            </div>
            <div className={cx(gClasses.RightArrow)} style={{ borderTopColor: buttonColor }} />
          </div>
        </button>
      </li>
    );
  });

  let dropdownList = null;
  let dropdownStyles = null;
  switch (addFormFieldsDropdownId) {
    case ADD_NEW_FIELD_ID:
      const list = isCustomDropdownList ? customDropdownList : FF_DROPDOWN_LIST(t);
      dropdownList = list.filter((input) => !blackListFields.includes(input.ID)).map((input, index) => {
        if (isCustomDropdownList ? input.ID === ADD_FORM_FIELDS_CUSTOM_DROPDOWN_SECTION_TITLE_TYPE : input.ID === FF_DROPDOWN_LIST_SECTION_TITLE_TYPE.TABLE || input.ID === FF_DROPDOWN_LIST_SECTION_TITLE_TYPE.NON_TABLE) {
          const id = `new_form_field_section_title${index}`;
          return (
            <li className={cx(styles.FFSectionTitle, gClasses.CursorDefault)} key={id}>
               <FormTitle noBottomMargin noTopPadding type={FORM_TITLE_TYPES.TYPE_6}>{input.TITLE}</FormTitle>
            </li>
          );
        }
        const id = `new_form_field_${index}`;
        return (
          <li key={id}>
            <button
              id={id}
              className={cx(
                styles.ListContainer,
                gClasses.ClickableElement,
                gClasses.CursorPointer,
                gClasses.CenterVH,
                input.isDisabled && gClasses.DisabledField,
              )}
              onMouseDown={() => !input.isDisabled && getInputId(input.ID)}
            >
              <div className={cx(gClasses.CenterVH, gClasses.MR15)} style={{ width: '26px' }}>
                {input.ICON}
              </div>
              <div className={gClasses.FlexGrow1}>
                <div className={cx(gClasses.FTwo13BlackV6, gClasses.FontWeight500)}>{input.TITLE}</div>
                <div className={gClasses.FOne12BlackV7}>{input.SUB_TITLE}</div>
              </div>
            </button>
          </li>
        );
      });
      dropdownStyles = styles.DropdownPopper;
      break;
    case EXISTING_FORM_FIELD_ID:
      dropdownList = (
        <FieldSuggestions
          onLoadMore={addExistingFieldsDropdownHandler}
          suggestionDetails={allFieldsDetails}
          addFormFieldsDropdownId={addFormFieldsDropdownId}
          onHeaderClick={onHeaderClick}
          onSuggestionTextChange={addExistingFieldsDropdownHandler}
          onAddExistingFieldToSection={onSelectExistingFieldHandler}
          sectionIndex={sectionIndex}
          // isTableFields={allTableFieldDetails.is_fields}
        />
      );
      break;
    case EXISTING_TABLE_FIELD_ID:
      dropdownList = (
        <FieldSuggestions
          onLoadMore={addExistingFieldsDropdownHandler}
          suggestionDetails={allTableFieldDetails}
          addFormFieldsDropdownId={addFormFieldsDropdownId}
          onHeaderClick={onHeaderClick}
          onSuggestionTextChange={addExistingFieldsDropdownHandler}
          onAddExistingFieldToSection={onSelectExistingFieldHandler}
          sectionIndex={sectionIndex}
          // isTableFields={allTableFieldDetails.is_fields}
        />
      );
      break;
    default:
      const lists = isCustomDropdownList ? customDropdownList : FF_DROPDOWN_LIST(t);
      dropdownList = lists.filter((input) => !blackListFields.includes(input.ID)).map((input, index) => {
        if (isCustomDropdownList ? input.ID === ADD_FORM_FIELDS_CUSTOM_DROPDOWN_SECTION_TITLE_TYPE : input.ID === FF_DROPDOWN_LIST_SECTION_TITLE_TYPE.TABLE || input.ID === FF_DROPDOWN_LIST_SECTION_TITLE_TYPE.NON_TABLE) {
          const id = `new_form_field_section_title${index}`;
          return (
            <li className={cx(styles.FFSectionTitle, gClasses.CursorDefault)} key={id}>
               <FormTitle noBottomMargin noTopPadding type={FORM_TITLE_TYPES.TYPE_6}>{input.TITLE}</FormTitle>
            </li>
          );
        }
        const id = `new_form_field_${index}`;
        return (
          <li key={id}>
            <button
              id={id}
              className={cx(
                styles.ListContainer,
                gClasses.ClickableElement,
                gClasses.CursorPointer,
                gClasses.CenterVH,
                input.isDisabled && gClasses.DisabledField,
              )}
              onMouseDown={() => !input.isDisabled && getInputId(input.ID)}
              onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && !input.isDisabled && getInputId(input.ID)}
            >
              <div className={cx(gClasses.CenterVH, gClasses.MR15)} style={{ width: '26px' }}>
                {input.ICON}
              </div>
              <div className={gClasses.FlexGrow1}>
                <div className={cx(gClasses.FTwo13BlackV6, gClasses.FontWeight500)}>{input.TITLE}</div>
                <div className={gClasses.FOne12BlackV7}>{input.SUB_TITLE}</div>
              </div>
            </button>
          </li>
        );
      });
      dropdownStyles = styles.DropdownPopper;
    break;
  }
  let dropdownListClasses = null;
  let dropdownListElement = null;
  let dropdownMenuElement = null;
  if (showOnlyNewFormFieldsDropdown) {
    dropdownListElement = dropdownList;
    dropdownListClasses = styles.Dropdown;
  } else {
    dropdownListElement = activeDropdownIndex > 0 && dropdownList;
    dropdownMenuElement = (
      <ul className={cx(className, styles.MenuContainer, gClasses.ScrollBar)}>
        {dropdownMenu}
      </ul>
    );

    dropdownListClasses = activeDropdownIndex === 1 && styles.Dropdown;
  }
  return isDropdownVisible ? (
    <>
      {dropdownMenuElement}
      <ul
        className={cx(
          className,
          styles.Container,
          gClasses.ScrollBar,
          dropdownListClasses,
          dropdownStyles,
        )}
      >
        {dropdownListElement}
      </ul>
    </>
  ) : null;
}

export default FormFieldsDropdown;
FormFieldsDropdown.propTypes = {
  className: PropTypes.string,
  isDropdownVisible: PropTypes.bool,
  getInputId: PropTypes.func.isRequired,
  positionObject: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }).isRequired,
  blackListFields: PropTypes.arrayOf(PropTypes.any),
};
FormFieldsDropdown.defaultProps = {
  className: null,
  isDropdownVisible: false,
  blackListFields: [],
};
