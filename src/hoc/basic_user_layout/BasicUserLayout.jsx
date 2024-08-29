import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import cx from 'classnames/bind';
import { useLocation, useParams, withRouter } from 'react-router';
import { NOTIFICATION_TASK_REFRESH_TYPES, NOTIFICATION_TYPES } from 'containers/landing_page/main_header/notification/EachNotification.strings';
import DownloadWindow from 'components/download/download_window/DownloadWindow';
import DownloadActivityWindow from 'components/download/download_window/download_activity_window/DownloadActivityWindow';
import ConfirmPopover from 'components/popovers/confirm_popover/ConfirmPopover';
import NotificationContent from 'containers/landing_page/main_header/notification/NotificationContent';
import { getAllNotficationsApiThunk } from 'redux/actions/Notifications.Action';
import getReportDownloadDocsThunk from 'redux/actions/DownloadWindow.Action';
import { Toast } from '@workhall-pvt-lmt/wh-ui-library';
import Header from '../../containers/application/header/Header';
import { DOWNLOAD_WINDOW_STRINGS } from '../../components/download/Download.strings';
import styles from './BasicUserLayout.module.scss';
import { BS, DEFAULT_COLORS_CONSTANTS } from '../../utils/UIConstants';
import UserSettings from '../../containers/user_settings/UserSettings';
import AlertStatusPopover from '../../components/alert_status_popover/AlertStatusPopover';
import gClasses from '../../scss/Typography.module.scss';
import jsUtility, { isEmpty, get, cloneDeep } from '../../utils/jsUtility';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import Task from '../../containers/task/task/Task';
import { CREATE, MODULE_TYPES, NOTIFICATION_SOCKET_EVENTS, REDIRECTED_FROM, TEAMS_CONST, ROUTE_METHOD } from '../../utils/Constants';
import { TASK_LIST_TYPE, HOME_COMPONENT, TASK_TABLE_TYPE } from '../../containers/application/app_components/task_listing/TaskList.constants';
import { OPEN_TASKS, TASKS, SIGNIN, CREATE_TEAM, TEAMS_EDIT_TEAM, APP, TEAMS, DRAFT_TASK, DEFAULT_APP_ROUTE } from '../../urls/RouteConstants';
import { taskListReducerDataChange } from '../../redux/reducer/TaskListReducer';
import { CancelToken, getProfileDataForChat, getTaskDataByLocation, routeNavigate, logoutClearUtil } from '../../utils/UtilityFunctions';
import FormStatusPopover from '../../components/popovers/form_status_popover/FormStatusPopover';
// import { teamDataChange } from '../../redux/actions/Team.Action';
import { getTaskListThunk } from '../../redux/actions/TaskList.Action';
import TaskCreationLoader from '../../containers/task/task/task_creation_loader/TaskCreationLoader';
import FlowTask from '../../containers/flow/flow_dashboard/task/Task';
import DataListTask from '../../containers/data_list/view_data_list/addTask/Task';
import { getActiveTaskListDataThunk } from '../../redux/actions/TaskActions';
import { notificationsDataChangeAction } from '../../redux/reducer/NotificationsReducer';
import EditConfirmPopover from '../../components/popovers/edit_confirm_popover/EditConfirmPopover';
import { applicationStateChange } from '../../redux/reducer/ApplicationReducer';
import CreateEditTeam from '../../containers/team/create_and_edit_team/CreateEditTeam';
import MfaVerificationModal from '../../containers/mfa/mfa_verification_modal/MfaVerificationModal';
import { axiosGetUtils } from '../../axios/AxiosHelper';
import { SIGN_OUT } from '../../urls/ApiUrls';
import PageNav from '../../containers/application/header/page_nav/PageNav';
import { APP_HEADER_DISPLAY } from '../../containers/application/app_listing/app_header_settings/AppHeaderSettings.string';
import ThemeContext from '../ThemeContext';

function BasicUserLayout(props) {
    const {
        appRoutes,
        isDownloadNotificationsModalOpen,
        retryDownloadData: {
            type,
        },
        isDownloadActivityOpen,
        hidePages,
        history,
        isNotificationsModalOpen,
        activeTaskId,
        currentPageId,
        clearActiveTaskId,
        setActiveTaskId,
        children,
        formPopoverStatus,
        getTaskList,
        isMlTaskLoading,
        appOnChange,
        appState,
        isMfaEnabled,
        isMfaEnforced,
        isMfaVerified,
        headerType,
    } = props;
    const isDisplayMultipleApp = jsUtility.isEqual(headerType, APP_HEADER_DISPLAY.MULTIPLE);
    const dispatch = useDispatch();
    const { colorScheme } = useContext(ThemeContext);
    const popoverRef = useRef(null);
    const { page_id } = useParams();
    const isTaskDownloadActivity = type === DOWNLOAD_WINDOW_STRINGS.ACTIVITY.TYPE.TASK;
    const searchParams = new URLSearchParams(jsUtility.get(history, ['location', 'search'], EMPTY_STRING));
    const location = useLocation();
    const { state = {} } = location;
    const clonedState = state;
    let cancelForSignOut;

    const notificationSocketListner = (userProfileData) => {
      const { history } = props;
      userProfileData.notificationSocket.on(NOTIFICATION_SOCKET_EVENTS.ON_EVENTS.NOTIFICATION, (data) => {
        const { notificationsDataChange, totalCount, getAllNotficationsApiCall, isNotificationsModalOpen } = props;
        const contextData = get(data, ['context'], '');
        if (NOTIFICATION_TASK_REFRESH_TYPES.includes(contextData)) {
          const page = 1;
          console.log('NotificationSocket  new msg',
            data,
            history.location.pathname === DEFAULT_APP_ROUTE,
            history.location.pathname === `${DEFAULT_APP_ROUTE}${TASKS}/${OPEN_TASKS}`,
            `${history.location.pathname}`,
            DEFAULT_APP_ROUTE,
            `${DEFAULT_APP_ROUTE}${TASKS}/${OPEN_TASKS}`,
          );
          if (`${history.location.pathname}` === DEFAULT_APP_ROUTE || `${history.location.pathname}` === `${DEFAULT_APP_ROUTE}${TASKS}/${OPEN_TASKS}`) {
            dispatch(getTaskListThunk(
              TASK_LIST_TYPE.OPEN,
              HOME_COMPONENT,
              {
                page: page,
                size: 25,
                sort_by: -1,
              },
              new CancelToken(),
              TASK_TABLE_TYPE.PAGINATED));
          }
        }
        if (contextData !== NOTIFICATION_TYPES.DOCUMENT_UPDATE) {
          notificationsDataChange({ total_count: get(data, ['unread_count'], totalCount) });
        if (isNotificationsModalOpen) {
          const params = {
            page: 1,
            size: 10,
            is_read: 0,
          };
          getAllNotficationsApiCall(params);
        }
        }
        // Download Notification
        if (contextData === NOTIFICATION_TYPES.TASK.DOCUMENT_UPDATE || contextData === NOTIFICATION_TYPES.TASK.DOC_DOWNLOAD_COMPLETED) {
          const { onGetReportDownloadDocsThunk } = props;
          onGetReportDownloadDocsThunk();
        }
      });
      userProfileData.notificationSocket.on(NOTIFICATION_SOCKET_EVENTS.ON_EVENTS.UPDATE_COUNT, (data) => {
        const { notificationsDataChange, totalCount } = props;
        notificationsDataChange({ total_count: get(data, ['unread_count'], totalCount) });
        console.log('updated count via socket', data);
      });
      userProfileData.notificationSocket.on(NOTIFICATION_SOCKET_EVENTS.ON_EVENTS.READ_NOTIFICATION_FAILURE, (data) => {
        console.log('read failure via socket', data);
      });
    };

    const recursiveNotificationSocketListener = () => {
      const userProfileData = getProfileDataForChat();
      console.log('recursiveLIstener check', userProfileData);
      if (userProfileData && userProfileData.notificationSocket) {
        notificationSocketListner(userProfileData);
      } else {
        setTimeout(recursiveNotificationSocketListener, 500);
      }
    };

    recursiveNotificationSocketListener();

    const onCloseCreateTask = () => {
        searchParams.delete(CREATE);
        const redirectedFrom = get(clonedState, ['redirectedFrom'], null);
        console.log('adsfasfasdfasdfasdfsdfafasf', searchParams, redirectedFrom);
        if (redirectedFrom === REDIRECTED_FROM.CREATE_GLOBAL_TASK) {
            clearActiveTaskId();
            const userLayoutSearchParams = searchParams.toString();
            routeNavigate(history, ROUTE_METHOD.REPLACE, EMPTY_STRING, userLayoutSearchParams);
        } else {
            const taskListApiParam = get(clonedState, ['taskListApiParams'], {});
            if (!isEmpty(taskListApiParam)) {
                getTaskList(
                    taskListApiParam?.taskListType,
                    taskListApiParam?.componentId,
                    taskListApiParam?.pagination,
                    new CancelToken(),
                    taskListApiParam?.tableType,
                );
            }
            clearActiveTaskId();
            const userLayoutSearchParams = searchParams.toString();
            routeNavigate(history, ROUTE_METHOD.REPLACE, EMPTY_STRING, userLayoutSearchParams);
        }
    };

    const removeSocketListeners = () => {
      const userProfileData = getProfileDataForChat();
      if (userProfileData && userProfileData.notificationSocket) {
        const { notificationSocket } = userProfileData;
        notificationSocket.off(
          NOTIFICATION_SOCKET_EVENTS.ON_EVENTS.NOTIFICATION,
        );
    }
    };

    useLayoutEffect(() => {
        const taskData = getTaskDataByLocation(location) || {};
        if (taskData.tabIndex && taskData.activeTaskId) {
            setActiveTaskId(taskData.activeTaskId);
            clonedState.tabIndex = taskData.taskListType;
            clonedState.activeTaskId = taskData.activeTaskId;
        }
    }, [location.pathname]);

    useEffect(() => () => {
        removeSocketListeners();
        if (cancelForSignOut) cancelForSignOut();
      }, []);

    const redirectToSignOut = (history) => {
      sessionStorage.clear();
      history.replace(SIGNIN);
    };

    const handleSignoutHandler = () => {
      const userProfileData = getProfileDataForChat();
      if (userProfileData && userProfileData.notificationSocket) {
        removeSocketListeners();
        userProfileData.notificationSocket.emit(NOTIFICATION_SOCKET_EVENTS.EMIT_EVENTS.DISCONNECT, (code, error) => {
          console.log('Notification Socket - Disconnecting User', code, error);
        });
        userProfileData.notificationSocket.disconnect();
      }
      logoutClearUtil();
      redirectToSignOut(history);
    };

    const signOutFunction = () => {
      axiosGetUtils(SIGN_OUT, {
        cancelToken: new CancelToken((c) => {
          cancelForSignOut = c;
        }),
        isSignOut: true,
      })
        .then(() => {
          handleSignoutHandler();
        })
        .catch(() => handleSignoutHandler());
    };

    const getTaskContent = () => {
        let modalContent = null;
        const onClose = () => {
          console.log('adsfasfasdfasdfasdfsdfafasf');
            const taskData = getTaskDataByLocation(location) || {};
            const stringToFind = `${TASKS}/${taskData?.taskListType || clonedState.tabIndex}`;
            const existingPathname = jsUtility.get(location, ['pathname'], EMPTY_STRING);

            let endRange = (existingPathname.indexOf(stringToFind));
            if (!currentPageId) {
                endRange = (existingPathname.indexOf(stringToFind) + stringToFind.length);
            }
            const pathname = existingPathname.substring(0, endRange);

            const taskListApiParam = get(clonedState, ['taskListApiParams'], {});

            const routeStateData = jsUtility.get(location, ['state'], {});
            if (routeStateData?.standardUserRedirectComponentId === HOME_COMPONENT) {
              appOnChange({ homeTaskCompLoading: true });
              setTimeout(() => {
                appOnChange({ homeTaskCompLoading: false });
              }, 500);
            } else {
              const pagesBeforeChange = cloneDeep(appState?.pages);
              const pages = cloneDeep(appState?.pages);
              const pageIndex = pages?.findIndex((page) => page._id === page_id);
              if (pageIndex > -1) pages[pageIndex].isTaskLoading = true;
              appOnChange({ isPageTaskLoading: true });
              setTimeout(() => {
                appOnChange({ isPageTaskLoading: false });
              }, 500);
              appOnChange({ pages: pagesBeforeChange });
            }

            if (!isEmpty(taskListApiParam)) {
              if (taskListApiParam?.taskListType === DRAFT_TASK) {
              clearActiveTaskId();
              getTaskList(
                taskListApiParam?.taskListType,
                taskListApiParam?.componentId,
                taskListApiParam?.pagination,
                new CancelToken(),
                taskListApiParam?.tableType,
              );
              } else {
                getTaskList(
                    taskListApiParam?.taskListType,
                    taskListApiParam?.componentId,
                    taskListApiParam?.pagination,
                    new CancelToken(),
                    taskListApiParam?.tableType,
                );
              }
            }
            clearActiveTaskId();
            const userLayoutPathName = clonedState?.fromPathname || pathname;
            routeNavigate(history, ROUTE_METHOD.REPLACE, userLayoutPathName);
        };

        if (clonedState?.tabIndex === TASK_LIST_TYPE.DRAFT_TASKS) {
            if (location?.state?.taskDetails?.flow_uuid) {
                modalContent = (
                  <FlowTask
                    flowInstanceId={clonedState.taskDetails.instance_id}
                    flowName={clonedState.taskDetails.reference_name}
                    flowUuid={clonedState.taskDetails.flow_uuid}
                    isEditTask
                    onCloseIconClick={onClose}
                    onAddTaskClosed={onClose}
                    isModalOpen
                  />
                );
              } else if (location?.state?.taskDetails?.data_list_uuid) {
                modalContent = (
                  <DataListTask
                    dataListName={clonedState.taskDetails.reference_name}
                    dataListUuid={clonedState.taskDetails.data_list_uuid}
                    dataListEntryId={clonedState.taskDetails.data_list_entry_id}
                    onAddTaskClosed={onClose}
                    referenceId={() => { }}
                    isEditTask
                    onCloseIconClick={onClose}
                    isModalOpen
                  />
                );
              } else {
                modalContent = (<Task isEditTask onCloseClick={onClose} isModalOpen />);
              }
          }
          return modalContent;
    };

    const isHeaderHidden = history.location.pathname.includes(CREATE_TEAM) || history.location.pathname.includes(TEAMS_EDIT_TEAM);

    const applyBg = history.location.pathname.includes(APP) || history.location.pathname.includes(TEAMS);

    return (
        <div className={styles.Container} style={{ background: applyBg ? colorScheme?.appBg : colorScheme?.widgetBg }}>
          {isMfaEnabled && isMfaEnforced && !isMfaVerified ? (
            <MfaVerificationModal isModalOpen={isMfaEnabled && isMfaEnforced && !isMfaVerified} signOut={signOutFunction} />
          ) : (
            <div className={gClasses.H100}>
            <Toast />
            <FormStatusPopover isVisible={formPopoverStatus.isVisible} popoverRef={popoverRef} />
            {isDownloadNotificationsModalOpen && <DownloadWindow />}
            {isDownloadActivityOpen && (
              <div
                className={cx(
                    BS.P_FIXED,
                    BS.D_FLEX,
                    BS.FLEX_FLOW_REVERSE,
                    BS.ALIGN_ITEMS_END,
                    isTaskDownloadActivity ? styles.TaskDownloadActivityWindow : styles.DownloadActivityWindow,
                )}
              >
              {isDownloadActivityOpen && <DownloadActivityWindow />}
              </div>)}
            <ConfirmPopover />
            <AlertStatusPopover />
            {formPopoverStatus.isEditConfirmVisible ? <EditConfirmPopover history={history} /> : null}
            {isNotificationsModalOpen && (
                <div className={cx(gClasses.ZIndex10, BS.P_RELATIVE)}>
                        <NotificationContent
                            isModalOpen={isNotificationsModalOpen}
                        />
                </div>)
            }
            {history?.location?.state?.userSettingsModal ? (
                <UserSettings />
            ) : null}
            {(searchParams.get(CREATE) === MODULE_TYPES.TASK) && (
              <Task onCloseClick={onCloseCreateTask} isModalOpen />
            )}
            {searchParams.get(CREATE) === TEAMS_CONST ? <CreateEditTeam /> : null}
            {(activeTaskId || state?.activeTaskId) && getTaskContent()}
            {!isHeaderHidden && <Header appDetails={appRoutes} isHome={hidePages} />}
            {(!hidePages && isDisplayMultipleApp) ? (
              <div className={styles.SubContainer} style={{ backgroundColor: colorScheme?.appBg || DEFAULT_COLORS_CONSTANTS.GRAY_103 }}>
                {!hidePages && isDisplayMultipleApp && <div className={styles.HidePageNavResponsive}><PageNav isDisplayMultipleApp={isDisplayMultipleApp} appDetails={appRoutes} /></div>}
                {isMlTaskLoading && <TaskCreationLoader />}
                {children}
              </div>
            ) : (
            <>
              {isMlTaskLoading && <TaskCreationLoader />}
              {children}
            </>
            )}
            {/* Home page - {isHome ? <AppHome /> : <AppBuilder isBasicUser />} */}
            </div>
          )}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        isDownloadNotificationsModalOpen: state.DownloadWindowReducer.isDownloadNotificationsModalOpen,
        retryDownloadData: state.DownloadWindowReducer.retryDownloadData,
        isDownloadActivityOpen: state.DownloadWindowReducer.isDownloadActivityOpen,
        isNotificationsModalOpen: state.NotificationReducer.isNotificationsModalOpen,
        activeTaskId: state.TaskListReducer.activeTaskId,
        currentPageId: state.ApplicationReducer.current_page_id,
        formPopoverStatus: state.FormStatusPopoverReducer.formStatus,
        isMlTaskLoading: state.CreateTaskReducer.isMlTaskLoading,
        totalCount: state.NotificationReducer.total_count,
        appState: state.ApplicationReducer,
        isMfaVerified: state.MfaReducer.isMfaVerified,
        isMfaEnabled: state.MfaReducer.isMfaEnabled,
        isMfaEnforced: state.MfaReducer.isMfaEnforced,
        headerType: state.RoleReducer.app_header_type,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
       clearActiveTaskId: () => dispatch(taskListReducerDataChange({ activeTaskId: null })),
       setActiveTaskId: (id) => dispatch(taskListReducerDataChange({ activeTaskId: id })),
      //  teamDetailsChange: (data) => dispatch(teamDataChange(data)),
       getTaskList: (taskListType, componentId, pagination, cancelToken, tableType) => dispatch(getTaskListThunk(taskListType, componentId, pagination, cancelToken, tableType)),
       getActiveTaskList: (params, type, history, isPeriodicCall) => {
        dispatch(getActiveTaskListDataThunk(params, type, history, isPeriodicCall));
      },
      notificationsDataChange: (data) => {
        dispatch(notificationsDataChangeAction(data));
      },
      getAllNotficationsApiCall: (params) => {
        dispatch(getAllNotficationsApiThunk(params));
      },
      onGetReportDownloadDocsThunk: () => {
        dispatch(getReportDownloadDocsThunk());
      },
      appOnChange: (params) => {
        dispatch(applicationStateChange(params));
      },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BasicUserLayout));
