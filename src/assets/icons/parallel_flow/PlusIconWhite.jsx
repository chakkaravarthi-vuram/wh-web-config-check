import React from 'react';

function PlusIconWhite(props) {
    const { className, title, onClick } = props;
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 28 28"
        className={className}
        onClick={onClick}
    >
        <title>{title}</title>
        <g fill="none" fillRule="evenodd">
            <circle
                cx="14"
                cy="14"
                r="13"
                fill="#FFF"
                stroke="#217CF5"
                strokeWidth="2"
            />
            <path
                fill="#217CF5"
                d="M14.875 7l-.001 6.124 6.126.001v1.75l-6.126-.001.001 6.126h-1.75l-.001-6.126L7 14.875v-1.75l6.124-.001L13.125 7h1.75z"
            />
        </g>
    </svg>
  );
}
PlusIconWhite.defaultProps = {
    onClick: () => {},
};

export default PlusIconWhite;
