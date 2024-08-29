import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import jsUtility, { cloneDeep } from '../../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { APP, FLOW_DASHBOARD, REPORT, TEST_BED } from '../../../../../../urls/RouteConstants';
import Task from '../../../../../flow/flow_dashboard/task/Task';
import { CancelToken, isBasicUserMode, routeNavigate } from '../../../../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../../../../utils/Constants';
import { closeReportAppModelRouting, closeReportTableInstanceRouting } from '../../../../../report/Report.utils';
import { INDIVIDUAL_ENTRY_MODE, INDIVIDUAL_ENTRY_TYPE, IndividualEntryModel } from '../../../../../shared_container';
import { getFlowValuesActionThunk } from '../../../../../../redux/actions/ApplicationDashboardReport.Action';
import { getAppFlowFilterQuery } from '../Flow.utils';

function FlowInstance(props) {
  const {
    instanceId,
    flowUuid,
    flowData,
  } = props;

  const {
    flow_name = EMPTY_STRING,
    translation_data = {},
  } = flowData || {};

  const pref_locale = localStorage.getItem('application_language');
  const dispatch = useDispatch();
  const [showCreateTask, setShowCreateTask] = useState(false);
  const history = useHistory();

  const onClose = () => {
    const pathname = jsUtility.get(history, ['location', 'pathname'], EMPTY_STRING);
    const isAppMode = isBasicUserMode(history);
    if (isAppMode) {
      if (pathname.includes(REPORT)) {
        closeReportAppModelRouting(history);
      } else {
        const splitPathname = pathname.split('/');
        const index = splitPathname.findIndex(
          (eachPath) => eachPath === FLOW_DASHBOARD.replace('/', ''),
        );
        if (index > -1) {
          splitPathname.splice(pathname?.includes(APP) ? index : index + 3);
          const flowSplitPathName = splitPathname.join('/');
          routeNavigate(history, ROUTE_METHOD.PUSH, flowSplitPathName);
        }
      }
    } else if (pathname.includes(REPORT)) {
      closeReportTableInstanceRouting(history);
    } else {
      const splitPathname = pathname.split('/');
      const index = splitPathname.findIndex((eachPath) => eachPath === FLOW_DASHBOARD.replace('/', ''));
      if (index > -1) {
        const sliceIndex = pathname.includes(TEST_BED) ? index + 3 : index + 2;
        splitPathname.splice(sliceIndex);
        const flowInstanceSplitPathName = splitPathname.join('/');
        routeNavigate(history, ROUTE_METHOD.PUSH, flowInstanceSplitPathName, null, null, true);
      }
    }
  };

  const onAddTask = () => {
    setShowCreateTask(true);
  };

  const refreshOnDelete = () => {
    const { pagination_details } = flowData.lstPaginationData;
    const { size } = jsUtility.isArray(pagination_details) ? pagination_details[0] : {};
    const queryData = getAppFlowFilterQuery(
      cloneDeep(flowData),
      size || 5,
      0,
    );
    dispatch(
      getFlowValuesActionThunk(
        flowData.flow_id,
        queryData,
        '',
        cloneDeep(flowData),
        new CancelToken(),
      ),
    );
  };

   return (
     <div>
       {showCreateTask && (
         <Task
           id="adhoc_task_modal"
           isModalOpen
           flowInstanceId={instanceId}
           flowName={translation_data?.[pref_locale]?.flow_name || flow_name}
           flowUuid={flowUuid}
           flowId={jsUtility.get(flowData, ['flow_id'], null)}
           onAddTaskClosed={() => setShowCreateTask(false)}
           onCloseIconClick={() => setShowCreateTask(false)}
           instanceId={instanceId}
         />
       )}
       {!showCreateTask && (
         <IndividualEntryModel
           mode={INDIVIDUAL_ENTRY_MODE.INSTANCE_MODE}
           type={INDIVIDUAL_ENTRY_TYPE.FLOW}
           metaData={{
             moduleId: jsUtility.get(flowData, ['flow_id'], null),
             moduleUuid: flowUuid,
             instanceId: instanceId,
             dashboardId: flowData?.dashboardId,
           }}
           refreshOnDelete={refreshOnDelete}
           onCloseModel={onClose}
           otherDetails={{
             onCreateTask: onAddTask,
             canReassign: flowData?.canReassign,
             isAdminViewerNormalMode: jsUtility.get(
                   flowData,
                   ['isAdminOwnerViewer'],
                   null,
                 ),
           }}
         />
       )}
     </div>
   );
}

export default FlowInstance;
