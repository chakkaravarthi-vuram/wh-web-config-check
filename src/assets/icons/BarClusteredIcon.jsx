import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function BarClusteredIcon(props) {
  const {
    className,
    onClick,
    style,
    title,
    isButtonColor,
    clusteredBGColor1,
    clusteredBGColor2,
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
                <path fill={clusteredBGColor1} d="M0 0h3v24H0z" />
                <path fill={clusteredBGColor2} d="M4 18h3v6H4z" />
                <path fill={clusteredBGColor1} d="M8.469 5.647h3V24h-3z" />
                <path fill={clusteredBGColor2} d="M12.469 15h3v9h-3z" />
                <path fill={clusteredBGColor1} d="M16.938 12.706h3V24h-3z" />
                <path fill={clusteredBGColor2} d="M20.938 21h3v3h-3z" />
              </g>
            </g>
          </g>
          {/* </g> */}
        </g>
      </g>
    </svg>
  );
}

export default BarClusteredIcon;

BarClusteredIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  stackedBGColor1: null,
  stackedBGColor2: null,
};
BarClusteredIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  stackedBGColor1: PropTypes.string,
  stackedBGColor2: PropTypes.string,
};
