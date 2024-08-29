import React from 'react';
import PropTypes from 'prop-types';

function DraftFlow(props) {
  const { className, onClick, style, title, buttonColor, id, isSelected } =
    props;
  const iconFill = isSelected ? '#217CF5' : '#959BA3';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="14"
      viewBox="0 0 12 14"
      className={className}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
      id={id}
    >
      <title>{title}</title>
      <path
        // fill="#AAAFBA"
        fill={iconFill}
        d="M10.5.7H9.1a.7.7 0 00-.7-.7H2.8a.7.7 0 00-.7.7H.7a.7.7 0 00-.7.7v11.9a.7.7 0 00.7.7h9.8a.7.7 0 00.7-.7V1.4a.7.7 0 00-.7-.7zm-.7 11.9H1.4V2.1h.7a.7.7 0 00.7.7h5.6a.7.7 0 00.7-.7h.7v10.5zM4.8 4h1.5v4.5H4.8V4zm0 5.5h1.5V11H4.8V9.5z"
      />
    </svg>
  );
}

export default DraftFlow;

DraftFlow.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};
DraftFlow.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
