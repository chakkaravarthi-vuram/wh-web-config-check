import { LAYOUT_WITH_SIDEBAR } from './ActionConstants';

export const layoutWithSidebarSetState = (data) => (dispatch) => {
  dispatch({
    type: LAYOUT_WITH_SIDEBAR.DATA_CHANGE,
    payload: data,
  });
  return Promise.resolve();
};
export const layoutWithSidebarClearState = () => {
  return {
    type: LAYOUT_WITH_SIDEBAR.CLEAR,
  };
};

export default layoutWithSidebarSetState;
