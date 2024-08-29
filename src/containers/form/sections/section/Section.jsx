import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import { EPopperPlacements, SingleDropdown, Variant, TextInput, Size, toastPopOver, EToastType } from '@workhall-pvt-lmt/wh-ui-library';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { ARIA_ROLES } from '../../../../utils/UIConstants';
import styles from './Section.module.scss';
import ArrowDownIcon from '../../../../assets/icons/ArrowDownIcon';
import ArrowUpIcon from '../../../../assets/icons/ArrowUpIcon';
import MoreVerticalIcon from '../../../../assets/icons/MoreVerticalIcon';
import { UI_LIB_INPUT_VARIANTS } from '../../../../utils/UILibConstants';
import { FORM_ACTIONS, FORM_TYPE, SECTION_MENU, SECTION_STRINGS } from '../../Form.string';
import { COLUMN_LAYOUT } from '../form_layout/FormLayout.string';
import ImportForm from '../../import_form/ImportForm';
import { isBasicUserMode, validate } from '../../../../utils/UtilityFunctions';
import { SectionNameValidationSchema } from './SectionNameValidation.schema';
import jsUtility, { cloneDeep, get, isEmpty } from '../../../../utils/jsUtility';
import FormLayout from '../form_layout/FormLayout';
import { REQUEST_FIELD_KEYS, REQUEST_SAVE_FORM, REQUEST_SAVE_SECTION } from '../../../../utils/constants/form/form.constant';
import { listDependencyApiThunk, saveSectionApiThunk, updateFormFieldOrder } from '../../../../redux/actions/Form.Action';
import { MODULE_TYPES } from '../../../../utils/Constants';
import { getModuleIdByModuleType } from '../../Form.utils';
import ErrorMessage from '../../../../components/error_message/ErrorMessage';
import { IMPORT_TYPES } from '../../import_form/ImportForm.strings';
import DependencyHandler from '../../../../components/dependency_handler/DependencyHandler';
import { FORM_BUILDER_STRINGS } from '../../../../utils/strings/CommonStrings';
import { FIELD_TYPES } from '../field_configuration/FieldConfiguration.strings';
// import { FIELD_LIST_TYPE } from '../../../../utils/constants/form.constant';
import { LAYOUT_ACTIONS, constructReorderedFieldForMultipleSection } from '../sections.utils';
import { formLayoutUpdator } from '../form_layout/FormLayout.utils';
import { VISIBILITY_TYPES } from '../../form_builder/form_footer/FormFooter.constant';
import { SECTION_CONTAINER_ID } from '../../layout/column_layout/ColumnLayout.utils';

function Section(props) {
  const {
    // Common
    metaData,
    formType,
    dataListAuditfields,
    section,
    sections,
    fields,
    formVisibility,
    dispatch,
    isLastSection,

    // Creation
    hideSectionHeader,
    onSectionMoveDownHandler,
    onSectionMoveUpHandler,
    onDeleteSectionHandler,
    onDropHandler,
    onColumnLayoutChange,
    setShowSectionName,

    // Edit
    onFieldDataChange,

    // Edit, ReadOnly
    formData = {},
    informationFieldFormContent = {},
    documentDetails,
    moduleType = MODULE_TYPES.FLOW,
    validationMessage = {},
    userProfileData,
    sectionNameError,
    setSectionNameError,
    showAllFields,
    isAuditView = false,
    dependencyData,
    setDependencyData,
    disableVisibilityForReadOnlyForm,
  } = props;

  const pref_locale = localStorage.getItem('application_language');
  const sectionLabel = hideSectionHeader ? null : section?.translation_data?.[pref_locale]?.section_name;

const [isImportForm, setIsImportForm] = useState(false);
const reduxDispatch = useDispatch();
const { t } = useTranslation();
const { SECTION } = SECTION_STRINGS(t);
const history = useHistory();
const isNormalMode = isBasicUserMode(history);

  // Handlers
  const onSectionNameValidateHandler = (value) => {
    const errorList = validate({ section_name: value }, SectionNameValidationSchema(t));
    if (!jsUtility.isEmpty(errorList)) {
      setSectionNameError((p) => {
          return { ...p, [section.section_uuid]: errorList.section_name };
        });
    } else {
      setSectionNameError((p) => {
        const prevErrors = cloneDeep(p);
        delete prevErrors[section.section_uuid];
        return prevErrors;
      });
    }
    return errorList;
  };

  const onSectionNameBlurHandler = () => {
    const error = onSectionNameValidateHandler(section?.section_name);
    if (jsUtility.isEmpty(error)) {
      const params = {
        [REQUEST_FIELD_KEYS.FORM_UUID]: metaData.formUUID,
        ...getModuleIdByModuleType(metaData, moduleType),
        [REQUEST_FIELD_KEYS.SECTION_UUID]: section[REQUEST_FIELD_KEYS.SECTION_UUID] || null,
        [REQUEST_SAVE_SECTION.SECTION_ORDER]: section?.section_order,
        [REQUEST_SAVE_SECTION.IS_SECTION_SHOW_WHEN_RULE]: section?.is_section_show_when_rule,
        [REQUEST_SAVE_SECTION.SECTION_NAME]: section?.section_name,
        [REQUEST_SAVE_SECTION.NO_OF_COLUMNS]: section?.no_of_columns,
      };
      if (moduleType === MODULE_TYPES.SUMMARY) {
        delete params.data_list_id;
        delete params.flow_id;
        delete params.dashboard_id;
      }
      saveSectionApiThunk(params, moduleType);
      dispatch(FORM_ACTIONS.UPDATE_SECTION, { sectionUUID: section?.section_uuid, sectionData: { section_name: section?.section_name } });
    }
  };

  const onImportSectionClickHandler = () => {
    const errors = {};
    sections.forEach((section) => {
      const errorList = validate({ section_name: section.section_name }, SectionNameValidationSchema(t));
      if (!jsUtility.isEmpty(errorList)) {
        errors[section.section_uuid] = errorList.section_name;
      }
    });

    if (jsUtility.isEmpty(errors)) setIsImportForm(true);
    else {
        setSectionNameError((p) => {
          return { ...p, ...errors };
        });
        toastPopOver({
        title: SECTION.SECTION_NAME_ERROR,
        toastType: EToastType.error,
      });
    }
  };

  const onLayoutChangeMenuHandler = (value) => {
    if (value) {
      const updatedLayout = formLayoutUpdator(section.layout, section[REQUEST_SAVE_SECTION.NO_OF_COLUMNS], value);
      onColumnLayoutChange(section[REQUEST_FIELD_KEYS.SECTION_UUID], value, cloneDeep(updatedLayout));
      const updatedSection = { ...section, [REQUEST_SAVE_SECTION.NO_OF_COLUMNS]: value, layout: updatedLayout };
      const [, reorderPostData] = constructReorderedFieldForMultipleSection([updatedSection], metaData, moduleType, LAYOUT_ACTIONS.ADD_EXTRA_ROW);
      reduxDispatch(updateFormFieldOrder(reorderPostData, moduleType)).then(() => {
        const params = {
          [REQUEST_FIELD_KEYS.FORM_UUID]: metaData.formUUID,
          ...getModuleIdByModuleType(metaData, moduleType),
          [REQUEST_FIELD_KEYS.SECTION_UUID]: section[REQUEST_FIELD_KEYS.SECTION_UUID] || null,
          [REQUEST_SAVE_SECTION.SECTION_ORDER]: section?.section_order,
          [REQUEST_SAVE_SECTION.IS_SECTION_SHOW_WHEN_RULE]: section?.is_section_show_when_rule,
          [REQUEST_SAVE_SECTION.SECTION_NAME]: section?.section_name,
          [REQUEST_SAVE_SECTION.NO_OF_COLUMNS]: value,
        };
        if (moduleType === MODULE_TYPES.SUMMARY) {
          delete params.data_list_id;
          delete params.flow_id;
          delete params.dashboard_id;
        }
        saveSectionApiThunk(params, moduleType);
      });
    }
  };

  const onDropdownMenuHandler = (value) => {
    if (value !== undefined) {
      switch (value) {
        case FORM_ACTIONS.IMPORT_FORM_FIELD:
          onImportSectionClickHandler();
          break;
        case FORM_ACTIONS.DELETE_SECTION:
          onDeleteSectionHandler?.();
          break;
        default:
          onLayoutChangeMenuHandler(value);
          break;
      }
    }
  };

  // Update section name in reducer
  const updateSectionName = (sectionName) => {
    dispatch(FORM_ACTIONS.UPDATE_SECTION_NAME, { sectionUUID: section?.section_uuid, sectionName: sectionName });
  };
  const getTranslateText = (string) => {
  if (string === 'Basic Details') return t(FORM_BUILDER_STRINGS.DEFAULT_SECTION_NAME);
  else return string;
  };

  // Component Function
  const getSectionHeader = () => (
      <div className={cx(styles.AccordionHeader, gClasses.CenterV, formType !== FORM_TYPE.CREATION_FORM && formType !== FORM_TYPE.READ_ONLY_CREATION_FORM && hideSectionHeader && gClasses.DisplayNone, moduleType === MODULE_TYPES.SUMMARY && !isNormalMode && gClasses.ML10)}>
        {hideSectionHeader ?
          <div /> :
          <TextInput
            className={cx(styles.SectionTitle)}
            inputClassName={formType !== FORM_TYPE.CREATION_FORM && gClasses.BackgroundWhite}
            readOnly={formType !== FORM_TYPE.CREATION_FORM}
            value={(formType !== FORM_TYPE.CREATION_FORM && formType !== FORM_TYPE.READ_ONLY_CREATION_FORM) ? getTranslateText(sectionLabel || section?.section_name) : (section?.section_name)}
            placeholder={SECTION.UNTITLE_SECTION}
            variant={UI_LIB_INPUT_VARIANTS.BORDERLESS}
            size={Size.sm}
            onChange={(event) => {
              updateSectionName(event?.target?.value);
              !jsUtility.isEmpty(sectionNameError) && onSectionNameValidateHandler(event.target.value);
            }}
            onBlurHandler={onSectionNameBlurHandler}
            inputInnerClassName={cx(styles.SectionText, sectionNameError && styles.ErrorBorder, formType !== FORM_TYPE.CREATION_FORM && gClasses.BackgroundWhite, gClasses.PL0)}
            errorMessage={sectionNameError ||
              validationMessage?.[`${section[REQUEST_FIELD_KEYS.SECTION_UUID]},${REQUEST_SAVE_FORM.SECTION_NAME}`]
            }
          />
        }
        {formType === FORM_TYPE.CREATION_FORM &&
        <div className={cx(gClasses.CenterV, styles.SectionOptions)}>
          {!isLastSection &&
          <>
            {section.section_order !== sections.length &&
            <div className={cx(gClasses.CenterVH, styles.IconContainer)}>
              <ArrowDownIcon
                role={ARIA_ROLES.BUTTON}
                tabIndex={0}
                className={cx(styles.SectionIcons, gClasses.ML7)}
                onClick={onSectionMoveDownHandler}
              />
            </div>}
            {section.section_order !== 1 &&
            <div className={cx(gClasses.CenterVH, styles.IconContainer)}>
              <ArrowUpIcon
                role={ARIA_ROLES.BUTTON}
                tabIndex={0}
                className={cx(styles.SectionIcons, gClasses.ML7)}
                onClick={onSectionMoveUpHandler}
              />
            </div>}
          </>}
          <div className={styles.DropdownContainer}>
            <SingleDropdown
              dropdownViewProps={{
                icon: !isEmpty(SECTION_MENU(t, moduleType, isLastSection)) ? (
                  <div className={cx(gClasses.CenterVH, styles.IconContainer)}>
                    <MoreVerticalIcon
                      role={ARIA_ROLES.BUTTON}
                      tabIndex={0}
                      className={styles.SectionIcons}
                      onClick={onDropdownMenuHandler}
                    />
                  </div>) : null,
                iconOnly: true,
                variant: Variant.borderLess,
                className: cx(gClasses.ML8, gClasses.CenterVH),
              }}
              onClick={onDropdownMenuHandler}
              selectedValue={section?.no_of_columns}
              optionList={SECTION_MENU(t, moduleType, isLastSection)}
              getClassName={(isOpen) => isOpen ? gClasses.TextNoWrap : ''}
              getPopperContainerClassName={(isOpen) => isOpen ? cx(gClasses.ZIndex3, gClasses.WidthFitContent) : ''}
              popperPlacement={EPopperPlacements.BOTTOM_END}
            />
          </div>
        </div>}
      </div>
    );

  const getImportModal = () => {
    if (!isImportForm) return null;

    const importSection = (sections, fields, showSectionName = false) => {
      setShowSectionName(showSectionName);
      dispatch(FORM_ACTIONS.BULK_UPLOAD_FIELDS, { fields });
      dispatch(FORM_ACTIONS.UPDATE_SECTIONS, { sections });
    };

    return (
      <ImportForm
          allFields={fields}
          metaData={metaData}
          moduleType={moduleType}
          onCloseClick={() => setIsImportForm(false)}
          dispatch={dispatch}
          section={section}
          sections={sections}
          onSuccess={importSection}
          type={IMPORT_TYPES.FIELD}
          cols={section?.no_of_columns || COLUMN_LAYOUT.TWO}
      />
    );
  };

  const emptySectionError = validationMessage?.[section[REQUEST_FIELD_KEYS.SECTION_UUID]];

  const getMoreDependency = (id, path, type, key = '_id') => {
    if (dependencyData[0]?.message) {
      listDependencyApiThunk({ [key]: id, type }, path, dependencyData[0]?.message, setDependencyData);
    }
  };
  let allFieldsHidden = true;
  if ((formType === FORM_TYPE.EDITABLE_FORM) || (formType === FORM_TYPE.READONLY_FORM && !isAuditView && !disableVisibilityForReadOnlyForm)) {
    section?.field_metadata?.forEach((eachField) => {
              const visible = eachField?.[REQUEST_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.TABLE
                                ? formVisibility?.visible_tables
                                : formVisibility?.visible_fields;
              const isVisible = get(visible, [eachField?.[REQUEST_FIELD_KEYS.FIELD_UUID]], false);
              const isDisableField = [undefined, true].includes(eachField?.is_visible) ? VISIBILITY_TYPES.HIDE : VISIBILITY_TYPES.DISABLE;
              if (isVisible || isDisableField === VISIBILITY_TYPES.DISABLE) {
                    allFieldsHidden = false;
              }
    });
  } else allFieldsHidden = false;
  return !allFieldsHidden && (
    <>
      <div id={SECTION_CONTAINER_ID} className={cx(emptySectionError && gClasses.ErrorInputBorder, formType === FORM_TYPE.EDITABLE_FORM && gClasses.P0, styles.SectionContainer, formType === FORM_TYPE.EDITABLE_FORM && moduleType === MODULE_TYPES.DATA_LIST && gClasses.PX0)}>
        <div className={styles.Accordion}>
          {getSectionHeader()}
          <div>
            <FormLayout
              section={section}
              cols={section?.no_of_columns}
              fields={fields}
              formType={formType}
              formData={formData}
              informationFieldFormContent={informationFieldFormContent}
              documentDetails={documentDetails}
              metaData={metaData}
              moduleType={moduleType}
              validationMessage={validationMessage}
              formVisibility={formVisibility}
              onFieldDataChange={onFieldDataChange}
              onDropHandler={onDropHandler}
              dispatch={dispatch}
              dataListAuditfields={dataListAuditfields}
              userProfileData={userProfileData}
              showAllFields={showAllFields}
              isAuditView={isAuditView}
              disableVisibilityForReadOnlyForm={disableVisibilityForReadOnlyForm}
            />

          </div>
        </div>
        {getImportModal()}
      </div>
      <ErrorMessage errorMessage={emptySectionError} className={gClasses.PY4} />
      {!isEmpty(dependencyData) &&
      <DependencyHandler
        onCancelDeleteClick={() => setDependencyData({})}
        onDeleteClick={() => onDeleteSectionHandler?.(true)}
        dependencyHeaderTitle="Section"
        dependencyData={dependencyData[0]?.message}
        getMoreDependency={getMoreDependency}
      />}
    </>
  );
}

const MemorizedSection = React.memo(Section);

export default (MemorizedSection);

Section.propTypes = {
  metaData: PropTypes.object,
  formType: PropTypes.string,
  dataListAuditfields: PropTypes.object,
  section: PropTypes.object,
  sections: PropTypes.array,
  fields: PropTypes.object,
  formVisibility: PropTypes.object,
  dispatch: PropTypes.func,
  isLastSection: PropTypes.bool,
  hideSectionHeader: PropTypes.bool,
  onSectionMoveDownHandler: PropTypes.func,
  onSectionMoveUpHandler: PropTypes.func,
  onDeleteSectionHandler: PropTypes.func,
  onDropHandler: PropTypes.func,
  onColumnLayoutChange: PropTypes.func,
  onFieldDataChange: PropTypes.func,
  formData: PropTypes.object,
  informationFieldFormContent: PropTypes.object,
  documentDetails: PropTypes.object,
  moduleType: PropTypes.string,
  validationMessage: PropTypes.object,
  userProfileData: PropTypes.object,
  sectionNameError: PropTypes.object,
  setSectionNameError: PropTypes.func,
  showAllFields: PropTypes.bool,
  isAuditView: PropTypes.bool,
  dependencyData: PropTypes.object,
  setDependencyData: PropTypes.func,
  disableVisibilityForReadOnlyForm: PropTypes.bool,
};
