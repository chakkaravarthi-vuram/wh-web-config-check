import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { INITIAL_PAGE, MAX_PAGINATION_SIZE } from 'utils/constants/form.constant';
import { FIELD_LIST_TYPE } from 'utils/ValidationConstants';
import { FIELD_TYPE } from 'utils/constants/form_fields.constant';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import FormBuilderContext from '../../FormBuilderContext';
import ThemeContext from '../../../../hoc/ThemeContext';

import {
  getDefaultRuleExternalFieldsData,
  getDefaultRuleExternalFieldsPaginationDetails,
  getDefaultRuleListErrors, getDefaultRuleLoadingStatus, getDefaultRuleValueDropdownList, getOperatorsInfoByFieldType, getSelectedDefaultValueRuleOperator,
} from '../../../../redux/reducer/index';
import { getConcatWithOptionList, getRoundingOptionList } from '../../../../redux/reducer/DefaultValueRuleReducer';
import { defaultValueRuleOperatorThunk, externalFieldsThunk } from '../../../../redux/actions/DefaultValueRule.Action';

import Dropdown from '../../../form_components/dropdown/Dropdown';

import styles from './DefaultValueRule.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';

import {
  setLValue, setRValueListByIndex,
  addNewRValueToList,
  clearValueList,
  clearFieldValue,
  deleteValueListByIndex,
  isUnaryOperand,
  isAddValueVisible,
  getAllowedFields,
  getExtraOptions,
  isInputAllowed,
  processError,
  getInitialExtraParams,
} from './DefaultValueRule.selectors';

import { BS } from '../../../../utils/UIConstants';
import { isEmpty, get, has, compact } from '../../../../utils/jsUtility';

import FieldValue from './FieldValue';
import { ADD_NEW_R_VALUE, CONCAT_WITH, ROUNDING_LIST, CURRENCY_TYPE, FIELD_LABEL, VALUE_LABEL, OPERATOR_PICKER, DEFAULT_VALUE_CONFIG_STRINGS } from './DefaultValueRule.strings';
import { DEFAULT_CURRENCY_TYPE } from '../../../../utils/constants/currency.constant';
import { getAccountConfigurationDetailsApiService } from '../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { arryToDropdownData, showToastPopover } from '../../../../utils/UtilityFunctions';
import { FORM_POPOVER_STATUS } from '../../../../utils/Constants';
import usePaginationApi from '../../../../hooks/usePaginationApi';

let cancelForExternalFields;
export const getCancelForExternalFields = (c) => { cancelForExternalFields = c; };
function DefaultValueRule(props) {
  const {
    isEnabled, operator, fieldId, fieldUUID, sectionId, fieldType, defaultRuleId, getDefaultRuleByIdApi,
    defaultValueDropdownList, isDefaultListLoading, getExternalFieldsApi, tableUuid, externalFieldsPaginationDetails, externalFields,
    selectedOperatorInfo, savedRValue, savedLValue, extraOptions, operatorsInfo, serverFieldId, isTableField, ruleErrors,
    onDefaultRuleOperatorDropdownHandler,
    onDefaultLValueRuleHandler,
    onDefaultRValueRuleHandler,
    onDefaultExtraOptionsRuleHandler,
    previous_draft_default_rule,
  } = props;
  const { t } = useTranslation();
  const [isLoading, setLoader] = useState(false);
  const [lValue, setLValues] = useState(savedLValue || {});
  const [rValueList, setRValueList] = useState(savedRValue || []);
  const roundingValue = getExtraOptions(extraOptions, ROUNDING_LIST.ID);
  const concatWithValue = getExtraOptions(extraOptions, CONCAT_WITH.ID);
  const [allowedCurrencyList, setAllowedCurrencyList] = useState(
    arryToDropdownData(
    compact([getExtraOptions(extraOptions, CURRENCY_TYPE.ID)]),
    ),
    );
  const [defaultCurrencyType, setDefaultCurrencyType] = useState(DEFAULT_CURRENCY_TYPE);
  const optionList = defaultValueDropdownList;
  const {
    isTaskForm, taskId, isDataListForm,
  } = useContext(FormBuilderContext);
  const { buttonColor } = useContext(ThemeContext);
  const error_list = processError(ruleErrors);
  const onLValueChangeHandler = (value, isField) => {
    const newLValuesList = setLValue({ value, isField });
    setLValues(newLValuesList);
    onDefaultLValueRuleHandler(newLValuesList, fieldId, sectionId);
  };
  const onAddNewClick = () => setRValueList(addNewRValueToList(rValueList, operator));
  const onRValueChange = (value, isField, index) => {
    const newRValueList = setRValueListByIndex(rValueList, index, { value, isField });
    setRValueList(newRValueList);
    onDefaultRValueRuleHandler(newRValueList, fieldId, sectionId);
  };

  const onExtraOptionChangeHandler = (value, id, isInitial = false) => {
    switch (id) {
      case ROUNDING_LIST.ID: {
        onDefaultExtraOptionsRuleHandler({ [ROUNDING_LIST.ID]: value }, isInitial);
        break;
      }
      case CONCAT_WITH.ID: {
        onDefaultExtraOptionsRuleHandler({ [CONCAT_WITH.ID]: value }, isInitial);
        break;
      }
      case CURRENCY_TYPE.ID: {
        onDefaultExtraOptionsRuleHandler({ [CURRENCY_TYPE.ID]: value }, isInitial);
        break;
      }
      default:
        break;
    }
    return true;
  };
  const onRValueDeleteHandler = (index) => {
    const newRValueList = deleteValueListByIndex(rValueList, index);
    setRValueList(newRValueList);
    onDefaultRValueRuleHandler(newRValueList, fieldId, sectionId);
  };

  const onOperatorChange = (event) => {
    if (event.target.value !== operator) {
      setRValueList(clearValueList());
      setLValues(clearFieldValue());
      onDefaultRuleOperatorDropdownHandler(event.target.value, operatorsInfo.find((element) => element.operator === event.target.value, fieldId, sectionId));
    }
  };

  const getExternalFields = (page = null, isSearch = false, searchText = EMPTY_STRING) => {
    let paginationDetails = {
      page: (isSearch) ? INITIAL_PAGE : (page || INITIAL_PAGE),
      size: MAX_PAGINATION_SIZE,
      include_property_picker: 1,
      // is_table: 1,
    };
    if (fieldUUID) paginationDetails.exclude_field_uuids = [fieldUUID];
    if (tableUuid || selectedOperatorInfo?.is_table_field_allowed) {
      paginationDetails = {
        ...paginationDetails,
        field_list_type: FIELD_LIST_TYPE[0],
        ...((tableUuid) ? { table_uuid: tableUuid } : {}),
      };
    } else {
      paginationDetails = {
        ...paginationDetails,
        field_list_type: FIELD_LIST_TYPE[1],
      };
    }
    if (isSearch && searchText) paginationDetails.search = searchText;
    return getExternalFieldsApi(paginationDetails, getAllowedFields(selectedOperatorInfo), taskId, { isTaskForm, isDataListForm });
  };
  const { hasMore, onLoadMoreData: onLoadMoreExternalFields } = usePaginationApi(getExternalFields, {
    paginationDetails: externalFieldsPaginationDetails,
    currentData: externalFields,
    cancelToken: cancelForExternalFields,
  });

  useEffect(() => {
    if (isEnabled && defaultRuleId) {
      setLoader(true);
      getDefaultRuleByIdApi(defaultRuleId, fieldType, !!operator).then((ruleData) => {
        setLoader(false);
       if (!isEmpty(ruleData)) {
        setRValueList(ruleData.rValue);
        setLValues(ruleData.lValue);
        }
      }, () => {
        showToastPopover(
          'Something went wrong',
          'Unable to fetch saved default rule',
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      });
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(selectedOperatorInfo)) {
      getExternalFields();
      if (fieldType === FIELD_TYPE.CURRENCY) {
        getAccountConfigurationDetailsApiService().then((response) => {
          if (response.allowed_currency_types) {
            setAllowedCurrencyList(arryToDropdownData(response.allowed_currency_types));
          }
          if (response.default_currency_type) setDefaultCurrencyType(response.default_currency_type);
          onDefaultExtraOptionsRuleHandler(
              {
                [CURRENCY_TYPE.ID]: response.default_currency_type || defaultCurrencyType,
              },
              !isEmpty(previous_draft_default_rule) && isEmpty(previous_draft_default_rule?.extraOptions),
            );
        }).catch((err) => {
          console.log(err);
        });
      }
    }
  }, [operator]);

  const roundingList = getRoundingOptionList(selectedOperatorInfo);
  const concatWitList = getConcatWithOptionList(selectedOperatorInfo);
  if (isEnabled) {
    const extraParams = {};
    if (roundingList) {
      extraParams.id = ROUNDING_LIST.ID;
      extraParams.label = t(ROUNDING_LIST.LABEL);
      extraParams.optionList = roundingList;
      extraParams.selectedValue = roundingValue;
    } else if (concatWitList) {
      extraParams.id = CONCAT_WITH.ID;
      extraParams.label = t(CONCAT_WITH.LABEL);
      extraParams.optionList = concatWitList;
      extraParams.selectedValue = concatWithValue;
    } else if (!isEmpty(allowedCurrencyList)) {
      extraParams.id = CURRENCY_TYPE.ID;
      extraParams.label = t(CURRENCY_TYPE.LABEL);
      extraParams.optionList = allowedCurrencyList;
      extraParams.selectedValue = getExtraOptions(extraOptions, CURRENCY_TYPE.ID) || defaultCurrencyType;
    }
    if (
      has(extraParams, ['selectedValue']) &&
      extraParams.selectedValue === null &&
      [ROUNDING_LIST.ID, CONCAT_WITH.ID].includes(extraParams.id)
      ) {
      onExtraOptionChangeHandler(
        getInitialExtraParams(extraParams.optionList, extraParams.id),
        extraParams.id,
        !isEmpty(previous_draft_default_rule) && isEmpty(previous_draft_default_rule?.extraOptions),
        );
    }
    console.log(extraParams, 'extraParams extraParams extraParams');
    const comp = (
      <>
        <Row>
          <Col xl={isEmpty(extraParams) ? 10 : 6} sm={10}>
            <Dropdown
              id={OPERATOR_PICKER.ID}
              onChange={onOperatorChange}
              selectedValue={operator}
              optionList={optionList}
              isDataLoading={isDefaultListLoading || isLoading}
              label={t(OPERATOR_PICKER.LABEL)}
              errorMessage={error_list[OPERATOR_PICKER.ID]}
              showNoDataFoundOption
              noDataFoundOptionLabel={t(DEFAULT_VALUE_CONFIG_STRINGS.NO_FIELDS)}
              disablePopper
            />
          </Col>
          {!isEmpty(extraParams) ? (
            <Col xl={6} sm={11}>
              {fieldType !== FIELD_TYPE.CURRENCY && <Dropdown
                onChange={(event) => onExtraOptionChangeHandler(event.target.value, extraParams.id)}
                isDataLoading={isLoading}
                selectedValue={extraParams.selectedValue}
                id={extraParams.id}
                label={extraParams.label}
                hideMessage
                optionList={extraParams.optionList}
                disablePopper
              />}
            </Col>
          ) : null }
        </Row>
        {operator ? (
          <Row>
              <Col xl={11} sm={11}>
                <FieldValue
                  id={FIELD_LABEL().ID}
                  tableUuid={tableUuid}
                  value={lValue}
                  operator={operator}
                  onChangeHandler={onLValueChangeHandler}
                  serverFieldId={serverFieldId}
                  isTableField={isTableField}
                  selectedOperatorInfo={selectedOperatorInfo}
                  isInputAllowed={isInputAllowed(selectedOperatorInfo)}
                  error_list={get(error_list, [FIELD_LABEL().ID])}
                  onLoadMoreExternalFields={onLoadMoreExternalFields}
                  onSearchExternalFields={getExternalFields}
                  hasMore={hasMore}
                  isInitialLoading={isLoading}
                />
              </Col>
          </Row>
        ) : null}
        { !isEmpty(selectedOperatorInfo) && !isUnaryOperand(selectedOperatorInfo) ? (
          rValueList.map((value, index) => (
            <Row>
              <Col xl={11} sm={11}>
                <FieldValue
                  isRValue
                  id={VALUE_LABEL(t).ID}
                  operator={operator}
                  tableUuid={tableUuid}
                  value={value}
                  onChangeHandler={(_value, isField) => onRValueChange(_value, isField, index)}
                  serverFieldId={serverFieldId}
                  isInputAllowed={isInputAllowed(selectedOperatorInfo)}
                  selectedOperatorInfo={selectedOperatorInfo}
                  isTableField={isTableField}
                  error_list={get(error_list, [VALUE_LABEL(t).ID, index])}
                  onLoadMoreExternalFields={onLoadMoreExternalFields}
                  onSearchExternalFields={getExternalFields}
                  hasMore={hasMore}
                  isInitialLoading={isLoading}
                />
              </Col>
              { isAddValueVisible(selectedOperatorInfo) && rValueList.length > 1 ? (
                <div className={cx(styles.DeleteIconContainer, BS.D_FLEX, BS.JC_CENTER, BS.ALIGN_ITEM_CENTER)}>
                  <DeleteIconV2
                    className={styles.DeleteIcon}
                    onClick={() => onRValueDeleteHandler(index)}
                  />
                </div>
              ) : null}
            </Row>
          ))
        ) : null }
        { isAddValueVisible(selectedOperatorInfo) ? (
          <Row>
            <Col xl={6} sm={6}>
              <div
                className={cx(BS.ML_AUTO, gClasses.CursorPointer, gClasses.FTwo13, gClasses.MB10)}
                onClick={onAddNewClick}
                id={ADD_NEW_R_VALUE.ID}
                role="presentation"
                style={{ color: buttonColor }}
              >
                {t(ADD_NEW_R_VALUE.LABEL)}
              </div>
            </Col>
          </Row>
        ) : null}
      </>
    );
    return comp;
  }
  return null;
}
const mapStateToProps = (state, ownProps) => {
  return {
    defaultValueDropdownList: getDefaultRuleValueDropdownList(state, ownProps.fieldType, ownProps.isTableField),
    isDefaultListLoading: getDefaultRuleLoadingStatus(state),
    errors: getDefaultRuleListErrors(state),
    selectedOperatorInfo: getSelectedDefaultValueRuleOperator(state, ownProps.operator, ownProps.fieldType),
    operatorsInfo: getOperatorsInfoByFieldType(state, ownProps.fieldType),
    externalFieldsPaginationDetails: getDefaultRuleExternalFieldsPaginationDetails(state),
    externalFields: getDefaultRuleExternalFieldsData(state),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    defaultValueApi: (fieldType) => dispatch(defaultValueRuleOperatorThunk(fieldType)),
    getExternalFieldsApi: (paginationDetails, allowedField, id, { isTaskForm, isDataListForm }) => dispatch(externalFieldsThunk(paginationDetails, allowedField, id, { isTaskForm, isDataListForm })),
    getDefaultRuleByIdApi: (ruleId, fieldType, onlyUpdateFieldMetadata) => dispatch(ownProps.getDefaultRuleByIdApiThunk(ruleId, fieldType, onlyUpdateFieldMetadata)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultValueRule);

DefaultValueRule.defaultProps = {
  isEnabled: false,
};

DefaultValueRule.propTypes = {
  isEnabled: PropTypes.bool,
};
