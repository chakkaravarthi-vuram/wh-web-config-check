import React from 'react';
import PropType from 'prop-types';

function RefreshIconV2(props) {
    const { className, onClick } = props;
    return (
        <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        onClick={onClick}
        >
        <path
          d="M15.649 8c.19 0 .343.154.343.343v.008a8 8 0 0 1-13.288 5.645l-.26-.211-.27-.22-.138-.113-.01 2.22A.328.328 0 0 1 1.72 16H.34A.336.336 0 0 1 0 15.667v-5.323c0-.088.033-.169.089-.229l.007-.007a.333.333 0 0 1 .16-.096L.251 10h5.415c.186 0 .332.152.333.34v1.35c0 .187-.14.337-.327.337l-2.113.009a6 6 0 0 0 10.43-3.698.348.348 0 0 1 .348-.338h1.311zm.012-8c.186 0 .338.147.339.333v5.323a.335.335 0 0 1-.09.229l-.006.007a.333.333 0 0 1-.16.096l.003.012h-5.414A.336.336 0 0 1 10 5.661V4.31c-.001-.187.14-.337.327-.337l2.113-.009A6 6 0 0 0 2.01 7.67a.34.34 0 0 1-.341.33H.332a.326.326 0 0 1-.325-.325v-.007a8 8 0 0 1 13.289-5.663l.26.211.407.333.01-2.22c0-.177.134-.314.307-.328h1.38z"
          fill="#959BA3"
          fillRule="nonzero"
        />
        </svg>
    );
}
export default RefreshIconV2;

RefreshIconV2.propTypes = {
    className: PropType.string,
    onClick: PropType.func,
};

RefreshIconV2.defaultProps = {
    className: null,
    onClick: null,
};
