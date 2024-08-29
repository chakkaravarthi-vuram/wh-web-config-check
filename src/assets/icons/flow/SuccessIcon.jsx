import React from 'react';
import PropTypes from 'prop-types';

function SuccessIcon(props) {
    const { className, onClick, title } = props;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className={className}
            onClick={onClick}
        >
            <title>{title}</title>
            <g fill="none" fillRule="evenodd">
                <circle fill="#FFFFFF" cx="8" cy="8" r="8" />
                <path fill="#4BB383" fillRule="nonzero" d="M6.5 10.98 4 8.48l.736-.736L6.5 9.508l4.366-4.365.735.735z" />
            </g>
        </svg>

    );
}
export default SuccessIcon;

SuccessIcon.defaultProps = {
    className: null,
    onClick: () => {},
    title: null,
};
SuccessIcon.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string,
};
