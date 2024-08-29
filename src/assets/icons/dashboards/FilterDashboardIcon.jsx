import React, { useContext, useState } from 'react';
import ThemeContext from '../../../hoc/ThemeContext';

function FilterDashboardIcon(props) {
    const { className, onClick, role, ariaLabel, tabIndex, title, isAppFilter } = props;
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
                    fill={isAppFilter && isHovered ? colorScheme?.activeColor : '#9E9E9E'}
                    fillRule="evenodd"
                    d="M3.778 1.667h12.444c.44 0 .826 0 1.13.027.29.026.689.087 1.012.354.401.331.625.831.604 1.351-.017.419-.237.757-.411.991-.182.244-.44.532-.733.86l-4.78 5.342a5.31 5.31 0 00-.124.141l-.002.003v.002a5.018 5.018 0 00-.002.188v4.488c.002.114.005.352-.078.574a1.25 1.25 0 01-.33.488c-.176.16-.398.246-.505.287l-.03.011-2.856 1.143a5.014 5.014 0 01-.408.15 1.273 1.273 0 01-.63.041 1.25 1.25 0 01-.788-.533 1.274 1.274 0 01-.196-.6 5.056 5.056 0 01-.012-.435v-5.614c0-.101 0-.151-.002-.188v-.002l-.001-.003a5.192 5.192 0 00-.124-.14L2.2 5.277l-.026-.028a13.807 13.807 0 01-.732-.86c-.175-.234-.395-.572-.411-.99-.021-.52.202-1.02.604-1.352.323-.267.722-.328 1.012-.354.303-.028.69-.028 1.13-.027zM2.753 3.358l.026.037c.132.176.337.407.664.772L8.198 9.48l.026.03c.098.108.221.246.313.409.08.142.138.294.173.453.04.183.04.367.04.514v5.382l2.5-1v-4.343-.04c0-.146-.001-.33.04-.513.035-.159.093-.311.173-.453.091-.163.215-.3.313-.41l.026-.029 4.755-5.314a13.216 13.216 0 00.69-.809 13.21 13.21 0 00-1.062-.025H3.814a13.21 13.21 0 00-1.062.025z"
                    clipRule="evenodd"
                />
            </g>
        </svg>
    );
}

export default FilterDashboardIcon;
