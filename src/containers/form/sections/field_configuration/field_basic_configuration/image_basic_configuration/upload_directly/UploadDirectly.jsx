import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ProgressBar,
  EProgressType,
  EProgressCircleSize,
  Title,
  ETitleAlign,
  ETitleHeadingLevel,
  ETitleSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import UploadFileIcon from 'assets/icons/UploadFileIcon';
import useFileUploadHook from 'hooks/useFileUploadHook';
import ThemeContext from 'hoc/ThemeContext';
import { generateUuid, getExtensionFromFileName } from 'utils/generatorUtils';
import { FILE_UPLOAD_STATUS, IMAGE_EXTENSIONS } from 'utils/Constants';
import { cloneDeep, has, isEmpty } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { getAccountConfigurationDetailsApiService } from 'axios/apiService/accountConfigurationDetailsAdmin.apiService';
import FileUpload from 'components/form_components/file_upload/FileUpload';
import { ACCOUNT_INFO_STRINGS } from '../../../../../../landing_page/account_info/AccountInfoModal.string';
import styles from '../ImageBasicConfiguration.module.scss';
import { FIELD_CONFIGURATIONS_CONSTANTS } from '../../../FieldConfiguration.constants';

function UploadDirectly(props) {
  const { fieldDetails, setFieldDetails, metaData, errorList } = props;
  const { t } = useTranslation();
  const {
    GENERAL: {
      IMAGE: { UPLOAD_IMAGE },
    },
  } = FIELD_CONFIGURATIONS_CONSTANTS(t);
  const { colorSchemeDefault } = useContext(ThemeContext);

  const [configuredMaxFileSize, setConfiguredMaxFileSize] = useState(0);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [fileName, setFileName] = useState(EMPTY_STRING);
  const arrDocumentData =
    cloneDeep(fieldDetails)?.documentData?.documents || [];

  useEffect(() => {
    getAccountConfigurationDetailsApiService().then(
      (response) => {
        setConfiguredMaxFileSize(response.maximum_file_size);
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  const getFileData = (
    doc_details,
    file_ref_uuid,
    _entity,
    _entity_id,
    fileRefUuid,
  ) => {
    const ref_uuid = fileRefUuid || generateUuid();
    const fileData = {
      type: 'image_field',
      file_type: getExtensionFromFileName(doc_details.file.name, true),
      file_name: doc_details.file.name.slice(
        0,
        -1 *
          (doc_details.file.name.length -
            doc_details.file.name.lastIndexOf('.')),
      ),
      file_size: doc_details.file.size,
      file_ref_id: file_ref_uuid,
      // context_uuid: metaData?.dataListUUID || metaData?.flowUUID,
    };
    const file_metadata = [];
    file_metadata.push(fileData);
    const data = {
      file_metadata,
    };
    data.entity = 'dashboard_pages'; // step subprocess static documents
    data.entity_id = metaData?.pageId;
    data.context_id = metaData?.dataListId || metaData?.flowId;
    data.ref_uuid = ref_uuid;
    return data;
  };

  const { onRetryFileUpload, onFileUpload, documentDetails, uploadFile } =
    useFileUploadHook(getFileData);

  const onImageChange = (event) => {
    const documents = [];
    const clonedComponentData = cloneDeep(fieldDetails.documentData) || {};
    let isImageChange = fieldDetails?.isImageChange ?? true;
    if (
      event?.target?.value &&
      (has(event.target, ['removed_doc']) ||
        (!has(event.target, ['removed_doc']) && !isEmpty(event.target.value)))
    ) {
      (event.target.value || []).forEach((document) => {
        documents.push({
          ...document,
          progress: 100,
        });
      });
      if (event.target.removed_doc) {
        isImageChange = true;
        clonedComponentData.removedDocList = [
          ...(clonedComponentData?.removedDocList || []),
          event.target.removed_doc,
        ];
      }
      clonedComponentData.documents = cloneDeep(documents);
      clonedComponentData.ref_uuid = documents?.[0]?.ref_uuid;
      // if (!isEmpty(errorListConfig)) {
      //   const errorList = getValidationData(clonedComponentData, t);
      //   applicationStateChange({ error_list_config: errorList });
      // }
      const documentDetails = {};
      if (!event.target.removed_doc) {
        documentDetails.entity = documents?.[0]?.entity;
        documentDetails.entity_id = documents?.[0]?.entity_id;
        documentDetails.ref_uuid = clonedComponentData?.ref_uuid;
        // documentDetails.removed_doc_list = clonedComponentData.removedDocList;
        documentDetails.uploaded_doc_metadata = [
          {
            document_id: documents?.[0]?.fileId,
            type: documents?.[0]?.type,
            upload_signed_url: documents?.[0]?.upload_signed_url,
          },
        ];
      }
      const cloneErrorList = cloneDeep(errorList);
      delete cloneErrorList.imageId;
      setFieldDetails({
        ...fieldDetails,
        isImageChange,
        documentData: clonedComponentData,
        documentDetails,
        imageId: documents?.[0]?.fileId,
        errorList: cloneErrorList,
      });
    }
  };

  useEffect(() => {
    let updatedAttachment = cloneDeep([]) || [];
    if (uploadFile.file_ref_uuid) {
      const uploadUrl = uploadFile.url;
      const docMetaData = {
        fileName: uploadFile.fileName,
        file: uploadFile.file,
        status: FILE_UPLOAD_STATUS.SUCCESS,
        fileId: documentDetails.file_metadata[0]._id,
        url: uploadUrl,
        entity_id: documentDetails.entity_id,
        entity: documentDetails.entity,
        newDocument: true,
        ref_uuid: documentDetails.ref_uuid,
        type: documentDetails.file_metadata[0].type,
        upload_signed_url:
          documentDetails.file_metadata[0].upload_signed_url.fields.key,
      };
      updatedAttachment = [...(updatedAttachment || []), docMetaData];
      onImageChange({
        target: {
          value: updatedAttachment,
        },
      });
    }
  }, [documentDetails]);

  const setLoader = (progress) => {
    switch (progress) {
      case 0:
        setImageUploadProgress(0);
        break;
      case 1:
        setImageUploadProgress(50);
        break;
      case 2:
        setImageUploadProgress(75);
        break;
      case 3:
        setImageUploadProgress(100);
        break;
      default:
        break;
    }
  };

  return imageUploadProgress > 0 && imageUploadProgress < 100 ? (
    <div className={cx(styles.ExistingFile, gClasses.MT25)}>
      <div className={styles.NameIconComponent}>
        <div className={gClasses.DisplayFlex}>
          <div className={cx(styles.IconContainer, gClasses.CenterVH)}>
            <ProgressBar
              value={imageUploadProgress}
              progressType={EProgressType.download}
              progressCircleSize={EProgressCircleSize.medium}
              colorScheme={colorSchemeDefault}
            />
          </div>
          <div
            className={cx(
              gClasses.FlexJustifyBetween,
              gClasses.CenterVH,
              styles.NameContainer,
            )}
          >
            <div style={{ maxWidth: '65%' }} className={gClasses.PL5}>
              <Title
                content={fileName}
                alignment={ETitleAlign.middle}
                headingLevel={ETitleHeadingLevel.h6}
                size={ETitleSize.xs}
                className={cx(gClasses.FTwo12)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <FileUpload
      id={UPLOAD_IMAGE.ID}
      label={UPLOAD_IMAGE.LABEL}
      containerClass={styles.Field}
      addFile={(
        fileData,
        filess,
        currentIndex,
        totalLength,
        recursiveFunc,
        entityId,
        currentFilesLength,
        invalidFileType,
        invalidFileSize,
        isMultiple,
        currentFileIndex,
        fileRefUuid,
      ) => {
        setImageUploadProgress(25);
        const doc_details = fileData?.files?.[0];
        if (doc_details?.file) {
          setFileName(
            doc_details.file.name.slice(
              0,
              -1 *
                (doc_details.file.name.length -
                  doc_details.file.name.lastIndexOf('.')),
            ),
          );
        }
        onFileUpload(
          fileData,
          filess,
          currentIndex,
          totalLength,
          recursiveFunc,
          entityId,
          currentFilesLength,
          invalidFileType,
          invalidFileSize,
          isMultiple,
          currentFileIndex,
          false,
          fileRefUuid,
          setLoader,
        );
      }}
      fileName={arrDocumentData || []}
      allowed_extensions={IMAGE_EXTENSIONS.slice(0, 4)}
      maximum_file_size={configuredMaxFileSize}
      onDeleteClick={(value) => {
        const updatedDocumentList = (arrDocumentData || []).filter(
          (fileObj) => fileObj.fileId !== value,
        );
        onImageChange({
          target: {
            value: updatedDocumentList,
            removed_doc: value,
          },
        });
      }}
      onRetryClick={onRetryFileUpload}
      errorMessage={errorList?.imageId}
      className={styles.FileUpload}
      uploadIcon={<UploadFileIcon />}
      instructionMessage={t(ACCOUNT_INFO_STRINGS.FILE_ACCEPTED_TYPE)}
    />
  );
}

export default UploadDirectly;
