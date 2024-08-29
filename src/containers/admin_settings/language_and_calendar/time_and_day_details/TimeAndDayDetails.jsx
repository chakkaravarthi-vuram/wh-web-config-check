import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import Dropdown from '../../../../components/form_components/dropdown/Dropdown';
import DayPicker from '../../../../components/form_components/day_picker/DayPicker';
import FormTitle from '../../../../components/form_components/form_title/FormTitle';
import CheckboxGroup from '../../../../components/form_components/checkbox_group/CheckboxGroup';

import {
  L_C_FORM,
  WORKING_HOURS_FROM_TO_DROPDOWN,
} from '../LanguagesAndCalendar.strings';
import { BS } from '../../../../utils/UIConstants';
import { isMobileScreen } from '../../../../utils/UtilityFunctions';

function TimeAndDayDetails(props) {
  const {
    formDetails,
    onChange,
    getTimeZoneLookUpData,
    errors,
    isDataLoading,
    onDayClick,
    onChangeToggler,
    LangAndTimeDetailsLabels,
    dayPickerBoxStyles,
  } = props;
  const { t } = useTranslation();

  useEffect(() => {
    getTimeZoneLookUpData();
  }, []);

  return (
    <>
      <FormTitle categoryFontStyle={LangAndTimeDetailsLabels} isDataLoading={isDataLoading}>
        {t(L_C_FORM.TIME_DAY_DETAILS)}
      </FormTitle>
      <Row>
        <Col sm={12} lg={6}>
          <Dropdown
            id={L_C_FORM.TZ_DROPDOWN.ID}
            optionList={formDetails.timezone_list}
            label={t(L_C_FORM.TZ_DROPDOWN.LABEL)}
            onChange={onChange}
            isTimeZone
            placeholder={t(L_C_FORM.TZ_DROPDOWN.PLACEHOLDER)}
            selectedValue={formDetails[L_C_FORM.TZ_DROPDOWN.ID]}
            isDataLoading={isDataLoading}
            setSelectedValue
          />
        </Col>
        <Col sm={12} lg={6} className={BS.M_AUTO}>
          <CheckboxGroup
            id={L_C_FORM.TIME_ZONE_CB.ID}
            label={L_C_FORM.TIME_ZONE_CB.ID}
            optionList={L_C_FORM.TIME_ZONE_CB(t).OPTION_LIST}
            onClick={() =>
              onChangeToggler(
                L_C_FORM.RESTRICT_TIMEZONE_UPDATE,
                formDetails.allow_update_timezone,
              )
            }
            selectedValues={formDetails.allow_update_timezone ? [1] : []}
            isDataLoading={isDataLoading}
            key="language_details_cb2"
            hideLabel
            hideMessage={!isMobileScreen()}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={12} lg={8}>
          <DayPicker
            id="working_days"
            label={t(L_C_FORM.WORKING_DAYS.LABEL)}
            selectedDays={formDetails.working_days}
            onDayClick={onDayClick}
            errorMessage={errors[L_C_FORM.WORKING_DAYS.ID]}
            isDataLoading={isDataLoading}
            dayPickerBoxStyles={dayPickerBoxStyles}
          />
        </Col>
        <Col sm={12} lg={8}>
          <Row>
            <Col sm={6} lg={4} xs={6}>
              <Dropdown
                id={L_C_FORM.WORKING_HOURS_FROM_DROPDOWN.ID}
                optionList={WORKING_HOURS_FROM_TO_DROPDOWN}
                label={t(L_C_FORM.WORKING_HOURS_FROM_DROPDOWN.LABEL)}
                onChange={onChange}
                placeholder={t(L_C_FORM.WORKING_HOURS_FROM_DROPDOWN.PLACEHOLDER)}
                selectedValue={
                  formDetails[L_C_FORM.WORKING_HOURS_FROM_DROPDOWN.ID]
                }
                errorMessage={errors[L_C_FORM.WORKING_HOURS_FROM_DROPDOWN.ID]}
                isDataLoading={isDataLoading}
              />
            </Col>
            <Col sm={6} lg={4} xs={6}>
              <Dropdown
                optionList={WORKING_HOURS_FROM_TO_DROPDOWN}
                id={L_C_FORM.WORKING_HOURS_TO_DROPDOWN.ID}
                onChange={onChange}
                placeholder={L_C_FORM.WORKING_HOURS_TO_DROPDOWN.PLACEHOLDER}
                selectedValue={
                  formDetails[L_C_FORM.WORKING_HOURS_TO_DROPDOWN.ID]
                }
                errorMessage={errors[L_C_FORM.WORKING_HOURS_TO_DROPDOWN.ID]}
                isDataLoading={isDataLoading}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
TimeAndDayDetails.defaultProps = {
  formDetails: {},
  onChange: null,
  getLookupForSelectedDropDown: null,
  errors: {},
  isDataLoading: false,
};

TimeAndDayDetails.propTypes = {
  formDetails: PropTypes.objectOf(PropTypes.any),
  onChange: PropTypes.func,
  getLookupForSelectedDropDown: PropTypes.func,
  errors: PropTypes.objectOf(PropTypes.any),
  isDataLoading: PropTypes.bool,
  onDayClick: PropTypes.func.isRequired,
  onChangeToggler: PropTypes.func.isRequired,
};
export default TimeAndDayDetails;
