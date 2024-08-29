import React from 'react';
import PropTypes from 'prop-types';

function GreenTickRoundedIcon(props) {
  const { className, role, ariaHidden, fillColor } = props;
  const backgroundFill = !fillColor ? '#70BD47' : fillColor;
  return (
    <svg role={role} aria-hidden={ariaHidden} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className={className}>
      <title>Green Tick</title>
      <g fill="none" fillRule="evenodd">
        <rect fill={backgroundFill} width="20" height="20" rx="10" />
        <path fill="#FFF" fillRule="nonzero" d="M8.3 11.2 6.4 9.3 5 10.7l3.3 3.4L15 7.4 13.6 6z" />
      </g>
    </svg>
  );
}

export default GreenTickRoundedIcon;

GreenTickRoundedIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

GreenTickRoundedIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
