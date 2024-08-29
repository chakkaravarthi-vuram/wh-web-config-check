import React from 'react';
import PropTypes from 'prop-types';

function DeactiveTeamIcon(props) {
  const {
    className, onClick, style, role, title, buttonColor,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="20"
      viewBox="0 0 18 20"
      className={className}
      onClick={onClick}
      role={role}
      style={({ ...style }, { fill: buttonColor })}
    >
      <title>{title}</title>
      <path fillRule="evenodd" d="M23.999 26c.86.69 1.86 1.201 2.943 1.49-.486.838-.804 1.787-.906 2.8-.301-.184-.656-.29-1.036-.29-1.105 0-2 .895-2 2s.895 2 2 2c.558 0 1.062-.228 1.425-.596.36.99.94 1.875 1.678 2.598L21.36 36c-.85 0-1.476-.787-1.342-1.62l.447-3.241C20.734 28.87 22.12 26.972 24 26zM33 26c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5zm3 4h-6v1.5h6V30zm-7-14c2.773 0 5 2.227 5 5 0 1.129-.369 2.167-.993 3.001L33 24c-1.872 0-3.572.735-4.828 1.932C25.797 25.542 24 23.49 24 21c0-2.773 2.227-5 5-5z" transform="translate(-315 -180) translate(295 164)" />
    </svg>
  );
}

export default DeactiveTeamIcon;

DeactiveTeamIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

DeactiveTeamIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
