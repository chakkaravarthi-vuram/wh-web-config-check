import moment from 'moment';
import Joi from 'joi';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import {
  ANY_VALIDATION,
  constructJoiObject,
  NOTES_VALIDATION,
  REMAINDER_MESSAGE_VALIDATION,
  STRING_VALIDATION,
} from '../../../../utils/ValidationConstants';
import NOTES_AND_REMAINDERS_STRINGS from './NotesAndRemainders.strings';
import { getUserProfileData } from '../../../../utils/UtilityFunctions';
import { DATE } from '../../../../utils/Constants';
import { validateFixedDateRanges } from '../../../../components/form_builder/field_config/Field.validation.schema';

export const addNewNotesValidationSchema = (t) =>
  constructJoiObject({
    datalistNotes: NOTES_VALIDATION.required().label(
      NOTES_AND_REMAINDERS_STRINGS(t).NOTES.ADD_NOTES.NOTES.LABEL,
    ),
    attachments: constructJoiObject({
      fileName: STRING_VALIDATION,
      file: ANY_VALIDATION,
    })
      .allow(null, EMPTY_STRING)
      .label(NOTES_AND_REMAINDERS_STRINGS(t).NOTES.ADD_NOTES.ATTACHMENTS.LABEL),
  });

const getDateSchema = (t) => {
  const userProfileData = getUserProfileData();
  const currentDateTime = userProfileData.pref_timezone
    ? moment
        .utc()
        .tz(userProfileData.pref_timezone)
        .format(DATE.UTC_DATE_WITH_TIME_STAMP)
    : moment.utc().format(DATE.UTC_DATE_WITH_TIME_STAMP);
  return {
    scheduledDate: STRING_VALIDATION.custom((value, helper) => {
      const error = validateFixedDateRanges(
        {
          start_date: currentDateTime,
          end_date: value,
          sub_type: 'after',
          is_start_date: false,
          isDateTime: true,
          shouldBePresentTime: true,
          currentDateTime,
        },
        t,
      );
      if (error) return helper.message(error);
      return value;
    })
      .required()
      .label(
        NOTES_AND_REMAINDERS_STRINGS(t).REMAINDERS.ADD_REMAINDERS
          .REMINDER_DATE_AND_TIME.LABEL,
      ),
  };
};

export const addNewRemainderValidationSchema = (t) =>
  Joi.object().keys({
    remainder_message: REMAINDER_MESSAGE_VALIDATION.label(
      NOTES_AND_REMAINDERS_STRINGS(t).REMAINDERS.ADD_REMAINDERS.REMINDER_MESSAGE
        .LABEL,
    ).required(),
    ...getDateSchema(t),
  });
