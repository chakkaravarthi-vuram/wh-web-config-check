import React from 'react';
import cx from 'classnames/bind';
import { useHistory } from 'react-router-dom';
import { BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import { get, isEmpty } from 'utils/jsUtility';
import TriggerIcon from 'assets/icons/parallel_flow/flow_dropdown/TriggerIcon';
import NewTabIcon from 'assets/icons/NewTabIcon';
import { TRIGGER_SHORTCUT, STATUS_CONSTANTS } from 'containers/flow/flow_dashboard/FlowDashboard.string';
import TriggerFlowIcon from 'assets/icons/parallel_flow/flow_dropdown/TriggerFlowIcon';
import { useTranslation } from 'react-i18next';
import styles from './Trigger.module.scss';
import { getFlowInstanceLink } from '../../../../../utils/UtilityFunctions';

function Trigger(props) {
  const {
    instanceSummary,
    instanceSummary: { task_name },
    parentFlowMetadata,
  } = props;
  const { t } = useTranslation();
  const circleTextClass = cx(gClasses.CenterVH);
  const history = useHistory();
  const childInstance = get(
    instanceSummary,
    ['action_history', 'child_instance'],
    {},
  );
  const childInstanceCancelled = (childInstance?.status === 'cancelled');
  const parentFlowData =
    parentFlowMetadata &&
    parentFlowMetadata?.find(
      (flow) =>
        flow?.flow_uuid === childInstance?.flow_uuid,
    );

  const getParentFlowLink = () => getFlowInstanceLink(history, childInstance?.flow_uuid, childInstance?._id);

  return (
    <div className={`card ${childInstanceCancelled ? styles.redBorderCard : styles.greenborderCard}`}>
      <div
        className={cx(
          `card-header ${styles.cardheaderNobg}`,
          BS.D_FLEX,
          BS.JC_BETWEEN,
        )}
        id="headingFive"
      >
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
          <div className={cx(gClasses.CenterV)}>
            <div
              className={cx(
                styles.Circle1,
                childInstanceCancelled ? styles.CancelledTriggerBg : styles.TriggerIcon,
                circleTextClass,
                styles.AccsummaryCircle,
              )}
            >
              <TriggerIcon className={childInstanceCancelled ? styles.CancelledTriggerBg : styles.TriggerIcon} />
            </div>
          </div>
          <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, styles.TriggerName)}>
            <span className={styles.AccTitle} title={task_name}>
              {task_name}
            </span>
            {!isEmpty(parentFlowData?.flow_name) && (
              <span
                className={cx(
                  styles.FlowName,
                  BS.D_FLEX,
                  BS.ALIGN_ITEM_CENTER,
                )}
                title={task_name}
              >
                <TriggerFlowIcon />
                <span className={gClasses.ML4}>
                  {parentFlowData?.flow_name}
                </span>
              </span>
            )}
          </div>
        </div>
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
          {!isEmpty(parentFlowData?.flow_name) && (
            <a
              className={cx(styles.NewTabLink)}
              href={getParentFlowLink()}
              target="_blank"
              rel="noreferrer"
            >
              <NewTabIcon />
              <span className={cx(styles.NewTabText, gClasses.ML4)}>
                {TRIGGER_SHORTCUT(t).SEE_MORE}
              </span>
            </a>
          )}
          <div
            className={cx(
              gClasses.CenterV,
              BS.JC_END,
              childInstanceCancelled ? styles.ChildStepCancelled : styles.AccnotStartedtxt,
              gClasses.ML24,
            )}
          >
            {childInstance?.status === 'inprogress' && (TRIGGER_SHORTCUT(t).IN_PROGRESS)}
            {childInstance?.status === 'completed' && (TRIGGER_SHORTCUT(t).COMPLETED)}
            {childInstanceCancelled && (STATUS_CONSTANTS(t).CANCELLED.NAME)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trigger;
