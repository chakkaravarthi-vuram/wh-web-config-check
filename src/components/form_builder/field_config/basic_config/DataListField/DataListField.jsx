import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import cx from 'classnames/bind';
import jsUtils from 'utils/jsUtility';
import useApiCall from 'hooks/useApiCall';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import usePaginationApi from 'hooks/usePaginationApi';
import ThemeContext from 'hoc/ThemeContext';
import { getAllDataListFields } from 'axios/apiService/form.apiService';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { ALLOWED_DATALIST_FIELD_TYPES, ALLOWED_DATALIST_PROPERTY_TYPES } from 'utils/constants/dataListPicker.constant';
import {
  DATA_LIST_PICKER_KEYS,
  FIELD_KEYS, FIELD_LIST_TYPE,
  FIELD_TYPE,
  getFieldTypeForPropTypes,
  INITIAL_PAGE, MAX_PAGINATION_SIZE,
  PROPERTY_PICKER_ARRAY,
  PROPERTY_PICKER_KEYS,
} from 'utils/constants/form.constant';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { useTranslation } from 'react-i18next';
import { keydownOrKeypessEnterHandle, removeFieldByAttribute } from '../../../../../utils/UtilityFunctions';
import { BASIC_CONFIG_STRINGS } from '../DefaultValueRule.strings';

const cancelDataListToken = {
  cancelToken: null,
};
const setDataListFieldsCancelToken = (c) => { cancelDataListToken.cancelToken = c; };

const getDataListFieldsDropdown = (
    selectedValue,
    index,
    optionList,
    updatedDropdownOptionList,
    onChange,
    onLoadMore,
    hasMore,
    errorList,
    { sectionIndex, fieldListIndex, fieldIndex },
    removeField,
    colWidth,
    fieldType,
    disabled,
    className,
    isLoading,
    selectedDlFieldName,
    onSearchFields,
    datalist_selector_error_list = {},
    placeholder = '',
    t,
  ) => {
  let errorMessage = null;
  switch (fieldType) {
  case FIELD_TYPE.DATA_LIST:
      if (index === 0) {
        errorMessage = jsUtils.get(errorList, [`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.DATA_LIST},${DATA_LIST_PICKER_KEYS.DISPLAY_FIELDS},0`]) || jsUtils.get(errorList, [`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.DATA_LIST},${DATA_LIST_PICKER_KEYS.DISPLAY_FIELDS}`]);
      } else {
        errorMessage = jsUtils.get(errorList, [`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.DATA_LIST},${DATA_LIST_PICKER_KEYS.DISPLAY_FIELDS},${index}`]);
      }
      break;
  case FIELD_TYPE.DATA_LIST_PROPERTY_PICKER:
    errorMessage = jsUtils.get(errorList, [`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.PROPERTY_PICKER_DETAILS},${PROPERTY_PICKER_KEYS.REFERENCE_FIELD_UUID}`]);
    break;
  case FIELD_TYPE.USER_PROPERTY_PICKER:
    errorMessage = jsUtils.get(errorList, [`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.PROPERTY_PICKER_DETAILS},${PROPERTY_PICKER_KEYS.REFERENCE_FIELD_UUID}`]);
    break;
  default:
    break;
}
  const dlFieldFound = optionList.some((eachOption) => eachOption.value === selectedValue);
  const valueToDispaly = dlFieldFound ? selectedValue : selectedDlFieldName;
  const dropdown = (
    <Dropdown
      id={`data_list_fields_${index}`}
      optionList={optionList}
      updatedDropdownOptionList={updatedDropdownOptionList}
      hideLabel
      hasMore={hasMore}
      selectedValue={valueToDispaly}
      errorMessage={(!disabled || ([FIELD_TYPE.DATA_LIST_PROPERTY_PICKER, FIELD_TYPE.USER_PROPERTY_PICKER].includes(fieldType) && !jsUtils.isEmpty(selectedValue))) && (errorMessage || datalist_selector_error_list[index])}
      isPaginated
      loadDataHandler={onLoadMore}
      onChange={(event) => onChange(event, index)}
      showNoDataFoundOption
      noDataFoundOptionLabel="No datalist fields found"
      strictlySetSelectedValue
      disabled={disabled}
      isDataLoading={isLoading}
      enableSearch
      disableFocusFilter
      onSearchInputChange={onSearchFields}
      searchInputPlaceholder={placeholder}
    />
  );
  return (
    <Col sm={colWidth} xl={colWidth} className={className}>
          {dropdown}
          {index > 0 ? (
            <div className={gClasses.MB5}>
              <div
                className={cx(gClasses.CursorPointer, gClasses.FTwo12RedV8, BS.ML_AUTO)}
                style={{ width: 'max-content' }}
                onClick={() => removeField(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && removeField(index)}
              >
              {t('form_field_strings.field_config.remove_field')}
              </div>
            </div>
          ) : null }
    </Col>
  );
};

function DataListFields({
  dataListId,
  dataListUuid,
  dataListFields,
  onDataListChangeHandler,
  errorList,
  datalist_selector_error_list,
  sectionIndex,
  fieldListIndex,
  fieldIndex,
  fieldType,
  dataListPropertyField,
  dataListPickerField,
  disabled,
  onLabelChangeHandler,
  isNewField,
  onSetDataListSelectorErrorList,
}) {
  const allowed_field_types = PROPERTY_PICKER_ARRAY.includes(fieldType) ? ALLOWED_DATALIST_PROPERTY_TYPES : ALLOWED_DATALIST_FIELD_TYPES;
  const [selectedDlFieldName, setSelectedDlFieldName] = useState([null]);
  const [dropdownListLength, setDropdownListLength] = useState(null);

  const loadData = (isIntial = false, isSearch = false, searchText = EMPTY_STRING, page = INITIAL_PAGE, extraParam = {}) => {
    const param = {
      page: (isSearch || isIntial) ? INITIAL_PAGE : page,
      size: MAX_PAGINATION_SIZE,
      // data_list_id: dataListId,
      data_list_uuids: [dataListUuid],
      allowed_field_types: allowed_field_types,
      field_list_type: FIELD_LIST_TYPE.DIRECT,
      ...extraParam,
    };
    if (isSearch && searchText) param.search = searchText;
    return getAllDataListFields(param, setDataListFieldsCancelToken);
  };
  const { t } = useTranslation();
  const { buttonColor } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(!isNewField);
  const { data: dataListFieldsRes, paginationDetails, fetch } = useApiCall({}, true);
  const {
    hasMore: dataListFieldHasMore,
    onLoadMoreData: onLoadMoreDataListFields,
  } = usePaginationApi(
                      (page) => fetch(loadData(false, false, null, page)),
                      { paginationDetails, currentData: dataListFieldsRes, cancelToken: cancelDataListToken.cancelToken },
                      );

  const initialEditLoad = () => {
     let field_uuid = [];
      if (fieldType === FIELD_TYPE.DATA_LIST) field_uuid = dataListFields;
      else field_uuid = [dataListPropertyField];
    (!jsUtils.isEmpty(jsUtils.compact(field_uuid))) &&
    loadData(false, false, EMPTY_STRING, INITIAL_PAGE, { field_uuid: field_uuid })
    .then((response) => {
      const fields = jsUtils.get(response, ['pagination_data'], []);
      if (fieldType === FIELD_TYPE.DATA_LIST) {
            !jsUtils.isEmpty(dataListFields) && dataListFields.forEach((eachField, index) => {
                  const currentField = jsUtils.find(fields, { field_uuid: eachField });
                  if (currentField) {
                    setSelectedDlFieldName((previous_state) => {
                    previous_state[index] = currentField.field_name;
                    return previous_state;
                  });
                } else {
                  onSetDataListSelectorErrorList(index);
                }
            });
          } else {
            const fieldName = jsUtils.get(fields, [0, 'field_name'], null);
            setSelectedDlFieldName(() => [fieldName]);
            if ((jsUtils.isEmpty(fieldName) || (fieldName === null))) {
              onSetDataListSelectorErrorList();
            }
          }

          setIsLoading(false);
   });
 };

  useEffect(() => {
    if (disabled) {
              initialEditLoad();
              setIsLoading(false);
    } else {
        dataListUuid && fetch(loadData(true, false), (response) => {
                                                  initialEditLoad();
                                                  setDropdownListLength(response.length);
                                                 });
  }
  }, [fetch, dataListUuid]);

  const setSelectedValueName = (value, index, currentFieldData = []) => {
        let currentField = currentFieldData;
        if (jsUtils.isEmpty(currentField) || !currentField) {
          currentField = (value) && dataListFieldsRes.find((data_list_field) => data_list_field.field_uuid === value);
        }
        currentField && setSelectedDlFieldName((selectedData) => {
          selectedData[index] = jsUtils.get(currentField, ['label'], null);
          return selectedData;
        });
  };

  const onDataListFieldSelected = (event, index) => {
    const value = jsUtils.get(event, ['target', 'value'], null);
    switch (fieldType) {
      case FIELD_TYPE.DATA_LIST:
        const newDataListFields = dataListFields ? [...dataListFields] : [null];
        setSelectedValueName(value, index);
        if (value !== jsUtils.get(dataListFields, [index])) {
          jsUtils.set(newDataListFields, [index], value);
          onDataListChangeHandler({
            target: {
              value: {
                [DATA_LIST_PICKER_KEYS.ID]: dataListId,
                [DATA_LIST_PICKER_KEYS.UUID]: dataListUuid,
                [DATA_LIST_PICKER_KEYS.DISPLAY_FIELDS]: newDataListFields,
              },
              index: index,
            },
          });
        }
      break;
      case FIELD_TYPE.DATA_LIST_PROPERTY_PICKER:
      case FIELD_TYPE.USER_PROPERTY_PICKER:
       if (value && value !== dataListPropertyField) {
        const currentField = dataListFieldsRes.find((data_list_field) => data_list_field.field_uuid === value);
        setSelectedValueName(value, index, currentField);
        onDataListChangeHandler({
          target: {
            value: {
              [PROPERTY_PICKER_KEYS.SOURCE]: PROPERTY_PICKER_KEYS.SOURCE_TYPE.FORM,
              [PROPERTY_PICKER_KEYS.SOURCE_FIELD_UUID]: dataListPickerField,
              [PROPERTY_PICKER_KEYS.REFERENCE_FIELD_UUID]: currentField.field_uuid,
              [PROPERTY_PICKER_KEYS.REFERENCE_FIELD_TYPE]: currentField.field_type,
              [PROPERTY_PICKER_KEYS.DATA_LIST_ID]: dataListId,
              [PROPERTY_PICKER_KEYS.DATA_LIST_UUID]: dataListUuid,
            },
            index: index,
          },
        });
        onLabelChangeHandler && onLabelChangeHandler(currentField.field_name);
      }
       break;
      default:
        break;
    }
  };

  const onRemoveField = (index) => {
    if (!jsUtils.isEmpty(dataListFields)) {
      const newDataListFields = [...dataListFields];
     newDataListFields.splice(index, 1);
     setSelectedDlFieldName((prev) => prev.splice(index, 1));
      onDataListChangeHandler({
        target: {
          value: {
            [DATA_LIST_PICKER_KEYS.ID]: dataListId,
            [DATA_LIST_PICKER_KEYS.UUID]: dataListUuid,
            [DATA_LIST_PICKER_KEYS.DISPLAY_FIELDS]: newDataListFields,
          },
          index: index,
        },
      });
    }
  };

  const onSearchFields = (searchText) => {
    !disabled && fetch(loadData(false, true, searchText));
  };

  let dropdownOptionList = [];
  let updatedDropdownOptionList = [];
  if (!jsUtils.isEmpty(dataListFieldsRes)) {
    dropdownOptionList = dataListFieldsRes.map((fields) => {
      return { label: fields.label, value: fields.field_uuid };
    });
    updatedDropdownOptionList = jsUtils.cloneDeep(dropdownOptionList);
  }

  switch (fieldType) {
    case FIELD_TYPE.DATA_LIST:
              if (!jsUtils.isEmpty(dataListFields)) {
                for (let i = 0; i < dataListFields.length; i++) {
                  updatedDropdownOptionList = removeFieldByAttribute(updatedDropdownOptionList, 'value', dataListFields[i]);
              }
                }

              let addMore = (
                  <Col sm={6} xl={6}>
                    <div className={gClasses.MT10}>
                      <div
                        className={cx(gClasses.CursorPointer, gClasses.FTwo13, BS.MT_AUTO, BS.MB_AUTO)}
                        onClick={() => onDataListFieldSelected({ target: { value: null } }, 1)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          keydownOrKeypessEnterHandle(e) &&
                          onDataListFieldSelected({ target: { value: null } }, 1)}
                        style={{ color: buttonColor }}
                      >
                        {t('form_field_strings.field_config.add_more_field')}
                      </div>
                    </div>
                  </Col>
               );

              if (dataListFields) {
                if ((dataListFields.length === dropdownListLength || dropdownListLength === null)) {
                  addMore = null;
                }
              }
              const colWidth = 6;
              if (jsUtils.isEmpty(dataListFields)) {
                return (
                  <Row>
                    {getDataListFieldsDropdown(
                              null,
                              0,
                              dropdownOptionList,
                              updatedDropdownOptionList,
                              onDataListFieldSelected,
                              onLoadMoreDataListFields,
                              dataListFieldHasMore,
                              errorList,
                              { fieldIndex, sectionIndex, fieldListIndex },
                              null,
                              colWidth,
                              fieldType,
                              disabled,
                              null,
                              isLoading,
                              selectedDlFieldName[0],
                              onSearchFields,
                              datalist_selector_error_list,
                              t(BASIC_CONFIG_STRINGS.PLACEHOLDER.SEARCH_A_FIELD),
                              t,
                           )}
                    {addMore}
                  </Row>
                );
              }
              return (
                <Row>
                  {dataListFields.map((dataListField, index) => getDataListFieldsDropdown(dataListField, index, dropdownOptionList, updatedDropdownOptionList, onDataListFieldSelected, onLoadMoreDataListFields, dataListFieldHasMore, errorList, { fieldIndex, sectionIndex, fieldListIndex }, onRemoveField, colWidth, fieldType, disabled, null, isLoading, selectedDlFieldName[index], onSearchFields, datalist_selector_error_list, t(BASIC_CONFIG_STRINGS.PLACEHOLDER.SEARCH_A_FIELD), t))}
                  {
                    dataListFields.length < 2 ? addMore : null
                  }
                </Row>
              );
    case FIELD_TYPE.DATA_LIST_PROPERTY_PICKER:
    case FIELD_TYPE.USER_PROPERTY_PICKER:
            return getDataListFieldsDropdown(dataListPropertyField, 0, dropdownOptionList, updatedDropdownOptionList, onDataListFieldSelected, onLoadMoreDataListFields, dataListFieldHasMore, errorList, { fieldIndex, sectionIndex, fieldListIndex }, null, 12, fieldType, disabled, BS.PADDING_0, isLoading, selectedDlFieldName[0], onSearchFields, datalist_selector_error_list, t(BASIC_CONFIG_STRINGS.PLACEHOLDER.SEARCH_A_FIELD), t);
    default:
      return null;
  }
}
export default DataListFields;

DataListFields.defaultProps = {
  dataListId: null,
  dataListUuid: null,
  onDataListChangeHandler: null,
  sectionIndex: null,
  fieldListIndex: null,
  fieldIndex: null,
  fieldType: null,
  dataListPropertyField: null,
  dataListPickerField: null,
  disabled: false,
  onLabelChangeHandler: null,
  isNewField: false,
};

DataListFields.propTypes = {
  dataListId: PropTypes.string,
  dataListUuid: PropTypes.string,
  onDataListChangeHandler: PropTypes.func,
  sectionIndex: PropTypes.number,
  fieldListIndex: PropTypes.number,
  fieldIndex: PropTypes.number,
  fieldType: PropTypes.oneOf(getFieldTypeForPropTypes()),
  dataListPropertyField: PropTypes.string,
  dataListPickerField: PropTypes.string,
  disabled: PropTypes.bool,
  onLabelChangeHandler: PropTypes.func,
  isNewField: PropTypes.bool,
};
