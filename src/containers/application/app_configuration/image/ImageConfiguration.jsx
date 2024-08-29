import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { validate } from 'json-schema';
import { useTranslation } from 'react-i18next';
import { ProgressBar, EProgressType, EProgressCircleSize, Title, ETitleAlign, ETitleHeadingLevel, ETitleSize } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { applicationComponentDataChange, applicationDataChange, applicationStateChange } from '../../../../redux/reducer/ApplicationReducer';
import { getAppsAllDataListsThunk, getComponentDetailsByApiThunk, savePageApiThunk } from '../../../../redux/actions/Appplication.Action';
import styles from './ImageConfiguration.module.scss';
import FileUpload from '../../../../components/form_components/file_upload/FileUpload';
import useFileUploadHook from '../../../../hooks/useFileUploadHook';
import { generateUuid, getExtensionFromFileName } from '../../../../utils/generatorUtils';
import { FILE_UPLOAD_STATUS, IMAGE_EXTENSIONS } from '../../../../utils/Constants';
import { getAccountConfigurationDetailsApiService } from '../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { cloneDeep, has, isEmpty, isArray } from '../../../../utils/jsUtility';
import UploadFileIcon from '../../../../assets/icons/UploadFileIcon';
import { getComponentInfoErrorMessage } from '../AppConfigurtion.utils';
import { getUrlWithParams, imageConfigurationData } from './ImageConfiguration.utils';
import { saveCompValidationSchema } from '../../application.validation.schema';
import { ACCOUNT_INFO_STRINGS } from '../../../landing_page/account_info/AccountInfoModal.string';
import ThemeContext from '../../../../hoc/ThemeContext';
import { BS } from '../../../../utils/UIConstants';
import gClasses from '../../../../scss/Typography.module.scss';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';

const getValidationData = (clonedComponentData, t) => {
  const validationData = imageConfigurationData(clonedComponentData);
  const errorlist = validate(validationData, saveCompValidationSchema(t));
  return errorlist;
};

function ImageConfiguration(props) {
  const { activeComponent = {}, activeAppData = {},
  applicationStateChange, errorListConfig = {} } = props;
  const { t } = useTranslation();
  const { colorSchemeDefault } = useContext(ThemeContext);

  const [configuredMaxFileSize, setConfiguredMaxFileSize] = useState(0);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [fileName, setFileName] = useState(EMPTY_STRING);
  const arrDocumentData = cloneDeep(activeComponent)?.component_info?.document_details?.documents;
  if (arrDocumentData && isArray(arrDocumentData) && arrDocumentData.length > 0) {
    const url = arrDocumentData[0]?.url;
    arrDocumentData[0].url = getUrlWithParams(url);
  }

  useEffect(() => {
      getAccountConfigurationDetailsApiService().then(
        (response) => {
            setConfiguredMaxFileSize(response.maximum_file_size);
        },
        (error) => {
          console.log(error);
        },
      );
  }, []);

  const getFileData = (doc_details, file_ref_uuid, _entity, entity_id, fileRefUuid) => {
    const ref_uuid = fileRefUuid || activeComponent?.component_info?.document_details?.ref_uuid || generateUuid();
    const fileData = {
      type: 'image_component',
      file_type: getExtensionFromFileName(doc_details.file.name, true),
      file_name: doc_details.file.name.slice(0, -1 * (doc_details.file.name.length - doc_details.file.name.lastIndexOf('.'))),
      file_size: doc_details.file.size,
      file_ref_id: file_ref_uuid,
      context_uuid: activeAppData?.app_uuid,
    };
    const file_metadata = [];
          file_metadata.push(fileData);
      const data = {
        file_metadata,
      };
      data.entity = 'components';// step subprocess static documents
      if (activeComponent?._id) data.entity_id = activeComponent?._id;
      data.context_id = activeAppData?.id;
      data.ref_uuid = ref_uuid;
      return data;
  };

  const {
    onRetryFileUpload,
    onFileUpload,
    documentDetails,
    uploadFile,
} = useFileUploadHook(getFileData);

const onImageChange = (event) => {
    const documents = [];
    const clonedComponentData = cloneDeep(activeComponent);
    if (event?.target?.value && (
        has(event.target, ['removed_doc']) || (
          !has(event.target, ['removed_doc']) && !isEmpty(event.target.value)
        )
      )) {
        (event.target.value || []).forEach((document) => {
          documents.push(
            {
              ...document,
              progress: 100,
            },
          );
        });
        if (event.target.removed_doc) {
            clonedComponentData.removedDocList = [
            ...(clonedComponentData?.removedDocList || []),
            event.target.removed_doc,
          ];
        }
        clonedComponentData.component_info.document_details.documents = cloneDeep(documents);
        clonedComponentData.component_info.document_details.ref_uuid = documents?.[0]?.ref_uuid;
        if (!isEmpty(errorListConfig)) {
          const errorList = getValidationData(clonedComponentData, t);
          applicationStateChange({ error_list_config: errorList });
        }
        applicationStateChange({
          activeComponent: clonedComponentData,
        });
      }
};

useEffect(() => {
    let updatedAttachment = cloneDeep(activeComponent?.documents) || [];
    if (uploadFile.file_ref_uuid) {
      const uploadUrl = getUrlWithParams(uploadFile.url);
      const docMetaData = {
        fileName: uploadFile.fileName,
        file: uploadFile.file,
        status: FILE_UPLOAD_STATUS.SUCCESS,
        fileId: documentDetails.file_metadata[0]._id,
        url: uploadUrl,
        entity_id: documentDetails.entity_id,
        entity: documentDetails.entity,
        newDocument: true,
        ref_uuid: documentDetails.ref_uuid,
        type: documentDetails.file_metadata[0].type,
        upload_signed_url: documentDetails.file_metadata[0].upload_signed_url.fields.key,
      };
      updatedAttachment = [
        ...updatedAttachment || [],
        docMetaData,
      ];
      onImageChange({
        target: {
            value: updatedAttachment,
          },
      });
    }
}, [documentDetails]);

  const setLoader = (progress) => {
    switch (progress) {
      case 0: setImageUploadProgress(0);
      break;
      case 1: setImageUploadProgress(50);
      break;
      case 2: setImageUploadProgress(75);
      break;
      case 3: setImageUploadProgress(100);
      break;
      default: break;
    }
  };

  return (
  (imageUploadProgress > 0 && imageUploadProgress < 100) ? (
    <div className={cx(styles.ExistingFile, gClasses.MT25)}>
      <div className={styles.NameIconComponent}>
      <div className={BS.D_FLEX}>
        <div className={cx(styles.IconContainer, gClasses.CenterVH)}>
          <ProgressBar
            value={imageUploadProgress}
            progressType={EProgressType.download}
            progressCircleSize={EProgressCircleSize.medium}
            colorScheme={colorSchemeDefault}
          />
        </div>
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.CenterVH, styles.NameContainer)}>
        <div style={{ maxWidth: '65%' }} className={gClasses.PL5}>
        <Title
          content={fileName}
          alignment={ETitleAlign.middle}
          headingLevel={ETitleHeadingLevel.h6}
          size={ETitleSize.xs}
          className={cx(gClasses.FTwo12)}
        />
        </div>
        </div>
      </div>
      </div>
    </div>
  ) : (
    <FileUpload
        id={activeComponent?._id || 'image_configuration'}
        containerClass={styles.Field}
        addFile={(fileData, filess, currentIndex, totalLength, recursiveFunc, entityId, currentFilesLength, invalidFileType, invalidFileSize, isMultiple, currentFileIndex, fileRefUuid) => {
            setImageUploadProgress(25);
            const doc_details = fileData?.files?.[0];
            if (doc_details?.file) setFileName(doc_details.file.name.slice(0, -1 * (doc_details.file.name.length - doc_details.file.name.lastIndexOf('.'))));
            onFileUpload(fileData, filess, currentIndex, totalLength, recursiveFunc, entityId, currentFilesLength, invalidFileType, invalidFileSize, isMultiple, currentFileIndex, false, fileRefUuid, setLoader);
        }}
        fileName={arrDocumentData || []}
        allowed_extensions={IMAGE_EXTENSIONS.slice(0, 4)}
        maximum_file_size={configuredMaxFileSize}
        // placeholder=
        onDeleteClick={(value) => {
          const updatedDocumentList =
          (activeComponent?.component_info?.document_details?.documents || []).filter((fileObj) => fileObj.fileId !== value);
          onImageChange({
            target: {
              value: updatedDocumentList,
              removed_doc: value,
            },
    });
        }}
        onRetryClick={onRetryFileUpload}
        errorMessage={getComponentInfoErrorMessage(errorListConfig, 'image_id')}
        className={styles.FileUpload}
        uploadIcon={<UploadFileIcon />}
        instructionMessage={t(ACCOUNT_INFO_STRINGS.FILE_ACCEPTED_TYPE)}
    />
  ));
}

const mapStateToProps = (state) => {
  return {
    activeAppData: state.ApplicationReducer.activeAppData,
    usersAndTeamsData: state.ApplicationReducer.usersAndTeamsData,
    activeComponent: state.ApplicationReducer?.activeComponent || {},
    allDataListsData: state.ApplicationReducer.allDataListsData,
    allFlowsData: state.ApplicationReducer.allFlowsData,
    errorListConfig: state.ApplicationReducer?.error_list_config,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    applicationDataChange: (props) => {
      dispatch(applicationDataChange(props));
    },
    applicationStateChange: (props) => {
      dispatch(applicationStateChange(props));
    },
    applicationComponentDataChange: (props) => {
      dispatch(applicationComponentDataChange(props));
    },
    savePageApi: (params, componentSaveParams, translateFn) => {
      dispatch(savePageApiThunk(params, componentSaveParams, translateFn));
    },
    getComponentDetailsByIdApi: (params) => {
      dispatch(getComponentDetailsByApiThunk(params));
    },
    getAppsAllDataListsApi: (params) => {
      dispatch(getAppsAllDataListsThunk(params));
    },
  };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ImageConfiguration);
