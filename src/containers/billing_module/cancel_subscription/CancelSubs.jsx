/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import Modal from 'components/form_components/modal/Modal';
import { BS } from 'utils/UIConstants';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import { isEmpty, cloneDeep } from 'utils/jsUtility';
import { validate } from 'utils/UtilityFunctions';
import styles from './CancelSubs.module.scss';
import CancelThanks from './CancelThanks';
import CancelQuestions from './CancelQuestions';
import { CANCEL_REASONS, CANCEL_COMMON } from './CancelSubs.strings';
import { cancelArraySchema } from '../BillingModule.validation.schema';

function CancelSubscription(props) {
  const { cancelModalStatus, closeModal } = props;
  const [resaonState, setReasonState] = useState({});
  const [cancelPageStatus, setCancelPageStatus] = useState(CANCEL_COMMON.CANCEL_REASON_PAGE);
  const [errorList, setErrorList] = useState({});

  const onReasonClick = (value) => {
    setReasonState(value);
  };

  const onSubmitClick = (value) => {
    if (cancelPageStatus === CANCEL_COMMON.CANCEL_REASON_PAGE) {
      if (!isEmpty(resaonState)) {
        setCancelPageStatus(value);
      }
    } else if (cancelPageStatus === CANCEL_COMMON.CANCEL_QUESTION_PAGE) {
      const error = validate(resaonState.QUESTIONS, cancelArraySchema);
      setErrorList(error);
      if (isEmpty(error)) {
        setCancelPageStatus(value);
      }
    }
  };

  const onCloseHandler = () => {
    setReasonState('');
    setErrorList({});
    setCancelPageStatus(CANCEL_COMMON.CANCEL_REASON_PAGE);
    closeModal();
  };

  const onQuestionChange = (value, index) => {
    const current = cloneDeep(resaonState);
    current.QUESTIONS[index].ANSWER = value;
    setReasonState(current);
    if (!isEmpty(errorList)) {
      const error = validate(current.QUESTIONS, cancelArraySchema);
      setErrorList(error);
    }
  };

  const getCurrentCancelPage = () => {
    switch (cancelPageStatus) {
      case CANCEL_COMMON.CANCEL_REASON_PAGE:
        return (
          <>
          <div className={cx(gClasses.CenterH, BS.FLEX_COLUMN, BS.ALIGN_ITEM_CENTER, styles.CancelSubcontainer)}>
                <h2 className={cx(gClasses.FontWeight600, gClasses.MB10)}>{CANCEL_COMMON.CANCEL_SUB_HEADING}</h2>
                <p>{CANCEL_COMMON.CANCEL_SUB_SUBTITLE}</p>
                <h5 className={gClasses.MT40}>
                  {CANCEL_COMMON.CANCEL_REASON_TELL}
                  <span>{CANCEL_COMMON.ASTERISK}</span>
                </h5>
          </div>
              <div className={cx(gClasses.CenterH, BS.FLEX_WRAP_WRAP, gClasses.MT20, styles.ReasonsWrap, gClasses.MB30)}>
                {CANCEL_REASONS.map((reason, index) => (
                  <div key={index} className={cx(styles.ReasonTextContainer, gClasses.CursorPointer, reason.TYPE === resaonState.TYPE && styles.ReasonTextContainerSelect)} onClick={() => onReasonClick(reason)}>{reason.REASON}</div>
                ))}
              </div>
              <div className={cx(BS.CenterH, gClasses.MB60)}>
                <Button className={cx(styles.Button, gClasses.MR20)} buttonType={BUTTON_TYPE.SECONDARY} onClick={() => onCloseHandler()}>{CANCEL_COMMON.KEEP_MY_ACCOUNT}</Button>
                <Button className={cx(styles.Button, styles.SubmitButton)} buttonType={BUTTON_TYPE.PRIMARY} onClick={() => onSubmitClick(CANCEL_COMMON.CANCEL_QUESTION_PAGE)} disabled={isEmpty(resaonState)}>{CANCEL_COMMON.NEXT}</Button>
              </div>
          </>
        );
        case CANCEL_COMMON.CANCEL_QUESTION_PAGE:
          return (<CancelQuestions onSubmitClick={onSubmitClick} reason={resaonState} onCloseClick={() => onCloseHandler()} onQuestionChange={onQuestionChange} errorList={errorList} />);
        case CANCEL_COMMON.CANCEL_THANKS_PAGE:
          return (<CancelThanks onSubmitClick={onSubmitClick} />);
        default:
          return null;
    }
  };

    return (
      cancelModalStatus &&
        <Modal
        id="cancel_subs"
        contentClass={cx(styles.ModalContainer)}
        centerVH
        // containerClass={styles.ModalContainer}
        isModalOpen={cancelModalStatus}
        closeIconClasses={styles.Close}
        onCloseClick={() => onReasonClick(CANCEL_COMMON.KEEP_MY_ACCOUNT)}
        escCloseDisabled
        >
            <div className={cx(styles.CancelContainer, gClasses.CenterVH, BS.FLEX_COLUMN)}>
              <div className={cx(styles.ModalCloseIcon, gClasses.CursorPointer)} onClick={() => onCloseHandler()}>x</div>
              {console.log('gdsb', isEmpty(resaonState), resaonState)}
              {getCurrentCancelPage()}
              {cancelPageStatus !== CANCEL_COMMON.CANCEL_THANKS_PAGE && (
              <div className={cx(styles.NoteConatainer, gClasses.CenterV, gClasses.MB30)}>
                <div className={cx(styles.NoteInfo, gClasses.Italics, gClasses.MR30)}>{cancelPageStatus === CANCEL_COMMON.CANCEL_REASON_PAGE ? CANCEL_COMMON.HAVE_YOU_TRIED : resaonState.NOTE}</div>
                <div className={styles.ContactInfo}>{CANCEL_COMMON.CONTACT_TEAM}</div>
              </div>
              )}
            </div>
        </Modal>
    );
}

// const mapStateToProps = (state) => {
//     return {
//     };
//   };
//   const mapDispatchToProps = (dispatch) => {
//     return {
//     };
//   };

// export default connect(mapStateToProps, mapDispatchToProps)(CancelSubscription);
export default CancelSubscription;

CancelSubscription.propTypes = {
    isTableView: PropTypes.bool,
  };
CancelSubscription.defaultProps = {
    isTableView: false,
};
