import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from './OtherDataSource.module.scss';
import { BS } from '../../../../utils/UIConstants';
import LinkIconV3 from '../../../../assets/icons/LinkIconV3';
import {
  LIST_API_TYPE,
  DROPDOWN_TYPES,
  REPORT_STRINGS,
} from '../../Report.strings';
import jsUtility, { cloneDeep } from '../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';

function OtherDataSource(props) {
  const {
    onDeleteClick,
    onDropDownClick,
    onSearchTextChangeHandler,
    searchText,
    primaryField,
    getOptionList,
    secondaryDataSourceOptionList,
    primaryFieldOptionList,
    secondaryFieldOptionList,
    secondaryDataSourceType,
    onDropDownTypeChangeHandler,
    secondaryField,
    primaryFieldName,
    secondaryFieldName,
    secondaryDataSourceName,
    errorList,
    secondaryDataSource,
    primaryDataSource,
    setSearchText,
  } = props;
  const size = 100;

  const isMultipleDataSourceSelected =
    !jsUtility.isEmpty(secondaryDataSource) &&
    !jsUtility.isEmpty(primaryDataSource);
  let selectedLabel = null;
  if (secondaryDataSourceType === LIST_API_TYPE.FLOW) {
    selectedLabel = REPORT_STRINGS().SOURCES.FLOW;
  } else {
    selectedLabel =
      secondaryDataSourceType === LIST_API_TYPE.DATA_LIST
        ? REPORT_STRINGS().SOURCES.DATA_LIST
        : EMPTY_STRING;
  }
  return (
    <div
      className={cx(
        gClasses.MT16,
        gClasses.W100,
        gClasses.P24,
        styles.ContainerBackground,
      )}
    >
      <div>
        <button
          className={cx(
            styles.DeleteButton,
            gClasses.FTwo12Important,
            gClasses.FontWeight500,
          )}
          onClick={() => {
            onDeleteClick();
          }}
        >
          {REPORT_STRINGS().DELETE}
        </button>
      </div>
      <div className={cx(BS.D_FLEX)}>
        <div className={cx(gClasses.W40, BS.FLEX_COLUMN)}>
          <SingleDropdown
            dropdownViewProps={{
              placeholder: REPORT_STRINGS().SELECT,
              labelName: REPORT_STRINGS().TYPE,
              labelClassName: styles.LabelClassName,
              selectedLabel,
            }}
            optionList={REPORT_STRINGS().SOURCE_TYPE}
            onClick={(value) => {
              onDropDownTypeChangeHandler(
                DROPDOWN_TYPES.SECONDARY_SOURCE,
                value,
              );
            }}
          />
        </div>
        <div
          className={cx(
            gClasses.W60,
            gClasses.MT24,
            BS.FLEX_COLUMN,
            gClasses.PL16,
          )}
        >
          <SingleDropdown
            dropdownViewProps={{
              placeholder: REPORT_STRINGS().SELECT,
              disabled: !secondaryDataSourceType,
              selectedLabel: secondaryDataSourceName,
              labelClassName: styles.LabelClassName,
              onClick: () => {
                getOptionList(
                  EMPTY_STRING,
                  secondaryDataSourceType,
                  DROPDOWN_TYPES.SECONDARY_SOURCE,
                );
              },
              onKeyDown: () => {
                getOptionList(
                  EMPTY_STRING,
                  secondaryDataSourceType,
                  DROPDOWN_TYPES.SECONDARY_SOURCE,
                );
              },
            }}
            popperClassName={styles.PopperClassName}
            optionList={cloneDeep(secondaryDataSourceOptionList)}
            onClick={(value, label) => {
              onDropDownClick(DROPDOWN_TYPES.SECONDARY_SOURCE, value, label);
            }}
            errorMessage={errorList?.secondaryDataSource}
            selectedValue={secondaryDataSource}
            searchProps={{
              searchPlaceholder: REPORT_STRINGS().SEARCH,
              searchValue: searchText,
              onChangeSearch: (event) => {
                onSearchTextChangeHandler(
                  event,
                  secondaryDataSourceType,
                  DROPDOWN_TYPES.SECONDARY_SOURCE,
                );
              },
            }}
            infiniteScrollProps={{
              dataLength: size,
              next: () => {},
              hasMore: false,
            }}
            onOutSideClick={() => {
              setSearchText(EMPTY_STRING);
            }}
          />
        </div>
      </div>
      <div
        className={cx(
          BS.D_FLEX,
          gClasses.MT16,
          gClasses.W100,
          BS.ALIGN_ITEM_CENTER,
        )}
      >
        <div className={gClasses.W50}>
          <SingleDropdown
            optionList={cloneDeep(primaryFieldOptionList)}
            className={cx(BS.W100)}
            popperClassName={styles.PopperClassName}
            dropdownViewProps={{
              placeholder: REPORT_STRINGS().PRIMARY_FIELD.PLACEHOLDER,
              labelName: REPORT_STRINGS().PRIMARY_FIELD.LABEL,
              labelClassName: styles.LabelClassName,
              disabled: !isMultipleDataSourceSelected,
              selectedLabel: primaryFieldName,
              onClick: () => {
                getOptionList(
                  EMPTY_STRING,
                  LIST_API_TYPE.FIELD_LIST,
                  DROPDOWN_TYPES.PRIMARY_FIELD,
                );
              },
              onKeyDown: () => {
                getOptionList(
                  EMPTY_STRING,
                  LIST_API_TYPE.FIELD_LIST,
                  DROPDOWN_TYPES.PRIMARY_FIELD,
                );
              },
            }}
            onClick={(value, label) => {
              onDropDownClick(DROPDOWN_TYPES.PRIMARY_FIELD, value, label);
            }}
            errorMessage={errorList?.primaryField}
            selectedValue={primaryField}
            searchProps={{
              searchPlaceholder: REPORT_STRINGS().PRIMARY_FIELD.PLACEHOLDER,
              searchValue: searchText,
              onChangeSearch: (event) => {
                onSearchTextChangeHandler(
                  event,
                  3,
                  DROPDOWN_TYPES.PRIMARY_FIELD,
                );
              },
            }}
            infiniteScrollProps={{
              dataLength: size,
              next: () => {},
              hasMore: false,
            }}
            onOutSideClick={() => {
              setSearchText(EMPTY_STRING);
            }}
          />
        </div>

        <LinkIconV3
          className={cx(gClasses.MT25, gClasses.ML16, gClasses.MR16)}
        />
        <div className={cx(gClasses.W50)}>
          <SingleDropdown
            optionList={cloneDeep(secondaryFieldOptionList)}
            popperClassName={cx(styles.PopperClassName)}
            dropdownViewProps={{
              placeholder: REPORT_STRINGS().SECONDARY_FIELD.PLACEHOLDER,
              labelName: REPORT_STRINGS().SECONDARY_FIELD.LABEL,
              labelClassName: styles.LabelClassName,
              selectedLabel: secondaryFieldName,
              disabled: !isMultipleDataSourceSelected,
              onClick: () => {
                getOptionList(
                  EMPTY_STRING,
                  LIST_API_TYPE.FIELD_LIST,
                  DROPDOWN_TYPES.SECONDARY_FIELD,
                );
              },
              onKeyDown: () => {
                getOptionList(
                  EMPTY_STRING,
                  LIST_API_TYPE.FIELD_LIST,
                  DROPDOWN_TYPES.SECONDARY_FIELD,
                );
              },
            }}
            onClick={(value, label) => {
              onDropDownClick(DROPDOWN_TYPES.SECONDARY_FIELD, value, label);
            }}
            errorMessage={errorList?.secondaryField}
            selectedValue={secondaryField}
            searchProps={{
              searchPlaceholder: REPORT_STRINGS().SECONDARY_FIELD.PLACEHOLDER,
              searchValue: searchText,
              onChangeSearch: (event) => {
                onSearchTextChangeHandler(
                  event,
                  3,
                  DROPDOWN_TYPES.SECONDARY_FIELD,
                );
              },
            }}
            infiniteScrollProps={{
              dataLength: size,
              next: () => {},
              hasMore: false,
            }}
            onOutSideClick={() => {
              setSearchText(EMPTY_STRING);
            }}
          />
        </div>
      </div>
    </div>
  );
}

OtherDataSource.propTypes = {
  onDeleteClick: PropTypes.func,
  onDropDownClick: PropTypes.func,
  onSearchTextChangeHandler: PropTypes.func,
  searchText: PropTypes.string,
  primaryField: PropTypes.string,
  getOptionList: PropTypes.func,
  secondaryDataSourceOptionList: PropTypes.array,
  primaryFieldOptionList: PropTypes.array,
  secondaryFieldOptionList: PropTypes.array,
  secondaryDataSourceType: PropTypes.number,
  onDropDownTypeChangeHandler: PropTypes.func,
  secondaryField: PropTypes.string,
  primaryFieldName: PropTypes.string,
  secondaryFieldName: PropTypes.string,
  secondaryDataSourceName: PropTypes.string,
  errorList: PropTypes.object,
  secondaryDataSource: PropTypes.string,
  primaryDataSource: PropTypes.string,
  setSearchText: PropTypes.func,
};

export default OtherDataSource;
