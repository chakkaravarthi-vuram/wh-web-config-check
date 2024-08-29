import React from 'react';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';

function CloseIconV3(props) {
    const { className, title, onClick } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill="none"
        viewBox="0 0 14 14"
        className={cx(className, gClasses.CursorPointer)}
        onClick={onClick}
    >
        <title>{title}</title>
        <g>
            <path
                stroke="#959BA3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.4"
                d="M10.5 3.5l-7 7m0-7l7 7"
            />
        </g>
    </svg>
    );
}

export default CloseIconV3;
