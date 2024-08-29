import React from 'react';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames/bind';
import ResponseHandler from 'components/response_handlers/ResponseHandler';
import TaskReferenceAttachments from 'containers/landing_page/my_tasks/task_content/task_reference_documents/TaskReferenceAttachments';
import { useTranslation } from 'react-i18next';
import jsUtils, { nullCheck, isEmpty } from '../../../../../utils/jsUtility';
import ReadOnlyText from '../../../../../components/form_components/read_only_text/ReadOnlyText';
import Label from '../../../../../components/form_components/label/Label';
import FileUploadProgress from '../../../../../components/form_components/file_upload_progress/FileUploadProgress';
import { getFileNameFromServer } from '../../../../../utils/UtilityFunctions';
import {
  FILE_UPLOAD_STATUS,
  MODULE_TYPES,
  RESPONSE_TYPE,
} from '../../../../../utils/Constants';
import gClasses from '../../../../../scss/Typography.module.scss';
import { PD_SUMMARY_STRINGS } from '../../../../flow/flow_dashboard/FlowDashboard.string';
import Form from '../../../../form/Form';
import { FORM_TYPE } from '../../../../form/Form.string';
import { getFormDetails } from '../../IndividualEntry.utils';

function Body(props) {
  const {
    isLoading,
    isShow,
    instanceBodyData,
    isActionAndComments = true,
    instanceBodyData: {
      active_task_details,
      generated_documents,
      form_metadata,
    },
    instanceError,
    disableVisibility = false,
  } = props;

  const pref_locale = localStorage.getItem('application_language');

  const { t } = useTranslation();

  const { document_url_details } =
    !isEmpty(instanceBodyData) && instanceBodyData;

  const instanceDetails = {};
  instanceDetails.active_task_details = jsUtils.cloneDeep(instanceBodyData);
  instanceDetails.error_list = {};
  instanceDetails.document_url_details = document_url_details;
  const {
    sections = [],
    fields = {},
    activeFormData = {},
    informationFieldFormContent = {},
    formVisibility = {},
    documentDetails = {},
  } = getFormDetails(instanceBodyData, instanceBodyData.document_url_details);

  const completedTaskAttachments = jsUtils
    .get(instanceDetails, 'document_url_details', [])
    .filter((document) => {
      if (active_task_details?.attachments) {
        if (typeof active_task_details.attachments === 'string') {
          return document.document_id === active_task_details.attachments;
        }
        return active_task_details.attachments.find(
          (attachment) => document.document_id === attachment,
        );
      }
      return false;
    })
    .map((filteredTaskAttachment) => {
      return {
        fileName: getFileNameFromServer(
          filteredTaskAttachment.original_filename,
        ),
        file: {
          name: getFileNameFromServer(filteredTaskAttachment.original_filename),
          type: filteredTaskAttachment.original_filename.content_type,
          url: filteredTaskAttachment.signedurl,
        },
        url: filteredTaskAttachment.signedurl,
        status: FILE_UPLOAD_STATUS.SUCCESS,
      };
    });

  const action = jsUtils
    .get(form_metadata, ['actions', 'action_details'], [])
    .find(
      (eachAction) =>
        eachAction.action_name === jsUtils.get(active_task_details, 'action'),
    );

  const actionAndComments = (
    <div className={cx(gClasses.PL16, gClasses.PR16)}>
      <div className={cx(gClasses.SectionSubTitle, gClasses.MB10)}>
        {PD_SUMMARY_STRINGS(t).TASK_ACTION_AND_COMMENTS}
      </div>
      {!!jsUtils.get(active_task_details, 'action') && (
        <ReadOnlyText
          value={
            action?.translation_data?.[pref_locale]?.action_name ||
            action.action_name
          }
          label={PD_SUMMARY_STRINGS(t).ACTION}
        />
      )}
      {!!jsUtils.get(active_task_details, 'comments') && (
        <ReadOnlyText
          label={PD_SUMMARY_STRINGS(t).COMMENTS}
          value={jsUtils.get(active_task_details, 'comments')}
          textClassName={gClasses.WhiteSpacePreWrap}
        />
      )}
      {!jsUtils.isEmpty(generated_documents) && (
        <div
          className={cx(
            gClasses.FTwo15GrayV3,
            gClasses.FontWeight500,
            gClasses.MB10,
          )}
        >
          Generated Documents
        </div>
      )}
      {!!generated_documents && (
        <TaskReferenceAttachments
          taskReferenceDocuments={generated_documents}
          document_url_details={document_url_details}
          fileNameClassName={gClasses.MT14}
          hideUserImage
          sortFiles
        />
      )}
      {nullCheck(completedTaskAttachments, 'length', true) && (
        <>
          <Label content="Uploaded Files" />
          <FileUploadProgress
            className={gClasses.ML15}
            files={completedTaskAttachments}
          />
        </>
      )}
    </div>
  );
  return !jsUtils.isEmpty(instanceError) ? (
    <ResponseHandler
      className={gClasses.MT90}
      messageObject={{
        type: RESPONSE_TYPE.SERVER_ERROR,
        title: 'Access Denied',
        subTitle: "You don't have access to this instance",
      }}
    />
  ) : (
    <div
      id="collapseOne"
      className={cx(`collapse ${isShow}`, gClasses.BackgroundWhite)}
    >
      <div>
        {isLoading ? (
          <div className="w-100">
            <Skeleton count={5} />
          </div>
        ) : (
          <>
            <Form
              moduleType={MODULE_TYPES.TASK}
              formType={FORM_TYPE.READONLY_FORM}
              metaData={{ isSummaryField: true }}
              sections={sections}
              fields={fields}
              activeFormData={activeFormData}
              informationFieldFormContent={informationFieldFormContent}
              onFormFillUpdate={() => {}}
              onValidateField={() => {}}
              errorList={{}}
              formVisibility={formVisibility}
              formMetaData={{ formVisibility }}
              documentDetails={documentDetails}
              disableVisibility={disableVisibility}
            />
            {isActionAndComments && actionAndComments}
          </>
        )}
      </div>
    </div>
  );
}

export default Body;
