import React, { useState, useEffect, useRef } from 'react';
import PropType from 'prop-types';
import cx from 'classnames/bind';
import jsUtility, { isEmpty } from 'utils/jsUtility';
import CloseIconV2 from 'assets/icons/CloseIconV2';
import gClasses from '../../../scss/Typography.module.scss';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import styles from './ModalLayout.module.scss';
import { isMobileScreen, keepTabFocusWithinModal, keydownOrKeypessEnterHandle } from '../../../utils/UtilityFunctions';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import Modal from '../modal/Modal';

function ModalLayout(props) {
  const {
    id,
    headerClassName,
    mainContentClassName,
    footerClassName,
    headerContent,
    mainContent,
    footerContent,
    isModalOpen,
    modalContainerClass,
    extraSpace,
    backgroundScrollElementId,
    unmountCall,
    modalCustomContainerClass,
    onCloseClick,
    centerVH = false,
    subHeaderContent,
    closeIconClass,
    headerContentClasses,
    mainContentRef, // modal content ref from Parent
    outsideModalClickClose,
    currentStep,
    scrollOnStepChange = false,
    noCloseIcon = false,
    escCloseDisabled = false,
    customModalLayoutContainer,
  } = props;
  const modalId = `Modal-${id}`;
  const modalInvisbleBtnId = `${modalId}-invisible`;
  const containerCompRef = useRef({});
  const buttonContainerCompRef = useRef({});
  const childRef = useRef({});
  const currentComponentCompRef = mainContentRef || childRef;
  const closeIconRef = useRef({});
  const [isMobileView, setMobileView] = useState(isMobileScreen());
  const [, setRefreshScreen] = useState(true);
  const mobileViewScreen = () => {
    setRefreshScreen((refreshScreen) => !refreshScreen);
    setMobileView(isMobileScreen());
  };
  const disableBackgroundScroll = (elementId, isRemove = false) => {
    const element = document.getElementById(elementId);
    if (element) element.classList.add(gClasses.OverflowHiddenImportant);
    if (element && isRemove) element.classList.remove(gClasses.OverflowHiddenImportant);
  };
  useEffect(() => {
    isModalOpen &&
      backgroundScrollElementId &&
      disableBackgroundScroll(backgroundScrollElementId);
    return () => {
      backgroundScrollElementId &&
        disableBackgroundScroll(backgroundScrollElementId, true);
      unmountCall && unmountCall();
    };
  }, [isModalOpen]);

  useEffect(() => {
    window.addEventListener('resize', mobileViewScreen);
    return () => {
      window.removeEventListener('resize', mobileViewScreen);
    };
  }, []);

  useEffect(() => {
    console.log('currentComponentCompRef modallayout', currentComponentCompRef);
    if (scrollOnStepChange) {
    const stepper = document.getElementById(`modal-content-${id}`);
    if (stepper) stepper.scrollTo(0, 0);
    }
  }, [currentStep]);
  useEffect(() => {
    let listHeight = 0;
    if (containerCompRef.current && buttonContainerCompRef.current) {
      listHeight =
        containerCompRef.current.clientHeight -
        (buttonContainerCompRef.current.clientHeight || 64);
    }
    if (
      currentComponentCompRef.current &&
      currentComponentCompRef.current.style
    ) {
      currentComponentCompRef.current.style.height = `${
        listHeight - extraSpace
      }px`; // 60px hardcoded assign to a dynamic variable(subtracting footer height)
    }
  });

  // this function makes sure the user is not able to tab focus outside the modal
  useEffect(() => {
    const checkFocusFn = (e) => keepTabFocusWithinModal(e, modalId);

    if (isModalOpen) {
      const invisibleBtn = document.getElementById(modalInvisbleBtnId);
      setTimeout(() => {
        invisibleBtn && invisibleBtn.focus();
      }, 1);
      window.addEventListener('keydown', checkFocusFn, false);
    }

  return () => window.removeEventListener('keydown', checkFocusFn, false);
}, [isModalOpen]);

  const onCloseClickLayout = () => {
    if (closeIconRef && closeIconRef.current && !isEmpty(closeIconRef.current)) {
      closeIconRef.current.click();
    } else {
      if (onCloseClick) onCloseClick();
    }
  };

  return (
  isModalOpen &&
    <Modal
      id={id}
      centerH={isMobileView}
      right={!isMobileView && !centerVH}
      contentClass={cx(styles.ModalContent, modalContainerClass)}
      containerClass={cx(styles.ModalContainer, modalCustomContainerClass)}
      isModalOpen={isModalOpen}
      onCloseClickLayout={onCloseClickLayout}
      noCloseIcon
      centerVH={centerVH && !isMobileView}
      isModalLayoutUsed={headerContent}
      onCloseClick={onCloseClick}
      escCloseDisabled={escCloseDisabled || false}
      outsideModalClickClose={outsideModalClickClose}
    >
      <div ref={containerCompRef} className={cx(styles.Container, customModalLayoutContainer)}>
        <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, BS.H100)}>
          {headerContent && (
            <div
              className={cx(
                BS.JC_BETWEEN,
                BS.ALIGN_ITEMS_START,
                BS.D_FLEX,
                BS.FLEX_COLUMN,
                styles.Header,
                headerClassName,
              )}
            >
              <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.W100)}>
                <div className={cx(styles.HeaderContent, headerContentClasses)}>
                  {headerContent}
                </div>
                {!noCloseIcon &&
                  <div
                  ref={closeIconRef}
                  className={cx(styles.Close, gClasses.CursorPointer, BS.D_FLEX, BS.JC_CENTER, BS.ALIGN_ITEM_CENTER, closeIconClass)}
                  onClick={onCloseClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onCloseClick(e)}
                  >
                    <CloseIconV2
                      className={cx(
                        gClasses.CursorPointer,
                      )}
                      ariaLabel="Close"
                      role={ARIA_ROLES.IMG}
                      height="16"
                      width="16"
                    />
                  <div
                    role="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    className={gClasses.InvisibleBtn}
                    id={modalInvisbleBtnId}
                  />
                  </div>
                }
              </div>
              {subHeaderContent}
            </div>
          )}

          {mainContent && (
            <div
              ref={currentComponentCompRef}
              className={cx(
                styles.ContentContainer,
                // gClasses.MB70,
                mainContentClassName,
              )}
              id={`modal-content-${id}`}
              tabIndex={-1}
            >
              {mainContent}
            </div>
          )}

          {footerContent && !jsUtility.isNull(footerContent) && (
            <div
              ref={buttonContainerCompRef}
              className={cx(
                BS.D_FLEX,
                BS.JC_BETWEEN,
                styles.ButtonContainer,
                BS.W100,
                footerClassName,
              )}
            >
              {footerContent}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
export default ModalLayout;

ModalLayout.defaultProps = {
  headerClassName: EMPTY_STRING,
  mainContentClassName: EMPTY_STRING,
  footerClassName: EMPTY_STRING,
  headerContent: null,
  mainContent: null,
  footerContent: null,
  extraSpace: 60,
  backgroundScrollElementId: null,
  modalCustomContainerClass: EMPTY_STRING,
  outsideModalClickClose: false,
};

ModalLayout.propTypes = {
  headerClassName: PropType.string,
  mainContentClassName: PropType.string,
  footerClassName: PropType.string,
  headerContent: PropType.oneOfType([PropType.element, PropType.node]),
  mainContent: PropType.oneOfType([PropType.element, PropType.node]),
  footerContent: PropType.oneOfType([PropType.element, PropType.node]),
  extraSpace: PropType.number,
  backgroundScrollElementId: PropType.string,
  modalCustomContainerClass: PropType.string,
  outsideModalClickClose: PropType.bool,
};
