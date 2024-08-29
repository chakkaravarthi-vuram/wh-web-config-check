import React, { useContext } from 'react';
import ThemeContext from '../../../hoc/ThemeContext';

function DashboardCompIcon(props) {
    const { className, onClick, style, title, isButtonColor, onBlur, id, role, ariaHidden } = props;
    let { buttonColor } = useContext(ThemeContext);
    if (!isButtonColor) {
        buttonColor = null;
    }
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            className={className}
            onClick={onClick}
            onBlur={onBlur}
            style={({ ...style }, { fill: buttonColor })}
            id={id}
            role={role}
            aria-hidden={ariaHidden}
        >
            <title>{title}</title>
            <path
                fill="#9E9E9E"
                fillRule="evenodd"
                d="M12 3a9 9 0 100 18 9 9 0 000-18zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm11-6a6 6 0 00-6 6 1 1 0 11-2 0 8 8 0 018-8 1 1 0 110 2zm5.207.793a1 1 0 010 1.414l-3.275 3.275A2.002 2.002 0 0112 14a2 2 0 11.518-3.932l3.275-3.275a1 1 0 011.414 0z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export default DashboardCompIcon;
