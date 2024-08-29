import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import {
  ETitleHeadingLevel,
  ETitleSize,
  Modal,
  ModalSize,
  ModalStyleType,
  Title,
  Text,
  TextInput,
  SingleDropdown,
  Button,
  EButtonType,
  EButtonIconPosition,
} from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { validate } from 'utils/UtilityFunctions';
import { cloneDeep, isEmpty, set } from 'utils/jsUtility';
import CloseIcon from 'assets/icons/task/CloseIcon';
import RefreshIcon from 'assets/icons/RefreshIconV3';
import { dbConnectorDataChange } from 'redux/reducer/IntegrationReducer';
import styles from './AddQuery.module.scss';
import {
  DB_CONNECTION_QUERIES_STRINGS,
  TEST_SUCCESS_STRINGS,
} from '../../DBConnector.strings';
import TestSuccess from '../../test_success/TestSuccess';
import {
  constructSelectedFieldsSchema,
  constructSelectedFiltersSchema,
  dbConnectorQueryConfigCommonSchema,
  dbConnectorQueryConfigSchema,
} from '../../DBConnector.validation.schema';
import {
  fetchDBDataApiThunk,
  getDBConnetorOptionsApiThunk,
  getSingleDBConnetorQueryConfigurationApiThunk,
  getTableInfoApiThunk,
  getTablesListApiThunk,
  postDBConnectorQueryApiThunk,
  publishDBConnectorQueryApiThunk,
} from '../../../../../../redux/actions/Integration.Action';
import {
  generateDropDownOptions,
  generateQueryDataJsonContainer,
  generateSaveQueryData,
} from '../../DBConnector.utils';
import { QUERY_ACTION_OPTIONS } from '../../DBConnector.constant';
import FieldConfig from './FieldConfig';
import ResponseJsonContainer from '../../../workhall_api/edit_workhall_integration/request_response/ResponseJsonContainer';

function AddQuery(props) {
  const { t } = useTranslation();
  const {
    isModalOpen,
    closeModel,
    query,
    dbConnectorDataChange,
    errorList,
    fieldErrorList,
    filterErrorList,
    connector_id,
    connector_uuid,
    db_type,
    dbOptions,
    getDBConnetorOptionsApi,
    tableList,
    tableInfo,
    getTablesListApi,
    getTableInfoApi,
    fetchDBDataApi,
    postDBConnectorQueryApi,
    publishDBConnectorQueryApi,
    queryData,
    queryDetails,
    isEditView,
  } = props;
  const {
    QUERY_CONFIG,
    QUERY_CONFIG: { SORT_PARAMETERS, BUTTON },
  } = DB_CONNECTION_QUERIES_STRINGS(t);
  const isFromEditQuery = !isEmpty(query?.db_query_uuid);

  useEffect(() => {
    getDBConnetorOptionsApi({ database_type: db_type }).then(() => {
      if (isFromEditQuery) {
        const { getSingleDBConnetorQueryConfigurationApi } = props;
        const data = {
          _id: query._id,
          connector_uuid,
        };
        getSingleDBConnetorQueryConfigurationApi(data, t);
      } else {
        dbConnectorDataChange({ query: { skip_data: 0, limit_data: 100 } });
      }
    });
  }, []);

  const getTableListDetails = (tableType = query.data_source_type) => {
    if (!isEmpty(tableType)) {
      const data = {
        connector_id,
        table_type: tableType,
      };
      getTablesListApi(data, t);
    }
  };

  const onInputChangeHandler = (value, id) => {
    const inputData = cloneDeep(query);
    const cloneErrorList = cloneDeep(errorList);
    switch (id) {
      case QUERY_CONFIG.QUERY_SOURCE.ID:
        inputData[id] = value;
        delete cloneErrorList[id];
        getTableListDetails(value);
        break;
      case QUERY_CONFIG.QUERY_NAME.ID:
      case QUERY_CONFIG.SOURCE_NAME.ID:
      case QUERY_CONFIG.QUERY_ACTION.ID:
        inputData[id] = value;
        delete cloneErrorList[id];
        break;
      case SORT_PARAMETERS.SKIP.ID:
      case SORT_PARAMETERS.LIMIT.ID:
        inputData[id] = Number(value);
        delete cloneErrorList[id];
        break;
      default:
        break;
    }
    dbConnectorDataChange({ query: inputData, error_list: cloneErrorList });
  };

  const onFetchColumns = () => {
    const data = {
      db_query_name: query?.db_query_name,
      data_source_type: query?.data_source_type,
      table_name: query?.table_name,
      query_action: query?.query_action,
    };
    const currentErrorList = validate(
      data,
      dbConnectorQueryConfigCommonSchema(t),
    );
    if (isEmpty(currentErrorList)) {
      const data = {
        connector_id,
        table_name: query.table_name,
      };
      getTableInfoApi(data).then(() => {
        dbConnectorDataChange({
          query: {
            ...query,
            selected_fields: [],
            selected_filters: [],
            sort_fields: {
              order_type: query?.sort_fields?.order_type,
            },
            isColumnFetched: true,
          },
        });
      });
    } else {
      dbConnectorDataChange({ error_list: currentErrorList });
    }
  };

  const onSaveQueryDetails = async () => {
    const cloneQuery = cloneDeep(query);
    if (isEmpty(cloneQuery?.selected_fields)) {
      set(cloneQuery, 'selected_fields', []);
    }
    if (isEmpty(cloneQuery?.selected_filters)) {
      set(cloneQuery, 'selected_filters', []);
    }
    if (isEmpty(cloneQuery?.sort_fields)) {
      set(cloneQuery, 'sort_fields', {});
    }
    const currentErrorList = validate(
      cloneQuery,
      dbConnectorQueryConfigSchema(t),
    );
    const currentFieldErrorList = validate(
      cloneQuery.selected_fields,
      constructSelectedFieldsSchema(t),
    );
    const currentFilterErrorList = validate(
      cloneQuery.selected_filters,
      constructSelectedFiltersSchema(t),
    );
    if (currentFilterErrorList?.['0']?.includes(QUERY_CONFIG.VALUES.LABEL)) {
      currentFilterErrorList[`0,${QUERY_CONFIG.VALUES.ID},0`] = currentFilterErrorList['0'];
      delete currentFilterErrorList['0'];
    }
    if (
      isEmpty(currentErrorList) &&
      isEmpty(currentFieldErrorList) &&
      isEmpty(currentFilterErrorList)
    ) {
      const queryData = generateSaveQueryData(
        cloneQuery,
        connector_id,
        connector_uuid,
        isFromEditQuery,
      );
      try {
        await postDBConnectorQueryApi(queryData);
        publishDBConnectorQueryApi({ connector_uuid }, closeModel);
      } catch (error) {
        console.log('unable to save or publish db connector query', error);
      }
    } else {
      dbConnectorDataChange({
        error_list: currentErrorList,
        field_error_list: currentFieldErrorList,
        filter_error_list: currentFilterErrorList,
      });
    }
  };

  const fieldConfig = query.isColumnFetched ? (
    <FieldConfig
      query={query}
      dbOptions={dbOptions}
      tableInfo={tableInfo}
      onInputChangeHandler={onInputChangeHandler}
      dbConnectorDataChange={dbConnectorDataChange}
      errorList={errorList}
      fieldErrorList={fieldErrorList}
      filterErrorList={filterErrorList}
      connector_id={connector_id}
      connector_uuid={connector_uuid}
      fetchDBDataApi={fetchDBDataApi}
      isEditView={isEditView}
    />
  ) : null;

  const headerContent = (
    <div className={cx(gClasses.CenterVSpaceBetween, BS.W100)}>
      <Title
        content={QUERY_CONFIG.TITLE}
        headingLevel={ETitleHeadingLevel.h2}
        size={ETitleSize.medium}
        className={gClasses.FTwo20BlackV12}
      />
      <button onClick={closeModel}>
        <CloseIcon />
      </button>
    </div>
  );

  let fetchColumnButtonText = BUTTON.FETCH_COLUMN_NAMES.LABEL;
  if (query.isColumnFetched) {
    fetchColumnButtonText = BUTTON.FETCH_COLUMN_NAMES.LABEL2;
  }

  const mainContent = (
    <div className={cx(gClasses.MX40)}>
      <TextInput
        id={QUERY_CONFIG.QUERY_NAME.ID}
        className={gClasses.MB16}
        labelText={QUERY_CONFIG.QUERY_NAME.LABEL}
        labelClassName={styles.LabelClassName}
        value={query.db_query_name}
        onChange={(event) => {
          const { value, id } = event.target;
          onInputChangeHandler(value, id);
        }}
        errorMessage={errorList[QUERY_CONFIG.QUERY_NAME.ID]}
        readOnly={!isEditView}
        required
      />
      <SingleDropdown
        id={QUERY_CONFIG.QUERY_SOURCE.ID}
        className={gClasses.MB16}
        dropdownViewProps={{
          labelName: QUERY_CONFIG.QUERY_SOURCE.LABEL,
          labelClassName: styles.LabelClassName,
          isRequired: true,
          disabled: !isEditView,
        }}
        required
        optionList={generateDropDownOptions(dbOptions?.query_source)}
        selectedValue={query.data_source_type}
        onClick={(value, _label, _list, id) => onInputChangeHandler(value, id)}
        errorMessage={errorList[QUERY_CONFIG.QUERY_SOURCE.ID]}
      />
      <div className={cx(BS.D_FLEX, gClasses.MB16)}>
        <SingleDropdown
          id={QUERY_CONFIG.SOURCE_NAME.ID}
          dropdownViewProps={{
            labelName: QUERY_CONFIG.SOURCE_NAME.LABEL,
            labelClassName: styles.LabelClassName,
            isRequired: true,
            disabled: !isEditView || tableList?.length === 0,
          }}
          required
          optionList={generateDropDownOptions(tableList)}
          selectedValue={query.table_name}
          onClick={(value, _label, _list, id) =>
            onInputChangeHandler(value, id)
          }
          errorMessage={errorList[QUERY_CONFIG.SOURCE_NAME.ID]}
        />
        {isEditView && (
          <button
            className={cx(gClasses.MT32, gClasses.ML15)}
            onClick={() => getTableListDetails()}
          >
            <RefreshIcon />
          </button>
        )}
      </div>
      <SingleDropdown
        id={QUERY_CONFIG.QUERY_ACTION.ID}
        className={gClasses.MB16}
        dropdownViewProps={{
          labelName: QUERY_CONFIG.QUERY_ACTION.LABEL,
          labelClassName: styles.LabelClassName,
          isRequired: true,
          disabled: !isEditView,
        }}
        required
        optionList={QUERY_ACTION_OPTIONS}
        selectedValue={query.query_action}
        onClick={(value, _label, _list, id) => onInputChangeHandler(value, id)}
        errorMessage={errorList[QUERY_CONFIG.QUERY_ACTION.ID]}
      />
      {isEditView && (
        <div className={gClasses.MB16}>
          <Button
            buttonText={fetchColumnButtonText}
            type={EButtonType.PRIMARY}
            className={gClasses.MB8}
            onClickHandler={onFetchColumns}
          />
          <Text
            content={BUTTON.FETCH_COLUMN_NAMES.INSTRUCTION}
            className={gClasses.FTwo12GrayV98}
          />
        </div>
      )}
      {fieldConfig}
      {isEditView && query.isTestSuccess && (
        <>
          <TestSuccess
            className={gClasses.MB24}
            description={TEST_SUCCESS_STRINGS(t).QUERY_DESCRIPTION}
          />
          {!isEmpty(queryDetails?.[0]) && (
            <ResponseJsonContainer
              responseData={generateQueryDataJsonContainer(queryData)}
            />
          )}
        </>
      )}
    </div>
  );

  const footerContent = isEditView && (
    <div className={cx(gClasses.RightH)}>
      <div className={cx(BS.D_FLEX, gClasses.Gap8)}>
        <Button
          buttonText={BUTTON.CANCEL}
          type={EButtonType.SECONDARY}
          noBorder
          className={gClasses.FTwo13BlackV20}
          onClickHandler={closeModel}
        />
        <Button
          buttonText={BUTTON.SAVE_QUERY}
          iconPosition={EButtonIconPosition.RIGHT}
          type={EButtonType.PRIMARY}
          disabled={!query.isTestSuccess}
          onClickHandler={onSaveQueryDetails}
        />
      </div>
    </div>
  );

  return (
    <Modal
      id="query_configuration"
      isModalOpen={isModalOpen}
      modalStyle={ModalStyleType.modal}
      modalSize={ModalSize.lg}
      headerContent={headerContent}
      headerContentClassName={cx(
        gClasses.MT24,
        gClasses.ML40,
        gClasses.MB20,
        gClasses.MR20,
      )}
      mainContent={mainContent}
      footerContent={footerContent}
      footerContentClassName={cx(
        gClasses.MR15,
        gClasses.ML30,
        gClasses.PT15,
        styles.FooterContent,
      )}
    />
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    query: IntegrationReducer.dbConnector.query,
    errorList: IntegrationReducer.dbConnector.error_list,
    fieldErrorList: IntegrationReducer.dbConnector.field_error_list,
    filterErrorList: IntegrationReducer.dbConnector.filter_error_list,
    connector_id: IntegrationReducer.dbConnector._id,
    connector_uuid: IntegrationReducer.dbConnector.db_connector_uuid,
    db_type: IntegrationReducer.dbConnector.authentication.db_type,
    dbOptions: IntegrationReducer.dbConnector.db_allowed_options,
    tableList: IntegrationReducer.dbConnector.table_list,
    tableInfo: IntegrationReducer.dbConnector.table_info,
    queryData: IntegrationReducer.dbConnector.query_data,
    queryDetails: IntegrationReducer.dbConnector.query_details,
  };
};

const mapDispatchToProps = {
  dbConnectorDataChange,
  postDBConnectorQueryApi: postDBConnectorQueryApiThunk,
  getDBConnetorOptionsApi: getDBConnetorOptionsApiThunk,
  getTablesListApi: getTablesListApiThunk,
  getTableInfoApi: getTableInfoApiThunk,
  fetchDBDataApi: fetchDBDataApiThunk,
  publishDBConnectorQueryApi: publishDBConnectorQueryApiThunk,
  getSingleDBConnetorQueryConfigurationApi: getSingleDBConnetorQueryConfigurationApiThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddQuery);
