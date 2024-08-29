import React from 'react';

function SettingsIconNew(props) {
    const { className, title, strokeWidth, stroke } = props;
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        stroke={stroke}
        stroke-width={strokeWidth}
        className={className}
    >
        <title>{title}</title>
        <path
            fill="#6C727E"
            d="M6.16 16l-.4-2.52a5.359 5.359 0 01-.8-.38 5.497 5.497 0 01-.74-.5l-2.36 1.08L0 10.4l2.16-1.58a2.378 2.378 0 01-.05-.41 9.546 9.546 0 010-.82c.007-.153.023-.29.05-.41L0 5.6l1.86-3.28L4.22 3.4c.213-.173.46-.34.74-.5.28-.16.547-.28.8-.36L6.16 0h3.68l.4 2.52c.253.093.523.217.81.37.287.153.53.323.73.51l2.36-1.08L16 5.6l-2.16 1.54c.027.133.043.277.05.43a9.935 9.935 0 010 .85 2.785 2.785 0 01-.05.42L16 10.4l-1.86 3.28-2.36-1.08a6.635 6.635 0 01-.73.51 3.46 3.46 0 01-.81.37L9.84 16H6.16zM8 10.6c.72 0 1.333-.253 1.84-.76.507-.507.76-1.12.76-1.84s-.253-1.333-.76-1.84A2.506 2.506 0 008 5.4c-.72 0-1.333.253-1.84.76A2.506 2.506 0 005.4 8c0 .72.253 1.333.76 1.84.507.507 1.12.76 1.84.76zm0-1.2a1.35 1.35 0 01-.99-.41A1.349 1.349 0 016.6 8c0-.387.137-.717.41-.99.273-.273.603-.41.99-.41s.717.137.99.41c.273.273.41.603.41.99s-.137.717-.41.99A1.35 1.35 0 018 9.4zm-.88 5.4h1.76l.28-2.24c.44-.107.857-.273 1.25-.5.393-.227.75-.5 1.07-.82l2.12.92.8-1.44-1.88-1.38c.053-.227.097-.45.13-.67.033-.22.05-.443.05-.67 0-.227-.013-.45-.04-.67a4.138 4.138 0 00-.14-.67l1.88-1.38-.8-1.44-2.12.92a4.458 4.458 0 00-1.04-.87 3.373 3.373 0 00-1.28-.45L8.88 1.2H7.12l-.28 2.24a4.238 4.238 0 00-1.27.48 4.411 4.411 0 00-1.05.84L2.4 3.84l-.8 1.44 1.88 1.38c-.053.227-.097.45-.13.67a4.466 4.466 0 000 1.34c.033.22.077.443.13.67L1.6 10.72l.8 1.44 2.12-.92c.32.32.677.593 1.07.82.393.227.81.393 1.25.5l.28 2.24z"
        />
    </svg>
    );
}

export default SettingsIconNew;
