import { get, cloneDeep } from '../../utils/jsUtility';

export const getFieldFromState = (createTaskReducer, sectionIndex, fieldListIndex, fieldIndex, clone) => {
  const fieldValue = get(createTaskReducer, ['sections', sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex]);
  return clone ? cloneDeep(fieldValue) : fieldValue;
};

export const getFieldValueFromState = (createTaskReducer, sectionIndex, fieldListIndex, fieldIndex, id, clone) => {
  const fieldValue = get(createTaskReducer, ['sections', sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex, id]);
  return clone ? cloneDeep(fieldValue) : fieldValue;
};
export const getFormPostDataFromState = (createTaskReducer, sectionIndex, fieldListIndex, fieldIndex, id, clone) => {
  const fieldValue = get(createTaskReducer, ['form_details', 'sections', sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex, id]);
  return clone ? cloneDeep(fieldValue) : fieldValue;
};
export const getSectionFromState = (createTaskReducer, sectionIndex, clone) => {
  const section = get(createTaskReducer, ['sections', sectionIndex]);
  return clone ? cloneDeep(section) : section;
};
