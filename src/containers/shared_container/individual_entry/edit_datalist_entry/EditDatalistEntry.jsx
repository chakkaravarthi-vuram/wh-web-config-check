import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames/bind';
import {
  Button,
  EButtonType,
  EToastPosition,
  EToastType,
  Modal,
  ModalSize,
  toastPopOver,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import CloseIconNew from '../../../../assets/icons/CloseIconNew';
import {
  getUserProfileData,
  isBasicUserMode,
  setUserProfileData,
  validate,
} from '../../../../utils/UtilityFunctions';
import jsUtility from '../../../../utils/jsUtility';
import { MODULE_TYPES, RESPONSE_TYPE } from '../../../../utils/Constants';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { getAccountConfigurationDetailsApiService } from '../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import {
  formatFormData,
  getFormattedDocumentDetails,
} from '../../../form/editable_form/EditableForm.utils';
import { getSchemaForFormData } from '../../../form/editable_form/EditableFrom.schema';
import { getLanguageAndCalendarDataThunk } from '../../../../redux/actions/LanguageAndCalendarAdmin.Action';
import {
  editDatalistChange,
  editDatalistClear,
} from '../../../../redux/reducer/IndividualEntryReducer';
import {
  addNewDataListEntryApiThunk,
  getDataListEntryDetailsByIdApi,
} from '../../../../redux/actions/IndividualEntry.Action';
import { getProfileData } from '../../../application/app_components/dashboard/datalist/Datalist.utils';
import { FORM_TYPE } from '../../../form/Form.string';
import FormBuilderLoader from '../../../../components/form_builder/FormBuilderLoader';
import ResponseHandler from '../../../../components/response_handlers/ResponseHandler';
import Form from '../../../form/Form';
import { getErrorDetails } from '../../../data_list/data_list_dashboard/add_data_list/AddDataList.utils';
import styles from './EditDatalistEntry.module.scss';
import { DATALIST_USERS } from '../../../../urls/RouteConstants';
import { UUID_V4_REGEX } from '../../../../utils/strings/Regex';
import ThemeContext from '../../../../hoc/ThemeContext';

function EditDatalistEntry(props) {
  const {
    isModalOpen,
    dataListUuid,
    dataListEntryId,
    onCloseClick,
    onRefreshData,
  } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const isBasicUser = isBasicUserMode(history);
  const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;
  const dispatch = useDispatch();
  const { datalistEntryDetails, isDatalistEntryLoading, server_error } =
    useSelector((store) => store.IndividualEntryReducer.editDatalist);
  const { working_days } = useSelector(
    (store) => store.LanguageAndCalendarAdminReducer,
  );
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(EMPTY_STRING);
  const [showResponse, setShowResponse] = useState(true);
  const [dynamicValidation, setDynamicValidation] = useState(false);
  const currentComponentCompRef = useRef(null);
  const containerCompRef = useRef(null);
  const userProfileData = getUserProfileData();

  const { addDataListFormData, activeEntry } =
    jsUtility.cloneDeep(datalistEntryDetails);

  useEffect(() => {
    dispatch(getLanguageAndCalendarDataThunk());
    if (
      !jsUtility.isNull(containerCompRef) &&
      !jsUtility.isNull(currentComponentCompRef)
    ) {
      const listHeight = containerCompRef.current.clientHeight || 0;
      if (currentComponentCompRef.current) {
        currentComponentCompRef.current.style.height = `${listHeight - 2000}px`; // 60px hardcoded assign to a dynamic variable(subtracting footer height)
      }
    }

    getAccountConfigurationDetailsApiService().then((response) => {
      setUserProfileData(response);
    });
    return () => {
      dispatch(editDatalistClear());
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    const entryId = dataListEntryId;
    const params = {
      data_list_uuid: dataListUuid,
      validate: 0,
      _id: entryId,
    };
    if (entryId) params._id = entryId;
    params.is_table_default_value = 1;
    params.validate = 1;
    if (params?.data_list_uuid) {
      dispatch(getDataListEntryDetailsByIdApi(params))
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          if (error && error.type) setErrorType(error.type);
          setLoading(false);
        });
    }
  }, [dataListEntryId]);
  const formType = FORM_TYPE.EDITABLE_FORM;

  const updateError = (errorList) => {
    dispatch(
      editDatalistChange({
        datalistEntryDetails: {
          ...datalistEntryDetails,
          activeEntry: { ...activeEntry, errorList: errorList },
        },
      }),
    );
  };

  const addNewDLEntry = () => {
    const {
      sections,
      formMetaData: { formVisibility },
      activeFormData,
      fields,
      documentDetails,
      removedDocList = [],
    } = activeEntry;
    setDynamicValidation(true);
    const formattedData = formatFormData(
      activeFormData,
      fields,
      formVisibility,
    ); // validation data
    const schema = getSchemaForFormData(
      sections,
      formVisibility,
      userProfileData,
      working_days,
      formattedData,
      fields,
      sections?.contents,
    ); // validation schema

    const errorList = validate(formattedData, schema); // error validation

    if (jsUtility.isEmpty(errorList)) {
      const formValues = formatFormData(
        activeFormData,
        fields,
        formVisibility,
        true,
      ); // form post Data
      const postData = {
        _id: dataListEntryId,
        form_uuid: datalistEntryDetails?.form_metadata.form_uuid,
        data_list_id: datalistEntryDetails?.metadata_info.data_list_id,
        ...formValues,
        ...getFormattedDocumentDetails(
          documentDetails,
          removedDocList,
          fields,
          activeFormData,
        ),
      };
      let profileData = { email: userProfileData.email };
      if (history.location.pathname.includes(DATALIST_USERS)) {
        profileData = getProfileData(formattedData, fields);
      }
      dispatch(addNewDataListEntryApiThunk(postData, profileData)).then(
        () => {
          onRefreshData?.();
          toastPopOver({
            title: t('error_popover_status.entry_updated'),
            subtitle: t('error_popover_status.datalist_entry_updated'),
            toastType: EToastType.success,
          });
          onCloseClick();
        },
        (error) => {
          if (error) {
            setShowResponse(true);
            const errorMessage = jsUtility.isEmpty(server_error)
              ? ' '
              : Object.values(server_error)[0];
            const err = jsUtility.get(
              error,
              ['response', 'data', 'errors', 0],
              {},
            );
            const { type, message, field, indexes } = err;
            if (type === 'duplicate' && message?.includes('duplicate')) {
              const field = err?.field?.[0] || '';
              const { fields = {}, errorList = {} } =
                jsUtility.cloneDeep(activeEntry);
              Object.keys(fields)?.find((currentField) => {
                if (fields[currentField]?.referenceName === field) {
                  errorList[currentField] = 'This field has a duplicate value';
                  return true;
                }
                return false;
              });
              updateError(errorList);
            } else if (type === 'invalid') {
              if (
                UUID_V4_REGEX.test(field) &&
                indexes?.includes?.('Restricted Users')
              ) {
                const _errorList = {
                  [field]: t('error_popover_status.invalid_teams_or_users'),
                };
                updateError(_errorList);
              }
            } else {
              toastPopOver({
                title: 'Error in adding datalist entry',
                subtitle: errorMessage,
                toastType: EToastType.error,
              });
            }
          } else {
            onRefreshData?.();
          }
        },
      );
    } else if (!jsUtility.isEmpty(errorList)) {
      updateError(errorList);
      toastPopOver({
        title: t(
          'common_strings.form_popover_strings.check_details_to_proceed',
        ),
        toastType: EToastType.error,
        toastPosition: EToastPosition.TOP_CENTER,
      });
    }
  };

  const getFormElement = () => {
    if (isDatalistEntryLoading || loading) {
      return <FormBuilderLoader />;
    } else if (jsUtility.isEmpty(addDataListFormData)) {
      if (jsUtility.isEmpty(showResponse)) return null;
      const { title, subTitle } = getErrorDetails(errorType, t);
      return (
        showResponse && (
          <ResponseHandler
            className={gClasses.MT90}
            messageObject={{
              type: RESPONSE_TYPE.SERVER_ERROR,
              title: title,
              subTitle: subTitle,
            }}
          />
        )
      );
    } else {
      const onFormFillUpdate = (activeFormData, options = {}) => {
        const { documentDetails, formMetaData, errorList, removedFileId } =
          options;
        const { removedDocList = [] } = activeEntry;
        if (!jsUtility.isEmpty(removedFileId)) {
          removedDocList.push(removedFileId);
        }
        const updatedActiveEntry = {
          activeFormData,
          ...(!jsUtility.isEmpty(documentDetails)
            ? {
                documentDetails,
                refUuid: documentDetails?.ref_uuid,
                dataListEntryId: documentDetails?.entity_id,
              }
            : {}),
          ...(!jsUtility.isEmpty(removedDocList)
            ? { removedDocList: removedDocList }
            : {}),
          ...(!jsUtility.isEmpty(formMetaData) ? { formMetaData } : {}),
          ...(errorList ? { errorList } : {}),
        };
        const extraUpdate = {};
        if (!jsUtility.isEmpty(documentDetails)) {
          extraUpdate._id = documentDetails?.entity_id;
        }
        dispatch(
          editDatalistChange({
            datalistEntryDetails: {
              ...datalistEntryDetails,
              activeEntry: { ...activeEntry, ...updatedActiveEntry },
              ...extraUpdate,
            },
          }),
        );
      };

      const {
        sections = [],
        fields = {},
        activeFormData = {},
        informationFieldFormContent = {},
        formMetaData = {},
        errorList = {},
        documentDetails = {},
        refUuid = EMPTY_STRING,
      } = jsUtility.cloneDeep(activeEntry) || {};
      const metaData = {
        moduleId: datalistEntryDetails?.metadata_info?.data_list_id,
        dataListId: datalistEntryDetails?.metadata_info?.data_list_id,
        datalistUuid: datalistEntryDetails?.metadata_info?.data_list_uuid,
        instanceId: dataListEntryId || activeEntry?.dataListEntryId,
        formUUID: datalistEntryDetails?.form_metadata?.form_uuid,
        refUuid: refUuid,
      };

      return (
        <Form
          moduleType={MODULE_TYPES.DATA_LIST}
          formType={formType}
          metaData={metaData}
          sections={sections}
          fields={fields}
          activeFormData={activeFormData}
          informationFieldFormContent={informationFieldFormContent}
          onFormFillUpdate={onFormFillUpdate}
          onValidateField={() => {}}
          errorList={errorList}
          formMetaData={formMetaData}
          documentDetails={documentDetails}
          dynamicValidation={dynamicValidation}
          showSectionName={
            datalistEntryDetails?.form_metadata?.show_section_name || false
          }
          userProfileData={userProfileData}
        />
      );
    }
  };

  return (
    <div ref={containerCompRef} className={styles.Container}>
      <Modal
        id="edit-datalist-modal"
        isModalOpen={isModalOpen}
        modalSize={ModalSize.lg}
        customModalClass={gClasses.Width90VW}
        headerContentClassName={styles.Header}
        headerContent={
          <>
            <div>
              <span className={styles.PageTitle}>
                {t('common_strings.update')}
                <span className={cx(gClasses.ML5, gClasses.FS16)}>
                  {datalistEntryDetails?.metadata_info?.data_list_name}
                </span>
              </span>
            </div>
            <button onClick={onCloseClick}>
              <CloseIconNew />
            </button>
          </>
        }
        mainContent={
          <div ref={currentComponentCompRef}>{getFormElement()}</div>
        }
        mainContentClassName={gClasses.P24}
        footerContentClassName={styles.Footer}
        footerContent={
          <Button
            buttonType={EButtonType.PRIMARY}
            onClick={addNewDLEntry}
            buttonText={t('common_strings.update')}
            colorSchema={colorSchema}
            disabled={isDatalistEntryLoading}
          />
        }
      />
    </div>
  );
}

EditDatalistEntry.propTypes = {
  isModalOpen: PropTypes.bool,
  dataListUuid: PropTypes.string,
  dataListEntryId: PropTypes.string,
  onCloseClick: PropTypes.func,
  onRefreshData: PropTypes.func,
};

export default EditDatalistEntry;
