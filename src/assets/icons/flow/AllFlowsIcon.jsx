import React from 'react';
import PropTypes from 'prop-types';

function AllFlowsIcon(props) {
  const { className, onClick, style, title, id, isSelected } =
    props;
  const iconFill = isSelected ? '#217CF5' : '#959BA3';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      className={className}
      onClick={onClick}
      style={{ ...style }}
      id={id}
    >
      <title>{title}</title>
      <g id="allFlowsIcon" fill="none" fillRule="evenodd" stroke={iconFill} strokeWidth="2">
        <rect width="12" height="4" x="1" y="1" rx="2" />
        <rect width="12" height="4" x="1" y="9" rx="2" />
      </g>
    </svg>
  );
}

export default AllFlowsIcon;

AllFlowsIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

AllFlowsIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
