import React from 'react';

function LibraryManagement(props) {
    const { className, role, ariaLabel } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="14"
      viewBox="0 0 11 14"
      className={className}
      fill="#B8BFC7"
      role={role}
      aria-label={ariaLabel}
    >
      <path
        fillRule="evenodd"
        d="M9.1 0c.965 0 1.75.785 1.75 1.75v7.7c0 .965-.785 1.75-1.75 1.75H2.06c-.459 0-.916.32-.916.898 0 .58.387.929.916.929h8.605c.193 0 .337.25.337.508 0 .257-.144.465-.337.465H1.75C.785 14 0 13.215 0 12.25V1.75C0 .785.785 0 1.75 0zM4.334 2A2.336 2.336 0 002 4.333a2.336 2.336 0 002.334 2.334c.475 0 .915-.144 1.284-.389l2.586 2.586a.469.469 0 00.66 0 .467.467 0 000-.66L6.278 5.618c.245-.37.39-.81.39-1.285A2.336 2.336 0 004.333 2zm-.034.8a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"
      />
    </svg>
  );
}

export default LibraryManagement;
