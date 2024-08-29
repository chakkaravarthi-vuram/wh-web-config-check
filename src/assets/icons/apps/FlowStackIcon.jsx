import React from 'react';
import cx from 'clsx';
import gClasses from 'scss/Typography.module.scss';

function FlowStackIcon(props) {
    const { className, title, width, height } = props;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width || '20'}
            height={height || '20'}
            fill="none"
            viewBox="0 0 20 20"
            className={cx(className, gClasses.CursorPointer)}
        >
            <title>{title}</title>
            <path d="M6.5 8.5V11.9" stroke="#9E9E9E" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="round" />
            <path d="M6.62501 8.25C7.52247 8.25 8.25002 7.52247 8.25002 6.62501C8.25002 5.72755 7.52247 5 6.62501 5C5.72755 5 5 5.72755 5 6.62501C5 7.52247 5.72755 8.25 6.62501 8.25Z" stroke="#9E9E9E" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6.49999 15C7.32842 15 7.99998 14.3284 7.99998 13.5C7.99998 12.6716 7.32842 12 6.49999 12C5.67156 12 5 12.6716 5 13.5C5 14.3284 5.67156 15 6.49999 15Z" stroke="#9E9E9E" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M13.5 15C14.3284 15 15 14.3284 15 13.5C15 12.6716 14.3284 12 13.5 12C12.6716 12 12 12.6716 12 13.5C12 14.3284 12.6716 15 13.5 15Z" stroke="#9E9E9E" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6.56668 8.5C6.79168 9.375 7.59167 10.025 8.53334 10.0166L10.25 10.0083C11.5583 10 12.675 10.8417 13.0834 12.0167" stroke="#9E9E9E" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7.49999 18.3333H12.5C16.6667 18.3333 18.3333 16.6666 18.3333 12.5V7.49996C18.3333 3.33329 16.6667 1.66663 12.5 1.66663H7.49999C3.33332 1.66663 1.66666 3.33329 1.66666 7.49996V12.5C1.66666 16.6666 3.33332 18.3333 7.49999 18.3333Z" stroke="#9E9E9E" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />

        </svg>
    );
}

export default FlowStackIcon;
