import moment from 'moment-timezone';
import { validateFixedDateRanges } from 'components/form_builder/field_config/Field.validation.schema';
import { DATE } from 'utils/Constants';
import { getUserProfileData } from 'utils/UtilityFunctions';
import { alternativeConstraints, ANY_VALIDATION, constructJoiObject, COVER_MESSAGE_VALIDATION, OBJECT_VALIDATION, REQUIRED_VALIDATION, STRING_VALIDATION } from '../../../utils/ValidationConstants';
import { COVER_IMAGE_OR_MESSAGE } from './CoverContentSettings.strings';
import { ADMIN_SETTINGS_CONSTANT } from '../AdminSettings.constant';

const { NOTICE_BOARD_SETTINGS } = ADMIN_SETTINGS_CONSTANT;
const getDateSchema = (t) => {
  const userProfileData = getUserProfileData();

  const currentDateTime = userProfileData.pref_timezone ? moment.utc().tz(userProfileData.pref_timezone).format(DATE.UTC_DATE_WITH_TIME_STAMP) : moment.utc().format(DATE.UTC_DATE_WITH_TIME_STAMP);
  return {
    [COVER_IMAGE_OR_MESSAGE.DURATION.FROM_DATE.ID]: STRING_VALIDATION.custom((value, helper) => {
      const error = validateFixedDateRanges({ start_date: value, end_date: helper.state.ancestors[0].to_date, sub_type: 'between', is_start_date: true, isDateTime: true, withFixedDifference: 29 }); // minDiff: 15, minDiffUnit: 'minute' });
      if (error) return helper.message(error);
      return value;
    }).required().label(t(COVER_IMAGE_OR_MESSAGE.DURATION.FROM_DATE.PLACEHOLDER)),
    [COVER_IMAGE_OR_MESSAGE.DURATION.TO_DATE.ID]: STRING_VALIDATION.custom((value, helper) => {
      const error = validateFixedDateRanges({ end_date: value, start_date: helper.state.ancestors[0].from_date, sub_type: 'between', is_start_date: false, isDateTime: true, withFixedDifference: 29, shouldBePresentTime: true, currentDateTime });
      if (error) return helper.message(error);
      return value;
    }).required().label(t(COVER_IMAGE_OR_MESSAGE.DURATION.TO_DATE.PLACEHOLDER)),
    [COVER_IMAGE_OR_MESSAGE.COVER_DURATION_TYPE.ID]: REQUIRED_VALIDATION.label(t(NOTICE_BOARD_SETTINGS.COVER_MESSAGE_DURATION)),
  };
};
export const coverMessageValidationSchema = (t) => constructJoiObject({
  [COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.ID]: COVER_MESSAGE_VALIDATION.required().label(
    t(COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.LABEL),
  ),
    ...getDateSchema(t),
});

export const coverPictureValidationSchema = (t) => constructJoiObject({
  [COVER_IMAGE_OR_MESSAGE.COVER_IMAGE.ID]: alternativeConstraints(ANY_VALIDATION, OBJECT_VALIDATION)
    .required()
    .label(t(COVER_IMAGE_OR_MESSAGE.COVER_IMAGE.LABEL)),
    ...getDateSchema(t),
});

export default coverMessageValidationSchema;
