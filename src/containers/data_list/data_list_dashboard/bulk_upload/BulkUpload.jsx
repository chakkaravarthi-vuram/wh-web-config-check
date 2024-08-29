import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { SyncLoader } from 'react-spinners';
import { getLanguageAndCalendarDataThunk } from 'redux/actions/LanguageAndCalendarAdmin.Action';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import modalStyles from 'components/form_components/modal_layout/CustomClasses.module.scss';
import { getBulkUploadValidationMessage } from 'redux/reducer';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../scss/Typography.module.scss';
import { BS } from '../../../../utils/UIConstants';
import BULK_UPLOAD_STRINGS from './BulkUpload.strings';
import Stepper from '../../../../components/form_components/stepper/Stepper';
import InitBulkUpload from './InitBulkUpload/InitBulkUpload';
import PreviewBulkUpload from './PreviewUpload/PreviewUpload';
import { getExtensionFromFileName } from '../../../../utils/generatorUtils';
import {
  DOCUMENT_TYPES,
  EMPTY_STRING,
  ENTITY,
  FORM_POPOVER_STRINGS,
} from '../../../../utils/strings/CommonStrings';
import {
  showToastPopover,
} from '../../../../utils/UtilityFunctions';
import { FORM_POPOVER_STATUS, BUTTON_TYPE } from '../../../../utils/Constants';
import useAccountConfig from '../../../../hooks/useAccountConfig';
import Button from '../../../../components/form_components/button/Button';
import INIT_BULK_UPLOAD_STRINGS from './InitBulkUpload/InitBulkUpload.strings';
import useFileUploadHook from '../../../../hooks/useFileUploadHook';
import jsUtils from '../../../../utils/jsUtility';
import { getDataListEntryDetailsById } from '../../../../axios/apiService/dataList.apiService';
import { submitBulkDataListEntryAction } from '../../../../redux/actions/BulkUpload.action';
import ResponseHandler from '../../../../components/response_handlers/ResponseHandler';
import { setInitialFormVisibleFields } from '../../../../utils/formUtils';

const cancelForBulkUpload = {
  cancelToken: null,
};

const setCancelBulkdataListEntry = (cancelToken) => {
  cancelForBulkUpload.cancelToken = cancelToken;
};

function BulkUpload(props) {
  const {
    dataListUuid,
    dataListId,
    onCloseClick,
    templateDocument,
    working_days,
    id,
    isModalOpen,
    isPostingData,
    getLanguageAndCalendarData,
  } = props;
  useEffect(() => {
    getLanguageAndCalendarData();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(
    BULK_UPLOAD_STRINGS().INIT_PAGE,
  );
  const { t } = useTranslation();
  const [sheetName, setSheetName] = useState(BULK_UPLOAD_STRINGS(t).TEMPLATE);
  const [fileUpdated, setFileUpdated] = useState(false);
  const [formMetadata, setFormMetadata] = useState({});
  const [error, setError] = useState({ status: false, messageObject: {} });
  let modalMainContent = null;
  const getFileData = (doc_details, file_ref_uuid, entity) => {
    const fileData = {
      type: DOCUMENT_TYPES.DATA_LIST_BULK_ENTRY,
      file_type: getExtensionFromFileName(doc_details.file.name),
      file_name: doc_details.file.name.split('.')[0],
      file_size: doc_details.file.size,
      file_ref_id: file_ref_uuid,
      context_uuid: dataListUuid,
    };
    const file_metadata = [];
    file_metadata.push(fileData);
    const data = {
      file_metadata,
    };
    data.entity = entity;
    data.entity_uuid = dataListUuid;
    data.entity_id = dataListId;
    data.context_id = dataListId;
    data.context_entity_type = ENTITY.DATA_LIST;
    data.form_uuid = formMetadata?.form_uuid;
    return data;
  };
  const {
    onRetryFileUpload,
    onFileUpload,
    documentDetails,
    uploadFile,
    onDeletFileUpload,
  } = useFileUploadHook(getFileData, ENTITY.DATA_LIST_ENTRY);
  const userProfileData = useAccountConfig();

  useEffect(() => {
    if (dataListUuid) {
      getDataListEntryDetailsById({ data_list_uuid: dataListUuid }).then(
        (dataListData) => {
          if (dataListData) {
            dataListData = setInitialFormVisibleFields(dataListData);
            setFormMetadata(dataListData.form_metadata);
          } else {
            setError({
              status: true,
              messageObject: {
                title: 'Something went wrong',
                subTitle: 'Please try again after sometimes',
                type: 2,
              },
            });
            showToastPopover(
              'Fetching datalist details failed',
              'Please try again',
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          }
          return null;
        },
        () => {
          setError({
            status: true,
            messageObject: {
              title: 'Something went wrong',
              subTitle: 'Please try again after sometimes',
              type: 2,
            },
          });
          showToastPopover(
            'Fetching datalist details failed',
            'Please try again',
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        },
      );
    }
  }, [dataListUuid]);
  const onUploadClick = async () => {
    if (isPostingData) return false; // data upload is in progress

    const { submitBulkDataListEntry, refreshTable, validationMessage } = props;
    if (jsUtils.isEmpty(validationMessage)) {
      submitBulkDataListEntry({
        dataListId,
        documentDetails,
        uploadFile,
        formMetadata,
        sheetName,
        currentIndex: BULK_UPLOAD_STRINGS().PREVIEW_PAGE,
        working_days,
      }).then((status) => {
        if (status) {
          showToastPopover(
            'Bulk Upload Completed',
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SUCCESS,
            true,
          );
          onCloseClick();
          refreshTable();
          return true;
        }
        setCurrentIndex(BULK_UPLOAD_STRINGS().PREVIEW_PAGE);
        return false;
      });
    }
    return null;
  };
  const onPreviewClick = async () => {
    if (uploadFile?.isFileUploadInProgress) {
      showToastPopover(
        `${t(FORM_POPOVER_STRINGS.BULK_FILE_UPLOAD_IN_PROGRESS)}`,
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
      return false;
    }
    if (isPostingData) return false; // data upload is in progress
    if (!fileUpdated) {
      setCurrentIndex(BULK_UPLOAD_STRINGS().PREVIEW_PAGE);
      return false;
    }
    if (!jsUtils.isEmpty(documentDetails)) {
      const { submitBulkDataListEntry } = props;
      submitBulkDataListEntry({
        dataListId,
        documentDetails,
        uploadFile,
        formMetadata,
        sheetName,
        currentIndex: BULK_UPLOAD_STRINGS().INIT_PAGE,
        working_days,
      }).then((status) => {
        if (status) {
          setCurrentIndex(BULK_UPLOAD_STRINGS().PREVIEW_PAGE);
          return true;
        }
        onDeletFileUpload();
        return false;
      });
    }
    return false;
  };
  const primaryCtaClicked = () => {
    currentIndex === BULK_UPLOAD_STRINGS().INIT_PAGE ? onPreviewClick() : onUploadClick();
  };
  if (error.status) {
    modalMainContent = (
      <div className={cx(gClasses.CenterVH, BS.H100, gClasses.PB50)}>
        <ResponseHandler messageObject={error.messageObject} />
      </div>
    );
  } else if (!error.status && jsUtils.isEmpty(formMetadata)) {
    modalMainContent = (
      <div className={cx(gClasses.CenterH, BS.H100, gClasses.MT100, gClasses.PB50)}>
        <SyncLoader size={12} color="#1f243d" loading />
      </div>
    );
  } else {
    modalMainContent = (
      <div className={gClasses.PB50}>
        <Stepper
          list={BULK_UPLOAD_STRINGS(t).STEPPER_LIST}
          currentStep={currentIndex}
          className={gClasses.PB18}
          isNewStep
          isEditView
          isBulkUpload
        />
        {currentIndex === BULK_UPLOAD_STRINGS().INIT_PAGE ? (
          <InitBulkUpload
            nextPage={onPreviewClick}
            setSheetName={(currentSheetName) => {
              if (sheetName !== currentSheetName) setSheetName(currentSheetName);
            }}
            templateDocument={templateDocument}
            sheetName={sheetName}
            onFileUpload={(fileData) => {
              setFileUpdated(true);
              onFileUpload(fileData);
            }}
            onDeletFileUpload={onDeletFileUpload}
            onRetryFileUpload={onRetryFileUpload}
            documentDetails={documentDetails}
            uploadedFile={uploadFile}
            userProfileData={userProfileData}
            onDiscardClick={() => onCloseClick()}
          />
        ) : (
          <PreviewBulkUpload
            formMetadata={formMetadata}
            previousPage={() => {
              setFileUpdated(false);
              setCurrentIndex(BULK_UPLOAD_STRINGS().INIT_PAGE);
            }}
            uploadClick={onUploadClick}
            workingDaysArray={working_days}
          />
        )}
      </div>
    );
  }

  return (
    <ModalLayout
      id={id}
      isModalOpen={isModalOpen}
      onCloseClick={onCloseClick}
      headerClassName={modalStyles.ModalHeader}
      headerContent={(
        <div className={modalStyles.ModalHeaderContainer}>
          <div>
            <span className={cx(modalStyles.PageTitle)}>
              {BULK_UPLOAD_STRINGS(t).TITLE}
            </span>
            <div className={cx(gClasses.FTwo13GrayV9, gClasses.PT5)}>
              {BULK_UPLOAD_STRINGS(t).SUB_TITLE}
            </div>
          </div>
        </div>
      )}
      mainContent={modalMainContent}
      footerContent={(
        <div
          className={cx(
            BS.W100,
            BS.D_FLEX,
            BS.JC_BETWEEN,
            BS.ALIGN_ITEM_CENTER,
          )}
        >
          <Button
            buttonType={BUTTON_TYPE.SECONDARY}
            className={cx(BS.TEXT_NO_WRAP, gClasses.MR30)}
            id={INIT_BULK_UPLOAD_STRINGS.DISCARD.ID}
            onClick={onCloseClick}
          >
            {t(INIT_BULK_UPLOAD_STRINGS.DISCARD.LABLE)}
          </Button>
          <Button
            buttonType={BUTTON_TYPE.PRIMARY}
            className={cx(BS.TEXT_NO_WRAP)}
            onClick={primaryCtaClicked}
            id={INIT_BULK_UPLOAD_STRINGS.PREVIEW.ID}
            disabled={jsUtils.isEmpty(uploadFile) || jsUtils.isEmpty(sheetName)}
          >
            {
              currentIndex === BULK_UPLOAD_STRINGS().INIT_PAGE ?
                t(INIT_BULK_UPLOAD_STRINGS.PREVIEW.LABEL) :
                t(INIT_BULK_UPLOAD_STRINGS.UPLOAD.LABEL)
            }
          </Button>
        </div>
      )}
    />
  );
}
const mapStateToProps = (state) => {
  return {
    working_days: state.LanguageAndCalendarAdminReducer.working_days,
    validationMessage: getBulkUploadValidationMessage(state),
    isPostingData: state.PostLoaderStatusReducer.postLoaderStatus.isVisible,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    submitBulkDataListEntry: (obj) =>
      dispatch(submitBulkDataListEntryAction(obj, setCancelBulkdataListEntry)),
    getLanguageAndCalendarData: (value) => {
      dispatch(getLanguageAndCalendarDataThunk(value));
      return Promise.resolve();
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BulkUpload);
