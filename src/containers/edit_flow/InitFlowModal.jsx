import React, { useEffect } from 'react';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import { editFlowExit } from 'utils/UtilityFunctions';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { saveFlowThunk } from 'redux/actions/EditFlow.Action';
import {
  clearEditFlowData,
  updateFlowDataChange,
} from 'redux/reducer/EditFlowReducer';
import { get, cloneDeep, isEmpty } from 'utils/jsUtility';
import {
  Modal,
  ModalSize,
  ModalStyleType,
} from '@workhall-pvt-lmt/wh-ui-library';
import BasicDetails from './flow_configuration/basic_details/BasicDetails';
import { routeNavigate, validate } from '../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../utils/Constants';
import { getCreateFlowValidateData } from './EditFlow.utils';
import { constructJoiObject } from '../../utils/ValidationConstants';
import { getCreateFlowSchema } from './EditFlow.validation.schema';
import jsUtility from '../../utils/jsUtility';

function InitFlowModal(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const { isFromPromptCreation } = props;
  const URLParams = new URLSearchParams(
    jsUtility.get(history, ['location', 'search'], ''),
  );
  const onCancelButtonClick = () => {
    const { isEditFlowView, flowClearData } = props;
    if (isEditFlowView) {
      editFlowExit(t, history);
      return;
    }
    flowClearData();
    const currentParams = queryString.parseUrl(history.location.pathname);
    const currentParamsObj = get(currentParams, ['query'], {});
    delete currentParamsObj.create;
    const initFlowModalSearchParams = new URLSearchParams(
      currentParamsObj,
    ).toString();
    routeNavigate(
      history,
      ROUTE_METHOD.REPLACE,
      null,
      initFlowModalSearchParams,
      null,
    );
  };

  const createFlowClicked = () => {
    const { flowData, saveFlowAPI, updateFlowDataChange } = props;
    const clonedFlowData = cloneDeep(flowData);
    const createFlowPostData = getCreateFlowValidateData(flowData);
    clonedFlowData.error_list = validate(
      createFlowPostData,
      constructJoiObject(getCreateFlowSchema(t)),
      t,
    );
    if (isEmpty(clonedFlowData.error_list)) {
      saveFlowAPI({
        data: createFlowPostData,
        isNewFlow: true,
        history,
      });
    }
    updateFlowDataChange({ error_list: clonedFlowData.error_list });
  };

  useEffect(() => {
    if (isFromPromptCreation) {
      createFlowClicked();
    }
  }, [isFromPromptCreation]);

  return (
    <Modal
      modalStyle={ModalStyleType.modal}
      modalSize={ModalSize.full}
      mainContent={
        <BasicDetails
          continueClickHandler={createFlowClicked}
          isCreateFlowModal
          onCloseClickHandler={onCancelButtonClick}
        />
      }
      isModalOpen={URLParams.get('create') === 'flow'}
      enableEscClickClose
      onCloseClick={onCancelButtonClick}
    />
  );
}
const mapStateToProps = ({ EditFlowReducer }) => {
  return {
    flowData: EditFlowReducer.flowData,
    isEditFlowView: EditFlowReducer.isEditFlowView,
    serverFlowData: EditFlowReducer.serverFlowData,
    isFromPromptCreation: EditFlowReducer.isFromPromptCreation,
  };
};

const mapDispatchToProps = {
  updateFlowDataChange,
  saveFlowAPI: saveFlowThunk,
  flowClearData: clearEditFlowData,
};

export default connect(mapStateToProps, mapDispatchToProps)(InitFlowModal);
