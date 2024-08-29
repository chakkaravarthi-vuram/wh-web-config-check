import React from 'react';

function EditIconNew(props) {
    const { className, title, onClick, ariaLabel, role } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        className={className}
        onClick={onClick}
        aria-label={ariaLabel}
        role={role}
    >
        <title>{title}</title>
        <path
            fill="#FFF"
            d="M.982 11.018h.72l7.253-7.253-.72-.72-7.253 7.252v.72zM11.034 3.06L8.94.966l.687-.688A.934.934 0 0110.314 0c.273 0 .502.093.687.278l.72.72a.934.934 0 01.279.688.934.934 0 01-.278.688l-.688.687zm-.687.688L2.095 12H0V9.905l8.251-8.252 2.096 2.096zm-1.752-.344l-.36-.36.72.72-.36-.36z"
        />
    </svg>
    );
}
EditIconNew.defaultProps = {
    onClick: () => {},
};

export default EditIconNew;
