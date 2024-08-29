import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import {
  ETitleSize,
  Title,
  SingleDropdown,
  ECheckboxSize,
  Label,
  Checkbox,
} from '@workhall-pvt-lmt/wh-ui-library';
import styles from './CallAnotherFlow.module.scss';
import {
  CALL_ANOTHER_FLOW_STRINGS,
  SUBFLOW_CHECKBOX_OPTIONS,
  TABLE_HEADERS,
} from './CallAnotherFlow.strings';
import { cloneDeep, isEmpty } from '../../../../../utils/jsUtility';
import FieldMappingTable from '../row_components/field_mapping_table/FieldMappingTable';
import { FIELD_MAPPING_TABLE_TYPES, FIELD_VALUE_TYPES, MAPPING_COMPONENT_TYPES } from '../row_components/RowComponents.constants';
import { getSubFlows } from '../../../../../axios/apiService/flowList.apiService';
import useApiCall from '../../../../../hooks/useApiCall';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../node_configuration/use_node_reducer/useNodeReducer';
import { ALLOWED_ITERARTION_FIELD_TYPES, CALL_SUBFLOW_CONSTANTS, SUB_FLOW_RELATED_INIT_DATA, TRIGGER_RESPONSE_KEYS } from './CallAnotherFlow.constants';
import { FIELD_LIST_TYPE, FIELD_TYPE, INITIAL_PAGE, MAX_PAGINATION_SIZE } from '../../../../../utils/constants/form.constant';
import { apiGetAllFieldsList } from '../../../../../axios/apiService/flow.apiService';
import { dataLossAlertPopover, formatAllFieldsList } from '../../../node_configuration/NodeConfiguration.utils';
import { formatAllFlowsList } from './CallAnotherFlow.utils';
import { DOCUMENT_TYPES, EMPTY_STRING, ENTITY } from '../../../../../utils/strings/CommonStrings';
import { MODULE_TYPES } from '../../../../../utils/Constants';
import {
  ALLOW_MAPPING_SYSTEM_FIELDS,
  CALL_ANOTHER_FLOW_STEP_SYSTEM_FIELDS,
  PAGINATION_API_INIT_DATA,
} from '../../../node_configuration/NodeConfiguration.constants';
import { CREATE_NEW_STRINGS } from '../send_data_to_datalist/SendDataToDl.string';

function CallAnotherFlowGeneral(props) {
  const {
    onCheckboxClick,
    metaData: {
      flowId,
      flowUUID,
    },
    steps,
    allSystemFields = {},
  } = props;
  const { t } = useTranslation();
  const [flowSearchText, setFlowSearchText] = useState(EMPTY_STRING);
  const [iterateFieldSearchText, setIterateFieldSearchText] = useState(EMPTY_STRING);

  const { IS_ASYNC: IS_ASYNC_OPTION, IS_MNI: IS_MNI_OPTION } = SUBFLOW_CHECKBOX_OPTIONS(t);

  const {
    state,
    dispatch,
  } = useFlowNodeConfig();

  const {
    stepId,
    childFlowUuid,
    mniUuid,
    mniUuidLabel,
    mniUuidType,
    isMni,
    mapping,
    errorList,
    mappingErrorList,
    fieldDetails = [],
    maximumFileSize,
    allowedExtensions,
    allowedCurrencyList,
    defaultCurrencyType,
    defaultCountryCode,
    documentUrlDetails,
    childFlowId,
  } = state;
  const {
    IS_ASYNC,
    IS_MNI,
    CHILD_FLOW_UUID,
    ITERATE_FIELD_UUID,
  } = TRIGGER_RESPONSE_KEYS;

  const {
    data: allFlowsList,
    fetch: getAllFlowData,
    page: allFlowsCurrentPage,
    hasMore: hasMoreFlows,
    isLoading: isLoadingFlowsList,
    clearData: clearFlowsList,
  } = useApiCall(PAGINATION_API_INIT_DATA, true, formatAllFlowsList);
  const {
    data: allIterationFormFields,
    fetch: getIterationFields,
    page: allIterationFieldsCurrentPage,
    hasMore: hasMoreIterationFields,
    isLoading: isLoadingIterationFields,
    clearData: clearIterationFields,
  } = useApiCall(PAGINATION_API_INIT_DATA, true, formatAllFieldsList);
  console.log(fieldDetails, 'state_callAnotherFlowGeneral', state, 'props', props, 'allIterationFormFields', allIterationFormFields);

  const getIterationFieldsList = (params = {}) => {
    params = {
      page: INITIAL_PAGE,
      size: 1000,
      sort_by: 1,
      flow_id: flowId,
      field_list_type: FIELD_LIST_TYPE.DIRECT,
      allowed_field_types: ALLOWED_ITERARTION_FIELD_TYPES,
      include_property_picker: 1,
      ...params,
    };
    if (isEmpty(params.search)) {
      delete params.search;
    }
    if ((params.page === 1) && !isEmpty(allIterationFormFields)) {
      clearIterationFields();
    }
    getIterationFields(apiGetAllFieldsList(params));
  };

  const getAllFlowsList = (params = {}) => {
    params = {
      page: INITIAL_PAGE,
      size: MAX_PAGINATION_SIZE,
      allow_call_by_flow: 1,
      ignored_flow_uuids: [flowUUID],
      ...params,
    };
    if (isEmpty(params?.search)) {
      delete params.search;
    }
    if ((params.page === 1) && !isEmpty(allFlowsList)) {
      clearFlowsList();
    }
    getAllFlowData(getSubFlows(params));
  };

  const getInitialFlowsList = () => {
    setFlowSearchText(EMPTY_STRING);
    getAllFlowsList();
  };

  const loadMoreIterationFields = () => {
    getIterationFieldsList(
      { page: allIterationFieldsCurrentPage + 1, search: iterateFieldSearchText },
    );
  };

  const loadMoreFlows = () => {
    getAllFlowsList(
      { page: allFlowsCurrentPage + 1, search: flowSearchText },
    );
  };

  const onDropdownValueChange = (value, label, id) => {
    if (id === CHILD_FLOW_UUID) {
      const selectedChildFlow = allFlowsList?.find((option) => option?.value === value);

      if (childFlowUuid !== value) {
        if (!isEmpty(mapping) || !isEmpty(mniUuid)) {
          dataLossAlertPopover({
            title: 'Data Loss',
            subTitle: 'Do you need to proceed?',
            onYesHandlerAdditionalFunc: () => {
              dispatch(nodeConfigDataChange({
                childFlowId: selectedChildFlow?.id,
                childFlowName: selectedChildFlow?.label,
                [id]: value,
                ...SUB_FLOW_RELATED_INIT_DATA,
                [TRIGGER_RESPONSE_KEYS.TRIGER_MAPPING]: [],
              }));
            },
          });
        } else {
          dispatch(nodeConfigDataChange({
            childFlowId: selectedChildFlow?.id,
            childFlowName: selectedChildFlow?.label,
            [id]: value,
            ...SUB_FLOW_RELATED_INIT_DATA,
            [TRIGGER_RESPONSE_KEYS.TRIGER_MAPPING]: [],
          }));
        }
      }
    } else {
      const selectedIterativeField = allIterationFormFields?.find((eachField) => eachField?.value === value);
      const updatedData = {
        [id]: value,
        [`${id}Label`]: label,
        [`${id}Type`]: selectedIterativeField?.field_type,
      };

      if (!isEmpty(mniUuid) && mniUuid !== value) {
        updatedData.mapping = [];
      }
      if (!isEmpty(mapping) && !isEmpty(mniUuid) && (mniUuid !== value)) {
        dataLossAlertPopover({
          title: 'Data Loss',
          subTitle: 'Do you need to proceed?',
          onYesHandlerAdditionalFunc: () => {
            dispatch(
              nodeConfigDataChange(updatedData),
            );
          },
        });
      } else {
        dispatch(
          nodeConfigDataChange(updatedData),
        );
      }
    }
  };

  const onIterationFieldDropdownFocus = () => {
    setIterateFieldSearchText(EMPTY_STRING);
    getIterationFieldsList();
  };

  const onSearchIterateField = (event) => {
    getIterationFieldsList({ search: event.target.value });
    setIterateFieldSearchText(event.target.value);
  };

  const handleMappingChange = (data) => {
    console.log('handleMappingChange_data', data);
    dispatch(nodeConfigDataChange(data));
  };

  const onSearchFlows = (event) => {
    getAllFlowsList({ search: event.target.value });
    setFlowSearchText(event.target.value);
  };

  const iterateSubFlowContent = isMni && (
    <SingleDropdown
      dropdownViewProps={{
        labelName: CALL_ANOTHER_FLOW_STRINGS(t).ITERATE_SUBFLOW_CONTENT,
        labelClassName: cx(gClasses.MT12, styles.IterateClass),
        onClick: onIterationFieldDropdownFocus,
        onKeyDown: onIterationFieldDropdownFocus,
        selectedLabel: state?.[`${ITERATE_FIELD_UUID}Label`],
      }}
      required
      errorMessage={errorList?.[ITERATE_FIELD_UUID]}
      searchProps={{
        searchPlaceholder: CALL_ANOTHER_FLOW_STRINGS(t).ITERATE_SUBFLOW_CONTENT_SEARCH,
        searchValue: iterateFieldSearchText,
        onChangeSearch: onSearchIterateField,
      }}
      onClick={(value, label) => onDropdownValueChange(value, label, ITERATE_FIELD_UUID)}
      optionList={allIterationFormFields}
      selectedValue={mniUuid}
      infiniteScrollProps={{
        dataLength: allIterationFormFields?.length,
        next: loadMoreIterationFields,
        hasMore: hasMoreIterationFields,
      }}
      className={styles.IterateDropDOwnMaxWidth}
      isLoadingOptions={isLoadingIterationFields}
    />
  );

  const inputsToSubFlowContents = !isEmpty(childFlowUuid) && (
    <>
      <Label
        labelName={CALL_ANOTHER_FLOW_STRINGS(t).INPUTS_TO_SUBFLOW}
        className={cx(gClasses.MT20, styles.SubFlowContentClass)}
      />
      {iterateSubFlowContent}
      <FieldMappingTable
        key={TRIGGER_RESPONSE_KEYS.TRIGER_MAPPING}
        initialRawData={[]}
        mappedData={mapping}
        mappedServerData={state?.triggerMapping || []}
        errorList={mappingErrorList}
        fieldDetails={fieldDetails || []}
        tableHeaders={TABLE_HEADERS(t)}
        keyFieldParams={{
          ignore_field_types: [FIELD_TYPE.INFORMATION, FIELD_TYPE.USER_PROPERTY_PICKER, FIELD_TYPE.DATA_LIST_PROPERTY_PICKER],
        }}
        valueFieldParams={{
          ignore_field_types: [FIELD_TYPE.INFORMATION, FIELD_TYPE.USER_PROPERTY_PICKER, FIELD_TYPE.DATA_LIST_PROPERTY_PICKER],
        }}
        systemFieldParams={{
          allSystemFields,
          allowedSystemFields: ALLOW_MAPPING_SYSTEM_FIELDS,
          allowedStepSystemFields: CALL_ANOTHER_FLOW_STEP_SYSTEM_FIELDS,
          steps: steps,
        }}
        keyLabels={{
          childKey: 'tableColumnMapping',
          typeKey: 'fieldType',
          addKey: 'addKey',
          requiredKey: 'isRequired',
          addRowText: CREATE_NEW_STRINGS(t).ADD_FIELD,
          addChildRowText: CREATE_NEW_STRINGS(t).ADD_COLUMN,
        }}
        additionalRowComponentProps={{
          keyObject: {
            rowUuid: 'fieldUuid',
            key: 'label',
            value: 'value',
            valueType: 'valueType',
            mappingUuid: 'childFieldUuid',
            valueDetails: 'fieldDetails',
            documentDetails: 'documentDetails',
            childKey: 'tableColumnMapping',
            // isRequired: 'isRequired',
            deleteRow: 'deleteRow',
          },
          isEditableKey: true,
          fileUploadProps: {
            contextId: flowId,
            fileEntityId: stepId,
            fileEntity: ENTITY.FLOW_STEPS,
            fileEntityType: DOCUMENT_TYPES.SUB_FLOW_DOCUMENTS,
            maximumFileSize,
            allowedExtensions,
            isMultiple: true,
            refUuid: state?.stepUuid,
          },
          allowedCurrencyList,
          defaultCurrencyType,
          defaultCountryCode,
          documentUrlDetails,
          metaData: {
            childModuleType: MODULE_TYPES.FLOW,
            childModuleId: childFlowId,
          },
          iterativeField: {
            fieldName: mniUuidLabel,
            fieldType: mniUuidType,
            fieldUuid: mniUuid,
          },
        }}
        rowInitialData={{
          valueType: FIELD_VALUE_TYPES.DYNAMIC,
        }}
        handleMappingChange={handleMappingChange}
        mappingVariant={FIELD_MAPPING_TABLE_TYPES.KEY_VALUE_MAPPING_WITH_TYPE}
        mappingComponent={MAPPING_COMPONENT_TYPES.CALL_SUB_FLOW}
        parentId={flowId}
        childFlowId={state?.childFlowId}
        mappingListKey="mapping"
        errorListKey="mappingErrorList"
        documentDetailsKey="documentUrlDetails"
      />
    </>
  );

  console.log('akjsjsadhsahdbs', cloneDeep(allFlowsList), allFlowsList);

  return (
    <div>
      <Title
        content={CALL_ANOTHER_FLOW_STRINGS(t).SUBFLOW_DETAILS}
        size={ETitleSize.xs}
        className={cx(gClasses.MB12, styles.TitleClass)}
      />
      <SingleDropdown
        dropdownViewProps={{
          labelName: CALL_ANOTHER_FLOW_STRINGS(t).CHOOSE_SUB_FLOW,
          labelClassName: cx(styles.DropdownLabelClass),
          selectedLabel: state?.childFlowName,
          onClick: getInitialFlowsList,
          onKeyDown: getInitialFlowsList,
        }}
        required
        selectedValue={childFlowUuid}
        optionList={cloneDeep(allFlowsList)}
        infiniteScrollProps={{
          dataLength: allFlowsList?.length,
          next: loadMoreFlows,
          hasMore: hasMoreFlows,
          scrollableId: CALL_SUBFLOW_CONSTANTS.LIST_SCROLL_ID,
          scrollThreshold: CALL_SUBFLOW_CONSTANTS.LIST_SCROLLABLE_THRESOLD,
        }}
        errorMessage={errorList?.[CHILD_FLOW_UUID]}
        searchProps={{
          searchPlaceholder: CALL_ANOTHER_FLOW_STRINGS(t).CHOOSE_FLOW_SEARCH_PLACEHOLDER,
          searchValue: flowSearchText,
          onChangeSearch: onSearchFlows,
        }}
        onClick={(value, label) => onDropdownValueChange(value, label, CHILD_FLOW_UUID)}
        className={cx(styles.DropDownMaxWidth, gClasses.MB25)}
        isLoadingOptions={isLoadingFlowsList}
      />
      <Checkbox
        id={TRIGGER_RESPONSE_KEYS.IS_ASYNC}
        className={cx(gClasses.MB10)}
        isValueSelected={!state?.[TRIGGER_RESPONSE_KEYS.IS_ASYNC]}
        details={IS_ASYNC_OPTION}
        size={ECheckboxSize.SM}
        checkboxViewLabelClassName={cx(gClasses.MT5)}
        onClick={() => onCheckboxClick(IS_ASYNC)}
      />
      <Checkbox
        id={TRIGGER_RESPONSE_KEYS.IS_MNI}
        className={cx(gClasses.MB10)}
        isValueSelected={state?.[TRIGGER_RESPONSE_KEYS.IS_MNI]}
        details={IS_MNI_OPTION}
        size={ECheckboxSize.SM}
        checkboxViewLabelClassName={cx(gClasses.MT5)}
        onClick={() => onCheckboxClick(IS_MNI)}
      />
      {inputsToSubFlowContents}
    </div>
  );
}

export default CallAnotherFlowGeneral;
