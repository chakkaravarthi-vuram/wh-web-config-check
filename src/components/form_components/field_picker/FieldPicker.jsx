import React, { useState } from 'react';
import { Picker } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { getExternalFields } from '../../../axios/apiService/formulaBuilder.apiService';
import { getFieldOptionList } from './FieldPicker.utils';
import { get } from '../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { CancelToken } from '../../../utils/UtilityFunctions';

const cancelToken = new CancelToken();
function FieldPicker(props) {
  const {
    id,
    className,
    fieldMetadata,
    selectedValue,
    isSearchable,
    remainingOptionSearchProps,
    popperPlacement,
    remainingOptionPopperPlacement,
    noDataFoundMessage,
    maxDisplayCountLimit,
    onSelect,
    onRemove,
    getPopperContainerClassName,
    onPopperOutsideClick,
    getModuleMetadata = () => {},
    disabled,
    errorMessage,
    isLoading,
    maxSelectionCount,
    includeTable,
 } = props;

  const fieldMetadataOptions = getFieldOptionList(fieldMetadata);
  const [allFieldOptionList, setAllFieldOptionList] = useState([]);
  const [search, setSearch] = useState(null);
  const { t } = useTranslation();
  const [isDataLoading, setIsDataLoading] = useState(false);

  const MAX_SIZE = 15;

  const loadData = (page = 1, search = EMPTY_STRING) => {
    const moduleMetadata = getModuleMetadata?.() || {};
    const params = {
        page: page,
        size: MAX_SIZE,
        include_property_picker: 1,
        ...moduleMetadata,
    };
    if (search) params.search = search;
    if (includeTable) params.include_tables = 1;

    setIsDataLoading(true);
    try {
      getExternalFields(params, cancelToken).then((response) => {
          const { pagination_data = [] } = response;
          const pagination_details = get(response, ['pagination_details', 0], {});
          if (pagination_details?.page > 1) {
              setAllFieldOptionList((existingOptions) => getFieldOptionList(...existingOptions, ...pagination_data));
          } else {
              setAllFieldOptionList(() => getFieldOptionList(pagination_data));
          }
          setIsDataLoading(false);
      });
    } catch (e) {
       setIsDataLoading(false);
    }
  };

  const onSearch = (event) => {
     const searchValue = event?.target?.value;
     setSearch(searchValue);
     loadData(1, searchValue);
  };

  const onOutsideClick = () => {
    setSearch(EMPTY_STRING);
    onPopperOutsideClick?.();
  };

  const onPopperOpen = (isPopperOpen) => {
    if (!disabled && isPopperOpen) loadData(1, search);
  };

  const onFieldSelect = (field) => {
    setSearch(EMPTY_STRING);
    onSelect(field);
  };

  const onFieldRemove = (id) => {
    if (!disabled) loadData(1, search);
    onRemove(id);
  };

  const overallOptionList = [...fieldMetadataOptions, ...allFieldOptionList];
  return (
    <Picker
      id={id}
      className={className}
      optionList={(isDataLoading) ? [] : overallOptionList}
      selectedValue={selectedValue}
      dropdownSearchProps={{
        isSearchable: isSearchable,
        searchText: search,
        searchPlaceholder: t('common_strings.search_fields'),
        onSearch,
      }}
      remainingOptionSearchProps={remainingOptionSearchProps}
      maxDisplayCountLimit={maxDisplayCountLimit}
      noDataFoundMessage={(isDataLoading) ? t('common_strings.fetching_fields') : noDataFoundMessage}
      popperPlacement={popperPlacement}
      remainingOptionPopperPlacement={remainingOptionPopperPlacement}
      allLabels={{
        ADD_BUTTON: t('common_strings.add_field'),
        MAIN_POPPER_HEADING: t('common_strings.selected_fields'),
        SUGGESTION: t('common_strings.field_suggestion'),
      }}
      onSelect={onFieldSelect}
      onRemove={onFieldRemove}
      getPopperContainerClassName={getPopperContainerClassName}
      onPopperOutsideClick={onOutsideClick}
      onPopperRefClick={onPopperOpen}
      showAvatarInOptionList={false}
      disabled={disabled}
      errorMessage={errorMessage}
      isLoading={isLoading}
      maxSelectionCount={maxSelectionCount}
    />
  );
}

const MemorizedFieldPicker = React.memo(FieldPicker);

export default MemorizedFieldPicker;
