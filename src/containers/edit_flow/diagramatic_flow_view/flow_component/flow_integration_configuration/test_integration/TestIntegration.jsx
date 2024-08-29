import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import { getTriggerMappingFields, testIntegrationApiThunk } from 'redux/actions/FlowStepConfiguration.Action';
import gClasses from 'scss/Typography.module.scss';
import { cloneDeep, get, isEmpty, set, unset } from 'utils/jsUtility';
import Input from 'components/form_components/input/Input';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import MappingTable from 'containers/integration/mapping_table/MappingTable';
import RecursiveMappingTable from 'containers/integration/recursive_mapping_table/RecursiveMappingTable';
import RadioGroup, { RADIO_GROUP_TYPE } from 'components/form_components/radio_group/RadioGroup';
import { BS } from 'utils/UIConstants';
import { BUTTON_TYPE } from 'utils/Constants';
import Button from 'components/form_components/button/Button';
import { constructIntegrationTestPostData, getIntegrationTestRequestBodyData } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import TextArea from 'components/form_components/text_area/TextArea';
import Skeleton from 'react-loading-skeleton';
import { testRequestBodyValidationSchema, testRequestIntegrationData } from 'containers/edit_flow/step_configuration/StepConfiguration.validations';
import { validate } from 'utils/joiUtils';
import { useTranslation } from 'react-i18next';
import { INTEGRATION_CONSTANTS } from '../FlowIntegrationConfiguration.constants';
import styles from './TestIntegration.module.scss';
import configStyles from '../FlowIntegrationConfiguration.module.scss';
import TestRowComponent from './TestRowComponent';
import tableStyles from '../integration_request_configuration/IntegrationRequestConfiguration.module.scss';
import { getAccountConfigurationDetailsApiService } from '../../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { REQUEST_CONFIGURATION_STRINGS } from '../integration_request_configuration/IntegrationRequestConfiguration.utils';
import { DOCUMENT_TYPES } from '../../../../../../utils/strings/CommonStrings';
import useMultiFileUploadHook from '../../../../../../hooks/useMultiFileUploadHook';
import { setPointerEvent, updatePostLoader, showToastPopover } from '../../../../../../utils/UtilityFunctions';
import { FILE_UPLOAD_STATUS, FORM_POPOVER_STATUS } from '../../../../../../utils/Constants';

function TestIntegration(props) {
    const { currentIntegrationData = {}, integration_error_list = {}, flowData,
    updateIntegerationData, confirm_test = 0, updateFlowData, dispatch = [] } = props;
    const { testRequestBodyErrorList = {}, testRequestError = {} } = integration_error_list;
    const { lstAllFields = [], isTestLoading = false } = flowData;
    const { test_body = [], test_query_params = [], test_response = {}, test_relative_path = [], test_event_headers = [], testStatus = {} } = currentIntegrationData;
    const { status, code, time = 60, isTested = false, showResponseWindow = false } = testStatus;

    const { TEST_INTEGRATION_CONFIGURATION } = INTEGRATION_CONSTANTS;
    const { ADD_EVENT } = REQUEST_CONFIGURATION_STRINGS;

    const { t } = useTranslation();
    const { onMultiFileUpload, uploadFileToDMS } = useMultiFileUploadHook({ entity_id: currentIntegrationData._id }, DOCUMENT_TYPES.INTEGRATION_TEST_FILE, TEST_INTEGRATION_CONFIGURATION.FILE_UPLOAD, t, true);

    useEffect(() => {
      getAccountConfigurationDetailsApiService().then((response) => {
        updateFlowData({
          testIntegrationHelperData: {
            maxFileSize: response?.maximum_file_size,
            allowedExtensions: response?.allowed_extensions,
          },
        });
      });
    }, []);

    const onAssignQueryParamValue = (event, index, mappingKey, errorKey) => {
      console.log('onsetClicked', event);
      if (event?.target) {
        const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
        const clonedQueryHeaders = cloneDeep(clonedIntegerationDetails[mappingKey]);
        clonedQueryHeaders[index].test_value = event.target.value;
        clonedIntegerationDetails[mappingKey] = clonedQueryHeaders;
        console.log('clonedIntegerationDetails', clonedIntegerationDetails);
        unset(clonedIntegerationDetails, ['integration_error_list', 'testRequestError',
        `${errorKey},${index},${TEST_INTEGRATION_CONFIGURATION.QUERY.VALUE.VALUE_KEY}`]);
        updateIntegerationData(clonedIntegerationDetails);
      }
    };

    const onAssignRelativePathValue = (event, index) => {
      console.log('onsetClicked', event);
      if (event?.target) {
        const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
        const clonedQueryParams = cloneDeep(test_relative_path);
        clonedQueryParams[index].test_value = event.target.value;
        clonedIntegerationDetails.test_relative_path = clonedQueryParams;
        console.log('clonedIntegerationDetails', clonedIntegerationDetails);
        unset(clonedIntegerationDetails, ['integration_error_list', 'testRequestError',
        `${TEST_INTEGRATION_CONFIGURATION.RELATIVE_PATH.ID},${index},${TEST_INTEGRATION_CONFIGURATION.RELATIVE_PATH.VALUE.VALUE_KEY}`]);
        updateIntegerationData(clonedIntegerationDetails);
      }
    };

    const initialRelativePathRow = (index) => {
      const currentMappingList = cloneDeep(test_relative_path);
      console.log('test_query_params', test_relative_path, index);
      const isRequired = currentMappingList[index]?.isRequired ? <span className={styles.Required}>&nbsp;*</span> : null;
      return (
        <>
          <div className={cx(styles.ColMax, gClasses.MR24)}>
            <div className={cx(styles.KeyName, gClasses.ReadOnlyBg, gClasses.FTwo13GrayV3)}>
              {currentMappingList[index]?.key_name}
              {isRequired}
            </div>
          </div>
          <div className={cx(styles.ColMax, gClasses.MR24)}>
            <Dropdown
              optionList={lstAllFields}
              placeholder={t(TEST_INTEGRATION_CONFIGURATION.RELATIVE_PATH.VALUE.PLACEHOLDER)}
              id={`value-${index}`}
              showNoDataFoundOption
              selectedValue={currentMappingList[index]?.type === 'expression' ? currentMappingList[index]?.field_details?.field_name : currentMappingList[index]?.value} // field uuid
              strictlySetSelectedValue
              disablePopper
              setSelectedValue
              showSelectedValTooltip
              hideDropdownListLabel
              isRequired
              disableFocusFilter
              hideLabel
              disabled
            />
          </div>
          <div className={styles.ColMax}>
            <Input
              id={`test_value-${index}`}
              value={currentMappingList[index]?.test_value}
              hideLabel
              errorMessage={testRequestError[`${TEST_INTEGRATION_CONFIGURATION.RELATIVE_PATH.ID},${index},${TEST_INTEGRATION_CONFIGURATION.RELATIVE_PATH.VALUE.VALUE_KEY}`]}
              onChangeHandler={(event) => {
                console.log('test_query_params onChange', test_relative_path, index);
                onAssignRelativePathValue(event, index);
              }}
            />
          </div>
        </>
      );
    };

    const initialRow = (index, mappingKey, errorKey) => {
      const currentMappingList = cloneDeep(currentIntegrationData[mappingKey]);
      console.log('test_query_params', test_query_params, index);
      const isRequired = currentMappingList[index]?.isRequired ? <span className={styles.Required}>&nbsp;*</span> : null;
      return (
        <>
          <div className={cx(styles.ColMax, gClasses.MR24)}>
            <div className={cx(styles.KeyName, gClasses.ReadOnlyBg, gClasses.FTwo13GrayV3)}>
              {currentMappingList[index]?.key_name}
              {isRequired}
            </div>
          </div>
          <div className={cx(styles.ColMax, gClasses.MR24)}>
            <Dropdown
              optionList={lstAllFields}
              placeholder={t(TEST_INTEGRATION_CONFIGURATION.QUERY.VALUE.PLACEHOLDER)}
              id={`value-${index}`}
              showNoDataFoundOption
              selectedValue={currentMappingList[index]?.type === 'expression' ? currentMappingList[index]?.field_details?.field_name : currentMappingList[index]?.value} // field uuid
              strictlySetSelectedValue
              disablePopper
              setSelectedValue
              showSelectedValTooltip
              hideDropdownListLabel
              isRequired
              disableFocusFilter
              hideLabel
              disabled
            />
          </div>
          <div className={styles.ColMax}>
            <Input
              id={`test_value-${index}`}
              value={currentMappingList[index]?.test_value}
              hideLabel
              errorMessage={testRequestError[`${errorKey},${index},${TEST_INTEGRATION_CONFIGURATION.QUERY.VALUE.VALUE_KEY}`]}
              onChangeHandler={(event) => {
                console.log('test_query_params onChange', test_query_params, index);
                onAssignQueryParamValue(event, index, mappingKey, errorKey);
              }}
            />
          </div>
        </>
      );
    };

  const handleValueUpdate = (id, event, path, fileList) => {
    const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
    path = (path || []).split(',');
    const currentRowJson = get(clonedIntegerationDetails?.test_body || {}, path, {});
      if (fileList?.length > 0) {
        const { testIntegrationDocs = [] } = clonedIntegerationDetails;
        const files = get(clonedIntegerationDetails, ['test_body', ...path, REQUEST_CONFIGURATION_STRINGS.ADD_EVENT.REQUEST_BODY.TEST.ID, 'fileData'], []);
        fileList.forEach((file) => {
          const localFileURL = URL.createObjectURL(file);
          files.push({
            file,
            localFileURL,
            url: localFileURL,
            fileName: file.name,
            status: FILE_UPLOAD_STATUS.LOCAL_FILE,
            path: path.join(),
          });
        });
        set(clonedIntegerationDetails, ['test_body', ...path, REQUEST_CONFIGURATION_STRINGS.ADD_EVENT.REQUEST_BODY.TEST.ID], { fileData: files });
        const index = testIntegrationDocs.findIndex((testDoc) => (testDoc.path === path.join()));
        if (index > -1) {
          set(clonedIntegerationDetails, ['testIntegrationDocs', index, 'fileData'], files);
        } else {
          set(clonedIntegerationDetails, ['testIntegrationDocs'], [
            ...testIntegrationDocs,
            { fileData: files, path: path.join() },
          ]);
        }
    } else set(clonedIntegerationDetails, ['test_body', ...path, id], event?.target?.value);
    if (currentRowJson?.root_uuid) {
      const parentPath = cloneDeep(path);
      (parentPath || []).splice(path.length - 2, 2);
      const parentData = get(clonedIntegerationDetails?.request_body || {}, parentPath, {});
      if (parentData.type === 'object') {
        set(clonedIntegerationDetails, ['test_body', ...parentPath, 'test_value'], EMPTY_STRING);
      }
      unset(clonedIntegerationDetails, ['integration_error_list', 'testRequestBodyErrorList', [...parentPath, 'test_value'].join(',')]);
      unset(clonedIntegerationDetails, ['integration_error_list', 'testRequestBodyErrorList', [...parentPath, 'child_rows'].join(',')]);
    }
    unset(clonedIntegerationDetails, ['integration_error_list', 'testRequestBodyErrorList', [...path, 'test_value'].join(',')]);
    console.log('1234ertyew', cloneDeep(clonedIntegerationDetails), get(clonedIntegerationDetails, ['test_body', ...path]));
    updateIntegerationData(clonedIntegerationDetails);
  };

  const handleDeleteFile = (path, { index }) => {
    const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
    const { testIntegrationDocs = [] } = clonedIntegerationDetails;
    path = (path || []).split(',');
    const files = get(clonedIntegerationDetails, ['test_body', ...path, ADD_EVENT.REQUEST_BODY.TEST.ID, 'fileData'], []);
    files.splice(index, 1);
    set(clonedIntegerationDetails, ['test_body', ...path, ADD_EVENT.REQUEST_BODY.TEST.ID], { fileData: files });
    if (testIntegrationDocs.length > 0) {
      const testDocIndex = testIntegrationDocs.findIndex((testDoc) => (testDoc.path === path.join()));
      if (testDocIndex > -1) {
        set(clonedIntegerationDetails, ['testIntegrationDocs', testDocIndex, 'fileData'], files);
      }
    }
    updateIntegerationData(clonedIntegerationDetails);
  };

  const updateIndividualFileStatus = (progressResponseData, currentIntegrationData) => {
    const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
    const { testIntegrationDocs = [] } = clonedIntegerationDetails;
    progressResponseData.forEach(({ index, path, data }) => {
      path = (path || []).split(',');
      const fileData = get(clonedIntegerationDetails, ['test_body', ...path, ADD_EVENT.REQUEST_BODY.TEST.ID, 'fileData', index], {});
      const finalData = { ...fileData, ...data };
      set(clonedIntegerationDetails, ['test_body', ...path, ADD_EVENT.REQUEST_BODY.TEST.ID, 'fileData', index], finalData);
      const testDocIndex = testIntegrationDocs.findIndex((testDoc) => (testDoc.path === path.join()));
      set(clonedIntegerationDetails, ['testIntegrationDocs', testDocIndex, 'fileData', index], finalData);
    });
    return clonedIntegerationDetails;
  };

  const handleRetryUpload = async (path, { index }) => {
    const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
    let updatedIntegrationData = await updateIndividualFileStatus([{
      index,
      path: path,
      data: { status: FILE_UPLOAD_STATUS.IN_PROGRESS, progress: 0 },
    }], clonedIntegerationDetails);
    updateIntegerationData(updatedIntegrationData);
    path = (path || []).split(',');
    const file = get(clonedIntegerationDetails, ['test_body', ...path, ADD_EVENT.REQUEST_BODY.TEST.ID, 'fileData', index], []);
    const res = await uploadFileToDMS({
      _id: file?.fileId,
      upload_signed_url: file?.upload_signed_url || {},
    }, {
      fileIndex: index,
      ...file,
    });
    updatedIntegrationData = updateIndividualFileStatus([res], updatedIntegrationData);
    updateIntegerationData(updatedIntegrationData);
  };

  const onChangeHandlers = ({ event, type, path, fileList }) => {
    switch (type) {
      case ADD_EVENT.REQUEST_BODY.TEST.ID:
      case ADD_EVENT.REQUEST_BODY.TEST.ADD_FILE:
        return handleValueUpdate(ADD_EVENT.REQUEST_BODY.TEST.ID, event, path, fileList);
      case ADD_EVENT.REQUEST_BODY.TEST.DELETE_FILE:
        return handleDeleteFile(path, fileList);
      case ADD_EVENT.REQUEST_BODY.TEST.RETRY_UPLOAD:
        return handleRetryUpload(path, fileList);
      default:
        break;
    }
    return null;
  };

    const changeTestConfirmation = (value) => {
      updateFlowData({ confirm_test: value });
    };

    const testIntegrationStep = async () => {
      console.log('tsetIntegration', cloneDeep(test_body), cloneDeep(test_query_params));
      const testRequestBody = getIntegrationTestRequestBodyData(cloneDeep(test_body), 'test_value') || [];
      const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
      const { testIntegrationDocs = [] } = clonedIntegerationDetails;
      const testRequestError = validate(
        { event_headers: test_event_headers, query_params: test_query_params, relative_path: test_relative_path },
        testRequestIntegrationData(t),
        t,
      );
        const testRequestBodyErrorList = validate(testRequestBody, testRequestBodyValidationSchema(t), t);
        const clonedIntegerationData = cloneDeep(currentIntegrationData);
        clonedIntegerationData.integration_error_list = {
          ...clonedIntegerationData.integration_error_list,
          testRequestBodyErrorList,
          testRequestError,
        };
        updateIntegerationData(clonedIntegerationData);
        let fileResponseData = { uploadFailedCount: 0 };
        let updatedIntegrationData = currentIntegrationData;
        let updatedRequestBodyData = testRequestBody;
      if (isEmpty(testRequestBodyErrorList) && isEmpty(testRequestError)) {
        updatePostLoader(true);
        setPointerEvent(true);
        if ((testIntegrationDocs || []).length > 0) {
            fileResponseData = await onMultiFileUpload(testIntegrationDocs);
            if (fileResponseData?.progressResponseData) {
              updatedIntegrationData = updateIndividualFileStatus(fileResponseData.progressResponseData, currentIntegrationData);
              updatedRequestBodyData = getIntegrationTestRequestBodyData(cloneDeep(updatedIntegrationData?.test_body), 'test_value') || [];
              updateIntegerationData(updatedIntegrationData);
            }
        }
        if (fileResponseData.uploadFailedCount === 0) {
          const integrationTestPostData = constructIntegrationTestPostData(
            cloneDeep(updatedIntegrationData), updatedRequestBodyData,
          );
          console.log(integrationTestPostData, updatedRequestBodyData, updatedIntegrationData, 'integrationTestPostData integrationTestPostData');
          dispatch(testIntegrationApiThunk(integrationTestPostData, currentIntegrationData._id));
        } else {
          updatePostLoader(false);
          setPointerEvent(false);
          showToastPopover(
            t(TEST_INTEGRATION_CONFIGURATION.FILE_UPLOAD.FAILURE),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
      }
    };
    console.log('test_responsetest_response', test_body, currentIntegrationData, code, !Number.isNaN(code));
    return (
        <>
        <div className={cx(gClasses.FTwo18GrayV3, gClasses.MB15, gClasses.FontWeight500, configStyles.BodyHeader)}>
          {t(TEST_INTEGRATION_CONFIGURATION.HEADING)}
        </div>
        <div className={cx(styles.TestConfirmation, gClasses.CenterV, BS.JC_BETWEEN, gClasses.MB20)}>
          <div
            className={cx(gClasses.FTwo13GrayV89, gClasses.FontWeight600)}
          >
            {t(TEST_INTEGRATION_CONFIGURATION.CONFIRMATION.TITLE)}
          </div>
          <RadioGroup
            id={TEST_INTEGRATION_CONFIGURATION.CONFIRMATION.ID}
            className={gClasses.CenterV}
            optionList={TEST_INTEGRATION_CONFIGURATION.CONFIRMATION.OPTIONS}
            onClick={changeTestConfirmation}
            selectedValue={(confirm_test ? 1 : 0)}
            type={RADIO_GROUP_TYPE.TYPE_1}
            radioButtonClasses={styles.FormFieldRadio}
            hideLabel
            radioSelectedStyle={styles.RadioSelectedStyle}
          />
        </div>
        {!isEmpty(test_relative_path) && confirm_test === 1 && (
          <div className={gClasses.MB15}>
            <div className={cx(gClasses.MB8, tableStyles.SectionHeader)}>{t(TEST_INTEGRATION_CONFIGURATION.RELATIVE_PATH.TITLE)}</div>
            <MappingTable
              tblHeaders={TEST_INTEGRATION_CONFIGURATION.RELATIVE_PATH.HEADER}
              mappingList={test_relative_path}
              handleMappingChange={() => { }}
              mappingKey={TEST_INTEGRATION_CONFIGURATION.RELATIVE_PATH.ID}
              initialRow={initialRelativePathRow}
              initialRowKeyValue={{
                key: EMPTY_STRING,
                value: EMPTY_STRING,
              }}
              headerClassName={styles.Header}
              noAddRow
            />
          </div>
        )}
        {!isEmpty(test_event_headers) && confirm_test === 1 && (
          <div className={gClasses.MB15}>
            <div className={cx(gClasses.MB8, tableStyles.SectionHeader)}>{t(TEST_INTEGRATION_CONFIGURATION.HEADERS.TITLE)}</div>
            <MappingTable
              tblHeaders={TEST_INTEGRATION_CONFIGURATION.HEADERS.HEADER}
              mappingList={test_event_headers}
              handleMappingChange={() => { }}
              mappingKey={TEST_INTEGRATION_CONFIGURATION.HEADERS.ID}
              initialRow={(index) => initialRow(index, TEST_INTEGRATION_CONFIGURATION.HEADERS.TEST_ID, TEST_INTEGRATION_CONFIGURATION.HEADERS.ID)}
              initialRowKeyValue={{
                key: EMPTY_STRING,
                value: EMPTY_STRING,
              }}
              headerClassName={styles.Header}
              noAddRow
            />
          </div>
        )}
        {!isEmpty(test_query_params) && confirm_test === 1 && (
          <div className={gClasses.MB15}>
            <div className={cx(gClasses.MB8, tableStyles.SectionHeader)}>{t(TEST_INTEGRATION_CONFIGURATION.QUERY.TITLE)}</div>
            <MappingTable
              tblHeaders={TEST_INTEGRATION_CONFIGURATION.QUERY.HEADER}
              mappingList={test_query_params}
              handleMappingChange={() => { }}
              mappingKey={TEST_INTEGRATION_CONFIGURATION.QUERY.ID}
              initialRow={(index) => initialRow(index, TEST_INTEGRATION_CONFIGURATION.QUERY.TEST_ID, TEST_INTEGRATION_CONFIGURATION.QUERY.ID)}
              initialRowKeyValue={{
                key: EMPTY_STRING,
                value: EMPTY_STRING,
              }}
              headerClassName={styles.Header}
              noAddRow
            />
          </div>
        )}
        {(!isEmpty(test_body)) && confirm_test === 1 && (
          <div className={gClasses.MB15}>
            <div className={cx(gClasses.MB8, tableStyles.SectionHeader)}>{t(TEST_INTEGRATION_CONFIGURATION.REQUEST_BODY.TITLE)}</div>
            <RecursiveMappingTable
              request_body={test_body}
              RowComponent={TestRowComponent}
              onChangeHandlers={onChangeHandlers}
              handleAddRow={() => { }}
              error_list={testRequestBodyErrorList}
              showAddMore={false}
              headers={TEST_INTEGRATION_CONFIGURATION.TEST_REQUEST_BODY_HEADERS}
              headerStyles={[tableStyles.ColMax, tableStyles.ColMed, tableStyles.CheckboxCol, tableStyles.ColMax]}
            />
          </div>
        )}
        {confirm_test === 1 && (
        <>
          <div className={cx(gClasses.MT15, BS.D_FLEX, BS.JC_END)}>
            <Button
              buttonType={BUTTON_TYPE.OUTLINE_PRIMARY}
              onClick={testIntegrationStep}
            >
              {t(TEST_INTEGRATION_CONFIGURATION.CONFIRMATION.BUTTON_LABEL)}
            </Button>
          </div>
          {isTested && (
          <>
            {isTestLoading ? (
              <Skeleton width={150} />
            ) : (
            <div className={cx(gClasses.MT30, BS.D_FLEX, BS.JC_BETWEEN, status ? styles.TestResponseSuccess : styles.TestResponseFailure)}>
              <div className={cx(status ? gClasses.FTwo14GreenV20 : gClasses.FTwo14RedV20, gClasses.FontWeight500, gClasses.CenterV)}>
                {status ? t(TEST_INTEGRATION_CONFIGURATION.SUCCESS) : t(TEST_INTEGRATION_CONFIGURATION.FAILURE)}
              </div>
              {code && status && (
                <div className={cx(BS.D_FLEX, BS.JC_END)}>
                  <div className={cx(gClasses.FTwo13GreenV20, gClasses.FontWeight500, gClasses.CenterV, styles.Code)}>
                    {`Status: ${code}`}
                  </div>
                  <div className={cx(gClasses.FTwo13GreenV20, gClasses.FontWeight500, gClasses.CenterV, gClasses.PL8)}>
                    {`Time: ${time} ms`}
                  </div>
                </div>
              )}
            </div>
            )}
            {showResponseWindow &&
              <div className={cx(gClasses.MT30)}>
              <TextArea
                  hideLabel
                  value={JSON.stringify(test_response, null, 4)}
                  innerClass={cx(styles.TestResponse, gClasses.FTwo13)}
                  isCreationField
                  isTable
                  readOnly
                  isDataLoading={isTestLoading}
              />
                {/* {} */}
              </div>}
          </>
          )}
        </>
        )}
        </>
    );
}

const mapStateToProps = ({ EditFlowReducer }) => {
    return {
        confirm_test: EditFlowReducer.flowData.confirm_test,
    };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateFlowData: (...params) => {
      dispatch(updateFlowDataChange(...params));
    },
    onGetAllFieldsByFilter: (
      paginationData,
      // currentFieldUuid,
      // fieldType,
      // noLstAllFieldsUpdate,
      setStateKey,
      mapping,
    ) => {
      dispatch(
        getTriggerMappingFields(
          paginationData,
          // currentFieldUuid,
          // fieldType,
          // noLstAllFieldsUpdate,
          setStateKey,
          mapping,
        ),
      );
    },
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TestIntegration));
