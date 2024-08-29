import React, { useContext } from 'react';
import ThemeContext from '../../../hoc/ThemeContext';

function SearchArrowIcon(props) {
    const { className, onClick, style, title, isButtonColor, onBlur, id, role, ariaHidden, fillColor } = props;
    let { buttonColor } = useContext(ThemeContext);
    if (!isButtonColor) {
        buttonColor = null;
    }
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="20"
            fill="none"
            viewBox="0 0 22 20"
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
            stroke={fillColor || '#C8C8C8'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.501 10h-5.5m-.084.292l-2.335 6.975c-.184.548-.275.822-.21.99a.5.5 0 00.332.3c.174.05.438-.07.965-.306l16.711-7.52c.515-.232.772-.348.851-.509a.5.5 0 000-.443c-.08-.16-.337-.276-.85-.508L2.662 1.748c-.525-.236-.788-.354-.962-.306a.5.5 0 00-.332.3c-.066.168.025.441.206.988l2.342 7.056c.032.094.047.141.053.19a.5.5 0 010 .127c-.006.049-.022.095-.053.19z"
        />
        </svg>
    );
}

export default SearchArrowIcon;
