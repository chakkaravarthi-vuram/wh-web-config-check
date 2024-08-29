import React, { lazy } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './TaskAction.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { BS } from '../../../../../utils/UIConstants';
import { TASK_ACTION } from '../../../LandingPage.strings';
import Button, { BUTTON_TYPE } from '../../../../../components/form_components/button/Button';
import { postUpdateTaskStatus, postRejectTask } from '../../../../../redux/actions/TaskActions';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import jsUtils from '../../../../../utils/jsUtility';

// lazy imports
const AvatarGroup = lazy(() =>
  import('../../../../../components/avatar_group/AvatarGroup'));

const mapStateToProps = (state) => {
  return {
    active_task_details: state.TaskContentReducer.active_task_details,
    show_accept_reject: state.TaskContentReducer.show_accept_reject,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateTaskStatus: (acceptData, onCloseIconClick, statevariables, setDashboardNavigationLink) => {
      dispatch(postUpdateTaskStatus(acceptData, onCloseIconClick, statevariables, setDashboardNavigationLink));
    },
    onRejectTask: (rejectData, history, onCloseIconClick) => {
      dispatch(postRejectTask(rejectData, history, onCloseIconClick));
    },
  };
};

function TaskAction(props) {
  const {
    className,
    active_task_details,
    onUpdateTaskStatus,
    onRejectTask,
    show_accept_reject,
    history,
    onCloseIconClick,
    hideAvatarGroup,
    children,
    acceptedAs,
    isTestBed,
    statevariables,
    setDashboardNavigationLink,
  } = props;
  const userImages = [];
  const { t } = useTranslation();
  const getUrlFromPicId = (picId) => {
    const { active_task_details } = props;
    const { document_url_details = [] } = active_task_details;

    const image = jsUtils.find(document_url_details, { document_id: picId });
    if (image) return image.signedurl;
    else return null;
  };
  const assignedTo = jsUtils.get(active_task_details, ['task_log_info', 'assigned_to'], {});

  const disableButton = (isTestBed && jsUtils.isEmpty(acceptedAs));
  if (
    assignedTo
    && (assignedTo?.users || assignedTo?.teams)
    && show_accept_reject
  ) {
    let usersAndTeams = [];
    if (!jsUtils.isEmpty(assignedTo?.users)) {
      usersAndTeams = jsUtils.union(usersAndTeams, assignedTo?.users);
    }
    if (!jsUtils.isEmpty(assignedTo?.teams)) {
      usersAndTeams = jsUtils.union(usersAndTeams, assignedTo?.teams);
    }
    usersAndTeams.forEach((userOrTeam) => {
      const isTeam = !!userOrTeam.team_name;
      const userTeamData = {
        firstName: userOrTeam.first_name ? userOrTeam.first_name : userOrTeam.team_name,
        lastName: userOrTeam.last_name ? userOrTeam.last_name : EMPTY_STRING,
        id: userOrTeam._id,
        username: userOrTeam.username,
        url: userOrTeam.profile_pic
          ? getUrlFromPicId(userOrTeam.profile_pic)
          : userOrTeam.team_pic
            ? getUrlFromPicId(userOrTeam.team_pic)
            : null,
      };
      if (isTeam) userTeamData.team_name = userOrTeam?.team_name;
      userImages.push(userTeamData);
    });
  }

  const rejectChange = (event) => {
    event.preventDefault();
    const rejectData = {
      task_log_id: active_task_details.task_log_info._id,
    };
    onRejectTask(rejectData, history, onCloseIconClick);
  };

  const acceptChange = (event) => {
    event.preventDefault();
    const acceptData = {
      task_log_id: active_task_details.task_log_info._id,
      status: TASK_ACTION.STATUS_ACCEPTED,
    };
    if (acceptedAs) {
      acceptData.accepted_as = acceptedAs?._id;
    }
    onUpdateTaskStatus(acceptData, onCloseIconClick, statevariables, setDashboardNavigationLink);
  };

  return (
    <div className={cx(styles.Container, className)}>
      <div className={cx(gClasses.FTwo13BlueV16, gClasses.FontWeight500)}>
        {t(TASK_ACTION.TITLE)}
      </div>
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MT6)}>
        <div className={cx(gClasses.FOne13GrayV36, gClasses.PR15)}>{t(TASK_ACTION.LABEL)}</div>
        {(!jsUtils.isEmpty(userImages) && !hideAvatarGroup) && (<AvatarGroup userImages={userImages} />)}
      </div>
      {children}
      <div className={cx(gClasses.MT10, BS.D_FLEX, gClasses.WidthFitContent)}>
        <Button buttonType={BUTTON_TYPE.CANCEL} onClick={rejectChange} disabled={disableButton}>
          {TASK_ACTION.BUTTON.LABEL.REJECT}
        </Button>
        <Button className={gClasses.ML20} buttonType={BUTTON_TYPE.PRIMARY} onClick={acceptChange} disabled={disableButton}>
          {TASK_ACTION.BUTTON.LABEL.ACCEPT}
        </Button>
      </div>
    </div>
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TaskAction));

TaskAction.propTypes = {
  className: PropTypes.objectOf(PropTypes.any),
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  externalUserOrTeam: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  externalUserOrTeamDocUrl: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  hideAvatarGroup: PropTypes.bool,
};
TaskAction.defaultProps = {
  className: {},
  externalUserOrTeam: null,
  externalUserOrTeamDocUrl: null,
  hideAvatarGroup: false,
};
