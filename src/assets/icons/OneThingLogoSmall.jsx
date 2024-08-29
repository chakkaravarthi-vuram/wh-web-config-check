import React from 'react';
import PropTypes from 'prop-types';
import { ARIA_ROLES } from 'utils/UIConstants';

function OnethingLogoSmall(props) {
  const { className, onClick, title, ariaHidden } = props;
  return (

    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="38"
    height="25"
    fill="none"
    viewBox="0 0 38 25"
    className={className}
      onClick={onClick}
      role={ARIA_ROLES.IMG}
      aria-hidden={ariaHidden}
    >
    <title>{title}</title>
    <path
      fill="#217CF5"
      fillRule="evenodd"
      d="M32.18.462l-5.321 17.055-3.133-9.792-2.51 7.418 3.387 9.63h4.5l8.4-24.31h-5.324z"
      clipRule="evenodd"
    />
    <path
      fill="#1F243D"
      fillRule="evenodd"
      d="M16.079.462l-2.026 7.056-.822 2.863-2.05 7.136L6.092.462H.858l8.041 24.312h4.31l2.304-7 .951-2.886 2.214-6.72L21.215.461H16.08z"
      clipRule="evenodd"
    />
    </svg>

  );
}
export default OnethingLogoSmall;
OnethingLogoSmall.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  ariaHidden: false,
};
OnethingLogoSmall.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  ariaHidden: PropTypes.bool,
};
