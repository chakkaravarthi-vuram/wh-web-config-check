import React from 'react';
import cx from 'classnames/bind';
import { EButtonType, Button as LibraryButton } from '@workhall-pvt-lmt/wh-ui-library';
import Button, { BUTTON_TYPE } from '../../../../components/form_components/button/Button';
import { BS } from '../../../../utils/UIConstants';
import { TAB_BUTTONS } from './Task.strings';
import jsUtils, { has, isEmpty, isNullishCoalesce } from '../../../../utils/jsUtility';
import gClasses from '../../../../scss/Typography.module.scss';
import { ENTITY } from '../../../../utils/strings/CommonStrings';
import styles from './Task.module.scss';
import { FORM_LAYOUT_TYPE } from '../../../form/Form.string';
import { getSectionFieldsFromLayout } from '../../../form/sections/form_layout/FormLayout.utils';

export const getTabElements = (onPublishButtonClicked, onSaveButtonClicked, onCancelButtonClick, isEditTask, isMobileView = false, t, colorSchema) => {
  const elements = {};
  elements.publishButton = (
    <LibraryButton
      buttonType={EButtonType.PRIMARY}
      onClick={(event) => onPublishButtonClicked(event)}
      className={cx(BS.TEXT_NO_WRAP)}
      buttonText={t(TAB_BUTTONS.CREATE)}
      colorSchema={colorSchema}
    />
  );
  elements.saveButton = (
    <Button
      buttonType={BUTTON_TYPE.SECONDARY}
      className={cx(BS.TEXT_NO_WRAP, styles.SecondaryButton)}
      onClick={onSaveButtonClicked}
    >
      {t(TAB_BUTTONS.SAVE_AS_DRAFT)}
    </Button>
  );
  elements.cancelButton = (
    <Button
      buttonType={BUTTON_TYPE.LIGHT}
      className={cx(!isMobileView ? gClasses.ML10 : cx(gClasses.ML5, gClasses.MR5), styles.SecondaryButton)}
      onClick={onCancelButtonClick}
    >
      {t(TAB_BUTTONS.CANCEL)}
    </Button>
  );
  return elements;
};

const isValidTaskSections = (sections) =>
  sections.find((section) => {
    const layouts = [];
      section?.layout?.forEach((layout) => {
        if (!isEmpty(layout?.children)) {
          layouts.push(...getSectionFieldsFromLayout(layout));
        }
      });
      return !!(layouts.find((eachLayout) => eachLayout.type === FORM_LAYOUT_TYPE.FIELD));
  });

export const getTaskAPIData = (state, formStatus, dataList, setCollectData = false, collect_data = false) => {
  const taskPostData = {};
  taskPostData.has_auto_trigger = state.has_auto_trigger || false;
  if (taskPostData.has_auto_trigger) {
    taskPostData.auto_trigger_details = {};
    taskPostData.auto_trigger_details.is_recursive = state.auto_trigger_details.is_recursive;
    if (state.auto_trigger_details.is_recursive) {
      taskPostData.auto_trigger_details.recursive_data = {};
      taskPostData.auto_trigger_details.recursive_data.type = state.auto_trigger_details.recursive_data.type;
      taskPostData.auto_trigger_details.recursive_data.time_at = state.auto_trigger_details.recursive_data.time_at;
      if (state.auto_trigger_details.recursive_data.type === 'day') {
        taskPostData.auto_trigger_details.recursive_data.on_days = state.auto_trigger_details.recursive_data.on_days;
        taskPostData.auto_trigger_details.recursive_data.is_working = state.auto_trigger_details.recursive_data.is_working;
      } else {
        taskPostData.auto_trigger_details.recursive_data.is_working = state.auto_trigger_details.recursive_data.is_working;
        taskPostData.auto_trigger_details.recursive_data.repeat_type = state.auto_trigger_details.recursive_data.repeat_type;
        if (taskPostData.auto_trigger_details.recursive_data.repeat_type === 'selected_date') {
          taskPostData.auto_trigger_details.recursive_data.on_date = state.auto_trigger_details.recursive_data.on_date;
        } else if (taskPostData.auto_trigger_details.recursive_data.repeat_type === 'selected_week_day') {
          taskPostData.auto_trigger_details.recursive_data.on_week = state.auto_trigger_details.recursive_data.on_week;
          [taskPostData.auto_trigger_details.recursive_data.on_day] = state.auto_trigger_details.recursive_data.on_day;
        }
      }
    }
  }
  taskPostData.data_list_uuid = dataList.dataListUuid;
  taskPostData.data_list_entry_id = dataList.dataListEntryId;
  if (!isEmpty(state.task_details)) {
    taskPostData.is_assign_to_individual_assignees = state.is_assign_to_individual_assignees;
    taskPostData.task_name = state.task_name.trim();
    if (setCollectData) taskPostData.collect_data = true;
    else if (
      has(state, 'form_details')
      && !jsUtils.isEmpty(state.form_details)
      && state.sections
      && state.sections.length > 0
      && isValidTaskSections(state.sections)
    ) {
      taskPostData.collect_data = true;
    } else {
      taskPostData.collect_data = false;
    }
    if (!isNullishCoalesce(collect_data)) taskPostData.collect_data = collect_data;

    if (!isEmpty(state.task_description)) taskPostData.task_description = state.task_description;
    else if (isEmpty(state.task_description) && !isEmpty(state.task_details.task_description)) taskPostData.task_description = null;
    if (!isEmpty(state.due_date)) taskPostData.due_date = state.due_date;
    else if (isEmpty(state.due_date) && !isEmpty(state.task_details.due_date)) taskPostData.due_date = null;
    taskPostData.task_metadata_uuid = state.task_details.task_metadata_uuid;
    if (!isEmpty(state.form_details)) taskPostData.form_id = state.form_details.form_id;
    if (!isEmpty(state.assignees)) {
      taskPostData.assignees = {};
      if (state.assignees.teams && state.assignees.teams.length > 0) {
        const teams = [];
        state.assignees.teams.forEach((team) => {
          teams.push(team._id);
        });
        taskPostData.assignees.teams = teams;
      }
      if (state.assignees.users && state.assignees.users.length > 0) {
        const users = [];
        state.assignees.users.forEach((user) => {
          users.push(user._id);
        });
        taskPostData.assignees.users = users;
      }
    } else taskPostData.assignees = { users: [], teams: [] };
    if (formStatus === 'deleteForm') taskPostData.is_form_delete = '1';
    if (!jsUtils.isEmpty(state.files)) {
      const uploadedDocumentMetadata = [];
      const taskReferenceDocuments = [];
      state.files.forEach((file) => {
        const documentFromAPI = jsUtils.get(state, ['task_details', 'document_url_details'], []).find(
          (document) => document.document_id === file.id,
        );
        if (!state.removed_doc_list.includes(file.id)) {
          if (jsUtils.isUndefined(documentFromAPI)) {
          uploadedDocumentMetadata.push({
            document_id: file.id,
            type: ENTITY.TASK_REFERENCE_DOCUMENTS,
            upload_signed_url: file.url || file.link,
          });
        }
          taskReferenceDocuments.push(file.id);
        }
      });
      const documentDetails = {
        entity: ENTITY.TASK_METADATA,
        entity_id: state.task_details._id,
        ref_uuid: state.ref_uuid,
        uploaded_doc_metadata: uploadedDocumentMetadata,
        ...(!jsUtils.isEmpty(state.removed_doc_list) ? { removed_doc_list: state.removed_doc_list } : {}),
      };
      taskPostData.task_reference_documents = taskReferenceDocuments;
      if (!jsUtils.isEmpty(uploadedDocumentMetadata)) taskPostData.document_details = documentDetails;
    }
    return taskPostData;
  }
  if (!has(state, 'form_details')) {
    taskPostData.collect_data = false;
  }
  if (!isNullishCoalesce(collect_data)) taskPostData.collect_data = collect_data;
  taskPostData.task_name = state.task_name.trim();
  if (!isEmpty(state.task_description)) taskPostData.task_description = state.task_description;
  if (!isEmpty(state.due_date)) taskPostData.due_date = state.due_date;
  if (!isEmpty(state.assignees)) {
    taskPostData.assignees = {};
    if (state.assignees.teams && state.assignees.teams.length > 0) {
      const teams = [];
      state.assignees.teams.forEach((team) => {
        teams.push(team._id);
      });
      taskPostData.assignees.teams = teams;
    }
    if (state.assignees.users && state.assignees.users.length > 0) {
      const users = [];
      state.assignees.users.forEach((user) => {
        users.push(user._id);
      });
      taskPostData.assignees.users = users;
    }
  } else taskPostData.assignees = { users: [], teams: [] };
  taskPostData.is_assign_to_individual_assignees = state.is_assign_to_individual_assignees;
  if (!jsUtils.isEmpty(state.files)) {
    const uploadedDocumentMetadata = [];
    const taskReferenceDocuments = [];
    state.files.forEach((file) => {
      const documentFromAPI = jsUtils.get(state, ['task_details', 'document_url_details'], []).find(
        (document) => document.document_id === file.id,
      );
      if (!state.removed_doc_list.includes(file.id)) {
        if (jsUtils.isUndefined(documentFromAPI)) {
        uploadedDocumentMetadata.push({
          document_id: file.id,
          type: ENTITY.TASK_REFERENCE_DOCUMENTS,
          upload_signed_url: file.url,
        });
        }
        taskReferenceDocuments.push(file.id);
      }
    });
    const documentDetails = {
      entity: ENTITY.TASK_METADATA,
      entity_id: state.files[0].entity_id,
      ref_uuid: state.ref_uuid,
      uploaded_doc_metadata: uploadedDocumentMetadata,
      ...(!jsUtils.isEmpty(state.removed_doc_list) ? { removed_doc_list: state.removed_doc_list } : {}),
    };
    taskPostData._id = state.files[0].entity_id;
    taskPostData.task_reference_documents = taskReferenceDocuments;
    if (!jsUtils.isEmpty(uploadedDocumentMetadata)) taskPostData.document_details = documentDetails;
  }
  return taskPostData;
};
