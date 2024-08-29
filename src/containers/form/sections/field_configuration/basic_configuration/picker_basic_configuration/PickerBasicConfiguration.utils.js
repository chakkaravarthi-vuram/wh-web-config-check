import { RESPONSE_FIELD_KEYS } from '../../../../../../utils/constants/form/form.constant';
import { isEmpty } from '../../../../../../utils/jsUtility';
import { FIELD_TYPES } from '../../FieldConfiguration.strings';

export const getModifiedDataLists = (datalists) => datalists?.map((datalist) => {
    return {
        label: datalist?.data_list_name,
        value: datalist?.data_list_uuid,
        datalistId: datalist?._id,
    };
});

export const getDatalistPickerValidationErrorMessage = (errorList, errorKey) => errorList[`${RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS},${errorKey}`];

export const ALLOWED_DATALIST_FIELD_TYPES = [
    FIELD_TYPES.SINGLE_LINE,
    FIELD_TYPES.NUMBER,
    FIELD_TYPES.RADIO_GROUP,
    FIELD_TYPES.DROPDOWN,
    FIELD_TYPES.EMAIL,
    FIELD_TYPES.SCANNER,
  ];

export const getPickerDetails = (otherFieldDetails, key, value) => {
    let data;
    if (isEmpty(otherFieldDetails)) return null;
    otherFieldDetails?.find((field) => {
        if (field[key] === value) {
            data = field;
            return true;
        }
        return false;
    });
    return data;
};
