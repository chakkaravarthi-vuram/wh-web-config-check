import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function RejectedIcon(props) {
  const { className, onClick, style, title, isButtonColor, id, isPrimaryColor, role, ariaLabel } = props;
  let { buttonColor, primaryColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  if (!isPrimaryColor) {
    primaryColor = null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      className={className}
      onClick={onClick}
      id={id}
      role={role}
      aria-label={ariaLabel}
      style={({ ...style }, { fill: buttonColor || primaryColor })}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g transform="translate(-741 -381)">
          <g transform="translate(741 381)">
            <rect
              width="28"
              height="28"
              x="0"
              y="0"
              fill="#F07F7F"
              rx="14"
            />
            <g fill="#FFF" transform="translate(13 6)">
              <path d="M0 0H2V12H0z" />
              <path d="M0 14H2V16H0z" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
export default RejectedIcon;
RejectedIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  id: EMPTY_STRING,
};
RejectedIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  id: PropTypes.string,
};
