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
import { useTranslation } from 'react-i18next';
import CloseIconNew from '../../../assets/icons/CloseIconNew';
import AlertCircle from '../../../assets/icons/application/AlertCircle';
import gClasses from '../../../scss/Typography.module.scss';
import { UTIL_COLOR } from '../../../utils/Constants';
import { BS } from '../../../utils/UIConstants';
import styles from './DeleteRuleModal.module.scss';
import { FIELD_VISIBILITY_STRINGS } from '../field_visibility/FieldVisibilityRule.strings';
import { deleteRule } from '../../../redux/actions/Visibility.Action';

function DeleteRuleModal(props) {
  const { cancelFn, successFn, errorFn, metaData } = props;
  const { t } = useTranslation();
  const { DELETE } = FIELD_VISIBILITY_STRINGS(t);

  const onDeleteClick = () => {
    deleteRule(metaData, successFn, errorFn);
  };

  const onCancelClick = () => {
    cancelFn?.();
  };

  return (
    <Modal
      id={DELETE.ID}
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
            <button onClick={onCancelClick}>
              <CloseIconNew />
            </button>
          </div>

          <div className={styles.AlertCircle}>
            <AlertCircle />
          </div>
          <Title
            content={DELETE.DELETE_MODAL_TITLE}
            alignment={ETitleAlign.middle}
            headingLevel={ETitleHeadingLevel.h5}
            size={ETitleSize.xs}
            className={gClasses.MB16}
          />
          <Text
            content={DELETE.DELETE_MODAL_SUB_TITLE_FIRST}
            size={ETextSize.SM}
            className={gClasses.MB8}
          />
          <Text
            content={DELETE.DELETE_MODAL_SUB_TITLE_SECOND}
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
              buttonText={DELETE.DELETE_MODAL_NO_ACTION}
              onClickHandler={onCancelClick}
              type={EButtonType.OUTLINE_SECONDARY}
              className={cx(gClasses.MR16)}
            />
            <Button
              buttonText={DELETE.DELETE_MODAL_YES_ACTION}
              onClickHandler={onDeleteClick}
              colorSchema={{ activeColor: UTIL_COLOR.RED_600 }}
              type={EButtonType.PRIMARY}
            />
          </div>
        </div>
      }
      isModalOpen
    />
  );
}

export default DeleteRuleModal;
