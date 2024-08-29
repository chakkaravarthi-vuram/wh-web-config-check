import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';

function ChartIcon(props) {
  const { className, onClick, style, title, isButtonColor, role, ariaLabel } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      className={className}
      onClick={onClick}
      style={{ ...style, fill: buttonColor }}
      role={role}
      aria-label={ariaLabel}
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
          <g transform="translate(8 8)">
            <g>
              <g>
                <g>
                  <path fillRule="evenodd" stroke="none" d="M5 0H0v17h5V0zm1 4h5v13H6V4zm11 5h-5v8h5V9z" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

export default ChartIcon;

ChartIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
ChartIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
