import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TablePaginationRowSelection from 'components/table_pagination_row_selection/TablePaginationRowSelection';
import EditIconV2 from 'assets/icons/form_fields/EditIconV2';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import { useTranslation } from 'react-i18next';
import CATEGORY_MANAGEMENT_STRINGS, {
  headers,
} from './CategoryManagement.strings';
import {
  addCategoryText,
  categoryClearData,
  categoryDataThunk,
  categoryIdSave,
  changeCategoryRowsPerPage,
  deleteCategoryApiThunk,
  initialCategoryText,
  modalCategoryDataClear,
  openOrCloseModal,
} from '../../../redux/actions/Category.Action';
import FormTitle from '../../../components/form_components/form_title/FormTitle';
import gClasses from '../../../scss/Typography.module.scss';
import style from './CategoryManagement.module.scss';
import Button, {
  BUTTON_TYPE,
} from '../../../components/form_components/button/Button';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import { ROW_COUNT_DROPDOWN } from '../user_management/UserManagement.strings';
import { validate } from '../../../utils/UtilityFunctions';
import AddCategory from './Add_Category/AddCategory';
import styles from '../user_management/member_list/MemberList.module.scss';
import DeleteConfirmModal from '../../application/delete_comfirm_modal/DeleteConfirmModal';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function CategoryManagement(props) {
  const { t } = useTranslation();
  let categoryTable = null;
  const tableHeaders = headers(t).map((val) => val);
  const {
    toggleCloseOpen,
    getCategoryListData,
    categoryData,
    modalToggle,
    textChangeCategory,
    categoryIdSaving,
    clearCategoryData,
    initialCategoryTextStore,
    categoryCurrentPage,
    categoryTotalCount,
    deleteCategory,
    isLoading,
    clear,
    isPageLoading,
    rowChange,
    rowsCount,
  } = props;
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [deleteId, setDeletId] = useState(EMPTY_STRING);
  const closeModal = () => {
    toggleCloseOpen();
    clearCategoryData();
  };

  const toggleModal = () => {
    toggleCloseOpen();
  };

  const handlePageChange = (page) => {
    const PaginationData = {
      page,
      size: rowsCount,
    };
    getCategoryListData(PaginationData);
  };

  const editClick = (value) => {
    textChangeCategory(value.category_name);
    initialCategoryTextStore(value.category_name);
    categoryIdSaving(value._id);
    toggleModal();
  };

  const deleteClick = () => {
    setDeleteStatus(false);
    const apiParam = {
      _id: deleteId,
    };
    setDeletId(EMPTY_STRING);
    deleteCategory(apiParam);
  };

  const onRowChange = (e) => {
    const searchWithPaginationData = {
      page: 1,
      size: e.target.value,
    };
    getCategoryListData(searchWithPaginationData);
    rowChange(e.target.value);
  };

  const tableRowDatas = categoryData?.map((value) => {
    const categoryName = (
      <div className={cx(BS.D_FLEX)} style={{ flexDirection: 'column' }}>
        <div className={cx(gClasses.Ellipsis)} title={value.category_name}>
          {value.category_name}
        </div>
      </div>
    );

    const icons = (
      <div className={cx(style.IconContainer, BS.D_FLEX)}>
        <div className={cx(style.EditIconContainer, BS.D_FLEX, BS.TEXT_CENTER, BS.JC_CENTER, BS.ALIGN_ITEM_CENTER)}>
          <EditIconV2
            className={cx(style.EditIcon, gClasses.OutlineNoneOnFocus)}
            isButtonColor
            onClick={() => editClick(value)}
            title={t(CATEGORY_MANAGEMENT_STRINGS.EDIT_CATEGORY_ICON_LABEL)}
            tabIndex={0}
            role={ARIA_ROLES.BUTTON}
          />
        </div>
        <div className={cx(style.EditIconContainer, BS.D_FLEX, BS.TEXT_CENTER, BS.JC_CENTER, BS.ALIGN_ITEM_CENTER)}>
          <DeleteIconV2
            className={cx(style.DeleteIcon, gClasses.OutlineNoneOnFocus)}
            onClick={() => { setDeletId(value._id); setDeleteStatus(true); }}
            title={t(CATEGORY_MANAGEMENT_STRINGS.DELETE_CATEGORY_ICON_LABEL)}
          />
        </div>
      </div>
    );
    return [categoryName, icons];
  });

  categoryTable = (
    <div>
      <TablePaginationRowSelection
        tblClassName={cx(styles.Table)}
        tblRowClassName={style.RowContainer}
        ddlRowOptionList={ROW_COUNT_DROPDOWN}
        ddlRowSelectedValue={rowsCount}
        headerCharLimit={45}
        ddlRowOnChangeHandler={onRowChange}
        tblHeader={tableHeaders}
        tblData={tableRowDatas}
        bodyClassName={style.TableBodyContainer}
        paginationActivePage={categoryCurrentPage}
        paginationItemsCountPerPage={rowsCount}
        paginationTotalItemsCount={categoryTotalCount}
        paginationOnChange={handlePageChange}
        paginationClassName={gClasses.MT15}
        paginationItem=" "
        tblIsDataLoading={isLoading}
        paginationIsDataLoading={isPageLoading}
        tblLoaderRowCount={rowsCount}
        tblLoaderColCount={2}
        showItemDisplayInfoStrictly
        paginationFlowDashboardView
        pageRangeDisplayed={3}
        downloadButton={
          <Button
            buttonType={BUTTON_TYPE.PRIMARY}
            onClick={toggleModal}
            isDataLoading={isLoading}
            className={cx(gClasses.MB10, style.AddButton, gClasses.ML10)}
          >
            {t(CATEGORY_MANAGEMENT_STRINGS.ADD_CATEGORY)}
          </Button>
        }
        resultsCount={
          <FormTitle>
            {t(CATEGORY_MANAGEMENT_STRINGS.SUBTITLE)}
          </FormTitle>
        }

      />
    </div>
  );

  useEffect(() => {
    const paginationData = {
      page: 1,
      size: rowsCount,
    };
    getCategoryListData(paginationData, isPageLoading);
    return () => {
      clear();
    };
  }, []);

  return (
    <div>
      {categoryTable}
      <AddCategory
        isModalOpen={modalToggle}
        validate={validate}
        onCloseClick={closeModal}
        contentClass={cx(
          style.AddCategoryModalContainer,
          gClasses.ModalContentClass,
        )}
      />
      <DeleteConfirmModal
          isModalOpen={deleteStatus}
          content={t(CATEGORY_MANAGEMENT_STRINGS.DELETE_CATEGORY_MODAL)}
          firstLine={t(CATEGORY_MANAGEMENT_STRINGS.DELETE_COMPONENT_FIRST)}
          onDelete={() => deleteClick()}
          onCloseModal={() => { setDeleteStatus(false); setDeletId(EMPTY_STRING); }}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    categoryData: state.CategoryReducer.pagination_data,
    modalToggle: state.CategoryReducer.isCategoryModalOpen,
    categoryCurrentPage: state.CategoryReducer.categoryCurrentPage,
    categoryDataCountPerPage: state.CategoryReducer.categoryDataCountPerPage,
    categoryTotalCount: state.CategoryReducer.categoryTotalCount,
    isLoading: state.CategoryReducer.isCategoryListLoading,
    isPageLoading: state.CategoryReducer.isPaginationLoading,
    rowsCount: state.CategoryReducer.categoryDataCountPerPage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCategoryListData: (value, load) => {
      dispatch(categoryDataThunk(value, load));
    },
    toggleCloseOpen: () => {
      dispatch(openOrCloseModal());
    },
    textChangeCategory: (value) => {
      dispatch(addCategoryText(value));
    },
    categoryIdSaving: (value) => {
      dispatch(categoryIdSave(value));
    },
    clearCategoryData: () => {
      dispatch(modalCategoryDataClear());
    },
    initialCategoryTextStore: (value) => {
      dispatch(initialCategoryText(value));
    },
    deleteCategory: (value) => {
      dispatch(deleteCategoryApiThunk(value));
    },
    clear: () => {
      dispatch(categoryClearData());
    },
    rowChange: (value) => {
      dispatch(changeCategoryRowsPerPage(value));
    },
    dispatch,
  };
};

CategoryManagement.propTypes = {
  getCategoryApiCall: PropTypes.func.isRequired,
  addNewCategoryApiCall: PropTypes.func.isRequired,
  getCategoryListData: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryManagement);
