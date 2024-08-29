import React from 'react';
import { keydownOrKeypessEnterHandle } from '../../utils/UtilityFunctions';

function FileHeartIcon(props) {
  const {
    id,
    className,
    onClick,
    ariaLabel,
    ariaHidden,
    role,
    tabIndex,
    onKeyDown,
  } = props;
  return (
    <svg
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 25"
      role={role}
      className={className}
      tabIndex={tabIndex}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onKeyDown(e)}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      <path d="M7.5 22H7C3 22 2 21 2 17V7C2 3 3 2 7 2H8.5C10 2 10.33 2.44001 10.9 3.20001L12.4 5.20001C12.78 5.70001 13 6 14 6H17C21 6 22 7 22 11V11.5" stroke="white" stroke-width="1.4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M2 6H14" stroke="white" stroke-width="1.4" />
      <path d="M15.0881 22.4924L15.4047 23.2044C15.4988 23.4163 15.6524 23.5964 15.8468 23.7228C16.0412 23.8491 16.2681 23.9164 16.5 23.9163C16.7319 23.9164 16.9588 23.8491 17.1533 23.7228C17.3477 23.5964 17.5013 23.4163 17.5954 23.2044L17.912 22.4924C18.0247 22.2397 18.2142 22.0291 18.4536 21.8905C18.6946 21.7515 18.9733 21.6923 19.2499 21.7214L20.0245 21.8038C20.255 21.8282 20.4877 21.7852 20.6943 21.68C20.901 21.5748 21.0726 21.4118 21.1885 21.211C21.3045 21.0103 21.3597 20.7802 21.3476 20.5487C21.3354 20.3172 21.2563 20.0942 21.1198 19.9068L20.6612 19.2767C20.4979 19.0506 20.4107 18.7785 20.4121 18.4997C20.412 18.2216 20.5001 17.9506 20.6636 17.7257L21.1223 17.0956C21.2587 16.9081 21.3378 16.6851 21.35 16.4536C21.3621 16.2221 21.3069 15.9921 21.1909 15.7913C21.075 15.5905 20.9034 15.4276 20.6968 15.3224C20.4901 15.2172 20.2575 15.1741 20.0269 15.1985L19.2523 15.281C18.9757 15.31 18.697 15.2508 18.456 15.1119C18.2162 14.9725 18.0265 14.7607 17.9144 14.507L17.5954 13.795C17.5013 13.5831 17.3477 13.403 17.1533 13.2766C16.9588 13.1502 16.7319 13.083 16.5 13.083C16.2681 13.083 16.0412 13.1502 15.8468 13.2766C15.6524 13.403 15.4988 13.5831 15.4047 13.795L15.0881 14.507C14.9759 14.7607 14.7863 14.9725 14.5464 15.1119C14.3055 15.2508 14.0268 15.31 13.7502 15.281L12.9732 15.1985C12.7426 15.1741 12.5099 15.2172 12.3033 15.3224C12.0967 15.4276 11.9251 15.5905 11.8092 15.7913C11.6932 15.9921 11.6379 16.2221 11.6501 16.4536C11.6623 16.6851 11.7414 16.9081 11.8778 17.0956L12.3364 17.7257C12.5 17.9506 12.588 18.2216 12.588 18.4997C12.588 18.7778 12.5 19.0487 12.3364 19.2737L11.8778 19.9038C11.7414 20.0912 11.6623 20.3142 11.6501 20.5457C11.6379 20.7772 11.6932 21.0073 11.8092 21.208C11.9252 21.4087 12.0968 21.5716 12.3034 21.6768C12.51 21.782 12.7426 21.8251 12.9732 21.8008L13.7478 21.7184C14.0244 21.6893 14.3031 21.7485 14.544 21.8875C14.7848 22.0265 14.9753 22.2383 15.0881 22.4924Z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M16.4991 20.1247C17.3965 20.1247 18.1241 19.3971 18.1241 18.4997C18.1241 17.6022 17.3965 16.8747 16.4991 16.8747C15.6016 16.8747 14.8741 17.6022 14.8741 18.4997C14.8741 19.3971 15.6016 20.1247 16.4991 20.1247Z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

export default FileHeartIcon;
