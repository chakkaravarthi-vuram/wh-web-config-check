import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import Dropdown from 'components/form_components/dropdown/Dropdown';
// eslint-disable-next-line import/no-cycle
import RValue from 'components/form_builder/rule/RValue';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
// eslint-disable-next-line import/no-cycle
import { externalFieldReducerDataChange, getVisibilityOperatorsApiThunk, updateFieldMetaData } from 'redux/actions/Visibility.Action';
import { generateEventTargetObject } from 'utils/generatorUtils';
import { getAllFieldsOperator, getVisibilityExternalFieldsData, getVisibilityExternalFieldsDropdownList, getVisibilityExternalFieldsHasMore } from 'redux/reducer';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { getVisibilityFieldMetaData } from 'redux/reducer/VisibilityReducer';
import { getFieldType } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import jsUtility, { get, has, isEmpty, set } from '../../../utils/jsUtility';
import gClasses from '../../../scss/Typography.module.scss';
import QUERY_BUILDER, { NEXT_LINE_OPERAND } from '../QueryBuilder.strings';
import styles from '../QueryBuilder.module.scss';
import { getFieldFromFieldUuid, getSelectedOperator, getOperatorOptionList } from '../QueryBuilder.utils';
import { FIELD_LIST_TYPE } from '../../../utils/constants/form.constant';

function Rule(props) {
    const {
        l_field,
        operator,
        r_value,
        lstAllFields,
        ruleIndex,
        validations,
        onChangeHandler,
        onDeleteRule,
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
    } = props;
    const { t } = useTranslation();
    const { ALL_LABELS, ALL_KEYS } = QUERY_BUILDER;
    const [selectedField, setSelectedField] = useState({});
    const [selectedOperator, setSelectedOperator] = useState(null);
    const [searchText, setSearchText] = useState(null);

    useEffect(() => {
      const field = getFieldFromFieldUuid(lstAllFields, l_field);
      (field && !isEmpty(field) && field !== -1) && (setSelectedField(field));
    }, [l_field, (lstAllFields || []).length]);

    useEffect(() => {
      const field_type = getFieldType(selectedField);
       if (!has(all_fields_operator, [field_type], false) && field_type) getOperatorsByType([field_type]);
      const selected_opertor_info = getSelectedOperator(all_fields_operator, selectedField, (operator || null));
      setSelectedOperator(selected_opertor_info);
    }, [(Object.keys(all_fields_operator).length), selectedField, condition_uuid]);

    const getErrorMessage = (key, returnObject = false) => {
      const errMessage = get(validations, [`${ALL_KEYS.OPERANDS},${ALL_KEYS.CONDITIONS},${ruleIndex},${key}`], null);
      if (key === ALL_KEYS.R_VALUE) {
        const rValueCount = Object.keys(validations).filter((key) => key.includes(`${ruleIndex},${ALL_KEYS.R_VALUE},`)).length;
        if ((rValueCount > 0) && returnObject) {
          const errObject = {};
          Object.keys(validations).forEach((key) => {
            if (key.includes(`${ruleIndex},${ALL_KEYS.R_VALUE}`)) {
              const startIndex = key.indexOf(ALL_KEYS.R_VALUE);
              const newKey = key.substring(startIndex);
              errObject[newKey] = validations[key];
            }
          });
          return errObject;
        }
      }
      return errMessage;
    };

    const onFieldChangeHandler = (event) => {
      const field_uuid = get(event, ['target', 'value']);
      const list = (searchText) ? searchPaginationData : externalFields;
      const choosenField = getFieldFromFieldUuid(list, field_uuid);
      set(event, ['target', 'addedTableCol'], choosenField?.field_list_type === FIELD_LIST_TYPE.TABLE ? field_uuid : null);
      if ((searchText || [EMPTY_STRING, null].includes(searchText)) && updateFieldMetaData && onClearSearchedList) {
        const consolidatedData = (!jsUtility.isEmpty(choosenField) && choosenField) ? [choosenField] : [];
        onUpdateFieldMetaData(consolidatedData).then(() => {
          setSearchText(EMPTY_STRING);
          onClearSearchedList();
          onChangeHandler(event, ruleIndex);
        });
      } else {
        onChangeHandler(event, ruleIndex);
        setSearchText(EMPTY_STRING);
      }
    };
    const loadMoreData = () => {
      if (onLoadMoreExternalFields) { //  if load more is allowed
        if (searchText) {
          if (searchPaginationData) {
            if (get(searchPaginationDetails, [0, 'total_count'], 0) > searchPaginationData.length) {
              const page = get(searchPaginationDetails, [0, 'page'], 0) + 1;
              onSearchExternalFields(searchText, page);
            }
          }
        } else {
          onLoadMoreExternalFields();
        }
      }
    };
    const onFieldSearchHandler = (searchValue) => {
          if (searchText === EMPTY_STRING) {
            // setSearchText(EMPTY_STRING);
            onClearSearchedList();
          }
         if (searchText !== null) onSearchExternalFields(searchValue);
          setSearchText(searchValue);
    };
    const operatorChangeHandler = (event) => {
      const selected_opertor_info = getSelectedOperator(all_fields_operator, selectedField, (event.target.value || null));
      setSelectedOperator(selected_opertor_info);
      onChangeHandler(event, ruleIndex, selected_opertor_info);
    };

   const field_name = (selectedField !== -1 && !isEmpty(selectedField) && selectedField) ? selectedField.label : EMPTY_STRING;
   const searchListHasSelectedUuid = !isEmpty(getFieldFromFieldUuid(lstSearchFields, l_field));
   const selectedFieldValue = ((searchText !== EMPTY_STRING && !searchListHasSelectedUuid)) ? field_name : l_field;
    return (
      <>
        <tr key={condition_uuid} className={NEXT_LINE_OPERAND.includes(selectedOperator?.operand_field) && styles.NoBottomBorder}>
        <td>
          <Dropdown
            id={ALL_KEYS.L_FIELD}
            label={t(ALL_LABELS.WHEN)}
            className={cx(gClasses.MR15, gClasses.Flex1)}
            inputDropdownContainer={gClasses.InputHeight32Important}
            labelClass={cx(BS.MARGIN_0)}
            selectedValue={selectedFieldValue}
            hideMessage={!getErrorMessage(ALL_KEYS.L_FIELD)}
            errorMessage={getErrorMessage(ALL_KEYS.L_FIELD)}
            showNoDataFoundOption
            optionList={!isEmpty(searchText) ? lstSearchFields : lstAllFields}
            onChange={onFieldChangeHandler}
            isPaginated
            loadDataHandler={loadMoreData}
            enableSearch
            disableFocusFilter
            onSearchInputChange={onFieldSearchHandler}
            strictlySetSelectedValue
            hasMore={!isEmpty(searchText) ? searchHasMore : hasMore}
            placeholder={t(ALL_LABELS.CHOOSE_A_FIELD)}
          />
        </td>
        <td>
          <Dropdown
            id={ALL_KEYS.OPERATOR}
            label={t(ALL_LABELS.OPERATOR)}
            className={cx(gClasses.MR15, gClasses.Flex1)}
            inputDropdownContainer={gClasses.InputHeight32Important}
            labelClass={cx(BS.MARGIN_0)}
            selectedValue={operator}
            hideMessage={!getErrorMessage(ALL_KEYS.OPERATOR)}
            errorMessage={getErrorMessage(ALL_KEYS.OPERATOR)}
            showNoDataFoundOption
            optionList={getOperatorOptionList(all_fields_operator[getFieldType(selectedField)])}
            onChange={operatorChangeHandler}
          />
        </td>
        <td>
          {!NEXT_LINE_OPERAND.includes(selectedOperator?.operand_field) &&
          <RValue
            label={t(ALL_LABELS.VALUES)}
            className={cx(gClasses.Flex1)}
            labelClassName={cx(BS.MARGIN_0)}
            errorRValue={getErrorMessage(ALL_KEYS.R_VALUE)}
            rValue={r_value}
            onRValueChangeHandler={(event) => onChangeHandler(generateEventTargetObject(ALL_KEYS.R_VALUE, event), ruleIndex)}
            selectedFieldInfo={selectedField}
            selectedOperatorInfo={selectedOperator}
            ruleError={getErrorMessage(ALL_KEYS.R_VALUE, true)}
            isFromQueryBuilder
          />}
        </td>
        <td>
            <div className={cx(BS.P_RELATIVE, styles.DeleteContainer)}>
              <button className={cx(gClasses.ClickableElement, styles.DeleteIconContainer)} onClick={() => onDeleteRule(ruleIndex)}>
                <DeleteIconV2 className={styles.DeleteIcon} role={ARIA_ROLES.IMG} ariaLabel="Delete" />
              </button>
            </div>
        </td>
        </tr>
        {
          NEXT_LINE_OPERAND.includes(selectedOperator?.operand_field) ? (
            <tr>
              <td colSpan={1}>{EMPTY_STRING}</td>
              <td colSpan={2} className={cx(styles.QueryPadTop, gClasses.PR15)}>
                <RValue
                  label={t(ALL_LABELS.VALUES)}
                  className={cx(gClasses.Flex1)}
                  labelClassName={cx(BS.MARGIN_0)}
                  errorRValue={getErrorMessage(ALL_KEYS.R_VALUE)}
                  rValue={r_value}
                  onRValueChangeHandler={(event) => onChangeHandler(generateEventTargetObject(ALL_KEYS.R_VALUE, event), ruleIndex)}
                  selectedFieldInfo={selectedField}
                  selectedOperatorInfo={selectedOperator}
                  ruleError={getErrorMessage(ALL_KEYS.R_VALUE, true)}
                  isFromQueryBuilder
                />
              </td>
            </tr>
          ) : null
        }
      </>
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
