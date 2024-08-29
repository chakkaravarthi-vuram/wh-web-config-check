import { nullCheck } from 'utils/jsUtility';

export const getFormFieldAssigneeDropdownData = (fields) => {
    if (nullCheck(fields, 'length', true)) {
        return fields.map((eachField) => {
            return {
                label: eachField?.label,
                value: eachField?.field_uuid,
            };
        });
    }
    return [];
};

export default getFormFieldAssigneeDropdownData;
