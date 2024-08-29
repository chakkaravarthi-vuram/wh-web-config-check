import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import FilterIcon from 'assets/icons/FilterIcon';
import RefreshIcon from 'assets/icons/RefreshIcon';
import { ENTRY_TASK_OPTIONS } from 'containers/flow/flow_dashboard/flow_entry_task/FlowEntryTask.utils';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import gClasses from '../../../scss/Typography.module.scss';
import styles from './SearchBar.module.scss';

import { INPUT_TYPES, BS, ARIA_ROLES } from '../../../utils/UIConstants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import SearchNewIcon from '../../../assets/icons/SearchIconV2';

export const SEARCH_BAR_TYPES = {
  TYPE_1: 'SEARCH_BAR_TYPE_1',
  TYPE_2: 'SEARCH_BAR_TYPE_2',
  TYPE_3: 'SEARCH_BAR_TYPE_3',
};

function SearchBar(props) {
  const { onChange, placeholder, autoComplete, value, className, searchIcon, title, type = SEARCH_BAR_TYPES.TYPE_1, searchIconAriaHidden, ariaLabelledBy, ariaLabel, isEntryTask, handleTaskDropdownChange, isAddNewButton, getTaskList, getEntryTaskParams, showFullSearch, customContentStyle, selectedValue, hideFilterIcon } = props;
  function onChangeHandler(event) {
    if (onChange) {
      onChange(event.target.value);
    }
  }

  const onRefresh = () => {
      const params = { ...getEntryTaskParams };
      if (selectedValue === 0 || selectedValue === 1) {
        params.is_closed = selectedValue;
      } else {
        delete params.is_closed;
      }
      getTaskList(params);
      onChange('');
    };

  let inputClasses = {};
  if (type === SEARCH_BAR_TYPES.TYPE_1) {
    inputClasses = cx(gClasses.FOne13GrayV3, gClasses.ML10);
  } else if (type === SEARCH_BAR_TYPES.TYPE_2) {
    inputClasses = cx(gClasses.FTwo14GrayV3, gClasses.FontWeight500, gClasses.ML10);
  } else if (type === SEARCH_BAR_TYPES.TYPE_3) {
    inputClasses = cx(gClasses.FTwo13GrayV3, gClasses.ML10);
  }

  return (
    <div className={cx(styles.SearchBarContainer, gClasses.CenterV, className)}>
      <SearchNewIcon className={cx(searchIcon)} ariaLabel="Search" role={ARIA_ROLES.IMG} ariaHidden={searchIconAriaHidden} />
      <input
        type={INPUT_TYPES.TEXT}
        placeholder={value ? null : placeholder}
        className={cx(inputClasses, BS.BORDER_0, gClasses.WidthInherit)}
        onChange={onChangeHandler}
        value={value}
        title={title}
        autoComplete={autoComplete}
        aria-labelledby={ariaLabelledBy}
        aria-label={ariaLabel}
      />
        {(!isEntryTask && !isAddNewButton && showFullSearch) && (
        <div
          className={cx(
            BS.JC_END,
            BS.D_FLEX,
            gClasses.CursorPointer,
            gClasses.ClickableElement,
          )}
        >
          <div className={cx(gClasses.CenterV, styles.AppliedFilterContainer)}>
            <div
              className={cx(
                BS.D_FLEX,
                gClasses.CenterV,
                gClasses.CursorPointer,
              )}
            >
              {!hideFilterIcon && <FilterIcon /> }
              <div
                className={cx(
                  gClasses.FontWeight500,
                  styles.SelectedMoreButton,
                  gClasses.ML5,
                  // filterLabel && gClasses.FTwo12BlueV21,
                )}
              />
                {/* {filterLabel || BUTTONS.ADD_FILTER.LABEL}
                All
              </div> */}
              <Dropdown
              optionList={ENTRY_TASK_OPTIONS}
              optionListClassName={styles.OptionListClassName}
              onChange={handleTaskDropdownChange}
              selectedValue={selectedValue}
              customContentStyle={customContentStyle}
              optionContainerClassName={styles.OptionContainerClassName}
              hideLabel
              inputDropdownContainer={cx(styles.DropdownContainerStyles, gClasses.MT10)}
              optionListDropDown={styles.OptionListDropDown}
              />
            </div>
          </div>
          <div className={cx(gClasses.ML10, gClasses.CenterV)}>
            <RefreshIcon
              className={gClasses.OutlineNoneOnFocus}
              onClick={onRefresh}
              tabIndex={0}
              onkeydown={(e) =>
                keydownOrKeypessEnterHandle(e) && onRefresh()
              }
              role={ARIA_ROLES.BUTTON}
              ariaLabel="Refresh"
            />
          </div>
        </div>
      )}
    </div>
  );
}
SearchBar.defaultProps = {
  value: EMPTY_STRING,
  placeholder: EMPTY_STRING,
};
SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
};
export default SearchBar;
