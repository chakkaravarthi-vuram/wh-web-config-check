import AutoPositioningPopper, { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import GreenTickRoundedIcon from 'assets/icons/GreenTickRoundedIcon';
import RoundedErrorIcon from 'assets/icons/RoundedErrorIcon';
import { ALPHA_NUMERIC_REGEX, SPECIAL_CHARACTERS_REGEX } from 'utils/strings/Regex';
import { ARIA_ROLES } from 'utils/UIConstants';
import { useTranslation } from 'react-i18next';
import { CONFIRM_PASSWORD_STRINGS } from 'containers/reset_password/ResetPassword.strings';
import styles from './PasswordHint.module.scss';

function PasswordHint(props) {
    const { referencePopperElement, isPopperOpen, passwordValue, errorMessage, isConfirmPassword, originalPasswordValue, role, ariaHidden, placement = false } = props;
    const [isCharacterLimit, setisCharacterLimit] = useState(false);
    const [isNumericDetection, setisNumericDetection] = useState(false);
    const [isConfirmPasswordSetection, setIsConfirmPasswordDetection] = useState(false);
    const [isAlphanumeric, setIsAlphaNumeric] = useState(false);
    const [isSpecialCharacter, setIsSpecialCharacter] = useState(false);
    const { t } = useTranslation();
    useEffect(() => {
      if (passwordValue.length >= 8) {
        setisCharacterLimit(true);
      } else {
        setisCharacterLimit(false);
      }
      const matchPattern = passwordValue.match(/\d+/g);
      if (matchPattern != null) {
        setisNumericDetection(true);
      } else {
        setisNumericDetection(false);
      }
      if (isConfirmPassword) {
        if (passwordValue && (passwordValue === originalPasswordValue)) {
        setIsConfirmPasswordDetection(true);
        } else setIsConfirmPasswordDetection(false);
      }
      const alphanumeric = passwordValue.match(ALPHA_NUMERIC_REGEX);
      if (alphanumeric != null) {
        setIsAlphaNumeric(true);
      } else {
        setIsAlphaNumeric(false);
      }
      const specialcharacter = passwordValue.match(SPECIAL_CHARACTERS_REGEX);
      if (specialcharacter != null) {
        setIsSpecialCharacter(true);
      } else {
        setIsSpecialCharacter(false);
      }
    }, [passwordValue, isPopperOpen]);

    return (
        <AutoPositioningPopper
            className={cx(
              gClasses.ZIndex5,
              gClasses.MT3,
              styles.PopperClass,
            )}
            // placement={POPPER_PLACEMENTS.BOTTOM_END}
            fallbackPlacements={placement ? [placement] : [POPPER_PLACEMENTS.TOP_END]}
            referenceElement={referencePopperElement}
            isPopperOpen={isPopperOpen}
        >
          {console.log('errorMessage', errorMessage)}
            <div className={!placement ? styles.ArrowBox : styles.UpArrowBox} aria-hidden={ariaHidden} role={role}>
              <div className={cx(gClasses.FTwo12GrayV3, gClasses.FontWeight600, gClasses.PB10)}>
              {isConfirmPassword ? t(CONFIRM_PASSWORD_STRINGS.CONFIRM_PASSWORD) : t(CONFIRM_PASSWORD_STRINGS.PASSWORD)}
              </div>
              {!isConfirmPassword && (
              <>
              <div className={gClasses.MB10}>
                {(isCharacterLimit) ? (<GreenTickRoundedIcon role={ARIA_ROLES.IMG} ariaHidden="true" />) : (
                  <RoundedErrorIcon role={ARIA_ROLES.IMG} ariaHidden="true" />
                )}
                <span
                  className={cx(gClasses.FTwo12BlackV13, gClasses.ML10, gClasses.PB15)}
                >
                  {t(CONFIRM_PASSWORD_STRINGS.CHARACTERS)}
                </span>
              </div>
              <div>
                {(isNumericDetection) ? (<GreenTickRoundedIcon role={ARIA_ROLES.IMG} ariaHidden="true" />) : (
                  <RoundedErrorIcon role={ARIA_ROLES.IMG} ariaHidden="true" />
                )}
                <span className={cx(gClasses.FTwo12BlackV13, gClasses.ML10)}>
                  {t(CONFIRM_PASSWORD_STRINGS.DIGIT_CHARACTERS)}
                </span>
              </div>
              <div className={gClasses.MT10}>
                {(isAlphanumeric) ? (<GreenTickRoundedIcon role={ARIA_ROLES.IMG} ariaHidden="true" />) : (
                  <RoundedErrorIcon role={ARIA_ROLES.IMG} ariaHidden="true" />
                )}
                <span className={cx(gClasses.FTwo12BlackV13, gClasses.ML10)}>
                  {t(CONFIRM_PASSWORD_STRINGS.ALPHANUMERIC_CHARACTERS)}
                </span>
              </div>
              <div className={gClasses.MT10}>
                {(isSpecialCharacter) ? (<GreenTickRoundedIcon role={ARIA_ROLES.IMG} ariaHidden="true" />) : (
                  <RoundedErrorIcon role={ARIA_ROLES.IMG} ariaHidden="true" />
                )}
                <span className={cx(gClasses.FTwo12BlackV13, gClasses.ML10)}>
                  {t(CONFIRM_PASSWORD_STRINGS.SYMBOL_REQUIRED)}
                </span>
              </div>
              </>
              )}
              {isConfirmPassword && (
              <div>
                {(isConfirmPasswordSetection) ? (<GreenTickRoundedIcon role={ARIA_ROLES.IMG} ariaHidden="true" />) : (
                  <RoundedErrorIcon role={ARIA_ROLES.IMG} ariaHidden="true" />
                )}
                <span className={cx(gClasses.FTwo12BlackV13, gClasses.ML10)}>
                  {t(CONFIRM_PASSWORD_STRINGS.EQUAL_TO_PASSWORD)}
                </span>
              </div>
              )}
            </div>
        </AutoPositioningPopper>
    );
}
export default PasswordHint;
