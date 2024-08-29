import React from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import UserImage from 'components/user_image/UserImage';
import { BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import { getUserPanelData } from 'redux/selectors/LandingPageSelctor';
import { getFullName } from 'utils/generatorUtils';
import { useHistory } from 'react-router-dom';
import { COMPLETED_TASKS, OPEN_TASKS, TASKS } from 'urls/RouteConstants';
import { keydownOrKeypessEnterHandle, routeNavigate } from 'utils/UtilityFunctions';
import { taskListDataChange } from 'redux/actions/TaskActions';
import { useTranslation } from 'react-i18next';
import styles from './UserPanel.module.scss';
import { M_T_STRINGS, USER_PANEL_CONSTANTS } from '../LandingPage.strings';
import { ROUTE_METHOD } from '../../../utils/Constants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function UserPanel(props) {
  const {
    first_name,
    last_name,
    email,
    profile_pic,
    pendingTaskCount,
    completedTaskCount,
    overdueTaskCount,
    state,
  } = props;
  const { t } = useTranslation();
  let profilePicSrc = null;
  if (state.profile_pic) {
    if (state.profile_pic.base64) {
      profilePicSrc = state.profile_pic.base64;
    } else {
      profilePicSrc = state.profile_pic;
    }
  } else {
    profilePicSrc = profile_pic;
  }
  const history = useHistory();
  const userPanelClickHandler = (taskType) => {
    let taskPathName;
    switch (taskType) {
      case 'completed':
        taskPathName = `${TASKS}/${COMPLETED_TASKS}`;
        routeNavigate(history, ROUTE_METHOD.PUSH, taskPathName);
        break;
      case 'pending':
        taskPathName = `${TASKS}/${OPEN_TASKS}`;
        routeNavigate(history, ROUTE_METHOD.PUSH, taskPathName);
        break;
      case 'overdue':
        taskPathName = `${TASKS}/${OPEN_TASKS}`;
        const taskState = {
          is_filter_applied: true,
          appliedFilterList: [{
            label: t(M_T_STRINGS.TASK_LIST.SORT_BY_DUE_DATE.LABLE),
            value: USER_PANEL_CONSTANTS.OVERDUE,
          }],
        };
        routeNavigate(history, ROUTE_METHOD.PUSH, taskPathName, EMPTY_STRING, taskState);
        break;
      default:
        break;
    }
  };

  const onViewProfileClick = () => {
    const taskState = {
      userSettingsModal: true,
    };
    routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, EMPTY_STRING, taskState);
  };

  return (
    <div
        className={cx(
          styles.ContainerUserPanel,
          gClasses.MB30,
        )}
    >
        <div className={gClasses.CenterH}>
          <div className={styles.ImageContainer}>
            <UserImage
              className={cx(styles.UserImage2, gClasses.DisplayFlex)}
              src={profilePicSrc}
              firstName={first_name}
              lastName={last_name}
              imageStyles={{ zIndex: 2 }}
              ariaHidden="true"
            />
          </div>
        </div>
        <div
          className={cx(
            gClasses.FontWeight600,
            gClasses.FTwo14Gray90,
            gClasses.CenterH,
            gClasses.MT8,
          )}
        >
          <div className={gClasses.TwoLineEllipsis}>
            {getFullName(first_name, last_name)}
          </div>
        </div>
        <div
          className={cx(
            gClasses.FTwo12GrayV89,
            gClasses.CenterH,
          )}
        >
          {email}
        </div>
        <div
        className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MT16)}
        >
          <div
          className={cx(gClasses.CursorPointer, styles.CountDetails)}
          onClick={() => userPanelClickHandler('completed')}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && userPanelClickHandler('completed')}
          role="button"
          tabIndex={0}
          >
            <div
              className={cx(
                gClasses.FTwo16Gray90,
                gClasses.FontWeight600,
                BS.TEXT_CENTER,
                styles.TaskCount,
              )}
            >
              {completedTaskCount}
            </div>
            <div
              className={cx(
                gClasses.FTwo12GrayV89,
                styles.TaskCountType,
              )}
            >
              {USER_PANEL_CONSTANTS.COMPLETED}
            </div>
          </div>
          <div
           className={cx(gClasses.CursorPointer, styles.CountDetails)}
           onClick={() => userPanelClickHandler('pending')}
           onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && userPanelClickHandler('pending')}
           role="button"
           tabIndex={0}
          >
            <div
              className={cx(
                gClasses.FTwo16Gray90,
                gClasses.FontWeight600,
                BS.TEXT_CENTER,
                styles.TaskCount,
              )}
            >
              {pendingTaskCount}
            </div>
            <div
              className={cx(
                gClasses.FTwo12GrayV89,
                styles.TaskCountType,
              )}
            >
              {USER_PANEL_CONSTANTS.PENDING}
            </div>
          </div>
          <div
           className={cx(gClasses.CursorPointer, styles.CountDetails)}
           onClick={() => userPanelClickHandler('overdue')}
           onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && userPanelClickHandler('overdue')}
           role="button"
           tabIndex={0}
          >
            <div
              className={cx(
                gClasses.FTwo16Gray90,
                gClasses.FontWeight600,
                BS.TEXT_CENTER,
                gClasses.CursorPointer,
                styles.TaskCount,
              )}
            >
              {overdueTaskCount}
            </div>
            <div
              className={cx(
                gClasses.FTwo12GrayV89,
                styles.TaskCountType,
              )}
            >
              {USER_PANEL_CONSTANTS.OVERDUE}
            </div>
          </div>
        </div>
        <div className={gClasses.CenterH}>
          <button className={cx(styles.UserProfileButton, gClasses.FTwo13, gClasses.FontWeight500, gClasses.MT24)} onClick={() => onViewProfileClick()}>{USER_PANEL_CONSTANTS.VIEW_PROFILE}</button>
        </div>
    </div>
  );
}
const mapStateToProps = ({
  RoleReducer,
  AdminProfileReducer,
  DeveloperProfileReducer,
  MemberProfileReducer,
  TaskReducer,
  UserProfileReducer,
}) => {
  return {
    state: UserProfileReducer,
    ...getUserPanelData({
      RoleReducer,
      AdminProfileReducer,
      DeveloperProfileReducer,
      MemberProfileReducer,
      TaskReducer,
      UserProfileReducer,
    }),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onTaskListDataChange: (value) => {
      dispatch(taskListDataChange(value));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPanel);
