import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import { includes, isEmpty } from 'utils/jsUtility';
import { INPUT_TYPES } from '../../../utils/UIConstants';
import {
  DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES,
  FORM_POPOVER_STATUS,
  IMAGE_EXTENSIONS,
} from '../../../utils/Constants';
import { generateUuid, getExtensionFromFileName } from '../../../utils/generatorUtils';
import { showToastPopover } from '../../../utils/UtilityFunctions';
import {
  DOCUMENT_TYPES,
  EMPTY_STRING,
} from '../../../utils/strings/CommonStrings';
import { VALIDATION_CONSTANT } from '../../../utils/constants/validation.constant';
import useFileUploadHook from '../../../hooks/useFileUploadHook';
import { getFileUrl } from '../../../utils/attachmentUtils';
import { emptyRef } from '../../../utils/jsUtility';
import { getAccountConfigurationDetailsApiService } from '../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';

function InsertImage(props) {
  const { entityData = {}, contextData = {}, refUuid, imageUploadRef, addDocumentHandler, currentImageTagRef = {}, isDesignElements = false } = props;

  const { t } = useTranslation();

  const [userProfileData, setUserProfileData] = useState({});
  const [uploadedImageUrl, setUploadedImageUrl] = useState({
    base64: EMPTY_STRING,
    imageName: EMPTY_STRING,
    file: {},
  });

  useEffect(() => {
    getAccountConfigurationDetailsApiService().then((response) => {
      setUserProfileData(response);
    });
  }, []);

  const getFileData = (doc_details, file_ref_uuid) => {
    const fileData = {
      type: isDesignElements ? entityData?.type : DOCUMENT_TYPES.INFORMATION_FIELD_DOCUMENTS,
      file_type: getExtensionFromFileName(doc_details.name),
      file_name: doc_details.name,
      file_size: doc_details.size,
      file_ref_id: file_ref_uuid,
    };
    const file_metadata = [];
    file_metadata.push(fileData);
    const data = {
      file_metadata,
    };
    data.entity = entityData.entity;
    if (entityData.entity_id) data.entity_id = entityData.entity_id;
    data.context_entity_type = contextData.context_entity_type;
    if (contextData.context_id) data.context_id = contextData.context_id;
    if (refUuid) data.ref_uuid = refUuid;
    else data.ref_uuid = generateUuid();

    return data;
  };

  const { onFileUpload, documentDetails, uploadFile } = useFileUploadHook(
    getFileData,
    null,
    false,
  );

  const updateDocumentDetailsInState = (imageId) => {
    let constructServerImageUrl;

    if (window.location.protocol !== 'https:') {
      constructServerImageUrl = `https://workhall.dev/dms/display/?id=${imageId}`;
    } else {
      constructServerImageUrl = `https://${window.location.hostname}/dms/display/?id=${imageId}`;
    }

    if (currentImageTagRef) {
      currentImageTagRef.current = `<img key="image-key-${new Date().getTime()}" id="doc-gen-image-${imageId}" style="max-width: 100%;" data-image-id="${imageId}" src="${constructServerImageUrl}" alt="${
        uploadedImageUrl?.imageName
      }" title="${uploadedImageUrl?.imageName}" />`;
    }

    // refreshing the file input to accept the same file if user selects it
    if (imageUploadRef?.current) imageUploadRef.current.value = EMPTY_STRING;
  };

  useEffect(() => {
    if (!isEmpty(documentDetails.file_metadata) && !isEmpty(uploadFile)) {
      let initial_step_ref_uuid = refUuid;

      if (isEmpty(refUuid)) {
        if (documentDetails?.ref_uuid) {
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
      updateDocumentDetailsInState(documentDetails.file_metadata[0]._id);
      addDocumentHandler?.(documentDetails);
    }
  }, [documentDetails?.file_metadata, documentDetails?.file_metadata?.length]);

  const handleImageUpload = (event) => {
    event.preventDefault();
    const reader = new FileReader();
    const file = event.target.files[0];

    if (
      !includes(IMAGE_EXTENSIONS, getExtensionFromFileName(file.name)) ||
      !includes(userProfileData?.allowed_extensions, getExtensionFromFileName(file.name)) ||
      file.type === EMPTY_STRING
    ) {
      showToastPopover(
        t(VALIDATION_CONSTANT.INVALID_FILE),
        t(VALIDATION_CONSTANT.FILE_MISMATCH),
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );

      // refreshing the file input to accept the same file if user selects it
      if (imageUploadRef?.current) imageUploadRef.current.value = EMPTY_STRING;
      return;
    } else if (file.size > userProfileData.maximum_file_size * DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES) {
      showToastPopover(
        t(VALIDATION_CONSTANT.FILE_SIZE_EXCEED),
        `${t(VALIDATION_CONSTANT.LESS_FILE_SIZE)} ${userProfileData.maximum_file_size}${t(VALIDATION_CONSTANT.MB)}`,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );

      // refreshing the file input to accept the same file if user selects it
      if (imageUploadRef?.current) imageUploadRef.current.value = EMPTY_STRING;
      return;
    }

    reader.onloadend = () => {
      const imageName = file.name;
      const base64 = reader.result.split(',')[1];

      setUploadedImageUrl({ base64, imageName, file });
      onFileUpload({ files: [file] });
    };

    if (file !== null) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input
        id="doc-gen-image-upload"
        type={INPUT_TYPES.FILE}
        className={gClasses.DisplayNone}
        onChange={handleImageUpload}
        ref={imageUploadRef}
        accept={IMAGE_EXTENSIONS}
      />
    </div>
  );
}

export default InsertImage;

InsertImage.defaultProps = {
  entityId: EMPTY_STRING,
  refUuid: EMPTY_STRING,
  imageUploadRef: emptyRef,
  parentEditorRef: emptyRef,
};

InsertImage.propTypes = {
  entityId: PropTypes.string,
  refUuid: PropTypes.string,
  imageUploadRef: PropTypes.object,
  parentEditorRef: PropTypes.object,
};
