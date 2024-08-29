import React, { useContext, useEffect } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { INITIAL_PAGE } from 'utils/constants/form.constant';
import TablePaginationRowSelection from 'components/table_pagination_row_selection/TablePaginationRowSelection';
import EditIconV2 from 'assets/icons/form_fields/EditIconV2';
import { useTranslation } from 'react-i18next';
import LOOK_UP_MANAGEMENT_STRINGS, {
  headers, lookUpDropDown,
} from './LookUpManagement.strings';
import style from './LookUpManagement.module.scss';
import styles from '../user_management/member_list/MemberList.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import {
  addNewlookUpStateChangeAction,
  clearAddNewLookupReduxData,
  toggleAddNewLookupModalVisibility,
} from '../../../redux/reducer/LookUpReducer';
import {
  getLookupListApiThunk,
} from '../../../redux/actions/LookUp.Action';
import {
  EMPTY_STRING,
  FALSE,
} from '../../../utils/strings/CommonStrings';
import { validate } from '../../../utils/UtilityFunctions';
import { cancelGetLookupRequest } from '../../../axios/apiService/lookUp.apiService';
import { ROW_COUNT_DROPDOWN } from '../user_management/UserManagement.strings';
import ThemeContext from '../../../hoc/ThemeContext';
import AddNewLookup from './Add_Lookup/AddLookup';
import Button, {
  BUTTON_TYPE,
} from '../../../components/form_components/button/Button';
import FormTitle from '../../../components/form_components/form_title/FormTitle';
import CategoryManagement from '../category_management/CategoryManagement';

function LookUpManagement(props) {
  const { buttonColor } = useContext(ThemeContext);
  const {
    addNewLookupStateChange,
    lookUpListCurrentPage,
    lookUpListDataCountPerCall,
    lookUpTotalCount,
    lookUpList,
    onGetLookupList,
    clearAddNewLookup,
    toggleAddLookupModal,
    isAddNewlookUpModalOpen,
    isLoading,
  } = props;
  const { t } = useTranslation();
  const tableHeaders = headers(t).map((val) => val);
  let lookupTable = null;
  let commonHeader = null;

  useEffect(() => {
    const searchWithPaginationData = {
      page: lookUpListCurrentPage,
      size: lookUpListDataCountPerCall,
    };
    onGetLookupList(searchWithPaginationData);
    addNewLookupStateChange({
      lookup_name: EMPTY_STRING,
      lookup_type: EMPTY_STRING,
      lookup_value: [],
    });
    return () => {
      cancelGetLookupRequest();
    };
  }, []);

  const openOrCloseAddLookUpSection = () => {
    toggleAddLookupModal();
    clearAddNewLookup();
  };

  const ddlRowOnChangeHandler = (e) => {
    const selectedTableRowCount = e.target.value;
    const searchWithPaginationData = {
      page: INITIAL_PAGE,
      size: selectedTableRowCount,
    };
    onGetLookupList(searchWithPaginationData);
  };

  const onEditLookupClicked = (val) => {
    addNewLookupStateChange({
      lookupId: val._id,
      isEditable: true,
      lookup_name: val.lookup_name,
      lookup_type: val.lookup_type,
      lookup_value: val.lookup_value,
    });
    toggleAddLookupModal();
  };

  const handlePageChange = (page) => {
    const searchWithPaginationData = {
      page,
      size: lookUpListDataCountPerCall,
    };
    onGetLookupList(searchWithPaginationData);
  };

  const tableData = lookUpList.map((val) => {
    console.log('CSS ISSUE', val.lookup_value);
    const editIcon = (
      <button
        className={cx(
          gClasses.CursorPointer,
          gClasses.ClickableElement,
          style.EditButton,
          BS.D_FLEX,
          BS.TEXT_CENTER,
          BS.JC_CENTER,
          BS.ALIGN_ITEM_CENTER,
        )}
        style={{ borderColor: buttonColor }}
        onClick={() => onEditLookupClicked(val)}
        id={val._id}
      >
        <EditIconV2 isButtonColor title={t(LOOK_UP_MANAGEMENT_STRINGS.EDIT_LOOK_UP_ICON_LABEL)} role={ARIA_ROLES.IMG} ariaLabel="EditLookup" className={cx(style.EditIcon)} />
      </button>
    );
    const lookupName = (
      <div className={cx(BS.D_FLEX)} style={{ flexDirection: 'column' }}>
        <div
          className={cx(gClasses.Ellipsis)}
          title={val.lookup_name}
        >
          {val.lookup_name}
        </div>
      </div>
    );
    const lookupType = (
      <div className={cx(BS.D_FLEX)} style={{ flexDirection: 'column' }}>
        <div
          className={cx(gClasses.Ellipsis)}
          title={val.lookup_type}
        >
          {val.lookup_type.toString() === 'Text' ? lookUpDropDown(t)[0].label : lookUpDropDown(t)[1].label}
        </div>
      </div>
    );
    const lookupValue = (
      <div className={cx(BS.D_FLEX)} style={{ flexDirection: 'column' }}>
        <div
          className={cx(gClasses.Ellipsis)}
          title={val.lookup_value.toString()}
          style={{ width: '155px' }}
        >
          {val.lookup_value.toString()}
        </div>
      </div>
    );
    return [lookupName, lookupType, lookupValue, editIcon];
  });

  lookupTable = (
    <div className={cx(gClasses.MT30)}>
      <TablePaginationRowSelection
        ddlRowOptionList={ROW_COUNT_DROPDOWN}
        ddlRowSelectedValue={lookUpListDataCountPerCall}
        ddlRowOnChangeHandler={ddlRowOnChangeHandler}
        tblClassName={cx(styles.Table)}
        tblRowClassName={style.RowContainer}
        tblHeader={tableHeaders}
        tblData={tableData}
        paginationActivePage={lookUpListCurrentPage}
        paginationItemsCountPerPage={lookUpListDataCountPerCall}
        paginationTotalItemsCount={lookUpTotalCount}
        paginationOnChange={handlePageChange}
        paginationClassName={gClasses.MT15}
        paginationItem=" "
        tblIsDataLoading={isLoading}
        tblLoaderRowCount={lookUpListDataCountPerCall}
        tblLoaderColCount={3}
        showItemDisplayInfoStrictly
        bodyClassName={style.TableBodyContainer}
        paginationFlowDashboardView
        pageRangeDisplayed={3}
        downloadButton={
          <Button
            buttonType={BUTTON_TYPE.PRIMARY}
            className={cx(style.ButtonLookup, gClasses.MB10, gClasses.ML10)}
            onClick={openOrCloseAddLookUpSection}
            isDataLoading={isLoading}
          >
            {t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.TITLE)}
          </Button>
        }
        resultsCount={<FormTitle>{t(LOOK_UP_MANAGEMENT_STRINGS.SUBTITLE)}</FormTitle>}
      />
    </div>
  );

  commonHeader = (
    <div>
      <p className={cx(styles.SubCommonHeaderTitle, gClasses.HeadingTitle2)}>{t(LOOK_UP_MANAGEMENT_STRINGS.HEADING)}</p>
    </div>
  );

  return (
    <>
    {commonHeader}
    <div className={cx(styles.LookUpManagementContainer)}>
      <CategoryManagement />
      {lookupTable}
      <AddNewLookup
        onCancelClicked={openOrCloseAddLookUpSection}
        validate={validate}
        contentClass={cx(
          style.AddNewLookupModalContainer,
          gClasses.ModalContentClass,
        )}
        isModalOpen={isAddNewlookUpModalOpen}
        onCloseClick={openOrCloseAddLookUpSection}
      />
    </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    addNewLookup: state.LookUpReducer.addNewLookup,
    lookUpList: state.LookUpReducer.lookUpList,
    lookup_name: state.LookUpReducer.addNewLookup.lookup_name,
    lookup_type: state.LookUpReducer.addNewLookup.lookup_type,
    lookUpListCurrentPage: state.LookUpReducer.lookUpListCurrentPage,
    lookUpListDataCountPerCall: state.LookUpReducer.lookUpListDataCountPerCall,
    lookUpTotalCount: state.LookUpReducer.lookUpTotalCount,
    lookUpErrorList: state.LookUpReducer.addNewLookup.lookUpErrorList,
    isError: state.LookUpReducer.addNewLookup.isError,
    server_error: state.LookUpReducer.server_error,
    isAddNewlookUpModalOpen: state.LookUpReducer.isAddNewlookUpModalOpen,
    isLoading: state.LookUpReducer.islookUpListLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addNewLookupStateChange: (data) => {
      dispatch(addNewlookUpStateChangeAction(data));
    },
    toggleAddLookupModal: () => {
      dispatch(toggleAddNewLookupModalVisibility());
    },
    onGetLookupList: (params, isPaginatedData) => {
      dispatch(getLookupListApiThunk(params, isPaginatedData));
    },
    clearAddNewLookup: () => {
      dispatch(clearAddNewLookupReduxData());
    },
    dispatch,
  };
};

LookUpManagement.defaultProps = {
  addNewVisible: FALSE,
  addNewClicked: FALSE,
  error: FALSE,
  isLoading: FALSE,
};
LookUpManagement.propTypes = {
  addNewLookup: PropTypes.objectOf.isRequired,
  addNewLookupStateChange: PropTypes.func.isRequired,
  addNewVisible: PropTypes.bool,
  addNewClicked: PropTypes.bool,
  error: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(LookUpManagement);
