import React, { useState } from 'react';
import { Text, NestedDropdown, DropdownList } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { SEND_DATA_TO_DL_CONFIG_CONSTANTS } from '../../SendDataToDl.string';
import styles from '../../SendDataToDl.module.scss';
import RightMultiNavigateIcon from '../../../../../../../assets/icons/RightMultiNavigateIcon';
import LeftDirArrowIcon from '../../../../../../../assets/icons/app_builder_icons/LeftDirArrow';
import { MOCKDATA_CREATE_UPDATE_FLOW_FIELDS, MOCKDATA_STATIC_FIELDS } from '../../SendDataToDl.constants';
import jsUtility from '../../../../../../../utils/jsUtility';

function CreateEntryRow(props) {
    const { t } = useTranslation();
    const { ID } = SEND_DATA_TO_DL_CONFIG_CONSTANTS(t);
    const {
        valueInitialOptions,
        headerArray,
        rowContent = [{
            fieldName: 'field 1',
            fieldType: 'Single line text',
            valuePassed: 'User Field List',
            valueType: 'Flow Fields',
        }, {
            fieldName: 'field 2',
            fieldType: 'Number',
            valuePassed: 'User Field List',
            valueType: 'Flow Fields',
        }],
    } = props;
    const [rowData, setRowData] = useState(rowContent);

    const getInitialView = (onNextView, index) => (
        <div>
            <DropdownList
                optionList={valueInitialOptions}
                customDropdownListView={
                    (option) => (
                        <button
                            className={cx(styles.ViewContainer, gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.W100, gClasses.PX12, gClasses.PY10)}
                            onClick={() => {
                                const rowDetail = jsUtility.cloneDeep(rowData);
                                rowDetail[index].valueType = option?.value;
                                setRowData(rowDetail);
                                onNextView();
                            }}
                        >
                            <div className={cx(gClasses.FTwo13, styles.FlowOrDlLabel)}>{option.label}</div>
                            <RightMultiNavigateIcon />
                        </button>
                    )
                }
                className={gClasses.Zindex1}
            />
        </div>
    );

    const getFlowFields = (onPreviousView, close, index) => (
        <div className={styles.SecondNestedView}>
            <button className={cx(gClasses.PX12, gClasses.PY10, gClasses.CenterV)} onClick={onPreviousView}>
                <LeftDirArrowIcon className={gClasses.MR5} fill="#959BA3" />
                <Text content={rowData[index].valueType} />
            </button>
            <DropdownList
                className={styles.Dropdown}
                optionList={rowData[index].valueType === ID.FLOW_FIELDS ? MOCKDATA_CREATE_UPDATE_FLOW_FIELDS : MOCKDATA_STATIC_FIELDS}
                onClick={(value) => {
                    const rowDetail = jsUtility.cloneDeep(rowData);
                    rowDetail[index].valuePassed = value;
                    setRowData(rowDetail);
                    close();
                }}
                selectedValue={rowData[index].valuePassed}
            />
        </div>
    );

    return (
        <>
            <div className={cx(styles.CreateEntryContainer, gClasses.PX16, gClasses.PB4)}>
                {headerArray?.map((header) => (
                    <div key={header}>
                        <Text content={header} className={cx(gClasses.FTwo12BlackV18, gClasses.FontWeight500)} />
                    </div>
                ))}
            </div>
            {rowData?.map((row, index) => (
                <div className={cx(styles.CreateEntryContainer, gClasses.PX16, gClasses.PY8, gClasses.CenterV)}>
                    <div>
                        <Text
                            content={row?.fieldName}
                            className={gClasses.FTwo12BlackV18}
                        />
                    </div>
                    <div>
                        <Text
                            content={row?.fieldType}
                            className={gClasses.FTwo12BlackV18}
                        />
                    </div>
                    <div>
                        <NestedDropdown
                            displayText={row?.valuePassed}
                            totalViews={2}
                        >
                            {({ close, view, nextView: onNextView, prevView: onPreviousView }) => {
                                switch (view) {
                                    case 1: return getInitialView(onNextView, index);
                                    case 2: return getFlowFields(onPreviousView, close, index);
                                    default: return null;
                                }
                            }}
                        </NestedDropdown>
                    </div>
                </div>))
            }
        </>
    );
}

export default CreateEntryRow;
