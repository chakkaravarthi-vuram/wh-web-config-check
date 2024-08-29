import React from 'react';
import PropTypes from 'prop-types';

function AssignedTaskIcon(props) {
  const { className, onClick, style, title, buttonColor, id, isSelected } = props;
  const iconFill = isSelected ? '#1a9cd1' : '#B8BFC7';
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
        // fill="#1A9CD1"
        fill={iconFill}
        d="M10.5.7H9.1a.7.7 0 00-.7-.7H2.8a.7.7 0 00-.7.7H.7a.7.7 0 00-.7.7v11.9a.7.7 0 00.7.7h9.8a.7.7 0 00.7-.7V1.4a.7.7 0 00-.7-.7zm-.7 11.9H1.4V2.1h.7a.7.7 0 00.7.7h5.6a.7.7 0 00.7-.7h.7v10.5zM3.5 4.2h4.2a.7.7 0 010 1.4H3.5a.7.7 0 010-1.4zm0 2.8h4.2a.7.7 0 010 1.4H3.5a.7.7 0 010-1.4zm0 2.8h4.2a.7.7 0 010 1.4H3.5a.7.7 0 010-1.4z"
      />
    </svg>
  );
}

export default AssignedTaskIcon;

AssignedTaskIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

AssignedTaskIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
