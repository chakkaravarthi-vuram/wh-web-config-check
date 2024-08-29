import React from 'react';
import PropTypes from 'prop-types';

function HamburgerMenuIcon(props) {
  const { className, onClick, role, ariaLabel } = props;
  return (
    <svg width="16" height="16" viewBox="0 0 18 16" role={role} aria-label={ariaLabel} className={className} xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
    <path
        fill="#B8BFC7"
        fillRule="evenodd"
        d="M13 10a1 1 0 110 2H1a1 1 0 110-2h12zm0-5a1 1 0 110 2H1a1 1 0 110-2h12zm0-5a1 1 0 110 2H1a1 1 0 110-2h12z"
    />
    </svg>
  );
}
export default HamburgerMenuIcon;
HamburgerMenuIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
  id: null,
};
HamburgerMenuIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  id: PropTypes.string,
};
