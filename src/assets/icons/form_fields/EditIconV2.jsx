import React, { useContext } from 'react';
import ThemeContext from '../../../hoc/ThemeContext';

function EditIconV2(props) {
    const { className, title, style, tabIndex, onClick, onKeyDown, isButtonColor, ariaLabel, role } = props;
    let { buttonColor } = useContext(ThemeContext);
    if (!isButtonColor) {
        buttonColor = null;
    }
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 96 960 960"
        className={className}
        onClick={onClick}
        aria-label={ariaLabel}
        tabIndex={tabIndex || '-1'}
        style={({ ...style }, { fill: buttonColor })}
        role={role}
        onKeyDown={onKeyDown}
        >
        <title>{title}</title>
        <path
        d="M202.152 856.239h52.174l342.609-342.848-52.174-52.173-342.609 342.847v52.174zM772.957 455.63L601.761 286.196l49.304-49.544q26.348-26.587 64.152-26.706 37.805-.12 64.392 26.228l47.63 47.63q24.913 24.435 25.196 58.25.282 33.816-23.674 57.772l-55.804 55.804zm-57.761 58.761L289.761 939.826H118.326V768.63l425.435-425.434 171.435 171.195zm-144.109-27.087l-26.326-26.086 52.174 52.173-25.848-26.087z"
        />
        </svg>
    );
}

export default EditIconV2;
