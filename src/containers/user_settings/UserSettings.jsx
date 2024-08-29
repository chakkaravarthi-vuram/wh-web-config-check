import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { useHistory } from 'react-router-dom';

import { historyPropType } from 'proptypes/routerPropTypes';
import { useTranslation } from 'react-i18next';
import { Modal, ModalSize, ModalStyleType } from '@workhall-pvt-lmt/wh-ui-library';
import UserProfile from './user_profile/UserProfile';
import LanguageTimeZoneSettings from './language_time_zone_settings/LanguageTimeZoneSettings';
import Password from './change_password/ChangePassword';
import MfaSetup from './mfa_settings/MFASetup';
import gClasses from '../../scss/Typography.module.scss';
import styles from './UserSettings.module.scss';

import {
  USER_SETTINGS_TAB,
  USER_SETTINGS_TAB_INDEX,
  USER_SETTINGS_STRINGS,
  USER_SETTINGS_TAB_NON_ADMIN,
} from './UserSettings.strings';
import { userSettingsDataChange, userSettingsClear } from '../../redux/actions/UserSettings.Action';
import TabViewLayout from '../../components/tab_view_layout/TabViewLayout';
import { routeNavigate, isBasicUserMode } from '../../utils/UtilityFunctions';
import { ROUTE_METHOD, ROLES } from '../../utils/Constants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import ApiKeySettings from './api_keys/ApiKeySettings';
import CloseVectorIcon from '../../assets/icons/create_app/create_modal/CloseVectorIcon';
import { BS } from '../../utils/UIConstants';

function UserSettings(props) {
  const {
    tab_index,
    role,
    isMfaEnabled,
  } = props;
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => () => {
    console.log('UserSettingsUseEffect');
    const { updateUserSettings } = props;
    updateUserSettings({ tab_index: USER_SETTINGS_TAB_INDEX.PROFILE });

    return () => {
      console.log('UserSettingsUseEffectCLEAR');
      const { clearUserSettingsState } = props;
      clearUserSettingsState();
    };
  }, []);
  console.log('propsss', props);

  const { t } = useTranslation();
  const userSettingsTabList = ((role === ROLES.MEMBER) || isBasicUserMode(history)) ?
    USER_SETTINGS_TAB_NON_ADMIN(t)
    : USER_SETTINGS_TAB(t);
  let current_component = null;

  switch (tab_index) {
    case USER_SETTINGS_TAB_INDEX.PROFILE:
      current_component = <UserProfile t={t} />;
      break;
    case USER_SETTINGS_TAB_INDEX.SETTINGS:
      current_component = <LanguageTimeZoneSettings t={t} />;
      break;
    case USER_SETTINGS_TAB_INDEX.PASSWORD:
      current_component = <Password t={t} />;
      break;
    case USER_SETTINGS_TAB_INDEX.SECURITY_SETTINGS:
      if (isMfaEnabled) {
        current_component = <MfaSetup t={t} />;
      } else {
        current_component = null;
      }
      break;
    case USER_SETTINGS_TAB_INDEX.API_KEY_SECURITY:
      current_component = <ApiKeySettings />;
      break;
    default:
      current_component = <UserProfile t={t} />;
      break;
  }

  const setTab = (index) => {
    const { updateUserSettings } = props;
    updateUserSettings({ tab_index: index });
  };

  const onCloseClickHandeler = () => {
    setIsModalOpen(false);
    const userSettingState = {
      userSettingsModal: false,
    };
    routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, EMPTY_STRING, userSettingState);
  };

  const headerContent = (
    <div className={cx(gClasses.CenterV, BS.JC_END, BS.W100)}>
      <button
        className={cx(gClasses.CenterV)}
        onClick={onCloseClickHandeler}
      >
        <CloseVectorIcon className={styles.CloseVector} />
      </button>
    </div>
  );

  return (
    isModalOpen &&
    <Modal
      modalStyle={ModalStyleType.modal}
      modalSize={ModalSize.lg}
      id="user_settings"
      isModalOpen={isModalOpen}
      onCloseClick={onCloseClickHandeler}
      mainContent={(
       <div className={styles.ModalContainer}>
        <TabViewLayout
          pageTitle={t(USER_SETTINGS_STRINGS.TITLE)}
          tabList={userSettingsTabList}
          onTabChange={setTab}
          selectedTabIndex={tab_index}
          currentComponent={current_component}
          titleWidth={styles.TitleWidth}
          headerContent={headerContent}
        />
       </div>
      )}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    tab_index: state.UserSettingsReducer.tab_index,
    isMfaEnabled: state.MfaReducer.isMfaEnabled,
    role: state.RoleReducer.role,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserSettings: (value) => {
      dispatch(userSettingsDataChange(value));
    },
    clearUserSettingsState: () => {
      dispatch(userSettingsClear());
    },
  };
};

UserSettings.propTypes = {
  updateUserSettings: PropTypes.func.isRequired,
  clearUserSettingsState: PropTypes.func.isRequired,
  tab_index: PropTypes.number,
  history: historyPropType.isRequired,
};
UserSettings.defaultProps = {
  tab_index: USER_SETTINGS_TAB_INDEX.PROFILE,
};
export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
