import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function LoaderIcon(props) {
  const { className, onClick, style, title, id, role, ariaLabel, ariaHidden } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width="64"
      height="64"
      color="#3f51b5"
      fill="none"
      className={className}
      onClick={onClick || null}
      style={({ ...style })}
      id={id}
      role={role}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      <title>{title}</title>
      <g>
        <defs>
          <linearGradient id="sGD" gradientUnits="userSpaceOnUse" x1="55" y1="46" x2="2" y2="46">
            <stop offset="0.1" stop-color="currentColor" stop-opacity="0" />
            <stop offset="1" stop-color="currentColor" stop-opacity="1" />
          </linearGradient>
        </defs>

        <g stroke-width="4" stroke-linecap="round" stroke="currentColor" fill="none">
          <path stroke="url(#sGD)" d="M4,32 c0,15,12,28,28,28c8,0,16-4,21-9" />
          <path d="M60,32 C60,16,47.464,4,32,4S4,16,4,32" />

          <animateTransform values="0,32,32;360,32,32" attributeName="transform" type="rotate" repeatCount="indefinite" dur="750ms" />
        </g>
      </g>
    </svg>
  );
}
export default LoaderIcon;

LoaderIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
  isButtonColor: false,
};
LoaderIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
