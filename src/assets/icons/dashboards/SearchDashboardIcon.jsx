import React, { useContext, useState } from 'react';
import ThemeContext from '../../../hoc/ThemeContext';

function SearchDashboardIcon(props) {
    const { className, onClick, role, ariaLabel, tabIndex, title } = props;
    const [isHovered, setIsHovered] = useState(false);
    const { colorScheme } = useContext(ThemeContext);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="none"
            viewBox="0 0 22 22"
            aria-label={ariaLabel}
            tabIndex={tabIndex}
            title={title}
            role={role}
            className={className}
            onClick={onClick || null}
            onMouseLeave={() => setIsHovered(false)}
            onMouseEnter={() => setIsHovered(true)}
        >
            <g>
                <path
                    fill={isHovered ? colorScheme?.activeColor : '#9E9E9E'}
                    fillRule="evenodd"
                    d="M9.5 4.451a5.833 5.833 0 105.036 9.577.851.851 0 01.138-.17A5.833 5.833 0 009.5 4.452zm6.888 9.872a7.5 7.5 0 10-1.054 1.291l3.356 2.74a.833.833 0 001.054-1.292l-3.356-2.739z"
                    clipRule="evenodd"
                />
            </g>
        </svg>
    );
}

export default SearchDashboardIcon;
