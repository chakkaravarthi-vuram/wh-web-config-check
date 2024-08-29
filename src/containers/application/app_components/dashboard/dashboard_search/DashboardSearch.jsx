import React from 'react';
import cx from 'classnames/bind';
import SearchNewIcon from 'assets/icons/SearchIconV2';
import CloseIconNew from 'assets/icons/CloseIconNew';
import { ACTION_STRINGS, EMPTY_STRING } from 'utils/strings/CommonStrings';
import jsUtils from 'utils/jsUtility';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import gClasses from 'scss/Typography.module.scss';
import styles from './DashboardSearch.module.scss';

function DashboardSearch(props) {
  const { placeholderSearchText = EMPTY_STRING, onChange, searchText } = props;

  const ARIA_LABEL = {
    CLEAR_SEARCH: 'Clear search',
  };
  const onChangeHandler = (e) => {
    const { value } = e.target;
    onChange(value);
  };

  const onCloseIconClick = () => {
    const event = {
      target: {
        value: EMPTY_STRING,
      },
    };
    onChangeHandler(event);
  };

  return (
    <div
      className={cx(
        styles.SearchContainer,
        BS.D_FLEX,
        BS.ALIGN_ITEM_CENTER,
        BS.JC_BETWEEN,
      )}
    >
      <div className={styles.SearchBar}>
        <SearchNewIcon
          className={cx(styles.SearchIcon)}
          role={ARIA_ROLES.IMG}
          ariaLabel="Search"
        />
        <input
          value={searchText || EMPTY_STRING}
          onChange={onChangeHandler}
          className={cx(gClasses.FTwo13, styles.SearchInput)}
          type="text"
          placeholder={searchText ? EMPTY_STRING : placeholderSearchText}
          required
          aria-required
          aria-label="Search"
          autoComplete={ACTION_STRINGS.OFF}
        />
      </div>
      {!jsUtils.isEmpty(searchText) && (
        <CloseIconNew
          ariaLabel={ARIA_LABEL.CLEAR_SEARCH}
          tabIndex={0}
          role={ARIA_ROLES.BUTTON}
          onKeyDown={(e) =>
            keydownOrKeypessEnterHandle(e) && onCloseIconClick()
          }
          className={cx(styles.CloseIcon, gClasses.CursorPointer)}
          onClick={onCloseIconClick}
        />
      )}
    </div>
  );
}

export default DashboardSearch;
