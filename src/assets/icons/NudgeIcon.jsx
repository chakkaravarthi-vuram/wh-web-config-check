import React from 'react';
import PropTypes from 'prop-types';

function NudgeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="110"
      height="34"
      viewBox="0 0 110 34"
    >
      <g fill="none" fillRule="evenodd">
        <rect
          width="89"
          height="33"
          x="0.5"
          y="0.5"
          fill="#F6F9FB"
          stroke="#B8BFC7"
          rx="4"
        />
        <text
          fill="#1F243D"
          fontFamily="Montserrat-Medium, Montserrat"
          fontSize="11"
          fontWeight="400"
        >
          <tspan x="28" y="20">
            Nudge All
          </tspan>
        </text>
        <path
          fill="#6C727E"
          fillRule="nonzero"
          dx="15"
          d="M22.962 19.368l-1.448-2.576v-2.88c0-2.51-1.87-4.582-4.295-4.918v-.337A.658.658 0 0016.562 8a.669.669 0 00-.657.657v.337a4.95 4.95 0 00-4.294 4.918v2.896l-1.449 2.56a1.272 1.272 0 001.111 1.886h2.308A2.992 2.992 0 0016.562 24a3.02 3.02 0 002.998-2.745h2.307c.455 0 .86-.236 1.095-.623a1.255 1.255 0 000-1.264z"
        />
      </g>
    </svg>
  );
}
export default NudgeIcon;
NudgeIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
NudgeIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
