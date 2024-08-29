import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function DonutIcon(props) {
  const {
    className,
    onClick,
    style,
    title,
    isButtonColor,
    donutBGColor1,
    donutBGColor2,
    donutBGColor3,
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
      <g fillRule="nonzero">
        <path
          d="m21.85 18.856-4.921-3.433A5.985 5.985 0 0 1 12 18c-.262 0-.52-.016-.775-.049l-.76 5.952c.377.048.76.079 1.147.09L12 24h-1.547H12c4.078 0 7.682-2.035 9.85-5.144z"
          fill={donutBGColor1}
        />
        <path
          d="m.744 16.17 5.626-2.085A5.973 5.973 0 0 1 6 12.022a5.97 5.97 0 0 1 1.56-4.058L3.122 3.926a11.954 11.954 0 0 0-3.116 7.702L0 12c0 1.466.263 2.871.744 4.17z"
          fill={donutBGColor2}
        />
        <path
          d="M12 6a5.998 5.998 0 0 1 5.343 3.265l5.337-2.743A12 12 0 0 0 12.324.004L12 0v6z"
          fill={donutBGColor3}
        />
      </g>
    </svg>
  );
}

export default DonutIcon;

DonutIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  donutBGColor1: null,
  donutBGColor2: null,
  donutBGColor3: null,
};
DonutIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  donutBGColor1: PropTypes.string,
  donutBGColor2: PropTypes.string,
  donutBGColor3: PropTypes.string,
};
