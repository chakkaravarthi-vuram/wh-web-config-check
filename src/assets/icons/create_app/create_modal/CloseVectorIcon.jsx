import React from 'react';

function CloseVectorIcon(props) {
    const { className, title } = props;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
            className={className}
        >
            <title>{title}</title>
            <path
                fill="#9E9E9E"
                d="M2.4 15.191L.809 13.6l5.6-5.6-5.6-5.6L2.399.809l5.6 5.6 5.6-5.6 1.592 1.59-5.6 5.6 5.6 5.6-1.591 1.592-5.6-5.6-5.6 5.6z"
            />
        </svg>
  );
}

export default CloseVectorIcon;
