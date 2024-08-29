import React from 'react';

function StepDeleteIcon(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="16"
        viewBox="0 0 14 16"
        className={className}
    >
        <title>{title}</title>
        <path
            fill="#6C727E"
            d="M2.62 15.759c-.465 0-.863-.165-1.192-.495a1.625 1.625 0 01-.495-1.192V2.226H0v-1.4h4.2V0h5.6v.826H14v1.4h-.933v11.846c0 .471-.164.87-.49 1.197-.327.327-.726.49-1.198.49H2.621zm9.047-13.533H2.333v11.846a.28.28 0 00.081.206.28.28 0 00.207.081h8.758c.072 0 .138-.03.198-.09s.09-.125.09-.197V2.226zm-7.09 10.266h1.4v-8.4h-1.4v8.4zm3.446 0h1.4v-8.4h-1.4v8.4zM2.375 2.226v12.133V2.226z"
        />
    </svg>
    );
}

export default StepDeleteIcon;
