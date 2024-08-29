import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { NavBarDataChange } from 'redux/actions/NavBar.Action';
import { interactiveElements, keepTabFocusWithinModal, keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import CloseIconV2 from 'assets/icons/CloseIconV2';
import { KEY_CODES, KEY_NAMES } from 'utils/Constants';
import ThemeContext from '../../../hoc/ThemeContext';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import gClasses from '../../../scss/Typography.module.scss';
import styles from './Modal.module.scss';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import {
  ICON_STRINGS,
  layoutMainWrapperId,
  modalCommonClassName,
  dependencyCommonClassName,
  chatCommonClassName,
  popoverCommonClassName,
} from './Modal.strings';

function Modal(props) {
  const { t } = useTranslation();
  const closeIconClass = cx(styles.CloseIcon);
  let modalOrientationClass = null;
  const {
    onCloseClick,
    right,
    centerVH,
    contentClass,
    isModalOpen,
    children,
    centerH,
    removeDefaultPadding,
    id,
    noModalContentContainer,
    closeIconClasses,
    containerClass,
    noCloseIcon,
    onCloseClickLayout,
    escCloseDisabled,
    isPopoverModal,
    isModalLayoutUsed,
    outsideModalClickClose,
  } = props;
  const modalId = `Modal-${id}`;
  const modalInvisbleBtnId = `${modalId}-invisible`;

  const handleEscClick = (event) => {
    const modalClasses = document.getElementsByClassName(modalCommonClassName);
    const dependencyClasses = document.getElementsByClassName(dependencyCommonClassName);
    const chatClasses = document.getElementsByClassName(chatCommonClassName);
    const popperClasses = document.getElementsByClassName(popoverCommonClassName);

    if ((!isPopoverModal && popperClasses && popperClasses.length > 0) || (dependencyClasses && dependencyClasses.length > 0) || (chatClasses && chatClasses.length > 0)) return;

    // only for popover modals which is not in the same pages
    if (
      isPopoverModal &&
      popperClasses &&
      popperClasses.length > 0 &&
      event.key === KEY_NAMES.ESCAPE &&
      event.keyCode === KEY_CODES.ESCAPE
    ) {
      if (onCloseClickLayout) onCloseClickLayout();
      if (onCloseClick) onCloseClick();
      return;
    }
    if (
      !escCloseDisabled &&
      modalClasses &&
      isModalOpen &&
      event.key === KEY_NAMES.ESCAPE &&
      event.keyCode === KEY_CODES.ESCAPE
    ) {
      const { length } = modalClasses;
      if (length && modalClasses[length - 1].id === modalId) {
        if (onCloseClickLayout) onCloseClickLayout();
        if (onCloseClick && !onCloseClickLayout) onCloseClick();
      }
    }
  };

  useEffect(() => {
    // hide overflow while modal open
    const layoutMainDiv = document.getElementById(layoutMainWrapperId);
    if (layoutMainDiv && isModalOpen) {
      layoutMainDiv.classList.add(styles.OverFlowHidden);
    }

    if (!escCloseDisabled) document.addEventListener('keydown', handleEscClick);

    return () => {
      if (!escCloseDisabled) document.removeEventListener('keydown', handleEscClick);
      if (layoutMainDiv) {
        layoutMainDiv.classList.remove(styles.OverFlowHidden);
      }
    };
  }, [isModalOpen]);

  useEffect(() => {
    const root = document.getElementById('root');
    const modalPortal = document.getElementById('modal-container');

    if (isModalOpen) {
      root.setAttribute('aria-hidden', 'true');
      root.setAttribute('aria-disabled', 'true');
      root.setAttribute('tab-index', '-1');
      modalPortal.setAttribute('aria-hidden', 'false');
    }

    return () => {
      if (modalPortal.children.length === 0) {
        root.removeAttribute('aria-hidden');
        root.removeAttribute('aria-disabled');
        root.removeAttribute('tab-index');
        modalPortal.removeAttribute('aria-hidden');
      } else {
        const lastModal = modalPortal.children[modalPortal.children.length - 1];
        if (lastModal) {
          const lastModalId = lastModal.id;
          const invisibleBtn = document.getElementById(`${lastModalId}-invisible`);
          invisibleBtn && invisibleBtn.focus();
        }
      }
    };
  }, [isModalOpen]);

  // this function makes sure the user is not able to tab focus outside the modal
  useEffect(() => {
    const checkFocusFn = (e) => keepTabFocusWithinModal(e, modalId);

    if (isModalOpen && !isModalLayoutUsed) {
      const invisibleBtn = document.getElementById(modalInvisbleBtnId);
      setTimeout(() => {
        invisibleBtn && invisibleBtn.focus();
      }, 1);
      window.addEventListener('keydown', checkFocusFn, false);
    }
    return () => window.removeEventListener('keydown', checkFocusFn, false);
  }, [isModalOpen, isModalLayoutUsed]);

  const onClick = () => {
      const modal = document.getElementById(modalId);
      const focusable = modal?.querySelectorAll(interactiveElements);
      focusable && focusable.length === 1 && focusable[0].focus();
  };
// focus trap when the modal has only one interactive element
  useEffect(() => {
    const modal = document.getElementById(modalId);
      modal?.addEventListener('click', onClick, false);

    return () => {
      modal?.removeEventListener('click', onClick, false);
    };
  }, []);

  const onCloseClickHandle = () => {
    const { onCloseClick } = props;
    onCloseClick();
  };

  if (right) modalOrientationClass = BS.JC_END;
  if (centerVH) modalOrientationClass = gClasses.CenterVH;
  if (centerH) modalOrientationClass = gClasses.CenterH;
  const modalContent = cx(
    styles.ModalContent,
    contentClass,
    gClasses.ScrollBar,
    {
      [styles.ModalPadding]: removeDefaultPadding,
    },
  );

  let closeIcon = null;
  if (onCloseClick) {
    closeIcon = (
      <div
        className={cx(
          BS.P_ABSOLUTE,
          styles.CloseIconContainer,
          gClasses.WH28,
          closeIconClasses,
        )}
        role="button"
        onClick={onCloseClickHandle}
        tabIndex={0}
        aria-label="close"
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onCloseClickHandle(e)}
      >
        <CloseIconV2
          id={id}
          role={ARIA_ROLES.IMG}
          className={cx(closeIconClass, styles.CloseIcon)}
          title={t(ICON_STRINGS.CLOSE_ICON)}
          ariaHidden="true"
          height="16"
          width="16"
        />
      </div>
    );
  }
  return createPortal((isModalOpen ? (
  // return (isModalOpen ? (
    <div
      className={cx(
        styles.ModalBg,
        modalOrientationClass,
        gClasses.ModalBg,
        containerClass,
        modalCommonClassName,
        isPopoverModal && popoverCommonClassName,
        gClasses.ZIndex152,
      )}
      id={modalId}
      onClick={(e) => outsideModalClickClose && onCloseClick(e)}
      tabIndex={0}
      role="button"
      onKeyDown={() => {}}
    >
      {noModalContentContainer ? (
        children
      ) : (
        <div className={modalContent}>
          {noCloseIcon ? null : closeIcon}
          {!isModalLayoutUsed &&
        <div
            role="button"
            tabIndex={-1}
            aria-hidden="true"
            className={gClasses.InvisibleBtn}
            id={modalInvisbleBtnId}
        />
          }
          {children}
        </div>
      )}
    </div>
  ) : null), document.getElementById('modal-container'));
  // ) : null);
}

const mapStateToProps = (state) => {
  return {
    modalOpen: state.NavBarReducer.isModalOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: (data) => {
      dispatch(NavBarDataChange(data));
    },
    dispatch,
  };
};
Modal.defaultProps = {
  onCloseClick: null,
  right: false,
  centerVH: false,
  centerH: false,
  contentClass: EMPTY_STRING,
  isModalOpen: false,
  children: null,
  removeDefaultPadding: false,
  id: EMPTY_STRING,
  noModalContentContainer: false,
  containerClass: EMPTY_STRING,
  noCloseIcon: false,
  noModalOverflow: false,
  noUnmountToggle: false,
  outsideModalClickClose: false,
};
Modal.propTypes = {
  onCloseClick: PropTypes.func,
  right: PropTypes.bool,
  centerVH: PropTypes.bool,
  contentClass: PropTypes.string,
  isModalOpen: PropTypes.bool,
  children: PropTypes.node,
  centerH: PropTypes.bool,
  removeDefaultPadding: PropTypes.bool,
  id: PropTypes.string,
  noModalContentContainer: PropTypes.bool,
  containerClass: PropTypes.string,
  noCloseIcon: PropTypes.bool,
  noModalOverflow: PropTypes.bool,
  noUnmountToggle: PropTypes.bool,
  outsideModalClickClose: PropTypes.bool,
};
Modal.contextType = ThemeContext;
export default connect(mapStateToProps, mapDispatchToProps)(Modal);
delete Modal.contextType;
