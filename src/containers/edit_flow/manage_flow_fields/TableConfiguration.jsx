import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MANAGE_FLOW_FIELDS_CONFIG_TABS, MANAGE_FLOW_FIELDS_TAB_OPTIONS, MANAGE_FLOW_FIELD_INITIAL_STATE, REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from './ManageFlowFields.constants';
import { manageFlowFieldsConfigDataChange, useManageFlowFieldsConfig } from './use_manage_flow_fields_reducer/useManageFlowFieldsReducer';
import { MODULE_TYPES } from '../../../utils/Constants';
import { CONFIG_BUTTON_ARRAY, basicFieldsValidationData, constructFlowFieldsPostData, formatGetFieldsAPIResponse, getFormattedFieldDetails, updateLoaderStatus } from './ManageFlowFields.utils';
import { FIELD_CONFIGURATION_STRINGS } from './ManageFlowFields.strings';
import ConfigModal from '../../../components/config_modal/ConfigModal';
import AdditionalConfiguration from './additional/AdditionalConfiguration';
import GeneralConfiguration from './general/GeneralConfiguration';
import { validate } from '../../../utils/UtilityFunctions';
import { basicFieldsValidationSchema } from './ManageFlowFields.validation.schema';
import jsUtility, { isEmpty } from '../../../utils/jsUtility';
import { saveField } from '../../../axios/apiService/createTask.apiService';
import { saveTable } from '../../../axios/apiService/form.apiService';
import { apiGetAllFieldsList } from '../../../axios/apiService/flow.apiService';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { FIELD_LIST_TYPE } from '../../../utils/constants/form.constant';
import { normalizer } from '../../../utils/normalizer.utils';

function TableConfiguration(props) {
   const { isModalOpen, metaData, metaData: { moduleId: flowId } } = props;
   const { state, dispatch } = useManageFlowFieldsConfig();
   const { columnDetails, fieldDetails } = state;
   const { columns = [] } = fieldDetails;
   const { t } = useTranslation();
   const [tabIndex, setTabIndex] = useState(MANAGE_FLOW_FIELDS_CONFIG_TABS.GENERAL);
   const setFieldDetails = (currentFieldDetails) => {
      dispatch(manageFlowFieldsConfigDataChange({ columnDetails: currentFieldDetails }));
   };
  const [isFocused, setIsFocused] = useState({ visibility: false, isSave: false }); // to make onClick event of onSave have precedence over onBlur event of tech ref name

   const onTabChange = (value) => {
      setTabIndex(value);
   };

   const getFields = async () => {
      try {
         updateLoaderStatus(true);
         const response = await apiGetAllFieldsList({ size: 1000, page: 1, sort_by: 1, flow_id: metaData?.moduleId });
         const allFieldsRawData = normalizer(
            response,
            REQUEST_FIELD_KEYS,
            RESPONSE_FIELD_KEYS,
         );
         const formatedResponse = formatGetFieldsAPIResponse({ allData: allFieldsRawData, fieldDetails: allFieldsRawData?.fieldDetails, t });
         dispatch(manageFlowFieldsConfigDataChange({ isFieldsLoading: false, fieldsList: formatedResponse, flowId: metaData?.moduleId }));
         updateLoaderStatus(false);
      } catch (e) {
         updateLoaderStatus(false);
         console.log(e);
      }
   };

   const onCloseClickHandler = () => {
      dispatch(manageFlowFieldsConfigDataChange({ isTableColConfigOpen: false, columnDetails: MANAGE_FLOW_FIELD_INITIAL_STATE.columnDetails }));
      getFields();
   };

   const validateData = (data) => {
      const commonDataToBeValidated = basicFieldsValidationData(data, true);
      const commonErrorList = validate(commonDataToBeValidated, basicFieldsValidationSchema(t));
      return commonErrorList;
   };

   const saveFieldFunc = (tableResponse) => {
      // save_field API
      let tableUuid = null;
      if (jsUtility.isEmpty(tableResponse?.field_uuid)) {
         tableUuid = columnDetails?.tableUuid;
      } else {
         tableUuid = tableResponse?.field_uuid;
      }
      const colPostData = constructFlowFieldsPostData({ ...state, columnDetails: { ...columnDetails, tableUuid: tableUuid } }, true, flowId);
      updateLoaderStatus(true);
      saveField(colPostData)
         .then((response) => {
            let updatedColumns;
            const formattedResponse = { ...getFormattedFieldDetails({ columnDetails: { ...columnDetails, referenceName: response?.reference_name, fieldUuid: response?.field_uuid, _id: response?._id, tableUuid: tableUuid }, t }) };

            const index = columns?.findIndex((column) => column?.fieldUuid === response?.field_uuid);

            if (index > -1) {
               updatedColumns = [...columns];
               updatedColumns[index] = formattedResponse;
            } else {
               updatedColumns = [...columns, formattedResponse];
            }

            updateLoaderStatus(false);

            dispatch(manageFlowFieldsConfigDataChange({ isTableColConfigOpen: false, columnDetails: MANAGE_FLOW_FIELD_INITIAL_STATE.columnDetails, fieldDetails: { ...fieldDetails, columns: updatedColumns, fieldUuid: tableUuid, _id: tableResponse?._id || fieldDetails?._id } }));

            getFields();
         })
         .catch((error) => {
            console.log('saveclickederrorlist', error);
            updateLoaderStatus(false);
         });
      console.log('colPostData', colPostData);
   };

   const onSaveClickHandler = (updatedTechRefnameData = {}) => {
      setIsFocused({ isSave: false, visibility: false });
      console.log('Saveclickedvalidationdata', validateData(state));
      const errorList = validateData(state);
      dispatch(manageFlowFieldsConfigDataChange({ columnDetails: { ...columnDetails, errorList: errorList } }));
      let newState = state;
      // to make onClick event of onSave have precedence over onBlur event of tech ref name
      if (!isEmpty(updatedTechRefnameData)) newState = { ...newState, columnDetails: { ...newState?.columnDetails, ...updatedTechRefnameData } };
      if (jsUtility.isEmpty(errorList)) {
         if (jsUtility.isEmpty(columnDetails?.tableUuid)) {
            // save_table API
            const tablePostData = constructFlowFieldsPostData(newState, false, flowId);
            updateLoaderStatus(true);
            saveTable(tablePostData)
               .then((tableResponse) => {
                  // calling save_field API
                  saveFieldFunc(tableResponse);
               })
               .catch((error) => {
                  console.log('savetableerror', error);
                  updateLoaderStatus(false);
               });
            console.log('tablePostData', tablePostData);
         } else {
            saveFieldFunc();
         }
      } else {
         console.log('errorList', errorList);
      }
   };

   const onCancelClickHandler = () => {
      dispatch(manageFlowFieldsConfigDataChange({ isTableColConfigOpen: false, columnDetails: MANAGE_FLOW_FIELD_INITIAL_STATE.columnDetails }));
   };

   const getModalTitle = () => {
      let title = FIELD_CONFIGURATION_STRINGS(t).TITLE;
      if (!columnDetails?.fieldListType === FIELD_LIST_TYPE.TABLE) {
         const type = columnDetails?.fieldTypeLabel;
         title += (type) ? ` : ${type}` : EMPTY_STRING;
      }
      console.log('sjndjks', columnDetails, fieldDetails);
      if (jsUtility.isEmpty(columnDetails?.fieldUuid)) {
         title += ' - Add Column';
      } else {
         title += ' - Edit Column';
      }
      return title;
   };

   let tabContent = (
      <div>
         <GeneralConfiguration
            isTableColumn
         />
      </div>
   );
   if (tabIndex === MANAGE_FLOW_FIELDS_CONFIG_TABS.ADDITIONAL) {
      tabContent = (
         <div>
            <AdditionalConfiguration
               setFieldDetails={setFieldDetails}
               fieldDetails={columnDetails}
               moduleType={MODULE_TYPES.FLOW}
               metaData={metaData}
               tableColumns={columnDetails?.columns}
               isFocused={isFocused}
               setIsFocused={setIsFocused}
               onSaveFormFieldFunction={onSaveClickHandler}
            />
         </div>
      );
   }

   return (
      <div>
         <ConfigModal
            isModalOpen={isModalOpen}
            modalTitle={getModalTitle()}
            modalBodyContent={tabContent}
            tabOptions={MANAGE_FLOW_FIELDS_TAB_OPTIONS(t)}
            onTabSelect={onTabChange}
            currentTab={tabIndex}
            footerButton={CONFIG_BUTTON_ARRAY(onSaveClickHandler, onCancelClickHandler, () => setIsFocused({ ...isFocused, isSave: true }))}
            onCloseClick={onCloseClickHandler}
         />
      </div>
   );
}

export default TableConfiguration;
