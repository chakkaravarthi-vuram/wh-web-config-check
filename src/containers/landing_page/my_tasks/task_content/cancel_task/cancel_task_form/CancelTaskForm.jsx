import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import modalStyles from 'components/form_components/modal_layout/CustomClasses.module.scss';
import { useHistory } from 'react-router';
import TextArea from '../../../../../../components/form_components/text_area/TextArea';
import Button, {
  BUTTON_TYPE,
} from '../../../../../../components/form_components/button/Button';
import { BS } from '../../../../../../utils/UIConstants';
import styles from '../CancelTask.module.scss';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { TASK_CONTENT_STRINGS } from '../../../../LandingPage.strings';
import {
  cancelTaskApiAction,
  clearCancelTaskData,
  setCancelTaskMessageAction,
  setCancelTaskModalVisibilityAction,
  setDataInCancelFormAction,
  taskContentDataChange,
} from '../../../../../../redux/actions/TaskActions';
import {
  mergeObjects,
  showToastPopover,
  validate,
} from '../../../../../../utils/UtilityFunctions';
import { cancelTaskFormValidateSchema } from '../../TaskContent.validation.schema';
import jsUtils from '../../../../../../utils/jsUtility';
import { FORM_POPOVER_STATUS } from '../../../../../../utils/Constants';

let cancelForCancelTask;

export const cancelTokenForCancelTask = (cancelToken) => {
  cancelForCancelTask = cancelToken;
};

function CancelTaskForm(props) {
  const {
    setCancelTaskMessage,
    cancel_reason,
    setCancelTaskModalVisibility,
    cancelTaskApi,
    error_list,
    server_error,
    task_metadata_uuid = '',
    onTaskSuccessfulSubmit,
    clearCancelTaskDataAction,
    setDataInCancelForm,
    id,
    isModalOpen,
    onCloseClick,
  } = props;
  const errors = mergeObjects(error_list, server_error);
  const history = useHistory();

  useEffect(() => {
    if (cancelForCancelTask) cancelForCancelTask();
    return () => {
      clearCancelTaskDataAction();
    };
  }, []);

  const cancelTaskValidateAndApiCall = (isSend = false) => {
    const errorList = validate({ cancel_reason: cancel_reason?.trim() }, cancelTaskFormValidateSchema);
    setDataInCancelForm({ error_list: errorList });
    if (jsUtils.isEmpty(errorList)) {
      if (task_metadata_uuid) {
        if (cancelForCancelTask) cancelForCancelTask();
        cancelTaskApi(
          {
            task_metadata_uuid,
            cancel_reason,
            send_notification: isSend,
          },
          () => onTaskSuccessfulSubmit(false, true),
          history,
        );
      } else {
        showToastPopover(
          'Error',
          'Error in cancelling task!',
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
    }
  };

  const onChangeHandler = (event) => {
    const { target: { value = '' } = {} } = event;
    setCancelTaskMessage(value);
  };

  const onButtonClickHandler = (event = {}) => {
    const { target: { id } = {} } = event;
    switch (id) {
      case TASK_CONTENT_STRINGS.CANCEL_TASK.FORM.BUTTONS.BACK_TO_TASK_PAGE.ID:
        setCancelTaskModalVisibility(false);
        setCancelTaskMessage('');
        break;
      case TASK_CONTENT_STRINGS.CANCEL_TASK.FORM.BUTTONS.SEND.ID:
        cancelTaskValidateAndApiCall(true);
        break;
      case TASK_CONTENT_STRINGS.CANCEL_TASK.FORM.BUTTONS.DO_NOT_SEND.ID:
        cancelTaskValidateAndApiCall();
        break;
      default:
        break;
    }
  };

  return (
    <ModalLayout
        id={id}
        isModalOpen={isModalOpen}
        onCloseClick={onCloseClick}
        mainContent={(
          <>
            <div className={cx(gClasses.FTwo13BlueV11, gClasses.FontWeight500)}>
              {TASK_CONTENT_STRINGS.CANCEL_TASK.FORM.QUESTION_TEXT}
            </div>
            <TextArea
              id={TASK_CONTENT_STRINGS.CANCEL_TASK.FORM.MESSAGE.ID}
              className={cx(gClasses.MT20)}
              innerClass={cx(styles.CancelTaskFormMessage)}
              label={TASK_CONTENT_STRINGS.CANCEL_TASK.FORM.MESSAGE.LABEL}
              placeholder={
                TASK_CONTENT_STRINGS.CANCEL_TASK.FORM.MESSAGE.PLACEHOLDER
              }
              onChangeHandler={onChangeHandler}
              value={cancel_reason}
              errorMessage={
                errors[TASK_CONTENT_STRINGS.CANCEL_TASK.FORM.MESSAGE.ID]
              }
              isRequired
            />
          </>
        )}
        headerContent={(
          <div className={modalStyles.ModalHeaderContainer}>
            <div>
              <h2 className={cx(modalStyles.PageTitle)}>
                {TASK_CONTENT_STRINGS.CANCEL_TASK.FORM.PAGE_TITLE}
              </h2>
            </div>
          </div>
        )}
        footerContent={(
          <div
          className={cx(BS.W100, BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}
          >
            <Button
              className={cx(modalStyles.SecondaryButton)}
              buttonType={BUTTON_TYPE.SECONDARY}
              id={
                TASK_CONTENT_STRINGS.CANCEL_TASK.FORM.BUTTONS.BACK_TO_TASK_PAGE.ID
              }
              onClick={onButtonClickHandler}
            >
              {
                TASK_CONTENT_STRINGS.CANCEL_TASK.FORM.BUTTONS.BACK_TO_TASK_PAGE.LABEL
              }
            </Button>
            <div className={cx(BS.D_FLEX)}>
              <Button
                className={cx(gClasses.ML10, modalStyles.SecondaryButton)}
                buttonType={BUTTON_TYPE.SECONDARY}
                id={
                  TASK_CONTENT_STRINGS.CANCEL_TASK.FORM.BUTTONS.DO_NOT_SEND.ID
                }
                onClick={onButtonClickHandler}
              >
                {
                  TASK_CONTENT_STRINGS.CANCEL_TASK.FORM.BUTTONS.DO_NOT_SEND.LABEL
                }
              </Button>
              <Button
                primaryButtonStyle={cx(gClasses.ML10, modalStyles.PrimaryButton)}
                buttonType={BUTTON_TYPE.PRIMARY}
                id={TASK_CONTENT_STRINGS.CANCEL_TASK.FORM.BUTTONS.SEND.ID}
                onClick={onButtonClickHandler}
              >
                {TASK_CONTENT_STRINGS.CANCEL_TASK.FORM.BUTTONS.SEND.LABEL}
              </Button>
            </div>
          </div>
        )}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    cancel_reason:
      state.TaskContentReducer.cancelTask.cancelTaskForm.cancel_reason,
    error_list: state.TaskContentReducer.cancelTask.cancelTaskForm.error_list,
    server_error:
      state.TaskContentReducer.cancelTask.cancelTaskForm.server_error,
    task_metadata_uuid:
      state.TaskContentReducer.taskMetadata.task_metadata_uuid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCancelTaskMessage: (...params) => {
      dispatch(setCancelTaskMessageAction(...params));
    },
    setDataInCancelForm: (...params) => {
      dispatch(setDataInCancelFormAction(...params));
    },
    cancelTaskApi: (...params) => {
      dispatch(cancelTaskApiAction(...params));
    },
    setCancelTaskModalVisibility: (...params) => {
      dispatch(setCancelTaskModalVisibilityAction(...params));
    },
    taskContentDataChangeAction: (data) => {
      dispatch(taskContentDataChange(data));
    },
    clearCancelTaskDataAction: () => {
      dispatch(clearCancelTaskData());
    },
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CancelTaskForm);
