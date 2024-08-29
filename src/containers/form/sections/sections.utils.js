import { MODULE_TYPES } from '../../../utils/Constants';
import { cloneDeep, findLastIndex, isEmpty, isFiniteNumber } from '../../../utils/jsUtility';
import { COMMA, EMPTY_STRING, UNDERSCORE } from '../../../utils/strings/CommonStrings';
import { FORM_LAYOUT_TYPE } from '../Form.string';
import { getModuleIdByModuleType } from '../Form.utils';
import { constructFlatStructure, createNewRowIfLayoutLastRowNotEmpty, createNewRowIfSectionsLastRowNotEmpty, getLayoutByPath, removeAllEmptyLayoutExcludingLast, replaceLayout } from './form_layout/FormLayout.utils';

export const LAYOUT_ACTIONS = {
  ADD_EXTRA_ROW: 'add',
  DELETE_EMPTY_ROW: 'delete',
};

export const constructSaveFormContentData = (section, metaData, moduleType) => {
    const { layout, section_uuid } = cloneDeep(section);
    const { stepId } = metaData;

    const data = {
      ...getModuleIdByModuleType(metaData, moduleType),
      form_uuid: metaData.formUUID,
      section_uuid: section_uuid,
      delete_is_empty_container: false,
      contents: [],
    };

    if (moduleType === MODULE_TYPES.FLOW) {
        data.step_id = stepId;
    }
    const content = constructFlatStructure(layout, '');
    data.contents = content;
    return data;
};

export const updateLayoutBasedOnActionAndPath = (section, noOfColumn, path, action) => {
  if (!action) return section;

  const clonedSection = cloneDeep(section);
  let layout = clonedSection?.layout;

  const splittedPath = path.split(COMMA);
  const lastRowidk = findLastIndex(splittedPath, (eachPath) => eachPath.includes(FORM_LAYOUT_TYPE.ROW));
  const pathArray = splittedPath.slice(0, lastRowidk);

  let containerLayout = null;

  if (!isEmpty(pathArray)) {
    containerLayout = getLayoutByPath(clonedSection?.layout, pathArray.join(COMMA));
    layout = containerLayout.children;
  }

  switch (action) {
   case LAYOUT_ACTIONS.ADD_EXTRA_ROW:
      layout = createNewRowIfLayoutLastRowNotEmpty(layout, noOfColumn) || layout;
      break;
   case LAYOUT_ACTIONS.DELETE_EMPTY_ROW:
      layout = removeAllEmptyLayoutExcludingLast(layout);
      break;
   default: break;
  }

  if (!isEmpty(pathArray)) {
    containerLayout.children = layout;
    const indexToUpdateContainer = Number(pathArray?.[pathArray.length - 1]?.split(UNDERSCORE)?.[0]);
    const containerPath = pathArray.slice(0, -1).join(COMMA);
    if (isFiniteNumber(indexToUpdateContainer)) {
      layout = replaceLayout(clonedSection?.layout, containerPath, [], indexToUpdateContainer, containerLayout);
    }
  }
  clonedSection.layout = layout;
  clonedSection.contents = constructFlatStructure(layout);

  return clonedSection;
};

export const getUpdatedOriginalAndPostSectionData = (sections = [], metaData = {}, moduleType = '') => {
  if (isEmpty(sections)) return [];

  const clonedSections = cloneDeep(sections);
  const constructedSections = clonedSections.map((section) => {
    return {
      section_uuid: section?.section_uuid,
      no_of_columns: section?.no_of_columns,
      contents: constructFlatStructure(section?.layout || [], EMPTY_STRING),
     };
  });

  const postData = {
    ...getModuleIdByModuleType(metaData, moduleType),
    sections: constructedSections,
  };

  // delete postData.flow_id;

  if (moduleType === MODULE_TYPES.FLOW) {
    postData.step_id = metaData?.stepId;
  } else if (moduleType === MODULE_TYPES.SUMMARY) {
    delete postData.dashboard_id;
    delete postData.data_list_id;
    delete postData.flow_id;
  }

  return { originalData: constructedSections, postData };
};

export const constructReorderedFieldForMultipleSection = (sections = [], metaData = {}, moduleType = '', action = null) => {
  if (isEmpty(sections)) return [];

  const clonedSections = cloneDeep(sections);
  const clonedOriginalSections = cloneDeep(sections);
  let isChanges = false;

  const constructedSections = clonedSections.map((section, idk) => {
     let layout = section?.layout;
     switch (action) {
      case LAYOUT_ACTIONS.ADD_EXTRA_ROW:
         layout = createNewRowIfSectionsLastRowNotEmpty(layout, section.no_of_columns) || section?.layout;
         break;
      case LAYOUT_ACTIONS.DELETE_EMPTY_ROW:
         layout = removeAllEmptyLayoutExcludingLast(layout);
         break;
      default: break;
     }
     if (JSON.stringify(layout) !== JSON.stringify(section?.layout)) isChanges = true;

     const constructedSection = {
      section_uuid: section?.section_uuid,
      no_of_columns: section?.no_of_columns,
      contents: constructFlatStructure(layout || [], EMPTY_STRING),
     };
     clonedOriginalSections[idk].layout = layout;
     clonedOriginalSections[idk].contents = cloneDeep(constructedSection.contents);
     return constructedSection;
  });

  const postData = {
    ...getModuleIdByModuleType(metaData, moduleType),
    // form_uuid: metaData.formUUID,
    sections: constructedSections,
  };

  if (moduleType === MODULE_TYPES.SUMMARY) {
    delete postData.data_list_id;
    delete postData.flow_id;
    delete postData.dashboard_id;
  }

  // delete postData.flow_id; // step_id is needed, flow_id is not needed;

  if (moduleType === MODULE_TYPES.FLOW) {
    postData.step_id = metaData?.stepId;
  }

  return [clonedOriginalSections, postData, isChanges];
};
