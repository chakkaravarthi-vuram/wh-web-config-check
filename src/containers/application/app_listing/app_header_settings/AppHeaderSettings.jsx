import React, { useEffect, useState } from 'react';
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
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import Button, {
  BUTTON_TYPE,
} from '../../../../components/form_components/button/Button';
import CloseIcon from '../../../../assets/icons/task/CloseIcon';
import style from './AppHeaderSettings.module.scss';
import { APP_OPTION_VALUE, APP_HEADER_SETTINGS } from '../AppList.constants';
import AppHeaderDisplay from './app_header_display/AppHeaderDisplay';
import AppOrderSettings from './app_order_settings/AppOrderSettings';
import { updateAdminProfileData } from '../../../../redux/actions/Actions';
import { applicationStateChange } from '../../../../redux/reducer/ApplicationReducer';
import { setAppHeaderType } from '../../../../utils/UtilityFunctions';

function AppHeaderSettings(props) {
  const {
    isModalOpen,
    closeAppHeaderModel,
    updateHeaderSetting,
    selectedPopper,
    isHeaderSetting,
    headerType,
    setHeaderType,
    appOrder,
    appStateChange,
  } = props;
  const { t } = useTranslation();
  const { TITLE, DISPLAY_SETTINGS, APP_ORDER_TITLE, BUTTON } = APP_HEADER_SETTINGS(t);
  const [initialHeaderDisplay, setInitialHeaderDisplay] = useState(null);

  useEffect(() => {
    setInitialHeaderDisplay(headerType);
  }, []);

  const onClose = () => {
    setHeaderType(initialHeaderDisplay);
    closeAppHeaderModel();
  };

  const headerComponent = (
    <div
      className={cx(
        BS.D_FLEX,
        BS.JC_BETWEEN,
        BS.W100,
        gClasses.PositionRelative,
      )}
    >
      <Title
        className={gClasses.FTwo20BlackV12}
        content={isHeaderSetting ? TITLE : APP_ORDER_TITLE}
        headingLevel={ETitleHeadingLevel.h3}
        size={ETitleSize.medium}
      />
      <button
        className={cx(gClasses.PositionAbsolute, style.CloseIcon)}
        onClick={onClose}
      >
        <CloseIcon />
      </button>
    </div>
  );

  const getCurrentTabContent = () => {
    let currentTab;
    if (selectedPopper === APP_OPTION_VALUE.HEADER_SETTINGS) {
      currentTab = (
        <AppHeaderDisplay
          headerType={headerType}
          setHeaderType={setHeaderType}
        />
      );
    } else if (selectedPopper === APP_OPTION_VALUE.ORDER_SETTINGS) {
      currentTab = <AppOrderSettings appOrder={appOrder} appStateChange={appStateChange} />;
    }
    return currentTab;
  };

  const mainComponent = (
    <div>
      <Title
        className={cx(gClasses.FTwo20BlackV12, style.MainTitle, gClasses.MB14)}
        content={
          isHeaderSetting
            ? DISPLAY_SETTINGS.LABEL
            : DISPLAY_SETTINGS.APP_ORDER_LABEL
        }
        headingLevel={ETitleHeadingLevel.h5}
        size={ETitleSize.xs}
      />
      {getCurrentTabContent()}
    </div>
  );

  const footerComponent = (
    <div className={cx(BS.D_FLEX, BS.JC_END, BS.W100, gClasses.MB30)}>
      <Button
        buttonType={BUTTON_TYPE.LIGHT}
        className={cx(BS.TEXT_NO_WRAP, gClasses.MR10)}
        onClick={onClose}
        removePadding
      >
        {BUTTON.CANCEL}
      </Button>
      <LibraryButton
        buttonText="Save"
        type={EButtonType.PRIMARY}
        onClickHandler={(e) => updateHeaderSetting(e, () => setInitialHeaderDisplay(headerType))}
      />
    </div>
  );

  return (
    <Modal
      id="app_header_settings"
      isModalOpen={isModalOpen}
      modalStyle={ModalStyleType.modal}
      modalSize={ModalSize.md}
      className={style.AppHeaderSettingModel}
      headerContent={headerComponent}
      headerContentClassName={cx(gClasses.MY24, gClasses.ML40)}
      mainContent={mainComponent}
      mainContentClassName={cx(gClasses.ML40)}
      footerContent={footerComponent}
      footerContentClassName={cx(
        gClasses.MR15,
        gClasses.ML30,
        style.FooterContent,
      )}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    headerType: state.RoleReducer.app_header_type,
    appOrder: state.ApplicationReducer.appOrder,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setHeaderType: setAppHeaderType,
    updateAdminProfileData: (adminProfileData) => {
      dispatch(updateAdminProfileData(adminProfileData));
    },
    appStateChange: (data) => {
      dispatch(applicationStateChange(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppHeaderSettings);
