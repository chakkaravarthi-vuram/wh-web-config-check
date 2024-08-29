import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import PlusIconBlueNew from 'assets/icons/PlusIconBlueNew';

import jsUtility, { get, isEmpty, find, has, cloneDeep, set } from 'utils/jsUtility';
import gClasses from 'scss/Typography.module.scss';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { getAllFieldsList } from 'redux/actions/EditFlow.Action';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import { GET_ALL_FIELDS_LIST_BY_FILTER_TYPES, FLOW_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import { CUSTOM_IDENTIFIER_IGNORE_FIELD_TYPES, FIELD_LIST_TYPE, INITIAL_PAGE, MAX_PAGINATION_SIZE, TASK_IDENTIFIER_IGNORE_FIELD_TYPES } from 'utils/constants/form.constant';
import { useTranslation } from 'react-i18next';
import { Checkbox, ECheckboxSize, ETextSize, SingleDropdown, Text } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './Identifier.module.scss';

let cancelTokenForTaskIdentifier;
let cancelTokenForUniqueIdentifier;

const setCancelTokenForTaskIdentifier = (c) => {
  cancelTokenForTaskIdentifier = c;
};
const setCancelTokenForUniqueIdentifier = (c) => {
  cancelTokenForUniqueIdentifier = c;
};

function Identifier(props) {
  const {
    is_system_identifier,
    custom_identifier = {},
    task_identifier = [],
    setDataInsideFlowDataAction,
    error_list,
    onGetAllFieldsList,
    flow_id,
    allIdentifierFields,
    isAllFieldsLoading,
    allTaskIdentifierFields = [],
    identifierCurrentPage,
    taskIdentifierCurrentPage,
    hasMore,
    hasMoreFlowIdentifier,
  } = props;
  const [isAddField, setIsAddField] = useState(false);
  const [searchText, setSearchText] = useState();
  const { t } = useTranslation();

  const loadTaskIdentifierFields = (params, isInitialLoad) => {
    const queryParams = {
      size: MAX_PAGINATION_SIZE,
      sort_by: 1,
      flow_id,
      ignore_field_types: TASK_IDENTIFIER_IGNORE_FIELD_TYPES,
      field_list_type: FIELD_LIST_TYPE.DIRECT,
      include_property_picker: 1,
      ...params,
    };
    if (has(queryParams, 'search')) {
      setSearchText(queryParams.search);
    } else if (isInitialLoad) {
      setSearchText(EMPTY_STRING);
    } else if (searchText) {
      queryParams.search = searchText;
    }
    if (isEmpty(queryParams?.search)) delete queryParams?.search;
    onGetAllFieldsList(
      queryParams,
      GET_ALL_FIELDS_LIST_BY_FILTER_TYPES.TASK_IDENTIFIERS,
      queryParams.page > 1 || queryParams.search,
      setCancelTokenForTaskIdentifier,
      cancelTokenForTaskIdentifier,
    );
  };

  const loadIdentifierFields = (params, isInitialLoad) => {
    const queryParams = {
      size: MAX_PAGINATION_SIZE,
      sort_by: 1,
      flow_id,
      ignore_field_types: CUSTOM_IDENTIFIER_IGNORE_FIELD_TYPES,
      field_list_type: FIELD_LIST_TYPE.DIRECT,
      ...params,
    };
    if (has(queryParams, 'search')) {
      setSearchText(queryParams.search);
    } else if (isInitialLoad) {
      setSearchText(EMPTY_STRING);
    } else if (searchText) {
      queryParams.search = searchText;
    }
    if (isEmpty(queryParams?.search)) delete queryParams?.search;
    onGetAllFieldsList(
      queryParams,
      GET_ALL_FIELDS_LIST_BY_FILTER_TYPES.IDENTIFIERS,
      queryParams.page > 1 || queryParams.search,
      setCancelTokenForUniqueIdentifier,
      cancelTokenForUniqueIdentifier,
    );
  };
  const onChangeHandler = (value, _label, _list, id) => {
    const errorList = jsUtility.cloneDeep(error_list);
    const selectedField = (find(_list, (field) => field.value === value));
    const consolidatedData = {
      [id]: selectedField,
    };
    if (get(errorList, ['custom_identifier'])) {
      delete errorList.custom_identifier;
      consolidatedData.error_list = errorList;
    }
    setDataInsideFlowDataAction(consolidatedData);
  };

  const updateSystemIdentifierState = () => {
    const errorList = jsUtility.cloneDeep(error_list);
    if (!is_system_identifier) {
      if (!isEmpty(errorList?.custom_identifier)) {
        delete errorList.custom_identifier;
      }
    }
    setDataInsideFlowDataAction({
      [FLOW_STRINGS.SETTINGS.IDENTIFIER.CHECKBOX.ID]: !is_system_identifier,
      error_list: errorList,
    });
  };

  const setTaskIdentifier = (value, id, index) => {
    const errorList = jsUtility.cloneDeep(error_list);
    const selectedField = (find(allTaskIdentifierFields, (field) => field.field_uuid === value));
    const taskIdentifiers = cloneDeep(task_identifier || []);
    if (errorList?.[id]?.[index]) {
      delete errorList[id][index];
    }
    set(taskIdentifiers, index, selectedField);
    return setDataInsideFlowDataAction({
      [id]: taskIdentifiers,
      error_list: errorList,
    });
  };

  return (
    <>
      <div>
        <div>
          <SingleDropdown
            dropdownViewProps={{
              labelName: t(FLOW_STRINGS.SETTINGS.IDENTIFIER.DROPDOWN.LABEL),
              disabled: is_system_identifier,
              onClick: () => loadIdentifierFields({ page: INITIAL_PAGE }, true),
              onKeyDown: () => loadIdentifierFields({ page: INITIAL_PAGE }, true),
              selectedLabel: custom_identifier?.label,
            }}
            required={!is_system_identifier}
            id={FLOW_STRINGS.SETTINGS.IDENTIFIER.DROPDOWN.ID}
            optionList={cloneDeep(allIdentifierFields)}
            isLoadingOptions={isAllFieldsLoading}
            onClick={onChangeHandler}
            selectedValue={custom_identifier?.field_uuid}
            errorMessage={get(error_list, ['custom_identifier'])}
            infiniteScrollProps={{
              hasMore: hasMoreFlowIdentifier,
              next: () => loadIdentifierFields({ page: identifierCurrentPage + 1 }),
              dataLength: allIdentifierFields?.length,
              scrollableId: `scrollable-${FLOW_STRINGS.SETTINGS.IDENTIFIER.DROPDOWN.ID}`,
            }}
            searchProps={{
              onChangeSearch: (event) => loadIdentifierFields({ page: INITIAL_PAGE, search: event?.target?.value }),
              searchValue: searchText,
            }}
          />
        </div>
      </div>
      <Checkbox
        className={cx(gClasses.MT10, gClasses.MB16)}
        isValueSelected={is_system_identifier}
        details={FLOW_STRINGS.SETTINGS.IDENTIFIER.CHECKBOX.OPTIONS}
        size={ECheckboxSize.SM}
        onClick={updateSystemIdentifierState}
      />

      <Text
        size={ETextSize.SM}
        content={t(FLOW_STRINGS.SETTINGS.TASK_IDENTIFIER.DROPDOWN.LABEL)}
      />
      <div className={cx(gClasses.DisplayFlex, styles.AlignItems)}>
        <div className={cx(gClasses.MT5, styles.DropdownWrapper)}>
          <SingleDropdown
            id={FLOW_STRINGS.SETTINGS.TASK_IDENTIFIER.DROPDOWN.ID}
            dropdownViewProps={{
              onClick: () => loadTaskIdentifierFields({ page: INITIAL_PAGE }, true),
              onKeyDown: () => loadTaskIdentifierFields({ page: INITIAL_PAGE }, true),
              selectedLabel: task_identifier?.[0]?.label,
            }}
            optionList={cloneDeep(allTaskIdentifierFields).filter((field) => field.field_uuid !== task_identifier?.[1]?.field_uuid)}
            isLoadingOptions={isAllFieldsLoading}
            onClick={(value, _label, _list, id) =>
              setTaskIdentifier(value, id, 0)}
            selectedValue={task_identifier?.[0]?.field_uuid}
            errorMessage={get(error_list, [FLOW_STRINGS.SETTINGS.TASK_IDENTIFIER.DROPDOWN.ID, 0], null)}
            infiniteScrollProps={{
              hasMore: hasMore,
              next: () => loadTaskIdentifierFields({ page: taskIdentifierCurrentPage + 1 }),
              dataLength: allIdentifierFields?.length,
              scrollableId: `scrollable-${FLOW_STRINGS.SETTINGS.TASK_IDENTIFIER.DROPDOWN.ID}-1`,
            }}
            searchProps={{
              onChangeSearch: (event) => loadTaskIdentifierFields({ page: INITIAL_PAGE, search: event?.target?.value }),
              searchValue: searchText,
            }}
          />
        </div>
        {(!isAddField && task_identifier.length < 2) ?
          (
            <div className={cx(gClasses.PositionRelative, gClasses.DisplayFlex, gClasses.MT5, gClasses.ML20)}>
              <button
                id={FLOW_STRINGS.SETTINGS.TASK_IDENTIFIER.ADD_FIELDS_BUTTON_ID}
                className={cx(
                  gClasses.CenterV,
                  gClasses.ClickableElement,
                  gClasses.CursorPointer,
                  gClasses.PositionRelative,
                )}
                onClick={() => setIsAddField(!isAddField)}
              >
                <PlusIconBlueNew className={cx(styles.AddIcon, gClasses.MR5)} />
                <div className={gClasses.FlexGrow1}>
                  <div
                    className={cx(
                      gClasses.FTwo13,
                      gClasses.FontWeight500,
                    )}
                    style={{ color: '#217CF5' }}
                  >
                    {t(FLOW_STRINGS.SETTINGS.TASK_IDENTIFIER.ADD_FIELDS_LABEL)}
                  </div>
                </div>
              </button>
            </div>
          ) : null
        }
        {((task_identifier && task_identifier[1]) || isAddField) &&
          (
            <div className={cx(gClasses.MT5, gClasses.ML20, styles.DropdownWrapper)}>
              <SingleDropdown
                id={FLOW_STRINGS.SETTINGS.TASK_IDENTIFIER.DROPDOWN.ID}
                dropdownViewProps={{
                  onClick: () => loadTaskIdentifierFields({ page: INITIAL_PAGE }, true),
                  onKeyDown: () => loadTaskIdentifierFields({ page: INITIAL_PAGE }, true),
                  selectedLabel: task_identifier?.[1]?.label,
                }}
                optionList={cloneDeep(allTaskIdentifierFields).filter((field) => field.field_uuid !== task_identifier?.[0]?.field_uuid)}
                isLoadingOptions={isAllFieldsLoading}
                onClick={(value, _label, _list, id) =>
                  setTaskIdentifier(value, id, 1)}
                selectedValue={task_identifier?.[1]?.field_uuid}
                errorMessage={get(error_list, [FLOW_STRINGS.SETTINGS.TASK_IDENTIFIER.DROPDOWN.ID, 0], null)}
                infiniteScrollProps={{
                  hasMore: hasMore,
                  next: () => loadTaskIdentifierFields({ page: taskIdentifierCurrentPage + 1 }),
                  dataLength: allIdentifierFields?.length,
                  scrollableId: `scrollable-${FLOW_STRINGS.SETTINGS.TASK_IDENTIFIER.DROPDOWN.ID}-2`,
                }}
                searchProps={{
                  onChangeSearch: (event) => loadTaskIdentifierFields({ page: INITIAL_PAGE, search: event?.target?.value }),
                  searchValue: searchText,
                }}
              />
            </div>
          )
        }
        <Text
          className={cx(gClasses.MT15, gClasses.ML20)}
          content={t(FLOW_STRINGS.SETTINGS.TASK_IDENTIFIER.STEP_NAME_LABEL)}
        />
      </div>
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    is_system_identifier: state.EditFlowReducer.flowData.is_system_identifier,
    custom_identifier: state.EditFlowReducer.flowData.custom_identifier,
    task_identifier: state.EditFlowReducer.flowData.task_identifier,
    error_list: state.EditFlowReducer.flowData.error_list,
    flow_id: state.EditFlowReducer.flowData.flow_id,
    allIdentifierFields: state.EditFlowReducer.flowData.allIdentifierFields,
    allTaskIdentifierFields: state.EditFlowReducer.flowData.allTaskIdentifierFields,
    isAllFieldsLoading: state.EditFlowReducer.flowData.isAllFieldsLoading,
    identifierCurrentPage: state.EditFlowReducer.flowData.identifierCurrentPage,
    taskIdentifierCurrentPage: state.EditFlowReducer.flowData.taskIdentifierCurrentPage,
    hasMore: state.EditFlowReducer.flowData.hasMore,
    flowData: state.EditFlowReducer.flowData,
    hasMoreFlowIdentifier: state.EditFlowReducer.flowData.hasMoreFlowIdentifier,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDataInsideFlowDataAction: (flowData) => {
      dispatch(updateFlowDataChange(flowData));
    },
    onGetAllFieldsList: (...params) => {
      dispatch(getAllFieldsList(...params));
    },
  };
};
Identifier.defaultProps = {
  is_system_identifier: true,
  custom_identifier: EMPTY_STRING,
  error_list: {},
  flow_id: EMPTY_STRING,
  allIdentifierFields: [],
  allTaskIdentifierFields: [],
  hasMoreFlowIdentifier: false,
};
Identifier.propTypes = {
  is_system_identifier: PropTypes.bool,
  setDataInsideFlowDataAction: PropTypes.func.isRequired,
  custom_identifier: PropTypes.string,
  error_list: PropTypes.oneOfType(PropTypes.object, PropTypes.array),
  onGetAllFieldsList: PropTypes.func.isRequired,
  flow_id: PropTypes.string,
  allIdentifierFields: PropTypes.arrayOf(PropTypes.object),
  allTaskIdentifierFields: PropTypes.arrayOf(PropTypes.object),
  hasMoreFlowIdentifier: PropTypes.bool,
};
export default connect(mapStateToProps, mapDispatchToProps)(Identifier);
