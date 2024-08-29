import React from 'react';
import PropTypes from 'prop-types';

function DownloadIconV2(props) {
  const { className, onClick, title, role, ariaLabel, ariaHidden, tabIndex, onKeyDown } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      <title>{title}</title>
      <g>
        <path
          stroke="#217CF5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M14 10v2.667A1.334 1.334 0 0112.667 14H3.333A1.334 1.334 0 012 12.667V10m2.667-3.333L8 10m0 0l3.333-3.333M8 10V2"
        />
      </g>
    </svg>
  );
}
export default DownloadIconV2;
DownloadIconV2.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
DownloadIconV2.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
