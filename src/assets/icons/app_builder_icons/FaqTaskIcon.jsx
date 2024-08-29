import React, { useContext } from 'react';
import ThemeContext from '../../../hoc/ThemeContext';

function FaqTaskIcon(props) {
    const { className, onClick, style, title, isButtonColor, onBlur, id, role, ariaHidden, fillColor } = props;
    let { buttonColor } = useContext(ThemeContext);
    if (!isButtonColor) {
        buttonColor = null;
    }
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="16"
        fill="none"
        viewBox="0 0 14 16"
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
            d="M9.666 2.667c.62 0 .93 0 1.184.068a2 2 0 011.415 1.415c.068.254.068.564.068 1.184v6.133c0 1.12 0 1.68-.218 2.108a2 2 0 01-.874.874c-.428.218-.988.218-2.108.218H4.866c-1.12 0-1.68 0-2.108-.218a2 2 0 01-.874-.874c-.218-.427-.218-.988-.218-2.108V5.334c0-.62 0-.93.068-1.184a2 2 0 011.414-1.415c.255-.068.565-.068 1.185-.068m.666 7.334l1.334 1.333 3-3M5.399 4.001h3.2c.374 0 .56 0 .703-.073a.667.667 0 00.291-.291c.073-.143.073-.33.073-.703v-.533c0-.374 0-.56-.073-.703a.667.667 0 00-.291-.291c-.143-.073-.33-.073-.703-.073H5.4c-.373 0-.56 0-.702.073a.667.667 0 00-.292.291c-.072.143-.072.33-.072.703v.533c0 .373 0 .56.072.703a.667.667 0 00.292.291c.142.073.329.073.702.073z"
        />
    </svg>
  );
}

export default FaqTaskIcon;
