import React, { useContext } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from 'components/auth_layout/AuthLayout.module.scss';
import { Link } from 'react-router-dom';
import * as ROUTE_CONSTANTS from 'urls/RouteConstants';
import { useTranslation } from 'react-i18next';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import Button from '../../../components/form_components/button/Button';

import UserCard from '../../../components/user_card/UserCard';

import { BUTTON_TYPE } from '../../../utils/Constants';

import gClasses from '../../../scss/Typography.module.scss';
import { ICON_STRINGS, SIGN_IN_STRINGS } from '../SignIn.strings';
import ThemeContext from '../../../hoc/ThemeContext';
import OnethingLogo from '../../../assets/icons/OnethingLogo';
import OnethingLogoSmall from '../../../assets/icons/OneThingLogoSmall';

function UserAccountSelection(props) {
  const { onNextClicked, errors, accounts, selectedAccountId, onAccountClick, form_details, isSigninFromSubDomain } = props;
  const getUserNameOrEmail = () => {
    if (isSigninFromSubDomain) return (`${form_details.username_or_email}`);
    else {
      if (form_details.is_email_signin) {
        return (`${form_details.email}`);
      } else {
        return `${form_details.userName}`;
      }
    }
  };
  const { t } = useTranslation();
  const { colorScheme } = useContext(ThemeContext);

  return (
    <>
      <h1 className={cx(gClasses.FTwo24GrayV3, BS.TEXT_CENTER, gClasses.FontWeight600, styles.SignInHeader)}>
      {form_details?.acc_logo ? (
          <div className={styles.Imageclass}>
          <img src={form_details?.acc_logo} alt="" className={styles.AccountLogo} />
          </div>
        ) : (
        <div>
          <OnethingLogo className={cx(styles.Logo)} title={ICON_STRINGS.LOGO_SMALL} />
          <OnethingLogoSmall
            className={cx(gClasses.CursorPointer, styles.SmallLogo)}
            isBlack
            title={ICON_STRINGS.LOGO_SMALL}
          />
        </div>
        )}
      </h1>
      <div
        className={cx(
          gClasses.FontWeight600,
          gClasses.FTwo16GrayV3,
          gClasses.MT5,
          gClasses.WordBreakBreakWord,
          BS.TEXT_CENTER,
        )}
      >
        {getUserNameOrEmail()}

      </div>
      <div
        className={cx(gClasses.CenterH, gClasses.MT5)}
      >
        <Link
        style={{
          color: form_details?.isCustomTheme && colorScheme?.activeColor,
        }}
          className={cx(gClasses.FOne13BlueV2, gClasses.Underline, gClasses.CursorPointer, gClasses.ClickableElement, styles.TryAnotherAccount)}
          // onClick={onSwitchAccountClicked}
          id={SIGN_IN_STRINGS.FORM_LABEL.SWITCH_ACCOUNT_BUTTON.ID}
          to={ROUTE_CONSTANTS.SIGNIN}
        >
          {t(SIGN_IN_STRINGS.TRY_ANOTHER_ACCOUNT)}
        </Link>
      </div>
      <form className={gClasses.MT30}>
        <h2
        className={cx(gClasses.MT10, gClasses.FOne13GrayV2)}
        >
        {t(SIGN_IN_STRINGS.CHOOSE_ACCOUNT)}
        </h2>
        {console.log('LOPDKDKDKD', accounts)}
        <div role="radiogroup">
        {accounts.map((account) => (
          <div key={account._id + account.username}>
            <UserCard
              withCheckbox
              firstName={account.first_name}
              lastName={account.last_name}
              userName={account.username}
              accountName={account.account_name}
              accountDomain={account.account_domain}
              selectedAccountId={selectedAccountId}
              onClick={() => onAccountClick(account._id, account.account_domain, account.email, account.username)}
              errors={errors}
              accountId={account._id + account.username}
              className={cx(gClasses.MT10, account._id !== selectedAccountId && gClasses.CursorPointer)}
              ariaHidden="true"
            />
          </div>
        ))}
        </div>
        {errors.account_id && <div className={cx(gClasses.FOne12RedV2)} role={ARIA_ROLES.ALERT}>{errors.account_id}</div>}
        <div className={styles.ContinueButtonContainer}>
          <Button
            id={SIGN_IN_STRINGS.FORM_LABEL.PRE_SIGN_IN_BUTTON.ID}
            buttonType={BUTTON_TYPE.AUTH_PRIMARY}
            onClick={(event) => onNextClicked(event)}
            // autoFocus
            style={{
              backgroundColor: form_details?.isCustomTheme && colorScheme?.activeColor,
            }}
          >
            {t(SIGN_IN_STRINGS.FORM_LABEL.PRE_SIGN_IN_BUTTON.LABEL)}
          </Button>
        </div>
      </form>
    </>
  );
}
UserAccountSelection.defaultProps = {
  errors: {},
  accounts: [],
};

UserAccountSelection.propTypes = {
  errors: PropTypes.objectOf(PropTypes.any),
  onNextClicked: PropTypes.func.isRequired,
  onAccountClick: PropTypes.func.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.any),
  selectedAccountId: PropTypes.string.isRequired,
};
export default UserAccountSelection;
