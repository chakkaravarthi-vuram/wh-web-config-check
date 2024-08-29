import React from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { store } from '../../../../../../Store';
import Dropdown from '../../../../../../components/form_components/dropdown/Dropdown';
import { BS } from '../../../../../../utils/UIConstants';
import gClasses from '../../../../../../scss/Typography.module.scss';
import styles from './AuditView.module.scss';
import jsUtils from '../../../../../../utils/jsUtility';
import AuditList from './audit-list/AuditList';
import { AUDIT_VIEW_FORM } from './AuditView.utils';
import { dataAuditActionChanges } from '../../../../../../redux/reducer/IndividualEntryReducer';

function AuditView(props) {
  const {
    onDetailedViewClick,
    auditList,
    isIntialLoading,
    haMore,
    onLoadMoreCallHandler,
    editorsNameList,
    fieldList,
    dropDownChangeHandler,
    onDataListDataChange,
    filterquerryLoading,
    isIntialEntry,
  } = props;
  const { t } = useTranslation();

  return (
    <>
      <div
        className={cx(
          BS.D_FLEX,
          BS.JC_END,
          BS.FLEX_WRAP_WRAP,
          gClasses.CenterV,
        )}
      >
        <div
          className={cx(
            BS.D_FLEX,
            BS.JC_BETWEEN,
            gClasses.CenterV,
            styles.DropDownContainer,
          )}
        >
          {
            jsUtils.isEmpty(auditList) ? null : (
            <div className={cx(gClasses.FTwo13GrayV53, gClasses.FontWeight500)}>
              {AUDIT_VIEW_FORM(t).FILTER_BY}
            </div>
          )}
          {(!filterquerryLoading &&
            !isIntialLoading &&
            isIntialEntry &&
            jsUtils.isEmpty(auditList)) ? null : (
              <div
                className={cx(
                  BS.D_FLEX,
                  BS.JC_BETWEEN,
                  styles.DropDownContainer,
                )}
              >
                <div>
                  <Dropdown
                    id={AUDIT_VIEW_FORM(t).FIELD_NAME.ID}
                    className={styles.EditableFieldDropdown}
                    hideLabel
                    placeholder={AUDIT_VIEW_FORM(t).FIELD_NAME.PLACEHOLDER}
                    isDataLoading={isIntialLoading}
                    optionList={fieldList}
                    onChange={(event) => {
                      onDataListDataChange({ selectedFieldName: event.target.value });
                      dropDownChangeHandler(
                        'filterByField',
                        event.target.value,
                      );
                    }}
                    selectedValue={
                      store.getState().IndividualEntryReducer.dataAudit.selectedFieldName
                    }
                  />
                </div>
                <div>
                  <Dropdown
                    id={AUDIT_VIEW_FORM(t).EDITOR_NAME.ID}
                    className={styles.EditorNameDropdown}
                    hideLabel
                    placeholder={AUDIT_VIEW_FORM(t).EDITOR_NAME.PLACEHOLDER}
                    isDataLoading={isIntialLoading}
                    optionList={editorsNameList}
                    onChange={(event) => {
                      onDataListDataChange({ selectedEditorName: event.target.value });
                      dropDownChangeHandler(
                        'filterByEditor',
                        event.target.value,
                      );
                    }}
                    selectedValue={
                      store.getState().IndividualEntryReducer.dataAudit.selectedEditorName
                    }
                  />
                </div>
              </div>
            )}
        </div>
      </div>
      {!jsUtils.isEmpty(auditList) && (
          <div>
          <AuditList
            onDetailedViewClick={onDetailedViewClick}
            auditList={auditList}
            isIntialLoading={isIntialLoading}
            hasMore={haMore}
            onLoadMoreHandler={onLoadMoreCallHandler}
          />
          </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    auditList: state.IndividualEntryReducer.dataAudit.auditListItem,
    isIntialLoading: false,
    totalCount: state.IndividualEntryReducer.dataAudit.totalCount,
    currentPage: state.IndividualEntryReducer.dataAudit.auditPage,
    haMore: state.IndividualEntryReducer.dataAudit.hasMoreAuditData,
    selectedField: state.IndividualEntryReducer.dataAudit.selectedFieldName,
    selectedEditor: state.IndividualEntryReducer.dataAudit.selectedEditorName,
    filterquerryLoading: state.IndividualEntryReducer.dataAudit.filterquerryLoading,
    listLoading: state.IndividualEntryReducer.dataAudit.listLoading,
    isIntialEntry: false,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onDataListDataChange: (data) => {
      dispatch(dataAuditActionChanges(data));
    },

    dispatch,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AuditView);
