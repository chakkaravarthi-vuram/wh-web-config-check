/* eslint-disable no-restricted-globals */
import React, { useState } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import modalStyles from 'components/form_components/modal_layout/CustomClasses.module.scss';
import { FALSE } from 'utils/strings/CommonStrings';
import { evaluateFocusOnError } from 'utils/UtilityFunctions';
import { constructJoiObject } from 'utils/ValidationConstants';
import { useTranslation } from 'react-i18next';
import styles from './AddLookup.module.scss';
import Dropdown from '../../../../components/form_components/dropdown/Dropdown';
import jsUtils, {
  isEmpty,
  isUndefined,
} from '../../../../utils/jsUtility';
import { ARIA_ROLES, BS } from '../../../../utils/UIConstants';
import TextArea from '../../../../components/form_components/text_area/TextArea';
import gClasses from '../../../../scss/Typography.module.scss';
import Button, {
  BUTTON_TYPE,
} from '../../../../components/form_components/button/Button';
import LOOK_UP_MANAGEMENT_STRINGS, {
  lookUpDropDown,
} from '../LookUpManagement.strings';
import Input, {
  INPUT_VARIANTS,
} from '../../../../components/form_components/input/Input';
import {
  addNewlookUpStateChangeAction,
  toggleAddNewLookupModalVisibility,
} from '../../../../redux/reducer/LookUpReducer';
import {
  addNewLookUpApiThunk,
  editLookUpApiThunk,
} from '../../../../redux/actions/LookUp.Action';
import { getAddLookupPostData } from '../LookUpManagement.utils';
import { addNewLookUpValidationSchema } from '../LookUpManagement.validation.schema';
import { parseNumericValue } from './AddLookup.utils';

function AddNewLookup(props) {
  const { addNewLookup } = jsUtils.cloneDeep(props);
  const { lookup_name, lookup_type, lookup_value } = addNewLookup;
  let { lookUpErrorList } = addNewLookup;
  const {
    addNewLookupStateChange,
    addNewLookUpApi,
    editLookUpApi,
    isAddNewlookUpModalOpen,
    onCancelClicked,
    validate,
    serverLookUpList,
    isModalOpen,
    onCloseClick,
  } = props;
  const { t } = useTranslation();
  const allFormFieldIdsInAccessibleOrder = [
    LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_NAME.ID,
    LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_TYPE.ID,
    LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.ID,
  ];

  const [focusOnErrorFieldId, setfocusOnErrorFieldId] = useState(null);
  const [focusOnErrorRefresher, setFocusOnErrorRefresher] = useState(false);

  let lookupName;
  let lookupType;
  let lookupValue;
  serverLookUpList.forEach((val) => {
    if (val._id === addNewLookup.lookupId) {
      lookupName = val.lookup_name;
      lookupType = val.lookup_type;
      lookupValue = val.lookup_value;
    }
  });
  const cancelLookup = () => {
    console.log('cancelLookup', addNewLookup.lookupId);
    if (isUndefined(addNewLookup.lookupId)) {
      onCancelClicked();
    } else {
      serverLookUpList.forEach((val) => {
        if (val._id === addNewLookup.lookupId) {
          addNewLookupStateChange({
            lookup_name: val.lookup_name,
            lookup_type: val.lookup_type,
            lookup_value: val.lookup_value,
            lookUpErrorList: {},
          });
        }
      });
    }
  };
  console.log('MODAL OPEN', isAddNewlookUpModalOpen);

  const validateLookupValue = (id, value) => {
    let { lookUpErrorList = {} } = jsUtils.cloneDeep(props);
    let errorList = {};
    if (!isEmpty(lookUpErrorList[id])) {
      errorList = validate(
        { [id]: value },
        constructJoiObject({ [id]: addNewLookUpValidationSchema(t)[id] }),
      );
    }
    if (isEmpty(errorList)) delete lookUpErrorList[id];
    else {
      lookUpErrorList = {
        ...lookUpErrorList,
        ...errorList,
      };
    }
    return lookUpErrorList;
  };

  const handleLookupValueValidationError = () => {
    const errorList = {
      lookup_value: t(LOOK_UP_MANAGEMENT_STRINGS.LOOK_UP_ERROR),
    };
    addNewLookupStateChange({ lookUpErrorList: { ...errorList, ...lookUpErrorList } });
    setfocusOnErrorFieldId(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.ID);
    setFocusOnErrorRefresher((prev) => !prev);
  };

  const handleLookupValueChange = (value, lookupId) => {
    const temp = value.split(',');
    const updatedErrors = validateLookupValue('lookup_value', temp);
    if (!isUndefined(lookupId)) {
      if (lookupValue.every((v) => temp.includes(v))) {
        addNewLookupStateChange({ lookup_value: temp, lookUpErrorList: updatedErrors });
      } else {
        handleLookupValueValidationError();
      }
    } else {
      addNewLookupStateChange({ lookup_value: temp, lookUpErrorList: updatedErrors });
    }
  };

  const handleFieldValidation = (errorList, fieldId, value) => {
    if (isEmpty(errorList)) {
      delete lookUpErrorList[fieldId];
    } else {
      lookUpErrorList = {
        ...lookUpErrorList,
        ...errorList,
      };
    }
    addNewLookupStateChange({ [fieldId]: value, lookUpErrorList });
  };

  const handleFieldTypeChange = (errorList, value) => {
    if (!isEmpty(lookUpErrorList?.lookup_value) && value === 'Text' && !(jsUtils.isEmpty(lookup_value)) && lookup_value[0] !== '') {
      delete lookUpErrorList.lookup_value;
    }
    handleFieldValidation(errorList, LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_TYPE.ID, value);
  };

  const handleOtherFieldChange = (fieldId, value) => {
    const errorList = validate({ [fieldId]: value }, constructJoiObject({ [fieldId]: addNewLookUpValidationSchema(t)[fieldId] }));

    if (fieldId === LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_TYPE.ID) {
      handleFieldTypeChange(errorList, value);
    } else {
      handleFieldValidation(errorList, fieldId, value);
    }
  };

  const onChangeHandler = (event) => {
    const { id, value } = event.target;
    const { lookupId } = addNewLookup;

    if (id === 'lookup_value') {
      handleLookupValueChange(value, lookupId);
    } else {
      handleOtherFieldChange(id, value);
    }
  };

  const getAddNewLookupValidateData = () => {
    return { lookup_name, lookup_type, lookup_value };
  };

  const handleFocusOnError = (error_list) => {
    setfocusOnErrorFieldId((previous_value) => {
      const currentFocusableFieldId = evaluateFocusOnError(allFormFieldIdsInAccessibleOrder, error_list);
      if (previous_value === currentFocusableFieldId) setFocusOnErrorRefresher((refresher) => !refresher);
      return currentFocusableFieldId;
    });
  };

  const onAddNewLookupClicked = () => {
    console.log(
      'Tick Clicked',
      addNewLookup.lookupId,
      lookup_type,
      lookup_value,
      lookup_name,
      lookup_value.length,
    );
    console.log('after change tick clicked', lookup_value, typeof lookup_value);

    const error_list = validate(getAddNewLookupValidateData(), constructJoiObject({ ...addNewLookUpValidationSchema(t) }));

    if (lookup_value.length === 1 && (lookup_value[0] === '' || lookup_value[0].trim() === '')) {
      error_list.lookup_value = `${t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.LABEL)} ${t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.MIN_ERROR)}`;
    } else if (lookup_type === 'Number' && !(jsUtils.isEmpty(lookup_value)) && lookup_value[0] !== '') {
      const sortedLookupValues = lookup_value.map(parseNumericValue);
      console.log('ZZZ', sortedLookupValues);
      if (sortedLookupValues.includes(NaN)) {
        error_list.lookup_value = t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.VALIDATIONS.NUMBER_VALIDATION);
      }
    }

    const filteredLookupValues = lookup_value.filter((a) => a);

    addNewLookupStateChange({
      lookUpErrorList: error_list,
      lookup_value: filteredLookupValues,
    });

    if (jsUtils.isEmpty(error_list)) {
      const uniqueLookupValues = [...new Set(filteredLookupValues)];
      addNewLookupStateChange({ lookup_value: uniqueLookupValues });

      const postData = getAddLookupPostData(addNewLookup);

      if (isUndefined(addNewLookup.lookupId)) {
        addNewLookUpApi(postData, t);
      } else {
        postData._id = addNewLookup.lookupId;
        editLookUpApi(postData, t);
      }
    } else {
      handleFocusOnError(error_list);
    }
  };

  console.log(
    'isEqual check',
    addNewLookup.lookupId,
    lookup_name,
    lookupType,
    lookup_type,
    lookupValue,
    lookup_value,
    lookupName === lookup_name,
    jsUtils.isEqual(lookupValue, lookup_value),
    lookupType === lookup_type,
  );
  return (
    <div>
      <ModalLayout
        id="add-lookup-modal"
        isModalOpen={isModalOpen}
        onCloseClick={onCloseClick}
        mainContent={(
          <div>
            <span
              className={cx(styles.Remainder, gClasses.MT15, gClasses.MB5)}
            />
            <div className={cx(BS.D_FLEX, BS.JC_START)}>
              <div>
                <Input
                  className={cx(BS.ALIGN_ITEM_CENTER, styles.LookupName)}
                  inputVariant={INPUT_VARIANTS.TYPE_5}
                  label={t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_NAME.LABEL)}
                  hideMessage={isEmpty(lookUpErrorList)}
                  placeholder={
                    t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_NAME.PLACEHOLDER)
                  }
                  id={LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_NAME.ID}
                  onChangeHandler={onChangeHandler}
                  value={lookup_name}
                  isRequired
                  errorMessage={
                    lookUpErrorList
                      ? lookUpErrorList[
                      LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_NAME.ID
                      ]
                      : null
                  }
                  focusOnError={focusOnErrorFieldId === LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_NAME.ID}
                  focusOnErrorRefresher={focusOnErrorRefresher}
                />
              </div>
              <div
                className={cx(
                  BS.D_FLEX,
                  gClasses.PL32,
                  gClasses.PR70,
                  gClasses.InputHeight39,
                )}
              >
                <Dropdown
                  className={cx(
                    BS.ALIGN_ITEM_CENTER,
                    styles.LookupName,
                    gClasses.InputHeight39,
                  )}
                  label={t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_TYPE.LABEL)}
                  hideMessage={isEmpty(lookUpErrorList)}
                  optionList={lookUpDropDown(t)}
                  id={LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_TYPE.ID}
                  placeholder={
                    t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_TYPE.PLACEHOLDER)
                  }
                  onChange={onChangeHandler}
                  selectedValue={lookup_type}
                  strictlySetSelectedValue
                  errorMessage={
                    lookUpErrorList
                      ? lookUpErrorList[
                      LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_TYPE.ID
                      ]
                      : null
                  }
                  isRequired
                  disabled={!isUndefined(addNewLookup.lookupId)}
                  focusOnError={focusOnErrorFieldId === LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_TYPE.ID}
                  focusOnErrorRefresher={focusOnErrorRefresher}
                />
              </div>
            </div>
            <div className={gClasses.MT15}>
              <TextArea
                className={cx(
                  styles.Input,
                  BS.ALIGN_ITEM_CENTER,
                  styles.LookupValue,
                )}
                label={t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.LABEL)}
                hideMessage={isEmpty(lookUpErrorList)}
                placeholder={
                  t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.PLACEHOLDER)
                }
                id={LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.ID}
                onChangeHandler={onChangeHandler}
                value={lookup_value}
                isRequired
                errorMessage={
                  lookUpErrorList
                    ? lookUpErrorList[
                    LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.ID
                    ]
                    : null
                }
                instructionMessage={
                  t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.INSTRUCTION)
                }
                focusOnError={focusOnErrorFieldId === LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.ID}
                focusOnErrorRefresher={focusOnErrorRefresher}
                helperMessageRole={ARIA_ROLES.PRESENTATION}
              />
            </div>
          </div>
        )}
        headerClassName={modalStyles.ModalHeader}
        headerContent={(
          <div className={modalStyles.ModalHeaderContainer}>
            <div>
              <span className={cx(modalStyles.PageTitle)}>
                {isUndefined(addNewLookup.lookupId)
                  ? t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.TITLE)
                  : t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.EDIT_TITLE)}
              </span>
              <div className={cx(styles.Label2, gClasses.PT5)}>
                {isUndefined(addNewLookup.lookupId)
                  ? t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.SUBTITLE)
                  : t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.EDIT_SUBTITLE)}
              </div>
            </div>
          </div>
        )}
        footerContent={lookupName === lookup_name &&
          jsUtils.isEqual(lookupValue, lookup_value) &&
          lookupType === lookup_type ? null : (
          <div
            className={cx(BS.W100, BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}
          >
            <Button
              buttonType={BUTTON_TYPE.SECONDARY}
              className={modalStyles.SecondaryButton}
              onClick={cancelLookup}
            >
              {t(LOOK_UP_MANAGEMENT_STRINGS.CANCEL_BUTTON.LABEL)}
            </Button>
            <Button
              buttonType={BUTTON_TYPE.PRIMARY}
              primaryButtonStyle={modalStyles.PrimaryButton}
              onClick={onAddNewLookupClicked}
            >
              {t(LOOK_UP_MANAGEMENT_STRINGS.SET_LOOKUP_FIELDS.LABEL)}
            </Button>
          </div>
        )}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    addNewLookup: state.LookUpReducer.addNewLookup,
    lookUpList: state.LookUpReducer.lookUpList,
    serverLookUpList: state.LookUpReducer.lookUpList,
    lookup_name: state.LookUpReducer.addNewLookup.lookup_name,
    lookup_type: state.LookUpReducer.addNewLookup.lookup_type,
    lookUpListCurrentPage: state.LookUpReducer.lookUpListCurrentPage,
    lookUpListDataCountPerCall: state.LookUpReducer.lookUpListDataCountPerCall,
    lookUpTotalCount: state.LookUpReducer.lookUpTotalCount,
    lookUpErrorList: state.LookUpReducer.addNewLookup.lookUpErrorList,
    server_error: state.LookUpReducer.server_error,
    isAddNewlookUpModalOpen: state.LookUpReducer.isAddNewlookUpModalOpen,
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
    addNewLookUpApi: (data, t) => {
      dispatch(addNewLookUpApiThunk(data, t));
    },
    editLookUpApi: (data, t) => {
      dispatch(editLookUpApiThunk(data, t));
    },
    dispatch,
  };
};

AddNewLookup.defaultProps = {
  error: FALSE,
};
AddNewLookup.propTypes = {
  error: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNewLookup);
