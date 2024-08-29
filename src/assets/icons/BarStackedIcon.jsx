import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function BarStackedIcon(props) {
  const {
    className,
    onClick,
    style,
    title,
    isButtonColor,
    stackedBGColor1,
    stackedBGColor2,
    role,
    ariaLabel,
  } = props;
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
                <path fill={stackedBGColor1} d="M0 0h7.059v24H0z" />
                <path fill={stackedBGColor2} d="M0 18h7.059v6H0z" />
                <path fill={stackedBGColor1} d="M8.469 5.647h7.059V24H8.469z" />
                <path fill={stackedBGColor2} d="M8.469 15h7.059v9H8.469z" />
                <path
                  fill={stackedBGColor1}
                  d="M16.938 12.706h7.059V24h-7.059z"
                />
                <path fill={stackedBGColor2} d="M16.938 21h7.059v3h-7.059z" />
              </g>
            </g>
          </g>
          {/* </g> */}
        </g>
      </g>
    </svg>
  );
}

export default BarStackedIcon;

BarStackedIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  stackedBGColor1: null,
  stackedBGColor2: null,
};
BarStackedIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  stackedBGColor1: PropTypes.string,
  stackedBGColor2: PropTypes.string,
};
