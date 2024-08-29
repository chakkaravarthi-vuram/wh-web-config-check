import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CheckboxGroup from '../../../../../components/form_components/checkbox_group/CheckboxGroup';
import Dropdown from '../../../../../components/form_components/dropdown/Dropdown';

import jsUtility, { get, isEmpty, find } from '../../../../../utils/jsUtility';
import gClasses from '../../../../../scss/Typography.module.scss';
import { GET_ALL_FIELDS_LIST_BY_FILTER_TYPES, FLOW_STRINGS } from '../../../Flow.strings';
import styles from './Identifier.module.scss';
import { getAllFieldsListApiThunk } from '../../../../../redux/actions/CreateDataList.action';
import { dataListStateChangeAction } from '../../../../../redux/reducer/CreateDataListReducer';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { CUSTOM_IDENTIFIER_IGNORE_FIELD_TYPES, FIELD_LIST_TYPE, INITIAL_PAGE, MAX_PAGINATION_SIZE } from '../../../../../utils/constants/form.constant';

function Identifier(props) {
  const {
    is_system_identifier,
    custom_identifier,
    onDataListStateChange,
    error_list,
    onGetAllFieldsList,
    data_list_id,
    allIdentifierFields,
    hasMore,
    identifierCurrentPage,
    selected_identifier,

  } = props;

  const { t } = useTranslation();
  const { CREATE_FLOW } = FLOW_STRINGS(t);

  const onChangeHandler = (event) => {
    const value = get(event, ['target', 'value'], null);
    const id = get(event, ['target', 'id'], null);
    if (get(error_list, ['custom_identifier'])) {
      const errorList = jsUtility.cloneDeep(error_list);
      delete errorList.custom_identifier;
      onDataListStateChange(errorList, 'error_list');
    }

    const selectedField = (find(allIdentifierFields, (field) => field.field_uuid === value));
    if (selectedField !== -1) onDataListStateChange(selectedField.label, 'selected_identifier');
    onDataListStateChange(value, id);
  };

  const [flag, setFlag] = useState(true);
  useEffect(() => {
    if (!is_system_identifier && flag) {
      const params = {
        page: INITIAL_PAGE,
        size: MAX_PAGINATION_SIZE,
        sort_by: 1,
        data_list_id,
        ignore_field_types: CUSTOM_IDENTIFIER_IGNORE_FIELD_TYPES,
        field_list_type: FIELD_LIST_TYPE.DIRECT,
      };
      onGetAllFieldsList(params, GET_ALL_FIELDS_LIST_BY_FILTER_TYPES.IDENTIFIERS);
      setFlag(false);
    }
  }, [is_system_identifier]);

  const onLoadMoreHandler = (isSearch = false, searchText = EMPTY_STRING) => {
    const params = {
      page: (isSearch) ? INITIAL_PAGE : identifierCurrentPage + 1,
      size: MAX_PAGINATION_SIZE,
      sort_by: 1,
      data_list_id,
      ignore_field_types: CUSTOM_IDENTIFIER_IGNORE_FIELD_TYPES,
      field_list_type: FIELD_LIST_TYPE.DIRECT,
    };
    if (isSearch && searchText) params.search = searchText;
    onGetAllFieldsList(params, GET_ALL_FIELDS_LIST_BY_FILTER_TYPES.IDENTIFIERS, true);
    setFlag(false);
  };

  let hasSelectedCustomIdentifier = false;

  hasSelectedCustomIdentifier = !isEmpty(allIdentifierFields) &&
    allIdentifierFields.some((eachField) => eachField.field_uuid === custom_identifier);

  return (
    <>
      <Dropdown
        id={CREATE_FLOW.SETTINGS.IDENTIFIER.DROPDOWN.ID}
        label={CREATE_FLOW.SETTINGS.IDENTIFIER.DROPDOWN.DATALIST_LABEL}
        innerClassName={styles.Identifier}
        optionList={allIdentifierFields}
        onChange={onChangeHandler}
        selectedValue={hasSelectedCustomIdentifier ? custom_identifier : selected_identifier}
        disabled={is_system_identifier}
        enableSearch
        strictlySetSelectedValue
        disableFocusFilter
        errorMessage={get(error_list, ['custom_identifier'])}
        hideMessage={!get(error_list, ['custom_identifier'])}
        showNoDataFoundOption
        isPaginated
        loadDataHandler={() => onLoadMoreHandler()}
        onSearchInputChange={(searchText) => onLoadMoreHandler(true, searchText)}
        hasMore={hasMore}
      />
      <CheckboxGroup
        optionList={CREATE_FLOW.SETTINGS.IDENTIFIER.CHECKBOX.OPTIONS}
        onClick={() => {
          onDataListStateChange(!is_system_identifier, CREATE_FLOW.SETTINGS.IDENTIFIER.CHECKBOX.ID);
        }}
        selectedValues={
          is_system_identifier ? [CREATE_FLOW.SETTINGS.IDENTIFIER.CHECKBOX.OPTIONS?.[0]?.value] : []
        }
        className={cx(gClasses.MT10, gClasses.MB12)}
        hideLabel
        CorrectIconStyles={styles.CorrectIconStyles}
      />
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    is_system_identifier: state.CreateDataListReducer.is_system_identifier,
    custom_identifier: state.CreateDataListReducer.custom_identifier,
    selected_identifier: state.CreateDataListReducer.selected_identifier,
    error_list: state.CreateDataListReducer.error_list,
    data_list_id: state.CreateDataListReducer.data_list_id,
    allIdentifierFields: state.CreateDataListReducer.allIdentifierFields,
    identifierCurrentPage: state.CreateDataListReducer.identifierCurrentPage,
    hasMore: state.CreateDataListReducer.hasMore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDataListStateChange: (data, id) => {
      dispatch(dataListStateChangeAction(data, id));
    },
    onGetAllFieldsList: (...params) => {
      dispatch(getAllFieldsListApiThunk(...params));
    },
  };
};
Identifier.defaultProps = {
  is_system_identifier: true,
  custom_identifier: EMPTY_STRING,
  error_list: {},
  data_list_id: EMPTY_STRING,
  allIdentifierFields: [],
};
Identifier.propTypes = {
  is_system_identifier: PropTypes.bool,
  setDataInsideFlowDataAction: PropTypes.func.isRequired,
  custom_identifier: PropTypes.string,
  error_list: PropTypes.oneOfType(PropTypes.object, PropTypes.array),
  onGetAllFieldsList: PropTypes.func.isRequired,
  data_list_id: PropTypes.string,
  allIdentifierFields: PropTypes.arrayOf(PropTypes.object),
};
export default connect(mapStateToProps, mapDispatchToProps)(Identifier);
