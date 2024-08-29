import React, { useState } from 'react';
import {
  Modal,
  ModalStyleType,
  Title,
  ETitleHeadingLevel,
  ETitleSize,
  Button as LibraryButton,
  EButtonType,
  ModalSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import gClasses from 'scss/Typography.module.scss';
import { cloneDeep } from 'utils/jsUtility';
import { applicationDataChange } from 'redux/reducer/ApplicationReducer';
import { validate } from 'utils/UtilityFunctions';
import styles from './PublishApp.module.scss';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import { isEmpty } from '../../../utils/jsUtility';
import { store } from '../../../Store';
import { getAppDataApiThunk, getUsersAndTeamsApiThunk, getUsersApiThunk, publishAppApiThunk, saveAppApiThunk, updateAppSecurityApiThunk } from '../../../redux/actions/Appplication.Action';
import CloseIcon from '../../../assets/icons/CloseIcon';
import { CancelToken, keydownOrKeypessEnterHandle } from '../../../utils/UtilityFunctions';
import { applicationDataClear, applicationStateChange } from '../../../redux/reducer/ApplicationReducer';
import { CREATE_APP_STRINGS } from '../create_app/CreateApp.strings';
import PageSecurity from '../app_security/page_security/PageSecurity';
import { PUBLISH_APP_STRINGS } from './PublishApp.strings';
import { updateSecurityValidationSchema } from './Publish.validation';
import { ALLOWED_APP_TEAM_TYPE, ALLOWED_APP_USER_TYPE, ALL_DEVELOPERS_TEAM_CODE, APPLICATION_STRINGS } from '../application.strings';
import UserPicker from '../../../components/user_picker/UserPicker';

const cancelToken = new CancelToken();
const cancelViewerToken = new CancelToken();

function PublishApp(props) {
  const { applicationDataChange, activeAppData, updateAppSecurity, applicationStateChange, dispatch } = props;
    const history = useHistory();
    const { errorList = {} } = cloneDeep(activeAppData);
    const [initialBasicDetails] = useState({});
    const [initialCustomPageSecurity] = useState(false);
    const { t } = useTranslation();
    const { ARIA_LABELS } = PUBLISH_APP_STRINGS(t);

  const publishApp = () => {
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
    if (activeAppData?.viewers?.teams && activeAppData?.viewers?.teams?.length > 0) {
      appViewers.teams =
      activeAppData?.viewers?.teams?.map((team) => team._id);
    }

    if (activeAppData?.viewers?.users && activeAppData?.viewers?.users?.length > 0) {
      appViewers.users =
      activeAppData?.viewers?.users?.map((user) => user._id);
    }

    const pageSecurity = activeAppData?.pages?.map((page) => {
      const pageViewer = {};
      if (page?.viewers?.teams && page?.viewers?.teams?.length > 0 && !page?.viewers?.teams?.every?.((team) => team === undefined)) {
        pageViewer.teams =
        page?.viewers?.teams?.map((team) => team._id);
      }

      if (page?.viewers?.users && page?.viewers?.users?.length > 0 && !page?.viewers?.users?.every?.((user) => user === undefined)) {
        pageViewer.users =
        page?.viewers?.users?.map((user) => user._id);
      }
      return {
        page_id: page?.page_id || page._id,
        is_inherit_from_app: page.is_inherit_from_app,
       ...(!page.is_inherit_from_app) ? { viewers: pageViewer } : null,
      };
    });

    const updateSecurityData = {
      _id: activeAppData?.id,
      app_security: {
        admins: appAdmins,
        viewers: appViewers,
      },
      page_security: pageSecurity,
    };

    const publishError = validate(updateSecurityData, updateSecurityValidationSchema(t));
    if (isEmpty(publishError) && isEmpty(errorList)) {
    const publishData = {
      app_uuid: activeAppData?.app_uuid,
    };
    updateAppSecurity(updateSecurityData, t, publishData, history);
    } else {
      applicationDataChange({ errorList: { ...errorList, ...publishError } });
    }
  };

  const closeBasicDetailsModal = () => {
    applicationDataChange(initialBasicDetails);
    applicationDataChange?.({ isPublishModalOpen: false });
    applicationStateChange({ customPageSecurity: initialCustomPageSecurity });
  };

  const headerComponent = (
    <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.W100)}>
      <Title
          className={cx(gClasses.FTwo20BlackV12)}
          content={PUBLISH_APP_STRINGS(t).TITLE}
          headingLevel={ETitleHeadingLevel.h3}
          size={ETitleSize.medium}
      />
      <CloseIcon
        className={cx(styles.CloseIcon, BS.JC_END, gClasses.CursorPointer)}
        onClick={closeBasicDetailsModal}
        role={ARIA_ROLES.BUTTON}
        tabIndex={0}
        ariaLabel={t(ARIA_LABELS.CLOSE)}
        onKeyDown={(e) =>
          keydownOrKeypessEnterHandle(e) && closeBasicDetailsModal()
        }
      />
    </div>
  );

  const mainComponent = (
    <div className={BS.W100}>
      <UserPicker
        id={CREATE_APP_STRINGS(t).APP_ADMINS.ID}
        isSearchable
        labelClassName={gClasses.FTwo12BlackV20}
        selectedValue={activeAppData?.admins}
        maxCountLimit={3}
        className={gClasses.MT25}
        labelText={CREATE_APP_STRINGS(t).APP_ADMINS.LABEL}
        errorMessage={errorList[CREATE_APP_STRINGS(t).APP_ADMINS.ID]}
        noDataFoundMessage={APPLICATION_STRINGS(t).SYSTEM_DIRECTORY.NO_TEAMS_ON_SEARCH}
        cancelToken={cancelToken}
        allowedUserType={ALLOWED_APP_USER_TYPE}
        extraParams={{ team_code: ALL_DEVELOPERS_TEAM_CODE }}
        disabled
      />
      <UserPicker
        isSearchable
        selectedValue={activeAppData?.viewers}
        labelClassName={gClasses.FTwo12BlackV20}
        maxCountLimit={3}
        className={gClasses.MT25}
        labelText={CREATE_APP_STRINGS(t).APP_VIEWERS.LABEL}
        noDataFoundMessage={APPLICATION_STRINGS(t).SYSTEM_DIRECTORY.NO_TEAMS_ON_SEARCH}
        cancelToken={cancelViewerToken}
        allowedTeamType={ALLOWED_APP_TEAM_TYPE}
        errorMessage={errorList[`${PUBLISH_APP_STRINGS(t).APP_SECURITY_ID},${CREATE_APP_STRINGS(t).APP_VIEWERS.ID}`]}
        disabled
        isTeams
      />
      <PageSecurity />
    </div>
  );

  const saveApp = () => {
    const { activeAppData = {} } = store.getState().ApplicationReducer;
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
    if (activeAppData?.viewers?.teams && activeAppData?.viewers?.teams?.length > 0) {
    appViewers.teams =
    activeAppData?.viewers?.teams?.map((team) => team._id);
    }

    if (activeAppData?.viewers?.users && activeAppData?.viewers?.users?.length > 0) {
    appViewers.users =
    activeAppData?.viewers?.users?.map((user) => user._id);
    }

    const pageSecurity = activeAppData?.pages?.map((page) => {
      const pageViewer = {};
      if (page?.viewers?.teams && page?.viewers?.teams?.length > 0 && !page?.viewers?.teams?.every?.((team) => team === undefined)) {
        pageViewer.teams =
        page?.viewers?.teams?.map((team) => team._id);
      }

      if (page?.viewers?.users && page?.viewers?.users?.length > 0 && !page?.viewers?.users?.every?.((user) => user === undefined)) {
        pageViewer.users =
        page?.viewers?.users?.map((user) => user._id);
      }
      return {
        page_id: page?.page_id || page._id,
        is_inherit_from_app: page.is_inherit_from_app,
       ...(!page.is_inherit_from_app) ? { viewers: pageViewer } : null,
      };
    });

    const updateSecurityData = {
      _id: activeAppData?.id,
      app_security: {
        admins: appAdmins,
        viewers: appViewers,
      },
      page_security: pageSecurity,
    };

    updateAppSecurity(updateSecurityData, t, {}, history, () => {
      const saveData = {
        name: activeAppData?.name,
       ...(!isEmpty(activeAppData?.description) ? { description: activeAppData?.description } : null),
       ...(activeAppData?.id ? { _id: activeAppData?.id } : null),
       ...(activeAppData?.app_uuid ? { app_uuid: activeAppData?.app_uuid } : null),
        admins: appAdmins,
        viewers: appViewers,
      };
      dispatch(saveAppApiThunk(saveData, t, history, true));
    });
};

  const footerComponent = (
    <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.W100)}>
      <LibraryButton
        buttonText={PUBLISH_APP_STRINGS(t).SAVE_CLOSE}
        type={EButtonType.OUTLINE_SECONDARY}
        onClick={saveApp}
      />
      <div className={BS.D_FLEX}>
        <LibraryButton
          buttonText={PUBLISH_APP_STRINGS(t).PUBLISH_BUTTON}
          type={EButtonType.PRIMARY}
          onClick={publishApp}
        />
      </div>
    </div>
  );
    console.log('publishappmodalopened');
  return (
      <Modal
        id={PUBLISH_APP_STRINGS(t).MODAL_ID}
        isModalOpen={activeAppData?.isPublishModalOpen}
        headerContent={headerComponent}
        headerContentClassName={cx(BS.D_FLEX, gClasses.M15, gClasses.ML30)}
        mainContent={mainComponent}
        modalStyle={ModalStyleType.modal}
        className={styles.PublishAppModal}
        mainContentClassName={cx(BS.D_FLEX, gClasses.M15, gClasses.ML30)}
        modalSize={ModalSize.md}
        footerContent={footerComponent}
        footerContentClassName={cx(
          gClasses.M15,
          gClasses.ML30,
          styles.FooterContent,
        )}
      />
  );
}

const mapStateToProps = (state) => {
    return {
      activeAppData: state.ApplicationReducer.activeAppData,
      usersAndTeamsData: state.ApplicationReducer.usersAndTeamsData,
      customPageSecurity: state.ApplicationReducer.customPageSecurity,
    };
};

PublishApp.propTypes = {
  applicationDataChange: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => {
  return {
    applicationDataChange: (props) => {
      dispatch(applicationDataChange(props));
    },
    updateAppSecurity: (props, translateFunction, publishParams, history, callBack) => {
      dispatch(updateAppSecurityApiThunk(props, translateFunction, publishParams, history, callBack));
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
    publishAppApi: (props, setCancelToken) => {
      dispatch(publishAppApiThunk(props, setCancelToken));
    },
    applicationStateChange: (props) => {
      dispatch(applicationStateChange(props));
    },
    dispatch,
  };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PublishApp);
