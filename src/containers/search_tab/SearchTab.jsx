import React, { useState } from 'react';
import propTypes from 'prop-types';
import SearchIcon from 'assets/icons/SearchIcon';
import CloseIconNew from 'assets/icons/CloseIconNew';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { isMobileScreen, keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import cx from 'classnames/bind';
import { ARIA_ROLES } from 'utils/UIConstants';
import { TextInput, Variant } from '@workhall-pvt-lmt/wh-ui-library';
import { ICON_STRINGS } from '../../components/list_and_filter/ListAndFilter.strings';
import gClasses from '../../scss/Typography.module.scss';
import jsUtils from '../../utils/jsUtility';
import styles from './SearchTab.module.scss';
import { ARIA_LABEL } from './SearchTab.utils';

function SearchTab(props) {
  let inputComponent = null;
  const {
    input,
    searchText,
    inputRefCallback,
  } = props;
  const [searchValue, setSearchValue] = useState(EMPTY_STRING);

  const onSearchInputChange = (event) => {
    setSearchValue(event.target.value);
    input.onChange(event);
  };

  const onCloseIconClick = () => {
    const event = {
      target: {
        value: EMPTY_STRING,
      },
    };
    setSearchValue(EMPTY_STRING);
    input.onChange(event);
  };

  inputComponent = (
    <div className={cx(gClasses.CenterV)}>
      <SearchIcon title={ICON_STRINGS.SEARCH_ICON} />
      <TextInput
        onChange={onSearchInputChange}
        refCallBackFunction={inputRefCallback}
        id={input.id}
        className={cx(
          styles.Input,
          gClasses.ML10,
          gClasses.FTwo13,
        )}
        placeholder={searchText ? null : input.placeholder}
        value={searchText}
        variant={Variant.borderLess}
      />
      {!jsUtils.isEmpty(searchValue) && !isMobileScreen() ? (
        <CloseIconNew
          title={ICON_STRINGS.CLEAR}
          className={cx(styles.CloseIcon, gClasses.CursorPointer)}
          onClick={onCloseIconClick}
          role={ARIA_ROLES.BUTTON}
          tabIndex={0}
          ariaLabel={ARIA_LABEL.CLEAR_SEARCH}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onCloseIconClick()}
        />
      ) : null}
    </div>
  );

  return (
    <div className={gClasses.W100}>
      {inputComponent}
    </div>
  );
}
SearchTab.defaultProps = {
  ariaLabel: EMPTY_STRING,
};

SearchTab.propTypes = {
  ariaLabel: propTypes.string,
};
export default SearchTab;
