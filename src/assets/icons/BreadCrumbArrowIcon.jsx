import React from 'react';

function BreadCrumbArrowIcon(props) {
    const { className, onClick, role, ariaLabel, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 13 13"
      className={className}
      role={role}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <title>{title}</title>
      <path
        fill="#959BA3"
        d="M.249 8.628c-.769.75.422 1.875 1.152 1.125l4.34-4.238a.74.74 0 000-1.125L1.516.227C.748-.485-.404.64.364 1.39l3.648 3.562L.25 8.628z"
        strokeWidth="10"
      />
    </svg>
  );
}

export default BreadCrumbArrowIcon;
