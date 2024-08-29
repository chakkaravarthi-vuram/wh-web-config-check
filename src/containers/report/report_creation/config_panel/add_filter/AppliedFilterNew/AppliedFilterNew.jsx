import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import {
  keydownOrKeypessEnterHandle,
  useClickOutsideDetectorForFilters,
} from 'utils/UtilityFunctions';
import CloseIconNewSmall from 'assets/icons/CloseIconNewSmall';
import LeftIcon from 'assets/icons/LeftIcon';
import MoreFilterNew from '../../../../../../components/dashboard_filter/more_filters/MoreFiltersNew';
import {
  validateCurrentFilter,
  validateFilterValues,
} from '../../../../../../components/dashboard_filter/more_filters/MoreFilter.utils';
import {
  isEmptyFieldUpdateValue,
  getAppliedFilterDisplayText,
} from '../../../../../../components/dashboard_filter/FilterUtils';
import jsUtils from '../../../../../../utils/jsUtility';
import gClasses from '../../../../../../scss/Typography.module.scss';
import styles from './AppliedFilterNew.module.scss';
import { REPORT_STRINGS } from '../../../../Report.strings';
import Config from '../../fields/Config';
import {
  FILTER_TYPES,
  ONLY_SELECT_FIELDS,
} from '../../../../../../components/dashboard_filter/Filter.strings';
import { FIELD_TYPE } from '../../../../../../utils/constants/form_fields.constant';

function AppliedFilterNew(props) {
  const { t } = useTranslation();
  const {
    index,
    filter,
    filter: { inputFieldDetailsForFilter },
    filterProData,
    onSetFilterAction,
    getReportData,
  } = props;
  const appliedFilterNewWrapperRef = useRef();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState();
  const filterConfigurationPopUpFlag = useRef(false);
  const { ERRORS } = REPORT_STRINGS(t);

  const openFilter = () => {
    if (open || filterProData.isFieldDeleted) return;
    setOpen(true);
    filterConfigurationPopUpFlag.current = false;
  };

  const onCloseAppliedFilter = () => {
    setOpen(false);
    setError(null);
  };
  useClickOutsideDetectorForFilters(
    appliedFilterNewWrapperRef,
    onCloseAppliedFilter,
  );
  const onClickFieldEditDiscard = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);

    clonedFilter.inputFieldDetailsForFilter &&
      clonedFilter.inputFieldDetailsForFilter.length > 0 &&
      clonedFilter.inputFieldDetailsForFilter.map((proData) => {
        proData.isAppliedFieldEdit = false;
        return proData;
      });
    clonedFilter.selectedFieldDetailsFromFilter &&
      clonedFilter.selectedFieldDetailsFromFilter.length > 0 &&
      clonedFilter.selectedFieldDetailsFromFilter.map((proData) => {
        proData.isAppliedFieldEdit = false;
        return proData;
      });
    const { inputFieldDetailsForFilter, selectedFieldDetailsFromFilter } =
      clonedFilter;

    const isEqual = jsUtils.isEqual(
      inputFieldDetailsForFilter,
      selectedFieldDetailsFromFilter,
    );
    if (!isEqual) {
      clonedFilter.inputFieldDetailsForFilter = jsUtils.cloneDeep(
        selectedFieldDetailsFromFilter,
      );
    }
    onSetFilterAction(clonedFilter);
    onCloseAppliedFilter();
    filterConfigurationPopUpFlag.current = true;
  };

  useEffect(() => {
    if (!open && !filterConfigurationPopUpFlag.current) {
      onClickFieldEditDiscard();
    }
  }, [open]);

  const strValue = getAppliedFilterDisplayText(filterProData, t);
  const onClickApplyFilter = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    const clonedFilterFlowData = jsUtils.cloneDeep(inputFieldDetailsForFilter);
    const [isFieldValid, errorMessage] = validateCurrentFilter(
      filterProData,
      clonedFilterFlowData,
      t,
    );
    if (isFieldValid) {
      setError(null);
    } else {
      setError(errorMessage);
      return;
    }

    const { updatedFilterFlowData, isValid } = validateFilterValues(
      clonedFilterFlowData,
      t,
    );
    if (isValid) {
      const mapFilterFlowData =
        updatedFilterFlowData &&
        updatedFilterFlowData.length > 0 &&
        updatedFilterFlowData.map((filterProData) => {
          if (isEmptyFieldUpdateValue(filterProData)) {
            filterProData.isAppliedFilter = true;
          } else {
            filterProData.isAppliedFilter = false;
          }
          filterProData.isAppliedFieldEdit = false;
          return filterProData;
        });
      clonedFilter.inputFieldDetailsForFilter = mapFilterFlowData;
      clonedFilter.selectedFieldDetailsFromFilter =
        jsUtils.cloneDeep(mapFilterFlowData);
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
    filterConfigurationPopUpFlag.current = true;
    onCloseAppliedFilter();
  };

  const onCloseCover = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    clonedFilter.inputFieldDetailsForFilter[index].fieldValues?.map?.(
      (checkList) => {
        checkList.isCheck = false;
        return checkList;
      },
    );
    clonedFilter.inputFieldDetailsForFilter[index].is_logged_in_user = false;
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateValue =
      EMPTY_STRING;
    clonedFilter.inputFieldDetailsForFilter[index].isAppliedFilter = false;
    clonedFilter.inputFieldDetailsForFilter &&
      clonedFilter.inputFieldDetailsForFilter.length > 0 &&
      clonedFilter.inputFieldDetailsForFilter.map((proData) => {
        proData.isAppliedFieldEdit = false;
        return proData;
      });
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenOne =
      EMPTY_STRING;
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenTwo =
      EMPTY_STRING;
    if (
      ONLY_SELECT_FIELDS.includes(
        clonedFilter.inputFieldDetailsForFilter[index].selectedOperator,
      )
    ) {
      if (
        clonedFilter.inputFieldDetailsForFilter[index].fieldType ===
        FIELD_TYPE.DATE
      ) {
        clonedFilter.inputFieldDetailsForFilter[index].selectedOperator =
          FILTER_TYPES.DATE.EQUAL;
      } else if (
        clonedFilter.inputFieldDetailsForFilter[index].fieldType ===
        FIELD_TYPE.DATETIME
      ) {
        clonedFilter.inputFieldDetailsForFilter[index].selectedOperator =
          FILTER_TYPES.DATE.DATE_IN_RANGE;
      } else {
        clonedFilter.inputFieldDetailsForFilter[index].selectedOperator =
          FILTER_TYPES.NUMBER.EQUAL;
      }
    }
    clonedFilter.selectedFieldDetailsFromFilter = jsUtils.cloneDeep(
      clonedFilter.inputFieldDetailsForFilter,
    );
    getReportData(clonedFilter);
  };

  const getAppliedFiltersElement = () => {
    const { isAppliedFilter } = filterProData;
    if (isAppliedFilter) {
      return (
        <Config
          isBackNeeded
          mainContent={
            <MoreFilterNew
              field={filterProData}
              filter={filter}
              onSetFilterAction={onSetFilterAction}
              getReportData={getReportData}
              index={index}
              isApplied
              error={error}
              resetError={() => setError(null)}
              isAddFilter
            />
          }
          onClickApply={onClickApplyFilter}
          onClickDiscard={onClickFieldEditDiscard}
        />
      );
    }
    return null;
  };

  return (
    <div className={gClasses.MB8}>
      <div
        className={gClasses.PositionRelative}
        ref={appliedFilterNewWrapperRef}
      >
        <button
          className={cx(styles.FilterBtn, styles.SelectedField, {
            [styles.Error]: filterProData.isFieldDeleted,
          })}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && openFilter()}
          onClick={openFilter}
        >
          <div className={styles.FilterTextCompleted}>
            <div>
              {filterProData.fieldNames}
              <LeftIcon
                className={cx(gClasses.Rotate180, gClasses.ML15, gClasses.MR15)}
              />
              <span title={strValue}>{strValue}</span>
            </div>
            <button
              className={cx(
                gClasses.CursorPointer,
                gClasses.ClickableElement,
                styles.closeBtn,
              )}
              onClick={onCloseCover}
              onKeyDown={(e) =>
                keydownOrKeypessEnterHandle(e) && e.stopPropagation()
              }
            >
              <CloseIconNewSmall />
            </button>
          </div>
        </button>
        {open && (
          <div
            className={cx(styles.FilterDropdown, {
              [styles.Completed]: true,
            })}
          >
            {getAppliedFiltersElement()}
          </div>
        )}
      </div>
      {filterProData.isFieldDeleted && (
        <div
          role="alert"
          aria-hidden="false"
          className={cx(gClasses.FTwo12RedV2)}
        >
          {ERRORS.FIELD_DELETED_FROM_SOURCE}
        </div>
      )}
    </div>
  );
}

AppliedFilterNew.propTypes = {
  index: PropTypes.number,
  filter: PropTypes.objectOf({ inputFieldDetailsForFilter: PropTypes.array }),
  filterProData: PropTypes.objectOf({
    fieldNames: PropTypes.string,
    isFieldDeleted: PropTypes.bool,
  }),
  onSetFilterAction: PropTypes.func,
  getReportData: PropTypes.func,
};

export default AppliedFilterNew;
