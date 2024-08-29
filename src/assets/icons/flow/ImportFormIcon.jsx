import React from 'react';

function ImportFormIcon(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="19"
        viewBox="0 0 15 19"
        className={className}
    >
        <title>{title}</title>
        <path
            fill="#217CF5"
            d="M1.406 18.75a1.35 1.35 0 01-.984-.422A1.35 1.35 0 010 17.344V1.406C0 1.031.14.703.422.422A1.35 1.35 0 011.406 0h8.461L15 5.133v12.21c0 .376-.14.704-.422.985a1.35 1.35 0 01-.984.422H1.406zm3.75-6.858l.605-.604 1.448 1.448V6.562h.844v6.174l1.449-1.449.604.605-2.475 2.475-2.475-2.475zm4.008-6.126v-4.36H1.406v15.938h12.188V5.766h-4.43zm-7.758-4.36v4.36-4.36 15.938V1.406z"
        />
    </svg>
    );
}

export default ImportFormIcon;
