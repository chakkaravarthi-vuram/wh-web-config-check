import { Table, Modal, Title, ETitleSize, ModalStyleType, ModalSize, TableScrollType, TableColumnWidthVariant, Text, TableVariant, TableSortOrder } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import styles from './ManageFlowFields.module.scss';
import CloseModalIcon from '../../../assets/icons/flow_icons/CloseModalIcon';
import Edit from '../../../assets/icons/application/EditV2';
import Trash from '../../../assets/icons/application/Trash';
import { apiGetAllFieldsList } from '../../../axios/apiService/flow.apiService';
import FieldConfiguration from './FieldConfiguration';
import PlusIconBlueNew from '../../../assets/icons/PlusIconBlueNew';
import { DEPENDENCY_HANDLER_STRINGS, FLOW_FIELDS } from './ManageFlowFields.strings';
import { FIELD_TYPES, FIELD_TYPE_KEYS, MANAGE_FLOW_FIELD_INITIAL_STATE, REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from './ManageFlowFields.constants';
import { manageFlowFieldsConfigDataChange, useManageFlowFieldsConfig } from './use_manage_flow_fields_reducer/useManageFlowFieldsReducer';
import Accordion from '../../../components/accordion/Accordion';
import { formatGetFieldsAPIResponse, getFieldsListHeader, getFormattedFieldDetails, updateLoaderStatus } from './ManageFlowFields.utils';
import { normalizer } from '../../../utils/normalizer.utils';
import { deleteField, getFieldDetails } from '../../../axios/apiService/form.apiService';
import DependencyHandler from '../../../components/dependency_handler/DependencyHandler';
import jsUtility, { cloneDeep } from '../../../utils/jsUtility';

function ManageFlowFields(props) {
    const { onCloseClick, flowId } = props;
    const { t } = useTranslation();
    const { state, dispatch } = useManageFlowFieldsConfig();
    const {
        isFieldsLoading,
        fieldsList,
        dependencyData,
        isDependencyModalVisible,
        isDependencyListLoading,
        activeAccordionList = [],
    } = state;
    console.log('state_ManageFlowFields', state, 'activeAccordionList', activeAccordionList);

    const [sortHeaderDetails, setSortHeaderDetails] = useState(getFieldsListHeader());

    const [isModalOpen, setIsModalOpen] = useState(true);
    const [editField, setEditField] = useState(false);

    const metaData = {
        moduleId: flowId,
    };

    const closeManageFlowFields = () => {
        setIsModalOpen(false);
        onCloseClick?.();
    };

    const onCreateHandler = () => {
        dispatch(manageFlowFieldsConfigDataChange({ fieldDetails: MANAGE_FLOW_FIELD_INITIAL_STATE.fieldDetails }));
        setEditField(true);
    };

    const getFields = async (sortData) => {
        try {
            updateLoaderStatus(true);
            const response = await apiGetAllFieldsList({ size: 1000, page: 1, sort_by: 1, sort_field: 'field_name', flow_id: flowId, ...sortData });
            const allFieldsRawData = normalizer(
                response,
                REQUEST_FIELD_KEYS,
                RESPONSE_FIELD_KEYS,
            );
            const formatedResponse = formatGetFieldsAPIResponse(allFieldsRawData, t);
            console.log('formatGetFieldsAPIResponse', formatedResponse);
            dispatch(manageFlowFieldsConfigDataChange({ isFieldsLoading: false, fieldsList: formatedResponse, flowId: flowId }));
            updateLoaderStatus(false);
        } catch (e) {
            updateLoaderStatus(false);
            console.log(e);
        }
    };

    const getFields1 = async (data) => {
        try {
            updateLoaderStatus(true);
            dispatch(manageFlowFieldsConfigDataChange({ isFieldsLoading: true }));
            const response = await getFieldDetails(data);
            const allFieldsRawData = normalizer(
                response,
                REQUEST_FIELD_KEYS,
                RESPONSE_FIELD_KEYS,
            );
            const formattedResponse = getFormattedFieldDetails({ allData: allFieldsRawData, fieldDetails: allFieldsRawData?.fieldDetails, columnDetails: null, t });

            const currentDetails = fieldsList?.find((eachFieldDetails) => eachFieldDetails?.fieldUuid === formattedResponse?.fieldUuid);

            if (!jsUtility.isEmpty(currentDetails?.columns)) {
                dispatch(manageFlowFieldsConfigDataChange({ fieldDetails: { ...formattedResponse, columns: currentDetails?.columns } }));
            } else {
                dispatch(manageFlowFieldsConfigDataChange({ isFieldsLoading: false, fieldDetails: formattedResponse, flowId: flowId }));
            }

            updateLoaderStatus(false);
        } catch (e) {
            dispatch(manageFlowFieldsConfigDataChange({ isFieldsLoading: false }));
            updateLoaderStatus(false);
            console.log(e);
        }
    };

    const onEditClickHandler = (currentFieldDetails) => {
        setEditField(true);
        getFields1({ flow_id: flowId, field_id: currentFieldDetails?._id });
    };

    const closeMffDependencyPopup = () => {
        dispatch(manageFlowFieldsConfigDataChange({ isDependencyModalVisible: false, dependencyData: {} }));
    };

    const onDeleteClickHandler = async (data) => {
        updateLoaderStatus(true);
        deleteField(data)
            .then((response) => {
                console.log('deleteclickresponse', response);
                // dispatch(manageFlowFieldsConfigDataChange({ isDependencyListLoading: false, isDependencyModalVisible: true, dependencyData: response }));
                updateLoaderStatus(false);
                apiGetAllFieldsList({ size: 1000, page: 1, sort_by: 1, flow_id: flowId })
                    .then((response) => {
                        const allFieldsRawData = normalizer(
                            response,
                            REQUEST_FIELD_KEYS,
                            RESPONSE_FIELD_KEYS,
                        );
                        const formatedResponse = formatGetFieldsAPIResponse(allFieldsRawData, t);
                        dispatch(manageFlowFieldsConfigDataChange({ isFieldsLoading: false, fieldsList: formatedResponse, flowId: flowId }));
                        updateLoaderStatus(false);
                    })
                    .catch((err) => {
                        console.log('kjsdjsndjsn', err);
                    });
            })
            .catch((err) => {
                updateLoaderStatus(false);
                console.log('deleteclickerror', err);
                const response = err?.response?.data?.errors?.[0]?.message;
                console.log('njknjsdknjsdnjnds', response);
                dispatch(manageFlowFieldsConfigDataChange({ isDependencyListLoading: false, isDependencyModalVisible: true, dependencyData: response }));
            });
    };

    useEffect(() => {
        getFields();
    }, []);

    const headerContent = (
        <div className={cx(gClasses.PositionRelative, styles.HeaderContainter)}>
            <Title content="Manage Flow Fields" size={ETitleSize.small} className={gClasses.FTwo20GrayV3} />
            <button onClick={closeManageFlowFields} className={styles.CloseIcon}>
                <CloseModalIcon />
            </button>
        </div>
    );

    const onAccordionClick = (field) => {
        const clonedList = cloneDeep(activeAccordionList);
        console.log('onAccordionClick_currentField', field, 'activeAccordionList', activeAccordionList);
        if (field?.fieldType === FIELD_TYPES.TABLE) {
            const index = clonedList?.findIndex((fieldUuid) => fieldUuid === field?.fieldUuid);
            if (index > -1) {
                clonedList.splice(index, 1);
            } else {
                clonedList.push(field?.fieldUuid);
            }
            console.log('onAccordionClick_updatedList', clonedList, 'index', index);
            dispatch(manageFlowFieldsConfigDataChange({ activeAccordionList: clonedList }));
        }
    };

    const excludedFieldTypes = [
        FIELD_TYPES.INFORMATION,
        FIELD_TYPES.DATA_LIST_PROPERTY_PICKER,
        FIELD_TYPES.USER_PROPERTY_PICKER,
    ];

    const updatedFieldsList = [];
    fieldsList?.map((eachFieldDetail) => {
        if (!excludedFieldTypes?.includes(eachFieldDetail?.fieldType)) {
            updatedFieldsList.push(eachFieldDetail);
        }
        return updatedFieldsList;
    });

    const getFieldsList = () => updatedFieldsList?.map((eachField, index) => {
        console.log('sdhabhdsahdghs', eachField);
        return {
            id: `${index},row`,
            component: [
                (
                    <>
                        <Text
                            className={cx(gClasses.FTwo12BlackV21, gClasses.FontWeight500, eachField.fieldType === FIELD_TYPES.TABLE && eachField.label?.length > 63 ? styles.TableWrap
                                : eachField.label?.length > 63 ? styles.TextWrapExtend : styles.TextWrapClass)}
                            content={eachField.label}
                            title={eachField.label}
                        />
                        {activeAccordionList?.includes(eachField?.fieldUuid) &&
                            <div className={gClasses.ML12}>
                                {
                                    eachField.fieldType === FIELD_TYPES.TABLE && (
                                        eachField?.columns?.length > 0 ? (
                                            eachField?.columns?.map((eachColumn) => (
                                                <Text
                                                    className={cx(gClasses.FTwo12BlackV21, gClasses.FontWeight500, gClasses.MT24, styles.FieldNameMaxWidth, gClasses.Ellipsis)}
                                                    content={eachColumn.label}
                                                    title={eachColumn.label}
                                                />
                                            ))
                                        ) : (
                                            <Text
                                                className={cx(gClasses.FTwo12BlackV21, gClasses.FontWeight500, gClasses.MT24)}
                                                content={FLOW_FIELDS(t).NO_FIELDS}
                                            />
                                        )
                                    )
                                }
                            </div>
                        }
                    </>
                ),
                (
                    <>
                        <Text
                            className={cx(gClasses.FTwo12BlackV21, gClasses.FontWeight500)}
                            content={eachField.fieldTypeLabel}
                        />
                        {activeAccordionList?.includes(eachField?.fieldUuid) &&
                            <div>
                                {eachField?.columns?.map((eachColumn) => (
                                    <Text
                                        className={cx(gClasses.FTwo12BlackV21, gClasses.FontWeight500, gClasses.MT24)}
                                        content={eachColumn.fieldTypeLabel}
                                    />
                                ))}
                            </div>
                        }
                    </>
                ),
                (
                        <div className={cx(gClasses.CenterV, gClasses.W100)}>
                            <button
                                className={gClasses.PR16}
                                onClick={null}
                            >
                                <Edit className={styles.EditIcon} onClick={() => onEditClickHandler(eachField)} />
                            </button>
                            <button
                                className={gClasses.PR16}
                                onClick={() => onDeleteClickHandler({ field_uuid: eachField?.fieldUuid, flow_id: flowId, is_global_field: true })}
                            >
                                <Trash />
                            </button>
                            {eachField?.fieldType === FIELD_TYPES.TABLE &&
                                <Accordion
                                    onHeaderClick={() => onAccordionClick(eachField)}
                                    isChildrenVisible={activeAccordionList?.includes(eachField?.fieldUuid)}
                                    iconClassName={styles.ChevronClass}
                                    iconContainerClassName={styles.ChevronContainerClass}
                                    childrenClassName={gClasses.P0}
                                    hideBorder
                                    headerContentClassName={cx(
                                        styles.AccordionHeader,
                                        gClasses.FontWeight500,
                                    )}
                                    headerClassName={cx(gClasses.P0)}
                                />
                            }
                        </div>
                ),
            ],
        };
    });

    const onSortClick = (sortField = 'field_name', sortBy = TableSortOrder.ASC) => {
        const sortOrderAsc = (sortBy === TableSortOrder.ASC);
        const cloneFieldList = cloneDeep(fieldsList).sort((a, b) => {
            const sortField1 = a[sortField].toString().toLowerCase();
            const sortField2 = b[sortField].toString().toLowerCase();

            if (sortField1 < sortField2) {
                return sortOrderAsc ? 1 : -1;
            }
            if (sortField1 > sortField2) {
                return sortOrderAsc ? -1 : 1;
            }
            return 0;
        });
        dispatch(manageFlowFieldsConfigDataChange({ fieldsList: cloneFieldList }));
        const clonedHeaderDetails = cloneDeep(sortHeaderDetails).map((eachHeader) => {
            if (eachHeader?.sortBy === sortField) {
                eachHeader.sortOrder = (sortOrderAsc) ? TableSortOrder.DESC : TableSortOrder.ASC;
            }
            return eachHeader;
        });
        setSortHeaderDetails(clonedHeaderDetails);
    };

    const mainContent = !isFieldsLoading &&
        (
            <div className={styles.MainContent}>
                <div className={cx(styles.ButtonDisplayClassName, gClasses.MB5)}>
                    {/* <Title
                        content={FLOW_FIELDS(t).TITLE}
                        className={cx(gClasses.FTwo16GrayV3, gClasses.MB12)}
                    /> */}
                    <button id={FIELD_TYPE_KEYS.CREATE_FLOW_FIELD_BUTTON_ID} className={gClasses.BlueIconBtn} onClick={onCreateHandler}>
                        <PlusIconBlueNew />
                        <span>{FLOW_FIELDS(t).CREATE_FIELD.TITLE}</span>
                    </button>
                </div>

                <Table
                    scrollableId="flow_fields"
                    headerClass={cx(gClasses.FTwo12BlackV21, gClasses.FontWeight500, styles.Header)}
                    // className={styles.OverFlowInherit}
                    className={styles.AppListTable}
                    header={sortHeaderDetails}
                    data={getFieldsList()}
                    isLoading={false}
                    scrollType={TableScrollType.BODY_SCROLL}
                    widthVariant={TableColumnWidthVariant.CUSTOM}
                    tableVariant={TableVariant.NORMAL}
                    onSortClick={onSortClick}
                />
            </div>
        );

    return (
        <>
            <Modal
                isModalOpen={isModalOpen}
                headerContent={headerContent}
                mainContent={mainContent}
                modalStyle={ModalStyleType.modal}
                customModalClass={styles.ModalWidth}
                modalSize={ModalSize.md}
            />
            {editField &&
                <FieldConfiguration
                    onCloseClick={setEditField}
                    metaData={metaData}
                />
            }

            {isDependencyModalVisible &&
                <DependencyHandler
                    onDeleteClick={onDeleteClickHandler}
                    onCancelDeleteClick={closeMffDependencyPopup}
                    dependencyHeaderTitle={DEPENDENCY_HANDLER_STRINGS(t).TITLE}
                    dependencyData={dependencyData}
                    isDependencyListLoading={isDependencyListLoading}
                />
            }
        </>
    );
}

export default ManageFlowFields;
