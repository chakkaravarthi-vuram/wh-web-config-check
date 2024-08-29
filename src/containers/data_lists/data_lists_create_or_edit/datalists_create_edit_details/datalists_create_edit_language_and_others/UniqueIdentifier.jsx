import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  ECheckboxSize,
  ETitleSize,
  SingleDropdown,
  Title,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styles from '../../DatalistsCreateEdit.module.scss';
import { DATALIST_ADDON_STRINGS } from '../../../data_list_landing/datalist_details/datalist_add_on/DatalistAddOn.strings';
import { CUSTOM_IDENTIFIER_EXCLUDE_FIELDS_PARAMS, IDENTIFIER_TYPES, LANGUAGE_AND_OTHERS, UNIQUE_FIELD_EXCLUDE_FIELDS_PARAMS } from '../../DatalistsCreateEdit.constant';
import { apiGetAllFieldsList } from '../../../../../axios/apiService/flow.apiService';
import { cloneDeep, isEmpty } from '../../../../../utils/jsUtility';
import { getErrorMessage } from '../../DatalistsCreateEdit.utils';

function UniqueIdentifier(props) {
  const { addOnData, setAddOnData, dataListID, errorList } = props;
  const { t } = useTranslation();
  // const [isAddField, setIsAddField] = useState(false);
  const { TITLE, UNIQUE_FIELD } = DATALIST_ADDON_STRINGS(t).IDENTIFIER;
  const [searchText, setSearchText] = useState(null);
  const [uniqueFieldSearchText, setUniqueFieldSearchText] = useState(null);
  const [customFields, setCustomFields] = useState({});
  const [uniqueFields, setUniqueFields] = useState({});
  // const [searchTaskFieldsText, setSearchTaskFieldsText] = useState(null);
  const [taskIdentifierFields, setTaskIdentifierFields] = useState({});

  const onIdentifierChangeHandler = (value, label, isTaskIdentifier = false) => {
    const clonedAddOnData = cloneDeep(addOnData);
    if (isTaskIdentifier) {
      if (isEmpty(value)) {
        delete clonedAddOnData?.taskIdentifier;
      } else {
        clonedAddOnData.taskIdentifier = [{ label: label, value: value }];
      }
      setAddOnData(clonedAddOnData);
      // setSearchTaskFieldsText(null);
    } else {
      if (isEmpty(value)) {
        delete clonedAddOnData?.customIdentifier;
      } else {
        clonedAddOnData.customIdentifier = { label: label, value: value };
      }
      setAddOnData(clonedAddOnData);
      setSearchText(null);
    }
  };

  const onUniqueFieldChangeHandler = (value, label) => {
    const clonedAddOnData = cloneDeep(addOnData);
    clonedAddOnData.uniqueField = { label: label, value: value };
    setAddOnData(clonedAddOnData);
    setUniqueFieldSearchText(null);
  };

  const getAllFields = (page = 1, searchValue = null, type = IDENTIFIER_TYPES.CUSTOM_IDENTIFIER) => {
    const params = {
      page: page,
      size: 15,
      sort_by: 1,
      data_list_id: dataListID,
      ignore_field_types: CUSTOM_IDENTIFIER_EXCLUDE_FIELDS_PARAMS,
      field_list_type: 'direct',
    };
    if (searchValue) params.search = searchValue;
    if (type === IDENTIFIER_TYPES.TASK_IDENTIFIER) {
      params.ignore_field_types = ['paragraph', 'fileupload', 'checkbox', 'yesorno', 'link', 'information', 'lookupcheckbox', 'table'];
      params.include_property_picker = 1;
    } else if (type === IDENTIFIER_TYPES.UNIQUE_FIELD) {
      params.ignore_field_types = UNIQUE_FIELD_EXCLUDE_FIELDS_PARAMS;
    }
    apiGetAllFieldsList(params, null, null, true).then((data) => {
      const constructedLabelValues = data?.pagination_data?.map((field) => {
        return { label: field?.field_name, value: field?.field_uuid };
      });
      if (type === IDENTIFIER_TYPES.TASK_IDENTIFIER) {
        setTaskIdentifierFields({ ...taskIdentifierFields, list: constructedLabelValues, paginationDetails: data?.pagination_details });
      } else if (type === IDENTIFIER_TYPES.UNIQUE_FIELD) {
        setUniqueFields({ ...taskIdentifierFields, list: constructedLabelValues, paginationDetails: data?.pagination_details });
      } else {
        setCustomFields({ ...customFields, list: constructedLabelValues, paginationDetails: data?.pagination_details });
      }
    }).catch((err) => console.log('getAllFields err', err));
  };

  const loadMoreFields = (isTaskIdentifier) => {
    if (isTaskIdentifier) {
      if (taskIdentifierFields?.paginationDetails?.page) getAllFields(taskIdentifierFields.paginationDetails.page + 1 || 1);
    } else {
      if (customFields?.paginationDetails?.page) getAllFields(customFields.paginationDetails.page + 1 || 1);
    }
  };

  useEffect(() => {
    getAllFields(1, addOnData?.customIdentifier?.label || null);
    getAllFields(1, addOnData?.uniqueField?.label || null, IDENTIFIER_TYPES.UNIQUE_FIELD);
    // getAllFields(1, addOnData?.taskIdentifier?.[0]?.label || null, true);
  }, []);

  return (
    <>
      <Title
        content={TITLE}
        size={ETitleSize.xs}
        className={styles.UniqueIdentifierTitle}
      />
      <div className={cx(gClasses.MT16, gClasses.W50)}>
        <SingleDropdown
          dropdownViewProps={{
            labelName: TITLE,
            labelClassName: styles.IdentifierDropdown,
            selectedLabel: addOnData?.customIdentifier?.label,
            disabled: addOnData?.isSystemIdentifier,
            onBlur: () => setSearchText(null),
            onClick: () => getAllFields(1),
            onKeyDown: () => getAllFields(1),
          }}
          searchProps={{
            searchValue: searchText,
            searchPlaceholder: 'Search Fields',
            onChangeSearch: (event) => { setSearchText(event?.target?.value); getAllFields(1, event?.target?.value); },
          }}
          infiniteScrollProps={{
            scrollableId: 'customIdentifierFieldsList',
            next: loadMoreFields,
            dataLength: customFields?.list || [],
            hasMore: customFields?.list?.length < customFields?.paginationDetails?.total_count,
          }}
          optionList={customFields?.list}
          onClick={(value, label) => onIdentifierChangeHandler(value, label)}
          selectedValue={addOnData?.customIdentifier?.value}
          errorMessage={getErrorMessage(errorList, 'customIdentifier')}
          showReset
        />
      </div>
      <Checkbox
        className={cx(gClasses.MT16)}
        size={ECheckboxSize.SM}
        labelClassName={cx(gClasses.FontWeight500, gClasses.FTwo13Black)}
        isValueSelected={addOnData?.isSystemIdentifier}
        details={LANGUAGE_AND_OTHERS(t).CHECKBOX_OPTIONS}
        onClick={() => setAddOnData({ ...addOnData, isSystemIdentifier: !addOnData?.isSystemIdentifier })}
      />

      {/* Unique field */}
      <div className={cx(gClasses.MT16, gClasses.W50)}>
        <SingleDropdown
          dropdownViewProps={{
            labelName: UNIQUE_FIELD.LABEL,
            labelClassName: styles.IdentifierDropdown,
            selectedLabel: addOnData?.uniqueField?.label,
            onClick: () => getAllFields(1, null, IDENTIFIER_TYPES.UNIQUE_FIELD),
            onKeyDown: () => getAllFields(1, null, IDENTIFIER_TYPES.UNIQUE_FIELD),
            onBlur: () => setUniqueFieldSearchText(null),
          }}
          infiniteScrollProps={{
            scrollableId: 'uniqueFieldsList',
            next: loadMoreFields,
            dataLength: uniqueFields?.list || [],
            hasMore: uniqueFields?.list?.length < uniqueFields?.paginationDetails?.total_count,
          }}
          searchProps={{
            searchValue: uniqueFieldSearchText,
            searchPlaceholder: 'Search Fields',
            onChangeSearch: (event) => { setUniqueFieldSearchText(event?.target?.value); getAllFields(1, event?.target?.value, IDENTIFIER_TYPES.UNIQUE_FIELD); },
          }}
          optionList={uniqueFields?.list}
          onClick={(value, label) => onUniqueFieldChangeHandler(value, label)}
          selectedValue={addOnData?.uniqueField?.value}
          errorMessage={getErrorMessage(errorList, 'uniqueField')}
          showReset
        />
        {!isEmpty(addOnData?.uniqueField?.value) &&
        <Checkbox
          className={gClasses.MT16}
          labelClassName={cx(gClasses.FontWeight500, gClasses.FTwo13Black)}
          size={ECheckboxSize.SM}
          details={LANGUAGE_AND_OTHERS(t).IGNORE_NULL_CHECKBOX}
          isValueSelected={addOnData?.isIgnoreNull}
          onClick={() => setAddOnData({ ...addOnData, isIgnoreNull: !addOnData?.isIgnoreNull })}
        />}
      </div>

      {/* Task identifier feature commented out for now */}

      {/* <Text
        content={TASK_IDENTIFIER.LABEL}
        className={cx(gClasses.MT16, styles.ConfigureClass, gClasses.MB5)}
      /> */}
      {/* <div className={gClasses.DisplayFlex}>
        <div className={styles.DropdownWrapper}>
          <SingleDropdown
            dropdownViewProps={{
              labelName: TITLE,
              labelClassName: styles.IdentifierDropdown,
              selectedLabel: addOnData?.taskIdentifier?.[0].label,
              onBlur: () => setSearchTaskFieldsText(null),
              onFocus: () => getAllFields(1, null, IDENTIFIER_TYPES.TASK_IDENTIFIER),
            }}
            searchProps={{
              searchValue: searchTaskFieldsText,
              searchPlaceholder: 'Search Fields',
              onChangeSearch: (event) => { setSearchTaskFieldsText(event?.target?.value); getAllFields(1, event?.target?.value, IDENTIFIER_TYPES.TASK_IDENTIFIER); },
            }}
            infiniteScrollProps={{
              scrollableId: 'taskIdentifierFieldsList',
              next: () => loadMoreFields(true),
              dataLength: taskIdentifierFields?.list,
              hasMore: taskIdentifierFields?.list?.length < taskIdentifierFields?.paginationDetails?.total_count,
            }}
            onFocus
            optionList={taskIdentifierFields?.list}
            onClick={(value, label) => onIdentifierChangeHandler(value, label, true)}
            selectedValue={addOnData?.taskIdentifier?.[0]?.value}
            errorMessage={getErrorMessage(errorList, 'taskIdentifier')}
            showReset
          />
        </div>
         {!isAddField ? (
          <div
            className={cx(
              gClasses.PositionRelative,
              gClasses.DisplayFlex,
              gClasses.ML8,
            )}
          >
            <button
              className={cx(
                gClasses.CenterV,
                gClasses.ClickableElement,
                gClasses.CursorPointer,
                gClasses.PositionRelative,
              )}
              onClick={() => setIsAddField(!isAddField)}
            >
              <PlusIconBlueNew className={cx(gClasses.MR5)} />
              <div className={gClasses.FlexGrow1}>
                <div
                  className={cx(gClasses.FTwo13, gClasses.FontWeight500)}
                  style={{ color: '#217CF5' }}
                >
                  {LANGUAGE_AND_OTHERS(t).STEP_NAME}
                </div>
              </div>
            </button>
          </div>
        ) : null}
       </div> */}
    </>
  );
}
export default UniqueIdentifier;

UniqueIdentifier.propTypes = {
  addOnData: PropTypes.object,
  setAddOnData: PropTypes.func,
  dataListID: PropTypes.string,
  errorList: PropTypes.object,
};
