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
import PropTypes from 'prop-types';
import cx from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CloseIconNew from '../../../assets/icons/CloseIconNew';
import AlertCircle from '../../../assets/icons/application/AlertCircle';
import gClasses from '../../../scss/Typography.module.scss';
import { FORM_POPOVER_STATUS, ROUTE_METHOD, UTIL_COLOR } from '../../../utils/Constants';
import { BS } from '../../../utils/UIConstants';
import { REPORT_STRINGS } from '../Report.strings';
import styles from './DeleteReportModal.module.scss';
import { deleteReportByIdThunk } from '../../../redux/actions/Report.Action';
import {
  PUBLISHED_REPORT_LIST,
  REPORT_LIST,
} from '../../../urls/RouteConstants';
import { routeNavigate, showToastPopover } from '../../../utils/UtilityFunctions';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function DeleteReportModal(props) {
  const { reportId, closeFn, deleteReportCallBack } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { DELETE_REPORT } = REPORT_STRINGS(t);

  const onDeleteClick = () => {
    const callback = () => {
      showToastPopover(
        'Report Deleted Successfully',
        EMPTY_STRING,
        FORM_POPOVER_STATUS.DELETE,
        true,
      );
      deleteReportCallBack?.();
      closeFn?.();
      const reportPublisedPathName = `/${REPORT_LIST}/${PUBLISHED_REPORT_LIST}`;
      routeNavigate(history, ROUTE_METHOD.PUSH, reportPublisedPathName);
    };
    dispatch(deleteReportByIdThunk(reportId, callback));
  };

  return (
    <Modal
      id={DELETE_REPORT.ID}
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
            <button onClick={closeFn}>
              <CloseIconNew />
            </button>
          </div>

          <div className={styles.AlertCircle}>
            <AlertCircle />
          </div>
          <Title
            content={DELETE_REPORT.DELETE_MODAL_TITLE}
            alignment={ETitleAlign.middle}
            headingLevel={ETitleHeadingLevel.h5}
            size={ETitleSize.xs}
            className={gClasses.MB16}
          />
          <Text
            content={DELETE_REPORT.DELETE_MODAL_SUB_TITLE_FIRST}
            size={ETextSize.SM}
            className={gClasses.MB8}
          />
          <Text
            content={DELETE_REPORT.DELETE_MODAL_SUB_TITLE_SECOND}
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
              buttonText={DELETE_REPORT.DELETE_MODAL_NO_ACTION}
              onClickHandler={closeFn}
              type={EButtonType.OUTLINE_SECONDARY}
              className={cx(gClasses.MR16)}
            />
            <Button
              buttonText={DELETE_REPORT.DELETE_MODAL_YES_ACTION}
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

DeleteReportModal.propTypes = {
  reportId: PropTypes.string,
  closeFn: PropTypes.func,
  deleteReportCallBack: PropTypes.func,
};

export default DeleteReportModal;
