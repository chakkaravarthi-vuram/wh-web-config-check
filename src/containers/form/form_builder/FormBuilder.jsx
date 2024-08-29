import React, { useEffect, useState } from 'react';
import { Checkbox, Tab, ECheckboxSize, SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import { useDispatch, useSelector } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import FormBody from './form_body/FormBody';
import FormConfiguration from '../../form_configuration/FormConfiguration';
import style from './FormBuilder.module.scss';
import { FORM_CONFIGURATION_TAB, SUMMARY_TAB_OPTIONS_LIST, TAB_OPTION_LIST } from './FormBuilder.constants';
import FormFieldsList from './form_field_list/FormFieldsList';
import { FORM_ACTIONS, FORM_LAYOUT_TYPE } from '../Form.string';
import { get, isEmpty } from '../../../utils/jsUtility';
import { checkIsDndAcrossSection, formDragAndDrop, getLayoutBasedOnSection, getLayoutByPath, loadUpdatedLayoutInSectionForDND } from '../sections/form_layout/FormLayout.utils';
import { MODULE_TYPES } from '../../../utils/Constants';
import { getNewRowWithColumns } from '../layout/Layout.utils';
import { COLUMN_LAYOUT } from '../sections/form_layout/FormLayout.string';
import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from '../../../utils/constants/form/form.constant';
import { LAYOUT_ACTIONS, getUpdatedOriginalAndPostSectionData, updateLayoutBasedOnActionAndPath } from '../sections/sections.utils';
import { updateFormFieldOrder } from '../../../redux/actions/Form.Action';
import { dataChange } from '../../../redux/reducer/IndividualEntryReducer';
import { FIELD_INITIAL_STATE } from '../sections/field_configuration/FieldConfigurationReducer';
import { getInitialFieldDataByFieldType, getInitialSummaryFieldData } from '../sections/field_configuration/basic_configuration/BasicConfiguration.utils';
import { COMMA } from '../../../utils/strings/CommonStrings';
import { LAYOUT_INITIAL_STATE } from '../layout/layout_configuration/LayoutConfiguration.utils';
import Components from './components/Components';
import AddedField from './added_field/AddedField';
import { entityFormToDashboardPageThunk, getExternalRulesThunk } from '../../../redux/actions/IndividualEntry.Action';
import DeleteConfirmModal from '../../application/delete_comfirm_modal/DeleteConfirmModal';
import { ExternalSourceProvider } from '../external_source_data/useExternalSource';
import { SUMMARY_FORM_STRINGS } from './FormBuilder.strings';

function FormBuilder(props) {
  const {
    headerData = {
      formTitle: null,
      formDescription: null,
    },
    metaData,
    activeField,
    activeLayout,
    sections,
    fields,
    formVisibility,
    validationMessage,
    dispatch,
    getFormHeader = () => null,
    getFormFooter = () => null,
    moduleType = MODULE_TYPES.FLOW,
    saveField = null,
    userProfileData,
  } = props;

  const isSummaryForm = moduleType === MODULE_TYPES.SUMMARY;
   const reduxDispatch = useDispatch();
   const [tab, setTab] = useState(isSummaryForm ? FORM_CONFIGURATION_TAB.COMPONENTS : FORM_CONFIGURATION_TAB.FIELDS);
   const { t } = useTranslation();
   const {
     pageMetadata: pageMetaData,
     isSummaryFormConfirmationModal,
     flowStepList,
     selectedFlowStep,
     currentFlowStep,
     isInitialCustomSummary,
   } = useSelector((state) => state.IndividualEntryReducer);
   const sameAsEntityForm = isSummaryForm && pageMetaData?.same_as_entity_form;
   const { SAME_DATA, CONFIRM_MODEL, SELECT_STEP } = SUMMARY_FORM_STRINGS(t);

  useEffect(() => {
    if (metaData.pageId) reduxDispatch(getExternalRulesThunk(metaData.pageId));
  }, [metaData.pageId]);

   const onChangeSameAsForm = () => {
    if (isInitialCustomSummary) {
      reduxDispatch(entityFormToDashboardPageThunk({
        same_as_entity_form: !pageMetaData?.same_as_entity_form,
        page_id: metaData?.pageId,
        }));
    } else {
    if (!metaData.flowId) {
      // datalist
      if (!pageMetaData?.same_as_entity_form) {
        reduxDispatch(
          dataChange({
            isSummaryFormConfirmationModal: true,
            pageMetadata: {
              ...pageMetaData,
              same_as_entity_form: !pageMetaData?.same_as_entity_form,
            },
          }),
        );
      } else {
        reduxDispatch(
          dataChange({
            pageMetadata: {
              ...pageMetaData,
              same_as_entity_form: !pageMetaData?.same_as_entity_form,
            },
          }),
        );
        reduxDispatch(entityFormToDashboardPageThunk({
          same_as_entity_form: !pageMetaData?.same_as_entity_form,
          page_id: metaData?.pageId,
          }));
      }
  } else {
    if (pageMetaData?.same_as_entity_form) {
      reduxDispatch(
        dataChange({
          pageMetadata: {
            ...pageMetaData,
            same_as_entity_form: !pageMetaData?.same_as_entity_form,
          },
        }),
      );
      reduxDispatch(entityFormToDashboardPageThunk({
        same_as_entity_form: !pageMetaData?.same_as_entity_form,
        page_id: metaData?.pageId,
        }));
    } else {
      reduxDispatch(
        dataChange({
          isSummaryFormConfirmationModal: true,
          selectedFlowStep: 'all_steps',
        }),
      );
      reduxDispatch(
        dataChange({
          pageMetadata: {
            ...pageMetaData,
            same_as_entity_form: !pageMetaData?.same_as_entity_form,
            isUncheckedInitially: true,
          },
        }),
      );
    }
  }
}
   };

   const onUpdatedEditFormHandler = () => {
    if (!metaData.flowId) {
      // datalist
    reduxDispatch(entityFormToDashboardPageThunk({
      same_as_entity_form: pageMetaData?.same_as_entity_form,
      page_id: metaData?.pageId,
      }));
      reduxDispatch(
        dataChange({
          isSummaryFormConfirmationModal: false,
        }),
      );
    } else {
      reduxDispatch(
        dataChange({
          selectedFlowStep: selectedFlowStep,
          currentFlowStep: selectedFlowStep,
        }),
      );
      if (metaData.flowId) {
        const params = {
          same_as_entity_form: pageMetaData?.same_as_entity_form,
          page_id: metaData?.pageId,
        };
        if (selectedFlowStep !== 'all_steps' && pageMetaData?.same_as_entity_form) params.step_uuid = selectedFlowStep;
        reduxDispatch(entityFormToDashboardPageThunk(params));
        }
    }
    reduxDispatch(
      dataChange({
        isSummaryFormConfirmationModal: false,
      }),
    );
   };

   const onCloseModal = () => {
    if (metaData.flowId) {
    if (pageMetaData?.isUncheckedInitially) {
    reduxDispatch(
      dataChange({
        isSummaryFormConfirmationModal: false,
        pageMetadata: {
          ...pageMetaData,
          same_as_entity_form: !pageMetaData?.same_as_entity_form,
          isUncheckedInitially: false,
        },
      }),
    );
   } else {
    reduxDispatch(
      dataChange({
        isSummaryFormConfirmationModal: false,
        selectedFlowStep: currentFlowStep,
      }),
    );
   }
  } else {
    reduxDispatch(
      dataChange({
        isSummaryFormConfirmationModal: false,
        pageMetadata: {
          ...pageMetaData,
          same_as_entity_form: !pageMetaData?.same_as_entity_form,
        },
      }),
    );
  }
  };

   const constructFlowStepList = (flowStepList) => {
    const flowSteps = [];
    flowStepList?.forEach((step) => {
      if (step) {
        const eachList = {
          label: step.stepName,
          value: step.stepUUID,
          step_id: step.id,
        };
        flowSteps.push(eachList);
      }
    });
    const allStepList = {
      label: SELECT_STEP.ALL_STEPS,
      value: 'all_steps',
    };
    flowSteps.push(allStepList);
    return flowSteps;
  };

   const onDropdownChangeHandler = (value) => {
    reduxDispatch(
      dataChange({
        selectedFlowStep: value,
        isSummaryFormConfirmationModal: true,
      }),
    );
   };

   const onTabClickHandler = (value) => {
    if (!sameAsEntityForm) {
      setTab(value);
    }
   };

   const getTabContent = () => {
      let component = null;
      switch (tab) {
        case FORM_CONFIGURATION_TAB.FIELDS:
         component = (<FormFieldsList />);
         break;
        case FORM_CONFIGURATION_TAB.CONFIGURATION:
         component = (
          <FormConfiguration
            moduleType={moduleType}
            metaData={metaData}
          />
          );
         break;
         case FORM_CONFIGURATION_TAB.COMPONENTS:
           component = <Components isDisabled={sameAsEntityForm} />;
           break;
         case FORM_CONFIGURATION_TAB.ADDED_FIELDS:
           component = (
             <ExternalSourceProvider>
                <AddedField metaData={metaData} moduleType={moduleType} />
             </ExternalSourceProvider>
           );
           break;
        default: break;
      }

      return component;
   };

   const onDropHandler = (source, destination) => {
       const isAcrossSection = checkIsDndAcrossSection(source, destination);
       const destSection = sections.find((section) => section[REQUEST_FIELD_KEYS.SECTION_UUID] === destination?.sectionUUID);
       let destColCount = get(destSection, ['no_of_columns'], COLUMN_LAYOUT.TWO);
       let data = destination?.data;
       console.log('xyz source, destination', source, destination);

       // construct data based on drop type
        switch (destination?.type) {
          case FORM_LAYOUT_TYPE.ROW: {
            if (source?.type === FORM_LAYOUT_TYPE.TABLE) {
              destColCount = 1;
            } else if (destination.path.includes(FORM_LAYOUT_TYPE.BOX)) {
              const _path = destination.path?.substring(0, destination.path.lastIndexOf(COMMA));
              const boxLayout = getLayoutByPath(destSection.layout, _path);
              destColCount = boxLayout?.number_of_columns || COLUMN_LAYOUT.TWO;
            }

            const rowLayout = getNewRowWithColumns(destColCount);
            rowLayout.children[0].children[0] = destination?.data;
            data = rowLayout;
          }
          break;
          default:
            if (destination.path.includes(FORM_LAYOUT_TYPE.BOX)) {
              const _path = destination.path?.substring(0, destination.path.indexOf(FORM_LAYOUT_TYPE.BOX) + 3);
              const boxLayout = getLayoutByPath(destSection.layout, _path);
              destColCount = boxLayout?.number_of_columns || COLUMN_LAYOUT.TWO;
            }
          break;
        }

       // execute drag and drop operation based on drag type,
       switch (source?.type) {
        case FORM_LAYOUT_TYPE.FIELD:
        case FORM_LAYOUT_TYPE.BOX:
        case FORM_LAYOUT_TYPE.TABLE: {
            const layoutsBasedOnSection = getLayoutBasedOnSection(
              sections,
              [source?.sectionUUID, destination?.sectionUUID],
            );
            const sectionBasedUpdatedLayout = formDragAndDrop(
                {
                  sectionUUID: source?.sectionUUID,
                  path: source?.path,
                  layout: layoutsBasedOnSection[source?.sectionUUID] || {},
                },
                {
                  sectionUUID: destination?.sectionUUID,
                  path: destination?.path,
                  layout: layoutsBasedOnSection[destination?.sectionUUID] || {},
                  layoutToBeMoved: data,
                },
                isAcrossSection,
            );
            const updatedSections = loadUpdatedLayoutInSectionForDND(
                sections,
                {
                  layout: sectionBasedUpdatedLayout?.[source?.sectionUUID],
                  path: source?.path,
                  sectionUUID: source?.sectionUUID,
                },
                {
                  layout: sectionBasedUpdatedLayout?.[destination?.sectionUUID],
                  path: destination?.path,
                  sectionUUID: destination?.sectionUUID,
                },
            );

            // Add Extra Row On Destination Layout
            const destSectionIndex = updatedSections.findIndex((section) => section?.section_uuid === destination?.sectionUUID);
            if (destSectionIndex > -1) {
              const currentSection = updatedSections?.[destSectionIndex];
              const updatedDestSection = updateLayoutBasedOnActionAndPath(currentSection, destColCount, destination?.path, LAYOUT_ACTIONS.ADD_EXTRA_ROW);
              updatedSections[destSectionIndex] = updatedDestSection;
            }

            const { postData: reorderPostData } = getUpdatedOriginalAndPostSectionData(updatedSections, metaData, moduleType);

            // Api call to reorder fields across section and multiple sections.
            reduxDispatch(updateFormFieldOrder(reorderPostData, moduleType)).then(() => {
              dispatch(FORM_ACTIONS.UPDATE_SECTIONS, { sections: updatedSections });
            });
         break;
        }
        case FORM_LAYOUT_TYPE.FIELD_TEMPLATE: {
           const fieldType = get(destination, ['data', RESPONSE_FIELD_KEYS.FIELD_TYPE], null);
           let fieldData = {
            ...FIELD_INITIAL_STATE,
            [RESPONSE_FIELD_KEYS.FIELD_TYPE]: fieldType,
            path: destination?.path,
            sectionUUID: destination?.sectionUUID,
            dropType: destination?.type,
           };
           fieldData = getInitialFieldDataByFieldType(fieldType, fieldData, t);
           dispatch?.(FORM_ACTIONS.ACTIVE_FIELD_DATA_CHANGE, { fieldData: fieldData }); // has fieldType and sectionUUID
         break;
        }
        case FORM_LAYOUT_TYPE.LAYOUT: {
          const layoutData = {
            ...LAYOUT_INITIAL_STATE,
            path: destination?.path,
            sectionUUID: destination?.sectionUUID,
            dropType: destination?.type,
          };
          dispatch(FORM_ACTIONS.ACTIVE_LAYOUT_DATA_CHANGE, layoutData);
          break;
        }
        case FORM_LAYOUT_TYPE.EXISTING_FIELD: {
          const fieldData = getInitialSummaryFieldData(destination.data);
          fieldData.path = destination?.path;
          fieldData.sectionUUID = destination?.sectionUUID;
          fieldData.dropType = destination?.type;
          dispatch?.(FORM_ACTIONS.ACTIVE_FIELD_DATA_CHANGE, {
            fieldData: fieldData,
          });
          break;
        }
         default: break;
       }
   };

   return (
     <div className={style.FormBuilder}>
       {/* Left Panel */}
       <div
          disabled={sameAsEntityForm}
          className={cx(
            style.LeftPanel,
            sameAsEntityForm && style.ScrollableDiv,
            moduleType === MODULE_TYPES.TASK && gClasses.P0,
         )}
       >
        <div className={sameAsEntityForm && gClasses.DisabledField}>
         {getFormHeader(metaData, headerData)}
         <FormBody
            metaData={metaData}
            activeField={activeField}
            activeLayout={activeLayout}
            sections={sections}
            fields={fields}
            formVisibility={formVisibility}
            validationMessage={validationMessage}
            onDropHandler={onDropHandler}
            dispatch={dispatch}
            moduleType={moduleType}
            saveField={saveField}
            userProfileData={userProfileData}
         />
         {getFormFooter(metaData, [])}
        </div>
       </div>

       {/* Right Panel */}
       {moduleType !== MODULE_TYPES.TASK && (
         <div className={cx(style.RightPanel, { [gClasses.H100Imp]: isSummaryForm })}>
          {isSummaryForm && (
            <div className={style.SameData}>
              <Checkbox
                id="same_data_as_datalist"
                size={ECheckboxSize.SM}
                details={{
                  label: `${metaData.flowId ? SAME_DATA.FLOW : SAME_DATA.DATALIST}`,
                  value: 'same_data',
                }}
                isValueSelected={sameAsEntityForm}
                onClick={onChangeSameAsForm}
              />
              {(!isEmpty(flowStepList) && metaData.flowId && sameAsEntityForm) && (
              <div className={gClasses.MT10}>
                <SingleDropdown
                id="flow_step"
                optionList={constructFlowStepList(flowStepList)}
                onClick={onDropdownChangeHandler}
                selectedValue={selectedFlowStep || 'all_steps'}
                dropdownViewProps={
                  {
                      labelName: SELECT_STEP.LABEL,
                  }
                }
                className={cx(gClasses.ZIndex10)}
                />
              </div>
              )}
            </div>
          )}
           <Tab
             className={cx(style.TabContainer, {
              [style.SummaryFormTab]: moduleType === MODULE_TYPES.SUMMARY,
             })}
             disabled={sameAsEntityForm}
             selectedTabIndex={tab}
             onClick={onTabClickHandler}
             options={isSummaryForm ? SUMMARY_TAB_OPTIONS_LIST(t) : TAB_OPTION_LIST}
             selectedStyle={{ zIndex: 6 }}
           />
           {getTabContent()}
            <DeleteConfirmModal
              isModalOpen={isSummaryFormConfirmationModal && !isInitialCustomSummary}
              content={CONFIRM_MODEL.MAIN_CONTENT}
              firstLine={CONFIRM_MODEL.FIRST_LIST}
              secondLine={CONFIRM_MODEL.SECOND_LINE}
              cancelButton={CONFIRM_MODEL.CANCEL_BUTTON}
              DeleteButton={CONFIRM_MODEL.EDIT_BUTTON}
              onDelete={onUpdatedEditFormHandler}
              onCloseModal={onCloseModal}
            />
         </div>
       )}
     </div>
   );
}

export default FormBuilder;
