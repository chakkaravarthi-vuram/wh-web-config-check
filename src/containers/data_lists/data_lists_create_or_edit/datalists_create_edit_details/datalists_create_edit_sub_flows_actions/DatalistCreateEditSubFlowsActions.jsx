import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import {
    Title,
    ETitleSize,
    TableWithPagination,
    TableColumnWidthVariant,
    Text,
    UserPicker,
    Button,
    EButtonSizeType,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import styles from '../../DatalistsCreateEdit.module.scss';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { DATALIST_SUMMARY_USER } from '../../../data_list_landing/DatalistsLanding.mockdata';
import Edit from '../../../../../assets/icons/application/EditV2';
import Trash from '../../../../../assets/icons/application/Trash';
import Plus from '../../../../../assets/icons/configuration_rule_builder/Plus';
import { DATALISTS_CREATE_EDIT_CONSTANTS } from '../../DatalistsCreateEdit.constant';

function DatalistCreateEditSubFlowActions() {
    const { t } = useTranslation();
    const {
        SUB_FLOW_ACTIONS: {
            SUB_FLOW_TRIGGER_BY_USER,
            SUB_FLOW_HEADER,
            ADD_SUB_FLOW,
            AUTOMATED_SYSTEM_ACTIONS,
            AUTOMATED_HEADER,
            ADD_AUTOMATED_SYSTEMS,
        },
    } = DATALISTS_CREATE_EDIT_CONSTANTS(t);
    const getTableRowText = (dataText) => <Text content={dataText} className={cx(gClasses.FTwo12BlackV18, gClasses.FontWeight500)} />;

    // Sample Data for Subflows to be triggered by User
    const userpickerSampleData = (
        <UserPicker
            isSearchable
            disabled
            required
            selectedValue={DATALIST_SUMMARY_USER}
            maxCountLimit={3}
            className={gClasses.MT5}
            hideLabel
            hideAddText
        />
    );

    const editDeleteActions = () => (
        <div className={cx(gClasses.CenterV, styles.TableButtons, gClasses.JusEnd)}>
            <Button
                icon={<Edit className={styles.EditIcon} />}
                size={EButtonSizeType.SM}
                iconOnly
                type={EMPTY_STRING}
                className={styles.ButtonContainer}
            />
            <Button
                icon={<Trash />}
                size={EButtonSizeType.SM}
                iconOnly
                type={EMPTY_STRING}
                className={styles.ButtonContainer}
            />
        </div>
    );

    const triggeredData = [
        { component: [getTableRowText('Name'), getTableRowText('Scheduled & Recurring trigger'), userpickerSampleData, editDeleteActions()], id: EMPTY_STRING },
        { component: [getTableRowText('Trigger'), getTableRowText('Scheduled & Recurring trigger'), userpickerSampleData, editDeleteActions()], id: EMPTY_STRING },
    ];

    const automatedData = [
        { component: [getTableRowText('Scheduled & Recurring trigger'), getTableRowText('Data matches'), getTableRowText('Initiate a flow'), getTableRowText('Month'), editDeleteActions()], id: EMPTY_STRING },
        { component: [getTableRowText('Scheduled & Recurring trigger'), getTableRowText('All Datalist'), getTableRowText('Initiate a flow'), getTableRowText('Month'), editDeleteActions()], id: EMPTY_STRING },
    ];

    return (
        <div className={cx(gClasses.P24)}>
            <div className={gClasses.MB24}>
                <Title content={SUB_FLOW_TRIGGER_BY_USER} size={ETitleSize.xs} className={cx(gClasses.GrayV3, gClasses.MB8)} />
                <TableWithPagination
                    tableClassName={styles.TableSubflowAction}
                    header={[{ label: SUB_FLOW_HEADER.SUB_FLOW_NAME }, { label: SUB_FLOW_HEADER.TRIGGER_LABEL }, { label: SUB_FLOW_HEADER.PERMISION }, { label: EMPTY_STRING }]}
                    data={triggeredData}
                    widthVariant={TableColumnWidthVariant.CUSTOM}
                />
                <button className={cx(gClasses.FTwo13BlueV39, gClasses.FontWeight500, gClasses.MT12)}>
                    <Plus className={gClasses.MR8} />
                    {ADD_SUB_FLOW}
                </button>
            </div>
            <div className={gClasses.MB24}>
                <Title content={AUTOMATED_SYSTEM_ACTIONS} size={ETitleSize.xs} className={cx(gClasses.GrayV3, gClasses.MB8)} />
                <TableWithPagination
                    tableClassName={styles.TableSubflowAction}
                    header={[{ label: AUTOMATED_HEADER.ACTION_TYPER, widthWeight: 3 }, { label: AUTOMATED_HEADER.TRIGGER_DATA, widthWeight: 2 }, { label: AUTOMATED_HEADER.SYSTEM_ACTION, widthWeight: 2 }, { label: AUTOMATED_HEADER.FREQUENCY }, { label: EMPTY_STRING }]}
                    data={automatedData}
                    widthVariant={TableColumnWidthVariant.CUSTOM}
                />
                <button className={cx(gClasses.FTwo13BlueV39, gClasses.FontWeight500, gClasses.MT12)}>
                    <Plus className={gClasses.MR8} />
                    {ADD_AUTOMATED_SYSTEMS}
                </button>
            </div>
        </div>
    );
}

export default DatalistCreateEditSubFlowActions;
