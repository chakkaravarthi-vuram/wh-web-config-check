import React from 'react';

function EditDatalistIcon(props) {
  const { className, onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick}
    >
      <g clipPath="url(#clip0_19529_35444)">
        <path
          stroke="#9E9E9E"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M12 6.667L9.333 4M1.667 14.333l2.256-.25c.276-.03.413-.046.542-.088a1.33 1.33 0 00.324-.155c.113-.075.21-.173.407-.37L14 4.668A1.886 1.886 0 1011.333 2L2.53 10.804c-.196.196-.294.294-.368.407-.067.1-.119.21-.156.324-.042.129-.057.267-.088.542l-.25 2.256z"
        />
      </g>
      <defs>
        <clipPath id="clip0_19529_35444">
          <path fill="#fff" d="M0 0H16V16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default EditDatalistIcon;
