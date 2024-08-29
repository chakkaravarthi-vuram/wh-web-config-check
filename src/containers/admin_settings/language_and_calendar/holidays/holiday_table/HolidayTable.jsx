/**
 * @author Asttle
 * @email asttlej@vuram.com
 * @create date 2020-01-29 18:13:46
 * @modify date 2020-01-29 18:13:46
 * @desc [description]
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import cx from 'classnames/bind';
import moment from 'moment';
import { DATE } from 'utils/Constants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import CorrectIconV2 from 'assets/icons/form_fields/CorrectIconV2';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../../../hoc/ThemeContext';
import Input, { INPUT_VARIANTS } from '../../../../../components/form_components/input/Input';
import DateTimeWrapper from '../../../../../components/date_time_wrapper/DateTimeWrapper';
import AddIcon from '../../../../../assets/icons/AddIcon';
import HolidaysTableContentLoader from '../../../../../components/content_loaders/admin_settings_content_loaders/HolidaysTableContentLoader';

import { TABLE } from '../Holidays.strings';
import {
  HOLIDAY_TABLE, ICON_STRINGS, HOLIDAY_DATE,
} from './HolidayTable.strings';

import gClasses from '../../../../../scss/Typography.module.scss';
import { ARIA_ROLES, BS } from '../../../../../utils/UIConstants';
import styles from './HolidayTable.module.scss';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { getFormattedDateFromUTC } from '../../../../../utils/dateUtils';

function HolidayTable(props) {
  const { buttonColor } = useContext(ThemeContext);
  const {
    holidayList,
    errors,
    deleteOccasion,
    addNewOccasion,
    addNewOccasionClicked,
    occasion,
    date,
    onChangeHandler,
    onKeyDownHandler,
    getDate,
    selectedYear,
    deleteCurrentOccasion,
    updateNewOccasion,
    isDataLoading,
  } = props;
  const { t } = useTranslation();
  let holiday_list = null;
  if (holidayList?.length) {
    holiday_list = holidayList.map((holiday) => (
      <tr key={holiday._id} className={cx(gClasses.FOne13GrayV2, gClasses.OverflowXAuto)}>
        <td className={cx(gClasses.Ellipsis, styles.TextInput)}>
          {holiday.occasion}
        </td>
        <td className={cx(BS.JC_BETWEEN, BS.D_FLEX, styles.DateInput)}>
          {getFormattedDateFromUTC(holiday.date, HOLIDAY_DATE)}
          <div className={cx(styles.DeleteIconContainer, BS.D_FLEX, BS.JC_CENTER, BS.ALIGN_ITEM_CENTER)}>
            <DeleteIconV2
              onClick={() => deleteOccasion(holiday._id)}
              title={t(ICON_STRINGS.DELETE_ICON)}
              className={cx(gClasses.CursorPointer, styles.DeleteIcon)}
            />
          </div>
        </td>
      </tr>
    ));
  } else if (!addNewOccasion) {
    holiday_list = (
      <tr className={cx(gClasses.FOne13BlackV5, gClasses.Italics, gClasses.OverflowXAuto)}>
        <td className={BS.TEXT_CENTER}>{t(HOLIDAY_TABLE.NO_DATA_FOUND)}</td>
      </tr>
    );
  }
  let add_new_occasion = null;
  let show_add_occasion = (
    <div className={cx(BS.D_FLEX, BS.JC_CENTER, styles.AddNewOccasionClass)}>
      <button
        id={t(ICON_STRINGS.ADD_ICON)}
        className={cx(
          gClasses.CenterV,
          gClasses.CursorPointer,
          gClasses.ClickableElement,
        )}
        onClick={addNewOccasionClicked}
      >
        <AddIcon
          title={t(ICON_STRINGS.ADD_ICON)}
          className={cx(gClasses.MR5)}
          style={{ fill: buttonColor }}
          role={ARIA_ROLES.IMG}
        />
        <div className={cx(gClasses.FTwo13, gClasses.FontWeight500)} style={{ color: buttonColor }}>
          {t(HOLIDAY_TABLE.ADD_NEW)}
        </div>
      </button>
    </div>
  );

  if (addNewOccasion) {
    const datePickerValidations = {
      date_selection: [{
        type: 'date',
        sub_type: 'between',
        start_date: moment.utc(`${selectedYear}-01-01`, DATE.DATE_FORMAT).format(),
        end_date: moment.utc(`${selectedYear}-12-31`, DATE.DATE_FORMAT).format(),
      }],
    };
    add_new_occasion = (
      <tr className={cx(gClasses.OverflowXAuto, gClasses.ScrollBar)}>
        <td className={styles.TextInput}>
          <div>
            <Input
              inputVariant={INPUT_VARIANTS.TYPE_5}
              value={occasion}
              placeholder={t(HOLIDAY_TABLE.OCCASION_INPUT.PLACEHOLDER)}
              id={HOLIDAY_TABLE.OCCASION_INPUT.ID}
              onChangeHandler={onChangeHandler}
              errorMessage={errors[HOLIDAY_TABLE.OCCASION_INPUT.ID]}
              onKeyDownHandler={onKeyDownHandler}
              hideLabel
              hideMessage={!errors[HOLIDAY_TABLE.OCCASION_INPUT.ID]}
              className={styles.FormFieldInput}
              autoFocus
            />
          </div>
        </td>
        <td className={cx(BS.D_FLEX, BS.JC_BETWEEN, styles.DateInput)}>
          <div
            className={BS.P_RELATIVE}
          >
            <DateTimeWrapper
              id={HOLIDAY_TABLE.DATE.ID}
              date={date}
              getDate={getDate}
              errorMessage={errors[HOLIDAY_TABLE.DATE.ID]}
              validations={datePickerValidations}
              className={gClasses.FlexGrow1}
              hideMessage={!errors[HOLIDAY_TABLE.DATE.ID]}
              hideLabel
              fixedStrategy
              noISOString
              isTable
            />
          </div>
          <div className={cx(BS.D_FLEX, BS.JC_END, gClasses.MT7)}>
            <div className={cx(styles.DeleteIconContainer, BS.D_FLEX, BS.JC_CENTER, BS.ALIGN_ITEM_CENTER, gClasses.ML15)}>
              <DeleteIconV2
                id={HOLIDAY_TABLE.ACTIVE_DELETE_ICON_ID}
                className={cx(gClasses.CursorPointer, styles.DeleteIcon)}
                onClick={deleteCurrentOccasion}
                title={t(ICON_STRINGS.DELETE_ICON)}
              />
            </div>
            <div className={cx(gClasses.ML15, styles.DeleteIconContainer, BS.D_FLEX, BS.JC_CENTER, BS.ALIGN_ITEM_CENTER)}>
              <CorrectIconV2
                id={HOLIDAY_TABLE.ACTIVE_CORRECT_ICON_ID}
                className={cx(gClasses.CursorPointer, styles.CorrectIcon)}
                onClick={updateNewOccasion}
                keydown={(e) => keydownOrKeypessEnterHandle(e) && updateNewOccasion(e)}
                title={t(ICON_STRINGS.CORRECT_ICON)}
                isButtonColor
                role={ARIA_ROLES.BUTTON}
                tabIndex={0}
              />
            </div>
          </div>
        </td>
      </tr>
    );
    show_add_occasion = null;
  }

  return (
    isDataLoading ? (
      <HolidaysTableContentLoader count={3} />
    ) : (
      <div className={cx(BS.TABLE_RESPONSIVE, gClasses.ScrollBar)}>
        <Table className={cx(styles.Table)}>
          <thead>
            <tr className={gClasses.FTwo13GrayV53}>
              <td className={styles.TextInput}>{t(TABLE.OCCASION)}</td>
              <td className={styles.DateInput}>{t(TABLE.DATE)}</td>
            </tr>
          </thead>
          <tbody className={styles.TableBodyContainer}>
            {holiday_list}
            {add_new_occasion}
          </tbody>
        </Table>
        {show_add_occasion}
      </div>
    )
  );
}

HolidayTable.defaultProps = {
  holidayList: [],
  occasion: EMPTY_STRING,
  date: EMPTY_STRING,
  selectedYear: EMPTY_STRING,
  isDataLoading: false,
};

HolidayTable.propTypes = {
  errors: PropTypes.objectOf(PropTypes.any).isRequired,
  holidayList: PropTypes.arrayOf(PropTypes.any),
  deleteOccasion: PropTypes.func.isRequired,
  addNewOccasion: PropTypes.bool.isRequired,
  addNewOccasionClicked: PropTypes.func.isRequired,
  occasion: PropTypes.string,
  date: PropTypes.string,
  onChangeHandler: PropTypes.func.isRequired,
  onKeyDownHandler: PropTypes.func.isRequired,
  getDate: PropTypes.func.isRequired,
  deleteCurrentOccasion: PropTypes.func.isRequired,
  updateNewOccasion: PropTypes.func.isRequired,
  selectedYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isDataLoading: PropTypes.bool,
};

export default HolidayTable;
