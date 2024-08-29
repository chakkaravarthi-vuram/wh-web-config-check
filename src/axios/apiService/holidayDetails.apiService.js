import axios from 'axios';

import { getCancelTokenHolidayFromDatePicker } from 'redux/actions/HolidayList.Action';
import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';
import { HOLIDAY_DETAILS, ADD_NEW_HOLIDAY, DELETE_HOLIDAY } from '../../urls/ApiUrls';
import {
  getCancelTokenHolidayDetails,
  getCancelTokencancelForAddingNewHoliday,
  getCancelTokenDeleteHoliday,
} from '../../containers/admin_settings/language_and_calendar/holidays/Holidays';
import {
  normalizeHolidayData,
  normalizeHolidayUpdateData,
  normalizeHolidayDeleteData,
} from '../apiNormalizer/holidayDetails.apiNormalizer';
import { getLoaderConfig } from '../../utils/UtilityFunctions';

const { CancelToken } = axios;

export const getHolidayData = (params, isFromDatePicker) => new Promise((resolve, reject) => {
    axiosGetUtils(
      HOLIDAY_DETAILS,
      { params },
      {
        cancelToken: new CancelToken((c) => {
          if (isFromDatePicker) getCancelTokenHolidayFromDatePicker(c);
          else getCancelTokenHolidayDetails(c);
        }),
      },
    )
      .then((response) => {
        resolve(normalizeHolidayData(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const updateHolidayData = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(ADD_NEW_HOLIDAY, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        getCancelTokencancelForAddingNewHoliday(c);
      }),
    })
      .then((response) => {
        const normalizedData = normalizeHolidayUpdateData(response);
        resolve(normalizedData);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteHolidayData = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_HOLIDAY, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        getCancelTokenDeleteHoliday(c);
      }),
    })
      .then((response) => {
        const normalizedData = normalizeHolidayDeleteData(response);
        resolve(normalizedData);
      })
      .catch((error) => {
        reject(error);
      });
  });

export default getHolidayData;
