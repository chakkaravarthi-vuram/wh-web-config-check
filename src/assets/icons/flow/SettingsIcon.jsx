import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function SettingsIcon(props) {
  const { className, onClick, style, title, id, role, ariaLabel } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="17"
      viewBox="0 0 16 17"
      className={className}
      onClick={onClick || null}
      role={role}
      style={style}
      id={id}
      aria-label={ariaLabel}
    >
      <title>{title}</title>
      <path
        fill="#ADB6C7"
        fillRule="evenodd"
        stroke="none"
        d="M6.73.504a.448.448 0 01.397-.456 8.076 8.076 0 011.8.004.45.45 0 01.393.47A1.784 1.784 0 0010.4 2.26c.694.267 1.482.09 1.993-.45a.447.447 0 01.61-.05c.47.378.896.807 1.27 1.28a.445.445 0 01-.05.607 1.759 1.759 0 001.21 3.074c.228 0 .49.168.516.393a8.202 8.202 0 010 1.813.45.45 0 01-.469.394h-.1a1.76 1.76 0 00-1.19 3.08c.174.16.194.426.046.61a8.115 8.115 0 01-1.293 1.28.446.446 0 01-.604-.05 1.85 1.85 0 00-1.977-.456 1.775 1.775 0 00-1.093 1.706.446.446 0 01-.397.46c-.292.033-.585.05-.879.05-.308 0-.616-.019-.922-.053a.45.45 0 01-.394-.47 1.772 1.772 0 00-1.08-1.736 1.845 1.845 0 00-1.998.453.447.447 0 01-.61.046 7.902 7.902 0 01-1.266-1.28.445.445 0 01.05-.605 1.78 1.78 0 00.446-1.977A1.76 1.76 0 00.574 9.281c-.229 0-.502-.16-.522-.394a7.895 7.895 0 010-1.818.435.435 0 01.461-.393A1.85 1.85 0 002.254 5.6a1.77 1.77 0 00-.453-2 .45.45 0 01-.046-.61 8.03 8.03 0 011.293-1.28.447.447 0 01.604.05c.512.53 1.29.707 1.982.45A1.776 1.776 0 006.73.504zm3.95 7.513a2.669 2.669 0 10-2.668 2.667 2.671 2.671 0 002.668-2.667z"
      />
    </svg>
  );
}
export default SettingsIcon;

SettingsIcon.defaultProps = {
  className: null,
  onClick: () => {},
  style: {},
  title: null,
  id: EMPTY_STRING,
};
SettingsIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
};
