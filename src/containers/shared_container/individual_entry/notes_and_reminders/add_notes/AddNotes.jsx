import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import {
  DOCUMENT_TYPES,
  EMPTY_STRING,
  FORM_POPOVER_STRINGS,
} from '../../../../../utils/strings/CommonStrings';
import { getExtensionFromFileName } from '../../../../../utils/generatorUtils';
import {
  getLogoSize,
  showToastPopover,
  validate,
} from '../../../../../utils/UtilityFunctions';
import { FORM_POPOVER_STATUS } from '../../../../../utils/Constants';
import jsUtility from '../../../../../utils/jsUtility';
import useFileUploadHook from '../../../../../hooks/useFileUploadHook';
import InfoField from '../../../../../components/form_components/info_field/InfoField';
import FileUpload from '../../../../../components/form_components/file_upload/FileUpload';
import ConfigurationModal from '../../../../../components/configuration_modal/ConfigurationModal';
import { getAccountConfigurationDetailsApiService } from '../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { addNewNoteApiThunk } from '../../../../../redux/actions/IndividualEntry.Action';
import { notesChanges } from '../../../../../redux/reducer/IndividualEntryReducer';
import NOTES_AND_REMAINDERS_STRINGS from '../NotesAndRemainders.strings';
import styles from './AddNotes.module.scss';
import { addNewNotesValidationSchema } from '../NotesAndRemainder.schema';
import { getAddNotesPostData } from '../NotesAndRemainder.utils';
import { INDIVIDUAL_ENTRY_TYPE } from '../../IndividualEntry.strings';

function AddNotes(props) {
  const {
    isModalOpen,
    onCloseClick,
    metaData: { instanceId, moduleUuid },
    type,
    dispatch,
  } = props;
  const { t } = useTranslation();
  const {
    NOTES: { ADD_NOTES },
  } = NOTES_AND_REMAINDERS_STRINGS(t);

  const { addNewNote } = useSelector(
    (state) => state.IndividualEntryReducer.notesAndRemainders.notes,
  );
  const { notes, attachments, notesErrorList, notesId } = addNewNote;
  const [userProfile, setUserProfile] = useState({});
  const [datalistNotes, setDatalistNotes] = useState(EMPTY_STRING);

  const onAddNotesChange = (data) => {
    const cloneAddNotes = { ...addNewNote, ...data };
    dispatch(notesChanges({ addNewNote: cloneAddNotes }));
  };

  const getFileData = (doc_details, file_ref_uuid) => {
    const fileData = {
      type: type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST ? DOCUMENT_TYPES.DATA_LIST_ENTRY_ATTACHMENTS : DOCUMENT_TYPES.NOTES_INSTANCE,
      file_type: getExtensionFromFileName(doc_details.file.name),
      file_name: doc_details.file.name.split('.')[0],
      file_size: doc_details.file.size,
      file_ref_id: file_ref_uuid,
    };
    const file_metadata = [];
    file_metadata.push(fileData);
    const data = {
      file_metadata,
    };
    data.entity = DOCUMENT_TYPES.ACTION_HISTORY;
    if (notesId) data.entity_id = notesId;
    data.context_id = instanceId;
    data.context_uuid = moduleUuid;
    return data;
  };
  const {
    onRetryFileUpload,
    onFileUpload,
    documentDetails,
    uploadFile,
    onDeletFileUpload,
  } = useFileUploadHook(getFileData);

  useEffect(() => {
    onAddNotesChange({ notesErrorList: EMPTY_STRING });
    getAccountConfigurationDetailsApiService().then(
      (response) => {
        setUserProfile(response);
      },
      () => {
        showToastPopover(
          'Fetching User Profile Failed',
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      },
    );
  }, []);

  useEffect(() => {
    documentDetails && onAddNotesChange({ document_details: documentDetails });
  }, [documentDetails && documentDetails.entity_id]);

  const onNotesChangeHandler = (event) => {
    onAddNotesChange({ notes: event.target.value });
    setDatalistNotes(event.target.parsedContent);
  };

  const onAddNewNoteClicked = () => {
    if (uploadFile?.isFileUploadInProgress) {
      showToastPopover(
        `${ADD_NOTES.ATTACHMENTS.LABEL} ${FORM_POPOVER_STRINGS.FILE_UPLOAD_IN_PROGRESS}`,
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
      return;
    }
    const error_list = validate(
      { datalistNotes, attachments },
      addNewNotesValidationSchema(t),
    );
    onAddNotesChange({ notesErrorList: error_list });
    if (jsUtility.isEmpty(error_list) && !uploadFile?.isFileUploadInProgress) {
      const postData = getAddNotesPostData(addNewNote, type);
      if (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) {
        postData.data_list_entry_id = instanceId;
        postData.data_list_uuid = moduleUuid;
      } else if (type === INDIVIDUAL_ENTRY_TYPE.FLOW) {
        postData.instance_id = instanceId;
        postData.flow_uuid = moduleUuid;
      }
      dispatch(addNewNoteApiThunk(postData)).then((isSuccess) => {
        if (isSuccess) {
          onCloseClick();
        }
      });
    }
  };

  const CONFIG_BUTTON_ARRAY = [
    {
      buttonText: ADD_NOTES.BUTTONS.CANCEL,
      onButtonClick: () => onCloseClick(),
      buttonType: EButtonType.TERTIARY,
      buttonClassName: EMPTY_STRING,
    },
    {
      buttonText: ADD_NOTES.BUTTONS.ADD,
      onButtonClick: () => onAddNewNoteClicked(),
      buttonType: EButtonType.PRIMARY,
      buttonClassName: EMPTY_STRING,
    },
  ];

  return (
    <ConfigurationModal
      isModalOpen={isModalOpen}
      modalTitle={ADD_NOTES.TITLE}
      onCloseClick={onCloseClick}
      tabOptions={[]}
      modalBodyContent={
        <>
          <InfoField
            id={ADD_NOTES.NOTES.ID}
            className={styles.Notes}
            placeholder={ADD_NOTES.NOTES.PLACEHOLDER}
            errorMessage={
              notesErrorList
                ? notesErrorList[ADD_NOTES.NOTES.DATALIST_NOTES]
                : null
            }
            label={ADD_NOTES.NOTES.LABEL}
            onChangeHandler={onNotesChangeHandler}
            description={notes}
          />
          <div className={cx(gClasses.MT15, gClasses.MB15)}>
            <FileUpload
              id={ADD_NOTES.ATTACHMENTS.ID}
              label={ADD_NOTES.ATTACHMENTS.LABEL}
              addFile={onFileUpload}
              fileName={jsUtility.isEmpty(uploadFile) ? [] : [uploadFile]}
              allowed_extensions={userProfile.allowed_extensions}
              maximum_file_size={
                userProfile?.maximum_file_size || getLogoSize(true)
              }
              placeholder={ADD_NOTES.ATTACHMENTS.PLACEHOLDER}
              onDeleteClick={() => {
                onAddNotesChange({ document_details: documentDetails });
                onDeletFileUpload();
              }}
              onRetryClick={onRetryFileUpload}
              isMultiple={false}
            />
          </div>
        </>
      }
      footerButton={CONFIG_BUTTON_ARRAY}
    />
  );
}

AddNotes.propTypes = {
  isModalOpen: PropTypes.bool,
  onCloseClick: PropTypes.func,
  metaData: PropTypes.object,
  type: PropTypes.string,
  dispatch: PropTypes.object,
};

export default AddNotes;
