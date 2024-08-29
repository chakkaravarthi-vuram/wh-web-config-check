import React, { useContext } from 'react';
import { Button, Chip, EButtonSizeType, EButtonType, EChipSize } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import styles from './LastActivity.module.scss';
import ClockRewindIcon from '../../../../../../assets/icons/task/ClockRewindIcon';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import CloseIcon from '../../../../../../assets/icons/task/CloseIcon';
import { getActionClass, getActionDescription, getActionLabel, getFormattedDateAndTimeLabel } from '../../task_history/TaskHistoryCard/TaskHistoryCard.utils';
import { has, capitalize } from '../../../../../../utils/jsUtility';
import LAST_ACTIVITY from './LastActivity.strings';
import { USER_ACTIONS } from '../../../../../../utils/constants/action.constant';
import { FLOW_DASHBOARD } from '../../../../../../urls/RouteConstants';
import ThemeContext from '../../../../../../hoc/ThemeContext';

function LastActivity(props) {
    const { t } = useTranslation();
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);

    const { showFullActionHistory, data, onCloseClickHandler, sourceName, isBasicUser } = props;
    const isTriggerTask = has(data, ['parent_process_details']);
    const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;

    const action = data?.action;
    const actionType = data?.action_type;
    const actionClass = getActionClass(actionType, t);
    const task_content = data?.task_content;
    const actionHistoryType = data?.action_history_type;

    const getLatestActivityTask = () => {
        const user = data?.performed_by;
        const firstName = capitalize(user?.first_name);
        const lastName = capitalize(user?.last_name);
        const activityType = getActionLabel(data, isTriggerTask, t);
        let content = `${firstName} ${lastName} ${activityType}`;
        if (isTriggerTask) {
            content = `${sourceName} ${activityType}`;
        }
        if (actionHistoryType === USER_ACTIONS.COMPLETED) {
            content = `${activityType} ${sourceName}`;
        }
        let taskActionDesc = (getActionDescription(isTriggerTask, t, data)).toLowerCase();

        if (actionHistoryType === USER_ACTIONS.SNOOZED) {
            taskActionDesc += getFormattedDateAndTimeLabel(task_content?.schedule_date_time?.pref_datetime_display, t);
        }

        console.log('latest activity', content, 'latest activity', taskActionDesc, 'latest activity', action, 'latest activity', getActionDescription(isTriggerTask, t, data));
        return (

            <span>
                <span className={cx([gClasses.FTwo13GrayV89, gClasses.FontSize13, gClasses.DisplayInlineBlock, gClasses.FontWeight500])}>
                    &nbsp;
                    {content}
                </span>
                <span className={cx([gClasses.FontSize13])}>
                    &nbsp;
                    {taskActionDesc}
                </span>
                {isTriggerTask && (
                    <a
                        href={`${FLOW_DASHBOARD}/${data?.parent_process_details?.parent_flow_uuid}/${
                            data?.parent_process_details?.parent_id}`}
                        target="_blank"
                        className={cx(gClasses.FTwo13BlueV39, styles.link, gClasses.CursorPointer)}
                        style={{ color: colorSchema?.activeColor }}
                        rel="noreferrer"
                    >
                        {data?.parent_process_details?.parent_system_identifier}
                    </a>
                )}
                {action && <Chip
                    text={action}
                    textColor={actionClass.textColor}
                    backgroundColor={actionClass.backgroundColor}
                    size={EChipSize.sm}
                    className={cx(gClasses.WhiteSpaceNoWrap, gClasses.MB5, gClasses.DisplayInlineBlock)}
                />}
            </span>

        );
    };
    return (
            <div className={styles.LastActivity} style={{ backgroundColor: actionClass.backgroundColor || '#FFF6ED', borderBottom: actionClass.backgroundColor || '#FFF6ED' }}>
                <div className={cx([gClasses.DisplayFlex, gClasses.CenterV])}>
                    <span className={cx([gClasses.FTwo13GrayV87, gClasses.MR8])}>
                        <ClockRewindIcon className={styles.Icon} />
                        {t(LAST_ACTIVITY.LATEST_ACTIVITY_LBL)}
                        {getLatestActivityTask()}
                    </span>
                </div>
                <div className={cx([gClasses.DisplayFlex, gClasses.CenterV, styles.ActionHistory])}>
                    <Button
                        type={EButtonType.SECONDARY}
                        onClickHandler={showFullActionHistory}
                        size={EButtonSizeType.SM}
                        buttonText={t(LAST_ACTIVITY.SHOW_ACTION_HISTORY_LBL)}
                        className={styles.ShowHistoryButton}
                        noBorder
                        colorSchema={colorSchema}
                    />
                    <Button
                        icon={<CloseIcon />}
                        onClickHandler={onCloseClickHandler}
                        size={EButtonSizeType.SM}
                        iconOnly
                        type={EMPTY_STRING}
                    />
                </div>
            </div>
    );
}
export default LastActivity;

LastActivity.propTypes = {

};
