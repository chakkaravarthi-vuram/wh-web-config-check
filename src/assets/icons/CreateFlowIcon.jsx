import React from 'react';

function CreateFlowIcon(props) {
    const { className } = props;

    return (
        <svg width="13" height="16" viewBox="0 0 13 16" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M12 .8h-1.6a.8.8 0 0 0-.8-.8H3.2a.8.8 0 0 0-.8.8H.8a.8.8 0 0 0-.8.8v13.6a.8.8 0 0 0 .8.8H12a.8.8 0 0 0 .8-.8V1.6a.8.8 0 0 0-.8-.8zm-.8 13.6H1.6v-12h.8a.8.8 0 0 0 .8.8h6.4a.8.8 0 0 0 .8-.8h.8v12zM6.4 4.8c.887 0 1.6.713 1.6 1.6C8 7.287 7.287 8 6.4 8c-.887 0-1.6-.713-1.6-1.6 0-.887.713-1.6 1.6-1.6zm2.69 8H3.684c-.303 0-.525-.378-.478-.778l.16-1.555c.095-1.09.588-2 1.256-2.467.493.533 1.113.844 1.78.844.669 0 1.273-.31 1.782-.844.668.467 1.145 1.378 1.256 2.467l.16 1.555c.015.4-.208.778-.51.778z" fill="#B8BFC7" fillRule="nonzero" />
        </svg>
    );
}
export default CreateFlowIcon;
