import React, { useRef } from 'react';
import SearchIcon from 'assets/icons/SearchIcon';
import CloseIconNew from 'assets/icons/CloseIconNew';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { isMobileScreen, keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { TASK_TAB_INDEX } from 'containers/landing_page/LandingPage.strings';
import cx from 'classnames/bind';

import SearchIconV3 from 'assets/icons/SearchIconV3';
import { useTranslation } from 'react-i18next';
import { ICON_STRINGS } from '../../../../components/list_and_filter/ListAndFilter.strings';
import gClasses from '../../../../scss/Typography.module.scss';
import jsUtils from '../../../../utils/jsUtility';
import styles from './TaskSearch.module.scss';
import { TASK_SEARCH_PLACEHOLDER } from './TaskSearch.utils';

function TaskSearch(props) {
  const { t } = useTranslation();
  let inputComponent = null;
  const {
    input,
    tab_index,
    isCustomSearchLayout,
    isTaskSearchLoading,
    resultsCount,
    searchText = EMPTY_STRING,
  } = props;
  // const [searchValue, setSearchValue] = useState(EMPTY_STRING);
  let PlaceHolder = t(TASK_SEARCH_PLACEHOLDER.SEARCH_TASK_NAME);
  if (
    tab_index === TASK_TAB_INDEX.ASSIGNED_TO_OTHERS ||
    tab_index === TASK_TAB_INDEX.DRAFT_TASK
  ) {
    PlaceHolder = t(TASK_SEARCH_PLACEHOLDER.SEARCH_TASK_NAME_WITHOUT_FLOW);
  }
  if (isMobileScreen()) {
    PlaceHolder = t(TASK_SEARCH_PLACEHOLDER.SEARCH_TASK_NAME_FOR_MOBILE);
  }

  const wrapperRef = useRef(null);
  // useEffect(() => {
  //   setSearchValue(EMPTY_STRING);
  // }, [tab_index]);
  const onSearchInputChange = (event) => {
    input.onChange(event);
  };
  const onCloseIconClick = () => {
    const event = {
      target: {
        value: EMPTY_STRING,
      },
    };
    input.onChange(event);
  };
  const ariaLabel = isTaskSearchLoading ? 'tasks loading' : searchText.length > 0 ? resultsCount > 0 ? 'results found' : 'result not found' : '';
  inputComponent = (
    <div className={cx(gClasses.CenterV)}>
      {isCustomSearchLayout ? (
        <SearchIconV3 isMyTask ariaHidden />
      ) : (
        <SearchIcon ariaHidden />
      )}
      <input
        id={input.id}
        className={cx(
          isCustomSearchLayout ? styles.CustomInputClass : styles.Input,
          gClasses.ML10,
        )}
        placeholder={searchText ? EMPTY_STRING : PlaceHolder}
        onChange={onSearchInputChange}
        value={searchText}
        autoComplete="off"
        aria-label={ariaLabel}
      />
      {!jsUtils.isEmpty(searchText) && !isMobileScreen() ? (
        <CloseIconNew
          title={ICON_STRINGS.CLEAR}
          className={cx(styles.CloseIcon, gClasses.CursorPointer)}
          tabIndex={0}
          ariaLabel="Clear search box"
          role="button"
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onCloseIconClick()}
          onClick={onCloseIconClick}
        />
      ) : null}
    </div>
  );
  return (
    <div className={gClasses.W100} ref={wrapperRef}>
      {inputComponent}
    </div>
  );
}
export default TaskSearch;
