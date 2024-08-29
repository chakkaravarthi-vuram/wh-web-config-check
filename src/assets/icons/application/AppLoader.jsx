import React from 'react';

function AppLoaderIcon(props) {
    const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="108"
      height="108"
      fill="none"
      viewBox="0 0 108 108"
      className={className}
    >
      <circle cx="54" cy="54" r="53.5" fill="#217CF5" stroke="#217CF5" />
      <circle cx="54" cy="54" r="48" fill="#fff" />
      <path
        fill="#217CF5"
        fillRule="evenodd"
        d="M62.606 59.915l-3.354-10.86-2.687 8.227 3.626 10.681h4.817L74 41h-5.698l-5.696 18.915z"
        clipRule="evenodd"
      />
      <path
        fill="#1F243D"
        fillRule="evenodd"
        d="M48.756 48.825L47.836 52l-2.291 7.915L39.853 41H34l8.992 26.963h4.818l2.577-7.763 1.064-3.2 2.475-7.455L56.764 41h-5.743l-2.265 7.825z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default AppLoaderIcon;
