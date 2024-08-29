import React, { useContext, useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ThemeContext from 'hoc/ThemeContext';

import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { KEY_CODES, FILE_UPLOAD_STATUS } from 'utils/Constants';
import FileUpload from 'components/form_components/file_upload/FileUpload';
import useFileUploadHook from 'hooks/useFileUploadHook';
import { getExtensionFromFileName } from 'utils/generatorUtils';
import AddMembers from 'components/member_list/add_members/AddMembers';
import { getAccountConfigurationDetailsApiService } from 'axios/apiService/accountConfigurationDetailsAdmin.apiService';
import Input from 'components/form_components/input/Input';
import {
  set,
  isEmpty,
  nullCheck,
  cloneDeep,
  find,
  get,
  compact,
  findIndex,
  has,
  isNull,
  remove,
} from 'utils/jsUtility';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { validate, getFileNameFromServer, isEmptyString } from 'utils/UtilityFunctions';
import { constructMailContentFromServer, formatMailContentFromServer } from 'containers/edit_flow/EditFlow.utils';
import AttachmentsIcon from 'assets/icons/AttachmentsIcon';
import { getActionsListFromUtils } from './SendEmail.utils';
import { SEND_EMAIL_STRINGS } from './SendEmail.strings';
import ImportFieldEditor from './ImportFieldEditor';
import styles from './SendEmail.module.scss';
import { getEmptyRecipientObjectByType } from '../Configuration.utils';
import { RECIPIENT_OPTION_LIST, RECIPIENT_FIELD_CONTENT, CONFIGURATION_TYPE_ID } from '../Configuration.strings';
import DropdownGroup from '../../step_components/actors/flow_dropdown_group/DropdownGroup';
import { getEmailActionsValidateData } from '../../StepConfiguration.utils';
import { emailActionsValidateSchema } from '../../StepConfiguration.validations';
import { DOCUMENT_GENERATION_STRINGS } from '../document_generation/DocumentGeneration.utils';
import { generateUuid } from '../../../../../utils/generatorUtils';
import { getFileUrl } from '../../../../../utils/attachmentUtils';
import { updateFlowStateChange } from '../../../../../redux/reducer/EditFlowReducer';
import PlusIconBlueNew from '../../../../../assets/icons/PlusIconBlueNew';
import { FORM_POPOVER_STATUS } from '../../../../../utils/Constants';
import { showToastPopover } from '../../../../../utils/UtilityFunctions';

function SendEmail(props) {
  const { t } = useTranslation();
  const { buttonColor } = useContext(ThemeContext);
  const { flowId, stepData, onFlowStateChange, setImageFieldUUID, setDocumentDetails, setAttachmentUUID, allFileFields, setFileValidationError, setAttachmentStatus, allFields } = props;
  console.log(props, 'document_url_details');

  const [selectedFormFields, setSelectedFormFields] = useState([]);
  const [selectedFormFieldsId, setSelectedFormFieldsId] = useState([]);
  const [uploadedAttachmentDetails, setUploadedAttachmentDetails] = useState([]);
  const [uploadedAttachmentDetailsId, setUploadedAttachmentDetailsId] = useState([]);
  const [stepRefUUID, setStepRefUUID] = useState('');
  const [userProfile, setUserProfile] = useState({});
  const { EDITOR_STRINGS } = DOCUMENT_GENERATION_STRINGS;

  const {
    email_action_error_list,
    actions,
    active_email_action: {
      action_uuid,
      email_subject,
      email_body,
      recipients,
      email_attachments,
    },
    active_email_action,
    document_url_details,
    is_initiation,
    // step_ref_uuid
  } = stepData;

  const [uploadedAttachmentFiles, setUploadedAttachmentFiles] = useState([]);
  const [exceedFileList, setexceedFileList] = useState([]);

  const updateSelectedFormFields = (selectedFormFields) => {
    if (email_attachments && email_attachments.field_uuid) {
      const selectedFormFieldsList = selectedFormFields;
      const selectedFormFieldsIdList = selectedFormFieldsId;

      if (allFileFields) {
        email_attachments.field_uuid.map((field_uuid) => {
          const indexOfObject = allFileFields.findIndex((object) => object.field_uuid === field_uuid);
          if (indexOfObject >= 0) {
            selectedFormFieldsList.push(allFileFields[indexOfObject]);
            selectedFormFieldsIdList.push(allFileFields[indexOfObject].field_uuid);
          }
          return selectedFormFieldsIdList;
        });
    }
    setSelectedFormFields(selectedFormFieldsList);
    setSelectedFormFieldsId(selectedFormFieldsIdList);
    }
  };

  const updateUploadedAttachments = (email_attachments) => {
    let taskActionUploadData = {};
    let updatedAttachment = [];

    email_attachments.forEach((attachment_id) => {
      document_url_details && document_url_details.forEach((document) => {
        console.log('dattttttdocument', attachment_id, document.document_id, document);

        if (attachment_id === document.document_id) {
          if (document && document.original_filename) {
            taskActionUploadData = {
              fileName: getFileNameFromServer(document.original_filename),
              file: {
                name: getFileNameFromServer(document.original_filename),
                type: document.original_filename.content_type,
                url: document.signedurl,
                size: document.original_filename.file_size,
              },
              status: FILE_UPLOAD_STATUS.SUCCESS,
              fileId: attachment_id,
              url: document.signedurl,
            };

        const UploadedAttachmentDetailsList = uploadedAttachmentDetailsId;
        if (
          !find(UploadedAttachmentDetailsList, attachment_id)
        ) {
          UploadedAttachmentDetailsList.push(attachment_id);
        }
        setUploadedAttachmentDetailsId(UploadedAttachmentDetailsList);
            updatedAttachment = [
              ...updatedAttachment,
              taskActionUploadData,
            ];

           setUploadedAttachmentDetails(updatedAttachment);
          }
        }
      });
    });
    setAttachmentUUID(uploadedAttachmentDetailsId);

    console.log('finalPostPreviewDataupdatedAttachment', updatedAttachment);
  return updatedAttachment;
  };
  useEffect(() => {
    setUploadedAttachmentDetails(uploadedAttachmentFiles);
  }, [uploadedAttachmentFiles]);
  let ref_uuid = '';

  const getFileData = (doc_details, file_ref_uuid) => {
    const fileData = {
      type: 'email_attachments',
      file_type: getExtensionFromFileName(doc_details.file.name, true),
      file_name: doc_details.file.name.slice(0, -1 * (doc_details.file.name.length - doc_details.file.name.lastIndexOf('.'))),
      file_size: doc_details.file.size,
      file_ref_id: file_ref_uuid,
    };
    if (isEmptyString(ref_uuid) && isEmptyString(stepRefUUID)) {
     ref_uuid = generateUuid();
    }
    setStepRefUUID(ref_uuid);
    const file_metadata = [];
          file_metadata.push(fileData);
      const data = {
        file_metadata,
      };
      data.entity = 'flow_steps';
      data.context_id = flowId;
      data.entity_id = stepData._id;
      data.ref_uuid = ref_uuid || stepRefUUID;
      return data;
    };

  const setFileUploadStatus = (status) => {
    setAttachmentStatus(status);
  };
  const {
    onRetryFileUpload,
    onFileUpload,
    documentDetails,
    uploadFile,
} = useFileUploadHook(getFileData, null, null, setFileUploadStatus);

  const [uploadedDocDetails, setUploadedDocDetails] = useState([]);
  const [removedDocList, setRemovedDocList] = useState([]);
  const onDeleteFileUpload = (event) => {
    let docDetails = {};
    const updatedAttachmentDetails = uploadedAttachmentDetails;
  if (find(updatedAttachmentDetails, { fileId: event })) {
    const specificValuesFromArray = uploadedAttachmentDetails.filter((obj) => obj.fileId === event);
    remove(updatedAttachmentDetails, { fileId: event });
    const updatedFileList = exceedFileList.filter(function updatedList(item) {
      return item !== specificValuesFromArray[0].fileName;
    });
    setexceedFileList(updatedFileList);
    setFileValidationError(updatedFileList);
    const removedDoc = [
      ...removedDocList,
      event,
    ];

    setRemovedDocList(removedDoc);
    if (uploadedDocDetails.document_details) {
      docDetails = { removed_doc_list: removedDoc,
      document_details: uploadedDocDetails.document_details };
      if (uploadedDocDetails.document_details.uploaded_doc_metadata) {
        const indexOfObject = uploadedDocDetails.document_details.uploaded_doc_metadata.findIndex((object) => object.document_id === event);
        if (indexOfObject >= 0) {
          uploadedDocDetails.document_details.uploaded_doc_metadata.splice(indexOfObject, 1);
          if (uploadedDocDetails.document_details.uploaded_doc_metadata.length === 0) {
              docDetails = { removed_doc_list: removedDoc };
          }
        }
      }
    } else {
      docDetails = { removed_doc_list: removedDoc };
    }
  }
  setUploadedAttachmentDetails(updatedAttachmentDetails);
  const updatedAttachmentIdDetails = [];
  updatedAttachmentDetails.forEach((id) => {
    updatedAttachmentIdDetails.push(id.fileId);
  });

  setUploadedAttachmentDetailsId(updatedAttachmentIdDetails);

    setDocumentDetails(docDetails);
    setUploadedDocDetails(docDetails);

  setAttachmentUUID(updatedAttachmentIdDetails);
  };

  console.log(uploadedDocDetails, 'docDetailsdocDetails');
  const [isImportFieldDropdownVisibile, setImportFieldDropdownVisibility] = useState(false);
  const [apiBodyContent, setApiBodyContent] = useState(EMPTY_STRING);

  useEffect(() => {
    if (!isEmpty(allFileFields)) {
      updateSelectedFormFields(selectedFormFields);
    }
  }, [allFileFields?.length]);

  useEffect(() => {
    document_url_details && document_url_details.forEach((document) => {
      if (document && document.original_filename && document.original_filename.ref_uuid) {
        const step_ref_uuid = document.original_filename.ref_uuid;
        setStepRefUUID(step_ref_uuid);
      }
    });
    let docDetailsList = [];
    if (email_attachments && email_attachments.attachment_id && document_url_details) {
    docDetailsList = updateUploadedAttachments(email_attachments.attachment_id);
    setUploadedAttachmentDetails(docDetailsList);
    setUploadedAttachmentFiles(docDetailsList);
    }

    getAccountConfigurationDetailsApiService().then((response) => {
      setUserProfile(response);
      const updatedFileList = [];
      docDetailsList.forEach((file) => {
        if (response.maximum_file_size) {
          if (file.file.size > response.maximum_file_size * 1048576) {
            updatedFileList.push(file.file.name);
            setexceedFileList(updatedFileList);
            setFileValidationError(updatedFileList);
          }
        }
      });
    }, () => {
      showToastPopover(
        'Fetching User Profile Failed',
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    });

    if (!isNull(email_body) && email_body && email_subject) {
    const activeStepDetails = cloneDeep(stepData);
      if (email_subject.includes('!@#$')) {
        activeStepDetails.mailSubjectFieldsList = constructMailContentFromServer(email_subject);
      }
      if (email_body.includes('!@#$')) {
        activeStepDetails.mailBodyFieldsList = constructMailContentFromServer(email_body);
      }
      activeStepDetails.active_email_action.email_body = formatMailContentFromServer(
        email_body,
        activeStepDetails.mailBodyFieldsList,
      );
      setApiBodyContent(formatMailContentFromServer(
        email_body,
        activeStepDetails.mailBodyFieldsList,
      ));
      activeStepDetails.active_email_action.email_subject = formatMailContentFromServer(
        email_subject,
        activeStepDetails.mailSubjectFieldsList,
      );
      onFlowStateChange({ activeStepDetails });
    }
}, []);

useEffect(() => {
  setImageFieldUUID(selectedFormFieldsId);
}, [selectedFormFields]);

const [multipleUpoad, setMultipleUpload] = useState([]);
useEffect(() => {
  let updatedAttachment = [];
  if (uploadFile.file_ref_uuid) {
    const docMetaData = {
      fileName: uploadFile.fileName,
      file: uploadFile.file,
      status: FILE_UPLOAD_STATUS.SUCCESS,
      fileId: documentDetails.file_metadata[0]._id,
      url: uploadFile.url,
    };
   updatedAttachment = [
    ...uploadedAttachmentDetails,
    docMetaData,
  ];
}
  setUploadedAttachmentDetails(updatedAttachment);

  let initial_step_ref_uuid = stepRefUUID;
  if (isEmpty(stepRefUUID)) {
    if (documentDetails && documentDetails.ref_uuid) {
      setStepRefUUID(documentDetails.ref_uuid);
      initial_step_ref_uuid = documentDetails.ref_uuid;
    }
  }

  const finalPostPreviewData = {};
  const UploadedDocMetaData = [];
  let updatedmultipleUpoad = [];
  if (documentDetails.entity_id) {
    finalPostPreviewData.document_details = {};
    finalPostPreviewData.document_details.entity =
      documentDetails.entity;
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

        const UploadedAttachmentDetailsList = uploadedAttachmentDetailsId;
        if (
          !find(UploadedAttachmentDetailsList, file_info._id)
        ) {
          UploadedAttachmentDetailsList.push(file_info._id);
        }
        setUploadedAttachmentDetailsId(UploadedAttachmentDetailsList);
          });
        }

        updatedmultipleUpoad = [
          ...multipleUpoad,
          UploadedDocMetaData[0],
        ];
        setMultipleUpload(updatedmultipleUpoad);
  finalPostPreviewData.document_details.uploaded_doc_metadata = updatedmultipleUpoad;
  }
  setAttachmentUUID(uploadedAttachmentDetailsId);
  let docDetails = {};
  if (finalPostPreviewData.document_details) {
    if (uploadedDocDetails.removed_doc_list) {
      docDetails = {
        document_details: finalPostPreviewData.document_details,
        removed_doc_list: uploadedDocDetails.removed_doc_list };
    } else {
      docDetails = {
        document_details: finalPostPreviewData.document_details,
      };
    }
}

  setDocumentDetails(docDetails);
  setUploadedDocDetails(docDetails);
}, [documentDetails]);

const validateFields = (activeStepDetails, id) => {
  if (isEmpty(id)) return stepData;

  const error_list = validate(
    getEmailActionsValidateData(cloneDeep(activeStepDetails)),
    emailActionsValidateSchema(t),
  );
  if (!has(error_list, [id]) && has(email_action_error_list, [id])) {
    delete activeStepDetails.email_action_error_list[id];
  } else if (has(error_list, [id])) {
    const emailActionErrorList = get(activeStepDetails, ['email_action_error_list'], {});
    activeStepDetails.email_action_error_list = {
      ...emailActionErrorList,
      [id]: error_list[id],
    };
  }
  return activeStepDetails;
};

const onChangeHandler = (event) => {
  let activeStepDetails = cloneDeep(stepData);
  if (!activeStepDetails.active_email_action) {
    activeStepDetails.active_email_action = {};
  }
  set(
    activeStepDetails.active_email_action,
    event.target.id,
    event.target.value,
  );
  if (has(email_action_error_list, [event.target.id], false)) {
    activeStepDetails = validateFields(activeStepDetails, event.target.id);
  }
  onFlowStateChange({ activeStepDetails });
};

const appendFieldToMailSubjectText = (event) => {
  if (event.target.value === 'SYSTEM FIELDS' || event.target.value === 'FORM FIELDS') {
    event.preventdefault();
  }
  let activeStepDetails = cloneDeep(stepData);
  const { mailSubjectFieldsList } = activeStepDetails;
  if (nullCheck(event, 'target.value')) {
    const {
      target: { value, type },
    } = event;
    if (type !== 'system') {
      const fieldDetails = find(allFields, { value });
      if (mailSubjectFieldsList) {
        activeStepDetails.mailSubjectFieldsList.push(fieldDetails);
      } else {
        activeStepDetails.mailSubjectFieldsList =
          [];
          activeStepDetails.mailSubjectFieldsList.push(fieldDetails);
      }
      activeStepDetails.active_email_action.email_subject =
        email_subject
          ? `${email_subject}[${fieldDetails.label}] `
          : `[${fieldDetails.label}] `;
    } else {
      if (mailSubjectFieldsList) {
         activeStepDetails.mailSubjectFieldsList.push({ type: 'system', label: value });
          } else {
        activeStepDetails.mailSubjectFieldsList =
          [];
          activeStepDetails.mailSubjectFieldsList.push({ type: 'system', label: value });
      }
      activeStepDetails.active_email_action.email_subject =
        email_subject ? `${email_subject}[${value}] ` : `[${value}] `;
    }
    setImportFieldDropdownVisibility(!isImportFieldDropdownVisibile);
    activeStepDetails = validateFields(activeStepDetails, SEND_EMAIL_STRINGS.EMAIL_SUBJECT_ID);
    onFlowStateChange({ activeStepDetails });
  }
};

const openImportFieldDropdown = () => {
  setImportFieldDropdownVisibility(!isImportFieldDropdownVisibile);
};
const onKeyopenImportFieldDropdown = (event) => {
  if ((event.keyCode && event.keyCode === KEY_CODES.ENTER) || (event.which && event.which === KEY_CODES.ENTER)) {
    event.preventDefault();
    setImportFieldDropdownVisibility(!isImportFieldDropdownVisibile);
  }
};

const getActionsList = () => {
  const dropdownList = getActionsListFromUtils(actions, is_initiation);
  return dropdownList;
};

const onChooseActionDropdownChangeHandler = (event) => {
  let activeStepDetails = cloneDeep(stepData);
  if (nullCheck(event, 'target.id')) {
    const {
      target: { value, id },
    } = event;
    if (isEmpty(activeStepDetails.active_email_action[id])) {
      activeStepDetails.active_email_action[id] = [];
    }
    const index = activeStepDetails.active_email_action[id].findIndex((action) => action === value);
    if (index > -1) activeStepDetails.active_email_action[id].splice(index, 1);
    else activeStepDetails.active_email_action[id].push(value);
    activeStepDetails = validateFields(activeStepDetails, id);
    onFlowStateChange({ activeStepDetails });
}
};

const updateOptionList = (selectedType) => {
  const allRecipientList = RECIPIENT_OPTION_LIST(t);
  const initialStepRestrictOptions = [RECIPIENT_OPTION_LIST(t)[4].value, RECIPIENT_OPTION_LIST(t)[5].value];
  const chosenRecipients = recipients && recipients.map((_recipient) => _recipient.recipients_type);
  let consolidatedList = allRecipientList.map((option) => {
    console.log('eachOptionEmail', option.value, initialStepRestrictOptions.includes(option.value));
    if ((option.value !== selectedType && chosenRecipients.includes(option.value)) ||
    (stepData.is_initiation && initialStepRestrictOptions.includes(option.value))) {
      return null;
    }
    return option;
  });
  consolidatedList = compact(consolidatedList);
  return consolidatedList;
};

const onAddRecipient = () => {
  const consolidatedOptionList = updateOptionList();
  const activeStepDetails = cloneDeep(stepData);
  if (!isEmpty(consolidatedOptionList)) {
  const pickTopRecipient = getEmptyRecipientObjectByType(consolidatedOptionList[0].value);
  activeStepDetails.active_email_action.recipients.push(pickTopRecipient);
  onFlowStateChange({ activeStepDetails });
  }
};

const onDeleteRecipient = (recipients_type) => {
  const activeStepDetails = cloneDeep(stepData);
  const consolidatedRecipients = recipients;
  const error_list = activeStepDetails.email_action_error_list;
  let deletableIndex = null;
  if (recipients_type && !isEmpty(recipients_type)) {
    deletableIndex = findIndex(recipients, { recipients_type: recipients_type });
    if (deletableIndex >= 0) {
    consolidatedRecipients.splice(deletableIndex, 1);
    activeStepDetails.active_email_action.recipients = consolidatedRecipients;

    if (has(error_list, [recipients_type])) {
      delete activeStepDetails.email_action_error_list[recipients_type];
}
    onFlowStateChange({ activeStepDetails });
    }
  }
};

const onChangeRecipient = (value, index) => {
 const activeStepDetails = cloneDeep(stepData);
 const clonedRecipients = cloneDeep(recipients);
 if (index >= 0 && value) {
   clonedRecipients[index] = getEmptyRecipientObjectByType(value);
   activeStepDetails.active_email_action.recipients = clonedRecipients;
   onFlowStateChange({ activeStepDetails });
 }
};

let recipientsDropdownGroup = null;
if (!isEmpty(recipients)) {
  recipientsDropdownGroup = recipients.map((_recipient, idk) => {
    const optionList = updateOptionList(_recipient.recipients_type);
    const selectedValue = !optionList.find((recipient) => _recipient?.recipients_type === recipient.value) ?
    RECIPIENT_OPTION_LIST(t).find((recipient) => _recipient?.recipients_type === recipient.value) : _recipient?.recipients_type;
    const stepActorTypeError = _recipient?.recipients_type &&
    !optionList.find((recipient) => _recipient?.recipients_type === recipient.value) ?
    'Invalid Email reciepient' : EMPTY_STRING;
    return (
      <DropdownGroup
        configurationTypeId={CONFIGURATION_TYPE_ID.SEND_EMAIL}
        optionList={optionList}
        onClick={(event) => onChangeRecipient(event, idk)}
        selectedValue={selectedValue?.label || selectedValue || EMPTY_STRING}
        assigneeErrorList={cloneDeep(email_action_error_list || {})}
        //  selectedValue={_recipient.recipients_type}
        outerClass={gClasses.MB12}
        isRequired
        data={stepData}
        onDeleteHandler={() => onDeleteRecipient(_recipient.recipients_type)}
        index={idk}
        label={idk > 0 ? t(RECIPIENT_FIELD_CONTENT.AND) : t(RECIPIENT_FIELD_CONTENT.THEN_MAIL)}
        isHideDeleteIcon={recipients.length === 1}
        stepActorTypeError={stepActorTypeError}
        assigneeIndex={idk}
      />
   );
  });
}

const formFieldSearchValue = EMPTY_STRING;

const onAddFormFieldHandler = (event) => {
  const updatedFormFieldUUId = [
    ...selectedFormFields,
    event.target.value,
  ];

  setSelectedFormFields(updatedFormFieldUUId);
const selectedFormFieldsIdList = selectedFormFieldsId;
  if (
    !find(selectedFormFieldsIdList, event.target.value.field_uuid)
  ) {
    selectedFormFieldsIdList.push(event.target.value.field_uuid);
  }
  setSelectedFormFieldsId(selectedFormFieldsIdList);
};

const onRemoveFormFieldHandler = (id) => {
  const updatedFormFieldID = selectedFormFields;
  if (find(updatedFormFieldID, { _id: id })) {
    remove(updatedFormFieldID, { _id: id });
  }

  const removedFormFields = [];
  updatedFormFieldID.forEach((data) => {
    removedFormFields.push(data);
  });
  setSelectedFormFields(removedFormFields);

  const removedFormFieldsId = [];
  removedFormFields.forEach((id) => {
    removedFormFieldsId.push(id.field_uuid);
  });

  setSelectedFormFieldsId(removedFormFieldsId);
};

console.log('uploadedAttachmentDetailsemail_body', email_body, exceedFileList);
const apiParams = {
    page: 1,
    size: 200,
    sort_by: 1,
    flow_id: flowId,
    // field_list_type: 'direct',
    allowed_field_types: ['fileupload'],
    include_property_picker: 1,
};
const { SYSTEM_FIELDS_LABEL, FORM_FIELDS_LABEL } = EDITOR_STRINGS;
const allFieldsWithoutTable = [];
(allFields || []).forEach((field) => {
if (field.field_list_type === 'direct') allFieldsWithoutTable.push(field);
});
allFieldsWithoutTable.push({ label: t(SYSTEM_FIELDS_LABEL), value: 'SYSTEM FIELDS' });
allFieldsWithoutTable.unshift({ label: t(FORM_FIELDS_LABEL), value: 'FORM FIELDS' });
const fieldDropDownOptionsBody = [].concat(allFieldsWithoutTable, SEND_EMAIL_STRINGS.SYSTEM_FIELD_OPTIONS_LIST(t));
const fieldDropDownOptionsSubject = [].concat(allFieldsWithoutTable, SEND_EMAIL_STRINGS.SYSTEM_FIELD_OPTIONS_LIST(t));
delete fieldDropDownOptionsSubject[fieldDropDownOptionsSubject.length - 2];
return (
    <div className={cx(BS.D_BLOCK, BS.JC_BETWEEN, gClasses.CenterV, BS.W100)}>
            <Dropdown
              id={SEND_EMAIL_STRINGS.ACTION_TYPE}
              label={t(SEND_EMAIL_STRINGS.ACTION_TYPE_LABEL)}
              optionList={getActionsList()}
              onChange={onChooseActionDropdownChangeHandler}
              selectedValue={action_uuid}
              errorMessage={email_action_error_list && email_action_error_list[SEND_EMAIL_STRINGS.ACTION_TYPE]}
              isMultiSelect
              isRequired
            />
            <div>
                 {recipientsDropdownGroup}
                 {
                (!isEmpty(updateOptionList())) &&
                (
                <button
                  className={cx(styles.BlueIconButton, gClasses.MT16)}
                  onClick={onAddRecipient}
                >
                  <PlusIconBlueNew />
                  {t(RECIPIENT_FIELD_CONTENT.ADD_RECIPIENT)}
                </button>
                )}
            </div>
            <Input
              className={cx(gClasses.MT17)}
              placeholder={t(SEND_EMAIL_STRINGS.EMAIL_SUBJECT_PLACEHOLDER)}
              label={t(SEND_EMAIL_STRINGS.EMAIL_SUBJECT_LABEL)}
              id={SEND_EMAIL_STRINGS.EMAIL_SUBJECT_ID}
              onChangeHandler={onChangeHandler}
              value={email_subject}
              errorMessage={
                email_action_error_list
                  ? email_action_error_list[SEND_EMAIL_STRINGS.EMAIL_SUBJECT_ID]
                  : null
              }
              isRequired
              icon={(
                    <div
                      role="link"
                      tabIndex="0"
                      style={{ color: buttonColor }}
                      className={cx(gClasses.CursorPointer, gClasses.WhiteSpaceNoWrap, gClasses.MB5, gClasses.FTwo13, gClasses.FontWeight500)}
                      onClick={openImportFieldDropdown}
                      onKeyDown={onKeyopenImportFieldDropdown}
                    >
                      {t(SEND_EMAIL_STRINGS.INSERT_FIELD)}
                    </div>
                )}
              showIconNearToLabel
            />
            {isImportFieldDropdownVisibile ? (
                     <Dropdown
                       label={t(SEND_EMAIL_STRINGS.CHOOSE_FIELD)}
                       optionList={fieldDropDownOptionsSubject}
                       onChange={(event) => {
                         appendFieldToMailSubjectText(
                           event,
                         );
                       }}
                       customListClasses={[styles.DropDownTitle, styles.DropDownTitle]}
                       customClassIndices={[0, allFieldsWithoutTable.length - 1]}
                     />
            ) : null}
            { (!email_body || (email_body && !email_body.includes('!@#$'))) ?
            (
            <ImportFieldEditor
              className={cx(gClasses.MT17, gClasses.FTwo12GrayV3)}
              placeholder={t(SEND_EMAIL_STRINGS.EMAIL_BODY_PLACEHOLDER)}
              label={t(SEND_EMAIL_STRINGS.EMAIL_BODY_LABEL)}
              id={SEND_EMAIL_STRINGS.EMAIL_BODY_ID}
              onChangeHandler={onChangeHandler}
              description={email_body}
              apiBodyContent={apiBodyContent}
              errorMessage={email_action_error_list && email_action_error_list[SEND_EMAIL_STRINGS.EMAIL_BODY_ID]}
              isRequired
              stepData={stepData}
              customEditorHeight="164px"
              fieldoptionList={fieldDropDownOptionsBody}
              buttonColor={buttonColor}
              active_email_action={active_email_action}
              dropDownSectionLength={allFieldsWithoutTable.length - 1}
            />
            ) : null
          }

          <FileUpload
                id={SEND_EMAIL_STRINGS.ATTACHMENTS_ID}
                label={t(SEND_EMAIL_STRINGS.ATTACHMENTS)}
                addFile={(fileData, filess, currentIndex, totalLength, recursiveFunc, entityId, currentFilesLength, invalidFileType, invalidFileSize, isMultiple, currentFileIndex) => {
                  onFileUpload(fileData, filess, currentIndex, totalLength, recursiveFunc, entityId, currentFilesLength, invalidFileType, invalidFileSize, isMultiple, currentFileIndex);
                }}
                fileName={isEmpty(uploadedAttachmentDetails) ? [] : uploadedAttachmentDetails}
                allowed_extensions={userProfile.allowed_extensions}
                maximum_file_size={userProfile.maximum_file_size}
                // errorMessage={fileUploadError}
                placeholder={t(SEND_EMAIL_STRINGS.ATTACHMENT_CONTENT)}
                onDeleteClick={onDeleteFileUpload}
                onRetryClick={onRetryFileUpload}
                isMultiple
                isEmailAttachments
                uploadIcon={<AttachmentsIcon />}
                innerClassName={cx(styles.EmailAttachmentClass)}
                attachmentTooltip={SEND_EMAIL_STRINGS.ATTACHMENT_TOOLTIP}
                exceedFileSize={exceedFileList}
          />

            <AddMembers
              id={SEND_EMAIL_STRINGS.ATTACH_FROM_FORM_FIELDS_ID}
              onUserSelectHandler={onAddFormFieldHandler}
              placeholder={t(SEND_EMAIL_STRINGS.ATTACH_FROM_FORM_FIELDS_PLACEHOLDER)}
              selectedData={selectedFormFields}
              removeSelectedUser={onRemoveFormFieldHandler}
              formFieldoptionList={fieldDropDownOptionsSubject}
              isCustomFormFields
              apiParams={apiParams}
              // errorText={create_team_state.errorText}
              memberSearchValue={formFieldSearchValue}
              // setMemberSearchValue={setExtensionSearchValue}
              label={t(SEND_EMAIL_STRINGS.ATTACH_FROM_FORM_FIELDS_LABEL)}
              hideUserIcon
              // isDataLoading={isDataLoading}
              // errorText={errors.allowed_extensions}
              containerSize={styles.ContainerSize}
            />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    flowId: state.EditFlowReducer.flowData.flow_id,

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFlowStateChange: (...params) => {
      dispatch(updateFlowStateChange(...params));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SendEmail);
