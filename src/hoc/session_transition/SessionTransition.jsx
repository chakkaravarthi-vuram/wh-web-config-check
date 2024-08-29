import React, { useState } from 'react';
import {
  Text,
  Button,
  Title,
  EButtonType,
  EButtonSizeType,
  ETextSize,
  ETitleSize,
  ETitleAlign,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import workhallImg from 'assets/workhall_loader/WorkHallLogo.png';
import { useTranslation } from 'react-i18next';
import sessionTransition from 'assets/img/session-transition.png';
import Cookies from 'universal-cookie';
import gClasses from 'scss/Typography.module.scss';
import { useHistory } from 'react-router';
import styles from './SessionTransition.module.scss';
import Image from '../../components/form_components/image/Image';
import { SESSION_TRANSITION_STRINGS } from './SessionTransition.strings';
import { BS } from '../../utils/UIConstants';
import { getDomainName, isEmpty } from '../../utils/jsUtility';
import {
  getProfileDataForChat,
  logoutClearUtil,
} from '../../utils/UtilityFunctions';
import { clearSessionDetails } from '../../axios/apiService/clearSessionDetails.apiService';
import { NOTIFICATION_SOCKET_EVENTS } from '../../utils/Constants';
import FullPageLoader from '../../assets/icons/FullPageLoader';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function SessionTransition(props) {
  const { profile } = props;
  const { t } = useTranslation();
  const cookies = new Cookies();
  const history = useHistory();

  const [isRedirectLoading, setIsRedirectLoading] = useState(false);

  const searchParams = !isEmpty(history.location.search)
    ? new URLSearchParams(history.location.search)
    : null;

  const activeDomain =
    cookies?.get('active-domain') || searchParams?.get('cad'); // cad = current active domain

  const currentSessionHostname = `${activeDomain}.${getDomainName(
    window.location.hostname,
  )}`;

  const stayUrl = `${window.location.protocol}//${currentSessionHostname}`;

  const removeSocketListeners = () => {
    const userProfileData = getProfileDataForChat();
    if (userProfileData && userProfileData.notificationSocket) {
      const { notificationSocket } = userProfileData;
      notificationSocket.off(NOTIFICATION_SOCKET_EVENTS.ON_EVENTS.NOTIFICATION);
    }
  };

  const handleSignoutHandler = () => {
    if (profile && profile.notificationSocket) {
      removeSocketListeners();
      profile.notificationSocket.emit(
        NOTIFICATION_SOCKET_EVENTS.EMIT_EVENTS.DISCONNECT,
        (code, error) => {
          console.log('Notification Socket - Disconnecting User', code, error);
        },
      );
      profile.notificationSocket.disconnect();
    }

    sessionStorage.clear();
    logoutClearUtil();

    const queryParamsObject = {};
    if (searchParams?.size) {
      searchParams?.forEach((value, key) => {
        queryParamsObject[key] = value;
      });
    }

    delete queryParamsObject?.ide; // isDomainExist
    delete queryParamsObject?.cad; // current active domain

    const nextSearchParams = isEmpty(queryParamsObject) ? EMPTY_STRING : `?${new URLSearchParams(queryParamsObject)}`;

    window.location.href = `${window.location.origin}${window.location.pathname}${nextSearchParams}`; // redirect to signin page ide = isDomainExist, cad = current active domain
  };

  const handleNewDomainRedirect = () => {
    setIsRedirectLoading(true);
    clearSessionDetails()
      .then(() => {
        handleSignoutHandler();
      })
      .catch(() => handleSignoutHandler());
  };

  if (isRedirectLoading) return <FullPageLoader isDataLoading />;

  return (
    <div
      className={cx(
        styles.OuterClassName,
        BS.D_FLEX,
        BS.FLEX_COLUMN,
        BS.JC_CENTER,
        BS.ALIGN_ITEM_CENTER,
      )}
    >
      <Image src={workhallImg} className={styles.WorkhallImg} />
      <Image src={sessionTransition} className={styles.TransitionImg} />
      <Title
        alignment={ETitleAlign.middle}
        content={t(SESSION_TRANSITION_STRINGS.TITLE)}
        size={ETitleSize.medium}
      />
      <Text
        content={t(SESSION_TRANSITION_STRINGS.SUB_TITLE)}
        size={ETextSize.MD}
      />
      <Text
        content={
          <span>
            {t(SESSION_TRANSITION_STRINGS.CURRENT_SESSION)}
            <span className={cx(gClasses.FontWeight500, gClasses.ML4)}>
              {currentSessionHostname}
            </span>
          </span>
        }
        size={ETextSize.MD}
        className={gClasses.MT16}
      />
      <Text
        content={
          <span>
            {t(SESSION_TRANSITION_STRINGS.NEXT_SESSION)}
            <span className={cx(gClasses.FontWeight500, gClasses.ML4)}>
              {window.location.hostname}
            </span>
          </span>
        }
        size={ETextSize.MD}
      />
      <a tabIndex={0} href={stayUrl} className={styles.StayLinkOuter}>
        <Text
          content={
            <span className={cx(styles.StayLink, gClasses.FontWeight500)}>
              {t(SESSION_TRANSITION_STRINGS.STAY)}
              {stayUrl}
            </span>
          }
          size={ETextSize.MD}
          className={cx(gClasses.MT24, gClasses.CursorPointer)}
        />
      </a>
      <Button
        buttonText={`${t(SESSION_TRANSITION_STRINGS.PROCEED)} ${
          window.location.origin
        }`}
        size={EButtonSizeType.MD}
        type={EButtonType.PRIMARY}
        className={gClasses.MT16}
        onClickHandler={handleNewDomainRedirect}
      />
    </div>
  );
}

export default SessionTransition;
