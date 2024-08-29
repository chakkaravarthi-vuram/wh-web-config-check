import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function CheckListIcon(props) {
  const { className, style, title, onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={className}
      onClick={onClick || null}
      style={style}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <rect
          width="16.5"
          height="16.5"
          x=".75"
          y=".75"
          stroke="#5B6375"
          strokeWidth="1.5"
          rx="2"
        />
        <path
          fill="#5B6375"
          fillRule="nonzero"
          d="M14 6.38L12.637 5l-5.18 5.241-2.094-2.118L4 9.502 7.457 13z"
        />
      </g>
    </svg>
  );
}
export default CheckListIcon;
CheckListIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};
CheckListIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
