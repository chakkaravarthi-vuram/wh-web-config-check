import React, { useContext } from 'react';
import cx from 'classnames/bind';
import PropType from 'prop-types';

import UserDisplayGroup from 'components/user_display/UserDisplayGroup';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import EditIcon from 'assets/icons/EditIcon';
import DeleteIcon from 'assets/icons/DeleteIcon';
import { join, get } from 'utils/jsUtility';
import { KEY_CODES } from 'utils/Constants';
import AddIcon from 'assets/icons/AddIcon';
import ThemeContext from 'hoc/ThemeContext';
import { getActionAndRecipient, getConfiguartionCardType } from 'containers/edit_flow/step_configuration/configurations/Configuration.utils';
import { DOCUMENT_GENERATION_STRINGS } from 'containers/edit_flow/step_configuration/configurations/document_generation/DocumentGeneration.utils';
import { CONFIGURATION_TYPE_ID } from 'containers/edit_flow/EditFlow.strings';
import styles from './ConfigurationCard.module.scss';
import { SEND_DATA_TO_DATALIST } from '../containers/edit_flow/step_configuration/configurations/Configuration.constants';

function ConfigurationCard(props) {
    const {
            textContent,
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
        } = props;
    // const emailAction = 'Escalation hours/days';
    // const mailId = 'nandhakumare@vuram.com';
    const [emailActions, recipients] = getActionAndRecipient(action, configurationTypeId, activeActionList);
    const emailActionString = join(emailActions, ', ');
    const ConfigurationCardType = getConfiguartionCardType(action, configurationTypeId);
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
                <div style={{ color: buttonColor }}>{textContent.ACTIONS.ADD}</div>
                </div>
            </button>
        );
    } else {
        return (
            <div className={styles.Card} role="listitem">
                <div className={cx(BS.JC_BETWEEN, BS.D_FLEX)}>
                    <div className={BS.D_FLEX}>
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
                            {/* {mailId} */}
                            { ([CONFIGURATION_TYPE_ID.SEND_DATA_TO_DATALIST, CONFIGURATION_TYPE_ID.DOCUMENT_GENERATION].includes(configurationTypeId)) ?
                                (
                                <div className={cx(styles.W180, gClasses.Ellipsis)}>
                                    {CONFIGURATION_TYPE_ID.SEND_DATA_TO_DATALIST === configurationTypeId ? get(action, [SEND_DATA_TO_DATALIST.FIELD_KEYS.DATA_LIST_NAME], '') : get(action, [DOCUMENT_GENERATION_STRINGS.TEMPLATE_NAME.ID], '')}
                                </div>
                                ) :
                                (
                                    <UserDisplayGroup
                                        maxUserLimit={1}
                                        showUserCountBased
                                        customItem={recipients}
                                        className={cx(styles.W180)}
                                        userDisplayClassname={styles.userDisplay}
                                        isCustomItem
                                    />
                                )
                            }
                            </div>
                        </div>
                        <div className={cx(gClasses.MB8)}>
                            <div className={cx(
                                gClasses.FTwo11GrayV9,
                                gClasses.FontWeight500,
                                )}
                            >
                                {textContent.CONDITION_TEXT}
                            </div>
                            <div className={cx(
                                gClasses.FTwo12GrayV3,
                                gClasses.FontWeight500,
                                styles.ActionText,
                            )}
                            >
                                {emailActionString}
                                {/* {emailAction} */}
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
                                styles.IconContainer,
                                gClasses.ML10,
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
                                styles.IconContainer,
                                gClasses.ML10,
                                gClasses.CenterVH,
                                gClasses.CursorPointer,
                                gClasses.ClickableElement,
                                )}
                            role="button"
                            tabIndex="0"
                            onClick={onMouseDelete}
                            onKeyDown={onKeyDelete}
                        >
                            <DeleteIcon className={styles.DeleteIcon} />
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
