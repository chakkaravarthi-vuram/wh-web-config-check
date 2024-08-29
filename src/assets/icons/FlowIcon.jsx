import React from 'react';

function FlowIcon(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="14"
        viewBox="0 0 16 14"
        className={className}
    >
        <title>{title}</title>
        <path d="M7 4H6v2H0V0h6v2h4V0h6v6h-6V4H9v6h1V8h6v6h-6v-2H7V4zm7 6h-2v2h2v-2zM4 2H2v2h2V2zm10 0h-2v2h2V2z" />
    </svg>
    );
}

export default FlowIcon;
