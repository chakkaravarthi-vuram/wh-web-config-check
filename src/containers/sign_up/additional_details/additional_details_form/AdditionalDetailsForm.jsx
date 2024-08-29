import React, { useState } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from 'components/auth_layout/AuthLayout.module.scss';
import Dropdown from 'components/form_components/dropdown/Dropdown';
// import PasswordEye from 'assets/icons/PasswordEye';
import PasswordEyeOpen from 'assets/icons/PasswordEyeNew';
import PasswordHint from 'components/password_hint/PasswordHint';
import { evaluateAriaLabelMessage, evaluateFocusOnError } from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import Input, { INPUT_VARIANTS } from '../../../../components/form_components/input/Input';
import Button from '../../../../components/form_components/button/Button';
import Alert from '../../../../components/form_components/alert/Alert';

import { BUTTON_TYPE } from '../../../../utils/Constants';
import { ADDITIONAL_DETAILS_STRINGS, yourRoleDropdown } from '../AdditionalDetails.strings';
// import { BASIC_DETAIL_STRINGS } from '../../basic_details/BasicDetails.strings';
import { INPUT_TYPES, BS, ARIA_ROLES } from '../../../../utils/UIConstants';
// import { ERROR_CODES_STRINGS } from '../../../../utils/strings/CommonStrings';
import gClasses from '../../../../scss/Typography.module.scss';
import CustomLink from '../../../../components/form_components/link/Link';

function AdditionalDetailsForm(props) {
  const { errors, formDetails, testId, onChange, onBlur, email, onSignUpClicked, onClickingEditDomain, account_domain, isPopperOpen, onFocus } = props;
  const [onEyeClick, setOnEyeClick] = useState(false);
  const [referencePopperElement, setReferencePopperElement] = useState(null);
  const sectionTitleClass = cx(
    gClasses.FontWeight600,
    gClasses.FTwo14GrayV3,
    gClasses.MB10,
    gClasses.MT5,
  );

  const previewIconButton = () => {
    setOnEyeClick(!onEyeClick);
  };

  // const onMouseLeaveHandler = () => {
  //   setOnEyeClick(false);
  // };

  const allFormFieldIdsInAccessibleOrder = [
    ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID,
    ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.FIRST_NAME.ID,
    ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.LAST_NAME.ID,
    ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.ID,
    ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.USER_NAME.ID,
    ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.ID,
  ];

  const [focusOnErrorFieldId, setfocusOnErrorFieldId] = useState(null);
  const [focusOnErrorRefresher, setFocusOnErrorRefresher] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (event) => {
    onSignUpClicked(event, (errors) => {
      setfocusOnErrorFieldId((previous_value) => {
         const currentFocusableFieldId = evaluateFocusOnError(allFormFieldIdsInAccessibleOrder, errors);
         if (previous_value === currentFocusableFieldId) setFocusOnErrorRefresher((refresher) => !refresher);
        return currentFocusableFieldId;
      });
    });
  };

  return (
    <>
      <h1 className={cx(gClasses.FTwo24GrayV3, BS.TEXT_CENTER, gClasses.FontWeight600)}>
        {t(ADDITIONAL_DETAILS_STRINGS.TITLE)}
      </h1>
      <div className={gClasses.PX10}>
        <div className={cx(gClasses.MT20, gClasses.FTwo12, BS.TEXT_CENTER)}>
          <span className={cx(gClasses.FontWeight400, gClasses.GrayV2)}>
            {' '}
            {t(ADDITIONAL_DETAILS_STRINGS.SUB_TITLE)}
          </span>
          <span className={cx(gClasses.FontWeight500, gClasses.GrayV3)}>{email}</span>
        </div>
        <div className={cx(gClasses.MT20, BS.TEXT_CENTER)}>
          <div
          className={gClasses.FTwo12GrayV2}
          id={`${ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID}_label`}
          aria-label={t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ARIA_LABEL)}
          >
            {t(ADDITIONAL_DETAILS_STRINGS.CUSTOM_WORKHALL_URL)}
          </div>
          {(formDetails.urlEditable || errors[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID]) && (
            <Input
              id={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID}
              placeholder={t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.PLACEHOLDER)}
              value={formDetails.account_domain}
              onChangeHandler={(e) => onChange(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID, e)}
              onBlurHandler={onBlur(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID)}
              readOnlySuffix={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.SUFFIX}
              readOnlyPrefix={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.PREFIX}
              readOnlyPrefixAriaHidden="true"
              readOnlySuffixAriaHidden="true"
              errorMessage={errors[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID]}
              onKeyDownHandler={(e) => { // on clicking enter key, it is same as clicking enter button
                if (e.keyCode === 13) handleSubmit(e);
              }}
              inputVariant={INPUT_VARIANTS.TYPE_3}
              testId={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.TEST_ID}
              className={styles.InputDomainUrl}
              inputContainerClasses={styles.InputDomainUrlInner}
              innerClass={gClasses.PL25}
              hideLabel
              hideBorder
              autoFocus
              focusOnError={focusOnErrorFieldId === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID}
              focusOnErrorRefresher={focusOnErrorRefresher}
              ariaLabelHelperMessage={evaluateAriaLabelMessage(errors[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID])}
              helperAriaHidden={focusOnErrorFieldId === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID && true}
              labelIdIfHideLabel={`${ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID}_label`}
            />
          )}
          {(!formDetails.urlEditable && !errors[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID]) && (
            <div className={cx(gClasses.FTwo12GrayV2, gClasses.FontWeight600, gClasses.WordBreakBreakWord, gClasses.MT3)}>
              {ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.PREFIX}
              {account_domain}
              {ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.SUFFIX}
            </div>
          )}
          {(!formDetails.urlEditable && !errors[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID]) && (
            <CustomLink id={ADDITIONAL_DETAILS_STRINGS.CHANGE_EMAIL} className={cx(gClasses.FTwo13, gClasses.FontWeight500)} onClick={onClickingEditDomain}>
              {t(ADDITIONAL_DETAILS_STRINGS.CHANGE_EMAIL)}
            </CustomLink>
          )}
        </div>
        <form
        className={gClasses.MT15}
        data-test={testId}
        onSubmit={() => false}
        >
          <div className={sectionTitleClass}>{t(ADDITIONAL_DETAILS_STRINGS.ACCOUNT_DETAILS)}</div>
          <Input
            id={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.FIRST_NAME.ID}
            label={t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.FIRST_NAME.LABEL)}
            placeholder={t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.FIRST_NAME.PLACEHOLDER)}
            value={formDetails.first_name}
            onChangeHandler={(e) => onChange(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.FIRST_NAME.ID, e)}
            onBlurHandler={onBlur(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.FIRST_NAME.ID)}
            errorMessage={errors[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.FIRST_NAME.ID]}
            onKeyDownHandler={(e) => { // on clicking enter key, it is same as clicking enter button
              if (e.keyCode === 13) handleSubmit(e);
            }}
            inputVariant={INPUT_VARIANTS.TYPE_3}
            testId={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.FIRST_NAME.TEST_ID}
            inputContainerClasses={styles.InputPadding}
            autoFocus
            focusOnError={focusOnErrorFieldId === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.FIRST_NAME.ID}
            focusOnErrorRefresher={focusOnErrorRefresher}
            ariaLabelHelperMessage={evaluateAriaLabelMessage(errors[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.FIRST_NAME.ID])}
            helperAriaHidden={focusOnErrorFieldId === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.FIRST_NAME.ID && true}
          />
          <Input
            id={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.LAST_NAME.ID}
            label={t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.LAST_NAME.LABEL)}
            placeholder={t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.LAST_NAME.PLACEHOLDER)}
            value={formDetails.last_name}
            onChangeHandler={(e) => onChange(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.LAST_NAME.ID, e)}
            onBlurHandler={onBlur(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_NAME.ID)}
            errorMessage={errors[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.LAST_NAME.ID]}
            onKeyDownHandler={(e) => { // on clicking enter key, it is same as clicking enter button
              if (e.keyCode === 13) handleSubmit(e);
            }}
            inputVariant={INPUT_VARIANTS.TYPE_3}
            testId={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.LAST_NAME.TEST_ID}
            inputContainerClasses={styles.InputPadding}
            focusOnError={focusOnErrorFieldId === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.LAST_NAME.ID}
            focusOnErrorRefresher={focusOnErrorRefresher}
            ariaLabelHelperMessage={evaluateAriaLabelMessage(errors[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.LAST_NAME.ID])}
            helperAriaHidden={focusOnErrorFieldId === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.LAST_NAME.ID && true}
          />
          <Dropdown
            placeholder={t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.PLACEHOLDER)}
            id={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.ID}
            label={t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.LABEL)}
            // textId={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.TEST_ID}
            optionList={yourRoleDropdown(t).OPTIONS}
            onChange={(e) => onChange(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.ID, e)}
            errorMessage={errors[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.ID]}
            selectedValue={formDetails.role_in_company ? formDetails.role_in_company : null}
            focusOnError={focusOnErrorFieldId === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.ID}
            helperAriaHidden={focusOnErrorFieldId === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.ID && true}
            focusOnErrorRefresher={focusOnErrorRefresher}
            ariaLabelHelperMessage={evaluateAriaLabelMessage(errors[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.ID])}
          />
          <div className={sectionTitleClass}>{t(ADDITIONAL_DETAILS_STRINGS.ACCOUNT_ADMIN_DETAILS)}</div>

          <Input
            id={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.USER_NAME.ID}
            label={t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.USER_NAME.LABEL)}
            placeholder={t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.USER_NAME.PLACEHOLDER)}
            value={formDetails.username}
            onChangeHandler={(e) => onChange(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.USER_NAME.ID, e)}
            onBlurHandler={onBlur(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_NAME.ID)}
            errorMessage={errors[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.USER_NAME.ID]}
            onKeyDownHandler={(e) => { // on clicking enter key, it is same as clicking enter button
              if (e.keyCode === 13) handleSubmit(e);
            }}
            inputVariant={INPUT_VARIANTS.TYPE_3}
            testId={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.USER_NAME.TEST_ID}
            inputContainerClasses={styles.InputPadding}
            focusOnError={focusOnErrorFieldId === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.USER_NAME.ID}
            focusOnErrorRefresher={focusOnErrorRefresher}
            ariaLabelHelperMessage={evaluateAriaLabelMessage(errors[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.USER_NAME.ID])}
            helperAriaHidden={focusOnErrorFieldId === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.USER_NAME.ID && true}
          />
          <div ref={setReferencePopperElement}>
            <Input
              id={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.ID}
              label={t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.LABEL)}
              placeholder={t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.PLACEHOLDER)}
              value={formDetails.password}
              onChangeHandler={(e) => onChange(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.ID, e)}
              onBlurHandler={onBlur(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_NAME.ID)}
              errorMessage={errors[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.ID]}
              onFocusHandler={onFocus(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.ID)}
              onKeyDownHandler={(e) => { // on clicking enter key, it is same as clicking enter button
                if (e.keyCode === 13) handleSubmit(e);
              }}
              inputVariant={INPUT_VARIANTS.TYPE_3}
              autoComplete="new-password"
              type={onEyeClick ? INPUT_TYPES.TEXT : INPUT_TYPES.PASSWORD}
              testId={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.TEST_ID}
              // labelMessage={ERROR_CODES_STRINGS.PASSWORD_VALIDATION}
              innerClass={BS.P_RELATIVE}
              inputContainerClasses={styles.InputPadding}
              focusOnError={focusOnErrorFieldId === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.ID}
              focusOnErrorRefresher={focusOnErrorRefresher}
              ariaLabelHelperMessage={evaluateAriaLabelMessage(errors[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.ID])}
              helperAriaHidden={focusOnErrorFieldId === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.ID && true}
              // helperToolTipId={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.LABEL}
              // helperTooltipMessage={ADDITIONAL_DETAILS_STRINGS.PASSWORD_HELP}
              isHideTitle
              icon={formDetails.password && (
                  <PasswordEyeOpen
                  // onMouseDown={previewIconButton} // changing passwordEye to a button functionality
                  // onMouseUp={previewIconButton}
                  className={gClasses.CursorPointer}
                  // onMouseLeave={onMouseLeaveHandler}
                  tabIndex={0}
                  onClick={previewIconButton}
                  onKeyPress={previewIconButton}
                  role={ARIA_ROLES.SWITCH}
                  onEyeClick={onEyeClick}
                  />
              )}
            />
          </div>
          <PasswordHint ariaHidden="true" referencePopperElement={referencePopperElement} isPopperOpen={isPopperOpen} isCharacterLimit isNumericDetection passwordValue={formDetails.password} errorMessage={errors[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.ID] || null} />
          <Alert content={formDetails.common_server_error} className={cx(gClasses.MT5, gClasses.MB15)} />
          <Button
            id={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.SIGN_UP.ID}
            buttonType={BUTTON_TYPE.AUTH_PRIMARY}
            onClick={handleSubmit}
            className={gClasses.MT5}
            width100
          >
            {t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.SIGN_UP.LABEL)}
          </Button>
        </form>
      </div>
    </>
  );
}
AdditionalDetailsForm.propTypes = {
  email: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onSignUpClicked: PropTypes.func.isRequired,
  errors: PropTypes.objectOf(),
  formDetails: PropTypes.objectOf(),
  testId: PropTypes.string.isRequired,
};

AdditionalDetailsForm.defaultProps = {
  formDetails: {},
  errors: {},
};
export default AdditionalDetailsForm;
