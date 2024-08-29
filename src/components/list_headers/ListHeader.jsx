import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

import { useTranslation } from 'react-i18next';
import { BS } from '../../utils/UIConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import gClasses from '../../scss/Typography.module.scss';
import styles from './ListHeader.module.scss';
import { getTaskHeader, getFlowHeader, getDataListHeader } from './ListHeader.utils';
import { DATA_LIST_DROPDOWN } from '../../containers/data_list/listDataList/listDataList.strings';

export const LIST_TYPE = {
    FLOW: 'Flow',
    DATA_LIST: 'Datalist',
    TASK: 'Task',
};
function ListHeader(props) {
  const { listType, tabIndex, className, extraPadding, flowSubTabIndex, isCompletedTask, isAssignedToOtherTask } = props;
  let header = null;
  const { t } = useTranslation();
  switch (listType) {
      case LIST_TYPE.TASK: {
       const [taskTitle, taskDescription, createdBy, createdOn, dueDate, completedOn, assignedOn] = getTaskHeader(t, tabIndex);
         header = (!taskTitle && !taskDescription && !createdBy && !createdOn && !dueDate) ? null : (
             <div className={cx(
                   styles.TaskCardContainer,
                   BS.D_FLEX,
                   BS.ALIGN_ITEM_CENTER,
                   gClasses.FTwo13,
                   gClasses.FontWeight500,
                   extraPadding && styles.scrollPadding,
                   )}
             >
                 <div className={styles.TaskStart}>
                    <span className={gClasses.LabelStyle}>{taskTitle}</span>
                    {/* <span className={styles.Symbol}>{' & '}</span>
                    <span className={styles.Description}>{taskDescription}</span> */}
                 </div>
                 <div className={styles.TaskEnd}>
                   { createdBy && <div className={cx(styles.CreatedBy, gClasses.LabelStyle)}>{createdBy}</div> }
                   { createdOn && !isAssignedToOtherTask && <div className={cx(styles.CreatedOn, gClasses.LabelStyle)}>{createdOn}</div> }
                   { assignedOn && isAssignedToOtherTask && <div className={cx(styles.CreatedOn, gClasses.LabelStyle)}>{assignedOn}</div> }
                   { dueDate && !isCompletedTask && <div className={cx(styles.DueDate, gClasses.LabelStyle)}>{dueDate}</div> }
                   {isCompletedTask && <div className={cx(styles.DueDate, gClasses.LabelStyle)}>{completedOn}</div>}
                 </div>
             </div>
         );
         break;
      }
      case LIST_TYPE.FLOW: {
         const [title, createdBy, createdOn, action] = getFlowHeader(t, tabIndex, flowSubTabIndex);
         header = (!title && !createdBy && !createdOn && !action) ? null : (
            <div className={cx(
              styles.FlowContainer,
              BS.D_FLEX,
              BS.ALIGN_ITEM_CENTER,
              BS.JC_BETWEEN,
              gClasses.FTwo13,
              gClasses.FontWeight500,
              extraPadding && styles.scrollPadding,
              )}
            >
              <div className={cx(styles.title, gClasses.LabelStyle)}>{title}</div>
              <div className={cx(
                styles.FlowStatus,
                BS.D_FLEX,
                BS.ALIGN_ITEM_CENTER,
              )}
              >
                {createdBy && (
                <div className={cx(
                  styles.CreatedBy,
                  gClasses.W125,
                  gClasses.LabelStyle,
                  )}
                >
                                {createdBy}
                </div>
               )}
                {createdOn && (
                         <div className={cx(
                          styles.CreatedOn,
                          gClasses.W150,
                          gClasses.LabelStyle,
                          )}
                         >
                                {createdOn}
                         </div>
                        )}
                {/* <div className={cx(
                  styles.Action,
                  (tabIndex === FLOW_DROPDOWN.DRAFT_FLOW || tabIndex === FLOW_DROPDOWN.UNDER_TESTING) ?
                  cx(BS.PADDING_0, gClasses.W64) :
                  gClasses.W148,
                  )}
                >
                {action}
                </div> */}
              </div>
            </div>
         );
          break;
      }
      case LIST_TYPE.DATA_LIST: {
         const [title, createdBy, createdOn, action] = getDataListHeader(t, tabIndex);
         header = (!title && !createdBy && !createdOn && !action) ? null : (
            <div className={cx(
              styles.DataListContainer,
              BS.D_FLEX,
              BS.ALIGN_ITEM_CENTER,
              BS.JC_BETWEEN,
              gClasses.FTwo13,
              gClasses.FontWeight500,
              extraPadding && styles.scrollPadding,
              )}
            >
              <div className={cx(styles.title, gClasses.LabelStyle)}>{title}</div>
              <div className={cx(
                styles.DataListStatus,
                BS.D_FLEX,
                BS.ALIGN_ITEM_CENTER,
                )}
              >
                {createdBy && (
                <div className={cx(
                  styles.CreatedBy,
                  (tabIndex === DATA_LIST_DROPDOWN.DRAFT_DATA_LIST) ?
                  gClasses.W125 :
                  gClasses.W110,
                  gClasses.LabelStyle,
                  )}
                >
                                {createdBy}
                </div>
               )}
                {createdOn && (
                         <div className={cx(
                          styles.CreatedOn,
                          (tabIndex === DATA_LIST_DROPDOWN.DRAFT_DATA_LIST) ?
                          gClasses.W125 :
                          gClasses.minWidth125,
                          gClasses.LabelStyle,
                          )}
                         >
                                {createdOn}
                         </div>
                        )}
                <div className={cx(
                  styles.Action,
                  gClasses.LabelStyle,
                  (tabIndex === DATA_LIST_DROPDOWN.DRAFT_DATA_LIST) ?
                  cx(BS.PADDING_0, gClasses.W64) :
                  gClasses.W148,
                  )}
                >
                {action}
                </div>
              </div>
            </div>
         );
          break;
      }
      default:
         break;
  }
  return <div className={className}>{header}</div>;
}

export default ListHeader;

ListHeader.defaultProps = {
    tabIndex: null,
    listType: null,
    className: EMPTY_STRING,
    extraPadding: false,
    isCompletedTask: false,
};

ListHeader.propTypes = {
    tabIndex: PropTypes.number,
    listType: PropTypes.oneOf([LIST_TYPE.DATA_LIST, LIST_TYPE.FLOW, LIST_TYPE.TASK]),
    className: PropTypes.string,
    extraPadding: PropTypes.bool,
    isCompletedTask: PropTypes.bool,
};
