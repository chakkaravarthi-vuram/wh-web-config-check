import { ETitleSize, ETooltipType, Table, Title, Tooltip } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import PlusIconBlueNew from '../../../../../assets/icons/PlusIconBlueNew';
import EditDatalistShortcut from '../../../../data_lists/data_list_landing/datalist_details/datalist_user_system_action/datalist_shortcuts/EditDatalistShortcut';
import { FLOW_ACTIONS } from '../../../useFlow';
import { FLOW_RELATED_ACTIONS } from '../../FlowCreateOrEdit.constant';
import { getSubFlowTableData } from './FlowCreateEditRelationActions.utils';
import { cloneDeep, isEmpty } from '../../../../../utils/jsUtility';
import { MODULE_TYPES } from '../../../../../utils/Constants';
import { getTriggerDetails } from '../../../../../axios/apiService/flow.apiService';
import HelpIconV2 from '../../../../../assets/icons/HelpIconV2';
import { formatParentTrigger } from '../../FlowCreateEdit.utils';
import { getResponseTriggerDetails } from '../../../../data_lists/data_lists_create_or_edit/DatalistsCreateEdit.utils';

function FlowCreateEditRelatedActions(props) {
  const { metaData, dispatch, state, systemFields } = props;
  const { t } = useTranslation();
  const [showEditModal, setShowEditModal] = useState(false);
  const [triggerUUID, setTriggerUUID] = useState(null);
  const { SUB_FLOW_TABLE_HEADER, SUB_FLOWS_TITLE, ADD_SUB_FLOW } = FLOW_RELATED_ACTIONS(t);
  const [parentData, setParentData] = useState({});
  const [subFlowData, setSubFlowData] = useState({ isLoading: false, data: [] });
  const { data: subFlows, isLoading } = subFlowData;

  const getTriggerApiData = () => {
    const params = { flow_id: metaData.flowId };
    getTriggerDetails(params)
      .then((res) => {
        const constructedData = res?.trigger_metadata?.filter((trigger) => trigger.trigger_type === 'related_actions').map((trigger) => {
          return {
            triggerUUID: trigger?.trigger_uuid,
            triggerName: trigger?.trigger_name || '',
            childFlowName: trigger?.child_flow_name,
          };
        });
        setSubFlowData({ isLoading: false, data: constructedData });
        console.log('xyz data', subFlows);
      })
      .catch((err) => {
        setSubFlowData({ isLoading: false, data: [] });
        console.error('xyz error', err);
      });
  };

  useEffect(() => {
    getTriggerApiData();
    setParentData({
      trigger_details: cloneDeep(formatParentTrigger(state.relatedActions?.triggers || [])),
      flow_uuid: state.uuid,
      flow_name: state.name,
      ...(state.description ? { flow_description: state.description } : {}),
      has_related_flows: state.hasRelatedFlows,
    });
  }, []);

  const openTriggerModal = () => setShowEditModal(true);
  const closeTriggerModal = () => {
    setShowEditModal(false);
    setTriggerUUID(null);
  };

  const onEditTrigger = (trigger) => {
    setTriggerUUID(trigger?.trigger_uuid || trigger?.triggerUUID);
    setShowEditModal(true);
  };

  const onTriggerSave = (flowData) => {
    dispatch(FLOW_ACTIONS.UPDATE_RELATED_ACTIONS, { triggers: getResponseTriggerDetails(flowData.trigger_details) });
    dispatch(FLOW_ACTIONS.DATA_CHANGE, {
      hasRelatedFlows: flowData.trigger_details?.length > 0 || false,
    });
    getTriggerApiData();
    setParentData((p) => {
      return {
        ...p,
        trigger_details: cloneDeep(formatParentTrigger(getResponseTriggerDetails(flowData.trigger_details))),
        has_related_flows: flowData.has_related_flows,
      };
    });
    closeTriggerModal();
  };

  return (
    <div className={cx(gClasses.P24, gClasses.H100)}>
      <div className={cx(gClasses.MB16, gClasses.CenterV)}>
        <Title
          content={SUB_FLOWS_TITLE}
          size={ETitleSize.xs}
        />
        <Tooltip
          text={SUB_FLOWS_TITLE}
          tooltipType={ETooltipType.INFO}
          icon={<HelpIconV2 />}
          className={cx(gClasses.ML10)}
        />
      </div>
      {!isEmpty(subFlows) && (
        <div className={cx(gClasses.OverflowXAuto, gClasses.MB16)}>
          <Table
            header={SUB_FLOW_TABLE_HEADER}
            headerClass={cx(gClasses.FTwo12BlackV21, gClasses.FontWeight500)}
            data={getSubFlowTableData(subFlows, false, onEditTrigger)}
            tableVariant="normal"
            isLoading={isLoading}
          />
        </div>
      )}
      <button className={cx(gClasses.BlueIconBtn)} onClick={openTriggerModal}>
        <PlusIconBlueNew />
        {ADD_SUB_FLOW}
      </button>

      {showEditModal && (
        <EditDatalistShortcut
          triggerUUID={triggerUUID}
          metaData={metaData}
          moduleType={MODULE_TYPES.FLOW}
          isModalOpen
          onCloseShortcut={closeTriggerModal}
          parentData={parentData}
          onSave={onTriggerSave}
          systemFields={systemFields}
        />
      )}
    </div>
  );
}

export default FlowCreateEditRelatedActions;
