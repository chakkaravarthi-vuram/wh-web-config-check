import React from 'react';

function SendBackIcon(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="11"
        viewBox="0 0 14 11"
        className={className}
    >
        <title>{title}</title>
        <path
            fill="#959BA3"
            d="M12.833 10.889V7.506c0-.7-.246-1.297-.739-1.79a2.437 2.437 0 00-1.788-.738h-8.09l2.995 2.994-.817.817L0 4.394 4.394 0l.817.817L2.217 3.81h8.089c1.01 0 1.88.36 2.605 1.08A3.546 3.546 0 0114 7.505v3.383h-1.167z"
        />
    </svg>
    );
}

export default SendBackIcon;
