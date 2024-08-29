import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import queryString from 'query-string';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { TOOL_TIP_TYPE } from 'utils/Constants';
// import ChatIconV2 from 'assets/icons/ChatIconV2';
import { DATALIST_USERS, TEAMS } from 'urls/RouteConstants';
// import { onUserChatClickHandler } from 'hoc/layout/left_nav_bar/side_menu/chat_menu/ChatMenu.utils';
import { store } from 'Store';
import CreateTaskIcon from 'assets/icons/CreateTaskIcon';
import { createTaskSetState } from 'redux/reducer/CreateTaskReducer';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { get } from 'utils/jsUtility';
import { CUSTOMER_TOOLTIP } from 'components/form_components/pagination/Pagination.strings';
import { useTranslation } from 'react-i18next';
import jsUtils from '../../../../utils/jsUtility';
import { getUserData } from '../../../../axios/apiService/addMember.apiService ';
import { BS } from '../../../../utils/UIConstants';
import styles from './CustomUserInfoTooltip.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';
import UserImage from '../../../user_image/UserImage';
import { getRouteLink, isBasicUserMode, routeNavigate } from '../../../../utils/UtilityFunctions';
import AlertIcon from '../../../../assets/icons/teams/AlertIcon';
import { ROUTE_METHOD } from '../../../../utils/Constants';
import { apiTeamDetailsById } from '../../../../axios/apiService/teams.apiService';
import { DATA_LIST_DASHBOARD } from '../../../../urls/RouteConstants';
import { TAB_ROUTE } from '../../../../containers/application/app_components/dashboard/flow/Flow.strings';

function CustomUserInfoTooltip(props) {
  const [userData, setUserData] = useState({});
  const [teamData, setTeamData] = useState([]);
  const [displayDetails, setDisplayDetails] = useState(false);
  const [isTeamUnauthorized, setIsTeamUnauthorized] = useState(false);
  const { t } = useTranslation();
  const { id, userOrTeam,
    hideTask,
    // userId,
    user_type } = props;
  const history = useHistory();
  const [datalistInfo, setdatalistInfo] = useState({});
  let navigateTo;
  let navigateToTeam;
  const isNormalMode = isBasicUserMode(history);

  useEffect(() => {
    const params = {
      _id: id,
    };
    if (id && (userOrTeam === TOOL_TIP_TYPE.USER || userOrTeam === TOOL_TIP_TYPE.PROFILE)) {
      const cancelDataListToken = {
        cancelToken: null,
      };
      const setDataListCancelToken = (c) => { cancelDataListToken.cancelToken = c; };
      getUserData(params, setDataListCancelToken).then((response) => {
        setUserData(response);
        setdatalistInfo(response.datalist_info);
        setDisplayDetails(true);
      })
        .catch((error) => {
          console.log('getuserdata api catch', error);
          setDisplayDetails(false);
        });
    } else if (id && userOrTeam === 'team') {
      apiTeamDetailsById(id)
        .then((response) => {
          setTeamData(response);
          setDisplayDetails(true);
        })
        .catch((error) => {
          console.log('apiTeamDetailsById api catch', error);
          setIsTeamUnauthorized(true);
          setDisplayDetails(false);
        });
    }
  }, [id, userOrTeam]);

  if (!jsUtils.isUndefined(datalistInfo)) {
    if (isNormalMode) {
      navigateTo = getRouteLink(`${DATA_LIST_DASHBOARD}/${datalistInfo.data_list_uuid}/${TAB_ROUTE.ALL_REQUEST}/${datalistInfo.entry_id}`, history);
    } else {
      navigateTo = getRouteLink(`${DATALIST_USERS}/${datalistInfo.data_list_uuid}/${datalistInfo.entry_id}`, history);
    }
  }

  if (id && userOrTeam === 'team') {
    navigateToTeam = getRouteLink(`${TEAMS}/${id}`, history);
  }

  // const constructChatThreadData = () => {
  //   let threadName = '';
  //   if (userData.first_name) {
  //     threadName = userData.last_name ? `${userData.first_name} ${userData.last_name}` : userData.first_name;
  //   } else {
  //     threadName = userData.email;
  //   }
  //   const data = {
  //     firstName: userData.first_name,
  //     id: userData.email,
  //     isActive: true,
  //     lastName: userData.last_name,
  //     notificationCount: 0,
  //     threadEmail: userData.email,
  //     threadId: userData.email,
  //     threadName: threadName,
  //     threadPic: userData.profile_pic,
  //     threadStatus: false,
  //     threadType: 'p2p',
  //     userId: userData._id,
  //   };
  //   return data;
  // };

  // const onChatIconClickHandler = (e) => {
  //   e.stopPropagation();
  //   const data = constructChatThreadData();
  //   onUserChatClickHandler(data);
  // };

  const onClickHandler = (e) => {
    e.stopPropagation();
    const currentParams = queryString.parseUrl(history.location.pathname);
    const newParams = { ...get(currentParams, ['query'], {}), create: 'task' };
    const searchParams = new URLSearchParams(newParams).toString();
    routeNavigate(history, ROUTE_METHOD.PUSH, null, searchParams, null);
    if (id && userOrTeam === 'team') {
      const assignees = {};
      assignees.teams = [];
      assignees.teams.push(teamData);
      store.dispatch(createTaskSetState({ assignees: assignees }));
    } else {
      const assignees = {};
      assignees.users = [];
      assignees.users.push(userData);
      store.dispatch(createTaskSetState({ assignees: assignees }));
    }
  };

  let profile_pic = null;
  if (userData.profile_pic) {
    const documentDetail = jsUtils.find(userData.document_url_details, { document_id: userData.profile_pic });
    profile_pic = documentDetail && documentDetail.signedurl;
  }
  if (teamData && teamData.team_pic && !jsUtils.isNull(teamData.team_pic)) {
    profile_pic = teamData.team_pic;
  }

  const userRedirectHandle = (e) => {
    e.stopPropagation();
  };

  const getToolTip = () => {
    switch (userOrTeam) {
      case TOOL_TIP_TYPE.USER:
        return (
          displayDetails && (
            <div className={cx(styles.RectangleShadowBox)}>
              <div className={cx(styles.BasicUserDetailsSection, BS.D_FLEX)}>
                <UserImage
                  src={profile_pic}
                  className={cx(styles.UserIcon, gClasses.CursorPointer)}
                  firstName={userData.first_name}
                  lastName={userData.last_name}
                />
                <div className={cx(BS.FLEX_COLUMN, BS.D_FLEX, gClasses.ML20, gClasses.Ellipsis)}>
                  <p className={styles.Name}>

                    {userData.first_name}
                    {' '}
                    {userData.last_name}

                  </p>
                  <p className={styles.Email}>{userData.email}</p>
                </div>
              </div>
              <div className={BS.D_FLEX}>
                <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN)}>

                  <p className={styles.Label}>{TOOL_TIP_TYPE.ROLE}</p>
                  <p className={styles.Value}>{userData.role ? userData.role : 'Not mentioned'}</p>
                </div>
                <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, gClasses.ML40)}>
                  <p className={styles.Label}>{TOOL_TIP_TYPE.BU}</p>
                  <p className={styles.Value}>{userData.business_unit ? userData.business_unit : 'Not mentioned'}</p>
                </div>

              </div>

              <div className={cx(BS.D_FLEX, gClasses.MB20)}>
                <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN)}>
                  <p className={styles.Label}>{TOOL_TIP_TYPE.REPORTING_MANAGER}</p>
                  <p className={styles.Value}>{userData.reporting_manager ? userData.reporting_manager.email : 'Not mentioned'}</p>
                </div>
              </div>

            </div>
          )
        );
      case TOOL_TIP_TYPE.TEAM:
        return (
          <div>
            {!isTeamUnauthorized ? (
              <div
                className={cx(styles.ToolTipContainer)}
                onClick={userRedirectHandle}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && userRedirectHandle(e)}
              >
                <div className={cx(styles.ProfileDetailContainer, BS.D_FLEX)}>
                  <UserImage
                    src={profile_pic}
                    className={cx(styles.UserIcon, gClasses.CursorPointer)}
                    firstName={teamData.team_name}
                    lastName={EMPTY_STRING}
                  />
                  <div
                    className={cx(
                      BS.FLEX_COLUMN,
                      BS.D_FLEX,
                      gClasses.ML20,
                      gClasses.Ellipsis,
                    )}
                  >
                    <h3 className={cx(gClasses.Ellipsis, gClasses.Width150)}>
                      {teamData.team_name}
                    </h3>
                    <p
                      className={cx(
                        gClasses.MT5,
                        gClasses.Ellipsis,
                        gClasses.FTwo11GrayV53,
                      )}
                    >
                      {userData.email}
                    </p>
                  </div>
                </div>
                {user_type === 0 ? null : (
                  <div className={cx(styles.ActionContainer)}>
                    <div className={cx(styles.ButtonContainer, BS.D_FLEX)}>
                      <Link
                        style={{ textDecoration: 'none' }}
                        to={navigateToTeam}
                        target="_blank"
                        onClick={userRedirectHandle}
                      >
                        <div
                          className={cx(
                            styles.TextClass,
                            styles.DetailViewContainer,
                          )}
                        >
                          {CUSTOMER_TOOLTIP.OPEN_LABEL}
                        </div>
                      </Link>
                      <div className={BS.D_FLEX}>
                        <div className={styles.tooltip}>
                          <div
                            className={styles.IconContainerClass}
                            role="button"
                            onClick={onClickHandler}
                            tabIndex={0}
                            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClickHandler(e)}
                          >
                            <CreateTaskIcon
                              id={`create_task${id}`}
                              iconFillClass="#1a9cd1"
                              className={cx(
                                styles.tooltip,
                                styles.CteateTaskIconClass,
                                gClasses.CursorPointer,
                              )}
                            />
                            <span className={styles.tooltiptext}>
                              {CUSTOMER_TOOLTIP.CREATE_TASK}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={cx(styles.TeamsUnauthorizeContainer)}
                onClick={userRedirectHandle}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  keydownOrKeypessEnterHandle(e) && userRedirectHandle(e)
                }
              >
                <div className={gClasses.M10}>
                  <AlertIcon />
                </div>
                <div className={cx(styles.UnauthorizedTextClass)}>
                {t('server_error_code_string.unauthorized')}
                </div>
              </div>
            )}
          </div>
        );
      case TOOL_TIP_TYPE.PROFILE:
        return (
          <div
            className={cx(styles.ToolTipContainer)}
          // onClick={userRedirectHandle}
          // role="button"
          // tabIndex={0}
          // onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && userRedirectHandle(e)}
          // onMouseDown={userRedirectHandle}
          >
            <div
              className={cx(styles.ProfileDetailContainer, BS.D_FLEX)}
            >
              <UserImage
                src={profile_pic}
                className={cx(styles.UserIcon)}
                firstName={userData.first_name}
                lastName={userData.last_name}
              />
              <div
                className={cx(
                  BS.FLEX_COLUMN,
                  BS.D_FLEX,
                  gClasses.ML20,
                  gClasses.Ellipsis,
                )}
              >
                <h3
                  className={cx(gClasses.Ellipsis, gClasses.Width150)}
                >
                  {userData.first_name}
                  {' '}
                  {userData.last_name}
                </h3>
                <p
                  className={cx(
                    gClasses.MT5,
                    gClasses.Ellipsis,
                    gClasses.FTwo11GrayV53,
                  )}
                >
                  {userData.email}
                </p>
              </div>
            </div>
            {(user_type === 0) ? null : (
              <div className={cx(styles.ActionContainer)}>
                <div className={cx(styles.ButtonContainer, BS.D_FLEX)}>
                  <Link style={{ textDecoration: 'none' }} to={navigateTo} target="_blank" onClick={userRedirectHandle}>
                    <div className={cx(styles.TextClass, styles.DetailViewContainer)}>
                    {CUSTOMER_TOOLTIP.OPEN_LABEL}

                    </div>
                  </Link>
                  {!hideTask && (
                  <div className={BS.D_FLEX}>
                    <div className={styles.tooltip}>
                      <div
                      className={styles.IconContainerClass}
                      role="button"
                      onClick={onClickHandler}
                      tabIndex={0}
                      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClickHandler(e)}
                      >
                        <CreateTaskIcon id={`create_task${id}`} iconFillClass="#217CF5" className={cx(styles.tooltip, styles.CteateTaskIconClass, gClasses.CursorPointer)} />
                        <span className={styles.tooltiptext}>{CUSTOMER_TOOLTIP.CREATE_TASK}</span>
                      </div>
                    </div>
                    {/* {(id === userId) ? null : (
                      <div className={styles.tooltip}>
                        <div
                        className={styles.IconContainerClass}
                        role="button"
                        onClick={onChatIconClickHandler}
                        tabIndex={0}
                        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onChatIconClickHandler(e)}
                        >
                          <ChatIconV2
                            id={`Chat${id}`}
                            className={styles.Chat}
                          />
                          <span className={cx(styles.tooltiptext, styles.CustomInnerTaskClasss)}>Chat</span>
                        </div>
                      </div>
                    )} */}
                  </div>)}

                </div>
              </div>
            )}

          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {getToolTip()}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    userId: state.RoleReducer.user_id,
  };
};

export default connect(
  mapStateToProps,
)(withRouter(CustomUserInfoTooltip));
