import React from 'react';

function ImportedIcon(props) {
    const { className } = props;
    return (
    <>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="13"
            viewBox="0 0 12 13"
            className={className}
        >
            <path
                fill="#959BA3"
                d="M10.852 4.565H7.464a.612.612 0 01-.612-.613V1.148h-4.44v4.986a.574.574 0 11-1.149 0V.612c0-.338.274-.612.613-.612H7.86c.142 0 .278.052.384.146l3.565 3.193a.574.574 0 01.191.428v7.889a.612.612 0 01-.612.612H6.892a.574.574 0 110-1.148h3.96V4.565zm-.679-1.149L8 1.47v1.946h2.173zm-4.49 5.762H.575a.574.574 0 010-1.148h5.122L3.64 5.975a.574.574 0 01.812-.812l3.002 3.002a.61.61 0 010 .866l-3.002 3.002a.574.574 0 01-.812-.812l2.043-2.043z"
            />
        </svg>
        {/* <Tooltip id="importedIcon" content={title} isCustomToolTip placement="top" /> */}
    </>
    );
}

export default ImportedIcon;
