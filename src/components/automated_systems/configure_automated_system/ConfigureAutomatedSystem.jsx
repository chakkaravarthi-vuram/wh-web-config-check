import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { Modal, ModalStyleType, ModalSize, Text, Title, ETitleSize, ETextSize, Button, EButtonType, toastPopOver, EToastType } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { DATA_CHANGE_MODULE, SCHEDULAR_CONSTANTS } from '../AutomatedSystems.constants';
import style from '../AutomatedSystems.module.scss';
import CloseIconNew from '../../../assets/icons/CloseIconNew';
import AutomatedTriggerType from '../automated_trigger_point/TriggerPoint';
import TriggerAction from '../automated_trigger_actions/TriggerAction';
import { showToastPopover, somethingWentWrongErrorToast, validate } from '../../../utils/UtilityFunctions';
import { automatedSystemsSchema } from '../AutomatedSystems.schema';
import { constructSaveSystemAction, deconstructSystemAction, getAutomatedSystemsValidationData, validateSystemActionCB } from '../AutomatedSystems.utils';
import useConfigureAutomatedSystem, { AUTOMATED_SYSTEM_ACTION } from './useConfigureAutomatedSystem';
import { get, isEmpty } from '../../../utils/jsUtility';
import { setPointerEvent, updatePostLoader } from '../../../utils/loaderUtils';
import { deleteSystemEventApi, getSystemEventApi, saveSystemEventApi } from '../../../axios/apiService/automatedSystems.apiService';
import { updateSomeoneIsEditingPopover } from '../../../redux/actions/CreateDataList.action';
import DeleteConfirmModal from '../../delete_confirm_modal/DeleteConfirmModal';
import BlueLoadingSpinnerIcon from '../../../assets/BlueLoadingSpinner';
import { SOMEONE_EDITING } from '../../../utils/ServerValidationUtils';
import { EMPTY_STRING, VALIDATION_ERROR_TYPES } from '../../../utils/strings/CommonStrings';
import { AUTOMATED_SYSTEM_CONSTANTS } from '../AutomatedSystems.strings';
import { triggerMappingSchema } from '../../../containers/edit_flow/step_configuration/node_configurations/call_another_flow/CallAnotherFlow.validation.schema';
import { constructMappingValidationData } from '../../../containers/edit_flow/step_configuration/node_configurations/call_another_flow/CallAnotherFlow.utils';
import { FORM_POPOVER_STATUS } from '../../../utils/Constants';

function AutomatedSystems(props) {
    const {
        automateOpenStatus,
        onCloseClick,
        metaData = {},
        systemAction,
        systemFields,
    } = props;
    const { t } = useTranslation();
    const reduxDispatch = useDispatch();
    const { state: automatedSystemData, dispatch } = useConfigureAutomatedSystem();
    const { COMMON_AUTOMATED_STRINGS } = AUTOMATED_SYSTEM_CONSTANTS(t);
    const { errorList } = automatedSystemData;
    const [deleteSystemEvent, setDeleteSystemEvent] = useState(false);
    const [loading, setLoading] = useState(() => !isEmpty(systemAction));
    const [dynamicValidation, setDynamicValidation] = useState(false);

    useEffect(() => {
        if (systemAction?.id) {
          setLoading(true);
          getSystemEventApi(systemAction.id)
            .then((data) => {
              console.log('xyz res', data);
              if (!isEmpty(data)) {
                const [systemAction, errorList] = deconstructSystemAction(data, { reduxDispatch, t });
                console.log('xyz systemAction', { systemAction, errorList });
                dispatch(AUTOMATED_SYSTEM_ACTION.SET_STATE, systemAction);
                dispatch(AUTOMATED_SYSTEM_ACTION.UPDATE_ERROR_LIST, errorList);
              }
            })
            .catch((err) => {
              console.error('xyz getSystemEventApi', err);
              somethingWentWrongErrorToast();
            }).finally(() => setLoading(false));
        }
    }, [systemAction?.id]);

    const onClose = (reFetch = false) => {
        dispatch(AUTOMATED_SYSTEM_ACTION.CLEAR_STATE);
        setDeleteSystemEvent(false);
        onCloseClick(reFetch);
    };

    // Trigger point changes
    const dispatchAction = (id, value, module, options) => {
      if (module === DATA_CHANGE_MODULE.TRIGGER) {
        dispatch(AUTOMATED_SYSTEM_ACTION.TRIGGER_MAPPING_DATA_CHANGE, { id, value, options });
      } else {
        dispatch(AUTOMATED_SYSTEM_ACTION.DATA_CHANGE, { id, value });
      }
    };

    const validateData = (id, value, module) => {
        if (id === 'triggerMapping') return;
        if (!isEmpty(errorList)) {
            const modifiedData = {
                ...automatedSystemData,
                ...(module === DATA_CHANGE_MODULE.TRIGGER) ? {
                    flowActions: {
                        ...automatedSystemData.flowActions,
                        [id]: value,
                    },
                } : { [id]: value },
            };
            const errorListData = validate(getAutomatedSystemsValidationData(modifiedData, t), automatedSystemsSchema(t));
            dispatch(AUTOMATED_SYSTEM_ACTION.UPDATE_ERROR_LIST, errorListData);
        }
    };

    const onChangeHandler = (id, value, module, options) => {
        dispatchAction(id, value, module, options);
        validateData(id, value, module);
    };

    // Trigger Error Updater
    const onUpdateError = (allErrors) => {
        dispatch(AUTOMATED_SYSTEM_ACTION.UPDATE_ERROR_LIST, allErrors);
    };

     // Submit function for publishing automated systems
     const onSave = () => {
        const constructedAutomatedSystemsData = getAutomatedSystemsValidationData(automatedSystemData, t);
        const errorList = validate(constructedAutomatedSystemsData, automatedSystemsSchema(t));
        const mappingErrorList = validate(constructMappingValidationData(automatedSystemData.flowActions?.triggerMapping), triggerMappingSchema(t));
        const allErrors = { ...errorList };
        console.log('xyz errorList', { errorList, mappingErrorList, automatedSystemData });

        // if trigger mapping has error then add it to allErrors
        if (!isEmpty(mappingErrorList)) allErrors.mappingErrorList = mappingErrorList;

        // Condition builder validation
        if (automatedSystemData.conditionType === SCHEDULAR_CONSTANTS.CONDITION_TYPE.CONDITION) {
          const cbError = validateSystemActionCB(automatedSystemData);
          if (cbError.hasValidation) {
            allErrors.hasValidation = true;
          }
          dispatch(AUTOMATED_SYSTEM_ACTION.DATA_CHANGE, {
            id: 'condition',
            value: cbError.validatedExpression?.expression || {},
          });
        }

        onUpdateError(allErrors);
        setDynamicValidation(true);
        if (!isEmpty(allErrors)) return;

        const postData = constructSaveSystemAction(automatedSystemData, metaData);
        console.log('xyz postData', postData);
        updatePostLoader(true);
        setPointerEvent(true);
        saveSystemEventApi(postData)
          .then(() => {
            onClose(true);
          })
          .catch((err) => {
            console.error('xyz error', err);
            const errors = get(err, 'response.data.errors', []);
            const errorType = get(errors, [0, 'type']);

            if (errorType === SOMEONE_EDITING) {
              return updateSomeoneIsEditingPopover(get(errors, [0, 'message']));
            }
            if (errorType === VALIDATION_ERROR_TYPES.LIMIT) {
              return toastPopOver({
                title: COMMON_AUTOMATED_STRINGS.UNABLE_TO_CREATE,
                subtitle: COMMON_AUTOMATED_STRINGS.NOT_MORE_THAN_3_ACTIONS,
                toastType: EToastType.error,
              });
            }
            return somethingWentWrongErrorToast();
        }).finally(() => {
            updatePostLoader(false);
            setPointerEvent(false);
        });
    };

    // Modal Header
    const headerContent = (
        <div className={style.HeaderContainer}>
            <Title content={COMMON_AUTOMATED_STRINGS.HEADER} className={gClasses.FTwoBlackV21} size={ETitleSize.small} />
            <Text content={COMMON_AUTOMATED_STRINGS.DESCRIPTION} size={ETextSize.SM} className={gClasses.FTwo11BlackV21} />
            <CloseIconNew className={cx(style.CloseIcon, gClasses.CursorPointer)} onClick={() => onClose(false)} />
        </div>
    );

    // Modal Main Container
    const modalMainContent = (loading ? (
      <div className={cx(gClasses.CenterH, gClasses.H100, gClasses.CenterV)}>
        <BlueLoadingSpinnerIcon />
      </div>
    ) : (
        <div className={style.BodyContainer}>
            <AutomatedTriggerType
                metaData={metaData}
                onChangeHandler={onChangeHandler}
                automatedSystemsState={automatedSystemData}
                dynamicValidation={dynamicValidation}
            />
            <TriggerAction
                metaData={metaData}
                systemFields={systemFields}
                automatedSystemsState={automatedSystemData}
                onChangeHandler={onChangeHandler}
                onUpdateError={onUpdateError}
            />
        </div>)
    );

    // Modal footer
    const modalFooterContent = (
      <div className={cx(gClasses.CenterVSpaceBetween, style.FooterContainer)}>
        <div>
          {systemAction && (
            <Button
              buttonText={COMMON_AUTOMATED_STRINGS.DELETE}
              className={style.DeleteButton}
              type={EButtonType.TERTIARY}
              onClickHandler={() => setDeleteSystemEvent(true)}
            />
          )}
        </div>
        <div className={cx(gClasses.CenterV, gClasses.Gap16)}>
          <Button
            buttonText={COMMON_AUTOMATED_STRINGS.CANCEL}
            onClickHandler={() => onClose(false)}
            type={EButtonType.TERTIARY}
          />
          <Button
            buttonText={COMMON_AUTOMATED_STRINGS.SAVE}
            type={EButtonType.PRIMARY}
            onClickHandler={onSave}
          />
        </div>
      </div>
    );

    const getDeleteEventModal = () => {
        if (!deleteSystemEvent) return null;

        const onDeleteModalClose = () => {
            setDeleteSystemEvent(false);
        };

        const onDelete = () => {
            const data = { event_id: systemAction.id, data_list_id: metaData.dataListId };
            updatePostLoader(true);
            setPointerEvent(true);
            deleteSystemEventApi(data)
            .then(() => {
              showToastPopover('Automated System Actions Deleted Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);
              onClose(true);
            })
            .catch(() => somethingWentWrongErrorToast())
            .finally(() => {
                updatePostLoader(false);
                setPointerEvent(false);
            });
        };

        return (
            <DeleteConfirmModal
                isModalOpen
                id="delete-event"
                title={COMMON_AUTOMATED_STRINGS.DELETE_SYSTEM_ACTION}
                subText1={COMMON_AUTOMATED_STRINGS.DELETE_ARE_YOU_SURE}
                onCancel={onDeleteModalClose}
                onClose={onDeleteModalClose}
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
            isModalOpen={automateOpenStatus}
            mainContent={modalMainContent}
            headerContent={headerContent}
            modalSize={ModalSize.lg}
            footerContent={modalFooterContent}
        />
        </>
    );
}

export default AutomatedSystems;

AutomatedSystems.propTypes = {
  automateOpenStatus: PropTypes.bool,
  onCloseClick: PropTypes.func,
  metaData: PropTypes.object,
  systemAction: PropTypes.object,
};
