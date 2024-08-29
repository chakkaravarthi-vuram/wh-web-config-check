import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function BarVerticalIcon(props) {
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
      role={role}
      aria-label={ariaLabel}
      onClick={onClick}
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
                  d="M0 0h7.059v24H0zM8.471 5.647h7.059V24H8.471zM16.941 12.706H24V24h-7.059z"
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

export default BarVerticalIcon;

BarVerticalIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
BarVerticalIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
