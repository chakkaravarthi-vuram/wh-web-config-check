import React from 'react';
import PropTypes from 'prop-types';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';

function OpenLinkIcon(props) {
  const { className, onClick, title, tabIndex, role, ariaLabel, ariaHidden } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={className}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      onKeyDown={(event) => keydownOrKeypessEnterHandle(event) && onClick()}
    >
      <title>{title}</title>
      <path
        fill="#6C727E"
        stroke="#6C727E"
        strokeWidth="0.2"
        d="M15.433 10.45a.754.754 0 011.509 0v4.322c0 .613-.25 1.17-.655 1.574a2.229 2.229 0 01-1.578.654H3.233c-.615 0-1.173-.25-1.578-.654A2.219 2.219 0 011 14.772V3.238c0-.613.25-1.17.655-1.574a2.229 2.229 0 011.578-.653h4.304a.754.754 0 110 1.505H3.233a.725.725 0 00-.723.721v11.534a.722.722 0 00.723.721H14.71a.725.725 0 00.723-.721v-4.32zm.238-7.176l-7.623 7.7a.755.755 0 01-1.065.01.75.75 0 01-.009-1.063l7.33-7.405h-3.052a.754.754 0 110-1.505h3.458c.668 0 1.53-.114 2.043.403.323.327.251 2.932.21 4.442-.01.39-.02.688-.02.902a.754.754 0 01-1.508 0c0-.04.01-.432.024-.943.021-.786.148-1.828.212-2.541z"
      />
    </svg>
  );
}
export default OpenLinkIcon;
OpenLinkIcon.defaultProps = {
  className: null,
  onClick: () => {},
  title: null,
};
OpenLinkIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
};
