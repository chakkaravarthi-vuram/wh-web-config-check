import React, { useContext, useEffect } from 'react';
import {
  Modal,
  ModalStyleType,
  Title,
  ETitleHeadingLevel,
  ETitleSize,
  TextInput,
  TextArea,
  Size,
  Button,
  EButtonType,
  ModalSize,
  Variant,
  Anchor,
} from '@workhall-pvt-lmt/wh-ui-library';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import cx from 'clsx';
import { useHistory, withRouter } from 'react-router';
import gClasses from 'scss/Typography.module.scss';
import { cloneDeep } from 'utils/jsUtility';
import { validate } from 'utils/UtilityFunctions';
import { applicationDataChange } from 'redux/reducer/ApplicationReducer';
import UserPicker from 'components/user_picker/UserPicker';
import styles from './CreateApp.module.scss';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import jsUtility, { isEmpty } from '../../../utils/jsUtility';
import { getAllTeamsAppDataThunk, getAppDataApiThunk, getUsersApiThunk, saveAppApiThunk } from '../../../redux/actions/Appplication.Action';
import { CREATE_APP_STRINGS } from './CreateApp.strings';
import { createAppValidationSchema } from './CreateApp.validation';
import CloseIcon from '../../../assets/icons/CloseIcon';
import { CancelToken, keydownOrKeypessEnterHandle } from '../../../utils/UtilityFunctions';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { applicationDataClear } from '../../../redux/reducer/ApplicationReducer';
import { ALLOWED_APP_TEAM_TYPE, ALLOWED_APP_USER_TYPE, ALL_DEVELOPERS_TEAM_CODE, APPLICATION_STRINGS } from '../application.strings';
import { APP } from '../../../urls/RouteConstants';
import { APP_PAGE_SETTINGS } from '../app_builder/AppBuilder.strings';
import { SYSTEM_TEAMS_CODE, TEAM_TYPES } from '../../../utils/Constants';
import ThemeContext from '../../../hoc/ThemeContext';
import { USER_PICKER_STRINGS } from '../../../components/user_picker/UserPicker.utils';

const cancelToken = new CancelToken();
const cancelViewerToken = new CancelToken();

function CreateApp(props) {
  const { applicationDataChange, activeAppData, activeAppData: { admins, viewers },
    saveAppApi, onCloseClick = null, applicationDataClear, getTeamsAppDataThunk,
    allDeveloperTeam, isFromAppCreationPrompt } = props;
    const history = useHistory();
    const { errorList = {} } = cloneDeep(activeAppData);
    const { colorScheme } = useContext(ThemeContext);

  const { t } = useTranslation();
  const { SECURITY } = APP_PAGE_SETTINGS(t);
  const siteUrl = `${window.location.origin}${APP}`;

  const createApp = () => {
    const appAdmins = {};
    if (activeAppData?.admins?.teams && activeAppData?.admins?.teams?.length > 0) {
      appAdmins.teams =
        activeAppData?.admins?.teams?.map((team) => team._id);
    }

    if (activeAppData?.admins?.users && activeAppData?.admins?.users?.length > 0) {
      appAdmins.users =
        activeAppData?.admins?.users?.map((user) => user._id);
    }
    const data = {
      name: activeAppData?.name?.trim(),
      ...(!isEmpty(activeAppData?.description) ? { description: activeAppData?.description } : null),
      ...(activeAppData?.id ? { _id: activeAppData?.id } : null),
      ...(activeAppData?.app_uuid ? { app_uuid: activeAppData?.app_uuid } : null),
      url_path: activeAppData?.url_path,
      admins: appAdmins,
      viewers: { teams: activeAppData?.viewers?.teams?.map((team) => team._id) },
    };
    const createAppErrorList = validate(data, createAppValidationSchema(t));
    if (isEmpty(createAppErrorList)) {
      saveAppApi(data, t, history, false, true);
    } else applicationDataChange({ errorList: createAppErrorList });
  };

  useEffect(() => {
    applicationDataChange({ isCreateAppModalOpen: true });
    if (isFromAppCreationPrompt) {
      createApp();
    } else {
      getTeamsAppDataThunk({
        team_code: [SYSTEM_TEAMS_CODE.DEVELOPER],
        team_type: [TEAM_TYPES.SYSTEM],
        size: 5,
        page: 1,
      }, true);
    }
  }, []);

  useEffect(() => {
    if (!isFromAppCreationPrompt && !jsUtility.isEmpty(allDeveloperTeam)) {
      applicationDataChange({ admins: { users: [], teams: [allDeveloperTeam] } });
    }
  }, [JSON.stringify(allDeveloperTeam)]);

  const onChangeHandlers = (event, type) => {
    const clonedState = cloneDeep(activeAppData);
    let validateData = {
      name: EMPTY_STRING,
      description: EMPTY_STRING,
      url_path: EMPTY_STRING,
      admins: {},
      viewers: {},
    };
    const appAdmins = {};
    if (activeAppData?.admins?.teams && activeAppData?.admins?.teams?.length > 0) {
      appAdmins.teams =
      activeAppData?.admins?.teams?.map((team) => team._id);
    }
    if (activeAppData?.admins?.users && activeAppData?.admins?.users?.length > 0) {
      appAdmins.users =
      activeAppData?.admins?.users?.map((user) => user._id);
    }
    validateData = {
      name: activeAppData?.name || EMPTY_STRING,
      ...(!isEmpty(activeAppData?.description) ? { description: activeAppData?.description } : null),
      ...(activeAppData?.id ? { _id: activeAppData?.id } : null),
      ...(activeAppData?.app_uuid ? { app_uuid: activeAppData?.app_uuid } : null),
      url_path: activeAppData?.url_path || EMPTY_STRING,
      admins: appAdmins,
      viewers: { teams: activeAppData?.viewers?.teams?.map((team) => team._id) },
    };
    switch (type) {
      case CREATE_APP_STRINGS(t).APP_NAME.ID:
        clonedState.name = event?.target?.value;
        validateData.name = event?.target?.value?.trim();
        const url_path = jsUtility.join(jsUtility.split(event?.target?.value?.trim().toLowerCase(), ' '), '-');
        clonedState.url_path = url_path;
        validateData.url_path = url_path;
      break;
      case CREATE_APP_STRINGS(t).APP_DESCRIPTION.ID:
        clonedState.description = event?.target?.value;
        validateData.description = event?.target?.value || null;
      break;
      case CREATE_APP_STRINGS(t).APP_URL.ID:
        clonedState.url_path = event?.target?.value;
        validateData.url_path = event?.target?.value;
      break;
      default: break;
    }
    if (!isEmpty(clonedState?.errorList)) {
      const createAppErrorList = validate(validateData, createAppValidationSchema(t));
      applicationDataChange({ ...cloneDeep(clonedState), errorList: createAppErrorList });
    } else {
      applicationDataChange?.(cloneDeep(clonedState));
    }
  };

  const closeCreateAppModal = () => {
    applicationDataClear();
    onCloseClick();
  };

  const headerComponent = (
    <div>
      <CloseIcon
        className={cx(
          styles.CloseIcon,
          BS.JC_END,
          gClasses.CursorPointer,
        )}
        onClick={() => closeCreateAppModal()}
        role={ARIA_ROLES.BUTTON}
        tabIndex={0}
        ariaLabel="Close App Mo"
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && closeCreateAppModal()}
      />
    </div>
  );

  const onViewersTeamSelect = (member) => {
    const viewersData = jsUtility.cloneDeep(viewers);
    if (!jsUtility.find(viewersData?.teams, { _id: member?._id })) {
      viewersData.teams = [...viewersData.teams, member];
      const errorData = cloneDeep(errorList);
      delete errorData?.[SECURITY.PAGE_VIEWERS.ID];
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
    const errorData = cloneDeep(errorList);
      delete errorData?.[CREATE_APP_STRINGS(t).APP_ADMINS.ID];
    if (member?.username && !jsUtility.find(adminData?.users, { _id: member?._id })) {
      adminData.users = [...adminData.users, member];
    } else if (!jsUtility.find(adminData?.teams, { _id: member?._id })) {
      adminData.teams = [...adminData.teams, member];
    }
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
      <div className={BS.W_AUTO}>
        <Title
          className={cx(BS.D_FLEX, BS.JC_CENTER)}
          content={CREATE_APP_STRINGS(t).TITLE}
          headingLevel={ETitleHeadingLevel.h3}
          size={ETitleSize.medium}
        />
        <TextInput
          id={CREATE_APP_STRINGS(t).APP_NAME.ID}
          value={activeAppData?.name}
          labelText={CREATE_APP_STRINGS(t).APP_NAME.LABEL}
          isLoading={false}
          placeholder={CREATE_APP_STRINGS(t).APP_NAME.PLACEHOLDER}
          className={cx(styles.AppHeaderSpace, BS.D_FLEX, BS.JC_CENTER)}
          labelClassName={gClasses.FTwo12BlackV20}
          inputInnerClassName={BS.W100}
          onChange={(e) => {
            console.log('applicationDataChangeonChange', e?.target?.value);
            onChangeHandlers(e, CREATE_APP_STRINGS(t).APP_NAME.ID);
          }}
          errorMessage={errorList[CREATE_APP_STRINGS(t).APP_NAME.ID]}
          required
          inputClassName={styles.InputClass}
          readOnly={false}
          variant={Variant.border}
          autoFocus
          // minLength={2}
          // maxLength={50}
        />
        <TextArea
          id={CREATE_APP_STRINGS(t).APP_DESCRIPTION.ID}
          value={activeAppData?.description}
          labelText={CREATE_APP_STRINGS(t).APP_DESCRIPTION.LABEL}
          isLoading={false}
          placeholder={CREATE_APP_STRINGS(t).APP_DESCRIPTION.PLACEHOLDER}
          className={cx(styles.AppName, BS.D_FLEX, BS.JC_CENTER)}
          labelClassName={gClasses.FTwo12BlackV20}
          onChange={(e) => {
            onChangeHandlers(e, CREATE_APP_STRINGS(t).APP_DESCRIPTION.ID);
          }}
          errorMessage={errorList[CREATE_APP_STRINGS(t).APP_DESCRIPTION.ID]}
          // maxLength={2000}
          size={Size.sm}
          inputInnerClassName={cx(styles.InputClass, gClasses.FontWeight400)}
          readOnly={false}
          colorScheme={colorScheme?.activeColor}
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
          blockUrlPrefix
          errorMessage={[{ link_url: errorList[CREATE_APP_STRINGS(t).APP_URL.ID] }]}
          inputInnerClassName={cx(styles.InputInnerClass, gClasses.NoPointerEvent)}
          linkClassName={styles.LinkClass}
        />
        <UserPicker
          id={CREATE_APP_STRINGS(t).APP_ADMINS.ID}
          isSearchable
          labelClassName={gClasses.FTwo12BlackV20}
          required
          selectedValue={admins}
          maxCountLimit={3}
          className={gClasses.MT25}
          labelText={CREATE_APP_STRINGS(t).APP_ADMINS.LABEL}
          errorMessage={errorList[CREATE_APP_STRINGS(t).APP_ADMINS.ID]}
          onSelect={onAdminUsersSelect}
          onRemove={onAdminUsersRemoveHandle}
          noDataFoundMessage={APPLICATION_STRINGS(t).SYSTEM_DIRECTORY.NO_TEAMS_ON_SEARCH}
          cancelToken={cancelToken}
          allowedUserType={ALLOWED_APP_USER_TYPE}
          extraParams={{ team_code: ALL_DEVELOPERS_TEAM_CODE }}
          addFieldText={USER_PICKER_STRINGS(t).ADD_USERS_TEAMS}
        />
        <UserPicker
          isSearchable
          required
          selectedValue={viewers}
          labelClassName={gClasses.FTwo12BlackV20}
          maxCountLimit={3}
          className={gClasses.MT25}
          labelText={CREATE_APP_STRINGS(t).APP_VIEWERS.LABEL}
          errorMessage={errorList[SECURITY.PAGE_VIEWERS.ID]}
          onSelect={onViewersTeamSelect}
          onRemove={onViewersTeamRemoveHandle}
          noDataFoundMessage={APPLICATION_STRINGS(t).SYSTEM_DIRECTORY.NO_TEAMS_ON_SEARCH}
          cancelToken={cancelViewerToken}
          allowedTeamType={ALLOWED_APP_TEAM_TYPE}
          isTeams
          addFieldText={USER_PICKER_STRINGS(t).ADD_TEAMS}
        />
        <div className={cx(gClasses.DisplayFlex, gClasses.JCEnd, gClasses.MT25)}>
          <Button
            buttonText={CREATE_APP_STRINGS(t).CANCEL}
            noBorder
            className={cx(gClasses.MR24, gClasses.FontWeight500, styles.CancelButton)}
            onClickHandler={closeCreateAppModal}
          />
          <Button
            buttonText={CREATE_APP_STRINGS(t).NEXT}
            type={EButtonType.PRIMARY}
            onClickHandler={createApp}
            // colorSchema={colorSchema}
          />
        </div>
      </div>
  );

  return (
    <Modal
        id="create_app_modal"
        isModalOpen={activeAppData?.isCreateAppModalOpen}
        headerContent={headerComponent}
        headerContentClassName={cx(BS.D_FLEX, BS.JC_END, gClasses.M15)}
        mainContent={mainComponent}
        modalStyle={ModalStyleType.modal}
        className={styles.CreateAppModal}
        mainContentClassName={cx(styles.Content, BS.D_FLEX, BS.JC_CENTER)}
        modalSize={ModalSize.full}
        enableEscClickClose
        onCloseClick={closeCreateAppModal}
    />
  );
}

const mapStateToProps = (state) => {
    return {
      activeAppData: state.ApplicationReducer.activeAppData,
      usersAndTeamsData: state.ApplicationReducer.usersAndTeamsData,
      allDeveloperTeam: state.ApplicationReducer.allDeveloperTeam,
      isFromAppCreationPrompt: state.ApplicationReducer.isFromAppCreationPrompt,
    };
};

CreateApp.propTypes = {
  applicationDataChange: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => {
  return {
    applicationDataChange: (props) => {
      dispatch(applicationDataChange(props));
    },
    getUsersApi: (props, setCancelToken) => {
      dispatch(getUsersApiThunk(props, setCancelToken));
    },
    saveAppApi: (props, translateFunction, history, isSaveAndClose, isCreateApp) => {
      dispatch(saveAppApiThunk(props, translateFunction, history, isSaveAndClose, isCreateApp));
    },
    getAppDataApi: (props) => {
      dispatch(getAppDataApiThunk(props));
    },
    applicationDataClear: () => {
      dispatch(applicationDataClear());
    },
    getTeamsAppDataThunk: (params, bool) => {
      dispatch(getAllTeamsAppDataThunk(params, bool));
    },
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateApp));
