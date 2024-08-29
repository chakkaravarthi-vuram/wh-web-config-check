import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalStyleType,
  Title,
  ETitleHeadingLevel,
  ETitleSize,
  TextInput,
  TextArea,
  Size,
  Button as LibraryButton,
  EButtonType,
  ModalSize,
  Anchor,
} from '@workhall-pvt-lmt/wh-ui-library';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import gClasses from 'scss/Typography.module.scss';
import { cloneDeep } from 'utils/jsUtility';
import { validate } from 'utils/UtilityFunctions';
import { applicationDataChange } from 'redux/reducer/ApplicationReducer';
import styles from './AppBasicDetails.module.scss';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import jsUtility, { isEmpty } from '../../../utils/jsUtility';
import { getUsersApiThunk, saveAppApiThunk } from '../../../redux/actions/Appplication.Action';
import CloseIcon from '../../../assets/icons/CloseIcon';
import { applicationDataClear } from '../../../redux/reducer/ApplicationReducer';
import { createAppValidationSchema } from '../create_app/CreateApp.validation';
import { CREATE_APP_STRINGS } from '../create_app/CreateApp.strings';
import { CancelToken, keydownOrKeypessEnterHandle } from '../../../utils/UtilityFunctions';
import { APP } from '../../../urls/RouteConstants';
import UserPicker from '../../../components/user_picker/UserPicker';
import { ALLOWED_APP_TEAM_TYPE, ALLOWED_APP_USER_TYPE, ALL_DEVELOPERS_TEAM_CODE, APPLICATION_STRINGS } from '../application.strings';
import { APP_PAGE_SETTINGS } from '../app_builder/AppBuilder.strings';

const cancelToken = new CancelToken();
const cancelViewerToken = new CancelToken();

function AppSettings(props) {
  const { applicationDataChange, activeAppData, saveAppApi, activeAppData: { admins, viewers } } = props;
  const history = useHistory();
  const { errorList = {} } = cloneDeep(activeAppData);
  const [initialBasicDetails, setInitialBasicDetails] = useState({});
  const { t } = useTranslation();
  const { SECURITY } = APP_PAGE_SETTINGS(t);
  const siteUrl = `${window.location.origin}${APP}`;

  useEffect(() => {
    setInitialBasicDetails(activeAppData);
  }, []);

  const onChangeHandlers = (event, type) => {
    const clonedState = cloneDeep(activeAppData);
    switch (type) {
      case CREATE_APP_STRINGS(t).APP_NAME.ID:
        clonedState.name = event?.target?.value;
        const url_path = jsUtility.join(jsUtility.split(event?.target?.value?.trim()?.toLowerCase(), ' '), '-');
        clonedState.url_path = url_path;
        if (clonedState?.errorList[CREATE_APP_STRINGS(t).APP_NAME.ID]) delete clonedState.errorList[CREATE_APP_STRINGS(t).APP_NAME.ID];
        if (clonedState?.errorList[CREATE_APP_STRINGS(t).APP_URL.ID]) delete clonedState.errorList[CREATE_APP_STRINGS(t).APP_URL.ID];
      break;
      case CREATE_APP_STRINGS(t).APP_DESCRIPTION.ID:
        clonedState.description = event?.target?.value;
        if (clonedState?.errorList[CREATE_APP_STRINGS(t).APP_DESCRIPTION.ID]) delete clonedState.errorList[CREATE_APP_STRINGS(t).APP_DESCRIPTION.ID];
      break;
      case CREATE_APP_STRINGS(t).APP_URL.ID:
        clonedState.url_path = event?.target?.value;
        if (clonedState?.errorList[CREATE_APP_STRINGS(t).APP_URL.ID]) delete clonedState.errorList[CREATE_APP_STRINGS(t).APP_URL.ID];
      break;
      default: break;
    }
    applicationDataChange?.(cloneDeep(clonedState));
  };

  const updateAppBasicDetails = () => {
    const appAdmins = {};
    if (activeAppData?.admins?.teams && activeAppData?.admins?.teams?.length > 0) {
      appAdmins.teams =
      activeAppData?.admins?.teams?.map((team) => team._id);
    }

    if (activeAppData?.admins?.users && activeAppData?.admins?.users?.length > 0) {
      appAdmins.users =
      activeAppData?.admins?.users?.map((user) => user._id);
    }

    const appViewers = {};
    appViewers.teams = activeAppData?.viewers?.teams?.map((team) => team._id);

    const data = {
      _id: activeAppData?.id,
      app_uuid: activeAppData?.app_uuid,
      name: activeAppData?.name?.trim(),
     ...(!isEmpty(activeAppData?.description) ? { description: activeAppData?.description } : null),
      url_path: activeAppData?.url_path,
      admins: appAdmins,
      viewers: appViewers,
    };
    const createAppErrorList = validate(data, createAppValidationSchema(t));
    if (isEmpty(createAppErrorList)) {
      saveAppApi(data, t, history);
    } else applicationDataChange({ errorList: { ...errorList, ...createAppErrorList } });
  };

  useEffect(() => {
    setInitialBasicDetails(activeAppData);
  }, []);

  const closeBasicDetailsModal = () => {
    const clonedState = cloneDeep(activeAppData);
    clonedState.name = initialBasicDetails?.name;
    clonedState.description = initialBasicDetails?.description;
    clonedState.admins = initialBasicDetails?.admins;
    clonedState.viewers = initialBasicDetails?.viewers;
    applicationDataChange?.({ ...cloneDeep(clonedState), isBasicSettingsModalOpen: false, errorList: {} });
  };

  const headerComponent = (
    <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.W100)}>
      <Title
          className={cx(gClasses.FTwo20BlackV12)}
          content={CREATE_APP_STRINGS(t).BASIC_SETTINGS.TITLE}
          headingLevel={ETitleHeadingLevel.h3}
          size={ETitleSize.medium}
      />
      <CloseIcon
        className={cx(styles.CloseIcon, BS.JC_END, gClasses.CursorPointer)}
        onClick={closeBasicDetailsModal}
        role={ARIA_ROLES.BUTTON}
        tabIndex={0}
        ariaLabel="Close App Mo"
        onKeyDown={(e) =>
          keydownOrKeypessEnterHandle(e) && closeBasicDetailsModal()
        }
      />
    </div>
  );

  const onViewersTeamSelect = (member) => {
    const viewersData = jsUtility.cloneDeep(viewers);
    const errorData = jsUtility.cloneDeep(errorList);
    if (!jsUtility.find(viewersData?.teams, { _id: member?._id })) {
      viewersData.teams = [...viewersData.teams, member];
      if (errorData?.[SECURITY.PAGE_VIEWERS.ID]) delete errorData?.[SECURITY.PAGE_VIEWERS.ID];
      applicationDataChange({ viewers: viewersData, errorList: errorData });
    }
  };

  const onViewersTeamRemoveHandle = (removeId) => {
    const viewersData = jsUtility.cloneDeep(viewers);
    if (jsUtility.find(viewersData?.teams, { _id: removeId })) {
      jsUtility.remove(viewersData?.teams, { _id: removeId });
    }
    applicationDataChange({ viewers: viewersData });
  };

  const onAdminUsersSelect = (member) => {
    const adminData = jsUtility.cloneDeep(admins);
    const errorData = jsUtility.cloneDeep(errorList);
    if (member?.username && !jsUtility.find(adminData?.users, { _id: member?._id })) {
      adminData.users = [...adminData.users, member];
    } else if (!jsUtility.find(adminData?.teams, { _id: member?._id })) {
      adminData.teams = [...adminData.teams, member];
    }
    if (errorData?.[CREATE_APP_STRINGS(t).APP_ADMINS.ID]) delete errorData?.[CREATE_APP_STRINGS(t).APP_ADMINS.ID];
    applicationDataChange({ admins: adminData, errorList: errorData });
  };

  const onAdminUsersRemoveHandle = (removeId) => {
    const adminData = jsUtility.cloneDeep(admins);
    if (jsUtility.find(adminData?.users, { _id: removeId })) {
      jsUtility.remove(adminData?.users, { _id: removeId });
    } else if (jsUtility.find(adminData?.teams, { _id: removeId })) {
      jsUtility.remove(adminData?.teams, { _id: removeId });
    }
    applicationDataChange({ admins: adminData });
  };

  const mainComponent = (
      <div className={BS.W100}>
          <TextInput
            id={CREATE_APP_STRINGS(t).APP_NAME.ID}
            value={activeAppData?.name}
            labelText={CREATE_APP_STRINGS(t).APP_NAME.LABEL}
            isLoading={false}
            placeholder={CREATE_APP_STRINGS(t).APP_NAME.PLACEHOLDER}
            className={cx(BS.D_FLEX, gClasses.FirstChild100)}
            labelClassName={gClasses.FTwo12BlackV20}
            inputInnerClassName={BS.W100}
            onChange={(e) => {
              console.log('applicationDataChangeonChange', e?.target?.value);
              onChangeHandlers(e, CREATE_APP_STRINGS(t).APP_NAME.ID);
            }}
            errorMessage={errorList[CREATE_APP_STRINGS(t).APP_NAME.ID]}
            required
          />
          <TextArea
            id={CREATE_APP_STRINGS(t).APP_DESCRIPTION.ID}
            value={activeAppData?.description}
            labelText={CREATE_APP_STRINGS(t).APP_DESCRIPTION.LABEL}
            isLoading={false}
            placeholder={CREATE_APP_STRINGS(t).APP_DESCRIPTION.PLACEHOLDER}
            className={cx(styles.AppName, BS.D_FLEX, gClasses.FirstChild100)}
            labelClassName={gClasses.FTwo12BlackV20}
            onChange={(e) => {
              onChangeHandlers(e, CREATE_APP_STRINGS(t).APP_DESCRIPTION.ID);
            }}
            errorMessage={errorList[CREATE_APP_STRINGS(t).APP_DESCRIPTION.ID]}
            // maxLength={2000}
            size={Size.sm}
          />
          <Anchor
            id={CREATE_APP_STRINGS(t).APP_URL.ID}
            className={cx(styles.AppName, styles.AppUrl)}
            labelText={CREATE_APP_STRINGS(t).APP_URL.LABEL}
            labelClassName={gClasses.FTwo12BlackV20}
            value={[{ link_url: activeAppData.url_path, link_text: siteUrl }]}
            onChange={(value) => {
              const e = { target: { value: value[0]?.link_url } };
              onChangeHandlers(e, CREATE_APP_STRINGS(t).APP_URL.ID);
            }}
            required
            errorMessage={[{ link_url: errorList[CREATE_APP_STRINGS(t).APP_URL.ID] }]}
            inputClassName={styles.AppUrlInput}
            inputInnerClassName={cx(styles.InputInnerClass, gClasses.NoPointerEvent)}
            linkClassName={styles.LinkClass}
            blockUrlPrefix
          />
          <UserPicker
            id={CREATE_APP_STRINGS(t).APP_ADMINS.ID}
            isSearchable
            labelClassName={gClasses.FTwo12BlackV20}
            required
            selectedValue={activeAppData?.admins}
            maxCountLimit={3}
            className={gClasses.PT16}
            labelText={CREATE_APP_STRINGS(t).APP_ADMINS.LABEL}
            errorMessage={errorList[CREATE_APP_STRINGS(t).APP_ADMINS.ID]}
            onSelect={onAdminUsersSelect}
            onRemove={onAdminUsersRemoveHandle}
            noDataFoundMessage={APPLICATION_STRINGS(t).SYSTEM_DIRECTORY.NO_TEAMS_ON_SEARCH}
            cancelToken={cancelToken}
            allowedUserType={ALLOWED_APP_USER_TYPE}
            extraParams={{ team_code: ALL_DEVELOPERS_TEAM_CODE }}
          />
          <UserPicker
            isSearchable
            required
            selectedValue={activeAppData?.viewers}
            labelClassName={gClasses.FTwo12BlackV20}
            maxCountLimit={3}
            className={gClasses.PT16}
            labelText={CREATE_APP_STRINGS(t).APP_VIEWERS.LABEL}
            onSelect={onViewersTeamSelect}
            onRemove={onViewersTeamRemoveHandle}
            noDataFoundMessage={APPLICATION_STRINGS(t).SYSTEM_DIRECTORY.NO_TEAMS_ON_SEARCH}
            cancelToken={cancelViewerToken}
            errorMessage={errorList[SECURITY.PAGE_VIEWERS.ID]}
            allowedTeamType={ALLOWED_APP_TEAM_TYPE}
            isTeams
          />
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
        {CREATE_APP_STRINGS(t).BASIC_SETTINGS.DISCARD}
      </Button>
      <LibraryButton
        buttonText={CREATE_APP_STRINGS(t).BASIC_SETTINGS.SAVE}
        type={EButtonType.PRIMARY}
        onClick={updateAppBasicDetails}
      />
    </div>
  );

  return (
      <Modal
        id="app_basic_settings"
        isModalOpen={activeAppData?.isBasicSettingsModalOpen}
        headerContent={headerComponent}
        headerContentClassName={cx(BS.D_FLEX, gClasses.M15, gClasses.ML30, gClasses.MT30)}
        mainContent={mainComponent}
        modalStyle={ModalStyleType.modal}
        className={styles.AppBasicDetailsModal}
        mainContentClassName={cx(BS.D_FLEX, gClasses.M15, gClasses.MX30)}
        modalSize={ModalSize.md}
        footerContent={footerComponent}
        footerContentClassName={cx(
          gClasses.M15,
          gClasses.MX30,
          styles.FooterContent,
        )}
      />
  );
}

const mapStateToProps = (state) => {
    return {
      activeAppData: state.ApplicationReducer.activeAppData,
      usersAndTeamsData: state.ApplicationReducer.usersAndTeamsData,
    };
};

AppSettings.propTypes = {
  applicationDataChange: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => {
  return {
    applicationDataChange: (props) => {
      dispatch(applicationDataChange(props));
    },
    saveAppApi: (props, translateFunction, history) => {
      dispatch(saveAppApiThunk(props, translateFunction, history));
    },
    applicationDataClear: () => {
      dispatch(applicationDataClear());
    },
    getUsersApi: (props, setCancelToken) => {
      dispatch(getUsersApiThunk(props, setCancelToken));
    },
  };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AppSettings);
