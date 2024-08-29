import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import { connect } from 'react-redux';

import XlsxIcon from 'assets/icons/XlsxIcon';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import { downloadWindowDataChange } from 'redux/reducer/DownloadWindowReducer';
import getReportDownloadDocsThunk from 'redux/actions/DownloadWindow.Action';
import { getFormattedDateFromUTC } from 'utils/dateUtils';
import { BS } from 'utils/UIConstants';
import { DOWNLOAD_WINDOW_TIME, EMPTY_STRING } from 'utils/strings/CommonStrings';

import gClasses from 'scss/Typography.module.scss';
import NoDownloadsIcon from 'assets/icons/NoDownloadsIcon';
import { useTranslation } from 'react-i18next';
import styles from './DownloadWindow.module.scss';
import { DOWNLOAD_WINDOW_STRINGS, getDownloadUrl } from '../Download.strings';
import jsUtils from '../../../utils/jsUtility';

function DownloadWindow(props) {
  const {
    downloadWindowData: {
      isDownloadNotificationsModalOpen,
      downloadNotificationTotalCount,
      download_list = [],
    },
    onDownloadWindowDataChange,
    onGetReportDownloadDocsThunk,
  } = props;
  const { DOC_TYPE: { getDocTypeByType } } = DOWNLOAD_WINDOW_STRINGS;
  const { t } = useTranslation();

  useEffect(() => {
    onGetReportDownloadDocsThunk();
    return () => {};
  }, []);

  const toggleDownloadNotification = () => {
    onDownloadWindowDataChange('isDownloadNotificationsModalOpen', false);
  };

  const elementDownloadList = (downloadList) => {
    let list = EMPTY_STRING;
    if (jsUtils.isArray(downloadList) && downloadList.length > 0) {
      list = downloadList.map((objDownload, index) => {
        const {
          document_id,
          status,
          accessed_time,
          created_time,
          metadata: { filename, content_type, type },
        } = objDownload;
        const downloadUrl = getDownloadUrl(document_id);
        const dateTime =
          status === DOWNLOAD_WINDOW_STRINGS.STATUS.DELETED
            ? created_time
            : accessed_time;
        const timeData = getFormattedDateFromUTC(
          dateTime,
          DOWNLOAD_WINDOW_TIME,
        );
        const isLoadingDownloadDoc =
          status === DOWNLOAD_WINDOW_STRINGS.STATUS.CREATED;
        const downloadDocType =
          t(getDocTypeByType(type));
        return (
          <div
            key={document_id}
            className={cx(
              BS.D_FLEX,
              BS.JC_BETWEEN,
              styles.DownloadListCardContainer,
              index !== downloadList.length - 1 && styles.BottomBorderLine,
            )}
          >
            <div className={cx(BS.D_FLEX, styles.CardTextContainer)}>
              <div className={cx(BS.D_FLEX, gClasses.MR10)}>
                <XlsxIcon />
              </div>
              <div className={cx(BS.FLEX_COLUMN, styles.CardTitleContainer)}>
                <div
                  title={`${filename}.${content_type}`}
                  className={cx(
                    styles.CardTitle,
                    gClasses.MB6,
                    BS.TEXT_WRAP,
                    gClasses.WordWrap,
                  )}
                >
                  {status === DOWNLOAD_WINDOW_STRINGS.STATUS.ACCESSED ? (
                    <a href={downloadUrl} rel="noreferrer" target="_blank">
                      {`${filename}.${content_type}`}
                    </a>
                  ) : (
                    `${filename}.${content_type}`
                  )}
                </div>
                <div className={styles.CardSubTitle}>
                  {isLoadingDownloadDoc ? <Skeleton /> : downloadDocType}
                </div>
              </div>
            </div>
            <div className={cx(BS.D_FLEX, styles.CardTime)}>
              {isLoadingDownloadDoc ? <Skeleton width={80} /> : timeData}
            </div>
          </div>
        );
      });
    } else {
      list = (
        <div className={cx(styles.NoDownloadIcon)}>
          <NoDownloadsIcon />
          <div className={cx(styles.NoDownloadIcon, gClasses.MT16IMP)}>
            <div className={cx(gClasses.FTwo18, gClasses.FontWeight600)}>
              {t(DOWNLOAD_WINDOW_STRINGS.NO_DOWNLOADS)}
            </div>
          </div>
        </div>
      );
    }
    return list;
  };

  const downloadCardsList = elementDownloadList(download_list);

  return (
    <div className={cx(gClasses.Sticky)}>
      <ModalLayout
        mainContentClassName={cx(styles.DownloadNotificationContent, gClasses.MB0)}
        id="notification_modal"
        isModalOpen={isDownloadNotificationsModalOpen}
        onCloseClick={toggleDownloadNotification}
        headerClassName={styles.PopUpHeaderContainer}
        modalContainerClass={cx(styles.ContentModal, gClasses.ZIndex13)}
        modalCustomContainerClass={styles.BackgroundNone}
        headerContent={
          <div className={cx(BS.D_FLEX)}>
            <div className={styles.PopUpHeaderTitle}>
              {downloadNotificationTotalCount > 0
                ? `${t(DOWNLOAD_WINDOW_STRINGS.TITLE)} (${downloadNotificationTotalCount})`
                : t(DOWNLOAD_WINDOW_STRINGS.TITLE)}
            </div>
          </div>
        }
        mainContent={
          <div
            id={DOWNLOAD_WINDOW_STRINGS.ID}
            className={cx(
              gClasses.OverflowYAuto,
              gClasses.ML25,
              gClasses.MR10,
              styles.AllNotifications,
              jsUtils.isEmpty(download_list) && styles.NoDownloadIcon,
              jsUtils.isEmpty(download_list) && styles.NoDownloadIconHeight,
            )}
          >
            {downloadCardsList}
          </div>
        }
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    downloadWindowData: state.DownloadWindowReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDownloadWindowDataChange: (id, value) => {
      dispatch(downloadWindowDataChange(id, value));
    },
    onGetReportDownloadDocsThunk: () => {
      dispatch(getReportDownloadDocsThunk());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DownloadWindow);
