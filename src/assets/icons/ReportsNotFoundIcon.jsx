import React, { useContext } from 'react';
import ThemeContext from '../../hoc/ThemeContext';

function ReportNotFoundIcon(props) {
    const { className, onClick, style, title, isButtonColor } = props;
    let { buttonColor } = useContext(ThemeContext);
    if (!isButtonColor) {
        buttonColor = null;
      }
    return (
         <svg
         xmlns="http://www.w3.org/2000/svg"
         width="48"
         height="56"
         fill="none"
         viewBox="0 0 48 56"
         className={className}
         onClick={onClick}
         style={{ ...style, fill: buttonColor }}
         >
         <title>{title}</title>
         <path
           fill="#959BA3"
           d="M47.086 47.768l-3.727-3.726V13.658a3.11 3.11 0 00-.97-2.25L31.249.847A3.104 3.104 0 0029.114 0H3.097A3.108 3.108 0 000 3.097v48.841a3.097 3.097 0 003.097 3.097h37.165a3.088 3.088 0 002.809-1.806 3.135 3.135 0 003.592-.6l.423-.422a3.153 3.153 0 000-4.439zm-7.34-36.03h-7.743c-.57 0-1.032-.462-1.032-1.032V3.427l8.775 8.311zm.516 41.233H3.097c-.57 0-1.032-.462-1.032-1.032V3.098c0-.57.462-1.032 1.032-1.032h25.81v8.64a3.098 3.098 0 003.096 3.098h9.292v28.184l-3.531-3.53a1.335 1.335 0 00-1.88 0l-.73.73-3.261-3.263a13.532 13.532 0 10-1.46 1.46l3.262 3.261-.784.784a1.342 1.342 0 000 1.889l8.383 8.384v.238a1.033 1.033 0 01-1.032 1.032v-.002zM21.68 38.58a11.356 11.356 0 1111.356-11.356A11.363 11.363 0 0121.68 38.58zM45.63 50.75l-.422.423a1.084 1.084 0 01-1.518 0l-8.806-8.806 1.94-1.94 8.807 8.805a1.084 1.084 0 010 1.518z"
         />
         <path
           fill="#217CF5"
           d="M25.123 32.803l-3.161-3.16-3.197 3.197-2.18-2.18 3.197-3.197-3.197-3.197 2.18-2.18 3.197 3.197 3.16-3.16 2.18 2.18-3.16 3.16 3.16 3.16-2.18 2.18z"
         />
         </svg>
    );
}

export default ReportNotFoundIcon;
