import React, { useEffect, useState } from 'react';
import {
  EPopperPlacements,
  ETextSize,
  SingleDropdown,
  Text,
  TextInput,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import MappingTable from 'containers/integration/mapping_table/MappingTable';
import { cloneDeep, set, isEmpty, get } from 'utils/jsUtility';
import { useTranslation } from 'react-i18next';
import styles from './IntegrationData.module.scss';
import { EXTERNAL_SOURCE_STRINGS, INTEGRATION_STRINGS } from '../ExternalSource.strings';
import {
  FIELD_IDS,
  INTEGRATION_CONSTANTS,
  INTEGRATION_IGNORED_FIELD_TYPES,
  INTEGRATION_KEY_VALUE,
  OUTPUT_FORMAT_CONSTANTS,
  VALUE_TYPES,
  getDefaultKeyLabels,
} from '../ExternalSource.constants';
import {
  useExternalSource,
  externalSourceDataChange,
} from '../useExternalSource';
import { getAllPaginationList } from '../useExternalSource.action';
import {
  getAllIntegrationEventsApi,
  getIntegrationConnectorApi,
} from '../../../../axios/apiService/Integration.apiService';
import { generateEventTargetObject } from '../../../../utils/generatorUtils';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { getAllFields } from '../../../../axios/apiService/flow.apiService';
import { validateAndExtractRelativePathFromEndPoint } from '../../../integration/Integration.utils';
import OutputFormat from '../components/output_format/OutputFormat';
import FieldPicker from '../../../../components/field_picker/FieldPicker';
import {
  deleteErrorListWithId,
  getFieldTypeOptions,
} from '../ExternalSource.utils';
import {
  FEILD_LIST_DROPDOWN_TYPE,
  getGroupedFieldListForMapping,
} from '../../../edit_flow/step_configuration/StepConfiguration.utils';
import { FIELD_PICKER_DROPDOWN_TYPES } from '../../../../components/field_picker/FieldPicker.utils';
import { getGroupedSystemFieldListForMapping } from '../../../integration/add_integration/workhall_api/WorkhallApi.utils';
import { SYSTEM_FIELDS } from '../../../../utils/SystemFieldsConstants';

function IntegrationData() {
  const { state, dispatch } = useExternalSource();

  const {
    isIntegrationListLoading,
    integrationList,
    integrationListHasMore,
    integrationListTotalCount,
    integrationListPaginationDetails,
    integrationListErrorList,
    integrationListCurrentPage,
    isEventListLoading,
    eventList,
    eventListHasMore,
    eventListTotalCount,
    eventListPaginationDetails,
    eventListErrorList,
    eventListCurrentPage,
    queryParams,
    relativePath,
    isFieldListLoading,
    fieldList,
    fieldListHasMore,
    fieldListTotalCount,
    fieldListPaginationDetails,
    fieldListErrorList,
    fieldListCurrentPage,
    selectedConnector,
    selectedEvent,
    connectorUuid,
    eventUuid,
    errorList,
    outputFormatErrorList,
    taskMetaDataId,
    flowId,
    dataListId,
    isRuleDetailsLoading,
    ruleId,
    ruleName,
  } = state;

  const [localState, setLocalState] = useState(
    INTEGRATION_CONSTANTS.LOCAL_STATE,
  );

  const { t } = useTranslation();

  const getIntegrations = (search, pageParam, customParams = {}) => {
    const params = {
      page: pageParam || integrationListCurrentPage || 1,
      size: INTEGRATION_CONSTANTS.INTEGRATION_LIST.PAGE_SIZE,
      ...customParams,
    };

    if (!isEmpty(search)) params.search = search;

    const integrationState = {
      isIntegrationListLoading,
      integrationList,
      integrationListHasMore,
      integrationListTotalCount,
      integrationListPaginationDetails,
      integrationListErrorList,
      integrationListCurrentPage,
    };

    getAllPaginationList({
      params,
      dispatch,
      currentApiState: integrationState,
      stateKeys: INTEGRATION_CONSTANTS.INTEGRATION_LIST.STATE_KEYS,
      apiFunc: getIntegrationConnectorApi,
      t,
    });
  };

  const getEvents = (selectedConnector, search, pageParam) => {
    const params = {
      page: pageParam || eventListCurrentPage || 1,
      size: INTEGRATION_CONSTANTS.INTEGRATION_LIST.PAGE_SIZE,
      method: [INTEGRATION_CONSTANTS.EVENTS_LIST.METHODS.GET],
      connector_id: selectedConnector?._id,
    };

    if (!isEmpty(search)) params.search = search;

    const eventState = {
      isEventListLoading,
      eventList,
      eventListHasMore,
      eventListTotalCount,
      eventListPaginationDetails,
      eventListErrorList,
      eventListCurrentPage,
    };

    getAllPaginationList({
      params,
      dispatch,
      currentApiState: eventState,
      stateKeys: INTEGRATION_CONSTANTS.INTEGRATION_LIST.EVENT_STATE_KEYS,
      apiFunc: getAllIntegrationEventsApi,
      t,
    });
  };

  const loadInitialIntegrations = () => {
    if (
      (isEmpty(integrationList) && !isIntegrationListLoading) ||
      !isEmpty(localState?.listSearch)
    ) {
      getIntegrations(EMPTY_STRING, 1);

      setLocalState({
        ...localState,
        listSearch: EMPTY_STRING,
      });
    }
  };

  const loadInitialEvents = () => {
    if (
      (isEmpty(eventList) && !isEventListLoading) ||
      !isEmpty(localState?.eventSearch)
    ) {
      if (!isEmpty(selectedConnector)) {
        getEvents(selectedConnector, EMPTY_STRING, 1);
      }

      setLocalState({
        ...localState,
        eventSearch: EMPTY_STRING,
      });
    }
  };

  const handleChooseIntegration = (event) => {
    const {
      target: { id, value },
    } = event;

    const selectedConnector = integrationList?.find(
      (eachIntegration) => eachIntegration?.connector_uuid === value,
    );

    const modifiedErrorList = deleteErrorListWithId(errorList, [id, FIELD_IDS.EVENT_UUID, FIELD_IDS.OUTPUT_FORMAT]);

    Object.keys(modifiedErrorList).forEach((key) => {
      if (key.includes('queryParams') || key.includes('relativePath')) {
        delete modifiedErrorList[key];
      }
    });

    dispatch(
      externalSourceDataChange({
        [id]: value,
        [FIELD_IDS.EVENT_UUID]: EMPTY_STRING,
        [FIELD_IDS.QUERY_PARAMS]: [],
        [FIELD_IDS.RELATIVE_PATH]: [],
        [FIELD_IDS.OUTPUT_FORMAT]: [],
        selectedConnector,
        selectedEvent: {},
        errorList: modifiedErrorList,
        outputFormatErrorList: {},
      }),
    );

    getEvents(selectedConnector, EMPTY_STRING, 1);
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

  const getFields = () => {
    const params = {
      page: 1,
      size: INTEGRATION_CONSTANTS.FIELD_LIST.PAGE_SIZE,
      ignore_field_types: INTEGRATION_IGNORED_FIELD_TYPES,
      ...getMetaData(),
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
      stateKeys: INTEGRATION_CONSTANTS.INTEGRATION_LIST.FIELD_STATE_KEYS,
      apiFunc: getAllFields,
      t,
    });
  };

  useEffect(() => {
    getFields();
  }, []);

  const handleChooseEvent = (event) => {
    const {
      target: { id, value },
    } = event;

    const selectedEvent = eventList?.find(
      (eachEvent) => eachEvent?.event_uuid === value,
    );

    const { relative_path_params } = validateAndExtractRelativePathFromEndPoint(
      selectedEvent?.end_point,
    );

    const modifiedRelativePath = relative_path_params?.map((eachRow) => {
      return {
        path_name: eachRow?.key,
        value: EMPTY_STRING,
        type: INTEGRATION_KEY_VALUE.PARAM_DIRECT_TYPE,
        isRequired: true,
      };
    });

    const modifiedQueryParams = selectedEvent?.params?.map((eachRow) => {
      return {
        key: eachRow?.key,
        key_uuid: eachRow?.key_uuid,
        value: EMPTY_STRING,
        type: INTEGRATION_KEY_VALUE.PARAM_DIRECT_TYPE,
        isRequired: eachRow?.is_required,
      };
    });

    const modifiedErrorList = deleteErrorListWithId(errorList, [id]);

    dispatch(
      externalSourceDataChange({
        [id]: value,
        selectedEvent,
        relativePath: modifiedRelativePath,
        queryParams: modifiedQueryParams,
        errorList: modifiedErrorList,
      }),
    );
  };

  const dataFields = getGroupedFieldListForMapping(
    null,
    fieldList,
    [],
    FEILD_LIST_DROPDOWN_TYPE.DIRECT,
    t,
    [],
  );

  const dataFieldsWithoutTitle = dataFields?.filter(
    (eachField) =>
      eachField?.optionType !== FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE,
  );

  const moduleId = flowId ? SYSTEM_FIELDS.FLOW_ID : SYSTEM_FIELDS.DATA_LIST_ID;

  const systemFields = [moduleId];

  const allowedSystemFields = getGroupedSystemFieldListForMapping(
    systemFields,
    [],
  );

  const systemFieldsWithoutTitle = allowedSystemFields?.filter(
    (eachField) =>
      eachField?.optionType !== FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE,
  );

  const formSystemFields = cloneDeep([...systemFields, ...dataFields]);

  const handleMappingTableChange = (event, index, key) => {
    const {
      target: { value },
    } = event;

    let valueType;

    const selectedField = formSystemFields?.find(
      (field) => field.value === value,
    );

    if (selectedField?.system_field_type) {
      valueType = VALUE_TYPES.SYSTEM_FIELD;
    } else {
      valueType = VALUE_TYPES.EXPRESSION;
    }

    if (key === INTEGRATION_STRINGS.QUERY_PARAMS.ID) {
      const clonedParams = cloneDeep(queryParams);

      set(clonedParams, [index, FIELD_IDS.VALUE], value);
      set(clonedParams, [index, FIELD_IDS.TYPE], valueType);

      const modifiedErrorList = deleteErrorListWithId(errorList, [
        `${FIELD_IDS.QUERY_PARAMS},${index},${FIELD_IDS.VALUE}`,
      ]);

      dispatch(
        externalSourceDataChange({
          queryParams: clonedParams,
          errorList: modifiedErrorList,
        }),
      );
    } else {
      const clonedPath = cloneDeep(relativePath);

      set(clonedPath, [index, FIELD_IDS.VALUE], value);
      set(clonedPath, [index, FIELD_IDS.TYPE], valueType);

      const modifiedErrorList = deleteErrorListWithId(errorList, [
        `${FIELD_IDS.RELATIVE_PATH},${index},${FIELD_IDS.VALUE}`,
      ]);

      dispatch(
        externalSourceDataChange({
          relativePath: clonedPath,
          errorList: modifiedErrorList,
        }),
      );
    }
  };

  const handleLoadMoreIntegration = () => {
    getIntegrations(localState?.listSearch);
  };

  const handleLoadMoreEvents = () => {
    getEvents(selectedConnector, localState?.eventSearch);
  };

  const handleSearchIntegration = (event) => {
    const {
      target: { value },
    } = event;

    setLocalState({
      ...localState,
      listSearch: value,
    });

    getIntegrations(value, 1);
  };

  const handleSearchEvent = (event) => {
    const {
      target: { value },
    } = event;

    setLocalState({
      ...localState,
      eventSearch: value,
    });

    getEvents(selectedConnector, value, 1);
  };

  const initialRow = (index, key) => {
    let colOneId = null;
    let colOneValue = null;
    let selectedOption = {};
    let isRequired = false;

    let valueError;

    if (key === INTEGRATION_STRINGS.QUERY_PARAMS.ID) {
      const currentRow = get(queryParams, index, {});

      colOneId = INTEGRATION_STRINGS.QUERY_PARAMS.KEY;
      colOneValue = currentRow?.key;

      selectedOption = formSystemFields?.find(
        (option) => currentRow?.value === option?.value,
      );
      isRequired = currentRow?.isRequired;

      valueError = errorList?.[`${FIELD_IDS.QUERY_PARAMS},${index},value`];
    } else {
      const currentRow = get(relativePath, index, {});

      colOneId = INTEGRATION_STRINGS.RELATIVE_PATH.PATHNAME;
      colOneValue = currentRow?.path_name;

      selectedOption = formSystemFields?.find(
        (option) => currentRow?.value === option?.value,
      );

      isRequired = currentRow?.isRequired;

      valueError = errorList?.[`${FIELD_IDS.RELATIVE_PATH},${index},value`];
    }

    return (
      <div
        className={cx(
          gClasses.CenterVSpaceBetween,
          gClasses.W100,
          gClasses.MB16,
          gClasses.LeftV,
        )}
      >
        <TextInput
          onChange={(e) => handleMappingTableChange(e, index, key)}
          id={colOneId}
          className={styles.MappingField}
          value={colOneValue}
          suffixIcon={
            isRequired && <span className={styles.RequiredIcon}>*</span>
          }
          required
          readOnly
        />
        <FieldPicker
          id={INTEGRATION_STRINGS.QUERY_PARAMS.VALUE}
          optionList={dataFields}
          systemFieldList={allowedSystemFields}
          dropdownListClass={styles.DropdownPopper}
          onChange={(event) => handleMappingTableChange(event, index, key)}
          errorMessage={valueError}
          isExactPopperWidth
          initialOptionList={getFieldTypeOptions({
            fieldsCount: dataFieldsWithoutTitle?.length,
            systemFieldsCount: systemFieldsWithoutTitle?.length,
          })}
          isFieldsLoading={isFieldListLoading}
          selectedOption={selectedOption}
          outerClassName={gClasses.W100}
          fieldPickerClassName={styles.MappingField}
        />
      </div>
    );
  };

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

  return (
    <div className={gClasses.MT16}>
      <div className={cx(gClasses.DisplayFlex, gClasses.MB24, gClasses.gap24)}>
        <SingleDropdown
          id={INTEGRATION_STRINGS.CHOOSE_INTEGRATION.ID}
          popperPlacement={EPopperPlacements.BOTTOM}
          className={gClasses.FlexBasis50}
          dropdownViewProps={{
            labelName: INTEGRATION_STRINGS.CHOOSE_INTEGRATION.LABEL,
            isLoading: isRuleDetailsLoading,
            selectedLabel: selectedConnector?.connector_name,
            onFocus: loadInitialIntegrations,
            disabled: !isEmpty(ruleId),
          }}
          listContainerClassName={styles.ChooseIntegrationPopper}
          isLoadingOptions={isIntegrationListLoading}
          optionList={integrationList}
          placeholder={INTEGRATION_STRINGS.CHOOSE_INTEGRATION.PLACEHOLDER}
          onClick={(value, _label, _list, id) =>
            handleChooseIntegration(generateEventTargetObject(id, value))
          }
          infiniteScrollProps={{
            dataLength: integrationList?.length || 0,
            next: handleLoadMoreIntegration,
            hasMore: integrationListHasMore,
            scrollableId: INTEGRATION_CONSTANTS.INTEGRATION_LIST.SCROLLABLE_ID,
            scrollThreshold:
              INTEGRATION_CONSTANTS.INTEGRATION_LIST.SCROLLABLE_THRESOLD,
          }}
          searchProps={{
            searchPlaceholder:
              INTEGRATION_STRINGS.CHOOSE_INTEGRATION.SEARCH_PLACEHOLDER,
            searchValue: localState?.listSearch,
            onChangeSearch: handleSearchIntegration,
          }}
          selectedValue={connectorUuid}
          errorMessage={errorList?.connectorUuid}
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

      <SingleDropdown
        id={INTEGRATION_STRINGS.CHOOSE_EVENT.ID}
        dropdownViewProps={{
          labelName: INTEGRATION_STRINGS.CHOOSE_EVENT.LABEL,
          isLoading: isRuleDetailsLoading,
          selectedLabel: selectedEvent?.name,
          onClick: loadInitialEvents,
          onKeyDown: loadInitialEvents,
          disabled: !isEmpty(ruleId),
        }}
        isLoadingOptions={isEventListLoading}
        optionList={eventList}
        placeholder={INTEGRATION_STRINGS.CHOOSE_EVENT.PLACEHOLDER}
        onClick={(value, _label, _list, id) =>
          handleChooseEvent(generateEventTargetObject(id, value))
        }
        infiniteScrollProps={{
          dataLength: eventList?.length || 0,
          next: handleLoadMoreEvents,
          hasMore: eventListHasMore,
          scrollableId: INTEGRATION_CONSTANTS.EVENTS_LIST.SCROLLABLE_ID,
          scrollThreshold:
            INTEGRATION_CONSTANTS.EVENTS_LIST.SCROLLABLE_THRESOLD,
        }}
        searchProps={{
          searchPlaceholder:
            INTEGRATION_STRINGS.CHOOSE_EVENT.SEARCH_PLACEHOLDER,
          searchValue: localState?.eventSearch,
          onChangeSearch: handleSearchEvent,
        }}
        selectedValue={eventUuid}
        className={cx(gClasses.MB24, gClasses.MT16)}
        errorMessage={errorList?.eventUuid}
        required
      />

      {relativePath?.length ? (
        <>
          <Text
            size={ETextSize.LG}
            content={INTEGRATION_STRINGS.RELATIVE_PATH.LABEL}
          />
          <MappingTable
            innerTableClass={gClasses.MT16}
            tblHeaders={INTEGRATION_STRINGS.RELATIVE_PATH.getHeaders()}
            mappingList={relativePath || []}
            mappingKey={INTEGRATION_STRINGS.RELATIVE_PATH.ID}
            initialRow={initialRow}
            initialRowKeyValue={
              INTEGRATION_CONSTANTS.INTEGRATION_LIST.INITIAL_RELATIVE_PATH_ROW
            }
            headerRowClass={cx(
              gClasses.CenterVSpaceBetween,
              gClasses.W100,
              styles.HeaderRowClass,
            )}
            headerStyles={[styles.HeaderColumnClass, styles.HeaderColumnClass]}
            error_list={{}}
            noAddRow
          />
        </>
      ) : null}

      {queryParams?.length ? (
        <>
          <Text
            className={cx(gClasses.MT24)}
            size={ETextSize.LG}
            content={INTEGRATION_STRINGS.QUERY_PARAMS.LABEL}
          />

          <MappingTable
            innerTableClass={gClasses.MT16}
            tblHeaders={INTEGRATION_STRINGS.QUERY_PARAMS.getHeaders()}
            mappingList={queryParams || []}
            mappingKey={INTEGRATION_STRINGS.QUERY_PARAMS.ID}
            initialRow={initialRow}
            initialRowKeyValue={
              INTEGRATION_CONSTANTS.INTEGRATION_LIST.INITIAL_PARAM_ROW
            }
            headerRowClass={cx(
              gClasses.CenterVSpaceBetween,
              gClasses.W100,
              styles.HeaderRowClass,
            )}
            headerStyles={[styles.HeaderColumnClass, styles.HeaderColumnClass]}
            error_list={{}}
            noAddRow
          />
        </>
      ) : null}

      <div>
        <Text
          size={ETextSize.LG}
          className={cx(styles.TextClassName, gClasses.MB16)}
          content={INTEGRATION_STRINGS.DATA_NEEDED_LABELS.DATA_NEEDED}
          isLoading={isRuleDetailsLoading}
        />
        <span className={cx(styles.SpanClassName, gClasses.ML4)}>*</span>
      </div>

      <OutputFormat
        tableHeaders={OUTPUT_FORMAT_CONSTANTS.INTEGRATION.HEADERS}
        keyLabels={getDefaultKeyLabels(t)}
        initialRowData={OUTPUT_FORMAT_CONSTANTS.INTEGRATION_INITIAL_ROW}
        errorList={outputFormatErrorList}
        overAllErrorList={errorList}
      />
    </div>
  );
}

export default IntegrationData;
