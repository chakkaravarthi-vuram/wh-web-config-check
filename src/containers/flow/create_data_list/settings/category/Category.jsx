import React, { useState } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { validate } from 'utils/UtilityFunctions';
import { addCategoryValidationSchema } from 'containers/admin_settings/category_management/Category.validation.schema';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { useTranslation } from 'react-i18next';
import { toastPopOver, EToastType, EButtonSizeType } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { isEmpty } from '../../../../../utils/jsUtility';
import { FLOW_STRINGS } from '../../../Flow.strings';
import CreateDropdown from '../../../../../components/create_dropdown/CreateDropdown';
import { addNewCategoryApiService, getCategoryApiService } from '../../../../../axios/apiService/form.apiService';

function Category(props) {
  const {
    isFlow,
    addOnData,
    setCategoryData,
    addOnErrorList,
    deleteCategoryError,
    populateCategoryErrorMessage,
  } = props;

  const { category } = addOnData;

  const { t } = useTranslation();
  const { CREATE_DATA_LIST } = FLOW_STRINGS(t);
  const [searchText, setSearchText] = useState(EMPTY_STRING);
  const [localCategory, setLocalCategory] = useState({
    data: [],
    paginationDetails: [],
    loading: false,
  });

  // starting fresh

  const getCategoryApiFunction = (customParams = {}) => {
    let params = {
      page: 1,
      size: 100,
    };
    setLocalCategory({ ...localCategory, loading: true });
    params = { ...params, ...customParams };
    getCategoryApiService(params).then((res) => {
      console.log('res', res);
      const dropdownOptionList = res?.paginationData?.map(
        (eachCategory) => {
          return {
            label: eachCategory.category_name,
            value: eachCategory._id,
          };
        },
      );
      setLocalCategory({
        data: params?.page > 1 ? [...localCategory?.data || [], ...dropdownOptionList] : dropdownOptionList,
        paginationDetails: res?.paginationDetails?.[0],
        loading: false,
      });
    }).catch((err) => {
      setLocalCategory({
        ...localCategory,
        loading: false,
      });
      console.log('get category err', err);
    });
  };

  const onCategoryClickHandler = (value, label) => {
    setCategoryData({
      category: {
        label: label,
        value: value,
      },
    });
  };

  const validateCatgory = (customText) => {
    const localValidatedErrorList = validate({ category_name: customText || searchText }, addCategoryValidationSchema(t));
    const errorMessage = localValidatedErrorList?.category_name;
    populateCategoryErrorMessage(errorMessage);
    return localValidatedErrorList;
  };

  const onCreateClickHandler = () => {
    let errorMessage = '';
    const validateCategoryError = validateCatgory();
    if (!isEmpty(validateCategoryError)) {
      return;
    }
    const params = {
      category_name: searchText,
    };
    addNewCategoryApiService(params).then((res) => {
      if (res) {
        toastPopOver({
          title: t(
            'error_popover_status.category_added_successfully',
          ),
          toastType: EToastType.success,
        });
      }
      console.log('ressx', res);
      setCategoryData({
        category: {
          label: searchText,
          value: res?.result?.data?._id,
        },
      });
    }).catch((err) => {
      console.log('create category err', err);
      const errors = err?.response?.data?.errors;
      if (errors[0]?.type === 'exist') {
        errorMessage = t('error_popover_status.category_already_exist');
        toastPopOver({
          title: t(
            'error_popover_status.category_already_exist',
          ),
          toastType: EToastType.error,
        });
        populateCategoryErrorMessage(errorMessage);
      }
    });
  };

  const onSearchHandler = (event) => {
    setSearchText(event?.target?.value);
    if (!isEmpty(addOnErrorList)) {
      validateCatgory(event?.target?.value);
    }
    getCategoryApiFunction(!isEmpty(event?.target?.value) && { search: event?.target?.value });
  };

  const onOutsideClickHandler = () => {
    setSearchText(EMPTY_STRING);
    deleteCategoryError();
  };

  const loadMoreCategories = () => {
    if (localCategory?.paginationDetails?.page) getCategoryApiFunction({ page: localCategory.paginationDetails.page + 1 || 1 });
  };

  return (
      <div className={cx(gClasses.W50, gClasses.MT16)}>
      <CreateDropdown
          id={CREATE_DATA_LIST.BASIC_INFO.DATA_LIST_CATEGORY.ID}
          onClick={onCategoryClickHandler}
          optionList={localCategory?.data}
          dropdownViewProps={{
            labelName: CREATE_DATA_LIST.BASIC_INFO.DATA_LIST_CATEGORY.LABEL,
            selectedLabel: category?.label,
            onClick: () => getCategoryApiFunction(),
            onKeyDown: () => getCategoryApiFunction(),
            onBlur: () => onOutsideClickHandler(),
          }}
          errorMessage={addOnErrorList?.categoryError}
          searchProps={{
            searchPlaceholder: isFlow ? CREATE_DATA_LIST.BASIC_INFO.DATA_LIST_CATEGORY.FLOW_PLACEHOLDER : CREATE_DATA_LIST.BASIC_INFO.DATA_LIST_CATEGORY.PLACEHOLDER,
            searchValue: searchText,
            onChangeSearch: onSearchHandler,
          }}
          createProps={{
            createButtonLabel: 'Create',
            onCreateButtonClick: onCreateClickHandler,
            createError: addOnErrorList?.createCategoryError,
            createButtonSize: EButtonSizeType.SM,
          }}
          selectedValue={category?.value}
          onOutSideClick={onOutsideClickHandler}
          infiniteScrollProps={{
            next: loadMoreCategories,
            dataLength: localCategory?.data,
            hasMore: localCategory?.data?.length < localCategory?.paginationDetails?.total_count,
            scrollableId: 'category_infinite_scroll',
          }}
          isLoadingOptions={localCategory?.loading}
      />
      </div>
  );
}

Category.propTypes = {
  isFlow: PropTypes.bool,
  addOnData: PropTypes.object,
  setCategoryData: PropTypes.func,
  addOnErrorList: PropTypes.object,
  deleteCategoryError: PropTypes.func,
  populateCategoryErrorMessage: PropTypes.func,
};

export default Category;
