import React from 'react';
import { useLocation, useParams, useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ASSIGNED_TO_OTHERS_TASKS, COMPLETED_TASKS, DATA_LIST_DASHBOARD, HOME, OPEN_TASKS, FLOW_DASHBOARD, SNOOZED_TASK, TASKS } from '../../../../../urls/RouteConstants';
import { TASK_LIST_TYPE } from '../TaskList.constants';
import TaskContent from '../../../../landing_page/my_tasks/task_content/TaskContent';
import { getTaskTabIndexFromRouteTab } from '../../../../../hoc/basic_user_layout/BasicUserLayout.utils';
import { get } from '../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { LANDING_PAGE_TOPICS } from '../../../../landing_page/main_header/common_header/CommonHeader.strings';
import { getDefaultAppRoutePath, getUserRoutePath, isBasicUserMode, routeNavigate } from '../../../../../utils/UtilityFunctions';
import { REDIRECTED_FROM, ROUTE_METHOD } from '../../../../../utils/Constants';
import { TASK_CONTENT_STRINGS, TASK_TAB_INDEX } from '../../../../landing_page/LandingPage.strings';
import { getTabFromUrl, getTabFromUrlForBasicUserMode } from '../../../../../utils/taskContentUtils';
import styles from './TaskDetail.module.scss';
import { TAB_ROUTE } from '../../dashboard/flow/Flow.strings';

function TaskDetail() {
    const history = useHistory();
    const { t } = useTranslation();
    const location = useLocation();
    const locationParams = useParams();
    const stateFromLocation = location?.state;
    const { isSystemDefinedApp } = useSelector((store) => store?.ApplicationReducer);

    let taskDetail = null;

    const getBreadCrumbTitle = () => {
        const { location } = history;
        const taskListTabIndex = isBasicUserMode({ location }) ? getTabFromUrlForBasicUserMode(location.pathname) : getTabFromUrl(location.pathname);
        if (taskListTabIndex === TASK_TAB_INDEX.OPEN) {
          return {
            title: t(TASK_CONTENT_STRINGS.TASK_INFO.TASK_TYPE.MY_TASKS),
            route: `${TASKS}/${OPEN_TASKS}`,
          };
        } else if (taskListTabIndex === TASK_TAB_INDEX.COMPLETED) {
          return {
            title: t(TASK_CONTENT_STRINGS.TASK_INFO.TASK_TYPE.MY_COMPLETED_TASKS),
            route: `${TASKS}/${COMPLETED_TASKS}`,
          };
        } else if (taskListTabIndex === TASK_TAB_INDEX.ASSIGNED_TO_OTHERS) {
          return {
            title: t(TASK_CONTENT_STRINGS.TASK_INFO.TASK_TYPE.ASSIGNED_TO_OTHERS),
            route: `${TASKS}/${ASSIGNED_TO_OTHERS_TASKS}`,
          };
        } else if (taskListTabIndex === TASK_TAB_INDEX.SNOOZED_TASK) {
            return {
              title: t(TASK_CONTENT_STRINGS.TASK_INFO.TASK_TYPE.SNOOZED_TASKS),
              route: `${TASKS}/${SNOOZED_TASK}`,
            };
          }
          return {
            title: EMPTY_STRING,
            route: EMPTY_STRING,
          };
      };

    const getTaskContent = () => {
        let taskContent = null;
        const activeTaskId = locationParams?.pid || stateFromLocation?.activeTaskId;
        const tabIndex = locationParams?.tab || stateFromLocation?.tabIndex;
        const taskListApiParam = get(stateFromLocation, ['taskListApiParams'], {});

        const onClose = () => {
            const stringToFind = `${TASKS}/${tabIndex}`;
            const existingPathname = get(location, ['pathname'], EMPTY_STRING);
            let endRange = (existingPathname.indexOf(stringToFind));
            if (!locationParams?.app_name) {
                endRange = (existingPathname.indexOf(stringToFind) + stringToFind.length);
            }
            const pathname = existingPathname.substring(0, endRange);
            const taskDetailsClosePathName = stateFromLocation?.fromPathname || pathname;

            const state = location?.state;
            const defaultComponent = {
                [state?.standardUserRedirectComponentId]: state?.taskListApiParams,
            };
            routeNavigate(history, ROUTE_METHOD.REPLACE, taskDetailsClosePathName, null, { ...history?.state, hideClosePopper: true, defaultComponent });
        };

        if (tabIndex !== TASK_LIST_TYPE.DRAFT_TASKS) {
            const breadcrumbList = [];
            let redirectURL = `${HOME}`;
            let breadCrumbText = t(LANDING_PAGE_TOPICS.HOME);
            const { title = EMPTY_STRING, route = EMPTY_STRING } = getBreadCrumbTitle();
            switch (history?.location?.state?.redirectedFrom) {
                case REDIRECTED_FROM.FLOW_DASHBOARD:
                if (history?.location?.state?.sourceName) {
                    breadCrumbText = history?.location?.state?.sourceName;
                    redirectURL = `${FLOW_DASHBOARD}/${history?.location?.state?.flow_uuid}/${TAB_ROUTE.ALL_REQUEST}`;
                }
                break;
                case REDIRECTED_FROM.TASK_LIST:
                case REDIRECTED_FROM.APP:
                if (history?.location?.state?.sourceName) {
                    redirectURL = history?.location?.state?.fromPathname;
                    breadCrumbText = title;
                } else {
                  breadCrumbText = title;
                  redirectURL = route;
                  let bcRoute = null;

                  if (isBasicUserMode({ location })) {
                    if (isSystemDefinedApp) {
                      bcRoute = getDefaultAppRoutePath(HOME);
                      redirectURL = getDefaultAppRoutePath(redirectURL);
                    } else {
                      bcRoute = getUserRoutePath(HOME);
                    }
                  } else {
                    bcRoute = HOME;
                  }

                  breadcrumbList.push({
                    text: t(LANDING_PAGE_TOPICS.HOME),
                    route: bcRoute,
                  });
                }
                break;
                case REDIRECTED_FROM.DATALIST_INSTANCE:
                  if (history?.location?.state?.sourceName) {
                    breadCrumbText = history?.location?.state?.sourceName;
                    redirectURL = `${DATA_LIST_DASHBOARD}/${history?.location?.state?.data_list_uuid}/${history?.location?.state?.instance_id}`;
                  }
                  break;
                case REDIRECTED_FROM.FLOW_DATA_INSTANCE:
                if (history?.location?.state?.sourceName) {
                  breadCrumbText = history?.location?.state?.sourceName;
                  redirectURL = `${FLOW_DASHBOARD}/${history?.location?.state?.flow_uuid}/${history?.location?.state?.instance_id}`;
                }
                break;
                default:
                  if (isBasicUserMode({ location })) {
                    redirectURL = getDefaultAppRoutePath(HOME);
                  }
                break;
            }
            breadcrumbList.push({
              text: breadCrumbText,
              route: redirectURL,
              className: styles.TaskTabNameClass,
            });
            taskContent =
                <TaskContent
                    initialBreadCrumbList={breadcrumbList}
                    id={activeTaskId}
                    isFlowInitiationTask={stateFromLocation?.isFlowInitiationTask}
                    selectedCardTab={getTaskTabIndexFromRouteTab(tabIndex)}
                    refreshTaskListApiParams={taskListApiParam}
                    onCloseIconClick={onClose}
                    onTaskSuccessfulSubmit={onClose}
                    isBasicUser
                />;
        }
        return taskContent;
    };

    taskDetail = getTaskContent();
    return taskDetail;
}
export default TaskDetail;
