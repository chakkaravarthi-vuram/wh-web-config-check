import React from 'react';
import PropTypes from 'prop-types';

function FlowIOwnIcon(props) {
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
      specialIcon="true"
    >
      <title>{title}</title>
      <path
        fill="none"
        fillRule="evenodd"
        stroke={iconFill}
        strokeWidth="2"
        d="M7 1v10c0 .552-.224 1.052-.586 1.414A1.994 1.994 0 015 13H3a1.994 1.994 0 01-1.414-.586A1.994 1.994 0 011 11V3c0-.552.224-1.052.586-1.414A1.994 1.994 0 013 1h4zm4 0c.552 0 1.052.224 1.414.586.362.362.586.862.586 1.414v4c0 .552-.224 1.052-.586 1.414A1.994 1.994 0 0111 9H7V1z"
      />
    </svg>
  );
}

export default FlowIOwnIcon;

FlowIOwnIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

FlowIOwnIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
