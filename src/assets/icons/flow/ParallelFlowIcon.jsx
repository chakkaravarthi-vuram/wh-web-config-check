import React from 'react';
import PropTypes from 'prop-types';

function ParallelFlowIcon(props) {
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
                <path fill="#D26BC2" d="M6 0h4v4H6z" />
                <path stroke="#D26BC2" d="M8 2.257V13M2 13V7.018h12V13" />
                <path stroke="#D26BC2" fill="#FFD9F9" d="M.5 12.5h3v3h-3zM6.5 12.5h3v3h-3zM12.5 12.5h3v3h-3z" />
            </g>
        </svg>

    );
}
export default ParallelFlowIcon;

ParallelFlowIcon.defaultProps = {
    className: null,
    onClick: () => { },
    title: null,
};
ParallelFlowIcon.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string,
};
