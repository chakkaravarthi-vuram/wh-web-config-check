import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { connect } from 'react-redux';
import { NavToggle } from 'redux/actions/NavBar.Action';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import jsUtils from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import OpenLinkIcon from 'assets/icons/OpenLinkIcon';
import Skeleton from 'react-loading-skeleton';
import UserImage from 'components/user_image/UserImage';
import { useTranslation } from 'react-i18next';
import styles from './Notification.module.scss';
import { getNotificationSectionName, getNotificationTime, getNotificationURL, notificationContent, notificationPublisher, reassignedAssignees } from './EachNotification.utils';
import { NOTIFICATION_TASK_DYNAMIC_CONTENT, NOTIFICATION_TYPES, NOTIFICATION_WITH_USER_IMAGES } from './EachNotification.strings';

function EachNotificaiton(props) {
  const { onNotificationClicked, notificationId = null, noBottomBorder = false, notification, acc_timezone, isLoading } = props;
  const notificationType = jsUtils.get(notification, ['context'], {});
  const notificationData = jsUtils.get(notification, ['data'], {});
  const notificationUrl = jsUtils.get(notification, ['data', 'protocol_url'], EMPTY_STRING);
  const notificationPublisherName = {
    first_name: notificationPublisher(notificationData, notificationType).split(' ')[0] || '',
    last_name: notificationPublisher(notificationData, notificationType).split(' ')[1] || '',
  };
  const [linkAriaLabel, setLinkAriaLabel] = useState('');
  const onFocusLink = () => {
    setLinkAriaLabel('Open Notification');
  };
  const onBlurLink = () => {
    setLinkAriaLabel(null);
  };
  const { t } = useTranslation();
  return (
          <>
          {jsUtils.has(notification, ['days_before']) &&
          (
            <div
            className={
              cx(
                jsUtils.get(notification, ['days_before']) > 0 && gClasses.MT20,
                gClasses.MB10,
                gClasses.ML25,
                gClasses.FontWeight500,
                gClasses.FTwo14GrayV53,
              )
            }
            >
              {t(getNotificationSectionName(jsUtils.get(notification, ['days_before'])))}
            </div>
          )

          }
            <div
              className={cx(styles.Notification, gClasses.CursorPointer, (notificationType === NOTIFICATION_TYPES.TASK.CANCEL_INSTANCE_TASK || notificationType === NOTIFICATION_TYPES.TASK.REMOVE_DATA_LIST_TASK || notificationType === NOTIFICATION_TYPES.TASK.REASSIGNED) && gClasses.CursorDefault)}
              onClick={() => onNotificationClicked(notificationId)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onNotificationClicked(notificationId)}
            >
              { !isLoading ?
              (
              <div className={cx(styles.Container, BS.D_FLEX, BS.JC_BETWEEN)}>
                {!jsUtils.get(notification, ['is_read'], false) &&
                (
                <div className={cx(styles.Indicator, styles.AddedBackgroung, gClasses.MT30, gClasses.ML15, gClasses.MR5)} />
                )}
                <div
                className={cx(
                styles.Comment,
                !noBottomBorder && styles.BorderBottom,
                BS.D_FLEX,
                gClasses.MT15,
                jsUtils.get(notification, ['is_read'], false) && gClasses.ML15,
                )}
                >
                {(NOTIFICATION_WITH_USER_IMAGES.includes(notificationType) &&
                (notificationPublisherName.first_name !== 'System' && !jsUtils.isEmpty(notificationPublisherName.last_name))) && (
                <UserImage
                    src=""
                    className={styles.UserImage}
                    firstName={notificationPublisherName.first_name}
                    lastName={notificationPublisherName.last_name}
                    enableUserOrTeamDetailToolTip
                    ariaHidden
                />
                )}
                <div className={cx((!NOTIFICATION_WITH_USER_IMAGES.includes(notificationType) ||
                 (notificationPublisherName.first_name === 'System')) ? gClasses.ML40 : gClasses.ML10)}
                >
                <div className={cx(gClasses.MB15)}>
                <div className={cx(gClasses.FTwo13GrayV3, gClasses.WordWrap, notificationType !== NOTIFICATION_TYPES.TASK.CANCEL_TASK && gClasses.PB8)}>
                        {(notificationType !== NOTIFICATION_TYPES.TASK.FLOW_DATALIST_ADHOC_TASK_ASSIGNED && notificationType !== NOTIFICATION_TYPES.TASK.REMOVE_DATA_LIST_TASK) &&
                        (
                          <span className={cx(gClasses.FontWeight500, gClasses.TextTransformCap)}>
                          {`${notificationPublisher(notificationData, notificationType)} `}
                          </span>
                        )}
                        {(notificationType === NOTIFICATION_TYPES.TASK.SNOOZED_TASK || notificationType === NOTIFICATION_TYPES.TASK.CANCEL_INSTANCE_TASK) &&
                        (
                        <span className={cx(gClasses.FontWeight500)}>
                          {notificationType === NOTIFICATION_TYPES.TASK.CANCEL_INSTANCE_TASK &&
                            <span className={cx(gClasses.FontWeightNormal)}>
                            {`${t(NOTIFICATION_TASK_DYNAMIC_CONTENT.INSTANCE_CANCELLED)}: `}
                            </span>
                          }
                        {`${jsUtils.get(notificationData, ['task_name'], EMPTY_STRING)}`}
                        </span>
                        )}
                        <span className={gClasses.FontWeightNormal}>
                        {`${notificationContent(t, notificationData, notificationType)} `}
                        </span>
                        {notificationType === NOTIFICATION_TYPES.TASK.REASSIGNED &&
                        (
                          <span className={cx(gClasses.FontWeight500, gClasses.TextTransformCap)}>
                          {`${reassignedAssignees(notificationData)} `}
                          </span>
                        )}
                        {notificationType === NOTIFICATION_TYPES.TASK.FLOW_DATALIST_ADHOC_TASK_ASSIGNED &&
                        (
                          <span className={cx(gClasses.FontWeight500, gClasses.TextTransformCap)}>
                          {`${notificationPublisher(notificationData, notificationType)} `}
                          </span>
                        )}
                        {(notificationType !== NOTIFICATION_TYPES.TASK.SNOOZED_TASK && notificationType !== NOTIFICATION_TYPES.TASK.FLOW_DATALIST_ADHOC_TASK_ASSIGNED &&
                          notificationType !== NOTIFICATION_TYPES.TASK.CANCEL_INSTANCE_TASK) && notificationType !== NOTIFICATION_TYPES.TASK.REASSIGNED &&
                        (
                        <span className={cx(gClasses.FontWeight500)}>
                        {jsUtils.get(notificationData, ['task_name'], EMPTY_STRING)}
                        </span>
                        )}
                        {/* {notificationType === NOTIFICATION_TYPES.TASK.FLOW_DATALIST_ADHOC_TASK_ASSIGNED &&
                        (
                        <span className={cx(gClasses.FontWeight400)}>
                        {`${notificationContentForDashboardAdhocTask(notificationData)} `}
                        </span>
                        )} */}
                        {/* <span className={cx(gClasses.FontWeight500)}>
                        {` ${jsUtils.get(notificationData, ['initiated_by'], '')}`}
                        </span> */}
                </div>
                {notificationType === NOTIFICATION_TYPES.TASK.CANCEL_TASK &&
                (
                <span className={cx(gClasses.FontWeight500, gClasses.FTwo13GrayV3, gClasses.WordWrap, gClasses.PT0)}>
                {jsUtils.get(notificationData, ['cancel_reason'], EMPTY_STRING)}
                </span>
                )}
                {(notificationType === NOTIFICATION_TYPES.TASK.FLOW_DATALIST_ADHOC_TASK_ASSIGNED || notificationType === NOTIFICATION_TYPES.TASK.REASSIGNED) &&
                (
                <span className={cx(gClasses.FontWeight500, gClasses.FTwo13GrayV3, gClasses.WordWrap, gClasses.PT0)}>
                {jsUtils.get(notificationData, ['task_name'], EMPTY_STRING)}
                </span>
                )}
                {notificationType === NOTIFICATION_TYPES.TASK.REMOVE_DATA_LIST_TASK &&
                (
                <span className={cx(gClasses.FTwo13GrayV3, gClasses.WordWrap)}>
                <span>
                  {`${t(NOTIFICATION_TASK_DYNAMIC_CONTENT.REMOVE_DATA_LIST_TASK)}`}
                </span>
                <span className={cx(gClasses.FontWeight500)}>
                  {jsUtils.get(notificationData, ['published_by'], EMPTY_STRING)}
                </span>
                <span>
                  {`${t(NOTIFICATION_TASK_DYNAMIC_CONTENT.DELETION_OF_THE_DATA)}`}
                </span>
                <span className={cx(gClasses.FontWeight500)}>
                  {jsUtils.get(notificationData, ['data_list_entry_identifier'], EMPTY_STRING)}
                </span>
                <span>
                  {`${t(NOTIFICATION_TASK_DYNAMIC_CONTENT.FROM)}`}
                </span>
                <span className={cx(gClasses.FontWeight500)}>
                  {jsUtils.get(notificationData, ['data_list_name'], EMPTY_STRING)}
                </span>
                </span>
                )}
                </div>
                </div>
                </div>
                <div className={cx(!noBottomBorder && styles.BorderBottom, styles.TimeComponent)}>
                    <div
                    className={cx(
                        gClasses.FTwo12GrayV53,
                        BS.D_FLEX,
                        BS.JC_END,
                        BS.TEXT_NO_WRAP,
                        gClasses.MT1,
                        styles.Time,
                        gClasses.CenterV,
                    )}
                    aria-label={`${getNotificationTime(notificationType, jsUtils.get(notification, ['alert_on'], ''), acc_timezone)} mark as read`}
                    >
                        {getNotificationTime(notificationType, jsUtils.get(notification, ['alert_on'], ''), acc_timezone)}
                    </div>
                    <div className={cx(BS.D_FLEX, BS.JC_END, (notificationType === NOTIFICATION_TYPES.TASK.CANCEL_INSTANCE_TASK || notificationType === NOTIFICATION_TYPES.TASK.REMOVE_DATA_LIST_TASK || notificationType === NOTIFICATION_TYPES.TASK.REASSIGNED) && gClasses.DisplayNone)}>
                    {/* <div className={gClasses.MR15}><NotificationDownloadIcon /></div> */}
                    <div>
                      <Link
                        aria-label={linkAriaLabel}
                        onFocus={onFocusLink}
                        onBlur={onBlurLink}
                        to={getNotificationURL(notificationUrl, notificationType, notificationData)}
                        target="_blank"
                      >
                        <OpenLinkIcon ariaHidden role={ARIA_ROLES.IMG} ariaLabel="Open notification" />
                      </Link>
                    </div>
                    </div>
                </div>
              </div>
              ) : (
                <div
                  className={cx(
                    gClasses.ML32,
                    gClasses.MR30,
                    gClasses.MT10,
                    gClasses.MB10,
                  )}
                >
                  <Skeleton width={500} height={30} />
                </div>
              )}
            </div>
          </>
    );
}

const mapStateToprops = (state) => {
  return {
    stateDataList: state.CreateDataListReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleFunction: () => {
      dispatch(NavToggle());
    },
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToprops, mapDispatchToProps)(EachNotificaiton),
);
