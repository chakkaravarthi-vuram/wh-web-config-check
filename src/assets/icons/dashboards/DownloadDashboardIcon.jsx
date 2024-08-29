import React, { useContext, useState } from 'react';
import ThemeContext from '../../../hoc/ThemeContext';

function DownloadDashboardIcon(props) {
    const { className, onClick, role, ariaLabel, tabIndex, title } = props;
    const [isHovered, setIsHovered] = useState(false);
    const { colorScheme } = useContext(ThemeContext);
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 20 20"
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
                    d="M10 1.667c.46 0 .833.373.833.833v7.988l2.744-2.744a.833.833 0 111.179 1.178l-4.167 4.167a.833.833 0 01-1.178 0L5.244 8.922a.833.833 0 111.179-1.178l2.744 2.744V2.5c0-.46.373-.833.833-.833zm-7.5 10c.46 0 .833.373.833.833v1c0 .714 0 1.199.032 1.574.03.365.084.552.15.683.16.313.415.568.728.728.13.066.317.12.683.15.375.03.86.031 1.574.031h7c.714 0 1.199 0 1.574-.03.365-.03.552-.085.683-.151.313-.16.568-.415.728-.728.066-.13.12-.318.15-.683.031-.375.032-.86.032-1.574v-1a.833.833 0 011.666 0v1.034c0 .671 0 1.225-.036 1.676-.039.468-.12.899-.327 1.303a3.334 3.334 0 01-1.457 1.457c-.404.206-.835.288-1.303.326-.451.037-1.005.037-1.676.037H6.466c-.671 0-1.225 0-1.676-.037-.468-.038-.899-.12-1.303-.326a3.334 3.334 0 01-1.457-1.457c-.206-.404-.288-.835-.327-1.303-.036-.451-.036-1.005-.036-1.676V12.5c0-.46.373-.834.833-.834z"
                    clipRule="evenodd"
                />
            </g>
        </svg>
    );
}

export default DownloadDashboardIcon;
