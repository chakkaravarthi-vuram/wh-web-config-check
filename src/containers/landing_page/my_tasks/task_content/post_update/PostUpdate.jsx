import React, { useEffect } from 'react';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import InfoField from '../../../../../components/form_components/info_field/InfoField';
import styles from './PostUpdate.module.scss';
import FileUpload from '../../../../../components/form_components/file_upload/FileUpload';
import { isEmpty } from '../../../../../utils/jsUtility';
import useFileUploadHook from '../../../../../hooks/useFileUploadHook';
import { getExtensionFromFileName } from '../../../../../utils/generatorUtils';
import { TASK_CONTENT_STRINGS } from '../../../LandingPage.strings';

function PostUpdate(props) {
  const { t } = useTranslation();
  const {
    notes,
    onChange,
    commentsError,
    attachmentProps,
  } = props;

  const getFileData = (doc_details, file_ref_uuid) => {
    const fileData = {
      type: attachmentProps?.type,
      file_type: getExtensionFromFileName(doc_details.file.name),
      file_name: doc_details.file.name.substring(0, doc_details.file.name.lastIndexOf('.')),
      file_size: doc_details.file.size,
      file_ref_id: file_ref_uuid,
    };
    const file_metadata = [];
          file_metadata.push(fileData);
      const data = {
        file_metadata,
      };
      data.entity = attachmentProps?.entity;
      data.context_id = attachmentProps?.context_id;
      data.context_uuid = attachmentProps?.context_uuid;
      return data;
    };

  const {
    onRetryFileUpload,
    onFileUpload,
    documentDetails,
    uploadFile,
    onDeletFileUpload,
} = useFileUploadHook(getFileData);

useEffect(() => {
  console.log('documentDetailsdocumentDetails', documentDetails);
  onChange({
    target: {
      value: documentDetails,
      id: TASK_CONTENT_STRINGS.ADHOC_COMMENT_ATTACHMENTS,
    },
   });

  onChange({
    target: {
      value: false,
      id: 'isAttachmentUploadInProgress',
    },
  });
}, [documentDetails?.entity_id]);

  return (
    <div className={gClasses.PT16}>
      <InfoField
        id={TASK_CONTENT_STRINGS.NOTES_ID}
        placeholder={t(TASK_CONTENT_STRINGS.NOTES_PLACEHOLDER)}
        errorMessage={commentsError}
        label={t(TASK_CONTENT_STRINGS.POST_UPDATE)}
        onChangeHandler={onChange}
        description={notes}
        editorClassName={styles.Notes}
        customEditorHeight={240}
      />
      <FileUpload
        className={gClasses.MT16}
        id={TASK_CONTENT_STRINGS.ATTACHMENTS_ID}
        label={t(TASK_CONTENT_STRINGS.ATTACHMENTS_LABEL)}
        addFile={(fileData, filess, currentIndex, totalLength, recursiveFunc, entityId, currentFilesLength, invalidFileType, invalidFileSize, isMultiple) => {
          onChange({
            target: {
              value: true,
              id: 'isAttachmentUploadInProgress',
            },
          });
          console.log('mnx', fileData);
          onFileUpload(fileData, filess, currentIndex, totalLength, recursiveFunc, entityId, currentFilesLength, invalidFileType, invalidFileSize, isMultiple);
        }}
        fileName={isEmpty(uploadFile) ? [] : [uploadFile]}
        allowed_extensions={attachmentProps?.allowedFileTypes}
        maximum_file_size={attachmentProps?.maxFileSize}
        errorMessage={EMPTY_STRING}
        placeholder={t(TASK_CONTENT_STRINGS.ATTACHMENTS_PLACEHOLDER)}
        onDeleteClick={() => {
          onChange({
            target: {
              value: {},
              id: TASK_CONTENT_STRINGS.ADHOC_COMMENT_ATTACHMENTS,
            },
           });
          onDeletFileUpload();
        }}
        onRetryClick={onRetryFileUpload}
        isMultiple={false}
      />
    </div>
  );
}
export default PostUpdate;
