import { nullCheck } from '../../utils/jsUtility';
import { SECTION_MENU } from './FormBuilder.strings';

export const areAllColumnsReadOnly = (fieldList) => {
  if (fieldList && fieldList.fields && fieldList.fields.length) {
    return !fieldList.fields.some((eachField) => eachField.read_only === false);
  }
  return false;
};
export const areAllColumnsListReadOnly = (fieldList = []) => {
  if (fieldList && fieldList.length) {
    return !fieldList.some((eachField) => eachField.read_only === false);
  }
  return false;
};

export const getSectionRearrangeMenuOptions = (sectionIndex, allSectionsLength, t) => {
  const sectionRearrangeMenuOptions = [];
  if (allSectionsLength > 0 && allSectionsLength !== 1) {
    if (sectionIndex > 0) sectionRearrangeMenuOptions.push(SECTION_MENU(t)[0]);
    if (sectionIndex < allSectionsLength - 1) sectionRearrangeMenuOptions.push(SECTION_MENU(t)[1]);
  }
  return sectionRearrangeMenuOptions;
};

export const isFormDragDisabled = (
  currentSection,
  showFieldDependencyDialog = false,
  showStepDependencyDialog = false,
  showFormDependencyDialog = false,
) => {
  if (showFieldDependencyDialog || showStepDependencyDialog || showFormDependencyDialog) return true;
  if (nullCheck(currentSection, 'field_list.length', true)) {
    return currentSection.field_list.some((eachFieldList) => {
      if (eachFieldList.isFieldListConfigPopupOpen) return true;
      return eachFieldList.fields.some((eachField) => eachField.isConfigPopupOpen === true);
    });
  }
  return false;
};

export default areAllColumnsReadOnly;
