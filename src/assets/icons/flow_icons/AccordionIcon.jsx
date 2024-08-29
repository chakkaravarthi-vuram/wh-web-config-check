import React from 'react';

function AccordionIcon(props) {
    const {
        className,
    } = props;
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="21"
        viewBox="0 0 20 21"
        fill="none"
        className={className}
    >
        <path
            d="M5 13L10 8L15 13"
            stroke="#959BA3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
  );
}

export default AccordionIcon;
