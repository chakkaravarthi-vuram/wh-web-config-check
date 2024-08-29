import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalStyleType,
  Title,
  ETitleHeadingLevel,
  ETitleSize,
  EPopperPlacements,
  Button as LibraryButton,
  EButtonType,
  ModalSize,
  UserPicker,
} from '@workhall-pvt-lmt/wh-ui-library';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import cx from 'clsx';
import { useTranslation } from 'react-i18next';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import gClasses from 'scss/Typography.module.scss';
import { cloneDeep, find } from 'utils/jsUtility';
import { validate } from 'utils/UtilityFunctions';
import { applicationDataChange } from 'redux/reducer/ApplicationReducer';
import { useHistory } from 'react-router-dom';
import styles from './AppSecurity.module.scss';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import { get, isEmpty, remove } from '../../../utils/jsUtility';
import { getAppDataApiThunk, getUsersAndTeamsApiThunk, getUsersApiThunk, updateAppSecurityApiThunk } from '../../../redux/actions/Appplication.Action';
import CloseIcon from '../../../assets/icons/CloseIcon';
import { getPopperContent, keydownOrKeypessEnterHandle } from '../../../utils/UtilityFunctions';
import { applicationDataClear } from '../../../redux/reducer/ApplicationReducer';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { CREATE_APP_STRINGS } from '../create_app/CreateApp.strings';
import { appSecurityValidationSchema } from './AppSecurity.validation';

let cancelTokenUsers;
let cancelTokenUsersAndTeams;

export const getCancelTokenAddAdmins = (cancelToken) => {
  cancelTokenUsers = cancelToken;
};

export const getCancelTokenAddViewers = (cancelToken) => {
  cancelTokenUsersAndTeams = cancelToken;
};

function AppSecurity(props) {
  const { applicationDataChange, activeAppData, updateAppSecurity, usersAndTeamsData, getUsersApi, getUsersAndTeamsApi } = props;
    const { errorList = {} } = cloneDeep(activeAppData);
    const [initialBasicDetails, setInitialBasicDetails] = useState({});
    const [searchText, setSearchText] = useState(EMPTY_STRING);
  const { t } = useTranslation();
  const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);
  const history = useHistory();

  const onChangeHandlers = (event, type) => {
    const clonedState = cloneDeep(activeAppData);
    switch (type) {
      case CREATE_APP_STRINGS(t).APP_NAME.ID:
        clonedState.name = event?.target?.value;
        if (clonedState?.errorList[CREATE_APP_STRINGS(t).APP_NAME.ID]) delete clonedState.errorList[CREATE_APP_STRINGS(t).APP_NAME.ID];
      break;
      case CREATE_APP_STRINGS(t).APP_DESCRIPTION.ID:
        clonedState.description = event?.target?.value;
        if (clonedState?.errorList[CREATE_APP_STRINGS(t).APP_DESCRIPTION.ID]) delete clonedState.errorList[CREATE_APP_STRINGS(t).APP_DESCRIPTION.ID];
      break;
      case CREATE_APP_STRINGS(t).APP_ADMINS.ID:
        if (event?.target?.removeUserOrTeam) {
          const id = cloneDeep(event.target.value);
          console.log('removeTeam', event, cloneDeep(clonedState));
          if (id) {
            if (clonedState?.admins && clonedState?.admins?.teams) {
              if (find(clonedState?.admins?.teams, { _id: id })) {
                remove(clonedState?.admins?.teams, { _id: id });
                if (clonedState?.admins?.teams.length === 0) delete clonedState?.admins?.teams;
                if (clonedState?.errorList[CREATE_APP_STRINGS(t).APP_ADMINS.ID]) delete clonedState.errorList[CREATE_APP_STRINGS(t).APP_ADMINS.ID];
              }
            }
            if (clonedState?.admins && clonedState?.admins?.users) {
              if (find(clonedState?.admins?.users, { _id: id })) {
                remove(clonedState?.admins?.users, { _id: id });
                if (clonedState?.admins?.users.length === 0) delete clonedState?.admins?.users;
                if (clonedState?.errorList[CREATE_APP_STRINGS(t).APP_ADMINS.ID]) delete clonedState.errorList[CREATE_APP_STRINGS(t).APP_ADMINS.ID];
              }
            }
          }
        } else {
            const selectedValue = (usersAndTeamsData?.users || []).find((eachUserOrTeam) =>
          (eachUserOrTeam?.email === event?.target?.innerText) ||
          (eachUserOrTeam?.label === event?.target?.innerText)) || usersAndTeamsData?.users?.[event?.target?.id];
            console.log('createapp', event, cloneDeep(clonedState), selectedValue);
            if (selectedValue) {
              const team_or_user = selectedValue;
              if (!clonedState?.admins) clonedState.admins = {};
              // if (team_or_user.is_user) {
                if (clonedState?.admins?.users) {
                  if (!find(clonedState?.admins?.users, { _id: team_or_user._id })) {
                    clonedState?.admins?.users.push(team_or_user);
                    if (clonedState?.errorList[CREATE_APP_STRINGS(t).APP_ADMINS.ID]) delete clonedState.errorList[CREATE_APP_STRINGS(t).APP_ADMINS.ID];
                  }
                } else {
                  clonedState.admins.users = [];
                  clonedState.admins.users.push(team_or_user);
                  if (clonedState?.errorList[CREATE_APP_STRINGS(t).APP_ADMINS.ID]) delete clonedState.errorList[CREATE_APP_STRINGS(t).APP_ADMINS.ID];
                }
              // }
            }
        }
      break;
      case CREATE_APP_STRINGS(t).APP_VIEWERS.ID:
        if (event?.target?.removeUserOrTeam) {
          const id = cloneDeep(event.target.value);
          console.log('removeTeam', event, cloneDeep(clonedState));
          if (id) {
            if (clonedState?.viewers && clonedState?.viewers?.teams) {
              if (find(clonedState?.viewers?.teams, { _id: id })) {
                remove(clonedState?.viewers?.teams, { _id: id });
                if (clonedState?.viewers?.teams.length === 0) delete clonedState?.viewers?.teams;
                if (clonedState?.errorList[CREATE_APP_STRINGS(t).APP_VIEWERS.ID]) delete clonedState.errorList[CREATE_APP_STRINGS(t).APP_VIEWERS.ID];
              }
            }
            if (clonedState?.viewers && clonedState?.viewers?.users) {
              if (find(clonedState?.viewers?.users, { _id: id })) {
                remove(clonedState?.viewers?.users, { _id: id });
                if (clonedState?.viewers?.users.length === 0) delete clonedState?.viewers?.users;
                if (clonedState?.errorList[CREATE_APP_STRINGS(t).APP_VIEWERS.ID]) delete clonedState.errorList[CREATE_APP_STRINGS(t).APP_VIEWERS.ID];
              }
            }
          }
        } else {
            const selectedValue = (usersAndTeamsData?.usersAndTeams || []).find((eachUserOrTeam) =>
          (eachUserOrTeam?.email === event?.target?.innerText) ||
          (eachUserOrTeam?.label === event?.target?.innerText)) || usersAndTeamsData?.users?.[event?.target?.id];
            console.log('createapp', event, cloneDeep(clonedState), selectedValue);
            if (selectedValue) {
              const team_or_user = selectedValue;
              if (!clonedState?.admins) clonedState.admins = {};
              // if (team_or_user.is_user) {
                if (clonedState?.viewers?.users) {
                  if (!find(clonedState?.viewers?.users, { _id: team_or_user._id })) {
                    clonedState?.viewers?.users.push(team_or_user);
                    if (clonedState?.errorList[CREATE_APP_STRINGS(t).APP_VIEWERS.ID]) delete clonedState.errorList[CREATE_APP_STRINGS(t).APP_VIEWERS.ID];
                  }
                } else {
                  clonedState.viewers.users = [];
                  clonedState.viewers.users.push(team_or_user);
                  if (clonedState?.errorList[CREATE_APP_STRINGS(t).APP_VIEWERS.ID]) delete clonedState.errorList[CREATE_APP_STRINGS(t).APP_VIEWERS.ID];
                }
              // }
            }
        }
      break;
      default: break;
    }
    applicationDataChange?.(cloneDeep(clonedState));
  };

  const createApp = () => {
    const appAdmins = {};
    if (activeAppData?.admins?.users && activeAppData?.admins?.users?.length > 0) {
      appAdmins.users =
      activeAppData?.admins?.users?.map((user) => user._id);
    }

    const appViewers = {};
    if (activeAppData?.viewers?.teams && activeAppData?.viewers?.teams?.length > 0) {
      appViewers.teams =
      activeAppData?.viewers?.teams?.map((team) => team._id);
    }

    if (activeAppData?.viewers?.users && activeAppData?.viewers?.users?.length > 0) {
      appViewers.users =
      activeAppData?.viewers?.users?.map((user) => user._id);
    }
    const data = {
      _id: activeAppData?.published_app_id || activeAppData?.id,
      appSecurity: {
        admins: appAdmins,
        viewers: appViewers,
      },
    };
    const createAppErrorList = validate(data, appSecurityValidationSchema(t));
    console.log('createAppErrorList', createAppErrorList);
    if (isEmpty(createAppErrorList)) {
      updateAppSecurity(data, t);
    } else applicationDataChange({ errorList: createAppErrorList });
  };

  useEffect(() => {
    setInitialBasicDetails(activeAppData);
    if (cancelTokenUsers) cancelTokenUsers();
    const userParams = {
      page: 1,
      size: usersAndTeamsData?.size || 5,
      is_active: 1,
      is_last_signin: 0,
      user_types: [1, 3],
    };
    getUsersApi(userParams, getCancelTokenAddAdmins);
    if (cancelTokenUsersAndTeams) cancelTokenUsersAndTeams();
    const usersAndTeamsParams = {
      page: 1,
      size: usersAndTeamsData?.size || 5,
      is_active: 1,
    };
    getUsersAndTeamsApi(usersAndTeamsParams, getCancelTokenAddViewers);
  }, []);

  const onSearchUsers = (e) => {
    console.log('onSearchUsers', e);
    if (cancelTokenUsers) cancelTokenUsers();
    const params = {
      page: usersAndTeamsData?.page || 1,
      size: usersAndTeamsData?.size || 5,
      is_active: 1,
      is_last_signin: 0,
      user_types: [1, 3],
    };
    if (e?.target?.value) {
      setSearchText(e?.target?.value);
      params.search = e?.target?.value;
    } else {
      setSearchText(EMPTY_STRING);
    }
    getUsersApi(params, getCancelTokenAddAdmins);
  };

  const onSearchUsersAndTeams = (e) => {
    console.log('onSearchUsers', e);
    if (cancelTokenUsersAndTeams) cancelTokenUsersAndTeams();
    const params = {
      page: usersAndTeamsData?.page || 1,
      size: usersAndTeamsData?.size || 5,
      is_active: 1,
    };
    if (e?.target?.value) {
      setSearchText(e?.target?.value);
      params.search = e?.target?.value;
    } else {
      setSearchText(EMPTY_STRING);
    }
    const usersAndTeamsParams = {
      page: usersAndTeamsData?.page || 1,
      size: usersAndTeamsData?.size || 5,
      is_active: 1,
      is_last_signin: 0,
    };
    getUsersAndTeamsApi(usersAndTeamsParams, getCancelTokenAddViewers);
  };

  const closeBasicDetailsModal = () => {
    applicationDataChange(initialBasicDetails);
  };

  const headerComponent = (
    <div className={cx(BS.D_FLEX, BS.JC_START)}>
      <Title
          className={cx(BS.D_FLEX, BS.JC_CENTER, gClasses.MT25, gClasses.ML40)}
          content={CREATE_APP_STRINGS(t).SECURITY_SETTINGS.TITLE}
          headingLevel={ETitleHeadingLevel.h3}
          size={ETitleSize.medium}
      />
      <div>
      <CloseIcon
        className={cx(
          styles.CloseIcon,
          BS.JC_END,
          gClasses.CursorPointer,
        )}
        onClick={() => closeBasicDetailsModal()}
        role={ARIA_ROLES.BUTTON}
        tabIndex={0}
        ariaLabel="Close App Mo"
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && closeBasicDetailsModal()}
      />
      </div>
    </div>
  );

  const remainingUsersAndTeams = [];
  usersAndTeamsData?.usersAndTeams?.forEach((selectedUserOrTeam) => {
    if (!([...get(activeAppData, ['viewers', 'users'], []),
    ...get(activeAppData, ['viewers', 'teams'], [])]).find((eachUser) => eachUser._id === selectedUserOrTeam._id)) {
      remainingUsersAndTeams.push(selectedUserOrTeam);
    }
  });
  console.log('remainingUsersAndTeams', remainingUsersAndTeams, usersAndTeamsData, activeAppData);
  if (remainingUsersAndTeams?.length < 6) {
    if (cancelTokenUsers) cancelTokenUsers();
    const userParams = {
      page: usersAndTeamsData?.usersAndTeamsPage,
      size: usersAndTeamsData?.size || 5,
      is_active: 1,
      is_last_signin: 0,
      user_types: [1, 3],
    };
    getUsersAndTeamsApi(userParams, getCancelTokenAddAdmins);
  }
  const remainingUsers = [];
  usersAndTeamsData?.users?.forEach((selectedUserOrTeam) => {
    if (!([...get(activeAppData, ['admins', 'users'], [])]).find((eachUser) => eachUser._id === selectedUserOrTeam._id)) {
      remainingUsers.push(selectedUserOrTeam);
    }
  });

  if (remainingUsers?.length < 6) {
    if (cancelTokenUsers) cancelTokenUsers();
    const userParams = {
      page: usersAndTeamsData?.usersPage,
      size: usersAndTeamsData?.size || 5,
      is_active: 1,
      is_last_signin: 0,
      user_types: [1, 3],
    };
    getUsersApi(userParams, getCancelTokenAddAdmins);
  }

  const mainComponent = (
      <div className={BS.W100}>
        <div className={cx(BS.D_FLEX, BS.JC_CENTER, gClasses.MT25)}>
          <UserPicker
            id={CREATE_APP_STRINGS(t).APP_ADMINS.ID}
            selectedValue={([...get(activeAppData, ['admins', 'users'], [])])}
            labelText={CREATE_APP_STRINGS(t).APP_ADMINS.LABEL}
            isLoading={false}
            labelClassName={gClasses.FTwo12BlackV20}
            className={styles.AppAdmins}
            onChange={applicationDataChange}
            optionList={remainingUsers}
            onSelect={(event) => {
              onChangeHandlers(event, CREATE_APP_STRINGS(t).APP_ADMINS.ID);
            }}
            errorMessage={errorList[CREATE_APP_STRINGS(t).APP_ADMINS.ID]}
            onRemove={(removeUserOrTeamId) => {
              console.log('onremovehandler final', removeUserOrTeamId);
              const removeEvent = {
                target: {
                  value: removeUserOrTeamId,
                  removeUserOrTeam: true,
                },
              };
              onChangeHandlers(removeEvent, CREATE_APP_STRINGS(t).APP_ADMINS.ID);
            }}
            isSearchable
            onSearch={(event) => onSearchUsers(event)}
            searchText={searchText}
            popperPosition={EPopperPlacements.RIGHT_END}
            maxCountLimit={3}
            required
            getPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide, history, showCreateTask)}
          />
        </div>
        <div className={cx(BS.D_FLEX, BS.JC_CENTER, gClasses.MT25)}>
          <UserPicker
            id={CREATE_APP_STRINGS(t).APP_VIEWERS.ID}
            selectedValue={([...get(activeAppData, ['viewers', 'users'], []),
            ...get(activeAppData, ['viewers', 'teams'], [])])}
            labelText={CREATE_APP_STRINGS(t).APP_VIEWERS.LABEL}
            isLoading={false}
            labelClassName={gClasses.FTwo12BlackV20}
            className={styles.AppAdmins}
            onChange={applicationDataChange}
            optionList={remainingUsersAndTeams}
            onSelect={(event) => {
              onChangeHandlers(event, CREATE_APP_STRINGS(t).APP_VIEWERS.ID);
            }}
            errorMessage={errorList[CREATE_APP_STRINGS(t).APP_VIEWERS.ID]}
            onRemove={(removeUserOrTeamId) => {
              console.log('onremovehandler final', removeUserOrTeamId);
              const removeEvent = {
                target: {
                  value: removeUserOrTeamId,
                  removeUserOrTeam: true,
                },
              };
              onChangeHandlers(removeEvent, CREATE_APP_STRINGS(t).APP_VIEWERS.ID);
            }}
            isSearchable
            onSearch={(event) => onSearchUsersAndTeams(event)}
            searchText={searchText}
            popperPosition={EPopperPlacements.RIGHT_END}
            maxCountLimit={3}
            required
            getPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide, history, showCreateTask)}
          />
        </div>
      </div>
  );

  const footerComponent = (
    <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
      <LibraryButton
        buttonText={CREATE_APP_STRINGS(t).SECURITY_SETTINGS.SAVE}
        type={EButtonType.OUTLINE_SECONDARY}
        onClick={createApp}
      />
      <div className={BS.D_FLEX}>
        <Button
          buttonType={BUTTON_TYPE.LIGHT}
          className={cx(BS.TEXT_NO_WRAP, gClasses.MR15)}
          onClick={closeBasicDetailsModal}
          removePadding
        >
          {CREATE_APP_STRINGS(t).SECURITY_SETTINGS.DISCARD}
        </Button>
        <LibraryButton
          buttonText={CREATE_APP_STRINGS(t).SECURITY_SETTINGS.SAVE}
          type={EButtonType.PRIMARY}
          onClick={createApp}
        />
      </div>
    </div>
  );

  return (
      <Modal
        id="create_app_modal"
        isModalOpen={activeAppData?.isSecuritySettingsModalOpen}
        headerContent={headerComponent}
        mainContent={mainComponent}
        modalStyle={ModalStyleType.modal}
        className={styles.CreateAppModal}
        mainContentClassName={cx(styles.Content, BS.D_FLEX, BS.JC_CENTER)}
        modalSize={ModalSize.full}
        footerContent={footerComponent}
        footerContentClassName={cx(BS.P_ABSOLUTE, styles.FooterClass)}
      />
  );
}

const mapStateToProps = (state) => {
    return {
      activeAppData: state.ApplicationReducer.activeAppData,
      usersAndTeamsData: state.ApplicationReducer.usersAndTeamsData,
    };
};

AppSecurity.propTypes = {
  applicationDataChange: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => {
  return {
    applicationDataChange: (props) => {
      dispatch(applicationDataChange(props));
    },
    updateAppSecurity: (props, translateFunction) => {
      dispatch(updateAppSecurityApiThunk(props, translateFunction));
    },
    getAppDataApi: (props) => {
      dispatch(getAppDataApiThunk(props));
    },
    applicationDataClear: () => {
      dispatch(applicationDataClear());
    },
    getUsersApi: (props, setCancelToken) => {
      dispatch(getUsersApiThunk(props, setCancelToken));
    },
    getUsersAndTeamsApi: (props, setCancelToken) => {
      dispatch(getUsersAndTeamsApiThunk(props, setCancelToken));
    },
  };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AppSecurity);
