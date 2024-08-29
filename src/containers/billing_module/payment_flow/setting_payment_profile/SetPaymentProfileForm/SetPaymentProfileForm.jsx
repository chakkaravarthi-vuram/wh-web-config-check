import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import Input from 'components/form_components/input/Input';
import Button from 'components/form_components/button/Button';
import { CURRENT_PAY_SCREEN } from 'containers/billing_module/BillingModule.string';
import { useTranslation } from 'react-i18next';
import styles from '../SetPaymentProfile.module.scss';
import { BS } from '../../../../../utils/UIConstants';
import { BUTTON_TYPE, FORM_POPOVER_STATUS } from '../../../../../utils/Constants';
import { SET_PAYMENT_PROFILE_STRINGS, ERROR_POPUP } from '../SetPaymentProfile.strings';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { showToastPopover } from '../../../../../utils/UtilityFunctions';

function SetPaymentProfileForm(props) {
    const { onChangeHandler, formDetails, getDropDownValues, changeExistingPayScreen, onSubmitClick, country_tax_list, tax_number_type_list, userProfileData, setPaymentStateChange, tax_num_placeholder } = props;
    const { t } = useTranslation();
    const taxTypeOptionsCheck = () => {
        if (formDetails.country === EMPTY_STRING) {
            setPaymentStateChange({
                error_list: { ...formDetails.error_list, country: t(ERROR_POPUP.COUNTRY_REQUIRED) },
            });
            showToastPopover(
                t(ERROR_POPUP.TRY_AGAIN),
                EMPTY_STRING,
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
            );
        }
    };

    return (
        <div>
            <div className={cx(BS.TEXT_CENTER, gClasses.MB15)}>
                <div className={cx(gClasses.FTwo24GrayV3, gClasses.FontWeight600, gClasses.MT50, gClasses.MB10)}>{t(SET_PAYMENT_PROFILE_STRINGS.TITLE)}</div>
                <div className={cx(gClasses.FTwo12, BS.TEXT_CENTER)}>
                    <span className={cx(gClasses.FontWeight400, gClasses.GrayV2)}>{t(SET_PAYMENT_PROFILE_STRINGS.WORK_EMAIL)}</span>
                    <span className={cx(gClasses.FontWeight500, gClasses.GrayV3)}>{userProfileData.email}</span>
                </div>
            </div>
            <div className={cx(gClasses.CenterH, BS.FLEX_COLUMN)}>
                <div className={cx(styles.FormContainer)}>
                    <div className={cx(gClasses.CenterH, BS.FLEX_COLUMN, styles.FormSubContainer)}>
                        <div className={cx(gClasses.FTwo15GrayV3, gClasses.MT15, gClasses.FontWeight600)}>{t(SET_PAYMENT_PROFILE_STRINGS.BILLING_DETAILS)}</div>
                        <div className={cx(styles.TwoColumnContainer, BS.D_FLEX, BS.JC_BETWEEN, gClasses.MT12)}>
                            <Input
                                id={SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.ADDRESS_LINE_1.ID}
                                label={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.ADDRESS_LINE_1.LABEL)}
                                placeholder={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.ADDRESS_LINE_1.PLACEHOLDER)}
                                inputContainerClasses={styles.Input}
                                onChangeHandler={onChangeHandler(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.ADDRESS_LINE_1.ID, true)}
                                value={formDetails.line1}
                                errorMessage={formDetails.error_list[SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.ADDRESS_LINE_1.ID]}
                                isRequired
                            />
                            <Input
                                id={SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.ADDRESS_LINE_2.ID}
                                label={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.ADDRESS_LINE_2.LABEL)}
                                placeholder={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.ADDRESS_LINE_2.PLACEHOLDER)}
                                inputContainerClasses={styles.Input}
                                onChangeHandler={onChangeHandler(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.ADDRESS_LINE_2.ID, true)}
                                value={formDetails.line2}
                                errorMessage={formDetails.error_list[SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.ADDRESS_LINE_2.ID]}
                                isRequired
                            />
                        </div>
                        <div className={cx(styles.TwoColumnContainer, BS.D_FLEX, BS.JC_BETWEEN)}>
                            <Input
                                type="number"
                                id={SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.POSTAL_CODE.ID}
                                onKeyDownHandler={(event) => event.key === 'e' && event.preventDefault()}
                                label={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.POSTAL_CODE.LABEL)}
                                placeholder={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.POSTAL_CODE.PLACEHOLDER)}
                                inputContainerClasses={styles.Input}
                                onChangeHandler={onChangeHandler(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.POSTAL_CODE.ID, true)}
                                value={formDetails.postal_code}
                                errorMessage={formDetails.error_list[SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.POSTAL_CODE.ID]}
                                isRequired
                            />
                            <Input
                                id={SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.CITY.ID}
                                placeholder={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.CITY.PLACEHOLDER)}
                                label={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.CITY.LABEL)}
                                inputContainerClasses={styles.Input}
                                onChangeHandler={onChangeHandler(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.CITY.ID, true)}
                                value={formDetails.city}
                                errorMessage={formDetails.error_list[SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.CITY.ID]}
                                isRequired
                            />
                        </div>
                        <div className={cx(styles.TwoColumnContainer, BS.D_FLEX, BS.JC_BETWEEN)}>
                            <Dropdown
                                id={SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.COUNTRY.ID}
                                optionList={country_tax_list}
                                placeholder={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.COUNTRY.PLACEHOLDER)}
                                label={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.COUNTRY.LABEL)}
                                className={styles.Dropdown}
                                innerClassName={cx(styles.Input, gClasses.MR0)}
                                popperClasses={cx(styles.PopperClasses, gClasses.ZIndex1)}
                                onChange={onChangeHandler(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.COUNTRY.ID, true)}
                                selectedValue={formDetails.country || null}
                                errorMessage={formDetails.error_list[SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.COUNTRY.ID]}
                                loadData={getDropDownValues}
                                setSelectedValue={!!formDetails.country}
                                enableSearch
                                disableFocusFilter
                                fixedPopperStrategy
                                isRequired
                            />
                            <Input
                                id={SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.STATE.ID}
                                placeholder={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.STATE.PLACEHOLDER)}
                                label={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.STATE.LABEL)}
                                className={styles.Dropdown}
                                inputContainerClasses={styles.Input}
                                onChangeHandler={onChangeHandler(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.STATE.ID, true)}
                                value={formDetails.state}
                                errorMessage={formDetails.error_list[SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.STATE.ID]}
                                isRequired
                            />
                        </div>
                        <div className={cx(gClasses.FTwo15GrayV3, gClasses.MT30, gClasses.FontWeight600, gClasses.MB15)}>{t(SET_PAYMENT_PROFILE_STRINGS.TAX_DETAILS)}</div>
                        <div className={BS.D_FLEX}>
                            <Input
                                id={SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.BILLING_CURRENCY.ID}
                                placeholder={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.BILLING_CURRENCY.PLACEHOLDER)}
                                label={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.BILLING_CURRENCY.LABEL)}
                                className={styles.Dropdown}
                                inputContainerClasses={styles.Input}
                                value={formDetails.billing_currency}
                                onChangeHandler={onChangeHandler(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.BILLING_CURRENCY.ID)}
                                errorMessage={formDetails.error_list[SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.BILLING_CURRENCY.ID]}
                                readOnly
                            />
                        </div>
                        <div className={cx(styles.TwoColumnContainer, BS.D_FLEX, BS.JC_BETWEEN)}>
                            <Dropdown
                                id={SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.TAX_NUMBER_TYPE.ID}
                                placeholder={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.TAX_NUMBER_TYPE.PLACEHOLDER)}
                                label={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.TAX_NUMBER_TYPE.LABEL)}
                                className={styles.Dropdown}
                                innerClassName={cx(styles.Input, gClasses.MR0)}
                                optionList={tax_number_type_list}
                                onChange={onChangeHandler(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.TAX_NUMBER_TYPE.ID)}
                                selectedValue={formDetails.type || null}
                                errorMessage={formDetails.error_list[SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.TAX_NUMBER_TYPE.ID]}
                                loadData={() => taxTypeOptionsCheck()}
                            />
                            <Input
                                id={SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.TAX_NUMBER.ID}
                                label={t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.TAX_NUMBER.LABEL)}
                                placeholder={tax_num_placeholder || t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.TAX_NUMBER.PLACEHOLDER)}
                                inputContainerClasses={styles.Input}
                                onChangeHandler={onChangeHandler(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.TAX_NUMBER.ID)}
                                value={formDetails.id}
                                errorMessage={formDetails.error_list[SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.TAX_NUMBER.ID]}
                            />
                        </div>
                        {/* <div className={cx(styles.VerificationInfo)}>
                            <p className={cx(BS.TEXT_CENTER, gClasses.FTwo12)}>{verificationInfoString(formDetails.billing_currency === 'INR')}</p>
                        </div> */}
                        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MT20, gClasses.MB50, styles.ButtonContainer, gClasses.MB10)}>
                            <Button buttonType={BUTTON_TYPE.SECONDARY} className={cx(styles.Button, styles.CancelButton)} previousArrow onClick={() => changeExistingPayScreen(CURRENT_PAY_SCREEN.PLANS_SELECT_SCREEN)}>{t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.SUBMIT_BUTTON.BACK)}</Button>
                            <Button buttonType={BUTTON_TYPE.AUTH_PRIMARY} className={styles.Button} nextArrow onClick={() => onSubmitClick()}>{t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.SUBMIT_BUTTON.NEXT)}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SetPaymentProfileForm;
