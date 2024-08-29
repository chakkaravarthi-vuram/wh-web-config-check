/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import FileIcon from 'assets/icons/FileIcon';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { getExtensionFromFileName } from 'utils/generatorUtils';
import StandardFileIcon from 'assets/icons/StandardFileIcon';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import EyeIcon from 'assets/icons/EyeIcon';
import NoViewIcon from 'assets/icons/NoViewIcon';
import { ARIA_ROLES } from 'utils/UIConstants';
import styles from './FileUploadProgress.module.scss';

const FILE_TYPE = {
  DOCUMENT_TYPES: ['pdf'], // removing 'csv', 'xlsx', 'docs', 'docx', 'doc' as part of ETF-5360.
  IMAGE_TYPES: ['jpg', 'jpeg', 'bmp', 'png', 'PNG', 'ico'],
  VIDEO_TYPES: ['mp4'],
};

const ARIA_LABEL = {
  FILE: 'file',
  NO_VIEW: 'No view',
};

export const getFileTypeForIcon = (type = EMPTY_STRING) => {
  const documentFileTypes = FILE_TYPE.DOCUMENT_TYPES;
  const imageFileTypes = FILE_TYPE.IMAGE_TYPES;
  const videoFileTypes = FILE_TYPE.VIDEO_TYPES;
  if (documentFileTypes.includes(type) || documentFileTypes.includes(type?.toLowerCase())) return 1;
  else if (imageFileTypes.includes(type) || imageFileTypes.includes(type?.toLowerCase())) return 2;
  else if (videoFileTypes.includes(type) || videoFileTypes.includes(type?.toLowerCase())) return 3;
  else return 0;
};

export const getFileTypeForPreview = (type = EMPTY_STRING) => {
  const documentFileTypes = FILE_TYPE.DOCUMENT_TYPES;
  const imageFileTypes = FILE_TYPE.IMAGE_TYPES;
  const videoFileTypes = FILE_TYPE.VIDEO_TYPES;
  if (documentFileTypes.includes(type) || documentFileTypes.includes(type?.toLowerCase())) return 1;
  else if (imageFileTypes.includes(type) || imageFileTypes.includes(type?.toLowerCase())) return 2;
  else if (videoFileTypes.includes(type) || videoFileTypes.includes(type?.toLowerCase())) return 3;
  else return 0;
};

export const getFileAttachmentHeader = (fileName, fileLinkUrl, openPreviewModal, changeEyeIconVisibility, showIcon) => {
    const filePreviewType = fileName && getFileTypeForPreview(getExtensionFromFileName(fileName));
    console.log('fileType', fileLinkUrl);
    return (
        <div
        className={cx(styles.Thumbnail, gClasses.CursorPointer)}
        onClick={filePreviewType !== 0 && openPreviewModal}
        onFocus={() => {}}
        onBlur={() => {}}
        onMouseOut={() => changeEyeIconVisibility(false)}
        onMouseOver={() => changeEyeIconVisibility(true)}
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && (filePreviewType !== 0) && openPreviewModal}
        role="button"
        tabIndex={-1}
        >
            {filePreviewType === 1 ?
            (
            <>
            <FileIcon
            className={cx(styles.Icon, gClasses.CursorPointer)}
            onClick={openPreviewModal}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && openPreviewModal()}
            />
            {showIcon && (
            <EyeIcon
              className={styles.EyeIcon}
            />
            )}
            </>
            ) : null
            }
            {filePreviewType === 2 ?
            (
            <>
            <img
              className={cx(styles.ImageIcon, gClasses.CursorPointer, gClasses.ClickableElement)}
              src={fileLinkUrl}
              alt={EMPTY_STRING}
              onFocus={() => {}}
              onBlur={() => {}}
            />
            {showIcon && (
            <EyeIcon
              className={styles.EyeIcon}
            />
            )}
            </>
            ) : null
            }
            {filePreviewType === 3 ?
            (
            <>
            <video
              className={cx(styles.ImageIcon, gClasses.CursorPointer, gClasses.ClickableElement)}
              src={`${fileLinkUrl}#t=5`}
              alt={EMPTY_STRING}
            />
            {showIcon && (
            <EyeIcon
              className={styles.EyeIcon}
            />
            )}
            </>
            ) : null
            }
            {filePreviewType === 0 ?
            (
            <>
            <div className={styles.Container}>
            <StandardFileIcon role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.FILE} className={styles.StandardFileIcon} />
            </div>
            <NoViewIcon role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.NO_VIEW} className={styles.VideoHoverIcon} />
            </>
            ) : null
            }
        </div>
    );
};

export default getFileTypeForIcon;
