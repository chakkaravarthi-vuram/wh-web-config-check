import { isEmpty, uniqBy } from '../../../utils/jsUtility';
import { FIELD_LIST_TYPE } from '../../../utils/constants/form.constant';

export const getFieldOptionList = (all_fields = []) => {
  if (isEmpty(all_fields) || !Array.isArray(all_fields)) return [];

  let optionList = all_fields.map((field) => {
      if (field.field_list_type === FIELD_LIST_TYPE.TABLE && !field.field_type) {
        return {
            id: field.table_uuid,
            label: field.table_name,
            value: field.table_uuid,
            type: FIELD_LIST_TYPE.TABLE,
        };
      }
        return {
            id: field.field_uuid,
            label: field.label,
            value: field.field_uuid,
            type: field.field_type,
            ...(field.table_uuid ? { table_uuid: field.table_uuid } : {}),
        };
  });
  optionList = uniqBy(optionList, (option) => option.id);
  return optionList;
};
