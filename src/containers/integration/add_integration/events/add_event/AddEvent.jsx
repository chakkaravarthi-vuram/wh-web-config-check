import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import { v4 as uuidv4 } from 'uuid';
import modalStyles from 'components/form_components/modal_layout/CustomClasses.module.scss';
import {
  INTEGRATION_STRINGS,
  getEventsPostData,
  validateAndExtractRelativePathFromEndPoint,
} from 'containers/integration/Integration.utils';
import { BS } from 'utils/UIConstants';
import { Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { keydownOrKeypessEnterHandle, validate } from 'utils/UtilityFunctions';
import MappingTable from 'containers/integration/mapping_table/MappingTable';
import { integrationDataChange } from 'redux/reducer/IntegrationReducer';
import { cloneDeep, get, isEmpty, set, uniqBy, unset } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { getIntegrationEventCategoriesApiThunk } from 'redux/actions/Integration.Action';
import { categoryNameSchema, eventRequestBodyValidationSchema, overAllEventSchema, eventResponseBodyValidationSchema } from 'containers/integration/Integration.validation.schema';
import ButtonDropdown from 'components/button_dropdown/ButtonDropdown';
import { FEATURE_INTEGRATION_STRINGS } from 'containers/integration/Integration.strings';
import { SingleDropdown, TextInput, Modal, ModalSize, Checkbox, ECheckboxSize, RadioGroupLayout, Button, EButtonType, Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import styles from '../Events.module.scss';
import RequestBody from './request_body/RequestBody';
import { generateEventTargetObject } from '../../../../../utils/generatorUtils';
import Trash from '../../../../../assets/icons/application/Trash';
import ResponseBody, { initialRowData } from './response_body/ResponseBody';
import { INTEGRATION_CONSTANTS } from '../../../Integration.constants';
import CloseVectorIcon from '../../../../../assets/icons/create_app/create_modal/CloseVectorIcon';
import { getAllIntegrationEventsApiThunk, integrationAddEventApiThunk } from '../../../../../redux/actions/Integration.Action';
import jsUtility from '../../../../../utils/jsUtility';
import { ADD_EVENT_IDS, REQ_BODY_KEY_TYPES, hasEventError } from '../../../Integration.utils';

let cancelTokenGetAllEvents;

export const getCancelTokenGetAllEvents = (cancelToken) => {
  cancelTokenGetAllEvents = cancelToken;
};

function AddEvent(props) {
  const {
    state,
    state: {
      selected_connector = null,
      active_event = {},
      error_list = {},
      connector_uuid,
      categorysearchText,
      filteredCategories,
      isCategoryListLoading,
      isEventEdit = false,
      events_page_size,
      sortField,
      sortBy,
      searchText,
    },
    integrationDataChange,
    getIntegrationEventCategoriesApi,
    isAddEventVisible,
    integrationAddEventApi,
  } = cloneDeep(props);
  const { t } = useTranslation();
  console.log('active_eventAddEvent', active_event);

  const { ADD_EVENT, ADD_INTEGRATION } = INTEGRATION_STRINGS;
  const { DUPLICATE_KEY_ERROR, NO_CATEGORY_FOUND } = FEATURE_INTEGRATION_STRINGS;

  useEffect(() => {
    if (!isEmpty(selected_connector)) {
      getIntegrationEventCategoriesApi({ connector_uuid });
    }
  }, [isAddEventVisible]);

  useEffect(() => {
    integrationDataChange({
      filteredCategories: uniqBy(active_event?.categoryOptionList, 'value'),
    });
  }, [active_event?.categoryOptionList && active_event?.categoryOptionList?.length]);

  const handleCloseClick = () => {
    integrationDataChange({
      active_event: {},
      error_list: {},
      isAddEventVisible: false,
      isEventEdit: false,
    });
  };

  const getAllEvents = async () => {
    const { getAllIntegrationEventsApi } = props;

    if (cancelTokenGetAllEvents) cancelTokenGetAllEvents();

    const params = {
      page: 1,
      size: events_page_size,
      connector_id: selected_connector,
    };

    if (!isEmpty(searchText)) {
      params.search = searchText;
    }

    if (!isEmpty(sortField)) {
      params.sort_field = sortField;
      params.sort_by = sortBy;
    }

    await getAllIntegrationEventsApi(params, { connector_uuid }, getCancelTokenGetAllEvents);
  };

  const handleSubmitClick = async () => {
    const postData = getEventsPostData(active_event, true);

    const current_error_list = validate(
      getEventsPostData(active_event),
      overAllEventSchema(t),
    );

    let current_request_error = {};
    let current_response_error = {};

    if (!isEmpty(active_event?.body)) {
      current_request_error = validate(
        active_event?.body,
        eventRequestBodyValidationSchema(t),
      );
    }
    if (!isEmpty(active_event?.response_body)) {
      current_response_error = validate(
        active_event?.response_body,
        eventResponseBodyValidationSchema(t),
      );
    }

    let dataTobeUpdated = {};
    if (!current_error_list?.end_point?.includes('required')) {
      const { relativePathError } =
      validateAndExtractRelativePathFromEndPoint(active_event.end_point, active_event?.relative_path || []);
      if (!isEmpty(relativePathError)) current_error_list.end_point = relativePathError;
    }
    if (isEmpty(current_error_list) && isEmpty(current_request_error) && isEmpty(current_response_error)) {
      try {
        const saveEventPostData = {
          _id: state?.selected_connector,
          connector_uuid: state?.connector_uuid,
          events: [postData],
        };

        dataTobeUpdated = {
          isAddEventVisible: false,
          isEventEdit: false,
          active_event: {},
        };

        await integrationAddEventApi(saveEventPostData, null, t);

        getAllEvents();

        integrationDataChange({
          error_list: {},
          ...dataTobeUpdated,
        });
      } catch (e) {
        console.log(e);
      }
      return null;
    }

    integrationDataChange({
      error_list: {
        ...error_list,
        ...current_error_list,
        ...current_request_error,
      },
      response_error_list: current_response_error,
      ...dataTobeUpdated,
    });
    return null;
  };

  const handleMappingTableChange = (e, index, key, isDuplicateKeyError, duplicateKeyIndex) => {
    const errorPath = `${key},${index},${e.target.id}`;
    const duplicateErrorPath = `${key},${duplicateKeyIndex}`;
    const clonedErrorList = cloneDeep(error_list) || [];

    let id = null;
    let value = null;
    if (e && e?.target) {
      id = e?.target?.id;
      value = e?.target?.value;
    }
    set(active_event, [key, index, id], value);

    delete clonedErrorList[errorPath];
    if (isDuplicateKeyError) delete clonedErrorList[duplicateErrorPath];

    integrationDataChange({
      active_event,
      error_list: clonedErrorList,
    });
  };

  const handleCheckboxChange = (_value, index, key) => {
    const id = ADD_EVENT.QUERY_PARAMS.IS_REQUIRED.ID;
    const errorPath = `${key},${index},${id}`;
    const clonedErrorList = cloneDeep(error_list) || [];

    set(active_event, [key, index, id], !get(active_event, [key, index, id], null));

    delete clonedErrorList[errorPath];

    integrationDataChange({
      active_event,
      error_list: clonedErrorList,
    });
  };

  const handleMappingRowDelete = (index, key, isDuplicateKeyError, duplicateKeyIndex) => {
    const clonedParamsHeaders = cloneDeep(active_event?.[key]);
    const duplicateErrorPath = `${key},${duplicateKeyIndex}`;

    if (!isEmpty(clonedParamsHeaders)) {
      clonedParamsHeaders[index] = { is_deleted: true };
      const clonedErrorList = cloneDeep(error_list);
      if (error_list) {
        Object.keys(error_list).forEach((currentKey) => {
          if (currentKey?.includes(`${key},${index}`)) {
            delete clonedErrorList[currentKey];
          }
        });
      }
      set(active_event, key, clonedParamsHeaders);

      if (isDuplicateKeyError) delete clonedErrorList[duplicateErrorPath];

      integrationDataChange({
        active_event,
        error_list: clonedErrorList,
      });
    }
  };

  const handleChangeHandler = (e) => {
    const activeEvent = get(state, 'active_event', {});
    const clonedErrorList = cloneDeep(error_list) || {};
    set(activeEvent, [e.target.id], e.target.value);

    delete clonedErrorList[e.target.id];

    if (e.target.id === ADD_EVENT.EVENT_METHOD.ID && e.target.value === ADD_EVENT.EVENT_METHOD.TYPES.GET) {
      set(activeEvent, 'is_response_body', 1);
    }

    integrationDataChange({
      active_event: activeEvent,
      error_list: clonedErrorList,
    });
  };

  const handleCheckboxChangeHandler = (e) => {
    const responseBodyId = ADD_EVENT.RESPONSE_BODY.IS_RESPONSE_BODY.ID;
    const docUrlId = ADD_EVENT.IS_DOCUMENT_URL.ID;
    const activeEvent = get(state, 'active_event', {});
    const clonedErrorList = cloneDeep(error_list) || {};

    if (activeEvent[e.target.id]) {
      set(activeEvent, [e.target.id], null);
      if (e.target.id === responseBodyId) {
        unset(activeEvent, [INTEGRATION_CONSTANTS.RESPONSE_BODY]);
      } else {
        if (activeEvent.is_response_body) {
          console.log('isdocUrlUncheck', activeEvent.is_response_body);
          activeEvent.response_body = [];
        }
      }
    } else {
      set(activeEvent, [e.target.id], e.target.value);
      if ((e.target.id === responseBodyId && activeEvent?.is_document_url) || (e.target.id === docUrlId && activeEvent?.is_response_body)) {
        const responseBody = [];
        const clonedRow = jsUtility.cloneDeep(initialRowData);
        clonedRow.key_uuid = uuidv4();
        clonedRow.label = INTEGRATION_CONSTANTS.ENTIRE_RESPONSE;
        clonedRow.key = INTEGRATION_CONSTANTS.ENTIRE_RESPONSE;
        clonedRow.type = REQ_BODY_KEY_TYPES.STREAM;
        clonedRow.path = '0';
        responseBody.push(clonedRow);
        activeEvent.response_body = responseBody;

        if (error_list?.response_body) {
          delete clonedErrorList?.response_body;
        }
      }
    }

    delete clonedErrorList[e.target.id];

    integrationDataChange({
      active_event: activeEvent,
      error_list: clonedErrorList,
    });
  };

  const handleCategoryChangeHandler = (e) => {
    const activeEvent = get(state, 'active_event', {});
    const clonedErrorList = cloneDeep(error_list) || {};
    set(activeEvent, [ADD_EVENT.EVENT_CATEGORY.ID], e.target.value);

    delete clonedErrorList[ADD_EVENT.EVENT_CATEGORY.ID];

    integrationDataChange({
      active_event: activeEvent,
      error_list: clonedErrorList,
    });
  };

  const initialRow = (index, key, isDuplicateKeyError, duplicateKeyIndex) => {
    const keyErrorPath = `${key},${index},key`;
    const requiredErrorPath = `${key},${index},value`;
    const paramsHeaderMappingList = active_event?.[key] || [];

    let keyInputError = null;
    if (isDuplicateKeyError) {
      keyInputError = t(DUPLICATE_KEY_ERROR);
    } else {
      keyInputError = error_list[keyErrorPath];
    }

    return (
      <>
        <div className={cx(styles.ColMax, gClasses.PL12, gClasses.PR24, gClasses.MB12)}>
          <TextInput
            onChange={
              (e) => handleMappingTableChange(e, index, key, isDuplicateKeyError, duplicateKeyIndex)
            }
            id="key"
            className={styles.MappingField}
            value={paramsHeaderMappingList[index]?.key}
            errorMessage={keyInputError}
          />
        </div>
        <div className={cx(styles.ColMed, gClasses.MB12)}>
          <Checkbox
            id={ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.ID}
            size={ECheckboxSize.LG}
            layout={RadioGroupLayout.stack}
            isValueSelected={paramsHeaderMappingList[index]?.is_required}
            details={get(ADD_EVENT.QUERY_PARAMS.IS_REQUIRED.OPTIONS, 0, {})}
            onClick={(value) =>
              handleCheckboxChange(value, index, key)
            }
            errorMessage={error_list[requiredErrorPath]}
            className={cx(gClasses.CenterV, gClasses.InputHeight36)}
          />
        </div>
        <div className={cx(styles.ColMed, gClasses.CenterV, BS.JC_END)}>
          <Trash
            className={cx(styles.DeleteIcon, gClasses.MR12)}
            onClick={() => handleMappingRowDelete(index, key, isDuplicateKeyError, duplicateKeyIndex)}
          />
        </div>
      </>
    );
  };

  const handleMappingChange = (headersParam, mappingKey) => {
    set(active_event, [mappingKey], headersParam);

    integrationDataChange({
      active_event,
    });
  };

  const handleAddCategory = (newCategory) => {
    const clonedErrorList = cloneDeep(error_list);
    const activeEvent = get(state, 'active_event', {});
    const eventObj = {
      id: newCategory,
      label: newCategory,
      value: newCategory,
    };

    if (!isEmpty(activeEvent?.category)) {
      const currentList = cloneDeep(active_event?.categoryOptionList) || [];
      const index = currentList?.findIndex((currentCategory) => currentCategory?.value === activeEvent?.category);
      if (index > -1) {
        currentList[index] = eventObj;
      }
      set(activeEvent, 'categoryOptionList', currentList);
    } else {
      const updatedList = active_event?.categoryOptionList
      ? [...active_event.categoryOptionList, eventObj]
      : [eventObj];
      set(activeEvent, 'categoryOptionList', updatedList);
    }

    set(activeEvent, 'category', newCategory);
    delete clonedErrorList?.category;

    integrationDataChange({
      active_event: activeEvent,
      filteredCategories: uniqBy(activeEvent?.categoryOptionList, 'value'),
      error_list: clonedErrorList,
    });
  };

  const loadCategoryList = () => {
      let categoryList = active_event?.categoryOptionList || [];
      if (isEmpty(categoryList)) {
        categoryList = [
          {
            id: t(NO_CATEGORY_FOUND),
            label: t(NO_CATEGORY_FOUND),
            value: t(NO_CATEGORY_FOUND),
            is_disabled: true,
          },
        ];
      }

      integrationDataChange({
        categorysearchText: EMPTY_STRING,
        filteredCategories: uniqBy(categoryList, 'value'),
      });
  };

  const handleCategoryNameSearch = (value) => {
    if (value !== categorysearchText) {
      const categoryList = active_event?.categoryOptionList || [];
      const loweredValue = value?.toLowerCase();
      let filteredList = categoryList?.filter((currentCategory) => {
        const loweredName = currentCategory?.label?.toLowerCase();
        return loweredName.includes(loweredValue);
      });

      if (isEmpty(filteredList)) {
        filteredList = [
          {
            id: t(NO_CATEGORY_FOUND),
            label: t(NO_CATEGORY_FOUND),
            value: t(NO_CATEGORY_FOUND),
            is_disabled: true,
          },
        ];
      }

      integrationDataChange({
        categorysearchText: value,
        filteredCategories: uniqBy(filteredList, 'value'),
      });
    }
  };

  const handleCreateValidation = (categoryName) => {
    const errorList = validate(
      {
        category: categoryName,
      },
      categoryNameSchema(t),
    );

    if (!isEmpty(errorList)) return errorList?.category;

    return null;
  };

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
      <span
        className={cx(styles.CancelButton, gClasses.MR24)}
        onClick={handleCloseClick}
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && handleCloseClick(e)}
        role="button"
        tabIndex={0}
      >
        {t(ADD_INTEGRATION.FOOTER.CANCEL)}
      </span>
      <Button
        buttonText={isEventEdit ? t(ADD_INTEGRATION.FOOTER.UPDATE) : t(ADD_INTEGRATION.FOOTER.ADD)}
        type={EButtonType.PRIMARY}
        className={cx(modalStyles.PrimaryButton)}
        onClickHandler={handleSubmitClick}
      />
    </div>
  );

  const initialRowKeyValue = {
    key: EMPTY_STRING,
    is_required: false,
  };

  const categoryError = error_list[ADD_EVENT.EVENT_CATEGORY.ID];
  const eventError = hasEventError(error_list, ADD_EVENT_IDS);
  console.log('categoryeroro22', categoryError, 'isCategoryListLoading', isCategoryListLoading, 'eventError', eventError, 'error_list', error_list);
  const isShowRequestBody =
    !isEmpty(active_event[ADD_EVENT.EVENT_METHOD.ID]) &&
    active_event[ADD_EVENT.EVENT_METHOD.ID] !==
      ADD_EVENT.EVENT_METHOD.TYPES.GET;
  let backButtonLabel = t(ADD_EVENT.EVENT_CATEGORY.NEW_CATEGORY_LABEL);
  let createBtnLabel = t(ADD_EVENT.EVENT_CATEGORY.CREATE_NEW_LABEL);
  let primaryButtonLabel = t(ADD_EVENT.EVENT_CATEGORY.CREATE_BTN);
  if (!isEmpty(active_event?.category)) {
    backButtonLabel = t(ADD_EVENT.EVENT_CATEGORY.EDIT_CATEGORY_LABEL);
    createBtnLabel = t(ADD_EVENT.EVENT_CATEGORY.EDIT_CATEGORY_LABEL);
    primaryButtonLabel = t(ADD_EVENT.EVENT_CATEGORY.UPDATE_BTN);
  }
  const currentComponent = (
    <div>
      <ButtonDropdown
        id={ADD_EVENT.EVENT_CATEGORY.ID}
        className={styles.CategoryDropdown}
        dropdownPopperContainerClass={styles.CategoryDropdownPopper}
        selectedValue={active_event?.category}
        showSelectedValTooltip
        initialButtonLabel={t(ADD_EVENT.EVENT_CATEGORY.PLACEHOLDER)}
        optionList={filteredCategories || []}
        backButtonLabel={backButtonLabel}
        dropdownChangeHandler={handleCategoryChangeHandler}
        handleCreateClick={handleAddCategory}
        searchValue={categorysearchText}
        onOptionSearch={handleCategoryNameSearch}
        createValidation={handleCreateValidation}
        searchBarPlaceholder={t(ADD_EVENT.EVENT_CATEGORY.SEARCH_PLACHOLDER)}
        createBtnLabel={createBtnLabel}
        inputPlaceholder={t(ADD_EVENT.EVENT_CATEGORY.INPUT_PLACEHOLDER)}
        secondaryButtonLabel={t(ADD_EVENT.EVENT_CATEGORY.CANCEL_BTN)}
        primaryButtonLabel={primaryButtonLabel}
        errorMessage={categoryError}
        setInitialSearchText
        initialSearchText={active_event?.category}
        noDataText={t(ADD_EVENT.EVENT_CATEGORY.NO_DATA)}
        isLoading={isCategoryListLoading}
        loadData={loadCategoryList}
      />
      <Row
        className={cx(
          styles.EventDetails,
          categoryError && styles.CategoryError,
          eventError && styles.EventError,
        )}
      >
        <Col>
          <TextInput
            id={ADD_EVENT.EVENT_NAME.ID}
            labelText={t(ADD_EVENT.EVENT_NAME.LABEL)}
            onChange={(e) => handleChangeHandler(e)}
            value={active_event[ADD_EVENT.EVENT_NAME.ID]}
            placeholder={t(ADD_EVENT.EVENT_NAME.PLACEHOLDER)}
            errorMessage={error_list[ADD_EVENT.EVENT_NAME.ID]}
            inputClassName={styles.FieldContainer}
            labelClassName={styles.LabelClassName}
          />
        </Col>
        <Col>
          <SingleDropdown
            id={ADD_EVENT.EVENT_METHOD.ID}
            dropdownViewProps={{
              labelName: t(ADD_EVENT.EVENT_METHOD.LABEL),
              labelClassName: styles.LabelClassName,
            }}
            optionList={cloneDeep(ADD_EVENT.EVENT_METHOD.OPTIONS)}
            onClick={(value, _label, _list, id) =>
              handleChangeHandler(generateEventTargetObject(id, value))
            }
            selectedValue={active_event[ADD_EVENT.EVENT_METHOD.ID]}
            errorMessage={error_list[ADD_EVENT.EVENT_METHOD.ID]}
            placeholder={t(ADD_EVENT.EVENT_METHOD.PLACEHOLDER)}
            className={styles.RequestBodyFields}
          />
        </Col>
        <Col>
          <TextInput
            id={ADD_EVENT.END_POINT.ID}
            labelText={t(ADD_EVENT.END_POINT.LABEL)}
            onChange={(e) => handleChangeHandler(e)}
            value={active_event[ADD_EVENT.END_POINT.ID]}
            placeholder={t(ADD_EVENT.END_POINT.PLACEHOLDER)}
            errorMessage={error_list[ADD_EVENT.END_POINT.ID]}
            inputClassName={styles.FieldContainer}
            labelClassName={styles.LabelClassName}
          />
        </Col>
      </Row>

      {!isEmpty(active_event[ADD_EVENT.EVENT_METHOD.ID]) && (
        <>
          <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, gClasses.MT16)}>
            <Text size={ETextSize.LG} content={t(ADD_EVENT.HEADERS.TITLE)} className={gClasses.MB8} />
            <Text size={ETextSize.SM} content={t(ADD_EVENT.HEADERS.SUB_TITLE)} />
          </div>
          <MappingTable
            // addTempRowId
            innerTableClass={gClasses.MT16}
            tblHeaders={ADD_EVENT.API_HEADERS_VALUE(t)}
            mappingList={active_event?.headers || []}
            headerRowClass={styles.HeaderRow}
            headerClassName={styles.TableHeader}
            handleMappingChange={handleMappingChange}
            tableRowClass={styles.TableRow}
            mappingKey={ADD_EVENT.HEADERS.ID}
            initialRow={initialRow}
            initialRowKeyValue={initialRowKeyValue}
            error_list={error_list}
            headerStyles={[styles.ColMax, styles.ColMed, styles.ColMed]}
          />
        </>
      )}
      {!isEmpty(active_event[ADD_EVENT.EVENT_METHOD.ID]) && (
        <>
          <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, gClasses.MT16)}>
            <Text size={ETextSize.LG} content={t(ADD_EVENT.QUERY_PARAMS.TITLE)} className={gClasses.MB8} />
            <Text size={ETextSize.SM} content={t(ADD_EVENT.QUERY_PARAMS.SUB_TITLE)} />
          </div>
          <MappingTable
            // addTempRowId
            innerTableClass={gClasses.MT16}
            tblHeaders={ADD_EVENT.API_HEADERS_VALUE(t)}
            mappingList={active_event?.params || []}
            headerRowClass={styles.HeaderRow}
            headerClassName={styles.TableHeader}
            handleMappingChange={handleMappingChange}
            tableRowClass={styles.TableRow}
            mappingKey={ADD_EVENT.QUERY_PARAMS.ID}
            initialRow={initialRow}
            initialRowKeyValue={initialRowKeyValue}
            error_list={error_list}
            headerStyles={[styles.ColMax, styles.ColMed, styles.ColMed]}
          />
        </>
      )}
      {isShowRequestBody && <RequestBody />}
      <Checkbox
        id={ADD_EVENT.RESPONSE_BODY.IS_RESPONSE_BODY.ID}
        size={ECheckboxSize.LG}
        layout={RadioGroupLayout.stack}
        isValueSelected={active_event?.is_response_body}
        details={get(ADD_EVENT.RESPONSE_BODY.IS_RESPONSE_BODY.OPTIONS, 0, {})}
        className={gClasses.MT24}
        onClick={(value) =>
          handleCheckboxChangeHandler(generateEventTargetObject(ADD_EVENT.RESPONSE_BODY.IS_RESPONSE_BODY.ID, value))
        }
        disabled={active_event?.method === ADD_EVENT.EVENT_METHOD.TYPES.GET}
      />
      <Checkbox
        id={ADD_EVENT.IS_DOCUMENT_URL.ID}
        size={ECheckboxSize.LG}
        isValueSelected={active_event?.is_document_url}
        details={ADD_EVENT.IS_DOCUMENT_URL.OPTIONS[0]}
        className={gClasses.MT24}
        onClick={(value) =>
          handleCheckboxChangeHandler(generateEventTargetObject(ADD_EVENT.IS_DOCUMENT_URL.ID, value))
        }
      />
      {active_event?.is_response_body && <ResponseBody />}
    </div>
  );

  return (
    <div className={cx(styles.CreationContainer)}>
      <Modal
        modalSize={ModalSize.lg}
        isModalOpen={isAddEventVisible}
        customModalClass={styles.AddEventModal}
        headerContent={(
          <div
            className={cx(
              styles.ConfigurationHeader,
              BS.D_FLEX,
              BS.JC_BETWEEN,
              BS.ALIGN_ITEM_CENTER,
            )}
          >
            <Text
              content={t(ADD_EVENT.TITLE)}
              size={ETextSize.XL}
            />
            <button
              onClick={handleCloseClick}
              onKeyDown={(e) =>
                keydownOrKeypessEnterHandle(e) && handleCloseClick()
              }
              className={gClasses.DisplayFlex}
            >
              <CloseVectorIcon
                className={cx(BS.JC_END, gClasses.CursorPointer)}
              />
            </button>
          </div>
        )}
        mainContent={(
          <div className={cx(styles.ComponentContainer, styles.ContainerHeight)}>
            {currentComponent}
          </div>
        )}
        footerContent={footerContent}
      />
    </div>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    state: IntegrationReducer,
  };
};

const mapDispatchToProps = {
  integrationDataChange,
  getIntegrationEventCategoriesApi: getIntegrationEventCategoriesApiThunk,
  integrationAddEventApi: integrationAddEventApiThunk,
  getAllIntegrationEventsApi: getAllIntegrationEventsApiThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEvent);
