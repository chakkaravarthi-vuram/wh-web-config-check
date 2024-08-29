import React from 'react';

function AddUserIcon(props) {
    const { className, title } = props;
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 18 18"
        className={className}
    >
        <title>{title}</title>
        <path
            stroke="#217CF5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M14.25 15.75v-4.5M12 13.5h4.5M9 11.25H6c-1.398 0-2.097 0-2.648.228a3 3 0 00-1.624 1.624c-.228.551-.228 1.25-.228 2.648M11.625 2.468a3.001 3.001 0 010 5.564m-1.5-2.782a3 3 0 11-6 0 3 3 0 016 0z"
        />
    </svg>
  );
}

export default AddUserIcon;
