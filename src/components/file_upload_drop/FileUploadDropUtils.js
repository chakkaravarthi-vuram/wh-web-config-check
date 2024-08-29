/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import cx from 'classnames/bind';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import FileIcon from 'assets/icons/FileIcon';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
// import jsUtils from 'utils/jsUtility';
import VideoIcon from 'assets/icons/VideoIcon';
import NoViewIcon from 'assets/icons/NoViewIcon';
import EyeIcon from 'assets/icons/EyeIcon';
// import UserImage from 'components/user_image/UserImage';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import styles from './FileUploadDrop.module.scss';

export const getFileTypeForIcon = (type = EMPTY_STRING) => {
    const documentFileTypes = ['pdf']; // removing 'csv', 'xlsx' as part of ETF-5360.
    const imageFileTypes = ['jpg', 'jpeg', 'bmp', 'png', 'ico'];
    const videoFileTypes = ['mp4'];
    if (documentFileTypes.includes(type) || documentFileTypes.includes(type?.toLowerCase())) return 1;
    else if (imageFileTypes.includes(type) || imageFileTypes.includes(type?.toLowerCase())) return 2;
    else if (videoFileTypes.includes(type) || videoFileTypes.includes(type?.toLowerCase())) return 3;
    else return 0;
};

export const getFileAttachmentHeader = (fileDetail, openPreview, fileLinkUrl, props, showIcon, changeEyeIconVisibility, currentFileIndex) => {
  // const { userDetails, profile_pic, isLoading, nonEditable, hideUserImage } = props;
    const fileType = getFileTypeForIcon(fileDetail.type);
    return (
    <>
    <div
      className={cx(styles.FileIcon, fileType !== 0 ? gClasses.CursorPointer : null)}
      onClick={fileType !== 0 ? openPreview : null}
      onMouseOut={() => changeEyeIconVisibility(false, currentFileIndex)}
      onMouseOver={() => changeEyeIconVisibility(true, currentFileIndex)}
      style={showIcon ? { backgroundColor: 'black', opacity: 0.7 } : null}
      onFocus={() => {}}
      onBlur={() => {}}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && fileType !== 0 ? openPreview : null}
      aria-label="show file"
      role="button"
      tabIndex={-1}
    >
            {fileType === 1 ?
            (
            <>
            <FileIcon
            className={cx(gClasses.CursorPointer, gClasses.ClickableElement, styles.Icon)}
            role={ARIA_ROLES.IMG}
            title={`View ${fileDetail.name}`}
            />
            {showIcon ?
              (
              <EyeIcon
              className={styles.EyeIcon}
              />
              ) : null
            }
            </>
            ) : null
            }
            {fileType === 2 ?
            (
            <>
            <img
              className={cx(BS.W100, styles.ImageIcon, gClasses.CursorPointer, gClasses.ClickableElement)}
              src={fileLinkUrl || fileDetail.url}
              alt={EMPTY_STRING}
              onMouseOut={() => changeEyeIconVisibility(false, currentFileIndex)}
              onMouseOver={() => changeEyeIconVisibility(true, currentFileIndex)}
              onFocus={() => {}}
              onBlur={() => {}}
            />
            {showIcon ?
              (
                <EyeIcon className={styles.VideoHoverIcon} />
                ) : null
            }
            </>
            ) : null
            }
            {fileType === 3 ?
            (
            <>
            <video
              className={cx(BS.W100, gClasses.CursorPointer, styles.ImageIcon, gClasses.ClickableElement, gClasses.CenterVH)}
              src={`${fileLinkUrl}#t=5`}
              alt={EMPTY_STRING}
            />
            {showIcon ?
              (
                <VideoIcon className={cx(styles.VideoIcon, gClasses.CursorPointer, gClasses.ClickableElement)} />
                ) : null
            }
            </>
            ) : null
            }
            {fileType === 0 ?
            (
            <>
            <div className={cx(styles.Unsupported)} />
            <NoViewIcon className={styles.VideoHoverIcon} />
            </>
            ) : null
            }
    </div>
    {/* <div className={cx(gClasses.CenterVH, styles.FileDetails)}>
        {!hideUserImage && (
          <UserImage
                src={!nonEditable ? !jsUtils.isNull(profile_pic) ? profile_pic : userDetails.profile_pic : userDetails.profile_pic}
                className={cx(styles.UserImage)}
                firstName={userDetails.first_name}
                lastName={userDetails.last_name}
                isDataLoading={isLoading}
          />
        )}
    </div> */}
    </>
    );
};

export default getFileTypeForIcon;
