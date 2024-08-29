import { isEmpty } from '../../../../utils/jsUtility';

export const LAYOUT_INITIAL_STATE = {
  bgColor: '#ffffff',
  noOfColumns: 2,
};

export const NO_OF_COLUMNS_OPTION_LIST = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
];

export const doesLayoutHaveValidChildren = (layout) => {
  if (isEmpty(layout)) return false;

  for (let i = 0; i < layout.children.length; i++) {
    const row = layout.children[i];
    for (let j = 0; j < row.children.length; j++) {
      const col = row.children[j];
      if (col.children.length > 0) {
        return true;
      }
    }
  }

  return false;
};
