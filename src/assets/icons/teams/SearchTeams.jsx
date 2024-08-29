import React from 'react';

function SearchTeamsIcon(props) {
    const {
        className,
        ariaLabel,
        ariaHidden,
        role,
        tabIndex,
      } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      role={role}
      className={className}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      <path
        stroke="#9E9E9E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17.5 17.5l-3.625-3.625m1.958-4.708a6.667 6.667 0 11-13.333 0 6.667 6.667 0 0113.333 0z"
      />
    </svg>
  );
}

export default SearchTeamsIcon;
