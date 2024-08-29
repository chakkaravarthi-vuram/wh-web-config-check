import React from 'react';
import PropTypes from 'prop-types';

function JoinParallelStepIcon(props) {
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
                <path fill="#6060E8" d="M6 16h4v-4H6z" />
                <path stroke="#6060E8" d="M8 13.743V3M2 3v5.982h12V3" />
                <path fill="#6060E8" stroke="#6060E8" d="M.5 3.5h3v-3h-3zm6 0h3v-3h-3zm6 0h3v-3h-3z" />
            </g>
        </svg>

    );
}
export default JoinParallelStepIcon;

JoinParallelStepIcon.defaultProps = {
    className: null,
    onClick: () => { },
    title: null,
};
JoinParallelStepIcon.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string,
};
