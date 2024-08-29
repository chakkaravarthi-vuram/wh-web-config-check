import React from 'react';
import cx from 'classnames/bind';
import NoNotificationIcon from 'assets/icons/NoNotificationIcon';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import { NOTIFICATION_CONTENT_STRINGS } from './EachNotification.strings';

function NoNotifications() {
  const { t } = useTranslation();
return (
  <>
    <div className={gClasses.CenterVH}>
      <NoNotificationIcon />
    </div>
    <div className={cx(gClasses.MT40, gClasses.FTwo18GrayV3, gClasses.FontWeight600, gClasses.CenterVH)}>
      {t(NOTIFICATION_CONTENT_STRINGS.NO_NOTIFICATIONS)}
    </div>
    <div className={cx(gClasses.MT15, gClasses.FTwo13BlackV13, gClasses.FontWeight500, gClasses.CenterVH)}>
      {t(NOTIFICATION_CONTENT_STRINGS.NO_NOTIFICATIONS_MESSAGE)}
    </div>
  </>
);
}

export default NoNotifications;
