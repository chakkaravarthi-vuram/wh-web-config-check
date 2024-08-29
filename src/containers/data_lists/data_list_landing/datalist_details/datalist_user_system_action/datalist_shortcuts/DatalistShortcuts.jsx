import React, { useEffect, useState } from 'react';
import { Table, Title, ETitleSize, Tooltip, ETooltipType } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getSubFlowTableData } from '../../../../../flows/flow_create_or_edit/flow_create_edit_details/related_actions/FlowCreateEditRelationActions.utils';
import { convertBeToFeKeys } from '../../../../../../utils/normalizer.utils';
import { FLOW_RELATED_ACTIONS } from '../../../../../flows/flow_create_or_edit/FlowCreateOrEdit.constant';
import { isEmpty } from '../../../../../../utils/jsUtility';
import PlusIconBlueNew from '../../../../../../assets/icons/PlusIconBlueNew';
import { DATALIST_LANDING_STRINGS } from '../../../DatalistLanding.strings';
import HelpIconV2 from '../../../../../../assets/icons/HelpIconV2';

function DatalistShortcuts(props) {
    const { openTriggerModal, isReadonly, noDataFoundComponent, triggerDetails, setShowEditModal, setTriggerUUID } = props;
    const { t } = useTranslation();
    const [triggerData, setTriggerData] = useState({ data: [] });
    const { data: triggers } = triggerData;
    const { SUB_FLOW_TABLE_HEADER } = FLOW_RELATED_ACTIONS(t);
    const { DATALIST_USER_SYSTEMS } = DATALIST_LANDING_STRINGS(t);

    useEffect(() => {
        const { data } = convertBeToFeKeys({ data: triggerDetails }, {}, [], ['trigger_mapping']);
        setTriggerData({ data: data });
        console.log('dl trigger data', triggers);
    }, [triggerDetails]);

    const onEditTrigger = (trigger) => {
      setTriggerUUID(trigger?.triggerUUID);
      setShowEditModal(true);
    };

    return (
        <div className={cx(gClasses.MB8)}>
          <div className={gClasses.CenterV}>
            <Title
              content={DATALIST_USER_SYSTEMS.SUB_FLOWS_TITLE}
              size={ETitleSize.xs}
            />
            <Tooltip
              text={DATALIST_USER_SYSTEMS.SUB_FLOWS_TITLE}
              tooltipType={ETooltipType.INFO}
              icon={<HelpIconV2 />}
              className={cx(gClasses.ML10)}
            />
          </div>
            {!isEmpty(triggers) ?
            <Table
                className={gClasses.MT16}
                header={SUB_FLOW_TABLE_HEADER}
                headerClass={cx(gClasses.FTwo12BlackV21, gClasses.FontWeight500)}
                data={getSubFlowTableData(triggers || [], isReadonly, onEditTrigger)}
                tableVariant="normal"
            /> : (isReadonly ? noDataFoundComponent() : null)}
            {!isReadonly &&
            <button className={cx(gClasses.BlueIconBtn, gClasses.MT8)} onClick={openTriggerModal}>
              <PlusIconBlueNew />
              {DATALIST_USER_SYSTEMS.ADD_SUB_FLOW}
            </button>}
        </div>
    );
}

export default DatalistShortcuts;

DatalistShortcuts.propTypes = {
    onEditOrAddShortcut: PropTypes.func,
};
