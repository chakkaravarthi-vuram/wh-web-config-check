import React from 'react';

function CreateFormIcon(props) {
    const { className, title } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="19"
        viewBox="0 0 15 19"
        className={className}
    >
        <title>{title}</title>
        <path
            fill="#217CF5"
            d="M6.75 15.25h1.5v-3h3v-1.5h-3v-3h-1.5v3h-3v1.5h3v3zM1.8 19c-.5 0-.925-.175-1.275-.525A1.736 1.736 0 010 17.2V1.8C0 1.3.175.875.525.525.875.175 1.3 0 1.8 0h7.95L15 5.25V17.2c0 .5-.175.925-.525 1.275-.35.35-.775.525-1.275.525H1.8zM9 6V1.5H1.8c-.067 0-.133.033-.2.1s-.1.133-.1.2v15.4c0 .067.033.133.1.2s.133.1.2.1h11.4c.067 0 .133-.033.2-.1s.1-.133.1-.2V6H9zM1.5 1.5V6 1.5v16-16z"
        />
    </svg>
    );
}

export default CreateFormIcon;
