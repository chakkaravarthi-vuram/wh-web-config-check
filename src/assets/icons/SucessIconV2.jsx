import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function SucessIconV2(props) {
  const {
    className,
    onClick,
    style,
    isButtonColor,
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
    width="80"
    height="80"
    fill="none"
    viewBox="0 0 80 80"
    className={className}
    role={role}
    aria-label={ariaLabel}
    onClick={onClick}
    style={{ ...style, fill: buttonColor }}
    >
    <mask
      id="mask0_1070_37788"
      style={{ maskType: 'alpha' }}
      width="80"
      height="80"
      x="0"
      y="0"
      maskUnits="userSpaceOnUse"
    >
      <path fill="#D9D9D9" d="M0 0H80V80H0z" />
    </mask>
    <g mask="url(#mask0_1070_37788)">
      <path
        fill="#6C727E"
        stroke="#F3F5F6"
        d="M9.752 52.801h0C8.029 48.811 7.166 44.545 7.166 40c0-4.546.863-8.811 2.586-12.801h0c1.725-4 4.064-7.475 7.018-10.428 2.953-2.954 6.427-5.294 10.427-7.022 3.99-1.72 8.256-2.582 12.802-2.582 3.562 0 6.926.52 10.095 1.559a33.809 33.809 0 018.296 4.017l-4.133 4.205a29.216 29.216 0 00-6.524-2.968h0c-2.441-.765-5.02-1.146-7.734-1.146-7.52 0-13.939 2.648-19.227 7.936-5.29 5.29-7.94 11.71-7.94 19.23 0 7.521 2.65 13.94 7.94 19.23C26.06 64.518 32.48 67.167 40 67.167s13.94-2.649 19.23-7.936h0c5.288-5.29 7.937-11.71 7.937-19.23 0-1.02-.057-2.038-.17-3.056a25.187 25.187 0 00-.447-2.703l4.647-4.648a35.95 35.95 0 011.144 4.66c.328 1.859.493 3.774.493 5.746 0 4.546-.863 8.812-2.586 12.802h0c-1.725 4-4.064 7.475-7.018 10.428-2.953 2.954-6.428 5.293-10.428 7.018h0c-3.99 1.723-8.256 2.586-12.802 2.586-4.546 0-8.811-.863-12.801-2.586h0c-4-1.725-7.475-4.064-10.428-7.018-2.954-2.953-5.293-6.428-7.018-10.428zM72.626 17.25L35.332 54.625 21.873 41.166l3.96-3.96 9.146 9.147.354.354.354-.355 32.98-33.062 3.959 3.96z"
      />
    </g>
    <path
      fill="#217CF5"
      stroke="#F3F5F6"
      d="M35.52 46.77L68.5 13.707l3.96 3.96-37.294 37.376-13.459-13.46 3.96-3.96 9.146 9.147.354.354.354-.354z"
    />
    </svg>
  );
}

export default SucessIconV2;

SucessIconV2.defaultProps = {
    className: null,
    onClick: null,
    style: null,
    title: null,
    isButtonColor: false,
  };
  SucessIconV2.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.any),
    title: PropTypes.string,
    isButtonColor: PropTypes.bool,
  };
