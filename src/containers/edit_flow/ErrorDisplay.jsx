import React from 'react';
import BigAlertIcon from 'assets/icons/BigAlertNew';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import { ERROR_LABEL, OOPS_SOMETHING_WENT_WRONG, TRY_AGAIN } from 'utils/strings/CommonStrings';
import styles from './ErrorDisplay.module.scss';

function ErrorDisplay(props) {
    const { onButtonClick } = props;
    const { t } = useTranslation();
    return (
        <div className={cx(styles.Container, gClasses, gClasses.MT25)}>
            <div className={cx(BS.D_FLEX, BS.JC_CENTER)}>
                <BigAlertIcon />
            </div>
            <div className={cx(styles.ErrorTitle, gClasses.MT5)}>
                {t(ERROR_LABEL)}
            </div>
            <div className={cx(styles.ErrorMsg, gClasses.MT5)}>
                {t(OOPS_SOMETHING_WENT_WRONG)}
            </div>
            <div className={cx(BS.JC_CENTER, gClasses.MT15, BS.D_FLEX)}>
                <Button buttonType={BUTTON_TYPE.PRIMARY} onClick={onButtonClick}>
                    {t(TRY_AGAIN)}
                </Button>
            </div>
        </div>
    );
}

export default ErrorDisplay;
