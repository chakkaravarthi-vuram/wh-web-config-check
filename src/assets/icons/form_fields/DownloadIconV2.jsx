import React from 'react';

function DownloadIconV2(props) {
    const { className, title, style, tabIndex, onClick, onKeyDown, ariaLabel, role, stroke, strokeWidth } = props;
    return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    stroke={stroke}
    stroke-width={strokeWidth}
    viewBox="0 96 960 960"
    className={className}
    onClick={onClick}
    aria-label={ariaLabel}
    tabIndex={tabIndex || '-1'}
    style={({ ...style })}
    role={role}
    onKeyDown={onKeyDown}
    >
        <title>{title}</title>
        <path d="M220 896q-24 0-42-18t-18-42V693h60v143h520V693h60v143q0 24-18 42t-42 18H220zm260-153L287 550l43-43 120 120V256h60v371l120-120 43 43-193 193z" />
    </svg>
    );
}

export default DownloadIconV2;
