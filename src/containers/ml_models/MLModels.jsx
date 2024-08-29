import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  ML_MODELS,
  ML_MODEL_DETAIL,
} from '../../urls/RouteConstants';
import jsUtility from '../../utils/jsUtility';
import ModelList from './model_list/ModelList';
import { routeNavigate, getDevRoutePath } from '../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../utils/Constants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function MLModels() {
  const history = useHistory();

  useEffect(() => {
  }, []);

  const handleRowItemClick = (modelcode) => {
    console.log('modelcode, model_id', modelcode);
    if (!jsUtility.isEmpty(modelcode)) {
      const modedlState = {
        model_code: modelcode.model_code,
        model_id: modelcode.model_id,
      };
      const pathname = getDevRoutePath(`${ML_MODELS}/${ML_MODEL_DETAIL}/${modelcode.model_code}`);
      routeNavigate(history, ROUTE_METHOD.PUSH, pathname, EMPTY_STRING, modedlState, true);
    }
  };

  return (
    <div>
      <ModelList handleCardClick={handleRowItemClick} />
    </div>
  );
}

export default MLModels;
