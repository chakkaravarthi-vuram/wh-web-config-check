import { getFileUrl } from '../../../../utils/attachmentUtils';
import jsUtility from '../../../../utils/jsUtility';
import { DOCUMENT_TYPES } from '../../../../utils/strings/CommonStrings';
import { INDIVIDUAL_ENTRY_TYPE } from '../IndividualEntry.strings';

export const getAddNotesPostData = (addNotesStateData, moduleType = INDIVIDUAL_ENTRY_TYPE.DATA_LIST) => {
  const postData = {};
  const { notes, category, document_details } = addNotesStateData;
  postData.notes = notes;
  if (!jsUtility.isEmpty(category)) postData.category = category;
  if (!jsUtility.isEmpty(document_details)) {
    postData.document_details = {};
    postData.document_details.uploaded_doc_metadata = [];
    postData.document_details.entity = document_details.entity;
    postData.document_details.entity_id = document_details.entity_id;
    postData._id = document_details.entity_id;
    postData.document_details.ref_uuid = document_details.ref_uuid;
    if (document_details.file_metadata) {
      document_details.file_metadata.forEach((file_info) => {
        const docType = (moduleType === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) ? DOCUMENT_TYPES.DATA_LIST_ENTRY_ATTACHMENTS : DOCUMENT_TYPES.NOTES_INSTANCE;
        if (file_info.type === docType) {
          postData.document_details.uploaded_doc_metadata.push({
            upload_signed_url: getFileUrl(file_info?.upload_signed_url),
            type: file_info.type,
            document_id: file_info._id,
          });
          postData.attachments = [file_info._id];
        }
      });
    }
  }
  return postData;
};

export const getAddRemainderPostData = (addRemainderStateData) => {
  const postData = {};
  const { remainder_message, scheduledDate } = addRemainderStateData;
  postData.scheduled_date_time = `${scheduledDate}`;
  postData.scheduler_type = 1200;
  postData.schedule_data = {};
  postData.schedule_data.reminder_message = remainder_message;
  postData.schedule_data.reminder_type = 'email'; // hardcoded
  return postData;
};
