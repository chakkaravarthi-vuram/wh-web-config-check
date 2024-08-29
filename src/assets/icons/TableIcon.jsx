import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ThemeContext from '../../hoc/ThemeContext';
import { COLOR_CONSTANTS } from '../../utils/UIConstants';

function TableIcon(props) {
    const { className, onClick, style, title, isButtonColor, role, ariaLabel } = props;
    let { buttonColor } = useContext(ThemeContext);
    if (!isButtonColor) {
        buttonColor = null;
    }
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            onClick={onClick}
            role={role}
            aria-label={ariaLabel}
            style={{ ...style, fill: buttonColor, stroke: isButtonColor ? COLOR_CONSTANTS.WHITE : null }}
        >
            <title>{title}</title>
            <g
                strokeWidth="1.5"
                fill="none"
                fillRule="evenodd"
            >
                <path d="M.75.75h10.5v10.5H.75z" />
                <path d="M.75.75h10.5v3.5H.75zM.75 4.75h3.5v6.5H.75zM4.75 4.75h3.5v6.5h-3.5z" />
            </g>
        </svg>
    );
}

export default TableIcon;

TableIcon.defaultProps = {
    className: null,
    onClick: null,
    style: null,
    title: null,
    isButtonColor: false,
};

TableIcon.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.any),
    title: PropTypes.string,
    isButtonColor: PropTypes.bool,
};
