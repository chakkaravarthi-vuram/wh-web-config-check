import { FileUploader } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useContext, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import FilePreview from '../../file_preview/FileViewer';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { getExtensionFromFileName } from '../../../utils/generatorUtils';
import { FILE_UPLOAD_STATUS, FORM_POPOVER_STATUS } from '../../../utils/Constants';
import { isEmpty } from '../../../utils/jsUtility';
import FILE_UPLOAD_FIELD_STRINGS from '../file_upload/FileUpload.strings';
import ThemeContext from '../../../hoc/ThemeContext';
import { isBasicUserMode, isSvgContentSuspicious, showToastPopover } from '../../../utils/UtilityFunctions';

function DocumentUpload(props) {
  const {
    id,
    label,
    labelClassName,
    fileNameClass,
    placeholder,
    required,
    helperText,
    helpTooltip,
    errorMessage = EMPTY_STRING,
    disabled,
    isDragDrop,
    isMultiple,
    fontScheme,
    uploadedFiles = [],
    onRetryClick,
    onDeleteClick,
    allowedExtensions = [],
    maximumFileSize,
    addFile,
    errorVariant,
    isLoading,
    referenceName,
    readOnly,
  } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const [fileErrors, setFileErrors] = useState([]);
  // const [fileWithSvgError, setFileWithSvgError] = useState([]);
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const isNormalMode = isBasicUserMode(history);
  const [previewModalData, setPreviewModalData] = useState({});
  // const { t } = useTranslation();

  const handleFileChange = async (files) => {
    const validFiles = [];
    const fileWithSvgError = [];
    for (let i = 0; i <= files.length - 1; i++) {
      // eslint-disable-next-line no-await-in-loop
      const isSafeSvg = await isSvgContentSuspicious(files?.[i]?.file, window, t, false);
      if (!isSafeSvg) fileWithSvgError.push(files?.[i]?.file?.name);
      if (!files[i].hasError && isSafeSvg) {
        validFiles.push({
          file: files[i]?.file,
        });
      }
      if (i === files.length - 1 && !isEmpty(validFiles)) {
        addFile(validFiles);
      }
      if (i === files.length - 1 && !isEmpty(fileWithSvgError)) {
        showToastPopover(t('user_settings_strings.file_upload_failed'), `${t('user_settings_strings.suspicious_file_found')} in ${fileWithSvgError.join(', ')}.`, FORM_POPOVER_STATUS.SERVER_ERROR, true);
      }
    }
  };

  const handleFileDelete = (index) => {
    const deleteFileDetails = uploadedFiles?.[index];
    onDeleteClick(index, deleteFileDetails?.documentId || deleteFileDetails?.id);
  };

  const downloadFile = () => {
    if (!(previewModalData?.url)) return;
    if (previewModalData?.url) {
      window.open(`${previewModalData?.url}&is_download=true`, '_blank');
    }
  };

  const openFilePreview = (_file, index) => {
    const selectedFile = (uploadedFiles?.[index] || {});
    setPreviewModalData({
      name: selectedFile?.file?.name,
      fileName: selectedFile?.file?.name,
      size: selectedFile?.file?.size,
      url: selectedFile?.thumbnail,
    });
  };

  return (
    <>
    {!isEmpty(previewModalData) && (
      <FilePreview
        fileName={previewModalData?.name?.replace(new RegExp(`.${getExtensionFromFileName(previewModalData?.name, true)}$`), '').replace(new RegExp(`.${getExtensionFromFileName(previewModalData?.name)}$`), '')}
        fileUrl={previewModalData?.url}
        fileDetail={previewModalData}
        isOpen
        filetype={getExtensionFromFileName(previewModalData?.name)?.toLowerCase()}
        isLoading={false}
        fileDownload={previewModalData?.status !== FILE_UPLOAD_STATUS.LOCAL_FILE ? downloadFile : null}
        onCloseFile={() => setPreviewModalData({})}
      />
    )}
    <FileUploader
      id={id}
      label={label}
      labelClassName={labelClassName}
      fileNameClass={fileNameClass}
      placeholder={placeholder}
      required={required}
      helperText={helperText}
      helpTooltip={helpTooltip}
      errorMessage={errorMessage}
      errorVariant={errorVariant}
      disabled={disabled}
      useDragAndDrop={isDragDrop}
      allowMultiple={isMultiple}
      fontScheme={fontScheme}
      selectedFiles={uploadedFiles}
      // in case of uploading multiple files highlight files with errors
      filesWithErrors={fileErrors}
      // a callback function of each file to check the image type, file size etc
      onRetryClick={onRetryClick}
      onDeleteClick={handleFileDelete}
      // files comes in array format as it handles both common file uploads and multiple file uploads
      sendFiles={(files) => handleFileChange(files)}
      sendErrorsinFiles={(file_errors) => setFileErrors(file_errors)}
      allowedFileExtensions={allowedExtensions}
      maximumFileSize={maximumFileSize}
      isLoading={isLoading}
      openFilePreview={openFilePreview}
      referenceName={referenceName}
      readOnly={readOnly}
      maxFileTypeMultipleValdiationString={`${t(FILE_UPLOAD_FIELD_STRINGS.ARE)} ${t(FILE_UPLOAD_FIELD_STRINGS.INVALID_FILE)} ${t(FILE_UPLOAD_FIELD_STRINGS.TYPES)}`}
      maxFileTypeSingleValdiationString={`${t(FILE_UPLOAD_FIELD_STRINGS.IS)} ${t(FILE_UPLOAD_FIELD_STRINGS.INVALID_FILE)} ${t(FILE_UPLOAD_FIELD_STRINGS.TYPE)}`}
      allowedFileSizeValdiationString={`${t(FILE_UPLOAD_FIELD_STRINGS.EXCEED_MAXIMUM_SIZE)}`}
      colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
    />
    </>
  );
}

export default DocumentUpload;
