import React from 'react';

function UserPropertyPickerIcon(props) {
  const { className, onClick } = props;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={className}
    >
      <g>
        <g>
          <path
            fill="#959BA3"
            fillRule="evenodd"
            d="M10 4a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM4.5 7.5a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0zm13.793 6.793a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L19.586 19H16a1 1 0 010-2h3.586l-1.293-1.293a1 1 0 010-1.414zM7.326 14.5H12a1 1 0 010 2H7.5c-1.468 0-1.98.01-2.37.13a3 3 0 00-2 2c-.12.39-.13.902-.13 2.37a1 1 0 11-2 0v-.174c0-1.227 0-2.065.215-2.777a5 5 0 013.334-3.334c.712-.216 1.55-.216 2.777-.215z"
            clipRule="evenodd"
          />
        </g>
      </g>
    </svg>
  );
}

export default UserPropertyPickerIcon;
