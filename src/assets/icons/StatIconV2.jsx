import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from 'hoc/ThemeContext';

function StatIconV2(props) {
    const { className, onClick, style, title, isButtonColor, role, ariaLabel } = props;
    let { buttonColor } = useContext(ThemeContext);
    if (!isButtonColor) {
      buttonColor = null;
    }
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="21"
    fill="none"
    viewBox="0 0 22 21"
    className={className}
    role={role}
    aria-label={ariaLabel}
    onClick={onClick}
    style={{ ...style, fill: buttonColor }}
    >
            <title>{title}</title>
    <path
      fill="#959BA3"
      d="M1.225 15.775L0 14.875l4.7-7.5 3 3.5 3.975-6.45 2.725 4.05a4.736 4.736 0 00-.775.162c-.25.075-.5.163-.75.263L11.75 7.175 7.925 13.4 4.9 9.875l-3.675 5.9zM20.925 21l-3.35-3.35c-.35.25-.73.442-1.137.575-.409.133-.83.2-1.263.2-1.183 0-2.188-.413-3.013-1.238-.825-.825-1.237-1.829-1.237-3.012s.412-2.188 1.237-3.013c.825-.825 1.83-1.237 3.013-1.237 1.183 0 2.188.412 3.012 1.237.825.825 1.238 1.83 1.238 3.013 0 .433-.07.854-.213 1.262-.141.409-.329.796-.562 1.163L22 19.925 20.925 21zm-5.75-4.075c.767 0 1.417-.267 1.95-.8.533-.533.8-1.183.8-1.95 0-.767-.267-1.417-.8-1.95a2.654 2.654 0 00-1.95-.8c-.767 0-1.417.267-1.95.8a2.654 2.654 0 00-.8 1.95c0 .767.267 1.417.8 1.95.533.533 1.183.8 1.95.8zm1.85-8.2a3.12 3.12 0 00-.775-.2c-.267-.033-.542-.067-.825-.1L20.775 0 22 .9l-4.975 7.825z"
    />
    </svg>
  );
}
export default StatIconV2;
StatIconV2.defaultProps = {
    className: null,
    onClick: null,
    style: null,
    title: null,
    isButtonColor: false,
  };
  StatIconV2.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.any),
    title: PropTypes.string,
    isButtonColor: PropTypes.bool,
  };
