import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import {
  ETextSize,
  Popper,
  Text,
  EPopperPlacements,
  Chip,
} from '@workhall-pvt-lmt/wh-ui-library';
import { WORKHALL_API_STRINGS } from '../../../../Integration.strings';
import TableComponent from '../api_components/ApiComponents';
import RequestBody from './request_body/RequestBody';
import FilterQuery from './filter_query/FilterQuery';
import {
  BODY_ROW_ID,
  REQ_BODY_NESTED_LEVEL,
  WH_API_CONSTANTS,
  WH_API_METHODS,
  WORKHALL_API_ALLOWED_FIELD_TYPES,
} from '../../../../Integration.constants';
import {
  filterInitialRowData,
  getPutRequestData,
  paramsInitialRowData,
} from '../../WorkhallApi.utils';
import { getAllFieldsByFilterApiThunk } from '../../../../../../redux/actions/Integration.Action';
import { integrationDataChange } from '../../../../../../redux/reducer/IntegrationReducer';
import { cloneDeep, isEmpty, set } from '../../../../../../utils/jsUtility';
import ResponseJsonContainer from './ResponseJsonContainer';
import styles from './RequestResponse.module.scss';
import { getResponseData, getSuccessResponseData } from '../../../../Integration.utils';
import InfoIconCircle from '../../../../../../assets/icons/integration/InfoIconCircle';
import { getAllFieldsUuidList } from '../../../../../../utils/UtilityFunctions';

function RequestResponse(props) {
  const {
    workhall_api_method,
    workhall_api_type,
    default_filter = [],
    query_params = [],
    isEditView,
    flow_id,
    data_list_id,
    isAllFieldsLoading,
    allFields,
    body = [],
    bodyError,
    errorList,
  } = props;

  const { REQUEST_RESPONSE } = WORKHALL_API_STRINGS;

  const [errorCodePopperOpen, setErrorCodePopperOpen] = useState(false);
  const popperRef = useRef();

  const getAllFields = async () => {
    const { getAllFieldsByFilter } = props;
    if (flow_id || data_list_id) {
      const paginationData = {
        page: 1,
        size: 1000,
        sort_by: 1,
        allowed_field_types: WORKHALL_API_ALLOWED_FIELD_TYPES,
      };
      if (workhall_api_type === WH_API_CONSTANTS.STARTING_A_FLOW) {
        paginationData.flow_id = flow_id;
        // paginationData.is_initiation = 1;
      } else {
        paginationData.data_list_id = data_list_id;
      }
      getAllFieldsByFilter(paginationData);
    }
  };
  useEffect(() => {
    if (!isAllFieldsLoading && isEmpty(allFields)) {
      getAllFields();
    }
  }, [flow_id, data_list_id]);

  let selectedDirectFieldUuidList = [];
  let selectedSystemFieldUuidList = [];
  if (isEditView) {
    selectedSystemFieldUuidList = getAllFieldsUuidList([...query_params, ...default_filter], REQUEST_RESPONSE.FILTER_FIELDS.SYSTEM_FIELD.ID);
    selectedDirectFieldUuidList = getAllFieldsUuidList([...query_params, ...default_filter], REQUEST_RESPONSE.FILTER_FIELDS.FIELD.ID);
  }

  const defaultFilter = workhall_api_method !== WH_API_METHODS.POST && ((!isEditView && !isEmpty(default_filter)) || isEditView) && (
    <>
      <Text
        content={WORKHALL_API_STRINGS.REQUEST_RESPONSE.FILTER}
        size={ETextSize.XL}
        className={styles.SectionTitle}
      />
      <FilterQuery
        mappingKey={REQUEST_RESPONSE.FILTER_FIELDS.ID}
        tblHeaders={REQUEST_RESPONSE.FILTER_HEADERS}
        initialRowKeyValue={filterInitialRowData}
        mappingList={default_filter}
        selectedSystemFieldUuidList={selectedSystemFieldUuidList}
        selectedDirectFieldUuidList={selectedDirectFieldUuidList}
        error_list={errorList}
        columnOneKey={REQUEST_RESPONSE.FILTER_FIELDS.FIELD.ID}
        columnOneSystemKey={REQUEST_RESPONSE.FILTER_FIELDS.SYSTEM_FIELD.ID}
        columnTwoKey={REQUEST_RESPONSE.FILTER_FIELDS.VALUE.ID}
        isEditView={isEditView}
      />
    </>
  );

  const queryParams = workhall_api_method === WH_API_METHODS.GET && ((!isEditView && !isEmpty(query_params)) || isEditView) && (
    <>
      <Text
        content={WORKHALL_API_STRINGS.REQUEST_RESPONSE.QUERY_PARAMS}
        size={ETextSize.XL}
        className={styles.SectionTitle}
      />
      <FilterQuery
        mappingKey={REQUEST_RESPONSE.QUERY_PARAMS_FIELDS.ID}
        tblHeaders={REQUEST_RESPONSE.QUERY_PARAMS_HEADERS}
        initialRowKeyValue={paramsInitialRowData}
        mappingList={query_params}
        selectedSystemFieldUuidList={selectedSystemFieldUuidList}
        selectedDirectFieldUuidList={selectedDirectFieldUuidList}
        error_list={errorList}
        columnOneKey={REQUEST_RESPONSE.QUERY_PARAMS_FIELDS.FIELD.ID}
        columnOneSystemKey={REQUEST_RESPONSE.FILTER_FIELDS.SYSTEM_FIELD.ID}
        columnTwoKey={REQUEST_RESPONSE.QUERY_PARAMS_FIELDS.KEY.ID}
        isEditView={isEditView}
      />
    </>
  );

  const headersData = workhall_api_method !== WH_API_METHODS.GET && (
    <>
      <Text
        content={WORKHALL_API_STRINGS.REQUEST_RESPONSE.HEADERS_TITLE}
        size={ETextSize.XL}
        className={cx(styles.SectionTitle, gClasses.MT30)}
      />
      <TableComponent
        headers={WORKHALL_API_STRINGS.REQUEST_RESPONSE.HEADERS}
        tblData={WORKHALL_API_STRINGS.REQUEST_RESPONSE.HEADERS_DATA}
        className={styles.HeaderQueryTable}
      />
    </>
  );

  const putBodyData = [...getPutRequestData(), ...cloneDeep(body)];

  const displayBodyRequestData =
    workhall_api_method === WH_API_METHODS.PUT ? putBodyData : body;

  console.log('displayBodyRequestData', displayBodyRequestData);

  const requestBody = workhall_api_method !== WH_API_METHODS.GET && (
    <>
      <Text
        content={WORKHALL_API_STRINGS.REQUEST_RESPONSE.REQUEST_TITLE}
        size={ETextSize.XL}
        className={cx(styles.SectionTitle, gClasses.MT30)}
      />
      <Text
        content={WORKHALL_API_STRINGS.REQUEST_RESPONSE.REQUEST_SUB_TITLE}
        size={ETextSize.SM}
      />
      <div className={cx(gClasses.DisplayFlex, gClasses.GAP20)}>
        <div className={styles.BodyConfig}>
          <RequestBody
            isEditView={isEditView}
            body={body}
            displayBody={displayBodyRequestData}
            bodyError={bodyError}
            errorList={errorList}
            maxDepth={REQ_BODY_NESTED_LEVEL.MAPPING_DEPTH}
          />
          {errorList?.body && (
            <Text
              content={WORKHALL_API_STRINGS.REQUEST_RESPONSE.REQUEST_ERROR}
              className={gClasses.red22}
            />
          )}
        </div>
        <div className={cx(gClasses.FlexGrow1, styles.SampleBody)}>
          <ResponseJsonContainer
            title={WORKHALL_API_STRINGS.REQUEST_RESPONSE.SAMPLE_RESPONSE}
            responseData={displayBodyRequestData}
          />
        </div>
      </div>
    </>
  );

  const bodyData = getSuccessResponseData();
  const defaultBodyLength = (bodyData || [])?.length;
  if (defaultBodyLength) {
    const lastRowChildsLength = bodyData[defaultBodyLength - 1]?.[BODY_ROW_ID.COLUMN_MAPPING]?.length;
    if (lastRowChildsLength) {
      set(bodyData, [defaultBodyLength - 1, BODY_ROW_ID.COLUMN_MAPPING, lastRowChildsLength - 1, BODY_ROW_ID.COLUMN_MAPPING], body);
    }
  }

  const bodyDataResponse = getResponseData();

  const toggleErrorCodeTooltip = (value) => {
    setTimeout(() => setErrorCodePopperOpen(value), 200);
  };

  const responseBody =
    workhall_api_method !== WH_API_METHODS.GET ? (
      <>
        <Text
          content={WORKHALL_API_STRINGS.REQUEST_RESPONSE.RESPONSE_TITLE}
          size={ETextSize.XL}
          className={cx(gClasses.MT30, styles.SectionTitle)}
        />
        <Text
          content={WORKHALL_API_STRINGS.REQUEST_RESPONSE.POST_OR_PUT_SUBTITLE}
          size={ETextSize.SM}
        />
        <div className={cx(gClasses.DisplayFlex, gClasses.GAP20)}>
          <div className={styles.BodyConfig}>
            <RequestBody
              isEditView={false}
              body={bodyDataResponse}
              displayBody={bodyDataResponse}
              hideRootAdd
              isReadOnlyResponse
            />
          </div>
          <div className={cx(gClasses.FlexGrow1, styles.SampleBody)}>
            <ResponseJsonContainer
              title={WORKHALL_API_STRINGS.REQUEST_RESPONSE.SAMPLE_RESPONSE}
              responseData={bodyDataResponse}
            />
          </div>
        </div>
      </>
    ) : (
      <>
        <Text
          content={WORKHALL_API_STRINGS.REQUEST_RESPONSE.RESPONSE_TITLE}
          size={ETextSize.XL}
          className={cx(gClasses.MT30, styles.SectionTitle)}
        />
        <Text
          content={WORKHALL_API_STRINGS.REQUEST_RESPONSE.GET_SUBTITLE}
          size={ETextSize.SM}
        />
        <div className={cx(gClasses.DisplayFlex, gClasses.GAP20)}>
          <div className={styles.BodyConfig}>
            <RequestBody
              isEditView={isEditView}
              body={body}
              displayBody={bodyData}
              bodyError={bodyError}
              errorList={errorList}
              hideRootAdd
            />
            {errorList?.body && (
              <Text
                content={WORKHALL_API_STRINGS.REQUEST_RESPONSE.RESPONSE_ERROR}
                className={gClasses.red22}
              />
            )}
          </div>
          <div className={cx(gClasses.FlexGrow1, styles.SampleBody)}>
            <ResponseJsonContainer
              title={WORKHALL_API_STRINGS.REQUEST_RESPONSE.SAMPLE_RESPONSE}
              responseData={bodyData}
            />
          </div>
        </div>
      </>
    );

  const statusCodeArr = REQUEST_RESPONSE.ERROR_CODES_LIST.map(
    (currentStatus) => (
      <Chip
        key={currentStatus.code}
        avatar={
          <span
            style={{ backgroundColor: currentStatus.textColor }}
            className={styles.StatusCodeChip}
          >
            {currentStatus.code}
          </span>
        }
        backgroundColor={currentStatus.background}
        text={currentStatus.text}
        textColor={currentStatus.textColor}
        className={cx(
          gClasses.MR4,
          gClasses.MB8,
          gClasses.HeightFitContent,
          styles.StatusCodeBigChip,
        )}
      />
    ),
  );

  const errorCodes = (
    <div className={cx(gClasses.CenterV, gClasses.WidthFitContent)} onMouseLeave={() => toggleErrorCodeTooltip(false)}>
      <Text
        content={`${WORKHALL_API_STRINGS.REQUEST_RESPONSE.STATUS_CODES} :`}
        className={cx(styles.ErrorCodes, gClasses.MR6)}
      />
      <div
        ref={popperRef}
        className={cx(gClasses.CursorPointer, gClasses.WidthFitContent)}
        onMouseEnter={() => toggleErrorCodeTooltip(true)}
      >
        <InfoIconCircle />
      </div>
      <Popper
        targetRef={popperRef}
        open={errorCodePopperOpen}
        placement={EPopperPlacements.TOP_START}
        className={gClasses.ZIndex22}
        content={
          <div className={styles.StatusCodeCont}>
            <Text
              content={WORKHALL_API_STRINGS.REQUEST_RESPONSE.STATUS_CODES}
              className={cx(gClasses.MB8, styles.ErrorCodeHeading)}
            />
            <div className={cx(styles.StatusCodes, gClasses.DisplayFlex)}>
              {statusCodeArr}
            </div>
          </div>
        }
      />
    </div>
  );

  return (
    <div>
      {defaultFilter}
      {queryParams}
      {headersData}
      {requestBody}
      {responseBody}
      {errorCodes}
    </div>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    workhall_api_method: IntegrationReducer.workhall_api_method,
    workhall_api_type: IntegrationReducer.workhall_api_type,
    flow_id: IntegrationReducer.flow_id,
    data_list_id: IntegrationReducer.data_list_id,
    default_filter: IntegrationReducer.default_filter,
    query_params: IntegrationReducer.query_params,
    isAllFieldsLoading: IntegrationReducer.isAllFieldsLoading,
    allFields: IntegrationReducer.allFields,
    body: IntegrationReducer.body,
    bodyError: IntegrationReducer.bodyError,
    errorList: IntegrationReducer.error_list,
  };
};

const mapDispatchToProps = {
  getAllFieldsByFilter: getAllFieldsByFilterApiThunk,
  integrationDataChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestResponse);
