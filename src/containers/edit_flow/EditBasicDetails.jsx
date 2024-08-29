import { Button, EButtonType, ETitleHeadingLevel, ETitleSize, Modal, ModalSize, ModalStyleType, Title } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useState, useEffect } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import styles from './EditFlow.module.scss';

import BasicDetails from './flow_configuration/basic_details/BasicDetails';
import { MODAL_ATTRIBUTES } from './EditFlow.constants';
import CloseIcon from '../../assets/icons/CloseIcon';
import { ARIA_ROLES } from '../../utils/UIConstants';
import { FLOW_STRINGS } from './EditFlow.strings';

export default function EditBasicDetails(props) {
    const { isModalOpen, onCloseClick, onContinueClickHandler, flowData, onFlowDataChange } = props;
    const { flow_name, flow_description } = flowData;
    const { t } = useTranslation();

    const [flowNameState, setFlowNameState] = useState(null);
    const [flowDescState, setFlowDescState] = useState(null);

    useEffect(() => {
        setFlowNameState(flow_name);
        setFlowDescState(flow_description);
    }, []);

    const onCloseClickHandler = () => {
        onFlowDataChange({ flow_name: flowNameState, flow_description: flowDescState });
        onCloseClick();
    };

    const main = (
        <BasicDetails
            isCreateFlowModal={false}
            continueClickHandler={onContinueClickHandler}
            onCloseClickHandler={onCloseClickHandler}
        />
    );
    const headerContent = (
    <div className={cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw, gClasses.W100)}>
    <Title
      className={cx(gClasses.FTwoBlackV20)}
      content={t(FLOW_STRINGS.EDIT_BASIC_DETAILS_TITLE)}
      headingLevel={ETitleHeadingLevel.h3}
      size={ETitleSize.medium}
    />
    <CloseIcon
      className={cx(styles.CloseIcon, gClasses.JusEnd, gClasses.CursorPointer)}
      role={ARIA_ROLES.BUTTON}
      tabIndex={0}
      ariaLabel="Close App Mo"
      onClick={onCloseClickHandler}
    />
    </div>
    );
    const footerComponent = (
        <div className={styles.BorderBottom}>
      <div className={cx(gClasses.DisplayFlex, gClasses.JusEnd, gClasses.W100Important)}>
        <Button
          buttonText={t(FLOW_STRINGS.ACTION_BUTTONS.SAVE)}
          type={EButtonType.PRIMARY}
          onClickHandler={onContinueClickHandler}
        />
      </div>
        </div>
    );
    return (
        <Modal
            id={MODAL_ATTRIBUTES.MODAL_ID}
            modalStyle={ModalStyleType.modal}
            headerContentClassName={cx(styles.HeaderClass, gClasses.DisplayFlex)}
            headerContent={headerContent}
            modalSize={ModalSize.md}
            isModalOpen={isModalOpen}
            mainContent={main}
            mainContentClassName={cx(gClasses.DisplayFlex, styles.MainComponent)}
            footerContent={footerComponent}
        />
    );
}
