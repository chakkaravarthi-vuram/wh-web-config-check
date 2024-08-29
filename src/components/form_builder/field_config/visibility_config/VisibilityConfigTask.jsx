import React, { useEffect, useContext, useState } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-cycle
import QueryBuilder from 'components/query_builder/QueryBuilder';
import { QUERY_BUILDER_INITIAL_STATE } from 'components/query_builder/QueryBuilder.strings';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import FormBuilderContext from '../../FormBuilderContext';

import CheckboxGroup from '../../../form_components/checkbox_group/CheckboxGroup';
import { BS } from '../../../../utils/UIConstants';
import { FIELD_CONFIG } from '../../FormBuilder.strings';
import jsUtils, {
  isEmpty,
} from '../../../../utils/jsUtility';

import gClasses from '../../../../scss/Typography.module.scss';
import {
  FIELD_KEYS,
  FIELD_LIST_TYPE,
  FIELD_TYPE,
  FORM_PARENT_MODULE_TYPES,
  INITIAL_PAGE,
  MAX_PAGINATION_SIZE,
  MULTIPLE_RULE_CONDTION_ALLOWED_FIELDS,
} from '../../../../utils/constants/form.constant';
import {
  getVisibilityExternalFieldsData,
  getVisibilityExternalFieldsDropdownList,
  getVisibilityExternalFieldsErrors,
  getVisibilityExternalFieldsHasMore,
  getVisibilityExternalFieldsLoadingStatus,
  getVisibilityExternalFieldsPaginationDetails,
  getVisibilityOperatorsData,
  getVisibilityOperatorsDropdownList,
  getVisibilityOperatorsErrors,
  getVisibilityOperatorsLoadingStatus,
} from '../../../../redux/reducer';

import RadioGroup, {
  RADIO_GROUP_TYPE,
} from '../../../form_components/radio_group/RadioGroup';
import { updateTableColConditionList } from '../../../../redux/actions/Visibility.Action';

function VisibilityConfigTask(props) {
  const { getVisibilityExternalFields, parentModuleType } =
    useContext(FormBuilderContext);
  const {
    externalFieldsDropdownList,
    externalFieldsDropdownData,
    onShowWhenRule,
    onFieldVisibleRule,
    isShowWhenRule,
    serverEntityUuid,
    ruleId,
    onVisibilityChangeHandler,
    getRuleDetailsById,
    isVisible,
    hideFieldIfNull,
    onHideFieldIfNull,
    fieldType,
    fieldListType,
    tableUuid,
    readOnly,
    expression,
    previous_expression,
    rule_expression_has_validation,
    externalFieldsPaginationDetails,
    tableColConditionList = [],
  } = props;
  const { t } = useTranslation();

  const { VISIBILITY_CONFIG } = FIELD_CONFIG(t);
  const HIDE_FIELD_IF_NULL_BLOCKLIST_FIELDS = [FIELD_TYPE.INFORMATION, FIELD_TYPE.TABLE];
  const HIDE_FIELD_IF_NULL_BLOCKLIST_MODULES = [FORM_PARENT_MODULE_TYPES.TASK, FORM_PARENT_MODULE_TYPES.DATA_LIST];
  const [isLoading, setIsLoading] = useState(true);
  const loadAllFields = (page, isSearch = false, searchText = EMPTY_STRING) => {
    const paginationData = {
      // search: '',
      page: page || INITIAL_PAGE,
      size: MAX_PAGINATION_SIZE,
      field_list_type: FIELD_LIST_TYPE.DIRECT,
      // sort_field: '',
      sort_by: 1,
      allowed_field_types: MULTIPLE_RULE_CONDTION_ALLOWED_FIELDS,
      include_property_picker: 1,
    };
    if (isSearch && searchText) paginationData.search = searchText;
    if (fieldListType === FIELD_LIST_TYPE.TABLE && fieldType !== FIELD_TYPE.INFORMATION) {
      paginationData.include_table_fields = 1;
      paginationData.table_uuid = tableUuid;
    }
    getVisibilityExternalFields(paginationData).then(() => setIsLoading(false));
  };

  useEffect(() => {
    loadAllFields();
    if (isShowWhenRule && ruleId) {
    if (isEmpty(previous_expression)) getRuleDetailsById(false);
    else getRuleDetailsById(true);
    }
  }, []);

  const enableShowWhenRuleForField = () => {
    let visibilityConditionState = QUERY_BUILDER_INITIAL_STATE;
    if (isShowWhenRule) {
      const { updateTableColConditionList } = props;
      visibilityConditionState = {};
      updateTableColConditionList([]);
    }
    onVisibilityChangeHandler(FIELD_KEYS.RULE_EXPRESSION, visibilityConditionState);
    onShowWhenRule();
  };

  const enableHideFieldIfNull = () => {
    onHideFieldIfNull();
  };

  const onLoadMoreCallHandler = () => {
    console.log('LLSSLSLS0');
    const pagination_data = jsUtils.get(externalFieldsDropdownData, ['pagination_data'], []);
    if (externalFieldsPaginationDetails && pagination_data) {
      if (externalFieldsPaginationDetails.total_count > pagination_data.length) {
        const page = jsUtils.get(externalFieldsPaginationDetails, ['page'], 0) + 1;
        loadAllFields(page, true);
      }
    }
  };

  const onSearchExternalFields = (searchText, page) => {
    loadAllFields(page || INITIAL_PAGE, true, searchText);
  };

  const updateVisibilityOptions = () => {
    isVisible && onFieldVisibleRule(null);
  };

  const hideDisableFieldOptionList = fieldType === FIELD_TYPE.INFORMATION ? [VISIBILITY_CONFIG.HIDE_DISABLE.OPTION_LIST[0]] : VISIBILITY_CONFIG.HIDE_DISABLE.OPTION_LIST;
  return (
    <>
      {
          isShowWhenRule ?
          (
            <div className={cx(BS.ALERT, BS.ALERT_WARNING, gClasses.FTwo10)}>
              {VISIBILITY_CONFIG.INSTRUCTION}
            </div>
          ) : null
      }
      <CheckboxGroup
        optionList={VISIBILITY_CONFIG.SHOW_HIDE}
        onClick={enableShowWhenRuleForField}
        selectedValues={isShowWhenRule ? [1] : []}
        hideLabel
        readOnly={!!jsUtils.isEmpty(externalFieldsDropdownList)}
      />
      {jsUtils.isEmpty(externalFieldsDropdownList) && !isVisible ? (
        <p className={gClasses.FOne13GrayV14}>No fields found</p>
      ) : null}
      {isShowWhenRule && (
        <div>
            <QueryBuilder
              lstAllFields={externalFieldsDropdownList}
              ruleExpression={expression}
              updateExpressionInReduxFn={(updatedExpression) => onVisibilityChangeHandler(FIELD_KEYS.RULE_EXPRESSION, updatedExpression)}
              has_validation={rule_expression_has_validation}
              serverEntityUUID={serverEntityUuid}
              isLoading={isLoading}
              onLoadMoreExternalFields={onLoadMoreCallHandler}
              onSearchExternalFields={onSearchExternalFields}
              maxNestedLevel={4}
              isVisibilityConfig
              updateVisibilityOptions={updateVisibilityOptions}
            />
            <RadioGroup
              id={VISIBILITY_CONFIG.HIDE_DISABLE.id}
              type={RADIO_GROUP_TYPE.TYPE_5}
              className={gClasses.MT15}
              hideLabel
              optionList={hideDisableFieldOptionList}
              placeholder={VISIBILITY_CONFIG.OPERATOR.PLACEHOLDER}
              selectedValue={isVisible}
              onClick={(value) => {
                value === isVisible || value === null
                  ? null
                  : onFieldVisibleRule(value);
              }}
              readOnly={!isEmpty(tableColConditionList)}
            />
        </div>
      )}
      {
      (
        !HIDE_FIELD_IF_NULL_BLOCKLIST_MODULES.includes(parentModuleType) &&
        !(HIDE_FIELD_IF_NULL_BLOCKLIST_FIELDS.includes(fieldType))
      ) ?
      (
       <RadioGroup
        type={RADIO_GROUP_TYPE.TYPE_5}
        optionList={VISIBILITY_CONFIG.HIDE_VALUE_IF_NULL.OPTION_LIST}
        onClick={enableHideFieldIfNull}
        selectedValue={!!hideFieldIfNull}
        label={VISIBILITY_CONFIG.HIDE_VALUE_IF_NULL.LABEL}
        readOnly={!readOnly}
       />
     )
      : null
   }
    </>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    externalFieldsPaginationDetails:
      getVisibilityExternalFieldsPaginationDetails(state),
    externalFieldsDropdownList: getVisibilityExternalFieldsDropdownList(
      state,
      ownProps.serverEntityUuid,
      false,
    ),
    externalFields: getVisibilityExternalFieldsData(state),
    isExternalFieldsLoading: getVisibilityExternalFieldsLoadingStatus(state),
    errors: getVisibilityExternalFieldsErrors(state),
    operatorsDropdownList: getVisibilityOperatorsDropdownList(state),
    operatorsDetailsList: getVisibilityOperatorsData(state),
    operatorsLoading: getVisibilityOperatorsLoadingStatus(state),
    opertorsApiErrors: getVisibilityOperatorsErrors(state),
    hasMore: getVisibilityExternalFieldsHasMore(state),
    externalFieldsDropdownData: state.VisibilityReducer.externalFieldReducer.externalFields,
    tableColConditionList: state.VisibilityReducer.externalFieldReducer.tableColConditionList,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateTableColConditionList: (list) => {
      dispatch(updateTableColConditionList(list));
    },
    dispatch,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VisibilityConfigTask);
VisibilityConfigTask.defaultProps = {
  hideFieldIfNull: false,
};
VisibilityConfigTask.propTypes = {};
