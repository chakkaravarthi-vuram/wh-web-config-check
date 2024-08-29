import React from 'react';
import cx from 'classnames/bind';
import Modal from '../../components/form_components/modal/Modal';
import gClasses from '../../scss/Typography.module.scss';
import styles from './ChecklistWorkflowPolicy.module.scss';
import { CHECKLIST_WORKFLOW_POLICY_STRINGS } from './ChecklistWorkflowPolicy.strings';

function ChecklistWorkflowPolicy() {
  const optionList = CHECKLIST_WORKFLOW_POLICY_STRINGS.OPTIONS.map((option) => (
      <div className={cx(gClasses.InputBorder, styles.Card, gClasses.CenterV, gClasses.MB20)}>
        {option.ICON}
        <div>
          <div className={gClasses.FOne13GrayV14}>{option.TITLE}</div>
          <div
            className={cx(gClasses.FOne13GrayV3, gClasses.FontWeight500)}
          >
            {option.DESCRIPTION}
          </div>
        </div>
      </div>
    ));
  return (
    <Modal
      id="teams_modal"
      right
      isModalOpen
      //   onCloseClick={}
      contentClass={cx(gClasses.ModalContentClass, styles.Container)}
      escCloseDisabled
    >
      <div className={cx(gClasses.PageTitle, gClasses.MB15)}>
        {CHECKLIST_WORKFLOW_POLICY_STRINGS.TITLE}
      </div>
      {optionList}
    </Modal>
  );
}
export default ChecklistWorkflowPolicy;
ChecklistWorkflowPolicy.defaultProps = {};
ChecklistWorkflowPolicy.propTypes = {};
