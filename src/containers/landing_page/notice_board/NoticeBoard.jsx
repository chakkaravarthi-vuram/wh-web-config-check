import React from 'react';
import cx from 'classnames/bind';
import Image from 'components/form_components/image/Image';
import gClasses from 'scss/Typography.module.scss';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import { getUserProfileData } from 'utils/UtilityFunctions';
import { NOTICE_BOARD_COVER_TYPE } from 'utils/Constants';
import styles from './NoticeBoard.module.scss';

function NoticeBoard(props) {
  const { showCover, onCloseClick } = props;
  const profile = getUserProfileData();
  const { cover_type, cover_message, cover_color, acc_cover_pic } =
    profile;
  let content = null;
  if (showCover) {
    const closeButton = (
      <svg
        viewPort="0 0 12 12"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        className={cx(styles.CloseIcon, gClasses.CursorPointer)}
        onClick={onCloseClick}
        role={ARIA_ROLES.IMG}
      >
        <line x1="1" y1="11" x2="11" y2="1" />
        <line x1="1" y1="1" x2="11" y2="11" />
      </svg>
    );
    if (cover_type === NOTICE_BOARD_COVER_TYPE.PICTURE && acc_cover_pic) {
      content = (
        <div className={cx(BS.P_RELATIVE, styles.CoverBlock)}>
          {closeButton}
          <Image
            src={acc_cover_pic}
            className={cx(styles.CoverImage)}
            imageLoadHandler={() => {}}
          />
        </div>
      );
    } else if (
      cover_type === NOTICE_BOARD_COVER_TYPE.MESSAGE &&
      cover_message
    ) {
      content = (
        <div className={cx(BS.P_RELATIVE, styles.CoverBlock)}>
          {closeButton}
          <div
            className={cx(
              styles.CoverMessage,
              gClasses.LineHeightV3,
              gClasses.PX45,
              gClasses.CenterVH,
              styles.CoverBlock,
            )}
            style={{
              backgroundImage: `linear-gradient(${cover_color.degree}deg, ${cover_color.hex_codes[0]}, ${cover_color.hex_codes[1]})`,
            }}
          >
            <div className={cx(gClasses.FTwo18White)}>{cover_message}</div>
          </div>
        </div>
      );
    }
    content = (
      <div
        className={cx(
          cover_type === NOTICE_BOARD_COVER_TYPE.PICTURE && gClasses.CenterH,
          gClasses.MB20,
        )}
      >
        {content}
      </div>
    );
  }
  return content;
}

export default NoticeBoard;
