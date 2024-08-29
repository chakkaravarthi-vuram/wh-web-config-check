import React from 'react';

function ReassignIcon(props) {
  const { className, onClick, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="none"
      viewBox="0 0 24 24"
      className={className}
      onClick={onClick}
      title={title}
    >
      <path
        fill="#959BA3"
        d="M12.72 19.56c2.025 0 3.744-.707 5.159-2.121C19.293 16.024 20 14.305 20 12.28a7.06 7.06 0 00-.575-2.84 7.396 7.396 0 00-1.559-2.306 7.397 7.397 0 00-2.306-1.559A7.045 7.045 0 0012.72 5a7.074 7.074 0 00-2.847.575 7.36 7.36 0 00-2.306 1.559 7.391 7.391 0 00-1.554 2.304 7.03 7.03 0 00-.573 2.828v.12l-1.444-1.463-1.174 1.16L6.34 15.6l3.518-3.518-1.175-1.16-1.443 1.444v-.105c-.004-1.513.532-2.802 1.607-3.866S11.213 6.8 12.72 6.8c1.517 0 2.81.534 3.878 1.602 1.068 1.069 1.602 2.361 1.602 3.878-.01 1.517-.546 2.81-1.61 3.878-1.063 1.068-2.353 1.602-3.87 1.602a5.279 5.279 0 01-2.12-.432 5.59 5.59 0 01-1.77-1.211L7.553 17.4a7.347 7.347 0 002.316 1.583 7.057 7.057 0 002.852.577z"
      />
      <path
        fill="#959BA3"
        d="M12.61 11.889a1.631 1.631 0 110-3.262 1.631 1.631 0 010 3.262zm0 .816c1.09 0 3.264.546 3.264 1.631v.816H9.348v-.816c0-1.085 2.174-1.631 3.263-1.631z"
      />
    </svg>
  );
}

export default ReassignIcon;
