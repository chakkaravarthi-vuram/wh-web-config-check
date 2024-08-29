import { cloneDeep, isEmpty, set, has, isBoolean, isNaN } from 'utils/jsUtility';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { REQ_BODY_KEY_TYPES } from '../../../../Integration.utils';

export const checkIsValidTestValue = (data) => {
  if (has(data, 'test_value')) {
    return (
      data.test_value !== EMPTY_STRING && (
        !isEmpty(data.test_value) || (
          (data.type === REQ_BODY_KEY_TYPES.NUMBER) && !isNaN(data.test_value)
        ) || (
          (data.type === REQ_BODY_KEY_TYPES.BOOLEAN) && isBoolean(data.test_value)
        ))
    );
  }
  return false;
};

const updateChildRowsBasedOnSiblings = (data) => {
  if (!isEmpty(data.child_rows)) {
    data.child_rows.forEach((childRow, index) => {
      if (!childRow.keepChild) {
        if (childRow.is_required) {
          set(data, ['child_rows', index, 'keepChild'], true);
          set(
            data,
            ['child_rows', index],
            updateChildRowsBasedOnSiblings(childRow),
          );
        }
      }
    });
  }
  return data;
};

const checkForValidChild = (data, keyLabel) => {
  if (!has(data, ['keepChild']) || data.keepChild === undefined) {
    data.keepChild = false;
  }
  (data.child_rows || []).forEach((childRow, index) => {
    if (!has(childRow, ['keepChild']) || childRow.keepChild === undefined) {
      set(data, ['child_rows', index, 'keepChild'], false);
    }
    if (childRow.type === 'object') {
      if (childRow.is_multiple && checkIsValidTestValue(childRow)) {
        if (!data.keepChild) {
          data.keepChild = true;
        }
      }

      const childRowUpdated = checkForValidChild(childRow, keyLabel);

      set(data, ['child_rows', index], childRowUpdated);
    } else if (checkIsValidTestValue(childRow)) {
      set(data, ['child_rows', index, 'keepChild'], true);

      if (!data.keepChild) {
        data.keepChild = true;
      }
    }
  });

  if (data.child_rows) {
    const childList = data.child_rows.some((childRow) => childRow.keepChild);
    if (childList) {
      data.keepChild = true;
      data = updateChildRowsBasedOnSiblings(data);
    }
  }

  return data;
};

export const getIntegrationTestRequestBodyData = (requestBody = []) => {
  const formattedRequestBody = [];
  const clonedRequestBody = cloneDeep(requestBody);
  clonedRequestBody.forEach((data) => {
    if (data.is_required) data.keepChild = true;
    if (data.type === 'object') {
      const updatedChild = checkForValidChild(cloneDeep(data), 'test_value');
      formattedRequestBody.push(updatedChild);
    } else {
      if (checkIsValidTestValue(data)) data.keepChild = true;
      formattedRequestBody.push(data);
    }
  });

  return formattedRequestBody;
};
