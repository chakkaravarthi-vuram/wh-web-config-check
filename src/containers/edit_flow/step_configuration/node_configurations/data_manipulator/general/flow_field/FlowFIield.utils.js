import { ARRAY_FIELDS } from './FlowField.constants';

export const isArrayField = (fields, uuid) => {
    const field = fields?.find((eachField) => eachField?.value === uuid);
    const fieldType = field?.fieldType || field?.type;
    return ARRAY_FIELDS?.includes(fieldType);
};
