import {
  coverContentSettingsClearState,
  coverContentSettingsSetState,
  updateAccountCoverDetailsApi,
} from '../../../redux/actions/CoverContentSettings.Action';
import jsUtils, { cloneDeep, nullCheck } from '../../../utils/jsUtility';
import { store } from '../../../Store';
import {
  toIsAfterFromDate,
  validate,
  validatingRequiredFieldInDocuments,
} from '../../../utils/UtilityFunctions';
import { COVER_IMAGE_OR_MESSAGE, DEFAULT_TIME_SETTINGS } from './CoverContentSettings.strings';
import { coverPictureValidationSchema, coverMessageValidationSchema } from './CoverContentSettings.validate.schema';
import { DOCUMENT_TYPES, EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { getDaysCountBetweenTwoDates, getTimeStringInMin, parseTimeZoneOffsetFromUTC, checkIsAfterTime, formatServerDateString } from '../../../utils/dateUtils';
import { getSignedUrlFromDocumentUrlDetails } from '../../../utils/profileUtils';
import { getFileUrl } from '../../../utils/attachmentUtils';

const DT_PICKER_ERROR_MESSAGE_TYPE = Object.freeze({
  EXCEEDED_LIMIT: 1,
  TIME: 2,
  DAY: 3,
  MIN_DURATION: 4,
  PAST_TIME: 5,
});

export const getStartAndEndDuration = (apiResponse) => {
  return {
    [COVER_IMAGE_OR_MESSAGE.DURATION.FROM_DATE.ID]: formatServerDateString(apiResponse[COVER_IMAGE_OR_MESSAGE.DURATION.START_DATE_TIME.ID].pref_tz_datetime),
    [COVER_IMAGE_OR_MESSAGE.DURATION.TO_DATE.ID]: formatServerDateString(apiResponse[COVER_IMAGE_OR_MESSAGE.DURATION.END_DATE_TIME.ID].pref_tz_datetime),
  };
};

export const getInitialAccountCoverDetailsData = (apiResponse) => {
  const data = {
    [COVER_IMAGE_OR_MESSAGE.VISIBILITY.ID]: apiResponse[COVER_IMAGE_OR_MESSAGE.VISIBILITY.ID] || false,
  };
  data._id = apiResponse._id;
  if (apiResponse[COVER_IMAGE_OR_MESSAGE.VISIBILITY.ID]) {
    data[COVER_IMAGE_OR_MESSAGE.TYPE.ID] = apiResponse[COVER_IMAGE_OR_MESSAGE.TYPE.ID];
    data[COVER_IMAGE_OR_MESSAGE.DURATION.ID] = { ...getStartAndEndDuration(apiResponse) };
    data[COVER_IMAGE_OR_MESSAGE.DURATION.DURATION_TYPE] = DEFAULT_TIME_SETTINGS.VISIBILITY.LISTS[0].value;
    data[COVER_IMAGE_OR_MESSAGE.COVER_DURATION_TYPE.ID] = apiResponse[COVER_IMAGE_OR_MESSAGE.COVER_DURATION_TYPE.ID];
    if (apiResponse[COVER_IMAGE_OR_MESSAGE.TYPE.ID] === COVER_IMAGE_OR_MESSAGE.TYPE.TYPES[1].value) {
      data[COVER_IMAGE_OR_MESSAGE.COVER_IMAGE.ID] = apiResponse[COVER_IMAGE_OR_MESSAGE.COVER_IMAGE.ID];
      data.acc_cover_pic_url = getSignedUrlFromDocumentUrlDetails(
        apiResponse.document_url_details,
        apiResponse[COVER_IMAGE_OR_MESSAGE.COVER_IMAGE.ID],
      );
    } else if (apiResponse[COVER_IMAGE_OR_MESSAGE.TYPE.ID] === COVER_IMAGE_OR_MESSAGE.TYPE.TYPES[0].value) {
      data[COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.ID] = apiResponse[COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.ID];
      data[COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.BACKGROUND_COLOR.ID] =
        apiResponse[COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.BACKGROUND_COLOR.ID];
    }
  }
  return data;
};

export const validateCoverDetailsDataAndSetErrorsInState = (t) => {
  const state = store.getState().CoverContentSettingsReducer;
  const data = {};
  let schema = {};
  if (state[COVER_IMAGE_OR_MESSAGE.VISIBILITY.ID]) {
    if (state[COVER_IMAGE_OR_MESSAGE.TYPE.ID] === COVER_IMAGE_OR_MESSAGE.TYPE.TYPES[1].value) {
      data[COVER_IMAGE_OR_MESSAGE.COVER_IMAGE.ID] = state[COVER_IMAGE_OR_MESSAGE.COVER_IMAGE.ID];
      schema = coverPictureValidationSchema(t);
    } else if (state[COVER_IMAGE_OR_MESSAGE.TYPE.ID] === COVER_IMAGE_OR_MESSAGE.TYPE.TYPES[0].value) {
      data[COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.ID] = state[COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.ID];
      schema = coverMessageValidationSchema(t);
    }
    data[COVER_IMAGE_OR_MESSAGE.DURATION.FROM_DATE.ID] = state.cover_duration[COVER_IMAGE_OR_MESSAGE.DURATION.FROM_DATE.ID];
    data[COVER_IMAGE_OR_MESSAGE.DURATION.TO_DATE.ID] = state.cover_duration[COVER_IMAGE_OR_MESSAGE.DURATION.TO_DATE.ID];
    data[COVER_IMAGE_OR_MESSAGE.COVER_DURATION_TYPE.ID] = state[COVER_IMAGE_OR_MESSAGE.COVER_DURATION_TYPE.ID];
    const error_list = validate(data, schema);
    if (!jsUtils.isEmpty(error_list)) {
      if (!jsUtils.isEqual(error_list, state.error_list)) store.dispatch(coverContentSettingsSetState({ error_list }));
      return false;
    }
    if (!jsUtils.isEqual(error_list, state.error_list)) store.dispatch(coverContentSettingsSetState({ error_list: [] }));
    return true;
  }
  return true;
};

export const validateAndCompareData = (t) => {
  const state = store.getState().CoverContentSettingsReducer;
  // validating data
  if (!jsUtils.isEmpty(state.error_list)) {
    validateCoverDetailsDataAndSetErrorsInState(t);
  }
  // comparing server & state data
  const serverData = getInitialAccountCoverDetailsData(state.serverData);
  const stateData = jsUtils.intersectObjects(state, serverData);
  const enableButton = !jsUtils.isEqual(stateData, serverData);
  if (state.enableButton !== enableButton) {
    store.dispatch(coverContentSettingsSetState({ enableButton }));
  }
};

export const onChangeHandler = (event, t) => {
  store.dispatch(coverContentSettingsSetState({ [event.target.id]: event.target.value }));
  validateAndCompareData(t);
};

export const getErrorMessage = (errorNumber, error) => {
  switch (errorNumber) {
    case DT_PICKER_ERROR_MESSAGE_TYPE.EXCEEDED_LIMIT:
      return error.MAX_DURATION_ERROR;
    case DT_PICKER_ERROR_MESSAGE_TYPE.TIME:
      return error.TIME_ERROR_MESSAGE;
    case DT_PICKER_ERROR_MESSAGE_TYPE.DAY:
      return error.ERROR_MESSAGE;
    case DT_PICKER_ERROR_MESSAGE_TYPE.MIN_DURATION:
      return error.MIN_DURATION_ERROR;
    case DT_PICKER_ERROR_MESSAGE_TYPE.PAST_TIME:
      return error.PAST_TIME_ERROR;
    default:
      return '';
  }
};

export const validateDateTimeRange = ({ id, setState, error_list, latestCoverDuration }) => {
  const { from_date, to_date, to_time, from_time } = latestCoverDuration;
  if (!jsUtils.isEmpty(from_date) && !jsUtils.isEmpty(to_date)) {
    const daysDifference = getDaysCountBetweenTwoDates(from_date, to_date); let error = {};
    let actionDateError;
    let anotherDateId;
    if (toIsAfterFromDate(from_date, to_date)) {
      if (daysDifference > 29) actionDateError = DT_PICKER_ERROR_MESSAGE_TYPE.EXCEEDED_LIMIT;
    } else if (daysDifference === 0) {
      if (to_time && from_time) {
        const fromTimeInMin = getTimeStringInMin(from_time);
        const toTimeInMin = getTimeStringInMin(to_time);
        if (fromTimeInMin > toTimeInMin) {
          actionDateError = DT_PICKER_ERROR_MESSAGE_TYPE.TIME;
        } else if (fromTimeInMin === toTimeInMin) actionDateError = DT_PICKER_ERROR_MESSAGE_TYPE.MIN_DURATION;
        else if (!checkIsAfterTime(`${to_date} ${to_time}`)) {
          actionDateError = DT_PICKER_ERROR_MESSAGE_TYPE.PAST_TIME;
        }
      }
    } else actionDateError = DT_PICKER_ERROR_MESSAGE_TYPE.DAY;
    if (id === COVER_IMAGE_OR_MESSAGE.DURATION.FROM_DATE.ID) {
      error = COVER_IMAGE_OR_MESSAGE.DURATION.FROM_DATE;
      anotherDateId = COVER_IMAGE_OR_MESSAGE.DURATION.TO_DATE.ID;
    } else if (!checkIsAfterTime(`${to_date} ${to_time}`)) {
      error = COVER_IMAGE_OR_MESSAGE.DURATION.TO_DATE;
      anotherDateId = COVER_IMAGE_OR_MESSAGE.DURATION.FROM_DATE.ID;
    } else {
      error = COVER_IMAGE_OR_MESSAGE.DURATION.TO_DATE;
      anotherDateId = COVER_IMAGE_OR_MESSAGE.DURATION.FROM_DATE.ID;
    }
    setState({
      error_list: {
        ...error_list,
        [id]: getErrorMessage(actionDateError, error),
        [anotherDateId]: '',
      },
    });
  } else {
    setState({
      error_list: {
        ...error_list,
        [id]: '',
      },
    });
  }
};

const getStartAndEndDurationInUTC = (state) => {
  const { pref_utc_offsetStr } = store.getState().AdminProfileReducer.adminProfile;
  return {
    [COVER_IMAGE_OR_MESSAGE.DURATION.START_DATE_TIME.ID]: `${state.cover_duration[COVER_IMAGE_OR_MESSAGE.DURATION.FROM_DATE.ID]
      }${pref_utc_offsetStr}`,
    [COVER_IMAGE_OR_MESSAGE.DURATION.END_DATE_TIME.ID]: `${state.cover_duration[COVER_IMAGE_OR_MESSAGE.DURATION.TO_DATE.ID]
      }${pref_utc_offsetStr}`,
  };
};

export const getUpdatedAccountCoverDetailsData = (state) => {
  let data = { [COVER_IMAGE_OR_MESSAGE.VISIBILITY.ID]: state[COVER_IMAGE_OR_MESSAGE.VISIBILITY.ID] };
  if (state[COVER_IMAGE_OR_MESSAGE.VISIBILITY.ID]) {
    data = {
      ...data,
      [COVER_IMAGE_OR_MESSAGE.TYPE.ID]: state[COVER_IMAGE_OR_MESSAGE.TYPE.ID],
      [COVER_IMAGE_OR_MESSAGE.COVER_DURATION_TYPE.ID]: state[COVER_IMAGE_OR_MESSAGE.COVER_DURATION_TYPE.ID],
      ...getStartAndEndDurationInUTC(state),
    };
    if (state[COVER_IMAGE_OR_MESSAGE.TYPE.ID] === COVER_IMAGE_OR_MESSAGE.TYPE.TYPES[1].value) {
      data[COVER_IMAGE_OR_MESSAGE.COVER_IMAGE.ID] = state[COVER_IMAGE_OR_MESSAGE.COVER_IMAGE.ID];
    } else if (state[COVER_IMAGE_OR_MESSAGE.TYPE.ID] === COVER_IMAGE_OR_MESSAGE.TYPE.TYPES[0].value) {
      data[COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.ID] = state[COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.ID];
      data[COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.BACKGROUND_COLOR.ID] =
        state[COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.BACKGROUND_COLOR.ID];
    }
  }
  return data;
};

export const getTimeZoneLabelString = (t) => {
  const { pref_utc_offsetStr, pref_timezone } = store.getState().AdminProfileReducer.adminProfile;
  const { serverData } = store.getState().CoverContentSettingsReducer;
  let timeZone;
  let timeZoneOffset;
  if (jsUtils.nullCheckObject(serverData, 'cover_start_dt')) {
    const { pref_tz, pref_tz_datetime } = serverData.cover_start_dt;
    timeZone = pref_tz;
    timeZoneOffset = parseTimeZoneOffsetFromUTC(pref_tz_datetime);
  } else {
    timeZone = pref_timezone;
    timeZoneOffset = pref_utc_offsetStr;
  }
  return `${t(COVER_IMAGE_OR_MESSAGE.DURATION.TIME_ZONE_LABELS[0])} ${timeZone} (${t(COVER_IMAGE_OR_MESSAGE.DURATION.TIME_ZONE_LABELS[1]) + timeZoneOffset
    })`;
};

export const getUpdatedAccountCoverDetailsDataWithDocuments = (state, showOriginal) => {
  const { cover_type, is_cover } = store.getState().CoverContentSettingsReducer;
  const data = getUpdatedAccountCoverDetailsData(state);
  if (
    is_cover &&
    cover_type === COVER_IMAGE_OR_MESSAGE.TYPE.TYPES[1].value &&
    validatingRequiredFieldInDocuments(state.document_details, DOCUMENT_TYPES.ACCOUNT_COVER_PIC)
  ) {
    data.document_details = {};
    data.document_details.uploaded_doc_metadata = [];
    data.document_details.entity = state.document_details.entity;
    data.document_details.entity_id = state.document_details.entity_id;
    data.document_details.ref_uuid = state.document_details.ref_uuid;
    if (state.document_details.file_metadata) {
      state.document_details.file_metadata.forEach((file_info) => {
        if (file_info.type === DOCUMENT_TYPES.ACCOUNT_COVER_PIC) {
          data.document_details.uploaded_doc_metadata.push({
            upload_signed_url: getFileUrl(file_info?.upload_signed_url),
            type: file_info.type,
            document_id: file_info._id,
          });
          data.acc_cover_pic = file_info._id;
          if (state.acc_cover_pic_id && state.acc_cover_pic_id !== file_info._id) {
            data.document_details.removed_doc_list = [];
            data.document_details.removed_doc_list.push(state.acc_cover_pic_id);
          }
        }
      });
    }
  } else if (is_cover && cover_type === COVER_IMAGE_OR_MESSAGE.TYPE.TYPES[1].value && !showOriginal) data.document_details = state.document_details;
  return data;
};

export const getUpdatedServerDataFromStateData = (serverData, state) => {
  const startAndEndDurations = getStartAndEndDurationInUTC(state);
  return {
    _id: serverData._id,
    [COVER_IMAGE_OR_MESSAGE.VISIBILITY.ID]: state[COVER_IMAGE_OR_MESSAGE.VISIBILITY.ID],
    [COVER_IMAGE_OR_MESSAGE.TYPE.ID]: state[COVER_IMAGE_OR_MESSAGE.TYPE.ID],
    [COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.BACKGROUND_COLOR.ID]:
      state[COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.BACKGROUND_COLOR.ID],
    [COVER_IMAGE_OR_MESSAGE.COVER_IMAGE.ID]: state[COVER_IMAGE_OR_MESSAGE.COVER_IMAGE.ID],
    [COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.ID]: state[COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.ID],
    [COVER_IMAGE_OR_MESSAGE.DURATION.START_DATE_TIME.ID]: {
      ...serverData[COVER_IMAGE_OR_MESSAGE.DURATION.START_DATE_TIME.ID],
      pref_tz_datetime: startAndEndDurations[COVER_IMAGE_OR_MESSAGE.DURATION.START_DATE_TIME.ID],
    },
    [COVER_IMAGE_OR_MESSAGE.DURATION.END_DATE_TIME.ID]: {
      ...serverData[COVER_IMAGE_OR_MESSAGE.DURATION.END_DATE_TIME.ID],
      pref_tz_datetime: startAndEndDurations[COVER_IMAGE_OR_MESSAGE.DURATION.END_DATE_TIME.ID],
    },
  };
};

export const coverContentSettingsOnCancelClickHandler = () => {
  const { serverData } = store.getState().CoverContentSettingsReducer;
  if (serverData[COVER_IMAGE_OR_MESSAGE.VISIBILITY.ID]) {
    store.dispatch(
      coverContentSettingsSetState({
        serverData,
        ...getInitialAccountCoverDetailsData(serverData),
        enableButton: false,
        error_list: [],
        server_error: [],
        common_server_error: EMPTY_STRING,
        isDataLoading: false,
      }),
    );
  } else {
    store.dispatch(coverContentSettingsClearState());
  }
};

export const onCoverSettingsSaveClicked = (history, onFileUpload, showOriginal, currentFileData, t) => {
  const {
    is_cover,
    cover_type,
    enableButton,
    acc_cover_pic,
  } = store.getState().CoverContentSettingsReducer;

  const coverSettingsErrorsFlag = validateCoverDetailsDataAndSetErrorsInState(t);
  if (coverSettingsErrorsFlag) {
    if (is_cover && cover_type === COVER_IMAGE_OR_MESSAGE.TYPE.TYPES[1].value && onFileUpload && currentFileData && !showOriginal) {
      if (acc_cover_pic && acc_cover_pic.files && acc_cover_pic.files && acc_cover_pic.files[0]) {
        onFileUpload(currentFileData);
      } else {
        if (enableButton) {
          store.dispatch(
            updateAccountCoverDetailsApi(history),
          );
        }
      }
    } else if (enableButton) {
      store.dispatch(
        updateAccountCoverDetailsApi(history),
      );
    }
  }
};

export const onCoverSettingsCancelClicked = (setShowOriginalImage) => {
  setShowOriginalImage(true);
  const { enableButton } = store.getState().CoverContentSettingsReducer;
  if (enableButton) coverContentSettingsOnCancelClickHandler();
};

export const modifyServerError = (serverError) => {
  // modifying the date errors
  const updatedServerError = cloneDeep(serverError);
  if (nullCheck(serverError, COVER_IMAGE_OR_MESSAGE.DURATION.START_DATE_TIME.ID)) {
    updatedServerError[COVER_IMAGE_OR_MESSAGE.DURATION.FROM_DATE.ID] =
      serverError[COVER_IMAGE_OR_MESSAGE.DURATION.START_DATE_TIME.ID];
    delete updatedServerError[COVER_IMAGE_OR_MESSAGE.DURATION.START_DATE_TIME.ID];
  }
  if (nullCheck(serverError, COVER_IMAGE_OR_MESSAGE.DURATION.END_DATE_TIME.ID)) {
    updatedServerError[COVER_IMAGE_OR_MESSAGE.DURATION.TO_DATE.ID] =
      serverError[COVER_IMAGE_OR_MESSAGE.DURATION.END_DATE_TIME.ID];
    delete updatedServerError[COVER_IMAGE_OR_MESSAGE.DURATION.END_DATE_TIME.ID];
  }
  return updatedServerError;
};

export default onChangeHandler;
