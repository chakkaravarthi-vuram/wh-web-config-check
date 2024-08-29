import { LINK_CONFIGURATION_STRINGS } from './LinkPageConfiguration.strings';
import { translateFunction, cloneDeep } from '../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';

export const linkConfigurationData = (componentData, t = translateFunction) => {
    const clonedComponentData = cloneDeep(componentData);
    const linkValidationData = clonedComponentData?.component_info?.links?.map((eachLink) => {
        return {
          type: eachLink?.type,
          name: eachLink?.name,
          ...(eachLink?.type === LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[0].value) ?
          {
            url: eachLink?.url,
          } :
          {
            source_uuid: eachLink?.source_uuid,
          },
        };
      });
      const validationData = {
        ...(clonedComponentData?._id) ? { _id: clonedComponentData?._id } : null,
        ...(clonedComponentData?.component_uuid) ? { component_uuid: clonedComponentData?.component_uuid } : null,
        app_id: clonedComponentData?.app_id,
        page_id: clonedComponentData?.page_id,
        label: clonedComponentData?.label || null,
        type: clonedComponentData?.type,
        label_position: clonedComponentData?.label_position || 'link',
        alignment: clonedComponentData?.alignment,
        coordination: {
          x: clonedComponentData?.coordination?.x,
          y: clonedComponentData?.coordination?.y,
          h: clonedComponentData?.coordination?.h,
          w: clonedComponentData?.coordination?.w,
          minH: clonedComponentData?.coordination?.minH,
          maxH: clonedComponentData?.coordination?.maxH,
          minW: clonedComponentData?.coordination?.minW,
          maxW: clonedComponentData?.coordination?.maxW,
          is_moved: clonedComponentData?.coordination?.is_moved,
          is_static: clonedComponentData?.coordination?.is_static,
          i: clonedComponentData?.coordination?.i,
        },
        component_info: {
          shortcut_style: clonedComponentData?.component_info?.shortcut_style || EMPTY_STRING,
          links: linkValidationData || [],
        },
      };

      return validationData;
};
