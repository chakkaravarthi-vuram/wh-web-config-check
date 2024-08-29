import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import {
  ETitleHeadingLevel,
  ETitleSize,
  Text,
  Title,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import FilePlusIcon from 'assets/icons/FilePlusIcon';
import AccordionWithState from 'components/accordion/accordion_with_state/AccordionWithState';
import ADDED_FIELD_STRING from './AddedField.strings';
import { FIELD_LIST } from '../../sections/field_configuration/basic_configuration/BasicConfiguration.constants';
import DraggableField from './draggable_field/DraggableField';
import { RESPONSE_FIELD_KEYS } from '../../../../utils/constants/form/form.constant';
import styles from './AddedField.module.scss';
import ExternalSource from '../../external_source_data/ExternalSource';
import DeleteConfirmModal from '../../../../components/delete_confirm_modal/DeleteConfirmModal';
import { ADD_DATA_SOURCE_STRINGS } from '../../../form_configuration/add_data_from_another_source/AddDataFromAnotherSource.strings';
import { useExternalSource, externalSourceDataChange, INITIAL_STATE } from '../../external_source_data/useExternalSource';
import { deleteDataRule } from '../../external_source_data/useExternalSource.action';
import RuleEditIcon from '../../../../assets/icons/RuleEditIcon';
import Trash from '../../../../assets/icons/application/Trash';
import DependencyHandler from '../../../../components/dependency_handler/DependencyHandler';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { getExternalRulesThunk } from '../../../../redux/actions/IndividualEntry.Action';
import { VALUE_CONFIG_TYPE } from '../../../shared_container/individual_entry/summary_builder/Summary.constants';

function AddedField(props) {
  const { metaData, moduleType } = props;
  const { t } = useTranslation();
  const [externalSourceModal, setExternalSourceModal] = useState(false);
  const [selectedExternalRule, setSelectedExternalRule] = useState({});
  const [deleteRuleUUID, setDeleteRuleUUID] = useState();
  const dispatch = useDispatch();
  const { dataFields, systemFields, externalRules } = useSelector(
    (s) => s.IndividualEntryReducer.pageBuilder,
  );
  const { state, dispatch: externalDispatch } = useExternalSource();
  const {
    dependencyData,
    dependencyName,
    showFieldDependencyDialog = {},
  } = state;

  const onExternalSourceClose = () => {
    if (metaData.pageId) dispatch(getExternalRulesThunk(metaData.pageId));
    setExternalSourceModal(false);
    setSelectedExternalRule({});
    setDeleteRuleUUID(null);
    externalDispatch(
      externalSourceDataChange({
        ...INITIAL_STATE,
      }),
    );
  };

  const dependencyConfigCloseHandler = () => {
    externalDispatch(
      externalSourceDataChange({
        dependencyData: {},
        dependencyType: EMPTY_STRING,
        dependencyName: EMPTY_STRING,
        showFieldDependencyDialog: {},
      }),
    );
    onExternalSourceClose();
  };

  const getDeleteRuleModal = () => {
    if (!deleteRuleUUID) return null;

    const onDeleteRule = () => {
      const postData = {
        rule_uuid: deleteRuleUUID,
        page_id: metaData.pageId,
      };

      deleteDataRule({
        data: postData,
        dispatch: externalDispatch,
        callback: onExternalSourceClose,
        t,
      });
    };

    return (
      <DeleteConfirmModal
        title={ADD_DATA_SOURCE_STRINGS.DELETE.TITLE}
        subText1={ADD_DATA_SOURCE_STRINGS.DELETE.SUB_TITLE}
        isModalOpen
        onCancel={() => setDeleteRuleUUID(null)}
        onClose={() => setDeleteRuleUUID(null)}
        onDelete={onDeleteRule}
      />
    );
  };

  const getSourceTypeAddedField = (field, sourceType) => {
    return {
      ...field,
      [RESPONSE_FIELD_KEYS.FIELD_SOURCE_TYPE]: sourceType,
    };
  };

  return (
    <div className={styles.MainAddedField}>
      <div className={cx(gClasses.ScrollYOnHover, styles.AddedFieldConfig)}>
        {/* External Source Field */}
        <AccordionWithState
          headerContent={
            <Title
              content={ADDED_FIELD_STRING(t).FIELD_FROM_OTHER_SOURCE}
              headingLevel={ETitleHeadingLevel.h6}
              size={ETitleSize.xs}
              className={gClasses.FS13}
            />
          }
          isDefaultOpen
          className={styles.AccordionClassName}
          headerContentClassName={styles.FieldHeader}
        >
          <div
            className={cx(
              gClasses.MB16,
              gClasses.DisplayFlex,
              gClasses.FlexDirectionColumn,
              gClasses.Gap8,
            )}
          >
            {externalRules.map((source) => (
              <AccordionWithState
                key={source.id}
                headerClassName={cx(styles.ExternalAccordionHeader)}
                headerContentClassName={styles.ExternalAccordionHeaderContent}
                headerContent={
                  <div
                    key={source.ruleUUID}
                    id={source.ruleUUID}
                    className={cx(gClasses.CenterVSpaceBetween)}
                  >
                    <Text
                      content={source.ruleName}
                      className={cx(styles.ExternalRuleName, gClasses.Ellipsis)}
                      title={source.ruleName}
                    />
                    <div
                      className={cx(
                        gClasses.ML10,
                        gClasses.CenterVH,
                        gClasses.MR4,
                      )}
                    >
                      <RuleEditIcon
                        onClick={() => {
                          setSelectedExternalRule(source);
                          setExternalSourceModal(true);
                        }}
                        className={cx(gClasses.CursorPointer, gClasses.MR8)}
                      />
                      <Trash
                        onClick={() => setDeleteRuleUUID(source.ruleUUID)}
                        className={cx(gClasses.CursorPointer)}
                      />
                    </div>
                  </div>
                }
                childrenClassName={gClasses.P5}
              >
                <div className={cx(gClasses.DisplayFlex, gClasses.FlexDirectionCol, gClasses.gap5)}>
                  {source.fields.map((field) => {
                    const { icon, label: fieldTypeName } = FIELD_LIST(t).find(
                      (data) => data.value === field.fieldType,
                    );
                    return (
                      <DraggableField
                        key={field.fieldUUID}
                        fieldData={getSourceTypeAddedField(field, VALUE_CONFIG_TYPE.EXTERNAL_DATA)}
                        icon={icon}
                        fieldTypeName={fieldTypeName}
                      />
                    );
                  })}
                </div>
              </AccordionWithState>
            ))}
          </div>

          <div className={cx(gClasses.DFlexCenter, gClasses.Gap16)}>
            <button
              className={cx(
                styles.PageFieldButton,
                gClasses.FlexGrow1,
                gClasses.PX12,
                gClasses.PY8,
                gClasses.Gap8,
              )}
              onClick={() => setExternalSourceModal(true)}
            >
              <FilePlusIcon />
              <span>{ADDED_FIELD_STRING(t).ADD}</span>
            </button>
          </div>
        </AccordionWithState>

        {/* User Field */}
        <AccordionWithState
          headerContent={
            <Title
              content={ADDED_FIELD_STRING(t).USER_FIELDS}
              headingLevel={ETitleHeadingLevel.h6}
              size={ETitleSize.xs}
              className={gClasses.FS13}
            />
          }
          isDefaultOpen
          className={styles.AccordionClassName}
          headerContentClassName={styles.FieldHeader}
          childrenClassName={cx(
            gClasses.MB16,
            gClasses.DisplayFlex,
            gClasses.FlexDirectionColumn,
            gClasses.Gap8,
          )}
        >
          {dataFields.map((field) => {
            const { icon, label: fieldTypeName } = FIELD_LIST(t).find(
              (data) => data.value === field[RESPONSE_FIELD_KEYS.FIELD_TYPE],
            );
            return (
              <DraggableField
                key={field[RESPONSE_FIELD_KEYS.FIELD_UUID]}
                fieldData={getSourceTypeAddedField(field, VALUE_CONFIG_TYPE.USER_DEFINED_FIELD)}
                icon={icon}
                fieldTypeName={fieldTypeName}
              />
            );
          })}
        </AccordionWithState>

        {/* System Field */}
        <AccordionWithState
          headerContent={
            <Title
              content={ADDED_FIELD_STRING(t).SYSTEM_FIELDS}
              headingLevel={ETitleHeadingLevel.h6}
              size={ETitleSize.xs}
              className={gClasses.FS13}
            />
          }
          isDefaultOpen
          className={gClasses.BorderNoneImportant}
          headerContentClassName={styles.FieldHeader}
          childrenClassName={cx(
            gClasses.MB16,
            gClasses.DisplayFlex,
            gClasses.FlexDirectionColumn,
            gClasses.Gap8,
          )}
        >
          {systemFields.map((field) => {
            const { icon, label: fieldTypeName } = FIELD_LIST(t).find(
              (data) => data.value === field[RESPONSE_FIELD_KEYS.FIELD_TYPE],
            );
            return (
              <DraggableField
                key={field[RESPONSE_FIELD_KEYS.FIELD_UUID]}
                fieldData={getSourceTypeAddedField(field, VALUE_CONFIG_TYPE.SYSTEM_FIELD)}
                icon={icon}
                fieldTypeName={fieldTypeName}
              />
            );
          })}
        </AccordionWithState>
      </div>

      {externalSourceModal && (
        <ExternalSource
          moduleId={metaData.moduleId}
          metaData={metaData}
          moduleType={moduleType}
          ruleId={selectedExternalRule?.id}
          onCloseClick={onExternalSourceClose}
        />
      )}

      {showFieldDependencyDialog?.isVisible && (
        <DependencyHandler
          onCancelDeleteClick={dependencyConfigCloseHandler}
          dependencyHeaderTitle={dependencyName}
          dependencyData={dependencyData}
        />
      )}

      {getDeleteRuleModal()}
    </div>
  );
}

export default AddedField;
