import React, { useState } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import {
  SingleDropdown,
  Text,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import style from '../AutomatedSystems.module.scss';
import { get, isEmpty } from '../../../utils/jsUtility';
import { getErrorMessage, getFlowlistSuggetion } from '../AutomatedSystems.utils';
import useApiCall from '../../../hooks/useApiCall';
import { getAllFlows } from '../../../axios/apiService/flowList.apiService';
import { FIELD_TYPE, MAX_PAGINATION_SIZE } from '../../../utils/constants/form.constant';
import { DOCUMENT_TYPES, EMPTY_STRING, ENTITY } from '../../../utils/strings/CommonStrings';
import { AUTOMATED_SYSTEM_CONSTANTS } from '../AutomatedSystems.strings';
import FieldMappingTable from '../../../containers/edit_flow/step_configuration/node_configurations/row_components/field_mapping_table/FieldMappingTable';
import { FIELD_MAPPING_TABLE_TYPES, FIELD_VALUE_TYPES, MAPPING_COMPONENT_TYPES } from '../../../containers/edit_flow/step_configuration/node_configurations/row_components/RowComponents.constants';
import { CALL_ANOTHER_FLOW_STRINGS, TABLE_HEADERS } from '../../../containers/edit_flow/step_configuration/node_configurations/call_another_flow/CallAnotherFlow.strings';
import { FlowNodeProvider } from '../../../containers/edit_flow/node_configuration/use_node_reducer/useNodeReducer';
import { getUserProfileData } from '../../../utils/UtilityFunctions';
import { MODULE_TYPES } from '../../../utils/Constants';
import { ALLOW_AUTOMATED_SYSTEM_ACTION_FIELDS, DATA_CHANGE_MODULE } from '../AutomatedSystems.constants';
import { convertFieldDetailsForMapping } from '../../../containers/data_lists/data_list_landing/datalist_details/datalist_user_system_action/datalist_shortcuts/datalistShortcuts.utils';

function TriggerAction(props) {
  const { metaData = {}, automatedSystemsState = {}, onChangeHandler = null, systemFields,
  //  onUpdateError = null,
   } = props;
  const { t } = useTranslation();
  const profileData = getUserProfileData();
  const { COMMON_AUTOMATED_STRINGS } = AUTOMATED_SYSTEM_CONSTANTS(t);

  const errorList = automatedSystemsState?.errorList;
  const triggerData = automatedSystemsState?.flowActions;

  const { data: flowList, fetch: flowListFetch, clearData: clearFlowList, isLoading: isFlowListsLoading, hasMore: hasMoreFlow, page: flowListCurrentPage } = useApiCall({}, true);
  const [flowSearchText, setFlowSearchText] = useState(EMPTY_STRING);

  const loadFlowList = (page = null, searchText = null) => {
    const flowListParams = {
      page: page || 1,
      size: MAX_PAGINATION_SIZE,
    };
    if (!isEmpty(searchText)) flowListParams.search = searchText;
    if (page <= 1) clearFlowList({ data: [], paginationDetails: {} });
    flowListFetch(getAllFlows(flowListParams, null));
  };

  const onSearchFlow = (event) => { setFlowSearchText(event.target.value); loadFlowList(1, event.target.value); };
  const onLoadMoreFlowList = () => { loadFlowList(flowListCurrentPage + 1); };

  const onTriggerChangeHanlder = (id, value, options) => {
    console.log('sfjkbasfkln', { id, value, options });
    onChangeHandler(id, value, DATA_CHANGE_MODULE.TRIGGER, options);
  };

  const onFlowSelect = (id, value, list) => {
     const selectedFlowData = list.find((eachFlow) => eachFlow.value === value);
     if (selectedFlowData) {
      onTriggerChangeHanlder(id, value, selectedFlowData);
     }
  };

  const handleMappingChange = (data) => {
    console.log('xyz data', data);
    onChangeHandler('triggerMapping', data, DATA_CHANGE_MODULE.TRIGGER);
  };

  return (
    <div className={gClasses.MB70}>
      <Text
        className={cx(
          gClasses.FontWeight500,
          gClasses.FTwo16GrayV3,
          gClasses.MB16,
        )}
        content={COMMON_AUTOMATED_STRINGS.CONFIG_SYSTEM_ACTION}
      />
      <SingleDropdown
        className={cx(style.DropdownMaxWidth, gClasses.MB16)}
        selectedValue={get(triggerData, 'childFlowUUID', null)}
        dropdownViewProps={{
          labelName: COMMON_AUTOMATED_STRINGS.CHOOSE_FLOW,
          labelClassName: style.FieldLabel,
          selectedLabel: triggerData?.childFlowName,
          onClick: () => loadFlowList(),
          onKeyDown: () => loadFlowList(),
          onBlur: () => setFlowSearchText(EMPTY_STRING),
        }}
        optionList={getFlowlistSuggetion(flowList)}
        onClick={(value, _label, list) =>
          onFlowSelect('childFlowUUID', value, list)
        }
        onOutSideClick={() => setFlowSearchText(EMPTY_STRING)}
        placeholder={COMMON_AUTOMATED_STRINGS.CHOOSE_FLOW_PLACEHOLDER}
        required
        noDataFoundMessage={COMMON_AUTOMATED_STRINGS.NO_FIELDS_FOUND}
        isLoadingOptions={isFlowListsLoading}
        errorMessage={getErrorMessage(errorList, [
          'flowActions',
          'childFlowUUID',
        ])}
        searchProps={{
          searchPlaceholder: COMMON_AUTOMATED_STRINGS.CHOOSE_FLOW_PLACEHOLDER,
          searchValue: flowSearchText,
          onChangeSearch: onSearchFlow,
        }}
        infiniteScrollProps={{
          dataLength: flowList?.length || MAX_PAGINATION_SIZE,
          next: onLoadMoreFlowList,
          hasMore: hasMoreFlow,
          scrollableId: 'scrollable-childFlowUUID',
        }}
      />
      {triggerData.childFlowId && (
        <>
        <Text
          className={cx(
            gClasses.FontWeight500,
            gClasses.FTwo16GrayV3,
          )}
          content={COMMON_AUTOMATED_STRINGS.CONFIGURE_DATA_NEEDED_FLOW}
        />
        <FlowNodeProvider initialState={{}}>
          <FieldMappingTable
            key="triggerMapping"
            initialRawData={[]}
            mappedData={triggerData.triggerMapping || []}
            mappedServerData={triggerData?.serverTriggerMapping || []}
            errorList={errorList.mappingErrorList || {}}
            fieldDetails={convertFieldDetailsForMapping(triggerData.fieldDetails || [])}
            tableHeaders={TABLE_HEADERS(t)}
            keyFieldParams={{
              ignore_field_types: [FIELD_TYPE.INFORMATION, FIELD_TYPE.USER_PROPERTY_PICKER, FIELD_TYPE.DATA_LIST_PROPERTY_PICKER],
            }}
            valueFieldParams={{
              ignore_field_types: [FIELD_TYPE.INFORMATION, FIELD_TYPE.USER_PROPERTY_PICKER, FIELD_TYPE.DATA_LIST_PROPERTY_PICKER],
            }}
            systemFieldParams={{
              allSystemFields: systemFields.datalist_system_field,
              allowedSystemFields: ALLOW_AUTOMATED_SYSTEM_ACTION_FIELDS,
            }}
            keyLabels={{
              childKey: 'tableColumnMapping',
              typeKey: 'fieldType',
              addKey: 'addKey',
              requiredKey: 'isRequired',
              addRowText: CALL_ANOTHER_FLOW_STRINGS(t).ADD_FIELD,
                addChildRowText: CALL_ANOTHER_FLOW_STRINGS(t).ADD_COLUMN,
            }}
            additionalRowComponentProps={{
              fieldPickerClass: style.TriggerFieldMaxWidth,
              keyObject: {
                rowUuid: 'fieldUuid',
                key: 'label',
                value: 'value',
                valueType: 'valueType',
                mappingUuid: 'childFieldUuid',
                valueDetails: 'fieldDetails',
                childKey: 'tableColumnMapping',
                documentDetails: 'documentDetails',
                deleteRow: 'deleteRow',
              },
              isEditableKey: true,
              fileUploadProps: {
                contextId: metaData.dataListId,
                fileEntityId: metaData.dataListId,
                fileEntityUuid: metaData.dataListUUID,
                fileEntity: ENTITY.DATA_LIST,
                fileEntityType: DOCUMENT_TYPES.DATA_LIST_RELATED_ACTIONS,
                maximumFileSize: profileData.maximum_file_size,
                allowedExtensions: profileData.allowed_extensions,
                isMultiple: true,
              },
              allowedCurrencyList: profileData.allowed_currency_types,
              defaultCurrencyType: profileData.default_currency_type,
              defaultCountryCode: profileData.default_country_code,
              documentUrlDetails: automatedSystemsState.documentDetails || {},
              metaData: {
                childModuleType: MODULE_TYPES.DATA_LIST,
                childModuleId: metaData.dataListId,
                childModuleUuid: metaData.dataListUUID,
              },
            }}
            rowInitialData={{
              valueType: FIELD_VALUE_TYPES.DYNAMIC,
            }}
            handleMappingChange={handleMappingChange}
            mappingVariant={
              FIELD_MAPPING_TABLE_TYPES.KEY_VALUE_MAPPING_WITH_TYPE
            }
            mappingComponent={MAPPING_COMPONENT_TYPES.TRIGGER_ACTIONS}
            parentId={metaData.dataListId}
            childFlowId={triggerData.childFlowId}
            isParentDatalist
            mappingListKey="triggerMapping"
            errorListKey="mappingErrorList"
            documentDetailsKey="documentDetails"
          />
        </FlowNodeProvider>
        </>
      )}
    </div>
  );
}

export default TriggerAction;

TriggerAction.propTypes = {
  metaData: PropTypes.object,
  automatedSystemsState: PropTypes.object,
  onChangeHandler: PropTypes.func,
  onUpdateError: PropTypes.func,
};
