import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ETitleSize, Table, TableColumnWidthVariant, Title } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { API_KEY_STRINGS } from '../UserSettings.strings';
import styles from '../UserSettings.module.scss';
import { userSettingsDataChange, getListAllApiKeysThunk, deleteApiKeyDetailsThunk } from '../../../redux/actions/UserSettings.Action';
import { BS } from '../../../utils/UIConstants';
import {
    API_KEY_HEADERS,
    LAST_USED_DATE,
    MASKED_ROW_KEY,
    // apiKeyTestData,
} from '../UserSettings.utils';
import { isEmpty } from '../../../utils/jsUtility';
import Trash from '../../../assets/icons/application/Trash';
import { getFormattedDateFromUTC } from '../../../utils/dateUtils';
import EditApiKey from './edit_api_key/EditApiKey';
import PlusIconBlueNew from '../../../assets/icons/PlusIconBlueNew';
import ViewApiKey from './view_api_key/ViewApiKey';
import ConfirmationModal from '../../../components/form_components/confirmation_modal/ConfirmationModal';
import ListLoadErrorIcon from '../../../assets/icons/user_settings/security/ListLoadErrorIcon';
import NoDataComponent from '../../no_data_component/NoDataComponent';
import EmptyListIcon from '../../../assets/icons/user_settings/EmptyListIcon';
import CircleAlertIcon from '../../../assets/icons/user_settings/CircleAlertIcon';
import TaskCard from '../../landing_page/to_do_task/task_card/TaskCard';

let cancelTokenApiKey;

export const getCancelTokenApiKey = (cancelToken) => {
    cancelTokenApiKey = cancelToken;
  };

function ApiKeySettings(props) {
    const {
        getListAllApiKeys,
        onUserSettingsDataChange,
        isEditApiKeyOpen,
        isLoadingApiKeys,
        isErrorInLoadingApiKeys,
        isViewApiKeyOpen,
        apiKeyList,
        deleteApiKeyDetails,
    } = props;

    const { t } = useTranslation();

    useEffect(() => {
        if (cancelTokenApiKey) cancelTokenApiKey();
        getListAllApiKeys(getCancelTokenApiKey);
        return () => {
            onUserSettingsDataChange({
                isViewApiKeyOpen: false,
                isEditApiKeyOpen: false,
            });
        };
    }, []);

    console.log('apikeyListAPIKEYSETTINGS', apiKeyList);
    const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [isMaxLimitVisible, setMaxLimitVisible] = useState(false);
    const [currentRowId, setCurrentRowId] = useState(null);

    let editApiKeyModal = null;
    let viewApiKeyModal = null;
    let tableData = null;

    const onTableRowClick = (id) => {
        const currentKeyData = apiKeyList?.find(
            (eachKey) => eachKey?._id === id,
        );
        console.log('IDonTableRowClick', id, 'cureentKey', currentKeyData);
        onUserSettingsDataChange({
            apiKeyData: currentKeyData,
            isViewApiKeyOpen: true,
            isSingleCardClicked: true,
        });
    };

    const onDeleteApiKey = async () => {
        try {
            await deleteApiKeyDetails({
            _id: currentRowId,
            });
            setDeleteConfirmationOpen(false);
            setCurrentRowId(null);
        } catch (e) {
          console.log('erroronDeleteCredential', e);
        }
    };

    const onCreateClick = () => {
        console.log('onCreateClickApiKey');
        if (apiKeyList.length < 5) {
            onUserSettingsDataChange({
                isSingleCardClicked: false,
                isEditApiKeyOpen: true,
            });
        } else {
            setMaxLimitVisible(true);
        }
    };

    const onDeleteRowClick = (e, id) => {
        e.stopPropagation();
        console.log('eventOnDeleteRowClick', e, id);
        setCurrentRowId(id);
        setDeleteConfirmationOpen(true);
    };

    if (isEmpty(apiKeyList)) {
        if (isLoadingApiKeys) {
            // loader
            tableData = (
                <div className={gClasses.PX30}>
                    {
                    Array(4)
                        .fill()
                        .map((eachCard, index) => (
                        <TaskCard
                            CardContainerStyle={styles.CardLoader}
                            isDataLoading
                            key={index}
                        />
                        ))
                    }
                </div>
            );
        } else {
            if (isErrorInLoadingApiKeys) {
                tableData = (
                    <NoDataComponent
                        noDataIcon={<ListLoadErrorIcon />}
                        mainTitle={API_KEY_STRINGS(t).CANT_DISPLAY_LIST}
                        subTitle={API_KEY_STRINGS(t).COULD_NOT_LOAD}
                    />
                );
            } else {
                tableData = (
                    <NoDataComponent
                        noDataIcon={<EmptyListIcon />}
                        mainTitle={API_KEY_STRINGS(t).NO_KEY_FOUND}
                        subTitle={API_KEY_STRINGS(t).CREATE_FIRST_KEY}
                        createButtonText={API_KEY_STRINGS(t).CREATE}
                        onCreateButtonClick={onCreateClick}
                    />
                );
            }
        }
    } else {
        const constructTableData = (apiKeyList) => {
            if (isEmpty(apiKeyList)) return [];
            const tableBody = apiKeyList.map((item) => {
                const descriptiveName = (
                    <div className={cx(styles.RowText, styles.ApiKeyName)} title={item?.name}>
                        {item?.name}
                    </div>
                );
                const apiKey = (
                    <div className={cx(styles.RowText, styles.ApiKey)}>
                        {MASKED_ROW_KEY}
                    </div>
                );
                const lastUsedOn = (
                    <div className={cx(styles.RowText, item?.last_used_on ? null : gClasses.ML25)}>
                        {item?.last_used_on ?
                            getFormattedDateFromUTC(item?.last_used_on, LAST_USED_DATE)
                        : '-'}
                    </div>
                );
                const editOrDelete = (
                    <div className={cx(BS.D_FLEX, BS.JC_END)}>
                        <button onClick={(e) => onDeleteRowClick(e, item?._id)}><Trash /></button>
                    </div>
                );
                return {
                    id: item?._id,
                    component: [
                        descriptiveName,
                        apiKey,
                        lastUsedOn,
                        editOrDelete,
                    ],
                };
            });
            return tableBody;
        };

        tableData = (
        <>
            <Title
                content={API_KEY_STRINGS(t).TITLE}
                size={ETitleSize.small}
                className={cx(styles.ApiKeyTitle)}
                isDataLoading={isLoadingApiKeys}
            />
            <div className={cx(styles.TableContainer, gClasses.MT16)}>
                <Table
                    isRowClickable
                    onRowClick={onTableRowClick}
                    header={isEmpty(apiKeyList) ? [] : API_KEY_HEADERS(t)}
                    isLoading={isLoadingApiKeys}
                    data={constructTableData(apiKeyList)}
                    className={cx(styles.ApiKeyTable)}
                    widthVariant={TableColumnWidthVariant.CUSTOM}
                />
            </div>
            {!isLoadingApiKeys &&
            <button className={cx(gClasses.MT14)} onClick={onCreateClick}>
                <div className={cx(gClasses.CenterV, styles.CreateNew)}>
                    <PlusIconBlueNew className={gClasses.MR2} />
                    {API_KEY_STRINGS(t).CREATE_NEW}
                </div>
            </button>
            }
        </>
        );
    }
    if (isViewApiKeyOpen) {
        viewApiKeyModal = (
            <ViewApiKey
                isModalOpen={isViewApiKeyOpen}
            />
        );
    }

    if (isEditApiKeyOpen) {
        editApiKeyModal = (
            <EditApiKey
                isModalOpen={isEditApiKeyOpen}
            />
        );
    }

    return (
        <div className={BS.H100}>
            {tableData}
            {editApiKeyModal}
            {viewApiKeyModal}
            {isDeleteConfirmationOpen && (
                <ConfirmationModal
                    isModalOpen={isDeleteConfirmationOpen}
                    onConfirmClick={onDeleteApiKey}
                    onCancelOrCloseClick={() => setDeleteConfirmationOpen(false)}
                    titleName={API_KEY_STRINGS(t).DELETE_API_KEY}
                    mainDescription={API_KEY_STRINGS(t).DELETE_SUB_TEXT}
                    confirmationName={API_KEY_STRINGS(t).DELETE}
                    cancelConfirmationName={API_KEY_STRINGS(t).CANCEL}
                    noClickOutsideAction
                />
                )
            }
            {isMaxLimitVisible && (
                <ConfirmationModal
                    isModalOpen={isMaxLimitVisible}
                    onConfirmClick={() => setMaxLimitVisible(false)}
                    titleName={API_KEY_STRINGS(t).LIMIT_REACHED_TITLE}
                    mainDescription={API_KEY_STRINGS(t).LIMIT_REACHED_INFO}
                    confirmationName={API_KEY_STRINGS(t).OKAY}
                    noClickOutsideAction
                    notShowClose
                    customIcon={<CircleAlertIcon />}
                    customIconClass={gClasses.MB24}
                    primaryButtonClass={styles.OkButton}
                    innerClass={styles.InnerModal}
                />
                )
            }
        </div>
    );
}

const mapStateToProps = ({ UserSettingsReducer }) => {
    return {
        apiKeyList: UserSettingsReducer.apiKeyList,
        isEditApiKeyOpen: UserSettingsReducer.isEditApiKeyOpen,
        isViewApiKeyOpen: UserSettingsReducer.isViewApiKeyOpen,
        apiKeyData: UserSettingsReducer.apiKeyData,
        isLoadingApiKeys: UserSettingsReducer.isLoadingApiKeys,
        isErrorInLoadingApiKeys: UserSettingsReducer.isErrorInLoadingApiKeys,
    };
};

const mapDispatchToProps = {
    getListAllApiKeys: getListAllApiKeysThunk,
    onUserSettingsDataChange: userSettingsDataChange,
    deleteApiKeyDetails: deleteApiKeyDetailsThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeySettings);
