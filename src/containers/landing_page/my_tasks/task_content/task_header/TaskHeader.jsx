import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { Thumbnail, AvatarGroup, AvatarSizeVariant, Button, DialogSize, EButtonIconPosition, EButtonSizeType, EButtonType, EPopperPlacements, Modal, ModalStyleType, Size, TextArea, UserDisplayGroup, SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import { useHistory, useLocation } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import styles from './TaskHeader.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';

import { TASK_CATEGORY_DATALIST_ADHOC_TASK, TASK_CATEGORY_FLOW_ADHOC_TASK, getTaskDescription, isAssigneedToOtherTab, isCompletedTab, isSnoozedTab } from '../../../../../utils/taskContentUtils';
import jsUtils, { isEmpty } from '../../../../../utils/jsUtility';
import { TASK_ACTION, TASK_CONTENT_STRINGS } from '../../../LandingPage.strings';
import { getTaskBasicDetails } from '../TaskContent.utils';
import { ARIA_ROLES, BS } from '../../../../../utils/UIConstants';
import { EMPTY_STRING, FORM_POPOVER_STRINGS } from '../../../../../utils/strings/CommonStrings';
import { getButtonComponentByTaskCategory, getCompletedDate, getDueDateByPriority, getDueDateString, getSnoozedDate, getTaskSummary } from './TaskHeader.utils';
import { constructAvatarOrUserDisplayGroupList, getFullName, getUserProfileData, isMobileScreen, showToastPopover } from '../../../../../utils/UtilityFunctions';
import { FORM_POPOVER_STATUS } from '../../../../../utils/Constants';
import { LANDING_PAGE } from '../../../LandingPageTranslation.strings';
import Tooltip from '../../../../../components/tooltip/Tooltip';
import { POPPER_PLACEMENTS } from '../../../../../components/auto_positioning_popper/AutoPositioningPopper';
import MoreIcon from '../../../../../assets/icons/MoreIcon';
import { TASK_TYPE, TASK_TYPE_BUTTON_ACTION_ID, USER_TYPE } from './TaskHeader.constants';
import InfoCircle from '../../../../../assets/icons/task/InfoCircle';
import SnoozeTask from '../snooze_task/SnoozeTask';
import Reassigntask from '../reassign_task/ReassignTask';
import PostUpdate from '../post_update/PostUpdate';
import TASK_HEADER from './TaskHeader.strings';
import ClipboardCheckIcon from '../../../../../assets/icons/application/ClipboardCheckIcon';
import ClipboardReviewTaskIcon from '../../../../../assets/icons/ClipboardReviewTaskIcon';
import ClipboardRejectTaskIcon from '../../../../../assets/icons/ClipboardRejectTaskIcon';
import CustomUserInfoToolTipNew from '../../../../../components/form_components/user_team_tool_tip/custom_userinfo_tooltip/CustomUserInfoToolTipNew';
import SnoozedTaskUntilIcon from '../../../../../assets/icons/task/SnoozedTaskUntilIcon';
import { getFormattedDateAndTimeLabel } from '../task_history/TaskHistoryCard/TaskHistoryCard.utils';
import ThemeContext from '../../../../../hoc/ThemeContext';

function TaskHeader(props) {
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
    const { t } = useTranslation();
    const history = useHistory();
    const [isReassignModal, setReassignModal] = useState(false);
    const [isSnoozeTaskModal, setShowSnoozeModal] = useState(false);
    const [isPostNoteModalOpen, setPostNoteModalOpen] = useState(false);
    const [hover, setHover] = useState(false);

    const { pathname } = useLocation();

    const [isMobile, setIsMobile] = useState(isMobileScreen());
    const userProfileData = getUserProfileData();
    const { parentProps, isLoading, isTestBed, taskMetadata, activeTaskDetail, selectedCardTab, isCompletedTask,
        taskCategory, breadCrumbComponent, snoozeProps, reassignProps, reviewRejectProps, saveAndCloseTask,
        postUpdateProps, showActionHistory, setAddOrRemoveAssigneeData, isBasicUser, isShowAppTasks } = props;
    const { taskMetadataID, replicateTaskApi, refreshTaskListApiParams } = parentProps;
    const { taskName } = getTaskBasicDetails(taskMetadata, selectedCardTab, activeTaskDetail, isLoading);
    const taskDescription = getTaskDescription(
        taskMetadata,
        activeTaskDetail,
        isLoading,
        selectedCardTab,
    )?.[0];

    const { actionButtons, kebabButtons } = getButtonComponentByTaskCategory(taskCategory, selectedCardTab, activeTaskDetail, userProfileData, taskMetadata, isMobile, isShowAppTasks, isBasicUser, t);

    const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;
    const thumbnailBgColor = isBasicUser ? `${colorScheme?.activeColor}20` : `${colorSchemeDefault?.activeColor}20`;
    const iconColor = isBasicUser ? colorScheme?.activeColor : colorSchemeDefault?.activeColor;
    const widgetBg = isBasicUser ? colorScheme?.widgetBg : colorSchemeDefault?.widgetBg;
    const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);

    const mobileViewScreen = () => {
        setIsMobile(isMobileScreen());
    };

    useEffect(() => {
        window.addEventListener('resize', mobileViewScreen);
        return () => {
            window.removeEventListener('resize', mobileViewScreen);
        };
    }, []);

    const getTitle = () => {
        const title = (
            (isAssigneedToOtherTab(selectedCardTab, pathname) &&
                jsUtils.get(taskMetadata, [TASK_CONTENT_STRINGS.TASK_INFO.TASK_NAME], null)) ||
            jsUtils.get(activeTaskDetail, TASK_CONTENT_STRINGS.TASK_INFO.TASK_META_DATA) ||
            jsUtils.get(activeTaskDetail, [
                TASK_CONTENT_STRINGS.TASK_INFO.TASKS_LOG_INFO,
                TASK_CONTENT_STRINGS.TASK_INFO.TASK_DEFINITION,
            ])
        );
        return title;
    };

    const getTaskTitleComponent = () => {
        let titleComponent =
            <h6
                className={cx(
                    gClasses.HeadingTitle,
                    gClasses.Ellipsis,
                    styles.Title,
                    gClasses.PR4,
                )}
                title={taskName}
            >
                {taskName}
            </h6>;
        if (((jsUtils.get(activeTaskDetail, ['task_log_info', 'task_category'])
            === TASK_CATEGORY_DATALIST_ADHOC_TASK)
            ||
            (jsUtils.get(activeTaskDetail, ['task_log_info', 'task_category']) === TASK_CATEGORY_FLOW_ADHOC_TASK))
            &&
            !isEmpty(jsUtils.get(activeTaskDetail, ['task_log_info', 'task_description']))) {
                console.log('1px solid1px solid', taskDescription);
            titleComponent =
                <div className={cx([gClasses.CenterV])}>
                    {titleComponent}
                    <div id="headerTaskDesc" className={cx(gClasses.CursorPointer)}>
                        &nbsp;
                        <InfoCircle id="headerTaskDesc" width={16} height={16} />
                        <Tooltip
                            id="headerTaskDesc"
                            placement={POPPER_PLACEMENTS.BOTTOM}
                            isCustomToolTip
                            customInnerClasss={styles.ToolTipContainer}
                            outerClass={gClasses.OpacityFull}
                            content={taskDescription}
                        />
                    </div>
                </div>;
        }
        return titleComponent;
    };

    const showHideReassignModal = (isShow) => {
        setReassignModal(isShow);
    };

    const showHideSnoozeModal = (isShow) => {
        setShowSnoozeModal(isShow);
    };

    const showHidePostNoteModal = (isShow) => {
        setPostNoteModalOpen(isShow);
    };

    const getBtnHandler = (id, event) => {
        let onClickFn = null;
        switch (id) {
            case TASK_TYPE_BUTTON_ACTION_ID.SAVE_AND_CLOSE:
                saveAndCloseTask(event, true);
                break;
            case TASK_TYPE_BUTTON_ACTION_ID.POST_NOTE:
                onClickFn = showHidePostNoteModal(true);
                break;
            case TASK_TYPE_BUTTON_ACTION_ID.DUPLICATE:
                onClickFn = replicateTaskApi({ task_metadata_id: taskMetadataID || taskMetadata?._id || id }, history, refreshTaskListApiParams);
                break;
            case TASK_TYPE_BUTTON_ACTION_ID.SNOOZE:
                onClickFn = showHideSnoozeModal(true);
                break;
            case TASK_TYPE_BUTTON_ACTION_ID.REASSIGN:
                onClickFn = showHideReassignModal(true);
                break;
            case TASK_TYPE_BUTTON_ACTION_ID.EDIT_ASSIGNEE:
                onClickFn = setAddOrRemoveAssigneeData(TASK_CONTENT_STRINGS.TASK_INFO.IS_MODAL_VISIBLE, true);
                break;
            case TASK_TYPE_BUTTON_ACTION_ID.ACTION_HISTORY:
                onClickFn = showActionHistory();
                break;
            default:
                break;
        }
        return onClickFn;
    };
    const onDropdownChange = (value) => {
        getBtnHandler(value);
    };

    const getButton = (btn) => {
        console.log('TTTTt', t(btn.name));
        return <Button
            buttonText={t(btn.name)}
            onClickHandler={(event) => getBtnHandler(btn.id, event)}
            size={EButtonSizeType.SM}
            type={EButtonType.TERTIARY}
            icon={btn.icon}
            iconPosition={EButtonIconPosition.LEFT}
            className={cx(gClasses.MR16, gClasses.PX0, gClasses.FTwo12BlackV20)}
            colorSchema={colorSchema}
        />;
    };

    const getKebabMenu = (optionList) => (
        <div>
            <SingleDropdown
                optionList={optionList}
                onClick={(value) => onDropdownChange(value)}
                dropdownViewProps={{
                    iconOnly: true,
                    icon:
                    <MoreIcon
                        role={ARIA_ROLES.IMG}
                        onMouseOver={() => setHover(true)}
                        onMouseOut={() => setHover(false)}
                        onFocus={() => setHover(true)}
                        onBlur={() => setHover(false)}
                        fillColor={(hover && iconColor)}
                    />,
                    className: styles.SubMenuLabel,
                }}
                popperPlacement={EPopperPlacements.BOTTOM_END}
                colorScheme={colorSchema}
                getPopperContainerClassName={() => cx(styles.OptionContainer, gClasses.MT10)}
                disabled={isLoading}
            />
        </div>
    );

    const getIconByTaskType = () => {
        let taskIcon = <ClipboardCheckIcon fillColor={iconColor} />;
        if (activeTaskDetail?.task_log_info?.task_type === TASK_TYPE.REVIEW) {
            taskIcon = <ClipboardReviewTaskIcon fillColor={iconColor} />;
        } else if (activeTaskDetail?.task_log_info?.is_send_back_task) {
            taskIcon = <ClipboardRejectTaskIcon fillColor={iconColor} />;
        }
        return taskIcon;
    };

    const getPopperContent = (id, type, onShow, onHide) => {
        const content = (
            <CustomUserInfoToolTipNew
                id={id}
                contentClassName={gClasses.BackgroundWhite}
                type={type}
                onFocus={onShow}
                onBlur={onHide}
                onMouseEnter={onShow}
                onMouseLeave={onHide}
                isStandardUserMode={isBasicUser}
                showCreateTask={showCreateTask || !isBasicUser}
            />
        );
        return content;
    };

    const getUserToolTipComponent = (user) => (
                user?.user_type === USER_TYPE.SYSTEM ?
                <>
                    &nbsp;
                    <span className={cx([gClasses.FontWeight500, gClasses.FontSize13])}>{getFullName(user.first_name, user.last_name)}</span>
                </> :
                <>
                    &nbsp;
                    <UserDisplayGroup
                        id="UserDisplayGroup"
                        userAndTeamList={constructAvatarOrUserDisplayGroupList({
                            users: [user],
                        })}
                        count={1}
                        separator=", "
                        popperPlacement={EPopperPlacements.BOTTOM_START}
                        getPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide)}
                        className={cx([gClasses.DisplayInlineBlock, gClasses.FontSize13, styles.TaskSummaryUser])}
                        colorScheme={colorSchema}
                    />
                    &nbsp;
                </>
            );

    const getTaskSummaryComponent = () => {
        const taskSummaryData = getTaskSummary(taskMetadata, activeTaskDetail, isLoading, selectedCardTab);
        const taskCategoryName = taskSummaryData?.taskCategoryName;
        const taskSummaryIcon = taskSummaryData?.taskSummaryIcon;
        const createdByLbl = taskSummaryData?.createdByLbl;
        const showUserName = taskSummaryData?.showUserName;
        const user = taskSummaryData?.user;
        const onLbl = taskSummaryData?.onLbl;
        const createdDate = getFormattedDateAndTimeLabel(taskSummaryData?.createdDate || EMPTY_STRING);
        return (
        <p className={cx(
            gClasses.FTwo13Black18,
            gClasses.ML3,
            gClasses.MB0,
            gClasses.MT3,
            gClasses.MinHeight16,
            gClasses.MinWidth75,
            gClasses.WordWrap,
        )}
        >
            <span className={cx([gClasses.DisplayInlineBlock, gClasses.CenterV])}>
                {taskSummaryIcon}
                <span className={cx([gClasses.ML3])}>{taskCategoryName}</span>
                &nbsp;
                <br className={cx([gClasses.D_SM])} />
                <span className={cx([gClasses.TextTransformLower])}>{createdByLbl}</span>
                {showUserName && getUserToolTipComponent(user)}
                <br className={cx([gClasses.D_SM])} />
                {onLbl}
                &nbsp;
                <span className={cx([styles.createdDate])}>{createdDate}</span>
            </span>
        </p>
        );
    };

    const [dueDate, dueDateObj] = getDueDateString(activeTaskDetail, taskMetadata, t);
    const dueDateStyle = getDueDateByPriority(dueDate, dueDateObj);
    const snoozedDate = isSnoozedTab(selectedCardTab) ? getSnoozedDate(activeTaskDetail, t) : EMPTY_STRING;
    const completedDate = isCompletedTab(selectedCardTab) ? getCompletedDate(activeTaskDetail, t) : EMPTY_STRING;
    let buttonComponent = null; let kebabComponent = null;

    if (actionButtons?.length > 0 && !(isCompletedTask &&
        !isCompletedTab(selectedCardTab))) {
        buttonComponent =
            <div className={cx([gClasses.CenterV])}>
                {actionButtons.map((btn) => getButton(btn))}
            </div>;
    }

    if (kebabButtons?.length > 0 && !(isCompletedTask &&
        !isCompletedTab(selectedCardTab))) {
        const optionList = [];
        kebabButtons.map((btn) => optionList.push({
            label: t(btn.name),
            value: btn.id,
            icon: btn.icon,
        }));

        kebabComponent = getKebabMenu(optionList);
    }

    const getModalContent = () => {
        console.log('isReassignModal', isReassignModal);
        if (isSnoozeTaskModal) {
            return (
                <div style={{ background: widgetBg }} className={gClasses.P24}>
                    <div className={cx(gClasses.FontWeight600, gClasses.FTwo18BlackV23)}>
                        {LANDING_PAGE.SNOOZE_TASK_TITLE}
                    </div>
                    <SnoozeTask
                        onSnoozeDataChange={snoozeProps?.onChange}
                        snoozeDate={snoozeProps?.snoozeDateTime}
                        snoozeDateError={snoozeProps?.snoozeErrorMessage}
                        snoozeComments={snoozeProps?.snoozeComments}
                        snoozeCommentsError={snoozeProps?.snoozeCommentErrorMessage}
                        isBasicUser={isBasicUser}
                    />
                </div>
            );
        } else if (isReassignModal) {
            return (
                <div style={{ background: widgetBg }} className={gClasses.P24}>
                    <div className={cx(gClasses.FontWeight600, gClasses.FTwo18BlackV23)}>
                        {t(TASK_CONTENT_STRINGS.REASSIGN.REASSIGN_TASK_HEADING)}
                    </div>
                    <Reassigntask
                        header={t(TASK_CONTENT_STRINGS.REASSIGN.REASSIGN_TASK_HEADING)}
                        optionList={TASK_CONTENT_STRINGS.REASSIGN.OPTION_LIST(t)}
                        onSelecthandler={reassignProps?.onChange}
                        selectedData={reassignProps?.assign_to_others}
                    />
                </div>
            );
        } else if (reviewRejectProps?.isModalOpen) {
            return (
                <div style={{ background: widgetBg }} className={gClasses.P24}>
                    <div className={cx(gClasses.FontWeight600, gClasses.FTwo18BlackV23)}>
                        {reviewRejectProps?.modalHeader}
                    </div>
                    <div className={gClasses.PT16}>
                        {reviewRejectProps?.reviewRejectData}
                    </div>
                    {reviewRejectProps.action.askForComments &&
                    <TextArea
                        className={gClasses.PT16}
                        id={TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID}
                        value={reviewRejectProps?.sendBackReviewComments}
                        labelText={t(TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.LABEL)}
                        isLoading={false}
                        placeholder={t(TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.PLACEHOLDER)}
                        labelClass={cx(gClasses.FTwo12BlackV20, gClasses.FontWeight500)}
                        onChange={reviewRejectProps?.onChange}
                        errorMessage={reviewRejectProps?.errorMessage}
                        size={Size.sm}
                        required={reviewRejectProps.action.isCommentsMandatory}
                        disabled={!reviewRejectProps.action.askForComments}
                        readOnly={!reviewRejectProps.action.askForComments}
                    />}
                </div>
            );
        } else if (isPostNoteModalOpen) {
            return (
                <div style={{ background: widgetBg }} className={gClasses.P24}>
                    <div className={cx(gClasses.FontWeight600, gClasses.FTwo18BlackV23)}>
                        {t(TASK_CONTENT_STRINGS.POST_COMMENT)}
                    </div>
                    <PostUpdate
                        comments={postUpdateProps?.comments}
                        onChange={postUpdateProps?.onChange}
                        commentsError={postUpdateProps?.commentsError}
                        attachmentProps={postUpdateProps?.attachmentProps}
                    />
                </div>
            );
        }
        return null;
    };

    const getFooterContent = () => {
        if (isSnoozeTaskModal) {
            return (
                <div
                    className={cx(
                        BS.W100,
                        BS.D_FLEX,
                        BS.JC_END,
                        gClasses.PX24,
                        gClasses.PB24,
                    )}
                    style={{ background: widgetBg }}
                >
                    <div className={gClasses.CenterV}>
                        <Button
                            type={EMPTY_STRING}
                            size={EButtonSizeType.LG}
                            buttonText={t(TASK_CONTENT_STRINGS.SNOOZE_TASK_DISCARD)}
                            className={cx(BS.TEXT_NO_WRAP)}
                            onClickHandler={() => {
                                snoozeProps?.close();
                                setShowSnoozeModal(false);
                            }}
                            colorSchema={colorSchema}
                        />
                    </div>
                    <div className={gClasses.CenterV}>
                        <Button
                            type={EButtonType.PRIMARY}
                            size={EButtonSizeType.LG}
                            buttonText={t(TASK_CONTENT_STRINGS.SNOOZE_TASK_CONFIRM)}
                            className={cx(BS.TEXT_NO_WRAP)}
                            onClickHandler={() => {
                                snoozeProps?.onChange({
                                    snoozeErrorMessage: '',
                                    snoozeDateTime: '',
                                    snoozeComments: EMPTY_STRING,
                                    snoozeCommentErrorMessage: EMPTY_STRING,
                                    isReassignModal: false,
                                });
                                snoozeProps?.submit?.(setShowSnoozeModal);
                            }}
                            colorSchema={colorSchema}
                        />
                    </div>
                </div>
            );
        } else if (isReassignModal) {
            return (
                <div
                    className={cx(
                        BS.W100,
                        BS.D_FLEX,
                        BS.JC_END,
                        gClasses.PX24,
                        gClasses.PB24,
                    )}
                    style={{ background: widgetBg }}
                >
                    <div className={gClasses.CenterV}>
                        <Button
                            type={EMPTY_STRING}
                            size={EButtonSizeType.LG}
                            buttonText={t(TASK_CONTENT_STRINGS.REASSIGN.CANCEL_BUTTON)}
                            className={cx(BS.TEXT_NO_WRAP)}
                            onClickHandler={() => {
                                reassignProps?.close?.();
                                setReassignModal(false);
                            }}
                            colorSchema={colorSchema}
                        />
                    </div>
                    <div className={gClasses.CenterV}>
                        <Button
                            type={EButtonType.PRIMARY}
                            size={EButtonSizeType.LG}
                            buttonText={t(TASK_CONTENT_STRINGS.REASSIGN.REASSIGN_BUTTON)}
                            className={cx(BS.TEXT_NO_WRAP)}
                            onClickHandler={() => {
                                reassignProps?.submit?.();
                            }}
                            colorSchema={colorSchema}
                        />
                    </div>
                </div>
            );
        } else if (reviewRejectProps?.isModalOpen) {
            return (
                <div
                    className={cx(
                        BS.W100,
                        BS.D_FLEX,
                        BS.JC_END,
                        gClasses.PX24,
                        gClasses.PB24,
                    )}
                    style={{ background: widgetBg }}
                >
                    <div className={gClasses.CenterV}>
                        <Button
                            type={EMPTY_STRING}
                            size={EButtonSizeType.LG}
                            buttonText={TASK_CONTENT_STRINGS.TASK_ACTION_CONFIRMATION.CANCEL}
                            className={cx(BS.TEXT_NO_WRAP)}
                            onClickHandler={() => {
                                reviewRejectProps?.close?.();
                            }}
                            colorSchema={colorSchema}
                        />
                    </div>
                    <div className={gClasses.CenterV}>
                        <Button
                            type={EButtonType.PRIMARY}
                            size={EButtonSizeType.LG}
                            buttonText={reviewRejectProps.action?.value}
                            className={cx(BS.TEXT_NO_WRAP)}
                            onClickHandler={(event) => {
                                reviewRejectProps?.submit?.(event);
                            }}
                            colorSchema={colorSchema}
                        />
                    </div>
                </div>
            );
        } else if (isPostNoteModalOpen) {
            return (
                <div
                    className={cx(
                        BS.W100,
                        BS.D_FLEX,
                        BS.JC_END,
                        gClasses.PX24,
                        gClasses.PB24,
                    )}
                    style={{ background: widgetBg }}
                >
                    <div className={gClasses.CenterV}>
                        <Button
                            type={EMPTY_STRING}
                            size={EButtonSizeType.LG}
                            buttonText={TASK_ACTION.POST_CANCEL_BUTTON.CANCEL}
                            className={cx(BS.TEXT_NO_WRAP)}
                            onClickHandler={() => {
                                showHidePostNoteModal(false);
                                postUpdateProps?.close?.();
                            }}
                            colorSchema={colorSchema}
                        />
                    </div>
                    <div className={gClasses.CenterV}>
                        <Button
                            type={EButtonType.PRIMARY}
                            size={EButtonSizeType.LG}
                            buttonText={TASK_ACTION.POST_CANCEL_BUTTON.POST}
                            className={cx(BS.TEXT_NO_WRAP)}
                            onClickHandler={() => {
                                if (postUpdateProps?.isAttachmentUploadInProgress) {
                                    showToastPopover(
                                        `${t('common_strings.attachment')} ${FORM_POPOVER_STRINGS.FILE_UPLOAD_IN_PROGRESS}`,
                                        EMPTY_STRING,
                                        FORM_POPOVER_STATUS.SERVER_ERROR,
                                        true,
                                      );
                                } else {
                                    postUpdateProps?.submit?.(() => {
                                        setPostNoteModalOpen(false);
                                        postUpdateProps?.close?.();
                                    });
                                }
                            }}
                            colorSchema={colorSchema}
                        />
                    </div>
                </div>
            );
        }
        return null;
    };

    const getAvatarGroup = () => {
        const assignees = constructAvatarOrUserDisplayGroupList(taskMetadata?.assignees);
        return (
        <span className={gClasses.MR8}>
            <AvatarGroup
                size={AvatarSizeVariant.sm}
                allAvatarData={assignees}
                isLoading={isLoading}
                popperPlacement={EPopperPlacements.BOTTOM_START}
                getPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide)}
                colorScheme={colorSchema}
            />
        </span>
        );
    };

    return (
        <>
            <Modal
                id="modalUI"
                modalStyle={ModalStyleType.dialog}
                dialogSize={DialogSize.sm}
                className={gClasses.CursorAuto}
                isModalOpen={isSnoozeTaskModal || isReassignModal || reviewRejectProps?.isModalOpen || isPostNoteModalOpen}
                customModalClass={cx(styles.TaskPopupModal)}
                mainContent={getModalContent()}
                mainContentClassName={cx(styles.MainContent)}
                footerContent={getFooterContent()}
            />
            <header
                className={cx(isTestBed ? styles.TestBedContainer : gClasses.WhiteBackground, styles.Header)}
                style={{ background: !isTestBed && widgetBg }}
            >
                {breadCrumbComponent}
                <div className={styles.TaskHeader}>
                    <div className={cx([gClasses.DisplayFlex, gClasses.CenterV])}>
                        {/* Task Icon */}
                        <Thumbnail
                            isDataLoading={isLoading}
                            showIcon
                            className={styles.Thumbnail}
                            icon={getIconByTaskType()}
                            backgroundColor={thumbnailBgColor}
                            title={getTitle()}
                        />
                        {!isLoading ?
                            <div className={gClasses.MR5}>
                                {/* Task Name */}
                                {getTaskTitleComponent()}
                                {/* task summary */}
                                <div
                                    className={cx(
                                        gClasses.CenterV,
                                    )}
                                >
                                    {getTaskSummaryComponent()}
                                </div>
                            </div>
                            : <Skeleton width={500} />}
                    </div>
                    {!isLoading ?
                        <div className={cx('d-flex align-items-center', gClasses.ML4)}>
                            {isAssigneedToOtherTab(selectedCardTab) && getAvatarGroup()}
                            {/* display snoozed date only if it is snoozed tab */}
                            {completedDate &&
                                <span
                                    className={cx([gClasses.FontWeight500, gClasses.FTwo12GreenV27, dueDate ? gClasses.MR12 : gClasses.MR3])}
                                >
                                    &nbsp;
                                    {`${t(TASK_HEADER.COMPLETED_LBL)}:`}
                                    &nbsp;
                                    {completedDate}
                                </span>
                            }
                            {dueDateStyle?.displayText &&
                                <div
                                    className={cx([gClasses.FontWeight500, gClasses.FontSize12, snoozedDate ? gClasses.MR12 : gClasses.MR3])}
                                    style={{ color: dueDateStyle?.textColor }}
                                >
                                    {dueDateStyle?.displayText}
                                </div>
                            }
                            {snoozedDate &&
                                <span
                                    className={cx([gClasses.FontWeight500, gClasses.FTwo12RedV30, gClasses.MR3])}
                                >
                                    <SnoozedTaskUntilIcon className={gClasses.MR3} />
                                    &nbsp;
                                    {t(TASK_HEADER.SNOOZED_LBL)}
                                    &nbsp;
                                    {snoozedDate}
                                </span>
                            }
                            {(dueDate || snoozedDate || completedDate) && !isMobile && <div className={styles.Divider} />}
                            {buttonComponent}
                            {kebabComponent}
                        </div> :
                        <Skeleton width={100} />
                    }
                </div>
            </header>
        </>
    );
}
export default TaskHeader;
TaskHeader.propTypes = {
    isLoading: PropTypes.bool,
    isTestBed: PropTypes.bool,
    selectedCardTab: PropTypes.number,
    taskCategory: PropTypes.string.isRequired,
    showReassign: PropTypes.bool,
};
