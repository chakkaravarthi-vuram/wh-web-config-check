import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import {
  Button,
  EButtonType,
  ETextSize,
  InputTreeLayout,
  Modal,
  ModalSize,
  Skeleton,
  Text,
  TextArea,
  TextInput,
} from '@workhall-pvt-lmt/wh-ui-library';
import { integrationDataChange } from 'redux/reducer/IntegrationReducer';
import { testIntegrationApiThunk } from 'redux/actions/Integration.Action';
import MappingTable from 'containers/integration/mapping_table/MappingTable';
import { cloneDeep, set, unset, get, isEmpty } from 'utils/jsUtility';
import { useTranslation } from 'react-i18next';
import styles from './TestConnection.module.scss';
import { DOCUMENT_TYPES, EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { FEATURE_INTEGRATION_STRINGS, TEST_INTEGRATION_STRINGS } from '../../../../Integration.strings';
import RequestBodyComponent from './RequestBodyComponent';
import { validate } from '../../../../../../utils/joiUtils';
import {
  testRequestBodyValidationSchema,
  validateRelativeParamData,
} from '../../../../Integration.validation.schema';
import { getIntegrationTestRequestBodyData } from './TestConnection.utils';
import { constructIntegrationTestPostData, getDefaultKeyLabels, INTEGRATION_STRINGS } from '../../../../Integration.utils';
import { keydownOrKeypessEnterHandle, setPointerEvent, showToastPopover, updatePostLoader } from '../../../../../../utils/UtilityFunctions';
import { BS } from '../../../../../../utils/UIConstants';
import GreenTickIcon from '../../../../../../assets/icons/form_post_operation_feedback/GreenTickIcon';
import CopyIcon from '../../../../../../assets/icons/integration/CopyIcon';
import { REQ_BODY_NESTED_LEVEL } from '../../../../Integration.constants';
import PlusIcon from '../../../../../../assets/icons/PlusIcon';
import CloseVectorIcon from '../../../../../../assets/icons/create_app/create_modal/CloseVectorIcon';
import { FILE_UPLOAD_STATUS, FORM_POPOVER_STATUS } from '../../../../../../utils/Constants';
import { getAccountConfigurationDetailsApiService } from '../../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import useMultiFileUploadHook from '../../../../../../hooks/useMultiFileUploadHook';
import { INTEGRATION_CONSTANTS } from '../../../../../edit_flow/diagramatic_flow_view/flow_component/flow_integration_configuration/FlowIntegrationConfiguration.constants';

function TestConnection(props) {
  const {
    state: {
      isTestConnectionModalVisible,
      active_test_event = {},
      test_error_list = {},
      connector_uuid,
      eventTestResponse = {},
      isTestLoading,
      _id,
    },
    integrationDataChange,
    testIntegrationApi,
  } = props;

  const { t } = useTranslation();
  const [isCopyTickClientId, setCopyTickClientId] = useState(false);
  const { ADD_EVENT } = INTEGRATION_STRINGS;

  const { onMultiFileUpload, uploadFileToDMS } = useMultiFileUploadHook({ entity_id: _id }, DOCUMENT_TYPES.INTEGRATION_TEST_FILE, INTEGRATION_CONSTANTS.TEST_INTEGRATION_CONFIGURATION.FILE_UPLOAD, t, true);

  console.log('active_test_event', active_test_event);

  const handleCloseClick = () => {
    integrationDataChange({
      isTestConnectionModalVisible: false,
      active_test_event: {},
      test_error_list: {},
      eventTestResponse: {},
    });
  };

  const onCopyClick = async () => {
    try {
        const testResponse = get(eventTestResponse, 'testResponse', {});
        await navigator.clipboard.writeText(JSON.stringify(testResponse, null, 2));
        setCopyTickClientId(true);
    } catch (error) {
        console.log('copy text failed');
    }
};
  useEffect(() => {
    getAccountConfigurationDetailsApiService().then((response) => {
      integrationDataChange({
        testIntegrationHelperData: {
          maxFileSize: response?.maximum_file_size,
          allowedExtensions: response?.allowed_extensions,
        },
      });
    });
  }, []);
useEffect(() => {
    if (isCopyTickClientId) {
        const timeoutId = setTimeout(() => {
            setCopyTickClientId(false);
        }, 3000);
        return () => clearTimeout(timeoutId);
    }
    return () => { };
}, [isCopyTickClientId]);

  const headerContent = (
    <div className={styles.ConfigurationHeader}>
      <div className={cx(
        BS.D_FLEX,
        BS.JC_BETWEEN,
        BS.ALIGN_ITEM_CENTER,
        gClasses.PR15,
        gClasses.PL40,
        gClasses.PB5,
      )}
      >
        <Text
          content={t(TEST_INTEGRATION_STRINGS.TEST_CONNECTION.BUTTON_LABEL)}
          size={ETextSize.XL}
        />
        <div
          role="button"
          tabIndex={0}
          onClick={handleCloseClick}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && handleCloseClick(e)}
          className={cx(gClasses.CursorPointer, styles.CloseIcon)}
        >
          <CloseVectorIcon />
        </div>
      </div>
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.PX40)}>
        <Text
          content={active_test_event?.name}
          className={cx(styles.EachSubTitle, gClasses.PR16, gClasses.Ellipsis, styles.SubTitleEllipsis)}
          size={ETextSize.LG}
          title={active_test_event?.name}
        />
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.W70)}>
          <Text
            content={`${t(FEATURE_INTEGRATION_STRINGS.METHOD)}: ${active_test_event?.method}`}
            size={ETextSize.MD}
            className={gClasses.MR24}
          />
          <Text
            content={`${t(FEATURE_INTEGRATION_STRINGS.END_POINT)}: ${active_test_event?.end_point}`}
            size={ETextSize.MD}
            className={cx(gClasses.WordBreakBreakWord)}
          />
        </div>
      </div>
    </div>
  );

  const onAssignRelativePathValue = (event, index) => {
    const clonedTestEvent = cloneDeep(active_test_event);
    const clonedErrorList = cloneDeep(test_error_list);

    set(
      clonedTestEvent,
      ['relative_path', index, 'test_value'],
      event.target.value,
    );

    unset(
      clonedErrorList,
      `${TEST_INTEGRATION_STRINGS.RELATIVE_PATH.ID},${index},${TEST_INTEGRATION_STRINGS.RELATIVE_PATH.VALUE.VALUE_KEY}`,
    );

    delete clonedErrorList[
      `relative_path,${index},${TEST_INTEGRATION_STRINGS.RELATIVE_PATH.VALUE.VALUE_KEY}`
    ];

    integrationDataChange({
      active_test_event: clonedTestEvent,
      test_error_list: clonedErrorList,
    });
  };

  const initialRelativePathRow = (index) => {
    const currentMappingList = cloneDeep(active_test_event?.relative_path);
    const isRequired = currentMappingList[index]?.is_required ? (
      <span className={styles.Required}>&nbsp;*</span>
    ) : null;

    return (
      <>
        <div className={cx(gClasses.MR24, BS.W50)}>
          <div
            className={cx(
              styles.KeyName,
              gClasses.ReadOnlyBg,
              gClasses.FTwo13GrayV3,
            )}
          >
            {currentMappingList[index]?.key}
            {isRequired}
          </div>
        </div>
        <div className={cx(gClasses.MR24, BS.W50)}>
          <TextInput
            id={`${TEST_INTEGRATION_STRINGS.RELATIVE_PATH.VALUE.ID}${index}`}
            onChange={(event) => {
              onAssignRelativePathValue(event, index);
            }}
            value={currentMappingList[index]?.test_value}
            errorMessage={
              test_error_list[
                `relative_path,${index},${TEST_INTEGRATION_STRINGS.RELATIVE_PATH.VALUE.VALUE_KEY}`
              ]
            }
          />
        </div>
      </>
    );
  };

  const getRelativePath = () => (
    <div className={gClasses.MB8}>
      <Text
        content={t(TEST_INTEGRATION_STRINGS.RELATIVE_PATH.TITLE)}
        className={cx(gClasses.MB8, styles.EachSubTitle)}
      />
      <MappingTable
        tblHeaders={TEST_INTEGRATION_STRINGS.RELATIVE_PATH.HEADER(t)}
        mappingList={active_test_event?.relative_path}
        handleMappingChange={() => {}}
        mappingKey={t(TEST_INTEGRATION_STRINGS.RELATIVE_PATH.ID)}
        initialRow={initialRelativePathRow}
        initialRowKeyValue={{
          key: EMPTY_STRING,
          value: EMPTY_STRING,
        }}
        headerClassName={styles.Header}
        noAddRow
      />
    </div>
  );

  const onAssignQueryParamValue = (event, index) => {
    const clonedTestEvent = cloneDeep(active_test_event);
    const clonedErrorList = cloneDeep(test_error_list);

    set(clonedTestEvent, ['params', index, 'test_value'], event.target.value);

    unset(
      clonedErrorList,
      `params,${index},${TEST_INTEGRATION_STRINGS.QUERY.VALUE.VALUE_KEY}`,
    );

    delete clonedErrorList[
      `params,${index},${TEST_INTEGRATION_STRINGS.QUERY.VALUE.VALUE_KEY}`
    ];

    integrationDataChange({
      active_test_event: clonedTestEvent,
      test_error_list: clonedErrorList,
    });
  };

  const initialQueryParamRow = (index) => {
    const currentMappingList = cloneDeep(active_test_event?.params);
    const isRequired = currentMappingList[index]?.is_required ? (
      <span className={styles.Required}>&nbsp;*</span>
    ) : null;

    return (
      <>
        <div className={cx(gClasses.MR24, BS.W50)}>
          <div
            className={cx(
              styles.KeyName,
              gClasses.ReadOnlyBg,
              gClasses.FTwo13GrayV3,
            )}
          >
            {currentMappingList[index]?.key}
            {isRequired}
          </div>
        </div>
        <div className={cx(gClasses.MR24, BS.W50)}>
          <TextInput
            id={`${TEST_INTEGRATION_STRINGS.QUERY.VALUE.ID}${index}`}
            onChange={(event) => {
              onAssignQueryParamValue(event, index);
            }}
            value={currentMappingList[index]?.test_value}
            errorMessage={
              test_error_list[
                `params,${index},${TEST_INTEGRATION_STRINGS.QUERY.VALUE.VALUE_KEY}`
              ]
            }
          />
        </div>
      </>
    );
  };

  const getQueryParams = () => (
    <div className={gClasses.MB8}>
      <Text
        content={t(TEST_INTEGRATION_STRINGS.QUERY.TITLE)}
        className={cx(gClasses.MB8, styles.EachSubTitle)}
      />
      <MappingTable
        tblHeaders={TEST_INTEGRATION_STRINGS.QUERY.HEADER(t)}
        mappingList={active_test_event?.params}
        handleMappingChange={() => {}}
        mappingKey={t(TEST_INTEGRATION_STRINGS.QUERY.ID)}
        initialRow={initialQueryParamRow}
        initialRowKeyValue={{
          key: EMPTY_STRING,
          value: EMPTY_STRING,
        }}
        headerClassName={styles.Header}
        noAddRow
      />
    </div>
  );

  const onAssignEventHeadersValue = (event, index) => {
    const clonedTestEvent = cloneDeep(active_test_event);
    const clonedErrorList = cloneDeep(test_error_list);

    set(clonedTestEvent, ['headers', index, 'test_value'], event.target.value);

    unset(
      clonedErrorList,
      `headers,${index},${TEST_INTEGRATION_STRINGS.HEADERS.VALUE.VALUE_KEY}`,
    );

    delete clonedErrorList[
      `headers,${index},${TEST_INTEGRATION_STRINGS.HEADERS.VALUE.VALUE_KEY}`
    ];

    integrationDataChange({
      active_test_event: clonedTestEvent,
      test_error_list: clonedErrorList,
    });
  };

  const initialEventHeadersRow = (index) => {
    const currentMappingList = cloneDeep(active_test_event?.headers);
    const isRequired = currentMappingList[index]?.is_required ? (
      <span className={styles.Required}>&nbsp;*</span>
    ) : null;

    return (
      <>
        <div className={cx(gClasses.MR24, BS.W50)}>
          <div
            className={cx(
              styles.KeyName,
              gClasses.ReadOnlyBg,
              gClasses.FTwo13GrayV3,
            )}
          >
            {currentMappingList[index]?.key}
            {isRequired}
          </div>
        </div>
        <div className={cx(gClasses.MR24, BS.W50)}>
          <TextInput
            id={`${TEST_INTEGRATION_STRINGS.HEADERS.VALUE.ID}${index}`}
            onChange={(event) => {
              onAssignEventHeadersValue(event, index);
            }}
            value={currentMappingList[index]?.test_value}
            errorMessage={
              test_error_list[
                `headers,${index},${TEST_INTEGRATION_STRINGS.HEADERS.VALUE.VALUE_KEY}`
              ]
            }
          />
        </div>
      </>
    );
  };

  const getEventHeaders = () => (
    <div className={gClasses.MB8}>
      <Text
        content={t(TEST_INTEGRATION_STRINGS.HEADERS.TITLE)}
        className={cx(gClasses.MB8, styles.EachSubTitle)}
      />
      <MappingTable
        tblHeaders={TEST_INTEGRATION_STRINGS.HEADERS.HEADER(t)}
        mappingList={active_test_event?.headers}
        handleMappingChange={() => {}}
        mappingKey={t(TEST_INTEGRATION_STRINGS.HEADERS.ID)}
        initialRow={initialEventHeadersRow}
        initialRowKeyValue={{
          key: EMPTY_STRING,
          value: EMPTY_STRING,
        }}
        headerClassName={styles.Header}
        noAddRow
      />
    </div>
  );

  const handleDeleteFile = (path, { index }) => {
    const clonedTestEvent = cloneDeep(active_test_event);
    const { testIntegrationDocs = [] } = clonedTestEvent;
    path = (path || []).split(',');
    const files = get(clonedTestEvent, ['body', ...path, ADD_EVENT.REQUEST_BODY.TEST.ID, 'fileData'], []);
    files.splice(index, 1);
    set(clonedTestEvent, ['body', ...path, ADD_EVENT.REQUEST_BODY.TEST.ID], { fileData: files });
    if (testIntegrationDocs.length > 0) {
      const testDocIndex = testIntegrationDocs.findIndex((testDoc) => (testDoc.path === path.join()));
      if (testDocIndex > -1) {
        set(clonedTestEvent, ['testIntegrationDocs', testDocIndex, 'fileData'], files);
      }
    }
    integrationDataChange({
      active_test_event: clonedTestEvent,
    });
  };

  const updateIndividualFileStatus = (progressResponseData, active_test_event) => {
    const clonedTestEvent = cloneDeep(active_test_event);
    const { testIntegrationDocs = [] } = clonedTestEvent;
    progressResponseData.forEach(({ index, path, data }) => {
      path = (path || []).split(',');
      const fileData = get(clonedTestEvent, ['body', ...path, ADD_EVENT.REQUEST_BODY.TEST.ID, 'fileData', index], {});
      const finalData = { ...fileData, ...data };
      set(clonedTestEvent, ['body', ...path, ADD_EVENT.REQUEST_BODY.TEST.ID, 'fileData', index], finalData);
      const testDocIndex = testIntegrationDocs.findIndex((testDoc) => (testDoc.path === path.join()));
      set(clonedTestEvent, ['testIntegrationDocs', testDocIndex, 'fileData', index], finalData);
    });
    return clonedTestEvent;
  };

  const handleRetryUpload = async (path, { index }) => {
    const clonedTestEvent = cloneDeep(active_test_event);
    let updatedTestEvent = await updateIndividualFileStatus([{
      index,
      path,
      data: { status: FILE_UPLOAD_STATUS.IN_PROGRESS, progress: 0 },
    }], clonedTestEvent);
    integrationDataChange({
      active_test_event: updatedTestEvent,
    });
    path = (path || []).split(',');
    const file = get(updatedTestEvent, ['body', ...path, ADD_EVENT.REQUEST_BODY.TEST.ID, 'fileData', index], []);
    const res = await uploadFileToDMS({
      _id: file?.fileId,
      upload_signed_url: file?.upload_signed_url || {},
    }, {
      fileIndex: index,
      ...file,
    });
    updatedTestEvent = updateIndividualFileStatus([res], updatedTestEvent);
    integrationDataChange({
      active_test_event: updatedTestEvent,
    });
  };

  const onRequestBodyChange = ({ event, path, fileList }) => {
    const clonedTestEvent = cloneDeep(active_test_event);
    const clonedErrorList = cloneDeep(test_error_list);
    let clonedPath = cloneDeep(path);
    clonedPath = (clonedPath || []).split(',');
    const currentRowJson = get(clonedTestEvent?.body || {}, clonedPath, {});
    if (fileList?.length > 0) {
      const { testIntegrationDocs = [] } = clonedTestEvent;
      const files = get(clonedTestEvent, ['body', ...clonedPath, ADD_EVENT.REQUEST_BODY.TEST.ID, 'fileData'], []);
      fileList.forEach((file) => {
        const localFileURL = URL.createObjectURL(file);
        files.push({
          file,
          localFileURL,
          url: localFileURL,
          fileName: file.name,
          status: FILE_UPLOAD_STATUS.LOCAL_FILE,
          path: clonedPath.join(),
        });
      });
      set(clonedTestEvent, ['body', ...clonedPath, ADD_EVENT.REQUEST_BODY.TEST.ID], { fileData: files });
      const index = testIntegrationDocs.findIndex((testDoc) => (testDoc.path === clonedPath.join()));
      if (index > -1) {
        set(clonedTestEvent, ['testIntegrationDocs', index, 'fileData'], files);
      } else {
        set(clonedTestEvent, ['testIntegrationDocs'], [
          ...testIntegrationDocs,
          { fileData: files, path: clonedPath.join() },
        ]);
      }
  } else set(clonedTestEvent, ['body', ...clonedPath, ADD_EVENT.REQUEST_BODY.TEST.ID], event?.target?.value);

    if (currentRowJson?.root_uuid) {
      const parentPath = cloneDeep(clonedPath);
      (parentPath || []).splice(clonedPath.length - 2, 2);

      const parentData = get(clonedTestEvent?.body || {}, parentPath, {});
      if (parentData.type === 'object') {
        set(
          clonedTestEvent,
          ['body', ...parentPath, 'test_value'],
          EMPTY_STRING,
        );
      }

      unset(clonedErrorList, [[...parentPath, 'test_value'].join(',')]);
      unset(clonedErrorList, [[...parentPath, 'child_rows'].join(',')]);
    }
    unset(clonedErrorList, [[...path, 'test_value'].join(',')]);
    unset(clonedErrorList, [[...path, 'child_rows'].join(',')]);

    integrationDataChange({
      active_test_event: clonedTestEvent,
      test_error_list: clonedErrorList,
    });
  };

  const onChangeHandlers = ({ event, type, path, fileList }) => {
    switch (type) {
      case ADD_EVENT.REQUEST_BODY.TEST.ID:
      case ADD_EVENT.REQUEST_BODY.TEST.ADD_FILE:
        return onRequestBodyChange({ event, path, fileList });
      case ADD_EVENT.REQUEST_BODY.TEST.DELETE_FILE:
        return handleDeleteFile(path, fileList);
      case ADD_EVENT.REQUEST_BODY.TEST.RETRY_UPLOAD:
        return handleRetryUpload(path, fileList);
      default:
        break;
    }
    return null;
  };

  const getRequestBody = () => (
    <div className={gClasses.MB8}>
      <Text
        content={t(TEST_INTEGRATION_STRINGS.REQUEST_BODY.TITLE)}
        className={cx(gClasses.MB8, styles.EachSubTitle)}
      />
      <InputTreeLayout
        tableHeaders={TEST_INTEGRATION_STRINGS.TEST_REQUEST_BODY_HEADERS(t)}
        headerStyles={[
          styles.KeyColumn,
          styles.TypeColumn,
          styles.MultipleColumn,
          styles.ValueColumn,
        ]}
        data={active_test_event?.body}
        showAddMore={false}
        depth={REQ_BODY_NESTED_LEVEL.INIT_DEPTH}
        maxDepth={REQ_BODY_NESTED_LEVEL.MAX_DEPTH}
        AddMoreIcon={() => <PlusIcon className={cx(styles.Icon, BS.MY_AUTO)} />}
        // colorScheme={colorScheme}
        parentDetails={{}}
        onChangeHandlers={onChangeHandlers}
        RowComponent={RequestBodyComponent}
        errorList={test_error_list}
        keyLabels={getDefaultKeyLabels(t)}
        readOnlyView
      />
    </div>
  );

  const onTestEvent = async () => {
    const paramRelativeError = validate(
      {
        headers: active_test_event?.headers,
        params: active_test_event?.params,
        relative_path: active_test_event?.relative_path,
      },
      validateRelativeParamData(t),
      t,
    );

    const testRequestBody =
      getIntegrationTestRequestBodyData(cloneDeep(active_test_event?.body)) ||
      [];

    const requestBodyError = validate(
      testRequestBody,
      testRequestBodyValidationSchema(t),
      t,
    );

    integrationDataChange({
      test_error_list: {
        ...paramRelativeError,
        ...requestBodyError,
      },
    });
    let fileResponseData = { uploadFailedCount: 0 };
    let updatedRequestBodyData = testRequestBody;
    const clonedTestEvent = cloneDeep(active_test_event);
    const { testIntegrationDocs = [] } = clonedTestEvent;
    if (isEmpty(requestBodyError) && isEmpty(paramRelativeError)) {
      updatePostLoader(true);
      setPointerEvent(true);
      if ((testIntegrationDocs || []).length > 0) {
        fileResponseData = await onMultiFileUpload(testIntegrationDocs);
        if (fileResponseData?.progressResponseData) {
          const updatedTestEvent = updateIndividualFileStatus(fileResponseData.progressResponseData, clonedTestEvent);
          updatedRequestBodyData = getIntegrationTestRequestBodyData(cloneDeep(updatedTestEvent?.body)) || [];
          integrationDataChange({
            active_test_event: updatedTestEvent,
          });
        }
      }
      if (fileResponseData.uploadFailedCount === 0) {
        const testEventPostData = constructIntegrationTestPostData({
          body: updatedRequestBodyData,
          params: active_test_event?.params,
          headers: active_test_event?.headers,
          relative_path: active_test_event?.relative_path,
          event_uuid: active_test_event?.event_uuid,
          connector_uuid,
        });
        testIntegrationApi(testEventPostData);
      } else {
        updatePostLoader(false);
        setPointerEvent(false);
        showToastPopover(
          t(INTEGRATION_CONSTANTS.TEST_INTEGRATION_CONFIGURATION.FILE_UPLOAD.FAILURE),
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
    }
  };

  const testResponse = get(eventTestResponse, 'testResponse', {});
  const testStatus = get(eventTestResponse, 'testStatus', {});

  const {
    status,
    code,
    time = 60,
    isTested = false,
    showResponseWindow = false,
  } = testStatus;

  const mainContent = (
    <div className={styles.TestConnectionContainer}>
      {!isEmpty(active_test_event?.relative_path) && getRelativePath()}
      {!isEmpty(active_test_event?.headers) && getEventHeaders()}
      {!isEmpty(active_test_event?.params) && getQueryParams()}
      {!isEmpty(active_test_event?.body) && getRequestBody()}

      {(isTested || isTestLoading) && (
        <>
          {isTestLoading ? (
            <Skeleton width="100%" height={200} />
          ) : (
            <div
              className={cx(
                gClasses.MT30,
                BS.D_FLEX,
                BS.JC_BETWEEN,
                status
                  ? styles.TestResponseSuccess
                  : styles.TestResponseFailure,
              )}
            >
              <div
                className={cx(
                  status ? gClasses.FTwo14GreenV20 : gClasses.FTwo14RedV20,
                  gClasses.FontWeight500,
                  gClasses.CenterV,
                )}
              >
                {status
                  ? t(TEST_INTEGRATION_STRINGS.SUCCESS)
                  : t(TEST_INTEGRATION_STRINGS.FAILURE)}
              </div>
              {code && status && (
                <div className={cx(BS.D_FLEX, BS.JC_END)}>
                  <div
                    className={cx(
                      gClasses.FTwo13GreenV20,
                      gClasses.FontWeight500,
                      gClasses.CenterV,
                      styles.Code,
                    )}
                  >
                    {`Status: ${code}`}
                  </div>
                  <div
                    className={cx(
                      gClasses.FTwo13GreenV20,
                      gClasses.FontWeight500,
                      gClasses.CenterV,
                      gClasses.PL8,
                    )}
                  >
                    {`Time: ${time} ms`}
                  </div>
                </div>
              )}
            </div>
          )}
          {
            showResponseWindow && (
              <div className={cx(gClasses.MT30)}>
                {
                  isCopyTickClientId ?
                    (
                      <div className={styles.CopyIcon}>
                        <GreenTickIcon />
                      </div>
                    )
                    : (
                      <div className={cx(styles.CopyIcon)}>
                        <button onClick={onCopyClick}>
                          <CopyIcon />
                        </button>
                      </div>
                    )
                }
                <TextArea
                  value={JSON.stringify(testResponse, null, 4)}
                  className={cx(
                    styles.TestResponse,
                    gClasses.FTwo13,
                  )}
                  isLoading={isTestLoading}
                  labelClassName={gClasses.DisplayNone}
                  disabled
                />
              </div>
            )
          }
        </>
      )}
    </div>
  );

  const footerContent = (
    <div
      className={cx(
        BS.D_FLEX,
        BS.JC_END,
        BS.W100,
        BS.ALIGN_ITEM_CENTER,
        gClasses.PR30,
        styles.FooterClass,
      )}
    >
      <Button
        buttonText={t(TEST_INTEGRATION_STRINGS.CONFIRMATION.BUTTON_LABEL)}
        type={EButtonType.PRIMARY}
        onClickHandler={onTestEvent}
      />
    </div>
  );

  return (
    <Modal
      modalSize={ModalSize.lg}
      isModalOpen={isTestConnectionModalVisible}
      headerContent={headerContent}
      mainContent={mainContent}
      footerContent={footerContent}
      customModalClass={styles.AddEventModal}
    />
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    state: IntegrationReducer,
  };
};

const mapDispatchToProps = {
  integrationDataChange,
  testIntegrationApi: testIntegrationApiThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(TestConnection);
