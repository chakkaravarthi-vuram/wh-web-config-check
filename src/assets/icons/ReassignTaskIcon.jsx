import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function ReassignTaskIcon(props) {
  const { className, onClick, style, isButtonColor, role, ariaLabel, fillColor } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  const iconFill = fillColor || '#959BA3';
  return (
     <svg
      width="24"
      height="21"
      viewBox="0 0 24 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      style={{ ...style, fill: buttonColor }}
     >
      <g clip-path="url(#ffexq36gja)">
          <g clip-path="url(#hum0czv8db)" fill={iconFill}>
              <path d="M13.652 20.08c2.792 0 5.163-.975 7.114-2.926 1.95-1.95 2.925-4.322 2.925-7.114 0-1.394-.264-2.7-.793-3.917a10.2 10.2 0 0 0-2.15-3.18 10.2 10.2 0 0 0-3.18-2.15A9.717 9.717 0 0 0 13.651 0a9.756 9.756 0 0 0-3.926.794c-1.22.529-2.28 1.245-3.18 2.149A10.193 10.193 0 0 0 4.401 6.12a9.696 9.696 0 0 0-.79 3.9v.166L1.62 8.168 0 9.768l4.851 4.85 4.852-4.85-1.62-1.6-1.99 1.991v-.145c-.005-2.088.734-3.865 2.216-5.332 1.482-1.467 3.263-2.2 5.341-2.2 2.092 0 3.875.737 5.348 2.21 1.474 1.474 2.21 3.256 2.21 5.348-.013 2.092-.753 3.874-2.22 5.348-1.467 1.473-3.246 2.21-5.338 2.21a7.281 7.281 0 0 1-2.924-.596 7.71 7.71 0 0 1-2.44-1.67l-1.763 1.77a10.128 10.128 0 0 0 3.194 2.182c1.216.53 2.527.796 3.934.796z" />
              <path d="M13.5 9.5a2.25 2.25 0 1 1-.001-4.499A2.25 2.25 0 0 1 13.5 9.5zm0 1.125c1.502 0 4.5.754 4.5 2.25V14H9v-1.125c0-1.496 2.998-2.25 4.5-2.25z" />
          </g>
      </g>
      <defs>
          <clipPath id="ffexq36gja">
              <path fill="#fff" d="M0 0h24v20.727H0z" />
          </clipPath>
          <clipPath id="hum0czv8db">
              <path fill="#fff" d="M0 0h24v20.727H0z" />
          </clipPath>
      </defs>
     </svg>
  );
}
export default ReassignTaskIcon;
ReassignTaskIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
ReassignTaskIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
