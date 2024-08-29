import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonContentVaraint,
  EButtonType,
  ETitleHeadingLevel,
  ETitleSize,
  Label,
  Modal,
  SegmentedControl,
  Text,
  TextInput,
  Title,
  Variant,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import CloseIcon from '../../../../../assets/icons/CloseIcon';
import DASHBOARD_CONFIG_STRINGS from '../../DashboardConfig.strings';
import styles from '../ConfigPanel.module.scss';
import jsUtility from '../../../../../utils/jsUtility';
import { FIELD_LIST_OBJECT } from '../../../../form/sections/field_configuration/basic_configuration/BasicConfiguration.constants';
import { validate } from '../../../../../utils/UtilityFunctions';
import { tableColumnConfigValidationSchema } from '../../DashboardConfig.validation.schema';

function TableColumnConfig(props) {
  const {
    fieldIndex,
    selectedField,
    setSelectedField,
    fieldList,
    onClose,
    setErrorList,
    errorList,
    onSave,
  } = props;
  const { t } = useTranslation();
  const [fieldData, setFieldData] = useState(selectedField[fieldIndex]);
  const {
    CONFIG_PANEL: {
      TABLE_COLUMN_CONFIG: { TITLE, GENERAL, BUTTONS },
    },
  } = DASHBOARD_CONFIG_STRINGS(t);

  const selectedFieldData = fieldList.find(
    (data) => data._id === fieldData.field,
  );

  const headerContent = (
    <>
      <Title
        content={TITLE}
        headingLevel={ETitleHeadingLevel.h2}
        size={ETitleSize.small}
      />
      <button onClick={onClose}>
        <CloseIcon className={styles.CloseModelIcon} />
      </button>
    </>
  );

  const onChangeLabel = (event) => {
    const { value } = event.target;
    setFieldData((prevData) => {
      return { ...prevData, label: value };
    });
    const cloneErrorList = jsUtility.cloneDeep(errorList);
    delete cloneErrorList[GENERAL.COLUMN_DETAILS.LABEL.ID];
    setErrorList(cloneErrorList);
  };

  const onChangeColumnWidth = (_event, value) => {
    if (value !== fieldData.width) {
      setFieldData((prevData) => {
        return { ...prevData, width: value };
      });
      const cloneErrorList = jsUtility.cloneDeep(errorList);
      delete cloneErrorList?.width;
      setErrorList(cloneErrorList);
    }
  };

  const getMainContent = () => (
    <div>
      <div
        className={cx(
          gClasses.DisplayFlex,
          gClasses.FlexDirectionCol,
          gClasses.gap12,
          gClasses.MB24,
        )}
      >
        <Title
          content={GENERAL.COLUMN_DETAILS.TITLE}
          headingLevel={ETitleHeadingLevel.h3}
          size={ETitleSize.xs}
        />
        <div id={GENERAL.COLUMN_DETAILS.SOURCE_FIELD.ID}>
          <Label labelName={GENERAL.COLUMN_DETAILS.SOURCE_FIELD.LABEL} />
          <Text
            content={`${selectedFieldData?.field_name} (${
              FIELD_LIST_OBJECT(t)?.[selectedFieldData?.field_type]
            })`}
          />
        </div>
        <TextInput
          id={GENERAL.COLUMN_DETAILS.LABEL.ID}
          labelText={GENERAL.COLUMN_DETAILS.LABEL.LABEL}
          value={fieldData.label}
          onChange={onChangeLabel}
          required
          errorMessage={errorList && errorList[GENERAL.COLUMN_DETAILS.LABEL.ID]}
          className={gClasses.W50}
        />
      </div>
      <div>
        <Title
          content={GENERAL.COLUMN_WIDTH.TITLE}
          headingLevel={ETitleHeadingLevel.h3}
          size={ETitleSize.xs}
          className={gClasses.MB12}
        />
        <SegmentedControl
          id={GENERAL.COLUMN_WIDTH.ID}
          options={GENERAL.COLUMN_WIDTH.OPTIONS}
          buttonContentVariant={ButtonContentVaraint.text}
          variant={Variant.border}
          selectedValue={fieldData.width}
          onClick={onChangeColumnWidth}
          errorMessage={errorList?.width}
        />
      </div>
    </div>
  );

  const onSaveTableColumnConfig = () => {
    const errors = validate(fieldData, tableColumnConfigValidationSchema(t));
    if (jsUtility.isEmpty(errors)) {
      const cloneSelectedField = jsUtility.cloneDeep(selectedField);
      cloneSelectedField.splice(fieldIndex, 1);
      cloneSelectedField.splice(fieldIndex, 0, fieldData);
      setSelectedField(cloneSelectedField);
      onClose();
      onSave({ columnList: cloneSelectedField });
    } else {
      setErrorList({ ...errorList, ...errors });
    }
  };

  const footerContent = (
    <>
      <Button
        buttonText={BUTTONS.CANCEL}
        type={EButtonType.TERTIARY}
        noBorder
        onClickHandler={onClose}
      />
      <Button
        buttonText={BUTTONS.SAVE}
        type={EButtonType.PRIMARY}
        onClickHandler={onSaveTableColumnConfig}
      />
    </>
  );

  return (
    <Modal
      id="table_column_config"
      isModalOpen
      headerContentClassName={cx(
        gClasses.PY24,
        gClasses.PL32,
        gClasses.PR16,
        gClasses.FlexJustifyBetween,
      )}
      headerContent={headerContent}
      mainContentClassName={cx(
        gClasses.PL32,
        gClasses.PR32,
        styles.TableColumnConfig,
      )}
      mainContent={getMainContent()}
      footerContentClassName={styles.FooterClassName}
      footerContent={footerContent}
    />
  );
}

TableColumnConfig.propTypes = {
  fieldIndex: PropTypes.number,
  selectedField: PropTypes.arrayOf(PropTypes.object),
  setSelectedField: PropTypes.func,
  fieldList: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func,
  setErrorList: PropTypes.func,
  errorList: PropTypes.object,
  onSave: PropTypes.func,
};

export default TableColumnConfig;
