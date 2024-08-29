import React, { useEffect, useState } from 'react';
import {
    Label,
    Text,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import style from '../FlowDetails.module.scss';
import { FLOW_CONSTANTS } from '../../FlowLanding.constant';
import { somethingWentWrongErrorToast } from '../../../../../utils/UtilityFunctions';
import { getFlowSummaryInfoApi } from '../../../../../axios/apiService/flow.apiService';
import UserPicker from '../../../../../components/user_picker/UserPicker';

const NO_DATA = '-';

function FlowSummary(props) {
    const {
        metaData,
    } = props;
    const { t } = useTranslation();
    const { DATALIST_SUMMARY } = FLOW_CONSTANTS(t);
    const [summaryData, setSummaryData] = useState({ data: {}, isLoading: false });
    const { isLoading, data: summary } = summaryData;

    useEffect(() => {
        if (!metaData?.flowId) return;

        setSummaryData({ data: {}, isLoading: true });
        const params = { flow_id: metaData?.flowId };
        getFlowSummaryInfoApi(params).then((data) => {
            console.log('xyz data', data);
            setSummaryData({ data, isLoading: false });
        }).catch((err) => {
            console.error('xyz error', err);
            setSummaryData({ data: {}, isLoading: false });
            somethingWentWrongErrorToast();
        });
    }, [metaData.flowId]);

    return (
        <div>
            <div>
                <div className={cx(gClasses.DisplayFlex, gClasses.FlexWrap, style.SummarySubContainer, gClasses.MT16)}>
                    <div>
                        <Label labelName={DATALIST_SUMMARY.NAME} innerLabelClass={gClasses.MB0} isLoading={isLoading} />
                        <Text content={summary?.flowName} className={gClasses.FTwo13Black18} isLoading={isLoading} />
                    </div>
                    <div>
                        <Label labelName={DATALIST_SUMMARY.DESCRIPTION} innerLabelClass={gClasses.MB0} isLoading={isLoading} />
                        <Text content={summary?.flowDescription || NO_DATA} className={gClasses.FTwo13Black18} isLoading={isLoading} />
                    </div>
                </div>
                <div className={cx(gClasses.DisplayFlex, gClasses.FlexWrap, style.SummarySubContainer, gClasses.MT16)}>
                    <UserPicker
                    labelText={DATALIST_SUMMARY.DEV_OR_ADMIN}
                    labelClassName={gClasses.FTwo12BlackV20}
                    selectedValue={summary.security?.admins}
                    maxCountLimit={2}
                    buttonClassName={gClasses.DisplayNone}
                    className={gClasses.NoPointerEvent}
                    disabled
                    isLoading={isLoading}
                    />
                    <UserPicker
                    labelText={DATALIST_SUMMARY.BUSINESS_OR_DATA_MANAGER}
                    labelClassName={gClasses.FTwo12BlackV20}
                    selectedValue={summary.security?.owners}
                    maxCountLimit={2}
                    buttonClassName={gClasses.DisplayNone}
                    className={gClasses.NoPointerEvent}
                    disabled
                    isLoading={isLoading}
                    />
                </div>
            </div>
            {/* <DependentApps /> */}
        </div>
    );
}

export default FlowSummary;

FlowSummary.propTypes = {
    isBasicInfoLoading: PropTypes.bool,
    dataListID: PropTypes.string,
};
