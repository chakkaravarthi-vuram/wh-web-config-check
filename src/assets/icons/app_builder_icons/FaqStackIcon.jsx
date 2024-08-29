import React, { useContext } from 'react';
import ThemeContext from '../../../hoc/ThemeContext';

function FaqStackIcon(props) {
    const { className, onClick, style, title, isButtonColor, onBlur, id, role, ariaHidden, fillColor } = props;
    let { buttonColor } = useContext(ThemeContext);
    if (!isButtonColor) {
        buttonColor = null;
    }
  return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
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
            stroke={fillColor || '#9E9E9E'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M4.667 6.334L1.334 8l6.428 3.214a.722.722 0 00.177.075.33.33 0 00.123 0 .722.722 0 00.177-.075L14.667 8l-3.333-1.666M4.667 9.667l-3.333 1.667 6.428 3.214c.088.043.131.065.177.074.04.008.082.008.123 0 .046-.009.09-.03.177-.074l6.428-3.214-3.333-1.667m-10-5l6.428-3.214a.725.725 0 01.177-.074.333.333 0 01.123 0c.046.008.09.03.177.074l6.428 3.214L8.24 7.881a.725.725 0 01-.177.074.333.333 0 01-.123 0 .725.725 0 01-.177-.074L1.334 4.667z"
        />
        </svg>
  );
}

export default FaqStackIcon;
