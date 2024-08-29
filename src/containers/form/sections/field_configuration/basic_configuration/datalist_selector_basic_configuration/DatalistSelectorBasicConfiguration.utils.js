import { FIELD_TYPES } from '../../FieldConfiguration.strings';

export const getModifiedDataLists = (datalists) => datalists?.map((datalist) => {
    return {
        label: datalist?.data_list_name,
        value: datalist?.data_list_uuid,
        datalistId: datalist?._id,
    };
});

export const getDatalistFieldValidationErrorMessage = (errorList, errorKey) => errorList[`dataListDetails,${errorKey}`];

export const ALLOWED_DATALIST_FIELD_TYPES = [
    FIELD_TYPES.SINGLE_LINE,
    FIELD_TYPES.NUMBER,
    FIELD_TYPES.RADIO_GROUP,
    FIELD_TYPES.DROPDOWN,
    FIELD_TYPES.EMAIL,
    FIELD_TYPES.SCANNER,
  ];

export const getDataListFieldDetails = (fieldDetails = {}, key, values) => {
    const data = [];
    values?.forEach((eachValue) => {
        const field = fieldDetails?.otherFieldDetail?.find((eachField) => eachField?.[key] === eachValue);
        if (field) {
            data.push(field);
        }
    });
    console.log('check fieldsgetDataListFieldDetails', data);
    return data;
};

export const EXISTING_DATA_LIST_DELETED_ERROR_INSTRUCTION = (t) => t('form_field_strings.field_config.existing_datalist_deleted');
