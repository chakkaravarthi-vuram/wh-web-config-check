import { BorderRadiusVariant, SingleDropdown, TextInput, EInputIconPlacement, MultiDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import cx from 'classnames';
import { FIELD_TYPE } from '../../../utils/constants/form_fields.constant';
import DatePicker from '../../form_components/date_picker/DatePicker';
import { POPPER_PLACEMENTS } from '../../auto_positioning_popper/AutoPositioningPopper';
import gClasses from '../../../scss/Typography.module.scss';
import SearchIcon from '../../../assets/icons/SearchIcon';
import { BS } from '../../../utils/UIConstants';
import { EMPTY_STRING, ONLY_NUMBER_VALUES_ALLOWED_TO_SET } from '../../../utils/strings/CommonStrings';
import { getFieldsSortedInSelectedOrder, getLValueLabelFromOperator, getRValueLabelFromOperator, getSelectedLabel, getTypeFromOperator } from '../ConfigurationRuleBuilder.utils';
import { isEmpty, isFiniteNumber, uniqBy } from '../../../utils/jsUtility';
import { ALLOW_DYNAMIC_SEARCH_FIELDS, CONFIGURATION_RULE_BUILDER } from '../ConfigurationRuleBuilder.strings';
import { getDefaultRuleExternalFieldMetadataDropdownList, getDefaultRuleExternalFieldsData, getDefaultRuleExternalFieldsDropdownList, getDefaultRuleExternalOriginalFieldMetaData, isMultiSelectOperator } from '../../../redux/reducer';
import { externalFieldsDataChange } from '../../../redux/actions/DefaultValueRule.Action';
import { showToastPopover } from '../../../utils/UtilityFunctions';
import { FORM_POPOVER_STATUS } from '../../../utils/Constants';

const getInputElement = (fieldType = FIELD_TYPE.SINGLE_LINE, searchProps = {}) => {
  switch (fieldType) {
    case FIELD_TYPE.NUMBER:
    case FIELD_TYPE.CURRENCY:
    case FIELD_TYPE.SINGLE_LINE:
      return (
        <TextInput
          isLoading={false}
          onClear={() => {}}
          icon={<SearchIcon className={gClasses.MR8} />}
          iconPosition={EInputIconPlacement.left}
          borderRadiusType={BorderRadiusVariant.rounded}
          value={searchProps?.searchValue}
          onChange={(event) => searchProps?.onChangeSearch(event.target?.value)}
          onBlurHandler={searchProps?.onBlur && searchProps.onBlur}
          onFocusHandler={searchProps?.onFocus && searchProps.onFocus}
          placeholder={searchProps.searchPlaceholder}
          suffixIcon={searchProps?.getActionLink()}
        />
      );
    case FIELD_TYPE.DATE:
      return (
        <div className={cx(gClasses.DisplayFlex, BS.ALIGN_ITEM_CENTER, BS.JC_BETWEEN)}>
          <DatePicker
            getDate={searchProps?.onChangeSearch}
            date={searchProps?.searchValue || ''}
            popperPlacement={POPPER_PLACEMENTS.AUTO}
            fixedStrategy
            className={gClasses.ZIndex4}
            hideLabel
          />
          <div className={gClasses.MR8}>{searchProps?.getActionLink()}</div>
        </div>
      );
    default:
      return (
        <TextInput
          isLoading={false}
          onClear={() => {}}
          icon={<SearchIcon className={gClasses.MR8} />}
          iconPosition={EInputIconPlacement.left}
          borderRadiusType={BorderRadiusVariant.rounded}
          value={searchProps?.searchValue}
          onChange={(event) => searchProps?.onChangeSearch(event.target?.value)}
          onBlurHandler={searchProps?.onBlur && searchProps.onBlur}
          onFocusHandler={searchProps?.onFocus && searchProps.onFocus}
          placeholder={searchProps.searchPlaceholder}
        />
      );
  }
};

function ConfigurationRuleFieldDropdown(props) {
   const {
    id,
    fieldType,
    value,
    isRValue,
    operator,
    selectedOperatorInfo,
    validationMessage,
    hasMore,
    loadMoreData,
    onChangeHandler,

    isMultiSelect,
    originalExternalFields = [],
    originalFieldMetaData = [],
    externalFields = [],
    fieldMetaData = [],
    onExternalFieldDataChange,
    getExternalFields,
 } = props;
   const { t } = useTranslation();
   const { FIELDS: { FIELD } } = CONFIGURATION_RULE_BUILDER;
   const [search, setSearch] = useState(EMPTY_STRING);
   const [lstFields, setLstFields] = useState(externalFields);

   useEffect(() => {
    if (isMultiSelect && Array.isArray(value?.value)) {
        setLstFields(getFieldsSortedInSelectedOrder(externalFields, value.value || []));
    } else {
        setLstFields(externalFields);
    }
  }, [externalFields, value]);

   const onDropdownChange = (value, isField) => {
    const allOriginalFields = uniqBy([...(originalExternalFields || []), ...(originalFieldMetaData || [])], (field) => field.field_uuid);
    if (isField && !isEmpty(allOriginalFields)) {
      const value_ = [value].flat();
      const selectedField = (allOriginalFields).filter((field) => value_.includes(field.field_uuid));
      if (!isEmpty(selectedField)) {
        const consolidatedFieldMetadata = uniqBy([...([selectedField].flat()), ...(originalFieldMetaData || [])], (field) => field.field_uuid);
        onExternalFieldDataChange({
          field_metadata: consolidatedFieldMetadata,
        });
      }
    }
    onChangeHandler(value, isField);
    getExternalFields();
   };

   const onSetHandler = () => {
    const value = search;
    if (value.toString().length <= 0) return;

    if (
      [FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY].includes(fieldType) &&
      [FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY].includes(getTypeFromOperator(operator))
      ) {
        if (isFiniteNumber(Number(value))) {
          onDropdownChange(Number(value), false);
          setSearch(EMPTY_STRING);
        } else {
          showToastPopover(
            t(ONLY_NUMBER_VALUES_ALLOWED_TO_SET),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
      } else {
        onDropdownChange(value, false);
        setSearch(EMPTY_STRING);
      }
   };

   const onSearchHandler = (value) => {
      setSearch(value);
      getExternalFields(1, true, value);
   };

   const isTableOperator = !!(selectedOperatorInfo?.is_table_field_allowed);
   const selectedLabel = getSelectedLabel(value, lstFields, fieldMetaData, isMultiSelect);
   const hideSetLinkOnFieldSearch = (isTableOperator || ALLOW_DYNAMIC_SEARCH_FIELDS.includes(fieldType));
   console.log('xyz selectedLabel', selectedLabel, validationMessage);

   if (isMultiSelect) {
    return (
      <MultiDropdown
        id={id}
        errorMessage={validationMessage}
        optionList={lstFields}
        placeholder={t(FIELD.PLACEHOLDER)}
        selectedListValue={value?.value || []}
        onClick={(value) => onDropdownChange(value, true)}
        noDataFoundMessage={t(FIELD.NO_VALUE_FOUND)}
        dropdownViewProps={{
              labelName: isRValue ? getRValueLabelFromOperator(operator, t) : getLValueLabelFromOperator(operator, t),
              selectedLabel: selectedLabel?.map?.((i) => i.label).join(', '),
              errorMessage: validationMessage,
        }}
        infiniteScrollProps={{
            dataLength: lstFields.length,
            next: loadMoreData,
            hasMore: hasMore,
            scrollableId: 'when_field_scroll_id',
        }}
        searchProps={{
            searchValue: search,
            searchPlaceholder: 'Search Value',
            onChangeSearch: (value) => onSearchHandler(value),

            showLink: !hideSetLinkOnFieldSearch,
            linkLabel: 'Set',
            onLinkClick: onSetHandler,

            showCustomSearch: true,
            customSearchComponent: (searchProps) => getInputElement(getTypeFromOperator(operator), searchProps),
        }}
      />
    );
   }

   return (
    <SingleDropdown
        id={id}
        selectedValue={value?.value}
        errorMessage={validationMessage}
        optionList={lstFields}
        onClick={(value) => onDropdownChange(value, true)}
        placeholder={t(FIELD.PLACEHOLDER)}
        noDataFoundMessage={t(FIELD.NO_VALUE_FOUND)}
        dropdownViewProps={{
            labelName: isRValue ? getRValueLabelFromOperator(operator, t) : getLValueLabelFromOperator(operator, t),
            selectedLabel: selectedLabel,
        }}
        infiniteScrollProps={{
            dataLength: lstFields.length,
            next: loadMoreData,
            hasMore: hasMore,
            scrollableId: 'when_field_scroll_id',
        }}
        searchProps={{
            searchValue: search,
            searchPlaceholder: 'Search Value',
            onChangeSearch: (value) => onSearchHandler(value),

            showLink: !hideSetLinkOnFieldSearch,
            linkLabel: 'Set',
            onLinkClick: onSetHandler,

            showCustomSearch: true,
            customSearchComponent: (searchProps) => getInputElement(getTypeFromOperator(operator), searchProps),
        }}
        shouldCloseOnOutsideClick={() => {
          const type = getTypeFromOperator(operator);
          if (type === FIELD_TYPE.DATE) {
            const dateModal = document.getElementById('date-picker-modal');
            return !dateModal;
          }
          return true;
        }}
    />
   );
}

const mapStateToProps = (state, ownProps) => {
    return {
      externalFields: getDefaultRuleExternalFieldsDropdownList(state, ownProps.serverFieldId, ownProps.tableUUID, ownProps.isTableField, ownProps.selectedOperatorInfo),
      fieldMetaData: getDefaultRuleExternalFieldMetadataDropdownList(state, ownProps.serverFieldId, ownProps.tableUUID, ownProps.isTableField, ownProps.selectedOperatorInfo),
      isMultiSelect: isMultiSelectOperator(ownProps.selectedOperatorInfo),
      originalFieldMetaData: getDefaultRuleExternalOriginalFieldMetaData(state),
      originalExternalFields: getDefaultRuleExternalFieldsData(state),
    };
  };
const mapDispatchToProps = (dispatch) => {
    return {
      onExternalFieldDataChange: (response) => dispatch(externalFieldsDataChange(response)),
     };
  };

export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationRuleFieldDropdown);
