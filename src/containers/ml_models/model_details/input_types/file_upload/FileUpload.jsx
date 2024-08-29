import React, { useState, useEffect } from 'react';
import cx from 'classnames/bind';
import axios from 'axios';
import { ETextSize, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../../scss/Typography.module.scss';
import { IMAGE_UPLOAD_EXTENSION } from '../../../MlModels.constants';
import { getExtensionFromFileName } from '../../../../../utils/generatorUtils';
import { getFileAttachmentHeader } from '../../../../../components/form_components/file_upload_progress/FileUploadProgress.utils';
import FilePreview from '../../../../../components/file_preview/FileViewer';
import Tag from '../../../../../components/form_components/tag/Tag';
import styles from '../../ModelDetails.module.scss';
import { BS, COLOUR_CODES } from '../../../../../utils/UIConstants';
import UploadIcon from '../../../../../assets/icons/form_field_dropdown/UploadIcon';
import DeleteIconV2 from '../../../../../assets/icons/form_fields/DeleteIconV2';
import DownloadIconV2 from '../../../../../assets/icons/form_fields/DownloadIconV2';
import { keydownOrKeypessEnterHandle } from '../../../../../utils/UtilityFunctions';
import ErrorMessage from '../../../../../components/error_message/ErrorMessage';
import { GET_INPUT_TYPES_STRINGS } from '../InputTypes.strings';

function FileUploadComponent(props) {
  const { documentUrl, filename, isTryIt, supported_file_formats, onInputChange, component, errorBody, isClearData } = props;
  console.log('FileUploadComponent', props);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    setUploadedDocument(documentUrl);
    setUploadedFileName(filename);
  }, [documentUrl, filename]);

  useEffect(() => {
    setUploadedDocument(null);
  }, [isClearData]);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  const openPreviewModal = () => {
    setIsOpenModal(true);
  };

  const changeEyeIconVisibility = (visible) => {
    setShowIcon(visible);
  };

  const sampleFileDetails = !isTryIt && getFileAttachmentHeader(uploadedFileName, uploadedDocument, openPreviewModal, changeEyeIconVisibility, showIcon);
  let deleteIconComponent = null;
  let downLoadIconComonent = null;

  const handleFile = (file) => {
    // Read the content of the file
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedDocument(e.target.result);
      setUploadedFileName(file.name);
      const readerResult = reader.result;
      console.log('readerResult', readerResult);
    };

    reader.readAsDataURL(file); // Use readAsDataURL for images and PDFs
    onInputChange('fileData', {
      file_metadata: [
          { file_name: file.name,
            file_size: file.size,
            type: 'ml_model_integration',
            file_type: file.name.split('.').pop(),
          },
      ],
      entity_id: 'TP_DOC_VOCR',
      fileObject: file,
      component_type: component?.component_type,
  });
};
  const handleFileInputChange = (event) => {
    handleFile(event.target.files[0]);
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files[0]);
  };

  const handleDeleteImage = () => {
    setUploadedDocument(null);
  };

  const handleDownloadFile = async () => {
    if (isTryIt) {
      if (uploadedDocument) {
       const downloadLink = document.createElement('a');
        downloadLink.href = uploadedDocument;
        downloadLink.download = uploadedFileName;
        downloadLink.click();
      }
    } else {
      try {
      axios.get(documentUrl, {
        responseType: 'blob',
      })
      .then((response) => {
        const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('Error downloading image:', error);
      });
    } catch (error) {
      console.error('Error downloading image:', error);
    }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const fileUploadStatusIcon = uploadedDocument && getFileAttachmentHeader(uploadedFileName, uploadedDocument, openPreviewModal, changeEyeIconVisibility, showIcon);
  const fileNameWithLink = (
    <div
      className={cx(
        BS.D_FLEX,
      )}
    >
      <div className={cx(gClasses.Ellipsis, gClasses.FTwo12)}>
        {/* {fileName} */}
        {uploadedFileName?.replace(new RegExp(`.${getExtensionFromFileName(uploadedFileName, true)}$`), '').replace(new RegExp(`.${getExtensionFromFileName(uploadedFileName)}$`), '')}
      </div>
      <div className={cx(gClasses.FTwo12)}>
        {`.${getExtensionFromFileName(uploadedFileName)}`}
      </div>
    </div>
  );
  const fileNameElement = (
    <div
      className={cx(
        gClasses.FTwo11GrayV53,
        cx(gClasses.Flex1, gClasses.Ellipsis, gClasses.P2),
      )}
      title={uploadedFileName}
    >
      {fileNameWithLink}
    </div>
  );

  deleteIconComponent = uploadedFileName ? (
    <div>
    <div
      onClick={handleDeleteImage}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && handleDeleteImage()}
    >
      <div className={styles.DownloadDeleteIconContainer}>
        <DeleteIconV2
          ariaLabel={GET_INPUT_TYPES_STRINGS(t).DELETE_FILE}
          className={cx(gClasses.CursorPointer, styles.DeleteIcon)}
          // role={ARIA_ROLES.IMG}
          title={GET_INPUT_TYPES_STRINGS(t).DELETE_FILE}
        />
      </div>
    </div>
    </div>
  ) : null;
  downLoadIconComonent = uploadedFileName ? (
    <div
      className={cx(gClasses.CursorPointer)}
      onClick={handleDownloadFile}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && handleDownloadFile()}
    >
      <div className={styles.DownloadDeleteIconContainer}>
        <DownloadIconV2
          stroke="#959BA3"
          strokeWidth="25"
          // role={ARIA_ROLES.IMG}
          ariaHidden
          ariaLabel={GET_INPUT_TYPES_STRINGS(t).DOWNLOAD_FILE}
          title={GET_INPUT_TYPES_STRINGS(t).DOWNLOAD_FILE}
          className={styles.DownloadIcon}
        />
      </div>
    </div>
  ) : null;

  return (
    <div>
      {isTryIt ? (
        <div>
          {!uploadedDocument ? (
            <div>
            <div
              onDragOver={handleDragOver}
              onDrop={handleFileDrop}
              className={cx(styles.FileUploadClass, gClasses.FontWeight400, errorBody?.errorList?.Document && gClasses.ErrorInputBorder)}
            >
              <UploadIcon fillColor={COLOUR_CODES.GRAY_V87} />
              <div className={cx(BS.D_FLEX, BS.JC_CENTER)}>

                <p className={gClasses.PL5}>Drag and Drop files here</p>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label
                  id="text"
                  htmlFor="fileInput"
                  className={styles.FileUploadText}
                >
                  Choose File
                </label>
              </div>
              <input
                type="file"
                accept={IMAGE_UPLOAD_EXTENSION}
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
                id="fileInput"
              />
            </div>
            <ErrorMessage errorMessage={errorBody?.errorList?.Document} className={gClasses.PY4} />
            <div className={cx(BS.D_FLEX)}>
                <Text
                  className={styles.TextStyle1}
                  content={GET_INPUT_TYPES_STRINGS(t).SUPPORTED_FORMATS}
                  size={ETextSize.SM}
                />

                <Tag className={cx(gClasses.FontWeight500, styles.SupportedFileStyles)}>
                  {supported_file_formats}
                </Tag>
            </div>
            </div>
          ) : (
            <div className={cx(styles.NameIconComponent)}>
              <div className={BS.D_FLEX}>
                <div className={cx(styles.IconContainer)}>
                  {fileUploadStatusIcon}
                </div>
                <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.CenterVH, styles.NameContainer)}>
                  <div style={{ maxWidth: '65%' }} className={gClasses.PL5}>
                    {fileNameElement}
                  </div>
                  <div className={cx(BS.D_FLEX, BS.JC_START, gClasses.MR15, BS.P_RELATIVE)}>
                    <div className={styles.Margin}>{downLoadIconComonent}</div>
                    <div className={cx(gClasses.ML10)}>
                      {deleteIconComponent}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          )}
        </div>
      ) : (
        <>
          <Text
            alignment="left"
            content="File"
            size="lg"
            skeletonProps={{
              height: 16,
              width: 100,
            }}
            className={gClasses.MT6}
          />
          <div className={cx(BS.D_FLEX, styles.SampleFileContainer)}>
            {sampleFileDetails}
            <div>
              <Text
                content={uploadedFileName}
                size={ETextSize.SM}
                className={styles.TextStyle}
              />
              <div className={cx(BS.D_FLEX)}>
                <Text
                  className={cx(styles.TextStyle1, gClasses.PL10)}
                  content={GET_INPUT_TYPES_STRINGS(t).SUPPORTED_FORMATS}
                  size={ETextSize.SM}
                />

                <Tag className={cx(gClasses.FontWeight500, styles.SupportedFileStyles)}>
                  {supported_file_formats}
                </Tag>
              </div>
            </div>
          </div>
        </>
      )}
      <FilePreview
        isOpen={isOpenModal}
        fileUrl={isTryIt ? uploadedDocument : documentUrl}
        filetype={getExtensionFromFileName(uploadedFileName)}
        fileName={isTryIt ? uploadedFileName : filename}
        fileDetail={{
          filename: isTryIt ? uploadedFileName : filename,
          status: 2,
          url: isTryIt ? uploadedDocument : documentUrl,
          type: getExtensionFromFileName(uploadedFileName),
        }}
        fileDownloadUrl={isTryIt ? uploadedDocument : documentUrl}
        onCloseFile={() => {
          setIsOpenModal(false);
        }}
        fileDownload={handleDownloadFile}
        withCredentials={false}
      />
    </div>
  );
}

export default FileUploadComponent;
