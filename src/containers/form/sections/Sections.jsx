import React, { useState } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { ETextSize, Text, EToastType, EToastPosition, toastPopOver } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Section from './section/Section';
import PlusIconNew from '../../../assets/icons/PlusIconV2';
import { ARIA_ROLES } from '../../../utils/UIConstants';
import styles from './section/Section.module.scss';
import jsUtility, { cloneDeep, isEmpty } from '../../../utils/jsUtility';
import { FORM_ACTIONS, FORM_TYPE, SECTION_STRINGS } from '../Form.string';
import ImportForm from '../import_form/ImportForm';
import { COLUMN_LAYOUT } from './form_layout/FormLayout.string';
import { deleteSectionApiThunk, saveFormContent, saveSectionApiThunk, sectionOrderApiThunk } from '../../../redux/actions/Form.Action';
import { REQUEST_FIELD_KEYS, REQUEST_SAVE_SECTION } from '../../../utils/constants/form/form.constant';
import { getNewRowWithColumns } from '../layout/Layout.utils';
import { MODULE_TYPES } from '../../../utils/Constants';
import { LAYOUT_INITAIL_ORDER } from '../layout/Layout.constant';
import { getModuleIdByModuleType } from '../Form.utils';
import { constructSaveFormContentData } from './sections.utils';
import { IMPORT_TYPES } from '../import_form/ImportForm.strings';
import { validate } from '../../../utils/UtilityFunctions';
import { SectionNameValidationSchema } from './section/SectionNameValidation.schema';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function Sections(props) {
  const {
    // Common
    metaData,
    formType,
    sections,
    fields,
    formVisibility,
    dispatch,

    // Edit
    onFieldDataChange,

    // Creation, Edit
    validationMessage,
    onDropHandler,

    // Edit, ReadOnly
    formData,
    informationFieldFormContent,
    documentDetails,
    moduleType = MODULE_TYPES.FLOW,
    dataListAuditfields,
    userProfileData,
    showAllFields,
    isAuditView = false,
    disableVisibilityForReadOnlyForm = false,
  } = props;

  const { t } = useTranslation();
  const { SECTION } = SECTION_STRINGS(t);
  const [isImportForm, setIsImportForm] = useState(false);
  const [showSectionName, setShowSectionName] = useState(metaData?.showSectionName || false);
  const [sectionsNameError, setSectionsNameError] = useState({});
  const [dependencyData, setDependencyData] = useState({});
  const sortSectionByOrder = (clonedSections) => clonedSections.sort((a, b) => (a.section_order > b.section_order) ? 1 : -1);

  const addNewSectionApiCall = async (ishowSectionName = false) => {
    const params = {
      [REQUEST_SAVE_SECTION.FORM_UUID]: metaData.formUUID,
      [REQUEST_SAVE_SECTION.SECTION_ORDER]: sections.length + 1,
      ...getModuleIdByModuleType(metaData, moduleType),
      [REQUEST_SAVE_SECTION.IS_SECTION_SHOW_WHEN_RULE]: false,
      [REQUEST_SAVE_SECTION.NO_OF_COLUMNS]: COLUMN_LAYOUT.TWO,
    };
    if (ishowSectionName) params.show_section_name = true;
    const row = getNewRowWithColumns(COLUMN_LAYOUT.TWO);
    row.order = LAYOUT_INITAIL_ORDER;
    const newSection = {
      is_section_show_when_rule: false,
      section_name: null,
      section_order: sections.length + 1,
      layout: [row],
      no_of_columns: COLUMN_LAYOUT.TWO,
    };
    if (moduleType === MODULE_TYPES.SUMMARY) {
      delete params.data_list_id;
      delete params.flow_id;
      delete params.dashboard_id;
    }
    const responseData = await saveSectionApiThunk(params, moduleType);
    const { sectionUUID } = responseData;
    newSection[REQUEST_FIELD_KEYS.SECTION_UUID] = sectionUUID;
    const formContentData = constructSaveFormContentData(newSection, metaData, moduleType);
    if (moduleType === MODULE_TYPES.SUMMARY) {
      delete formContentData.data_list_id;
      delete formContentData.flow_id;
      delete formContentData.dashboard_id;
    }
    const isLayoutAddedSuccess = await saveFormContent(formContentData, moduleType);
    if (isLayoutAddedSuccess) {
      dispatch(FORM_ACTIONS.ADD_SECTION, { sectionData: newSection });
    }
  };

  const onSectionMoveDownHandler = (order) => {
    if (order !== sections.length) {
      const clonedSections = sortSectionByOrder(jsUtility.cloneDeep(sections));
      clonedSections[order].section_order -= 1;
      clonedSections[order - 1].section_order += 1;

      const section_details = [];
      clonedSections.forEach((section) => {
        section_details.push({
          order: section.section_order,
          [REQUEST_FIELD_KEYS.SECTION_UUID]: section.section_uuid,
        });
      });
      const params = {
        ...getModuleIdByModuleType(metaData, moduleType),
        section_details,
      };
      if (moduleType === MODULE_TYPES.SUMMARY) {
        delete params.data_list_id;
        delete params.flow_id;
        delete params.dashboard_id;
      }
      sectionOrderApiThunk(params, moduleType, () => {
        dispatch(FORM_ACTIONS.UPDATE_SECTIONS, { sections: sortSectionByOrder(clonedSections) });
      });
    }
  };

  const onSectionMoveUpHandler = (order) => {
    if (order > 1) {
      const clonedSections = sortSectionByOrder(jsUtility.cloneDeep(sections));
      clonedSections[order - 2].section_order += 1;
      clonedSections[order - 1].section_order -= 1;

      const section_details = [];
      clonedSections.forEach((section) => {
        section_details.push({
          order: section.section_order,
          [REQUEST_FIELD_KEYS.SECTION_UUID]: section.section_uuid,
        });
      });
      const params = {
        ...getModuleIdByModuleType(metaData, moduleType),
        section_details,
      };
      if (moduleType === MODULE_TYPES.SUMMARY) {
        delete params.data_list_id;
        delete params.flow_id;
        delete params.dashboard_id;
      }
      sectionOrderApiThunk(params, moduleType, () => {
        dispatch(FORM_ACTIONS.UPDATE_SECTIONS, { sections: sortSectionByOrder(clonedSections) });
      });
    }
  };

  const onAddSectionClickHandler = async () => {
    setShowSectionName(true);
    addNewSectionApiCall(true);
  };

  const onImportSectionClickHandler = () => {
    const emptySectionNameIndexArr = [];
    sections.forEach((s) => jsUtility.isEmpty(s.section_name) ? emptySectionNameIndexArr.push(s.section_uuid) : null);

    const errors = {};
    sections.forEach((section) => {
      const errorList = validate({ section_name: section.section_name }, SectionNameValidationSchema(t));
      if (!jsUtility.isEmpty(errorList)) {
        errors[section.section_uuid] = errorList.section_name;
      }
    });

    if (!jsUtility.isEmpty(errors)) {
      toastPopOver({
        title: SECTION.SECTION_NAME_ERROR,
        toastType: EToastType.error,
      });
      setSectionsNameError(errors);
      return;
    }
    setIsImportForm(true);
  };

  const importSection = (allSections, fields, showSectionName = false) => {
    setShowSectionName(showSectionName);
    dispatch(FORM_ACTIONS.BULK_UPLOAD_FIELDS, { fields });
    dispatch(FORM_ACTIONS.UPDATE_SECTIONS, { sections: allSections });
  };

  const onDeleteSectionHandler = async (sectionUUID, skipDependency = false) => {
    const params = {
      ...getModuleIdByModuleType(metaData, moduleType),
      form_uuid: metaData.formUUID,
      [REQUEST_FIELD_KEYS.SECTION_UUID]: sectionUUID,
    };
    if (skipDependency) params.skip_dependency = true;
    if (moduleType === MODULE_TYPES.SUMMARY) {
      delete params.skip_dependency;
      delete params.data_list_id;
      delete params.flow_id;
      delete params.dashboard_id;
    }
    const response = await deleteSectionApiThunk(params, moduleType, () => {
      toastPopOver({
        title: 'Section Deleted Successfully',
        toastType: EToastType.info,
        toastPosition: EToastPosition.BOTTOM_LEFT,
      });
      dispatch(FORM_ACTIONS.DELETE_SECTION, { sectionUUID });
    });
    const error_type = response?.[0]?.type || EMPTY_STRING;
    setDependencyData({});
    if (!isEmpty(response)) {
      if (error_type === 'field_dependency') {
        setDependencyData(response);
      }
    }
  };

  const onColumnLayoutChangeHandler = (sectionUUID, column, updatedLayout) => {
     dispatch(
      FORM_ACTIONS.UPDATE_SECTION,
      {
        sectionUUID: sectionUUID,
        sectionData: {
          no_of_columns: Number(column),
          layout: updatedLayout,
        },
      },
    );
  };

  const getAddSection = () => {
     if (formType !== FORM_TYPE.CREATION_FORM) return null;
     return (
      <div className={cx(gClasses.CenterH, gClasses.PX24, gClasses.PB12)}>
      <div className={styles.Lines} />
      <button
        className={cx(gClasses.CenterV, styles.AddSectionButton)}
        onClick={onAddSectionClickHandler}
      >
        <PlusIconNew
          className={cx(gClasses.MR8, styles.PlusIcon)}
          role={ARIA_ROLES.IMG}
        />
        <Text
          size={ETextSize.MD}
          content={SECTION.ADD_SECTION}
          className={styles.ButtonText}
        />
      </button>
      {moduleType === MODULE_TYPES.FLOW && !metaData.isInitiation &&
        <button
          className={cx(gClasses.CenterV, styles.AddSectionButton)}
          onClick={onImportSectionClickHandler}
        >
          <PlusIconNew
            className={cx(gClasses.MR8, styles.PlusIcon)}
            role={ARIA_ROLES.IMG}
          />
          <Text
            size={ETextSize.MD}
            content={SECTION.IMPORT_SECTION}
            className={styles.ButtonText}
          />
        </button>
      }
      <div className={styles.Lines} />
      </div>
     );
  };

  const clonedMetaData = cloneDeep({ ...metaData, showSectionName: showSectionName });
  const getImportForm = () => {
    if (!isImportForm) return null;
    return (
      <ImportForm
          allFields={fields}
          metaData={clonedMetaData}
          moduleType={moduleType}
          onCloseClick={() => setIsImportForm(false)}
          dispatch={dispatch}
          isImportSection
          onSuccess={importSection}
          sections={sections}
          // cols={COLUMN_LAYOUT.TWO}
          type={IMPORT_TYPES.SECTION}
      />
    );
  };

  return (
    <div className={cx(styles.AllSectionsContainer, ((formType !== FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.P16), (formType === FORM_TYPE.EDITABLE_FORM && styles.Padding24))}>
      {(sortSectionByOrder(jsUtility.cloneDeep(sections)) || []).map((section) => (
        <Section
          metaData={clonedMetaData}
          key={section[REQUEST_FIELD_KEYS.SECTION_UUID]}
          formType={formType}
          formData={formData}
          informationFieldFormContent={informationFieldFormContent}
          documentDetails={documentDetails}
          formVisibility={formVisibility}
          section={section}
          sections={sections}
          fields={fields}
          validationMessage={validationMessage}
          onSectionMoveDownHandler={() =>
            onSectionMoveDownHandler(section.section_order)
          }
          onSectionMoveUpHandler={() =>
            onSectionMoveUpHandler(section.section_order)
          }
          onDeleteSectionHandler={(skipDependency = false) =>
            onDeleteSectionHandler(section[REQUEST_FIELD_KEYS.SECTION_UUID], skipDependency)
          }
          onColumnLayoutChange={onColumnLayoutChangeHandler}
          onFieldDataChange={onFieldDataChange}
          dispatch={dispatch}
          hideSectionHeader={!showSectionName && sections.length <= 1}
          isLastSection={sections.length === 1}
          onDropHandler={onDropHandler}
          moduleType={moduleType}
          dataListAuditfields={dataListAuditfields}
          userProfileData={userProfileData}
          sectionNameError={sectionsNameError[section.section_uuid]}
          setSectionNameError={setSectionsNameError}
          showAllFields={showAllFields}
          isAuditView={isAuditView}
          dependencyData={dependencyData}
          setDependencyData={setDependencyData}
          setShowSectionName={setShowSectionName}
          disableVisibilityForReadOnlyForm={disableVisibilityForReadOnlyForm}
        />
      ))}
      {getAddSection()}
      {getImportForm()}
    </div>
  );
  }

  export default Sections;

  Sections.propTypes = {
    metaData: PropTypes.object,
    formType: PropTypes.string,
    sections: PropTypes.array,
    fields: PropTypes.object,
    formVisibility: PropTypes.object,
    dispatch: PropTypes.func,
    onFieldDataChange: PropTypes.func,
    validationMessage: PropTypes.object,
    onDropHandler: PropTypes.func,
    formData: PropTypes.object,
    informationFieldFormContent: PropTypes.object,
    documentDetails: PropTypes.object,
    moduleType: PropTypes.string,
    dataListAuditfields: PropTypes.object,
    userProfileData: PropTypes.object,
    showAllFields: PropTypes.bool,
    isAuditView: PropTypes.bool,
    disableVisibilityForReadOnlyForm: PropTypes.bool,
  };
