import React, { useEffect, useState, lazy } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import ResponseHandler from 'components/response_handlers/ResponseHandler';
import Skeleton from 'react-loading-skeleton';
import { LANDING_PAGE } from 'containers/landing_page/LandingPageTranslation.strings';
import { useTranslation } from 'react-i18next';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { TASK_CONTENT_STRINGS } from '../../../LandingPage.strings';
import gClasses from '../../../../../scss/Typography.module.scss';
import {
  GetActionHistoryByInstanceId,
  taskActionHistoryClear,
  taskActionHistoryCancel,
} from '../../../../../redux/actions/TaskActionHistory.Action';
import { isEmpty } from '../../../../../utils/jsUtility';
import {
  cancelGetActionHistoryByInstanceIdAndClearState,
} from '../../../../../axios/apiService/task.apiService';
import styles from './TaskHistory.module.scss';
import { replaceNullWithNA } from '../TaskContent.utils';
import EmptyTaskHistory from './EmptyTaskHistory';
// lazy imports
const TaskHistoryList = lazy(() => import('./TaskHistoryList/TaskHistoryList'));

const mapDispatchToProps = (dispatch) => {
  return {
    onGetActionHistoryByInstanceId: (params) => {
      dispatch(GetActionHistoryByInstanceId(params));
    },
    onTaskActionHistoryClear: () => {
      dispatch(taskActionHistoryClear());
    },
    dispatch,
  };
};
const mapStateToProps = (state) => {
  return {
    lstActionHistory: state.TaskActionHistoryReducer.lstActionHistory,
    totalCount: state.TaskActionHistoryReducer.totalCount,
    remaining_count: state.TaskActionHistoryReducer.remaining_count,
  };
};

function TaskHistory(props) {
  const {
    instanceId,
    hideHeader,
    onTaskActionHistoryClear,
    dispatch,
    active_task_details,
    isTaskDataLoading,
    showNavigationLink,
    referenceId,
    navigationLink,
    isCommentPosted,
    isCompletedTask,
    taskLogId,
    onGetActionHistoryByInstanceId,
    lstActionHistory,
    className,
  } = props;
  const [hasMore, setHasMore] = useState(true);
  const [instanceIdValue, setInstanceId] = useState(instanceId);
  const [page, setPage] = useState(TASK_CONTENT_STRINGS.HISTORY.DEFAULT_PAGE);
  const { t } = useTranslation();
  // Maintaining the localState from redux, for reuse the  component  at a same time.
  const [localState, setLocalState] = useState({
    isLoading: true,
    lstActionHistory: {
      pagination_data: [],
      pagination_details: [],
      document_url_details: [],
    },
    totalCount: 0,
    remaining_count: 0,
  });
  const {
    totalCount = 0,
    remaining_count = 0,
  } = localState;

  // This function will do api call and update localState
  const getActionHistoryCall = async (params, isLoadMoreCall = false) => {
    !isLoadMoreCall && setLocalState({ isLoading: true, ...localState });
    onGetActionHistoryByInstanceId(params);
  };

  const onLoadMoreHandler = (currentPage) => {
    if (remaining_count > 0) {
      setPage(page + 1);
      const params = {
        instance_id: instanceId,
        page: currentPage + 1,
        size: TASK_CONTENT_STRINGS.HISTORY.DEFAULT_SIZE,
      };
      if (taskLogId) {
        params.task_log_id = taskLogId;
      }
      getActionHistoryCall(params, true);
    } else setHasMore(false);
  };
  useEffect(() => {
    if (instanceId) {
      instanceId && setInstanceId(instanceId);
      const params = {
        page: TASK_CONTENT_STRINGS.HISTORY.DEFAULT_PAGE,
        size: TASK_CONTENT_STRINGS.HISTORY.DEFAULT_SIZE,
      };
      if (taskLogId) {
        params.task_log_id = taskLogId;
      }
      params.instance_id = instanceId;
      getActionHistoryCall(params);
    }
    return () => {
        dispatch(
          cancelGetActionHistoryByInstanceIdAndClearState(
            taskActionHistoryCancel,
          ),
        );
      onTaskActionHistoryClear();
    };
  }, [isCommentPosted]);

  useEffect(() => {
    if (instanceId && (instanceIdValue !== instanceId)) {
      setInstanceId(instanceId);
      const params = {
        page: page,
        size: TASK_CONTENT_STRINGS.HISTORY.DEFAULT_SIZE,
      };
      if (taskLogId) {
        params.task_log_id = taskLogId;
      }
      params.instance_id = instanceId;
      getActionHistoryCall(params);
    }
  }, [instanceId]);

  useEffect(() => {
    console.log('lstActionHistorylstActionHistory', lstActionHistory);
    const localStateData = {
      isLoading: false,
      lstActionHistory: {
        ...lstActionHistory,
        pagination_data: lstActionHistory?.pagination_data,
        document_url_details: lstActionHistory?.document_url_details || [],
      },
      totalCount: lstActionHistory?.pagination_details?.[0]?.total_count,
      remaining_count: (lstActionHistory?.pagination_details[0]?.total_count || 0) - lstActionHistory.pagination_data.length,
    };
     setLocalState(localStateData);
  }, [lstActionHistory]);

  const loaderComponent = (
    <div className={styles.LoaderClass}>
      <Skeleton count={5} />
    </div>
  );

  return (!isTaskDataLoading && !lstActionHistory?.isLoading) ? (
    !isEmpty(localState?.lstActionHistory?.pagination_data) ? (
    <div className={styles.TaskHistoryWrapperClass}>
    <div className={gClasses.MB20}>
      {!hideHeader ? (
        <div
          className={cx(
            gClasses.SectionSubTitle,
            styles.ActionHistory,
            gClasses.FlexGrow1,
            gClasses.MT20,
            gClasses.ML30,
          )}
        >
          {t(TASK_CONTENT_STRINGS.HISTORY.LABEL)}
        </div>
      ) : null}
      {showNavigationLink?.() && navigationLink &&
      (
        <div
        className={cx(
          gClasses.FTwo12GrayV53,
          gClasses.ML30,
          gClasses.Flex1,
          gClasses.WordWrap,
          gClasses.TextTransformCap,
          gClasses.MT5,
        )}
        >
        {t(LANDING_PAGE.VIEW_HISTORY)}
        <Link to={navigationLink} target="_blank" className={cx(gClasses.FTwo12BlueV39, styles.link)}>
          {replaceNullWithNA(referenceId)}
        </Link>
        </div>
      )}
    </div>
      {totalCount > 0 ? (
        <div
          className={cx(className, gClasses.DisplayFlex, gClasses.FlexDirectionColumn, styles.InfiniteScroll, isCompletedTask && styles.InfiniteScrollHeight, taskLogId && styles.InfiniteScrollFlow)}
          id="taskActionHistoryCard"
        >
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            scrollableTarget="taskActionHistoryCard"
            next={() => {
              if (localState?.remaining_count > 0) {
                onLoadMoreHandler(page);
              }
            }}
            hasMore={hasMore}
            dataLength={localState?.lstActionHistory?.pagination_data?.length}
            useWindow
            threshold={150}
            loader={lstActionHistory?.isInifiniteScrollLoading && loaderComponent}
          >
            <TaskHistoryList
              active_task_details={active_task_details}
              showNavigationLink={showNavigationLink}
              localStateData={localState.lstActionHistory}
            />
          </InfiniteScroll>
        </div>
      ) :
      ((!localState.isLoading && taskLogId) ?
      <ResponseHandler
        className={cx(gClasses.MT70, gClasses.MB20)}
        messageObject={TASK_CONTENT_STRINGS.ACTION_HISTORY_NO_RESPONSE(t)}
      /> :
      null)}
    </div>
    ) : (
        <EmptyTaskHistory />
    )
  ) : loaderComponent;
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskHistory);

TaskHistory.propTypes = {
  instanceId: PropTypes.string,
  hideHeader: PropTypes.bool,
};
TaskHistory.defaultProps = {
  instanceId: EMPTY_STRING,
  hideHeader: false,
};
