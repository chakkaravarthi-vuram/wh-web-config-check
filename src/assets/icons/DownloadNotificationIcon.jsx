import React from 'react';
import PropTypes from 'prop-types';
import { ARIA_ROLES } from 'utils/UIConstants';

function DownloadNotificationIcon(props) {
  const { className, onClick, title } = props;
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      role={ARIA_ROLES.IMG}
    >
      <title>{title}</title>
      <g fill="#959BA3" fillRule="nonzero">
        <path d="M9 0C4.05 0 0 4.05 0 9s4.05 9 9 9 9-4.05 9-9-4.05-9-9-9zm0 16.2c-3.96 0-7.2-3.24-7.2-7.2S5.04 1.8 9 1.8s7.2 3.24 7.2 7.2-3.24 7.2-7.2 7.2z" />
        <path d="M8.37 10.53c.36.36.9.36 1.26 0l2.16-2.16a.87.87 0 0 0 0-1.26.87.87 0 0 0-1.26 0l-.63.63V4.5c0-.54-.36-.9-.9-.9s-.9.36-.9.9v3.24l-.63-.63a.87.87 0 0 0-1.26 0 .87.87 0 0 0 0 1.26l2.16 2.16zM12.6 11.7H5.4c-.54 0-.9.36-.9.9s.36.9.9.9h7.2c.54 0 .9-.36.9-.9s-.36-.9-.9-.9z" />
      </g>
    </svg>
  );
}
export default DownloadNotificationIcon;
DownloadNotificationIcon.defaultProps = {
  className: null,
  onClick: () => {},
  title: null,
};
DownloadNotificationIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
};
