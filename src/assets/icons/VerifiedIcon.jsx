import React from 'react';

function VerifiedIcon(props) {
   const {
       title,
       className,
       styles,
       ariaHidden,
   } = props;
   return (
        <svg
        width="15"
        height="15"
        className={className}
        style={styles}
        viewBox="0 0 15 15"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={ariaHidden}
        >
            <title>{title}</title>
            <g fill="#217cf5" fillRule="nonzero" stroke="#217cf5" strokeWidth=".5">
            <path d="M7.5 1A6.507 6.507 0 0 0 1 7.5C1 11.084 3.916 14 7.5 14S14 11.084 14 7.5 11.084 1 7.5 1zm0 .929A5.564 5.564 0 0 1 13.071 7.5 5.564 5.564 0 0 1 7.5 13.071 5.564 5.564 0 0 1 1.929 7.5 5.564 5.564 0 0 1 7.5 1.929z" />
            <path d="M10.17 5.102 6.8 8.895 4.826 6.724a.464.464 0 0 0-.688.624L6.46 9.9a.464.464 0 0 0 .69-.004l3.715-4.178a.464.464 0 0 0-.039-.656c-.177-.178-.475-.161-.656.04z" />
            </g>
        </svg>
   );
}

export default VerifiedIcon;
