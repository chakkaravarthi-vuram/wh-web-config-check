import React from 'react';

function FilePlusIcon(props) {
  const { className, height, width } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '18'}
      height={height || '18'}
      fill="none"
      viewBox="0 0 18 18"
      className={className}
    >
      <g>
        <path
          fill="#217CF5"
          fillRule="evenodd"
          d="M6.569.75h4.862c.604 0 1.102 0 1.508.033.421.035.809.109 1.173.294a3 3 0 011.311 1.311c.185.364.26.752.294 1.173.033.406.033.904.033 1.508v2.806a.75.75 0 01-1.5 0V5.1c0-.642 0-1.08-.028-1.417-.027-.329-.076-.497-.136-.614a1.5 1.5 0 00-.655-.656c-.117-.06-.285-.108-.614-.135-.338-.027-.775-.028-1.417-.028H6.6c-.642 0-1.08 0-1.417.028-.329.027-.497.076-.614.135a1.5 1.5 0 00-.656.656c-.06.117-.108.285-.135.614-.027.338-.028.775-.028 1.417v7.8c0 .642 0 1.08.028 1.417.027.329.076.497.135.614a1.5 1.5 0 00.656.655c.117.06.285.109.614.136.338.027.775.028 1.417.028H9a.75.75 0 010 1.5H6.569c-.604 0-1.102 0-1.508-.033-.421-.035-.809-.108-1.173-.294a3 3 0 01-1.311-1.311c-.185-.364-.26-.752-.294-1.173-.033-.406-.033-.904-.033-1.508V5.069c0-.604 0-1.102.033-1.508.035-.421.109-.809.294-1.173a3 3 0 011.311-1.311c.364-.185.752-.26 1.173-.294C5.467.75 5.965.75 6.57.75zM5.25 5.25A.75.75 0 016 4.5h6A.75.75 0 0112 6H6a.75.75 0 01-.75-.75zm0 3A.75.75 0 016 7.5h4.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zm0 3A.75.75 0 016 10.5h1.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zm8.25-.75a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5a.75.75 0 01.75-.75z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default FilePlusIcon;
