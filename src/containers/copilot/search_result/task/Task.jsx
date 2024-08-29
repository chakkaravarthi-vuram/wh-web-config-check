import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import {
  ETitleHeadingLevel,
  Title,
  Skeleton,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { clearCopilotTask } from '../../../../redux/reducer/CopilotReducer';
import { getActiveTaskListActionThunk } from '../../../../redux/actions/Copilot.Action';
import { CancelToken, routeNavigate } from '../../../../utils/UtilityFunctions';
import ResultCard from '../result_card/ResultCard';
import { DEFAULT_APP_ROUTE, OPEN_TASKS, TASKS } from '../../../../urls/RouteConstants';
import { ROUTE_METHOD } from '../../../../utils/Constants';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import jsUtility from '../../../../utils/jsUtility';
import { COPILOT_STRINGS } from '../../Copilot.strings';

let cancelToken;

function Task(props) {
  const { t } = useTranslation();
  const { RESULTS } = COPILOT_STRINGS(t);
  const dispatch = useDispatch();
  const history = useHistory();
  const copilotTaskData = useSelector((store) => store.CopilotReducer.task);

  const { search, closeSearch } = props;

  useEffect(() => {
    const params = {
      search,
      is_snoozed: 0,
    };
    if (!cancelToken) {
      cancelToken = new CancelToken();
    }
    dispatch(getActiveTaskListActionThunk(params, cancelToken));
  }, [search]);

  useEffect(() => {
    // Don't remove the console this is for DidMount Clear.
    console.log();
    return () => dispatch(clearCopilotTask());
  }, []);

  const {
    isLoading,
    data: { list },
  } = copilotTaskData;

  const elementLoadingList = () =>
    Array(3)
      .fill(1)
      .map((data, index) => (
        <div key={index} className={gClasses.DisplayFlex}>
          <Skeleton width={20} />
          <Skeleton className={gClasses.ML15} width={150} />
        </div>
      ));

  const elementTaskList = () => {
    if (isLoading) {
      return elementLoadingList();
    }

    if (jsUtility.isEmpty(list)) {
      return (
        <Title
          content={RESULTS.OPEN_TASKS_NO_DATA_FOUND}
          headingLevel={ETitleHeadingLevel.h6}
          className={gClasses.FTwo12GrayV86}
        />
      );
    }

    const onClickTask = (taskUuid) => {
      if (!jsUtility.isEmpty(taskUuid)) {
        closeSearch?.();
        const pathname = `${DEFAULT_APP_ROUTE}${TASKS}/${OPEN_TASKS}/${taskUuid}`;
        routeNavigate(history, ROUTE_METHOD.PUSH, pathname);
      }
    };

    return (
      list?.map((listData) => (
        <ResultCard
          isLoading={isLoading}
          key={listData.id}
          data={listData}
          isClickable
          onClick={onClickTask}
          textClassName={gClasses.Ellipsis}
        />
      ))
    );
  };

  return (
    <div>
      <Title
        content={RESULTS.OPEN_TASKS}
        headingLevel={ETitleHeadingLevel.h5}
        className={cx(gClasses.FTwo12GrayV86, gClasses.MB3)}
      />
      <div>{elementTaskList()}</div>
    </div>
  );
}

export default Task;

Task.defaultProps = { search: EMPTY_STRING };
Task.propTypes = {
  search: PropTypes.string,
};
