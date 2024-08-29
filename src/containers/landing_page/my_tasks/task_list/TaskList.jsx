import React, { lazy } from 'react';
import PropTypes from 'prop-types';

// lazy imports
const TaskCard = lazy(() => import('../task_card/TaskCard'));

function TaskList(props) {
  const { list, onClick, isLoading, tabIndex, dataCountPerCall } = props;
  let taskList = null;
  if (isLoading) {
    taskList = Array(dataCountPerCall)
      .fill()
      .map(() => <TaskCard isDataLoading tabIndex={tabIndex} />);
  } else {
    taskList = list.map((task) => <TaskCard data={task} key={task._id} onClick={onClick} tabIndex={tabIndex} />);
  }
  return taskList;
}

export default TaskList;

TaskList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object),
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  tab_index: PropTypes.number,
};
TaskList.defaultProps = {
  list: [],
  onClick: null,
  isLoading: false,
  tab_index: 1,
};
