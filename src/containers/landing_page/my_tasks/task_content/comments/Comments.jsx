import React, { useRef, useState, useEffect } from 'react';
import { TASK_CONTENT_STRINGS } from 'containers/landing_page/LandingPage.strings';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import TextArea from '../../../../../components/form_components/text_area/TextArea';
import styles from './Comment.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';

function Comments(props) {
    const { isAdhocComment, isFlowBasedTask, onCommentsChangeHandler, isSendBackReviewModalOpen, state, isAdhocCommentLable, onAdhocCommentClick, isTaskDataLoading, showNavigationLink, isReadonly, actionHistoryParrentElement, actionHistoryElement } = props;
    const textRef = useRef(null);
    // (actionHistoryParrentElement) It represent the parent container for the actionHistory component.
    // (actionHistoryElement) It represent the actionList container wrapper.
    const { t } = useTranslation();
    useEffect(() => {
            // currentHeight hoolds the height of the commentBox container for the initial render there will be fixed height of 76px.
            let currentHeight = textRef.current ? textRef.current.getBoundingClientRect().height : 76;
            if (showNavigationLink()) {
            currentHeight += 20; // 20px for the navigation Link container
            }
            // ParrentHeight holds the actionHistoryParrentElement height.
            const ParrentHeight = actionHistoryParrentElement && actionHistoryParrentElement.current && actionHistoryParrentElement.current.getBoundingClientRect().height;
            // applyHeight holds the percentage of height has to reduce from parrent container
            const applyHeight = (currentHeight / ParrentHeight) * 100;
            if (actionHistoryElement && actionHistoryElement.current) {
                actionHistoryElement.current.style.height = `${(100 - (applyHeight))}%`;
        }
    });
    let value = null;
    let errorMessage = null;
    const [isExpand, setIsExpand] = useState(false);
    if (!isAdhocComment) {
        if (isFlowBasedTask) {
            value = !isSendBackReviewModalOpen ? state[TASK_CONTENT_STRINGS.TASK_COMMENTS(t).ID] : null;
            errorMessage = !isSendBackReviewModalOpen && state.non_form_error_list[TASK_CONTENT_STRINGS.TASK_COMMENTS(t).ID];
        } else {
            value = state[TASK_CONTENT_STRINGS.TASK_COMMENTS(t).ID];
            errorMessage = state.non_form_error_list[TASK_CONTENT_STRINGS.TASK_COMMENTS(t).ID];
        }
    }
    const length = value ? value.length : 0;

    return !isTaskDataLoading && !isAdhocComment && actionHistoryParrentElement && actionHistoryElement && (
        <div className={cx(styles.Parent)} ref={textRef}>
                <TextArea
                    placeholder={TASK_CONTENT_STRINGS.TASK_COMMENTS(t).PLACEHOLDER}
                    label={TASK_CONTENT_STRINGS.TASK_COMMENTS(t).LABEL}
                    onChangeHandler={onCommentsChangeHandler}
                    id={TASK_CONTENT_STRINGS.TASK_COMMENTS(t).ID}
                    value={value}
                    errorMessage={errorMessage}
                    isAdhocCommentLable={isAdhocCommentLable}
                    onAdhocCommentClick={onAdhocCommentClick}
                    innerClass={cx(!isExpand && length === 0 && styles.InitialHeight, gClasses.BackgroundWhite)}
                    onFocusHandler={() => {
                        if (!isReadonly) {
                            setIsExpand(true);
                        }
                    }}
                    onBlurHandler={() => {
                        setIsExpand(length !== 0);
                    }}
                    readOnly={isReadonly}
                    helperTooltipMessage={t(TASK_CONTENT_STRINGS.TASK_COMMENTS(t).CONTENT)}
                    helperToolTipId="commentsLable"
                />
        </div>);
}
export default Comments;
