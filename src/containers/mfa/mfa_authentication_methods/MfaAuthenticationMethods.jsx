import React, { useState, useEffect, useContext } from 'react';
import {
    Modal,
    Title,
    Button as LibraryButton,
    ModalSize,
    ModalStyleType,
    ETitleHeadingLevel,
    ETitleSize,
    Text,
    ETextSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'clsx';
import QRCode from 'react-qr-code';
import { useHistory } from 'react-router-dom';
import Button, { BUTTON_TYPE } from '../../../components/form_components/button/Button';
import gClasses from '../../../scss/Typography.module.scss';
import { ENABLE_MFA_STRINGS } from './MfaAuthenticationMethods.strings';
import { ALLOWED_MFA_METHOD } from './MfaAuthenticationMethods.constants';
import CloseIcon from '../../../assets/icons/CloseIcon';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import styles from './MfaAuthenticationMethods.module.scss';
import MailIconV2 from '../../../assets/icons/MailIconV2';
import MfaOTP from './mfa_otp/OTP';
import InfoIconNew from '../../../assets/icons/InfoIconNew';
import { getUserProfileData, isBasicUserMode, validate } from '../../../utils/UtilityFunctions';
import { verifyMfaAPIAction, userEnableOrDisableMfaApiAction, updateMFAInfo, MfaSetupverifyMfaAPIAction } from '../../../redux/actions/Mfa.Action';
import { UTIL_COLOR, KEY_CODES } from '../../../utils/Constants';
import Timer from '../../../components/timer/Timer';
import { enableDisableMfaValidationSchema } from '../../user_settings/mfa_settings/Mfa.validation.schema';
import jsUtils from '../../../utils/jsUtility';
import { store } from '../../../Store';
import { MFA_STRINGS } from '../../user_settings/mfa_settings/MFASetup.strings';
import ThemeContext from '../../../hoc/ThemeContext';

function MFAAuthenticationMethods(props) {
    const { t } = useTranslation();

    const { isModalOpen, onClose, mfa_method, MfaTOTPUrl, isDisableMfaConfrmationOtpModal, formDetails, setFormdetails, mfaData, dispatch, enableOrDisableUserMfaDetails, updateMFAInformation, isMFAEnforcedValidation, getAuthorizationDetailsApi, email } = props;

    const userDetails = getUserProfileData();
    const [otp, setOTP] = useState('');
    const history = useHistory();
    const isNormalMode = isBasicUserMode(history);
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
    const colorSchema = isNormalMode ? colorScheme : colorSchemeDefault;

    const handleOTPChange = (otpValue) => {
        setOTP(otpValue);
    };
    const handleEscClose = (event) => {
        if (event.keyCode === KEY_CODES.ESCAPE) {
            event.preventDefault();
            setFormdetails((prevState) => {
                return { ...prevState, isTOTPModalOpen: false };
            });
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleEscClose);
        return () => {
            document.removeEventListener('keydown', handleEscClose);
          };
    }, []);

    const onActivateMfaHandler = () => {
        const params = {
            mfa_code: otp,
        };
        if (getAuthorizationDetailsApi) {
            dispatch(MfaSetupverifyMfaAPIAction(params, isMFAEnforcedValidation, history, getAuthorizationDetailsApi))
            .then((res) => {
                if (res.is_otp_valid) {
                    setFormdetails({ ...formDetails, isTOTPModalOpen: false });
                    const params = {
                        error_list: {},
                        common_server_error: {},
                      };
                      updateMFAInformation(params);
                    setOTP('');
                }
            }).catch((error) => {
                console.log(error, 'onActivateMfaHandler');
            });
        } else {
            dispatch(verifyMfaAPIAction(params))
            .then((res) => {
                if (res.is_otp_valid) {
                    setFormdetails({ ...formDetails, isTOTPModalOpen: false });
                    const params = {
                        error_list: {},
                        common_server_error: {},
                      };
                      updateMFAInformation(params);
                    setOTP('');
                }
            }).catch((error) => {
                console.log(error, 'onActivateMfaHandler');
            });
        }
    };

    const resendOTPHandler = () => {
        const params = {
            default_mfa_method: mfaData.selectedMfaMethod,
        };
        const isResendOtp = true;
        const errorList = validate(params, enableDisableMfaValidationSchema(t), t);
        if (jsUtils.isEmpty(errorList)) {
            enableOrDisableUserMfaDetails(params, isResendOtp, isMFAEnforcedValidation);
        } else {
            store.dispatch(updateMFAInfo({
                error_list: { ...mfaData.error_list, errorList },
            }));
        }
    };

    const headerComponent = (
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.W100, gClasses.MT10)}>
            <Title
                className={cx(gClasses.FTwo20BlackV12, ((isDisableMfaConfrmationOtpModal && mfa_method === ALLOWED_MFA_METHOD.ALLOWED_MFA_METHOD_ID.TOTP_METHOD) ? gClasses.ML40 : gClasses.ML50), gClasses.MT10)}
                content={isDisableMfaConfrmationOtpModal ? t(ENABLE_MFA_STRINGS.DISABLE_MFA.DISABLE_MFA_MODAL_TITLE) : t(ENABLE_MFA_STRINGS.ENABLE_MFA_MODAL_TITLE)}
                headingLevel={ETitleHeadingLevel.h3}
                size={ETitleSize.medium}
            />
            <CloseIcon
                className={cx(styles.CloseIcon, BS.JC_END, gClasses.CursorPointer, gClasses)}
                onClick={onClose}
                role={ARIA_ROLES.BUTTON}
                tabIndex={0}
            />
        </div>
    );

    const mainComponent = (
        <div className={cx(mfa_method === ALLOWED_MFA_METHOD.ALLOWED_MFA_METHOD_ID.TOTP_METHOD ? gClasses.LeftH : gClasses.CenterV, BS.W100, gClasses.H80, gClasses.FlexDirectionColumn)}>
            {isDisableMfaConfrmationOtpModal ? (
                <div className={styles.DisableMfaModal}>
                    {mfa_method === ALLOWED_MFA_METHOD.ALLOWED_MFA_METHOD_ID.EMAIL_OTP_METHOD ? (
                        <div className={cx(styles.CenteredText)}>
                            <div className={cx(BS.D_FLEX, gClasses.CenterV, BS.JC_CENTER)}>
                                <div className={cx(gClasses.ML15, gClasses.MT10, gClasses.MR8, styles.CircleEmailIcon)}>
                                    <MailIconV2 />
                                </div>
                            </div>
                            <div>
                                <Text
                                    content={t(ENABLE_MFA_STRINGS.DISABLE_MFA.DISABLE_MFA_OTP_VERIFICATION_HEADER)}
                                    size={ETextSize.MD}
                                    className={cx(gClasses.MT8, gClasses.FontWeight500)}
                                />
                            </div>
                            <Text
                                content={`${t(ENABLE_MFA_STRINGS.DISABLE_MFA.VERIFICATION_CODE_WAS_SENT_PREFIX)} ${userDetails?.email || email}. ${t(ENABLE_MFA_STRINGS.DISABLE_MFA.VERIFICATION_CODE_WAS_SENT_SUFFIX)}`}
                                size={ETextSize.MD}
                                className={cx(gClasses.MT5, styles.CenteredText)}
                            />
                        </div>
                    ) :

                        (
                            <div className={cx(styles.CenteredText)}>
                                <div>
                                    <Text
                                        content={t(ENABLE_MFA_STRINGS.DISABLE_MFA.DISABLE_MFA_TOTP_VERIFICATION_HEADER)}
                                        size={ETextSize.MD}
                                        className={cx(gClasses.MT8, gClasses.FontWeight500)}
                                    />
                                </div>
                                <Text
                                    content={t(ENABLE_MFA_STRINGS.DISABLE_MFA.DISABLE_MFA_TOTP_MESSAGE)}
                                    size={ETextSize.MD}
                                    className={cx(gClasses.MT10)}
                                />
                            </div>
                        )}

                    <Text
                        content={t(ENABLE_MFA_STRINGS.DISABLE_MFA.VERIFICATION_CODE)}
                        size={ETextSize.MD}
                        className={cx(gClasses.MT20, gClasses.FontWeight500, styles.CenteredText)}
                    />
                    <div className={styles.CenteredText}>
                        <MfaOTP length={6} onChange={handleOTPChange} errorMessage={mfaData?.error_list?.mfa_code} />
                        {mfa_method === ALLOWED_MFA_METHOD.ALLOWED_MFA_METHOD_ID.EMAIL_OTP_METHOD && (
                            <Timer time={MFA_STRINGS.MFA_OTP_TIMER} resendOTPHandler={resendOTPHandler} ResendTest={styles.ResendTest} ResendStyle={styles.ResendStyle} isDisplayResendText />
                        )}
                    </div>
                    <div className={cx(BS.D_FLEX, gClasses.MT20, gClasses.MB20, styles.MfaWarningText)}>
                        <div className={gClasses.CenterV}>
                            <InfoIconNew className={cx(gClasses.MR10, styles.InfoIcon)} />
                            <Text
                                content={t(ENABLE_MFA_STRINGS.DISABLE_MFA.DISABLE_MFA_INFO)}
                                size={ETextSize.XS}
                            />
                        </div>
                    </div>

                </div>

            ) : (
                <div>
                    {mfa_method === ALLOWED_MFA_METHOD.ALLOWED_MFA_METHOD_ID.TOTP_METHOD &&
                        <>
                            <div className={cx(BS.D_FLEX, BS.ALIGN_ITEMS_START, BS.JC_START)}>
                                <div className={cx(gClasses.ML15, gClasses.MT10, gClasses.MR8, styles.CircleNumber)}>
                                    1
                                </div>
                                <div>
                                    <Text
                                        content={t(ENABLE_MFA_STRINGS.ENABLE_TOTP.DOWNLOAD_AUTHENTICATOR_APP_TEXT)}
                                        size={ETextSize.MD}
                                        className={cx(gClasses.MT10, gClasses.FontWeight500)}
                                    />
                                </div>
                            </div>
                            <Text
                                content={t(ENABLE_MFA_STRINGS.ENABLE_TOTP.DOWNLOAD_AND_INSTALL_AUTHENTICATOR_APP_TEXT)}
                                size={ETextSize.MD}
                                className={cx(gClasses.ML50)}
                            />
                            <div className={cx(BS.D_FLEX, gClasses.CenterV, BS.JC_START, gClasses.MT10)}>
                                <div className={cx(gClasses.ML15, gClasses.MR8, styles.CircleNumber)}>
                                    2
                                </div>
                                <div>
                                    <Text
                                        content={t(ENABLE_MFA_STRINGS.ENABLE_TOTP.SCAN_QR_CODE_STEP_TITLE)}
                                        size={ETextSize.MD}
                                        className={cx(gClasses.FontWeight500)}
                                    />
                                </div>
                            </div>

                            <Text
                                content={t(ENABLE_MFA_STRINGS.ENABLE_TOTP.OPEN_AUTHENTICATOR_APP_SCAN_QR_CODE)}
                                size={ETextSize.MD}
                                className={cx(gClasses.ML50)}
                            />

                            <div className={cx(styles.QRCode)}>
                                <QRCode
                                    size={140}
                                    value={MfaTOTPUrl || ''}
                                    viewBox="0 0 256 256"
                                    className={cx(gClasses.MT10, gClasses.ML50)}
                                />
                            </div>
                            <div className={cx(BS.D_FLEX, gClasses.CenterV, BS.JC_START, gClasses.MT10)}>
                                <div className={cx(gClasses.ML15, gClasses.MR8, styles.CircleNumber)}>
                                    3
                                </div>
                                <div>
                                    <Text
                                        content={t(ENABLE_MFA_STRINGS.ENABLE_TOTP.VERIFY_OTP_STEP_TITLE)}
                                        size={ETextSize.MD}
                                        className={cx(gClasses.FontWeight500)}
                                    />
                                </div>
                            </div>

                            <Text
                                content={t(ENABLE_MFA_STRINGS.ENABLE_TOTP.ENTER_SIX_DIGIT_CODE)}
                                size={ETextSize.MD}
                                className={cx(gClasses.MT5, gClasses.ML50)}
                            />

                            <div className={cx('w-full', gClasses.MT5, gClasses.ML50)}>
                                <MfaOTP length={6} onChange={handleOTPChange} errorMessage={mfaData?.error_list?.mfa_code} />
                            </div>

                            <div className={cx(BS.D_FLEX, gClasses.MT20, gClasses.MB20, styles.MfaWarningText)}>
                                <div className={gClasses.CenterV}>
                                    <InfoIconNew className={cx(gClasses.MR10, styles.InfoIcon)} />
                                    <Text
                                        content={t(ENABLE_MFA_STRINGS.ENABLE_MFA_INFO)}
                                        size={ETextSize.XS}
                                    />
                                </div>
                            </div>
                        </>
                    }
                    {mfa_method === ALLOWED_MFA_METHOD.ALLOWED_MFA_METHOD_ID.EMAIL_OTP_METHOD &&
                        <div className={cx(styles.CenteredText)}>
                            <div className={cx(BS.D_FLEX, gClasses.CenterV, BS.JC_CENTER)}>
                                <div className={cx(gClasses.ML15, gClasses.MT10, gClasses.MR8, styles.CircleEmailIcon)}>
                                    <MailIconV2 />
                                </div>
                            </div>
                            <div>
                                <Text
                                    content={t(ENABLE_MFA_STRINGS.ENABLE_EOTP.EMAIL_AUTHENTICATION_TITLE)}
                                    size={ETextSize.MD}
                                    className={cx(gClasses.MT8, gClasses.FontWeight500)}
                                />
                            </div>
                            <Text
                                content={`${t(ENABLE_MFA_STRINGS.ENABLE_EOTP.VERIFICATION_CODE_WAS_SENT_PREFIX)} ${userDetails?.email || email}. ${t(ENABLE_MFA_STRINGS.ENABLE_EOTP.VERIFICATION_CODE_WAS_SENT_SUFFIX)}`}
                                size={ETextSize.MD}
                                className={cx(gClasses.MT5, styles.CenteredText)}
                            />

                            <Text
                                content={t(ENABLE_MFA_STRINGS.ENABLE_EOTP.VERIFICATION_CODE)}
                                size={ETextSize.MD}
                                className={cx(gClasses.MT20, gClasses.FontWeight500)}
                            />
                            <div className={cx(gClasses.MT10, gClasses.FontWeight500)}>
                                <MfaOTP length={6} onChange={handleOTPChange} errorMessage={mfaData?.error_list?.mfa_code} />
                            </div>
                            <Timer time={MFA_STRINGS.MFA_OTP_TIMER} resendOTPHandler={resendOTPHandler} ResendTest={styles.ResendTest} ResendStyle={styles.ResendStyle} isDisplayResendText />
                            <div className={cx(BS.D_FLEX, gClasses.MT20, gClasses.MB20, styles.MfaWarningText)}>
                                <div className={gClasses.CenterV}>
                                    <InfoIconNew className={cx(gClasses.MR10, styles.InfoIcon)} />
                                    <Text
                                        content={t(ENABLE_MFA_STRINGS.ENABLE_MFA_INFO)}
                                        size={ETextSize.XS}
                                    />
                                </div>
                            </div>

                        </div>
                    }

                </div>

            )}

        </div>
    );

    const footerComponent = (
        <div className={cx(BS.D_FLEX, BS.JC_END, BS.W100, gClasses.PR40, gClasses.MB20)}>
            <Button
                buttonType={BUTTON_TYPE.LIGHT}
                className={cx(BS.TEXT_NO_WRAP, gClasses.MR20)}
                onClick={onClose}
                removePadding
            >
                {t(ENABLE_MFA_STRINGS.ENABLE_MFA_CANCEL_BTN_TEXT)}
            </Button>
            <LibraryButton
                buttonText={isDisableMfaConfrmationOtpModal ? t(ENABLE_MFA_STRINGS.DISABLE_MFA.DISABLE_MFA_DEACTIVATE_BTN_TEXT) : t(ENABLE_MFA_STRINGS.ENABLE_MFA_ACTIVATE_BTN_TEXT)}
                type={BUTTON_TYPE.PRIMARY}
                colorSchema={isDisableMfaConfrmationOtpModal ? { activeColor: UTIL_COLOR.RED_600 } : colorSchema}
                onClick={onActivateMfaHandler}
            />
        </div>
    );
    return (
        <Modal
            id="testcontrl"
            modalSize={ModalSize.md}
            isModalOpen={isModalOpen}
            headerContent={headerComponent}
            mainContent={mainComponent}
            footerContent={footerComponent}
            modalStyle={ModalStyleType.dialog}
            mainContentClassName={isDisableMfaConfrmationOtpModal ? styles.DisableMfaMainContent : styles.MfaMainContent}
        />
    );
}

const mapStateToProps = (state) => {
    return {
        isDataLoading: state.MfaReducer.isMFAMethodLoading,
        mfaData: state.MfaReducer,
        formDetails: state.MfaOtpVerificationReducer,
        MfaTOTPUrl: state.MfaReducer.MfaTOTPUrl,
        email: state.SignInReducer.email,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyMfaDetails: (params) => {
            dispatch(verifyMfaAPIAction(params));
        },
        enableOrDisableUserMfaDetails: (params, isResendOtp, isMFAEnforcedValidation) => {
            dispatch(userEnableOrDisableMfaApiAction(params, isResendOtp, isMFAEnforcedValidation));
        },
        updateMFAInformation: (params) => {
            dispatch(updateMFAInfo(params));
        },
        dispatch,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MFAAuthenticationMethods);
