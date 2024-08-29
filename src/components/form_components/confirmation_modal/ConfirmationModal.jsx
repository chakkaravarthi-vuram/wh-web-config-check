/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef } from 'react';
import Proptypes from 'prop-types';
import cx from 'classnames/bind';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { Button, DialogSize, EButtonType, ETextSize, ETitleAlign, ETitleHeadingLevel, ETitleSize, Modal, ModalStyleType, Text, Title } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './ConfirmationModal.module.scss';
import CloseIconNew from '../../../assets/icons/CloseIconNew';
import AlertCircle from '../../../assets/icons/application/AlertCircle';
import { UTIL_COLOR } from '../../../utils/Constants';

const CONFIRMATION_MODAL_STRINGS = {
  ARIA_LABEL: {
    CLOSE: 'Close',
    ALERT: 'Alert',
  },
};

function useClickOutsideDetector(ref, closeModal, noClickOutsideAction) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target) && !noClickOutsideAction) {
        closeModal();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

function ConfirmationModal(props) {
    const {
        isModalOpen,
        confirmationName,
        cancelConfirmationName,
        mainDescription,
        subDescription,
        secondSubDescription,
        titleName,
        onConfirmClick,
        onCancelOrCloseClick,
        noClickOutsideAction,
        buttonContainerClass,
        notShowClose,
        innerClass,
        mainContentClass,
        primaryButtonClass,
        customIcon,
        customIconClass,
        customModalStyles,
        containerStyle,
    } = props;
  const wrapperRef = useRef(null);
  useClickOutsideDetector(wrapperRef, onCancelOrCloseClick, noClickOutsideAction);

    return (
    isModalOpen &&
    <Modal
      id="confirmation-modal"
      modalStyle={ModalStyleType.dialog}
      dialogSize={DialogSize.sm}
      className={gClasses.CursorAuto}
      isModalOpen={isModalOpen}
      customModalClass={cx(styles.ModalContainer, customModalStyles)}
      containerClassName={containerStyle}
      mainContent={(
        <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, BS.ALIGN_ITEM_CENTER, gClasses.P16, innerClass)}>
          {!notShowClose &&
           <div className={cx(BS.D_FLEX, BS.JC_END, gClasses.MB8, BS.W100)}>
            <button onClick={() => onCancelOrCloseClick()}>
              <CloseIconNew
              role={ARIA_ROLES.IMG}
              ariaLabel={CONFIRMATION_MODAL_STRINGS.ARIA_LABEL.CLOSE}
              className={cx(gClasses.CursorPointer)}
              />
            </button>
           </div>
          }
          <div className={customIcon ? customIconClass : styles.AlertCircle}>
            {customIcon || (
              <AlertCircle />
            )}
          </div>
          <Title
            content={titleName}
            alignment={ETitleAlign.middle}
            headingLevel={ETitleHeadingLevel.h5}
            size={ETitleSize.xs}
            className={gClasses.MB16}
          />
          <Text
            content={mainDescription}
            size={ETextSize.SM}
            className={cx(gClasses.MB8, BS.TEXT_CENTER)}
          />
          {secondSubDescription &&
            <Text
              content={secondSubDescription}
              size={ETextSize.SM}
              className={gClasses.MB8}
            />
          }
          {subDescription &&
            <Text
              content={subDescription}
              size={ETextSize.SM}
              className={cx(gClasses.MT15, gClasses.MB8, BS.TEXT_CENTER, gClasses.FTwo12RedV18)}
            />
          }
          <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.MT16, gClasses.MB32, buttonContainerClass)}>
            {(cancelConfirmationName) &&
              <Button
                buttonText={cancelConfirmationName}
                onClickHandler={() => onCancelOrCloseClick()}
                type={EButtonType.OUTLINE_SECONDARY}
                className={cx(styles.MdCancelBtn, gClasses.MR16)}
              />
            }
            {(confirmationName) &&
              <Button
              buttonText={confirmationName}
              onClickHandler={() => onConfirmClick()}
              colorSchema={{ activeColor: UTIL_COLOR.RED_600 }}
              className={primaryButtonClass}
              type={EButtonType.PRIMARY}
              />
            }
          </div>
        </div>
      )}
      mainContentClassName={cx(mainContentClass, styles.ContentClass)}
    />
    );
}
export default ConfirmationModal;

ConfirmationModal.defaultProps = {
        isModalOpen: false,
        confirmationName: EMPTY_STRING,
        cancelConfirmationName: EMPTY_STRING,
        mainDescription: EMPTY_STRING,
        subDescription: EMPTY_STRING,
        titleName: EMPTY_STRING,
        onConfirmClick: null,
        onCancelOrCloseClick: null,
        noClickOutsideAction: false,
        buttonContainerClass: EMPTY_STRING,
};

ConfirmationModal.propTypes = {
        isModalOpen: Proptypes.bool,
        confirmationName: Proptypes.string,
        cancelConfirmationName: Proptypes.string,
        mainDescription: Proptypes.string,
        subDescription: Proptypes.string,
        titleName: Proptypes.string,
        onConfirmClick: Proptypes.func,
        onCancelOrCloseClick: Proptypes.func,
        noClickOutsideAction: Proptypes.bool,
        buttonContainerClass: Proptypes.string,
};
