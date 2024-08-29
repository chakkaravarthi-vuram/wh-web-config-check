import { addNewLookupFailureAction } from '../../../redux/reducer/LookUpReducer';
import { LOOKUP_NAME, LOOKUP_VALUE, LOOKUP_TYPE } from '../../../utils/ValidationConstants';
import LOOK_UP_MANAGEMENT_STRINGS from './LookUpManagement.strings';

export const addNewLookUpValidationSchema = (t) => {
  return {
    lookup_name: LOOKUP_NAME(t, LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_NAME.LABEL).label(t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_NAME.LABEL)),
    lookup_type: LOOKUP_TYPE.label(t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_TYPE.LABEL)),
    lookup_value: LOOKUP_VALUE(t, LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.LABEL).label(t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.LABEL)),
  };
};

export default addNewLookupFailureAction;
