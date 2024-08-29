import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function PieChartIcon(props) {
  const { className, onClick, style, isButtonColor, role, ariaLabel } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      style={{ ...style, fill: buttonColor }}
      role={role}
      aria-label={ariaLabel}
    >
      <defs>
        <circle
          id="sth1yqtnja"
          cx="554"
          cy="402"
          r="6"
        />
        <mask
          id="qn3y4rmmnb"
          maskContentUnits="userSpaceOnUse"
          maskUnits="objectBoundingBox"
          x="0"
          y="0"
          width="12"
          height="12"
          fill="#fff"
        >
          <use
            xlinkHref="#sth1yqtnja"
          />
        </mask>
      </defs>
      <use
        mask="url(#qn3y4rmmnb)"
        xlinkHref="#sth1yqtnja"
        transform="translate(-548 -396)"
        stroke="#ADB6C7"
        strokeWidth="6"
        fill="none"
        fillRule="evenodd"
        strokeDasharray="6"
      />
    </svg>

  );
}

export default PieChartIcon;

PieChartIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
PieChartIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
