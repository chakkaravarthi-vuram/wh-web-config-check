import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import { BS } from 'utils/UIConstants';
import { clearNotificationsState, notificationsDataChangeAction, toggleNotificationsModalVisibility } from 'redux/reducer/NotificationsReducer';
import jsUtils from 'utils/jsUtility';
import { getAllNotficationsApiThunk, readNotificationApiThunk } from 'redux/actions/Notifications.Action';
import { getProfileDataForChat, keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { getModifiedNotificationsList } from 'redux/reducer';
import { getLanguageAndCalendarDataThunk } from 'redux/actions/LanguageAndCalendarAdmin.Action';
import { NOTIFICATION_SOCKET_EVENTS } from 'utils/Constants';
import styles from './Notification.module.scss';
import EachNotification from './EachNotification';
import NoNotifications from './NoNotifications';
import { NOTIFICATION_CONTENT_STRINGS } from './EachNotification.strings';

const ReactInfiniteScrollComponent = require('react-infinite-scroll-component').default;

function Notification(props) {
    const {
      state,
      isNotificationsModalOpen,
      notificationsList,
      hasMore,
      totalCount,
      page,
      size,
      isNotificationsListLoading,
      isLoadMoreNotifications,
      toggleNotificationsModal,
      notificationsDataChange,
      getAllNotficationsApiCall,
      clearNotificationsData,
      acc_timezone,
      getLanguageAndCalendarData,
     } = props;
     const { t } = useTranslation();
     const [modifiedNotificationsList, setModifiedNotificationsList] = useState(notificationsList);
     useEffect(() => {
      if (isNotificationsModalOpen) {
      const params = {
        page: 1,
        size: size,
        is_read: 0,
      };
      getAllNotficationsApiCall(params);
      }
      return () => {
        clearNotificationsData();
      };
     }, [isNotificationsModalOpen]);

     useEffect(() => {
      if (jsUtils.isNull(acc_timezone)) getLanguageAndCalendarData();
    }, []);

     useEffect(() => {
      if (!jsUtils.isEmpty(notificationsList) && !jsUtils.isNull(acc_timezone) &&
          !jsUtils.isEqual(modifiedNotificationsList,
                           setModifiedNotificationsList(getModifiedNotificationsList(state)))) {
        setModifiedNotificationsList(getModifiedNotificationsList(state));
      }
     }, [notificationsList, acc_timezone]);

    const [isModalOpen, setIsNotificationModalOpen] = useState(false);
    const SCROLLABLE_DIV_ID = 'NotificationsList';
    const notificationComponent = [];

    const toggleNotification = (event = null) => {
      if (jsUtils.get(event, ['target', 'id'], '').includes('Modal') || jsUtils.isNull(event)) {
          toggleNotificationsModal();
          setIsNotificationModalOpen(!isModalOpen);
      }
    };

    const onLoadMoreNotifications = () => {
      if (isLoadMoreNotifications) return;
      if (totalCount > notificationsList.length) {
        const params = {
          page: page + 1,
          size: size,
          is_read: 0,
        };
        getAllNotficationsApiCall(params);
      } else {
        notificationsDataChange({
          hasMore: false,
        });
      }
    };

    const readNotification = async (notificationId = null, readAllNotifications = false) => {
      console.log('readNotificationreadNotification', notificationId, readAllNotifications);
      // if (readAllNotifications) await readNotificationApiCall();
      // else if (!jsUtils.isNull(notificationId)) {
      //   await readNotificationApiCall({ _id: notificationId });
      // }
    const userProfileData = getProfileDataForChat();
    if (userProfileData && userProfileData.notificationSocket) {
      if (readAllNotifications) {
      userProfileData.notificationSocket.emit(
        NOTIFICATION_SOCKET_EVENTS.EMIT_EVENTS.READ_NOTIFICATION,
        {},
        (code, error) => {
          console.log('Notification read via socket', code, error);
        },
      );
    } else if (!jsUtils.isNull(notificationId)) {
      userProfileData.notificationSocket.emit(
        NOTIFICATION_SOCKET_EVENTS.EMIT_EVENTS.READ_NOTIFICATION,
        {
          _id: notificationId,
        },
        (code, error) => {
          console.log('Notification read via socket', code, error);
        },
      );
    }
  }
    };
    modifiedNotificationsList.forEach((eachNotification, index) => {
      notificationComponent.push(
      <EachNotification
      notificationId={eachNotification._id}
      notificationIndex={index}
      onNotificationClicked={readNotification}
      noBottomBorder={index === (notificationsList.length - 1)}
      notification={eachNotification}
      acc_timezone={acc_timezone}
      isLoading={isNotificationsListLoading}
      />,
      );
    });

    return (
    <div
        className={cx(
        gClasses.Sticky,
        styles.MainHeader,
        )}
    >
        <ModalLayout
        mainContentClassName={styles.NotificationContent}
        id="notification_modal"
        isModalOpen={isNotificationsModalOpen}
        onCloseClick={toggleNotification}
        modalContainerClass={cx(styles.ContentModal, gClasses.ZIndex13)}
        modalCustomContainerClass={styles.BackgroundNone}
        outsideModalClickClose
        mainContent={(
            <>
                <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MB20, gClasses.ML25, gClasses.MR30)}>
                    <div className={gClasses.HeadingTitleV1}>
                        {totalCount > 0 ?
                          <div>
                            {t(NOTIFICATION_CONTENT_STRINGS.TITLE)}
                            <span className={styles.NotificationCount}>{`(${totalCount})`}</span>
                          </div>
                        : t(NOTIFICATION_CONTENT_STRINGS.TITLE) }
                    </div>
                    {(notificationComponent && notificationComponent.length > 0) ?
                    (
                    <div
                    className={cx(gClasses.FTwo13BlueV39, gClasses.CenterV, gClasses.CursorPointer, gClasses.FontWeight500)}
                    onClick={() => readNotification(null, true)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && readNotification(null, true)}
                    >
                        {t(NOTIFICATION_CONTENT_STRINGS.MARK_ALL_AS_READ)}
                    </div>
                    ) : null}
                </div>
                <div id={SCROLLABLE_DIV_ID} className={cx(gClasses.OverflowYAuto, styles.AllNotifications)}>
                {/* {(notificationComponent && notificationComponent.length > 0) ?
                ( */}
                  <ReactInfiniteScrollComponent
                  dataLength={notificationsList.length}
                  next={onLoadMoreNotifications}
                  hasMore={hasMore}
                  loader={Array(size)
                    .fill()
                    .map(() => (
                      isNotificationsListLoading && <EachNotification isLoading={isNotificationsListLoading} onNotificationClicked={readNotification} />
                    ))}
                  scrollableTarget={SCROLLABLE_DIV_ID}
                  scrollThreshold={0.8}
                  className={cx(gClasses.ScrollBar)}
                  >
                  {notificationComponent}
                  </ReactInfiniteScrollComponent>
               { (notificationComponent && notificationComponent.length === 0 && !isNotificationsListLoading) && (
                      <div className={cx(gClasses.MT90)}>
                      <NoNotifications />
                      </div>
                    )
                }
                </div>
            </>
        )}
    //   headerContent={(
        />
    </div>
    );
}

const mapStateToprops = (state) => {
  return {
    isNotificationsModalOpen: state.NotificationReducer.isNotificationsModalOpen,
    notificationsList: state.NotificationReducer.notificationsList,
    hasMore: state.NotificationReducer.hasMore,
    totalCount: state.NotificationReducer.total_count,
    notificationsCount: state.NotificationReducer.notificationsCount,
    page: state.NotificationReducer.page,
    size: state.NotificationReducer.size,
    isNotificationsListLoading: state.NotificationReducer.isNotificationsListLoading,
    isLoadMoreNotifications: state.NotificationReducer.isLoadMoreNotifications,
    state: state,
    acc_timezone: state.LanguageAndCalendarAdminReducer.acc_timezone,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleNotificationsModal: () => {
      dispatch(toggleNotificationsModalVisibility());
    },
    notificationsDataChange: (data) => {
      dispatch(notificationsDataChangeAction(data));
    },
    getAllNotficationsApiCall: (params) => {
    dispatch(getAllNotficationsApiThunk(params));
    },
    readNotificationApiCall: (params) => {
      dispatch(readNotificationApiThunk(params));
    },
    clearNotificationsData: () => {
      dispatch(clearNotificationsState());
    },
    getLanguageAndCalendarData: (value) => {
      dispatch(getLanguageAndCalendarDataThunk(value));
    },
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToprops, mapDispatchToProps)(Notification),
);
