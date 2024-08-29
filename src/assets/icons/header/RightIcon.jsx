import React from 'react';

function RightArrowIcon(props) {
    const { className, title, onClick } = props;
    return (
        <svg
            width="12"
            height="10"
            viewBox="0 0 12 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            onClick={onClick}
        >
            <title>{title}</title>
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.86193 9.47136C6.60158 9.21101 6.60158 8.7889 6.86193 8.52855L9.72386 5.66663L0.666665 5.66663C0.298477 5.66663 -1.53156e-06 5.36815 -1.49938e-06 4.99996C-1.46719e-06 4.63177 0.298477 4.33329 0.666666 4.33329L9.72386 4.33329L6.86193 1.47136C6.60158 1.21101 6.60158 0.788905 6.86193 0.528555C7.12228 0.268205 7.54439 0.268205 7.80474 0.528556L11.8047 4.52856C12.0651 4.7889 12.0651 5.21101 11.8047 5.47136L7.80474 9.47136C7.54439 9.73171 7.12228 9.73171 6.86193 9.47136Z"
                fill="#D8DEE9"
            />
        </svg>
    );
}

export default RightArrowIcon;
