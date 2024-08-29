import React from 'react';
import PropTypes from 'prop-types';

function SnoozedTaskUntilIcon(props) {
    const { className, title, id, ariaHidden } =
        props;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className={className}
            aria-hidden={ariaHidden}
            id={id}
            fill="none"
        >
            <title>{title}</title>
            <g id="clock-snooze" clip-path="url(#clip0_6129_13262)">
                <path id="Icon" fill="none" d="M11.0002 11.333H14.3335L11.0002 14.6663H14.3335M14.6339 8.66634C14.6557 8.44707 14.6668 8.22467 14.6668 7.99967C14.6668 4.31778 11.6821 1.33301 8.00016 1.33301C4.31826 1.33301 1.3335 4.31778 1.3335 7.99967C1.3335 11.6816 4.31826 14.6663 8.00016 14.6663C8.11194 14.6663 8.22307 14.6636 8.3335 14.6582C8.44535 14.6526 8.55649 14.6444 8.66683 14.6334M8.00016 3.99967V7.99967L10.4924 9.2458" stroke="#F79009" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
                <clipPath id="clip0_6129_13262">
                    <rect width="16" height="16" />
                </clipPath>
            </defs>
        </svg>
    );
}

export default SnoozedTaskUntilIcon;

SnoozedTaskUntilIcon.defaultProps = {
    className: null,
    title: null,
};
SnoozedTaskUntilIcon.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
};
