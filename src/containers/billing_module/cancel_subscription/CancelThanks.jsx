import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import styles from './CancelSubs.module.scss';
import ThankYouIcon from '../../../assets/icons/ThankYou';
import { CANCEL_COMMON } from './CancelSubs.strings';

function CancelThanks() {
    return (
        <>
            <ThankYouIcon />
            <div className={cx(styles.ThanksContainer, gClasses.MT30)}>
                <h2 className={gClasses.MB10}>{CANCEL_COMMON.THANKYOU}</h2>
                <p>{CANCEL_COMMON.CANCEL_THANK_HEADING}</p>
                <p>{CANCEL_COMMON.SUBHEADING_ONE}</p>
                <p className={gClasses.MT10}>{CANCEL_COMMON.SUBHEADING_TWO}</p>
                <div className={cx(gClasses.MT30)}>
                    <Button className={cx(styles.Button, gClasses.MR20, styles.KeepButton)} buttonType={BUTTON_TYPE.SECONDARY}>{CANCEL_COMMON.EXIT}</Button>
                    <Button className={cx(styles.Button, styles.SubmitButton)} buttonType={BUTTON_TYPE.PRIMARY}>{CANCEL_COMMON.REVIEW}</Button>
                </div>
            </div>
        </>
    );
}

export default CancelThanks;
