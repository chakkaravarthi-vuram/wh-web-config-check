import React, { useState } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { BS, INPUT_TYPES } from 'utils/UIConstants';
import Input from 'components/form_components/input/Input';
import { EMPTY_STRING, SPACE } from 'utils/strings/CommonStrings';
import { clearPayProfileData, setPaymentMethodStateChange } from 'redux/reducer/BillingModuleReducer';
import Button from 'components/form_components/button/Button';
import { BUTTON_TYPE } from 'utils/Constants';
import { connect } from 'react-redux';
import {
  setPaymentMethodProfileThunk,
  getCountryTaxListThunk,
  savePaymentProfileThunk,
  paymentDataThunk,
} from 'redux/actions/BillingModule.Action';
import { expiryMonthAndYearSplit, setPaymentMethodOriginalData, validateExpiryMonthYear } from 'containers/billing_module/BillingModule.utils';

import { validate } from 'utils/UtilityFunctions';
import { isEmpty } from 'utils/jsUtility';
import { CURRENT_PAY_SCREEN } from 'containers/billing_module/BillingModule.string';
import PreviewIcon from 'assets/icons/PreviewIcon';
import CardExpiry from 'components/card_expiry/CardExpiry';
import { SETPAYMENT_METHOD_STRINGS, SETPAYMENT_METHOD_STRINGS_COMMON, verificationInfoString } from './SetPaymentMethod.string';
import {
  setPaymentMethodValidateData,
  setPaymentMethodValidationSchema,
} from '../../BillingModule.validation.schema';
import styles from './SetPaymentMethod.module.scss';

function SetPaymentMethod(props) {
  const { stateValue, stateChange, getPaymentMethodCall, changeExistingPayScreen, userProfileData, payProfileDate, direct_pay, clearStatePayProfile } = props;
  const [onEyeClick, setOnEyeClick] = useState(false);
  const {
    cardNumber,
    setPaymentProfileErrorList,
    CVV,
    expiryMonthYear,
  } = stateValue;

  // useEffect(() => {
  //   if (direct_pay) {
  //     paymentProfileDataThunk();
  //   }
  // }, []);

  const previewIconButton = () => {
    setOnEyeClick(!onEyeClick);
  };

  const onPaymentClickHandler = (data) => {
    console.log('fsdafdaf', data);
    const errorList = validate(
      setPaymentMethodValidateData(data),
      setPaymentMethodValidationSchema,
    );
    console.log('gfsgasg', errorList);
    const { expiryMonthValue, expiryYearValue } = expiryMonthAndYearSplit(data.expiryMonthYear);
    const validExpiry = validateExpiryMonthYear(expiryMonthValue, expiryYearValue);
    if (validExpiry) errorList[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH.ID] = validExpiry || EMPTY_STRING;
    console.log('fwerff', errorList);

    stateChange({ setPaymentProfileErrorList: errorList });
    // onCloseClick();
    if (isEmpty(errorList)) {
      // console.log('lolo', getFormattedSaveProfileData(payProfileDate, setPaymentMethodOriginalData(data), userProfileData.account_domain));
      // getPaymentMethodCall(setPaymentMethodOriginalData(data));
      const methodData = setPaymentMethodOriginalData(data);
      // !direct_pay ? setPaymentProfileCall(getFormattedSaveProfileData(payProfileDate, setPaymentMethodOriginalData(data), userProfileData)) : getPaymentMethodCall(methodData);
      getPaymentMethodCall(methodData);
    }
  };
  const ValueChangeHandler = (id) => (event) => {
    const { value } = event.target;
    if (id === SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARD_NUMBER.ID) {
      console.log('dsadsad', value);
      // event.target.value = event.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
      // console.log('valuevalue', event.target.value);
      let val = event.target.value;
      const valArray = val.split(' ').join('').split('');
      const valSpace = val.split('');

      // to work with backspace
      if (valSpace[valSpace.length - 1] === ' ') {
        const valSpaceN = valSpace.slice(0, -2);
          val = valSpaceN.join('');
          stateChange({ [id]: val });
          return;
      }

      if (Number.isNaN(valArray.join(''))) return;
      if (valArray.length === 17) return;
      if (valArray.length % 4 === 0 && valArray.length <= 15) {
        stateChange({ [id]: `${event.target.value}${SPACE}${SPACE}` });
      } else {
        stateChange({ [id]: event.target.value });
      }
    } else {
      // console.log('checks', value, id);
      stateChange({ [id]: value });
    }

    if (!isEmpty(stateValue.setPaymentProfileErrorList)) {
      console.log('hello', { ...stateValue, [id]: value });
      const errorList = validate(
        setPaymentMethodValidateData({ ...stateValue, [id]: value }),
        setPaymentMethodValidationSchema,
      );
      stateChange({ setPaymentProfileErrorList: errorList });
    }
  };

  const onBackOrExitHandle = () => {
    if (direct_pay) {
      stateChange({ is_direct_payment_method: false });
      changeExistingPayScreen(CURRENT_PAY_SCREEN.PLANS_SELECT_SCREEN);
      clearStatePayProfile();
      // console.log('direct_pay', direct_pay);
    } else changeExistingPayScreen(CURRENT_PAY_SCREEN.PAY_PROFILE_SCREEN);
  };

  // const onPasteHandler = (id) => (event) => {
  //   // console.log('onPasteHandler', event.clipboardData.getData('text/plain'));
  //   // event.target.value = event.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
  //     // console.log('valuevalue', event.target.value);
  //     let val = event.clipboardData.getData('text/plain');
  //     val= val.replace(/\d{4}(?=.)/g, '$& ');
  //     console.log("vasasl", val)
  //     // const valArray = val.split(' ').join('').split('');
  //     // const valSpace = val.split('');

  //     // // to work with backspace
  //     // if (valSpace[valSpace.length - 1] === ' ') {
  //     //   const valSpaceN = valSpace.slice(0, -2);
  //     //     val = valSpaceN.join('');
  //     //     stateChange({ [id]: val });
  //     //     return;
  //     // }

  //     // if (isNaN(valArray.join(''))) return;
  //     // if (valArray.length === 17) return;
  //     // if (valArray.length % 4 === 0 && valArray.length <= 15) {
  //     //   stateChange({ [id]: event.target.value + "  " });
  //     // } else {
  //       stateChange({ [id]: val });
  //     // }
  // };

  const expiryChangeHandle = (expiryValue) => {
    console.log('fdeweasfd', expiryValue);
    expiryMonthAndYearSplit(expiryValue);

    const { expiryMonthValue, expiryYearValue } = expiryMonthAndYearSplit(expiryValue);
    if (!isEmpty(stateValue.setPaymentProfileErrorList)) {
      stateChange({ setPaymentProfileErrorList: { ...stateValue.setPaymentProfileErrorList, [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH.ID]: validateExpiryMonthYear(expiryMonthValue, expiryYearValue) || EMPTY_STRING } });
    }
    // if (expiryValue) {
      stateChange({ [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH.ID]: expiryMonthValue,
        [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_YEAR.ID]: expiryYearValue,
        [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH_YEAR.ID]: expiryValue });
    // }
  };

  return (
    // <Modal
    //   isModalOpen={true}
    //   contentClass={styles.ContentClass}
    //   containerClass={styles.ContainerClass}
    // >
    <div>
    <div className={cx(styles.MainContainer, gClasses.CenterH, BS.FLEX_COLUMN)}>
      <div className={cx(gClasses.W100, gClasses.MT50, styles.TitleContainer)}>
        <h2 className={cx(gClasses.FontWeight600, gClasses.FTwo24GrayV3)}>
          {SETPAYMENT_METHOD_STRINGS_COMMON.SET_PAYMENT_METHOD}
        </h2>
        <div className={cx(gClasses.MT10)}>
          <span className={cx(gClasses.FTwo13GrayV53)}>{SETPAYMENT_METHOD_STRINGS_COMMON.WORK_EMAIL}</span>
          <span className={gClasses.FTwo13GrayV3}>{userProfileData.email}</span>
        </div>
      </div>
      <div className={cx(gClasses.MT20, gClasses.W100, styles.SubContainer)}>
        <div className={cx(styles.BodyContainer)}>
          <div className={cx(gClasses.FTwo15GrayV3, gClasses.FontWeight600)}>
            {SETPAYMENT_METHOD_STRINGS_COMMON.PAYMENT_METHOD}
          </div>
          <div
            className={cx(
              BS.D_FLEX,
              BS.FLEX_WRAP_WRAP,
              BS.JC_BETWEEN,
              // styles.TwoColumnContainer,
              gClasses.MT15,
            )}
          >
            <Input
              id={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARD_NUMBER.ID}
              // type={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARD_NUMBER.TYPE}
              inputContainerClasses={cx(styles.input)}
              placeholder={
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARD_NUMBER.PLACEHOLDER
              }
              label={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARD_NUMBER.LABEL}
              labelClass={gClasses.FTwo11GrayV53}
              // onChangeHandler={(event) => {
              //   stateChange({ cardNumber: event.target.value });
              // }}
              onChangeHandler={ValueChangeHandler(
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARD_NUMBER.ID,
              )}
              value={cardNumber}
              errorMessage={
                setPaymentProfileErrorList
                  ? setPaymentProfileErrorList[
                      SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARD_NUMBER.ID
                    ]
                  : null
              }
              isRequired
            />
          </div>
          <div className={cx(styles.ExpiryContainer, BS.D_FLEX, BS.JC_BETWEEN)}>
            <CardExpiry
              id={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH_YEAR.ID}
              inputContainerClasses={cx(styles.ExpiryDropdown)}
              // className={styles.ExpiryDropdown}
              label={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH_YEAR.LABEL}
              placeholder={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH_YEAR.PLACEHOLDER}
              inputTextClasses={gClasses.FTwo12GrayV3}
              value={expiryMonthYear}
              onChangeHandler={expiryChangeHandle}
              errorMessage={setPaymentProfileErrorList[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH.ID]}
              isRequired
            />
            {/* <Dropdown
              id={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH.ID}
              innerClassName={styles.ExpiryDropdown}
              label={
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH.LABEL
              }
              labelClass={gClasses.FTwo11GrayV53}
              placeholder={
                expiryMonth === ''
                  ? SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH
                      .PLACEHOLDER
                  : expiryMonth
              }
              optionList={getMonthDropdownArray(expiryYear)}
              selectedValue={expiryMonth || null}
              onChange={ValueChangeHandler(
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH.ID,
              )}
              errorMessage={
                setPaymentProfileErrorList
                  ? setPaymentProfileErrorList[
                      SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH.ID
                    ]
                  : null
              }
              disabled={!expiryYear}
              valueEmptyAction={() => {
                stateChange({
                  [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH.ID]:
                    '',
                });
              }}
              isRequired
            /> */}
            {/* <Dropdown
              id={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_YEAR.ID}
              innerClassName={styles.ExpiryDropdown}
              className={gClasses.ML30}
              label={EMPTY_STRING}
              labelClass={gClasses.FTwo11GrayV53}
              placeholder={
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_YEAR.PLACEHOLDER
              }
              optionList={BILLING_METHOD_YEAR}
              selectedValue={expiryYear || null}
              onChange={ValueChangeHandler(
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_YEAR.ID,
              )}
              errorMessage={
                setPaymentProfileErrorList
                  ? setPaymentProfileErrorList[
                      SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_YEAR.ID
                    ]
                  : null
              }
            /> */}
            <Input
              id={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CVC_NUMBER.ID}
              inputContainerClasses={cx(styles.ExpiryDropdown)}
              innerClass={!onEyeClick ? styles.Password : null}
              className={styles.ExpiryDropdown}
              placeholder={
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CVC_NUMBER.PLACEHOLDER
              }
              label={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CVC_NUMBER.LABEL}
              labelClass={gClasses.FTwo11GrayV53}
              onChangeHandler={ValueChangeHandler(
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CVC_NUMBER.ID,
              )}
              value={CVV}
              errorMessage={
                setPaymentProfileErrorList
                  ? setPaymentProfileErrorList[
                      SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CVC_NUMBER.ID
                    ]
                  : null
              }
              icon={CVV && <PreviewIcon onMouseDown={previewIconButton} onMouseUp={previewIconButton} className={gClasses.CursorPointer} />}
              type={INPUT_TYPES.TEXT}
              isRequired
            />
          </div>
          <div className={cx(styles.VerificationInfo)}>
            <p className={cx(BS.TEXT_CENTER, gClasses.FTwo12)}>{verificationInfoString(payProfileDate.billing_currency === 'INR' || (payProfileDate && payProfileDate.savedBillingCurrency === 'INR'))}</p>
          </div>
          <div
          className={cx(
            gClasses.MT30,
            BS.D_FLEX,
            BS.JC_BETWEEN,
            styles.ButtonContainer,
          )}
          >
            <Button
              buttonType={BUTTON_TYPE.SECONDARY}
              className={cx(
                styles.BackButton,
                gClasses.FTwo11GrayV53,
              )}
              previousArrow={!direct_pay}
              onClick={() => onBackOrExitHandle()}
            >
              {!direct_pay ? SETPAYMENT_METHOD_STRINGS_COMMON.BACK : SETPAYMENT_METHOD_STRINGS_COMMON.EXIT_PAYMENT}
            </Button>
            <Button
              buttonType={BUTTON_TYPE.AUTH_PRIMARY}
              className={cx(styles.NextButton, gClasses.FTwo11GrayV53)}
              onClick={() => {
                onPaymentClickHandler(stateValue);
              }}
            >
              {SETPAYMENT_METHOD_STRINGS_COMMON.MAKE_PAYMENT}
            </Button>
          </div>
          {/* <div
            className={cx(
              BS.D_FLEX,
              BS.JC_BETWEEN,
              BS.FLEX_WRAP_WRAP,
              styles.TwoColumnContainer,
            )}
          >
            <Input
              id={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CVC_NUMBER.ID}
              inputContainerClasses={cx(styles.input)}
              type={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CVC_NUMBER.TYPE}
              placeholder={
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CVC_NUMBER.PLACEHOLDER
              }
              label={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CVC_NUMBER.LABEL}
              labelClass={gClasses.FTwo11GrayV53}
              onChangeHandler={ValueChangeHandler(
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CVC_NUMBER.ID,
              )}
              value={CVV}
              errorMessage={
                setPaymentProfileErrorList
                  ? setPaymentProfileErrorList[
                      SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CVC_NUMBER.ID
                    ]
                  : null
              }
              isRequired
            />
          </div> */}
          {/* <div
            className={cx(
              BS.D_FLEX,
              BS.JC_BETWEEN,
              BS.FLEX_WRAP_WRAP,
              styles.TwoColumnContainer,
            )}
          >
            <Input
              id={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARS_NICK_NAME.ID}
              inputContainerClasses={cx(styles.input)}
              placeholder={
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARS_NICK_NAME
                  .PLACEHOLDER
              }
              label={
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARS_NICK_NAME.LABEL
              }
              labelClass={gClasses.FTwo11GrayV53}
              onChangeHandler={ValueChangeHandler(
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARS_NICK_NAME.ID,
              )}
              value={cardNickName}
              errorMessage={
                setPaymentProfileErrorList
                  ? setPaymentProfileErrorList[
                      SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARS_NICK_NAME.ID
                    ]
                  : null
              }
            />
          </div> */}

          {/* Commented the below - Might be used in future release (please don't delete) */}

          {/* <div className={cx(gClasses.FTwo15GrayV3, gClasses.MT15, gClasses.MB10, gClasses.FontWeight600)}>
            {SETPAYMENT_METHOD_STRINGS_COMMON.CARD_ADDRESS}
          </div>
          <div
            className={cx(
              BS.D_FLEX,
              BS.JC_BETWEEN,
              BS.FLEX_WRAP_WRAP,
              styles.TwoColumnContainer,
            )}
          >
            <Input
              id={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.ADDRESS_LINE_1.ID}
              inputContainerClasses={cx(styles.input)}
              placeholder={
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.ADDRESS_LINE_1
                  .PLACEHOLDER
              }
              label={
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.ADDRESS_LINE_1.LABEL
              }
              labelClass={gClasses.FTwo11GrayV53}
              onChangeHandler={ValueChangeHandler(
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.ADDRESS_LINE_1.ID,
              )}
              value={line1}
              errorMessage={
                setPaymentProfileErrorList
                  ? setPaymentProfileErrorList[
                      SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.ADDRESS_LINE_1.ID
                    ]
                  : null
              }
            />
            <Input
              id={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.ADDRESS_LINE_2.ID}
              inputContainerClasses={cx(styles.input)}
              placeholder={
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.ADDRESS_LINE_2
                  .PLACEHOLDER
              }
              label={
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.ADDRESS_LINE_2.LABEL
              }
              labelClass={gClasses.FTwo11GrayV53}
              onChangeHandler={ValueChangeHandler(
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.ADDRESS_LINE_2.ID,
              )}
              value={line2}
              errorMessage={
                setPaymentProfileErrorList
                  ? setPaymentProfileErrorList[
                      SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.ADDRESS_LINE_2.ID
                    ]
                  : null
              }
            />
          </div>
          <div
            className={cx(
              BS.D_FLEX,
              BS.JC_BETWEEN,
              BS.FLEX_WRAP_WRAP,
              styles.TwoColumnContainer,
            )}
          >
            <Input
              id={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.POSTAL_CODE.ID}
              type={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.POSTAL_CODE.TYPE}
              inputContainerClasses={cx(styles.input)}
              placeholder={
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.POSTAL_CODE.PLACEHOLDER
              }
              label={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.POSTAL_CODE.LABEL}
              labelClass={gClasses.FTwo11GrayV53}
              onChangeHandler={ValueChangeHandler(
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.POSTAL_CODE.ID,
              )}
              value={postal_code}
              errorMessage={
                setPaymentProfileErrorList
                  ? setPaymentProfileErrorList[
                      SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.POSTAL_CODE.ID
                    ]
                  : null
              }
            />
            <Input
              id={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CITY.ID}
              inputContainerClasses={styles.input}
              placeholder={
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CITY.PLACEHOLDER
              }
              label={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CITY.LABEL}
              labelClass={gClasses.FTwo11GrayV53}
              onChangeHandler={ValueChangeHandler(
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CITY.ID,
              )}
              value={city}
              errorMessage={
                setPaymentProfileErrorList
                  ? setPaymentProfileErrorList[
                      SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CITY.ID
                    ]
                  : null
              }
            />
          </div>
          <div
            className={cx(
              BS.D_FLEX,
              BS.JC_BETWEEN,
              BS.FLEX_WRAP_WRAP,
              styles.TwoColumnContainer,
            )}
          >
            <Dropdown
              id={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.COUNTRY.ID}
              // selectedValue={acc_locale || null}
              // loadData={getDropDownValues}
              optionList={country_tax_list}
              // onChange={onChangeHandler(ACCOUNT_DROPDOWN_STRING.LOCALE_DROPDOWN.ID)}
              placeholder={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.COUNTRY.PLACEHOLDER}
              labelClassName={gClasses.FTwo11GrayV53}
              label={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.COUNTRY.LABEL}
              className={styles.Dropdown}
              innerClassName={cx(gClasses.FTwo12GrayV3, styles.input, gClasses.MR0)}
              placeholderClassName={gClasses.FTwo12GrayV62}
              // errorMessage={error_list[ACCOUNT_DROPDOWN_STRING.LOCALE_DROPDOWN.ID]}
              // popperClasses={styles.Input}
              // fixedPopperStrategy
              onChange={ValueChangeHandler(SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.COUNTRY.ID)}
              selectedValue={country || null}
              errorMessage={setPaymentProfileErrorList[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.COUNTRY.ID]}
              loadData={getCountryWithTax}
            />
            {/* <Input
              id={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.COUNTRY.ID}
              inputContainerClasses={cx(styles.input)}
              placeholder={
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.COUNTRY.PLACEHOLDER
              }
              label={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.COUNTRY.LABEL}
              labelClass={gClasses.FTwo12GrayV53}
              onChangeHandler={ValueChangeHandler(
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.COUNTRY.ID,
              )}
              value={country}
              errorMessage={
                setPaymentProfileErrorList
                  ? setPaymentProfileErrorList[
                      SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CITY.ID
                    ]
                  : null
              }
            /> */}
            {/* <Input
              id={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.STATE.ID}
              inputContainerClasses={styles.input}
              placeholder={
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.STATE.PLACEHOLDER
              }
              label={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.STATE.PLACEHOLDER}
              labelClass={gClasses.FTwo11GrayV53}
              onChangeHandler={ValueChangeHandler(
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.STATE.ID,
              )}
              value={state}
              errorMessage={
                setPaymentProfileErrorList
                  ? setPaymentProfileErrorList[
                      SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.STATE.ID
                    ]
                  : null
              }
            /> */}
        </div>
      </div>
    </div>
    </div>
    // </Modal>
  );
}
const mapStateToProps = (state) => {
  return {
    stateValue: state.BillingModuleReducer.setPaymentMethod,
    country_tax_list: state.BillingModuleReducer.setPaymentProfile.country_tax_list,
    payProfileDate: state.BillingModuleReducer.setPaymentProfile,
    direct_pay: state.BillingModuleReducer.setPaymentMethod.is_direct_payment_method,
    payOriginalData: state.BillingModuleReducer.paymentAPIDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    stateChange: (data) => {
      dispatch(setPaymentMethodStateChange(data));
    },
    getPaymentMethodCall: (data) =>
      dispatch(setPaymentMethodProfileThunk(data)),
    getCountryWithTax: () => dispatch(getCountryTaxListThunk()),
    setPaymentProfileCall: (params, func1) =>
      dispatch(savePaymentProfileThunk(params, func1)),
    clearStatePayProfile: () => dispatch(clearPayProfileData()),
    paymentProfileDataThunk: (data) => dispatch(paymentDataThunk(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SetPaymentMethod);
