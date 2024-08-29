import React, { useEffect, useState, useRef, useContext } from 'react';
import { withRouter } from 'react-router';

// Components
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import AuthLayout from '../../../components/auth_layout/AuthLayout';

// Assets and functions
import { get, isEmpty } from '../../../utils/jsUtility';

// Constants
import { AUTH_PAGE_TYPES, FORM_POPOVER_STATUS, PRODUCTION } from '../../../utils/Constants';
import { validateInviteUser } from '../../../axios/apiService/signIn.apiService';
import { getInviteUserIdFromParams, getUserNameFromResponse, getUserProfileIdFromResponse, setAccounDomainCookie, setUsernameCookie } from './inviteUser.selectors';
import { INVITE_USER_STEPS } from './inviteUser.constant';
import NewPassword from './newPassword/newPassword';
import FullPageLoader from '../../../assets/icons/FullPageLoader';
// eslint-disable-next-line import/no-cycle
import UpdateInviteUserProfile from './update_invite_user_profile/updateInviteUserProfile';
import FormStatusPopover from '../../../components/popovers/form_status_popover/FormStatusPopover';
import { consturctTheme, showToastPopover } from '../../../utils/UtilityFunctions';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { getDmsLinkForPreviewAndDownload } from '../../../utils/attachmentUtils';
import { SIGN_IN_STRINGS } from '../SignIn.strings';
import ThemeContext from '../../../hoc/ThemeContext';
import { changeLanguage } from '../../../language/config';
import { signInSetStateAction, verifyUrlAction } from '../../../redux/actions/SignIn.Action';

function InviteUser(props) {
  const { location, history } = props;
  const usernameTemp = get(location, ['state', 'username'], '');
  const userIdTemp = get(location, ['state', 'id'], '');
  const isLoadingTemp = isEmpty(usernameTemp);
  const inviteUserStepTemp = isEmpty(usernameTemp) ? INVITE_USER_STEPS.CREATE_PASSWORD : INVITE_USER_STEPS.UPDATE_PROFILE;
  const [username, setUsername] = useState(usernameTemp);
  const [isLoading, setIsLoading] = useState(isLoadingTemp);
  const [inviteUserStep, setInviteUserStep] = useState(inviteUserStepTemp);
  const [error, setError] = useState({});
  const [userId, setUserId] = useState(userIdTemp);
  const popoverRef = useRef(null);
  const { i18n } = useTranslation();
  const { setColorScheme } = useContext(ThemeContext);

  useEffect(() => {
      const { match, signInSetState, dispatch } = props;
      const query = new URLSearchParams(window.location.search);
      const isManualRoute = query.get('isManualLogin');
      if (isEmpty(isManualRoute)) {
        validateInviteUser({ token: getInviteUserIdFromParams(match) }).then((response) => {
          console.log(response, 'response');

          if (process.env.NODE_ENV === PRODUCTION) {
            setAccounDomainCookie(response);
            setUsernameCookie(response);
          }
          setUsername(getUserNameFromResponse(response));
          setUserId(getUserProfileIdFromResponse(response));
          dispatch(verifyUrlAction()).then((resData) => {
            console.log(resData, 'resData');
            if (!isEmpty(resData)) {
              let acc_logo = EMPTY_STRING;
              if (resData.acc_logo) {
                acc_logo = `${getDmsLinkForPreviewAndDownload(
                  history,
                )}${SIGN_IN_STRINGS.PUBLIC_DMS_LINK}${resData.acc_logo}`;
              }
              const accountLocaleList = [];
              if (!isEmpty(resData?.acc_locale)) {
                resData.acc_locale.forEach((locale) => {
                  const account_locale = {
                    label: locale?.split('-')[0].toUpperCase(),
                    value: locale,
                  };
                  accountLocaleList.push(account_locale);
                });
              }
                signInSetState({
                  acc_logo: acc_logo,
                  isCustomTheme: !!resData?.theme?.color,
                  pref_locale: resData?.primary_locale,
                  account_locale: accountLocaleList,
                });
                localStorage.setItem('application_language', resData?.pref_locale || resData?.primary_locale);
                i18n.changeLanguage(resData?.pref_locale || resData?.primary_locale);
                changeLanguage(resData?.pref_locale || resData?.primary_locale);
                setColorScheme && setColorScheme(consturctTheme(resData?.theme?.color));
            }
          });
          setIsLoading(false);
        }, (err) => {
          setIsLoading(false);
          setError(err);
          showToastPopover(
            'Something went wrong',
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        });
      } else {
        setIsLoading(false);
      }
  }, []);
  let innerContainer;
  let innerContainerStyle;
  console.log('vsfavbava', inviteUserStep, username);
  if (username) {
    if (inviteUserStep === INVITE_USER_STEPS.CREATE_PASSWORD) {
      const { match } = props;
      innerContainer = <NewPassword id={getInviteUserIdFromParams(match)} username={username} setInviteUserStep={setInviteUserStep} history={history} />;
    }
    if (inviteUserStep === INVITE_USER_STEPS.UPDATE_PROFILE) {
      innerContainer = (<UpdateInviteUserProfile
                          userId={userId}
                          username={username}
      />);
      innerContainerStyle = { width: 600 };
    }
  } else {
    return isEmpty(error) ? <FullPageLoader isDataLoading /> : <h1>Link invalid or Expired</h1>;
  }

  return isLoading ? <FullPageLoader isDataLoading /> : (
    <>
      <FormStatusPopover popoverRef={popoverRef} />
      <AuthLayout innerContainerStyle={innerContainerStyle} navBarType={AUTH_PAGE_TYPES.RESET_PASSWORD} innerContainer={innerContainer} />
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    signInSetState: (value) => {
      dispatch(signInSetStateAction(value));
    },
    dispatch,
  };
};

export default withRouter(connect(null, mapDispatchToProps)(InviteUser));
