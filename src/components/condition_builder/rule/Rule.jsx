import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BS } from 'utils/UIConstants';
// eslint-disable-next-line import/no-cycle
// eslint-disable-next-line import/no-cycle
import { externalFieldReducerDataChange, getVisibilityOperatorsApiThunk, updateFieldMetaData } from 'redux/actions/Visibility.Action';
import { generateEventTargetObject } from 'utils/generatorUtils';
import { getAllFieldsOperator, getVisibilityExternalFieldsData, getVisibilityExternalFieldsDropdownList, getVisibilityExternalFieldsHasMore } from 'redux/reducer';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { getVisibilityFieldMetaData } from 'redux/reducer/VisibilityReducer';
import { getFieldType } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { CBAllKeys, ETextSize, SingleDropdown, Size, Text } from '@workhall-pvt-lmt/wh-ui-library';
import RValue from '../../form_builder/rule/RValueNew';
import jsUtility, { get, has, isEmpty, set } from '../../../utils/jsUtility';
import gClasses from '../../../scss/Typography.module.scss';
import QUERY_BUILDER, { NEXT_LINE_OPERAND, ROW_LEVEL_VALIDATION_KEY } from '../ConditionBuilder.strings';
import { getFieldFromFieldUuid, getSelectedOperator, getOperatorOptionList } from '../ConditionBuilder.utils';
import { FIELD_LIST_TYPE } from '../../../utils/constants/form.constant';
import styles from './Rule.module.scss';
import { R_CONSTANT } from '../../../utils/constants/rule/rule.constant';

function Rule(props) {
    const {
        l_field,
        operator,
        r_value,
        r_constant,
        lstAllFields,
        ruleIndex,
        validations,
        onChangeHandler,
        onLoadMoreExternalFields,
        onUpdateFieldMetaData,
        onSearchExternalFields,
        onClearSearchedList,
        condition_uuid,
        lstSearchFields,
        externalFields,
        searchFields: { pagination_data: searchPaginationData, hasMore: searchHasMore = false, pagination_details: searchPaginationDetails } = {},
        hasMore,
        all_fields_operator,
        getOperatorsByType,
        noFieldsFoundMsg,
        choiceValueTypeBased = false, // only for dynamic security policy
    } = props;
    const { t } = useTranslation();
    const { ALL_LABELS } = QUERY_BUILDER;
    const [selectedField, setSelectedField] = useState({});
    const [selectedOperator, setSelectedOperator] = useState(null);
    const [searchText, setSearchText] = useState(null);

    // Set Selected Field Object
    useEffect(() => {
      const field = getFieldFromFieldUuid(lstAllFields, l_field);
      (field !== -1 && !isEmpty(field)) && (setSelectedField(field));
    }, [l_field, (lstAllFields || []).length]);

    // Operator related actions
    useEffect(() => {
      // Get Opertors for current field type if not exist in all_fields_operator
      const field_type = getFieldType(selectedField);
      if (!has(all_fields_operator, [field_type], false) && field_type) getOperatorsByType([field_type]);

      // On initial render, set the current rule operator
      const selected_opertor_info = getSelectedOperator(all_fields_operator, selectedField, (operator || null));
      setSelectedOperator(selected_opertor_info);
    }, [(Object.keys(all_fields_operator).length), selectedField, condition_uuid]);

    // Get Validation Message
    const getErrorMessage = (key, returnObject = false) => {
      const errMessage = get(validations, [`${CBAllKeys.CONDITIONS},${ruleIndex},${key}`], null);
      if (key === CBAllKeys.R_VALUE) {
        const rValueCount = Object.keys(validations).filter((key) => key.includes(`${ruleIndex},${CBAllKeys.R_VALUE},`)).length;
        if ((rValueCount > 0) && returnObject) {
          const errObject = {};
          Object.keys(validations).forEach((key) => {
            if (key.includes(`${ruleIndex},${CBAllKeys.R_VALUE}`)) {
              const startIndex = key.indexOf(CBAllKeys.R_VALUE);
              const newKey = key.substring(startIndex);
              errObject[newKey] = validations[key];
            }
          });
          return errObject;
        }
      }
      return errMessage;
    };

    // When Field Change Handler
    const onFieldChangeHandler = (event) => {
      const field_uuid = get(event, ['target', 'value']);
      const list = (searchText) ? searchPaginationData : externalFields;
      const choosenField = getFieldFromFieldUuid(list, field_uuid);
      set(event, ['target', 'addedTableCol'], choosenField?.field_list_type === FIELD_LIST_TYPE.TABLE ? field_uuid : null);
      if ((searchText || [EMPTY_STRING, null].includes(searchText)) && updateFieldMetaData && onClearSearchedList) {
          const consolidatedData = (!jsUtility.isEmpty(choosenField)) ? [choosenField] : [];
          onUpdateFieldMetaData(consolidatedData).then(() => {
            setSearchText(EMPTY_STRING);
            onClearSearchedList();
            onChangeHandler(event, ruleIndex);
          });
      } else {
          setSearchText(EMPTY_STRING);
          onChangeHandler(event, ruleIndex);
      }
    };
    // When Field Load More Handler
    const loadMoreData = () => {
      if (onLoadMoreExternalFields) { //  if load more is allowed
        if (searchText && searchPaginationData && get(searchPaginationDetails, [0, 'total_count'], 0) > searchPaginationData.length) {
              const page = get(searchPaginationDetails, [0, 'page'], 0) + 1;
              onSearchExternalFields(searchText, page);
        } else {
          onLoadMoreExternalFields();
        }
      }
    };
    // When Field Search Handler
    const onFieldSearchHandler = (searchValue) => {
          if (searchText === EMPTY_STRING) onClearSearchedList();
          if (searchText !== null) onSearchExternalFields(searchValue);
          setSearchText(searchValue);
    };

    // Operator Change Handler
    const operatorChangeHandler = (event) => {
      const selected_opertor_info = getSelectedOperator(all_fields_operator, selectedField, (event.target.value || null));
      setSelectedOperator(selected_opertor_info);
      onChangeHandler(event, ruleIndex, selected_opertor_info);
    };

    const field_name = (selectedField !== -1 && !isEmpty(selectedField) && selectedField) ? selectedField.label : EMPTY_STRING;
    const whenFieldOptionList = !isEmpty(searchText) ? lstSearchFields : lstAllFields;
    const hasSelectedUuid = !isEmpty(getFieldFromFieldUuid(whenFieldOptionList, l_field));

    const operatorOptionList = getOperatorOptionList(all_fields_operator[getFieldType(selectedField)], selectedField, choiceValueTypeBased);

    const getRowErrorMessage = () => {
        // Get Row Validation Message
      const stringifyedValidation = JSON.stringify(validations);
      let keyToFind = null;
      const rowLevelValidationKeys = Object.values(ROW_LEVEL_VALIDATION_KEY);
      for (let validtionKeyIndex = 0; validtionKeyIndex < rowLevelValidationKeys.length; validtionKeyIndex++) {
         if (stringifyedValidation.includes(`${CBAllKeys.CONDITIONS},${ruleIndex},${rowLevelValidationKeys[validtionKeyIndex]}`)) {
           keyToFind = rowLevelValidationKeys[validtionKeyIndex];
           break;
         }
      }
      if (keyToFind == null) return null;

      const allKeys = Object.keys(validations);
      const key = allKeys.find((eachKey) => eachKey.includes(keyToFind));
      return (
        <Text
            content={validations?.[key]}
            size={ETextSize.XS}
            className={styles.ErrorMessage}
        />
      );
    };

    return (
      <div key={condition_uuid} className={styles.RuleWrapper}>
        <div className={styles.Rule}>
          <div className={styles.When}>
            <SingleDropdown
              id={CBAllKeys.L_FIELD}
              selectedValue={hasSelectedUuid ? l_field : null}
              errorMessage={getErrorMessage(CBAllKeys.L_FIELD)}
              optionList={!isEmpty(searchText) ? lstSearchFields : lstAllFields}
              onClick={(value, _label, _list, id) => onFieldChangeHandler({ target: { id, value } })}
              placeholder={t(ALL_LABELS.CHOOSE_A_FIELD)}
              dropdownViewProps={{
                size: Size.md,
                selectedLabel: !hasSelectedUuid ? field_name : null,
              }}
              infiniteScrollProps={{
                dataLength: (!isEmpty(searchText) ? lstSearchFields : lstAllFields).length,
                next: loadMoreData,
                hasMore: !isEmpty(searchText) ? searchHasMore : hasMore,
                scrollableId: 'when_field_scroll_id',
              }}
              searchProps={{
                searchValue: searchText,
                searchPlaceholder: 'Search Fields',
                onChangeSearch: (event) => onFieldSearchHandler(event?.target?.value),
              }}
              noDataFoundMessage={noFieldsFoundMsg}
              onOutSideClick={() => setSearchText(null)}
            />
          </div>
          <div className={styles.OperatorAndValue}>
          <div className={styles.Operator}>
            <SingleDropdown
                id={CBAllKeys.OPERATOR}
                selectedValue={isEmpty(operatorOptionList) ? null : operator}
                errorMessage={getErrorMessage(CBAllKeys.OPERATOR)}
                optionList={operatorOptionList}
                onClick={(value, _label, _list, id) => operatorChangeHandler({ target: { id, value } })}
                dropdownViewProps={{
                    placeholder: t(ALL_LABELS.CHOOSE_A_FIELD),
                    size: Size.md,
                }}
                placeholder={t(ALL_LABELS.SELECT)}
                className={styles.DropdownPopperOperator}
            />
          </div>
            <div className={styles.Value}>
              <RValue
                id={condition_uuid}
                label={NEXT_LINE_OPERAND.includes(selectedOperator?.operand_field) ? t(ALL_LABELS.VALUES) : undefined}
                className={cx(gClasses.Flex1)}
                labelClassName={cx(BS.MARGIN_0)}
                errorRValue={getErrorMessage(CBAllKeys.R_VALUE)}
                rValue={r_value}
                onRValueChangeHandler={(event) => onChangeHandler(generateEventTargetObject(CBAllKeys.R_VALUE, event), ruleIndex)}
                rConstant={r_constant}
                onRConstantChangeHandler={(event) => onChangeHandler(generateEventTargetObject(R_CONSTANT, event), ruleIndex)}
                selectedFieldInfo={selectedField}
                selectedOperatorInfo={selectedOperator}
                ruleError={getErrorMessage(CBAllKeys.R_VALUE, true)}
                isFromQueryBuilder
                choiceValueTypeBased={choiceValueTypeBased}
              />
            </div>
          </div>
        </div>
        {getRowErrorMessage()}
      </div>
   );
}

const mapStateToProps = (state, ownProps) => {
  return {
    all_fields_operator: getAllFieldsOperator(state),
    searchFields: get(state, ['VisibilityReducer', 'externalFieldReducer', 'searchFields'], {}),
    field_metadata: getVisibilityFieldMetaData(state),
    hasMore: getVisibilityExternalFieldsHasMore(state),
    lstSearchFields: getVisibilityExternalFieldsDropdownList(state, ownProps.serverEntityUUID, false, true),
    externalFields: getVisibilityExternalFieldsData(state),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getOperatorsByType: (field_type) => dispatch(getVisibilityOperatorsApiThunk(field_type)),
    onUpdateFieldMetaData: (fields) => {
      dispatch(updateFieldMetaData(fields));
      return Promise.resolve();
    },
    onClearSearchedList: () => dispatch(externalFieldReducerDataChange({ searchFields: {
                                      pagination_details: [],
                                      hasMore: false,
                                      } })),
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Rule);

Rule.defaultProps = {
  l_field: null,
  operator: null,
  r_value: null,
  lstAllFields: [],
  ruleIndex: 0,
  validations: {},
  onChangeHandler: () => {},
  onDeleteRule: () => {},
  serverEntityUUID: EMPTY_STRING,
};

Rule.propTypes = {
  l_field: PropTypes.string,
  operator: PropTypes.string,
  r_value: PropTypes.string,
  lstAllFields: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  ruleIndex: PropTypes.number,
  validations: PropTypes.object,
  onChangeHandler: PropTypes.func,
  onDeleteRule: PropTypes.func,
  serverEntityUUID: PropTypes.string,
};
