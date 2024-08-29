import React, { useContext, useLayoutEffect } from 'react';
import { ETabVariation, Tab, WorkHallPageLoader } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Tasks from './tasks/Tasks';
import { GET_TASK_LIST_CONSTANTS, HOME_COMPONENT, TASK_TABLE_TYPE } from './TaskList.constants';
import styles from './TaskListing.module.scss';
import { DEFAULT_APP_ROUTE, TASKS } from '../../../../urls/RouteConstants';
import { updateEachTaskListDataByComponentId } from '../../../../redux/reducer/TaskListReducer';
import ThemeContext from '../../../../hoc/ThemeContext';
import { getActiveTaskListReducer } from './TaskListing.utils';
import { CancelToken, isBasicUserMode, routeNavigate } from '../../../../utils/UtilityFunctions';
import { BS } from '../../../../utils/UIConstants';
import { ROUTE_METHOD } from '../../../../utils/Constants';

const cancelToken = new CancelToken();

function TaskList() {
   const componentId = HOME_COMPONENT;
   const { t } = useTranslation();
   const app = useSelector((state) => state.ApplicationReducer);
   const { TAB } = GET_TASK_LIST_CONSTANTS(t);

   const history = useHistory();
   const { tab, pid } = useParams();

   const dispatch = useDispatch();
   const tabObject = TAB.OPTION.find((eachTab) => (eachTab.route === tab) && !pid);
   const taskListReducer = useSelector((state) => getActiveTaskListReducer(state, componentId));

   const tabIndex = tabObject?.tabIndex || taskListReducer?.tabIndex;

   const onTabChange = (value) => {
      const currentTabObject = TAB.OPTION.find((eachTab) => eachTab.value === value);
      const pathname = `${DEFAULT_APP_ROUTE}${TASKS}/${currentTabObject.route}`;
      routeNavigate(history, ROUTE_METHOD.PUSH, pathname, null, null);
      dispatch(updateEachTaskListDataByComponentId({ componentId, data: { tabIndex: currentTabObject.tabIndex } }));
   };

   useLayoutEffect(() => {
      if (tab) {
         const currentTabObject = TAB.OPTION.find((eachTab) => (eachTab.route === tab) && !pid);
         if (taskListReducer.tabIndex !== currentTabObject?.tabIndex) {
            dispatch(updateEachTaskListDataByComponentId({ componentId, data: { tabIndex: currentTabObject?.tabIndex } }));
         }
      }
   }, [tab]);

   const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
    const isBasicUser = isBasicUserMode(history);
    const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;
    return (
       <div className={styles.TaskList} style={{ background: colorScheme?.widgetBg }}>
            <Tab
                options={TAB.OPTION}
                selectedTabIndex={Number(tabIndex)}
                variation={ETabVariation.primary}
                onClick={onTabChange}
                bottomSelectionClass={styles.ActiveBar}
                textClass={styles.TabText}
                className={styles.Tab}
                colorScheme={colorScheme}
            />
            <div className={styles.Tasks}>
               {app?.homeTaskCompLoading ? <WorkHallPageLoader color={colorSchema?.activeColor && colorSchema?.activeColor} className={BS.H100} /> : (
                  <Tasks
                     componentId={componentId}
                     taskListType={TAB.VALUE[tabIndex]}
                     cancelToken={cancelToken}
                     tableType={TASK_TABLE_TYPE.PAGINATED}
                     defaultFilters={{ sort_by: -1, size: 25 }}
                  />
               )}
            </div>
       </div>
    );
}

export default TaskList;
