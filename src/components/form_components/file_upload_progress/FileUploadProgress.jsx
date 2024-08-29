import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';

import DownloadIconV2 from 'assets/icons/form_fields/DownloadIconV2';
import { getExtensionFromFileName } from 'utils/generatorUtils';
import FilePreview from 'components/file_preview/FileViewer';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import RetryIconV3 from 'assets/icons/form_fields/RetryIconV3';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import { FILE_UPLOAD_STATUS } from '../../../utils/Constants';
import gClasses from '../../../scss/Typography.module.scss';
import styles from './FileUploadProgress.module.scss';
import { isArray, isEmpty, get, isNull, has } from '../../../utils/jsUtility';
import UploadFailedIcon from '../../../assets/icons/file_upload/UploadFailedIcon';
import ReadOnlyText from '../read_only_text/ReadOnlyText';
import { getFileAttachmentHeader, getFileTypeForPreview, getFileTypeForIcon } from './FileUploadProgress.utils';
import ProgressBar from '../progress_bar/ProgressBar';

function FileUploadProgress(props) {
  const { className, files, onDeleteClick, onRetryClick, isCompletedForm, fileIndex = undefined, isEmailAttachments, readOnly = false } =
    props;
  let ModalContent = null;
  const [filePreviewUrl, setFilePreviewUrl] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  useEffect(() => {
    if (!(files && files[0] && files[0].url)) return;
    if (files && files[0] && files[0].url) {
      if (has(files, [0, 'localFileURL'])) {
        setFilePreviewUrl(files[0].localFileURL);
      } else {
        if (getFileTypeForIcon(getExtensionFromFileName(files[0].fileName)) === 2 ||
          getFileTypeForIcon(getExtensionFromFileName(files[0].fileName)) === 3) {
          setFilePreviewUrl(`${files[0].url}&is_download=false`);
        }
      }
    }
  }, [files && files[0] && files[0].url]);

  const downloadFile = () => {
    if (!(files && files[0] && files[0].url)) return;
    if (files && files[0] && files[0].url) {
      window.open(`${files[0].url}&is_download=true`, '_blank');
    }
  };

  const openPreviewModal = () => {
    if (get(files, [0, 'status']) === FILE_UPLOAD_STATUS.LOCAL_FILE) {
      setFilePreviewUrl(files?.[0]?.localFileURL);
    } else {
      if ((has(files, [0, 'localFileURL']) && !filePreviewUrl.includes('dms')) ||
        (getFileTypeForIcon(getExtensionFromFileName(files[0].fileName)) === 1 &&
          !has(files, [0, 'localFileURL']) && !filePreviewUrl.includes('dms'))
      ) {
        console.log('previewmodal url check', files, filePreviewUrl);
        setFilePreviewUrl(`${files[0].url}&is_download=false`);
      }
    }
    setIsOpenModal(true);
  };

  const onCloseFile = () => {
    setIsOpenModal(false);
  };

  const changeEyeIconVisibility = (visible) => {
    setShowIcon(visible);
  };

  const progressList =
    isArray(files) &&
    files
      .filter((file) => !isEmpty(file))
      .map((file) => {
        let retryButton = null;
        let deleteIconComponent = null;
        let progressBarComponent = null;
        let downLoadIconComonent = null;
        let fileUploadStatusIcon = null;
        if (file && file.status) {
          const fileName = get(file, 'file.name', '');
          ModalContent = (file.url && !isEmpty(file)) ?
            (
              <FilePreview
                fileName={fileName.replace(new RegExp(`.${getExtensionFromFileName(fileName, true)}$`), '').replace(new RegExp(`.${getExtensionFromFileName(fileName)}$`), '')}
                fileUrl={filePreviewUrl}
                fileDetail={file}
                isOpen={isOpenModal}
                filetype={getExtensionFromFileName(fileName).toLowerCase()}
                isLoading={false}
                fileDownload={file.status !== FILE_UPLOAD_STATUS.LOCAL_FILE ? downloadFile : null}
                onCloseFile={onCloseFile}
              />
            ) : null;
          switch (file.status) {
            case FILE_UPLOAD_STATUS.IN_PROGRESS:
              progressBarComponent = (
                <ProgressBar
                  className={cx(styles.ProgressBar, gClasses.Flex1)}
                  data={{ totalProgress: 100, progress: file.progress }}
                  hideSteps
                  hidePercentage
                />
              );
              fileUploadStatusIcon = getFileAttachmentHeader(file.fileName, filePreviewUrl, openPreviewModal, changeEyeIconVisibility, showIcon);
              break;
            case FILE_UPLOAD_STATUS.SUCCESS:
            case FILE_UPLOAD_STATUS.LOCAL_FILE:
              deleteIconComponent = onDeleteClick && !readOnly ? (
                <div
                  onClick={() => onDeleteClick(file.fileId, fileIndex)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onDeleteClick(file.fileId, fileIndex)}
                >
                  <div className={styles.DownloadDeleteIconContainer}>
                    <DeleteIconV2
                      ariaLabel="Delete file"
                      className={cx(gClasses.CursorPointer, styles.DeleteIcon)}
                      role={ARIA_ROLES.IMG}
                      title="Delete file"
                    />
                  </div>
                </div>
              ) : null;
              downLoadIconComonent = (file.status === FILE_UPLOAD_STATUS.SUCCESS && files[0].url) ? (
                <div
                  className={cx(gClasses.CursorPointer)}
                  onClick={downloadFile}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && downloadFile()}
                >
                  <div className={styles.DownloadDeleteIconContainer}>
                    <DownloadIconV2
                      stroke="#959BA3"
                      strokeWidth="25"
                      role={ARIA_ROLES.IMG}
                      ariaHidden
                      ariaLabel="Download"
                      title="Download"
                      className={styles.DownloadIcon}
                    />
                  </div>
                </div>
              ) : null;
              console.log('checkfile', file);
              fileUploadStatusIcon = getFileAttachmentHeader(file.fileName, filePreviewUrl, openPreviewModal, changeEyeIconVisibility, showIcon);
              break;
            case FILE_UPLOAD_STATUS.FAILURE:
              retryButton = onRetryClick ? (
                <div className={styles.DownloadDeleteIconContainer}>
                  <RetryIconV3
                    className={cx(gClasses.CursorPointer, styles.RetryIcon)}
                    onClick={() => onRetryClick(file.fileId, fileIndex)}
                    title="Retry"
                  />
                </div>
              ) : null;
              deleteIconComponent = onDeleteClick && !readOnly ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onDeleteClick(file.fileId, fileIndex)}
                  onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onDeleteClick(file.fileId, fileIndex)}
                >
                  <div className={styles.DownloadDeleteIconContainer}>
                    <DeleteIconV2
                      ariaLabel="Delete file"
                      className={cx(gClasses.CursorPointer, styles.DeleteIcon)}
                      role={ARIA_ROLES.IMG}
                      title="Delete file"
                    />
                  </div>
                </div>
              ) : null;
              fileUploadStatusIcon = (
                <div className={cx(styles.Icon, gClasses.CursorPointer, gClasses.PT3, gClasses.PL3)}>
                  <UploadFailedIcon title="Upload failed" />
                </div>
              );
              break;
            default:
              // textClass = styles.Inprogress;
              break;
          }
        }
        const fileName = get(file, 'file.name', '');
        const displayFileThumbnail = [FILE_UPLOAD_STATUS.SUCCESS, FILE_UPLOAD_STATUS.LOCAL_FILE].includes(file.status);
        const fileNameWithLink = (
          <div
            className={cx(
              BS.D_FLEX,
              { [styles.FileName]: displayFileThumbnail && getFileTypeForPreview(getExtensionFromFileName(file.fileName)) !== 0 })}
            onClick={getFileTypeForPreview(getExtensionFromFileName(file.fileName)) !== 0 && openPreviewModal}
            tabIndex={displayFileThumbnail ? 0 : -1}
            role="button"
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && getFileTypeForPreview(getExtensionFromFileName(file.fileName)) !== 0 && openPreviewModal}
          >
            <div className={cx(gClasses.Ellipsis, gClasses.FTwo12)}>
              {/* {fileName} */}
              {fileName.replace(new RegExp(`.${getExtensionFromFileName(fileName, true)}$`), '').replace(new RegExp(`.${getExtensionFromFileName(fileName)}$`), '')}
            </div>
            <div className={cx(gClasses.FTwo12)}>
              {`.${getExtensionFromFileName(fileName)}`}
            </div>
          </div>
        );
        const fileNameElement = (
          <div
            className={cx(
              isCompletedForm && cx(),
              gClasses.FTwo11GrayV53,
              cx(gClasses.Flex1, gClasses.Ellipsis, gClasses.P2),
            )}
            title={fileName}
          >
            {isEmailAttachments ? (
              <ReadOnlyText
                className={cx(gClasses.CenterVH, gClasses.MT5)}
                hideLabel
                id={file.url}
                value={file.file.name}
                hideMessage
                formFieldBottomMargin
                link={file.url}
                fileDetail={file.file}
                previewSize
                nonEditable
                file={file}
              />
            ) : (
              fileNameWithLink
            )}
          </div>
        );
        console.log('fileUploadStatusIcon', fileUploadStatusIcon, retryButton, downLoadIconComonent);
        return (
          <div className={cx(className)}>
            {ModalContent}
            <div className={cx(styles.NameIconComponent)}>
              <div className={BS.D_FLEX}>
                {
                  [FILE_UPLOAD_STATUS.SUCCESS,
                  FILE_UPLOAD_STATUS.LOCAL_FILE,
                  FILE_UPLOAD_STATUS.FAILURE,
                  FILE_UPLOAD_STATUS.IN_PROGRESS,
                  ].includes(file.status) ? (
                    <>
                      <div className={cx(styles.IconContainer)}>
                        {fileUploadStatusIcon}
                      </div>
                      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.CenterVH, styles.NameContainer)}>
                        <div style={{ maxWidth: '65%' }} className={gClasses.PL5}>
                          {fileNameElement}
                        </div>
                        <div className={cx(BS.D_FLEX, BS.JC_START, gClasses.MR15, BS.P_RELATIVE)}>
                          {/* {fileSizeComponent} */}
                          {progressBarComponent}
                          {retryButton}
                          <div className={!isNull(deleteIconComponent) && (!isNull(retryButton) || !isNull(downLoadIconComonent)) && styles.Margin}>{downLoadIconComonent}</div>
                          {onDeleteClick && (
                            <div className={cx(gClasses.ML10)}>
                              {(files[0].url || !isNull(retryButton)) && deleteIconComponent}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : null
                }
              </div>
            </div>
          </div>
        );
      });
  return <div className={className}>{progressList}</div>;
}
export default FileUploadProgress;
FileUploadProgress.defaultProps = {};
FileUploadProgress.propTypes = {};
