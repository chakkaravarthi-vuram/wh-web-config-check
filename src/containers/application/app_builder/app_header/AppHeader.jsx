import React, { useRef, useState } from 'react';
import cx from 'classnames/bind';
import {
    Button,
    EButtonSizeType,
    EButtonType,
    Modal,
    Text,
    Title,
    ModalStyleType,
    DialogSize,
    ETitleAlign,
    ETitleHeadingLevel,
    ETitleSize,
    ETextSize,
    Breadcrumb,
    Size,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { useClickOutsideDetector } from 'utils/UtilityFunctions';
import gClasses from '../../../../scss/Typography.module.scss';
import style from '../AppBuilder.module.scss';
import SettingsAppIcon from '../../../../assets/icons/app_builder_icons/SettingsAppIcon';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { isEmpty } from '../../../../utils/jsUtility';
import { APPS_TITLE, APP_TAB_HEADER_OPTIONS, CREATE_APP_TITLE, EDIT_APP_TITLE } from '../AppBuilder.strings';
import AutoPositioningPopper, { POPPER_PLACEMENTS } from '../../../../components/auto_positioning_popper/AutoPositioningPopper';
import { CREATE_APP_STRINGS } from '../../create_app/CreateApp.strings';
import { applicationDataChange, applicationStateChange } from '../../../../redux/reducer/ApplicationReducer';
import { deleteAppThunk, discardAppApiThunk, saveAppApiThunk, validateAppApiThunk } from '../../../../redux/actions/Appplication.Action';
import { APP_LIST_ID, GET_APP_LIST_LABEL, APP_LIST_STATUS } from '../../app_listing/AppList.constants';
import { BS } from '../../../../utils/UIConstants';
import CloseIconNew from '../../../../assets/icons/CloseIconNew';
import AlertCircle from '../../../../assets/icons/application/AlertCircle';
import { ROUTE_METHOD, UTIL_COLOR } from '../../../../utils/Constants';
import styles from './AppHeader.module.scss';
import * as ROUTE_CONSTANTS from '../../../../urls/RouteConstants';
import AppDiscardConfirmModal from '../../app_discard_confirm_modal/AppDiscardConfirmModal';
import { APP_DISCARD_CONFIRMATION, BUTTON_LABELS } from '../../application.strings';
import DeleteConfirmModalAnyway from '../../delete_comfirm_modal_anyway/DeleteConfirmModalAnyway';
import { getRouteLink, routeNavigate } from '../../../../utils/UtilityFunctions';

function AppHeader(props) {
    const { appUuid, app_id, appName, isBasicUser } = props;
    const { app_uuid } = useParams();
    const [isPopperOpen, setIsPopperOpen] = useState(false);
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const [discardModalOpen, setDiscardModalOpen] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const { activeAppData, deleteAnyWayPopper } = useSelector((store) => store.ApplicationReducer);

    const closeModal = () => {
        setIsPopperOpen(false);
    };

    const { t } = useTranslation();
    const wrapperRef = useRef(null);
    useClickOutsideDetector(wrapperRef, closeModal);

    const onOptionSelect = (option) => {
        console.log('option', option);
        if (option.label === CREATE_APP_STRINGS(t).BASIC_SETTINGS.TITLE) {
            dispatch(applicationDataChange({ isBasicSettingsModalOpen: true }));
        }
        if (option?.label === APP_TAB_HEADER_OPTIONS(t)[1].label) {
            setDiscardModalOpen(true);
        }
        if (option?.label === APP_TAB_HEADER_OPTIONS(t)[2].label) {
            setDeleteConfirmationModal(true);
        }
        setIsPopperOpen(false);
    };

    const onDiscardClick = () => {
        const apiParams = {
            _id: app_id,
        };
         dispatch(discardAppApiThunk(apiParams, history));
    };

    const saveApp = () => {
        const appAdmins = {};
        if (activeAppData?.admins?.teams && activeAppData?.admins?.teams?.length > 0) {
        appAdmins.teams =
        activeAppData?.admins?.teams?.map((team) => team._id);
        }

        if (activeAppData?.admins?.users && activeAppData?.admins?.users?.length > 0) {
        appAdmins.users =
        activeAppData?.admins?.users?.map((user) => user._id);
        }

        const appViewers = {};
        if (activeAppData?.viewers?.teams && activeAppData?.viewers?.teams?.length > 0) {
        appViewers.teams =
        activeAppData?.viewers?.teams?.map((team) => team._id);
        }

        if (activeAppData?.viewers?.users && activeAppData?.viewers?.users?.length > 0) {
        appViewers.users =
        activeAppData?.viewers?.users?.map((user) => user._id);
        }
        const saveData = {
            name: activeAppData?.name,
           ...(!isEmpty(activeAppData?.description) ? { description: activeAppData?.description } : null),
           ...(activeAppData?.id ? { _id: activeAppData?.id } : null),
           ...(activeAppData?.app_uuid ? { app_uuid: activeAppData?.app_uuid } : null),
            admins: appAdmins,
            viewers: appViewers,
        };
        dispatch(saveAppApiThunk(saveData, t, history, true));
    };

    const optionPopper = () => (
        <AutoPositioningPopper
            className={cx(style.PopperPosition, gClasses.ZIndex10)}
            placement={POPPER_PLACEMENTS.BOTTOM_END}
            isPopperOpen={isPopperOpen}
            referenceElement={wrapperRef?.current}
            fixedStrategy
        >
            <div className={cx(style.PopperLayout, gClasses.P24)}>
                {APP_TAB_HEADER_OPTIONS(t).map((options) => {
                    if (activeAppData?.status === APP_LIST_STATUS.PUBLISHED || (activeAppData?.status === APP_LIST_STATUS.UNPUBLISHED && activeAppData?.version > 1) || (((activeAppData?.status === APP_LIST_STATUS.UNPUBLISHED && activeAppData?.version <= 1) || !activeAppData?.status) && (options?.label !== APP_TAB_HEADER_OPTIONS(t)[1].label))) {
                        return (
                            <button key={options.label} className={style.PopperElement} onClick={() => onOptionSelect(options)}>
                                <div>
                                    <Text className={options.label.includes('Delete') ? gClasses.RedV22 : gClasses.BlackV12} content={options.label} />
                                </div>
                            </button>
                        );
                    }
                    return null;
                },
                )}
            </div>
        </AutoPositioningPopper>
    );

    const APP_LIST_LABEL = GET_APP_LIST_LABEL(t);

    const onDelete = () => {
        dispatch(applicationStateChange({ hideClosePopper: true }));
        dispatch(deleteAppThunk({ app_uuid: appUuid }, t))
        .then(() => {
            const onDeletePathName = `${ROUTE_CONSTANTS.LIST_APPLICATION}${ROUTE_CONSTANTS.PUBLISHED_APP_LIST}`;
            routeNavigate(history, ROUTE_METHOD.PUSH, onDeletePathName, null, null);
            dispatch(applicationStateChange({ hideClosePopper: false }));
        })
        .catch(() => {
            dispatch(applicationStateChange({ hideClosePopper: false }));
        });
      };

    const getAppBreadcrumb = () => {
        const appTitlePathName = `${ROUTE_CONSTANTS.LIST_APPLICATION}${ROUTE_CONSTANTS.PUBLISHED_APP_LIST}`;
        if (!app_uuid) {
            return [
                {
                    text: t(APPS_TITLE),
                    isText: false,
                    route: getRouteLink(appTitlePathName, history),
                    className: gClasses.FTwo12,
                }, {
                    text: t(CREATE_APP_TITLE),
                    isText: true,
                    className: gClasses.FTwo12,
                }, {
                    text: appName,
                    isText: true,
                    className: gClasses.FTwo12,
                },
            ];
        } else {
            return [
                {
                    text: t(APPS_TITLE),
                    isText: false,
                    route: getRouteLink(appTitlePathName, history),
                    className: gClasses.FTwo12,
                },
                {
                    text: appName,
                    isText: true,
                    className: gClasses.FTwo12,
                }, {
                    text: t(EDIT_APP_TITLE),
                    isText: true,
                    className: gClasses.FTwo12,
                },
            ];
        }
    };

    return (
        <>
            <div className={cx(gClasses.PX24, style.AppHeader)}>
                <div className={cx(gClasses.CenterV, style.AppTitleContainer)}>
                    <div>
                        <Breadcrumb
                            list={getAppBreadcrumb()}
                            className={styles.AppBreadCrumb}
                        />
                        <Title size={Size.sm} content={appName} />
                    </div>
                    <div className={gClasses.CenterV}>
                        <div ref={wrapperRef}>
                            <SettingsAppIcon className={cx(gClasses.CursorPointer, style.IconsStrokeHover)} onClick={() => setIsPopperOpen(!isPopperOpen)} />
                            {optionPopper()}
                            <AppDiscardConfirmModal
                                content={t(APP_DISCARD_CONFIRMATION)}
                                onAcceptClick={() => onDiscardClick()}
                                isModalOpen={discardModalOpen}
                                onCloseModal={() => setDiscardModalOpen(false)}
                            />
                        </div>
                        <div className={style.Divider} />
                        <Button
                            buttonText={t(BUTTON_LABELS.SAVE_AND_CLOSE)}
                            onClickHandler={() => saveApp()}
                            size={EButtonSizeType.MD}
                            type={EMPTY_STRING}
                            className={cx(gClasses.MR16, gClasses.PX0)}
                        />
                        <Button
                            buttonText={t(BUTTON_LABELS.PUBLISH_APP)}
                            onClickHandler={() => dispatch(validateAppApiThunk(
                                {
                                    app_uuid: appUuid,
                                },
                                isBasicUser,
                                t,
                            ))}
                            size={EButtonSizeType.MD}
                            type={EButtonType.PRIMARY}
                            className={gClasses.PX16}
                        />
                    </div>
                </div>
            </div>
            <Modal
                id={APP_LIST_ID.DELETE_MODAL_ID}
                modalStyle={ModalStyleType.dialog}
                dialogSize={DialogSize.sm}
                className={gClasses.CursorAuto}
                mainContent={
                    (
                        <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, BS.ALIGN_ITEM_CENTER, gClasses.P16)}>
                        <div className={cx(BS.D_FLEX, BS.JC_END, gClasses.MB8, BS.W100)}>
                        <button onClick={() => setDeleteConfirmationModal(false)}><CloseIconNew /></button>
                        </div>

                        <div className={styles.AlertCircle}><AlertCircle /></div>
                        <Title
                            content={APP_LIST_LABEL.DELETE_MODAL_TITLE}
                            alignment={ETitleAlign.middle}
                            headingLevel={ETitleHeadingLevel.h5}
                            size={ETitleSize.xs}
                            className={gClasses.MB16}
                        />
                        <Text
                            content={APP_LIST_LABEL.DELETE_MODAL_SUB_TITLE_FIRST}
                            size={ETextSize.SM}
                            className={gClasses.MB8}
                        />
                        <Text
                            content={APP_LIST_LABEL.DELETE_MODAL_SUB_TITLE_SECOND}
                            size={ETextSize.SM}
                            className={gClasses.MB8}
                        />
                        <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.MT16, gClasses.MB32)}>
                            <Button
                            buttonText={APP_LIST_LABEL.DELETE_MODAL_NO_ACTION}
                            onClickHandler={() => setDeleteConfirmationModal(false)}
                            type={EButtonType.OUTLINE_SECONDARY}
                            className={cx(styles.MdCancelBtn, gClasses.MR16)}
                            />
                            <Button
                            buttonText={APP_LIST_LABEL.DELETE_MODAL_YES_ACTION}
                            onClickHandler={onDelete}
                            // className={gClasses.MR16}
                            colorSchema={{ activeColor: UTIL_COLOR.RED_600 }}
                            type={EButtonType.PRIMARY}
                            />
                        </div>
                        </div>)
                }
                isModalOpen={deleteConfirmationModal}
            />
            {deleteAnyWayPopper?.isAnywayVisible && <DeleteConfirmModalAnyway deletePopperData={deleteAnyWayPopper} />}
        </>
    );
}

export default AppHeader;
