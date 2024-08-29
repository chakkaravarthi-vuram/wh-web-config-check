import React, { useEffect, useState } from 'react';
import {
    Label,
    Text,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import style from '../DatalistDetails.module.scss';
import { DATALISTS_CONSTANTS } from '../../DatalistsLanding.constant';
import { getDataListSummaryInfo } from '../../../../../axios/apiService/dataList.apiService';
import { setPointerEvent, somethingWentWrongErrorToast } from '../../../../../utils/UtilityFunctions';
import jsUtility from '../../../../../utils/jsUtility';
import UserPicker from '../../../../../components/user_picker/UserPicker';

function DatalistSummary(props) {
    const {
        isBasicInfoLoading,
        dataListID,
    } = props;
    const { t } = useTranslation();
    const [datalistDetails, setDatalistDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const NO_DATA = '-';

    const { DATALIST_SUMMARY } = DATALISTS_CONSTANTS(t);

    useEffect(() => {
        if (dataListID) {
            // loaders to prevent user interacion when api is called
            setPointerEvent(true);
            setIsLoading(true);
            if (!isBasicInfoLoading) {
                const params = { data_list_id: dataListID };
                getDataListSummaryInfo(params).then((data) => {
                    // comments - destructuring the data & why handled empty for DL desc?? to check on the null Handling

                    setDatalistDetails({
                        dataListName: !jsUtility.isEmpty(data?.dataListName) ? data?.dataListName : NO_DATA,
                        dataListDescription: !jsUtility.isEmpty(data?.dataListDescription) ? data?.dataListDescription : NO_DATA,
                        dataListAdmins: data?.security?.admins,
                        dataListOwners: data?.security?.owners,
                    });
                }).catch((err) => {
                    console.log('dl summary err', err);
                    somethingWentWrongErrorToast();
                }).finally(() => {
                    // loaders reset
                    setPointerEvent(false);
                    setIsLoading(false);
                });
            }
        }
    }, [isBasicInfoLoading]);

    return (
        <div>
            <div>
                <div className={cx(gClasses.DisplayFlex, gClasses.FlexWrap, style.SummarySubContainer, gClasses.MT16)}>
                    <div>
                        <Label labelName={DATALIST_SUMMARY.NAME} innerLabelClass={gClasses.MB0} isLoading={isLoading} />
                        <Text content={datalistDetails?.dataListName || NO_DATA} className={gClasses.FTwo13Black18} isLoading={isLoading} />
                    </div>
                    <div>
                        <Label labelName={DATALIST_SUMMARY.DESCRIPTION} innerLabelClass={gClasses.MB0} isLoading={isLoading} />
                        <Text content={datalistDetails?.dataListDescription || NO_DATA} className={gClasses.FTwo13Black18} isLoading={isLoading} />
                    </div>
                </div>
                <div className={cx(gClasses.DisplayFlex, gClasses.FlexWrap, style.SummarySubContainer, gClasses.MT16)}>
                    <UserPicker
                    labelText={DATALIST_SUMMARY.DEV_OR_ADMIN}
                    labelClassName={gClasses.FTwo12BlackV20}
                    selectedValue={datalistDetails?.dataListAdmins}
                    maxCountLimit={2}
                    disabled
                    buttonClassName={gClasses.DisplayNone}
                    isLoading={isLoading}
                    />
                    <UserPicker
                    labelText={DATALIST_SUMMARY.BUSINESS_OR_DATA_MANAGER}
                    labelClassName={gClasses.FTwo12BlackV20}
                    selectedValue={datalistDetails?.dataListOwners}
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

export default DatalistSummary;

DatalistSummary.propTypes = {
    isBasicInfoLoading: PropTypes.bool,
    dataListID: PropTypes.string,
};
