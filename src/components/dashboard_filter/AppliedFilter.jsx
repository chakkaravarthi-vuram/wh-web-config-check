import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import styles from './Filter.module.scss';
import ThemeContext from '../../hoc/ThemeContext';
import { validateFilterValues } from './more_filters/MoreFilter.utils';
import FilterFormBuilder from './filter_form_builder/FilterFormBuilder';
import { isEmptyFieldUpdateValue } from './FilterUtils';
import jsUtils from '../../utils/jsUtility';
import { BS } from '../../utils/UIConstants';
import gClasses from '../../scss/Typography.module.scss';
import FILTER_STRINGS from './Filter.strings';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import MoreFilterDashboard from './more_filter/MoreFilter';

function AppliedFilter(props) {
  const { t } = useTranslation();
  const {
    filter,
    filter: { inputFieldDetailsForFilter },
    onSetFilterAction,
    getReportData,
    isLoading,
    isShowNoAppliedFilterDataText,
    isUserFilter = false,
  } = props;
  const [filterCount, setFilterCount] = useState(4);
  const containerRef = useRef(null);
  const innerContainerRef = useRef(null);

  useEffect(() => {
    if (
      containerRef &&
      containerRef.current &&
      innerContainerRef &&
      innerContainerRef.current
    ) {
      const outerWidth = containerRef.current.clientWidth;
      const additionalRowCount = Math.floor(outerWidth / 225);
      additionalRowCount > 4 && setFilterCount(additionalRowCount);
    }
  }, [
    containerRef && containerRef.current && containerRef.current.clientWidth,
    innerContainerRef &&
      innerContainerRef.current &&
      innerContainerRef.current.clientWidth,
  ]);

  const showMoreReference = useRef();

  const { buttonColor } = useContext(ThemeContext);
  const { BUTTONS } = FILTER_STRINGS(t);

  const selectedAppliedFiltersLst =
    inputFieldDetailsForFilter &&
    inputFieldDetailsForFilter.filter((objProData) => isUserFilter ? objProData.isUserFilterApplied : objProData.isAppliedFilter);
  const isAppliedFilterData =
    selectedAppliedFiltersLst && selectedAppliedFiltersLst.length > 0;
  const isClearFilter =
    selectedAppliedFiltersLst && selectedAppliedFiltersLst.length > 1;
  const isMoreFilter =
    selectedAppliedFiltersLst && selectedAppliedFiltersLst.length > filterCount;
  const plusMoreCount =
    (selectedAppliedFiltersLst && selectedAppliedFiltersLst.length) -
    filterCount;
  const plusMoreButtonText = `+${plusMoreCount} More`;

  const onClickClearFilters = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    const clonedFilterFlowData = jsUtils.cloneDeep(inputFieldDetailsForFilter);
    const modifiedFlowDataFilter = clonedFilterFlowData.map(
      (filterProData) => {
        filterProData.isFormField = false;
        filterProData.isAppliedFilter = false;
        filterProData.fieldUpdateValue = EMPTY_STRING;
        filterProData.fieldUpdateBetweenOne = EMPTY_STRING;
        filterProData.fieldUpdateBetweenTwo = EMPTY_STRING;
        if (filterProData.is_logged_in_user) {
          filterProData.is_logged_in_user = false;
        }
        filterProData.fieldValues &&
          filterProData.fieldValues[0] &&
          filterProData.fieldValues.map((checkList) => {
            checkList.isCheck = false;
            return checkList;
          });
        return filterProData;
      },
    );
    clonedFilter.inputFieldDetailsForFilter = modifiedFlowDataFilter;
    clonedFilter.selectedFieldDetailsFromFilter = jsUtils.cloneDeep(
      modifiedFlowDataFilter,
    );
    getReportData(clonedFilter);
  };

  const onClickApplyFilter = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    const clonedFilterFlowData = jsUtils.cloneDeep(inputFieldDetailsForFilter);
    const { updatedFilterFlowData, isValid } = validateFilterValues(
      clonedFilterFlowData,
      t,
    );
    if (isValid) {
      const mapFilterFlowData = updatedFilterFlowData?.map((filterProData) => {
        if (isEmptyFieldUpdateValue(filterProData)) {
          filterProData.isFormField = false;
          filterProData.isAppliedFilter = true;
        } else {
          filterProData.isAppliedFilter = false;
        }
        filterProData.isAppliedFieldEdit = false;
        return filterProData;
      });
      clonedFilter.inputFieldDetailsForFilter = mapFilterFlowData;
      clonedFilter.selectedFieldDetailsFromFilter = jsUtils.cloneDeep(
        mapFilterFlowData,
      );
      if (clonedFilter.isMoreFilter) clonedFilter.isMoreFilter = false;
      getReportData(clonedFilter);
    } else {
      clonedFilter.inputFieldDetailsForFilter = jsUtils.cloneDeep(
        updatedFilterFlowData,
      );
      clonedFilter.selectedFieldDetailsFromFilter = jsUtils.cloneDeep(
        updatedFilterFlowData,
      );
      onSetFilterAction(clonedFilter);
    }
  };

  const getAppliedFiltersElement = () => {
    const clonedFilterFlowData = jsUtils.cloneDeep(inputFieldDetailsForFilter);
    let appliedFieldsCount = 0;
    const mapFilterFlowData = clonedFilterFlowData?.map(
      (filterProData, index) => {
        const {
          fieldType,
          fieldNames,
          fieldValues,
          fieldUpdateValue,
          isAppliedFilter,
          isAppliedFieldEdit,
          selectedOperator,
          fieldUpdateBetweenOne,
          fieldUpdateBetweenTwo,
          fieldId,
          isUserFilterApplied,
          is_logged_in_user,
          error,
        } = filterProData;
        if (
          (isUserFilter ? isUserFilterApplied : isAppliedFilter) &&
          (appliedFieldsCount < filterCount || isUserFilter)
        ) {
          appliedFieldsCount++;
          return isLoading ? (
            <Skeleton width={100} className={cx(gClasses.MR5, gClasses.MT5)} />
          ) : (
            <FilterFormBuilder
              index={index}
              fieldId={fieldId}
              fieldType={fieldType}
              fieldNames={fieldNames}
              fieldValues={fieldValues}
              fieldUpdateValue={fieldUpdateValue}
              isAppliedFilter={isAppliedFilter}
              isApplied
              isAppliedFieldEdit={isAppliedFieldEdit}
              selectedOperator={selectedOperator}
              fieldUpdateBetweenOne={fieldUpdateBetweenOne}
              fieldUpdateBetweenTwo={fieldUpdateBetweenTwo}
              filter={filter}
              onSetFilterAction={onSetFilterAction}
              getReportData={getReportData}
              onClickApply={onClickApplyFilter}
              isUserFilter={isUserFilter}
              is_logged_in_user={is_logged_in_user}
              error={error}
            />
          );
        }
        return null;
      },
    );
    return mapFilterFlowData;
  };

  const onClickPlusMoreFilter = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    clonedFilter.isMoreFilter = true;
    onSetFilterAction(clonedFilter);
  };

  const getMoreFilterData = () => {
    const clonedFilterFlowData = jsUtils.cloneDeep(inputFieldDetailsForFilter);
    let appliedFieldsCount = 0;
    const moreValue = [];
    clonedFilterFlowData?.map((filterProData, index) => {
      const { isAppliedFilter } = filterProData;
      if (
        isAppliedFilter &&
        (appliedFieldsCount < filterCount || isUserFilter)
      ) {
        appliedFieldsCount++;
      } else if (isAppliedFilter) {
        filterProData.index = index;
        moreValue.push(filterProData);
      }
      return null;
    });
    if (moreValue.length > 0) {
      return (
        <MoreFilterDashboard
          moreFilterState={moreValue}
          filter={filter}
          onSetFilterAction={onSetFilterAction}
          getReportData={getReportData}
          onClickApply={onClickApplyFilter}
          referencePopperElement={showMoreReference}
        />
      );
    } else return null;
  };

  return (
    <div
      className={cx(
        BS.D_FLEX,
        BS.ALIGN_CONTENT_START,
        BS.FLEX_WRAP_WRAP,
        BS.P_RELATIVE,
      )}
      ref={containerRef}
    >
      <div className={cx(BS.D_FLEX, BS.FLEX_WRAP_WRAP)} ref={innerContainerRef}>
        {isShowNoAppliedFilterDataText && !isAppliedFilterData && (
          <span className={cx(styles.NoAppliedFilterDataText, gClasses.MR10)}>
            There are no filters added.
          </span>
        )}
        {getAppliedFiltersElement()}
        {isMoreFilter && !isLoading && !isUserFilter && (
          <>
            <div
              className={cx(BS.TEXT_CENTER, gClasses.MT7, gClasses.MR10)}
              ref={showMoreReference}
            >
              <button
                className={cx(
                  gClasses.FTwo13,
                  gClasses.FontWeight500,
                  gClasses.ClickableElement,
                  gClasses.CursorPointer,
                )}
                style={{ color: buttonColor }}
                onClick={onClickPlusMoreFilter}
              >
                {plusMoreButtonText}
              </button>
            </div>
            {getMoreFilterData()}
          </>
        )}
        {isClearFilter && !isUserFilter && !isLoading && (
          <div className={cx(BS.TEXT_CENTER, gClasses.MT7, gClasses.MR10)}>
            <button
              className={cx(
                gClasses.FTwo13,
                gClasses.FontWeight500,
                gClasses.ClickableElement,
                gClasses.CursorPointer,
              )}
              style={{ color: buttonColor }}
              onClick={onClickClearFilters}
            >
              {BUTTONS.CLEAR_FILTERS}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

AppliedFilter.propTypes = {
  filter: PropTypes.objectOf({
    inputFieldDetailsForFilter: PropTypes.arrayOf(PropTypes.object),
  }),
  onSetFilterAction: PropTypes.func,
  getReportData: PropTypes.func,
  isLoading: PropTypes.bool,
  isShowNoAppliedFilterDataText: PropTypes.bool,
  isUserFilter: PropTypes.bool,
};

export default AppliedFilter;
