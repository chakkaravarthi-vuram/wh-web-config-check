import React from 'react';
import PropTypes from 'prop-types';

function FilterIconV2(props) {
  const { className, onClick, title, ariaHidden, role, ariaLabel } = props;
  return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="white"
        viewBox="0 0 20 20"
        aria-hidden={ariaHidden}
        className={className}
        onClick={onClick}
        role={role}
        aria-label={ariaLabel}
      >
        <title>{title}</title>
        <g>
            <path
            stroke="#959BA3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            d="M18.333 2.5H1.667l6.666 7.883v5.45l3.333 1.667v-7.117L18.334 2.5z"
            />
        </g>
      </svg>
    );
}
export default FilterIconV2;
FilterIconV2.defaultProps = {
  type: 1,
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  ariaHidden: false,
};
FilterIconV2.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  type: PropTypes.number,
  isButtonColor: PropTypes.bool,
  ariaHidden: PropTypes.bool,
};
