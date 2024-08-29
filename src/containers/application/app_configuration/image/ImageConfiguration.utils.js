import { APP_DMS } from '../../../../urls/RouteConstants';
import { cloneDeep, get, isEmpty, isArray } from '../../../../utils/jsUtility';

export const imageConfigurationData = (componentData) => {
    const clonedComponentData = cloneDeep(componentData);
    const documentIds = [];

    clonedComponentData?.component_info?.document_details?.documents?.forEach?.((document) => {
      document?.fileId && documentIds.push(document?.fileId);
  });

    const validationData = {
      ...(clonedComponentData?._id) ? { _id: clonedComponentData?._id } : null,
      ...(clonedComponentData?.component_uuid) ? { component_uuid: clonedComponentData?.component_uuid } : null,
      app_id: clonedComponentData?.app_id,
      page_id: clonedComponentData?.page_id,
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
          image_id: documentIds[0],
      },
    };

    if (clonedComponentData?.component_info?.document_details && !isEmpty(clonedComponentData?.component_info?.document_details?.documents)) {
      const documentDetails = {};
      documentDetails.entity = 'components';
      if (clonedComponentData?.app_id) documentDetails.entity_id = get(clonedComponentData, ['component_info', 'document_details', 'documents', 0, 'entity_id'], null);

      if (!validationData?._id) {
        validationData._id = get(clonedComponentData, ['component_info', 'document_details', 'documents', 0, 'entity_id'], null);
      }

      if (clonedComponentData.component_info.document_details.ref_uuid) documentDetails.ref_uuid = clonedComponentData?.component_info?.document_details?.ref_uuid;
      documentDetails.uploaded_doc_metadata = [];
      clonedComponentData?.component_info?.document_details?.documents?.forEach?.((eachDocument) => {
        const removedDocList = get(clonedComponentData, ['component_info', 'document_details', 'removedDocList'], []);
        if (isEmpty(removedDocList) ||
        (isArray(removedDocList) && !removedDocList.includes(eachDocument.fileId))) {
          if (eachDocument.newDocument) {
            documentDetails.uploaded_doc_metadata.push({
              document_id: eachDocument.fileId,
              type: eachDocument.type,
              upload_signed_url: eachDocument.upload_signed_url,
            });
          }
        }
        if (isArray(removedDocList) && !isEmpty(removedDocList)) {
          documentDetails.removed_doc_list = removedDocList;
        }
      });
      if (!isEmpty(documentDetails.uploaded_doc_metadata)) {
        validationData.document_details = documentDetails;
      }
    }

      return validationData;
};

export const getUrlWithParams = (url) => {
  let urlPath = url;
  if (!url.includes(APP_DMS.PARAMS.IMG.IS_EDIT_TRUE)) {
    urlPath = `${url}&${APP_DMS.PARAMS.IMG.IS_EDIT_TRUE}`;
  }
  return urlPath;
};
