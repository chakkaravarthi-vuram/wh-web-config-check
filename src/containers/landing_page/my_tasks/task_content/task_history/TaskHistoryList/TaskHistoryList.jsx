import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getServerErrorMessageObject } from '../../../../../../utils/UtilityFunctions';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import TaskHistoryCard from '../TaskHistoryCard/TaskHistoryCard';

const mapStateToProps = (state) => {
  return {
    isLoading: state.TaskActionHistoryReducer.isLoading,
  };
};

function TaskHistoryList(props) {
  const { t } = useTranslation();
  const {
    isLoading,
    active_task_details,
    localStateData,
    localStateData: { document_url_details },
  } = props;

  const messageObject = getServerErrorMessageObject(null, [], null, t);

  const lstActionHistoryElement = (lstData) => {
    const emptyActionHistoryData = {
      action_taken: EMPTY_STRING,
      performed_by: { first_name: EMPTY_STRING, last_name: EMPTY_STRING },
      performed_on: { duration_display: EMPTY_STRING },
      profile_pic: EMPTY_STRING,
      description: EMPTY_STRING,
      document_details: EMPTY_STRING,
    };
    const historyElements = [];
    if (lstData && lstData.length > 0) {
        lstData?.forEach((actionHistoryData, idk) => {
          // if (actionHistoryData.action_history_type !== USER_ACTIONS.INTEGRATION) {
            historyElements.push(
              <div key={actionHistoryData?.action}>
                <TaskHistoryCard
                  active_task_details={active_task_details}
                  isLoading={isLoading}
                  actionHistoryData={
                    !isLoading ? actionHistoryData : emptyActionHistoryData
                  }
                  document_details={document_url_details}
                  lastEntry={idk === (lstData.length - 1)}
                  firstEntry={idk === 0}
                />
              </div>,
            );
          // }
        });
        return historyElements;
    } else if (!isLoading) return <div>{messageObject}</div>;
    else return null;
  };
  return !isLoading ? lstActionHistoryElement(localStateData?.pagination_data) : lstActionHistoryElement([1, 2, 3]);
}

export default connect(mapStateToProps, null)(TaskHistoryList);
