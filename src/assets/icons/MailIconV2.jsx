import React from 'react';
import PropType from 'prop-types';

function MailIconV2(props) {
    const { className, onClick } = props;
    return (
        <svg
            width="16"
            height="13"
            viewBox="0 0 16 13"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            onClick={onClick}
        >
            <path
                d="M15.2 0H.8C.32 0 0 .32 0 .8V12c0 .48.32.8.8.8h14.4c.48 0 .8-.32.8-.8V.8c0-.48-.32-.8-.8-.8zm-2.32 1.6L8 5.36 3.12 1.6h9.76zm1.52 9.6H1.6V2.4l5.92 4.56c.4.32.8.08.96 0L14.4 2.4v8.8z"
                fill="#959BA3"
                fillRule="nonzero"
            />
        </svg>
        );
}
export default MailIconV2;

MailIconV2.propTypes = {
    className: PropType.string,
    onClick: PropType.func,
};

MailIconV2.defaultProps = {
    className: null,
    onClick: null,
};
