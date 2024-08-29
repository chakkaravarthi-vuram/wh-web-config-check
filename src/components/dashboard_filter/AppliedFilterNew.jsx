import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';
import { Button, EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import {
  keydownOrKeypessEnterHandle,
  useClickOutsideDetectorForFilters,
} from 'utils/UtilityFunctions';
import CloseIconNewSmall from 'assets/icons/CloseIconNewSmall';
import LeftIcon from 'assets/icons/LeftIcon';
import {
  validateCurrentFilter,
  validateFilterValues,
} from './more_filters/MoreFilter.utils';
import {
  getAppliedFilterDisplayText,
  isEmptyFieldUpdateValue,
} from './FilterUtils';
import jsUtils from '../../utils/jsUtility';
import gClasses from '../../scss/Typography.module.scss';
import MoreFiltersNew from './more_filters/MoreFiltersNew';
import styles from './AddFilter.module.scss';

function AppliedFilterNew(props) {
  const { t } = useTranslation();
  const {
    index,
    filter,
    filter: { inputFieldDetailsForFilter },
    filterProData,
    onSetFilterAction,
    getReportData,
    isLoading,
  } = props;
  const filterBtnRef = useRef();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState();
  const completedRef = useRef(false);

  const openFilter = () => {
    if (open) return;
    setOpen(true);
    completedRef.current = false;
  };

  const close = () => {
    setOpen(false);
    setError(null);
  };
  useClickOutsideDetectorForFilters(filterBtnRef, close);
  const onClickFieldEditDiscard = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);

    clonedFilter.inputFieldDetailsForFilter?.map((proData) => {
      proData.isAppliedFieldEdit = false;
      return proData;
    });
    clonedFilter.selectedFieldDetailsFromFilter?.map((proData) => {
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
    close();
    completedRef.current = true;
  };

  useEffect(() => {
    if (!open && !completedRef.current) {
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
            filterProData.isFormField = false;
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
    completedRef.current = true;
    close();
  };

  const onCloseCover = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    clonedFilter.inputFieldDetailsForFilter[index].fieldValues?.map(
      (checkList) => {
        checkList.isCheck = false;
        return checkList;
      },
    );
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateValue =
      EMPTY_STRING;
    clonedFilter.inputFieldDetailsForFilter[index].isAppliedFilter = false;
    clonedFilter.inputFieldDetailsForFilter?.map((proData) => {
      proData.isAppliedFieldEdit = false;
      return proData;
    });
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenOne =
      EMPTY_STRING;
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenTwo =
      EMPTY_STRING;
    clonedFilter.selectedFieldDetailsFromFilter = jsUtils.cloneDeep(
      clonedFilter.inputFieldDetailsForFilter,
    );
    getReportData(clonedFilter);
  };

  const getAppliedFiltersElement = () => {
    const { isAppliedFilter } = filterProData;
    if (isAppliedFilter) {
      return isLoading ? (
        <Skeleton width={100} className={cx(gClasses.MR5, gClasses.MT5)} />
      ) : (
        <div className={cx(styles.FieldConfiguration)}>
          <div className={cx(gClasses.PX24, styles.FieldContent)}>
            <MoreFiltersNew
              field={filterProData}
              filter={filter}
              onSetFilterAction={onSetFilterAction}
              getReportData={getReportData}
              index={index}
              error={error}
              resetError={() => setError(null)}
            />
          </div>

          <div className={cx(styles.Divider, gClasses.MB16)} />

          <div className={cx(gClasses.RightH, gClasses.PX24)}>
            <Button
              type={EButtonType.TERTIARY}
              onClickHandler={() => onClickFieldEditDiscard()}
              buttonText="Discard"
            />
            <Button
              type={EButtonType.PRIMARY}
              className={gClasses.ML15}
              onClickHandler={onClickApplyFilter}
              buttonText="Apply"
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <button
      className={cx(
        styles.FilterBtn,
        gClasses.CursorPointer,
        gClasses.MB8,
        styles.SelectedField,
      )}
      ref={filterBtnRef}
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
      {open && (
        <div
          className={cx(styles.FilterDropdown, {
            [styles.Completed]: true,
          })}
        >
          {getAppliedFiltersElement()}
        </div>
      )}
    </button>
  );
}

AppliedFilterNew.propTypes = {
  index: PropTypes.number,
  filter: PropTypes.objectOf({
    inputFieldDetailsForFilter: PropTypes.arrayOf(PropTypes.object),
  }),
  filterProData: PropTypes.object,
  onSetFilterAction: PropTypes.func,
  getReportData: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default AppliedFilterNew;
