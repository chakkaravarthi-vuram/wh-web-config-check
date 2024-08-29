import moment from 'moment';
import { isEmpty } from 'utils/jsUtility';
import { getHolidayData } from 'axios/apiService/holidayDetails.apiService';
import { DATE } from 'utils/Constants';
import { store } from '../../Store';
import { HOLIDAY_LIST } from './ActionConstants';

const updateHolidayList = (list) => {
    return {
        type: HOLIDAY_LIST.DATA_CHANGE,
        payload: list,
    };
};
let cancelForHolidayDetails;
export const getCancelTokenHolidayFromDatePicker = (cancelToken) => {
    cancelForHolidayDetails = cancelToken;
};
export const getHolidayListDataThunk = (year) => (dispatch) => new Promise((resolve) => {
    const { holiday_list } = store.getState().HolidayListReducer;
    let holidayData = {};
    let index;
    if (!isEmpty(holiday_list)) {
        index = holiday_list.findIndex((data) => (data.year === year));
        if (index > -1) {
            holidayData = holiday_list[index];
            if (!holidayData.isLoading && (!isEmpty(holidayData.holidays) || holidayData.isApiCalled)) {
                return resolve(holiday_list);
            }
        } else {
            holidayData = {
                year,
                isLoading: true,
                holidays: [],
            };
            holiday_list.push(holidayData);
        }
    } else {
        holidayData = {
            year,
            isLoading: true,
            holidays: [],
        };
        holiday_list.push(holidayData);
    }
    if (cancelForHolidayDetails) cancelForHolidayDetails();
    dispatch(updateHolidayList(holiday_list));
    getHolidayData({ year }, true)
        .then((normalizedData) => {
            const holidays = [];
            if (!isEmpty(normalizedData)) {
                console.log(normalizedData, moment('2022-01-14T00:00:00.000Z'), 'normalizedData');

                normalizedData.map(({ date }) => {
                    const holidayDate = moment(date).format(DATE.DATE_FORMAT);
                    holidays.push(holidayDate);
                    return null;
                });
            }
            index = holiday_list.findIndex((data) => (data.year === year));
            if (index > -1) {
                holidayData = holiday_list[index];
                holidayData = {
                    ...holidayData,
                    isLoading: false,
                    holidays,
                    isApiCalled: true,
                };
                holiday_list[index] = holidayData;

                dispatch(updateHolidayList(holiday_list));
            }
            return resolve(holiday_list);
        })
        .catch(() => {
            index = holiday_list.findIndex((data) => (data.year === year));
            if (index > -1) {
                holidayData = holiday_list[index];
                holidayData = {
                    ...holidayData,
                    isLoading: false,
                    holidays: [],
                };
                holiday_list[index] = holidayData;
                dispatch(updateHolidayList(holiday_list));
            }
        });
        return resolve([]);
});
