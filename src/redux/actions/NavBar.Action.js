import { NAVBAR } from './ActionConstants';

export const NavToggle = () => {
 return {
    type: NAVBAR.TOGGLE,
};
};
export const NavToggleClose = () => {
 return {
    type: NAVBAR.TOGGLE_CLOSE,
};
};
export const commonHeaderChange = (header) => {
    return {
        type: NAVBAR.COMMON_HEADER_CHANGE,
        payload: header,
    };
  };
export const NavBarDataChange = (data) => {
    console.log('NavBarDataChange', data);
    return {
        type: NAVBAR.DATA_CHANGE,
        payload: data,
    };
};
