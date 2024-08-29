import React from 'react';
import { keydownOrKeypessEnterHandle } from '../../utils/UtilityFunctions';

function FormSettingsIcon(props) {
  const {
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
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      role={role}
      className={className}
      tabIndex={tabIndex}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onKeyDown(e)}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      <path
        d="M7.82888 16.1426L8.31591 17.238C8.4607 17.564 8.69698 17.8411 8.9961 18.0355C9.29522 18.23 9.64434 18.3334 10.0011 18.3334C10.3579 18.3334 10.707 18.23 11.0061 18.0355C11.3052 17.8411 11.5415 17.564 11.6863 17.238L12.1733 16.1426C12.3467 15.7539 12.6383 15.4299 13.0067 15.2167C13.3773 15.0029 13.8061 14.9118 14.2317 14.9565L15.4233 15.0834C15.778 15.1209 16.136 15.0547 16.4539 14.8928C16.7717 14.7309 17.0358 14.4803 17.2141 14.1713C17.3925 13.8625 17.4776 13.5086 17.4588 13.1524C17.4401 12.7963 17.3184 12.4532 17.1085 12.1648L16.4029 11.1954C16.1517 10.8476 16.0175 10.429 16.0196 10C16.0195 9.57218 16.155 9.15531 16.4067 8.80928L17.1122 7.83984C17.3221 7.55148 17.4438 7.20841 17.4625 6.85225C17.4813 6.49608 17.3962 6.14214 17.2178 5.83335C17.0395 5.52438 16.7754 5.27376 16.4576 5.11188C16.1397 4.94999 15.7817 4.8838 15.427 4.92132L14.2354 5.04817C13.8098 5.09286 13.381 5.00179 13.0104 4.78798C12.6413 4.57356 12.3496 4.24782 12.177 3.85743L11.6863 2.76206C11.5415 2.436 11.3052 2.15895 11.0061 1.96452C10.707 1.77009 10.3579 1.66663 10.0011 1.66669C9.64434 1.66663 9.29522 1.77009 8.9961 1.96452C8.69698 2.15895 8.4607 2.436 8.31591 2.76206L7.82888 3.85743C7.65632 4.24782 7.3646 4.57356 6.99554 4.78798C6.62489 5.00179 6.1961 5.09286 5.77054 5.04817L4.57517 4.92132C4.22045 4.8838 3.86246 4.94999 3.5446 5.11188C3.22675 5.27376 2.96269 5.52438 2.78443 5.83335C2.60595 6.14214 2.52092 6.49608 2.53965 6.85225C2.55839 7.20841 2.68009 7.55148 2.88999 7.83984L3.59554 8.80928C3.84716 9.15531 3.98266 9.57218 3.98258 10C3.98266 10.4279 3.84716 10.8447 3.59554 11.1908L2.88999 12.1602C2.68009 12.4486 2.55839 12.7916 2.53965 13.1478C2.52092 13.504 2.60595 13.8579 2.78443 14.1667C2.96286 14.4755 3.22696 14.726 3.54476 14.8878C3.86257 15.0497 4.22047 15.116 4.57517 15.0787L5.76684 14.9519C6.1924 14.9072 6.62119 14.9983 6.99184 15.2121C7.36228 15.4259 7.65535 15.7517 7.82888 16.1426Z"
        stroke="#9E9E9E"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.99961 12.5C11.3803 12.5 12.4996 11.3807 12.4996 10C12.4996 8.61931 11.3803 7.50002 9.99961 7.50002C8.6189 7.50002 7.49961 8.61931 7.49961 10C7.49961 11.3807 8.6189 12.5 9.99961 12.5Z"
        stroke="#9E9E9E"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default FormSettingsIcon;
