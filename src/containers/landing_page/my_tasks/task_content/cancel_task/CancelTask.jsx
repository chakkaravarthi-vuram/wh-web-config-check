import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CancelTaskForm from './cancel_task_form/CancelTaskForm';
import Button, { BUTTON_TYPE } from '../../../../../components/form_components/button/Button';
import { BS } from '../../../../../utils/UIConstants';
import styles from './CancelTask.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { TASK_CONTENT_STRINGS } from '../../../LandingPage.strings';
import { hexToRgbA } from '../../../../../utils/UtilityFunctions';
import { setCancelTaskModalVisibilityAction, setCancelTaskDialogVisibilityAction } from '../../../../../redux/actions/TaskActions';
import { isFlowTask } from '../TaskContent.utils';

function CancelTask(props) {
  const { cancelTask: { isCancelTaskModalOpen, isCancelTaskDialogVisible } = {}, setCancelTaskModalVisibility, setCancelTaskDialogVisibility, onTaskSuccessfulSubmit } = props;
  const { t } = useTranslation();

  const onCancelTaskClickHandler = () => {
    setCancelTaskModalVisibility(true);
  };

  const onCancelTaskModalCloseHandler = () => {
    setCancelTaskModalVisibility(false);
  };

  useEffect(() => {
    if (!isFlowTask()) {
      setCancelTaskDialogVisibility(true);
    }
  }, []);

  return isCancelTaskDialogVisible ? (
    <>
      <CancelTaskForm
        onTaskSuccessfulSubmit={onTaskSuccessfulSubmit}
        id="cancel_task_modal"
        isModalOpen={isCancelTaskModalOpen}
        onCloseClick={onCancelTaskModalCloseHandler}
        contentClass={cx(gClasses.ModalContentClass, gClasses.FullScreenModal, styles.CancelTaskModal)}
      />
      <div className={cx(styles.CancelTaskBoxContainer, BS.W100, gClasses.CenterV, BS.JC_BETWEEN, gClasses.MT20, gClasses.MB20)} style={{ backgroundColor: hexToRgbA('#FE6C6A', 0.1) }}>
        <div className={cx(gClasses.FTwo12RedV12, gClasses.FontWeight500)}>{t(TASK_CONTENT_STRINGS.CANCEL_TASK.POPUP.TITLE)}</div>
        <Button onClick={onCancelTaskClickHandler} buttonType={BUTTON_TYPE.CANCEL} className={cx(gClasses.ML20)}>
          {t(TASK_CONTENT_STRINGS.CANCEL_TASK.POPUP.BUTTON.LABEL)}
        </Button>
      </div>
    </>
  ) : null;
}

const mapStateToProps = (state) => {
  return {
    cancelTask: state.TaskContentReducer.cancelTask,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCancelTaskModalVisibility: (...params) => { dispatch(setCancelTaskModalVisibilityAction(...params)); },
    setCancelTaskDialogVisibility: (...params) => { dispatch(setCancelTaskDialogVisibilityAction(...params)); },
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CancelTask);
