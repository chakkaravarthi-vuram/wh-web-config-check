import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Identifier from './identifier/Identifier';
import TechnicalConfiguration from './technical_configuration/TechnicalConfiguration';
import { getDataListAddOnInfoApi } from '../../../../../axios/apiService/dataList.apiService';
import { setPointerEvent, somethingWentWrongErrorToast } from '../../../../../utils/UtilityFunctions';

function DatalistAddOn(props) {
    const { dataListID } = props;

    const [dataListAddOnInfo, setDataListAddOnInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (dataListID) {
            const params = {
                data_list_id: dataListID,
            };
            // loaders to prevent user interacion when api is called
            setIsLoading(true);
            setPointerEvent(true);

            getDataListAddOnInfoApi(params).then((data) => {
                setDataListAddOnInfo(data);
            }).catch((err) => {
                console.log('dl addOn info err', err);
                somethingWentWrongErrorToast();
            }).finally(() => {
                // loaders reset
                setIsLoading(false);
                setPointerEvent(false);
            });
        }
    }, [dataListID]);

    return (
        <div>
            {/* comments - Destructure and use the variables here */}
            <Identifier isLoading={isLoading} dataListAddOnInfo={dataListAddOnInfo} />
            <TechnicalConfiguration isLoading={isLoading} shortCode={dataListAddOnInfo?.dataListShortCode} technicalReferenceName={dataListAddOnInfo?.technicalReferenceName} />
        </div>
    );
}

export default DatalistAddOn;

DatalistAddOn.propTypes = {
    dataListID: PropTypes.string,
};
