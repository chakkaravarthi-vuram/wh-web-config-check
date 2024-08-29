import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import DatalistDetails from './datalist_details/DatalistDetails';
import DatalistHeader from './datalist_header/DatalistsHeader';
import { getDataListBasicInfo } from '../../../axios/apiService/dataList.apiService';
import { setPointerEvent, somethingWentWrongErrorToast } from '../../../utils/UtilityFunctions';
import { DATALISTS_CONSTANTS, DATALIST_HEADER_TYPE } from './DatalistsLanding.constant';
import PageNotFound from '../../error_pages/PageNotFound';

function DatalistLanding() {
    // comments - Handle url as well listing route
    const params = useParams();

    const dataListUUID = params?.uuid;
    const currentTab = Object.values(DATALIST_HEADER_TYPE).includes(params?.datalistInstanceId) ? params.datalistInstanceId : DATALIST_HEADER_TYPE.SUMMARY;
    const { t } = useTranslation();

    const [landingPageData, setLandingPageData] = useState({});
    const [isBasicInfoLoading, setIsBasicInfoLoading] = useState(true);

    const getDataListBasicInfoApiCall = (status = DATALISTS_CONSTANTS(t).PUBLISHED) => {
        // loaders to prevent user interacion when api is called
        setPointerEvent(true);
        const params = { data_list_uuid: dataListUUID };
        params.status = status;
        getDataListBasicInfo(params).then((data) => {
            // loader reset
            setIsBasicInfoLoading(false);
            setLandingPageData(data);
        }).catch((err) => {
            console.log('dl landing err', err);
            const errorType = err?.response?.data?.errors?.[0]?.type;
            const errorField = err?.response?.data?.errors?.[0]?.field;
            if (errorType === 'not_exist' || errorField === 'data_list_uuid') {
                setLandingPageData('invalid');
            }
            somethingWentWrongErrorToast();
        }).finally(() => {
            // loader reset
            setPointerEvent(false);
        });
    };

    useEffect(() => {
        getDataListBasicInfoApiCall();
    }, []);

    const onToggleHandler = (status) => {
        setIsBasicInfoLoading(true);
        getDataListBasicInfoApiCall(status);
    };

    if (landingPageData === 'invalid') {
        return <PageNotFound />;
    }

    return (
        <div>
            {/* comments - use metadata and pass the DL related data into it */}
            <DatalistHeader isBasicInfoLoading={isBasicInfoLoading} landingPageData={landingPageData} currentTab={currentTab} onToggle={onToggleHandler} />
            <DatalistDetails isBasicInfoLoading={isBasicInfoLoading} dataListID={landingPageData?.id} currentTab={currentTab} dataListUUID={dataListUUID} dataListName={landingPageData?.dataListName} />
        </div>
    );
}

export default DatalistLanding;

DatalistLanding.propTypes = {
    dataListUUID: PropTypes.string,
};
