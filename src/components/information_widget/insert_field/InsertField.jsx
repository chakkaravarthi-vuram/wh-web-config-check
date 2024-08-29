import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  EButtonType,
  ETextSize,
  Modal,
  ModalSize,
  ModalStyleType,
  RadioGroup,
  Text,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';
import CloseIconV2 from 'assets/icons/CloseIconV2';
import { isEmpty } from 'utils/jsUtility';
import { validate } from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import styles from './InsertField.module.scss';
import { ARIA_ROLES } from '../../../utils/UIConstants';
import { WIDGET_STRINGS } from '../InformationWidget.strings';
import {
  FIELD_IDS,
  FIELD_OPTION_VALUES,
  INSERT_FIELD_INIT,
} from '../InformationWidget.constants';
import { getWidgetFieldHtml } from '../InformationWidget.utils';
import { getInsertFieldSchema } from './InsertField.validation.schema';
import { cloneDeep, emptyFunction, emptyRef } from '../../../utils/jsUtility';
import FieldPicker from '../../field_picker/FieldPicker';
import { FEILD_LIST_DROPDOWN_TYPE, getGroupedFieldListForMapping } from '../../../containers/edit_flow/step_configuration/StepConfiguration.utils';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function InsertField(props) {
  const [selectedField, setSelectedField] = useState({});
  const [localState, setLocalState] = useState(INSERT_FIELD_INIT);

  const {
    isModalOpen,
    handleModalOpen,
    allFields = [],
    parentEditorRef,
    childRecursiveFields = [],
    isLoading,
  } = props;

  const { t } = useTranslation();

  const { INSERT_FIELD, CANCEL } = WIDGET_STRINGS(t);

  const onCloseClick = () => {
    if (handleModalOpen) handleModalOpen(false);
    setSelectedField({});
    setLocalState(INSERT_FIELD_INIT);
  };

  const onInsertFieldClick = () => {
    const currentErrorList = validate(
      {
        field: selectedField?.field_uuid,
      },
      getInsertFieldSchema(t),
    );

    if (isEmpty(currentErrorList)) {
      const template = getWidgetFieldHtml(selectedField);
      parentEditorRef.current?.insertContent(template);
      onCloseClick();
    } else {
      setLocalState({
        ...localState,
        [FIELD_IDS.ERROR_LIST]: currentErrorList,
      });
    }
  };

  const handleChangeHandler = (event) => {
    const {
      target: { value },
    } = event;

    const fieldList =
      localState?.chooseFieldType === FIELD_OPTION_VALUES.FIELD_TYPE_DIRECT
        ? allFields
        : childRecursiveFields;

    const selectedField = fieldList?.find(
      (field) => field?.field_uuid === value,
    );
    setSelectedField(selectedField);
    setLocalState({
      ...localState,
      [FIELD_IDS.ERROR_LIST]: {},
    });
  };

  const onRadioChangeHandler = (_event, id, value) => {
    setLocalState({
      ...localState,
      [id]: value,
    });
    setSelectedField({});
  };

  const allFieldsFormatted = getGroupedFieldListForMapping(
    null,
    allFields,
    EMPTY_STRING,
    FEILD_LIST_DROPDOWN_TYPE.DIRECT,
    t,
    [],
  );

  const childFieldsFormatted = getGroupedFieldListForMapping(
    null,
    childRecursiveFields,
    EMPTY_STRING,
    FEILD_LIST_DROPDOWN_TYPE.ALL_TABLE_FIELDS,
    t,
    [],
  );

  return (
    <Modal
      id={FIELD_IDS.INSERT_FIELD_MODAL}
      isModalOpen={isModalOpen}
      modalStyle={ModalStyleType.dialog}
      modalSize={ModalSize.lg}
      headerContent={
        <div className={cx(gClasses.CenterVSpaceBetween, styles.HeaderContent)}>
          <Text
            size={ETextSize.XL}
            className={gClasses.FontWeight500}
            content={INSERT_FIELD.INSERT_TEXT}
          />
          <CloseIconV2
            className={cx(gClasses.CursorPointer)}
            ariaLabel="Close"
            role={ARIA_ROLES.IMG}
            height="16"
            width="16"
            onClick={onCloseClick}
          />
        </div>
      }
      mainContentClassName={styles.EventDetailsContent}
      mainContent={
        <div className={styles.InsertFieldCardContainer}>
          {!isEmpty(childRecursiveFields) && (
            <RadioGroup
              id={INSERT_FIELD.CHOOSE_FIELD_TYPE.ID}
              labelText={INSERT_FIELD.CHOOSE_FIELD_TYPE.LABEL}
              selectedValue={localState?.chooseFieldType}
              options={INSERT_FIELD.CHOOSE_FIELD_TYPE.OPTIONS}
              onChange={onRadioChangeHandler}
              className={gClasses.MB16}
              labelClassName={styles.LabelClassName}
            />
          )}

          <div className={styles.InsertFieldDropdown}>
            {localState?.chooseFieldType ===
            FIELD_OPTION_VALUES.FIELD_TYPE_DIRECT ? (
              <FieldPicker
                isExactPopperWidth
                optionList={cloneDeep(allFieldsFormatted)}
                onChange={handleChangeHandler}
                errorMessage={localState?.errorList?.field}
                selectedOption={selectedField}
                outerClassName={gClasses.W100}
                fieldPickerClassName={styles.MappingField}
                isFieldsLoading={isLoading}
                isDataFieldsOnly
                enableSearch
                placeholder={t(INSERT_FIELD.FIELD_DROPDOWN.PLACEHOLDER)}
              />
            ) : (
              <FieldPicker
                isExactPopperWidth
                optionList={cloneDeep(childFieldsFormatted)}
                onChange={handleChangeHandler}
                errorMessage={localState?.errorList?.field}
                selectedOption={selectedField}
                outerClassName={gClasses.W100}
                isFieldsLoading={isLoading}
                isDataFieldsOnly
                enableSearch
              />
            )}
          </div>
        </div>
      }
      footerContent={
        <div className={cx(gClasses.RightH, styles.FooterContent)}>
          <Button
            buttonText={CANCEL}
            type={EButtonType.TERTIARY}
            onClickHandler={onCloseClick}
            className={gClasses.ML16}
          />
          <Button
            buttonText={INSERT_FIELD.INSERT_TEXT}
            type={EButtonType.PRIMARY}
            onClickHandler={onInsertFieldClick}
            className={gClasses.ML16}
          />
        </div>
      }
    />
  );
}

export default InsertField;

InsertField.defaultProps = {
  isModalOpen: false,
  handleModalOpen: emptyFunction,
  allFields: [],
  parentEditorRef: emptyRef,
  childRecursiveFields: [],
  isLoading: false,
};

InsertField.propTypes = {
  isModalOpen: PropTypes.bool,
  handleModalOpen: PropTypes.func,
  allFields: PropTypes.array,
  parentEditorRef: PropTypes.object,
  childRecursiveFields: PropTypes.array,
  isLoading: PropTypes.bool,
};
