import { DROPDOWN_CONSTANTS } from 'utils/strings/CommonStrings';

export const dynamicDatalistFieldOptions = (allFields) => {
    const optionData = [];
    if (allFields) {
        allFields.forEach((fields) => {
            optionData.push({
                [DROPDOWN_CONSTANTS.OPTION_TEXT]: fields.reference_name,
                [DROPDOWN_CONSTANTS.VALUE]: fields.field_uuid,
                fieldType: fields.field_type,
                field_type: fields.field_list_type,
            });
        });
    }
    return optionData;
};
