import React from 'react';

function ParallelJoinDeleteIcon(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className={className}
    >
        <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <rect width="16" height="16" fill="#FFF" rx="2" />
        <path
          fill="#6C727E"
          fillRule="nonzero"
          d="M5.263 12.5a.723.723 0 01-.532-.219.723.723 0 01-.218-.531V4.625H4v-.75h2.35V3.5h3.3v.375H12v.75h-.512v7.125a.72.72 0 01-.226.525.72.72 0 01-.524.225H5.263zm5.475-7.875H5.263v7.125h5.475V4.625zm-4.15 6.05h.75V5.687h-.75v4.988zm2.074 0h.75V5.687h-.75v4.988zm-3.4-6.05v7.125-7.125z"
        />
      </g>
    </svg>
    );
}

export default ParallelJoinDeleteIcon;
