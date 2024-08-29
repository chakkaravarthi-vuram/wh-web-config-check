import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function PieIcon(props) {
  const {
    className,
    onClick,
    style,
    title,
    isButtonColor,
    pieBGColor1,
    pieBGColor2,
    pieBGColor3,
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
        <circle id="osw83golia" cx="12" cy="12.043" r="12" />
      </defs>
      <g transform="translate(0 .957)" fill="none" fillRule="evenodd">
        <mask id="k1oo8bfr0b" fill="#fff">
          <use xlinkHref="#osw83golia" />
        </mask>
        <use fill={pieBGColor1} xlinkHref="#osw83golia" />
        <path
          fill={pieBGColor2}
          mask="url(#k1oo8bfr0b)"
          d="M12 12.043 4.012.773 13.216-3 24 2.751z"
        />
        <path
          d="m12 12.043-2.957 12c.64 2.26 1.132 3.39 1.479 3.39.519 0 15.904-1.294 15.904-1.294l1.23-10.463L25.29 5.413 24 2.751l-12 9.292z"
          fill={pieBGColor3}
          mask="url(#k1oo8bfr0b)"
        />
      </g>
    </svg>
  );
}

export default PieIcon;

PieIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  pieBGColor1: null,
  pieBGColor2: null,
  pieBGColor3: null,
};
PieIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  pieBGColor1: PropTypes.string,
  pieBGColor2: PropTypes.string,
  pieBGColor3: PropTypes.string,
};
