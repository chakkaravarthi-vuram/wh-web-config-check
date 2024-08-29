import React from 'react';

function AlertIcon(props) {
    const { className, title } = props;
    return (
    <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <title>{title}</title>
        <path
            d="M7.00023 13.6833C6.82245 13.6833 6.65301 13.65 6.4919 13.5833C6.33078 13.5167 6.18356 13.4222 6.05023 13.3L0.700228 7.95002C0.578006 7.81668 0.483561 7.66946 0.416895 7.50835C0.350228 7.34724 0.316895 7.17779 0.316895 7.00001C0.316895 6.82224 0.350228 6.65001 0.416895 6.48335C0.483561 6.31668 0.578006 6.17224 0.700228 6.05001L6.05023 0.700014C6.18356 0.566681 6.33078 0.469459 6.4919 0.408348C6.65301 0.347236 6.82245 0.316681 7.00023 0.316681C7.17801 0.316681 7.35023 0.347236 7.5169 0.408348C7.68356 0.469459 7.82801 0.566681 7.95023 0.700014L13.3002 6.05001C13.4336 6.17224 13.5308 6.31668 13.5919 6.48335C13.653 6.65001 13.6836 6.82224 13.6836 7.00001C13.6836 7.17779 13.653 7.34724 13.5919 7.50835C13.5308 7.66946 13.4336 7.81668 13.3002 7.95002L7.95023 13.3C7.82801 13.4222 7.68356 13.5167 7.5169 13.5833C7.35023 13.65 7.17801 13.6833 7.00023 13.6833ZM7.00023 12.35L12.3502 7.00001L7.00023 1.65001L1.65023 7.00001L7.00023 12.35ZM6.33356 7.66668H7.66689V3.66668H6.33356V7.66668ZM7.00023 9.66668C7.18912 9.66668 7.34745 9.60279 7.47523 9.47502C7.60301 9.34724 7.66689 9.1889 7.66689 9.00002C7.66689 8.81113 7.60301 8.65279 7.47523 8.52501C7.34745 8.39724 7.18912 8.33335 7.00023 8.33335C6.81134 8.33335 6.65301 8.39724 6.52523 8.52501C6.39745 8.65279 6.33356 8.81113 6.33356 9.00002C6.33356 9.1889 6.39745 9.34724 6.52523 9.47502C6.65301 9.60279 6.81134 9.66668 7.00023 9.66668Z"
            fill="#CD3636"
        />
    </svg>
    );
}

export default AlertIcon;
