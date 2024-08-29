import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ARIA_ROLES } from 'utils/UIConstants';
import ThemeContext from '../../hoc/ThemeContext';

function GoogleIcon(props) {
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
        <g fillRule="nonzero">
          <g>
            <g>
              <path
                fill="#4285F4"
                d="M17.638 9.199c0-.74-.06-1.28-.19-1.84h-8.45v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l-.016.111 2.67 2.07.186.018c1.7-1.57 2.68-3.88 2.68-6.62"
                transform="translate(-862 -448) translate(862 448)"
              />
              <path
                fill="#34A853"
                d="M8.999 17.998c2.43 0 4.47-.8 5.959-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.379 0-4.399-1.57-5.119-3.74l-.105.01-2.778 2.15-.036.1c1.48 2.94 4.52 4.96 8.039 4.96"
                transform="translate(-862 -448) translate(862 448)"
              />
              <path
                fill="#FBBC05"
                d="M3.88 10.779c-.19-.56-.3-1.16-.3-1.78 0-.62.11-1.22.29-1.78l-.006-.12-2.812-2.183-.092.043C.35 6.18 0 7.55 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26"
                transform="translate(-862 -448) translate(862 448)"
              />
              <path
                fill="#EB4335"
                d="M8.999 3.48c1.69 0 2.83.73 3.48 1.34l2.539-2.48C13.458.89 11.428 0 8.998 0 5.48 0 2.44 2.02.96 4.96l2.91 2.259c.73-2.17 2.75-3.74 5.129-3.74"
                transform="translate(-862 -448) translate(862 448)"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
export default GoogleIcon;
GoogleIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  ariaHidden: false,
};
GoogleIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  ariaHidden: PropTypes.bool,
};
