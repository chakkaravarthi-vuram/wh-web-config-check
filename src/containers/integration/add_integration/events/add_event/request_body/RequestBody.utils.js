import { cloneDeep, isEmpty, get, set } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';

export const initialRowData = {
  key: EMPTY_STRING,
  type: EMPTY_STRING,
  is_required: false,
  is_multiple: false,
};

export const getModifiedRequestBody = (reqParam = [], childKey = 'child_rows', keyUuidLabel = 'key_uuid', getRowData, reqBodyValue = []) => {
  const clonedReqParam = cloneDeep(reqParam);
  const updatedList = [];
  const tempList = cloneDeep(reqParam);
  clonedReqParam.forEach((data, index) => {
    let additionalData = {};
    if (!isEmpty(reqBodyValue)) {
      const reqData = reqBodyValue?.find((req) => req.key === data[keyUuidLabel]);
      if (!isEmpty(reqData)) {
        console.log(reqData, 'llljl');
        additionalData = {
          value: reqData.value,
          value_type: reqData.type || 'expression',
        };
      }
    }
    if (getRowData) {
      data = getRowData(cloneDeep({ ...data, ...additionalData }));
    }
    if (isEmpty(data.root_uuid)) {
      const path = (updatedList.length).toString(); // data.key_uuid;
      data.path = path;
      tempList[index].path = path;
      updatedList.push(data);
    } else {
      const parentIndex = tempList.findIndex((parent) => parent[keyUuidLabel] === data.root_uuid);
      if (parentIndex > -1) {
        const parentPath = get(tempList[parentIndex], 'path', EMPTY_STRING);
        const childIndex = (get(updatedList, [...parentPath.split(','), childKey], []) || []).length;
        const path = `${parentPath},${childKey},${childIndex}`;
        data.path = path;
        const parentPathArray = (parentPath || EMPTY_STRING).split(',') || [];
        const parentData = get(updatedList, [...parentPathArray], {}) || {};
        console.log(parentData, data, parentIndex, parentPath, path, updatedList, 'data kjhkjhjkh');
        if ((data.type === 'expression') && parentData?.is_multiple && (parentData.key_type === 'object')) {
          if (!isEmpty(data?.field_details)) {
            const parentFieldDetails = get(updatedList, [...parentPathArray, 'field_details'], {}) || {};
            if (isEmpty(parentFieldDetails)) {
              set(updatedList, [...parentPathArray, 'value'], data?.field_details?.table_uuid);
              const updatedParentFieldDetails = {
                table_uuid: data?.field_details?.table_uuid,
                table_name: data?.field_details?.table_name,
                field_name: data?.field_details?.table_name,
              };
              set(updatedList, [...parentPathArray, 'field_details'], updatedParentFieldDetails);
            }
          }
        } else {
          if ((parentData.type === 'direct') && !parentData?.is_multiple && (parentData?.key_type === 'object')) {
            set(updatedList, [...parentPathArray, 'value'], EMPTY_STRING);
          }
        }
        console.log(path, parentPathArray, data, 'lknknknkklnkl', path.split(','), updatedList);
        set(updatedList, path.split(','), data);
        tempList[index].path = path;
      }
    }
  });
  console.log(updatedList, 'klnknknknknnk', tempList);
  return updatedList;
};
