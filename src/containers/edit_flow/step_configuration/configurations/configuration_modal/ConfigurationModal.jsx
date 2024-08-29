import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import useFileUploadHook from 'hooks/useFileUploadHook';
import {
  DOCUMENT_TYPES,
  EMPTY_STRING,
  ENTITY,
  FORM_POPOVER_STRINGS,
} from 'utils/strings/CommonStrings';
import gClasses from 'scss/Typography.module.scss';
import {
  checkFieldDependencyApiThunk,
  getAllFieldsByFilter,
} from 'redux/actions/EditFlow.Action';
import {
  saveDocumentGenerationThunk, saveEscalationsThunk, saveSendDataToDatalistThunk, saveSendEmailThunk,
} from 'redux/actions/FlowStepConfiguration.Action';
import { isNull, cloneDeep, isEmpty, findIndex, get, set, unset, find } from 'utils/jsUtility';
import { validate } from 'utils/UtilityFunctions';
import Tab, { TAB_TYPE } from 'components/tab/Tab';
import { BS } from 'utils/UIConstants';
import { useTranslation } from 'react-i18next';
import { FLOW_CONFIG_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import { FORM_POPOVER_STATUS } from 'utils/Constants';
import { ModalSize, ETitleSize, Modal, Title, Button, EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './ConfigurationModal.module.scss';
import SendEmail from '../send_email/SendEmail';
import EmailEscalation from '../email_escalation/EmailEscalation';
import SendDataToDataList from '../send_data_to_datalist/SendDataToDataList';
import {
  CONFIGURATION_TYPE_ID,
  MODAL_ACTION_BUTTON,
  DOCUMENT_TAB_LIST,
  FLOW_CONFIGURATION_MODAL_ID,
  CONFIGURATION_STRINGS,
  SEND_DATA_TO_DATALIST_STRINGS,
  RECIPIENT_TYPE,
  DOCUMENT_TABS,
} from '../Configuration.strings';
import { constructPostDataforDocumentGeneration, constructSendDataToDLValidateData, formatRecipientData, getEmailActionsData, getEmailEscalationPostData, getSendDataToDataListPostData, INITIAL_UPLOAD_STATE } from '../Configuration.utils';
import DocumentGeneration from '../document_generation/DocumentGeneration';
import { getDocumentActionsValidateData, getEmailActionsValidateData, getInactiveAssigneesList } from '../../StepConfiguration.utils';
import { constructEscalationValidationData, documentActionsValidateSchema, emailActionsValidateSchema, emailEscalationValidationSchema, recipientsArraySchema, sendDataToDatalistValidationSchema } from '../../StepConfiguration.validations';
import { DOCUMENT_GENERATION_STRINGS, getImageRemovedDocId } from '../document_generation/DocumentGeneration.utils';
import CloseIcon from '../../../../../assets/icons/CloseIcon';
import { keydownOrKeypessEnterHandle, setPointerEvent, showToastPopover, updatePostLoader } from '../../../../../utils/UtilityFunctions';
import { ARIA_ROLES } from '../../../../../utils/UIConstants';
import { getFileUrl } from '../../../../../utils/attachmentUtils';
import { DEPENDENCY_ERRORS } from '../../../../../components/dependency_handler/DependencyHandler.constants';
import { updateFlowStateChange } from '../../../../../redux/reducer/EditFlowReducer';
import { ENTRY_ACTION_TYPE } from '../Configuration.constants';
import { FIELD_TYPE } from '../../../../../utils/constants/form_fields.constant';
import { VALIDATION_CONSTANT } from '../../../../../utils/constants/validation.constant';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { ESCALATION_RECIPIENT_OBJECT_KEYS } from '../../node_configurations/send_email/SendEmailConfig.constants';
import { validateAssigneesData } from '../../../node_configuration/NodeConfiguration.utils';

function ConfigurationModal(props) {
  const {
    configTypeId,
    setConfigType,
    stepData,
    flowData,
    onGetAllFieldsByFilter,
    saveEscalations,
    saveDocumentGeneration,
    customModalClass,
    saveSendEmail,
    saveSendDataToDatalist,
    checkFieldDependencyApi,
    onFlowStateChange,
  } = cloneDeep(props);

  const [imageFieldUUID, setImageFieldUUID] = useState([]);
  const [attachmentUUID, setAttachmentUUID] = useState([]);
  const [documentDetail, setDocumentDetails] = useState({});
  const [overAllRemovedDocList, setOverAllRemovedDocList] = useState([]);
  const [documentsTobeUpload, setDocumentsTobeUpload] = useState(INITIAL_UPLOAD_STATE);
  const [fileValidationError, setFileValidationError] = useState([]);
  const [documentTabIndex, setDocumentTabIndex] = useState(0);
  const [attachmentUploadInProgress, setAttachmentUploadInProgress] = useState(false);

  const docEditorRef = useRef();

  const { t } = useTranslation();
  const { ERRORS } = FLOW_CONFIG_STRINGS;

  const [stepRefUUID, setStepRefUUID] = useState(EMPTY_STRING);

  const {
    totalCount = 0,
    currentCount = 0,
    documents = [],
    docNameList = [],
    upload_document_details = {},
    uploadDocumentAction = {},
  } = documentsTobeUpload;

  const {
    active_document_action,
    active_document_action: {
      file_name,
      document_template_field,
      document_generation_uuid,
    },
    document_url_details,
    document_generation = [],
    allFields = [],
  } = cloneDeep(stepData);

  useEffect(() => {
    try {
      if (
        isEmpty(stepRefUUID) &&
        !isEmpty(document_url_details) &&
        document_url_details[0].original_filename &&
        document_url_details[0].original_filename.ref_uuid
      ) {
        setStepRefUUID(document_url_details[0].original_filename.ref_uuid);
      }
    } catch (e) {
      console.log(e);
    }
  }, [document_url_details?.length]);

  useEffect(() => {
    if ([CONFIGURATION_TYPE_ID.DOCUMENT_GENERATION, CONFIGURATION_TYPE_ID.SEND_EMAIL].includes(configTypeId)) {
      const params = {
        page: 1,
        size: 200,
        sort_by: 1,
        flow_id: flowData.flow_id,
        // step_order: stepData.step_order, // for api data
        allowed_field_types: [FIELD_TYPE.FILE_UPLOAD],
        include_property_picker: 1,
      };
      onGetAllFieldsByFilter(params, EMPTY_STRING, FIELD_TYPE.FILE_UPLOAD);
    }
  }, [configTypeId]);

  const onCloseClickHandler = () => {
    const flow_data = cloneDeep(flowData);
    const activeStepDetails = cloneDeep(stepData);
    activeStepDetails.active_email_action = [];
    activeStepDetails.active_escalation = [];
    activeStepDetails.active_data_list_mapping = [];
    activeStepDetails.active_document_action = [];
    activeStepDetails.email_action_error_list = {};
    activeStepDetails.escalation_error_list = {};
    activeStepDetails.data_list_mapping_error_list = {};
    activeStepDetails.document_generation_error_list =
      {};
    flow_data.allDataListFields = [];
    flow_data.lstAllFields = [];
    setConfigType(null);
    setDocumentTabIndex(0);
    setDocumentsTobeUpload(INITIAL_UPLOAD_STATE);
    onFlowStateChange({ flowData: flow_data, activeStepDetails });
  };
  const setAttachmentStatus = (status) => {
    setAttachmentUploadInProgress(status);
  };

  const getFileData = (doc_details, file_ref_uuid) => {
    let getUploadType = EMPTY_STRING;
    let fileName = file_name || document_template_field?.field_name;

    if (!isEmpty(docNameList)) {
      if (docNameList[currentCount - 1] === 'footer_body') {
        getUploadType = DOCUMENT_TYPES.STEP_FOOTER_DOCUMENTS;
        fileName = 'footer';
      } else if (docNameList[currentCount - 1] === 'header_body') {
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
    data.entity_id = stepData._id;
    data.context_id = flowData.flow_id;

    if (stepRefUUID) data.ref_uuid = stepRefUUID;

    if (getUploadType === DOCUMENT_TYPES.STEP_HTML_DOCUMENTS) {
      const activeStepDetails = cloneDeep(stepData);
      set(activeStepDetails.active_document_action, 'file_name', file_name);
      onFlowStateChange({ activeStepDetails });
    }

    return data;
  };

  const { onFileUpload, documentDetails, uploadFile } = useFileUploadHook(
    getFileData,
    null,
    false,
  );

  const apiCallWithFileUpload = (currentDocDetails, uploadedIdaction) => {
    const updatedStepsDocDetails = cloneDeep(currentDocDetails);

    const active_data = uploadedIdaction;

    const params = {
      _id: stepData._id,
      step_uuid: stepData.step_uuid,
      flow_id: flowData.flow_id,
      document_generation: constructPostDataforDocumentGeneration(active_data, overAllRemovedDocList),
    };

    try {
      if (!isEmpty(updatedStepsDocDetails)) {
        unset(updatedStepsDocDetails, 'removed_doc_list');
        params.document_details = updatedStepsDocDetails;
        if (!isEmpty(overAllRemovedDocList)) {
          params.document_details = {
            ...updatedStepsDocDetails,
            removed_doc_list: overAllRemovedDocList,
          };
        }
      }

      if (!isEmpty(active_document_action.uploadedImages)) {
        active_document_action?.uploadedImages?.forEach((image) => {
          const currentImage = cloneDeep(image);

          if (
            !overAllRemovedDocList?.includes(currentImage?.imageId) &&
            currentImage?.document_details &&
            currentImage?.document_details?.uploaded_doc_metadata
          ) {
            params.document_details = {
              ...params.document_details,
              uploaded_doc_metadata: [
                ...params.document_details.uploaded_doc_metadata,
                ...currentImage.document_details.uploaded_doc_metadata,
              ],
            };
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
    const activeStepDetails = cloneDeep(stepData); // only for updating error
    activeStepDetails.document_generation_error_list = {};
    setDocumentTabIndex(0);
    setDocumentsTobeUpload(INITIAL_UPLOAD_STATE);
    saveDocumentGeneration(params, activeStepDetails)
    .then((res) => {
      if (!isEmpty(res)) {
        setConfigType(null);
      }
    })
    .catch((e) => {
      console.log(e);
    });
  };

  useEffect(() => {
    if (!isEmpty(documentDetails.file_metadata) && !isEmpty(uploadFile)) {
      let initial_step_ref_uuid = stepRefUUID;
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

      const uploadedIdaction = cloneDeep(uploadDocumentAction);

      if (!isEmpty(docNameList)) {
        if (docNameList[currentCount - 1] === 'header_body') {
          set(
            uploadedIdaction,
            ['header_document', '_id'],
            documentDetails.file_metadata[0]._id,
          );
        } else if (docNameList[currentCount - 1] === 'footer_body') {
          set(
            uploadedIdaction,
            ['footer_document', '_id'],
            documentDetails.file_metadata[0]._id,
          );
        } else {
          set(
            uploadedIdaction,
            'template_doc_id',
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

      if (documentsRemaining === 0) {
        apiCallWithFileUpload(currentDocDetails, uploadedIdaction);
      }
    }
  }, [
    documentDetails && documentDetails.file_metadata,
    documentDetails &&
    documentDetails.file_metadata &&
    documentDetails.file_metadata.length,
  ]);

  useEffect(() => {
    if (!isEmpty(docNameList) && currentCount !== 0) {
      // get upload call for each current count changes
      onFileUpload({ files: [documents[currentCount - 1]] }, null, null, null, null, null, null, null, null, null, null, true);
    }
  }, [currentCount]);

  const isDocumentNameExist = (fileName, key) => {
    if (isEmpty(document_generation) || isEmpty(fileName)) return false;

    try {
      let isExist = false;

      document_generation?.map((eachDoc) => {
        if (isEmpty(eachDoc) || isExist) return null;

        if (document_generation_uuid !== eachDoc?.document_generation_uuid) {
          if (!isEmpty(key)) {
            if (
              eachDoc[key] === fileName
            ) {
              isExist = true;
            }
          } else {
            if (
              eachDoc?.file_name?.trim() === fileName?.trim()
            ) {
              isExist = true;
            }
          }
        }

        return null;
      });

      return isExist;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const validateRecipients = (recipients, recipientSchema, key) => {
    let inactiveRecipientList = [];
        const recipientError = validate({ [key]: recipients }, constructJoiObject({ [key]: recipientSchema?.(t) }));
        const directRecipientIndex = recipients.findIndex(({ recipients_type }) => recipients_type === RECIPIENT_TYPE.DIRECT_RECIPIENT);
        if (directRecipientIndex > -1 && recipients[directRecipientIndex]?.to_recipients) {
          inactiveRecipientList = getInactiveAssigneesList(recipients[directRecipientIndex].to_recipients);
          if (!isEmpty(inactiveRecipientList)) {
            set(recipientError, [`${key},${directRecipientIndex},to_recipients`], `${t(VALIDATION_CONSTANT.STEP_ACTOR_INVALID)}: ${inactiveRecipientList.join(', ')}`);
          }
        }
        return recipientError;
  };

  const showNotification = () => {
    const { notificationManager } = docEditorRef.current;

    notificationManager.open({
      text: t(DOCUMENT_GENERATION_STRINGS.HEADER_FOOTER_ERROR),
      type: 'error',
    });

    setTimeout(() => {
      notificationManager.close();
    }, 2000);
  };

  const onSaveHandler = async () => {
    const activeStepDetails = cloneDeep(stepData);
    let errorList = [];
    let active_data = {};
    let activeIndex = null;
    let dependencyData = {};
    let recipientErrors = {};
    const generatedDocument = [];
    switch (configTypeId) {
      case CONFIGURATION_TYPE_ID.SEND_EMAIL:
        active_data = activeStepDetails.active_email_action;
        const email_action_error_list = validate(
          getEmailActionsValidateData(cloneDeep(activeStepDetails)),
          emailActionsValidateSchema(t),
        );
        const recipientsDataForValidation = formatRecipientData(get(active_data, ['recipients'], []));
        recipientErrors = validateRecipients(recipientsDataForValidation, recipientsArraySchema, 'recipients');
        errorList = {
          ...email_action_error_list,
          ...(recipientErrors || {}),
        };
        if (!isEmpty(fileValidationError)) {
          errorList = [{ error: fileValidationError }];
        } else if (isEmpty(errorList)) {
          errorList = [];
        }
        activeStepDetails.email_action_error_list = errorList;
        if (isEmpty(errorList) && !isEmpty(active_data) && !attachmentUploadInProgress) {
          activeIndex = activeStepDetails.email_actions.length;
          const emailAttachments = {};
          if (!isEmpty(imageFieldUUID)) {
            emailAttachments.field_uuid = imageFieldUUID;
          }
          if (!isEmpty(attachmentUUID)) {
            emailAttachments.attachment_id = attachmentUUID;
          }
          active_data.email_attachments = emailAttachments;

          let docMetaData = {};
          if (documentDetail.document_details) {
            docMetaData = documentDetail.document_details;
            docMetaData.removed_doc_list = documentDetail.removed_doc_list;
          } else {
            docMetaData.removed_doc_list = documentDetail.removed_doc_list;
          }
          activeStepDetails.document_details =
            docMetaData;
          const params = {
            _id: stepData._id,
            step_uuid: stepData.step_uuid,
            flow_id: flowData.flow_id,
            email_actions: getEmailActionsData(stepData, active_data, activeIndex),
          };
          if (!isEmpty(docMetaData)) {
            params.document_details = docMetaData;
          }
          saveSendEmail(params).then((resData) => {
            if (resData) {
              if (!isEmpty(resData.validation_message)) {
                let isEmailActionError = false;
                resData.validation_message.forEach((eachMessage) => {
                  if (eachMessage.field.includes('email')) {
                    const emailIndex = eachMessage && eachMessage.field.split('.')[1];
                    if (emailIndex) {
                      const { email_uuid } = stepData.email_actions[emailIndex];
                      if (email_uuid === active_data.email_uuid) isEmailActionError = true;
                    }
                  }
                });
                if (!isEmailActionError) setConfigType(null);
              } else {
                setConfigType(null);
              }
            }
          });
        }
        if (attachmentUploadInProgress) {
          showToastPopover(
            `${t('common_strings.attachment')} ${FORM_POPOVER_STRINGS.FILE_UPLOAD_IN_PROGRESS}`,
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        onFlowStateChange({ activeStepDetails });
        break;
      case CONFIGURATION_TYPE_ID.SEND_ESCALATION:
        active_data = activeStepDetails.active_escalation;
        errorList = validate(
          constructEscalationValidationData(cloneDeep(activeStepDetails.active_escalation)),
          emailEscalationValidationSchema(t),
        );
        recipientErrors = validateAssigneesData(get(active_data, ['escalation_recipients'], []), ESCALATION_RECIPIENT_OBJECT_KEYS, true, t);
        set(activeStepDetails, [`${ESCALATION_RECIPIENT_OBJECT_KEYS.parentKey}ErrorList`], recipientErrors);
        activeStepDetails.escalation_error_list = errorList;
        if (isEmpty(errorList) && !isEmpty(active_data)) {
          const params = {
            _id: stepData._id,
            step_uuid: stepData.step_uuid,
            flow_id: flowData.flow_id,
            escalations: getEmailEscalationPostData(active_data),
          };
          saveEscalations(params).then((resData) => {
            if (resData) {
              set(activeStepDetails, 'escalations', resData?.escalations || []);
              console.log(activeStepDetails, 'sjkfhkhjsdjfesl', resData);
              if (!isEmpty(resData.validation_message)) {
                let isEscalationActionError = false;
                resData.validation_message.forEach((eachMessage) => {
                  if (eachMessage.field.includes('escalations')) {
                    const esclationIndex = eachMessage && eachMessage.field.split('.')[1];
                    if (esclationIndex) {
                      const { escalation_uuid } = activeStepDetails.escalations[esclationIndex];
                      if (escalation_uuid === active_data.escalation_uuid) isEscalationActionError = true;
                    }
                  }
                });
                if (!isEscalationActionError) {
                  delete activeStepDetails.active_escalation;
                } else setConfigType(null);
              } else {
                setConfigType(null);
              }
              onFlowStateChange({ activeStepDetails });
            }
          });
        } else {
          onFlowStateChange({ activeStepDetails });
        }
        break;
      case CONFIGURATION_TYPE_ID.SEND_DATA_TO_DATALIST:
        active_data =
          activeStepDetails.active_data_list_mapping;

        const dataTobeValidated = constructSendDataToDLValidateData(active_data);
        const data_list_mapping_error_list = validate(
          dataTobeValidated,
          sendDataToDatalistValidationSchema(t),
        ) || {};
        if ([ENTRY_ACTION_TYPE.AUTO, ENTRY_ACTION_TYPE.UPDATE].includes(active_data.data_list_entry_action_type)) {
          const validRows = (active_data?.mapping || []).filter((data) => !data.is_deleted);
          if (isEmpty(validRows)) {
            data_list_mapping_error_list.mapping = t(SEND_DATA_TO_DATALIST_STRINGS.VALIDATION_MESSAGE.MAPPING);
          }
        }
        errorList = {
          ...(data_list_mapping_error_list || {}),
        };
        activeStepDetails.data_list_mapping_error_list = errorList;
        if (isEmpty(errorList) && !isEmpty(active_data)) {
          activeIndex = active_data.mapping_uuid
            ? findIndex(
              activeStepDetails.data_list_mapping,
              { mapping_uuid: active_data.mapping_uuid },
            )
            : null;
          if (!isNull(activeIndex) && activeIndex >= 0) {
            active_data.is_edited = true;
          }
          const params = {
            _id: stepData._id,
            step_uuid: stepData.step_uuid,
            flow_id: flowData.flow_id,
            data_list_mapping: getSendDataToDataListPostData(active_data),
          };
          try {
            const updatedData = await saveSendDataToDatalist(params, activeStepDetails, t);
            onFlowStateChange({ activeStepDetails: updatedData?.activeStepDetails || {} });
            setConfigType(null);
          } catch (e) {
            console.log(e);
          }
        } else {
          onFlowStateChange({ activeStepDetails });
        }
        break;
      case CONFIGURATION_TYPE_ID.DOCUMENT_GENERATION: {
        const body = docEditorRef?.current?.getBody?.();

        if (documentTabIndex !== DOCUMENT_TABS.BASIC && body.offsetHeight > 52) {
          showNotification();
          return;
        }

        active_data = activeStepDetails.active_document_action;
        errorList = validate(
          getDocumentActionsValidateData(
            cloneDeep(activeStepDetails),
          ),
          documentActionsValidateSchema(t),
        );
        if (!isEmpty(active_document_action?.file_name) && isDocumentNameExist(active_document_action.file_name)) {
          set(errorList, 'file_name', t(ERRORS.DOC_TEMPLATE_UNIQUE_ERROR));
        }
        if (!isEmpty(active_document_action?.document_template_field) && isDocumentNameExist(active_document_action?.document_template_field?.field_uuid, 'document_template_name_field_uuid')) {
          set(errorList, 'file_name', t(ERRORS.DOC_TEMPLATE_UNIQUE_ERROR));
        }
        if (isEmpty(active_document_action.file_name) && isEmpty(active_document_action.document_template_field)) {
          set(errorList, 'file_name', t(ERRORS.DOC_TEMPLATE_NAME_REQUIRED));
        }

        activeStepDetails.document_generation_error_list = errorList;
        set(activeStepDetails, ['active_document_action', 'saveClicked'], true);
        if (!isEmpty(errorList)) {
          onFlowStateChange({ activeStepDetails });
        } else if (!isEmpty(active_data)) {
          const docNameList = [];
          let removedDocList = [];
          // getting all three documents id
          const templateId = active_document_action?.template_doc_id;
          const headerId = get(active_document_action, ['header_document', '_id'], null);
          const footerId = get(active_document_action, ['footer_document', '_id'], null);
          // adding document id to removed doc list if content exist(as we will create one new dms document)
          if (templateId) removedDocList.push(templateId);
          if (headerId) removedDocList.push(headerId);
          if (footerId) removedDocList.push(footerId);
          const imageRemovedDocId = getImageRemovedDocId(active_document_action);
          // merging both removed image(s) & document(s) doc list
          if (!isEmpty(imageRemovedDocId)) {
            removedDocList = [...removedDocList, ...imageRemovedDocId];
          }
          setOverAllRemovedDocList(removedDocList);
          const docArray = [
            { id: templateId, value: 'document_body' },
            { id: headerId, value: 'header_body' },
            { id: footerId, value: 'footer_body' },
          ];
          // constructing doc array, push only if the content is edited/not empty now
          docArray.forEach((docName) => {
            if (!isEmpty(active_document_action[docName.value])) {
              docNameList.push(docName.value);
              generatedDocument.push(new Blob(
                [
                  active_document_action[docName.value],
                ],
                { type: 'text/html' },
              ));
            }
          });
          const existingDocGen = find(document_generation, {
            document_generation_uuid,
          });

          if (!isEmpty(existingDocGen)) {
            const existingDocField = find(allFields, {
              field_uuid: existingDocGen?.document_field_uuid,
            });

            if (
              !isEmpty(existingDocField) &&
              (existingDocField?.field_uuid !== active_document_action?.document_field_uuid) &&
              !isDocumentNameExist(existingDocGen?.document_field_uuid, 'document_field_uuid')
            ) {
              const fieldDependencyParams = {
                field_uuid: [existingDocField?.field_uuid],
                step_id: stepData._id,
              };
              dependencyData = await checkFieldDependencyApi(fieldDependencyParams, DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.DOCUMENT_GENERATION_DOC_REPLACEMENT, existingDocField?.field_name);
            }
          }
          if (isEmpty(dependencyData?.dependency_list)) {
            // updating the local state for get upload api(s)
            if (generatedDocument) {
              setPointerEvent(true);
              updatePostLoader(true);
              setDocumentsTobeUpload({
                totalCount: generatedDocument.length,
                currentCount: generatedDocument.length,
                documents: generatedDocument,
                docNameList,
                uploadDocumentAction: active_document_action,
              });
            }
          }
        }
        break;
      }
      default:
        break;
    }
  };

  const handleTabChange = (tabIndex) => {
    // const flow_data = cloneDeep(flowData);
    const activeStepDetails = cloneDeep(stepData);
    const errorList = validate(
      getDocumentActionsValidateData(
        cloneDeep(activeStepDetails),
      ),
      documentActionsValidateSchema(t),
    );

    if (isEmpty(active_document_action.file_name) && isEmpty(active_document_action.document_template_field)) {
      set(errorList, 'file_name', t(ERRORS.DOC_TEMPLATE_NAME_REQUIRED));
    }
    if (!isEmpty(active_document_action?.file_name) && isDocumentNameExist(active_document_action.file_name)) {
      set(errorList, 'file_name', t(ERRORS.DOC_TEMPLATE_UNIQUE_ERROR));
    }
    if (!isEmpty(active_document_action?.document_template_field) && isDocumentNameExist(active_document_action?.document_template_field?.field_uuid, 'document_template_name_field_uuid')) {
      set(errorList, 'file_name', t(ERRORS.DOC_TEMPLATE_UNIQUE_ERROR));
    }
    if (isEmpty(errorList)) {
      const body = docEditorRef?.current?.getBody?.();

      if (documentTabIndex !== DOCUMENT_TABS.BASIC && body.offsetHeight > 52) {
        showNotification();
        return;
      }
      setDocumentTabIndex(tabIndex);
    } else {
      activeStepDetails.document_generation_error_list =
        errorList;
      set(activeStepDetails, ['active_document_action', 'saveClicked'], true);
      onFlowStateChange({ activeStepDetails });
    }
  };

  const getHeaderComponent = (title) => (
    <>
      <Title
        content={t(title)}
        size={ETitleSize.small}
        className={cx(gClasses.MT24, gClasses.ML32)}
      />
      <CloseIcon
        className={cx(styles.CloseIcon, gClasses.CursorPointer)}
        onClick={onCloseClickHandler}
        role={ARIA_ROLES.BUTTON}
        tabIndex={0}
        onKeyDown={(e) => {
          keydownOrKeypessEnterHandle(e) && onCloseClickHandler();
        }}
      />
    </>
  );

  const modalContent = {
    header: null,
    main: null,
  };
  let customModalStyle = customModalClass;

  switch (configTypeId) {
    case CONFIGURATION_TYPE_ID.SEND_EMAIL:
      modalContent.header = getHeaderComponent(CONFIGURATION_STRINGS.SEND_EMAIL);
      modalContent.main = (
        <SendEmail
          stepData={stepData}
          setImageFieldUUID={setImageFieldUUID}
          setAttachmentUUID={setAttachmentUUID}
          setDocumentDetails={setDocumentDetails}
          allFileFields={flowData.allFileFields}
          setFileValidationError={setFileValidationError}
          allFields={flowData?.allFields || []}
          setAttachmentStatus={setAttachmentStatus}
        />
      );
      customModalStyle = styles.W70;
      break;
    case CONFIGURATION_TYPE_ID.SEND_ESCALATION:
      modalContent.header = getHeaderComponent(CONFIGURATION_STRINGS.SEND_ESCALATION);
      modalContent.main = (
        <EmailEscalation stepData={stepData} flowData={flowData} />
      );
      break;
    case CONFIGURATION_TYPE_ID.SEND_DATA_TO_DATALIST:
      modalContent.header = getHeaderComponent(CONFIGURATION_STRINGS.SEND_DATA_TO_DATALIST);
      modalContent.main = (
        <SendDataToDataList
          stepData={stepData}
          flowData={flowData}
          onFlowStateChange={onFlowStateChange}
        />
      );
      customModalStyle = gClasses.Width90VW;
      break;
    case CONFIGURATION_TYPE_ID.DOCUMENT_GENERATION:
      modalContent.header = (
        <>
          <div className={cx(gClasses.MT24, gClasses.ML32)}>
            <Title
              content={t(CONFIGURATION_STRINGS.DOCUMENT_GENERATION)}
              size={ETitleSize.small}
            />
            <Tab
              className={cx(gClasses.MT5)}
              tabIList={DOCUMENT_TAB_LIST(t)}
              selectedIndex={documentTabIndex}
              type={TAB_TYPE.TYPE_5}
              setTab={handleTabChange}
            />
          </div>
          <CloseIcon
            className={cx(styles.CloseIcon, gClasses.CursorPointer)}
            onClick={onCloseClickHandler}
            role={ARIA_ROLES.BUTTON}
            tabIndex={0}
            onKeyDown={(e) => {
              keydownOrKeypessEnterHandle(e) && onCloseClickHandler();
            }}
          />
        </>
      );
      customModalStyle = styles.W70;
      modalContent.main = (
        <DocumentGeneration
          stepData={stepData}
          flowData={flowData}
          onFlowStateChange={onFlowStateChange}
          documentTabIndex={documentTabIndex}
          stepRefUUID={stepRefUUID}
          setStepRefUUID={setStepRefUUID}
          docEditorRef={docEditorRef}
        />
      );
      modalContent.headerContentClasses = cx(BS.FLEX_COLUMN, BS.ALIGN_ITEMS_START);
      modalContent.headerClassName = cx(gClasses.PB0);
      modalContent.isDocumentGeneration = true;
      break;
    default:
      break;
  }
  console.log(configTypeId, 'currentConfigTypeId', modalContent);
  return (
    <Modal
      id={FLOW_CONFIGURATION_MODAL_ID}
      isModalOpen
      modalSize={ModalSize.md}
      customModalClass={cx(customModalStyle)}
      headerContent={modalContent.header}
      headerContentClassName={cx(BS.D_FLEX, BS.JC_BETWEEN)}
      mainContent={modalContent.main}
      mainContentClassName={cx(
        gClasses.PL32,
        gClasses.PR32,
        gClasses.PT24,
        gClasses.PB24,
      )}
      footerContent={
        <div className={cx(gClasses.DisplayFlex, gClasses.gap8)}>
          <Button
            buttonText={t(MODAL_ACTION_BUTTON.CANCEL)}
            onClick={onCloseClickHandler}
            noBorder
            type={EButtonType.OUTLINE_SECONDARY}
          />
          <Button
            buttonText={t(MODAL_ACTION_BUTTON.SAVE)}
            onClick={onSaveHandler}
          />
        </div>
      }
      footerContentClassName={cx(styles.Footer)}
    />
  );
}
const mapStateToProps = (state) => {
  return {
    flowData: state.EditFlowReducer.flowData,
  };
};

const mapDispatchToProps = {
  onGetAllFieldsByFilter: getAllFieldsByFilter,
  onFlowStateChange: updateFlowStateChange,
  saveEscalations: saveEscalationsThunk,
  saveDocumentGeneration: saveDocumentGenerationThunk,
  saveSendEmail: saveSendEmailThunk,
  checkFieldDependencyApi: checkFieldDependencyApiThunk,
  saveSendDataToDatalist: saveSendDataToDatalistThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationModal);

ConfigurationModal.defaultProps = {
  configTypeId: null,
  setConfigType: null,
};

ConfigurationModal.propTypes = {
  configTypeId: PropTypes.number,
  setConfigType: PropTypes.func,
};
