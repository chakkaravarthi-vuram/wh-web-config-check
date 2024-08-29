import React, { useContext } from 'react';
import {
  Modal,
  ModalStyleType,
  ModalSize,
  Title,
  ETitleHeadingLevel,
  ETitleSize,
  EButtonSizeType,
  Button,
} from '@workhall-pvt-lmt/wh-ui-library';
import PropTypes from 'prop-types';
import cx from 'clsx';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import styles from './TaskHistory.module.scss';
import { ARIA_ROLES, BS } from '../../../../../utils/UIConstants';
import { TASK_CONTENT_STRINGS } from '../../../LandingPage.strings';
import CloseIcon from '../../../../../assets/icons/CloseIcon';
import { keydownOrKeypessEnterHandle } from '../../../../../utils/UtilityFunctions';
import TaskHistory from './TaskHistory';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import ThemeContext from '../../../../../hoc/ThemeContext';

function TaskHistoryModal(props) {
    const { isTaskHistoryModalOpen = true, onCloseTaskHistoryModal, isTaskDataLoading, active_task_details,
    instanceId, referenceId, navigationLink, isCommentPosted, isCompletedTask, isBasicUser } = props;
    const { t } = useTranslation();
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);

    const widgetBg = isBasicUser ? colorScheme?.widgetBg : colorSchemeDefault?.widgetBg;

    const headerComponent = (
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.W100)} style={{ background: widgetBg }}>
          <Title
              className={cx(gClasses.FTwo18GrayV3, gClasses.PL24, gClasses.PT26)}
              content={t(TASK_CONTENT_STRINGS.HISTORY.LABEL)}
              headingLevel={ETitleHeadingLevel.h3}
              size={ETitleSize.medium}
          />
          <Button
              icon={
                <CloseIcon
                  className={cx(styles.CloseIcon, BS.JC_END, gClasses.CursorPointer)}
                  onClick={onCloseTaskHistoryModal}
                  role={ARIA_ROLES.BUTTON}
                  tabIndex={0}
                  ariaLabel={t(TASK_CONTENT_STRINGS.HISTORY.ARIA_LABELS.CLOSE)}
                  onKeyDown={(e) =>
                    keydownOrKeypessEnterHandle(e) && onCloseTaskHistoryModal()
                  }
                />
              }
              onClickHandler={onCloseTaskHistoryModal}
              size={EButtonSizeType.SM}
              iconOnly
              type={EMPTY_STRING}
              className={styles.CloseButton}
          />
        </div>
      );

    const mainComponent = (
      <div className={cx(gClasses.PT35, gClasses.PL24, gClasses.H100)} style={{ background: widgetBg }}>
        <TaskHistory
            isTaskDataLoading={isTaskDataLoading}
            active_task_details={active_task_details}
            instanceId={instanceId}
            referenceId={referenceId}
            navigationLink={navigationLink}
            isCommentPosted={isCommentPosted}
            isCompletedTask={isCompletedTask}
            hideHeader
        />
      </div>
    );

    return (
        <Modal
            id={TASK_CONTENT_STRINGS.HISTORY.ID}
            isModalOpen={isTaskHistoryModalOpen}
            headerContent={headerComponent}
            headerContentClassName={cx(BS.D_FLEX)}
            mainContent={mainComponent}
            mainContentClassName={styles.MainContent}
            modalStyle={ModalStyleType.modal}
            className={styles.TaskHistoryModal}
            modalSize={ModalSize.sm}
            footerContent={null}
        />
    );
}

TaskHistoryModal.defaultProps = {
    isTaskHistoryModalOpen: false,
    onCloseTaskHistoryModal: null,
    isCommentPosted: false,
    isCompletedTask: false,
    isTaskDataLoading: false,
    instanceId: EMPTY_STRING,
    showNavigationLink: false,
    active_task_details: {},
    referenceId: EMPTY_STRING,
    navigationLink: EMPTY_STRING,
};

TaskHistoryModal.propTypes = {
    isTaskHistoryModalOpen: PropTypes.bool,
    isCommentPosted: PropTypes.bool,
    isCompletedTask: PropTypes.bool,
    isTaskDataLoading: PropTypes.bool,
    showNavigationLink: PropTypes.bool,
    onCloseTaskHistoryModal: PropTypes.func,
    active_task_details: PropTypes.objectOf(PropTypes.any),
    instanceId: PropTypes.string,
    referenceId: PropTypes.string,
    navigationLink: PropTypes.string,
};

export default TaskHistoryModal;
