import React from 'react';
import {
  Modal,
  DialogSize,
  ModalStyleType,
  Title,
  Text,
  ETitleAlign,
  ETextSize,
  ETitleSize,
  ETitleHeadingLevel,
  Button,
  EButtonType,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import AlertCircle from 'assets/icons/application/AlertCircle';
import CloseIconNew from 'assets/icons/CloseIconNew';
import { UTIL_COLOR } from 'utils/Constants';

function DeleteConfirmModal(props) {
  const {
    id,
    onCloseModal,
    content,
    firstLine,
    secondLine,
    onDelete,
    isModalOpen,
    cancelButton,
    deleteButton,
  } = props;

  return (
    <Modal
      id={id}
      isModalOpen={isModalOpen}
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
            <button onClick={onCloseModal}>
              <CloseIconNew />
            </button>
          </div>

          <div className={gClasses.AlertCircle}>
            <AlertCircle />
          </div>
          <Title
            content={content}
            alignment={ETitleAlign.middle}
            headingLevel={ETitleHeadingLevel.h5}
            size={ETitleSize.xs}
            className={gClasses.MB16}
          />
          <Text
            content={firstLine}
            size={ETextSize.SM}
            className={gClasses.MB8}
          />
          <Text
            content={secondLine}
            size={ETextSize.SM}
            className={gClasses.MB8}
          />
          <div
            className={cx(
              BS.D_FLEX,
              BS.ALIGN_ITEM_CENTER,
              gClasses.MT16,
              gClasses.MB32,
            )}
          >
            <Button
              buttonText={cancelButton}
              className={cx(gClasses.BorderNone, gClasses.MR16)}
              onClickHandler={onCloseModal}
              type={EButtonType.OUTLINE_SECONDARY}
            />
            <Button
              buttonText={deleteButton}
              onClickHandler={onDelete}
              type={EButtonType.PRIMARY}
              colorSchema={{ activeColor: UTIL_COLOR.RED_600 }}
            />
          </div>
        </div>
      }
    />
  );
}

export default DeleteConfirmModal;
