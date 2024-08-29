import React from 'react';

function ImportSectionIcon(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="17"
        viewBox="0 0 13 17"
        className={className}
    >
        <title>{title}</title>
        <path
            fill="#217CF5"
            d="M0 2c0-.44.157-.817.47-1.13A1.54 1.54 0 011.6.4H4V2H1.6v12.8h9.6V2H8.8V.4h2.4c.44 0 .817.157 1.13.47.313.313.47.69.47 1.13v12.8c0 .44-.157.817-.47 1.13a1.54 1.54 0 01-1.13.47H1.6a1.54 1.54 0 01-1.13-.47A1.54 1.54 0 010 14.8V2zm2.8 6l1.16-1.12L5.6 8.54V.4h1.6v8.14l1.64-1.66L10 8l-3.6 3.6L2.8 8z"
        />
    </svg>
    );
}

export default ImportSectionIcon;
