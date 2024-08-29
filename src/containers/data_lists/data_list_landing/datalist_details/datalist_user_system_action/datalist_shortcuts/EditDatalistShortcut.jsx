import React, { useEffect, useState } from 'react';
import { Button, EButtonType, ETitleSize, Modal, ModalSize, ModalStyleType, SingleDropdown, TextInput, Title } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import style from '../../DatalistDetails.module.scss';
import CloseIconNew from '../../../../../../assets/icons/CloseIconNew';
import { FIELD_TYPE, MAX_PAGINATION_SIZE } from '../../../../../../utils/constants/form.constant';
import { DOCUMENT_TYPES, EMPTY_STRING, ENTITY } from '../../../../../../utils/strings/CommonStrings';
import { cloneDeep, isEmpty } from '../../../../../../utils/jsUtility';
import { apiGetFlowDetailsByUUID, getAllFlows } from '../../../../../../axios/apiService/flowList.apiService';
import { getFlowlistSuggetion } from '../../../../../../components/automated_systems/AutomatedSystems.utils';
import useApiCall from '../../../../../../hooks/useApiCall';
import { constructShortcutPostData, convertFieldDetailsForMapping, deconstructShortcutData, validateDLShortcut } from './datalistShortcuts.utils';
import { DEV_USER } from '../../../../../../urls/RouteConstants';
import { DATALIST_LANDING_STRINGS } from '../../../DatalistLanding.strings';
import { getTriggerDetails, saveFlow } from '../../../../../../axios/apiService/flow.apiService';
import { getUserProfileData, setLoaderAndPointerEvent, somethingWentWrongErrorToast, validate } from '../../../../../../utils/UtilityFunctions';
import { convertBeToFeKeys } from '../../../../../../utils/normalizer.utils';
import FieldMappingTable from '../../../../../edit_flow/step_configuration/node_configurations/row_components/field_mapping_table/FieldMappingTable';
import { FIELD_MAPPING_TABLE_TYPES, FIELD_VALUE_TYPES, MAPPING_COMPONENT_TYPES } from '../../../../../edit_flow/step_configuration/node_configurations/row_components/RowComponents.constants';
import { TABLE_HEADERS, CALL_ANOTHER_FLOW_STRINGS } from '../../../../../edit_flow/step_configuration/node_configurations/call_another_flow/CallAnotherFlow.strings';
import { saveDataListApi } from '../../../../../../axios/apiService/dataList.apiService';
import { FlowNodeProvider } from '../../../../../edit_flow/node_configuration/use_node_reducer/useNodeReducer';
import { triggerMappingSchema } from '../../../../../edit_flow/step_configuration/node_configurations/call_another_flow/CallAnotherFlow.validation.schema';
import DeleteConfirmModal from '../../../../../../components/delete_confirm_modal/DeleteConfirmModal';
import { constructMappingValidationData } from '../../../../../edit_flow/step_configuration/node_configurations/call_another_flow/CallAnotherFlow.utils';
import { MODULE_TYPES } from '../../../../../../utils/Constants';
import { ALLOW_MAPPING_SYSTEM_FIELDS } from '../../../../../edit_flow/node_configuration/NodeConfiguration.constants';
import { ALLOW_AUTOMATED_SYSTEM_ACTION_FIELDS } from '../../../../../../components/automated_systems/AutomatedSystems.constants';

const INITIAL_STATE = {
    childFlowId: '',
    childFlowUUID: '',
    childFlowName: '',
    triggerName: '',
    stepAssignees: [],
    triggerMapping: [],
};

function EditDatalistShortcut(props) {
    const { isModalOpen, onCloseShortcut, metaData, triggerUUID, onSave, parentData, isParentDatalist, systemFields } = props;
    // const [showAutofill, setShowAutofill] = useState(false);
    const profileData = getUserProfileData();
    const [shortcut, setShortcut] = useState(() => INITIAL_STATE);
    const [errorList, setErrorList] = useState({});
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const { USER_ACTIONS } = DATALIST_LANDING_STRINGS(t);
    const [deleteModal, setDeleteModal] = useState(false);

    const { data: flowList, fetch: flowListFetch, clearData: clearFlowList, isLoading: isFlowListsLoading, hasMore: hasMoreFlow, page: flowListCurrentPage } = useApiCall({}, true);
    const [flowSearchText, setFlowSearchText] = useState(EMPTY_STRING);

    const loadFlowList = (page = null, searchText = null) => {
        const flowListParams = {
        page: page || 1,
        size: 15,
        };
        if (!isEmpty(searchText)) flowListParams.search = searchText;
        if (page <= 1) clearFlowList({ data: [], paginationDetails: {} });
        flowListFetch(getAllFlows(flowListParams, null));
    };

    useEffect(() => {
      if (!triggerUUID) {
        setLoading(false);
        return;
       }

      const params = { ...(isParentDatalist) ? { data_list_id: metaData.dataListId } : { flow_id: metaData.flowId }, trigger_uuid: [triggerUUID] };
      getTriggerDetails(params)
        .then((res) => {
            const data = convertBeToFeKeys(res, {}, [], ['trigger_mapping', 'document_url_details', 'datalist_details']);
            const { fieldMetadata = [], triggerMetadata = [], document_url_details = [] } = data;
            const _trigger = triggerMetadata?.[0] || {};
            const [trigger, errorList] = deconstructShortcutData(_trigger, {
              fieldMetadata,
              documentURLDetails: document_url_details,
              isParentDatalist,
              t,
            });
            console.log('xyz data', { data, fieldMetadata, trigger, errorList });
            setShortcut({ ...trigger, fields: fieldMetadata || [] });
            setErrorList(errorList);
        })
        .catch((err) => {
          console.log('xyz err', err);
          somethingWentWrongErrorToast();
        }).finally(() => {
          setLoading(false);
        });
    }, []);

    const onSearchFlow = (event) => { setFlowSearchText(event.target.value); loadFlowList(1, event.target.value); };
    const onLoadMoreFlowList = () => { loadFlowList(flowListCurrentPage + 1); };

    const getFlowDetails = (childFlowUUID) => {
        const params = { flow_uuid: childFlowUUID, is_test_bed: 0, initiation_step_details: 1 };
        apiGetFlowDetailsByUUID(params)
          .then((data) => {
            const { initiation_step: { step_assignees } } = data;
            // eslint-disable-next-line no-use-before-define
            onChangeHandler('stepAssignees', step_assignees);
          })
          .catch((e) => console.error('xyz getFlowDetails', e));
    };

    const onChangeHandler = (id, value) => {
        setShortcut((p) => {
            const _shortcut = { ...p };
            _shortcut[id] = value;

            if (id === 'childFlowUUID') {
                getFlowDetails(value);
                const childFlow = flowList.find?.((f) => f.flow_uuid === value);
                _shortcut.childFlowId = childFlow._id;
                _shortcut.childFlowName = childFlow.flow_name;
                _shortcut.triggerName = childFlow.flow_name;
                _shortcut.triggerMapping = [];
                _shortcut.serverTriggerMapping = [];
                _shortcut.stepAssignees = [];
            }

            if (!isEmpty(errorList)) {
                setErrorList(validateDLShortcut(_shortcut, t));
            }

            return _shortcut;
        });
    };

    const handleMappingChange = (data) => {
        console.log('xyz handleMappingChange', data);
        setShortcut({
            ...shortcut,
            triggerMapping: data.triggerMapping,
            documentDetails: data.documentDetails || shortcut.documentDetails || {},
        });
        setErrorList({
            ...errorList,
            mappingErrorList: data.mappingErrorList,
        });
    };

    const onSaveClick = () => {
      const errorList = validateDLShortcut(shortcut, t);
      const validateTriggerData = constructMappingValidationData(shortcut?.triggerMapping || []);
      const mappingErrorList = validate(validateTriggerData, triggerMappingSchema(t));
      console.log('xyz shortcut, errorList', { shortcut, errorList, mappingErrorList, parentData, triggerUUID });
      setErrorList({ ...errorList, mappingErrorList });

      if (!isEmpty(errorList) || !isEmpty(mappingErrorList)) return;

      const postData = constructShortcutPostData(shortcut, { parentData: cloneDeep(parentData), triggerUUID });
      console.log('xyz postData', { shortcut, postData, errorList });

      const saveAPI = isParentDatalist ? saveDataListApi : saveFlow;

      setLoaderAndPointerEvent(true);
      saveAPI(postData)
        .then((res) => {
          console.log('xyz res', res);
          onSave(res);
        })
        .catch((err) => {
          console.log('xyz err', err);
          somethingWentWrongErrorToast();
        })
        .finally(() => setLoaderAndPointerEvent(false));
    };

    // Modal Header
    const headerContent = (
        <div className={style.HeaderContainer}>
            <Title content={USER_ACTIONS.TITLE} className={gClasses.FTwoBlackV23} size={ETitleSize.small} />
            <CloseIconNew className={cx(style.CloseIcon, gClasses.CursorPointer)} onClick={onCloseShortcut} />
        </div>
    );

    // Modal Main Container
    const modalMainContent = (
      <div className={style.BodyContainer}>
        <FlowNodeProvider initialState={{}}>
          <SingleDropdown
            required
            selectedValue={shortcut.childFlowUUID}
            optionList={getFlowlistSuggetion(flowList)}
            dropdownViewProps={{
              labelName: USER_ACTIONS.CHOOSE_FLOW,
              labelClassName: style.FieldLabel,
              isLoading: loading,
              selectedLabel: shortcut.childFlowName,
              onClick: () => loadFlowList(1),
              onKeyDown: () => loadFlowList(1),
              onBlur: () => setFlowSearchText(EMPTY_STRING),
            }}
            errorMessage={errorList.childFlowUUID}
            searchProps={{
              searchValue: flowSearchText,
              onChangeSearch: onSearchFlow,
            }}
            onOutSideClick={() => setFlowSearchText(EMPTY_STRING)}
            infiniteScrollProps={{
              dataLength: flowList?.length || MAX_PAGINATION_SIZE,
              next: onLoadMoreFlowList,
              hasMore: hasMoreFlow,
              scrollableId: 'scrollable-childFlowUUID',
            }}
            isLoadingOptions={isFlowListsLoading}
            onClick={(value) => onChangeHandler('childFlowUUID', value)}
          />
          <div
            className={cx(gClasses.DisplayFlex, gClasses.JusEnd, gClasses.MB10)}
          >
            <Button
              buttonText={USER_ACTIONS.CREATE_NEW_FLOW}
              className={cx(
                style.AddButton,
                gClasses.FTwo12BlueV39,
                gClasses.MT6,
                gClasses.Height16,
              )}
              type={EButtonType.TERTIARY}
              onClickHandler={() =>
                window.open(`${DEV_USER}?create=flow`, '_blank')
              }
            />
          </div>

          <TextInput
            required
            labelText={USER_ACTIONS.SHORTCUT_NAME}
            labelClassName={style.FieldLabel}
            value={shortcut.triggerName}
            errorMessage={errorList.triggerName}
            onChange={(e) => onChangeHandler('triggerName', e.target.value)}
            isLoading={loading}
          />

          <div className={gClasses.MT32}>
          {shortcut.childFlowUUID &&
            <Title
              content={USER_ACTIONS.AUTO_FILL_MESSAGE}
              className={cx(gClasses.FTwoBlackV23, gClasses.MB8)}
              size={ETitleSize.xs}
              isDataLoading={loading}
            />
          }

          </div>

          {shortcut.childFlowUUID && (
          <div className={gClasses.MB70}>
            <FieldMappingTable
              key="triggerMapping"
              initialRawData={[]}
              mappedData={shortcut.triggerMapping || []}
              mappedServerData={shortcut?.serverTriggerMapping || []}
              errorList={errorList.mappingErrorList || {}}
              fieldDetails={convertFieldDetailsForMapping(shortcut.fieldDetails || [])}
              tableHeaders={TABLE_HEADERS(t)}
              keyFieldParams={{
                ignore_field_types: [FIELD_TYPE.INFORMATION, FIELD_TYPE.USER_PROPERTY_PICKER, FIELD_TYPE.DATA_LIST_PROPERTY_PICKER],
              }}
              valueFieldParams={{
                ignore_field_types: [FIELD_TYPE.INFORMATION, FIELD_TYPE.USER_PROPERTY_PICKER, FIELD_TYPE.DATA_LIST_PROPERTY_PICKER],
              }}
              systemFieldParams={{
                allSystemFields: isParentDatalist ? systemFields.datalist_system_field : systemFields.flow_system_field,
                allowedSystemFields: isParentDatalist ? ALLOW_AUTOMATED_SYSTEM_ACTION_FIELDS : ALLOW_MAPPING_SYSTEM_FIELDS,
              }}
              keyLabels={{
                childKey: 'tableColumnMapping',
                typeKey: 'fieldType',
                addKey: 'addKey',
                requiredKey: 'isRequired',
                addRowText: CALL_ANOTHER_FLOW_STRINGS(t).ADD_FIELD,
                addChildRowText: CALL_ANOTHER_FLOW_STRINGS(t).ADD_COLUMN,
              }}
              additionalRowComponentProps={{
                keyObject: {
                  rowUuid: 'fieldUuid',
                  key: 'label',
                  value: 'value',
                  valueType: 'valueType',
                  mappingUuid: 'childFieldUuid',
                  valueDetails: 'fieldDetails',
                  childKey: 'tableColumnMapping',
                  deleteRow: 'deleteRow',
                  documentDetails: 'documentDetails',
                },
                isEditableKey: true,
                fileUploadProps: {
                  contextId: isParentDatalist ? metaData.dataListId : metaData.flowId,
                  fileEntityId: isParentDatalist ? metaData.dataListId : metaData.flowId,
                  fileEntityUuid: isParentDatalist ? metaData.dataListUUID : metaData.flowUUID,
                  fileEntity: isParentDatalist ? ENTITY.DATA_LIST : ENTITY.FLOW_STEPS,
                  fileEntityType: isParentDatalist ? DOCUMENT_TYPES.DATA_LIST_RELATED_ACTIONS : DOCUMENT_TYPES.SUB_FLOW_DOCUMENTS,
                  maximumFileSize: profileData.maximum_file_size,
                  allowedExtensions: profileData.allowed_extensions,
                  isMultiple: true,
                },
                allowedCurrencyList: profileData.allowed_currency_types,
                defaultCurrencyType: profileData.default_currency_type,
                defaultCountryCode: profileData.default_country_code,
                documentUrlDetails: shortcut.documentDetails || {},
                metaData: {
                  childModuleType: isParentDatalist ? MODULE_TYPES.DATA_LIST : MODULE_TYPES.FLOW,
                  childModuleUuid: isParentDatalist ? metaData.dataListUUID : metaData.flowUUID,
                  childModuleId: isParentDatalist ? metaData.dataListId : metaData.flowId,
                },
              }}
              rowInitialData={{
                valueType: FIELD_VALUE_TYPES.DYNAMIC,
              }}
              handleMappingChange={handleMappingChange}
              mappingVariant={FIELD_MAPPING_TABLE_TYPES.KEY_VALUE_MAPPING_WITH_TYPE}
              mappingComponent={MAPPING_COMPONENT_TYPES.CALL_SUB_FLOW}
              parentId={isParentDatalist ? metaData.dataListId : metaData.flowId}
              childFlowId={shortcut.childFlowId}
              mappingListKey="triggerMapping"
              errorListKey="mappingErrorList"
              documentDetailsKey="documentDetails"
              isParentDatalist={isParentDatalist}
            />
          </div>
          )}
        </FlowNodeProvider>
      </div>
    );

    const modalFooterContent = (
      <div className={cx(style.FooterContainer)}>
        <div>
          {triggerUUID && (
            <Button
              buttonText={USER_ACTIONS.DELETE}
              className={style.DeleteButton}
              type={EButtonType.TERTIARY}
              onClickHandler={() => setDeleteModal(true)}
            />
          )}
        </div>
        <div className={cx(gClasses.Gap16, gClasses.CenterV)}>
          <Button
            buttonText={USER_ACTIONS.CANCEL}
            type={EButtonType.TERTIARY}
            onClickHandler={onCloseShortcut}
          />
          <Button
            buttonText={USER_ACTIONS.SAVE}
            type={EButtonType.PRIMARY}
            onClickHandler={onSaveClick}
          />
        </div>
      </div>
    );

    const getDeleteEventModal = () => {
      if (!deleteModal) return null;

      const onCancel = () => setDeleteModal(false);

      const onDelete = () => {
        const postData = { ...parentData };
        const triggerDetails = postData.trigger_details.filter(
          (t) => t.trigger_uuid !== triggerUUID,
        );
        if (isEmpty(triggerDetails)) delete postData.trigger_details;
        else postData.trigger_details = triggerDetails;
        postData.has_related_flows = triggerDetails.length > 0;

        const saveAPI = isParentDatalist ? saveDataListApi : saveFlow;

        setLoaderAndPointerEvent(true);
        saveAPI(postData)
          .then((res) => {
            onSave(res);
            onCloseShortcut();
          })
          .catch((err) => {
            console.log('xyz  err', err);
            somethingWentWrongErrorToast();
          })
          .finally(() => {
            setLoaderAndPointerEvent(false);
          });
      };

      return (
        <DeleteConfirmModal
          isModalOpen
          id={USER_ACTIONS.DELETE_TITLE}
          title={USER_ACTIONS.DELETE_TITLE}
          subText1={USER_ACTIONS.DELETE_SUBTITLE}
          onCancel={onCancel}
          onClose={onCancel}
          onDelete={onDelete}
        />
      );
    };

    return (
      <>
        {getDeleteEventModal()}
        <Modal
            modalStyle={ModalStyleType.modal}
            className={cx(gClasses.CursorDefault)}
            customModalClass={style.ModalWidth}
            isModalOpen={isModalOpen}
            mainContent={modalMainContent}
            headerContent={headerContent}
            modalSize={ModalSize.lg}
            footerContent={modalFooterContent}
        />
      </>
    );
}

export default EditDatalistShortcut;

EditDatalistShortcut.propTypes = {
    isModalOpen: PropTypes.bool,
    onCloseShortcut: PropTypes.func,
    metaData: PropTypes.object,
};
