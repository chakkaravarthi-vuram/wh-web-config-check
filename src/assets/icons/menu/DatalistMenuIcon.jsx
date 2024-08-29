import React from 'react';
import PropTypes from 'prop-types';
import { ARIA_ROLES } from 'utils/UIConstants';

function DataListMenuIcon(props) {
  const { className, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      fill="none"
      viewBox="0 0 21 21"
      className={className}
      role={ARIA_ROLES.IMG}
    >
      <g clipPath="url(#clip0_15516_28967)">
        <title>{title}</title>
        <path
          stroke="#9E9E9E"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M11.681 2.851v3.442c0 .467 0 .7.091.879.08.156.208.284.364.364.179.09.412.09.879.09h3.441m-3.108 4.167H6.682m6.666 3.334H6.682M8.348 8.46H6.682m5-5.834H7.347c-1.4 0-2.1 0-2.634.273A2.5 2.5 0 003.62 3.991c-.272.535-.272 1.235-.272 2.635v8.667c0 1.4 0 2.1.272 2.635a2.5 2.5 0 001.093 1.093c.534.272 1.234.272 2.634.272h5.333c1.4 0 2.1 0 2.635-.272a2.5 2.5 0 001.092-1.093c.273-.535.273-1.235.273-2.635V7.626l-5-5z"
        />
      </g>
      <defs>
        <clipPath id="clip0_15516_28967">
          <path
            fill="#fff"
            d="M0 0H19.998V20H0z"
            transform="translate(.016 .96)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default DataListMenuIcon;

DataListMenuIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
};
DataListMenuIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
};
