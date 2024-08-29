import { ADMIN_SETTINGS_CONSTANT } from '../AdminSettings.constant';

export const DEFAULT_TIME_SETTINGS = {
  VISIBILITY: {
    CURRENT_TIME_ID: 'current_time',
    ID: 'from',
    LABEL: 'From',
    LIST: [
      { label: 'Now', value: 'currentDateTime' },
    ],
    LISTS: [
      { label: '', value: 'SetDateTime' },
    ],
  },
};

export const COVER_IMAGE_OR_MESSAGE = {
  TITLE: {
    LABEL: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.SUB_TITLE,
  },
  SUB_TITLE: {
    LABEL: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.ADD_DURATION,
  },
  OPTION_VISIBILITY: (t) => {
    return {
    ID: 'is_cover',
    LABEL: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.VISIBILITY_LABEL,
    LIST: [
      { label: t(ADMIN_SETTINGS_CONSTANT.COMMON_STRINGS.NO), value: false },
      { label: t(ADMIN_SETTINGS_CONSTANT.COMMON_STRINGS.YES), value: true },
    ],
  };
  },
  VISIBILITY: {
    ID: 'is_cover',
    LABEL: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.VISIBILITY_LABEL,
    LIST: [
      { label: ADMIN_SETTINGS_CONSTANT.COMMON_STRINGS.NO, value: false },
      { label: ADMIN_SETTINGS_CONSTANT.COMMON_STRINGS.YES, value: true },
    ],
  },
  OPTION_TYPE: (t) => {
    return {
    ID: 'cover_type',
    TYPES: [
      { label: t ? t(ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.MESSAGE) : ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.MESSAGE, value: 'message', ID: 'message' },
      { label: t ? t(ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.PICTURE) : ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.PICTURE, value: 'picture', ID: 'picture' },
    ],
  };
  },
  TYPE: {
    ID: 'cover_type',
    TYPES: [
      { label: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.MESSAGE, value: 'message', ID: 'message' },
      { label: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.PICTURE, value: 'picture', ID: 'picture' },
    ],
  },
  COVER_IMAGE: {
    ID: 'acc_cover_pic',
    NOTE: 'File size should be below 1MB and minimum 538px width and 150px height.',
    LINK: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.ADD_PICTURE,
    DURATION: 'admin_settings.notice_board_settings.cover_image.cover_image_duration',
    LABEL: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.LABEL,
  },
  COVER_DURATION_TYPE: {
    ID: 'cover_date_type',
    DURATION: 'Cover Date Duration',
    LABEL: 'Cover Duration',
  },
  COVER_MESSAGE: {
    ID: 'cover_message',
    LABEL: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.COVER_MESSAGE_LABEL,
    PLACEHOLDER: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.COVER_MESSAGE_PLACEHOLDER,
    NOTE: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.COVER_MESSAGE_NOTE,
    DURATION: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.COVER_MESSAGE_DURATION,
    BACKGROUND_COLOR: { ID: 'cover_color', LABEL: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.BACKGROUND_COLOR_LABEL },
  },
  DURATION: {
    ID: 'cover_duration',
    DURATION_TYPE: 'durationType',
    FROM_DATE: {
      ID: 'from_date',
      LABEL: ADMIN_SETTINGS_CONSTANT.COMMON_STRINGS.FROM,
      PLACEHOLDER: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.FROM_DATE_PLACEHOLDER,
      MAX_DURATION_ERROR: 'Cover duration should not exceed 30days',
      MIN_DURATION_ERROR: 'Cover duration should contain atleast 15mins difference',
      ERROR_MESSAGE: 'Start date should be lesser than End date',
      TIME_ERROR_MESSAGE: 'Start time should be lesser than End time',
    },
    TO_DATE: {
      ID: 'to_date',
      LABEL: ADMIN_SETTINGS_CONSTANT.COMMON_STRINGS.TO,
      LABEL_END: ADMIN_SETTINGS_CONSTANT.COMMON_STRINGS.END,
      PLACEHOLDER: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.TO_DATE_PLACEHOLDER,
      MAX_DURATION_ERROR: 'Cover duration should not exceed 30days',
      MIN_DURATION_ERROR: 'Cover duration should contain atleast 15mins difference',
      ERROR_MESSAGE: 'End date should be greater than Start date',
      TIME_ERROR_MESSAGE: 'End time should be greater than Start time',
      PAST_TIME_ERROR: 'End time should be greater than Current time',
    },
    FROM_TIME: {
      ID: 'from_time',
      PLACEHOLDER: 'Start Time',
    },
    TO_TIME: {
      ID: 'to_time',
      PLACEHOLDER: 'End Time',
    },
    START_DATE_TIME: {
      ID: 'cover_start_dt',
    },
    END_DATE_TIME: {
      ID: 'cover_end_dt',
    },
    TIME_ZONE_LABELS: [ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.TIME_ZONE_IN, ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.GMT],
    DURATION_DROPDOWN_OPTION: (t) => [
      {
        label: t(ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.ADD_DURATION_PLACEHOLDER),
        value: '',
      },
      {
        label: t(ADMIN_SETTINGS_CONSTANT.COMMON_STRINGS.NOW),
        value: 'now',
      },
      {
        label: t(ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.SET_DURATION),
        value: 'set_duration',
      },
    ],
    DURATION_DROPDOWN: [
      {
        label: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.ADD_DURATION_PLACEHOLDER,
        value: '',
      },
      {
        label: ADMIN_SETTINGS_CONSTANT.COMMON_STRINGS.NOW,
        value: 'now',
      },
      {
        label: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.SET_DURATION,
        value: 'set_duration',
      },
    ],
  },
};

export default COVER_IMAGE_OR_MESSAGE;
