import React from 'react';

function TriggerIcon(props) {
    const { className, title } = props;
    return (
    <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <title>{title}</title>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.8999 2H2.8999V7H7.8999V2ZM0.899902 0V9H9.8999V0H0.899902Z" fill="#217CF5" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0999 12.8008H11.8999V16.0008H15.0999V12.8008ZM9.8999 10.8008V18.0008H17.0999V10.8008H9.8999Z" fill="#217CF5" />
        <path d="M4.5 9H6.3V14.4H4.5V9Z" fill="#F3F6F9" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 9V14.4H6.3V9H4.5Z" fill="#217CF5" />
        <path d="M9.8999 12.5996L9.8999 14.3996L4.4999 14.3996L4.4999 12.5996L9.8999 12.5996Z" fill="#F3F6F9" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.8999 12.5996L4.4999 12.5996L4.4999 14.3996L9.8999 14.3996L9.8999 12.5996Z" fill="#217CF5" />
    </svg>
    );
}

export default TriggerIcon;
