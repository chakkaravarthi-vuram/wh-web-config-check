import React from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';

import DownloadNotificationIcon from 'assets/icons/DownloadNotificationIcon';
import { downloadWindowDataChange } from 'redux/reducer/DownloadWindowReducer';
import getReportDownloadDocsThunk from 'redux/actions/DownloadWindow.Action';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';

import gClasses from 'scss/Typography.module.scss';
import styles from './DownloadNotification.module.scss';
import { DOWNLOAD_WINDOW_STRINGS } from '../../Download.strings';

function DownloadNotification(props) {
  const {
    download_list,
    isDownloadNotificationsModalOpen,
    onDownloadWindowDataChange,
  } = props;

  const downloadNotificationCreatedTotalCount =
    download_list?.filter(
      (objDownloadData) =>
        objDownloadData.status === DOWNLOAD_WINDOW_STRINGS.STATUS.CREATED,
    ).length;

  const toggleDownloadNotification = () => {
    onDownloadWindowDataChange(
      'isDownloadNotificationsModalOpen',
      !isDownloadNotificationsModalOpen,
    );
  };

  return (
    <div
      className={cx(
        gClasses.PR15,
        BS.D_FLEX,
        gClasses.PL20,
        styles.DownloadNotificationIconContainer,
      )}
      onClick={toggleDownloadNotification}
      role="button"
      tabIndex={0}
      aria-label="download"
      onKeyDown={(e) =>
        keydownOrKeypessEnterHandle(e) && toggleDownloadNotification()
      }
    >
      <DownloadNotificationIcon
        className={gClasses.CursorPointer}
        role={ARIA_ROLES.IMG}
      />
      {downloadNotificationCreatedTotalCount > 0 && (
        <div
          className={cx(
            gClasses.FTwo10White,
            styles.DownloadNotificationCount,
            gClasses.CenterVH,
            gClasses.CursorPointer,
          )}
        >
          {downloadNotificationCreatedTotalCount > 9
            ? '9+'
            : downloadNotificationCreatedTotalCount}
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    download_list: state.DownloadWindowReducer.download_list,
    isDownloadNotificationsModalOpen:
      state.DownloadWindowReducer.isDownloadNotificationsModalOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetReportDownloadDocsThunk: () => {
      dispatch(getReportDownloadDocsThunk());
    },
    onDownloadWindowDataChange: (id, value) => {
      dispatch(downloadWindowDataChange(id, value));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DownloadNotification);
