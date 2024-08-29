import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { INITIAL_PAGE, MAX_PAGINATION_SIZE } from 'utils/constants/form.constant';
import { get, uniqBy, isEmpty } from 'utils/jsUtility';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import { validate } from 'utils/UtilityFunctions';
import { FORM_POPOVER_STATUS } from 'utils/Constants';
import { FLOW_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import { addCategoryValidationSchema } from 'containers/admin_settings/category_management/Category.validation.schema';
import { addNewCategoryApiAction, getCategoryApiAction } from 'redux/actions/EditFlow.Action';
import styles from './Category.module.scss';
import { ERROR_TEXT } from '../../../../utils/strings/CommonStrings';
import { showToastPopover } from '../../../../utils/UtilityFunctions';

function Category(props) {
  const { t } = useTranslation();
  const {
    category,
    categoryData,
    categoryData: { categoryList, categoryValueError, categoryCurrentPage, categoryTotalCount },
    getCategoryApiCall,
    addNewCategoryApiCall,
    setDataInsideFlowDataAction,
    errorList = {},
    // CatergoryClass,
    CategoryContainerClass,
    popperClasses,
    CatergoryLabelClass,
    popperPlacement,
    // isDropdownDisabled,
    removeCategoryServerError,
  } = props;

  const hasMoreInitial = categoryTotalCount > categoryList.length;
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [newCategoryState, setNewCategoryState] = useState(EMPTY_STRING);
  console.log('categoryData', categoryData);

  const loadCategoryData = (isSearch = false, searchText = EMPTY_STRING, categoryError = EMPTY_STRING) => {
    if (categoryTotalCount > categoryList.length || isSearch) {
      const currentPage = (isSearch === true) ? INITIAL_PAGE : categoryCurrentPage;
      const params = {
        page: currentPage,
        size: MAX_PAGINATION_SIZE,
      };
      if (!isEmpty(searchText)) params.search = searchText;
      getCategoryApiCall(params, (response) => {
        console.log('getCategoryApiresponse', response);
        setDataInsideFlowDataAction({
          categoryData: {
            ...categoryData,
            categoryList: (currentPage > 1) ?
              uniqBy([...categoryList, ...response[0]], (categoryOption) => categoryOption.id) :
              response[0],
            categoryTotalCount: response[1],
            categoryCurrentPage: response[2] + 1,
            categoryValueError: categoryError,
          },
        });
      });
    } else setHasMore(false);
  };

  useEffect(() => loadCategoryData(), []);
  useEffect(() => setHasMore(hasMoreInitial), [hasMoreInitial]);

  const onChangeHandler = (event) => {
    let category_id;
    setDataInsideFlowDataAction({
      categoryData: { ...categoryData, [event.target.id]: event.target.value, categoryValueError: EMPTY_STRING },
    });
    removeCategoryServerError?.(FLOW_STRINGS.SETTINGS.CATEGORY.SERVER_ID);
    categoryList.forEach((item) => {
      if (item.value === event.target.value) category_id = item.id;
    });
    setDataInsideFlowDataAction({ [event.target.id]: { category_id: category_id, category_name: event.target.value, categoryData: { ...categoryData, categoryValueError: EMPTY_STRING } } });
    setNewCategoryState(EMPTY_STRING);
    loadCategoryData(true);
  };

  const onCategoryNameChangeHandler = (event) => {
    const value = get(event, ['target', 'value'], null);
    setNewCategoryState(value);
    loadCategoryData(true, value);
  };

  const addNewCategoryHandler = async () => {
    const error_list = validate({ category_name: newCategoryState }, addCategoryValidationSchema(t));
    if (error_list && error_list.category_name) {
      setDataInsideFlowDataAction({
        categoryData: { ...categoryData, categoryValueError: error_list.category_name },
      });
      loadCategoryData(true, EMPTY_STRING, error_list.category_name);
      showToastPopover(
        error_list.category_name,
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    } else {
      await addNewCategoryApiCall(
        {
          category_name: newCategoryState,
        },
        updateFlowDataChange,
        categoryData,
        (errorMessage) => {
          setDataInsideFlowDataAction({
            categoryData: { ...categoryData, categoryValueError: errorMessage },
          });
        },
        () => removeCategoryServerError?.(FLOW_STRINGS.SETTINGS.CATEGORY.SERVER_ID),
      );
      setNewCategoryState(EMPTY_STRING);
    }
  };
  const onLoadMoreHandler = () => {
    if (categoryTotalCount > categoryList.length) loadCategoryData(false, newCategoryState);
    else setHasMore(false);
  };

  const handleBlurDropdown = () => {
    setDataInsideFlowDataAction({
      categoryData: { ...categoryData, categoryValueError: EMPTY_STRING },
    });
    setNewCategoryState(EMPTY_STRING);
    loadCategoryData(true, EMPTY_STRING, categoryValueError);
  };

  return (

    <Dropdown
      innerClassName={cx(styles.Category, CategoryContainerClass)}
      label={t(FLOW_STRINGS.SETTINGS.CATEGORY.LABEL)}
      dropdownListCreateLabel={t(FLOW_STRINGS.SETTINGS.CATEGORY.CREATE_LABEL)}
      dropdownListChooseLabel={t(FLOW_STRINGS.SETTINGS.CATEGORY.CHOOSE_LABEL)}
      dropdownListNotFoundLabel={t(FLOW_STRINGS.SETTINGS.CATEGORY.NO_DATA)}
      ButtonLabelMultiSectionDropdown={t(FLOW_STRINGS.SETTINGS.CATEGORY.BUTTON_TEXT)}
      placeholder={t(FLOW_STRINGS.SETTINGS.CATEGORY.PLACEHOLDER)}
      id={FLOW_STRINGS.SETTINGS.CATEGORY.ID}
      optionList={categoryList}
      onChange={onChangeHandler}
      selectedValue={category?.category_name || null}
      errorMessage={(!isEmpty(categoryValueError) && ERROR_TEXT.ERR_WITH_NO_MSG) || errorList[FLOW_STRINGS.SETTINGS.CATEGORY.ID] || errorList?.category_id}
      showDropdownListIfError={isEmpty(errorList?.category_id)}
      showNoDataFoundOption
      textId={FLOW_STRINGS.SETTINGS.CATEGORY.ADD_NEW_CATEGORY.ID}
      onInputChangeHandler={onCategoryNameChangeHandler}
      inputValue={newCategoryState}
      onButtonClick={addNewCategoryHandler}
      textError={categoryValueError}
      isPaginated
      isMultiSectionDropdown
      loadDataHandler={onLoadMoreHandler}
      hasMore={hasMore}
      strictlySetSelectedValue
      popperClasses={popperClasses}
      labelClassAdmin={CatergoryLabelClass}
      disableFocusFilter
      setSelectedValue
      placement={popperPlacement}
      handleBlurDropdown={handleBlurDropdown}
      hideMessage
      // disabled={isDropdownDisabled}
      isCategoryDropdown
    />

  );
}

const mapStateToProps = (state) => {
  return {
    category: state.EditFlowReducer.flowData.category,
    categoryData: state.EditFlowReducer.flowData.categoryData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDataInsideFlowDataAction: (flowData) => {
      dispatch(updateFlowDataChange(flowData));
    },
    getCategoryApiCall: (...params) => {
      dispatch(getCategoryApiAction(...params));
    },
    addNewCategoryApiCall: (...params) =>
      dispatch(addNewCategoryApiAction(...params)),
  };
};

Category.defaultProps = {
  category: '',
  errorList: {},
  popperClasses: {},
};

Category.propTypes = {
  setDataInsideFlowDataAction: PropTypes.func.isRequired,
  getCategoryApiCall: PropTypes.func.isRequired,
  addNewCategoryApiCall: PropTypes.func.isRequired,
  category: PropTypes.string,
  errorList: PropTypes.oneOfType(PropTypes.object, PropTypes.array),
  popperClasses: PropTypes.oneOfType(PropTypes.object, PropTypes.array),
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);
