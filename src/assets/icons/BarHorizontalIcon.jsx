import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function BarHorizontalIcon(props) {
  const { className, onClick, style, title, isButtonColor, role, ariaLabel } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      style={{ ...style, fill: buttonColor }}
    >
      <title>{title}</title>
      <defs>
        <path id="path_1" d="M0 0h32v32H0V0z" />
        <clipPath id="mask_1">
          <use xlinkHref="#path_1" />
        </clipPath>
      </defs>
      <g>
        <path fill="none" stroke="none" d="M0 0h32v32H0V0z" />
        <g clipPath="url(#mask_1)">
          {/* <g transform="translate(8 8)"> */}
          <g>
            <g>
              <g>
                <path
                  fillRule="evenodd"
                  stroke="none"
                  d="M24 0v7.059H0V0zM18.353 8.471v7.059H0V8.471zM11.294 16.941V24H0v-7.059z"
                />
              </g>
            </g>
          </g>
          {/* </g> */}
        </g>
      </g>
    </svg>
  );
}

export default BarHorizontalIcon;

BarHorizontalIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
BarHorizontalIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
