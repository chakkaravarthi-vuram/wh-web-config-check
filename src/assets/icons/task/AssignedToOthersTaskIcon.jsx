import React from 'react';
import PropTypes from 'prop-types';

function AssignedToOthersTaskIcon(props) {
  const { className, onClick, style, title, buttonColor, id } = props;
  const iconFill = '#959BA3';
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
        d="M10.5.7H9.1a.7.7 0 0 0-.7-.7H2.8a.7.7 0 0 0-.7.7H.7a.7.7 0 0 0-.7.7v11.9a.7.7 0 0 0 .7.7h9.8a.7.7 0 0 0 .7-.7V1.4a.7.7 0 0 0-.7-.7zm-.7 11.9H1.4V2.1h.7a.7.7 0 0 0 .7.7h5.6a.7.7 0 0 0 .7-.7h.7v10.5zM5.77 4.944l2.823 2.503a.659.659 0 0 1 .07.984l-2.96 2.604c-.322.298-.78.274-1.091.006l-.076-.075c-.257-.284-.261-.69.065-.977l1.807-1.59L3.1 8.4a.7.7 0 0 1 0-1.4h2.69L4.678 6.02c-.354-.31-.324-.764-.002-1.052a.828.828 0 0 1 1.095-.025z"
        fill={iconFill}
        fillRule="nonzero"
      />
    </svg>
  );
}

export default AssignedToOthersTaskIcon;

AssignedToOthersTaskIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};
AssignedToOthersTaskIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
