import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';

import gClasses from 'scss/Typography.module.scss';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { FIELD_CONFIG } from 'components/form_builder/FormBuilder.strings';
import { datalistFieldsClear, datalistFieldValuesClear } from 'redux/actions/Visibility.Action';
import { FIELD_LIST_TYPE } from 'utils/constants/form.constant';
import { useTranslation } from 'react-i18next';
import { Label, MultiDropdown, SingleDropdown, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import { Col, Row } from 'reactstrap';
import style from './Filter.module.scss';
import { DL_PICKER_FILTER_STRING, getErrorMessage } from './Filter.utils';
import { getAllDataListFields } from '../../../../../../../../axios/apiService/form.apiService';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../../../../utils/constants/form/form.constant';
import { FIELD_TYPES } from '../../../../FieldConfiguration.strings';
import { INITIAL_PAGE, MAX_PAGINATION_SIZE } from '../../../../../../../../utils/constants/form.constant';
import { cloneDeep, isEmpty, isNaN } from '../../../../../../../../utils/jsUtility';
import { VALIDATION_CONFIG_STRINGS } from '../../ValidationConfiguration.strings';
import { getExternalFields } from '../../../../../../../../axios/apiService/formulaBuilder.apiService';
import CurrencyField from '../../../../../../../../components/form_components/currency_field/CurrencyField';
import { ARIA_ROLES } from '../../../../../../../../utils/UIConstants';
import DeleteIcon from '../../../../../../../../assets/icons/apps/DeleteIcon';
import { getModuleIdByModuleType } from '../../../../../../Form.utils';
import DateTimeWrapper from '../../../../../../../../components/date_time_wrapper/DateTimeWrapper';
import HelperMessage, { HELPER_MESSAGE_TYPE } from '../../../../../../../../components/form_components/helper_message/HelperMessage';
import PlusIcon from '../../../../../../../../assets/icons/PlusIcon';
import { keydownOrKeypessEnterHandle } from '../../../../../../../../utils/UtilityFunctions';
import { getChoiceValuePairs } from '../DataListValidationConfiguration.utils.';
import { DEFAULT_VALUE_FIELD_CONFIG_STRINGS } from '../../../../field_value_configuration/FieldValueConfiguration.strings';

function SelectorFilterValidationConfiguration(props) {
  const {
    fieldDetails,
    setFieldDetails,
    parentParams,
    filter = {},
    filterIndex = 0,
    datalistId,
    fieldUuid,
    totalFilters = 2,
    metaData = {},
    moduleType,
    addCondition = null,
    onDeleteDataListFilter = null,
  } = props;
  const { errorList = {} } = fieldDetails;
  const { t } = useTranslation();

  const [selectedDatalistFields, setSelectedDatalistFields] = useState([]);
  const [datalistFieldsPaginationDetails, setDatalistFieldsPaginationDetails] = useState([]);
  const [datalistFieldsSearchText, setDatalistFieldsSearchText] = useState(EMPTY_STRING);

  const [externalFieldsList, setExternalFieldsList] = useState([]);
  const [externalFieldsPaginationDetails, setExternalFieldsPaginationDetails] = useState([]);
  const [extenalFieldsSearchText, setExtenalFieldsSearchText] = useState(EMPTY_STRING);

  const { VALIDATION_CONFIG } = FIELD_CONFIG(t);
  const fieldError = EMPTY_STRING;
  const duplicateError = EMPTY_STRING;

  const cancelDataListToken = {
    cancelToken: null,
  };

  const setDataListFieldsCancelToken = (c) => { cancelDataListToken.cancelToken = c; };

  const fetchDatalistFields = (params) => {
    const apiParams = {
      ...params,
      data_list_id: datalistId || fieldDetails?.dataList?._id,
      field_list_type: FIELD_LIST_TYPE.DIRECT,
      allowed_field_types:
      [...VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD.ALLOWED_FIELD_TYPES.inputFields,
      ...VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD.ALLOWED_FIELD_TYPES.selectionFields],
    };
    getAllDataListFields(apiParams, setDataListFieldsCancelToken).then((res) => {
        console.log('getALlDatalistssss fields2', res);
        const { datalistFieldsPaginationDetails = {}, datalistFields = [] } = res;
        if (params?.page > 1) {
            setSelectedDatalistFields([...selectedDatalistFields, ...datalistFields || []]);
            setDatalistFieldsPaginationDetails(datalistFieldsPaginationDetails);
        } else {
            setSelectedDatalistFields([...datalistFields || []]);
            setDatalistFieldsPaginationDetails(datalistFieldsPaginationDetails);
        }
        console.log('getALlDatalistssss fields', res);
      }).catch((res) => {
        console.log('getALlDatalistssss fields err', res);
      });
  };

  const fetchCurrentFIelds = (params) => {
    const apiParams = {
      ...params,
      ...parentParams,
      include_property_picker: 1,
      ...getModuleIdByModuleType(metaData, moduleType, false),
    };
    getExternalFields(apiParams).then((res) => {
      console.log('getALlDatalistssss fields2', res);
      const { externalFieldsPaginationDetails = {}, externalFields = [] } = res;
      if (params?.page > 1) {
          setExternalFieldsList([...externalFieldsList, ...externalFields || []]);
          setExternalFieldsPaginationDetails(externalFieldsPaginationDetails);
      } else {
          setExternalFieldsList([...externalFields || []]);
          setExternalFieldsPaginationDetails(externalFieldsPaginationDetails);
      }
      console.log('getALlDatalistssss fields', res);
    }).catch((res) => {
      console.log('getALlDatalistssss fields err', res);
    });
  };

  const loadMoreDatalistFields = () => {
    fetchDatalistFields({
        page: datalistFieldsPaginationDetails.page + 1,
        size: MAX_PAGINATION_SIZE,
        ...(!isEmpty(datalistFieldsSearchText)) ? { search: datalistFieldsSearchText } : null,
    });
  };

  const searchDatalistFields = (event) => {
    const searchText = event?.target?.value || EMPTY_STRING;
    setDatalistFieldsSearchText(searchText);
    fetchDatalistFields({
        page: INITIAL_PAGE,
        size: MAX_PAGINATION_SIZE,
        ...(!isEmpty(searchText)) ? { search: searchText } : null,
    });
  };

  const loadMoreExternalFields = () => {
    fetchCurrentFIelds({
        page: externalFieldsPaginationDetails.page + 1,
        size: MAX_PAGINATION_SIZE,
        ...(!isEmpty(extenalFieldsSearchText)) ? { search: extenalFieldsSearchText } : null,
    });
  };

  const searchExternalFields = (event) => {
    const searchText = event?.target?.value || EMPTY_STRING;
    setExtenalFieldsSearchText(searchText);
    fetchCurrentFIelds({
        page: INITIAL_PAGE,
        size: MAX_PAGINATION_SIZE,
        ...(!isEmpty(searchText)) ? { search: searchText } : null,
    });
  };

  useEffect(() => {
    fetchDatalistFields({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE });
    fetchCurrentFIelds({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE });
    // return () => {
    //   datalistFieldValuesClear();
    //   datalistFieldsClear();
    // };
  }, [fieldUuid]);

  useEffect(() => () => {
    datalistFieldValuesClear();
    datalistFieldsClear();
  });

  const onSelectFilterField = (value, label) => {
    const clonedFilters = cloneDeep(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS]);
      const particularFilterDetails = cloneDeep(clonedFilters[filterIndex]);
      if (particularFilterDetails?.[RESPONSE_FIELD_KEYS.FIELD_UUID] !== value) {
        const selectedField = selectedDatalistFields?.find((field) => field.value === value);
        particularFilterDetails[RESPONSE_FIELD_KEYS.FIELD_UUID] = value;
        particularFilterDetails[RESPONSE_FIELD_KEYS.FIELD_NAME] = label;
        particularFilterDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] = selectedField?.[RESPONSE_FIELD_KEYS.FIELD_TYPE];
        particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.OPERATOR] = EMPTY_STRING;
        particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD_VALUE] = EMPTY_STRING;
        particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.VALUE_TYPE] = 'direct';
        particularFilterDetails[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE] = selectedField?.choiceValueType;
        particularFilterDetails[RESPONSE_FIELD_KEYS.CHOICE_VALUES] = getChoiceValuePairs(selectedField?.choiceValues);
        delete particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD];
        if (![FIELD_TYPES.CHECKBOX, FIELD_TYPES.DROPDOWN, FIELD_TYPES.RADIO_GROUP, FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN]
            .includes(selectedField?.[RESPONSE_FIELD_KEYS.FIELD_TYPE])) {
            delete particularFilterDetails?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE];
            delete particularFilterDetails?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES];
        }
        if (selectedField?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.YES_NO) {
          particularFilterDetails[RESPONSE_FIELD_KEYS.CHOICE_VALUES] = DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.YES_NO_OPTIONS;
        }
        clonedFilters[filterIndex] = particularFilterDetails;
        console.log('clonedFilters', clonedFilters, selectedField, selectedField?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]);
        setFieldDetails({
          ...fieldDetails,
          [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
            ...(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA] || {}),
            [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS]: clonedFilters,
          },
        });
      }
  };

  const getOperatorList = () => {
    console.log('getOperatorList filter', filter);
    if (filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.NUMBER ||
        filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.CURRENCY ||
        filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.DATE ||
        filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.DATETIME) {
        return VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.OPERATORS.OPTION_LIST;
    } else if (
        filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.YES_NO ||
        filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.CHECKBOX ||
        filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.DROPDOWN ||
        filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.RADIO_GROUP ||
        filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN
    ) return [VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.OPERATORS.OPTION_LIST[4]];
    else {
      return [];
    }
  };

  const specificFieldTypeOptionList = (optionList) => {
    const optionListData = [];
    optionList.forEach((field) => {
      if (field.fieldType === filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
        optionListData.push(field);
      }
    });

    return optionListData;
  };

  const getFieldNameFromOtherFieldDetail = (selectedFieldUUID) => {
    let selectedFieldName = '';
    ([...fieldDetails.otherFieldDetail || [], ...specificFieldTypeOptionList(externalFieldsList) || []])?.find((field) => {
      if ((field?.fieldUUID === selectedFieldUUID) || (field?.value === selectedFieldUUID)) { selectedFieldName = field?.fieldName; return true; }
      return false;
    });
    return selectedFieldName;
  };

  const onChangeOperatorData = (value) => {
    const clonedFilters = cloneDeep(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS]);
      const particularFilterDetails = cloneDeep(clonedFilters[filterIndex]);
      particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.OPERATOR] = value;
      clonedFilters[filterIndex] = particularFilterDetails;
      console.log('clonedDataListPickerFilters', clonedFilters, value);
      setFieldDetails({
        ...fieldDetails,
        [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
          ...(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA] || {}),
          [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS]: clonedFilters,
        },
      });
  };

  const staticOrDynamicChange = (value) => {
    const clonedFilters = cloneDeep(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS]);
    const particularFilterDetails = cloneDeep(clonedFilters[filterIndex]);
    if (value === VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.OPTION_LIST[1].value) {
      delete particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD_VALUE];
      particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD] = EMPTY_STRING;
      particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.VALUE_TYPE] = value;
    } else {
      delete particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD];
      delete particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD_VALUE];
      particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.VALUE_TYPE] = value;
    }
    clonedFilters[filterIndex] = particularFilterDetails;
    setFieldDetails({
      ...fieldDetails,
      [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
        ...(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA] || {}),
        [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS]: clonedFilters,
      },
    });
  };

  const onFilterValueChange = (value) => {
    const clonedFilters = cloneDeep(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS]);
    const particularFilterDetails = cloneDeep(clonedFilters[filterIndex]);
    const selectedField = selectedDatalistFields?.find((field) => field.value === particularFilterDetails?.[RESPONSE_FIELD_KEYS.FIELD_UUID]);

    if (particularFilterDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.CHECKBOX) {
      if (particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD_VALUE]) {
        let existingValues = particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD_VALUE];
        const index = existingValues?.findIndex((eachValue) => eachValue === value);
        if (index > -1) {
          existingValues = existingValues.slice(0, index).concat(existingValues.slice(index + 1));
          particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD_VALUE] = existingValues;
        } else {
        particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD_VALUE].push(value);
        }
      } else particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD_VALUE] = [value];
      particularFilterDetails[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE] = selectedField?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE];
    } else if (VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD.ALLOWED_FIELD_TYPES.selectionFields
      .includes(particularFilterDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE]) &&
      particularFilterDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] !== FIELD_TYPES.YES_NO) {
      particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD_VALUE] = [value];
      particularFilterDetails[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE] = selectedField?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE];
    } else if (particularFilterDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.NUMBER ||
      particularFilterDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.DATE ||
      particularFilterDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.DATETIME ||
      particularFilterDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.CURRENCY ||
      particularFilterDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.YES_NO) {
      particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD_VALUE] = value;
    }
    if (filter?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].VALUE_TYPE] ===
      VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.OPTION_LIST[1].value) {
      particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.VALUE_TYPE] =
        VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.OPTION_LIST[1].value;
      particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD] = value;
      delete particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FIELD_VALUE];
    } else {
      particularFilterDetails[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].VALUE_TYPE] = VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.OPTION_LIST[0].value;
    }

    if (selectedField?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.TABLE) {
      if (particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.OPERATOR] === 'equal_to') {
        particularFilterDetails[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.OPERATOR] = 'in';
      }
    }
    clonedFilters[filterIndex] = cloneDeep(particularFilterDetails);
    console.log('clonedDataListPickerFilters onFilterValueChange', value, selectedField, selectedDatalistFields, cloneDeep(particularFilterDetails));
    setFieldDetails({
      ...fieldDetails,
      [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
        ...(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA] || {}),
        [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS]: clonedFilters,
      },
    });
  };

  // const getDatalistSelectionFieldValues = (optionList) => {
  //   const values = optionList.find((field) => field.value === filter?.[RESPONSE_FIELD_KEYS.FIELD_UUID]);
  //   console.log('filterfilterfilterfilter',
  //   values,
  //   optionList,
  //   filter);
  //   return values?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES];
  // };

  const getSelectedLabels = (options, selectedValue) => {
    const selectedOption = options?.find((eachOption) => eachOption?.value === selectedValue);
    return selectedOption?.label;
  };

  const getCheckboxSelectedLabels = (options, selectedValues = []) => {
    const selectedLabels = [];
    selectedValues.forEach((eachValue) => {
      if (filter?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE] === FIELD_TYPES.DATE) {
        const selectedValue = selectedValues?.map((v) => options?.find((c) => c.value.startsWith(v))?.value);
        const selectedOption = options?.find((eachOption) => eachOption.value === selectedValue);
        if (selectedOption) selectedLabels.push(selectedOption?.label);
      } else {
        const selectedOption = options?.find((eachOption) => eachOption.value === eachValue);
        if (selectedOption) selectedLabels.push(selectedOption?.label);
      }
    });
    return selectedLabels?.join(', ');
  };

  const getValuesField = () => {
    if (filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.NUMBER) {
      return (
        <TextInput
          id={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.ID}
          onChange={(event) => {
            if (!isNaN(event?.target?.value)) {
             onFilterValueChange(Number(event?.target?.value) || EMPTY_STRING);
            }
          }}
          type={FIELD_TYPES.NUMBER}
          value={filter?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD_VALUE]}
          errorMessage={getErrorMessage(errorList, RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD_VALUE, filterIndex)}
          placeholder={DL_PICKER_FILTER_STRING.VALUE_PLACEHOLDER}
        />
      );
    } else if (filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.DATE ||
        filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.DATETIME) {
          return (
            <div className={gClasses.PositionRelative}>
              <DateTimeWrapper
                id={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.ID}
                enableTime={filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.DATETIME}
                getDate={(value) => onFilterValueChange(value)}
                date={filter?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD_VALUE]}
                errorMessage={getErrorMessage(errorList, RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD_VALUE, filterIndex)}
                hideLabel
              />
            </div>
          );
        } else if (filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.CURRENCY) {
          return (
            <CurrencyField
                id={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.ID}
                optionList={[]}
                onChange={onFilterValueChange}
                errorMessage={getErrorMessage(errorList, RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD_VALUE, filterIndex)}
                noDataFoundMessage
                value={filter?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD_VALUE]}
            />
          );
        }
        return null;
  };

  return (
    <div className={gClasses.MT16}>
      <div className={duplicateError ? style.ErrorFilter : style.RowConditions}>
        <SingleDropdown
          id={VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.FIELD.ID}
          optionList={selectedDatalistFields}
          dropdownViewProps={{
              onBlur: () => setDatalistFieldsSearchText(EMPTY_STRING),
              isRequired: true,
              labelName: VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.FIELD.LABEL,
              selectedLabel: filter?.[RESPONSE_FIELD_KEYS.FIELD_NAME] || getFieldNameFromOtherFieldDetail(filter?.[RESPONSE_FIELD_KEYS.FIELD_UUID]),
              onClick: searchDatalistFields,
              onKeyDown: searchDatalistFields,
          }}
          infiniteScrollProps={{
              dataLength: selectedDatalistFields?.length,
              next: loadMoreDatalistFields,
              hasMore: selectedDatalistFields?.length < datalistFieldsPaginationDetails?.totalCount,
              scrollableId: 'data_list_fields_infinite_scroll',
          }}
          searchProps={{
              // searchPlaceholder: t(SEARCH_DATALIST),
              searchValue: datalistFieldsSearchText,
              onChangeSearch: searchDatalistFields,
          }}
          onOutSideClick={() => searchDatalistFields()}
          selectedValue={filter?.[RESPONSE_FIELD_KEYS.FIELD_UUID]}
          onClick={(value, label) => onSelectFilterField(value, label)}
          errorMessage={getErrorMessage(errorList, RESPONSE_FIELD_KEYS.FIELD_UUID, filterIndex)}
        />
        <SingleDropdown
          optionList={getOperatorList()}
          dropdownViewProps={{
              isRequired: true,
              labelName: VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.OPERATORS.LABEL,
              labelClassName: gClasses.MT16,
          }}
          selectedValue={filter?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].OPERATOR]}
          onClick={(value) => onChangeOperatorData(value)}
          errorMessage={getErrorMessage(errorList, RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].OPERATOR, filterIndex)}
        />
         {filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] && (
          <div>
            <Label
              labelName={VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.LABEL}
              isRequired
              className={gClasses.MT16}
            />
            <div className={cx(gClasses.DisplayFlex)}>
              <SingleDropdown
                id={VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.ID}
                optionList={VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.OPTION_LIST}
                selectedValue={filter?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].VALUE_TYPE]}
                onClick={(value) => staticOrDynamicChange(value)}
                errorMessage={fieldError}
              />
              <div className={cx(style.ValueField)}>
                {filter?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].VALUE_TYPE] === DL_PICKER_FILTER_STRING.FIELD ? (
                  <SingleDropdown
                    id={VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.ID}
                    optionList={specificFieldTypeOptionList(externalFieldsList)}
                    infiniteScrollProps={{
                      dataLength: externalFieldsList?.length,
                      next: loadMoreExternalFields,
                      hasMore: externalFieldsList?.length < externalFieldsPaginationDetails?.totalCount,
                      scrollableId: 'data_list_fields_infinite_scroll',
                    }}
                    searchProps={{
                        searchValue: extenalFieldsSearchText,
                        onChangeSearch: searchExternalFields,
                    }}
                    selectedValue={filter?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD]}
                    onClick={(value) => onFilterValueChange(value)}
                    dropdownViewProps={{
                      selectedLabel: getFieldNameFromOtherFieldDetail(filter?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD]),
                  }}
                    errorMessage={getErrorMessage(errorList, RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD, filterIndex)}
                  />
                ) :
                filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.CHECKBOX ?
                (
                  <MultiDropdown
                    id={VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.ID}
                    dropdownViewProps={{
                      selectedLabel: getCheckboxSelectedLabels(
                        filter?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES],
                        cloneDeep(filter)?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD_VALUE] || [],
                      ),
                      placeholder: DL_PICKER_FILTER_STRING.VALUE_PLACEHOLDER,
                    }}
                    optionList={filter?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES]}
                    onClick={(value, label) => onFilterValueChange(value, label)}
                    errorMessage={getErrorMessage(errorList, RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD_VALUE, filterIndex)}
                    selectedListValue={cloneDeep(filter)?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD_VALUE]}
                  />
                ) :
                VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.FIELD.ALLOWED_FIELD_TYPES.selectionFields.includes(filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) ?
                (
                  <SingleDropdown
                    id={VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.ID}
                    optionList={filter?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES]}
                    selectedValue={(filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.YES_NO) ?
                      filter?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD_VALUE] :
                      filter?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD_VALUE]?.[0] || EMPTY_STRING}
                    onClick={(value, label) => onFilterValueChange(value, label)}
                    errorMessage={getErrorMessage(errorList, RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD_VALUE, filterIndex)}
                    placeholder={DL_PICKER_FILTER_STRING.VALUE_PLACEHOLDER}
                    dropdownViewProps={{
                      selectedLabel:
                      getSelectedLabels(
                        filter?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES],
                        (filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.YES_NO) ?
                        filter?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD_VALUE] :
                        filter?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD_VALUE]?.[0] || EMPTY_STRING,
                        ),
                    }}
                  />
                ) :
                (
                  getValuesField()
                ) }
              </div>
            </div>
          </div>
        )}

        {totalFilters > 1 ? (
          <div className={cx(gClasses.DisplayFlex, gClasses.JusEnd)}>
            <div className={style.DeleteIconContainer}>
              <DeleteIcon
                role={ARIA_ROLES.BUTTON}
                tabIndex={0}
                className={cx(style.DeleteIcon, gClasses.CursorPointer)}
                onClick={() => onDeleteDataListFilter(filterIndex)}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onDeleteDataListFilter(filterIndex)}
                ariaLabel="Delete"
              />
            </div>
          </div>
        ) : null}
      </div>
      {duplicateError && (
          <HelperMessage
              type={HELPER_MESSAGE_TYPE.ERROR}
              message={duplicateError}
              className={cx(gClasses.ErrorMarginV1)}
          />
      )}
      { filterIndex === totalFilters - 1 ?
      (
      <Row className={style.RowMargin}>
        <Col lg={12}>
          <button
            className={cx(gClasses.FTwo13, gClasses.CenterV, gClasses.ClickableElement)}
            onClick={() => addCondition()}
          >
            <PlusIcon ariaHidden className={style.AddCondition} />
            <div className={cx(
                  gClasses.ML5,
                  style.AddCondition,
                  gClasses.FontWeight500,
                  gClasses.FTwo13,
                )}
            >
            {t('form_field_strings.validation_config.add_condition')}
            </div>
          </button>
        </Col>
      </Row>
      ) :
      (
        <Row className={style.RowMargin}>
        <Col lg={12}>
          <div
            className={cx(gClasses.FTwo11GrayV53, gClasses.CursorPointer)}
          >
            And
          </div>
        </Col>
        </Row>
      )
      }
    </div>
  );
}

export default SelectorFilterValidationConfiguration;
