import React from 'react';

function AssignReviewIcon(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        className={className}
    >
        <title>{title}</title>
        <path
            fill="#959BA3"
            d="M5.688 8.4H11.2V7.35H6.737L5.687 8.4zM2.8 8.4h1.382l4.41-4.357a.356.356 0 00.105-.263.356.356 0 00-.104-.263l-.963-.875a.297.297 0 00-.219-.087.3.3 0 00-.218.087L2.8 7.105V8.4zM0 14V1.05C0 .782.105.54.315.324A.994.994 0 011.05 0h11.9c.268 0 .51.108.726.324.216.216.324.458.324.726v9.1c0 .268-.108.51-.324.726-.216.216-.458.324-.726.324H2.8L0 14zm1.05-2.537l1.312-1.313H12.95v-9.1H1.05v10.413zm0-10.413v10.413V1.05z"
        />
    </svg>
    );
}

export default AssignReviewIcon;
