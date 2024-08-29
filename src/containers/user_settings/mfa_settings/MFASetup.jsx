import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  ETextSize,
  Button,
  EButtonType,
  RadioSize,
 RadioGroupLayout,
 RadioGroup } from '@workhall-pvt-lmt/wh-ui-library';

import { Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { useHistory } from 'react-router';
import gClasses from '../../../scss/Typography.module.scss';
import styles from './MFASetup.module.scss';
import { BS } from '../../../utils/UIConstants';
import jsUtils from '../../../utils/jsUtility';
import {
  updateMFAInfo,
  getUserMfaDetailsApiAction,
  userEnableOrDisableMfaApiAction,
  verifyMfaAPIAction,
  disableMfaApiAction,
} from '../../../redux/actions/Mfa.Action';
import { store } from '../../../Store';
import FormTitle from '../../../components/form_components/form_title/FormTitle';
import { MFA_STRINGS } from './MFASetup.strings';
import MFAAuthenticationMethods from '../../mfa/mfa_authentication_methods/MfaAuthenticationMethods';
import MFAResetConfirmModal from '../../mfa/mfa_authentication_methods/confirm_model/ConfirmModal';
import { isBasicUserMode, validate } from '../../../utils/UtilityFunctions';
import { enableDisableMfaValidationSchema } from './Mfa.validation.schema';
import HelpIcon from '../../../assets/icons/HelpIcon';
import { ALLOWED_MFA_METHOD } from '../../mfa/mfa_authentication_methods/MfaAuthenticationMethods.constants';
import ThemeContext from '../../../hoc/ThemeContext';

function MFASetup(props) {
  const { t } = useTranslation();
  const { getUserMfaDetails, state, enableOrDisableUserMfaDetails, isMFAEnforcedValidation = false, getAuthorizationDetailsApi } = props;
  const {
    isMfaVerified,
    allowedMfaMethods,
    selectedMfaMethod,
    isMFAMethodLoading,
    isMfaEnforced,
    error_list,
    isShowMFADetails,
  } = state;
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);

  const [formDetails, setFormdetails] = useState({
    isTOTPModalOpen: false,
    showDisableMFAModal: false,
    showAllowedMfaMethods: false,
    isMfaMethodSelcted: false,
    isDisableMfaConfrmationOtpModal: false,
  });
  console.log('props', props);
  const onMfaMethodSelect = (mfa_authentication_method) => {
    store.dispatch(
      updateMFAInfo({
        selectedMfaMethod: mfa_authentication_method,
      }),
    );
    setFormdetails({ ...formDetails, isMfaMethodSelcted: true });
  };

  useEffect(() => {
    if (isShowMFADetails || (jsUtils.isEmpty(allowedMfaMethods))) {
      getUserMfaDetails(isMFAEnforcedValidation);
    }
  }, []);

  const onDisableMfaConfirmationHandler = () => {
    const params = {
      default_mfa_method: selectedMfaMethod,
    };
    const errorList = validate(params, enableDisableMfaValidationSchema(t), t);
    if (jsUtils.isEmpty(errorList)) {
      enableOrDisableUserMfaDetails(params, false, isMFAEnforcedValidation);
      setFormdetails({
        ...formDetails,
        isDisableMfaConfrmationOtpModal: true,
        showDisableMFAModal: false,
        isTOTPModalOpen: true,
        isMfaMethodSelcted: true,
      });
    } else {
      store.dispatch(
        updateMFAInfo({
          error_list: { ...error_list, errorList },
        }),
      );
    }
  };

  const onMfaEnableModalHandler = () => {
    let defaultSeletedMfaMethod = selectedMfaMethod;
    if (allowedMfaMethods.length === 1 && !isMfaVerified) {
      defaultSeletedMfaMethod = allowedMfaMethods[0].value;
    }
    const params = {
      default_mfa_method: defaultSeletedMfaMethod,
    };
    const errorList = validate(params, enableDisableMfaValidationSchema(t), t);
    if (jsUtils.isEmpty(errorList)) {
      enableOrDisableUserMfaDetails(params, false, isMFAEnforcedValidation);
      setFormdetails({ ...formDetails, isTOTPModalOpen: true });
    } else {
      store.dispatch(
        updateMFAInfo({
          error_list: { ...error_list, errorList },
        }),
      );
    }
  };

  return (
    <>
      <div className={BS.D_FLEX}>
        <FormTitle isDataLoading={isMFAMethodLoading}>
          {t(MFA_STRINGS.TITLE)}
        </FormTitle>
        <HelpIcon
          className={cx(gClasses.ML5, gClasses.MT5)}
          title={t(MFA_STRINGS.MFA_TOOLTIP_CONTENT)}
          id="mfa_tooltip_content"
          customInnerClasss={styles.HelpIcon}
        />
      </div>
      <div>
        {allowedMfaMethods.length === 2 && (
          <Text content={t(MFA_STRINGS.DESCRIPTION)} size={ETextSize.SM} />
        )}
        {allowedMfaMethods.length === 1 && (
          <Text
            content={t(
              allowedMfaMethods[0].value ===
                ALLOWED_MFA_METHOD.ALLOWED_MFA_METHOD_ID.TOTP_METHOD
                ? MFA_STRINGS.TOTP_DESCRIPTION
                : MFA_STRINGS.EOTP_DESCRIPTION,
            )}
            size={ETextSize.SM}
          />
        )}
      </div>
      <div>
        <Text
          content={t(MFA_STRINGS.MFA_STATUS_TITLE)}
          size={ETextSize.MD}
          className={cx(gClasses.MT24, gClasses.FontWeight500)}
        />
      </div>
      <div
        className={cx(
          BS.D_FLEX,
          BS.JC_CENTER,
          gClasses.MT8,
          isMfaVerified ? styles.MfaEnabled : styles.MfaDisabled,
        )}
      >
        <Text
          content={
            isMfaVerified
              ? t(MFA_STRINGS.MFA_STATUS_ENABLED_TEXT)
              : t(MFA_STRINGS.MFA_STATUS_DISABLED_TEXT)
          }
          size={ETextSize.XS}
        />
        <Text
          content={
            isMfaVerified
              ? t(MFA_STRINGS.MFA_STATUS_ACTIVATED)
              : t(MFA_STRINGS.MFA_STATUS_IN_ACTIVATED)
          }
          size={ETextSize.XS}
          className={cx(
            isMfaVerified ? styles.MfaActivatedText : styles.MfaInActivatedText,
          )}
        />
      </div>
      {!formDetails.showAllowedMfaMethods && (
        <div>
          {!isMfaEnforced ? (
            <div className={cx(BS.D_FLEX, BS.W100, gClasses.MT8)}>
              <Button
                id="enable_mfa"
                type={EButtonType.PRIMARY}
                onClick={() => {
                  if (isMfaVerified) {
                    setFormdetails({
                      ...formDetails,
                      showDisableMFAModal: true,
                    });
                  } else {
                    if (allowedMfaMethods.length === 2 && !isMfaVerified) {
                      store.dispatch(
                        updateMFAInfo({
                          selectedMfaMethod: 1,
                        }),
                      );
                      setFormdetails({
                        ...formDetails,
                        showAllowedMfaMethods: true,
                      });
                    }
                    if (allowedMfaMethods.length === 1 && !isMfaVerified) {
                      store.dispatch(
                        updateMFAInfo({
                          selectedMfaMethod: allowedMfaMethods[0].value,
                        }),
                      );
                      setFormdetails({
                        ...formDetails,
                        showAllowedMfaMethods: false,
                      });
                      onMfaEnableModalHandler();
                    }
                  }
                }}
                className={cx(styles.SecondaryButtonClass, gClasses.MT24)}
                colorSchema={isNormalMode ? colorScheme : colorSchemeDefault}
                buttonText={
                  isMfaVerified
                    ? t(MFA_STRINGS.DISABLE_MFA_BTN_TEXT)
                    : t(MFA_STRINGS.ENABLE_MFA_BTN_TEXT)
                }
              />
            </div>
          ) : (
            <div>
              {!isMfaVerified && (
                <div className={cx(BS.D_FLEX, BS.W100, gClasses.MT8)}>
                  <Button
                    id="enable_mfa"
                    type={EButtonType.PRIMARY}
                    onClick={() => {
                      if (isMfaVerified) {
                        setFormdetails({
                          ...formDetails,
                          showDisableMFAModal: true,
                        });
                      } else {
                        if (allowedMfaMethods.length === 2 && !isMfaVerified) {
                          store.dispatch(
                            updateMFAInfo({
                              selectedMfaMethod: 1,
                            }),
                          );
                          setFormdetails({
                            ...formDetails,
                            showAllowedMfaMethods: true,
                          });
                        }
                        if (allowedMfaMethods.length === 1 && !isMfaVerified) {
                          store.dispatch(
                            updateMFAInfo({
                              selectedMfaMethod: allowedMfaMethods[0].value,
                            }),
                          );
                          setFormdetails({
                            ...formDetails,
                            showAllowedMfaMethods: false,
                          });
                          onMfaEnableModalHandler();
                        }
                      }
                    }}
                    className={cx(styles.SecondaryButtonClass, gClasses.MT24)}
                    colorSchema={
                      isNormalMode ? colorScheme : colorSchemeDefault
                    }
                    buttonText={
                      isMfaVerified
                        ? t(MFA_STRINGS.DISABLE_MFA_BTN_TEXT)
                        : t(MFA_STRINGS.ENABLE_MFA_BTN_TEXT)
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {formDetails.showAllowedMfaMethods && !isMfaVerified && (
        <>
          <div>
            <Text
              content={t(MFA_STRINGS.ENABLE_MFA_BTN_TEXT)}
              size={ETextSize.LG}
              className={cx(gClasses.MT24, gClasses.FontWeight500)}
            />
          </div>
          <Row>
            <Col>
              <RadioGroup
                labelText={t(MFA_STRINGS.ENABLE_MFA.AUTHENTICATION_METHOD_LABEL)}
                selectedValue={selectedMfaMethod}
                options={allowedMfaMethods}
                optionClassName={gClasses.BlackV12}
                size={RadioSize.md}
                onChange={(_event, _id, value) => onMfaMethodSelect(value)}
                layout={RadioGroupLayout.inline}
                className={cx(gClasses.MT16)}
                labelClassName={gClasses.MB5}
                required
                colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
              />
            </Col>
          </Row>

          {allowedMfaMethods && (
            <div className={cx(BS.D_FLEX, BS.JC_START, BS.W100, gClasses.MT16)}>
              <Button
                id="enable_mfa"
                type={EButtonType.PRIMARY}
                buttonText={t(MFA_STRINGS.ENABLE_MFA_BTN_TEXT)}
                onClick={onMfaEnableModalHandler}
                className={cx(styles.SecondaryButtonClass, gClasses.MR16)}
                colorSchema={isNormalMode ? colorScheme : colorSchemeDefault}
              />
              <Button
                id="cancel_enable_mfa"
                type={EButtonType.SECONDARY}
                buttonText={t(MFA_STRINGS.CANCEL_BTN_TEXT)}
                onClick={() => {
                  setFormdetails({});
                }}
                className={cx(BS.TEXT_NO_WRAP, gClasses.MR20)}
                removePadding
                colorSchema={isNormalMode ? colorScheme : colorSchemeDefault}
              />
            </div>
          )}
        </>
      )}

      <div className={cx(BS.P_RELATIVE)}>
        <MFAResetConfirmModal
          isModalOpen={formDetails.showDisableMFAModal}
          content={t(MFA_STRINGS.DISABLE_MFA.DISABLE_MFA_MODAL_CONTENT_LINE1)}
          firstLine={t(MFA_STRINGS.DISABLE_MFA.DISABLE_MFA_MODAL_CONTENT_LINE2)}
          onDelete={onDisableMfaConfirmationHandler}
          onCloseModal={() => {
            store.dispatch(
              updateMFAInfo({
                common_server_error: {},
                error_list: {},
              }),
            );
            setFormdetails({ ...formDetails, showDisableMFAModal: false });
          }}
          okButtonName={t(
            MFA_STRINGS.DISABLE_MFA.DISABLE_MFA_MODAL_DISABLE_BTN_TEXT,
          )}
          cancelButtonName={t(
            MFA_STRINGS.DISABLE_MFA.DISABLE_MFA_MODAL_CANCEL_BTN_TEXT,
          )}
        />
      </div>
      <MFAAuthenticationMethods
        isModalOpen={formDetails.isTOTPModalOpen}
        onClose={() => {
          store.dispatch(
            updateMFAInfo({
              common_server_error: {},
              error_list: {},
            }));
          if (allowedMfaMethods.length === 2 && !isMfaVerified) {
            setFormdetails({ ...formDetails, isTOTPModalOpen: false, showAllowedMfaMethods: true });
          } else {
            setFormdetails({ ...formDetails, isTOTPModalOpen: false });
          }
        }}
        mfa_method={selectedMfaMethod}
        isDisableMfaConfrmationOtpModal={
          formDetails.isDisableMfaConfrmationOtpModal
        }
        setFormdetails={setFormdetails}
        formDetails={formDetails}
        isMFAEnforcedValidation={isMFAEnforcedValidation}
        getAuthorizationDetailsApi={getAuthorizationDetailsApi}
      />
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isMFAMethodLoading: state.MfaReducer.isMFAMethodLoading,
    mfaData: state.MfaReducer.MfaData,
    state: state.MfaReducer,
    userId: state.RoleReducer.user_id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    getUserMfaDetails: (isMFAEnforcedValidation) => {
      dispatch(getUserMfaDetailsApiAction(isMFAEnforcedValidation));
    },
    enableOrDisableUserMfaDetails: (params, isResendOtp, isMFAEnforcedValidation) => {
      dispatch(userEnableOrDisableMfaApiAction(params, isResendOtp, isMFAEnforcedValidation));
    },
    verifyDisableMfaOtpDtails: (params) => {
      dispatch(verifyMfaAPIAction(params));
    },
    disableMfaDetails: (params) => {
      dispatch(disableMfaApiAction(params));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MFASetup);
