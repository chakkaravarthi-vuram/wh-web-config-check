import React from 'react';

function EditIconPencil(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="16"
        fill="none"
        viewBox="0 0 15 16"
        className={className}
    >
        <title>{title}</title>
        <g>
            <path
                fill="#217CF5"
                fillRule="evenodd"
                d="M10.183 1.933a2.393 2.393 0 013.384 3.384L11.694 7.19l-.002.002-.002.002-6.377 6.377-.031.031c-.153.153-.288.289-.449.395a1.874 1.874 0 01-.454.218c-.183.06-.373.08-.588.104l-.044.005-2.115.235a.625.625 0 01-.69-.69l.234-2.116.005-.043c.024-.216.045-.406.104-.589.052-.16.126-.313.219-.454.105-.16.24-.296.394-.449l.031-.03 8.254-8.255zM8.75 5.134l-5.937 5.937c-.202.202-.239.243-.266.284a.626.626 0 00-.073.152c-.015.046-.024.101-.055.385L2.27 13.23l1.339-.149c.283-.031.338-.04.385-.055a.627.627 0 00.151-.073c.041-.027.083-.064.284-.266l5.937-5.937L8.75 5.134zm2.5.732L9.634 4.25l1.433-1.433a1.143 1.143 0 111.616 1.616L11.25 5.866z"
                clipRule="evenodd"
            />
        </g>
    </svg>
    );
}

export default EditIconPencil;
