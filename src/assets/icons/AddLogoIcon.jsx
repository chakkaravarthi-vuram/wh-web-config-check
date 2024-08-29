import React from 'react';

function AddLogoIcon(props) {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
    >
      <path
        fill="#1A9CD1"
        fillRule="evenodd"
        d="M8.333 0a1 1 0 011 1v5.666H15a1 1 0 011 1v.667a1 1 0 01-1 1H9.333V15a1 1 0 01-1 1h-.666a1 1 0 01-1-1l-.001-5.667H1a1 1 0 01-1-1v-.666a1 1 0 011-1l5.666-.001V1a1 1 0 011-1h.667z"
      />
    </svg>
  );
}

export default AddLogoIcon;
