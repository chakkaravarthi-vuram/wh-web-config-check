import React from 'react';

function DBIcon(props) {
  const { className, title } = props;
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>{title}</title>
      <path
        d="M16.5 4.16663C16.5 5.54734 13.1421 6.66663 9 6.66663C4.85786 6.66663 1.5 5.54734 1.5 4.16663M16.5 4.16663C16.5 2.78591 13.1421 1.66663 9 1.66663C4.85786 1.66663 1.5 2.78591 1.5 4.16663M16.5 4.16663V15.8333C16.5 17.2166 13.1667 18.3333 9 18.3333C4.83333 18.3333 1.5 17.2166 1.5 15.8333V4.16663M16.5 9.99996C16.5 11.3833 13.1667 12.5 9 12.5C4.83333 12.5 1.5 11.3833 1.5 9.99996"
        stroke="#217CF5"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default DBIcon;
