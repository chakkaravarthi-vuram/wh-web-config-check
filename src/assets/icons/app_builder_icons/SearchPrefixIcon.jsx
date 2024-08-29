import React, { useContext } from 'react';
import ThemeContext from '../../../hoc/ThemeContext';

function SearchPrefixIcon(props) {
    const { className, onClick, style, title, isButtonColor, onBlur, id, role, ariaHidden, fillColor } = props;
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
            stroke={fillColor || '#A6CBFB'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M6.5 13l.784 1.569c.266.53.399.796.576 1.026a3 3 0 00.545.545c.23.177.495.31 1.026.575L11 17.5l-1.569.785c-.53.265-.796.398-1.026.575a3 3 0 00-.545.545c-.177.23-.31.495-.576 1.026L6.5 22l-.784-1.569c-.266-.53-.399-.796-.576-1.026a3 3 0 00-.545-.545c-.23-.177-.495-.31-1.026-.575L2 17.5l1.569-.785c.53-.265.796-.398 1.026-.575a3 3 0 00.545-.545c.177-.23.31-.495.576-1.026L6.5 13zM15 2l1.179 3.064c.282.734.423 1.1.642 1.409a3 3 0 00.706.706c.309.22.675.36 1.409.642L22 9l-3.064 1.179c-.734.282-1.1.423-1.409.642a3 3 0 00-.706.706c-.22.309-.36.675-.642 1.409L15 16l-1.179-3.064c-.282-.734-.423-1.1-.642-1.409a3 3 0 00-.706-.706c-.309-.22-.675-.36-1.409-.642L8 9l3.064-1.179c.734-.282 1.1-.423 1.409-.642a3 3 0 00.706-.706c.22-.309.36-.675.642-1.409L15 2z"
        />
    </svg>
  );
}

export default SearchPrefixIcon;
