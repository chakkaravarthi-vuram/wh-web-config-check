import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function TaskMetricsIcon(props) {
  const {
    className, onClick,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick || null}
    >
      <path
        fill="#FFF"
        fillRule="nonzero"
        d="M13.634 0A2.366 2.366 0 0 1 16 2.361a2.366 2.366 0 0 1-2.367 2.362c-.045 0-.084-.002-.13-.007l-1.524 3.66a2.34 2.34 0 0 1 .788 1.747 2.366 2.366 0 0 1-4.733 0c0-.138.015-.275.044-.419l-1.77-1.007a2.36 2.36 0 0 1-1.556.578l-.9 2.528c.55.443.881 1.112.881 1.835a2.367 2.367 0 0 1-4.733 0 2.368 2.368 0 0 1 2.375-2.36l.9-2.528a2.354 2.354 0 0 1-.882-1.836 2.366 2.366 0 0 1 4.733 0c0 .138-.015.275-.043.419l1.77 1.007c.426-.37.971-.578 1.549-.578.044 0 .084.002.13.006l1.524-3.659-.13-.125a2.334 2.334 0 0 1-.659-1.623A2.366 2.366 0 0 1 13.634 0zM2.367 12.847c-.441 0-.8.356-.8.79 0 .437.359.793.8.793a.796.796 0 0 0 .799-.792.796.796 0 0 0-.799-.791zm8.035-3.516c-.442 0-.8.356-.8.792 0 .435.358.791.8.791.44 0 .798-.356.798-.791a.796.796 0 0 0-.798-.792zM4.76 6.121a.797.797 0 0 0-.798.793c0 .435.358.791.798.791.441 0 .799-.356.799-.791a.796.796 0 0 0-.799-.792zm8.874-4.552a.797.797 0 0 0-.8.792c0 .435.359.792.8.792a.796.796 0 0 0 .798-.792.796.796 0 0 0-.798-.792z"
      />
    </svg>
  );
}
export default TaskMetricsIcon;

TaskMetricsIcon.defaultProps = {
  className: EMPTY_STRING,
  onClick: null,
};

TaskMetricsIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};
