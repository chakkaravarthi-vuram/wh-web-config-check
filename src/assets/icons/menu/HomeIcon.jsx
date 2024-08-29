import React from 'react';
import PropTypes from 'prop-types';
import { ARIA_ROLES } from 'utils/UIConstants';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';

function HomeIcon(props) {
  const { id, className, style } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      id={id}
      className={className}
      style={style}
      role={ARIA_ROLES.IMG}
    >
      <g clipPath="url(#clip0_15516_28955)">
        <path
          stroke="#959BA3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M7.5 19.293V10.96h5v8.333M2.5 8.46L10 2.626l7.5 5.834v9.166a1.667 1.667 0 01-1.667 1.667H4.167A1.667 1.667 0 012.5 17.627V8.46z"
        />
      </g>
      <defs>
        <clipPath id="clip0_15516_28955">
          <path
            fill="#fff"
            d="M0 0H20V20H0z"
            transform="translate(0 .96)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
export default HomeIcon;

HomeIcon.defaultProps = {
  className: null,
  style: null,
  id: EMPTY_STRING,
};
HomeIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  id: PropTypes.string,
};
