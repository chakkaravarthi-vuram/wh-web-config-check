import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { Table, TableVariant, Text, TableColumnWidthVariant } from '@workhall-pvt-lmt/wh-ui-library';
import { FLOW_SECURITY_CONSTANTS } from './FlowSecurity.strings';
import gClasses from '../../../../../scss/Typography.module.scss';
import styles from './FlowSecurity.module.scss';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';

function SecuritySummary() {
    const { t } = useTranslation();

    const getTableRowText = (dataText) => <Text content={dataText} className={cx(gClasses.FTwo12BlackV18, gClasses.FontWeight500)} />;

    // Sample Data for Dependant Apps Tables
    const DependantData = [
        { component: [getTableRowText('Design Team'), getTableRowText('Special Data Access Privilege'), getTableRowText('Full Access'), getTableRowText('No'), getTableRowText('No'), getTableRowText('No')], id: EMPTY_STRING },
        { component: [getTableRowText('UI Team'), getTableRowText('Special Data Access Privilege'), getTableRowText('Full Access'), getTableRowText('No'), getTableRowText('No'), getTableRowText('Full Access')], id: EMPTY_STRING },
    ];

    return (
        <div className={gClasses.MT24}>
            <Text
                content={FLOW_SECURITY_CONSTANTS(t).SECURITY_SUMMARY.TITLE}
                className={cx(gClasses.FTwo16GrayV3, gClasses.FontWeight500, gClasses.MB16)}
            />
            <Table
                tableClassName={styles.TableSecuritySummary}
                header={FLOW_SECURITY_CONSTANTS(t).SECURITY_SUMMARY.HEADERS}
                data={DependantData}
                widthVariant={TableColumnWidthVariant.CUSTOM}
                tableVariant={TableVariant.NORMAL}
            />
        </div>
    );
}

export default SecuritySummary;
