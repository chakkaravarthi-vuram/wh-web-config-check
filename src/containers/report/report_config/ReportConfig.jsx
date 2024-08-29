import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Modal,
  ModalSize,
  ModalStyleType,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { useDispatch } from 'react-redux';
import styles from './ReportConfig.module.scss';
import { REPORT_STRINGS } from '../Report.strings';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import gClasses from '../../../scss/Typography.module.scss';
import CloseIcon from '../../../assets/icons/CloseIcon';
import {
  keydownOrKeypessEnterHandle,
  routeNavigate,
} from '../../../utils/UtilityFunctions';
import { clearCreateReportData } from '../../../redux/reducer/ReportReducer';
import {
  PUBLISHED_REPORT_LIST,
  REPORT_LIST,
} from '../../../urls/RouteConstants';
import BasicDetails from './basic_details/BasicDetails';
import { ROUTE_METHOD } from '../../../utils/Constants';

function ReportConfig() {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    REPORT_CONFIG: { ID, HEADER_CONTENT },
  } = REPORT_STRINGS();

  /** This function construct header content for report basic details modal  */
  const onClickCloseReportConfigModal = () => {
    dispatch(clearCreateReportData());
    const reportPublishedPathName = `/${REPORT_LIST}/${PUBLISHED_REPORT_LIST}`;
    routeNavigate(history, ROUTE_METHOD.PUSH, reportPublishedPathName);
  };

  const elementHeaderContent = () => (
      <div>
        <CloseIcon
          className={cx(styles.CloseIcon, BS.JC_END, gClasses.CursorPointer)}
          onClick={() => onClickCloseReportConfigModal()}
          role={ARIA_ROLES.BUTTON}
          tabIndex={0}
          ariaLabel={HEADER_CONTENT.CLOSE_ARIA_LABEL}
          onKeyDown={(e) =>
            keydownOrKeypessEnterHandle(e) && onClickCloseReportConfigModal()
          }
        />
      </div>
    );

  return (
    <Modal
      id={ID}
      isModalOpen
      headerContent={elementHeaderContent()}
      headerContentClassName={cx(BS.D_FLEX, BS.JC_END, gClasses.M15)}
      mainContent={<BasicDetails onCloseClick={onClickCloseReportConfigModal} />}
      modalStyle={ModalStyleType.modal}
      className={styles.ReportConfigModal}
      mainContentClassName={cx(styles.Content, BS.D_FLEX, BS.JC_CENTER)}
      modalSize={ModalSize.full}
      enableEscClickClose
      onCloseClick={onClickCloseReportConfigModal}
    />
  );
}

export default ReportConfig;
