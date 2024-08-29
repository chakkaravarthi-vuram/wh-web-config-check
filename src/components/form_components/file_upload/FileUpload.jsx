/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import AttachFileIcon from 'assets/icons/AttachFileIcon';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { STEP_CARD_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import Label from '../label/Label';
import HelperMessage, { HELPER_MESSAGE_TYPE } from '../helper_message/HelperMessage';

import styles from './FileUpload.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { EMPTY_STRING, SPACE } from '../../../utils/strings/CommonStrings';
import jsUtils, { isEmpty } from '../../../utils/jsUtility';
import { INPUT_TYPES, BS, ARIA_ROLES } from '../../../utils/UIConstants';
import { IMAGE_EXTENSIONS, DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES, FORM_POPOVER_STATUS } from '../../../utils/Constants';
import { getExtensionFromFileName } from '../../../utils/generatorUtils';
import FileUploadProgress from '../file_upload_progress/FileUploadProgress';
import FILE_UPLOAD_FIELD_STRINGS from './FileUpload.strings';
import { isSvgContentSuspicious, showToastPopover } from '../../../utils/UtilityFunctions';

function FileUpload(props) {
  const { t } = useTranslation();
  const {
    label,
    message,
    errorMessage,
    id,
    fileName,
    hideMessage,
    hideLabel,
    className,
    addFile,
    allowed_extensions,
    maximum_file_size,
    // setBorder,
    readOnly = false,
    disabled = false,
    isRequired,
    helperTooltipMessage,
    helperToolTipId,
    instructionMessage,
    isCreationField,
    containerClass,
    editIcon,
    deleteIcon,
    labelClass,
    fieldTypeInstruction,
    instructionClassName,
    referenceName,
    onDeleteClick,
    onRetryClick,
    isMultiple = false,
    creationView = false,
    isEmailAttachments = false,
    uploadIcon = null,
    innerClassName,
    attachmentTooltip,
    exceedFileSize,
    userProfile,
  } = props;
  const [documentCount, setDocumentCount] = useState(1);
  const [invalidFileTypeList, setInvalidFileTypeList] = useState([]);
  const [invalidFileSizeList, setInvalidFileSizeList] = useState([]);
  const [fileWithSvgError, setFileWithSvgError] = useState([]);
  const [invalidFileError, setInvalidFileError] = useState(EMPTY_STRING);
  const [onFileDragOver, setFileDragOver] = useState(false);
  useEffect(() => {
    console.log('tablerow111tablerow111tablerow111', fileName);
    fileName && fileName.length > 0 && jsUtils.isArray(fileName) && setDocumentCount(fileName.length);
  }, [fileName]);
  useEffect(() => {
    if (!jsUtils.isUndefined(exceedFileSize)) setInvalidFileSizeList(exceedFileSize);
  }, [exceedFileSize, onDeleteClick]);

  const messageId = `${id}upload_helper_message`;
  const ariaLabelledBy = `${id}upload${!hideMessage ? SPACE + messageId : EMPTY_STRING}`;
  let fileMessage = null;
  if (errorMessage) {
    fileMessage = errorMessage;
  } else if (message) {
    fileMessage = message;
  }
  let labelComponent = null;
  if (!hideLabel) {
    labelComponent = (
      <>
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
          <Label
            content={label}
            labelFor={id}
            isRequired={isRequired}
            message={helperTooltipMessage}
            toolTipId={helperToolTipId}
            labelFontClass={labelClass}
            formFieldBottomMargin
            hideLabelClass
          />
          {(fieldTypeInstruction || editIcon || deleteIcon) ? (
            <div className={cx(gClasses.CenterV, gClasses.Height24)}>
              {fieldTypeInstruction}
            </div>
          ) : null}
        </div>
        {!isEmpty(attachmentTooltip) && (
          <div className={styles.Tooltip}>{attachmentTooltip}</div>
        )}
      </>
    );
  }

  const onDragLeaveCheck = (ev) => {
    console.log('onDragLeaveCheck', ev);
    if (!readOnly && !disabled) {
      setFileDragOver(false);
    }
  };

  const dragOverHandler = (ev) => {
    ev.preventDefault();
    if (!readOnly && !disabled) {
      setFileDragOver(true);
    }
  };

  const recursiveFunc = async (filess, currentIndex, totalLength, entityId, currentFilesLength, invalidFileType, invalidFileSize, callNextFile = false, isMultiple, currentFileIndex, fileRefUuid) => {
    const file = filess[currentIndex];
    const index = currentIndex;
    const reader = new FileReader();
    if (index === totalLength) {
      return null;
    }
    if (file) {
      // const mimeTypeStatus = await isValidMimeType(file);
      // if (!mimeTypeStatus) invalidFileType.push(file.name);
      if (maximum_file_size) {
        if (file.size > maximum_file_size * DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES) {
          invalidFileSize.push(file.name);
          // return;
        }
      } else if (file.size > DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES) {
        invalidFileSize.push(file.name);
        // return;
      }
      if (!jsUtils.isEmpty(allowed_extensions)) {
        if (!jsUtils.includes(allowed_extensions, getExtensionFromFileName(file.name, true))) {
          invalidFileType.push(file.name);
          // return;
        }
      } else {
        const imageExtensions = [];
        IMAGE_EXTENSIONS.forEach((extension) => {
          if (userProfile && userProfile.allowed_extensions && userProfile.allowed_extensions.includes(extension)) imageExtensions.push(extension);
        });
        if (!jsUtils.includes(imageExtensions, getExtensionFromFileName(file.name, true))) {
          invalidFileType.push(file.name);
          // return;
        }
      }
    }
    const isSafeSvg = await isSvgContentSuspicious(file, window, t, false);
    if (!isSafeSvg) setFileWithSvgError(fileWithSvgError.push(file.name));
    if (currentIndex === filess.length - 1 && !isEmpty(fileWithSvgError)) {
      showToastPopover(t('user_settings_strings.file_upload_failed'), `${t('user_settings_strings.suspicious_file_found')} in ${fileWithSvgError.join(', ')}.`, FORM_POPOVER_STATUS.SERVER_ERROR, true);
    }
    if ((jsUtils.isEmpty(invalidFileType) && jsUtils.isEmpty(invalidFileSize) && isSafeSvg) ||
      (callNextFile && !invalidFileType.includes(file.name) && !invalidFileSize.includes(file.name) && isSafeSvg)) {
      reader.onloadend = async () => {
        const fileObject = {
          fileName: file.name,
          file,
        };
        if (!callNextFile) {
          invalidFileType = [];
          invalidFileSize = [];
          setInvalidFileTypeList(invalidFileType);
          invalidFileSize.concat(setInvalidFileSizeList);
          setInvalidFileSizeList(invalidFileSize);
        } else {
          setInvalidFileTypeList(invalidFileType);
          invalidFileSize.concat(setInvalidFileSizeList);
          setInvalidFileSizeList(invalidFileSize);
        }
        const files = [];
        files[0] = {
          ...fileObject,
          localFileURL: URL.createObjectURL(file),
        };
        const multipleFile = {
          files,
          index: currentFilesLength + currentFileIndex,
        };
        console.log('fileObject', currentFileIndex, multipleFile);
        await addFile(multipleFile, filess, currentIndex, totalLength, recursiveFunc, entityId, currentFilesLength, invalidFileType, invalidFileSize, isMultiple, currentFileIndex, fileRefUuid);
      };
      if (file != null) {
        reader.readAsDataURL(file);
      }
    } else {
      console.log('readerloadend1', currentIndex, filess, invalidFileType, entityId);
      setInvalidFileTypeList(invalidFileType);
      invalidFileSize.concat(setInvalidFileSizeList);
      setInvalidFileSizeList(invalidFileSize);
      if (currentIndex < filess.length - 1) {
        recursiveFunc(filess, currentIndex + 1, filess.length, entityId, currentFilesLength, invalidFileType, invalidFileSize, true, isMultiple, currentFileIndex);
      }
    }
    return null;
  };

  const dropHandler = async (ev) => {
    ev.preventDefault();
    if (!readOnly && !disabled) {
      const fileList = ev.dataTransfer ? ev.dataTransfer.files : ev.target.files;
      const filess = Object.values(fileList);
      console.log('fiesss', filess, fileList, fileName, id, ev);
      if (filess.length === 0 || (filess[0] && filess[0].size === 0)) {
        setInvalidFileError('The file attached is 0 bytes, so it cannot be uploaded');
      } else {
        recursiveFunc(filess, 0, filess.length, null, fileName.length, [], [], false, isMultiple, 0);
      }
    }
  };

  const keydownFileUpload = () => {
    document.getElementById(`${id}upload`).click();
  };

  const onDeleteFile = async (fileId, fileIndex) => {
    setInvalidFileSizeList([]);
    setInvalidFileTypeList([]);
    !readOnly && await onDeleteClick(
      fileId,
      fileIndex,
    );
  };

  const getFileComponent = (documentCount) => {
    const fileComponent = [];
    console.log('fileNamefileNamefileName', documentCount, fileName, readOnly);
    Array(documentCount).fill().forEach((element, index) => {
      fileComponent.push(
        <div className={styles.ExistingFile}>
          <FileUploadProgress
            files={[fileName && fileName[index]]}
            onDeleteClick={(fileId, fileIndex) => {
              onDeleteFile(fileId, fileIndex);
            }}
            onRetryClick={(fileId, fileIndex) => {
              setInvalidFileSizeList([]);
              setInvalidFileSizeList([]);
              !readOnly && onRetryClick(
                fileId,
                fileIndex,
              );
            }}
            hideLabel={hideLabel}
            fileIndex={index}
            isEmailAttachments={isEmailAttachments}
            readOnly={readOnly}
          />
        </div>,
      );
    });
    return fileComponent;
  };
  console.log('fileupload id', id, invalidFileSizeList, invalidFileTypeList, invalidFileError);
  return (
    <div className={className}>
      {!creationView && !readOnly && !disabled &&
        (
          <input
            disabled={readOnly}
            id={`${id}upload`}
            type={INPUT_TYPES.FILE}
            className={cx(styles.CreateForm, gClasses.CursorPointer, BS.INVISIBLE, BS.D_NONE)}
            // id={id}
            onChange={dropHandler}
            accept={IMAGE_EXTENSIONS}
            value=""
            ui-auto={referenceName}
            multiple={isMultiple}
          />
        )}
      {labelComponent}
      <div id={id}>
        <div
          className={cx(
            styles.AddAttachments,
          )}
        >
          {fileName && fileName.length > 0 && !disabled && getFileComponent(documentCount)}
          {(!(!isMultiple && fileName.length > 0) || (disabled)) ?
            (
              <div
                className={cx(
                  (readOnly || disabled || onFileDragOver) && gClasses.ReadOnlyBg,
                  styles.NewFile,
                  containerClass,
                  isCreationField && gClasses.MB0,
                  fileName.length > 0 && !disabled && gClasses.MT10,
                  (isEmailAttachments) && innerClassName,
                  (!jsUtils.isEmpty(errorMessage) || !jsUtils.isEmpty(invalidFileTypeList) || !jsUtils.isEmpty(invalidFileSizeList)) && gClasses.ErrorInputDashedBorderImp,
                )}
                onDrop={dropHandler}
                onDragOver={dragOverHandler}
                onDragLeave={onDragLeaveCheck}
                onMouseLeave={onDragLeaveCheck}
              >
                <div className={cx(gClasses.CenterV, !isEmailAttachments && BS.JC_CENTER)} id={id}>
                  <label htmlFor={id} id={id} className={gClasses.MB0}>
                    {uploadIcon ||
                      <AttachFileIcon title={FILE_UPLOAD_FIELD_STRINGS.ATTACH_NEW_FILE} role={ARIA_ROLES.IMG} />}
                  </label>
                  <label htmlFor={!hideMessage ? id : `${id}upload`} className={cx(gClasses.FTwo13GrayV9, gClasses.ML5, gClasses.MT3, gClasses.FontWeight400, gClasses.MB0)}>
                    {STEP_CARD_STRINGS(t).DRAG_AND_DROP}
                    {' '}
                    <label
                      htmlFor={`${id}upload`}
                      id={id}
                      className={cx(styles.CreateForm, !creationView && !readOnly && !disabled && gClasses.CursorPointer, gClasses.FontWeight500, gClasses.MB0)}
                    >
                      <div
                        tabIndex={disabled || readOnly ? -1 : 0}
                        aria-labelledby={!hideMessage ? ariaLabelledBy : null}
                        role="button"
                        onKeyDown={(e) => { keydownOrKeypessEnterHandle(e) && keydownFileUpload(); }}
                      >
                        {STEP_CARD_STRINGS(t).CHOOSE_FILE}
                      </div>
                    </label>
                  </label>
                </div>
              </div>
            ) : null}
          {instructionMessage &&
            <div className={cx(gClasses.FontStyleNormal, gClasses.MT5, !instructionClassName && gClasses.Fone12GrayV4, gClasses.WordWrap, instructionClassName)}>
              {instructionMessage}
            </div>
          }
          {hideMessage ? null : (
            <div className={gClasses.MT5}>
              <HelperMessage id={messageId} message={fileMessage} type={HELPER_MESSAGE_TYPE.ERROR} />
            </div>
          )}
          {!jsUtils.isEmpty(invalidFileError) && (
            <div className={gClasses.MT5}>
              <HelperMessage id={messageId} message={invalidFileError} type={HELPER_MESSAGE_TYPE.ERROR} />
            </div>
          )}
          {!jsUtils.isEmpty(invalidFileTypeList) && (
            <div className={gClasses.MT5}>
              <HelperMessage id={messageId} message={`${invalidFileTypeList.toString()} ${invalidFileTypeList.length === 1 ? t(FILE_UPLOAD_FIELD_STRINGS.IS) : t(FILE_UPLOAD_FIELD_STRINGS.ARE)} ${t(FILE_UPLOAD_FIELD_STRINGS.INVALID_FILE)} ${invalidFileTypeList.length === 1 ? t(FILE_UPLOAD_FIELD_STRINGS.TYPE) : t(FILE_UPLOAD_FIELD_STRINGS.TYPES)}`} type={HELPER_MESSAGE_TYPE.ERROR} />
            </div>
          )}
          {!jsUtils.isEmpty(invalidFileSizeList) && (
            <div className={gClasses.MT5}>
              <HelperMessage id={messageId} message={`${invalidFileSizeList.toString()} ${t(FILE_UPLOAD_FIELD_STRINGS.EXCEED_MAXIMUM_SIZE)}`} type={HELPER_MESSAGE_TYPE.ERROR} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default FileUpload;

FileUpload.propTypes = {
  uploadText: PropTypes.string,
  label: PropTypes.string,
  message: PropTypes.string,
  id: PropTypes.string.isRequired,
  addFile: PropTypes.func.isRequired,
  fileName: PropTypes.string,
  hideMessage: PropTypes.bool,
  hideLabel: PropTypes.bool,
  errorMessage: PropTypes.string,
  className: PropTypes.string,
  setBorder: PropTypes.bool,
  isRequired: PropTypes.bool,
  editIcon: PropTypes.element,
  deleteIcon: PropTypes.element,
  labelClass: PropTypes.element,
  instructionClassName: PropTypes.string,
  attachmentTooltip: PropTypes.string,
  uploadIcon: PropTypes.element,
};

FileUpload.defaultProps = {
  uploadText: 'Upload',
  label: EMPTY_STRING,
  message: EMPTY_STRING,
  errorMessage: EMPTY_STRING,
  fileName: EMPTY_STRING,
  hideMessage: false,
  hideLabel: false,
  className: EMPTY_STRING,
  setBorder: false,
  isRequired: false,
  editIcon: null,
  deleteIcon: null,
  labelClass: null,
  instructionClassName: EMPTY_STRING,
  attachmentTooltip: EMPTY_STRING,
  uploadIcon: null,
};
