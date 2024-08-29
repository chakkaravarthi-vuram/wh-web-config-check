import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import { BS } from 'utils/UIConstants';
import TextArea from 'components/form_components/text_area/TextArea';
import styles from './CancelSubs.module.scss';
import { CANCEL_COMMON } from './CancelSubs.strings';

function CancelQuestions(props) {
    const { onSubmitClick, reason, onCloseClick, onQuestionChange, errorList } = props;
    return (
        <>
            <div className={cx(gClasses.CenterH, BS.FLEX_COLUMN, BS.ALIGN_ITEM_CENTER, styles.CancelSubcontainer, gClasses.MB30)}>
                <h2 className={cx(gClasses.FontWeight600, gClasses.MB10)}>{CANCEL_COMMON.WE_UNDERSTAND}</h2>
                <p>{CANCEL_COMMON.FEEDBACK}</p>
            </div>
            <div>
                {reason && reason.QUESTIONS.map((value, index) => (
                    <div className={cx(styles.QuestionConatainer, gClasses.MB20)}>
                        <h5>
                            {value.query}
                            <span>*</span>
                        </h5>
                        <TextArea
                            hideLabel
                            hideMessage
                            placeholder={value.placeholder}
                            className={styles.AnswerText}
                            value={value.ANSWER}
                            onChangeHandler={(e) => onQuestionChange(e.target.value, index)}
                            errorMessage={errorList[`${index},${CANCEL_COMMON.CANCEL_QUERY}`]}
                        />
                    </div>
                ))}
            </div>
            <div className={cx(styles.AnswerSubmit, gClasses.MT10, BS.CenterH, gClasses.MB50)}>
                <Button className={cx(styles.Button, gClasses.MR20, styles.KeepButton, styles.KeepButton)} buttonType={BUTTON_TYPE.SECONDARY} onClick={onCloseClick}>{CANCEL_COMMON.KEEP_MY_ACCOUNT}</Button>
                <Button className={cx(styles.Button, styles.CancelButton)} onClick={() => onSubmitClick(CANCEL_COMMON.CANCEL_THANKS_PAGE)}>{CANCEL_COMMON.CANCEL_SUBSCRIPTION}</Button>
            </div>
        </>
    );
}

export default CancelQuestions;
