import React from 'react';

function CreateTaskIcon(props) {
    const { className, iconFillClass, onClick, id } = props;
    const iconFill = iconFillClass || '#B8BFC7';

    return (
        <svg width="13" height="16" viewBox="0 0 13 16" xmlns="http://www.w3.org/2000/svg" id={id} className={className} onClick={onClick}>
            <path d="M12 .8h-1.6a.8.8 0 0 0-.8-.8H3.2a.8.8 0 0 0-.8.8H.8a.8.8 0 0 0-.8.8v13.6a.8.8 0 0 0 .8.8H12a.8.8 0 0 0 .8-.8V1.6a.8.8 0 0 0-.8-.8zm-.8 13.6H1.6v-12h.8a.8.8 0 0 0 .8.8h6.4a.8.8 0 0 0 .8-.8h.8v12zM4 4.8h4.8a.8.8 0 1 1 0 1.6H4a.8.8 0 1 1 0-1.6zM4 8h4.8a.8.8 0 1 1 0 1.6H4A.8.8 0 1 1 4 8zm0 3.2h4.8a.8.8 0 1 1 0 1.6H4a.8.8 0 1 1 0-1.6z" fill={iconFill} fillRule="nonzero" />
        </svg>
    );
}
export default CreateTaskIcon;
