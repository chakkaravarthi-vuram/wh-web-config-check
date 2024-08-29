import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function StatIcon(props) {
  const {
    className,
    onClick,
    style,
    title,
    isButtonColor,
    statBGColor1,
    statBGColor2,
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
      <g fillRule="nonzero" fill="none">
        <path
          d="M6.395 13V.4H.959v2.34h2.52V13h2.916zm11.682 0v-2.646h2.052V7.978h-2.052V5.62h-2.754v2.358h-3.384L17.447.4h-3.06l-5.94 7.992v1.962h6.786V13h2.844zm4.572.144c.492 0 .906-.168 1.242-.504.336-.336.504-.756.504-1.26 0-.516-.168-.933-.504-1.251-.336-.318-.75-.477-1.242-.477s-.906.159-1.242.477c-.336.318-.504.735-.504 1.251 0 .504.168.924.504 1.26.336.336.75.504 1.242.504zM30.893 13l4.68-10.71V.4H25.475v4.428h2.592V2.776h4.176L27.725 13h3.168z"
          fill={statBGColor1}
        />
        <path
          fill={statBGColor2}
          d="m34.638 15.136 1.008 1.728-12.38 7.222-11.376-3.533-9.556 3.39-.668-1.886 10.184-3.61 11.169 3.467z"
        />
      </g>
    </svg>
  );
}

export default StatIcon;

StatIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  statBGColor1: null,
  statBGColor2: null,
};
StatIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  statBGColor1: PropTypes.string,
  statBGColor2: PropTypes.string,
};
