import React from 'react';

function ReadOnlyIcon(props) {
    const { className } = props;
    return (
    <>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            className={className}
        >
            <path
                fill="#959BA3"
                stroke="#6C727E"
                strokeWidth="0.2"
                d="M12.85 12.146a.5.5 0 01.057.638l-.058.069a.5.5 0 01-.637.058l-.07-.058-3.96-3.961-2.79 2.791a2 2 0 01-.888.515l-2.872.784a.5.5 0 01-.614-.614l.784-2.872a2 2 0 01.515-.888l2.79-2.79-3.96-3.959a.5.5 0 01-.058-.637l.058-.07a.5.5 0 01.638-.057l.069.057 10.995 10.994zM5.813 6.525l-2.79 2.79a1 1 0 00-.258.444l-.553 2.028 2.028-.553a1 1 0 00.444-.257l2.79-2.79-1.66-1.662zm6.418-5.01l.131.122.121.131a2.175 2.175 0 01-.12 2.944l-2.77 2.765-.705-.705 1.584-1.584-1.661-1.661L7.228 5.11l-.708-.707 2.768-2.766a2.175 2.175 0 012.944-.121zm-2.237.829l-.476.475 1.661 1.662.476-.476a1.175 1.175 0 00-1.661-1.661z"
            />
        </svg>
        {/* <Tooltip id="readonlyIcon" content={title} isCustomToolTip placement="top" /> */}
    </>
    );
}

export default ReadOnlyIcon;
