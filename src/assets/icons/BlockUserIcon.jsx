import React from 'react';

function BlockUserIcon(props) {
  const { className, onClick, title, role, ariaLabel } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <rect
          width="23"
          height="23"
          x="0.5"
          y="0.5"
          fill="#FFF"
          stroke="#DADFE7"
          rx="4"
        />
        <path
          fill="#F29494"
          fillRule="nonzero"
          d="M12 6a6 6 0 100 12 6 6 0 000-12zm-4.5 6a4.5 4.5 0 017.102-3.668l-6.27 6.27A4.5 4.5 0 017.5 12zm4.5 4.5a4.5 4.5 0 01-2.602-.832l6.27-6.27A4.5 4.5 0 0112 16.5z"
        />
      </g>
    </svg>
  );
}

export default BlockUserIcon;
