import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { connect } from 'react-redux';

import WarningIcon from '../../../assets/icons/WarningIcon';

import styles from './ConfirmPopover.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';

import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { clearConfirmPopover } from '../../../utils/UtilityFunctions';
import { BUTTON_TYPE } from '../../../utils/Constants';
import Button from '../../form_components/button/Button';

function ConfirmPopover(props) {
  const { onConfirm, title, isVisible } = props;
  useEffect(() => () => {
      clearConfirmPopover();
    }, []);

  const onNoClick = () => clearConfirmPopover();
  const onYesClick = () => {
    if (onConfirm) onConfirm();
    clearConfirmPopover();
  };

  if (isVisible) {
    return (
      <>
        <button
          className={cx(gClasses.ModalBg, gClasses.BlurBg, gClasses.ClickableElement)}
          style={{ zIndex: 4 }}
        >
          {EMPTY_STRING}
        </button>
        <div
          className={cx(
            styles.Container,
            BS.D_FLEX,
            BS.P_ABSOLUTE,
            BS.ALIGN_ITEM_CENTER,
            gClasses.InputBorderRadius,
          )}
        >
          <div className={cx(styles.CorrectIconContainer, gClasses.CenterVH)}>
            <WarningIcon />
          </div>
          <div className={cx(gClasses.ML15, gClasses.MR10, gClasses.CenterVH)}>
            <div
              className={cx(gClasses.FTwo13White, gClasses.FontWeight500)}
              style={{ maxWidth: '400px' }}
            >
              {title}
            </div>
          </div>
          <div className={cx(BS.ML_AUTO, BS.D_FLEX)}>
            <Button buttonType={BUTTON_TYPE.SECONDARY} className={cx(gClasses.WidthFitContent, styles.YesButton)} style={{ color: 'white' }} onClick={onYesClick}> YES </Button>
            <Button buttonType={BUTTON_TYPE.SECONDARY} className={gClasses.WidthFitContent} onClick={onNoClick}>No</Button>
          </div>
        </div>
      </>
    );
  }
  return null;
}

const mapStateToProps = (state) => {
  return {
    isVisible: state.ConfirmPopoverReducer.isVisible,
    title: state.ConfirmPopoverReducer.title,
    onConfirm: state.ConfirmPopoverReducer.onConfirm,
  };
};

ConfirmPopover.defaultProps = {
  title: EMPTY_STRING,
};

ConfirmPopover.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  title: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
};
export default connect(mapStateToProps)(ConfirmPopover);
