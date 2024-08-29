import React, { useContext, useState, useEffect, useRef } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import Skeleton from 'react-loading-skeleton';

import { downloadWindowDataChange } from 'redux/reducer/DownloadWindowReducer';
import { getExportFlowDashboard } from 'redux/actions/FlowDashboard.Action';
import jsUtils from 'utils/jsUtility';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import Spinner from 'loaders/spinner/Spinner';
import XlsxIcon from 'assets/icons/XlsxIcon';
import NewCorrectIcon from 'assets/icons/NewCorrectIcon';
import CloseIcon from 'assets/icons/CloseIcon';
import RetryIconV2 from 'assets/icons/RetryIconV2';
import {
  keepTabFocusWithinModal,
  keydownOrKeypessEnterHandle,
} from 'utils/UtilityFunctions';

import gClasses from 'scss/Typography.module.scss';
import ThemeContext from 'hoc/ThemeContext';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { LOGGED_IN_NAVBAR } from 'components/logged_in_nav_bar/LoggedInNavbarTranlsation.strings';
import { getExportTaskDetailsThunk } from 'redux/actions/TaskActions';
import { useTranslation } from 'react-i18next';
import styles from './DownloadActivityWindow.module.scss';
import {
  DOWNLOAD_WINDOW_STRINGS,
  getDownloadUrl,
} from '../../Download.strings';

function DownloadActivityWindow(props) {
  const { buttonColor } = useContext(ThemeContext);
  const {
    download_list,
    retryDownloadData,
    onDownloadWindowDataChange,
    onGetExportFlowDashboard,
    onGetExportTaskDetails,
  } = props;

  const objDownloadData =
    download_list && download_list.length > 0 && download_list[0];
  const { status = DOWNLOAD_WINDOW_STRINGS.STATUS.CREATED } = objDownloadData;

  const downloadWindowContainerRef = useRef(null);
  const [isMinimized, setMinimized] = useState(false);
  const {
    ACTIVITY,
    ACTIVITY: { getActivityTitleByStatus },
  } = DOWNLOAD_WINDOW_STRINGS;

  const { t } = useTranslation();

  const closeDownloadWindow = (e) => {
    e.stopPropagation();
    onDownloadWindowDataChange('isDownloadActivityOpen', false);
  };

  const onClickMyDownloads = () => {
    onDownloadWindowDataChange('isDownloadActivityOpen', false);
    onDownloadWindowDataChange('isDownloadNotificationsModalOpen', true);
  };

  const handleEscClick = (event) => {
    const chatClasses = document.getElementsByClassName(
      ACTIVITY.DOWNLOAD_ACTIVITY_CLOSE_COMMON_COMPONENT_CLASS,
    );
    if (event.key === 'Escape' && event.keyCode === 27) {
      const { length } = chatClasses;
      if (
        length &&
        downloadWindowContainerRef &&
        downloadWindowContainerRef.current
      ) {
        downloadWindowContainerRef.current.click();
      }
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', handleEscClick);
    return () => {
      document.removeEventListener('keydown', handleEscClick);
    };
  }, []);

  useEffect(() => {
    const checkFocusFn = (e) => keepTabFocusWithinModal(e, ACTIVITY.ID);
    if (!isMinimized) {
      window.addEventListener('keydown', checkFocusFn, false);
    }

    return () => window.removeEventListener('keydown', checkFocusFn, false);
  }, [isMinimized]);

  const minMaxHandler = () => setMinimized(!isMinimized);

  const onRetryDownload = () => {
    const { type, flowOrDatalistUuid, flowOrDatalistId, queryData, task_metadata_uuid } =
      retryDownloadData;
    if (type === ACTIVITY.TYPE.FLOW_OR_DATALIST) {
      if (flowOrDatalistUuid && queryData) {
        onGetExportFlowDashboard(queryData, flowOrDatalistUuid, flowOrDatalistId);
      }
    } else if (task_metadata_uuid) {
      onGetExportTaskDetails(task_metadata_uuid);
    }
  };

  const elementStatus = (status) => {
    let element;
    switch (status) {
      case DOWNLOAD_WINDOW_STRINGS.STATUS.CREATED:
        element = (
          <div>
            <Spinner />
          </div>
        );
        break;
      case DOWNLOAD_WINDOW_STRINGS.STATUS.ACCESSED:
        element = (
          <div className={cx(styles.Circle1, styles.CorrectCircle)}>
            <NewCorrectIcon role={ARIA_ROLES.IMG} />
          </div>
        );
        break;
      case DOWNLOAD_WINDOW_STRINGS.STATUS.DELETED:
        element = (
          <div>
            <RetryIconV2
              className={cx(gClasses.CursorPointer)}
              onClick={onRetryDownload}
              onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onRetryDownload()}
              tabIndex={0}
              ariaLabel="Retry download"
              role={ARIA_ROLES.BUTTON}
            />
          </div>
        );
        break;
      default:
        break;
    }
    return element;
  };

  const elementDownloadData = (DownloadData) => {
    if (jsUtils.isObject(DownloadData) && DownloadData) {
      const {
        document_id,
        status,
        metadata: { filename, content_type },
      } = DownloadData;
      const downloadUrl = getDownloadUrl(document_id);

      return (
        <div
          className={cx(
            styles.DownloadActivityCardContainer,
            BS.D_FLEX,
            BS.JC_BETWEEN,
            gClasses.MB10,
          )}
        >
          <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}>
            <div className={cx(BS.D_FLEX, gClasses.MR10)}>
              <XlsxIcon role={ARIA_ROLES.IMG} title="xlsx file" />
            </div>
            <div className={BS.FLEX_COLUMN}>
              <div
                title={`${filename}.${content_type}`}
                className={cx(styles.CardTitle)}
              >
                {status === DOWNLOAD_WINDOW_STRINGS.STATUS.ACCESSED ? (
                  <a href={downloadUrl} rel="noreferrer" target="_blank">
                    {`${filename}.${content_type}`}
                  </a>
                ) : (
                  `${filename}.${content_type}`
                )}
              </div>
              {status === DOWNLOAD_WINDOW_STRINGS.STATUS.DELETED && (
                <div className={cx(styles.CardTitle, styles.Failed)}>
                  Failed
                </div>
              )}
            </div>
          </div>
          <div className={cx(BS.D_FLEX)}>{elementStatus(status)}</div>
        </div>
      );
    }
    return EMPTY_STRING;
  };

  let bodyContainer = null;
  let downloadData = EMPTY_STRING;
  if (jsUtils.isEmpty(objDownloadData)) {
    downloadData = (
      <div
        className={cx(
          styles.DownloadActivityCardContainer,
          BS.D_FLEX,
          BS.JC_BETWEEN,
          gClasses.MB10,
        )}
      >
        <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}>
          <div className={cx(BS.D_FLEX, gClasses.MR10)}>
            <Skeleton height={40} width={40} />
          </div>
          <div className={BS.FLEX_COLUMN}>
            <div className={styles.CardTitle}>
              <Skeleton height={14} width={200} />
            </div>
            <div className={styles.CardTitle}>
              <Skeleton height={12} width={160} />
            </div>
          </div>
        </div>
        <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}>
          <Skeleton height={30} width={30} />
        </div>
      </div>
    );
  }
  if (!jsUtils.isEmpty(objDownloadData)) {
    downloadData = elementDownloadData(objDownloadData);
  }
  if (!isMinimized) {
    bodyContainer = (
      <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN)}>
        {downloadData && (
          <div
            className={cx(styles.DownloadActivityDataContainer, BS.FLEX_ROW)}
          >
            {downloadData}
          </div>
        )}
        <div className={cx(BS.D_FLEX_JUSTIFY_END, gClasses.P15)}>
          <button
            className={cx(
              gClasses.FTwo13,
              gClasses.FontWeight500,
              gClasses.ClickableElement,
              gClasses.CursorPointer,
            )}
            style={{ color: buttonColor }}
            onClick={onClickMyDownloads}
          >
            {t(LOGGED_IN_NAVBAR.MY_DOWNLOADS)}
          </button>
        </div>
      </div>
    );
  }
  return (
    <div
      id={ACTIVITY.ID}
      className={cx(
        styles.Container,
        ACTIVITY.DOWNLOAD_ACTIVITY_CLOSE_COMMON_COMPONENT_CLASS,
      )}
    >
      <div
        className={cx(
          styles.TitleBar,
          gClasses.CenterV,
          BS.JC_BETWEEN,
          gClasses.CursorPointer,
        )}
        onClick={minMaxHandler}
        role="presentation"
      >
        <div
          className={cx(
            gClasses.FTwo12White,
            gClasses.FontWeight600,
            styles.Name,
            gClasses.Ellipsis,
            gClasses.CursorDefault,
            gClasses.TextTransformCap,
          )}
          title={t(getActivityTitleByStatus(status))}
        >
          {t(getActivityTitleByStatus(status))}
        </div>
        <div className={cx(BS.D_FLEX)}>
          <div
            className={cx(styles.Minimize, gClasses.CenterVH)}
            role="button"
            tabIndex="0"
            onKeyDown={(e) =>
              keydownOrKeypessEnterHandle(e) && minMaxHandler()
            }
            title={
              isMinimized
                ? t(DOWNLOAD_WINDOW_STRINGS.MAXIMIZE)
                : t(DOWNLOAD_WINDOW_STRINGS.MINIMIZE)
            }
            aria-label={`${
              isMinimized ?
              t(DOWNLOAD_WINDOW_STRINGS.MAXIMIZE)
              : t(DOWNLOAD_WINDOW_STRINGS.MINIMIZE)
            } ${t(getActivityTitleByStatus(status))}`}
          >
            <div
              className={cx(
                styles.MinimizeIcon,
                isMinimized ? gClasses.MB6 : gClasses.MT7,
              )}
            />
          </div>
          <div
            className={cx(
              styles.Close,
              gClasses.CenterVH,
              gClasses.CursorPointer,
            )}
            role="button"
            tabIndex="0"
            onClick={closeDownloadWindow}
            onKeyDown={(e) =>
              keydownOrKeypessEnterHandle(e) && closeDownloadWindow(e)
            }
            title={t(DOWNLOAD_WINDOW_STRINGS.CLOSE)}
            ref={downloadWindowContainerRef}
            aria-label={`${
              t(DOWNLOAD_WINDOW_STRINGS.CLOSE)
            } ${t(getActivityTitleByStatus(status))}`}
          >
            <CloseIcon
              className={styles.CloseIcon}
              title={t(DOWNLOAD_WINDOW_STRINGS.CLOSE)}
              role={ARIA_ROLES.IMG}
            />
          </div>
        </div>
      </div>
      {bodyContainer}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    download_list: state.DownloadWindowReducer.download_list,
    retryDownloadData: state.DownloadWindowReducer.retryDownloadData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDownloadWindowDataChange: (id, value) => {
      dispatch(downloadWindowDataChange(id, value));
    },
    onGetExportFlowDashboard: (query, flowUuid, flowId) => {
      dispatch(getExportFlowDashboard(query, flowUuid, flowId));
    },
    onGetExportTaskDetails: (task_metadata_uuid) => {
      dispatch(getExportTaskDetailsThunk(task_metadata_uuid));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DownloadActivityWindow);
