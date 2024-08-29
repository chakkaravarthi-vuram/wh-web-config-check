import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ETitleSize, ETooltipType, Table, Text, Title, Tooltip } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import DatalistShortcuts from './datalist_shortcuts/DatalistShortcuts';
import EditDatalistShortcut from './datalist_shortcuts/EditDatalistShortcut';
import { getAutomatedSystemBodyData } from '../../../../../components/automated_systems/AutomatedSystems.utils';
import ConfigureAutomatedSystem from '../../../../../components/automated_systems/configure_automated_system/ConfigureAutomatedSystem';
import { getAllSystemEventApi } from '../../../../../axios/apiService/automatedSystems.apiService';
import { AUTOMATED_TABLE_HEADER } from '../../DatalistsLanding.constant';
import { somethingWentWrongErrorToast } from '../../../../../utils/UtilityFunctions';
import { createDataListSetState } from '../../../../../redux/reducer/CreateDataListReducer';
import { DATALIST_LANDING_STRINGS } from '../../DatalistLanding.strings';
import { MODULE_TYPES } from '../../../../../utils/Constants';
import { DL_ACTIONS } from '../../../data_lists_create_or_edit/useDatalistReducer';
import { cloneDeep } from '../../../../../utils/jsUtility';
import { constructGetDataForDataList } from '../../../data_lists_create_or_edit/DatalistsCreateEdit.utils';
import { formatParentTrigger } from '../../../../flows/flow_create_or_edit/FlowCreateEdit.utils';
import PlusIconBlueNew from '../../../../../assets/icons/PlusIconBlueNew';
import { apiGetAllSystemFieldsList, getTriggerDetails } from '../../../../../axios/apiService/flow.apiService';
import HelpIconV2 from '../../../../../assets/icons/HelpIconV2';
import { AUTOMATED_SYSTEM_CONSTANTS } from '../../../../../components/automated_systems/AutomatedSystems.strings';

//  Add strings to string file. Handle it with i18n
const MAX_SYSTEM_EVENTS = 3;

function DatalistUserSystem(props) {
    const { metaData, isReadonly = false, className, dispatch, triggerDetails } = props;
    const { t } = useTranslation();
    const [showEdit, setShowEdit] = useState(false);
    const [showAutomated, setShowAutomated] = useState(false);
    const [systemActions, setSystemActions] = useState({ data: [], loading: true });
    const [editSystemAction, setEditSystemAction] = useState(null);
    const { DATALIST_USER_SYSTEMS } = DATALIST_LANDING_STRINGS(t);
    const [parentData, setParentData] = useState(() => {
      return {
        data_list_name: metaData?.dataListName,
        data_list_uuid: metaData?.dataListUUID,
        trigger_details: formatParentTrigger(triggerDetails || []),
        has_related_flows: metaData?.hasRelatedFlows,
      };
    });
    const [triggerUUID, setTriggerUUID] = useState('');
    const [readOnlyTriggerDetails, setReadOnlyTriggerDetails] = useState([]);
    const [systemFields, setSystemFields] = useState([]);

    const reduxDispatch = useDispatch();

    /**
     * Fetches the system actions related to the datalist.
     */
    const loadSystemActions = () => {
        if (!metaData?.dataListId) return;
        const params = { data_list_id: metaData.dataListId };
        getAllSystemEventApi(params)
            .then((res) => {
                const { paginationDetails = {}, paginationData = [] } = res;
                setSystemActions((prevState) => {
                    return {
                        ...prevState,
                        data: paginationData,
                        loading: false,
                        paginationDetails,
                    };
                });
                // setting has_system_events to datalist reducer
                const hasSystemEvents = paginationData?.length > 0;
                reduxDispatch(createDataListSetState({ has_system_events: hasSystemEvents }));
                dispatch(DL_ACTIONS.DATA_CHANGE, { hasSystemEvents: hasSystemEvents });
            })
            .catch((err) => {
                console.error('xyz error', err);
                somethingWentWrongErrorToast();
            });
    };

    const loadTriggerDetails = () => {
        if (!metaData?.dataListId || !isReadonly) return;
        const params = { data_list_id: metaData.dataListId };
        getTriggerDetails(params)
            .then((res) => {
              const constructedData = res?.trigger_metadata?.filter((trigger) => trigger.trigger_type === 'related_actions').map((trigger) => {
                return {
                  triggerUUID: trigger?.trigger_uuid,
                  triggerName: trigger?.trigger_name || '',
                  childFlowName: trigger?.child_flow_name,
                };
              });
              setReadOnlyTriggerDetails(constructedData);
            })
            .catch((err) => {
                console.error('xyz error', err);
                somethingWentWrongErrorToast();
            });
    };

    const getSystemFields = async () => {
      try {
          const res = await apiGetAllSystemFieldsList();
          setSystemFields(res);
      } catch (e) {
          setSystemFields({});
      }
    };

    useEffect(() => {
        loadSystemActions();
        loadTriggerDetails();
        getSystemFields();
    }, [metaData?.dataListId]);

    const renderNoDataFound = (text) => (
        <Text content={text} className={cx(gClasses.FTwo12GrayV101, gClasses.MT8)} />
    );

    /**
     * Handles the click event for editing or adding shortcuts.
     */
    const handleEditOrAddShortcut = () => {
        setShowEdit(true);
    };

    /**
     * Handles the close event for the EditDatalistShortcut modal.
     */
    const handleCloseShortcut = () => {
        setShowEdit(false);
        setTriggerUUID(null);
    };

    /**
     * Handles the edit event for automated system actions.
     */
    const handleSystemActionEdit = (action) => {
        setEditSystemAction(action);
        setShowAutomated(true);
    };

    /**
     * Handles the close event for the ConfigureAutomatedSystem modal.
     */
    const handleSystemActionClose = (reFetchList = false) => {
        setEditSystemAction(null);
        setShowAutomated(false);
        if (reFetchList) {
            loadSystemActions();
        }
    };

    const onTriggerSave = (dataListData) => {
      const constructedData = constructGetDataForDataList(dataListData);
      dispatch(DL_ACTIONS.DATA_CHANGE, constructedData);
      setParentData({
          ...parentData,
          trigger_details: cloneDeep(formatParentTrigger(constructedData.trigger_details)),
          has_related_flows: dataListData.hasRelatedFlows,
      });
      handleCloseShortcut();
      loadSystemActions();
    };

    return (
      <div className={cx(className)}>
        <div>
          <DatalistShortcuts
            metaData={metaData}
            triggerDetails={triggerDetails || readOnlyTriggerDetails}
            openTriggerModal={() => setShowEdit(true)}
            isReadonly={isReadonly}
            noDataFoundComponent={() => renderNoDataFound(DATALIST_USER_SYSTEMS.NO_SUB_FLOWS_FOUND)}
            setShowEditModal={setShowEdit}
            setTriggerUUID={setTriggerUUID}
            parentData={parentData}
            onTriggerSave={onTriggerSave}
          />

          {/* edit modal */}
          {showEdit && (
            <EditDatalistShortcut
              triggerUUID={triggerUUID}
              metaData={metaData}
              isModalOpen={showEdit}
              onEditOrAddShortcut={handleEditOrAddShortcut}
              onCloseShortcut={handleCloseShortcut}
              moduleType={MODULE_TYPES.DATA_LIST}
              onSave={onTriggerSave}
              parentData={parentData}
              isParentDatalist
              systemFields={systemFields}
            />
          )}
        </div>

        <div>
          <div className={cx(gClasses.MT24, gClasses.CenterV)}>
            <Title
              size={ETitleSize.xs}
              content={DATALIST_USER_SYSTEMS.AUTOMATED_SYSTEM_ACTIONS}
              className={cx(gClasses.GrayV3)}
            />
            <Tooltip
                text={AUTOMATED_SYSTEM_CONSTANTS(t).COMMON_AUTOMATED_STRINGS.DESCRIPTION}
                tooltipType={ETooltipType.INFO}
                icon={<HelpIconV2 />}
                className={cx(gClasses.ML10)}
            />
          </div>
          {(systemActions.data.length !== 0 || systemActions.loading) && (
            <div className={cx(gClasses.OverflowXAuto, gClasses.MT16)}>
              <Table
                header={AUTOMATED_TABLE_HEADER(t)}
                headerClass={cx(gClasses.FTwo12BlackV21, gClasses.FontWeight500)}
                isLoading={systemActions.loading}
                data={getAutomatedSystemBodyData(
                  systemActions.data,
                  handleSystemActionEdit,
                  isReadonly,
                  t,
                )}
                tableVariant="normal"
              />
            </div>
          )}
          {!systemActions.loading &&
            systemActions.data.length === 0 &&
            isReadonly &&
            renderNoDataFound(DATALIST_USER_SYSTEMS.NO_ACTIONS_FOUND)}

          {!isReadonly &&
            systemActions.data.length < MAX_SYSTEM_EVENTS &&
            <button className={cx(gClasses.BlueIconBtn, gClasses.MT8)} onClick={() => setShowAutomated(true)}>
              <PlusIconBlueNew />
              {DATALIST_USER_SYSTEMS.ADD_ACTION}
            </button>}
          {showAutomated && (
            <ConfigureAutomatedSystem
              metaData={metaData}
              systemAction={editSystemAction}
              automateOpenStatus={showAutomated}
              onCloseClick={handleSystemActionClose}
              systemFields={systemFields}
            />
          )}
        </div>
      </div>
    );
}

DatalistUserSystem.propTypes = {
    metaData: PropTypes.object,
};

DatalistUserSystem.defaultProps = {
    metaData: {},
};

export default DatalistUserSystem;
