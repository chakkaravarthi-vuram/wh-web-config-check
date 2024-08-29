import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import ResponseHandler from 'components/response_handlers/ResponseHandler';
import { RESPONSE_TYPE } from 'utils/Constants';
import IntegrationIcon from 'assets/icons/parallel_flow/flow_dropdown/IntegrationIcon';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from './Summary.module.scss';
import {
  getInstanceSummaryByID,
  flowDashboardSetInstanceSummaryAction,
  getInstanceTaskDetailsById,
  flowDashboardClearInstanceSummaryAction,
} from '../../../../redux/actions/IndividualEntry.Action';
import Created from './created/Created';
import SendBack from './send_back/SendBack';
import Open from './open/Open';
import NotStarted from './not_started/NotStarted';
import Rejected from './rejected/Rejected';
import { cloneDeep, get, isEmpty } from '../../../../utils/jsUtility';
import Trigger from './trigger/Trigger';
import Reassigned from './reassigned/Reassigned';
import SingleStatusCard from './single_status_card/SingleStatusCard';
import { INDIVIDUAL_ENTRY_MODE } from '../IndividualEntry.strings';
import { TASK_TYPE } from './Summary.utils';

const mapDispatchToProps = (dispatch) => {
  return {
    onFlowDashboardSetInstanceSummary: (instanceSummary) => {
      dispatch(flowDashboardSetInstanceSummaryAction(instanceSummary));
    },
    onFlowDashboardClearInstanceSummary: () => {
      dispatch(flowDashboardClearInstanceSummaryAction());
    },
    onGetInstanceSummaryByID: (_id) => {
      dispatch(getInstanceSummaryByID(_id));
    },
    onGetInstanceTaskDetailsById: (params, instanceSummary, index) => {
      dispatch(getInstanceTaskDetailsById(params, instanceSummary, index));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    instanceDetails: state.IndividualEntryReducer.flow_summary.instanceDetails,
    instanceSummary: state.IndividualEntryReducer.flow_summary.instanceSummary,
    instanceSummaryError: state.IndividualEntryReducer.flow_summary.instanceSummaryError,
    isInstanceSummaryLoading: state.IndividualEntryReducer.flow_summary.isInstanceSummaryLoading,
    isInstanceBodyDataLoading: state.IndividualEntryReducer.flow_summary.isInstanceBodyDataLoading,
  };
};

function Summary(props) {
  const {
    instanceId,
    instanceSummary,
    onGetInstanceSummaryByID,
    isInstanceSummaryLoading,
    onFlowDashboardSetInstanceSummary,
    isInstanceBodyDataLoading,
    onGetInstanceTaskDetailsById,
    onFlowDashboardClearInstanceSummary,
    instanceSummaryError,
    isAdminOwnerViewer,
    is_owner_user,
    flowUuid,
    instanceDetails,
    mode,
  } = props;

  const { instance_summary, parent_flow_metadata = [] } = instanceSummary && instanceSummary;
  const currentLoadingCard = useRef();

  useEffect(() => {
    if (
      [
        INDIVIDUAL_ENTRY_MODE.INSTANCE_MODE,
        INDIVIDUAL_ENTRY_MODE.REPORT_INSTANCE_MODE,
      ].includes(mode)
    ) {
    onGetInstanceSummaryByID(instanceId);
    }
    return () => {
      onFlowDashboardClearInstanceSummary();
    };
  }, []);

  const onHeaderClick = (isShow, index) => {
    const isTaskAccessible = get(instance_summary, [index, 'is_task_accessible'], false);
    const isPolicyViewer = get(instanceDetails, ['is_policy_viewer'], false);

    if (!isAdminOwnerViewer && !isTaskAccessible && !isPolicyViewer) return; // tight security changes if user is neither (admin || ownner || viewer || is_task_accessable || is_policy_viewer) will not show body
    const updatedSummary = cloneDeep(instanceSummary);

    if (!isShow) {
      updatedSummary.instance_summary[index].isShow = true;
      currentLoadingCard.current = index;
      onFlowDashboardSetInstanceSummary(updatedSummary);
      const taskLogId = updatedSummary.instance_summary[index]._id;
      if (taskLogId) {
        const params = {
          task_log_id: taskLogId, is_open_task: 0,
        };
        onGetInstanceTaskDetailsById(params, updatedSummary, index);
      }
    } else {
      updatedSummary.instance_summary[index].isShow = false;
      currentLoadingCard.current = null;
      onFlowDashboardSetInstanceSummary(updatedSummary);
    }
  };

  const lstInstanceSummary = () => {
    let instanceSummary;
    if (instanceSummaryError) {
      instanceSummary = (
        <ResponseHandler
          className={gClasses.MT90}
          messageObject={{
            type: RESPONSE_TYPE.SERVER_ERROR,
            title: 'Access Denied',
            subTitle: 'You don\'t have access to this instance',
          }}
        />
      );
    } else if (!instance_summary) {
      instanceSummary = <Skeleton count={5} />;
    } else {
      if (instance_summary) {
      instanceSummary =
      instance_summary &&
      instance_summary.length > 0 &&
      instance_summary?.map((instanceSummary, index) => {
        const { is_policy_viewer } = instanceDetails;
        const { task_status, task_type, is_task_accessible } = instanceSummary;
        const isShowTaskDetails = is_task_accessible || isAdminOwnerViewer || is_policy_viewer;
        const isCardLoading = isInstanceBodyDataLoading && currentLoadingCard.current === index;
        if (task_status === 'cancelled') {
          return (
            <Rejected key={instanceSummary._id} isShowTaskDetails={isShowTaskDetails} isLoading={isCardLoading} instanceSummary={instanceSummary} index={index} instanceId={instanceId} taskLogId={instanceSummary._id} onHeaderClick={onHeaderClick} />
          );
        } else if
        (instanceSummary.action_history &&
         instanceSummary.action_history.action_type === 'send_back') {
          return (
            <SendBack key={instanceSummary._id} isShowTaskDetails={isShowTaskDetails} isFirstStep={index === 0} isLoading={isCardLoading} instanceSummary={instanceSummary} onHeaderClick={onHeaderClick} index={index} instanceId={instanceId} taskLogId={instanceSummary._id} />
          );
        } else if (task_type === TASK_TYPE.INTEGRATION || task_type === TASK_TYPE.ML_INTEGRATION || task_type === TASK_TYPE.DOCUMENT_GENERATION || task_type === TASK_TYPE.WAIT_NODE || task_type === TASK_TYPE.SYSTEM_STEP_DOCUMENT || task_type === TASK_TYPE.SEND_DATA_TO_DATALIST || task_type === TASK_TYPE.DATA_MANIPULATOR || task_type === TASK_TYPE.JOIN_STEP || task_type === TASK_TYPE.SPLIT_PARALLEL_STEP || task_type === TASK_TYPE.CONDITIONAL_ROUTE_STEP) {
          return (
            <SingleStatusCard key={instanceSummary._id} icon={<IntegrationIcon className={styles.IntegrationIcon} />} isLoading={isCardLoading} instanceSummary={instanceSummary} index={index} instanceId={instanceId} />
          );
        } else if (task_type === TASK_TYPE.TRIGGER && !isEmpty(get(instanceSummary, ['action_history', 'child_instance'], ''))) {
          return (
            <Trigger key={instanceSummary._id} isLoading={isCardLoading} instanceSummary={instanceSummary} index={index} instanceId={instanceId} taskLogId={instanceSummary._id} parentFlowMetadata={parent_flow_metadata} />
          );
        } else if (instanceSummary?.is_reassigned && task_status !== 'completed') {
          return (
            <Reassigned key={instanceSummary._id} is_owner_user={is_owner_user} flowUuid={flowUuid} isShowTaskDetails={isShowTaskDetails} instanceSummary={instanceSummary} index={index} onHeaderClick={onHeaderClick} instanceId={instanceId} taskLogId={instanceSummary._id} />
          );
        } else if (task_status === 'completed' && get(instanceSummary, ['action_history', 'action_type'], '') === 'cancel') {
          return (<Rejected key={instanceSummary._id} isShowTaskDetails={isShowTaskDetails} instanceSummary={instanceSummary} index={index} taskLogId={instanceSummary._id} onHeaderClick={onHeaderClick} instanceId={instanceId} isLoading={isCardLoading} />);
        } else if (task_status === 'completed') {
          return (
            <Created key={instanceSummary._id} isShowTaskDetails={isShowTaskDetails} isFirstStep={index === 0} isLoading={isCardLoading} instanceSummary={instanceSummary} onHeaderClick={onHeaderClick} index={index} instanceId={instanceId} taskLogId={instanceSummary._id} />
          );
        } else if ((task_status === 'assigned' && instanceSummary?.action_history?.action !== 'reassign') || task_status === 'accepted') {
          return (
            <Open key={instanceSummary._id} isShowTaskDetails={isShowTaskDetails} instanceSummary={instanceSummary} index={index} onHeaderClick={onHeaderClick} instanceId={instanceId} taskLogId={instanceSummary._id} is_owner_user={is_owner_user} flowUuid={flowUuid} />
          );
        } else {
          return (
            <NotStarted key={instanceSummary._id} instanceSummary={instanceSummary} index={index} />
          );
        }
      });
    }
  }
    return instanceSummary;
  };

  return (
    <div className="col-12">
        <div className="row">
          <div className="w-100">
            {/* {instance_summary && ( */}
              <div>
                {isInstanceSummaryLoading ? <Skeleton count={5} /> : lstInstanceSummary()}
              </div>
            {/* )} */}

            {/*
            <SendBack />
            <ReSend />  */}
          </div>
        </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
