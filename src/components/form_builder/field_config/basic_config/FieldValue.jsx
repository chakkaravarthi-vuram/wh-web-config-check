import React, { useCallback, useContext, useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { compact, isEmpty, uniq, uniqBy } from 'lodash';
import { COMMA, EMPTY_STRING, SPACE } from 'utils/strings/CommonStrings';
import { externalFieldsDataChange } from 'redux/actions/DefaultValueRule.Action';
import { getFieldFromFieldUuid } from 'components/query_builder/QueryBuilder.utils';
import { FIELD_TYPE } from 'utils/constants/form_fields.constant';
import ThemeContext from '../../../../hoc/ThemeContext';
import { STRING_DROPDOWN_INPUT, SET_BUTTON } from './FieldValue.strings';

import Input from '../../../form_components/input/Input';

import gClasses from '../../../../scss/Typography.module.scss';

import { isMultiSelectOperator, getDefaultRuleExternalFieldsDropdownList, getDefaultRuleExternalFieldsErrors, getDefaultRuleExternalFieldsLoadingStatus, getDefaultRuleExternalFieldMetadataDropdownList, getDefaultRuleExternalOriginalFieldMetaData, getDefaultRuleExternalFieldsData } from '../../../../redux/reducer';
import {
  getRValueLabelFromOperator, getLValueLabelFromOperator, getFieldValue, getValueByOperator,
  getTypeFromOperator,
  getIsField, isDualSelectOperator, getFieldLabelFromUuid, ALLOW_DYNAMIC_SEARCH_FIELDS, getFieldsSortedInSelectedOrder,
} from './DefaultValueRule.selectors';
import Dropdown from '../../../form_components/dropdown/Dropdown';
import DatePicker from '../../../form_components/date_picker/DatePicker';
import { POPPER_PLACEMENTS } from '../../../auto_positioning_popper/AutoPositioningPopper';
import { BS } from '../../../../utils/UIConstants';
import { showToastPopover } from '../../../../utils/UtilityFunctions';
import { FORM_POPOVER_STATUS } from '../../../../utils/Constants';
import { DEFAULT_VALUE_CONFIG_STRINGS } from './DefaultValueRule.strings';

const getInputComponent = (type, operator, onChangeHandler, value, buttonColor, onSetClicked, t) => {
  switch (type) {
    case FIELD_TYPE.NUMBER:
    case FIELD_TYPE.CURRENCY:
      return (
        <Input
          label={STRING_DROPDOWN_INPUT(t).LABEL}
          // type="number" // as this input is used as search of fields dropdown allowing texts, number valdiation is handled in joi
          placeholder={STRING_DROPDOWN_INPUT(t).PLACEHOLDER}
          onChangeHandler={(event) => {
            onChangeHandler(event.target.value);
          }}
          value={value}
          readOnlySuffix={t(SET_BUTTON.LABEL)}
          readOnlySuffixStyle={{ color: buttonColor }}
          onSetClick={onSetClicked}
        />
      );
    case FIELD_TYPE.SINGLE_LINE:
      return (
        <Input
          label={STRING_DROPDOWN_INPUT(t).LABEL}
          type="text"
          placeholder={STRING_DROPDOWN_INPUT(t).PLACEHOLDER}
          onChangeHandler={(event) => onChangeHandler(event.target.value)}
          value={value}
          readOnlySuffix={t(SET_BUTTON.LABEL)}
          readOnlySuffixStyle={{ color: buttonColor }}
          onSetClick={onSetClicked}
        />
      );
    case FIELD_TYPE.DATE:
      return (
        <div className={BS.D_FLEX}>
          <DatePicker
            getDate={onChangeHandler}
            date={value}
            popperPlacement={POPPER_PLACEMENTS.AUTO}
            fixedStrategy
            className={gClasses.ZIndex4}
          />
          <span role="presentation" className={cx(gClasses.FOne13BlackV1, BS.MT_AUTO, BS.MB_AUTO)} style={{ color: buttonColor }} onClick={() => onSetClicked(true)}>Set</span>
        </div>
      );
    default:
      return null;
  }
};

function FieldValue(props) {
  const {
    value,
    operator,
    onChangeHandler,
    externalFields,
    isRValue,
    isInputAllowed,
    id,
    error_list,
    selectedOperatorInfo,
    isMultiSelect,
    onLoadMoreExternalFields,
    hasMore,
    onSearchExternalFields,
    fieldMetaData = [],
    originalFieldMetaData,
    originalExternalFields,
    onExternalFieldDataChange,
    isInitialLoading,
  } = props;
  const { t } = useTranslation();
  const { buttonColor } = useContext(ThemeContext);
  const type = getTypeFromOperator(operator);
  const [inputValue, setInputValue] = useState();
  const [sortedExternalFields, setSortedExternalFields] = useState(externalFields);

  useEffect(() => {
    if (isMultiSelect && value && value.value && Array.isArray(value.value)) {
      setSortedExternalFields(getFieldsSortedInSelectedOrder(externalFields, value.value || []));
    } else {
      setSortedExternalFields(externalFields);
    }
  }, [externalFields, value]);
 // const [searchText, setSearchText] = useState(EMPTY_STRING);
  // , ...(fieldMetaData || [])
  // const allFieldsOptionList = uniqBy([...(externalFields || [])], (option) => option.value);
  const allOriginalFields = uniqBy([...(originalExternalFields || []), ...(originalFieldMetaData || [])], (field) => field.field_uuid);

  const onDropdownChangeHandler = (value, isField) => {
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
  };

  const onSearchHandler = (search, isField) => {
  //  setSearchText(search);
  if (type !== FIELD_TYPE.DATE) onSearchExternalFields(null, isField, search);
  };

  const onInputChangeHandler = (_value) => {
    setInputValue(_value);
    onSearchHandler(_value, true);
  };

  const onSetClicked = () => {
    let value = inputValue;
    if (!Number.isNaN(value) && [FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY].includes(type)) value = Number(inputValue);
    onDropdownChangeHandler(value, false);
    setInputValue();
  };

 const onDropdownVisibility = useCallback((isDropdownVisible) => {
   if (!isDropdownVisible) {
    onInputChangeHandler(EMPTY_STRING);
   }
 }, [type]);

 const isTableOperator = !!(selectedOperatorInfo.is_table_field_allowed);

 let selectedValue = EMPTY_STRING;
 if (getIsField(value)) {
     const values = [value.value].flat();
     const allExternalFieldUUID = !isEmpty(sortedExternalFields) ? sortedExternalFields.map((option) => option.value) : [];
     const isValueFoundOnExternalFields = !isEmpty(sortedExternalFields) &&
                                          (values.every((value) => allExternalFieldUUID.includes(value)));
     if (isValueFoundOnExternalFields) selectedValue = getFieldLabelFromUuid(value, isMultiSelect, sortedExternalFields);
     else {
       const allFieldMetaDataUUID = !isEmpty(fieldMetaData) ? fieldMetaData.map((option) => option.value) : [];
       const fieldLabels = (
           !isEmpty(values) ?
               (values.map((eachValue) => (allFieldMetaDataUUID.includes(eachValue) ?
                 (getFieldFromFieldUuid(fieldMetaData, eachValue).label) || EMPTY_STRING :
                 EMPTY_STRING
                 ))) :
              []);
       selectedValue = compact(fieldLabels).join(COMMA + SPACE) || EMPTY_STRING;
     }
 } else {
  selectedValue = getValueByOperator(value, operator, isMultiSelect);
 }
 const allowManualSearch = (isTableOperator || ALLOW_DYNAMIC_SEARCH_FIELDS.includes(type));

 const dropDown = (
    <Dropdown
      id={id}
      isMultiSelect={isMultiSelect}
      datePicker={type === FIELD_TYPE.DATE}
      dropdownListLabel={t(SET_BUTTON.VALUE)}
      inputComponent={isInputAllowed ? (inputSetClicked) => {
        const onClick = () => {
          inputSetClicked();
          onSetClicked();
        };
        const input = getInputComponent(type, operator, onInputChangeHandler, inputValue, buttonColor, onClick, t);
        return input;
      } : null}
      optionList={sortedExternalFields}
      selectedValue={selectedValue}
      strictlySetSelectedValue
      onChange={(event) => {
        setInputValue();
        if (isMultiSelect) {
          let valueList = getIsField(value) ? getFieldValue(value, isMultiSelect) : getValueByOperator(value, operator, isMultiSelect);
          valueList = [...valueList];
          if (valueList.find((_value) => _value === event.target.value)) valueList.splice(valueList.indexOf(event.target.value), 1);
          else valueList.push(event.target.value);
          if (valueList.length > 2 && isDualSelectOperator(selectedOperatorInfo)) {
            valueList.pop();
            return showToastPopover(
              'Only two fields are allowed',
              'Unselect a field and try again',
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          }
          return onDropdownChangeHandler(uniq(valueList), true);
        }
        return onDropdownChangeHandler(event.target.value, true);
      }}
      label={isRValue ? getRValueLabelFromOperator(operator, t) : getLValueLabelFromOperator(operator, t)}
      errorMessage={error_list}
      showNoDataFoundOption
      noDataFoundOptionLabel={t(DEFAULT_VALUE_CONFIG_STRINGS.NO_FIELDS)}
      isPaginated
      hasMore={hasMore}
      loadDataHandler={onLoadMoreExternalFields}
      disablePopper
      disableFocusFilter
      dropdownVisibility={onDropdownVisibility}
      enableSearch={allowManualSearch}
      onSearchInputChange={(allowManualSearch) ? (search) => onSearchHandler(search, true) : null}
      isDataLoading={isInitialLoading}
    />
  );
  return dropDown;
}

const mapStateToProps = (state, ownProps) => {
  return {
    externalFields: getDefaultRuleExternalFieldsDropdownList(state, ownProps.serverFieldId, ownProps.tableUuid, ownProps.isTableField, ownProps.selectedOperatorInfo),
    fieldMetaData: getDefaultRuleExternalFieldMetadataDropdownList(state, ownProps.serverFieldId, ownProps.tableUuid, ownProps.isTableField, ownProps.selectedOperatorInfo),
    isLoading: getDefaultRuleExternalFieldsLoadingStatus(state),
    errors: getDefaultRuleExternalFieldsErrors(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(FieldValue);
