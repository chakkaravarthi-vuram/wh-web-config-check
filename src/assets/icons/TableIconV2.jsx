import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from 'hoc/ThemeContext';

function TableIconV2(props) {
    const { className, onClick, style, title, isButtonColor, role, ariaLabel } = props;
    let { buttonColor } = useContext(ThemeContext);
    if (!isButtonColor) {
      buttonColor = null;
    }
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="18"
    fill="none"
    viewBox="0 0 19 18"
    className={className}
    role={role}
    aria-label={ariaLabel}
    onClick={onClick}
    style={{ ...style, fill: buttonColor }}
    >
        <title>{title}</title>
    <path
      fill="#959BA3"
      d="M17.5 17.975h-16c-.4 0-.75-.15-1.05-.45-.3-.3-.45-.65-.45-1.05V1.5C0 1.1.15.75.45.45.75.15 1.1 0 1.5 0h16c.4 0 .75.15 1.05.45.3.3.45.65.45 1.05v14.975c0 .4-.15.75-.45 1.05-.3.3-.65.45-1.05.45zm-16-12.95h16V1.5h-16v3.525zm3.75 1.5H1.5v9.95h3.75v-9.95zm8.5 0v9.95h3.75v-9.95h-3.75zm-1.5 0h-5.5v9.95h5.5v-9.95z"
    />
    </svg>
  );
}
export default TableIconV2;
TableIconV2.defaultProps = {
    className: null,
    onClick: null,
    style: null,
    title: null,
    isButtonColor: false,
  };
  TableIconV2.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.any),
    title: PropTypes.string,
    isButtonColor: PropTypes.bool,
  };
