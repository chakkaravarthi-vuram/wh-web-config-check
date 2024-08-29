import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { clearAlertPopOverStatus } from 'utils/UtilityFunctions';
import { DialogSize, EButtonType, Modal, ModalStyleType, Button } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from '../../scss/Typography.module.scss';
import styles from './AlertStatusPopover.module.scss';
import { alertPopOverStatusAction, logoutAction } from '../../redux/actions/Actions';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { ALERT_POPOVER_ACTIONS } from '../../utils/Constants';
import CloseIconNew from '../../assets/icons/CloseIconNew';

class AlertStatusPopover extends Component {
  render() {
    const { alertStatus } = this.props;
    return (
        alertStatus && alertStatus.isVisible ? (
          <Modal
            modalStyle={ModalStyleType.dialog}
            dialogSize={DialogSize.sm}
            mainContentClassName={cx(alertStatus.type === 2 ? styles.ModalContainerType2 : styles.ModalContainer)}
            isModalOpen
            className={styles.ZIndex}
            onCloseClick={clearAlertPopOverStatus}
            mainContent={alertStatus.customElement ? (
              alertStatus.customElement
            ) : (
              <>
                <div className={cx(gClasses.CenterH, gClasses.PositionRelative)}>
                  <div className={cx(gClasses.PageNotFoundTitle)}>{alertStatus.title}</div>
                  <CloseIconNew className={cx(styles.CloseIcon, gClasses.PositionAbsolute, gClasses.CursorPointer)} onClick={this.closePopover} />
                </div>
                <div className={cx(gClasses.PageNotFoundDesc, gClasses.MT5)}>{alertStatus.subTitle}</div>
                {alertStatus.isButtonVisible ? (
                  <div className={cx(gClasses.MT20, gClasses.CenterH)}>
                    <Button
                      buttonText={alertStatus.buttonTitle}
                      onClickHandler={this.alertStatusHandler}
                      type={EButtonType.PRIMARY}
                      className={cx(styles.MdCancelBtn, gClasses.MR16)}
                    />
                  </div>
                ) : null}
              </>
            )}
          />
        ) : null
    );
  }

  closePopover = () => {
    const { updateAlertStatusPopover } = this.props;
    const alertStatusObject = {
      status: EMPTY_STRING,
      title: EMPTY_STRING,
      subTitle: EMPTY_STRING,
      isVisible: false,
      isButtonVisible: false,
      buttonTitle: EMPTY_STRING,
      buttonAction: EMPTY_STRING,
    };
    updateAlertStatusPopover(alertStatusObject);
  };

  alertStatusHandler = () => {
    const { updateAlertStatusPopover, alertStatus } = this.props;
    const alertStatusObject = {
      status: EMPTY_STRING,
      title: EMPTY_STRING,
      subTitle: EMPTY_STRING,
      isVisible: false,
      isButtonVisible: false,
      buttonTitle: EMPTY_STRING,
      buttonAction: EMPTY_STRING,
    };
    updateAlertStatusPopover(alertStatusObject);
    if (alertStatus.buttonAction === ALERT_POPOVER_ACTIONS.CLEAR_REDUX_AND_GO_TO_SIGNIN) {
      window.location.reload();
    }
  };
}
const mapStateToProps = (state) => {
  return {
    alertStatus: state.AlertPopoverReducer.alertStatus,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateAlertStatusPopover: (value) => {
      dispatch(alertPopOverStatusAction(value));
    },
    clearRedux: (value) => {
      dispatch(logoutAction(value));
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AlertStatusPopover));

AlertStatusPopover.defaultProps = {
  alertStatus: {},
};
AlertStatusPopover.propTypes = {
  alertStatus: PropTypes.objectOf(PropTypes.any),
  updateAlertStatusPopover: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  clearRedux: PropTypes.func.isRequired,
};
