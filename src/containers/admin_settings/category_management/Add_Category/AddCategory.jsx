import React, { useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { generatePostServerErrorMessage } from 'server_validations/ServerValidation';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import modalStyles from 'components/form_components/modal_layout/CustomClasses.module.scss';
import { useTranslation } from 'react-i18next';
import styles from './AddCategory.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';
import Button, {
  BUTTON_TYPE,
} from '../../../../components/form_components/button/Button';
import CATEGORY_MANAGEMENT_STRINGS from '../CategoryManagement.strings';
import Input from '../../../../components/form_components/input/Input';
import { BS } from '../../../../utils/UIConstants';
import {
  addCategoryApiThunk,
  addCategoryText,
  updateCategoryApiThunk,
  validCheck,
} from '../../../../redux/actions/Category.Action';
import jsUtils, {
  isEmpty,
} from '../../../../utils/jsUtility';
import { addCategoryValidationSchema } from '../Category.validation.schema';

function AddCategory(props) {
  const {
    textChangeCategory,
    category_name,
    addCategoryApiCall,
    categoryId,
    editCategoryApiCall,
    onCloseClick,
    initialCategoryText,
    validate,
    validateCategory,
    errorValidate,
    isModalOpen,
  } = props;
  const { t } = useTranslation();
  const [focusOnErrorRefresher, setFocusOnErrorRefresher] = useState(false);

  const onChangeHandler = (e) => {
    textChangeCategory(e.target.value);
  };

  const updateError = (error) => {
    const errors = generatePostServerErrorMessage(
      error,
      { category_name },
      { [CATEGORY_MANAGEMENT_STRINGS.ADD_LABEL_ID]: [t(CATEGORY_MANAGEMENT_STRINGS.ADD_LABEL)] },
    );
    if (!jsUtils.isEmpty(errors.state_error)) {
      const error_list = {
        [CATEGORY_MANAGEMENT_STRINGS.ADD_LABEL_ID]: errors.state_error[CATEGORY_MANAGEMENT_STRINGS.ADD_LABEL_ID],
      };
      validateCategory(error_list);
    }
  };

  const onSubmit = () => {
    const error_list = validate({ category_name }, addCategoryValidationSchema(t));
    validateCategory(error_list);
    console.log('error_list', error_list);
    if (jsUtils.isEmpty(error_list)) {
      if (!isEmpty(categoryId)) {
        const params = {
          _id: categoryId,
          category_name: category_name,
        };
        editCategoryApiCall(params, updateError);
      } else {
        const param = {
          category_name: category_name,
        };
        addCategoryApiCall(param, updateError);
      }
    } else {
      setFocusOnErrorRefresher((prev) => !prev);
    }
  };

  return (
    <div>
      <ModalLayout
        id="add-category-modal"
        isModalOpen={isModalOpen}
        onCloseClick={onCloseClick}
        mainContent={(
          <>
            <span
              className={cx(modalStyles.Remainder, gClasses.MT15, gClasses.MB5)}
            />
            <div className={cx(BS.D_FLEX, BS.JC_START)}>
              <div>
                <Input
                  label={t(CATEGORY_MANAGEMENT_STRINGS.ADD_LABEL)}
                  onChangeHandler={(e) => onChangeHandler(e)}
                  isRequired
                  value={category_name}
                  id={CATEGORY_MANAGEMENT_STRINGS.ADD_LABEL_ID}
                  errorMessage={
                    errorValidate
                      ? errorValidate[CATEGORY_MANAGEMENT_STRINGS.ADD_LABEL_ID]
                      : null
                  }
                  hideMessage={isEmpty(errorValidate)}
                  focusOnError
                  focusOnErrorRefresher={focusOnErrorRefresher}
                />
              </div>
            </div>
          </>
        )}
        headerClassName={modalStyles.ModalHeader}
        headerContent={(
          <div className={modalStyles.ModalHeaderContainer}>
            <div>
              <span className={cx(modalStyles.PageTitle)}>
                {isEmpty(categoryId)
                  ? t(CATEGORY_MANAGEMENT_STRINGS.ADD_TITLE)
                  : t(CATEGORY_MANAGEMENT_STRINGS.EDIT_TITLE)}
              </span>
              <div className={cx(styles.Label2, gClasses.PT5)}>
                {isEmpty(categoryId)
                  ? t(CATEGORY_MANAGEMENT_STRINGS.ADD_SUBTITLE)
                  : t(CATEGORY_MANAGEMENT_STRINGS.EDIT_SUBTITLE)}
              </div>
            </div>
          </div>
        )}
        footerContent={(
          <div
            className={cx(BS.W100, BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}
          >
            <Button
              buttonType={BUTTON_TYPE.SECONDARY}
              className={cx(gClasses.MR30, modalStyles.SecondaryButton)}
              onClick={onCloseClick}
            >
              {t(CATEGORY_MANAGEMENT_STRINGS.CANCEL)}
            </Button>
            <Button
              buttonType={BUTTON_TYPE.PRIMARY}
              primaryButtonStyle={modalStyles.PrimaryButton}
              className={cx(styles.Button)}
              onClick={onSubmit}
              disabled={
                !!(!isEmpty(categoryId) && initialCategoryText === category_name)
              }
            >
              {t(CATEGORY_MANAGEMENT_STRINGS.SUBMIT)}
            </Button>
          </div>
        )}
      />
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    category_name: state.CategoryReducer.addCategoryText,
    categoryId: state.CategoryReducer.categoryId,
    initialCategoryText: state.CategoryReducer.initialCategoryText,
    errorValidate: state.CategoryReducer.categoryErrorList,
    categoryArray: state.CategoryReducer.pagination_data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    textChangeCategory: (value) => {
      dispatch(addCategoryText(value));
    },
    addCategoryApiCall: (value, func) => {
      dispatch(addCategoryApiThunk(value, func));
    },
    editCategoryApiCall: (value, func) => {
      dispatch(updateCategoryApiThunk(value, func));
    },
    validateCategory: (value) => {
      dispatch(validCheck(value));
    },
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCategory);
