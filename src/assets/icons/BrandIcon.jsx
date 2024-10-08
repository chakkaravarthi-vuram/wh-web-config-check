import React from 'react';

function BrandIcon(props) {
    const { ariaHidden, title, role } = props;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="106"
            height="18"
            viewBox="0 0 106 18"
            aria-hidden={ariaHidden}
            role={role}
        >
            <title>{title}</title>
            <defs>
                <linearGradient id="b" x1="28.105%" x2="71.895%" y1="100%" y2="0%">
                    <stop offset="0%" stopColor="#72BE44" />
                    <stop offset="99.921%" stopColor="#00A0FD" />
                </linearGradient>
                <path
                    id="a"
                    d="M23.2 0l-3.852 12.501-2.268-7.177-1.818 5.436 2.453 7.06h3.258L27.054 0z"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <path
                    fill="#FFF"
                    d="M33.643 4.525c4.008 0 7.03 2.875 7.03 6.688v.049c0 3.78-3.11 6.738-7.079 6.738-3.943 0-7.03-2.938-7.03-6.689v-.049c0-3.778 3.11-6.737 7.079-6.737zm53.322.098c1.952 0 3.43.484 4.392 1.439.929.923 1.399 2.308 1.399 4.118v7.525h-3.39v-1.623l-.216.237c-.997 1.098-2.28 1.632-3.92 1.632-2.204 0-4.429-1.209-4.429-3.91v-.05c0-2.593 1.903-4.082 5.223-4.082a9.42 9.42 0 013.202.535l.164.056v-.394c0-1.632-1.054-2.532-2.97-2.532-1.4 0-2.39.247-3.586.677l-.866-2.626c1.401-.603 2.803-1.002 4.997-1.002zM70.676 0v6.875l.221-.283c.801-1.023 1.877-2.067 3.79-2.067 2.743 0 4.381 1.782 4.381 4.77v8.41h-3.515v-7.23c0-1.808-.853-2.803-2.4-2.803-1.575 0-2.477 1.021-2.477 2.803v7.23h-3.514V0h3.514zM50.673 4.52h.223v3.67h-.073c-2.682 0-4.16 1.694-4.16 4.77v4.746h-3.514V4.77h3.514v3.145l.24-.564c.832-1.974 2.114-2.882 3.993-2.83zM56.516 0v9.76l4.585-4.99h4.159l-4.916 5.051 5.153 7.884h-4.011l-3.43-5.328-.085-.133-1.455 1.527v3.934h-3.514V0h3.514zm42.43 0v17.705H95.43V0h3.514zm6.484 0v17.705h-3.514V0h3.514zM86.915 11.902c-1.73 0-2.723.708-2.723 1.942v.049c0 1.046.855 1.721 2.178 1.721 1.807 0 3.07-1 3.07-2.434v-.743l-.072-.033c-.707-.324-1.579-.502-2.453-.502zM33.594 7.5c-2.066 0-3.565 1.561-3.565 3.713v.049c0 2.11 1.588 3.762 3.614 3.762 2.066 0 3.565-1.56 3.565-3.713v-.049c0-2.11-1.587-3.762-3.614-3.762zM11.512 0L9.98 5.17l-.621 2.1-1.55 5.23L3.959 0H0l6.083 17.82H9.34l1.743-5.131.72-2.115 1.673-4.927L15.397 0z"
                />
                <use fill="url(#b)" xlinkHref="#a" />
            </g>
        </svg>
    );
}

export default BrandIcon;
