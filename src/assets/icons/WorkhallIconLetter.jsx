import React from 'react';

function WorkhallIconLetter(props) {
    const { className, title } = props;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="14"
            fill="none"
            viewBox="0 0 21 14"
            className={className}
        >
            <title>{title}</title>
            <path
                fill="#217CF5"
                fillRule="evenodd"
                d="M17.95 0L14.9 9.774l-1.795-5.612-1.439 4.25 1.941 5.52h2.579L21 0h-3.05zM8.723 0l-1.16 4.043-.471 1.641-1.175 4.09L3 0H0l4.609 13.932h2.469l1.32-4.011.546-1.654 1.268-3.852L11.668 0H8.723z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export default WorkhallIconLetter;
