import * as ReactDOMServer from 'react-dom/server';
import { isEmpty, cloneDeep, set, compact, omit, isFiniteNumber, groupBy, get, findLastIndex, isBoolean } from '../../../../utils/jsUtility';
import { FORM_FIELD_ROW_HEIGHT } from './FormLayout.string';
import { FIELD_TYPE } from '../../../../utils/constants/form.constant';
import { FIELD_ACTION_TYPE, FORM_LAYOUT_TYPE, VALUE_CONFIG_TYPES } from '../../Form.string';
import { COMMA, EMPTY_STRING, UNDERSCORE } from '../../../../utils/strings/CommonStrings';
import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from '../../../../utils/constants/form/form.constant';
import { GET_COLUMN_LAYOUT_TEMPLATE, GET_ROW_LAYOUT_TEMPLATE } from '../../layout/Layout.constant';
import { getNewRowWithColumns } from '../../layout/Layout.utils';
import { normalizer } from '../../../../utils/normalizer.utils';
import { FIELD_TYPES } from '../field_configuration/FieldConfiguration.strings';
import { removeFieldAndDocIds } from '../../../../components/information_widget/InformationWidget.utils';
import { FORM_DATA } from '../../Form.utils';
import { MODULE_TYPES } from '../../../../utils/Constants';
import { SUMMARY_FIELD_LIST_TYPES, VALUE_CONFIG_TYPE } from '../../../shared_container/individual_entry/summary_builder/Summary.constants';
import { VISIBILITY_TYPES } from '../../form_builder/form_footer/FormFooter.constant';

export const getWidth = (containerWidth = 0, margin = [0, 0], cols = null) => {
    if (
        containerWidth > 0 &&
        cols
    ) {
        const currentColumnCount = cols;
        const width = (containerWidth - (margin[0] * (currentColumnCount + 1))) / currentColumnCount;
        return width;
    }
   return null;
};

export const getHeight = (component = null, width = 0, minH = 0) => {
    if (isEmpty(component)) return FORM_FIELD_ROW_HEIGHT;

    const value = ReactDOMServer.renderToString(component);

    const element = document.createElement('div');
    element.innerHTML = value;
    if (width > 0) element.style.width = `${width}px`;

    document.body.appendChild(element);
    const height = element.clientHeight;
    document.body.removeChild(element);

    if (!minH) minH = 0;

    return height < (minH * FORM_FIELD_ROW_HEIGHT) ? FORM_FIELD_ROW_HEIGHT : height;
};

// find i in two different layout and map field object.
export const getMappedLayout = (layoutsWithField, layouts) => {
    if (isEmpty(layouts)) return layoutsWithField;

   const layoutMap = new Map();
   layouts.forEach((eachLayout) => layoutMap.set(eachLayout.i, eachLayout));

   layoutsWithField.forEach((eachLayout) => {
       const existingLayout = cloneDeep(layoutMap.get(eachLayout?.i));
       if (eachLayout?.field) set(existingLayout, ['field'], eachLayout?.field);
       layoutMap.set(eachLayout?.i, existingLayout);
   });

  return compact(Array.from(layoutMap.values())).map(
    (eachLayout, index) => {
        const clonedLayout = cloneDeep(eachLayout);
        clonedLayout.i = index;
        set(clonedLayout, ['i'], `${index + 1}`);
        set(clonedLayout, ['field', 'coordinates'], omit(clonedLayout, ['field']));
        return clonedLayout;
    });
};

export const getLayout = (fields, enableDynamicHeight = false, singleColumnWidth, getComponent = null) => {
    if (isEmpty(fields)) return [];

    return fields.map((eachFields) => {
        const coordinates = { ...eachFields?.coordinates };

        if (enableDynamicHeight) {
            let component;
            if (eachFields.type === FIELD_TYPE.INFORMATION) component = eachFields?.default_value;
            else component = getComponent?.({ field: eachFields });

            const width = (singleColumnWidth * (eachFields?.coordinates?.w || 1));

            const height = getHeight(component, width, eachFields?.coordinates?.minH);

            coordinates.h = Math.ceil(height / FORM_FIELD_ROW_HEIGHT);
            coordinates.maxH = coordinates.h;
         }

        const field = { ...coordinates, field: { ...eachFields, coordinates } };
        return field;
    });
};

export const getPlaceholderCount = (layout = [], col = null) => {
    if (isEmpty(layout) || !isFiniteNumber(col)) return 0;

    let maxH = 0;
    for (let i = 0; i < layout.length; i++) {
       if ((layout[i].y + layout[i].h) > maxH) {
         maxH = layout[i].y + layout[i].h;
     }
    }
    return maxH * col;
 };

/** ********************** Utility Functions ********************** */

const constructTree = (grouppedData = {}, nodes = []) => {
    if (nodes.length < 1) return [];
    return nodes.map((node) => {
       const consolidatedNode = { ...node };
       consolidatedNode.children = constructTree(grouppedData, grouppedData[node?.node_uuid]);
       delete consolidatedNode.parent_node_uuid;
       return consolidatedNode;
    });
};

const updateListBasedOnOrder = (children = [], object = {}, isReplace = false) => {
    const deleteCount = isReplace ? 1 : 0;
    children.splice(object.order - 1, deleteCount, object);
    const clonedChildren = cloneDeep(children);
    for (let i = 1; i <= children.length; i++) {
        clonedChildren[i - 1].order = i;
    }
    return clonedChildren;
};

export const constructSinglePath = (idk, type) => `${idk}_${type}`;

export const isRowLayoutEmpty = (rowLayout = {}) => {
    const clonedRow = cloneDeep(rowLayout);
    if (isEmpty(clonedRow)) return true;
    if (isEmpty(clonedRow?.children) || !Array.isArray(clonedRow?.children)) return true;

    return (clonedRow?.children || []).every((column) => isEmpty(column?.children));
};

export const formLayoutUpdator = (overallLayout, existingColumnLayout, expectedColumnLayout) => {
    if (existingColumnLayout === expectedColumnLayout) return overallLayout;

    const clonedLayout = cloneDeep(overallLayout);

    let upadtedLayout = [];
    if (existingColumnLayout < expectedColumnLayout) {
        upadtedLayout = clonedLayout.map((row) => {
            const clonedRow = cloneDeep(row);
            if ((clonedRow?.children || []).length > 1) {
                const newColumns = clonedRow?.children || [];
                for (let columnOrder = existingColumnLayout + 1; columnOrder <= expectedColumnLayout; columnOrder++) {
                      newColumns.push(GET_COLUMN_LAYOUT_TEMPLATE(clonedRow?.node_uuid, columnOrder));
                }
                clonedRow.children = newColumns;
            }
            return clonedRow;
        });
    } else {
        let rowOrder = 1;
        clonedLayout.forEach((row) => {
            const clonedRow = cloneDeep(row);
            const columns = get(clonedRow, ['children'], []);
            const columnCount = columns.length;
            clonedRow.order = rowOrder++;
            if (columnCount > 1) {
               clonedRow.children = columns.slice(0, expectedColumnLayout);
               upadtedLayout.push(clonedRow);

               const extraRow = GET_ROW_LAYOUT_TEMPLATE();
               extraRow.order = rowOrder++;
               let extraColumns = columns.slice(expectedColumnLayout) || [];
               let isAllColumnsEmpty = true;
               for (let existingColumn = 0; (existingColumn < extraColumns.length && isAllColumnsEmpty); existingColumn++) {
                    if (!isEmpty(get(extraColumns, [existingColumn, 'children'], []))) {
                        isAllColumnsEmpty = false;
                    }
               }

               if (!isAllColumnsEmpty) {
                    for (let columnOrder = extraColumns.length; columnOrder < expectedColumnLayout; columnOrder++) {
                        extraColumns.push(GET_COLUMN_LAYOUT_TEMPLATE(extraRow?.node_uuid, columnOrder));
                    }

                    extraColumns = extraColumns.map((eachColumn, idk) => {
                        return {
                            ...eachColumn,
                            order: idk + 1,
                        };
                    });

                    extraRow.children = extraColumns;
                    upadtedLayout.push(extraRow);
                }
            } else {
              upadtedLayout.push(clonedRow);
            }
        });
    }

    upadtedLayout.forEach((layout, idx) => {
       layout.order = idx + 1;
    });

    return upadtedLayout;
};

export const singleFormDragAndDropHandler = (
    overallLayout,
    sourcePath = '',
    destinationPath = '',
    currentPath = [],
    layoutToBeMoved,
) => {
    if (overallLayout.length < 1) return [];

    return overallLayout.map((eachLayout, eachLayoutIdk) => {
        if (
            sourcePath.startsWith([...currentPath, constructSinglePath(eachLayoutIdk, eachLayout?.type)]) ||
            destinationPath.startsWith([...currentPath, constructSinglePath(eachLayoutIdk, eachLayout?.type)])
        ) {
            eachLayout.children = singleFormDragAndDropHandler(eachLayout.children, sourcePath, destinationPath, currentPath, layoutToBeMoved);
         }
         return eachLayout;
        });
};

// Convert flat to tree
export const constructTreeStructure = (flat = [], rootLabel = EMPTY_STRING) => {
    const root = isEmpty(rootLabel) ? FORM_LAYOUT_TYPE.ROOT : rootLabel;
    const preProcessedFlat = flat.map((eachFlateNode) => {
         if (!get(eachFlateNode, ['parent_node_uuid'], null)) {
            return { ...eachFlateNode, parent_node_uuid: FORM_LAYOUT_TYPE.ROOT };
         }
         return eachFlateNode;
    });
    const grouppedData = groupBy(preProcessedFlat, (eachFlat) => eachFlat.parent_node_uuid);
    const rootNode = grouppedData[root];
    const totalTree = constructTree(grouppedData, rootNode);
    return totalTree;
};

// Convert tree to flat
export const constructFlatStructure = (tree = [], parent_uuid) => {
    if (tree.length < 1) return [];
    const clonedTree = cloneDeep(tree);
    const data = clonedTree.map((node) => {
       const consolidatedNode = constructFlatStructure(node.children, node?.node_uuid);
       if (parent_uuid) node.parent_node_uuid = parent_uuid;
       delete node.children;
       delete node.external_source_uuid;
       delete node.autoFill;
       return [node, consolidatedNode].flat();
    });
    return data.flat();
};

// Add Layout
export const addLayout = (
    overallLayout = [],
    overallPath = EMPTY_STRING,
    currentPath = [],
    index,
    layoutToBeAdded = {},
) => {
    const clonedOverallLayout = cloneDeep(overallLayout);
    if (overallPath === [...currentPath].join(COMMA)) {
        return updateListBasedOnOrder([...(clonedOverallLayout || [])], { ...layoutToBeAdded, order: index + 1 });
    }

    if (clonedOverallLayout.length === 0) return [];

    return clonedOverallLayout.map((eachLayout, eachLayoutIdk) => {
       if (overallPath.startsWith([...currentPath, constructSinglePath(eachLayoutIdk, eachLayout.type)].join(COMMA))) {
         currentPath.push(constructSinglePath(eachLayoutIdk, eachLayout.type));
         eachLayout.children = addLayout(eachLayout?.children, overallPath, currentPath, index, layoutToBeAdded);
       }
       return eachLayout;
    });
};

// Replace Layout
export const replaceLayout = (
    overallLayout = [],
    overallPath = EMPTY_STRING,
    currentPath = [],
    index,
    layoutToBeAdded = {},
) => {
    const clonedOverallLayout = cloneDeep(overallLayout);
    if (overallPath === [...currentPath].join(COMMA)) {
        return updateListBasedOnOrder([...(clonedOverallLayout || [])], { ...layoutToBeAdded, order: index + 1 }, true);
    }

    if (clonedOverallLayout.length === 0) return [];

    return clonedOverallLayout.map((eachLayout, eachLayoutIdk) => {
       if (overallPath.startsWith([...currentPath, constructSinglePath(eachLayoutIdk, eachLayout.type)].join(COMMA))) {
         currentPath.push(constructSinglePath(eachLayoutIdk, eachLayout.type));
         eachLayout.children = replaceLayout(eachLayout?.children, overallPath, currentPath, index, layoutToBeAdded);
       }
       return eachLayout;
    });
};

// Delete Layout
export const deleteLayout = (
    overallLayout = [],
    overallPath = EMPTY_STRING,
    currentPath = [],
    index,
) => {
    const clonedOverallLayout = cloneDeep(overallLayout);
    if (overallPath === [...currentPath].join(COMMA)) {
        const clonedArray = cloneDeep(clonedOverallLayout);
        clonedArray.splice(index, 1);
        return clonedArray;
    }

    if (clonedOverallLayout.length === 0) return [];

    return clonedOverallLayout.map((eachLayout, eachLayoutIdk) => {
       if (overallPath.startsWith([...currentPath, constructSinglePath(eachLayoutIdk, eachLayout.type)].join(COMMA))) {
         currentPath.push(constructSinglePath(eachLayoutIdk, eachLayout.type));
         eachLayout.children = deleteLayout(eachLayout?.children, overallPath, currentPath, index);
       }
       return eachLayout;
    });
};

// Drag and Drop
export const singleSectionLayoutDragAndDropHandler = (
    overallLayout = [],
    sourcePath = EMPTY_STRING,
    sourceIdk = 0,
    destinationPath = EMPTY_STRING,
    destinationIdk = 0,
    layoutToBeMoved = {},
) => {
    if (overallLayout.length < 1) return [];

    const updatedSourceLayout = deleteLayout(overallLayout, sourcePath, [], sourceIdk);
    const updatedDestLayout = addLayout(updatedSourceLayout, destinationPath, [], destinationIdk, layoutToBeMoved);
    return updatedDestLayout;
};

export const multiSectionLayoutDragAndDropHandler = (
    sourceLayout = [],
    sourcePath = EMPTY_STRING,
    sourceIdk = 0,
    destinationLayout = [],
    destinationPath = EMPTY_STRING,
    destinationIdk = 0,
    layoutToBeMoved = {},
) => {
    if (sourceLayout.length < 1 && destinationLayout.length < 1) return [];

    const updatedSourceLayout = deleteLayout(sourceLayout, sourcePath, [], sourceIdk);
    const updatedDestLayout = addLayout(destinationLayout, destinationPath, [], destinationIdk, layoutToBeMoved);

    return [updatedSourceLayout, updatedDestLayout];
};

export const getPathAndIndex = (path) => {
   if (isEmpty(path)) return [];

   const idk = +path.slice(path.lastIndexOf(COMMA) + 1, path.length).split('_')[0];

   if (Number.isNaN(idk)) return [];

   let consolidatedPath = EMPTY_STRING;
   if (path.lastIndexOf(COMMA) > -1) {
    consolidatedPath = path.slice(0, path.lastIndexOf(COMMA));
  } else consolidatedPath = EMPTY_STRING;

  return [idk, consolidatedPath];
};

export const formDragAndDrop = (
    source = {
        sectionUUID: EMPTY_STRING,
        path: EMPTY_STRING,
        layout: [],
    },
    destination = {
        sectionUUID: EMPTY_STRING,
        path: EMPTY_STRING,
        layout: [],
        layoutToBeMoved: {},
    },
    isAcrossSection = false,
) => {
   let sourcePath = source?.path || EMPTY_STRING;
   let destPath = destination?.path || EMPTY_STRING;

   if (isEmpty(sourcePath) || isEmpty(destPath)) return [source?.layout, destination?.layout];

    const sourceIdk = +sourcePath.slice(sourcePath.lastIndexOf(COMMA) + 1, sourcePath.length).split('_')[0];
    const destIdk = +destPath.slice(destPath.lastIndexOf(COMMA) + 1, destPath.length).split('_')[0];

   if (Number.isNaN(sourceIdk) || Number.isNaN(destIdk)) return [source?.layout, destination?.layout];

    if (sourcePath.lastIndexOf(COMMA) > -1) {
      sourcePath = sourcePath.slice(0, sourcePath.lastIndexOf(COMMA));
    } else sourcePath = EMPTY_STRING;

    if (destPath.lastIndexOf(COMMA) > -1) {
        destPath = destPath.slice(0, destPath.lastIndexOf(COMMA));
    } else destPath = EMPTY_STRING;

   if (isAcrossSection) {
     const updatedArray = multiSectionLayoutDragAndDropHandler(
        (source?.layout || []), sourcePath, sourceIdk, (destination?.layout || []), destPath, destIdk, destination?.layoutToBeMoved,
     );
     return {
        [source?.sectionUUID]: updatedArray[0],
        [destination?.sectionUUID]: updatedArray[1],
     };
   }

    const singleFormLayout = singleSectionLayoutDragAndDropHandler(
        source?.layout, sourcePath, sourceIdk, destPath, destIdk, destination?.layoutToBeMoved,
    );

    return {
       [source?.sectionUUID]: singleFormLayout,
    };
};

export const checkIsDndAcrossSection = (source = {}, destination = {}) => {
    if (!isEmpty(source) && !isEmpty(destination)) {
        return (source?.sectionUUID !== destination?.sectionUUID);
    }
   return false;
};

export const removeAllEmptyLayoutExcludingLast = (layouts = []) => {
   if (isEmpty(layouts) || layouts.length < 2) return layouts;

   const consolidatedLayouts = [];

   layouts.slice(0, -1).forEach((eachLayout) => {
       if (!isRowLayoutEmpty(eachLayout)) consolidatedLayouts.push(eachLayout);
   });

   consolidatedLayouts.push(layouts[layouts.length - 1]);

   return consolidatedLayouts;
};

export const getLayoutBasedOnSection = (sections = [], requiredSectionslayout = []) => {
    if (isEmpty(requiredSectionslayout)) return {};

    const requiredLayouts = {};

    requiredSectionslayout.forEach((eachSectionUUID) => {
        if (!eachSectionUUID) return;

        const currentSection = sections.find((section) => section[REQUEST_FIELD_KEYS.SECTION_UUID] === eachSectionUUID);
        if (currentSection) {
            requiredLayouts[currentSection[REQUEST_FIELD_KEYS.SECTION_UUID]] = currentSection[
                RESPONSE_FIELD_KEYS.LAYOUT];
        }
    });

    return requiredLayouts;
};

// export const loadUpadatedLayoutInSections = (sections = [], sectionBasedUpdatedLayout = {}, pathToUpdateLayout = {}) => {
//     let clonedSections = cloneDeep(sections);
//     const allSectionKeys = Object.keys(sectionBasedUpdatedLayout);
//     clonedSections = clonedSections.map((section) => {
//         const sectionUUID = section[REQUEST_FIELD_KEYS.SECTION_UUID];
//         if (allSectionKeys.includes(sectionUUID)) {
//             const path = pathToUpdateLayout?.[sectionUUID];
//             let layout = sectionBasedUpdatedLayout[sectionUUID];
//             if (path) {
//                layout = getLayout(layout, path);
//             }
//             return {
//                 ...section,
//                 [RESPONSE_FIELD_KEYS.LAYOUT]: removeAllEmptyLayoutExcludingLast(layout),
//             };
//         }
//         return section;
//     });
//     return clonedSections;
// };

export const getLayoutByPath = (layout, path) => {
    const getLayout = (layout, path) => {
        if (!path.length) {
          return null;
        }

        const currentIndex = path[0];
        if (currentIndex >= 0 && currentIndex < layout?.length) {
          const currentNode = layout[currentIndex];

          if (path.length === 1) {
            return currentNode;
          } else {
            const nextData = currentNode.children || [];
            const nextPath = path.slice(1);
            return getLayout(nextData, nextPath);
          }
        }

        return null;
    };
    const pathArray = path.split(',').map((x) => parseInt(x.split('_')[0], 10));
    const subLayout = getLayout(layout, pathArray);
    return subLayout;
};

// source, destination hold structure of { layout, path, sectionUUID }.
export const loadUpdatedLayoutInSectionForDND = (overallSections = [], source = {}, destination = {}) => {
    let clonedSections = cloneDeep(overallSections);
    // const allSectionKeys = compact([source?.sectionUUID, destination?.sectionUUID]);
    clonedSections = clonedSections.map((section) => {
        const currentSectionUUID = section[REQUEST_FIELD_KEYS.SECTION_UUID];
        if (currentSectionUUID === source?.sectionUUID) {
            const splittedPath = source?.path.split(COMMA);
            const lastRowidk = findLastIndex(splittedPath, (eachPath) => eachPath.includes(FORM_LAYOUT_TYPE.ROW));
            const pathArray = splittedPath.slice(0, lastRowidk); // Path to container of last nested row.

            let layout = cloneDeep(source?.layout);
            let conatinerLayout = null; // container mean wrapper layout of row.
            if (!isEmpty(pathArray)) {
                conatinerLayout = getLayoutByPath(layout, pathArray.join(COMMA));
                layout = conatinerLayout?.children;
            }

            let modifiedLayout = removeAllEmptyLayoutExcludingLast(layout);
            if (!isEmpty(pathArray)) {
                // path = 0_conatiner,0_column,10_box,
                // containerPath sending to replaceLayout is 0_conatiner,0_column and index is 10.
                conatinerLayout.children = modifiedLayout;
                const indexToUpdateContainer = Number(pathArray?.[pathArray.length - 1]?.split(UNDERSCORE)?.[0]);
                const containerPath = pathArray.slice(0, -1).join(COMMA);
                if (isFiniteNumber(indexToUpdateContainer)) {
                    modifiedLayout = replaceLayout(source?.layout, containerPath, [], indexToUpdateContainer, conatinerLayout);
                }
            }

            return {
                ...section,
                [RESPONSE_FIELD_KEYS.LAYOUT]: modifiedLayout,
            };
        }
        if (currentSectionUUID === destination?.sectionUUID) {
            return { ...section, [RESPONSE_FIELD_KEYS.LAYOUT]: destination?.layout };
        }
        return section;
    });
    return clonedSections;
};

export const constructNeededFieldDataForLayout = (field = {}, fieldActionType = FIELD_ACTION_TYPE.FIELD) => {
    const layout = {
        type: FORM_LAYOUT_TYPE.FIELD,
        node_uuid: field?.node_uuid,
        field_uuid: field[RESPONSE_FIELD_KEYS.FIELD_UUID],
        order: 1,
        children: [],
    };

    if (fieldActionType === FIELD_ACTION_TYPE.TABLE) {
        layout.type = FORM_LAYOUT_TYPE.TABLE;
    }

    return layout;
};

// to be verified with Nandha
// export const createNewRowIfSectionsLastRowNotEmpty = (layout = [], noOfColumns = MAX_COLUMN_LAYOUT_LIMIT) => {
//     if (isEmpty(layout)) return layout;

//     const lastRowIdk = (layout?.length || 0) - 1;
//     if (!(lastRowIdk > -1)) return layout;

//     let clonedLayout = cloneDeep(layout);
//     const row = getNewRowWithColumns(noOfColumns);
//     row.order = lastRowIdk + 1;

//     if (!isRowLayoutEmpty(get(clonedLayout, [lastRowIdk], []))) {
//         clonedLayout = [...clonedLayout, row];
//     }

//     return clonedLayout;
// };

export const createNewRowIfSectionsLastRowNotEmpty = (section = {}) => {
    if (isEmpty(section)) return section;

    const clonedSection = cloneDeep(section);
    const layout = clonedSection?.layout || [];
    const lastRowIdk = (layout?.length || 0) - 1;

    if (!(lastRowIdk > -1)) return section;

    const row = getNewRowWithColumns(clonedSection?.no_of_columns);
    row.order = lastRowIdk + 1;

    if (!isRowLayoutEmpty(get(layout, [lastRowIdk], []))) {
        clonedSection.layout = [...layout, row];
    }

    return clonedSection;
};

export const createNewRowIfLayoutLastRowNotEmpty = (_layout, noOfColumn) => {
    if (isEmpty(_layout)) return _layout;

    let layout = cloneDeep(_layout) || [];
    const lastRowIdk = (layout?.length || 0) - 1;

    if (!(lastRowIdk > -1)) return _layout;

    const row = getNewRowWithColumns(noOfColumn);
    row.order = lastRowIdk + 1;

    if (!isRowLayoutEmpty(get(layout, [lastRowIdk], []))) {
        layout = [...layout, row];
    }

    return layout;
};

const getNodeUuidFromPath = (data, path) => {
    if (!path.length) {
      return null;
    }

    const currentIndex = path[0];
    if (currentIndex >= 0 && currentIndex < data.length) {
      const currentNode = data[currentIndex];

      if (path.length === 1) {
        return currentNode.node_uuid;
      } else {
        const nextData = currentNode.children || [];
        const nextPath = path.slice(1);
        return getNodeUuidFromPath(nextData, nextPath);
      }
    }

    return null;
};

export const getParentNodeUuidFromTree = (sectionData, path) => {
    const pathArray = path.split(',').map((x) => parseInt(x.split('_')[0], 10));
    if (!isEmpty(pathArray)) {
        return {
            parentNodeUuid: getNodeUuidFromPath(sectionData?.layout, pathArray?.slice(0, -1)),
            fieldOrder: pathArray[pathArray.length - 1] + 1,
        };
    }
    return {
        parentNodeUuid: EMPTY_STRING,
        fieldOrder: 1,
    };
};

export const getSectionFieldsFromLayout = (obj, parent_node_uuid = null, result = []) => {
    const flattenedObj = {
        node_uuid: obj.node_uuid,
        type: obj.type,
        order: obj.order,
        parent_node_uuid: parent_node_uuid,
    };

    if (obj.type === FORM_LAYOUT_TYPE.FIELD) result.push(flattenedObj);
    if (obj?.children) {
        obj.children.forEach((child) => {
            getSectionFieldsFromLayout(child, obj.node_uuid, result);
        });
    }

    return result;
};

export const removeAllEmptyLayouts = (layouts) => {
    const updatedLayouts = [];

    layouts.forEach((rowLayout) => {
        if (!isRowLayoutEmpty(rowLayout)) {
            const updatedRowLayout = { ...rowLayout };
            const rowLayoutChildren = [];
            rowLayout.children.forEach((colLayout) => {
                if (!isEmpty(colLayout.children)) {
                    rowLayoutChildren.push(colLayout);
                }
            });
            updatedRowLayout.children = rowLayoutChildren;
            updatedLayouts.push(updatedRowLayout);
        }
    });

    return updatedLayouts;
};

export const getSummaryFieldDataByMetaData = (field, triggerDetails = [], isUserMode = false) => {
  const fieldData = {
    [RESPONSE_FIELD_KEYS.FIELD_UUID]: field.field_uuid,
    [RESPONSE_FIELD_KEYS.FIELD_ID]: field.field_id ?? field._id,
    [RESPONSE_FIELD_KEYS.FIELD_NAME]: field.name,
    [RESPONSE_FIELD_KEYS.FIELD_TYPE]: field.field_type,
    [RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES]: field.field_list_type,
    [RESPONSE_FIELD_KEYS.FIELD_SOURCE_TYPE]: field.value_config?.type,
  };

  // addition config
  if (!isEmpty(field.help_text)) {
    fieldData[RESPONSE_FIELD_KEYS.HELP_TEXT] = field.help_text;
  }
  if (!isEmpty(field.instructions)) {
    fieldData[RESPONSE_FIELD_KEYS.INSTRUCTION] = field.instructions;
  }
  if (!isEmpty(field.visibility_rule)) {
    fieldData[RESPONSE_FIELD_KEYS.RULE_UUID] = field.visibility_rule; // rule uuid
  }
  if (isBoolean(field.hide_field_if_null)) {
    fieldData[RESPONSE_FIELD_KEYS.HIDE_FIELD_IF_NULL] = field.hide_field_if_null;
  }

  if (
    [FIELD_TYPE.RICH_TEXT, FIELD_TYPE.INFORMATION].includes(fieldData.fieldType)
  ) {
    fieldData[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT] = {
      [RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE]:
        field?.information_content?.editor_template,
      [RESPONSE_FIELD_KEYS.RENDERING_TEMPLATE]:
        field?.information_content?.rendering_template,
    };
    fieldData[RESPONSE_FIELD_KEYS.BACKGROUND_COLOR] = field?.bg_color;
    if (field.field_type === FIELD_TYPE.INFORMATION) {
      fieldData[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID] =
        field?.value_config?.value;
      if (field.field_list_type === SUMMARY_FIELD_LIST_TYPES.TABLE) {
        fieldData[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID] =
          field?.value_config?.child_data;
        fieldData[RESPONSE_FIELD_KEYS.TABLE_UUID] = field.table_uuid;
      }
    }
  } else if (field.field_type === FIELD_TYPE.BUTTON_LINK) {
    fieldData.buttonActionType = field.button_config.button_type;
    fieldData.buttonStyle = field.button_config.style;
    fieldData.linkURL = field.button_config.link_url;
    fieldData.triggerUUID = field.button_config.trigger_uuid;
    fieldData.buttonName = field.name;
    if (!isEmpty(triggerDetails)) {
      const triggerData = triggerDetails.find((data) => data.trigger_uuid === fieldData.triggerUUID);
      if (!isEmpty(triggerData)) {
        fieldData.childFlowUUID = triggerData.child_flow_uuid;
      }
    }
  } else if (field.field_type === FIELD_TYPE.IMAGE) {
    fieldData.imageId = field?.value_config?.doc_id;
  } else {
    if (isUserMode && isBoolean(field?.is_digit_formatted)) {
      fieldData[RESPONSE_FIELD_KEYS.IS_DIGIT_FORMATTED] = field.is_digit_formatted;
    }
    fieldData[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID] =
      field?.value_config?.value;
    if (field.field_list_type === SUMMARY_FIELD_LIST_TYPES.TABLE) {
      fieldData[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID] =
        field?.value_config?.child_data;
      fieldData[RESPONSE_FIELD_KEYS.TABLE_UUID] = field.table_uuid;
    }
    const isPickerField = [
      FIELD_TYPE.DATA_LIST,
      FIELD_TYPE.USER_TEAM_PICKER,
    ].includes(field.field_type);
    if (isPickerField || (!isPickerField && field.show_property)) {
      fieldData.showProperty = field.show_property;
      if (field.show_property) {
        fieldData.dataListPickerFieldUUID = field.value_config.child_data;
        fieldData.datalistPickerFieldName = field.name;
        fieldData.datalistPickerFieldType = field.field_type;
        fieldData.datalistPickerUUID = field.value_config.value;
        if (field.field_list_type === 'table') {
          fieldData.selectedFieldUUID = field?.value_config?.value;
        }
        if (!isUserMode) {
          fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE] =
            FIELD_TYPE.DATA_LIST_PROPERTY_PICKER;
        }
      }
    }
  }
  // system fields
  if (field?.value_config?.type === VALUE_CONFIG_TYPE.SYSTEM_FIELD) {
    fieldData[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES] = SUMMARY_FIELD_LIST_TYPES.DIRECT;
  } else if (field?.value_config?.type === VALUE_CONFIG_TYPE.EXTERNAL_DATA) {
    fieldData[RESPONSE_FIELD_KEYS.SELECTED_EXTERNAL_RULE_UUID] = field.value_config.value;
    fieldData[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID] = field.value_config.child_data;
  }
  return fieldData;
};

export const getSectionAndFieldsFromResponse = (sections, moduleType = null) => {
  const fields = {};
  const updatedSections = sections.map((s) => {
    const section = {
      ...s,
      layout: constructTreeStructure(s.contents),
    };

    s?.field_metadata?.forEach((f) => {
      if (moduleType === MODULE_TYPES.SUMMARY) {
        const field = getSummaryFieldDataByMetaData(f);
        fields[field[RESPONSE_FIELD_KEYS.FIELD_UUID]] = field;
      } else {
      const field = normalizer(cloneDeep(f), REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS);
      const fieldUUID = field[RESPONSE_FIELD_KEYS.FIELD_UUID];

      if (field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.INFORMATION) {
        const { rawHtml, renderedTemplate } = removeFieldAndDocIds({ data: field?.[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT]?.[RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE], isPostData: false });
        field[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT] = {
            [RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE]: rawHtml,
            [RESPONSE_FIELD_KEYS.RENDERING_TEMPLATE]: renderedTemplate,
        };
      }

      fields[fieldUUID] = field;
      }
    });

    return section;
  });

  return { sections: updatedSections, fields };
};

export const getUpdatedSectionAndFieldsFromResponseaaa = (sections = [], data) => {
    const fieldss = {};
    const updatedSections = sections?.map((s) => {
      const section = {
        ...s,
        field_metadata: data,
        layout: constructTreeStructure(s.contents),
      };
      data?.forEach((f) => {
        const field = normalizer(cloneDeep(f), REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS);
        const fieldUUID = field[RESPONSE_FIELD_KEYS.FIELD_UUID];
        if (field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.INFORMATION) {
          const { rawHtml, renderedTemplate } = removeFieldAndDocIds({ data: field?.[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT]?.[RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE], isPostData: false });
          field[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT] = {
              [RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE]: rawHtml,
              [RESPONSE_FIELD_KEYS.RENDERING_TEMPLATE]: renderedTemplate,
          };
        }
        field.fieldId = f._id;
        fieldss[fieldUUID] = field;
      });
      return section;
    });
    return { section: updatedSections, fieldss };
  };

const constructFieldForEdit = (field = {}) => {
    const constructedField = {
        [RESPONSE_FIELD_KEYS.FIELD_NAME]: field[RESPONSE_FIELD_KEYS.FIELD_NAME],
        [RESPONSE_FIELD_KEYS.FIELD_TYPE]: field[RESPONSE_FIELD_KEYS.FIELD_TYPE],
        [RESPONSE_FIELD_KEYS.READ_ONLY]: field[RESPONSE_FIELD_KEYS.READ_ONLY],
        [RESPONSE_FIELD_KEYS.FIELD_UUID]: field[RESPONSE_FIELD_KEYS.FIELD_UUID],
        [RESPONSE_FIELD_KEYS.FIELD_ID]: field[RESPONSE_FIELD_KEYS.FIELD_ID],
        [RESPONSE_FIELD_KEYS.SECTION_UUID]: field[RESPONSE_FIELD_KEYS.SECTION_UUID],
        [RESPONSE_FIELD_KEYS.REFERENCE_NAME]: field[RESPONSE_FIELD_KEYS.REFERENCE_NAME],
    };

    if (field?.[RESPONSE_FIELD_KEYS.TABLE_UUID]) {
        constructedField[RESPONSE_FIELD_KEYS.TABLE_UUID] = field[RESPONSE_FIELD_KEYS.TABLE_UUID];
    }

    if (field?.[RESPONSE_FIELD_KEYS.PATH]) {
        constructedField[RESPONSE_FIELD_KEYS.PATH] = field[RESPONSE_FIELD_KEYS.PATH];
    }

    if (field?.[RESPONSE_FIELD_KEYS.NODE_UUID]) {
        constructedField[RESPONSE_FIELD_KEYS.NODE_UUID] = field[RESPONSE_FIELD_KEYS.NODE_UUID];
    }
    if (field?.[RESPONSE_FIELD_KEYS.AUTO_FILL] && field?.[RESPONSE_FIELD_KEYS.AUTO_FILL]?.[RESPONSE_FIELD_KEYS.TYPE] === VALUE_CONFIG_TYPES.EXTERNAL_DATA) {
        constructedField[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_ID] = field?.[RESPONSE_FIELD_KEYS.AUTO_FILL]?.[RESPONSE_FIELD_KEYS.CHILD_DATA];
    }
    if (field?.[REQUEST_FIELD_KEYS.AUTO_FILL]) {
        constructedField[REQUEST_FIELD_KEYS.AUTO_FILL] = field?.[REQUEST_FIELD_KEYS.AUTO_FILL];
    }
    return constructedField;
};

export const getTableColumnFromLayout = (layout, fields, sectionUUID) => {
  const columnLayouts = Array.isArray(layout?.children) ? layout?.children : [];
  const sortedFieldLayout = cloneDeep(columnLayouts).sort((a, b) => a.order - b.order);
  const tableUUID = layout?.[REQUEST_FIELD_KEYS.FIELD_UUID];
  const columns = [];
  sortedFieldLayout?.forEach((eachLayout, index) => {
         const field = cloneDeep(fields[eachLayout[REQUEST_FIELD_KEYS.FIELD_UUID]]);
         if (!isEmpty(field)) {
            field[RESPONSE_FIELD_KEYS.TABLE_UUID] = tableUUID;
            field[RESPONSE_FIELD_KEYS.SECTION_UUID] = sectionUUID;
            field[RESPONSE_FIELD_KEYS.NODE_UUID] = eachLayout?.node_uuid;

            const constructedField = constructFieldForEdit(field);
            if (eachLayout?.external_source_uuid) constructedField[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_ID] = eachLayout?.external_source_uuid;
            constructedField.index = index;
            columns.push(constructedField);
        }
  });
  return columns;
};

 export const consolidateTableRowWithPath = (layout = [], path = EMPTY_STRING) => {
    const lastContainer = path.lastIndexOf(FORM_LAYOUT_TYPE.ROW);
    if (lastContainer > -1) {
        const updatedPath = path.slice(0, (lastContainer + (FORM_LAYOUT_TYPE.ROW.length)));
        const currentLayout = getLayoutByPath(layout, updatedPath);
        let extraTableField = null;
        if (!isEmpty(currentLayout)) {
            let tableColumnIdk = -1;
            let tableColumn = null;
            (currentLayout?.children || []).forEach((columnLayout, idk) => {
                  if (get(columnLayout, ['children', '0', 'type'], null) === FORM_LAYOUT_TYPE.TABLE) {
                        tableColumnIdk = idk;
                        tableColumn = cloneDeep(columnLayout);
                  }
            });

            if (tableColumnIdk > -1) set(currentLayout, ['children', tableColumnIdk, 'children'], []);

            if (isRowLayoutEmpty(currentLayout)) {
                currentLayout.children = [tableColumn];
            } else {
                extraTableField = get(tableColumn, ['children', '0'], null);
            }

            return { tableLayout: currentLayout, extraTableField, path: updatedPath };
        }
    }

    return { tableLayout: layout, extraTableField: null, path };
 };

 const findFromLast = (array = [], partialValue = EMPTY_STRING) => {
     for (let eachValueIdk = array.length - 1; eachValueIdk >= 0; eachValueIdk--) {
         if (array[eachValueIdk].includes(partialValue)) return array[eachValueIdk];
     }
     return EMPTY_STRING;
 };

 export const updateLayoutByResize = (
    overallLayouts = FORM_DATA[0].layout,
    path = EMPTY_STRING,
    existingColumnLayout = null,
    columnWidth = 0,
  ) => {
    if (isEmpty(overallLayouts) || !path) return overallLayouts;

    const clonedOverallLayout = cloneDeep(overallLayouts);
    const layoutArray = path.split(COMMA);
    const lastRowIdk = findFromLast(layoutArray, FORM_LAYOUT_TYPE.ROW).split('_')[0] || null;
    const lastColumnIdk = layoutArray[layoutArray.length - 1].split('_')[0] || null;

    if (Number.isNaN(lastRowIdk) || Number.isNaN(lastColumnIdk)) return overallLayouts;

    const lastRowPathIdk = (path || EMPTY_STRING).lastIndexOf(FORM_LAYOUT_TYPE.ROW);
    const containerPath = path.substring(0, lastRowPathIdk + FORM_LAYOUT_TYPE.ROW.length);
    const currentContainer = getLayoutByPath(clonedOverallLayout, containerPath);
    const allColumnLayout = get(currentContainer, ['children'], []);
    const currentColumn = get(allColumnLayout, [lastColumnIdk], {});
    const existingWidth = currentColumn?.width;

    if (existingWidth === columnWidth) return overallLayouts;

    let result = [];
    allColumnLayout[lastColumnIdk].width = columnWidth;

    // true - current size is decreased from previous size.
    // false - current size is increased from previous size.
    if (columnWidth < existingWidth) {
      const widthDiff = existingWidth - columnWidth;
      for (let columnOrder = 1; columnOrder <= widthDiff; columnOrder++) {
        const newColumn = GET_COLUMN_LAYOUT_TEMPLATE(currentContainer?.node_uuid, currentColumn.order + columnOrder);
        newColumn.width = 1;
        allColumnLayout.splice(lastColumnIdk + columnOrder, 0, newColumn);
      }
      currentContainer.children = allColumnLayout;
      result = cloneDeep([currentContainer]);
    } else {
      let emptyColumn = 0;

      (currentContainer.children || [])?.forEach((eachLayout, index) => {
        // On considering only right side; Even empty space on left won't be considered.
        if (index >= lastColumnIdk) {
          if (isEmpty(eachLayout.children)) emptyColumn++;
        }
      });

      // true - no extra row needed.
      // false - extra row needed.
      if (columnWidth - existingWidth <= emptyColumn) {
        let noOfEmptySpacesToBeRemoved = columnWidth - existingWidth;
        let columnLayoutIdk = Number(lastColumnIdk) + 1;
        const indexToBeRemoved = [];
        // To Find the empty spaces index to remove .
        while ((noOfEmptySpacesToBeRemoved > 0) && (columnLayoutIdk <= existingColumnLayout)) {
            if (isEmpty(allColumnLayout[columnLayoutIdk]?.children)) {
                indexToBeRemoved.push(columnLayoutIdk);
                noOfEmptySpacesToBeRemoved--;
            }
            columnLayoutIdk++;
        }
        const consolidatedColumnLayouts = [];
        // Manipulate Column Order.
        for (let colIndex = 0; colIndex < allColumnLayout.length; colIndex++) {
            if (!indexToBeRemoved.includes(colIndex)) {
                allColumnLayout[colIndex].order = colIndex + 1;
                consolidatedColumnLayouts.push(allColumnLayout[colIndex]);
            }
        }
        currentContainer.children = consolidatedColumnLayouts;
        result = cloneDeep([currentContainer]);
      } else {
        let totalWidth = 0;

        const clonedContainerLayout = cloneDeep(currentContainer);
        clonedContainerLayout.children = [];

        const newContainerLayout = GET_ROW_LAYOUT_TEMPLATE();
        let newRowColumnOrder = 1;
        let isNewContainerColumnsEmpty = true;

        allColumnLayout.forEach((eachColumnLayout) => {
          totalWidth += eachColumnLayout.width;
          if (totalWidth <= existingColumnLayout) {
            clonedContainerLayout.children.push(eachColumnLayout);
          } else {
            const clonedLayout = cloneDeep(eachColumnLayout);
            clonedLayout.parent_node_uuid = newContainerLayout.node_uuid;
            clonedLayout.order = newRowColumnOrder++;
            newContainerLayout.children.push(clonedLayout);
            if (!isEmpty(clonedLayout?.children)) isNewContainerColumnsEmpty = false;
          }
        });

        // Make both row matches with the current column layout
        let columnSize = 0;
        let columnLayoutIdk = 0;
        while (columnSize < existingColumnLayout) {
          if (!get(clonedContainerLayout, ['children', columnLayoutIdk], null)) {
            clonedContainerLayout.children.push(
              GET_COLUMN_LAYOUT_TEMPLATE(
                clonedContainerLayout.node_uuid,
                columnSize + 1,
              ),
            );
          }
          columnSize += get(
            clonedContainerLayout,
            ['children', columnLayoutIdk, 'width'],
            0,
          );
          columnLayoutIdk++;
        }

        if (!isNewContainerColumnsEmpty) {
            columnSize = 0;
            columnLayoutIdk = 0;
            while (columnSize < existingColumnLayout) {
            if (!get(newContainerLayout, ['children', columnLayoutIdk], null)) {
                const newColumn = GET_COLUMN_LAYOUT_TEMPLATE(
                    newContainerLayout.node_uuid,
                    columnSize + 1,
                );
                newColumn.width = 1;
                newContainerLayout.children.push(newColumn);
            }
            columnSize += get(
                newContainerLayout,
                ['children', columnLayoutIdk, 'width'],
                0,
            );
            columnLayoutIdk++;
            }
            result = cloneDeep([clonedContainerLayout, newContainerLayout]);
        } else {
            result = cloneDeep([clonedContainerLayout]);
        }
      }
    }

    // Set the modified row/rows into cloned overall layout.
    clonedOverallLayout.splice(lastRowIdk, 1, ...result);

    // Row Order Correction.
    const resultLayout = cloneDeep(clonedOverallLayout);
    clonedOverallLayout.forEach((_, index) => set(resultLayout, [index, 'order'], index + 1));

    return resultLayout;
 };

 const NON_EMPTY_LAYOUT_TYPES = [
  FORM_LAYOUT_TYPE.FIELD,
  FORM_LAYOUT_TYPE.EXISTING_FIELD,
 ];

 export const isOverallBoxLayoutEmpty = (layout = {}, visibility = {}, fields = {}) => {
      if (NON_EMPTY_LAYOUT_TYPES.includes(layout.type)) {
          const isVisible = visibility?.[layout?.field_uuid];
          const field = fields?.[layout?.field_uuid];
          const visibilityType = [undefined, true].includes(field?.is_visible) ?
                    VISIBILITY_TYPES.HIDE : VISIBILITY_TYPES.DISABLE;
          if (isVisible || visibilityType === VISIBILITY_TYPES.DISABLE) return false;
      }

      const children = layout?.children || [];
      if (children.length <= 0) return true;

      let isEmpty = true;
      for (let layoutIdk = 0; layoutIdk < children.length; layoutIdk++) {
        isEmpty &&= isOverallBoxLayoutEmpty(children?.[layoutIdk], visibility, fields);

        if (!isEmpty) return false;
      }
     return isEmpty;
 };
