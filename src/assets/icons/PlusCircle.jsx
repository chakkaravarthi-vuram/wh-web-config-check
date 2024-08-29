import * as React from 'react';

function PlusCircle(props) {
const { buttonColor } = props;
const color = buttonColor ?? '#217CF5';
return (
<svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
>
    <g clipPath="url(#a)">
    <path
        fill={color}
        fillRule="evenodd"
        d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2ZM.667 8a7.333 7.333 0 1 1 14.667 0A7.333 7.333 0 0 1 .667 8ZM8 4.667c.369 0 .667.298.667.666v2h2a.667.667 0 1 1 0 1.334h-2v2a.667.667 0 1 1-1.333 0v-2h-2a.667.667 0 0 1 0-1.334h2v-2c0-.368.298-.666.666-.666Z"
        clipRule="evenodd"
    />
    </g>
    <defs>
    <clipPath id="a">
        <path fill="#fff" d="M0 0h16v16H0z" />
    </clipPath>
    </defs>
</svg>);
}
export default PlusCircle;
