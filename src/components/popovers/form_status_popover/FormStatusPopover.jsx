import React, { Component } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import ThemeContext from '../../../hoc/ThemeContext';

import ErrorIcon from '../../../assets/icons/ErrorIcon';
import CorrectIcon from '../../../assets/icons/CorrectIcon';
import CloseIcon from '../../../assets/icons/CloseIcon';
import ConditionalWrapper from '../../conditional_wrapper/ConditionalWrapper';
import Modal from '../../form_components/modal/Modal';

import styles from './FormStatusPopover.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import { FORM_POPOVER_STATUS } from '../../../utils/Constants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

import { formPopOverStatusAction } from '../../../redux/actions/Actions';

class FormStatusPopover extends Component {
  componentDidMount() {
    const {
      formPopoverStatus: { isModal },
      popoverRef,
    } = this.props;
    if (!isModal) {
      try {
        if (popoverRef) {
          if (popoverRef.current) {
            clearTimeout(popoverRef.current);
          }
          popoverRef.current = setTimeout(this.hidePopover, 5000);
        }
      } catch (e) {
        setTimeout(this.hidePopover, 5000);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      isVisible,
      popoverRef,
      formPopoverStatus,
    } = this.props;
    if (popoverRef && popoverRef.current) {
      if (prevProps.isVisible && !isVisible) {
        clearTimeout(popoverRef.current);
      }
      if (!(prevProps.isVisible) && isVisible) {
        clearTimeout(popoverRef.current);
        popoverRef.current = setTimeout(this.hidePopover, 5000);
      }
      if (formPopoverStatus?.isEditConfirmVisible) {
        clearTimeout(popoverRef.current);
      }
    }
  }

  render() {
    let popOver = null;
    let icon = null;
    let errorClass = null;
    let successStyle = null;

    const { primaryColor } = this.context;

    const {
      formPopoverStatus,
      formPopoverStatus: { isModal, ariaHidden },
    } = this.props;
    console.log('formPopoverStatus', formPopoverStatus);

    if (formPopoverStatus.isVisible) {
      switch (formPopoverStatus.status) {
        case FORM_POPOVER_STATUS.SUCCESS:
          successStyle = { backgroundColor: primaryColor };
          icon = (
            <div className={cx(styles.CorrectIconContainer, gClasses.CenterVH)}>
              <CorrectIcon isPrimaryColor ariaHidden="true" role={ARIA_ROLES.IMG} />
            </div>
          );
          break;
        case FORM_POPOVER_STATUS.SERVER_ERROR:
          errorClass = styles.ServerError;
          icon = <ErrorIcon ariaHidden="true" />;
          break;
        default:
          break;
      }
      popOver = (
        <ConditionalWrapper
          condition={isModal}
          wrapper={(children) => (
            <Modal isModalOpen noModalContentContainer onCloseClick={this.hidePopover}>
              {children}
            </Modal>
          )}
        >
          <div
            className={cx(styles.Container, BS.D_FLEX, BS.P_ABSOLUTE, errorClass, gClasses.InputBorderRadius)}
            style={successStyle}
            role="alertdialog"
            aria-modal="true"
            aria-describedby="alert_desc"
            aria-labelledby="alert_label"
            aria-hidden={ariaHidden}
            // tabIndex={1}
          >
            <CloseIcon className={cx(styles.CloseIcon, BS.P_ABSOLUTE, gClasses.CursorPointer)} onClick={this.hidePopover} tabIndex={0} ariaHidden="true" />
            {icon}
            <div className={cx(gClasses.ML10, gClasses.MT2, styles.StatusText)}>
              <div id="alert_label" className={cx(gClasses.FTwo13White, gClasses.FontWeight500, gClasses.MT3)}>
                {formPopoverStatus.title}
              </div>
              <div id="alert_desc" className={cx(gClasses.FTwo12White, gClasses.Opacity7)}>
                {formPopoverStatus.subTitle}
              </div>
            </div>
          </div>
        </ConditionalWrapper>
      );
    }
    return ReactDom.createPortal(popOver, document.getElementById('modal-container'));
    // return popOver;
  }

  // eslint-disable-next-line react/static-property-placement
  static contextType = ThemeContext;

  hidePopover = () => {
    console.log('iam here');
    const { updateFormPopOverStatus } = this.props;
    const formPopoverStatus = {
      status: EMPTY_STRING,
      title: EMPTY_STRING,
      subTitle: EMPTY_STRING,
      isVisible: false,
    };
    updateFormPopOverStatus(formPopoverStatus);
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    updateFormPopOverStatus: (value) => {
      dispatch(formPopOverStatusAction(value));
    },
  };
};
const mapStateToProps = (state) => {
  return {
    formPopoverStatus: state.FormStatusPopoverReducer.formStatus,
  };
};

FormStatusPopover.propTypes = {
  formPopoverStatus: PropTypes.objectOf(PropTypes.any).isRequired,
  updateFormPopOverStatus: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, mapDispatchToProps)(FormStatusPopover);
