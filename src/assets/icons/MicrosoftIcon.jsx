import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ARIA_ROLES } from 'utils/UIConstants';
import ThemeContext from '../../hoc/ThemeContext';

function MicrosoftIcon(props) {
  const {
    className, onClick, style, title, isButtonColor, ariaHidden,
  } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={className}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
      role={ARIA_ROLES.IMG}
      aria-hidden={ariaHidden}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <g>
          <g>
            <path
              fill="#FF3E00"
              d="M0 0H8.471V8.471H0z"
              transform="translate(-855 -508) translate(855 508)"
            />
            <path
              fill="#00A6F6"
              d="M0 9.529H8.471V18H0z"
              transform="translate(-855 -508) translate(855 508)"
            />
            <path
              fill="#6BBD00"
              d="M9.529 0H18V8.471H9.529z"
              transform="translate(-855 -508) translate(855 508)"
            />
            <path
              fill="#FFB700"
              d="M9.529 9.529H18V18H9.529z"
              transform="translate(-855 -508) translate(855 508)"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
export default MicrosoftIcon;
MicrosoftIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  ariaHidden: false,
};
MicrosoftIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  ariaHidden: PropTypes.bool,
};
