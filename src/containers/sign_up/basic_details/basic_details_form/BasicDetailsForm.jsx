import React, { useState } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { evaluateAriaLabelMessage } from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import Input, { INPUT_VARIANTS } from '../../../../components/form_components/input/Input';
import Button from '../../../../components/form_components/button/Button';
// import OnethingLogo from '../../../../assets/icons/OnethingLogo';
import Alert from '../../../../components/form_components/alert/Alert';

import gClasses from '../../../../scss/Typography.module.scss';

import { BUTTON_TYPE } from '../../../../utils/Constants';
import { BASIC_DETAIL_STRINGS } from '../BasicDetails.strings';
import { BS, ARIA_ROLES } from '../../../../utils/UIConstants';

function BasicDetailsForm(props) {
  const { errors, formDetails } = props;

  const { error_for_otp } = props;

  const { testId, onChange, onBlur, onContinueClick } = props;

  const [focusOnErrorRefresher, setFocusOnErrorRefresher] = useState(false);

  const { t } = useTranslation();

  const handleSubmit = (event) => {
    onContinueClick(event);
    if (errors[BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.ID] || errors[BASIC_DETAIL_STRINGS.ACCOUNT_DOMAIN_ID] || formDetails.common_server_error || error_for_otp) setFocusOnErrorRefresher((refresher) => !refresher);
  };

  return (
    <>
      <h1 className={cx(gClasses.FTwo24GrayV3, BS.TEXT_CENTER, gClasses.FontWeight600)}>
        {t(BASIC_DETAIL_STRINGS.TITLE)}
      </h1>
      <form className={gClasses.MT30} data-test={testId}>
        <Input
          id={BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.ID}
          name={BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.ID}
          label={t(BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.LABEL)}
          labelClass={gClasses.FTwo12BlackV13}
          placeholder={BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.PLACEHOLDER}
          value={formDetails.email}
          errorMessage={errors[BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.ID] || errors[BASIC_DETAIL_STRINGS.ACCOUNT_DOMAIN_ID]}
          onChangeHandler={onChange(BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.ID)}
          onBlurHandler={onBlur(BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.ID)}
          onKeyDownHandler={(e) => { // on clicking enter key, it is same as clicking enter button
            if (e.keyCode === 13) onContinueClick(e);
          }}
          inputVariant={INPUT_VARIANTS.TYPE_3}
          testId={BASIC_DETAIL_STRINGS.EMAIL_INPUT}
          innerClass={cx(gClasses.FTwo12BlackV1, gClasses.FontWeight500)}
          hideMessage={errors[BASIC_DETAIL_STRINGS.ACCOUNT_DOMAIN_ID]}
          required
          focusOnError
          ariaLabelHelperMessage={evaluateAriaLabelMessage(errors[BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.ID] || errors[BASIC_DETAIL_STRINGS.ACCOUNT_DOMAIN_ID])}
          focusOnErrorRefresher={focusOnErrorRefresher}
          helperAriaHidden={errors[BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.ID] && true}
        />
        {errors[BASIC_DETAIL_STRINGS.ACCOUNT_DOMAIN_ID] && (
          <div className={cx(gClasses.MT10, gClasses.FTwo12RedV8, gClasses.MB20)}>
            {BASIC_DETAIL_STRINGS.EXIST_ACCOUNT_INFO}
            <span className={gClasses.FTwo12BlueV2}>{BASIC_DETAIL_STRINGS.SUPPORT_EMAIL}</span>
          </div>
          )}
        <Alert role={ARIA_ROLES.ALERT} content={formDetails.common_server_error || error_for_otp} className={cx(gClasses.MT5, gClasses.MB15)} />
        <Button
          id={BASIC_DETAIL_STRINGS.CONTINUE_BUTTON.ID}
          buttonType={BUTTON_TYPE.AUTH_PRIMARY}
          className={cx(gClasses.MT5)}
          onClick={handleSubmit}
          data-test={BASIC_DETAIL_STRINGS.CONTINUE_BUTTON.DATA_TEST}
          width100
        >
          {t(BASIC_DETAIL_STRINGS.START)}
        </Button>
      </form>
    </>
  );
}
BasicDetailsForm.propTypes = {
  error_for_otp: PropTypes.objectOf(),
  formDetails: PropTypes.objectOf().isRequired,
  errors: PropTypes.objectOf().isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  onContinueClick: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
};
BasicDetailsForm.defaultProps = {
  error_for_otp: null,
};
export default BasicDetailsForm;
