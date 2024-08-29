/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import jsUtils from 'utils/jsUtility';
import Skeleton from 'react-loading-skeleton';
import Input from 'components/form_components/input/Input';
import { BS } from 'utils/UIConstants';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import { connect } from 'react-redux';
import { getCountryTaxListThunk } from 'redux/actions/BillingModule.Action';
import { setPaymentProfileState } from 'redux/reducer/BillingModuleReducer';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { useTranslation } from 'react-i18next';
import styles from './BillingCard.module.scss';
import {
  BILLING_CONSTANTS_VALUES,
  BILLING_EDITABLE_VIEW,
  BILL_FORM_TYPE,
  FORM_FIELD_DIMENSIONS,
  PAY_METHOD,
  PAY_PROFILE,
  RESTRICTION_INFO_BILLING,
} from '../BillingModule.string';
import {
  getPaymentCardIcon,
} from '../BillingModule.utils';

function PaymentCard(props) {
  const {
    details,
    isDataLoading,
    editDataType,
    onEditActionClick,
    editTypeValue,
    onChangeHandler,
    errorList,
    onCancelClickHandler,
    onUpdateClick,
  } = props;
  const { t } = useTranslation();
  let submitActionButtons = null;
  let paymentMethod = null;
  let paymentProfile = null;

  if (editDataType === editTypeValue) {
    submitActionButtons = (
      <div
        className={cx(
          BS.D_FLEX,
          BS.FLEX_ROW,
          styles.ButtonContainer,
          gClasses.MT15,
        )}
      >
        <Button
          className={cx(gClasses.MR15, styles.ButtonCancel)}
          buttonType={BUTTON_TYPE.SECONDARY}
          onClick={onCancelClickHandler}
          isDataLoading={isDataLoading}
        >
          {t(BILLING_CONSTANTS_VALUES.CANCEL)}
        </Button>
        <Button
          buttonType={BUTTON_TYPE.PRIMARY}
          onClick={onUpdateClick}
          isDataLoading={isDataLoading}
        >
          {editDataType === BILLING_EDITABLE_VIEW.PAYMENT_METHOD
            ? BILLING_CONSTANTS_VALUES.VERIFY
            : t(BILLING_CONSTANTS_VALUES.UPDATE)}
        </Button>
      </div>
    );
  }

  const actionButtonClick = () => {
    onEditActionClick(editDataType);
  };

  const getBillFormElements = (value, index, type) => {
    switch (value.FORM_TYPE) {
      case BILL_FORM_TYPE.INPUT:
        value.FORM_ELEMENT = (index !== 9 && index !== 0) && (
          <Input
            label={t(value.FORM_LABEL)}
            labelClassName={styles.InputLabel}
            instructionMessage={t(value.INSTRUCTION)}
            instructionClassName={styles.InputInstruction}
            className={styles.width100}
            value={value.VALUE}
            placeholder={t(value.PLACEHOLDER) || EMPTY_STRING}
            onChangeHandler={(e) => {
              onChangeHandler(type, e.target.value, index);
            }}
            errorMessage={errorList ? errorList[t(value.FORM_LABEL)] : null}
            isRequired={index !== 7}
          />
        );
        break;
      case BILL_FORM_TYPE.INPUT_NUMBER:
        value.FORM_ELEMENT = (
          <Input
            type="number"
            label={t(value.FORM_LABEL)}
            placeholder={t(value.PLACEHOLDER) || EMPTY_STRING}
            labelClassName={styles.InputLabel}
            className={styles.width100}
            value={value.VALUE}
            onChangeHandler={(e) => {
              onChangeHandler(type, e.target.value, index);
            }}
            onKeyDownHandler={
              (event) => ['e', 'E'].includes(event.key) &&
              event.preventDefault()
            }
            errorMessage={errorList ? errorList[t(value.FORM_LABEL)] : null}
            isRequired
          />
        );
        break;
      default:
        break;
    }
    return value.FORM_ELEMENT;
  };

  if (details && details.DETAILS) {
    const cardHiddenValue =
      details &&
      details.DETAILS[1] &&
      details.DETAILS[1].VALUE.substring(0, 15);
    const cardLastFourLetters =
      details && details.DETAILS[1] && details.DETAILS[1].VALUE.substring(15);
    paymentMethod = (
      <div>
        <div className={cx(gClasses.MT20, BS.D_FLEX)}>
          <p>
            {getPaymentCardIcon(
              details && details.DETAILS[0] && details.DETAILS[0].VALUE,
            )}
          </p>
          <div
            className={cx(
              BS.D_FLEX,
              BS.FLEX_COLUMN,
              gClasses.PL20,
              gClasses.FTwo18,
              gClasses.FontWeight500,
              styles.FontColor,
            )}
          >
            <p className={cx(gClasses.MB0, gClasses.LetterSpacing3)}>
              {cardHiddenValue}
              <span className={gClasses.LetterSpacingNormal}>
                {cardLastFourLetters}
              </span>
            </p>
            <p className={cx(gClasses.FontSize)}>
              {details && details.DETAILS[2] && details.DETAILS[2].VALUE}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getfilterPayment = (info) => {
    const idArray = [
      t(PAY_PROFILE.LABEL.NAME_LABEL),
      t(PAY_PROFILE.LABEL.ADDRESS1_LABEL),
      t(PAY_PROFILE.LABEL.ADDRESS2_LABEL),
      t(PAY_PROFILE.LABEL.POSTAL_CODE),
      t(PAY_PROFILE.LABEL.STATE),
      t(PAY_PROFILE.LABEL.CITY),
      t(PAY_PROFILE.LABEL.COUNTRY),
    ];
    console.log('vsadvadfsv', info);
    const arrayValue = info.filter((currentdata) =>
      idArray.includes(t(currentdata.SUB_TITLE)),
    );
    return arrayValue;
  };
  const getTaxDetails = (info) => {
    const idArray = [t(PAY_PROFILE.LABEL.TAX_NUMBER), t(PAY_PROFILE.LABEL.TAX_ID)];
    const arrayValue = info.filter((currentdata) =>
      idArray.includes(t(currentdata.SUB_TITLE)),
    );
    return arrayValue;
  };
  if (details && details.DETAILS) {
    const filterdData = getfilterPayment(details.DETAILS);
    console.log('fdsafcsadfsad', details.DETAILS, filterdData);
    const filterdTaxData = getTaxDetails(details.DETAILS);
    paymentProfile = (
      <div>
        <div className={cx(gClasses.MT20, gClasses.FS13)}>
          {filterdData &&
            filterdData.map((info, index) =>
              index === 0 ? (
                <p className={cx(gClasses.FontWeight600, gClasses.MB0)}>
                  {info.VALUE}
                </p>
              ) : index === 5 ? (
                <p className={cx(gClasses.MB0)}>{info.VALUE}</p>
              ) : (
                <span className={gClasses.MB0}>{`${info.VALUE} `}</span>
              ),
            )}
        </div>
        <div>
          <p
            className={cx(
              gClasses.FontWeight600,
              gClasses.MB0,
              gClasses.MT10,
              gClasses.FS13,
            )}
          >
            {`${t(PAY_PROFILE.LABEL.TAX_ID)} / ${t(PAY_PROFILE.LABEL.TAX_NUMBER)}`}
          </p>
          {filterdTaxData &&
            filterdTaxData.map((info, index) =>
              index === 0 ? (
                <span
                  className={cx(
                    gClasses.MB0,
                    gClasses.FS13,
                    gClasses.TextTranformUpper,
                  )}
                >
                  {info.VALUE}
                </span>
              ) : (
                <span className={cx(gClasses.MB0, gClasses.FS13)}>
                  {info.VALUE ? ' / ' : ' - '}
                  {info.VALUE}
                </span>
              ),
            )}
        </div>
      </div>
    );
  }

  const getBillingCardDetails = (detailValue, index, type) => {
    const cardDetails = jsUtils.cloneDeep(detailValue);
    const filterdTaxData = getTaxDetails(details.DETAILS);
    if (editDataType === editTypeValue && cardDetails.isShow) {
      return (
        <>
          <div className={cx(gClasses.MT15)}>
            {getBillFormElements(cardDetails, index, type)}
          </div>
          {index === 8 && (
            <div className={cx(gClasses.MT15, styles.InfoFontSize)} key={index}>
              <div
                className={cx(gClasses.FontWeight500, gClasses.MB0)}
              >
          {`${t(PAY_PROFILE.LABEL.TAX_ID)} / ${t(PAY_PROFILE.LABEL.TAX_NUMBER)}`}
              </div>
              {filterdTaxData.map((info, index) =>
                index === 0 ? (
                  <span
                    className={cx(
                      gClasses.MB0,
                      gClasses.FS13,
                      gClasses.TextTranformUpper,
                    )}
                  >
                    {info.VALUE}
                  </span>
                ) : (
                  <span className={cx(gClasses.MB0, gClasses.FS13)}>
                    {info.VALUE ? ' / ' : ' - '}
                    {info.VALUE}
                  </span>
                ),
              )}
            </div>
          )}
          {(index === 0 || index === 6 || index === 7 || index === 10) && (
            <div className={cx(gClasses.MT15, styles.InfoFontSize)} key={index}>
              <p className={cx(gClasses.FontWeight500, gClasses.MB0)}>
                {t(cardDetails.SUB_TITLE)}
              </p>
              <p>{cardDetails.VALUE}</p>
            </div>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <div
      className={cx(styles.PaymentCardContainer, gClasses.PY30, gClasses.PX20)}
    >
      <div className={cx(gClasses.DisplayFlex)}>
        <h3 className={cx(gClasses.MB0, gClasses.FontWeight600, gClasses.FS14)}>
          {!isDataLoading ? (
            t(details?.TITLE)
          ) : (
            <Skeleton width={FORM_FIELD_DIMENSIONS.SKELETON_60} />
          )}
        </h3>
        <div
          className={cx(
            styles.ActionButton,
            gClasses.DisplayFlex,
            gClasses.CenterV,
          )}
        >
          {!isDataLoading ? (
            details &&
            details.ACTION && (editDataType !== editTypeValue) && (
              <div
                className={cx(styles.individual)}
                onClick={actionButtonClick}
              >
                {t(details.ACTION)}
              </div>
            )
          ) : (
            <Skeleton width={FORM_FIELD_DIMENSIONS.SKELETON_40} />
          )}
        </div>
      </div>
      {!isDataLoading ? (
        details &&
        editDataType &&
        details.DETAILS &&
        details.DETAILS.map((info, index) =>
          getBillingCardDetails(info, index, t(details.TITLE)),
        )
      ) : (
        <div className={gClasses.MT20}>
          <Skeleton width={FORM_FIELD_DIMENSIONS.FULL_WIDTH} />
          <Skeleton width={FORM_FIELD_DIMENSIONS.HALF_WIDTH} />
          <Skeleton width={FORM_FIELD_DIMENSIONS.FULL_WIDTH} />
          <Skeleton width={FORM_FIELD_DIMENSIONS.HALF_WIDTH} />
        </div>
      )}
      {
        (t(details?.ACTION) === t(PAY_METHOD.ACTION)) &&
        paymentMethod}
      {editDataType !== editTypeValue &&
        t(details?.ACTION) === t(PAY_PROFILE.ACTION) &&
        paymentProfile}
      {!isDataLoading &&
        editDataType === editTypeValue &&
        editDataType === BILLING_EDITABLE_VIEW.PAYMENT_PROFILE && (
          <div className={cx(styles.VerificationInfo)}>
            <p className={cx(BS.TEXT_CENTER, gClasses.FTwo12)}>
              {t(RESTRICTION_INFO_BILLING)}
            </p>
          </div>
        )}
      {submitActionButtons}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    paymentState: state.BillingModuleReducer.paymentAPIDetails,
    country_tax_list:
      state.BillingModuleReducer.setPaymentProfile.country_tax_list,
    tax_number_type_list:
      state.BillingModuleReducer.setPaymentProfile.tax_number_type_list,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPaymentStateChange: (data) => dispatch(setPaymentProfileState(data)),
    getCountryWithTax: () => dispatch(getCountryTaxListThunk()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentCard);
