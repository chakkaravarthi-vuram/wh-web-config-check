import React from 'react';
import cx from 'classnames/bind';
import { Link } from 'react-router-dom';

import OnethingLogoSmall from 'assets/icons/OneThingLogoSmall';
import styles from 'components/auth_layout/AuthLayout.module.scss';
import { ICON_STRINGS } from 'containers/sign_in/SignIn.strings';
import { useTranslation } from 'react-i18next';
import * as ROUTE_CONSTANTS from '../../urls/RouteConstants';
import gClasses from '../../scss/Typography.module.scss';

import { ARIA_ROLES, BS } from '../../utils/UIConstants';
import { PRIVACY_POLICY_ELEMENT } from './PrivacyPolicy.strings';
import OnethingLogo from '../../assets/icons/OnethingLogo';

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <div className={cx(BS.D_FLEX, gClasses.FlexDirectionColumn, gClasses.Height100Vh)}>
      <div className={cx(BS.W100, styles.Header, BS.D_FLEX, BS.ALIGN_ITEM_CENTER)} role={ARIA_ROLES.BANNER}>
        <Link to={ROUTE_CONSTANTS.HOME} role={ARIA_ROLES.LINK} aria-label="go to workhall signin page">
          <OnethingLogo
          className={cx(gClasses.CursorPointer, styles.Logo)}
          title={ICON_STRINGS.LOGO_SMALL}
          />
          <OnethingLogoSmall
          className={cx(gClasses.CursorPointer, styles.SmallLogo)}
          isBlack
          title={ICON_STRINGS.LOGO_SMALL}
          />
        </Link>
      </div>
      {PRIVACY_POLICY_ELEMENT(t)}
    </div>
  );
}
