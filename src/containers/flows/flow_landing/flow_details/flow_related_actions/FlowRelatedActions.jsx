import { ETitleSize, ETooltipType, Table, Text, Title, Tooltip } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { DATALIST_LANDING_STRINGS } from '../../../../data_lists/data_list_landing/DatalistLanding.strings';
import { FLOW_RELATED_ACTIONS } from '../../../flow_create_or_edit/FlowCreateOrEdit.constant';
import { getSubFlowTableData } from '../../../flow_create_or_edit/flow_create_edit_details/related_actions/FlowCreateEditRelationActions.utils';
import { isEmpty } from '../../../../../utils/jsUtility';
import { getTriggerDetails } from '../../../../../axios/apiService/flow.apiService';
import HelpIconV2 from '../../../../../assets/icons/HelpIconV2';

function FlowRelatedActions(props) {
    const { metaData } = props;
    const { t } = useTranslation();
    const [subFlowData, setSubFlowData] = useState({ isLoading: false, data: [] });
    const { data: subFlows, isLoading } = subFlowData;
    const { DATALIST_USER_SYSTEMS } = DATALIST_LANDING_STRINGS(t);
    const { SUB_FLOW_TABLE_HEADER, SUB_FLOWS_TITLE } = FLOW_RELATED_ACTIONS(t);

    useEffect(() => {
      if (!metaData.flowId) return;
      const params = { flow_id: metaData.flowId };
      setSubFlowData({ isLoading: true, data: [] });
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
    }, [metaData.flowId]);

    return (
      <div>
        <div className={cx(gClasses.CenterV, gClasses.MB16)}>
          <Title
            size={ETitleSize.xs}
            content={SUB_FLOWS_TITLE}
            className={cx(gClasses.GrayV3)}
          />
          <Tooltip
            text={SUB_FLOWS_TITLE}
            tooltipType={ETooltipType.INFO}
            icon={<HelpIconV2 />}
            className={cx(gClasses.ML10)}
          />
        </div>
        {(isLoading || !isEmpty(subFlows)) &&
        <div className={cx(gClasses.OverflowXAuto, gClasses.MB16)}>
          <Table
            header={SUB_FLOW_TABLE_HEADER}
            headerClass={gClasses.FTwo12}
            isLoading={isLoading}
            data={getSubFlowTableData(subFlows, true)}
            tableVariant="normal"
          />
        </div>
        }

        {!isLoading && isEmpty(subFlows) && (
          <Text
            content={DATALIST_USER_SYSTEMS.NO_SUB_FLOWS_FOUND}
            className={cx(gClasses.FTwo12GrayV101, gClasses.MT8)}
          />
        )}
      </div>
    );
}

export default FlowRelatedActions;
