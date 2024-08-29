import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import {
  Button,
  EButtonType,
  EPopperPlacements,
  ETextSize,
  ETitleSize,
  EToastType,
  Modal,
  ModalSize,
  ModalStyleType,
  SingleDropdown,
  Size,
  Tab,
  Text,
  TextArea,
  Title,
  Variant,
  toastPopOver,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../scss/Typography.module.scss';
import ThemeContext from '../../../hoc/ThemeContext';
import {
  getAllDashboardPagesThunk,
  getDashboardPageByIdForUserModeThunk,
  getIndividualDefaultReportByUuidThunk,
  getInstanceDetailsByIDThunk,
} from '../../../redux/actions/IndividualEntry.Action';
import {
  CANCEL_INSTANCE_STRINGS,
  INDIVIDUAL_ENTRY_MODE,
  INDIVIDUAL_ENTRY_TAB_TYPES,
  INDIVIDUAL_ENTRY_TYPE,
} from './IndividualEntry.strings';
import styles from './IndividualEntry.module.scss';
import IndividualEntry from './IndividualEntry';
import {
  dataChange,
  leadAndClearReducer,
} from '../../../redux/reducer/IndividualEntryReducer';
import Edit from '../../../assets/icons/application/EditV2';
import Trash from '../../../assets/icons/application/Trash';
import { isEmpty } from '../../../utils/jsUtility';
import {
  apiCancelFlowInstance,
  apiGetAllTriggerDetails,
  initiateFlow,
} from '../../../axios/apiService/flowList.apiService';
import { OPEN_TASKS, TASKS } from '../../../urls/RouteConstants';
import {
  openInNewTab,
  setLoaderAndPointerEvent,
  somethingWentWrongErrorToast,
} from '../../../utils/UtilityFunctions';
import { deleteDataListEntry } from '../../../axios/apiService/dataList.apiService';
import ResponseHandler from '../../../components/response_handlers/ResponseHandler';
import { RESPONSE_TYPE, UTIL_COLOR } from '../../../utils/Constants';
import VerticalDot from '../../../assets/icons/header/VerticalDot';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { validateCancelInstance } from './IndividualEntry.utils';
import DeleteConfirmModal from '../../application/delete_comfirm_modal/DeleteConfirmModal';
import IndividualEntryClose from '../../../assets/icons/landing_page/IndividualEntryClose';
import EditDatalistEntry from './edit_datalist_entry/EditDatalistEntry';
import { getFlowAccessByUUID } from '../../../redux/actions/FlowDashboard.Action';

const CANCEL_INSTANCE_DEFAULT_VALUE = {
  isModalOpen: false,
  comments: EMPTY_STRING,
};

function IndividualEntryModel(props) {
  const { mode, type, metaData, onCloseModel, otherDetails, refreshOnDelete } =
    props;
  const { colorScheme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [subFlows, setSubFlows] = useState({ loading: false, data: [] });
  const [cancelInstance, setCancelInstance] = useState(
    CANCEL_INSTANCE_DEFAULT_VALUE,
  );
  const [isEditDataOpen, setIsEditDataOpen] = useState(false);
  const [deleteInstanceConfirm, setDeleteInstanceConfirm] = useState(false);
  const stateIndividualEntry = useSelector(
    (state) => state.IndividualEntryReducer,
  );
  const {
    isPagesLoading,
    pagesList,
    currentPageDetails,
    dashboard_id,
    instanceDetails,
    isDashboardPageAuthorized,
  } = stateIndividualEntry;
  const isInstMode = [
    INDIVIDUAL_ENTRY_MODE.INSTANCE_MODE,
    INDIVIDUAL_ENTRY_MODE.REPORT_INSTANCE_MODE,
  ].includes(mode);

  const getDataParams = (isInstanceDetails = false) => {
    const params = {};
    if (type === INDIVIDUAL_ENTRY_TYPE.FLOW) {
      if (isInstanceDetails) {
        params._id = metaData.instanceId;
      } else {
        params.flow_uuid = metaData.moduleUuid;
        params.instance_id = metaData.instanceId;
      }
    } else if (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) {
      if (isInstanceDetails) {
        params._id = metaData.instanceId;
        params.data_list_uuid = metaData.moduleUuid;
      } else {
        params.data_list_uuid = metaData.moduleUuid;
        params.data_list_entry_id = metaData.instanceId;
      }
    }
    return params;
  };

  const getInstanceDetailsApis = (dashboardId) => {
    dispatch(getInstanceDetailsByIDThunk(getDataParams(true))).then(() => {
      dispatch(
        getAllDashboardPagesThunk(
          { dashboard_id: dashboardId },
          true,
          type,
          true,
          true,
        ),
      ).then((currentPageDetails) => {
        if (
          currentPageDetails.type === INDIVIDUAL_ENTRY_TAB_TYPES.PAGE_BUILDER
        ) {
          const dataParams = {
            page_id: currentPageDetails.value,
            dashboard_id: dashboardId,
            ...getDataParams(),
          };
          dispatch(getDashboardPageByIdForUserModeThunk(dataParams));
        }
      });
    });
    if (mode === INDIVIDUAL_ENTRY_MODE.REPORT_INSTANCE_MODE && type === INDIVIDUAL_ENTRY_TYPE.FLOW) {
      dispatch(
        getFlowAccessByUUID(
          {
            flow_uuid: metaData.moduleUuid,
            is_test_bed: 0,
          },
          t,
          () => {},
          true,
          {},
          true,
        ),
      );
    }
  };

  useEffect(() => {
    if (isInstMode && metaData?.moduleUuid) {
      const params = {};
      if (type === INDIVIDUAL_ENTRY_TYPE.FLOW) {
        params.flow_uuid = metaData.moduleUuid;
      } else if (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) {
        params.data_list_uuid = metaData.moduleUuid;
      }
      if (isEmpty(metaData?.dashboardId)) {
        dispatch(getIndividualDefaultReportByUuidThunk(params))
          .then((res) => {
            if (res) {
              if (res?._id) {
                getInstanceDetailsApis(res?._id);
              }
            }
          })
          .catch((error) => {
            console.log(error, 'getAllDashboardPagesThunkError');
          });
      } else {
        getInstanceDetailsApis(metaData?.dashboardId);
      }
    }
    return () => {
      if (isInstMode) {
        dispatch(leadAndClearReducer());
      }
    };
  }, []);

  useEffect(() => {
    const params = { trigger_type: 'related_actions' };
    if (type === INDIVIDUAL_ENTRY_TYPE.FLOW) params.flow_id = metaData.moduleId;
    else params.data_list_id = metaData.moduleId;

    setLoaderAndPointerEvent(true);
    apiGetAllTriggerDetails(params)
      .then((data) => {
        const subFlows = (data || []).map((t) => {
          return {
            label: t.trigger_name || t.child_flow_name,
            value: t._id,
            trigger_uuid: t.trigger_uuid,
            trigger_type: t.trigger_type,
            flow_uuid: t.child_flow_uuid,
            flow_id: t.child_flow_id,
          };
        });
        setSubFlows({
          loading: false,
          data: subFlows.filter((s) => s.trigger_type === 'related_actions'),
        });
      })
      .catch(() => {
        setSubFlows({ loading: false, data: [] });
      })
      .finally(() => setLoaderAndPointerEvent(false));
  }, []);

  const onTabSelectHandler = (value) => {
    const tabData = pagesList.find((data) => data.value === value);
    const updateData = {
      currentPageDetails: tabData,
    };
    if (tabData.type === INDIVIDUAL_ENTRY_TAB_TYPES.PAGE_BUILDER) {
      const params = {
        page_id: tabData.value,
        dashboard_id,
        ...getDataParams(),
      };
      dispatch(getDashboardPageByIdForUserModeThunk(params));
    } else updateData.pageMetadata = {};
    dispatch(dataChange(updateData));
  };

  const getCancelInstance = () => {
    if (!instanceDetails.can_cancel) return null;
    const CANCEL_INSTANCE = CANCEL_INSTANCE_STRINGS(t);

    const onClick = () => {
      setCancelInstance({ isModalOpen: true, comments: EMPTY_STRING });
    };

    const onCancel = async () => {
      const errorList = validateCancelInstance(cancelInstance, t);
      setCancelInstance({
        ...cancelInstance,
        commentsError: errorList.comments,
      });
      if (!isEmpty(errorList)) return;

      try {
        setLoaderAndPointerEvent(true);
        const data = {
          cancel_reason: cancelInstance.comments,
          instance_id: instanceDetails._id,
        };
        await apiCancelFlowInstance(data);
        toastPopOver({
          title: CANCEL_INSTANCE.TOAST,
          toastType: EToastType.success,
        });
        onCloseModel();
        refreshOnDelete();
      } catch (e) {
        somethingWentWrongErrorToast();
      } finally {
        setLoaderAndPointerEvent(false);
      }
    };

    const getConfirmModal = () => {
      if (!cancelInstance.isModalOpen) return null;
      return (
        <Modal
          id="cancel_instance"
          isModalOpen
          modalStyle={ModalStyleType.dialog}
          modalSize={ModalSize.sm}
          mainContentClassName={gClasses.P24}
          mainContent={
            <>
              <Title
                content={CANCEL_INSTANCE.TITLE}
                size={ETitleSize.xs}
                className={gClasses.MB16}
              />
              <div
                className={cx(gClasses.CenterV, gClasses.MB8, gClasses.Gap8)}
              >
                <Text content={`${CANCEL_INSTANCE.FLOW_NAME}:`} />
                <Text content={instanceDetails.flow_name} />
              </div>
              <div
                className={cx(gClasses.CenterV, gClasses.MB8, gClasses.Gap8)}
              >
                <Text content={`${CANCEL_INSTANCE.FLOW_ID}:`} />
                <Text content={instanceDetails.system_identifier} />
              </div>
              <TextArea
                labelText={CANCEL_INSTANCE.REASON_LABEL}
                placeholder={CANCEL_INSTANCE.REASON_PLACEHOLDER}
                className={cx(gClasses.MB16)}
                required
                value={cancelInstance.comments}
                onChange={(e) =>
                  setCancelInstance({
                    ...cancelInstance,
                    comments: e.target.value,
                  })
                }
                colorScheme={colorScheme}
                errorMessage={cancelInstance.commentsError}
                size={Size.sm}
              />
              <div className={cx(gClasses.DisplayFlex, gClasses.JusEnd)}>
                <Button
                  buttonText={CANCEL_INSTANCE.DISCARD}
                  type={EButtonType.TERTIARY}
                  onClickHandler={() =>
                    setCancelInstance(CANCEL_INSTANCE_DEFAULT_VALUE)
                  }
                />
                <Button
                  buttonText={CANCEL_INSTANCE.CANCEL}
                  onClickHandler={onCancel}
                  colorSchema={{ activeColor: UTIL_COLOR.RED_600 }}
                />
              </div>
            </>
          }
        />
      );
    };

    return (
      <>
        {getConfirmModal()}
        <SingleDropdown
          optionList={[CANCEL_INSTANCE.OPTIONS]}
          selectedValue="123"
          onClick={onClick}
          className={gClasses.WidthFitContent}
          dropdownViewProps={{
            className: gClasses.MT6,
            variant: Variant.borderLess,
            icon: <VerticalDot />,
            iconOnly: true,
          }}
          getClassName={(isOpen) => (isOpen ? gClasses.TextNoWrap : '')}
          getPopperContainerClassName={(isOpen) =>
            isOpen ? cx(gClasses.ZIndex3, gClasses.WidthFitContent) : ''
          }
          popperPlacement={EPopperPlacements.BOTTOM_END}
        />
      </>
    );
  };

  const getActionsDropdown = () => {
    if (isEmpty(subFlows.data)) return null;

    const onClick = async (value) => {
      const _subFlow = subFlows.data.find((s) => value === s.value);
      const params = {
        flow_uuid: _subFlow.flow_uuid,
        is_test_bed: 0,
        parent_id: metaData.instanceId,
        trigger_uuid: _subFlow.trigger_uuid,
      };
      if (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) {
        params.parent_data_list_uuid = metaData.moduleUuid;
      } else params.parent_flow_uuid = metaData.moduleUuid;

      try {
        const res = await initiateFlow(params);
        if (res?.task_log_id) {
          const openTaskIdPathName = `${TASKS}/${OPEN_TASKS}/${res?.task_log_id}`;
          openInNewTab(openTaskIdPathName);
        } else {
          toastPopOver({
            title: t(
              'common_strings.form_popover_strings.flow_initiated_successfully',
            ),
            toastType: EToastType.success,
          });
        }
      } catch (e) {
        somethingWentWrongErrorToast();
      }
    };

    return (
      <SingleDropdown
        optionList={subFlows.data}
        selectedValue="123"
        onClick={onClick}
        className={gClasses.WidthFitContent}
        dropdownViewProps={{
          className: gClasses.P0,
          customDropdownView: (
            <Text
              content={t('flow_dashboard.trigger_shortcuts.actions')}
              size={ETextSize.XS}
            />
          ),
          variant: Variant.borderLess,
        }}
        getClassName={(isOpen) => (isOpen ? gClasses.TextNoWrap : '')}
        getPopperContainerClassName={(isOpen) =>
          isOpen ? cx(gClasses.ZIndex3, gClasses.WidthFitContent) : ''
        }
        popperPlacement={EPopperPlacements.BOTTOM_END}
      />
    );
  };

  const onDeleteInstance = () => {
    if (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) {
      const params = {
        data_list_uuid: metaData.moduleUuid,
        _id: metaData.instanceId,
      };
      setLoaderAndPointerEvent(true);
      deleteDataListEntry(params)
        .then(() => {
          refreshOnDelete?.();
          onCloseModel();
          toastPopOver({
            title: t('error_popover_status.entry_deleted'),
            subtitle: t('error_popover_status.datalist_entry_deleted'),
            toastType: EToastType.success,
          });
        })
        .catch(() => {
          somethingWentWrongErrorToast();
        })
        .finally(() => setLoaderAndPointerEvent(false));
    }
  };

  const onEditUpdateDataRefresh = () => {
    refreshOnDelete?.();
    onTabSelectHandler(currentPageDetails.value);
  };

  const getHeaderElement = () => {
    const { system_identifier, custom_identifier, is_editable, is_deletable } =
      instanceDetails;

    return (
      <div
        className={cx(
          gClasses.DisplayFlex,
          gClasses.FlexDirectionColumn,
          styles.EntryHeader,
        )}
      >
        <div className={cx(gClasses.FlexJustifyBetween, gClasses.gap5)}>
          <Title
            content={custom_identifier || system_identifier}
            size={ETitleSize.small}
            className={cx(
              gClasses.FTwo20GrayV3,
              gClasses.MT8,
              gClasses.FontWeight500,
            )}
          />
          <div className={cx(gClasses.CenterVH, gClasses.gap12)}>
            {isDashboardPageAuthorized &&
              (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST ? (
                <div className={cx(gClasses.CenterVH, gClasses.gap12)}>
                  {is_editable && (
                    <>
                      <button onClick={() => setIsEditDataOpen(true)}>
                        <Edit className={gClasses.OutlineNoneOnFocus} />
                      </button>
                      {isEditDataOpen && (
                        <EditDatalistEntry
                          isModalOpen={isEditDataOpen}
                          dataListUuid={metaData.moduleUuid}
                          dataListEntryId={metaData.instanceId}
                          onCloseClick={() => setIsEditDataOpen(false)}
                          onRefreshData={onEditUpdateDataRefresh}
                        />
                      )}
                    </>
                  )}
                  {is_deletable && (
                    <>
                      <button onClick={() => setDeleteInstanceConfirm(true)}>
                        <Trash />
                      </button>
                      {deleteInstanceConfirm && (
                        <DeleteConfirmModal
                          isModalOpen
                          content={t('individual_entry.delete_entry_confirm')}
                          onDelete={onDeleteInstance}
                          onCloseModal={() => setDeleteInstanceConfirm(false)}
                        />
                      )}
                    </>
                  )}
                </div>
              ) : (
                getCancelInstance()
              ))}
            <button onClick={onCloseModel}>
              <IndividualEntryClose />
            </button>
          </div>
        </div>
        {isInstMode && isDashboardPageAuthorized && (
          <div className={cx(gClasses.CenterV, gClasses.JusSpaceBtw)}>
            <Tab
              isLoading={isPagesLoading}
              selectedTabIndex={currentPageDetails.tabIndex}
              options={pagesList}
              onClick={(value) => onTabSelectHandler(value)}
              colorScheme={colorScheme}
              className={styles.TabClass}
              textClass={styles.EachTabClass}
            />
            {getActionsDropdown()}
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      id="individual_entry_data"
      isModalOpen
      customModalClass={styles.IndividualEntryModal}
      headerContent={getHeaderElement()}
      mainContent={
        <div>
          {isDashboardPageAuthorized ? (
            <IndividualEntry
              mode={mode}
              type={type}
              metaData={metaData}
              otherDetails={otherDetails}
            />
          ) : (
            <ResponseHandler
              className={gClasses.MT90}
              messageObject={{
                type: RESPONSE_TYPE.NO_DATA_FOUND,
                title: 'Access Denied',
                subTitle: "You don't have access to this instance",
              }}
            />
          )}
        </div>
      }
    />
  );
}

IndividualEntryModel.propTypes = {
  mode: PropTypes.string,
  type: PropTypes.string,
  metaData: PropTypes.object,
  onCloseModel: PropTypes.func,
  otherDetails: PropTypes.object,
  refreshOnDelete: PropTypes.func,
};

export default IndividualEntryModel;
