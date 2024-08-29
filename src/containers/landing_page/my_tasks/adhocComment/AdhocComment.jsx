import TextArea from 'components/form_components/text_area/TextArea';
import { TASK_ACTION, TASK_CONTENT_STRINGS } from 'containers/landing_page/LandingPage.strings';
import React, { useEffect, useRef } from 'react';
import { BS } from 'utils/UIConstants';
import cx from 'classnames/bind';
import { BUTTON_TYPE } from 'utils/Constants';
import Button from 'components/form_components/button/Button';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from './AdhocComment.module.scss';

function AdhocComment(props) {
    const { state, onAdhocCommentChangeHandler, onPostClickHandler, onCancelClick } = props;
    const textAreaRef = useRef(null);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            textAreaRef?.current?.focus();
           }, 0);
           return () => clearTimeout(timeoutId);
    }, []);
    if (state?.non_form_error_list[TASK_CONTENT_STRINGS.ADHOC_COMMENT_ID]) {
        textAreaRef?.current?.focus();
    }
    const { t } = useTranslation();
    return (
        <div className={cx(styles.ParentContainer)}>
          <div className={styles.CommentContainer}>
            <div className={styles.TextAreaContainer}>
            <TextArea
                placeholder={t(TASK_CONTENT_STRINGS.UPDATES_PLACEHOLDER)}
                // label={TASK_CONTENT_STRINGS.ADHOC_COMMENT}
                label={t(TASK_CONTENT_STRINGS.UPDATES_LABLE)}
                onChangeHandler={onAdhocCommentChangeHandler}
                id={TASK_CONTENT_STRINGS.ADHOC_COMMENT_ID}
                value={state[TASK_CONTENT_STRINGS.ADHOC_COMMENT_ID]}
                errorMessage={
                    state.non_form_error_list[TASK_CONTENT_STRINGS.ADHOC_COMMENT_ID]
                }
                innerClass={styles.TextArea}
                inputUserRef={textAreaRef}
            />
            </div>
            <div
                className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.MT16, BS.JC_END, styles.ButtonContainer)}
            >
                <Button
                 className={cx(gClasses.FTwo13GrayV53, gClasses.CursorPointer)}
                 buttonType={BUTTON_TYPE.SECONDARY}
                 onClick={onCancelClick}
                >
                {TASK_ACTION.POST_CANCEL_BUTTON.CANCEL}
                </Button>
                <Button
                 className={cx(gClasses.FTwo13White, gClasses.ML10, gClasses.BackGroundColorBlue40, BS.D_FLEX_JUSTIFY_CENTER, BS.ALIGN_ITEM_CENTER, gClasses.MR0, gClasses.CursorPointer)}
                 buttonType={BUTTON_TYPE.PRIMARY}
                 onClick={onPostClickHandler}
                >
                {TASK_ACTION.POST_CANCEL_BUTTON.POST}
                </Button>
                {/* <div
                    className={cx(gClasses.FTwo13White, gClasses.ML28, gClasses.BackGroundColorBlue40, styles.PostButton, BS.D_FLEX_JUSTIFY_CENTER, BS.ALIGN_ITEM_CENTER, gClasses.MR0, gClasses.CursorPointer)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onPostClickHandler}
                    onClick={onPostClickHandler}
                >
                    Post
                </div> */}
            </div>
          </div>
        </div>
    );
}
export default AdhocComment;
