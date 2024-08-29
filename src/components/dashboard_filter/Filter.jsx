import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import {
  Popper,
  Title,
  TextInput,
  Button,
  BorderRadiusVariant,
  Chip,
  EChipSize,
  EButtonType,
  ETitleHeadingLevel,
  EPopperPlacements,
} from '@workhall-pvt-lmt/wh-ui-library';
import FilterIcon from '../../assets/icons/application/FilterV2';
import MoreFilters from './more_filters/MoreFilters';
import { validateFilterValues } from './more_filters/MoreFilter.utils';
import styles from './Filter.module.scss';
import { isEmptyFieldUpdateValue, searchFieldsByText } from './FilterUtils';
import jsUtils from '../../utils/jsUtility';
import { ARIA_ROLES, BS, COLOR_CONSTANTS } from '../../utils/UIConstants';
import ThemeContext from '../../hoc/ThemeContext';
import gClasses from '../../scss/Typography.module.scss';
import FILTER_STRINGS, { FILTER_OPTIONS, FILTER_OPTION_VALUES } from './Filter.strings';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import FilterDashboardIcon from '../../assets/icons/dashboards/FilterDashboardIcon';
import SearchIconNew from '../../assets/icons/SearchIconNew';
import { getColorSchemeByThemeContext } from '../../containers/application/app_components/AppComponent.utils';
import { useClickOutsideDetectorForFilters } from '../../utils/UtilityFunctions';

function Filter(props) {
  const { t } = useTranslation();
  const {
    filter,
    filter: { inputFieldDetailsForFilter = [], isFilter = false },
    onSetFilterAction,
    getReportData,
    isUserFilter = false,
    isAppFilter = false,
  } = props;

  const history = useHistory();
  const themeContext = useContext(ThemeContext);
  const colorScheme = getColorSchemeByThemeContext(themeContext, history);
  const [initialFilterValue, setInitialFilterValue] = useState({});
  const { BUTTONS, SEARCH } = FILTER_STRINGS(t);
  const [txtSearch, setTxtSearch] = useState(EMPTY_STRING);
  const [filterOption, setFilterOption] = useState(FILTER_OPTION_VALUES.ADD_NEW);
  const filterRef = useRef(null);
  const filterContainerRef = useRef(null);
  const selectedFilterCount = (inputFieldDetailsForFilter || [])?.filter(
    (eachFiled) => eachFiled.isUserFilterApplied,
  )?.length;

  const onSearchText = (searchText) => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    const clonedFilterFlowData = jsUtils.cloneDeep(inputFieldDetailsForFilter);
    const mapFilterFlowData = searchFieldsByText(
      clonedFilterFlowData,
      searchText,
    );
    clonedFilter.inputFieldDetailsForFilter = mapFilterFlowData;
    onSetFilterAction(clonedFilter);
    setTxtSearch(searchText);
  };

  const onClickMoreFilters = (isCloseModal = false) => {
    if (isCloseModal === isFilter) return;
    if (isUserFilter && !isCloseModal) {
      onSetFilterAction(jsUtils.cloneDeep(initialFilterValue));
      return;
    }
    if (isCloseModal) {
      const appliedFilterFields =
        filter.inputFieldDetailsForFilter.filter(
          (field) => field.isAppliedFilter,
        );
      const cloneFilterOption =
        appliedFilterFields?.length > 0
          ? FILTER_OPTION_VALUES.APPLIED
          : FILTER_OPTION_VALUES.ADD_NEW;
      setFilterOption(cloneFilterOption);
      setInitialFilterValue(jsUtils.cloneDeep(filter));
    }
    const clonedFilter = jsUtils.cloneDeep(filter);
    const { inputFieldDetailsForFilter } = clonedFilter;

    clonedFilter.isFilter = !clonedFilter.isFilter;
    const mapFilterFlowData = searchFieldsByText(
      inputFieldDetailsForFilter,
      EMPTY_STRING,
    );
    clonedFilter.inputFieldDetailsForFilter = mapFilterFlowData;
    if (!isCloseModal) {
      clonedFilter.isFilter = false;
    }
    setTxtSearch(EMPTY_STRING);
    onSetFilterAction(clonedFilter);
  };

  useClickOutsideDetectorForFilters(filterContainerRef, () => onClickMoreFilters(false), [isFilter]);

  const onClickApplyFilter = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    const clonedFilterFlowData = jsUtils.cloneDeep(inputFieldDetailsForFilter);
    const { updatedFilterFlowData, isValid } =
      validateFilterValues(clonedFilterFlowData, t);
    if (isValid) {
      const mapFilterFlowData = updatedFilterFlowData?.map((filterProData) => {
        if (isEmptyFieldUpdateValue(filterProData)) {
          filterProData.isFormField = false;
          filterProData.isAppliedFilter = true;
          filterProData.isUserFilterApplied = true;
        } else {
          filterProData.isAppliedFilter = false;
          filterProData.isUserFilterApplied = false;
        }
        return filterProData;
      });
      clonedFilter.inputFieldDetailsForFilter = searchFieldsByText(
        jsUtils.cloneDeep(mapFilterFlowData),
        EMPTY_STRING,
      );
      getReportData(clonedFilter);
      setTxtSearch(EMPTY_STRING);
    } else {
      clonedFilter.inputFieldDetailsForFilter = updatedFilterFlowData;
      onSetFilterAction(clonedFilter);
    }
  };

  const onChangeSearch = (event) => {
    const searchText = event.target.value;
    onSearchText(searchText);
  };
  const onClickClearFilters = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    const clonedFilterFlowData = jsUtils.cloneDeep(inputFieldDetailsForFilter);
    const modifiedFlowDataFilter = clonedFilterFlowData.map((filterProData) => {
      filterProData.isFormField = false;
      filterProData.isAppliedFilter = false;
      filterProData.fieldUpdateValue = EMPTY_STRING;
      filterProData.fieldUpdateBetweenOne = EMPTY_STRING;
      filterProData.fieldUpdateBetweenTwo = EMPTY_STRING;
      filterProData.isUserFilterApplied = false;
      if (filterProData.is_logged_in_user) {
        filterProData.is_logged_in_user = false;
      }
      filterProData.fieldValues?.map((checkList) => {
        checkList.isCheck = false;
        return checkList;
      });
      return filterProData;
    });
    clonedFilter.inputFieldDetailsForFilter = modifiedFlowDataFilter;
    getReportData(clonedFilter);
  };

  return (
    <div ref={filterContainerRef}>
      <Popper
        id="filterPopper"
        targetRef={filterRef}
        open={isFilter}
        placement={EPopperPlacements.BOTTOM_END}
        className={styles.ModalContent}
        content={
          <div>
            <div className={cx(styles.ContentContainer)}>
              <div
                className={cx(
                  gClasses.PR24,
                  gClasses.DisplayFlex,
                  gClasses.FlexDirectionCol,
                  gClasses.Gap16,
                  gClasses.MB16,
                )}
              >
                <Title
                  className={gClasses.ModalHeader}
                  headingLevel={ETitleHeadingLevel.h1}
                  content={BUTTONS.FILTER}
                />
                <div className={cx(gClasses.DisplayFlex, gClasses.Gap8)}>
                  {FILTER_OPTIONS(t).map((option) => {
                    const isSelected = option.value === filterOption;
                    return (
                      <Chip
                        key={option.value}
                        text={option.label}
                        className={gClasses.CursorPointer}
                        textColor={
                          isSelected
                            ? COLOR_CONSTANTS.WHITE
                            : COLOR_CONSTANTS.BLACK
                        }
                        borderColor={
                          isSelected
                            ? colorScheme.activeColor
                            : COLOR_CONSTANTS.BLUE_V1
                        }
                        backgroundColor={
                          isSelected
                            ? colorScheme.activeColor
                            : COLOR_CONSTANTS.WHITE
                        }
                        onClick={() => setFilterOption(option.value)}
                      />
                    );
                  })}
                </div>
                <TextInput
                  id={SEARCH.ID}
                  placeholder={SEARCH.PLACEHOLDER}
                  onChange={(event) => onChangeSearch(event)}
                  value={txtSearch}
                  prefixIcon={<SearchIconNew className={styles.SearchIcon} />}
                />
              </div>
              <div className={gClasses.OverflowYAuto}>
                <MoreFilters
                  selectedFilterOption={filterOption}
                  filter={filter}
                  onSetFilterAction={onSetFilterAction}
                  getReportData={getReportData}
                />
              </div>
            </div>
            <div
              className={cx(
                BS.W100,
                gClasses.RightH,
                BS.ALIGN_ITEM_CENTER,
                styles.FooterContent,
              )}
            >
              {isUserFilter && selectedFilterCount > 0 && (
                <Button
                  type={EButtonType.TERTIARY}
                  className={cx(BS.TEXT_NO_WRAP)}
                  onClick={() => onClickClearFilters()}
                  buttonText={BUTTONS.CLEAR_FILTERS}
                />
              )}
              <Button
                type={EButtonType.PRIMARY}
                className={cx(BS.TEXT_NO_WRAP)}
                onClick={() => onClickApplyFilter()}
                buttonText={BUTTONS.APPLY}
              />
            </div>
          </div>
        }
      />
      <button
        className={cx(
          BS.D_FLEX,
          gClasses.CenterV,
          gClasses.CursorPointer,
          isUserFilter,
        )}
        ref={filterRef}
        onClick={() => onClickMoreFilters(!isFilter)}
        onKeyDown={(e) =>
          keydownOrKeypessEnterHandle(e) && onClickMoreFilters()
        }
      >
        {!isUserFilter && (
          <FilterDashboardIcon
            role={ARIA_ROLES.IMG}
            ariaHidden
            ariaLabel={BUTTONS.FILTER}
            className={cx(styles.FilterIconGray)}
            isAppFilter={isAppFilter}
          />
        )}
        {(inputFieldDetailsForFilter || []).length > 0 && isUserFilter && (
          <div
            className={cx(
              styles.FilterIconWithCount,
              gClasses.ML5,
              selectedFilterCount > 0 && styles.Gray107BackColor,
            )}
          >
            <FilterIcon />
            {selectedFilterCount > 0 && (
              <Chip
                size={EChipSize.md}
                text={`0${selectedFilterCount}`}
                borderRadiusType={BorderRadiusVariant.circle}
                className={cx(gClasses.WhiteSpaceNoWrap, styles.FilterCount)}
              />
            )}
          </div>
        )}
      </button>
    </div>
  );
}

Filter.propTypes = {
  filter: PropTypes.objectOf({
    inputFieldDetailsForFilter: PropTypes.arrayOf(PropTypes.object),
    isFilter: PropTypes.bool,
  }),
  onSetFilterAction: PropTypes.func,
  getReportData: PropTypes.func,
  isUserFilter: PropTypes.bool,
  isAppFilter: PropTypes.bool,
};

export default Filter;
