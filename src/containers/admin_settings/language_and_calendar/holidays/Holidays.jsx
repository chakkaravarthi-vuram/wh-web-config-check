import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { cloneDeep, isEmpty } from 'lodash';
import { withTranslation } from 'react-i18next';
import HolidayTable from './holiday_table/HolidayTable';
import Dropdown from '../../../../components/form_components/dropdown/Dropdown';
import FormTitle from '../../../../components/form_components/form_title/FormTitle';

import { YEAR_DROPDOWN, L_C_FORM } from '../LanguagesAndCalendar.strings';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { HOLIDAY_TABLE } from './holiday_table/HolidayTable.strings';
import { validate, mergeObjects } from '../../../../utils/UtilityFunctions';
import { holidayDetailsValidateSchema } from './Holiday.validation.schema';
import {
  getHolidayDataThunk,
  holidayDataChangeAction,
  updateHolidayDataThunk,
  deleteHolidayDataThunk,
  clearHolidayDataAction,
} from '../../../../redux/actions/HolidayDetails.Action';
import styles from './Holidays.module.scss';
import { KEY_CODES } from '../../../../utils/Constants';

let cancelForHolidayDetails;
let cancelForAddingNewHoliday;
let cancelForDeletingHoliday;

export const getCancelTokenDeleteHoliday = (cancelToken) => {
  cancelForDeletingHoliday = cancelToken;
};

export const getCancelTokenHolidayDetails = (cancelToken) => {
  cancelForHolidayDetails = cancelToken;
};

export const getCancelTokencancelForAddingNewHoliday = (cancelToken) => {
  cancelForAddingNewHoliday = cancelToken;
};
class Holidays extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const yearData = { year: YEAR_DROPDOWN[0].label };
    dispatch(holidayDataChangeAction(yearData)).then(() => {
      const { year } = this.props;
      this.getHolidaysFromYear(year);
    });
  }

  componentWillUnmount() {
    if (cancelForHolidayDetails) cancelForHolidayDetails();
    if (cancelForAddingNewHoliday) cancelForAddingNewHoliday();
    if (cancelForDeletingHoliday) cancelForDeletingHoliday();
    const { clearHolidayData } = this.props;
    clearHolidayData();
  }

  render() {
    const {
      error_list,
      server_error,
      year,
      holiday_list,
      date,
      occasion,
      add_new_occasion,
      isDataLoading,
      langAndTimeDetailsLabels,
      t,
    } = this.props;
    const errors = mergeObjects(error_list, server_error);
    return (
      <>
        <FormTitle categoryFontStyle={langAndTimeDetailsLabels} isDataLoading={isDataLoading}>{t(L_C_FORM.HOLIDAYS)}</FormTitle>
        <div className={styles.DropdownWidth}>
          <Dropdown
            optionList={YEAR_DROPDOWN}
            onChange={this.onYearChangeHandler}
            label={t(L_C_FORM.YEAR_DROPDOWN.LABEL)}
            id={L_C_FORM.YEAR_DROPDOWN.ID}
            placeholder={t(L_C_FORM.YEAR_DROPDOWN.PLACEHOLDER)}
            selectedValue={year}
            isDataLoading={isDataLoading}
          />
        </div>
        <HolidayTable
          holidayList={holiday_list}
          onChangeHandler={this.onChangeHandler}
          getDate={this.getDate}
          date={date}
          occasion={occasion}
          deleteCurrentOccasion={this.deleteCurrentOccasion}
          addNewOccasionClicked={this.addNewOccasionClicked}
          addNewOccasion={add_new_occasion}
          updateNewOccasion={this.updateNewOccasion}
          deleteOccasion={this.deleteOccasion}
          errors={errors}
          selectedYear={year}
          onKeyDownHandler={this.onKeyDownHandler}
          isDataLoading={isDataLoading}
        />
      </>
    );
  }

  onChangeHandler = (event) => {
    const { dispatch, holidayDataChange, t } = this.props;
    const data = {
      [event.target.id]: event.target.value,
    };
    dispatch(holidayDataChangeAction(data)).then(() => {
      const { error_list } = this.props;
      if (!isEmpty(error_list)) {
        holidayDataChange({
          error_list: validate(this.getHolidayDetailsValidateData(), holidayDetailsValidateSchema(t)),
        });
      }
    });
  };

  onYearChangeHandler = (event) => {
    const { server_error, year, dispatch } = this.props;
    let { add_new_occasion } = { ...this.props };
    const prev_year = year;
    if (event.target.value !== year) add_new_occasion = false;
    if (!isEmpty(server_error.date)) server_error.date = EMPTY_STRING;
    const data = {
      [event.target.id]: event.target.value,
      occasion: EMPTY_STRING,
      date: EMPTY_STRING,
      add_new_occasion,
      server_error,
    };
    dispatch(holidayDataChangeAction(data)).then(() => {
      const holidays_state = { ...this.props };
      if (holidays_state.year !== prev_year) this.getHolidaysFromYear(holidays_state.year);
    });
  };

  onKeyDownHandler = (event) => {
    if (event.keyCode === KEY_CODES.ENTER) {
      event.preventDefault();
      this.updateNewOccasion();
    }
  };

  getDataForAddNewHoliday = () => {
    const { occasion, date } = this.props;
    return {
      [HOLIDAY_TABLE.OCCASION_INPUT.ID]: occasion.trim(),
      [HOLIDAY_TABLE.DATE.ID]: date,
    };
  };

  getHolidayDetailsValidateData = () => {
    const { occasion, date } = this.props;
    return {
      [HOLIDAY_TABLE.OCCASION_INPUT.ID]: occasion.trim(),
      [HOLIDAY_TABLE.DATE.ID]: date,
    };
  };

  deleteCurrentOccasion = () => {
    const { holidayDataChange } = this.props;
    holidayDataChange({
      add_new_occasion: false,
      occasion: EMPTY_STRING,
      date: null,
      error_list: [],
      server_error: [],
    });
  };

  addNewOccasionClicked = () => {
    const { holidayDataChange } = this.props;
    holidayDataChange({
      add_new_occasion: true,
    });
  };

  deleteOccasion = (id) => {
    const data = {
      _id: id,
    };
    const { year, dispatch } = this.props;
    dispatch(deleteHolidayDataThunk(data)).then(() => {
      this.getHolidaysFromYear(year);
    });
  };

  updateNewOccasion = () => {
    const { updateHolidayData, dispatch, t } = this.props;
    const errorListData = {
      error_list: validate(this.getHolidayDetailsValidateData(), holidayDetailsValidateSchema(t)),
    };
    dispatch(holidayDataChangeAction(errorListData)).then(() => {
      const { error_list } = this.props;
      console.log('error list of if', isEmpty(error_list));
      if (isEmpty(error_list)) {
        const data = this.getDataForAddNewHoliday();
        console.log('data before update', data);
        updateHolidayData(data);
      }
    });
  };

  getHolidaysFromYear = (year) => {
    const { getHolidayData } = this.props;
    getHolidayData({ year });
  };

  getDate = (newDate) => {
    const { server_error } = cloneDeep(this.props);
    const { dispatch, holidayDataChange, t } = this.props;
    if (!isEmpty(server_error.date)) server_error.date = EMPTY_STRING;
    const data = { date: newDate, server_error };
    dispatch(holidayDataChangeAction(data)).then(() => {
      const { error_list } = this.props;
      if (!isEmpty(error_list)) {
        holidayDataChange({
          error_list: validate(this.getHolidayDetailsValidateData(), holidayDetailsValidateSchema(t)),
        });
      }
    });
  };
}

Holidays.propTypes = {
  isDataLoading: PropTypes.bool.isRequired,
  year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  occasion: PropTypes.string.isRequired,
  date: PropTypes.string,
  add_new_occasion: PropTypes.bool.isRequired,
  error_list: PropTypes.arrayOf(PropTypes.any).isRequired,
  server_error: PropTypes.arrayOf(PropTypes.any).isRequired,
  holiday_list: PropTypes.arrayOf(PropTypes.any).isRequired,
  getHolidayData: PropTypes.func.isRequired,
  holidayDataChange: PropTypes.func.isRequired,
  updateHolidayData: PropTypes.func.isRequired,
  clearHolidayData: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};
Holidays.defaultProps = {
  date: EMPTY_STRING,
};

const mapStateToProps = (state) => {
  const {
    year,
    occasion,
    date,
    add_new_occasion,
    error_list,
    server_error,
    common_server_error,
    holiday_list,
  } = state.HolidayDetailsReducer;

  return {
    year,
    occasion,
    date,
    add_new_occasion,
    error_list,
    server_error,
    common_server_error,
    holiday_list,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getHolidayData: (value) => {
      dispatch(getHolidayDataThunk(value));
      return Promise.resolve();
    },
    holidayDataChange: (value) => {
      dispatch(holidayDataChangeAction(value));
      return Promise.resolve();
    },
    updateHolidayData: (value) => {
      dispatch(updateHolidayDataThunk(value));
      return Promise.resolve();
    },
    deleteHolidayData: (value) => {
      dispatch(deleteHolidayDataThunk(value));
    },
    clearHolidayData: (value) => {
      dispatch(clearHolidayDataAction(value));
    },

    dispatch,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Holidays));
