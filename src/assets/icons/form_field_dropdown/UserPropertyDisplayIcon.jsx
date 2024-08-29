import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function UserPropertyDisplayIcon(props) {
  const { className, style, title, onClick } = props;
  return (
    <svg
        height="16px"
        width="17px"
        version="1.1"
        viewBox="0 0 17 16"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        onClick={onClick || null}
        style={style}
    >
        <title>{title}</title>
        <g id="Page-1" fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
            <g id="Create_Flow_Add_Formfield_dropdown" fill="#5B6375" transform="translate(-1173.000000, -973.000000)">
                <g id="user_Property_Ico" transform="translate(1173.000000, 973.000000)">
                    <path id="Combined-Shape" d="M3.11010323,8 C4.18848174,8.88888889 5.54515149,9.40740741 7.00618044,9.40740741 C7.20754684,9.40740741 7.40627007,9.39755776 7.60216797,9.37824633 C7.21625689,10.1700988 7,11.0597947 7,12 C7,13.5371282 7.57802245,14.939252 8.52856479,16.0008689 L1.05770541,16 C0.396763744,16 -0.0902459074,15.3703704 0.0141133036,14.7037037 L0.36197734,12.1111111 C0.570695762,10.2962963 1.64907428,8.77777778 3.11010323,8 Z M7,0 C9.15686275,0 10.8888889,1.78151261 10.8888889,4 C10.8888889,6.21848739 9.15686275,8 7,8 C4.84313725,8 3.11111111,6.21848739 3.11111111,4 C3.11111111,1.78151261 4.84313725,0 7,0 Z" />
                    <circle id="Oval" cx="13" cy="12" r="4" />
                </g>
            </g>
        </g>
    </svg>
  );
}
export default UserPropertyDisplayIcon;
UserPropertyDisplayIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: () => {},
};

UserPropertyDisplayIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
