import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import cx from 'classnames/bind';
import { connect } from 'react-redux';

import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import modalStyles from 'components/form_components/modal_layout/CustomClasses.module.scss';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import Label from '../../../components/form_components/label/Label';
import gClasses from '../../../scss/Typography.module.scss';
import { FLOW_STRINGS } from '../Flow.strings';
import Button, { BUTTON_TYPE } from '../../../components/form_components/button/Button';
import { BS } from '../../../utils/UIConstants';
import ErrorDataIcon from '../../../assets/icons/response_status_handler/ErrorDataIcon';
import { deleteDataListApiThunk } from '../../../redux/actions/CreateDataList.action';

function DeleteDataList(props) {
  const { t } = useTranslation();
  const { onCancelDeleteDataListClickHandler, isDraft, id, isModalOpen, onCloseClick } = props;
  const onDeleteDataListClickHandler = () => {
    const { deleteDataListApiAction, data_list_uuid, history } = props;
    const apiParams = {
      data_list_uuid: data_list_uuid,
    };
    deleteDataListApiAction(apiParams, onCancelDeleteDataListClickHandler, history);
  };
  return (
    <ModalLayout
      id={id}
      isModalOpen={isModalOpen}
      onCloseClick={onCloseClick}
      headerContent={(
        <h2 className={cx(modalStyles.PageTitle)}>{FLOW_STRINGS(t).DELETE_DATALIST.TITLE}</h2>
      )}
      mainContent={(
        <>
          <div className={cx(gClasses.CenterH, gClasses.MT50)}>
            <ErrorDataIcon />
          </div>
          {isDraft ? <Label className={cx(gClasses.MT35, gClasses.CenterH)} content={FLOW_STRINGS(t).DELETE_DATALIST.DEL_DRAFT_DATALIST} /> : (
            <Label innerClassName={gClasses.FTwo13BlackV6} className={cx(gClasses.MT35, gClasses.CenterH)} content={FLOW_STRINGS(t).DELETE_DATALIST.DEL_DATALIST} />
          )}
        </>
      )}
      footerContent={(
        <div className={cx(BS.W100, BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
          <Button
            id="delete_datalist_cancel"
            buttonType={BUTTON_TYPE.SECONDARY}
            onClick={onCancelDeleteDataListClickHandler}
          >
            {FLOW_STRINGS(t).DELETE_DATALIST.CANCEL}
          </Button>
          <Button
            id="delete_datalist_save"
            buttonType={BUTTON_TYPE.PRIMARY}
            onClick={onDeleteDataListClickHandler}
            className={gClasses.ML30}
          >
            {FLOW_STRINGS(t).DELETE_DATALIST.DELETE}
          </Button>
        </div>
      )}
    />
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteDataListApiAction: (data, closeFunction, historyObj) => {
      dispatch(deleteDataListApiThunk(data, closeFunction, historyObj, t));
    },
  };
};

export default withRouter(connect(null, mapDispatchToProps)(DeleteDataList));

DeleteDataList.propTypes = {
  deleteDataListApiAction: PropTypes.func,
  onCancelDeleteDataListClickHandler: PropTypes.func,
  data_list_uuid: PropTypes.string.isRequired,
};

DeleteDataList.defaultProps = {
  deleteDataListApiAction: null,
  onCancelDeleteDataListClickHandler: null,
};
