import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Identifier from './identifier/Identifier';
import TechnicalConfiguration from './technical_configuration/TechnicalConfiguration';
import { setPointerEvent, somethingWentWrongErrorToast } from '../../../../../utils/UtilityFunctions';
import { getFlowAddOnInfoApi } from '../../../../../axios/apiService/flow.apiService';
import Translation from './translation/Translation';

function FlowAddOn(props) {
    const { metaData } = props;
    const [addOnData, setAddOnData] = useState({ isLoading: false, data: {} });
    const { isLoading, data: addOn } = addOnData;

    useEffect(() => {
        if (!metaData.flowId) return;

        const params = { flow_id: metaData.flowId };
        setAddOnData({ isLoading: true, data: {} });
        setPointerEvent(true);

        getFlowAddOnInfoApi(params).then((data) => {
            console.log('xyz data', data);
            setAddOnData({ isLoading: false, data: data });
        }).catch((err) => {
            console.error('xyz err', err);
            setAddOnData({ isLoading: false, data: {} });
            somethingWentWrongErrorToast();
        }).finally(() => {
            setPointerEvent(false);
        });
    }, [metaData.flowId]);

    return (
      <div>
        <Identifier
          isLoading={isLoading}
          isSystemIdentifier={addOn?.isSystemIdentifier}
          customIdentifier={addOn?.customIdentifier}
          taskIdentifier={addOn?.taskIdentifier || []}
          categoryName={addOn?.categoryName}
        />
        <TechnicalConfiguration
          isLoading={isLoading}
          shortCode={addOn?.flowShortCode}
          technicalReferenceName={addOn?.technicalReferenceName || '-'}
        />
        <Translation
          isLoading={isLoading}
          translation={addOn.translation_status || {}}
        />
      </div>
    );
}

export default FlowAddOn;

FlowAddOn.propTypes = {
    dataListID: PropTypes.string,
};
