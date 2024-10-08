import React from 'react';

function CleanIcon(props) {
    const {
        title,
        className,
        style,
    } = props;
    return (
        <svg
            width="18"
            height="18"
            className={className}
            style={style}
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>{title}</title>
            <g fill="#4B515E" fillRule="nonzero">
                <path d="m10.901 6.626-1.48-1.491-.61-.616c-.43.415-.891.773-1.37 1.08l3.33 3.357.754-1.702-.624-.628zM6.982 5.874C4.819 7.087 2.35 7.334.5 7.1c.138.67.359 1.35.657 2.029.073.016.22.022.313.027.316.014.614.027.735.261.128.249-.008.534-.14.81-.052.109-.137.289-.14.36a11.747 11.747 0 0 0 2.698 3.05c.144-.052.455-.234.67-.36.651-.381.924-.53 1.146-.383.303.201.103.597-.175 1.145a5.76 5.76 0 0 0-.239.511c.646.34 1.302.577 1.955.708l2.565-5.792-3.563-3.592zM14.714.5a.777.777 0 0 0-.555.232l-4.187 4.22 1.113 1.122 4.184-4.217a.801.801 0 0 0 0-1.125.777.777 0 0 0-.555-.232z" />
            </g>
        </svg>
    );
}

export default CleanIcon;
