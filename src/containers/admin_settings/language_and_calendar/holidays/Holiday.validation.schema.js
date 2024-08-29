import {
  REQUIRED_VALIDATION,
  OCCASION_NAME_VALIDATION,
  constructJoiObject,
} from '../../../../utils/ValidationConstants';
import { HOLIDAY_TABLE } from './holiday_table/HolidayTable.strings';

export const holidayDetailsValidateSchema = (t) => constructJoiObject({
  occasion: OCCASION_NAME_VALIDATION.label(t(HOLIDAY_TABLE.OCCASION_INPUT.LABEL)),
  date: REQUIRED_VALIDATION.label(t(HOLIDAY_TABLE.DATE.LABEL)),
});

export default holidayDetailsValidateSchema;
