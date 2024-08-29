import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigModal from '../../../components/config_modal/ConfigModal';
import { FIELD_CONFIGURATION_STRINGS } from './ManageFlowFields.strings';
import GeneralConfiguration from './general/GeneralConfiguration';
import { FIELD_TYPES, MANAGE_FLOW_FIELDS_CONFIG_TABS, MANAGE_FLOW_FIELDS_TAB_OPTIONS, MANAGE_FLOW_FIELD_INITIAL_STATE, REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from './ManageFlowFields.constants';
import AdditionalConfiguration from './additional/AdditionalConfiguration';
import { CONFIG_BUTTON_ARRAY, basicFieldsValidationData, constructFlowFieldsPostData, formatGetFieldsAPIResponse, updateLoaderStatus } from './ManageFlowFields.utils';
import { manageFlowFieldsConfigDataChange, useManageFlowFieldsConfig } from './use_manage_flow_fields_reducer/useManageFlowFieldsReducer';
import { MODULE_TYPES } from '../../../utils/Constants';
import { basicFieldsValidationSchema } from './ManageFlowFields.validation.schema';
import { validate } from '../../../utils/UtilityFunctions';
import jsUtility, { isEmpty } from '../../../utils/jsUtility';
import { saveField } from '../../../axios/apiService/createTask.apiService';
import { apiGetAllFieldsList } from '../../../axios/apiService/flow.apiService';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { normalizer } from '../../../utils/normalizer.utils';
import { saveTable } from '../../../axios/apiService/form.apiService';
import { FIELD_TYPE } from '../../../utils/constants/form.constant';
import { getErrorTabsList } from '../node_configuration/NodeConfiguration.utils';

function FieldConfiguration(props) {
   const { onCloseClick, metaData, isDocumentGeneration = false, onSaveFieldResponse, getSaveTableResponse = false } = props;
   const { state, dispatch } = useManageFlowFieldsConfig();
   const { fieldDetails } = state;
   const { t } = useTranslation();
   const [tabIndex, setTabIndex] = useState(MANAGE_FLOW_FIELDS_CONFIG_TABS.GENERAL);
  const [isFocused, setIsFocused] = useState({ visibility: false, isSave: false }); // to make onClick event of onSave have precedence over onBlur event of tech ref name

   const setFieldDetails = (currentFieldDetails) => {
      dispatch(manageFlowFieldsConfigDataChange({ fieldDetails: currentFieldDetails }));
   };

   const onTabChange = (value) => {
      console.log('tabchangechanges');
      setTabIndex(value);
   };

   const validateData = (data) => {
      if (isDocumentGeneration) {
         dispatch(manageFlowFieldsConfigDataChange({ fieldDetails: { ...fieldDetails, fieldType: FIELD_TYPE.FILE_UPLOAD } }));
      }
      const commonDataToBeValidated = basicFieldsValidationData(data, false);
      const commonErrorList = validate(commonDataToBeValidated, basicFieldsValidationSchema(t, isDocumentGeneration));
      return commonErrorList;
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
         const formatedResponse = formatGetFieldsAPIResponse(allFieldsRawData, t);
         dispatch(manageFlowFieldsConfigDataChange({ isFieldsLoading: false, fieldsList: formatedResponse, flowId: metaData?.moduleId }));
         updateLoaderStatus(false);
      } catch (e) {
         updateLoaderStatus(false);
         console.log(e);
      }
   };

   const onCloseClickHandler = () => {
      dispatch(manageFlowFieldsConfigDataChange({ fieldDetails: MANAGE_FLOW_FIELD_INITIAL_STATE.fieldDetails }));
      onCloseClick(false);
      if (!isDocumentGeneration) {
         getFields();
      }
   };

   const onSaveClickHandler = (updatedTechRefnameData = {}) => {
      setIsFocused({ isSave: false, visibility: false });
      console.log('Saveclickedvalidationdata', validateData(state));
      const errorList = validateData(state);
      dispatch(manageFlowFieldsConfigDataChange({ fieldDetails: { ...fieldDetails, errorList: errorList }, isSaveClicked: true }));
      let newState = state;
      // to make onClick event of onSave have precedence over onBlur event of tech ref name
      if (!isEmpty(updatedTechRefnameData)) newState = { ...newState, fieldDetails: { ...newState?.fieldDetails, ...updatedTechRefnameData } };
      if (jsUtility.isEmpty(errorList)) {
         const postData = constructFlowFieldsPostData(newState, false, metaData?.moduleId, isDocumentGeneration);
         updateLoaderStatus(true);
         if (fieldDetails?.fieldType === FIELD_TYPES.TABLE) {
            saveTable(postData)
               .then((response) => {
                  console.log('sjkdhs', response);
                  updateLoaderStatus(false);
                  onCloseClick(false);
                  getFields();
                  if (getSaveTableResponse) {
                     onCloseClickHandler();
                     onSaveFieldResponse({ ...postData, ...response });
                  }
               })
               .catch((error) => {
                  console.log('saveclickedtableerrorlist', error);
                  updateLoaderStatus(false);
               });
         } else {
            saveField(postData)
               .then((response) => {
                  console.log('saveclickedresponse', response);
                  updateLoaderStatus(false);
                  onCloseClickHandler();
                  onSaveFieldResponse({ ...postData, ...response });
               })
               .catch((error) => {
                  console.log('saveclickederrorlist', error);
                  updateLoaderStatus(false);
               });
            console.log('postData', postData);
         }
      } else {
         console.log('errorList', errorList);
      }
   };

   const onCancelClickHandler = () => {
      dispatch(manageFlowFieldsConfigDataChange({ fieldDetails: MANAGE_FLOW_FIELD_INITIAL_STATE.fieldDetails }));
      onCloseClick(false);
      getFields();
   };

   const getModalTitle = () => {
      let title = FIELD_CONFIGURATION_STRINGS(t).TITLE;
      const type = fieldDetails?.fieldTypeLabel;
      title += (type) ? ` : ${type}` : EMPTY_STRING;
      return title;
   };

   let tabContent = (
      <GeneralConfiguration
         metaData={metaData}
         isDocumentGeneration={isDocumentGeneration}
      />
   );
   if (tabIndex === MANAGE_FLOW_FIELDS_CONFIG_TABS.ADDITIONAL) {
      tabContent = (
         <AdditionalConfiguration
            setFieldDetails={setFieldDetails}
            fieldDetails={state?.fieldDetails}
            moduleType={MODULE_TYPES.FLOW}
            metaData={metaData}
            tableColumns={fieldDetails?.columns}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            onSaveFormFieldFunction={onSaveClickHandler}
         />
      );
   }

   return (
      <div>
         <ConfigModal
            isModalOpen
            errorTabList={state?.isSaveClicked && getErrorTabsList(
               'manage_flow_fields',
               state?.fieldDetails?.errorList,
             )}
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

export default FieldConfiguration;
