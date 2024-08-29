import { FIELD_TYPES } from '../../../../../../../components/form_builder/FormBuilder.strings';
import { EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';
import { WORKHALL_API_STRINGS } from '../../../../../Integration.strings';
import { REQ_BODY_KEY_TYPES } from '../../../../../Integration.utils';

export const initialRowData = {
  key: EMPTY_STRING,
  field: EMPTY_STRING,
  is_table: false,
  value_type: WORKHALL_API_STRINGS.REQUEST_RESPONSE.VALUE_TYPES.DYNAMIC,
  field_details: {},
};

export const getTypeByFieldDetails = (selectedField, fieldUuid) => {
  if (selectedField?.table_uuid === fieldUuid) {
    return { type: REQ_BODY_KEY_TYPES.OBJECT };
  } else if (selectedField?.field_type === FIELD_TYPES.DATE) {
    return { type: REQ_BODY_KEY_TYPES.DATE };
  } else if (selectedField?.field_type === FIELD_TYPES.DATETIME) {
    return { type: REQ_BODY_KEY_TYPES.DATE_AND_TIME };
  } else if (selectedField?.field_type === FIELD_TYPES.YES_NO) {
    return { type: REQ_BODY_KEY_TYPES.BOOLEAN };
  } else if ([
    FIELD_TYPES.NUMBER,
    FIELD_TYPES.CURRENCY,
    FIELD_TYPES.PERCENTAGE,
    FIELD_TYPES.RATING,
    FIELD_TYPES.PHONE_NUMBER,
  ].includes(selectedField?.field_type)) {
    return { type: REQ_BODY_KEY_TYPES.NUMBER };
  } else {
    return { type: REQ_BODY_KEY_TYPES.TEXT };
  }
};
