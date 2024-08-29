import React, { useEffect, useState } from 'react';
import { Skeleton } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'utils/jsUtility';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import {
  SELECT_COLUMN,
  getNoDataFoundList,
} from '../../containers/integration/add_integration/workhall_api/WorkhallApi.utils';
import { WORKHALL_API_STRINGS } from '../../containers/integration/Integration.strings';
import { generateEventTargetObject } from '../../utils/generatorUtils';
import styles from './FieldPicker.module.scss';
import { FIELD_PICKER_DROPDOWN_TYPES } from './FieldPicker.utils';
import NestedDropdown from '../nested_dropdown/NestedDropdown';

function FieldPicker(props) {
  const {
    id,
    disabled,
    onChange = () => { },
    optionList = [],
    isLoading,
    errorMessage,
    isFieldsLoading,
    initialOptionList,
    systemFieldList,
    dropdownListClass,
    selectedOption,
    outerClassName,
    isExactPopperWidth,
    mappingIndex,
    allFields = [],
    isDataFieldsOnly = false,
    placeholder,
    enableSearch,
    isExpandChild = false,
    fieldPickerClassName,
    valueKey,
    isSystemFieldsOnly,
  } = props;

  const { t } = useTranslation();

  const [fieldsOptionList, setFieldsOptionList] = useState([]);
  const [filteredFieldsOptionList, setFilteredFieldsOptionList] = useState([]);
  const [backButtonDetails, setBackButtonDetails] = useState();
  const [fieldSearchValue, setFieldSearchValue] = useState(EMPTY_STRING);
  const [selectedPath, setSelectedPath] = useState([]);

  const getInitialOption = (initialOptionList) => {
    let updatedInitialOptionList = initialOptionList || [];
    if (isDataFieldsOnly) {
      if (isEmpty(optionList)) {
        updatedInitialOptionList = getNoDataFoundList(t);
      } else {
        updatedInitialOptionList = optionList;
      }
    } else if (isSystemFieldsOnly) {
      if (isEmpty(systemFieldList)) {
        updatedInitialOptionList = getNoDataFoundList(t);
      } else {
        updatedInitialOptionList = systemFieldList;
      }
    }

    setFieldsOptionList(updatedInitialOptionList);
  };

  useEffect(() => {
    if (isFieldsLoading) return;
    getInitialOption(initialOptionList);
  }, [isFieldsLoading, initialOptionList, optionList]);

  const dropdownClearHandler = () => {
    getInitialOption(initialOptionList);
    setBackButtonDetails({});
    setSelectedPath([]);
    setFieldSearchValue(EMPTY_STRING);
  };

  const expandButtonClick = (option) => {
    if (option?.current_level === FIELD_PICKER_DROPDOWN_TYPES.TABLE_FIELDS) {
      const filteredTableFields = allFields?.filter(
        (field) => option?.table_uuid === field?.table_uuid,
      );
      filteredTableFields.unshift(SELECT_COLUMN);
      setFieldsOptionList(filteredTableFields);
      setBackButtonDetails({
        label: WORKHALL_API_STRINGS.CHOOSE_FIELDS,
        current_level: FIELD_PICKER_DROPDOWN_TYPES.DATA_FIELDS,
      });
    }
  };

  const onOptionClickHandler = (option, callback) => {
    switch (option?.current_level) {
      case FIELD_PICKER_DROPDOWN_TYPES.INITIAL:
        setFieldsOptionList(initialOptionList);
        setBackButtonDetails({});
        break;
      case FIELD_PICKER_DROPDOWN_TYPES.DATA_FIELDS:
        if (isEmpty(optionList)) {
          setFieldsOptionList(getNoDataFoundList(t));
        } else {
          setFieldsOptionList(optionList);
        }
        if (!isDataFieldsOnly) {
          setBackButtonDetails({
            label: WORKHALL_API_STRINGS.DATA_FIELDS,
            current_level: FIELD_PICKER_DROPDOWN_TYPES.INITIAL,
          });
        } else {
          setBackButtonDetails({});
        }
        break;
      case FIELD_PICKER_DROPDOWN_TYPES.SYSTEM_FIELDS:
        if (isEmpty(systemFieldList)) {
          setFieldsOptionList(getNoDataFoundList(t));
        } else {
          setFieldsOptionList(systemFieldList);
        }

        if (!isSystemFieldsOnly) {
          setBackButtonDetails({
            label: WORKHALL_API_STRINGS.SYSTEM_FIELDS,
            current_level: FIELD_PICKER_DROPDOWN_TYPES.INITIAL,
          });
        } else {
          setBackButtonDetails({});
        }
        break;
      case FIELD_PICKER_DROPDOWN_TYPES.TABLE_FIELDS:
        if (isExpandChild) {
          expandButtonClick(option);
        } else {
          const eventObject = generateEventTargetObject(option?.id, option?.value, option);
          if (onChange) onChange(eventObject);
          if (callback) callback();
        }
        break;
      default:
        const eventObject = generateEventTargetObject(option?.id, option?.value, option);
        if (onChange) onChange(eventObject);
        if (callback) callback();
        break;
    }
    setFieldSearchValue(EMPTY_STRING);
  };

  const onBackBtnClick = () => {
    onOptionClickHandler(backButtonDetails, null);
  };

  const onDropdownClickHandler = (id, selectedOption) => {
    console.log(selectedOption, 'selectedOptionselectedOptionselectedOptionselectedOption');
    let current_level = null;
    if (isEmpty(selectedOption)) {
      setSelectedPath([]);
      return;
    }
    if (selectedOption?.system_field_type) {
      current_level = FIELD_PICKER_DROPDOWN_TYPES.SYSTEM_FIELDS;
    } else {
      current_level = FIELD_PICKER_DROPDOWN_TYPES.DATA_FIELDS;
    }
    if (current_level === FIELD_PICKER_DROPDOWN_TYPES.TABLE_FIELDS) {
      setSelectedPath([selectedOption?.table_uuid]);
    } else {
      setSelectedPath([current_level]);
    }
    onOptionClickHandler({ ...selectedOption, current_level });
  };

  const handleSearchChange = (event) => {
    const {
      target: { value = EMPTY_STRING },
    } = event;

    if (!isEmpty(fieldsOptionList)) {
      const filteredList = fieldsOptionList?.filter((field) => {
        const loweredLabel = field?.label?.toLowerCase();
        const loweredValue = value?.toLowerCase();
        return loweredLabel?.includes(loweredValue);
      });

      if (isEmpty(filteredList)) {
        setFilteredFieldsOptionList(getNoDataFoundList(t));
      } else {
        setFilteredFieldsOptionList(filteredList);
      }
    }

    setFieldSearchValue(value);
  };

  if (isLoading) {
    return <Skeleton width="100%" height={30} />;
  }

  return (
    <div className={fieldPickerClassName}>
      {isFieldsLoading ? (
        <div className={styles.DropdownOuterClassName}>
          <Skeleton className={styles.DropdownInputLoader} />
        </div>
      ) : (
        <NestedDropdown
          id={id}
          searchBarPlaceholder={t(WORKHALL_API_STRINGS.SEARCH_FIELDS)}
          optionList={
            !isEmpty(fieldSearchValue)
              ? filteredFieldsOptionList
              : fieldsOptionList
          }
          selectedOption={selectedOption}
          searchValue={fieldSearchValue}
          isExactPopperWidth={isExactPopperWidth}
          outerClassName={outerClassName}
          dropdownListClass={dropdownListClass}
          onBackBtnClick={onBackBtnClick}
          backButtonDetails={backButtonDetails}
          dropdownClearHandler={dropdownClearHandler}
          onDropdownClickHandler={onDropdownClickHandler}
          onChange={(_, option, callback) =>
            onOptionClickHandler(option, callback)
          }
          handleSearchChange={(e) => handleSearchChange(e)}
          expandButtonClick={expandButtonClick}
          selectedPath={selectedPath}
          errorMessage={errorMessage}
          hideMessage={!errorMessage}
          isDataLoading={isFieldsLoading}
          mappingIndex={mappingIndex}
          disabled={disabled}
          placeholder={placeholder}
          enableSearch={enableSearch}
          valueKey={valueKey}
        />
      )}
    </div>
  );
}

export default FieldPicker;
