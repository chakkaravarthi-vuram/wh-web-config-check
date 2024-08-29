import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getAllDataListFields } from 'axios/apiService/form.apiService';
import { store } from 'Store';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { FIELD_LIST_TYPE } from 'utils/constants/form.constant';
import ResponseHandler from 'components/response_handlers/ResponseHandler';
import { RESPONSE_TYPE } from 'utils/Constants';
import jsUtility from 'utils/jsUtility';
import { useTranslation } from 'react-i18next';
import {
  customiseAudidlist,
  constructFieldDropdownList,
  constructEditorNameDropdownList,
} from './audit_view/AuditView.utils';
import DetailedAuditView from './detailed_audit_view/DetailedAuditView';
import AuditView from './audit_view/AuditView';
import styles from './DataListAudit.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { dataListAuditDataApi, editorsListDataApi } from '../../../../../redux/actions/IndividualEntry.Action';
import { dataAuditActionChanges } from '../../../../../redux/reducer/IndividualEntryReducer';
import { INDIVIDUAL_ENTRY_MODE } from '../../IndividualEntry.strings';

function DataListAudit(props) {
  const { t } = useTranslation();
  const [detailedView, setDetailedView] = useState(true);
  const [actionHistoryId, setActionHistoryId] = useState('');
  const [editorName, setEditorName] = useState('');
  const [editedTime, setEditorTime] = useState('');
  const [editedFieldsCount, setEditedFieldsCount] = useState('');
  const [userId, setUserId] = useState('');
  const [flowId, setFlowId] = useState('');
  const [instanceId, setInstanceId] = useState('');
  const [field_Uuid, setFieldUuid] = useState('');
  const [performed_by, setPerformedBy] = useState('');
  const toogleDetailedView = (
    id = '',
    time = '',
    name = '',
    count = '',
    userId = '',
    procId = '',
    instId = '',
  ) => {
    setDetailedView(!detailedView);
    setActionHistoryId(id);
    setEditorTime(time);
    setEditorName(name);
    setEditedFieldsCount(count);
    setUserId(userId);
    setFlowId(procId);
    setInstanceId(instId);
  };
  const cancelDataListToken = {
    cancelToken: null,
  };
  const setDataListFieldsCancelToken = (c) => {
    cancelDataListToken.cancelToken = c;
  };
  const {
    dataListEntryId,
    dataListUuid,
    onDataListDataChange,
    auditList,
    currentPage,
    totalCount,
    auditEditorsFieldList,
    isIntialLoading,
    audiEditorsLists,
    onDataListChage,
    filterquerryLoading,
    dispatch,
    common_server_error,
    mode,
  } = props;
  const getAuditDataList = (
    page,
    fieldUuid,
    performedBy,
    mountCall,
    loadMoreCall,
    filterquerryCall,
  ) => {
    const params = {
      data_list_entry_id: dataListEntryId,
      data_list_uuid: dataListUuid,
      page: page || 1,
      size: 10,
    };
    if (fieldUuid == null) {
      fieldUuid = field_Uuid;
    }
    if (performedBy == null) {
      performedBy = performed_by;
    }
    if (fieldUuid !== EMPTY_STRING) {
      params.field_uuid = fieldUuid;
    }
    if (performedBy !== EMPTY_STRING) {
      params.performed_by = performedBy;
    }
    // getAuditData(params);
    if (mountCall) {
      onDataListDataChange({ isIntialLoading: true });
    }
    if (loadMoreCall) {
      onDataListDataChange({ listLoading: true });
    }
    if (filterquerryCall) {
      onDataListDataChange({ filterquerryLoading: true });
    }
    dispatch(dataListAuditDataApi(params)).then((response) => {
      const formatedList = customiseAudidlist(response, t);
      onDataListDataChange({ auditListItem: store.getState().IndividualEntryReducer.dataAudit.auditListItem.concat(formatedList) });
      onDataListDataChange({ listLoading: false });
      onDataListDataChange({ filterquerryLoading: false });
      onDataListDataChange({ totalCount: response &&
        response.pagination_details &&
        response.pagination_details &&
        response.pagination_details[0].total_count });
      if (mountCall) {
        const dataListId =
          response &&
          response.pagination_data &&
          response.pagination_data[0] &&
          response.pagination_data[0].data_list_id;
        if (dataListId) {
          const params = {
            page: 1,
            size: 500,
            data_list_id: dataListId,
            field_list_type: FIELD_LIST_TYPE.DIRECT,
          };
          getAllDataListFields(params, setDataListFieldsCancelToken).then(
            (response) => {
              const fieldsList = constructFieldDropdownList(response, t);
              onDataListDataChange({ auditEditorsFieldList: fieldsList });
              editorsListDataApi({
                data_list_entry_id: dataListEntryId,
                data_list_uuid: dataListUuid,
              }).then((res) => {
                const editorsList = constructEditorNameDropdownList(res, t);
                onDataListDataChange({ audiEditorsLists: editorsList });
                onDataListDataChange({ isIntialLoading: false });
              });
            },
          );
        } else {
          onDataListDataChange({ isIntialLoading: false });
        }
      }
    });
  };
  const onLoadMore = () => {
    const totalCardsRendered = auditList.length;
    if (totalCount > totalCardsRendered) {
      getAuditDataList(currentPage + 1, null, null, false, true, false);
      onDataListDataChange({ auditPage: currentPage + 1 });
    } else {
      onDataListDataChange({ hasMoreAuditData: false });
    }
  };
  const onDropdownChangeHandler = (querryType, data) => {
    onDataListChage({
      auditListItem: [],
      auditPage: 1,
      totalCount: 0,
      hasMoreAuditData: true,
      isIntialEntry: false,
      // selectedFieldName:null,
      // selectedEditorName:null,
    });
    if (querryType === 'filterByField') {
      getAuditDataList(1, data, null, false, false, true);
      setFieldUuid(data);
    } else {
      getAuditDataList(1, null, data, false, false, true);
      setPerformedBy(data);
    }
  };
  useEffect(() => {
    if (
      [
        INDIVIDUAL_ENTRY_MODE.INSTANCE_MODE,
        INDIVIDUAL_ENTRY_MODE.REPORT_INSTANCE_MODE,
      ].includes(mode)
    ) {
    getAuditDataList(1, null, null, true, null, true);
    }
    return () => {
      onDataListChage({
        auditListItem: [],
        auditPage: 1,
        totalCount: 0,
        hasMoreAuditData: true,
        selectedFieldName: null,
        selectedEditorName: null,
        isIntialLoading: true,
        audiEditorsLists: [],
        auditEditorsFieldList: [],
        isIntialEntry: true,
      });
    };
  }, []);
  return !jsUtility.isEmpty(common_server_error) ? (
    <ResponseHandler
      className={gClasses.MT90}
      messageObject={{
        type: RESPONSE_TYPE.SERVER_ERROR,
        title: 'Access Denied',
        subTitle: "You don't have access to this instance",
      }}
    />
  ) : (
    <div className={styles.OuterContainer}>
      {detailedView ? (
        <AuditView
          onDetailedViewClick={toogleDetailedView}
          dataListEntryId={dataListEntryId}
          dataListUuid={dataListUuid}
          flowId={flowId}
          instanceId={instanceId}
          onDataListDataChange
          auditList
          haMore
          currentPage
          totalCount
          onLoadMoreCallHandler={onLoadMore}
          initalLoading={isIntialLoading}
          editorsNameList={audiEditorsLists}
          fieldList={auditEditorsFieldList}
          dropDownChangeHandler={onDropdownChangeHandler}
          filterquerryLoading={filterquerryLoading}
        />
      ) : (
        <DetailedAuditView
          id={actionHistoryId}
          editorName={editorName}
          editedTime={editedTime}
          fieldsCount={editedFieldsCount}
          dataListEntryId={dataListEntryId}
          dataListUuid={dataListUuid}
          userId={userId}
          flowId={flowId}
          instanceId={instanceId}
          toogleDetailedView={toogleDetailedView}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    auditList: state.IndividualEntryReducer.dataAudit.auditListItem,
    isDataLoading: state.IndividualEntryReducer.dataAudit.isDataListAuditDataLoading,
    totalCount: state.IndividualEntryReducer.dataAudit.totalCount,
    currentPage: state.IndividualEntryReducer.dataAudit.auditPage,
    haMore: state.IndividualEntryReducer.dataAudit.hasMoreAuditData,
    auditEditorsFieldList: state.IndividualEntryReducer.dataAudit.auditEditorsFieldList,
    initialLoad: state.IndividualEntryReducer.dataAudit.isIntialLoading,
    audiEditorsLists: state.IndividualEntryReducer.dataAudit.audiEditorsLists,
    isIntialLoading: state.IndividualEntryReducer.dataAudit.isIntialLoading,
    filterquerryLoading: state.IndividualEntryReducer.dataAudit.isIntialLoading,
    listLoading: state.IndividualEntryReducer.dataAudit.listLoading,
    common_server_error: state.IndividualEntryReducer.dataAudit.common_server_error,
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
export default connect(mapStateToProps, mapDispatchToProps)(DataListAudit);
