import React from 'react';

function NotEqualOperatorIcon(props) {
  const { onClick, role, ariaLabel } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="9"
      viewBox="0 0 8 9"
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      <path
        fill="#6C727E"
        d="M8 5.846c0 .34-.275.616-.615.616H3.304L2.05 8.342a.662.662 0 01-.513.273.615.615 0 01-.512-.957l.798-1.196H.615a.615.615 0 110-1.231h2.03l1.213-1.846H.615a.615.615 0 110-1.23h4.081L5.95.273a.616.616 0 011.024.683l-.799 1.197h1.21a.615.615 0 110 1.23H5.354L4.14 5.232h3.245c.34 0 .615.275.615.615z"
      />
    </svg>
  );
}

export default NotEqualOperatorIcon;
