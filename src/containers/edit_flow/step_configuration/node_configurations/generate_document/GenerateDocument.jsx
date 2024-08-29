import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import ConfigModal from '../../../../../components/config_modal/ConfigModal';
import { GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS } from './GenerateDocument.strings';
import GeneralConfiguration from './general/GeneralConfiguration';
import StatusDropdown from '../status_dropdown/StatusDropdown';
import { apiGetAllFieldsList } from '../../../../../axios/apiService/flow.apiService';
import {
  nodeConfigDataChange,
  useFlowNodeConfig,
} from '../../../node_configuration/use_node_reducer/useNodeReducer';
import {
  constructDocumentGenerationPostData,
  formatGenerateDocumentData,
  getAllTablesFromSections,
  getDocumentGenerationValidationData,
  isFileUploadField,
} from './GenerateDocument.utils';
import {
  DELETE_STEP_LABEL,
  DOCUMENT_TYPES,
  EMPTY_STRING,
  ENTITY,
} from '../../../../../utils/strings/CommonStrings';
import { FIELD_LIST_TYPE, FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { normalizer } from '../../../../../utils/normalizer.utils';
import {
  IGNORED_DOC_GEN_FIELD_TYPES,
  INITIAL_UPLOAD_STATE,
  REQUEST_FIELD_KEYS,
  RESPONSE_FIELD_KEYS,
} from './GenerateDocument.constants';
import { formatEditorTemplatePostData, getEditorUIValue } from './general/document_template/DocumentTemplate.utils';
import { cloneDeep, get, isEmpty, set } from '../../../../../utils/jsUtility';
import {
  constructInsertFieldsList,
  displayErrorBasedOnActiveTab,
  getErrorTabsList,
  saveStepCommonData,
  updateLoaderStatus,
} from '../../../node_configuration/NodeConfiguration.utils';
import useFileUploadHook from '../../../../../hooks/useFileUploadHook';
import { getFileUrl } from '../../../../../utils/attachmentUtils';
import {
  ALLOW_DOC_GEN_SYSTEM_FIELDS,
  ALLOW_DOCUMENT_GENERATION_STEP_SYSTEM_FIELDS,
  DOCUMENT_TEMPLATE_NAME_SUPPORTED_FIELD_TYPES,
  // DOCUMENT_TEMPLATE_NAME_SYSTEM_FIELDS
  NODE_CONFIG_TABS,
} from '../../../node_configuration/NodeConfiguration.constants';
import NodeConfigError from '../../../node_configuration/node_config_error/NodeConfigError';
import { validate } from '../../../../../utils/UtilityFunctions';
import { documentGenerationValidationSchema } from './GenerateDocument.validation.schema';
import { axiosGetUtils } from '../../../../../axios/AxiosHelper';
import styles from '../send_email/SendEmailConfig.module.scss';
import { CONFIG_BUTTON_ARRAY } from '../end_step/EndStepConfig.constants';
import { getAccountConfigurationDetailsApiService } from '../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES } from '../../../../../utils/Constants';
import { VALIDATION_CONSTANT } from '../../../../../utils/constants/validation.constant';
import { displayErrorToast } from '../../../../../utils/flowErrorUtils';
import { normalizeAllFields } from '../../../../../axios/apiNormalizer/flow.apiNormalizer';
import { HEADER_AND_FOOTER_HEIGHT } from '../../../../../components/text_editor/TextEditor.constants';

function GenerateDocument(props) {
  const {
    updateFlowStateChange,
    metaData,
    metaData: { flowId },
    steps = [],
    stepId,
    getStepNodeDetails,
    isLoadingNodeDetails,
    isErrorInLoadingNodeDetails,
    isAddOnConfig = false,
    actions,
    documentGenerationId,
    saveStepNode,
    closeAddOnConfig,
    onDeleteStepClick,
    allSystemFields,
  } = props;
  const { t } = useTranslation();
  const id = isAddOnConfig ? documentGenerationId : stepId;

  const [tabIndex, setTabIndex] = useState('1');
  const { state, dispatch } = useFlowNodeConfig();
  const editorRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);

  const [stepRefUUID, setStepRefUUID] = useState(EMPTY_STRING);

  const {
    stepName,
    insertFieldsList,
    refUuid,
    allDocuments = [],
    staticValueDetails = {},
    parsedDocumentBody,
    parsedDocumentHeader,
    parsedDocumentFooter,
    errorList,
    tabErrorList,
   } = state;

  const [documentsTobeUpload, setDocumentsTobeUpload] = useState(INITIAL_UPLOAD_STATE);

  const {
    totalCount = 0,
    currentCount = 0,
    documents = [],
    docNameList = [],
    upload_document_details = {},
  } = documentsTobeUpload;

  const { TEMPLATE } = GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS(t).GENERAL;

  const getFileData = (doc_details, file_ref_uuid) => {
    let getUploadType = EMPTY_STRING;
    let fileName = state?.fileName;

    if (!isEmpty(docNameList)) {
      if (docNameList[currentCount - 1] === RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER) {
        getUploadType = DOCUMENT_TYPES.STEP_FOOTER_DOCUMENTS;
        fileName = 'footer';
      } else if (docNameList[currentCount - 1] === RESPONSE_FIELD_KEYS.DOCUMENT_HEADER) {
        getUploadType = DOCUMENT_TYPES.STEP_HEADER_DOCUMENTS;
        fileName = 'header';
      } else {
        getUploadType = DOCUMENT_TYPES.STEP_HTML_DOCUMENTS;
      }
    }

    const fileData = {
      type: getUploadType,
      file_type: 'html',
      file_name: fileName,
      file_size: doc_details?.size,
      file_ref_id: file_ref_uuid,
    };

    const file_metadata = [];

    file_metadata.push(fileData);

    const data = {
      file_metadata,
    };
    data.entity = ENTITY.FLOW_STEPS;
    if (state.stepId || stepId) data.entity_id = state.stepId || stepId;
    data.context_id = flowId;

    if (refUuid) data.ref_uuid = refUuid;

    return data;
  };

  const handleServerErrors = (errorList) => {
    dispatch(nodeConfigDataChange({
      errorList,
    }));
  };

  const { onFileUpload, documentDetails, uploadFile } = useFileUploadHook(
    getFileData,
    null,
    false,
  );

  const closeGenerateDocument = () => {
    if (isAddOnConfig) {
      closeAddOnConfig();
    } else {
      updateFlowStateChange({
        isNodeConfigOpen: false,
        activeStepId: null,
      });
    }
  };

  const showNotification = (editorRef, editorId) => {
    const { notificationManager } = editorRef.current;

    notificationManager.open({
      text: RESPONSE_FIELD_KEYS.DOCUMENT_HEADER === editorId ? GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS(t).ERROR_MESSAGES.HEADER_ERROR : GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS(t).ERROR_MESSAGES.FOOTER_ERROR,
      type: 'error',
    });

    setTimeout(() => {
      notificationManager.close();
    }, 2000);
  };

  const saveDocumentGenerationConfig = (uploadedIdaction, docs) => {
    const postData = constructDocumentGenerationPostData(cloneDeep({
      ...uploadedIdaction,
      refUuid: documentDetails.ref_uuid,
      allDocuments: docs,
    }), isAddOnConfig);
    saveStepNode(
      postData,
      handleServerErrors,
    ).then(() => {
      closeGenerateDocument();
    })
      .catch((error) => { console.log('constructDocumentGenerationPostDataerror', error); });
  };

  useEffect(() => {
    if (!isEmpty(documentDetails.file_metadata) && !isEmpty(uploadFile)) {
      let initial_step_ref_uuid = state;
      if (isEmpty(stepRefUUID)) {
        if (documentDetails && documentDetails.ref_uuid) {
          setStepRefUUID(documentDetails.ref_uuid);
          initial_step_ref_uuid = documentDetails.ref_uuid;
        }
      }

      const finalPostPreviewData = {};
      const UploadedDocMetaData = [];
      if (documentDetails.entity_id) {
        finalPostPreviewData.document_details = {};
        finalPostPreviewData.document_details.entity = documentDetails.entity;
        finalPostPreviewData.document_details.entity_id =
          documentDetails.entity_id;
        finalPostPreviewData.document_details.ref_uuid = initial_step_ref_uuid;
        if (documentDetails.file_metadata) {
          documentDetails.file_metadata.forEach((file_info) => {
            UploadedDocMetaData.push({
              upload_signed_url: getFileUrl(file_info?.upload_signed_url),
              type: file_info.type,
              document_id: file_info._id,
            });
          });
        }
        finalPostPreviewData.document_details.uploaded_doc_metadata =
          UploadedDocMetaData;
      }
      let docDetails = {};
      if (finalPostPreviewData.document_details) {
        docDetails = {
          document_details: finalPostPreviewData.document_details,
        };
      }

      const uploadedIdaction = cloneDeep(state);

      if (!isEmpty(docNameList)) {
        if (docNameList[currentCount - 1] === RESPONSE_FIELD_KEYS.DOCUMENT_HEADER) {
          set(
            uploadedIdaction,
            [RESPONSE_FIELD_KEYS.HEADER_DOCUMENT, '_id'],
            documentDetails.file_metadata[0]._id,
          );
        } else if (docNameList[currentCount - 1] === RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER) {
          set(
            uploadedIdaction,
            [RESPONSE_FIELD_KEYS.FOOTER_DOCUMENT, '_id'],
            documentDetails.file_metadata[0]._id,
          );
        } else {
          set(
            uploadedIdaction,
            RESPONSE_FIELD_KEYS.TEMPLATE_DOC_ID,
            documentDetails.file_metadata[0]._id,
          );
        }
      }

      const documentsRemaining = currentCount - 1;
      let currentDocDetails = {};

      if (totalCount === currentCount) {
        currentDocDetails = docDetails.document_details;
      } else {
        currentDocDetails = {
          ...upload_document_details,
          uploaded_doc_metadata: [
            ...upload_document_details.uploaded_doc_metadata,
            ...UploadedDocMetaData,
          ],
        };
      }
      setDocumentsTobeUpload((details) => {
        return {
          ...details,
          currentCount: documentsRemaining,
          upload_document_details: currentDocDetails,
          uploadDocumentAction: uploadedIdaction,
        };
      });
      const docs = cloneDeep(allDocuments);
      docs.push(documentDetails?.file_metadata?.[0]);
      uploadedIdaction.refUuid = documentDetails?.ref_uuid;
      dispatch(nodeConfigDataChange({
        ...uploadedIdaction,
        refUuid: documentDetails.ref_uuid,
        allDocuments: docs,
      }));

      if (documentsRemaining === 0) {
        saveDocumentGenerationConfig(uploadedIdaction, docs);
      }
    }
  }, [documentDetails?.file_metadata, documentDetails?.file_metadata?.length]);

  useEffect(() => {
    if (!isEmpty(docNameList) && currentCount !== 0) {
      onFileUpload({ files: [documents[currentCount - 1]] }, null, null, null, null, null, null, null, null, null, null, true);
    }
  }, [currentCount]);

  const getGenerateDocumentNodeDetails = async (allFields, insertFieldsList, staticValueDetails) => {
    try {
      const response = await getStepNodeDetails(id);
      const stepData = steps?.find((eachStep) => eachStep._id === stepId);
      const apiData = isAddOnConfig ? { ...stepData, ...response, actions: actions } : response;
      const modifiedStepDetails = formatGenerateDocumentData(apiData);
      const body = response?.document_generation?.[0]?.template_doc_id && await axiosGetUtils(
        `/dms/display/?id=${response?.document_generation?.[0]?.template_doc_id}`,
      ).then((bodyData) => {
          const initVal = getEditorUIValue(
            bodyData.data,
            response?.document_generation?.[0]?.data_fields?.form_fields || [],
            allFields,
            response?.document_generation?.[0]?.data_fields?.system_fields || [],
            insertFieldsList?.[1]?.subMenuItems,
          );
          return initVal;
        })
        .catch(() => false);

      const header = (response?.document_generation?.[0]?.header_document && await axiosGetUtils(
        `/dms/display/?id=${response?.document_generation?.[0]?.header_document?._id}`,
      )
        .then((headerData) => {
          const initVal = getEditorUIValue(
            headerData.data,
            [],
            response?.document_generation?.[0]?.data_fields?.form_fields || [],
            allFields,
            response?.document_generation?.[0]?.data_fields?.system_fields || [],
            insertFieldsList?.[1]?.subMenuItems,
          );
          return initVal;
        })
        .catch(() => false));

      const footer = (response?.document_generation?.[0]?.footer_document && await axiosGetUtils(
        `/dms/display/?id=${response?.document_generation?.[0]?.footer_document?._id}`,
      )
        .then((footerData) => {
          const initVal = getEditorUIValue(
            footerData.data,
            response?.document_generation?.[0]?.data_fields?.form_fields || [],
            allFields,
            response?.document_generation?.[0]?.data_fields?.system_fields || [],
            insertFieldsList?.[1]?.subMenuItems,
          );
          return initVal;
        })
        .catch(() => false));
        dispatch(
          nodeConfigDataChange({
            ...modifiedStepDetails,
            isLoadingNodeDetails: false,
            staticValueDetails,
            ...(body) && { documentBody: body },
            ...(header) && { documentHeader: header },
            ...(footer) && { documentFooter: footer },
          }),
        );
      console.log(response);
    } catch (e) { console.log(e, 'error in getGenerateDocumentNodeDetails'); }
  };

  const getAllFields = async () => {
    try {
      const paginationData = {
        page: 1,
        size: 1000,
        sort_by: 1,
        flow_id: flowId,
        ignore_field_types: IGNORED_DOC_GEN_FIELD_TYPES,
        include_property_picker: 1,
      };
      const resFieldsList = await apiGetAllFieldsList(paginationData, null, null, null, normalizeAllFields);

      const allFieldsRawData = normalizer(
        resFieldsList,
        REQUEST_FIELD_KEYS,
        RESPONSE_FIELD_KEYS,
      );
      const allFields = allFieldsRawData?.modifiedFields;
      const directFields = [];
      cloneDeep(allFields).forEach((field) => {
        if ((field.fieldListType === FIELD_LIST_TYPE.DIRECT) && field.fieldType !== FIELD_TYPE.TABLE) {
          directFields.push(field);
        }
      });
      const insertFieldsList = constructInsertFieldsList({
        allFields: directFields,
        steps,
        allSystemFields,
        allowedSystemFields: ALLOW_DOC_GEN_SYSTEM_FIELDS,
        allowedStepSystemFields: ALLOW_DOCUMENT_GENERATION_STEP_SYSTEM_FIELDS,
      });

      const templateNameFields = [];
      cloneDeep(allFields).forEach((field) => {
        if (
          (field.fieldListType === FIELD_LIST_TYPE.DIRECT) &&
          DOCUMENT_TEMPLATE_NAME_SUPPORTED_FIELD_TYPES.includes(field.fieldType)
        ) {
          templateNameFields.push(field);
        }
      });
      // const templateNameInsertFieldsList = constructInsertFieldsList({
      //   allFields: templateNameFields,
      //   steps,
      //   allSystemFields,
      //   allowedSystemFields: DOCUMENT_TEMPLATE_NAME_SYSTEM_FIELDS,
      //   allowedStepSystemFields: ALLOW_DOCUMENT_GENERATION_STEP_SYSTEM_FIELDS,
      // });
      console.log('templateNameFieldsdwfe2232', templateNameFields, 'allFields', allFields);

      const nameSupportedFields = [];
      const allTableFields = [];

      allFields &&
        allFields.forEach((field) => {
          if (
            field.fieldListType === FIELD_LIST_TYPE.TABLE &&
            !isFileUploadField(field)
          ) {
            allTableFields.push(field);
          }
          if (
            TEMPLATE.NAME.SUPPORTED_FIELDS.includes(field.fieldType) &&
            field.fieldListType === FIELD_LIST_TYPE.DIRECT
          ) {
            nameSupportedFields.push(field);
          }
        });

      const allTablesFields = getAllTablesFromSections(allTableFields, allFields);

      dispatch(
        nodeConfigDataChange({
          allFieldsList: allFields,
          insertFieldsList,
          // templateNameInsertFieldsList,
          templateNameInsertFieldsList: templateNameFields,
          allTablesFields,
          allTemplateNameFields: nameSupportedFields,
        }),
      );
      const accountConfigData =
        await getAccountConfigurationDetailsApiService();
      const staticValueDetails = {
        maximumFileSize: accountConfigData?.maximum_file_size,
        allowedFileTypes: accountConfigData?.allowed_extensions || [],
      };
      if (!isEmpty(id)) {
        getGenerateDocumentNodeDetails(allFields, insertFieldsList, staticValueDetails);
      } else {
        dispatch(nodeConfigDataChange({
          flowId: metaData.flowId,
          stepId: stepId,
          stepUuid: metaData.stepUuid,
          staticValueDetails,
        }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllFields();
  }, []);

  const onSaveClicked = () => {
    const commonStepData = isAddOnConfig ?
      {
        stepId: state?.stepId,
        stepUuid: state?.stepUuid,
      }
    : saveStepCommonData(state);
    const documentGenerationData = getDocumentGenerationValidationData(cloneDeep(state), isAddOnConfig);
    const dataToBeValidated = { ...commonStepData, ...documentGenerationData };
    const errorList = validate(dataToBeValidated, documentGenerationValidationSchema(isAddOnConfig, t));
    console.log('errorList_docGen', errorList, 'dataToBeValidated', dataToBeValidated, 'isAddOnConfig', isAddOnConfig, 'stepNameError', errorList?.stepName);

    const headerBody = headerRef?.current?.getBody?.();
    const footerBody = footerRef?.current?.getBody?.();

    if (headerBody?.offsetHeight > HEADER_AND_FOOTER_HEIGHT) {
      showNotification(headerRef, RESPONSE_FIELD_KEYS.DOCUMENT_HEADER);
      errorList[RESPONSE_FIELD_KEYS.DOCUMENT_HEADER] = GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS(t).ERROR_MESSAGES.HEADER_ERROR;
    } else if (tabErrorList?.[RESPONSE_FIELD_KEYS.DOCUMENT_HEADER]) {
      errorList[RESPONSE_FIELD_KEYS.DOCUMENT_HEADER] = GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS(t).ERROR_MESSAGES.HEADER_ERROR;
    }

    if (footerBody?.offsetHeight > HEADER_AND_FOOTER_HEIGHT) {
      showNotification(footerRef, RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER);
      errorList[RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER] = GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS(t).ERROR_MESSAGES.FOOTER_ERROR;
    } else if (tabErrorList?.[RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER]) {
      errorList[RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER] = GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS(t).ERROR_MESSAGES.FOOTER_ERROR;
    }

    if (isEmpty(errorList)) {
      const docNameList = [];
      const fileSizeExceeded = [];
      const generatedDocument = [];
      const templateId = state?.[RESPONSE_FIELD_KEYS.TEMPLATE_DOC_ID];
      const headerId = get(state, [RESPONSE_FIELD_KEYS.HEADER_DOCUMENT, '_id'], null);
      const footerId = get(state, [RESPONSE_FIELD_KEYS.FOOTER_DOCUMENT, '_id'], null);
      const docArray = [];
      if (isEmpty(templateId)) {
        docArray.push({ ref: editorRef, value: RESPONSE_FIELD_KEYS.DOCUMENT_BODY, parsedData: parsedDocumentBody });
      }
      if (state?.allowHeader && isEmpty(headerId)) {
        docArray.push({ ref: headerRef, value: RESPONSE_FIELD_KEYS.DOCUMENT_HEADER, parsedData: parsedDocumentHeader });
      }
      if (state?.allowFooter && isEmpty(footerId)) {
        docArray.push({ ref: footerRef, value: RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER, parsedData: parsedDocumentFooter });
      }

      const selectedFields = [];
      if (!isEmpty(docArray)) {
        docArray?.forEach((docName) => {
          if (!isEmpty(state[docName.value])) {
            docNameList.push(docName.value);
            const formattedData = tabIndex === NODE_CONFIG_TABS.ADDITIONAL ? docName?.parsedData : formatEditorTemplatePostData(
              state[docName.value],
              docName.ref,
              state?.allTablesFields,
              state?.allFieldsList,
              [],
              false,
              insertFieldsList[1].subMenuItems,
            );
            if (formattedData?.selectedFields) {
              selectedFields.push(...formattedData.selectedFields);
            }
            const newFile = new Blob(
              [
                formattedData?.htmlContent,
              ],
              { type: 'text/html' },
            );
            if (newFile?.size > (staticValueDetails.maximumFileSize * DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES)) {
              fileSizeExceeded.push(docName.value);
            } else {
              generatedDocument.push(newFile);
            }
          }
        });
        if (!isEmpty(fileSizeExceeded)) {
          displayErrorToast({
            title: t(VALIDATION_CONSTANT.FILE_SIZE_EXCEED),
            subtitle: `${t(VALIDATION_CONSTANT.LESS_FILE_SIZE)} ${staticValueDetails.maximumFileSize}MB`,
          });
        } else if (generatedDocument) {
          updateLoaderStatus(true);
          setDocumentsTobeUpload({
            totalCount: generatedDocument.length,
            currentCount: generatedDocument.length,
            documents: generatedDocument,
            docNameList,
          });
        }
        dispatch(nodeConfigDataChange({
          selectedFields,
          isSaveClicked: true,
        }));
      } else {
        saveDocumentGenerationConfig(cloneDeep(state), cloneDeep(allDocuments));
      }
    } else {
      displayErrorBasedOnActiveTab(
        tabIndex,
        state?.stepType,
        errorList,
        t,
      );
    }
    dispatch(nodeConfigDataChange({
      errorList: errorList,
      isSaveClicked: true,
    }));
  };

  const onStatusChangeHandler = (value) => {
    dispatch(
      nodeConfigDataChange({
        stepStatus: value,
      }),
    );
  };

  const onChangeHandler = (event) => {
    dispatch(
      nodeConfigDataChange({
        [event.target.id]: event.target.value,
      }),
    );
  };

  let currentTabDetails = null;
  if (!isLoadingNodeDetails) {
  if (isErrorInLoadingNodeDetails) {
    currentTabDetails = (
      <NodeConfigError />
    );
  } else if (tabIndex === NODE_CONFIG_TABS.GENERAL) {
    currentTabDetails = (
    <GeneralConfiguration
      editorRef={editorRef}
      headerRef={headerRef}
      footerRef={footerRef}
      isAddOnConfig={isAddOnConfig}
      actions={actions}
      metaData={metaData}
    />
    );
  } else if (tabIndex === NODE_CONFIG_TABS.ADDITIONAL) {
    currentTabDetails = (
      <StatusDropdown
        onClickHandler={onStatusChangeHandler}
        onChangeHandler={onChangeHandler}
        stepName={stepName}
        selectedValue={state?.stepStatus}
        stepNameError={errorList?.stepName}
      />
    );
  }
}
  const footerContent = !isAddOnConfig && (
    <div className={gClasses.MRA}>
      <Button
        buttonText={t(DELETE_STEP_LABEL)}
        noBorder
        className={styles.DeleteStepButton}
        onClickHandler={() => onDeleteStepClick(id)}
      />
    </div>
  );

  const onTabSelect = (tabValue) => {
    if (tabValue === NODE_CONFIG_TABS.ADDITIONAL) {
      const templateId = state?.[RESPONSE_FIELD_KEYS.TEMPLATE_DOC_ID];
      const headerId = get(state, [RESPONSE_FIELD_KEYS.HEADER_DOCUMENT, '_id'], null);
      const footerId = get(state, [RESPONSE_FIELD_KEYS.FOOTER_DOCUMENT, '_id'], null);
      const docArray = [];
      const updatedData = {};
      if (isEmpty(templateId)) {
        docArray.push({ ref: editorRef, value: RESPONSE_FIELD_KEYS.DOCUMENT_BODY });
      }
      if (state?.allowHeader && isEmpty(headerId)) {
        docArray.push({ ref: headerRef, value: RESPONSE_FIELD_KEYS.DOCUMENT_HEADER });
      }
      if (state?.allowFooter && isEmpty(footerId)) {
        docArray.push({ ref: footerRef, value: RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER });
      }

      const headerBody = headerRef?.current?.getBody?.();
      const footerBody = footerRef?.current?.getBody?.();
      const clonedErrorList = cloneDeep(errorList);

      if (headerBody?.offsetHeight > HEADER_AND_FOOTER_HEIGHT) {
        clonedErrorList[RESPONSE_FIELD_KEYS.DOCUMENT_HEADER] = GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS(t).ERROR_MESSAGES.HEADER_ERROR;
      }

      if (footerBody?.offsetHeight > HEADER_AND_FOOTER_HEIGHT) {
        clonedErrorList[RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER] = GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS(t).ERROR_MESSAGES.FOOTER_ERROR;
      }

      docArray?.forEach((docName) => {
        if (!isEmpty(state[docName.value])) {
          docNameList.push(docName.value);
          const formattedData = formatEditorTemplatePostData(
            state[docName.value],
            docName.ref,
            state?.allTablesFields,
            state?.allFieldsList,
            [],
            false,
            insertFieldsList[1].subMenuItems,
          );

          if (docName.value === RESPONSE_FIELD_KEYS.DOCUMENT_BODY) {
            updatedData.parsedDocumentBody = formattedData;
          } else if (docName.value === RESPONSE_FIELD_KEYS.DOCUMENT_HEADER) {
            updatedData.parsedDocumentHeader = formattedData;
          } else {
            updatedData.parsedDocumentFooter = formattedData;
          }
        }
      });

      dispatch(
        nodeConfigDataChange({
          ...updatedData,
          tabErrorList: clonedErrorList,
        }),
      );
    } else {
      dispatch(
        nodeConfigDataChange({
          parsedDocumentBody: null,
          parsedDocumentHeader: null,
          parsedDocumentFooter: null,
        }),
      );
    }

    setTabIndex(tabValue);
  };

  return (
    <ConfigModal
      isModalOpen
      errorTabList={state?.isSaveClicked && getErrorTabsList(
        state?.stepType,
        state?.errorList,
      )}
      tabOptions={GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS(t).TABS}
      hideTabs={isAddOnConfig}
      onCloseClick={closeGenerateDocument}
      modalBodyContent={currentTabDetails}
      modalTitle={isAddOnConfig ? GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS(t).ADDON_CONFIG_TITLE : GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS(t).TITLE}
      currentTab={tabIndex}
      onTabSelect={onTabSelect}
      footercontent={footerContent}
      footerButton={CONFIG_BUTTON_ARRAY(onSaveClicked, closeGenerateDocument, t)}
    />
  );
}

export default GenerateDocument;
