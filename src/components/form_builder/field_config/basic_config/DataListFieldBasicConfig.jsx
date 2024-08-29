import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { Col, Row } from 'reactstrap';

import { get, isEmpty, has } from 'utils/jsUtility';
import { getDataListDetailsByUuid, getAllViewDataList } from 'axios/apiService/dataList.apiService';
import useApiCall from 'hooks/useApiCall';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import usePaginationApi from 'hooks/usePaginationApi';
import Input from 'components/form_components/input/Input';
import Label from 'components/form_components/label/Label';

import { FIELD_TYPE, FIELD_LIST_TYPE, FIELD_KEYS, PROPERTY_PICKER_KEYS, MAX_PAGINATION_SIZE, PROPERTY_PICKER_ARRAY, INITIAL_PAGE } from 'utils/constants/form.constant';
import { DATA_LIST_PROPERTY_PICKER_NOTE, DATA_LIST_FIELD_CONFIG, USER_LIST_CONFIG, USER_LIST_PROPERTY_PICKER_NOTE } from 'utils/constants/dataListPicker.constant';
import Skeleton from 'react-loading-skeleton';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../scss/Typography.module.scss';
import DataListFields from './DataListField/DataListField';
import styles from './DataListFieldBasicConfig.module.scss';
import { POPPER_PLACEMENTS } from '../../../auto_positioning_popper/AutoPositioningPopper';
import { EXISTING_DATA_LIST_DELETED_ERROR_INSTRUCTION } from './FieldValue.strings';
import { BASIC_CONFIG_STRINGS } from './DefaultValueRule.strings';

// const cancelDataListToken = {
//   cancelToken: null,
// };
// const setDataListCancelToken = (c) => { cancelDataListToken.cancelToken = c; };
let cancelTokenForPropertyPicker;
let cancelTokenForPickerName;

const setCancelTokenForPropertyPicker = (c) => {
  cancelTokenForPropertyPicker = c;
};

const setCancelTokenForPickerName = (c) => {
  cancelTokenForPickerName = c;
};

function DataListFieldBasicConfig(props) {
  const {
    selectedDataList: { data_list_id, data_list_uuid, display_fields },
    selectedDataListProperty: {
           source_field_uuid: data_list_picker_field,
           reference_field_uuid: data_list_property_field,
           data_list_id: picker_data_list_id,
           data_list_uuid: picker_data_list_uuid,
          },
    onDataListChangeHandler,
    errorList,
    datalist_selector_error_list,
    sectionIndex,
    fieldIndex,
    fieldListIndex,
    dataListUuid,
    fieldType,
    getDataListPropertyApi,
    fieldNameError,
    onLabelChangeHandler,
    fieldLabel,
    tableUuid,
    isTable,
    disableAll,
    disableDataListPicker,
    isNewField,
    isUserPropertyPicker,
    userDatalistUuid,
    onSetDataListSelectorErrorList,
  } = props;
  const { t } = useTranslation();
  let selectedDL = null;

 // below line help to get the data list and fetch function for data list.
  const { data: dataLists, paginationDetails, fetch } = useApiCall({}, true);

  // To store the data list id, other field depend on this field to query data list fields.
  const consolidatedDataListId = (PROPERTY_PICKER_ARRAY.includes(fieldType) ? picker_data_list_id : data_list_id);

  // To store data list uuid, only applicable for data list property picker and data list selector.
  const consolidatedDataListUUID = (PROPERTY_PICKER_ARRAY.includes(fieldType) ? picker_data_list_uuid : data_list_uuid);

  const extraParam = isTable ? { table_uuid: tableUuid } : {};

  // Helps to set loader if no data loads.
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState(fieldLabel);
  const [dataListOrPickerName, setDataListOrPickerName] = useState(EMPTY_STRING);
  const [isExistingDataListDeleted, setIsExistingDataListDeleted] = useState(false);
  let dataListFound;
  let dataListOptionList = [];
  let error = null;

  // Below function is the base query function for data list selector and datalits,user property picker.
  const getQueryApiBasedOnFieldType = (param) => {
    if (fieldType === FIELD_TYPE.DATA_LIST) {
       return getAllViewDataList({
         ...param,
         include_system_data_list: 1,
        // ...(dataListSearchText ? { search: dataListSearchText } : {}),
       });
    } else {
       return getDataListPropertyApi({
         ...param,
         field_list_type: (isTable) ? FIELD_LIST_TYPE.TABLE : FIELD_LIST_TYPE.DIRECT,
         allowed_field_types: (fieldType === FIELD_TYPE.USER_PROPERTY_PICKER) ? [FIELD_TYPE.USER_TEAM_PICKER] : [FIELD_TYPE.DATA_LIST],
         is_property_picker: 1,
       }, setCancelTokenForPropertyPicker, cancelTokenForPropertyPicker);
    }
 };

 // Change Handlers
  const onFieldLabelChangeHandler = (value) => {
    onLabelChangeHandler({ target: { value: value } });
    setInputValue(value);
  };

  const onDataListSelectionChange = (event) => {
    const { value = null } = event.target;
    if (value) {
      switch (fieldType) {
        case FIELD_TYPE.DATA_LIST:
          if (value !== data_list_uuid) {
            const dataListData = dataLists.find((dataList) => dataList.data_list_uuid === value);
            if (dataListData) {
              const { _id, data_list_uuid, data_list_name } = dataListData;
              setDataListOrPickerName(data_list_name);
              onDataListChangeHandler({ target: { value: { data_list_id: _id, data_list_uuid }, clearFilter: true } });
            }
          }
          break;
        case FIELD_TYPE.DATA_LIST_PROPERTY_PICKER:
          if (value !== data_list_picker_field) {
            const dataListPicker = dataLists.find((dataListPicker) => dataListPicker.field_uuid === value);
            if (dataListPicker) {
              setDataListOrPickerName(dataListPicker.label);
              onDataListChangeHandler({
                  target: {
                    value: {
                      [PROPERTY_PICKER_KEYS.SOURCE]: PROPERTY_PICKER_KEYS.SOURCE_TYPE.FORM,
                      [PROPERTY_PICKER_KEYS.SOURCE_FIELD_UUID]: value,
                      [PROPERTY_PICKER_KEYS.DATA_LIST_ID]: dataListPicker.data_list.data_list_id,
                      [PROPERTY_PICKER_KEYS.DATA_LIST_UUID]: dataListPicker.data_list.data_list_uuid,
                    },
                  },
                });
            }
          }
          break;
        case FIELD_TYPE.USER_PROPERTY_PICKER:
          if (value && userDatalistUuid) {
            const userPicker = dataLists.find((eachUserPicker) => eachUserPicker.field_uuid === value);
            setDataListOrPickerName(userPicker.label);
           // const dataListPicker = dataLists.find((dataListPicker) => dataListPicker.field_uuid === userDatalistUuid);
            getDataListDetailsByUuid({ data_list_uuid: userDatalistUuid, process_response: 0 })
            .then((dataListId) => {
              onDataListChangeHandler({
                target: {
                  value: {
                    [PROPERTY_PICKER_KEYS.SOURCE]: PROPERTY_PICKER_KEYS.SOURCE_TYPE.FORM,
                    [PROPERTY_PICKER_KEYS.SOURCE_FIELD_UUID]: value,
                    [PROPERTY_PICKER_KEYS.DATA_LIST_ID]: dataListId._id,
                    [PROPERTY_PICKER_KEYS.DATA_LIST_UUID]: userDatalistUuid,
                  },
                },
              });
            });
          }
        break;
        default:
          break;
      }
   }
  };

  const onDataListSearchInputChangeHandler = (value) => {
    const param = {};
    if (value) param.search = value;
    !(disableAll || disableDataListPicker) && fetch(
          getQueryApiBasedOnFieldType({
            page: INITIAL_PAGE,
            size: MAX_PAGINATION_SIZE,
            ...extraParam,
            ...param,
          }),
          () => setIsLoading(false),
        );
   // if (value !== dataListSearchText) setDataListSearchText(value);
  };

// To store and load more data
  useEffect(() => {
    if (disableDataListPicker || disableAll) {
      setIsLoading(false);
    } else {
      fetch(
      getQueryApiBasedOnFieldType({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE, ...extraParam }),
      () => setIsLoading(false),
  );
  }
  }, [fetch]);

  useEffect(() => {
    if (!dataListOrPickerName && (data_list_uuid || data_list_picker_field)) {
        if (fieldType === FIELD_TYPE.DATA_LIST && data_list_uuid) {
            getDataListDetailsByUuid({ data_list_uuid: data_list_uuid, is_deleted: 1 })
                                .then((data_list_details) => {
                                  setDataListOrPickerName(data_list_details.data_list_name);
                                  setIsExistingDataListDeleted(!!data_list_details?.is_deleted);
                                });
        } else if (PROPERTY_PICKER_ARRAY.includes(fieldType) && data_list_picker_field) {
          (data_list_picker_field) && getDataListPropertyApi(
                                      { field_uuid: [data_list_picker_field] },
                                      setCancelTokenForPickerName,
                                      cancelTokenForPickerName,
                                      )
                                      .then((response) => {
                                          const field_data = get(response, ['pagination_data', 0], {});
                                          setDataListOrPickerName(field_data.label);
                                         });
        }
    }
  }, [data_list_uuid, data_list_picker_field]);

  const {
    hasMore: dataListHasMore,
    onLoadMoreData: onLoadMoreDataLists,
  } = usePaginationApi(
        (page) => fetch(getQueryApiBasedOnFieldType({ page, size: MAX_PAGINATION_SIZE, ...extraParam })),
        { paginationDetails, currentData: dataLists },
      );

  // this function helps to get the data list field(vertically second field from the top) component.
  const getDataListFieldComponent = (isDisable = false, isUserPropertyPicker = false) => {
        if (isExistingDataListDeleted) {
          return (
            <div className={styles.ErrorContainer}>
              {EXISTING_DATA_LIST_DELETED_ERROR_INSTRUCTION(t)}
            </div>
          );
        }
        return (
          <>
            <Label
              id={!isUserPropertyPicker ? `label_data_list_fields_${fieldListIndex}` : null}
              labelFor={!isUserPropertyPicker ? `data_list_fields_${fieldListIndex}` : null}
              content={isUserPropertyPicker ? t('form_field_strings.field_config.user_selector_field') : t('form_field_strings.field_config.datalist_field')}
              toolTipId={`tooltip-${consolidatedDataListId}`}
              message={`${t('form_field_strings.field_config.datalist_label_tooltip')}`}
              isRequired={PROPERTY_PICKER_ARRAY.includes(fieldType)}
              StrictToolTipId
              hideLabelClass
            />
            <DataListFields
              fieldIndex={fieldIndex}
              sectionIndex={sectionIndex}
              fieldListIndex={fieldListIndex}
              errorList={errorList}
              datalist_selector_error_list={datalist_selector_error_list}
              dataListId={consolidatedDataListId}
              dataListUuid={consolidatedDataListUUID}
              dataListFields={display_fields}
              dataListPropertyField={data_list_property_field}
              dataListPickerField={data_list_picker_field}
              onDataListChangeHandler={onDataListChangeHandler}
              fieldType={fieldType}
              disabled={isDisable || disableAll}
              onLabelChangeHandler={onFieldLabelChangeHandler}
              isRequired={PROPERTY_PICKER_ARRAY.includes(fieldType)}
              isNewField={isNewField}
              selectedDL={selectedDL}
              onSetDataListSelectorErrorList={onSetDataListSelectorErrorList}
            />
          </>
      );
    };

 // Below code helps to set properties for individual field specific.
  let dataListField = null;
  let selectedValue = null;
  let fieldConfig = null;
  let alertInformation = null;
  switch (fieldType) {
    case FIELD_TYPE.DATA_LIST:
      dataListField = data_list_uuid && getDataListFieldComponent();
      // console.log('onSetDataListSelectorErrorList0', dataListField);
      fieldConfig = DATA_LIST_FIELD_CONFIG(t).PICKER;
      selectedValue = data_list_uuid;
      if (!isEmpty(dataLists)) {
        dataListOptionList = dataLists.flatMap((dataList) => {
          if (data_list_uuid === dataList.data_list_uuid) dataListFound = true;
          if (dataListUuid && dataListUuid !== dataList.data_list_uuid) {
            return [{ label: dataList.data_list_name, value: dataList.data_list_uuid }];
          } else if (!dataListUuid) {
            return [{ label: dataList.data_list_name, value: dataList.data_list_uuid }];
          }
          return [];
        });
      }
      error = get(errorList, [`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${fieldConfig.ID}`]);
      break;
    case FIELD_TYPE.DATA_LIST_PROPERTY_PICKER:
      const FIELD_LABEL = {
        ID: 'datalist_property_picker_label',
        LABEL: t('form_field_strings.field_config.field_label'),
        PLACEHOLDER: t('form_field_strings.field_config.field_placeholder'),
      };
      fieldConfig = DATA_LIST_FIELD_CONFIG(t).PROPERTY_PICKER;
      error = get(errorList, [`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.PROPERTY_PICKER_DETAILS},${fieldConfig.ID}`]);
      dataListField = (
                  <Row>
                    <Col sm={6} xl={6}>{getDataListFieldComponent(!data_list_picker_field)}</Col>
                    <Col sm={6} xl={6}>
                      <Input
                        id={FIELD_LABEL.ID}
                        label={FIELD_LABEL.LABEL}
                        placeholder={FIELD_LABEL.PLACEHOLDER}
                        errorMessage={data_list_picker_field && fieldNameError}
                        readOnly={!data_list_picker_field}
                        onChangeHandler={(event) => onFieldLabelChangeHandler(get(event, ['target', 'value'], null))}
                        value={inputValue}
                        isRequired={fieldType === FIELD_TYPE.DATA_LIST_PROPERTY_PICKER}
                      />
                    </Col>
                  </Row>
            );
      selectedValue = data_list_picker_field;
      if (!isEmpty(dataLists)) {
        dataListOptionList = dataLists.flatMap((dataList) => {
           if (dataList.field_uuid === data_list_picker_field) dataListFound = true;
           if (has(dataList, ['field_name'], false) && has(dataList, ['field_uuid'], false)) {
             return [{ label: dataList.field_name, value: dataList.field_uuid }];
           }
           return [];
        });
      }
      const isDlOptionListEmpty = isEmpty(dataListOptionList) && !data_list_picker_field;
      alertInformation = (isLoading ? (<Skeleton height={30} className={gClasses.MB15} />) : (
              <ul
                role="alert"
                className={cx(styles.Note, gClasses.MB15)}
              >
                <li className={!isDlOptionListEmpty && gClasses.CenterVImportant}>
                  <span className={gClasses.FTwo10}>
                    {DATA_LIST_PROPERTY_PICKER_NOTE(t).READ_ONLY}
                  </span>
                </li>
                {isDlOptionListEmpty && (
                  <li>
                    <span className={gClasses.FTwo10}>
                      {(isTable) ?
                          (DATA_LIST_PROPERTY_PICKER_NOTE(t).NO_DATA_LIST_PICKER_TABLE_FEILD) :
                          (DATA_LIST_PROPERTY_PICKER_NOTE(t).NO_DATA_LIST_PICKER_FORM_FEILD)}
                    </span>
                  </li>
                )}
              </ul>
         ));

      break;
    case FIELD_TYPE.USER_PROPERTY_PICKER:
      const FIELD_LABELS = {
        ID: 'user_property_picker_label',
        LABEL: t('validation_constants.user_list_config.picker.label'),
        PLACEHOLDER: t('validation_constants.user_list_config.picker.placeholder'),
      };
      fieldConfig = USER_LIST_CONFIG(t).PICKER;
      error = get(errorList, [`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.PROPERTY_PICKER_DETAILS},${fieldConfig.ID}`]);
      dataListField = (
                  <Row>
                    <Col sm={6} xl={6}>{getDataListFieldComponent(!data_list_picker_field, isUserPropertyPicker)}</Col>
                    <Col sm={6} xl={6}>
                      <Input
                        id={FIELD_LABELS.ID}
                        label={FIELD_LABELS.LABEL}
                        placeholder={FIELD_LABELS.PLACEHOLDER}
                        errorMessage={data_list_picker_field && fieldNameError}
                        readOnly={!data_list_picker_field}
                        onChangeHandler={(event) => onFieldLabelChangeHandler(get(event, ['target', 'value'], null))}
                        value={inputValue}
                        isRequired={fieldType === FIELD_TYPE.DATA_LIST_PROPERTY_PICKER || fieldType === FIELD_TYPE.USER_PROPERTY_PICKER}
                      />
                    </Col>
                  </Row>
            );
      selectedValue = data_list_picker_field;
      if (!isEmpty(dataLists)) {
        dataListOptionList = dataLists.flatMap((dataList) => {
           if (dataList.field_uuid === data_list_picker_field) dataListFound = true;
           if (has(dataList, ['field_name'], false) && has(dataList, ['field_uuid'], false)) {
             return [{ label: dataList.field_name, value: dataList.field_uuid }];
           }
           return [];
        });
      }
      const isDlOptionListsEmpty = isEmpty(dataListOptionList) && !data_list_picker_field;
      alertInformation = (isLoading ? (<Skeleton height={30} className={gClasses.MB15} />) : (
              <ul
                role="alert"
                className={cx(styles.Note, gClasses.MB15)}
              >
                <li className={!isDlOptionListsEmpty && gClasses.CenterVImportant}>
                  <span className={gClasses.FTwo10}>
                  {USER_LIST_PROPERTY_PICKER_NOTE(t).READ_ONLY}
                  </span>
                </li>
                {isDlOptionListsEmpty && (
                  <li>
                    <span className={gClasses.FTwo10}>
                      {(isTable) ?
                          (USER_LIST_PROPERTY_PICKER_NOTE(t).NO_DATA_LIST_PICKER_TABLE_FEILD) :
                          (USER_LIST_PROPERTY_PICKER_NOTE(t).NO_DATA_LIST_PICKER_FORM_FEILD)}
                    </span>
                  </li>
                )}
              </ul>
         ));

      break;
    default:
      break;
  }
 selectedDL = dataListFound ? selectedValue : dataListOrPickerName;
 const data_list_or_picker_uuid = (fieldType === FIELD_TYPE.DATA_LIST) ? data_list_uuid : picker_data_list_uuid;
  // The final rendering.

  return (
    <>
     {alertInformation}
      <Row>
        <Col sm={6} xl={6}>
          <Dropdown
            id={fieldConfig.ID}
            optionList={dataListOptionList}
            label={fieldConfig.LABEL}
            hasMore={dataListHasMore}
            selectedValue={selectedDL}
            strictlySetSelectedValue
            errorMessage={error}
            isPaginated
            loadDataHandler={onLoadMoreDataLists}
            onChange={onDataListSelectionChange}
            popperClasses={styles.DataListPicker}
            hideDropdownListLabel
            placement={POPPER_PLACEMENTS.BOTTOM_START}
            disabled={disableAll || disableDataListPicker}
            isRequired={PROPERTY_PICKER_ARRAY.includes(fieldType)}
            showNoDataFoundOption
            isDataLoading={data_list_or_picker_uuid && (isLoading || !selectedDL)}
            isDatalistSelect
            enableSearch
            onSearchInputChange={onDataListSearchInputChangeHandler}
            disableFocusFilter
            placeholder={dataListOrPickerName || (FIELD_TYPE.USER_PROPERTY_PICKER === fieldType ? fieldConfig.PLACEHOLDER : t(BASIC_CONFIG_STRINGS.PLACEHOLDER.DATA_LIST))}
            searchInputPlaceholder={(FIELD_TYPE.USER_PROPERTY_PICKER === fieldType ? fieldConfig.PLACEHOLDER : t(BASIC_CONFIG_STRINGS.PLACEHOLDER.DATA_LIST))}
            // fixedPopperStrategy = {true}
          />
        </Col>
      </Row>
      { dataListField }
    </>
  );
}

export default DataListFieldBasicConfig;

DataListFieldBasicConfig.defaultProps = {
  fieldType: FIELD_TYPE.DATA_LIST,
  selectedDataList: {},
  selectedDataListProperty: {},
  fieldNameError: null,
  tableUuid: null,
  disableAll: false,
  disableDataListPicker: false,
  isTable: false,
  isUserPropertyPicker: false,
};

DataListFieldBasicConfig.propTypes = {
  fieldType: PropTypes.oneOf([FIELD_TYPE.DATA_LIST, FIELD_TYPE.DATA_LIST_PROPERTY_PICKER]),
  selectedDataList: PropTypes.shape({
    data_list_id: PropTypes.string,
    data_list_uuid: PropTypes.string,
    display_fields: PropTypes.arrayOf(PropTypes.string),
  }),
  selectedDataListProperty: PropTypes.shape({
    [PROPERTY_PICKER_KEYS.SOURCE]: PropTypes.oneOf(Object.values(PROPERTY_PICKER_KEYS.SOURCE_TYPE)),
    [PROPERTY_PICKER_KEYS.SOURCE_FIELD_UUID]: PropTypes.string,
    [PROPERTY_PICKER_KEYS.REFERENCE_FIELD_UUID]: PropTypes.string,
    [PROPERTY_PICKER_KEYS.REFERENCE_FIELD_TYPE]: PropTypes.oneOf(Object.values(FIELD_TYPE)),
  }),
  fieldNameError: PropTypes.string,
  tableUuid: PropTypes.string,
  disableAll: PropTypes.bool,
  disableDataListPicker: PropTypes.bool,
  isTable: PropTypes.bool,
  isUserPropertyPicker: PropTypes.bool,
};
