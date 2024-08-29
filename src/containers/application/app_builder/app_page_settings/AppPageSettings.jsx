import React, { useState } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  ETitleHeadingLevel,
  ETitleSize,
  Title,
  Button as LibraryButton,
  EButtonType,
  Modal,
  ModalStyleType,
  ModalSize,
  Tab,
  ETabVariation,
} from '@workhall-pvt-lmt/wh-ui-library';
import { BS, ARIA_ROLES } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import CloseIcon from 'assets/icons/CloseIcon';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import Button from 'components/form_components/button/Button';
import style from './AppPageSettings.module.scss';
import { BUTTON_TYPE } from '../../../../utils/Constants';
import {
  APP_PAGE_SETTINGS,
  APP_PAGE_SETTINGS_TAB_VALUE,
} from '../AppBuilder.strings';
import { applicationComponentDataChange } from '../../../../redux/reducer/ApplicationReducer';
import {
  getUsersAndTeamsApiThunk,
  getUsersApiThunk,
} from '../../../../redux/actions/Appplication.Action';
import PageSettingsBasic from './page_settings_basic/PageSetingsBasic';
import PageSettingsSecurity from './page_settings_security/PageSettingsSecurity';
import {
  appPageSchema,
  getPageSettingsValidationData,
} from '../../application.validation.schema';
import jsUtility from '../../../../utils/jsUtility';
import { validate } from '../../../../utils/UtilityFunctions';

function AppPageSettings(props) {
  const {
    activePageData,
    updatePageNameSettings,
    isPageSettingsModelOpen,
    activeAppData,
    appPageConfigDataChange,
    currentPageConfig,
    appPageSettingClear,
  } = props;
  const { t } = useTranslation();
  const { TITLE, TAB, BUTTONS, SECURITY, BASIC } = APP_PAGE_SETTINGS(t);
  const [selectedTabIndex, setSelectedTabIndex] = useState(
    TAB.OPTIONS[0].tabIndex,
  );
  const [initialPageSettings] = useState(currentPageConfig);

  const closeBasicDetailsModal = () => {
    appPageConfigDataChange(initialPageSettings);
    appPageConfigDataChange({ isPageSettingsModelOpen: false });
    appPageSettingClear();
  };

  const onTabChange = (value) => {
    const tabIndex = Number(value);
    if (tabIndex !== selectedTabIndex) {
      const errorList = validate(
        getPageSettingsValidationData(currentPageConfig),
        appPageSchema(t),
      );
      const isBasicError =
        errorList[BASIC.PAGE_NAME.ID] || errorList[BASIC.PAGE_URL.ID];
      const isSecurityError = errorList[SECURITY.PAGE_VIEWERS.ID];
      if (
        jsUtility.isEmpty(errorList) ||
        (selectedTabIndex === APP_PAGE_SETTINGS_TAB_VALUE.BASIC &&
          !isBasicError) ||
        (selectedTabIndex === APP_PAGE_SETTINGS_TAB_VALUE.SECURITY &&
          !isSecurityError)
      ) {
        setSelectedTabIndex(tabIndex);
      } else {
        appPageConfigDataChange({ errorList });
      }
    }
  };

  const headerComponent = (
    <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.W100)}>
      <Title
        className={cx(gClasses.FTwo20BlackV12)}
        content={TITLE}
        headingLevel={ETitleHeadingLevel.h3}
        size={ETitleSize.medium}
      />
      <CloseIcon
        className={cx(style.CloseIcon, BS.JC_END, gClasses.CursorPointer)}
        onClick={closeBasicDetailsModal}
        role={ARIA_ROLES.BUTTON}
        tabIndex={0}
        ariaLabel={BUTTONS.ARIA_LABEL}
        onKeyDown={(e) =>
          keydownOrKeypessEnterHandle(e) && closeBasicDetailsModal()
        }
      />
    </div>
  );

  const getCurrentSettingsTab = () => {
    if (selectedTabIndex === APP_PAGE_SETTINGS_TAB_VALUE.BASIC) {
      return (
        <PageSettingsBasic
          currentPageConfig={currentPageConfig}
          activePageData={activePageData}
          appPageConfigDataChange={appPageConfigDataChange}
          activeAppData={activeAppData}
        />
      );
    } else if (selectedTabIndex === APP_PAGE_SETTINGS_TAB_VALUE.SECURITY) {
      return (
        <PageSettingsSecurity
          activePageData={activePageData}
          activeAppData={activeAppData}
          currentPageConfig={currentPageConfig}
          appPageConfigDataChange={appPageConfigDataChange}
        />
      );
    }
    return null;
  };

  const mainComponent = (
    <div className={BS.W100}>
      <Tab
        options={TAB.OPTIONS}
        selectedTabIndex={Number(selectedTabIndex)}
        variation={ETabVariation.primary}
        onClick={onTabChange}
        className={style.Tab}
        bottomSelectionClass={style.ActiveBar}
        textClass={style.TabText}
        tabContainerClass={style.TabZindex}
      />
      {getCurrentSettingsTab()}
    </div>
  );

  const footerComponent = (
    <div className={cx(BS.D_FLEX, BS.JC_END, BS.W100)}>
      <Button
        buttonType={BUTTON_TYPE.LIGHT}
        className={cx(BS.TEXT_NO_WRAP, gClasses.MR20)}
        onClick={closeBasicDetailsModal}
        removePadding
      >
        {BUTTONS.DISCARD}
      </Button>
      <LibraryButton
        buttonText={BUTTONS.SAVE}
        type={EButtonType.PRIMARY}
        onClick={updatePageNameSettings}
      />
    </div>
  );

  return (
    <Modal
      id="app_page_name_settings"
      isModalOpen={isPageSettingsModelOpen}
      modalStyle={ModalStyleType.modal}
      modalSize={ModalSize.md}
      className={style.AppPageSettingsModal}
      headerContent={headerComponent}
      headerContentClassName={cx(BS.D_FLEX, gClasses.M15, gClasses.ML40)}
      mainContent={mainComponent}
      // mainContentClassName={cx(BS.D_FLEX, gClasses.M15, gClasses.MX40)}
      mainContentClassName={cx(BS.D_FLEX)}
      footerContent={footerComponent}
      footerContentClassName={cx(
        gClasses.M15,
        gClasses.ML30,
        style.FooterContent,
      )}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    activeAppData: state.ApplicationReducer.activeAppData,
    activePageData: state.ApplicationReducer.activeAppData.activePageData,
    usersAndTeamsData: state.ApplicationReducer.usersAndTeamsData,
    customPageSecurity: state.ApplicationReducer.customPageSecurity,
    appUrlPath: state.ApplicationReducer.activeAppData.url_path,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    appComponentDataChange: (data) => {
      dispatch(applicationComponentDataChange(data));
    },
    getUsersApi: (props, setCancelToken) => {
      dispatch(getUsersApiThunk(props, setCancelToken));
    },
    getUsersAndTeamsApi: (props, setCancelToken) => {
      dispatch(getUsersAndTeamsApiThunk(props, setCancelToken));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppPageSettings);
