import React, { useContext, useState, useEffect } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';

import { sectionTitleValidateSchema } from 'containers/task/task/Task.validation.schema';
import jsUtils from 'utils/jsUtility';
import { validate } from 'utils/UtilityFunctions';
import { FORM_POPOVER_STATUS, KEY_NAMES } from 'utils/Constants';
import { popoverCommonClassName } from 'components/form_components/modal/Modal.strings';
import { useTranslation } from 'react-i18next';
import FormFieldsDropdown from './form_fields_dropdown/FormFieldsDropdown';
import AddIcon from '../../../../assets/icons/AddIcon';

import styles from './AddFormFields.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';
import ThemeContext from '../../../../hoc/ThemeContext';
import { ARIA_ROLES, BS, INPUT_TYPES } from '../../../../utils/UIConstants';
import {
  ARIA_LABEL,
  FORM_STRINGS,
} from '../../FormBuilder.strings';
import AutoPositioningPopper, {
  POPPER_PLACEMENTS,
} from '../../../auto_positioning_popper/AutoPositioningPopper';
import FormBuilderContext from '../../FormBuilderContext';
import AddNewBoxedButton, {
  ADD_NEW_BOXED_BUTTON_TYPE,
} from '../../../add_new_boxed_button/AddNewBoxedButton';
import { showToastPopover } from '../../../../utils/UtilityFunctions';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';

function AddFormFields(props) {
  const { buttonColor } = useContext(ThemeContext);
  const { t } = useTranslation();
  const {
    addExistingFieldsDropdownHandler,
    onSelectExistingFieldHandler,
    existingFieldsData,
    setAddFormFieldsDropdownVisibility,
    addFormFieldsDropdownVisibilityData = {},
    addFormFieldsDropdownVisibilityData: {
      id: addFormFieldsDropdownId,
      isVisible,
      sectionIndex: addFormFieldsDropdownSectionIndex,
      fieldListIndex: addFormFieldsDrodpdownFieldListIndex,
      fieldsLength: addFormFieldsDropdownFieldsIndex,
      stepIndex: addFormFieldsDropdownStepIndex = 0,
    } = {},
    stepIndex,
    clearAddFormFieldsDropdownData,
  } = useContext(FormBuilderContext) || {};
  const {
    fieldListIndex = null,
    fieldsLength = null,
    sectionIndex,
    sectionDetails,
    isTaskForm = null,
  } = props;
  let isFormFieldDrodpdownVisibile = false;
  if (addFormFieldsDropdownStepIndex === stepIndex) {
    if (addFormFieldsDropdownSectionIndex === sectionIndex) {
      if (addFormFieldsDrodpdownFieldListIndex !== null && addFormFieldsDropdownFieldsIndex !== null) {
        if (addFormFieldsDrodpdownFieldListIndex === fieldListIndex && fieldsLength === addFormFieldsDropdownFieldsIndex) {
          isFormFieldDrodpdownVisibile = true;
        } else {
          isFormFieldDrodpdownVisibile = false;
        }
      } else if (fieldListIndex === null && fieldsLength === null) isFormFieldDrodpdownVisibile = true;
    } else isFormFieldDrodpdownVisibile = false;
  }
  const [positionObject, setDropdownPosition] = useState({ top: 0, left: 0 });
  const { getInputId, showOnlyNewFormFieldsDropdown, className, buttonClassName } =
    props;

  // add action props
  const {
    isCustomDropdownList,
    customDropdownList,
    addActionsDropdownVisibilityData,
    setAddActionsDropdownVisibility,
    showAddForm,
    fieldList,
    blackListedFields,
  } = props;

  const [referencePopperElement, setReferencePopperElement] = useState(null);
  const [isAddNewField, setIsAddNewField] = useState(true);

  useEffect(() => {
    let newField = null;
    if (!jsUtils.isEmpty(fieldList)) {
      newField = fieldList.some((fieldJson) => fieldJson.fields.some(
        (eachField) => eachField.isConfigPopupOpen === true,
      ));
    }

    if (newField) {
      setIsAddNewField(false);
    } else {
      setIsAddNewField(true);
    }
  }, [fieldList]);

  const onAddFieldClickHandler = async () => {
    let sectionValidateDone = false;
    console.log('setErrorList Task validate', sectionDetails);
    let errorSectionDetailsValidate = {};
    if (sectionDetails) {
      errorSectionDetailsValidate = validate(
        { section_name: sectionDetails.section_name },
        sectionTitleValidateSchema,
      );
    }
    if (!jsUtils.isEmpty(errorSectionDetailsValidate)) {
      showToastPopover(
        errorSectionDetailsValidate.section_name,
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    } else {
      sectionValidateDone = true;
    }
    if (isAddNewField && sectionValidateDone) {
      if (isCustomDropdownList) {
        setAddActionsDropdownVisibility({
          ...addActionsDropdownVisibilityData,
          isVisible: !addActionsDropdownVisibilityData.isVisible,
        });
      } else {
        setAddFormFieldsDropdownVisibility({
          ...addFormFieldsDropdownVisibilityData,
          isVisible: !isVisible,
          sectionIndex,
          stepIndex: stepIndex,
          fieldsLength,
          fieldListIndex,
        });
      }
    }
  };

  const onHeaderClick = (e) => {
    setDropdownPosition({ top: e.pageY, left: e.pageX });
    setAddFormFieldsDropdownVisibility({
      ...addFormFieldsDropdownVisibilityData,
      isVisible: !isVisible,
      sectionIndex,
      stepIndex: stepIndex,
    });
  };

  const hidePopups = () => {
    if (isCustomDropdownList) {
      setAddActionsDropdownVisibility({
        ...addActionsDropdownVisibilityData,
        isVisible: false,
      });
    } else setAddFormFieldsDropdownVisibility(false);
  };

  const onDropdownFieldClick = (id) => {
    getInputId(id);
    hidePopups();
  };

  const onDropdownBlur = () => {
    if (isCustomDropdownList) {
      if (addActionsDropdownVisibilityData.isVisible) {
        setAddActionsDropdownVisibility({
          ...addActionsDropdownVisibilityData,
          isVisible: false,
        });
      }
    } else {
      if (isVisible) {
        if (clearAddFormFieldsDropdownData) clearAddFormFieldsDropdownData();
        else {
          setAddFormFieldsDropdownVisibility({
            ...addFormFieldsDropdownVisibilityData,
            isVisible: false,
          });
        }
      }
    }
  };

  // temporarily commented for 28.07.2021 release
  // const contextFieldSuggestions = null;
  // if (
  //   parentModuleType === FORM_PARENT_MODULE_TYPES.FLOW && sectionIndex === sectionsLength - 1
  // ) {
  //   contextFieldSuggestions = (
  //     <ContextFieldSuggestions getInputId={getInputId} />
  //   );
  // }

  return (
    <>
      {console.log('showAddForm', showAddForm)}
      {showAddForm ? (
        <div className={cx(BS.D_FLEX, className)}>
          {isCustomDropdownList ? (
            <AddNewBoxedButton
              type={ADD_NEW_BOXED_BUTTON_TYPE.TYPE_2}
              className={cx(styles.AddActionButtonContainer)}
              onClickHandler={onAddFieldClickHandler}
              parentRef={setReferencePopperElement}
            />
          ) : (
            <>
              <button
                id="add_form_field"
                className={cx(
                  styles.Container,
                  gClasses.CenterVH,
                  gClasses.ClickableElement,
                  gClasses.CursorPointer,
                  buttonClassName,
                  BS.H100,
                )}
                type={INPUT_TYPES.buttonType}
                onClick={onAddFieldClickHandler}
                // ref={setReferencePopperElement}
                onKeyDown={(e) => (e.shiftKey && e.key === KEY_NAMES.TAB) && onDropdownBlur()}
              >
                {/* <div
                  className={cx(styles.CircularBadge, gClasses.FlexShrink0)}
                > */}
                {/* </div> */}
                <div className={cx(gClasses.FlexGrow1, gClasses.CenterVH)}>
                  <div
                    className={cx(
                      gClasses.FTwo13,
                      gClasses.FontWeight500,
                      gClasses.CenterVH,
                    )}
                    style={{ color: buttonColor }}
                    ref={setReferencePopperElement}
                  >
                    <AddIcon role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.ADD} ariaHidden className={cx(styles.AddIcon, gClasses.CenterVH)} />
                    {t(FORM_STRINGS.ADD_FORM_FIELDS)}
                  </div>
                </div>
                {/* <div
                  className={cx(gClasses.DropdownArrow, gClasses.ML5)}
                  style={{
                    borderTopColor: buttonColor,
                  }}
                /> */}
              </button>
              {/* {!showOnlyNewFormFieldsDropdown && (
                <button
                  className={cx(
                    gClasses.CenterVH,
                    styles.Container,
                    buttonClassName,
                    gClasses.ClickableElement,
                    gClasses.CursorPointer,
                  )}
                  onClick={() => onSourceSelect(sectionIndex)}
                >
                  <div
                    className={cx(styles.FormSourceCircle, gClasses.CenterVH)}
                  >
                    <ImportIcon1
                      className={styles.CopyImportIcon}
                      isButtonColor
                    />
                  </div>
                  <div className={gClasses.ML20}>
                    <div
                      className={cx(
                        gClasses.LetterSpacingV3,
                        gClasses.FontWeight500,
                        gClasses.FTwo12,
                      )}
                      style={{ color: buttonColor }}
                    >
                      {FORM_STRINGS.IMPORT_FORM_FILEDS_TITLE}
                    </div>
                  </div>
                </button>
              )} */}
            </>
          )}
          <AutoPositioningPopper
            className={cx(
              gClasses.ZIndex7,
              !showOnlyNewFormFieldsDropdown && BS.D_FLEX,
              popoverCommonClassName,
            )}
            referenceElement={referencePopperElement}
            fixedStrategy
            placement={
              isCustomDropdownList
                ? POPPER_PLACEMENTS.AUTO
                : POPPER_PLACEMENTS.TOP_START
            }
            allowedAutoPlacements={
              isCustomDropdownList
                ? [POPPER_PLACEMENTS.TOP, POPPER_PLACEMENTS.BOTTOM]
                : undefined
            }
            fallbackPlacements={
              isCustomDropdownList
                ? undefined
                : isTaskForm ? [POPPER_PLACEMENTS.BOTTOM_START] :
                  [POPPER_PLACEMENTS.BOTTOM_START, POPPER_PLACEMENTS.RIGHT, POPPER_PLACEMENTS.LEFT]
            }
            isPopperOpen={
              isCustomDropdownList
                ? addActionsDropdownVisibilityData.isVisible
                : isVisible &&
                  isFormFieldDrodpdownVisibile
            }
            enableOnBlur
            onBlur={onDropdownBlur}
            onPopperBlur={(e) => e.relatedTarget && !e.currentTarget.contains(e.relatedTarget) && onDropdownBlur()}
            topStartPlacementClasses={cx(
              !showOnlyNewFormFieldsDropdown && BS.AI_END,
            )}
            style={
              isCustomDropdownList
                ? {
                  marginTop: '-75px',
                  marginBottom: '-45px',
                }
                : {
                  marginTop: '10px',
                  marginBottom: '-50px',
                  marginLeft: '-10px',
                }
            }
          >
            <FormFieldsDropdown
              isDropdownVisible
              getInputId={onDropdownFieldClick}
              positionObject={positionObject}
              addExistingFieldsDropdownHandler={
                addExistingFieldsDropdownHandler
              }
              onSelectExistingFieldHandler={onSelectExistingFieldHandler}
              addFormFieldsDropdownId={addFormFieldsDropdownId}
              onHeaderClick={onHeaderClick}
              showOnlyNewFormFieldsDropdown
              allFieldsDetails={existingFieldsData}
              sectionIndex={sectionIndex}
              blackListFields={blackListedFields}
              isCustomDropdownList={isCustomDropdownList}
              customDropdownList={customDropdownList}
            />
          </AutoPositioningPopper>
        </div>
      ) : null}
    </>
  );
}

export default AddFormFields;

AddFormFields.defaultProps = {
  getInputId: null,
  showOnlyNewFormFieldsDropdown: false,
  showAddForm: true,
};

AddFormFields.propTypes = {
  getInputId: PropTypes.func,
  showOnlyNewFormFieldsDropdown: PropTypes.bool,
  showAddForm: PropTypes.bool,
};
