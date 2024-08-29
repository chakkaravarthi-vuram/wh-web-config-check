import {
  Checkbox,
  EPopperPlacements,
  ETextSize,
  Label,
  RadioGroup,
  RadioGroupLayout,
  SingleDropdown,
  Size,
  Text,
  TextInput,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { isEmpty, cloneDeep } from 'utils/jsUtility';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  DATALIST_STRINGS,
  EXTERNAL_SOURCE_STRINGS,
} from '../ExternalSource.strings';
import { generateEventTargetObject } from '../../../../utils/generatorUtils';
import {
  externalSourceDataChange,
  useExternalSource,
} from '../useExternalSource';
import {
  DATA_LIST_CONSTANTS,
  DL_QUERY_IGNORED_FIELD_TYPES,
  FIELD_IDS,
  MULTIPLE_ENTRY_TYPES,
  OUTPUT_FORMAT_CONSTANTS,
  SORTABLE_ALLOWED_FIELD_TYPES,
  getDefaultKeyLabels,
} from '../ExternalSource.constants';
import { getAllPaginationList } from '../useExternalSource.action';
import { getAllViewDataList } from '../../../../axios/apiService/dataList.apiService';
import styles from './DatalistData.module.scss';
// apiGetAllSystemFieldsList
import { apiGetAllFieldsList, getAllFields } from '../../../../axios/apiService/flow.apiService';
import {
} from '../../../edit_flow/step_configuration/StepConfiguration.utils';
import {
  deleteErrorListWithId,
  getFieldsForTableSubQuery,
  getTableTypeFieldsForTableSubQuery,
} from '../ExternalSource.utils';
import { FIELD_LIST_TYPE } from '../../../../utils/constants/form.constant';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import {
  clearAlertPopOverStatus,
  updateAlertPopverStatus,
} from '../../../../utils/UtilityFunctions';
import UpdateConfirmPopover from '../../../../components/update_confirm_popover/UpdateConfirmPopover';
import BigAlertIcon from '../../../../assets/icons/BigAlertNew';
import DatalistOutputFormat from '../components/datalist_output_format/DatalistOutputFormat';
import ExternalSourceFilter from '../components/filter/ExternalSourceFilter';
import { MODULE_TYPES, SORT_BY } from '../../../../utils/Constants';
import { getExpressionInitialStateForCBWithMapping } from '../../../../components/condition_builder_with_field_mapping/ConditionBuilderWithFieldMapping.utils';
import { getExternalFieldsOnSuccess } from '../../../../redux/actions/Visibility.Action';
import NumberField from '../../../../components/form_components/number_field/NumberField';
import { DATA_LIST_SYSTEM_FIELDS_NEW, FLOW_SYSTEM_FIELDS_NEW } from '../../../../utils/constants/systemFields.constant';
import jsUtility from '../../../../utils/jsUtility';

function DatalistData(props) {
  const { dispatch: reduxDispatcher } = props;
  const { state, dispatch } = useExternalSource();

  const {
    isDataListLoading,
    dataList,
    dataListHasMore,
    dataListTotalCount,
    dataListPaginationDetails,
    dataListErrorList,
    dataListCurrentPage,
    filter,
    isFieldListLoading,
    fieldList,
    fieldListHasMore,
    fieldListTotalCount,
    fieldListPaginationDetails,
    fieldListErrorList,
    fieldListCurrentPage,
    isDLFieldListLoading,
    dlFieldList,
    dlFieldListHasMore,
    dlFieldListTotalCount,
    dlFieldListPaginationDetails,
    dlFieldListErrorList,
    dlFieldListCurrentPage,
    errorList,
    outputFormatErrorList,
    taskMetaDataId,
    flowId,
    dataListName,
    ruleId,
    dataListUuid,
    dataListId,
    isRuleDetailsLoading,
    ruleDataListId,
    queryResult,
    outputFormat,
    ruleName,
    type,
    sortOrder,
    selectedDataList,
    sortField,
    // distinctField,
    isLimitFields,
    // systemFields,
  } = state;

  const { t } = useTranslation();
  const history = useHistory();
  const currentDatalistUUId = history?.location?.state?.dataListUuid;

  const [localState, setLocalState] = useState(DATA_LIST_CONSTANTS.LOCAL_STATE);
  const [sortableFields, setSortableFields] = useState({ data: [], paginationDetails: {}, loading: false });
  const [sortableFieldsSearch, setSortableFieldsSearch] = useState(EMPTY_STRING);
  const [tableTypeFields, setTableTypeFields] = useState([]);

  const getDropdownFields = (currentFields = {}, setCurrentFields = () => {}, customParams = {}, page = 1, searchValue = null) => {
    setCurrentFields({
      ...currentFields,
      loading: true,
    });
    const params = {
      page: page,
      size: 1000,
      sort_by: 1,
      data_list_id: selectedDataList?._id || ruleDataListId,
      allowed_field_types: SORTABLE_ALLOWED_FIELD_TYPES,
      ...customParams,
    };
    if (searchValue) params.search = searchValue;
    apiGetAllFieldsList(params)
      .then((data) => {
        const { pagination_data, pagination_details } = data;
        const options = pagination_data?.map((field) => {
          return { ...field, value: field?.field_uuid };
        });
        setCurrentFields({
            loading: false,
            data: [...(pagination_details?.[0]?.page > 1 ? currentFields.data : []), ...options],
            paginationDetails: pagination_details?.[0],
        });
      })
      .catch((err) => {
        setCurrentFields({
          ...currentFields,
          loading: false,
        });
        console.log('getCurrentFields err', err);
      });
  };

  const loadMoreFields = (currentFields = {}, setCurrentFields = () => {}) => {
    if (currentFields.paginationDetails?.page) {
      getDropdownFields(currentFields, setCurrentFields, {}, currentFields.paginationDetails.page + 1 || 1);
    }
  };

  const getDatalists = (search, pageParam) => {
    const params = {
      page: pageParam || dataListCurrentPage || 1,
      size: DATA_LIST_CONSTANTS.DATA_LIST_LISTING.PAGE_SIZE,
      data_list_uuid: currentDatalistUUId,
    };

    if (!isEmpty(search)) params.search = search;

    const integrationState = {
      isDataListLoading,
      dataList,
      dataListHasMore,
      dataListTotalCount,
      dataListPaginationDetails,
      dataListErrorList,
      dataListCurrentPage,
    };

    getAllPaginationList({
      params,
      dispatch,
      currentApiState: integrationState,
      stateKeys: DATA_LIST_CONSTANTS.DATA_LIST_LISTING.STATE_KEYS,
      apiFunc: getAllViewDataList,
      t,
    });
  };

  const loadInitialDataList = () => {
    if (
      (isEmpty(dataList) && !isDataListLoading) ||
      !isEmpty(localState?.listSearch)
    ) {
      getDatalists(EMPTY_STRING, 1);

      setLocalState({
        ...localState,
        listSearch: EMPTY_STRING,
      });
    }
  };

  const getDataListFields = (customParams = {}) => {
    const params = {
      page: 1,
      size: DATA_LIST_CONSTANTS.DATA_LIST_FIELD_LISTING.PAGE_SIZE,
      ...customParams,
    };

    const fieldState = {
      isDLFieldListLoading,
      dlFieldList,
      dlFieldListHasMore,
      dlFieldListTotalCount,
      dlFieldListPaginationDetails,
      dlFieldListErrorList,
      dlFieldListCurrentPage,
    };

    return getAllPaginationList({
      params,
      dispatch,
      currentApiState: fieldState,
      stateKeys: DATA_LIST_CONSTANTS.DATA_LIST_FIELD_LISTING.FIELD_STATE_KEYS,
      apiFunc: getAllFields,
      t,
    });
  };

  const getFields = (customParams = {}) => {
    const params = {
      page: 1,
      size: DATA_LIST_CONSTANTS.FIELD_LISTING.PAGE_SIZE,
      ...customParams,
    };

    const fieldState = {
      isFieldListLoading,
      fieldList,
      fieldListHasMore,
      fieldListTotalCount,
      fieldListPaginationDetails,
      fieldListErrorList,
      fieldListCurrentPage,
    };

    getAllPaginationList({
      params,
      dispatch,
      currentApiState: fieldState,
      stateKeys: DATA_LIST_CONSTANTS.FIELD_LISTING.FIELD_STATE_KEYS,
      apiFunc: getAllFields,
      t,
    });
  };

  const getMetaData = () => {
    const data = {};

    if (taskMetaDataId) {
      data.task_metadata_id = taskMetaDataId;
    } else if (flowId) {
      data.flow_id = flowId;
    } else if (dataListId) {
      data.data_list_id = dataListId;
    }
    return data;
  };

  useEffect(() => {
    if (!isEmpty(ruleId)) {
      getDataListFields({
        data_list_id: ruleDataListId,
        ignore_field_types: DL_QUERY_IGNORED_FIELD_TYPES,
      }).then((response) => {
        reduxDispatcher(getExternalFieldsOnSuccess({}, response));
      });

      getFields({
        include_property_picker: 1,
        sort_by: 1,
        ...getMetaData(),
      });
    }
  }, [ruleId]);

  useEffect(() => {
    if (state.type === DATA_LIST_CONSTANTS.QUERY_TYPE.SUB_TABLE_QUERY) {
      if (state.tableUUID) {
        const fieldListForTableSubQuery = getFieldsForTableSubQuery(dlFieldList, state.tableUUID);
        dispatch(externalSourceDataChange({ fieldListForTableSubQuery }));
      }
      setTableTypeFields(cloneDeep(getTableTypeFieldsForTableSubQuery(dlFieldList)));
    } else {
      setTableTypeFields([]);
      dispatch(externalSourceDataChange({ tableUUID: null, fieldListForTableSubQuery: [] }));
    }
  }, [state.type, dlFieldList.length, state.tableUUID]);

  useEffect(() => {
    dispatch(externalSourceDataChange({ systemFields: { datalist_system_field: DATA_LIST_SYSTEM_FIELDS_NEW } }));
  }, []);

  const handleChangeHandler = (event) => {
    const modifiedErrorList = deleteErrorListWithId(errorList, [
      event.target.id,
    ]);

    dispatch(
      externalSourceDataChange({
        [event.target.id]: event.target.value,
        errorList: modifiedErrorList,
      }),
    );
  };

  const handleChooseDatalist = (event) => {
    const {
      target: { id, value },
    } = event;

    const selectedDataList = dataList?.find(
      (eachDataList) => eachDataList?.data_list_uuid === value,
    );

    const modifiedErrorList = deleteErrorListWithId(errorList, [id, FIELD_IDS.OUTPUT_FORMAT, EXTERNAL_SOURCE_STRINGS.RULE_NAME.ID]);

    Object.keys(modifiedErrorList).forEach((key) => {
      if (key.includes('filter')) {
        delete modifiedErrorList[key];
      }
    });

    dispatch(
      externalSourceDataChange({
        [id]: value,
        selectedDataList,
        dataListName: selectedDataList?.data_list_name,
        ruleName: selectedDataList?.data_list_name,
        [FIELD_IDS.FILTER]: !isEmpty(filter?.rule) ? { rule: getExpressionInitialStateForCBWithMapping().expression } : {},
        [FIELD_IDS.OUTPUT_FORMAT]: [],
        [FIELD_IDS.SORT_FIELD]: null,
        errorList: modifiedErrorList,
        outputFormatErrorList: {},
      }),
    );

    getDataListFields({
      data_list_id: selectedDataList?._id,
      ignore_field_types: DL_QUERY_IGNORED_FIELD_TYPES,
    }).then((response) => {
      reduxDispatcher(getExternalFieldsOnSuccess({}, response));
    });

    getFields({
      sort_by: SORT_BY.ASC,
      ...getMetaData(),
      field_list_type: FIELD_LIST_TYPE.DIRECT,
      ignore_field_types: DL_QUERY_IGNORED_FIELD_TYPES,
    });
  };

  const handleLoadMoreDataList = () => {
    getDatalists(localState?.listSearch);
  };

  const handleSearchDataList = (event) => {
    const {
      target: { value },
    } = event;

    setLocalState({
      ...localState,
      listSearch: value,
    });

    getDatalists(value, 1);
  };

  const resetStates = (state) => {
    state.outputFormat = [];
    state.distinctField = null;
    delete state?.errorList?.queryResult;
    delete state?.errorList?.distinctField;
    return state;
  };

  const modifyQueryResultBasedOnValue = (modifiedState, value) => {
    modifiedState.isLimitFields = false;
    switch (value) {
      case DATA_LIST_CONSTANTS.QUERY_TYPE.SINGLE:
        modifiedState.queryResult = DATA_LIST_CONSTANTS.QUERY_RESULT.SINGLE_VALUE;
      break;
      case DATA_LIST_CONSTANTS.QUERY_TYPE.ALL:
        modifiedState.queryResult = DATA_LIST_CONSTANTS.QUERY_RESULT.MULTIPLE_VALUE;
      break;
      case DATA_LIST_CONSTANTS.QUERY_TYPE.CUSTOM:
        modifiedState.queryResult = '';
      break;
      case DATA_LIST_CONSTANTS.QUERY_TYPE.DISTINCT:
        if (type === value) {
          resetStates(modifiedState);
          modifiedState.type = DATA_LIST_CONSTANTS.QUERY_TYPE.ALL;
          modifiedState.queryResult = DATA_LIST_CONSTANTS.QUERY_RESULT.MULTIPLE_VALUE;
        } else {
          modifiedState.queryResult = null;
        }
      break;
      case DATA_LIST_CONSTANTS.QUERY_TYPE.SUB_TABLE_QUERY:
        modifiedState.queryResult = DATA_LIST_CONSTANTS.QUERY_RESULT.MULTIPLE_VALUE;
        break;
      default:
        modifiedState.type = value;
      break;
    }
    if (value !== DATA_LIST_CONSTANTS.QUERY_TYPE.SUB_TABLE_QUERY) {
       modifiedState.filter.postRule = null;
       delete modifiedState.errorList?.isPostRuleHasValidation;
      }
  };

  const handleQueryTypeChange = (_event, id, value) => {
    if (value === type && type !== DATA_LIST_CONSTANTS.QUERY_TYPE.DISTINCT) return;

    const modifiedState = cloneDeep(state);

    if (!isEmpty(outputFormat)) {
      updateAlertPopverStatus({
        isVisible: true,
        customElement: (
          <UpdateConfirmPopover
            alertIcon={<BigAlertIcon />}
            onYesHandler={() => {
              resetStates(modifiedState);
              modifiedState.type = value;
              modifyQueryResultBasedOnValue(modifiedState, value);
              dispatch(externalSourceDataChange(modifiedState));
              clearAlertPopOverStatus();
            }}
            onNoHandler={() => {
              clearAlertPopOverStatus();
            }}
            title={t(DATALIST_STRINGS.ARE_U_SURE)}
            subTitle={t(DATALIST_STRINGS.REMOVE_FIELDS)}
          />
        ),
      });
    } else {
      resetStates(modifiedState);
      modifiedState.type = value;
      modifyQueryResultBasedOnValue(modifiedState, value);
      dispatch(externalSourceDataChange(modifiedState));
    }
  };

  const getEntriesOption = (optionList) => {
    console.log(optionList);
    return optionList?.map?.((eachOption) => {
      if (eachOption.value === DATA_LIST_CONSTANTS.QUERY_TYPE.SUB_TABLE_QUERY) {
        return {
          ...eachOption,
          customChildElementClassName: cx(gClasses.W80, gClasses.PL28),
          customElement: (
            <SingleDropdown
              onClick={(v) => {
                const modifiedState = {
                  tableUUID: v,
                  errorList: { ...(errorList || {}) },
                  filter: filter,
                };
                delete modifiedState.errorList?.tableUUID;
                delete modifiedState.errorList?.isPostRuleHasValidation;
                jsUtility.set(modifiedState, ['filter', 'postRule'], null);
                dispatch(externalSourceDataChange(modifiedState));
              }}
              dropdownViewProps={{ className: gClasses.MT5 }}
              optionList={tableTypeFields}
              selectedValue={state.tableUUID}
              errorMessage={errorList?.tableUUID}
              searchProps={{ searchPlaceholder: t('common_strings.search') }}
            />
          ),
        };
      } else {
        return eachOption;
      }
    });
  };

  const handleDropdownChange = (id, value, distinctFieldDetails = null) => {
    let data = {
      [id]: value,
    };
    if (!isEmpty(distinctFieldDetails)) {
      const modifiedErrorList = cloneDeep(errorList);
      delete modifiedErrorList?.distinctField;
      delete modifiedErrorList?.outputFormat;
      data = {
        [id]: value,
        outputFormat: [{
          field_details: distinctFieldDetails,
          key: distinctFieldDetails?.value,
          key_uuid: uuidv4(),
          path: '0',
          type: distinctFieldDetails?.field_type,
          value_type: 'dynamic',
          name: distinctFieldDetails?.field_name,
        }],
        outputFormatErrorList: {},
        errorList: modifiedErrorList,
      };
    }
    dispatch(
      externalSourceDataChange(data),
    );
  };

  const handleFilterChange = (id, data) => {
    const filterData = {
      filter: {
        ...filter || {},
        [id]: data,
      },
    };
    dispatch(externalSourceDataChange(filterData));
  };

  // Filter - Rule Builder

  const getFilterComponent = () => {
    const localFilter = {
      rule: filter?.rule,
      hasValidation: errorList?.isRuleHasValidation,
      postRule: filter?.postRule,
      isPostRuleHasValidation: errorList?.isPostRuleHasValidation,
    };
    return (
        <ExternalSourceFilter
          dataListUUID={dataListUuid}
          type={type}
          tableUUID={state?.tableUUID}
          lSystemFields={DATA_LIST_SYSTEM_FIELDS_NEW}
          rSystemFields={flowId ? FLOW_SYSTEM_FIELDS_NEW : DATA_LIST_SYSTEM_FIELDS_NEW}
          rDataFields={fieldList}
          metaData={{ moduleId: selectedDataList?._id || ruleDataListId }}
          moduleType={MODULE_TYPES.DATA_LIST}
          filter={localFilter}
          handleFilterChange={handleFilterChange}
          customQueryParams={{ ignore_field_types: DL_QUERY_IGNORED_FIELD_TYPES }}
        />
    );
  };

  return (
    <div className={gClasses.MT12}>
      <div className={cx(gClasses.DisplayFlex, gClasses.MB24, gClasses.gap24)}>
        <SingleDropdown
          className={gClasses.FlexBasis50}
          id={DATALIST_STRINGS.CHOOSE_DATALIST.ID}
          popperPlacement={EPopperPlacements.AUTO}
          getPopperContainerClassName={() => styles.DatalistSelectorPopper}
          dropdownViewProps={{
            labelName: t(DATALIST_STRINGS.CHOOSE_DATALIST.LABEL),
            isLoading: isRuleDetailsLoading,
            selectedLabel: dataListName,
            onClick: loadInitialDataList,
            onFocus: loadInitialDataList,
            onKeyDown: loadInitialDataList,
            disabled: !isEmpty(ruleId),
          }}
          optionList={dataList}
          isLoadingOptions={isDataListLoading}
          placeholder={t(DATALIST_STRINGS.CHOOSE_DATALIST.PLACEHOLDER)}
          onClick={(value, _label, _list, id) =>
            handleChooseDatalist(generateEventTargetObject(id, value))
          }
          infiniteScrollProps={{
            dataLength: dataList?.length || 0,
            next: handleLoadMoreDataList,
            hasMore: dataListHasMore,
            scrollableId: DATA_LIST_CONSTANTS.DATA_LIST_LISTING.SCROLLABLE_ID,
            scrollThreshold:
              DATA_LIST_CONSTANTS.DATA_LIST_LISTING.SCROLLABLE_THRESOLD,
          }}
          searchProps={{
            searchPlaceholder:
              t(DATALIST_STRINGS.CHOOSE_DATALIST.SEARCH_PLACEHOLDER),
            searchValue: localState?.listSearch,
            onChangeSearch: handleSearchDataList,
          }}
          errorMessage={errorList?.[DATALIST_STRINGS.CHOOSE_DATALIST.ID]}
          selectedValue={dataListUuid}
          required
        />
        <TextInput
          id={EXTERNAL_SOURCE_STRINGS.RULE_NAME.ID}
          className={gClasses.FlexBasis50}
          labelText={t(EXTERNAL_SOURCE_STRINGS.RULE_NAME.LABEL)}
          placeholder={t(EXTERNAL_SOURCE_STRINGS.RULE_NAME.PLACEHOLDER)}
          onChange={handleChangeHandler}
          value={ruleName}
          errorMessage={errorList?.ruleName}
          isLoading={isRuleDetailsLoading}
          required
        />
      </div>
      <div className={gClasses.MB12}>
        <Text
          size={ETextSize.LG}
          className={cx(styles.TextClassName)}
          content={t(DATALIST_STRINGS.FIELDS_TO_FETCH)}
          isLoading={isRuleDetailsLoading}
        />
      </div>
      <div className={cx(gClasses.DisplayFlex, gClasses.MB24)}>
        <div className={cx(gClasses.FlexBasis25)}>
          <RadioGroup
            id={DATALIST_STRINGS.LIMIT.ID}
            labelText={t(DATALIST_STRINGS.LIMIT.LABEL)}
            options={getEntriesOption(cloneDeep(DATALIST_STRINGS.LIMIT.OPTION_LIST(t)))}
            onChange={handleQueryTypeChange}
            selectedValue={type === DATA_LIST_CONSTANTS.QUERY_TYPE.DISTINCT ? DATA_LIST_CONSTANTS.QUERY_TYPE.ALL : type}
            labelClassName={cx(gClasses.FTwo13Black, gClasses.FontWeight500, gClasses.MB12)}
            required
            layout={RadioGroupLayout.stack}
          />
          {/* <CheckboxGroup
            className={gClasses.MT24}
            labelText={DATALIST_STRINGS.LIMIT.AGGREGATE.TITLE}
            labelClassName={cx(gClasses.FTwo13Black, gClasses.FontWeight500, gClasses.MB12)}
            options={getAggregateOptions(DATALIST_STRINGS.LIMIT.AGGREGATE.DISTINCT.OPTION)}
            onClick={(value) => handleQueryTypeChange(null, DATALIST_STRINGS.LIMIT.ID, value)}
          /> */}
        </div>
        <div className={gClasses.FlexBasis75}>
          <div className={cx(gClasses.TopV, gClasses.JusSpaceBtw)}>
            <Label
              isRequired
              isLoading={isRuleDetailsLoading}
              className={cx(gClasses.FTwo13Black, gClasses.FontWeight500)}
              labelName={t(DATALIST_STRINGS.FIELDS_TO_FETCH)}
            />

            <Checkbox
              labelText={t(DATALIST_STRINGS.LIMIT_FIELDS_LABEL)}
              className={gClasses.TopV}
              details={{ label: t(DATALIST_STRINGS.LIMIT_FIELDS_LABEL) }}
              isLoading={isRuleDetailsLoading}
              isValueSelected={isLimitFields}
              disabled={!MULTIPLE_ENTRY_TYPES.includes(type)}
              onClick={() => {
                const modifiedState = { isLimitFields: !isLimitFields };
                const _errorList = (errorList || {});
                delete _errorList.queryResult;
                modifiedState.errorList = _errorList;
                modifiedState.queryResult = isLimitFields ? DATA_LIST_CONSTANTS.QUERY_RESULT.MULTIPLE_VALUE : '';
                dispatch(externalSourceDataChange(modifiedState));
              }}
              customChildElement={
                <NumberField
                  id={DATALIST_STRINGS.LIMIT.QUERY_RESULT}
                  size={Size.sm}
                  className={cx(gClasses.Width100, gClasses.ML8)}
                  readOnly={!isLimitFields}
                  isLoading={isRuleDetailsLoading}
                  onChange={(value) => {
                    handleChangeHandler({ target: { id: DATALIST_STRINGS.LIMIT.QUERY_RESULT, value } });
                  }}
                  value={isLimitFields ? queryResult : EMPTY_STRING}
                  errorMessage={errorList?.queryResult}
                />
              }
            />

          </div>
          <DatalistOutputFormat
            tableHeaders={OUTPUT_FORMAT_CONSTANTS.DATA_LIST.HEADERS(t)}
            keyLabels={getDefaultKeyLabels(t)}
            initialRowData={OUTPUT_FORMAT_CONSTANTS.INTEGRATION_INITIAL_ROW}
            errorList={outputFormatErrorList}
            overAllErrorList={errorList}
            isDistinct={type === DATA_LIST_CONSTANTS.QUERY_TYPE.DISTINCT}
          />
        </div>
      </div>

      <Text
        size={ETextSize.LG}
        className={gClasses.MT24}
        content={t(DATALIST_STRINGS.FILTER_AND_SORT.TITLE)}
        isLoading={isRuleDetailsLoading}
      />
      {getFilterComponent()}
      <div className={gClasses.MT12}>
        <Text
          size={ETextSize.LG}
          className={gClasses.MT24}
          content={t(DATALIST_STRINGS.FILTER_AND_SORT.SORT.TITLE)}
          isLoading={isRuleDetailsLoading}
        />
        <div className={cx(gClasses.DisplayFlex, gClasses.MT12, gClasses.gap24)}>
        <SingleDropdown
          id={DATALIST_STRINGS.FILTER_AND_SORT.SORT.SORT_FIELD}
          className={gClasses.FlexBasis50}
          popperPlacement={EPopperPlacements.AUTO}
          getPopperContainerClassName={() => styles.DatalistSelectorPopper}
          optionList={sortableFields?.data}
          isLoadingOptions={sortableFields?.loading}
          onClick={(value, _label, _list, id) => handleDropdownChange(id, { label: _label, value: value })}
          selectedValue={sortField?.value}
          dropdownViewProps={{
            selectedLabel: sortField?.label,
            onFocus: () => getDropdownFields(sortableFields, setSortableFields),
            onBlur: () => setSortableFieldsSearch(EMPTY_STRING),
            disabled: isEmpty(selectedDataList) && !ruleDataListId,
          }}
          showReset
          searchProps={{
            searchValue: sortableFieldsSearch,
            searchPlaceholder: t(DATALIST_STRINGS.SEARCH_FIELDS),
            onChangeSearch: (event) => { setSortableFieldsSearch(event?.target?.value); getDropdownFields(sortableFields, setSortableFields, {}, 1, event?.target?.value); },
          }}
          infiniteScrollProps={{
            scrollableId: 'sortableFieldsList',
            next: loadMoreFields,
            dataLength: sortableFields?.data.length,
            hasMore:
              sortableFields?.data.length < sortableFields?.paginationDetails?.total_count,
          }}
        />
        <SingleDropdown
          id={DATALIST_STRINGS.FILTER_AND_SORT.SORT.ID}
          className={gClasses.FlexBasis50}
          dropdownViewProps={{
            disabled: !sortField?.value,
          }}
          popperPlacement={EPopperPlacements.AUTO}
          getPopperContainerClassName={() => styles.DatalistSelectorPopper}
          optionList={DATALIST_STRINGS.FILTER_AND_SORT.SORT.OPTIONS(t)}
          isLoadingOptions={isDataListLoading}
          placeholder={t(DATALIST_STRINGS.FILTER_AND_SORT.SORT.PLACEHOLDER)}
          onClick={(value, _label, _list, id) => handleDropdownChange(id, value)}
          selectedValue={sortOrder}
        />
        </div>
      </div>
    </div>
  );
}
const mapDispatchToProps = (dispatch) => { return { dispatch }; };

export default connect(() => {}, mapDispatchToProps)(DatalistData);

DatalistData.propTypes = {
  dispatch: PropTypes.func,
};
