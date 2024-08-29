import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Breadcrumb } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import ThemeContext from '../../../hoc/ThemeContext';
import gClasses from '../../../scss/Typography.module.scss';
import ModelDetailsHeader from './model_details_header/ModelDetailsHeader';
import { MODEL_DETAIL_TAB_INDEX_CONSTANTS } from '../MlModels.constants';
import { isBasicUserMode, routeNavigate, getDevRoutePath } from '../../../utils/UtilityFunctions';
import ModelCard from './model_card/ModelCard';
import TryItYourself from './try_it_yourself/TryItYourself';
import ModelUsedIn from './model_used_in_list/ModelsUsedInList';
import styles from './ModelDetails.module.scss';
import { getMLModelsBreadcrumb } from '../MLModels.utils';
import { getModelDetailsThunk } from '../../../redux/actions/MlModelList.Action';
import { ROUTE_METHOD, RESPONSE_TYPE } from '../../../utils/Constants';
import * as ROUTE_CONSTANTS from '../../../urls/RouteConstants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import ResponseHandler from '../../../components/response_handlers/ResponseHandler';

function ModelDetails(props) {
  const location = useLocation();
  const {
    getModelDetailsThunkApi,
    modelData,
    isModelDetailLoading,
    model_details_error,
  } = props;
  console.log(props, 'ModelDetails');
  const [tabIndex, setTabIndex] = useState(1);

  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);

  const selectedModelCode = location?.state?.model_code;
  const model_id = location?.state?.model_id;

  useEffect(() => {
  const modelIdList = history?.location?.pathname?.split('/');
  const modelCode = modelIdList[modelIdList.length - 1];
    if (selectedModelCode || modelCode) {
      const params = {
        model_code: selectedModelCode || modelCode,
      };
      getModelDetailsThunkApi(params);
    }
  }, []);

  // get current Team Detail Tab
  const getCurrentTab = () => {
    let currentTab;
    switch (tabIndex) {
      case MODEL_DETAIL_TAB_INDEX_CONSTANTS.MODEL_DETAILS:
        currentTab = model_details_error ?
        <ResponseHandler
        className={cx(gClasses.MT50)}
        messageObject={{
          type: RESPONSE_TYPE.SERVER_ERROR,
          title: 'Something went wrong!',
          subTitle: 'Please try again.',
        }}
        />
        : (
          <ModelCard modelData={modelData} isModelDetailLoading={isModelDetailLoading} />
        );
        break;
      case MODEL_DETAIL_TAB_INDEX_CONSTANTS.TRY_IT_YOURSELF:
        currentTab = (
          <TryItYourself selectedModelCode={selectedModelCode} />
        );
        break;
      case MODEL_DETAIL_TAB_INDEX_CONSTANTS.MODEL_USED_IN:
        currentTab = (
          <ModelUsedIn selectedModelCode={model_id} />
        );
        break;
      default:
        break;
    }
    return currentTab;
  };

  // Breadcrumb link click
  const handleBreadCrumb = () => {
    routeNavigate(history, ROUTE_METHOD.PUSH, getDevRoutePath(`${ROUTE_CONSTANTS.ML_MODELS}`), EMPTY_STRING, {}, true);
  };

  const onTabChange = (value) => {
    setTabIndex(value);
  };

  // Header
  const headerComponent = (
    <>
     <div>
     <Breadcrumb
        list={getMLModelsBreadcrumb(modelData?.model_name, history)}
        preventNavigation
        handleLinkClick={handleBreadCrumb}
        colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
        isLoading={isModelDetailLoading}
     />
     </div>
      <div>
        <ModelDetailsHeader
          onTabHandler={onTabChange}
          disabled={!modelData}
        />
        <hr />
      </div>
    </>
  );

  return (
    <div className={gClasses.P24}>
      {headerComponent}
      <div className={styles.ModelDetailsContainer}>
        {getCurrentTab()}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    modelData: state.MlModelListReducer.modelData,
    isModelDetailLoading: state.MlModelListReducer.isModelDetailLoading,
    model_details_error: state.MlModelListReducer.model_details_error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
      dispatch,
      getModelDetailsThunkApi: (params) => {
          dispatch(getModelDetailsThunk(params));
      },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModelDetails);
