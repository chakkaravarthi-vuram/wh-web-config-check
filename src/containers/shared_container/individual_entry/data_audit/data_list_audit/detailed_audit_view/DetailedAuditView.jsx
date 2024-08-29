import React, { useEffect, useState, useContext } from 'react';
import cx from 'classnames/bind';
import { BS } from 'utils/UIConstants';
import BackIcon from 'assets/icons/BackIcon';
import { connect, useSelector } from 'react-redux';
import AddDataList from 'containers/data_list/data_list_dashboard/add_data_list/AddDataList';
import { TOOL_TIP_TYPE } from 'utils/Constants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import { EPopperPlacements, UserOrTeamToolTip } from '@workhall-pvt-lmt/wh-ui-library';
import { useHistory } from 'react-router-dom';
import gClasses from '../../../../../../scss/Typography.module.scss';
import styles from './DetailedAuditView.module.scss';
import { DETAILED_AUDIT_VIEW_STRINGS, constructAuditfields, constructTabelFieldEditedList } from './DetailedAuditView.utils';
import { getPopperContent } from '../../../../../../utils/UtilityFunctions';
import { dataAuditActionChanges } from '../../../../../../redux/reducer/IndividualEntryReducer';
import ThemeContext from '../../../../../../hoc/ThemeContext';

function DetailedAuditView(props) {
  const {
    id,
    editorName,
    editedTime,
    dataListEntryId,
    fieldsCount,
    dataListUuid,
    auditedTabelRows,
    dataListAuditfields,
    isAuditDetailsLoading,
    onDataListDataChange,
    toogleDetailedView,
    onDataListChage,
    userId,
    tabelfieldEditedLists,
    flowId,
    instanceId,
  } = props;
  const { t } = useTranslation();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [flowName, setFlowName] = useState('');
  const { colorScheme, colorSchemaDefaultValue } = useContext(ThemeContext);
  const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);
  const history = useHistory();

  const auditCallBackFunction = (data) => {
    setIsDataLoading(false);
    onDataListDataChange({ dataListAuditfields: data.audit_data }); // for non tabel fields
    onDataListDataChange({ auditedTabelRows: constructAuditfields(data) }); // for entire row
    onDataListDataChange({ tabelfieldEditedLists: constructTabelFieldEditedList(data) }); // for row fields
    if (data.source_details && data.source_details.flow_name) {
      setFlowName(data.source_details.flow_name);
    }
  };
  const params = {
    action_history_id: id,
    data_list_uuid: dataListUuid,
    data_list_entry_id: dataListEntryId,
  };
  useEffect(
    () => () => {
      onDataListChage({
        dataListAuditfields: [],
        auditedTabelRows: [],
        tabelFieldEditedLists: [],
      });
    },
    [],
  );
  return (
    <div>
      {!isDataLoading && (
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
          <div
            className={cx(BS.D_FLEX, gClasses.CenterV, gClasses.CursorPointer)}
            onClick={toogleDetailedView}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && toogleDetailedView()}
            role="button"
            tabIndex={0}
          >
            <BackIcon />
            <div className={cx(gClasses.FTwo13BlueV39, gClasses.ML7, gClasses.FontWeight500)}>
              {DETAILED_AUDIT_VIEW_STRINGS(t).BACK_TO_DATA_AUDIT}
            </div>
          </div>
          <div className={cx(BS.D_FLEX, styles.IndicatorContainer)}>
            <div className={cx(BS.D_FLEX, gClasses.CenterV)}>
              <div className={cx(styles.Indicator, styles.AddedBackgroung)} />
              <div
                className={cx(
                  gClasses.FTwo13GrayV3,
                  gClasses.ML5,
                )}
              >
                {DETAILED_AUDIT_VIEW_STRINGS(t).ADDED}
              </div>
            </div>
            <div className={cx(BS.D_FLEX, gClasses.CenterV)}>
              <div className={cx(styles.Indicator, styles.EditedBackground)} />
              <div
                className={cx(
                  gClasses.FTwo13GrayV3,
                  gClasses.ML5,
                )}
              >
                {DETAILED_AUDIT_VIEW_STRINGS(t).EDITED}
              </div>
            </div>
            <div className={cx(BS.D_FLEX, gClasses.CenterV)}>
              <div className={cx(styles.Indicator, styles.DeletedBackground)} />
              <div
                className={cx(
                  gClasses.FTwo13GrayV3,
                  gClasses.ML5,
                )}
              >
                {DETAILED_AUDIT_VIEW_STRINGS(t).DELETED}
              </div>
            </div>
          </div>
        </div>
      )}

      {!isDataLoading && (
        <div
          className={cx(
            BS.D_FLEX,
            gClasses.MT15,
            gClasses.MB10,
            gClasses.CursorPointer,
          )}
        >
          {editorName !== 'System' ? (
            <UserOrTeamToolTip
              id={String(userId)}
              type={TOOL_TIP_TYPE.user}
              popperContent={(_id, _type, showPopper, hidePopper) =>
                getPopperContent(_id, _type, showPopper, hidePopper, history, showCreateTask)
              }
              popperPlacement={EPopperPlacements.BOTTOM_START}
              popperClassName={gClasses.ZIndex13}
              style={{ color: colorScheme?.activeColor ?? colorSchemaDefaultValue.activeColor }}
            >
              <div className={cx(gClasses.FTwo13BlueV39)}>{editorName}</div>
            </UserOrTeamToolTip>
          ) : (
            <a
              href={`/flow_details/${flowId}/allRequests/${instanceId}`}
              className={cx(gClasses.FTwo12BlueV21)}
              target="_blank"
              rel="noreferrer"
            >
              {flowName}
            </a>
          )}
          <div className={cx(gClasses.FTwo13GrayV3, gClasses.ML2)}>
            {`- ${DETAILED_AUDIT_VIEW_STRINGS(t).EDITED} ${fieldsCount} ${DETAILED_AUDIT_VIEW_STRINGS(t).FIELDS_ON} ${editedTime}`}
          </div>
        </div>
      )}

      {/* <DetailedAuditList /> */}

      <AddDataList
        dataListEntryId={dataListEntryId}
        formViewOnly
        isDataLoading={isAuditDetailsLoading}
        dataListAuditfields={dataListAuditfields}
        auditedTabelRows={auditedTabelRows}
        isAuditView
        auditParams={params}
        auditCallBackFunction={auditCallBackFunction}
        tabelfieldEditedList={tabelfieldEditedLists}
      />
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    listLoading: state.IndividualEntryReducer.dataAudit.listLoading,
    auditedTabelRows: state.IndividualEntryReducer.dataAudit.auditedTabelRows,
    dataListAuditfields: state.IndividualEntryReducer.dataAudit.dataListAuditfields,
    isAuditDetailsLoading: state.IndividualEntryReducer.dataAudit.isAuditDetailsLoading,
    tabelfieldEditedLists: state.IndividualEntryReducer.dataAudit.tabelfieldEditedLists,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onDataListDataChange: (data) => {
      dispatch(dataAuditActionChanges(data));
    },
    onDataListChage: (data) => {
      dispatch(dataAuditActionChanges(data));
    },
    dispatch,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DetailedAuditView);
