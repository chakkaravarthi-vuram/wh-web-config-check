import {
  Button,
  DialogSize,
  EButtonType,
  ETextSize,
  ETitleAlign,
  ETitleHeadingLevel,
  ETitleSize,
  Modal,
  ModalStyleType,
  Text,
  Title,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import gClasses from '../../scss/Typography.module.scss';
import { UTIL_COLOR } from '../../utils/Constants';
import { BS } from '../../utils/UIConstants';
import styles from './DeleteConfirmModal.module.scss';
import CloseIconNew from '../../assets/icons/CloseIconNew';
import AlertCircle from '../../assets/icons/application/AlertCircle';

function DeleteConfirmModal(props) {
  const {
    id = 'delete-confirm-modal',
    onCancel,
    onClose,
    onDelete,
    title,
    subText1,
    subText2,
    isModalOpen,
  } = props;

  return (
    <Modal
      id={id}
      modalStyle={ModalStyleType.dialog}
      dialogSize={DialogSize.sm}
      className={gClasses.CursorAuto}
      mainContent={
        <div
          className={cx(
            BS.D_FLEX,
            BS.FLEX_COLUMN,
            BS.ALIGN_ITEM_CENTER,
            gClasses.P16,
          )}
        >
          <div className={cx(BS.D_FLEX, BS.JC_END, gClasses.MB8, BS.W100)}>
            <button onClick={() => onClose?.()}>
              <CloseIconNew />
            </button>
          </div>

          <div className={styles.AlertCircle}>
            <AlertCircle />
          </div>
          <Title
            content={title}
            alignment={ETitleAlign.middle}
            headingLevel={ETitleHeadingLevel.h5}
            size={ETitleSize.xs}
            className={gClasses.MB16}
          />
          {subText1 && (
            <Text
              content={subText1}
              size={ETextSize.SM}
              className={gClasses.MB8}
            />
          )}
          {subText2 && (
            <Text
              content={subText2}
              size={ETextSize.SM}
              className={gClasses.MB8}
            />
          )}
          <div
            className={cx(
              BS.D_FLEX,
              BS.ALIGN_ITEM_CENTER,
              gClasses.MT16,
              gClasses.MB32,
            )}
          >
            <Button
              buttonText="Cancel"
              onClickHandler={() => onCancel?.()}
              type={EButtonType.OUTLINE_SECONDARY}
              className={cx(gClasses.MR16)}
            />
            <Button
              buttonText="Delete"
              onClickHandler={() => onDelete?.()}
              colorSchema={{ activeColor: UTIL_COLOR.RED_600 }}
              type={EButtonType.PRIMARY}
            />
          </div>
        </div>
      }
      isModalOpen={isModalOpen}
    />
  );
}

export default DeleteConfirmModal;

DeleteConfirmModal.propTypes = {
  id: PropTypes.string,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  title: PropTypes.string,
  subText1: PropTypes.string,
  subText2: PropTypes.string,
  isModalOpen: PropTypes.bool,
};

DeleteConfirmModal.defaultProps = {
  id: 'delete-confirm-modal',
  subText1: '',
  subText2: '',
  isModalOpen: false,
};
