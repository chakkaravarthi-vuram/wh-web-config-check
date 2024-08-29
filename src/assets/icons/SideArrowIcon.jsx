import React from 'react';
import PropTypes from 'prop-types';

function SideArrowIcon(props) {
  const {
    className, onClick, title, ariaHidden } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden={ariaHidden}
      className={className}
      onClick={onClick || null}
      fill="none"
    >
      <title>{title}</title>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2929 5.29289C13.6834 4.90237 14.3166 4.90237 14.7071 5.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L14.7071 18.7071C14.3166 19.0976 13.6834 19.0976 13.2929 18.7071C12.9024 18.3166 12.9024 17.6834 13.2929 17.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L13.2929 6.70711C12.9024 6.31658 12.9024 5.68342 13.2929 5.29289Z" fill="#9E9E9E" />
    </svg>
  );
}
export default SideArrowIcon;

SideArrowIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  ariaHidden: false,
};
SideArrowIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  ariaHidden: PropTypes.bool,
};
