import {
  Button,
  CheckboxGroup,
  EButtonType,
  ECheckboxSize,
  ETextSize,
  ETitleSize,
  EToastType,
  Modal,
  ModalSize,
  RadioGroupLayout,
  Skeleton,
  Text,
  Title,
  toastPopOver,
} from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { v4 as uuidV4 } from 'uuid';
import styles from './ImportForm.module.scss';
import CloseIconV2 from '../../../assets/icons/CloseIconV2';
import gClasses from '../../../scss/Typography.module.scss';
import { getAllFlowStepsApi, getFormDetailsApi, saveForm } from '../../../axios/apiService/form.apiService';
import { cloneDeep, get, isEmpty, uniq } from '../../../utils/jsUtility';
import { IMPORT_ACTION_TYPE, IMPORT_FIELD_TYPES, IMPORT_FORM_STRINGS } from './ImportForm.strings';
import FormLayout from '../sections/form_layout/FormLayout';
import { FORM_LAYOUT_TYPE, FORM_TYPE } from '../Form.string';
import { COLUMN_LAYOUT } from '../sections/form_layout/FormLayout.string';
import { changeFieldImportTypeAndReturnSections, constructSectionPostData, generateNewLayoutFromExistingLayout, selectSections, getSelectedSections, internalFieldSelector, isAllSectionsEditable, isAllSectionsReadOnly, selectAllFormFieldsAndReturnSections, selectFieldAndReturnSections, selectSectionFieldsAndReturnSections, updateSectionsWithResponseData, deselectSections, sortSections, constructImportFormFieldLayout, constructImportSectionsLayout, isAllFieldSelected, constructLayout, validateImportForm, constructSingleColumnLayout } from './ImportForm.util';
import { REQUEST_FIELD_KEYS, REQUEST_SAVE_SECTION, RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../utils/constants/form/form.constant';
import { constructFlatStructure, constructTreeStructure, createNewRowIfSectionsLastRowNotEmpty } from '../sections/form_layout/FormLayout.utils';
import { normalizer } from '../../../utils/normalizer.utils';
import { getModuleIdByModuleType } from '../Form.utils';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import ResponseHandlerIcon from '../../../assets/icons/response_status_handler/ResponseHandlerIcon';
import { updateSomeoneIsEditingPopover } from '../../edit_flow/EditFlow.utils';
import { SOMEONE_EDITING } from '../../../utils/ServerValidationUtils';
import { FLOW_MIN_MAX_CONSTRAINT, STEP_TYPE } from '../../../utils/Constants';
import { FIELD_TYPES } from '../sections/field_configuration/FieldConfiguration.strings';
import { removeFieldAndDocIds } from '../../../components/information_widget/InformationWidget.utils';
import { updatePostLoader } from '../../../utils/UtilityFunctions';
import { setPointerEvent } from '../../../utils/loaderUtils';
import { PROPERTY_PICKER_ARRAY } from '../../../utils/constants/form.constant';
import { getAllFields } from '../../../axios/apiService/flow.apiService';

const INITIAL_STATE = { data: [], paginationDetails: {}, loading: false };
function ImportForm(props) {
  const { t } = useTranslation();
  const {
    metaData,
    moduleType,
    onCloseClick,
    dispatch,
    sections = [],
    section,
    cols,
    onSuccess,
    isImportForm = false,
  } = props;
  const [steps, setSteps] = useState(INITIAL_STATE);
  const [currentStep, setCurrentStep] = useState({ loading: false, data: {} });
  const [validations, setValidations] = useState({});
  const { IMPORT_FORM } = IMPORT_FORM_STRINGS(t);
  const { SECTION_NAME, SECTION_UUID, NO_OF_COLUMNS } = REQUEST_SAVE_SECTION;
  const [selectedFields, setSelectedFields] = useState({});

  // Get Particulart Step Form Data.
  const getFormDetailsByStep = (step) => {
    if (isEmpty(step)) return;

    setCurrentStep({ loading: true, data: { ...step } });
    const params = { step_id: step.id };

    getFormDetailsApi(params)
      .then((data) => {
        const { sections: responseSections, generated_document_fields } = data;
        const existingFieldUUIDS = [];
        sections?.forEach((section) => {
          section?.contents?.forEach((obj) => {
            if (obj?.type === 'field') existingFieldUUIDS.push(obj?.field_uuid);
          });
        });
        let isNoDataFound = true;
        const tableUniqColumnDetails = [];
        const { DATA_LIST_DETAILS, DISPLAY_FIELDS, PROPERTY_PICKER_DETAILS, REFERENCE_FIELD_UUID, IS_IMPORT_DISABLED, INFORMATION_DATA } = RESPONSE_FIELD_KEYS;

        const updatedSections = responseSections.map((eachSection, sectionIndex) => {
          const fields = {};
          const section = {
            ...eachSection,
            section_uuid: eachSection.section_uuid || uuidV4(),
            layout: constructTreeStructure(eachSection.contents),
          };
          const importDisabledFields = [];
          const infoDataFieldUUIDs = [];
          const sectionFieldsObj = {};

          eachSection.field_metadata?.forEach((eachField) => {
            const _field = normalizer(eachField, REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS);
            const fieldUUID = _field[RESPONSE_FIELD_KEYS.FIELD_UUID];
            const fieldType = _field[RESPONSE_FIELD_KEYS.FIELD_TYPE];
            const isTable = fieldType === FIELD_TYPES.TABLE;

            if (!isTable && existingFieldUUIDS.includes(fieldUUID)) {
              _field[RESPONSE_FIELD_KEYS.IS_IMPORT_DISABLED] = true;
            }

            if (isTable) {
              // if all table fields are imported then set isImportDisabled of table to true;
              const tableFields = eachSection.field_metadata.filter((f) => f.table_uuid === fieldUUID) || [];
              const isAllTableFieldsImported = tableFields.every((f) => existingFieldUUIDS.includes(f.field_uuid));
              _field[RESPONSE_FIELD_KEYS.IS_IMPORT_DISABLED] = isAllTableFieldsImported;

              // if  it has a unique column, then store it in a [];
              const uniqColumUUID = get(_field, [RESPONSE_FIELD_KEYS.VALIDATIONS, RESPONSE_VALIDATION_KEYS[fieldType].UNIQUE_COLUMN_UUID]);
              if (uniqColumUUID) tableUniqColumnDetails.push({ fieldUUID: uniqColumUUID, sectionIndex, tableUUID: fieldUUID });
            }

            // store fieldUUID of display fields of DL picker & referenceUUIDs of property picker fields
            // this is needed when calculating value for select section checkbox
            if (fieldType === FIELD_TYPES.DATA_LIST) {
              const displayFields = get(_field, [DATA_LIST_DETAILS, DISPLAY_FIELDS], []);
              importDisabledFields.push(...displayFields);
            } else if (PROPERTY_PICKER_ARRAY.includes(fieldType)) {
              const referenceFieldUUID = get(_field, [PROPERTY_PICKER_DETAILS, REFERENCE_FIELD_UUID]);
              if (referenceFieldUUID) importDisabledFields.push(referenceFieldUUID);
            }

            if (_field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.INFORMATION) {
              const { rawHtml, renderedTemplate } = removeFieldAndDocIds({ data: _field?.[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT]?.[RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE], isPostData: false });
              _field[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT] = {
                [RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE]: rawHtml,
                [RESPONSE_FIELD_KEYS.RENDERING_TEMPLATE]: renderedTemplate,
              };
              infoDataFieldUUIDs.push(...get(_field, [INFORMATION_DATA, 'field_uuids'], []));
            }

            fields[fieldUUID] = _field;
            isNoDataFound = false;
          });

          section.contents.forEach((c) => {
            if ([FORM_LAYOUT_TYPE.FIELD, FORM_LAYOUT_TYPE.TABLE].includes(c.type)) {
              sectionFieldsObj[c.field_uuid] = true;
            }
          });

          // set importDisable to false for display fields of DL picker & reference field of property pickers;
          importDisabledFields.forEach((uuid) => {
            if (fields[uuid]) fields[uuid][IS_IMPORT_DISABLED] = true;
          });

          // if any field used in info field is not present in the same section, then set that particular field as import disabled,
          infoDataFieldUUIDs.forEach((uuid) => {
            if (!sectionFieldsObj[uuid] && fields[uuid]) fields[uuid][IS_IMPORT_DISABLED] = true;
          });

          section.fields = fields;
          return section;
        });

        if (generated_document_fields) {
          const section = {
            section_name: 'Generated Document Fields',
            section_uuid: uuidV4(),
            section_order: updatedSections.length + 1,
            is_section_show_when_rule: false,
            no_of_columns: COLUMN_LAYOUT.TWO,
            fields: {},
          };

          generated_document_fields?.forEach((eachField) => {
            const _field = normalizer(eachField, REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS);
            const fieldUUID = _field[RESPONSE_FIELD_KEYS.FIELD_UUID];
            if (existingFieldUUIDS.includes(fieldUUID)) {
              _field[RESPONSE_FIELD_KEYS.IS_IMPORT_DISABLED] = true;
            }
            section.fields[fieldUUID] = _field;
          });
          section.layout = constructLayout(section.fields, section.no_of_columns).overallLayout || [];
          section.contents = constructFlatStructure(section.layout);

          updatedSections.push(section);
        }

        setCurrentStep((state) => {
          return {
            loading: false,
            data: {
              ...(state?.data || {}),
              ...step,
              form_uuid: data?.form_uuid,
              sections: updatedSections,
              isNoDataFound,
              tableUniqColumnDetails,
            },
          };
        });
      })
      .catch((err) => {
        console.log('xyz Error', err);
        setCurrentStep({ loading: false, data: {} });
      });
  };

  const getAllFieldsList = () => {
    getAllFields({
      page: 1,
      size: 1000,
      ...getModuleIdByModuleType(metaData, moduleType, false),
    }).then((res) => {
      const existingFieldUUIDS = [];
      sections?.forEach((section) => {
        section?.contents?.forEach((obj) => {
          if (obj?.type === 'field') existingFieldUUIDS.push(obj?.field_uuid);
        });
      });
      const section = {
        section_name: IMPORT_FORM.ALL_FIELDS,
        section_uuid: 'import_all_field_section', // Just temporary till the api call.
        section_order: 1,
        is_section_show_when_rule: false,
        no_of_columns: COLUMN_LAYOUT.TWO,
        fields: {},
      };

      res?.pagination_data?.forEach((eachField) => {
        const _field = normalizer(eachField, REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS);
        const fieldUUID = _field[RESPONSE_FIELD_KEYS.FIELD_UUID];

        if (_field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.INFORMATION) {
          const { rawHtml, renderedTemplate } = removeFieldAndDocIds({ data: _field?.[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT]?.[RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE], isPostData: false });
          _field[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT] = {
            [RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE]: rawHtml,
            [RESPONSE_FIELD_KEYS.RENDERING_TEMPLATE]: renderedTemplate,
          };
        }

        if (existingFieldUUIDS.includes(fieldUUID)) {
          _field[RESPONSE_FIELD_KEYS.IS_IMPORT_DISABLED] = true;
        }
        section.fields[fieldUUID] = _field;
      });
      section.layout = constructSingleColumnLayout(section.fields).overallLayout || [];
      section.contents = constructFlatStructure(section.layout);
      setCurrentStep({ loading: false, isAllFields: true, data: { isNoDataFound: false, loading: false, sections: [section] } });
    }).catch((err) => {
      console.log('allx err', err);
    });
  };

  const getInitailStepData = (steps = []) => steps.find((eachStep) => metaData?.stepId !== eachStep?.id);

  // Query all the apllicable steps for the current flow.
  useEffect(() => {
    setSteps((state) => { return { ...state, loading: true }; });
    const params = { flow_id: metaData?.moduleId, size: 100 };

    getAllFlowStepsApi(params)
      .then((data) => {
        const newSteps = {
          data: (data?.paginationData || []).filter((s) => s.stepType !== STEP_TYPE.INTEGRATION),
          paginationDetails: data?.paginationDetails || {},
          loading: false,
        };
        setSteps(newSteps);
        getFormDetailsByStep(getInitailStepData(get(newSteps, ['data'], [])));
      })
      .catch(() => setSteps(INITIAL_STATE));
  }, []);

  const updateCurrentStep = (sections = []) => {
    setCurrentStep((state) => {
      return { ...state, data: { ...(state?.data || {}), sections } };
    });
  };

  // On Entire Form Click, it may be editable or read only.
  const onEntireFormImportClick = (importType) => {
    const sectionList = get(currentStep, ['data', 'sections'], []);
    const { sections, actionType } = selectAllFormFieldsAndReturnSections(
      sectionList || [],
      importType,
    );

    setSelectedFields((existingSelectedFields) => {
      if (actionType === IMPORT_ACTION_TYPE.SELECTED) {
        // Select
        const selectedSectionsObject = selectSections(sectionList);
        return { ...existingSelectedFields, ...selectedSectionsObject };
      } else if (actionType === IMPORT_ACTION_TYPE.DESELECTED) {
        // De-Select
        const deselectSectionsObject = deselectSections([], existingSelectedFields);
        return deselectSectionsObject;
      } else {
        return existingSelectedFields;
      }
    });

    updateCurrentStep(sections);
  };

  // On Entire Section Click.
  const onEntireSectionImportClick = (sectionUUID) => {
    const sectionList = get(currentStep, ['data', 'sections'], []);
    const { sections, actionType } = selectSectionFieldsAndReturnSections(
      sectionList,
      sectionUUID,
    );

    const currentSection = sectionList.find((section) => section.section_uuid === sectionUUID);

    if (currentSection) {
      setSelectedFields((existingSelectedFields) => {
        if (actionType === IMPORT_ACTION_TYPE.SELECTED) {
          // Select
          const selectedSectionsObject = selectSections([currentSection]);
          return { ...existingSelectedFields, ...selectedSectionsObject };
        } else if (actionType === IMPORT_ACTION_TYPE.DESELECTED) {
          // De-Select
          const sectionUUIDs = sectionList.map((s) => s.section_uuid).filter((uuid) => uuid !== sectionUUID);
          const deselectSectionsObject = deselectSections(sectionUUIDs, existingSelectedFields);
          return deselectSectionsObject;
        } else {
          return existingSelectedFields;
        }
      });
    }

    updateCurrentStep(sections);
  };

  // On Changing a field property to readonly or editbale.
  const onImportTypeChange = (sectionUUID, fieldUUID, isReadOnly) => {
    const sections = changeFieldImportTypeAndReturnSections(
      currentStep?.data?.sections || [],
      sectionUUID,
      fieldUUID,
      isReadOnly,
    );

    updateCurrentStep(sections);
  };

  // on Selecting Individual Field.
  const onImportField = (sectionUUID, fieldUUID, tableUUID, path) => {
    const tableFieldUUIDs = [];
    // select all cols of table is clicked
    if (tableUUID && !fieldUUID) {
      const sectionFieldsObj = currentStep.data.sections.find((s) => s.section_uuid === sectionUUID)?.fields || {};
      Object.keys(sectionFieldsObj).forEach((uuid) => {
        const field = sectionFieldsObj[uuid];
        if (field[RESPONSE_FIELD_KEYS.TABLE_UUID] === tableUUID && !field[RESPONSE_FIELD_KEYS.IS_IMPORT_DISABLED]) {
          tableFieldUUIDs.push(field[RESPONSE_FIELD_KEYS.FIELD_UUID]);
        }
      });
    }

    setSelectedFields((selectedFields) => internalFieldSelector(selectedFields, sectionUUID, tableUUID, fieldUUID, path, tableFieldUUIDs));

    const sections = selectFieldAndReturnSections(
      currentStep.data.sections,
      sectionUUID,
      fieldUUID,
      tableUUID,
      tableFieldUUIDs,
    );

    updateCurrentStep(sections);
  };

  const onImport = () => {
    const { hasError, error, validations } = validateImportForm(selectedFields, currentStep.data);

    if (hasError) {
      setValidations(validations);
      return toastPopOver({
        title: error.title,
        subtitle: error.subtitle,
        toastType: EToastType.error,
      });
    }

    setValidations({});
    const currentStepSections = get(currentStep, ['data', 'sections'], []);
    const IS_FORM_FIELD_IMPORT = !isEmpty(section);

    // SELECTED SECTION
    const selectedSections = getSelectedSections(currentStepSections);
    const sectionUUIDOrder = currentStepSections.map((section) => section?.section_uuid);

    // If the field selected across the multiple section in any order, then the below one helps to sort the selected field based on existing section order.
    const sortedSectionsGroup = sortSections(selectedFields, sectionUUIDOrder);

    let originalImportedSections = [];

    if (IS_FORM_FIELD_IMPORT) {
      const { allLayout } = constructImportFormFieldLayout(sortedSectionsGroup, selectedSections, cols, section);
      const constructedSection = { ...section, layout: allLayout };
      originalImportedSections = [constructedSection];
    } else {
      const { sections } = constructImportSectionsLayout(sortedSectionsGroup, currentStepSections, selectedSections);
      originalImportedSections = sections;
    }

    if (IS_FORM_FIELD_IMPORT) {
      originalImportedSections = sections.map((eachSection) => {
        let section = eachSection;
        if (eachSection.section_uuid === get(originalImportedSections, [0, 'section_uuid'], EMPTY_STRING)) {
          section = originalImportedSections?.[0];
        }
        return createNewRowIfSectionsLastRowNotEmpty(section);
      });
    } else {
      const newSections = originalImportedSections.map((eachSection) => {
        delete eachSection?.section_uuid;
        return eachSection;
      });
      originalImportedSections = [...sections, ...newSections].map(
        (eachSection) => createNewRowIfSectionsLastRowNotEmpty(eachSection),
      );
    }

    let postImportedSections = [];

    postImportedSections = cloneDeep(originalImportedSections)?.map((eachSection, index) => {
      eachSection.layout = generateNewLayoutFromExistingLayout(eachSection.layout);

      return constructSectionPostData(eachSection, index + 1);
    },
    );

    // Import Form for non initial steps
    // since there will always be 1 empty section created from BE,
    // shifting the 1'st section to 0'th section and updating section_order
    if (isImportForm) {
      const _postImportedSections = cloneDeep(postImportedSections);
      _postImportedSections[0] = cloneDeep(_postImportedSections[1]);
      _postImportedSections.splice(1, 1);
      postImportedSections = _postImportedSections.map((s, idx) => {
        s.section_order = idx + 1;
        return s;
      });
    }

    const editableFieldUUIDS = [];
    currentStep.data.sections.forEach((s) => {
      Object.keys(s.fields).forEach((key) => {
        const field = s.fields[key];
        if (
          !field[RESPONSE_FIELD_KEYS.IS_IMPORT_DISABLED] &&
          field.isImported &&
          !field.isReadOnly &&
          field[RESPONSE_FIELD_KEYS.FIELD_TYPE] // this is to exclude datalist display fields & property picker source fields.
        ) editableFieldUUIDS.push(field[RESPONSE_FIELD_KEYS.FIELD_UUID]);
      });
    });

    const showSectionName = IS_FORM_FIELD_IMPORT ? metaData?.showSectionName : true;
    const params = {
      ...getModuleIdByModuleType(metaData, moduleType),
      form_uuid: metaData.formUUID,
      sections: postImportedSections,
      import_from: currentStep.data.form_uuid,
      show_section_name: showSectionName,
      editable_fields: uniq(editableFieldUUIDS),
    };

    updatePostLoader(true);
    setPointerEvent(true);
    saveForm(params).then((response) => {
      const responseSections = response?.sections || [];
      const { consolidatedSections, importedFields } = updateSectionsWithResponseData(responseSections, originalImportedSections);
      onSuccess?.(consolidatedSections, importedFields, showSectionName);
      onCloseClick();
    }).catch((e) => {
      const errors = get(e, ['response', 'data', 'errors'], []);
      console.log('xyz errors', errors);
      if (errors && errors[0].type === SOMEONE_EDITING) {
        updateSomeoneIsEditingPopover(errors[0].message);
      } else if (
        errors?.length > 0 && errors[0].indexes && errors[0].indexes.includes('section_name')
      ) {
        if ((errors[0].type === 'string.min') || (errors[0].type === 'string.max')) {
          toastPopOver({
            title: `${t('error_popover_status.section_name_length')} ${FLOW_MIN_MAX_CONSTRAINT.SECTION_NAME_MIN_VALUE} ${t('error_popover_status.to')} ${FLOW_MIN_MAX_CONSTRAINT.SECTION_NAME_MAX_VALUE} ${t('error_popover_status.character_long')}`,
            toastType: EToastType.error,
          });
        } else if (['string.base', 'string.empty', 'any.required'].includes(errors[0].type)) {
          toastPopOver({
            title: 'Section name cannot be empty',
            toastType: EToastType.error,
          });
        }
      } else if (errors.length > 0) {
        if (errors[0]?.type === 'array.unique') {
          return toastPopOver({
            title: IMPORT_FORM.ERRORS.DUPLICATE_FIELD,
            subtitle: IMPORT_FORM.ERRORS.DUPLICATE_FIELD_SUBTITLE,
            toastType: EToastType.error,
          });
        }
        toastPopOver({
          title: IMPORT_FORM.ERRORS.SOMETHING_WENT_WRONG,
          toastType: EToastType.error,
        });
      }
      return null;
    })
      .finally(() => {
        updatePostLoader(false);
        setPointerEvent(false);
      });

    return 0;
  };

  const getHeaderContent = () => (
    <>
      <Title content={IMPORT_FORM.MODAL_TITLE} size={ETitleSize.small} />
      <button className={styles.CloseIcon} onClick={onCloseClick}>
        <CloseIconV2 />
      </button>
    </>
  );

  const getLeftPanel = () => {
    if (steps?.loading) {
      return <Skeleton height={55} count={3} className={gClasses.MB10} />;
    }

    const allSteps = [];
    let index = 1;
    steps.data.forEach((step) => {
      if (step?.id !== metaData?.stepId) {
        allSteps.push(
          <button
            key={step.stepUUID}
            className={cx(
              styles.StepCard,
              currentStep.data?.stepUUID === step.stepUUID && styles.Selected,
            )}
            onClick={() => getFormDetailsByStep(step)}
          >
            <span
              className={cx(
                styles.StepNo,
                currentStep.data?.stepUUID === step.stepUUID && styles.Selected,
              )}
            >
              {index}
            </span>
            <Text
              content={step.stepName}
              size={ETextSize.MD}
              fontClass={cx(styles.StepCardText, gClasses.Flex1)}
              title={step.stepName}
            />
            <div
              className={cx(
                gClasses.RightArrow,
                gClasses.ML10,
                currentStep.data?.stepUUID === step.stepUUID && styles.RightArrow,
              )}
            />
          </button>,
        );
        index++;
      }
    });
    allSteps.push(
      <button
        className={cx(
          styles.StepCard,
          currentStep.isAllFields && styles.Selected,
        )}
        onClick={() => getAllFieldsList()}
      >
        <span
          className={cx(
            styles.StepNo,
            currentStep.isAllFields && styles.Selected,
          )}
        >
          {index}
        </span>
        <Text
          content="Import all fields"
          size={ETextSize.MD}
          fontClass={cx(styles.StepCardText, gClasses.Flex1)}
          title="Import all fields"
        />
        <div
          className={cx(
            gClasses.RightArrow,
            gClasses.ML10,
            currentStep.isAllFields && styles.RightArrow,
          )}
        />
      </button>);
    return allSteps;
  };

  const getRightPanelHeader = () => {
    if (currentStep.data.isNoDataFound) return null;
    return (
      <div className={cx(gClasses.CenterV, gClasses.MB16)}>
        <Text
          content={IMPORT_FORM.IMPORT_ALL_FIELDS_TEXT}
          isLoading={currentStep.loading || steps.loading}
        />
        <div className={cx(styles.Line, gClasses.Flex1)} />
        <CheckboxGroup
          id="all-field-readonly"
          layout={RadioGroupLayout.inline}
          options={[
            {
              label: IMPORT_FORM.READONLY,
              value: IMPORT_FIELD_TYPES.READONLY,
              selected: isAllSectionsReadOnly(currentStep.data.sections || []),
            },
          ]}
          onClick={() => onEntireFormImportClick(IMPORT_FIELD_TYPES.READONLY)}
          className={gClasses.MR10}
          isLoading={currentStep.loading || steps.loading}
          size={ECheckboxSize.SM}
        />
        <CheckboxGroup
          id="all-field-editable"
          layout={RadioGroupLayout.inline}
          options={[
            {
              label: IMPORT_FORM.EDITABLE,
              value: IMPORT_FIELD_TYPES.EDITABLE,
              selected: isAllSectionsEditable(currentStep.data.sections || []),
            },
          ]}
          onClick={() => onEntireFormImportClick(IMPORT_FIELD_TYPES.EDITABLE)}
          isLoading={currentStep.loading || steps.loading}
          size={ECheckboxSize.SM}
        />
      </div>
    );
  };

  const getRightPanel = () => {
    if (steps?.loading || currentStep.loading) {
      return [75, 50, 65, 90].map((h) => (
        <div className={gClasses.MB30} key={h}>
          <Skeleton height={16} width={200} className={gClasses.MB10} />
          <Skeleton height={h} />
        </div>
      ));
    }

    if (currentStep.data.isNoDataFound) {
      return (
        <div className={cx(gClasses.DFlexCenter, gClasses.H100, gClasses.W100)}>
          <div className={cx(gClasses.CenterV, gClasses.FlexDirectionColumn)}>
            <ResponseHandlerIcon />
            <Title size={ETitleSize.small} content={IMPORT_FORM.NO_FORM_TO_IMPORT} />
          </div>
        </div>
      );
    }

    return currentStep.data?.sections?.map((section) => {
      const { isImported, isAlreadyImported } = isAllFieldSelected(
        Object.values(section?.fields),
      );
      return (
        <div key={section[SECTION_UUID]} className={cx(gClasses.MB50)}>
          <div className={cx(gClasses.CenterV, gClasses.MB16)}>
            <Title content={section[SECTION_NAME]} size={ETitleSize.xs} />
            <div className={cx(styles.Line, gClasses.Flex1)} />
            <CheckboxGroup
              id={`section_${section[SECTION_UUID]}`}
              layout={RadioGroupLayout.inline}
              options={[
                {
                  label: '',
                  value: '',
                  selected: isImported,
                  disabled: isAlreadyImported,
                },
              ]}
              onClick={() =>
                onEntireSectionImportClick(section[SECTION_UUID])
              }
              size={ECheckboxSize.SM}
            />
          </div>
          <FormLayout
            layouts={section.layout}
            sectionUUID={section[SECTION_UUID]}
            section={section}
            cols={section[NO_OF_COLUMNS] || COLUMN_LAYOUT.TWO}
            fields={section.fields}
            formType={FORM_TYPE.IMPORT_FROM}
            formData={{}}
            metadata={metaData}
            moduleType={moduleType}
            validationMessage={validations}
            formVisibility={{}}
            onFieldDataChange={() => { }}
            dispatch={dispatch}
            userProfileData={{}}
            onImportFieldClick={(fieldUUID, tableUUID, path) =>
              onImportField(section[SECTION_UUID], fieldUUID, tableUUID, path)
            }
            onImportTypeChange={(fieldUUID, importType) =>
              onImportTypeChange(
                section[SECTION_UUID],
                fieldUUID,
                importType,
              )
            }
          />
        </div>
      );
    });
  };

  const getMainContent = () => (
    <>
      <div className={styles.LeftColumn}>
        <Title
          content={IMPORT_FORM.SELECT_STEPS}
          size={ETitleSize.xs}
          className={gClasses.MB10}
        />
        <div>{getLeftPanel()}</div>
      </div>

      <div className={styles.RightColumn}>
        {getRightPanelHeader()}
        {getRightPanel()}
      </div>
    </>
  );

  const getFooterContent = () => (
    <>
      <Button buttonText={IMPORT_FORM.CANCEL} onClickHandler={onCloseClick} type={EButtonType.OUTLINE_SECONDARY} />
      <Button buttonText={IMPORT_FORM.IMPORT} onClickHandler={onImport} />
    </>
  );

  return (
    <Modal
      id={IMPORT_FORM.MODAL_ID}
      isModalOpen
      modalSize={ModalSize.lg}
      headerContent={getHeaderContent()}
      mainContent={getMainContent()}
      footerContent={getFooterContent()}
      customModalClass={styles.ModalContainerClass}
      headerContentClassName={styles.Header}
      mainContentClassName={styles.MainContent}
      footerContentClassName={styles.Footer}
    />
  );
}

export default ImportForm;

ImportForm.propTypes = {
  allFields: PropTypes.object,
  metaData: PropTypes.object,
  onCloseClick: PropTypes.func,
  dispatch: PropTypes.func,
  section: PropTypes.object,
  sections: PropTypes.array,
  cols: PropTypes.number,
  moduleType: PropTypes.string,
  onSuccess: PropTypes.func,
  isImportForm: PropTypes.bool,
};

ImportForm.defaultProps = {
  onCloseClick: null,
  dispatch: null,
  section: {},
  cols: 2,
};
