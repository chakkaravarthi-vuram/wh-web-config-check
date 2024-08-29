import React from 'react';
import PropTypes from 'prop-types';

function ProgressIcon(props) {
  const { className, onClick, title, role, ariaLabel, ariaHidden, tabIndex, onKeyDown } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="16"
      viewBox="0 0 17 16"
      className={className}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      <title>{title}</title>
        <g clip-path="url(#clip0_2986_314)">
            <path d="M8.50016 1.3335V4.00016M8.50016 12.0002V14.6668M3.78683 3.28683L5.6735 5.1735M11.3268 10.8268L13.2135 12.7135M1.8335 8.00016H4.50016M12.5002 8.00016H15.1668M3.78683 12.7135L5.6735 10.8268M11.3268 5.1735L13.2135 3.28683" stroke="#217CF5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <defs>
            <clipPath id="clip0_2986_314">
            <rect width="16" height="16" fill="white" transform="translate(0.5)" />
            </clipPath>
        </defs>
    </svg>
  );
}
export default ProgressIcon;
ProgressIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
ProgressIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
