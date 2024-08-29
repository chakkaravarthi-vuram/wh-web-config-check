import React, { useEffect, useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { store } from 'Store';
import { getLanguageAndCalendarDataThunk } from 'redux/actions/LanguageAndCalendarAdmin.Action';
import modalStyles from 'components/form_components/modal_layout/CustomClasses.module.scss';
import { clearApiQueue } from 'redux/reducer/FieldVisiblityReducer';
import { DATALIST_USERS, DATA_LIST_DASHBOARD } from 'urls/RouteConstants';
import { Button, EButtonType, EToastPosition, EToastType, Modal, ModalSize, toastPopOver } from '@workhall-pvt-lmt/wh-ui-library';
import {
  addNewDataListEntryApiThunk,
  getDataListEntryDetailsByIdApi,
} from '../../../../redux/actions/DataListAction';
import {
  getDataListEntryDetailsSelector,
} from '../../../../redux/selectors/DataListSelector';
import styles from './AddDataList.module.scss';
import jsUtils, { isEmpty, cloneDeep, get } from '../../../../utils/jsUtility';
import {
  EMPTY_STRING,
} from '../../../../utils/strings/CommonStrings';
import {
  RESPONSE_TYPE,
  MODULE_TYPES,
  ROUTE_METHOD,
} from '../../../../utils/Constants';
import {
  addDataListIntChangeAction,
  clearAddDataListFormData,
  dataListDashboardDataChange,
  setDataListModelVisibleFalse,
  updateActiveEntryDetails,
} from '../../../../redux/reducer/DataListReducer';
import {
  getFieldVisibilityListForDataListApiThunk,
} from '../../../../redux/actions/TaskActions';
import {
  getErrorDetails,
} from './AddDataList.utils';
import {
  getUserProfileData,
  isBasicUserMode,
  routeNavigate,
  setUserProfileData,
  validate,
} from '../../../../utils/UtilityFunctions';
import gClasses from '../../../../scss/Typography.module.scss';
import { ADD_DATA_LIST_STRINGS } from './AddDataList.strings';
import FormBuilderLoader from '../../../../components/form_builder/FormBuilderLoader';
import ResponseHandler from '../../../../components/response_handlers/ResponseHandler';
import ConditionalWrapper from '../../../../components/conditional_wrapper/ConditionalWrapper';
import { PD_TAB } from '../DataList.strings';
import Form from '../../../form/Form';
import { FORM_TYPE } from '../../../form/Form.string';
import { formatFormData, getFormattedDocumentDetails } from '../../../form/editable_form/EditableForm.utils';
import { getSchemaForFormData } from '../../../form/editable_form/EditableFrom.schema';
import { getAccountConfigurationDetailsApiService } from '../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { getProfileData } from '../../../application/app_components/dashboard/datalist/Datalist.utils';
import CloseIconNew from '../../../../assets/icons/CloseIconNew';
import { UUID_V4_REGEX } from '../../../../utils/strings/Regex';
import ThemeContext from '../../../../hoc/ThemeContext';

// lazy imports
// const Form = lazy(() => import('../../../landing_page/my_tasks/task_content/form/Form'));

function AddDataList(props) {
  const {
    dispatch,
    isEditView,
    isDataLoading,
    dataListEntryId,
    formViewOnly,
    clearAddDataListFormDatas,
    onCloseClick,
    isModalOpen,
    dataListAuditfields,
    isAuditView,
    auditParams,
    auditCallBackFunction,
    dataListUuid,
    isAddView,
    datalistName,
    updateActiveEntry,
  } = props;
  const { working_days } = store.getState().LanguageAndCalendarAdminReducer;
  const history = useHistory();
  const { t } = useTranslation();
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const isBasicUser = isBasicUserMode(history);
  const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;
  const [loading, setLoading] = useState(true);
  const containerCompRef = useRef(null);
  const headerCompRef = useRef(null);
  const currentComponentCompRef = useRef(null);
  const [errorType, setErrorType] = useState('');
  const [showResponse, setShowResponse] = useState(true);
  const [dynamicValidation, setDynamicValidation] = useState(false);
  const userProfileData = getUserProfileData();

  const { allDataListEntryData, activeEntry } = jsUtils.cloneDeep(props);
  const { addDataListFormData } = jsUtils.cloneDeep(props);
  const { data_list_name } = allDataListEntryData;

  const tableDetails = {};
  tableDetails.active_task_details = jsUtils.cloneDeep(allDataListEntryData);
  tableDetails.error_list = allDataListEntryData.error_list;

  useEffect(() => {
    setLoading(true);
    const { getLanguageAndCalendarData } = props;
    getLanguageAndCalendarData();
    if (!jsUtils.isNull(containerCompRef) && !jsUtils.isNull(headerCompRef) && !jsUtils.isNull(currentComponentCompRef)) {
      let listHeight = 0;
      listHeight =
        containerCompRef.current.clientHeight;
      if (currentComponentCompRef.current) {
        currentComponentCompRef.current.style.height = `${listHeight - 2000}px`; // 60px hardcoded assign to a dynamic variable(subtracting footer height)
      }
    }

    getAccountConfigurationDetailsApiService().then((response) => {
      setUserProfileData(response);
    });
    return () => {
      const { clearVisibilityApiQueue } = props;
      clearAddDataListFormDatas();
      clearVisibilityApiQueue();
      if (isAddView) {
        dispatch(setDataListModelVisibleFalse());
      }
    };
  }, []);

  const addnewDLEntry = () => {
    const { dataListEntryDetails } = props;
    const { sections, formMetaData: { formVisibility }, activeFormData, fields, documentDetails, removedDocList = [] } = activeEntry;
    setDynamicValidation(true);
    const formattedData = formatFormData(activeFormData, fields, formVisibility); // validation data
    const schema = getSchemaForFormData( // validation schema
      sections,
      formVisibility,
      userProfileData,
      working_days,
      formattedData,
      fields,
      sections?.contents,
    );

    const errorList = validate(formattedData, schema); // validation
    updateActiveEntry({ errorList });

    if (isEmpty(errorList)) { // post data
      const formValues = formatFormData(activeFormData, fields, formVisibility, true); // form post Data
      const postData = {
        _id: dataListEntryId || dataListEntryDetails?._id,
        form_uuid: allDataListEntryData?.form_metadata.form_uuid,
        data_list_id: allDataListEntryData?.metadata_info.data_list_id,
        ...formValues,
        ...(getFormattedDocumentDetails(documentDetails, removedDocList, fields, activeFormData)),
      };
      let profileData = { email: userProfileData.email };
      if (history.location.pathname.includes(DATALIST_USERS)) {
        profileData = getProfileData(formattedData, fields);
      }
      dispatch(
        addNewDataListEntryApiThunk(postData, dataListUuid, isEditView, profileData),
      ).then(
        () => {
          const { refreshTable } = props;
          refreshTable?.();
          toastPopOver({
              title: isEditView ? t('error_popover_status.entry_updated') : t('error_popover_status.entry_added'),
              subtitle: isEditView
                ? t('error_popover_status.datalist_entry_updated')
                : t('error_popover_status.datalist_entry_added'),
              toastType: EToastType.success,
            });
          if (isBasicUserMode(history)) {
            onCloseClick();
            return;
          }
          if (history.location.pathname.includes(DATALIST_USERS)) {
            const datalistUserPathName = `${DATALIST_USERS}/${dataListUuid}`;
            const dashboardTabState = { dashboardTab: PD_TAB.ALL.TAB_INDEX, modalType: null };
            routeNavigate(history, ROUTE_METHOD.REPLACE, datalistUserPathName, EMPTY_STRING, dashboardTabState);
            onCloseClick();
          } else if (history.location.pathname.includes(DATA_LIST_DASHBOARD)) {
            const datalistDashboardPathName = `${DATA_LIST_DASHBOARD}/${dataListUuid}`;
            const datalistDashboardState = { dashboardTab: PD_TAB.ALL.TAB_INDEX, modalType: null };
            routeNavigate(history, ROUTE_METHOD.REPLACE, datalistDashboardPathName, null, datalistDashboardState);
            onCloseClick();
          } else onCloseClick();
        },
        (error) => {
          if (error) {
            setShowResponse(true);
            const { server_error } = store.getState().DataListReducer;
            const errorMessage = jsUtils.isEmpty(server_error)
              ? ' '
              : Object.values(server_error)[0];
            const err = get(error, ['response', 'data', 'errors', 0], {});
            const { type, message, field, indexes } = err;
            if (type === 'duplicate' && message?.includes('duplicate')) {
              const field = err?.field?.[0] || '';
              const { fields = {}, errorList = {} } = cloneDeep(activeEntry);
              Object.keys(fields)?.find((currentField) => {
                if (fields[currentField]?.referenceName === field) {
                  errorList[currentField] = 'This field has a duplicate value';
                  return true;
                }
                return false;
              });
              updateActiveEntry({ errorList });
            } else if (type === 'invalid') {
              if (UUID_V4_REGEX.test(field) && indexes?.includes?.('Restricted Users')) {
                const _errorList = { [field]: t('error_popover_status.invalid_teams_or_users') };
                updateActiveEntry({ errorList: _errorList });
              }
            } else if (type === 'number.integer') {
              const { errorList = {} } = cloneDeep(activeEntry);
              const fieldParts = field?.split('.');
              if (fieldParts.length > 1) {
                errorList[fieldParts.join(',')] = t('server_validation_constants.this_field_must_be_an_integer');
              } else {
                errorList[fieldParts[0]] = t('server_validation_constants.this_field_must_be_an_integer');
              }
              updateActiveEntry({ errorList });
            } else {
              toastPopOver({
                title: 'Error in adding datalist entry',
                subtitle: errorMessage,
                toastType: EToastType.error,
              });
            }
          } else {
            clearAddDataListFormData();
            const { refreshTable } = props;
            refreshTable?.();
          }
        },
      );
    } else {
      if (!isEmpty(errorList)) {
         toastPopOver({
          title: t('common_strings.form_popover_strings.check_details_to_proceed'),
          toastType: EToastType.error,
          toastPosition: EToastPosition.TOP_CENTER,
        });
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    const { dispatch } = props;
    const entryId = dataListEntryId;
    let params = {
      data_list_uuid: dataListUuid,
    };
    if (isAuditView) {
      params = auditParams;
    } else {
      params = {
        data_list_uuid: dataListUuid,
        validate: 0,
        _id: entryId,
      };
    }
    if (entryId && (isEditView || formViewOnly) && !isAuditView) params._id = entryId;
    if (isAddView || isEditView) {
      params.is_table_default_value = 1;
      params.validate = 1;
    }
    if (params?.data_list_uuid) {
      dispatch(getDataListEntryDetailsByIdApi(params, history, isAuditView, t))
        .then((response) => {
          if (isAuditView) {
            auditCallBackFunction(response);
          }
          setLoading(false);
        })
        .catch((error) => {
          if (error && error.type) setErrorType(error.type);
          setLoading(false);
        });
    }
  }, [dataListEntryId]);
  const viewType = isEditView ? 'EDIT' : 'ADD';
  const formType = formViewOnly ? FORM_TYPE.READONLY_FORM : FORM_TYPE.EDITABLE_FORM;

  const onFormFillUpdate = (activeFormData, options = {}) => {
    const { dataListEntryDetails, onDatalistDataUpdate } = props;
    const { documentDetails, formMetaData, errorList, removedFileId } = options;
    const { removedDocList = [] } = activeEntry;
    if (!isEmpty(removedFileId)) removedDocList.push(removedFileId);
    const updatedActiveEntry = {
      activeFormData,
      ...(!isEmpty(documentDetails) ? {
        documentDetails,
        refUuid: documentDetails?.ref_uuid,
        dataListEntryId: documentDetails?.entity_id,
      } : {}),
      ...(!isEmpty(removedDocList) ? { removedDocList: removedDocList } : {}),
      ...(!isEmpty(formMetaData) ? { formMetaData } : {}),
      ...(errorList ? { errorList } : {}),
    };
    if (!isEmpty(documentDetails)) {
      onDatalistDataUpdate({
        particularDataListEntryDetails: {
          ...dataListEntryDetails,
          _id: documentDetails?.entity_id,
        },
      });
    }
    updateActiveEntry({ ...updatedActiveEntry });
  };

  const getFormElement = () => {
    const {
      sections = [],
      fields = {},
      activeFormData = {},
      informationFieldFormContent = {},
      formMetaData = {},
      errorList = {},
      documentDetails = {},
      refUuid = EMPTY_STRING,
    } = cloneDeep(activeEntry) || {};

    const metaData = {
      moduleId: allDataListEntryData?.metadata_info?.data_list_id,
      dataListId: allDataListEntryData?.metadata_info?.data_list_id,
      datalistUuid: allDataListEntryData?.metadata_info?.data_list_uuid,
      instanceId: dataListEntryId || activeEntry?.dataListEntryId,
      formUUID: allDataListEntryData?.form_metadata?.form_uuid,
      refUuid: refUuid,
    };

    let addDataListForm = null;
    if (isDataLoading || loading || !jsUtils.isEmpty(addDataListFormData)) {
      addDataListForm = isDataLoading ? (
        <FormBuilderLoader />
      ) : (
        <div>
          <Form
            moduleType={MODULE_TYPES.DATA_LIST}
            formType={formType}
            metaData={metaData}
            sections={sections}
            fields={fields}
            activeFormData={activeFormData}
            informationFieldFormContent={informationFieldFormContent}
            onFormFillUpdate={onFormFillUpdate}
            onValidateField={() => { }}
            errorList={errorList}
            formMetaData={formMetaData}
            documentDetails={documentDetails}
            dynamicValidation={dynamicValidation}
            dataListAuditfields={dataListAuditfields}
            showSectionName={allDataListEntryData?.form_metadata?.show_section_name || false}
            userProfileData={userProfileData}
            isAuditView={isAuditView}
            disableVisibilityForReadOnlyForm={isAuditView}
          />
          {/* <Form
            parentModuleType={FORM_PARENT_MODULE_TYPES.ADD_DATA_LIST_ENTRY}
            active_task_details={allDataListEntryData}
            document_url_details={documentUrlDetails}
            onChangeHandler={onChangeHandler}
            stateData={{
              ...jsUtils.pick(tableDetails, ['active_task_details', 'error_list']),
              ...addDataListFormData,
            }}
            onDeleteFileClick={deleteUploadedFiles}
            onRetryFileUploadClick={onRetryFileUpload}
            onTableAddOrDeleteRowClick={onTableAddOrDeleteRowClick}
            formVisibility={jsUtils.get(allDataListEntryData, [
              'form_metadata',
              'fields',
              'form_visibility',
            ])}
            isCompletedForm={formViewOnly}
            userDetails={userProfileData}
            dataListAuditfields={dataListAuditfields}
            auditedTabelRows={auditedTabelRows}
            isAuditView={isAuditView}
            tabelfieldEditedList={tabelfieldEditedList}
          /> */}
        </div>
      );
    } else {
      const { title, subTitle } = getErrorDetails(errorType, t);
      addDataListForm = showResponse && (
        <ResponseHandler
          className={gClasses.MT90}
          messageObject={{
            type: RESPONSE_TYPE.SERVER_ERROR,
            title: title,
            subTitle: subTitle,
          }}
        />
      );
    }
    return addDataListForm;
  };
  const conditionWrapper = (
    <ConditionalWrapper
      condition={!formViewOnly}
      wrapper={(children) => (
        <div className={styles.Container}>
          <Modal
            id="add-datalist-modal"
            isModalOpen={isModalOpen}
            modalSize={ModalSize.lg}
            customModalClass={gClasses.Width90VW}
            headerContentClassName={cx(styles.Header)}
            headerContent={
              <>
                <div>
                  <span className={cx(modalStyles.PageTitle)}>
                    {isEditView
                      ? ADD_DATA_LIST_STRINGS(t).EDIT.TITLE
                      : ADD_DATA_LIST_STRINGS(t).ADD.TITLE}
                    <span className={cx(gClasses.ML5, gClasses.FS16)}>
                      {data_list_name || datalistName}
                    </span>
                  </span>
                </div>
                <button onClick={onCloseClick}>
                  <CloseIconNew />
                </button>
              </>
            }
            mainContent={children}
            footerContentClassName={styles.Footer}
            footerContent={
              (!formViewOnly && !isDataLoading) ? (
                <Button
                  buttonType={EButtonType.PRIMARY}
                  onClick={addnewDLEntry}
                  buttonText={ADD_DATA_LIST_STRINGS(t)[viewType].ACTION_BUTTON}
                  colorSchema={colorSchema}
                />
              ) : null
            }
          />
        </div>
      )}
    >
      <div ref={currentComponentCompRef}>{getFormElement()}</div>
    </ConditionalWrapper>
  );

  return (
    <div ref={containerCompRef}>
      {conditionWrapper}
    </div>
  );
}

const mapStateToProps = ({ LanguageAndCalendarAdminReducer, DataListReducer }) => getDataListEntryDetailsSelector(DataListReducer, LanguageAndCalendarAdminReducer);

const mapDispatchToProps = (dispatch) => {
  return {
    getFieldVisibilityList: (data) => {
      dispatch(getFieldVisibilityListForDataListApiThunk(data));
    },
    addNewDataListEntryApi: (data, id, isEditView) => {
      dispatch(addNewDataListEntryApiThunk(data, id, isEditView));
    },
    clearAddDataListFormDatas: () => {
      dispatch(clearAddDataListFormData());
    },
    getLanguageAndCalendarData: (value) => {
      dispatch(getLanguageAndCalendarDataThunk(value));
      return Promise.resolve();
    },
    updateAddDataListData: (value) => {
      dispatch(addDataListIntChangeAction(value));
    },
    updateActiveEntry: (value) => {
      dispatch(updateActiveEntryDetails(value));
    },
    clearVisibilityApiQueue: () => {
      dispatch(clearApiQueue());
    },
    onDatalistDataUpdate: (data) => {
      dispatch(dataListDashboardDataChange(data));
    },
    dispatch,
  };
};

AddDataList.defaultProps = {
  documentUrlDetails: {},
  addDataListFormData: {},
};

AddDataList.propTypes = {
  documentUrlDetails: PropTypes.objectOf(PropTypes.any),
  addDataListFormData: PropTypes.objectOf(PropTypes.any),
  allDataListEntryData: PropTypes.objectOf(PropTypes.any).isRequired,
  dispatch: PropTypes.func.isRequired,
  getFieldVisibilityList: PropTypes.func.isRequired,
  addNewDataListEntryApi: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDataList);
