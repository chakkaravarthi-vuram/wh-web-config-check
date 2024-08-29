import React, { useContext } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import PropType from 'prop-types';

import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { join, get, isEmpty } from 'utils/jsUtility';
import { KEY_CODES } from 'utils/Constants';
import AddIcon from 'assets/icons/AddIcon';
import ThemeContext from 'hoc/ThemeContext';
import { CONFIGURATION_TYPE_ID } from 'containers/edit_flow/EditFlow.strings';
import { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import AssigneeGroups from 'containers/edit_flow/diagramatic_flow_view/flow_component/custom_nodes/assignee_group/AssigneeGroup';
import styles from './ConfigurationCard.module.scss';
import { getActionAndRecipient, getConfiguartionCardType } from '../../configurations/Configuration.utils';
import { DOCUMENT_GENERATION_STRINGS } from '../../configurations/document_generation/DocumentGeneration.utils';
import { SEND_DATA_TO_DATALIST } from '../../configurations/Configuration.constants';
import Trash from '../../../../../assets/icons/application/Trash';
import EditIcon from '../../../../../assets/icons/admin_settings/authentication/EditIcon';
import { ASSIGNEE_TYPE } from '../../../EditFlow.utils';

function ConfigurationCard(props) {
    const { t } = useTranslation();
    const {
            textContent,
            configKey,
            Icon,
            action,
            configurationTypeId,
            index,
            onEditHandler,
            onDeleteHandler,
            activeActionList,
            isAddNewConfig,
            onAddClickHandler,
            onKeyAddClickHandler,
            buttonClass,
            errorList = {},
        } = props;

    const [emailActions, recipients] = getActionAndRecipient(action, configurationTypeId, activeActionList);
    console.log('emailActions_configCard', emailActions, 'recipients', recipients, 'action', action, 'configKey', configKey);
    const users = [];
    const teams = [];
    const assigneeLabel = [];
    recipients.forEach((user) => {
        if (user.username) {
            users.push(user);
        } else if (user.team_name) {
            teams.push(user);
        } else {
            assigneeLabel.push({ label: user });
        }
    });
    const assigneeList = [
        (users.length > 0 || teams.length > 0) && {
            assignee_type: ASSIGNEE_TYPE.DIRECT_ASSIGNEE,
            assignees: {
                users: users.length > 0 && users,
                teams: teams.length > 0 && teams,
            },
        },
    ];
    const emailActionString = join(emailActions, ', ');
    const ConfigurationCardType = getConfiguartionCardType(action, configurationTypeId, t);
    const onMouseDelete = () => onDeleteHandler(index);
    const onMouseEdit = () => onEditHandler(index);

    const onKeyDelete = (event) => {
        if ((event.keyCode && event.keyCode === KEY_CODES.ENTER) || (event.which && event.which === KEY_CODES.ENTER)) {
            event.preventDefault();
            onDeleteHandler(index);
          }
    };
    const onKeyEdit = (event) => {
        if ((event.keyCode && event.keyCode === KEY_CODES.ENTER) || (event.which && event.which === KEY_CODES.ENTER)) {
            event.preventDefault();
            onEditHandler(index);
         }
    };
    const { buttonColor } = useContext(ThemeContext);

    if (isAddNewConfig) {
        return (
            <button
            className={cx(
                    gClasses.CenterVH,
                    gClasses.ClickableElement,
                    gClasses.CursorPointer,
                    styles.AddConfigCard,
                    buttonClass,
                    )}
            onClick={onAddClickHandler}
            onKeyDown={onKeyAddClickHandler}
            tabIndex="0"
            aria-label={textContent.ACTIONS.ADD}
            >
                <div className={cx(
                    gClasses.FTwo13,
                    gClasses.FontWeight500,
                    gClasses.CenterVH,
                    )}
                >
                <AddIcon className={styles.AddIcon} style={{ fill: buttonColor }} isButtonColor />
                <div style={{ color: buttonColor }}>{t(textContent.ACTIONS.ADD)}</div>
                </div>
            </button>
        );
    } else {
        return (
            <div id={`configuration${textContent?.TITLE}-${index}`} className={cx(styles.Card, !isEmpty(errorList[index]) && styles.ErrorStyles)} role="listitem">
                <div className={cx(BS.D_FLEX)}>
                    <div className={cx(gClasses.CenterV, styles.W75)}>
                        <div className={cx(gClasses.CenterV, styles.MailAddress)}>
                            <div className={styles.MailContainer}>
                                {Icon}
                            </div>
                            <div className={cx(
                                gClasses.ML10,
                                gClasses.FTwo12GrayV3,
                                gClasses.FontWeight500,
                                )}
                            >
                            { ([CONFIGURATION_TYPE_ID.SEND_DATA_TO_DATALIST, CONFIGURATION_TYPE_ID.DOCUMENT_GENERATION].includes(configurationTypeId)) ?
                                (
                                <div className={cx(styles.W260, gClasses.Ellipsis)}>
                                    {CONFIGURATION_TYPE_ID.SEND_DATA_TO_DATALIST === configurationTypeId ? get(action, [SEND_DATA_TO_DATALIST.FIELD_KEYS.DATA_LIST_NAME], '') : get(action, [DOCUMENT_GENERATION_STRINGS.TEMPLATE_NAME.ID], 'Form Field Value')}
                                </div>
                                ) :
                                (
                                    <AssigneeGroups
                                        outerClassName={styles.W260}
                                        assigneesList={assigneeList}
                                        assigneeLabels={assigneeLabel}
                                        className={cx(styles.MailId)}
                                        userDisplayClassname={styles.userDisplay}
                                        hideUserIcon
                                        popperPlacements={POPPER_PLACEMENTS.RIGHT}
                                        maxUserLimit={1}
                                    />
                                )
                            }
                            </div>
                        </div>
                        <div className={cx(gClasses.MB0)}>
                            <div className={cx(
                                gClasses.FTwo11GrayV9,
                                gClasses.FontWeight500,
                                )}
                            >
                                {t(textContent.CONDITION_TEXT)}
                            </div>
                            <div className={cx(
                                gClasses.FTwo12GrayV3,
                                gClasses.FontWeight500,
                                styles.ActionText,
                            )}
                            >
                                {emailActionString}
                            </div>
                        </div>
                    </div>
                    <div className={styles.ButtonContainer}>
                        <div className={cx(
                            gClasses.FTwo11GrayV9,
                            gClasses.FontWeight500,
                            BS.MARGIN_0,
                            )}
                        >
                            {ConfigurationCardType}
                        </div>
                        <div
                        className={cx(
                                gClasses.ML16,
                                gClasses.CenterVH,
                                gClasses.CursorPointer,
                                gClasses.ClickableElement,
                                )}
                            role="button"
                            tabIndex="0"
                            onClick={onMouseEdit}
                            onKeyDown={onKeyEdit}
                        >
                            <EditIcon className={styles.EditIcon} />
                        </div>
                        <div
                            className={cx(
                                gClasses.ML16,
                                gClasses.CenterVH,
                                gClasses.CursorPointer,
                                gClasses.ClickableElement,
                                )}
                            role="button"
                            tabIndex="0"
                            onClick={onMouseDelete}
                            onKeyDown={onKeyDelete}
                        >
                            <Trash />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ConfigurationCard;

ConfigurationCard.defaultProps = {
    onEditHandler: null,
    onDeleteHandler: null,
    Icon: null,
};
ConfigurationCard.propTypes = {
    onEditHandler: PropType.func,
    onDeleteHandler: PropType.func,
    Icon: PropType.oneOfType([PropType.node, PropType.element]),
};
