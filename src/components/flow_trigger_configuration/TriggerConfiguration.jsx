import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { Link } from 'react-router-dom';
import gClasses from 'scss/Typography.module.scss';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import { BS } from 'utils/UIConstants';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import Actors from 'containers/edit_flow/step_configuration/step_components/actors/Actors';
import { EMPTY_STRING, FORM_POPOVER_STRINGS } from 'utils/strings/CommonStrings';
import { cloneDeep, find, get, has, isArray, isEmpty, isUndefined, remove, uniqBy, unset } from 'utils/jsUtility';
import AddMembers from 'components/member_list/add_members/AddMembers';
import Input from 'components/form_components/input/Input';
import { FEILD_LIST_DROPDOWN_TYPE, constructStaticValue, getGroupedFieldListForMapping } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { getLanguageAndCalendarDataThunk } from 'redux/actions/LanguageAndCalendarAdmin.Action';
import { FIELD_TYPES } from 'components/form_builder/FormBuilder.strings';
import CheckboxGroup from 'components/form_components/checkbox_group/CheckboxGroup';
import { FORM_POPOVER_STATUS } from 'utils/Constants';
import { useDispatch } from 'react-redux';
import styles from './TriggerConfiguration.module.scss';
import { FIELD_MAPPING_TYPES, NEW_MAPPING_DATA, FLOW_TRIGGER_CONSTANTS } from './TriggerConfiguration.constants';
import FieldMaping from './field_mapping/FieldMaping';
import { MAPPING_CONSTANTS } from './field_mapping/FieldMapping.constants';
import { getErrorListForMappingMatch, getvalidatedMappingErrorList } from './TriggerConfiguration.validation';
import { getAccountConfigurationDetailsApiService } from '../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { DELETE_STEP_LABEL } from '../../utils/strings/CommonStrings';
import { getDevRoutePath, showToastPopover } from '../../utils/UtilityFunctions';
import { CREATE_SEARCH_PARAMS, HOME } from '../../urls/RouteConstants';

let parentCancelToken = null;
let childCancelToken = null;
const getParentCancelToken = (token) => {
  parentCancelToken = token;
};
const geChildCancelToken = (token) => {
  childCancelToken = token;
};

function TriggerConfiguration(props) {
    const [isFileUploadInProgress, setFileUploadInProgress] = useState(false);
    const { t } = useTranslation();
    const {
      isTriggerConfigurationModalOpen,
      allFlowsList = [],
      isFlowListLoading,
      isChildFlowListLoading,
      isChildFlowDetailsLoading,
      flowsTotalCount,
      saveFlowTrigger,
      lstAllFields,
      childFlowlstAllFields,
      parentFlowName,
      parentFieldsTotalCount,
      childFieldsTotalCount,
      currentTrigger,
      getAllFlowListApi,
      setChildFlowData,
      setTriggerData,
      parentId,
      onGetAllFieldsByFilter,
      cancelOrCloseTriggerConfiguration,
      isActorsReadOnly,
      onAssigneeDataChange,
      onGetFlowChildDetailsByUUID,
      entity,
      documentsType,
      isShortcut = false,
      updateFieldList,
      allLstAllFields,
      allChildFlowlstAllFields,
      lstAllFieldsMetaData,
      childFlowlstAllFieldsMetaData,
      nameError = EMPTY_STRING,
      isDataListShortcut = false,
      entityId,
      entityUuid,
      loadingParentMappingFields,
      loadingChildMappingFields,
      triggerMappedUuids,
      currentTriggerData,
      onDeleteStepClick,
    } = props;

    const dispatch = useDispatch();
    const [configuredMaxFileSize, setConfiguredMaxFileSize] = useState(0);

    console.log('currentTriggerData', currentTriggerData);

    const [mappedFieldUuids, setMappedFieldUuids] = useState([]);
    const [isTriggerNameEdited, setIsTriggerNameEdited] = useState(false);
    const { CHILD_FIELD_MAPPING, VALUE_TYPE, PARENT_FIELD_MAPPING, TRIGGER_MAPPING,
      VALUE_TYPE_OPTION_LIST, FIELD_MAPPING }
    = MAPPING_CONSTANTS;

    useEffect(() => {
      console.log('mappedUuids update useEffect');
      setMappedFieldUuids(triggerMappedUuids);
    }, [triggerMappedUuids]);

    useEffect(() => {
      const paginationData = {
        page: 1,
        size: 2000,
        sort_by: 1,
        flow_id: parentId,
        include_property_picker: 1,
        ignore_field_types: [FIELD_TYPES.INFORMATION],
      };
      onGetAllFieldsByFilter(
        paginationData,
        FLOW_TRIGGER_CONSTANTS.PARENT_FLOW_FIELDS_SET_STATE_KEY,
        FEILD_LIST_DROPDOWN_TYPE.ALL,
        EMPTY_STRING,
        getParentCancelToken);
      getAccountConfigurationDetailsApiService().then(
        (response) => {
          setConfiguredMaxFileSize(response.maximum_file_size);
        },
      );
    }, []);

    useEffect(() => {
      if (currentTrigger?.child_flow_details?.child_flow_id) {
        const paginationData = {
          page: 1,
          size: 2000,
          sort_by: 1,
          flow_id: currentTrigger.child_flow_details.child_flow_id,
          ignore_field_types: [FIELD_TYPES.DATA_LIST_PROPERTY_PICKER, FIELD_TYPES.USER_PROPERTY_PICKER, FIELD_TYPES.INFORMATION],
          include_property_picker: 0,
        };
        onGetAllFieldsByFilter(
          paginationData,
          FLOW_TRIGGER_CONSTANTS.CHILD_FLOW_FIELDS_SET_STATE_KEY,
          FEILD_LIST_DROPDOWN_TYPE.ALL,
          EMPTY_STRING,
          geChildCancelToken);
      }
    }, [currentTrigger?.child_flow_details?.child_flow_id]);

    const onFlowListClick = () => {
      const currentTriggerDetails = cloneDeep(currentTrigger);
      if (currentTriggerDetails) {
        const searchWithPaginationData = {
            page: 1,
            size: 6,
          };
          getAllFlowListApi(searchWithPaginationData);
      }
    };
    const setFileUploadStatus = (status) => {
      setFileUploadInProgress(status);
  };

  const onParentFieldListClick = (table_uuid = undefined, parentMappingIndex) => {
    const fieldListDropdownType = table_uuid ? FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS : parentMappingIndex ? FEILD_LIST_DROPDOWN_TYPE.ALL_TABLE_FIELDS : FEILD_LIST_DROPDOWN_TYPE.ALL;
    const paginationData = {
      page: 1,
      size: 2000,
      sort_by: 1,
      flow_id: parentId,
      include_property_picker: 1,
      ignore_field_types: [FIELD_TYPES.INFORMATION],
    };
    console.log(lstAllFields, allLstAllFields, table_uuid, !isUndefined(table_uuid), fieldListDropdownType, getGroupedFieldListForMapping(table_uuid, allLstAllFields, mappedFieldUuids, fieldListDropdownType, t), ' fgfdgdgdgdgdgdgfg FLOW_TRIGGER_CONSTANTS PARENT_FLOW_FIELDS_SET_STATE_KEY');
    if (isEmpty(lstAllFields)) {
      if (parentCancelToken) parentCancelToken();
      onGetAllFieldsByFilter(paginationData, FLOW_TRIGGER_CONSTANTS.PARENT_FLOW_FIELDS_SET_STATE_KEY, fieldListDropdownType, table_uuid, getParentCancelToken);
    } else {
      updateFieldList(FLOW_TRIGGER_CONSTANTS.PARENT_FLOW_FIELDS_SET_STATE_KEY,
        getGroupedFieldListForMapping(table_uuid, allLstAllFields, mappedFieldUuids, fieldListDropdownType, t));
      updateFieldList(FLOW_TRIGGER_CONSTANTS.PARENT_FLOW_FIELDS_METADATA_SET_STATE_KEY,
        getGroupedFieldListForMapping(table_uuid, allLstAllFields, mappedFieldUuids, fieldListDropdownType, t));
    }
  };
  console.log('mappedUuids update onChildFieldListClick1', childFlowlstAllFields, mappedFieldUuids);
  const onChildFieldListClick = (table_uuid = undefined, parentMappingIndex, mappingIndex) => {
    const fieldListDropdownType = table_uuid ? FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS : parentMappingIndex ? FEILD_LIST_DROPDOWN_TYPE.ALL_TABLE_FIELDS : FEILD_LIST_DROPDOWN_TYPE.ALL;
    console.log('mappedUuids update onChildFieldListClick', childFlowlstAllFields, mappingIndex, parentMappingIndex, fieldListDropdownType, mappedFieldUuids);
    const paginationData = {
      page: 1,
      size: 2000,
      sort_by: 1,
      flow_id: currentTrigger.child_flow_details.child_flow_id,
      ignore_field_types: [FIELD_TYPES.DATA_LIST_PROPERTY_PICKER, FIELD_TYPES.USER_PROPERTY_PICKER, FIELD_TYPES.INFORMATION],
      include_property_picker: 0,
    };
    if (isEmpty(childFlowlstAllFields)) {
      if (childCancelToken) childCancelToken();
        onGetAllFieldsByFilter(paginationData, FLOW_TRIGGER_CONSTANTS.CHILD_FLOW_FIELDS_SET_STATE_KEY, fieldListDropdownType, table_uuid, geChildCancelToken);
    } else {
      const { trigger_mapping = [] } = cloneDeep(currentTrigger);
      const currentMapping = trigger_mapping[parentMappingIndex] || trigger_mapping[mappingIndex];
      const mappedColumns = [];
      if (currentMapping) {
        if (currentMapping.field_mapping) {
        (currentMapping.field_mapping || []).forEach((eachSubMapping) => {
          if (!isEmpty(get(eachSubMapping, ['child_field_details', 'field_uuid'], []))) {
            mappedColumns.push(get(eachSubMapping, ['child_field_details', 'field_uuid'], []));
          }
        });
      } else {
        const clonedMappedColumns = cloneDeep(mappedColumns);
        (trigger_mapping || []).forEach((eachMapping) => {
          clonedMappedColumns.push(eachMapping?.child_field_details?.field_uuid || eachMapping?.child_table_details?.table_uuid);
        });
        mappedColumns.push(...clonedMappedColumns);
      }
      }
      updateFieldList(FLOW_TRIGGER_CONSTANTS.CHILD_FLOW_FIELDS_SET_STATE_KEY,
        getGroupedFieldListForMapping(table_uuid, allChildFlowlstAllFields, mappedColumns, fieldListDropdownType, t));
      updateFieldList(FLOW_TRIGGER_CONSTANTS.CHILD_FLOW_FIELDS_METADATA_SET_STATE_KEY,
        getGroupedFieldListForMapping(table_uuid, allChildFlowlstAllFields, mappedColumns, fieldListDropdownType, t));
    }
  };

  useEffect(() => {
    dispatch(getLanguageAndCalendarDataThunk());
    onFlowListClick();
  }, []);

    const onLoadMoreFlows = (searchText) => {
      console.log('getAllFlowListApiapi call 3');
        const searchWithPaginationData = {
            page: Math.floor(allFlowsList.length / 6) + 1,
            size: 6,
          };
          if (searchText) searchWithPaginationData.search = searchText;
          getAllFlowListApi(searchWithPaginationData);
    };

    const onChildFlowListSearchInputChangeHandler = (value, isSearch = false) => {
      console.log('getAllFlowListApiapi call 4', isSearch);
      if (isSearch) {
        const searchWithPaginationData = {
          page: 1,
          size: 6,
        };
        if (value) searchWithPaginationData.search = value;
        getAllFlowListApi(searchWithPaginationData);
      }
    };

    const onChildFieldListSearchInputChangeHandler = (value, isSearch = false, table_uuid) => {
      if (!isEmpty(get(currentTrigger, ['child_flow_details', 'child_flow_id'], EMPTY_STRING)) &&
          isSearch) {
          if (value) {
            console.log('childFlowlstAllFields', childFlowlstAllFields);
            const searchChildFlowFields = childFlowlstAllFieldsMetaData?.filter((field) =>
            !field.disabled && field.label.toLowerCase().includes(value.toLowerCase()));
            updateFieldList('childFlowlstAllFields', searchChildFlowFields);
          } else onChildFieldListClick(table_uuid);
      }
    };

    const onParentFieldListSearchInputChangeHandler = (value, isSearch = false, table_uuid) => {
      if (isSearch) {
        if (value) {
          console.log('parentFlowlstAllFields', lstAllFields, lstAllFieldsMetaData);
          const searchParentFlowFields = lstAllFieldsMetaData?.filter((field) =>
          !field.disabled && field.label.toLowerCase().includes(value.toLowerCase()));
          console.log('parentFlowlstAllFields searchParentFlowFields', searchParentFlowFields);
          updateFieldList('parentFlowlstAllFields', searchParentFlowFields);
        } else onParentFieldListClick(table_uuid);
      }
    };

    const setChildFlow = (e) => {
      console.log('setChildFlow', e);
      if (isEmpty(e.target.value)) return;
      const currentTriggerDetails = cloneDeep(currentTrigger);
      const { trigger_mapping_error_list = {} } = cloneDeep(currentTriggerDetails);
      currentTriggerDetails.child_flow_details = {
        child_flow_uuid: e.target.value,
        child_flow_id: e.target.flow_id,
        child_flow_name: e.target.label,
      };
      if (!isTriggerNameEdited) {
        currentTriggerDetails.step_name = e.target.label;
        if (isActorsReadOnly) currentTriggerDetails.trigger_name = e.target.label;
      }
      currentTriggerDetails.trigger_mapping = [];
      if (trigger_mapping_error_list[FLOW_TRIGGER_CONSTANTS.FLOW_SELECTION.ID]) {
        delete trigger_mapping_error_list[FLOW_TRIGGER_CONSTANTS.FLOW_SELECTION.ID];
      }
      delete trigger_mapping_error_list[FLOW_TRIGGER_CONSTANTS.FLOW_SELECTION.STEP];
      delete trigger_mapping_error_list[FLOW_TRIGGER_CONSTANTS.FLOW_SELECTION.SHORTCUT_NAME];
      Object.keys(trigger_mapping_error_list).forEach((errorId) => {
        if (errorId.includes(`${MAPPING_CONSTANTS.TRIGGER_MAPPING}`) ||
            errorId.includes(`${MAPPING_CONSTANTS.TRIGGER_MAPPING}`)) {
          unset(trigger_mapping_error_list, [errorId]);
        }
      });
      currentTriggerDetails.trigger_mapping_error_list = trigger_mapping_error_list;
      setChildFlowData(currentTriggerDetails);
      onGetFlowChildDetailsByUUID(
        currentTriggerDetails.child_flow_details.child_flow_uuid,
        false,
        cloneDeep(currentTriggerDetails),
        false,
      );
    };

    const onAddMappingHandler = (parentMappingIndex) => {
      const currentTriggerDetails = cloneDeep(currentTrigger);
      const { trigger_mapping = [], trigger_mapping_error_list = {} } = cloneDeep(currentTriggerDetails);
      if (!isUndefined(parentMappingIndex)) {
        const currentMapping = cloneDeep(trigger_mapping[parentMappingIndex]);
        console.log('onAddMappingHandler new', cloneDeep(trigger_mapping[parentMappingIndex]));
        currentMapping.field_mapping = [...(currentMapping.field_mapping || []), NEW_MAPPING_DATA];
        trigger_mapping[parentMappingIndex] = currentMapping;
        delete trigger_mapping_error_list[`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID}`];
      } else {
          trigger_mapping.push(NEW_MAPPING_DATA);
        }
      currentTriggerDetails.trigger_mapping = trigger_mapping;
      currentTriggerDetails.trigger_mapping_error_list = trigger_mapping_error_list || {};
      setTriggerData(currentTriggerDetails);
    };

    const deleteCurrentMappingHandler = (index, parentMappingIndex) => {
      console.log('onAddMappingHandler', index);
      const currentTriggerDetails = cloneDeep(currentTrigger);
      const { trigger_mapping, trigger_mapping_error_list } = cloneDeep(currentTriggerDetails);
      const isDocumentFieldExist = isUndefined(parentMappingIndex) ?
      get(cloneDeep(currentTriggerDetails),
      ['trigger_mapping', index, 'child_field_details', 'field_type']) === FIELD_TYPES.FILE_UPLOAD :
      get(cloneDeep(currentTriggerDetails),
      ['trigger_mapping', parentMappingIndex, 'field_mapping', index, 'child_field_details', 'field_type']) === FIELD_TYPES.FILE_UPLOAD;
      const isStaticValueEmpty = isUndefined(parentMappingIndex) ?
      !isEmpty(
        get(cloneDeep(currentTriggerDetails),
      ['trigger_mapping', index, 'static_value'],
      [])) :
      !isEmpty(
        get(cloneDeep(currentTriggerDetails),
      ['trigger_mapping', parentMappingIndex, 'field_mapping', index, 'static_value'],
      []));
      if (cloneDeep(currentTriggerDetails) &&
      isDocumentFieldExist && isStaticValueEmpty) {
        const documentStaticValue = isUndefined(parentMappingIndex) ?
        cloneDeep(currentTriggerDetails).trigger_mapping[index].static_value :
        cloneDeep(currentTriggerDetails).trigger_mapping[parentMappingIndex].field_mapping[index].static_value;
        const removedDocList = documentStaticValue?.map((doc) => doc.fileId);
        currentTriggerDetails.removedDocList = [
          ...(currentTriggerDetails.removedDocList || []),
          ...removedDocList,
        ];
      }
      const currentMappedUuids = cloneDeep(mappedFieldUuids);
      if (isUndefined(parentMappingIndex)) {
        const currentMapping = cloneDeep(trigger_mapping[index]);
        if (!isEmpty(get(currentMapping, ['child_field_details', 'field_uuid'], []))) {
          const mappedIndex = currentMappedUuids.findIndex(((eachUuid) =>
          eachUuid === currentMapping?.child_field_details?.field_uuid));
          if (index > -1) currentMappedUuids.splice(mappedIndex, 1);
        }
        if (!isEmpty(get(currentMapping, ['child_table_details', 'table_uuid'], []))) {
          const mappedIndex = currentMappedUuids.findIndex(((eachUuid) =>
              eachUuid === currentMapping?.child_table_details?.table_uuid));
          if (index > -1) currentMappedUuids.splice(mappedIndex, 1);
        }
        Object.keys(trigger_mapping_error_list).forEach((errorId) => {
          if (errorId.includes(`${TRIGGER_MAPPING},${index}`)) {
            unset(trigger_mapping_error_list, [errorId]);
          }
        });
        trigger_mapping.splice(index, 1);
      } else {
        const currentTableMapping = cloneDeep(trigger_mapping[parentMappingIndex].field_mapping);
        if (!isEmpty(get(cloneDeep(trigger_mapping[parentMappingIndex].field_mapping),
            ['child_field_details', 'field_uuid'],
            []))) {
          currentTableMapping.field_mapping.forEach((eachSubMapping) => {
            if (eachSubMapping?.child_field_details?.field_uuid) {
              const mappedIndex = currentMappedUuids.findIndex(((eachUuid) =>
              eachUuid === eachSubMapping?.child_field_details?.field_uuid));
              if (index > -1) currentMappedUuids.splice(mappedIndex, 1);
            }
          });
        }
        currentTableMapping.splice(index, 1);
        trigger_mapping[parentMappingIndex].field_mapping = currentTableMapping;
        Object.keys(trigger_mapping_error_list).forEach((errorId) => {
          if (errorId.includes(`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${index}`)) {
            unset(trigger_mapping_error_list, [errorId]);
          }
        });
      }
      setMappedFieldUuids([...currentMappedUuids]);
      currentTriggerDetails.trigger_mapping = trigger_mapping;
      currentTriggerDetails.trigger_mapping_error_list = getvalidatedMappingErrorList(
        trigger_mapping_error_list || {},
        cloneDeep(currentTriggerDetails),
        lstAllFields,
        childFlowlstAllFields,
        t,
        configuredMaxFileSize,
      );
      setTriggerData(currentTriggerDetails);
    };

    const updateSubFlowMappingInfo = (id, event, mappingIndex, parentMappingIndex = undefined) => {
      const currentTriggerDetails = cloneDeep(currentTrigger);
      console.log('mappingInforchecknow', event, id, mappingIndex, parentMappingIndex, cloneDeep(currentTrigger));
      if (currentTriggerDetails) {
        const { trigger_mapping } = cloneDeep(currentTriggerDetails);
        const triggerMappingExists = isUndefined(parentMappingIndex) ?
        trigger_mapping && trigger_mapping[mappingIndex] :
        trigger_mapping && trigger_mapping[parentMappingIndex];
        if (triggerMappingExists) {
          const { trigger_mapping_error_list = {} } = cloneDeep(currentTriggerDetails);
          const currentMapping = isUndefined(parentMappingIndex) ?
            cloneDeep(trigger_mapping[mappingIndex]) : cloneDeep(trigger_mapping[parentMappingIndex]);
          switch (id) {
            case CHILD_FIELD_MAPPING.ID:
              console.log('CHILD_FIELD_MAPPING onchange', event, id, currentMapping, mappingIndex);
              if (event && event.target) {
                const { field_uuid, field_name, field_type, field_list_type, _id, choice_value_type, choice_values, label } = event.target;
                if (field_list_type === 'table') {
                    let currentMappedUuids = cloneDeep(mappedFieldUuids);
                    currentMappedUuids.push(event.target.table_uuid);
                    if (!isEmpty(get(currentMapping, ['child_table_details', 'table_uuid'], []))) {
                      currentMappedUuids = currentMappedUuids.filter((eachMappedUuid) =>
                        eachMappedUuid !== currentMapping.child_table_details.table_uuid);
                    }
                    setMappedFieldUuids([...currentMappedUuids]);
                  currentMapping.child_table_details = {
                    table_uuid: event.target.table_uuid,
                    table_name: event.target.table_name,
                    field_list_type: field_list_type,
                  };
                  delete currentMapping.child_field_details;
                } else {
                    let currentMappedUuids = cloneDeep(mappedFieldUuids);
                    currentMappedUuids.push(event.target.field_uuid);
                    if (!isEmpty(get(currentMapping, ['child_field_details', 'field_uuid'], []))) {
                      currentMappedUuids = currentMappedUuids.filter((eachMappedUuid) =>
                        eachMappedUuid !== currentMapping.child_field_details.field_uuid);
                    }
                    setMappedFieldUuids([...currentMappedUuids]);
                    currentMapping.child_field_details = {
                      field_uuid: field_uuid,
                      field_name: field_name,
                      field_type: field_type,
                      field_id: _id,
                      choice_value_type: choice_value_type,
                      choice_values: choice_values || [],
                      label: label,
                      ...(has(event.target, ['values'])) ?
                      { values: constructStaticValue(event.target.values, field_type) } : null,
                      ...(has(event.target, ['data_list'])) ?
                      { data_list: event.target.data_list } : null,
                      ...(event.target?.data_list_details) ? { data_list_details: event.target?.data_list_details } : {},
                    };
                    delete currentMapping.child_table_details;
                    delete currentMapping.field_mapping;
                }
                Object.keys(trigger_mapping_error_list).forEach((errorId) => {
                  if (errorId.includes(`${MAPPING_CONSTANTS.TRIGGER_MAPPING},${mappingIndex},${MAPPING_CONSTANTS.STATIC_VALUE.ID}`)
                      || errorId.includes(`${TRIGGER_MAPPING},${mappingIndex},${'child'}`) ||
                      errorId.includes(`${TRIGGER_MAPPING},${mappingIndex},${FIELD_MAPPING.ID}`)) {
                    unset(trigger_mapping_error_list, [errorId]);
                  }
                });
                console.log('currentMappingcurrentMapping delete', cloneDeep(currentMapping));
                if (get(currentMapping, ['static_value'])) {
                  delete currentMapping.static_value;
                  currentMapping.parent_field_details = {
                    field_uuid: '',
                    field_name: '',
                    field_type: '',
                  };
                }
                console.log('currentMappingcurrentMapping delete1', cloneDeep(currentTriggerDetails));
                currentMapping.value_type = currentMapping.value_type || VALUE_TYPE_OPTION_LIST()[1].value;
                console.log('currentMappingcurrentMapping delete2', cloneDeep(currentTriggerDetails));
              }
              break;
            case PARENT_FIELD_MAPPING.ID:
              console.log('PARENT_FIELD_MAPPING onchange', event, id, currentMapping, mappingIndex);
              if (event && event.target) {
                const { field_uuid, field_name, field_type, field_list_type, value, label, system_field_type, choice_value_type, choice_values } = event.target;
                if (field_list_type === 'table') {
                    let currentMappedUuids = cloneDeep(mappedFieldUuids);
                    currentMappedUuids.push(event.target.table_uuid);
                    if (!isEmpty(get(currentMapping, ['parent_table_details', 'table_uuid'], []))) {
                      currentMappedUuids = currentMappedUuids.filter((eachMappedUuid) =>
                        eachMappedUuid !== currentMapping.parent_table_details.table_uuid);
                    }
                  currentMapping.parent_table_details = {
                    table_uuid: event.target.table_uuid,
                    table_name: event.target.table_name,
                    field_list_type: field_list_type,
                  };
                  delete currentMapping.parent_field_details;
                } else {
                    let currentMappedUuids = cloneDeep(mappedFieldUuids);
                    currentMappedUuids.push(event.target.table_uuid);
                    if (!isEmpty(get(currentMapping, ['parent_field_details', 'field_uuid'], []))) {
                      currentMappedUuids = currentMappedUuids.filter((eachMappedUuid) =>
                        eachMappedUuid !== currentMapping.parent_field_details.field_uuid);
                    }
                    if (system_field_type === FIELD_MAPPING_TYPES.SYSTEM) {
                      currentMapping.parent_field_details = {
                        system_field: value,
                        field_name: label,
                        label,
                        field_type: field_type,
                      };
                    } else {
                      currentMapping.parent_field_details = {
                        field_uuid: field_uuid,
                        field_name: field_name,
                        field_type: field_type,
                        choice_value_type: choice_value_type,
                        choice_values: choice_values || [],
                        label: label,
                      };
                    }
                    delete currentMapping.parent_table_details;
                    delete currentMapping.field_mapping;
                  }
                  Object.keys(trigger_mapping_error_list).forEach((errorId) => {
                    if (errorId.includes(`${MAPPING_CONSTANTS.TRIGGER_MAPPING},${mappingIndex},${MAPPING_CONSTANTS.STATIC_VALUE.ID}`)
                        || errorId.includes(`${TRIGGER_MAPPING},${mappingIndex},${'parent'}`) ||
                        errorId.includes(`${TRIGGER_MAPPING},${mappingIndex},${FIELD_MAPPING.ID}`)) {
                      unset(trigger_mapping_error_list, [errorId]);
                    }
                  });
                }
              break;
            case VALUE_TYPE.ID:
              console.log('VALUE TYPE onchange', event, id, currentMapping, mappingIndex);
              if (event && event.target) {
                if (currentMapping?.value_type === 'static') {
                  const fieldType = get(currentMapping, ['child_field_details', 'field_type'], FIELD_TYPES.SINGLE_LINE);
                  if (fieldType === FIELD_TYPES.FILE_UPLOAD) {
                    if (currentMapping?.static_value) {
                      const removedDocList = [];
                      (currentMapping?.static_value || []).forEach(({ fileId }) => {
                        removedDocList.push(fileId);
                      });
                      currentTriggerDetails.removedDocList = [
                        ...(currentTriggerDetails.removedDocList || []),
                        ...removedDocList,
                      ];
                    }
                  }
                }
                if (event.target.value === 'dynamic' && currentMapping.value_type !== 'dynamic') {
                  currentMapping.parent_field_details = {
                    field_uuid: '',
                    field_name: '',
                    field_type: '',
                  };
                    delete trigger_mapping_error_list[`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},parent_field_uuid`];
                    Object.keys(trigger_mapping_error_list).forEach((errorId) => {
                      if (errorId.includes(`${MAPPING_CONSTANTS.TRIGGER_MAPPING},${mappingIndex},${MAPPING_CONSTANTS.STATIC_VALUE.ID}`)
                          || errorId.includes(`${TRIGGER_MAPPING},${mappingIndex},${'parent'}`) ||
                          (errorId.includes(`${TRIGGER_MAPPING},${mappingIndex},${'child'}`) &&
                          trigger_mapping_error_list[errorId].includes('mismatch'))) {
                        unset(trigger_mapping_error_list, [errorId]);
                      }
                    });
                }
                if (event.target.value === FIELD_MAPPING_TYPES.SYSTEM && currentMapping.value_type !== FIELD_MAPPING_TYPES.SYSTEM) {
                  currentMapping.parent_field_details = {
                    system_field: EMPTY_STRING,
                    field_name: EMPTY_STRING,
                    field_type: EMPTY_STRING,
                    label: EMPTY_STRING,
                  };
                    delete trigger_mapping_error_list[`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},parent_field_uuid`];
                    delete trigger_mapping_error_list[`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},parent_system_field`];
                    Object.keys(trigger_mapping_error_list).forEach((errorId) => {
                      if (errorId.includes(`${MAPPING_CONSTANTS.TRIGGER_MAPPING},${mappingIndex},${MAPPING_CONSTANTS.STATIC_VALUE.ID}`)
                          || errorId.includes(`${TRIGGER_MAPPING},${mappingIndex},${'parent'}`) ||
                          (errorId.includes(`${TRIGGER_MAPPING},${mappingIndex},${'child'}`) &&
                          trigger_mapping_error_list[errorId].includes('mismatch'))) {
                        unset(trigger_mapping_error_list, [errorId]);
                      }
                    });
                }
                if (event.target.value === 'static' && currentMapping.value_type !== 'static') {
                  delete currentMapping.static_value;
                  currentMapping.parent_field_details = {
                    field_uuid: '',
                    field_name: '',
                    field_type: '',
                  };
                  Object.keys(trigger_mapping_error_list).forEach((errorId) => {
                    if (errorId.includes(`${MAPPING_CONSTANTS.TRIGGER_MAPPING},${mappingIndex},${MAPPING_CONSTANTS.STATIC_VALUE.ID}`)
                        || errorId.includes(`${TRIGGER_MAPPING},${mappingIndex},${'parent'}`) ||
                        (errorId.includes(`${TRIGGER_MAPPING},${mappingIndex},${'child'}`) &&
                        trigger_mapping_error_list[errorId].includes('mismatch'))) {
                      unset(trigger_mapping_error_list, [errorId]);
                    }
                  });
                }
                currentMapping.value_type = event.target.value;
              }
              if (has(currentMapping, ['static_value'])) delete currentMapping.static_value;
              break;
            case `${FIELD_MAPPING.ID},${mappingIndex},${CHILD_FIELD_MAPPING.ID}`:
              if (event && event.target) {
                const { field_uuid, field_name, field_type, _id, choice_value_type, choice_values, label } = event.target;
                const currentSubMapping = cloneDeep(get(currentMapping, ['field_mapping', mappingIndex], []));
                console.log('tableonchange CHILD_FIELD_MAPPING0', event, currentMapping, mappingIndex, currentSubMapping, parentMappingIndex);
                if (!isEmpty(currentSubMapping)) {
                  console.log('tableonchange CHILD_FIELD_MAPPING', event, id, currentSubMapping);
                    let currentMappedUuids = cloneDeep(mappedFieldUuids);
                    currentMappedUuids.push(event.target.field_uuid);
                    if (!isEmpty(get(currentSubMapping, ['child_field_details', 'field_uuid'], []))) {
                      currentMappedUuids = currentMappedUuids.filter((eachMappedUuid) =>
                        eachMappedUuid !== currentSubMapping.child_field_details.field_uuid);
                    }
                    setMappedFieldUuids([...currentMappedUuids]);
                  currentSubMapping.child_field_details = {
                    field_uuid: field_uuid,
                    field_name: field_name,
                    field_type: field_type,
                    field_id: _id,
                    choice_value_type: choice_value_type,
                    choice_values: choice_values || [],
                    label: label,
                    ...(has(event.target, ['values'])) ?
                    { values: constructStaticValue(event.target.values, field_type) } : null,
                    ...(event.target?.data_list_details) ? { data_list_details: event.target?.data_list_details } : {},
                  };
                  Object.keys(trigger_mapping_error_list).forEach((errorId) => {
                    if (errorId.includes(`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},child`)) {
                      unset(trigger_mapping_error_list, [errorId]);
                    }
                  });
                  currentSubMapping.value_type = currentMapping.value_type || VALUE_TYPE_OPTION_LIST()[1].value;
                  currentMapping.field_mapping[mappingIndex] = currentSubMapping;
                }
              }
              break;
            case `${FIELD_MAPPING.ID},${mappingIndex},${PARENT_FIELD_MAPPING.ID}`:
                console.log('tableonchange PARENT_FIELD_MAPPING', event, id, currentMapping, mappingIndex);
                if (event && event.target) {
                  const { field_uuid, field_name, field_type, value, label, system_field_type, choice_value_type, choice_values } = event.target;
                  const currentSubMapping = cloneDeep(get(currentMapping, ['field_mapping', mappingIndex], []));
                  if (!isEmpty(currentSubMapping)) {
                    console.log('tableonchange CHILD_FIELD_MAPPING', event, id, currentSubMapping);
                    let currentMappedUuids = cloneDeep(mappedFieldUuids);
                    currentMappedUuids.push(event.target.field_uuid);
                    if (!isEmpty(get(currentSubMapping, ['parent_field_details', 'field_uuid'], []))) {
                      currentMappedUuids = currentMappedUuids.filter((eachMappedUuid) =>
                        eachMappedUuid !== currentSubMapping.parent_field_details.field_uuid);
                    }
                    if (system_field_type === FIELD_MAPPING_TYPES.SYSTEM) {
                      currentSubMapping.parent_field_details = {
                        system_field: value,
                        field_name: label,
                        label,
                        field_type: field_type,
                        ...(has(event.target, ['values'])) ?
                        { values: constructStaticValue(event.target.values, field_type) } : null,
                      };
                    } else {
                      currentSubMapping.parent_field_details = {
                        field_uuid: field_uuid,
                        field_name: field_name,
                        field_type: field_type,
                        choice_value_type: choice_value_type,
                        choice_values: choice_values || [],
                        label: label,
                        ...(has(event.target, ['values'])) ?
                        { values: constructStaticValue(event.target.values, field_type) } : null,
                      };
                    }
                    Object.keys(trigger_mapping_error_list).forEach((errorId) => {
                      if (errorId.includes(`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},parent`)) {
                        unset(trigger_mapping_error_list, [errorId]);
                      }
                    });
                    currentMapping.field_mapping[mappingIndex] = currentSubMapping;
                  }
                }
                break;
            case `${FIELD_MAPPING.ID},${mappingIndex},${VALUE_TYPE.ID}`:
              console.log('VALUE TYPE onchange', event, id, currentMapping, mappingIndex);
              const currentSubMapping = cloneDeep(get(currentMapping, ['field_mapping', mappingIndex], []));
              if (!isEmpty(currentSubMapping)) {
                if (event && event.target) {
                  if (currentSubMapping?.value_type === 'static') {
                    const fieldType = get(currentSubMapping, ['child_field_details', 'field_type'], FIELD_TYPES.SINGLE_LINE);
                    if (fieldType === FIELD_TYPES.FILE_UPLOAD) {
                      if (currentSubMapping?.static_value) {
                        const removedDocList = [];
                        (currentSubMapping?.static_value || []).forEach(({ fileId }) => {
                          removedDocList.push(fileId);
                        });
                        currentTriggerDetails.removedDocList = [
                          ...(currentTriggerDetails.removedDocList || []),
                          ...removedDocList,
                        ];
                      }
                    }
                  }
                  if (event.target.value === 'dynamic' && currentSubMapping.value_type !== 'dynamic') {
                    currentSubMapping.parent_field_details = {
                      field_uuid: '',
                      field_name: '',
                      field_type: '',
                    };
                    delete trigger_mapping_error_list[`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},parent_field_uuid`];
                    Object.keys(trigger_mapping_error_list).forEach((errorId) => {
                      if (errorId.includes(`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},${MAPPING_CONSTANTS.STATIC_VALUE.ID}`)
                          || errorId.includes(`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},${'parent'}`) ||
                          (errorId.includes(`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},${'child'}`) &&
                          trigger_mapping_error_list[errorId].includes('mismatch'))) {
                        unset(trigger_mapping_error_list, [errorId]);
                      }
                    });
                  }
                  if (event.target.value === FIELD_MAPPING_TYPES.SYSTEM && currentSubMapping.value_type !== FIELD_MAPPING_TYPES.SYSTEM) {
                    currentSubMapping.parent_field_details = {
                      system_field: EMPTY_STRING,
                      field_name: EMPTY_STRING,
                      field_type: EMPTY_STRING,
                    };
                    delete trigger_mapping_error_list[`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},parent_field_uuid`];
                    delete trigger_mapping_error_list[`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},parent_system_field`];
                    Object.keys(trigger_mapping_error_list).forEach((errorId) => {
                      if (errorId.includes(`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},${MAPPING_CONSTANTS.STATIC_VALUE.ID}`)
                          || errorId.includes(`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},${'parent'}`) ||
                          (errorId.includes(`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},${'child'}`) &&
                          trigger_mapping_error_list[errorId].includes('mismatch'))) {
                        unset(trigger_mapping_error_list, [errorId]);
                      }
                    });
                  }
                  if (event.target.value === 'static' && currentSubMapping.value_type !== 'static') {
                    delete currentSubMapping.static_value;
                    currentSubMapping.parent_field_details = {
                      field_uuid: '',
                      field_name: '',
                      field_type: '',
                    };
                    Object.keys(trigger_mapping_error_list).forEach((errorId) => {
                      if (errorId.includes(`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},${MAPPING_CONSTANTS.STATIC_VALUE.ID}`)
                          || errorId.includes(`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},${'parent'}`) ||
                          (errorId.includes(`${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},${'child'}`) &&
                          trigger_mapping_error_list[errorId].includes('mismatch'))) {
                        unset(trigger_mapping_error_list, [errorId]);
                      }
                    });
                  }
                  currentSubMapping.value_type = event.target.value;
                } else {
                    if (has(currentMapping, ['static_value'])) delete currentMapping.static_value;
                  }
                  currentMapping.field_mapping[mappingIndex] = currentSubMapping;
              }
              break;
            default:
            break;
          }
          isUndefined(parentMappingIndex) ?
          trigger_mapping[mappingIndex] = currentMapping :
          trigger_mapping[parentMappingIndex] = currentMapping;
          console.log('check mappingfields here list', cloneDeep(currentTriggerDetails));
          currentTriggerDetails.trigger_mapping = trigger_mapping;
          console.log('check mappingfields here list1', cloneDeep(currentTriggerDetails));
          const mappingError = getErrorListForMappingMatch(
            trigger_mapping_error_list || {},
            isUndefined(parentMappingIndex) ? currentMapping : currentMapping.field_mapping[mappingIndex],
            isUndefined(parentMappingIndex) ? mappingIndex : parentMappingIndex,
            allLstAllFields,
            allChildFlowlstAllFields,
            isUndefined(parentMappingIndex), // isSubMapping
            mappingIndex, // subMappingIndex
            t,
          );
          currentTriggerDetails.trigger_mapping_error_list = mappingError;
          console.log('triggermappingerror', mappingError, mappingIndex, cloneDeep(currentTriggerDetails));
          setTriggerData(cloneDeep(currentTriggerDetails));
        }
      }
    };

    const onChangeStaticValue = (event, mappingIndex, parentMappingIndex) => {
      const currentTriggerDetails = cloneDeep(currentTrigger);
      if (currentTriggerDetails) {
        const { trigger_mapping } = cloneDeep(currentTriggerDetails);
        const triggerMappingExists = isUndefined(parentMappingIndex) ?
        trigger_mapping && trigger_mapping[mappingIndex] :
        trigger_mapping && trigger_mapping[parentMappingIndex];
        if (triggerMappingExists) {
          const currentMapping = isUndefined(parentMappingIndex) ?
            cloneDeep(trigger_mapping[mappingIndex]) : cloneDeep(trigger_mapping[parentMappingIndex]);
          const currentSubMapping = !isUndefined(parentMappingIndex) && cloneDeep(currentMapping.field_mapping[mappingIndex]);
          const childFieldType = isUndefined(parentMappingIndex) ?
            get(currentMapping, ['child_field_details', 'field_type']) :
            get(currentSubMapping, ['child_field_details', 'field_type']);
          console.log('currentSubMapping onStaticValueCHange', event, childFieldType, trigger_mapping, mappingIndex, parentMappingIndex);
          if (childFieldType === FIELD_TYPES.FILE_UPLOAD) {
            const documents = [];
            if (event && event.target && event.target.value && (
              has(event.target, ['removed_doc']) || (
                !has(event.target, ['removed_doc']) && !isEmpty(event.target.value)
              )
            )) {
              (event.target.value || []).forEach((document) => {
                documents.push(
                  {
                    ...document,
                    progress: 100,
                  },
                );
              });
              console.log('deleteedd check', documents);
              if (event.target.removed_doc) {
                currentTriggerDetails.removedDocList = [
                  ...(currentTriggerDetails.removedDocList || []),
                  event.target.removed_doc,
                ];
              }
              const allDocuments = [...documents, ...get(currentTriggerDetails, ['document_details', 'documents'], [])];
              const documentsJson = allDocuments.map(JSON.stringify);
              console.log('allDocuments documentsJson', allDocuments, Array.from(new Set(documentsJson)).map(JSON.parse));
              isUndefined(parentMappingIndex) ? currentMapping.static_value = documents : currentSubMapping.static_value = documents;
              currentTriggerDetails.document_details = {
                documents: Array.from(new Set(documentsJson)).map(JSON.parse),
                entity: documents && documents[0] && documents[0].entity,
                entity_id: documents && documents[0] && documents[0].entity_id,
                ref_uuid: documents && documents[0] && documents[0].ref_uuid,
              };
              if (!has(currentTriggerDetails, ['_id'])
              && documents && documents[0] && documents[0].entity_id) {
                currentTriggerDetails._id = documents[0].entity_id;
                currentTriggerDetails.newStep = true;
              }
            }
          } else if (childFieldType === FIELD_TYPES.USER_TEAM_PICKER) {
              if (event?.target?.value) {
                const mapping = isUndefined(parentMappingIndex) ?
                cloneDeep(currentMapping) : cloneDeep(currentSubMapping);
                if (event?.target?.removeUserValue) {
                  const id = cloneDeep(event.target.value);
                  if (mapping.static_value && mapping.static_value.teams) {
                    if (find(mapping.static_value.teams, { _id: id })) {
                      remove(mapping.static_value.teams, { _id: id });
                      if (mapping.static_value.teams.length === 0) delete mapping.static_value.teams;
                    }
                  }
                  if (mapping.static_value && mapping.static_value.users) {
                    if (find(mapping.static_value.users, { _id: id })) {
                      remove(mapping.static_value.users, { _id: id });
                      if (mapping.static_value.users.length === 0) delete mapping.static_value.users;
                    }
                  }
                } else {
                    const team_or_user = event.target.value;
                    if (!mapping.static_value) mapping.static_value = {};
                    if (team_or_user.is_user) {
                      if (mapping?.static_value?.users) {
                        if (!find(mapping.static_value.users, { _id: team_or_user._id })) mapping.static_value.users.push(team_or_user);
                      } else {
                        mapping.static_value.users = [];
                        mapping.static_value.users.push(team_or_user);
                      }
                    } else if (!team_or_user.is_user) {
                      if (team_or_user.user_type) {
                        if (mapping.static_value && mapping.static_value.users) {
                          if (!find(mapping.static_value.users, { _id: team_or_user._id })) mapping.static_value.users.push(team_or_user);
                        } else {
                          mapping.static_value.users = [];
                          mapping.static_value.users.push(team_or_user);
                        }
                      } else {
                        if (mapping.static_value && mapping.static_value.teams) {
                          if (!find(mapping.static_value.teams, { _id: team_or_user._id })) mapping.static_value.teams.push(team_or_user);
                        } else {
                          mapping.static_value.teams = [];
                          mapping.static_value.teams.push(team_or_user);
                        }
                      }
                    }
                  }
                  isUndefined(parentMappingIndex) ? currentMapping.static_value = mapping.static_value : currentSubMapping.static_value = mapping.static_value;
              }
            } else if (childFieldType === FIELD_TYPES.DATA_LIST) {
                const mapping = isUndefined(parentMappingIndex) ?
                  cloneDeep(currentMapping) : cloneDeep(currentSubMapping);

                if (event?.remove) {
                  if (
                    isArray(mapping?.static_value) &&
                    mapping.static_value.find((datalistValue) => datalistValue.value === event?.target?.value)
                  ) {
                    remove(mapping?.static_value, { value: event?.target?.value });
                    if (isEmpty(mapping?.static_value)) mapping.static_value = null;
                  }
                } else {
                  if (isArray(mapping?.static_value)) {
                    mapping.static_value = uniqBy([...mapping.static_value, event?.target], (value) => value.value);
                  } else mapping.static_value = [event?.target];
                }
                isUndefined(parentMappingIndex) ? currentMapping.static_value = mapping.static_value : currentSubMapping.static_value = mapping.static_value;
              } else {
                isUndefined(parentMappingIndex) ? currentMapping.static_value = event.target.value : currentSubMapping.static_value = event.target.value;
              }
          if (!isUndefined(parentMappingIndex)) {
            currentMapping.field_mapping[mappingIndex] = currentSubMapping;
            trigger_mapping[parentMappingIndex] = cloneDeep(currentMapping);
            Object.keys(currentTriggerDetails.trigger_mapping_error_list).forEach((errorId) => {
              if (errorId.includes(`${MAPPING_CONSTANTS.TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},${MAPPING_CONSTANTS.STATIC_VALUE.ID}`)
                 ) {
                unset(currentTriggerDetails.trigger_mapping_error_list, [errorId]);
              }
            });
          } else {
            trigger_mapping[mappingIndex] = cloneDeep(currentMapping);
            Object.keys(currentTriggerDetails.trigger_mapping_error_list).forEach((errorId) => {
              if (errorId.includes(`${MAPPING_CONSTANTS.TRIGGER_MAPPING},${mappingIndex},${MAPPING_CONSTANTS.STATIC_VALUE.ID}`)) {
                unset(currentTriggerDetails.trigger_mapping_error_list, [errorId]);
              }
            });
          }
          currentTriggerDetails.trigger_mapping = trigger_mapping;
          console.log('triggermappingerror', currentSubMapping, event, mappingIndex, cloneDeep(currentTriggerDetails), cloneDeep(currentMapping));
          setTriggerData(currentTriggerDetails);
        }
      }
    };

    const onChangeCancelWithParent = () => {
      const currentTriggerDetails = cloneDeep(currentTrigger);
      currentTriggerDetails.cancel_with_parent = !currentTriggerDetails.cancel_with_parent;
      setTriggerData(currentTriggerDetails);
    };

    const onLoadMoreParentFlowFields = () => {
    };

    const onLoadMoreChildFlowFields = () => {
    };

    const onDeleteTriggerStep = () => {
      if (currentTriggerData?._id) onDeleteStepClick(currentTriggerData?._id);
      else cancelOrCloseTriggerConfiguration();
    };

    const handleShortcutNameChange = (e) => {
      const currentTriggerDetails = cloneDeep(currentTrigger) || {};
      const { trigger_mapping_error_list = {} } = cloneDeep(currentTriggerDetails);
      isShortcut ? currentTriggerDetails.trigger_name = e.target.value :
      currentTriggerDetails.step_name = e.target.value;
      delete trigger_mapping_error_list[FLOW_TRIGGER_CONSTANTS.FLOW_SELECTION.STEP];
      if (isShortcut) delete trigger_mapping_error_list[FLOW_TRIGGER_CONSTANTS.FLOW_SELECTION.SHORTCUT_NAME];
      currentTriggerDetails.trigger_mapping_error_list = trigger_mapping_error_list;
      setTriggerData(currentTriggerDetails, true);
      setIsTriggerNameEdited(true);
    };

    const {
      trigger_mapping = [],
      child_flow_details = {},
      trigger_mapping_error_list = {},
      document_details = [],
    } = cloneDeep(currentTrigger);

    const users = get(child_flow_details, ['child_flow_initial_step_assignees', 0, 'assignees', 'users'], []);
    const teams = get(child_flow_details, ['child_flow_initial_step_assignees', 0, 'assignees', 'teams'], []);

    const initialStepActors = [...users, ...teams].map((member) => {
      return { ...member, isDeleteDisabled: true };
    });

    return (
        <ModalLayout
          id={FLOW_TRIGGER_CONSTANTS.TRIGGER_CONFIG_MODAL_ID}
          isModalOpen={isTriggerConfigurationModalOpen}
          onCloseClick={cancelOrCloseTriggerConfiguration}
          modalContainerClass={cx(styles.ContentModal, gClasses.ModalContentClassWithoutPadding, gClasses.ZIndex6)}
          headerClassName={styles.ModalHeader}
          closeIconClass={styles.CloseIcon}
          headerContent={(
            <div className={cx(styles.Header, BS.JC_BETWEEN, BS.D_FLEX, gClasses.FTwo18GrayV3, gClasses.FontWeight500)}>
              {isActorsReadOnly ? t(FLOW_TRIGGER_CONSTANTS.TRIGGER_SHORTCUT_HEADER)
              : t(FLOW_TRIGGER_CONSTANTS.TRIGGER_CONFIG_HEADER)}
            </div>
          )}
          mainContentClassName={styles.MainContent}
          mainContent={(
           <div className={cx(styles.MainContainer, BS.JC_END)}>
                <div className={cx(styles.ContentContainer, gClasses.MB70)}>
                    <div className={styles.ChooseFlowContainer}>
                      <Dropdown
                        isDataLoading={isFlowListLoading || isChildFlowDetailsLoading}
                        loadingOptionList={isChildFlowListLoading}
                        handleBlurDropdown={onFlowListClick}
                        isRequire
                        className={styles.ChooseFlowDropdown}
                        optionList={allFlowsList}
                        errorMessageClassName={styles.ChooseFlowDropdown}
                        placeholder={t(FLOW_TRIGGER_CONSTANTS.FLOW_SELECTION.PLACEHOLDER)}
                        id={FLOW_TRIGGER_CONSTANTS.FLOW_SELECTION.ID}
                        label={t(FLOW_TRIGGER_CONSTANTS.FLOW_SELECTION.LABEL)}
                        showNoDataFoundOption
                        selectedValue={currentTrigger && currentTrigger.child_flow_details &&
                          currentTrigger.child_flow_details.child_flow_name}
                        onChange={(e) => setChildFlow(e)}
                        strictlySetSelectedValue
                        disablePopper
                        setSelectedValue
                        errorMessage={trigger_mapping_error_list[FLOW_TRIGGER_CONSTANTS.FLOW_SELECTION.ID] || EMPTY_STRING}
                        isPaginated
                        hasMore={flowsTotalCount > allFlowsList.length}
                        loadDataHandler={onLoadMoreFlows}
                        enableSearch
                        onSearchInputChange={onChildFlowListSearchInputChangeHandler}
                        hideDropdownListLabel
                        isRequired
                        disableFocusFilter
                      />
                  {
                    !isChildFlowDetailsLoading && (
                      <div className={cx(BS.TEXT_RIGHT)}>
                        <Link className={cx(gClasses.FTwo13, gClasses.FontWeight500)} to={{ pathname: getDevRoutePath(HOME), search: new URLSearchParams({ create: CREATE_SEARCH_PARAMS.FLOW }).toString() }} target="_blank">
                          {t(FLOW_TRIGGER_CONSTANTS.CREATE_FLOW_LINK)}
                        </Link>
                      </div>
                    )
                  }
                    </div>
                    {currentTrigger &&
                    !isChildFlowDetailsLoading &&
                    !isEmpty(get(currentTrigger,
                      ['child_flow_details', 'child_flow_name'],
                        EMPTY_STRING)) &&
                      (
                        <>
                                <Input
                                  label={isActorsReadOnly ? t(FLOW_TRIGGER_CONSTANTS.SHORTCUT_NAME.LABEL) : t(FLOW_TRIGGER_CONSTANTS.STEP_NAME.LABEL)}
                                  onChangeHandler={handleShortcutNameChange}
                                  className={styles.InputContainer}
                                  isRequired
                                  value={isShortcut ? currentTrigger?.trigger_name : currentTrigger?.step_name}
                                  id={isActorsReadOnly ? FLOW_TRIGGER_CONSTANTS.SHORTCUT_NAME.ID : FLOW_TRIGGER_CONSTANTS.STEP_NAME.ID}
                                  errorMessage={trigger_mapping_error_list[FLOW_TRIGGER_CONSTANTS.SHORTCUT_NAME.ID] ||
                                    trigger_mapping_error_list.step_name || nameError}
                                />
                                {
                                  isActorsReadOnly ? (
                                <AddMembers
                                  id={FLOW_TRIGGER_CONSTANTS.INITIAL_STEP_ACTORS.ID}
                                  label={t(FLOW_TRIGGER_CONSTANTS.INITIAL_STEP_ACTORS.LABEL)}
                                  selectedData={initialStepActors}
                                  removeSelectedUser={() => {}}
                                  setMemberSearchValue={() => {}}
                                  onUserSelectHandler={() => {}}
                                  isDataLoading={isFlowListLoading}
                                  innerClassName={gClasses.BorderLessInput}
                                  hideSuggestionFieldInput
                                  hideErrorMessage
                                />
                            ) : (
                              <Actors
                                data={cloneDeep({ ...currentTrigger, flow_id: parentId })}
                                triggerStep
                                assigneeErrorList={cloneDeep(currentTrigger).assignee_error_list || {}}
                                onAssigneeDataChange={onAssigneeDataChange}
                                parentId={parentId}
                                readOnlyClass={styles.ReadOnlyClass}
                                metaData={{
                                  moduleId: parentId,
                                  stepUUID: currentTrigger?.step_uuid,
                                }}
                              />
                            )
                          }
                          <FieldMaping
                            onAddNewMapping={onAddMappingHandler}
                            trigger_mapping={trigger_mapping}
                            parentFlowName={parentFlowName}
                            deleteCurrentMapping={deleteCurrentMappingHandler}
                            parentFlowFieldList={lstAllFields}
                            childFlowFieldList={childFlowlstAllFields}
                            childFlowName={currentTrigger && currentTrigger.child_flow_details &&
                              currentTrigger.child_flow_details.child_flow_name}
                            updateMappingInfo={updateSubFlowMappingInfo}
                            errorList={trigger_mapping_error_list}
                            onLoadMoreParentFlowFields={onLoadMoreParentFlowFields}
                            onLoadMoreChildFlowFields={onLoadMoreChildFlowFields}
                            parentFieldsTotalCount={parentFieldsTotalCount}
                            childFieldsTotalCount={childFieldsTotalCount}
                            onParentFieldListSearchInputChangeHandler={onParentFieldListSearchInputChangeHandler}
                            onChildFieldListSearchInputChangeHandler={onChildFieldListSearchInputChangeHandler}
                            onChangeStaticValue={onChangeStaticValue}
                            parentId={!isShortcut ? parentId : null}
                            entityId={entityId}
                            entityUuid={entityUuid}
                            entity={entity}
                            documentsType={documentsType}
                            onParentFieldListClick={onParentFieldListClick}
                            onChildFieldListClick={onChildFieldListClick}
                            isDataListShortcut={isDataListShortcut}
                            loadingChildMappingFields={loadingChildMappingFields}
                            loadingParentMappingFields={loadingParentMappingFields}
                            document_details={document_details}
                            setFileUploadStatus={setFileUploadStatus}
                          />
                          {!isShortcut &&
                          (
                            <div className={gClasses.MT15}>
                            <CheckboxGroup
                              optionList={MAPPING_CONSTANTS.CANCEL_PARENT_OPTION_LIST(t)}
                              onClick={onChangeCancelWithParent}
                              selectedValues={currentTrigger.cancel_with_parent ? [1] : []}
                              hideLabel
                            />
                            </div>
                            )}
                        </>
                      )
                    }
                </div>
           </div>
          )}
          footerContent={(
            <div className={cx(BS.W100, BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
            <div
              className={cx(
                BS.D_FLEX,
                BS.JC_BETWEEN,
                    BS.W100,
              )}
            >
                <div className={gClasses.CenterV}>
                  <Button
                    buttonType={BUTTON_TYPE.LIGHT}
                    className={styles.DeleteButton}
                    onClick={onDeleteTriggerStep}
                  >
                    {t(DELETE_STEP_LABEL)}
                  </Button>
                </div>
                <div className={gClasses.CenterV}>
                  <Button
                    buttonType={BUTTON_TYPE.LIGHT}
                    className={cx(BS.TEXT_NO_WRAP, styles.CancelButton, gClasses.MR15)}
                    onClick={cancelOrCloseTriggerConfiguration}
                  >
                    {t(FLOW_TRIGGER_CONSTANTS.CANCEL_BUTTON)}
                  </Button>
                  <Button
                  buttonType={BUTTON_TYPE.PRIMARY}
                  className={cx(BS.TEXT_NO_WRAP)}
                  onClick={() => {
                    if (isFileUploadInProgress) {
                      showToastPopover(
                        `${t(FLOW_TRIGGER_CONSTANTS.FILE_UPLOAD)} ${FORM_POPOVER_STRINGS.FILE_UPLOAD_IN_PROGRESS}`,
                        EMPTY_STRING,
                        FORM_POPOVER_STATUS.SERVER_ERROR,
                        true,
                      );
                      return false;
                    }
                    saveFlowTrigger();
                    return true;
                  }}
                  >
                  {t(FLOW_TRIGGER_CONSTANTS.SAVE_BUTTON)}
                  </Button>
                </div>
            </div>
            </div>
          )}
        />
    );
}

export default TriggerConfiguration;
