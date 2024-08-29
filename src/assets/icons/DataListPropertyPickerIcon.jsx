import React from 'react';
import PropTypes from 'prop-types';

function DataListPropertyPicker(props) {
   const {
       title,
       ariaHidden,
       className,
       style,
       onClick,
   } = props;
    return (
        <svg
            width="14px"
            height="16px"
            viewBox="0 0 14 16"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={style}
            onClick={onClick}
        >
            <title>{title}</title>
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" aria-hidden={ariaHidden}>
            <g
                id="Create_Flow_Add_Formfield_dropdown"
                transform="translate(-1098.000000, -972.000000)"
                fill="#5B6375"
            >
                <path
                d="M1102.66667,972 L1102.66667,973.777778 L1107.33333,973.777778 L1107.33333,972 L1111,972 C1111.55228,972 1112,972.447715 1112,973 L1112.00087,979.528565 C1111.22301,978.83209 1110.26234,978.33561 1109.1997,978.119962 L1109.2,976.444444 L1100.8,976.444444 L1100.8,978.222222 L1106.37889,978.221562 C1105.26329,978.53389 1104.27902,979.160603 1103.52767,980.000132 L1100.8,980 L1100.8,981.777778 L1102.42535,981.77683 C1102.2032,982.333399 1102.06198,982.931036 1102.01624,983.555196 L1100.8,983.555556 L1100.8,985.333333 L1102.14872,985.333519 C1102.37782,986.342996 1102.86145,987.255794 1103.52856,988.000869 L1099,988 C1098.44772,988 1098,987.552285 1098,987 L1098,973 C1098,972.447715 1098.44772,972 1099,972 L1102.66667,972 Z M1108,980 C1110.20914,980 1112,981.790861 1112,984 C1112,986.209139 1110.20914,988 1108,988 C1105.79086,988 1104,986.209139 1104,984 C1104,981.790861 1105.79086,980 1108,980 Z"
                id="Datalist_propery_picker_ico"
                />
            </g>
            </g>
        </svg>
    );
}

export default DataListPropertyPicker;

DataListPropertyPicker.defaultProps = {
    title: null,
    ariaHidden: false,
    className: null,
    onClick: null,
};

DataListPropertyPicker.propTypes = {
    title: PropTypes.string,
    ariaHidden: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
};
