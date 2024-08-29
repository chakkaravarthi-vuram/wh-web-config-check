import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  Button,
  EButtonType,
  EButtonSizeType,
  Text,
  ETextSize,
  WorkHallPageLoader,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { useHistory } from 'react-router-dom';
import gClasses from '../../../../scss/Typography.module.scss';
import { BS } from '../../../../utils/UIConstants';
import InputComponent from '../input_types';
import styles from '../ModelDetails.module.scss';
import { ML_MODELS, MODEL_DETAIL_RESULT_TAB_INDEX_CONSTANTS } from '../../MlModels.constants';
import ModelResultHeader from '../model_result/model_result_header/ModelResultHeader';
import OutputComponent from '../output_types';
import RawData from '../model_result/raw_data/RawData';
import { getMLModelOutputResponseThunk, updateMlModelDetailStarted } from '../../../../redux/actions/MlModelList.Action';
import ThemeContext from '../../../../hoc/ThemeContext';
import { getTempUploadSignedUrlApi } from '../../../../axios/apiService/userProfile.apiService';
import { getFieldsForDMS } from '../../../../utils/attachmentUtils';
import { appendFormDataArrayOrObject, isBasicUserMode, validate } from '../../../../utils/UtilityFunctions';
import { setPointerEvent, updatePostLoader } from '../../../../utils/loaderUtils';
import { ML_MODEL_STRINGS } from '../../MLModels.strings';
import MlModelValidateSchema from '../../MLModels.validation.schema';
import jsUtility, { isEmpty } from '../../../../utils/jsUtility';
import { capitalizeFirstLetter } from '../../MLModels.utils';
import ErrorDisplay from '../../../edit_flow/ErrorDisplay';
import FullPageLoader from '../../../../assets/icons/FullPageLoader';

function TryItYourself(props) {
  const { modelData, getOutputModelResponse, resetOutputModelResponse, isDataLoadingOnTryIt, mlModelReducer } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const { TRY_WITH_YOUR_OWN_DATA, RESULT_TAB, BUTTON_TEXTS } = ML_MODEL_STRINGS(t).MODEL_DETAILS;
  const [selectedSample, setSelectedSample] = useState(modelData?.samples[0]);
  const { colorSchemeDefault } = useContext(ThemeContext);
  const [resultTabIndex, setResultTabIndex] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [isClearData, setIsClearData] = useState(false);
  const [requestBody, setRequestBody] = useState({});
  const [errorBody, setErrorBody] = useState({});
  const { colorScheme } = useContext(ThemeContext);
  const isBasicUser = isBasicUserMode(history);
  const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;

  let sampleButtonGroupComponent = null;

  const onSampleClick = (sample, isTryIt) => {
    setShowResult(false);
    if (isTryIt) {
      setSelectedSample({ ...modelData?.playground, isTryIt: isTryIt });
    } else {
      setSelectedSample({ ...sample, isTryIt: isTryIt });
    }
    setRequestBody({});
    setErrorBody({});
    setIsClearData(false);
  };

  const getOutputModelResponseHandler = (errors, params) => {
    if (jsUtility.isEmpty(errors)) {
      getOutputModelResponse(params);
      setShowResult(true);
      setResultTabIndex(1);
      setErrorBody({});
    } else {
      setShowResult(false);
    }
  };

  const uploadDocumentToDMS = (fileArray, fileObj, params) => {
    let resData;
    fileArray.forEach((data) => {
      const postData = getFieldsForDMS(data.upload_signed_url.fields, fileObj);
      axios
        .post(data.upload_signed_url.url, appendFormDataArrayOrObject(postData))
        .then((response) => {
          resData = response;
          getOutputModelResponseHandler({}, params);
          setPointerEvent(false);
          updatePostLoader(false);
        })
        .catch(() => {
          setPointerEvent(false);
          updatePostLoader(false);
        });
    });
    setPointerEvent(false);
    updatePostLoader(false);
    return resData;
  };

  const onTryItClick = () => {
    let params = {};
    let errors = {};
    if (selectedSample?.isTryIt) {
      errors = {};
      // Commented validation
      // selectedSample?.input_components.map((item) => {
      //   item?.components.map((component) => {
      //     if (component?.is_required && !requestBody[component.key]) {
      //       setErrorBody({ ...errorBody, [component.key]: 'This field should not be empty.' });
      //       errors = { ...errors, [component.key]: 'This field should not be empty.' };
      //     } else {
      //       setErrorBody({ ...errorBody, [component.key]: undefined });
      //       errors = { ...errors, [component.key]: undefined };
      //     }
      //     return component;
      //   });
      //   return item;
      // });
      if (modelData?.model_code === ML_MODELS.TEXT_SENTIMENT_ANALYSIS) {
        params = {
          ...requestBody,
          model_code: modelData?.model_code,
          is_playground_check: true,
          is_sample: !selectedSample?.isTryIt,
        };

        modelData.events.body.forEach((file) => {
          const errorList = validate(params, MlModelValidateSchema(file?.key, file?.validations));
          if (errorList) {
            Object.keys(errorList).forEach((key) => {
              let value = errorList[key];
              if (value !== null && value !== undefined && value !== '') {
                value = capitalizeFirstLetter(value.trim());
                errorList[key] = value;
              }
            });
          }
          setErrorBody({ ...errorBody, errorList });
          if (!jsUtility.isEmpty(errorList)) {
            errors = { errorList };
          }
        });
        getOutputModelResponseHandler(errors, params);
      } else {
        const documentParams = {
          file_metadata: requestBody?.fileData?.file_metadata,
          entity_id: requestBody?.fileData?.entity_id,
        };
        params = {
          model_code: modelData?.model_code,
          is_playground_check: true,
          is_sample: !selectedSample?.isTryIt,
        };
        if (jsUtility.isEmpty(requestBody?.fileData)) {
                    modelData.events.body.forEach((file) => {
                        const errorList = validate(params, MlModelValidateSchema(file?.key === 'document_id' ? 'Document' : file?.key, file?.validations));
            setErrorBody({ ...errorBody, errorList });
            if (!jsUtility.isEmpty(errorList)) {
              errors = { errorList };
            }
          });
        }
        if (jsUtility.isEmpty(errors)) {
          setShowResult(true);
          getTempUploadSignedUrlApi(documentParams).then(
            (response) => {
              response?.file_metadata?.forEach((file) => {
                params.document_id = file._id;
              });
              uploadDocumentToDMS(
                response.file_metadata,
                requestBody?.fileData?.fileObject,
                params,
              );
            });
        }
      }
    } else {
      params = {
        model_code: modelData?.model_code,
        is_playground_check: true,
        is_sample: !selectedSample?.isTryIt,
        sample_name: selectedSample?.name,
      };
      getOutputModelResponseHandler(errors, params);
    }
  };

  const onClearClick = () => {
    resetOutputModelResponse();
    setShowResult(false);
    setRequestBody({});
    setErrorBody({});
    setIsClearData(true);
  };

  sampleButtonGroupComponent = (
    <div className={cx(BS.D_FLEX, BS.FLEX_WRAP_WRAP, gClasses.MT24)}>
      {modelData?.samples?.map((item) => (
        <Button
          buttonText={item?.name}
          size={EButtonSizeType.MD}
          onClickHandler={() => onSampleClick(item, false)}
          type={selectedSample.name === item?.name && !selectedSample.isTryIt ? EButtonType.PRIMARY : EButtonType.SECONDARY}
          className={styles.ButtonClass}
          colorSchema={colorSchemeDefault}
        />
      ))}

      <Button
        id="try_it"
        buttonText={TRY_WITH_YOUR_OWN_DATA}
        size={EButtonSizeType.MD}
        onClickHandler={() => onSampleClick(modelData?.playground, true)}
        type={selectedSample.isTryIt ? EButtonType.PRIMARY : EButtonType.SECONDARY}
        className={styles.ButtonClass}
        colorSchema={colorSchemeDefault}
      />
    </div>
  );

  const getCurrentTab = () => {
    const { outputResponseData } = props;
    let currentTab;
    switch (resultTabIndex) {
      case MODEL_DETAIL_RESULT_TAB_INDEX_CONSTANTS.FORMATTED_DATA:
        currentTab = (
          <OutputComponent
            modelData={modelData}
            outputComponent={outputResponseData?.output_components}
            isTryIt={selectedSample?.isTryIt}
          />
        );
        break;
      case MODEL_DETAIL_RESULT_TAB_INDEX_CONSTANTS.RAW_DATA:
        currentTab = <RawData raw_data={outputResponseData?.api_response} />;
        break;
      default:
        break;
    }
    return currentTab;
  };

  const onTabChange = (value) => {
    console.log('onTabChange ', value);
    setResultTabIndex(value);
  };

  const resultHeaderComponent = (
    <div>
      <ModelResultHeader onTabHandler={onTabChange} />
      <hr />
    </div>
  );

  const onInputChange = (value, component) => {
    setErrorBody({});
    setIsClearData(false);
    console.log('onInputChange ', value, component);
    if (component.component_type === 'fileupload') {
      setRequestBody({ ...requestBody, [value]: component });
    } else {
      setRequestBody({ ...requestBody, [component.key]: value });
    }
    // commented validation
    // if (component.is_required && !value) {
    //   setErrorBody({ ...errorBody, [component.key]: 'This field should not be empty.' });
    // } else if (component?.validations?.minimum_characters && value.length < component?.validations?.minimum_characters) {
    //   setErrorBody({ ...errorBody, [component.key]: `This field should contain minimum of ${component?.validations?.minimum_characters} charactors.` });
    // } else if (component?.validations?.maximum_characters && value.length > component?.validations?.maximum_characters) {
    //   // setErrorBody({ ...errorBody, [component.key]: 'This field should contain maximum of 1000 charactors.' });
    //   setErrorBody({ ...errorBody, [component.key]: `This field should contain a maximum of ${component?.validations?.maximum_characters} characters.` });
    // } else {
    //   // to delete the request body keys from object. eg. 'text'
    //   setErrorBody({ ...errorBody, [component.key]: undefined });
    // }
  };

  return (
    <div>
      {sampleButtonGroupComponent}
      <FullPageLoader />
      <InputComponent
        inputComponent={selectedSample?.input_components}
        isTryIt={selectedSample?.isTryIt}
        onInputChange={onInputChange}
        requestBody={requestBody}
        eventData={modelData?.events?.body}
        errorBody={errorBody}
        isClearData={isClearData}
      />
      <div className={cx(BS.W100, gClasses.MT20, BS.D_FLEX, BS.JC_END, BS.ALIGN_ITEM_CENTER)}>
        {selectedSample?.isTryIt && (
          <Button
            id="btn_clear"
            buttonText={BUTTON_TEXTS.CLEAR}
            size={EButtonSizeType.MD}
            type={EButtonType.TERTIARY}
            className={cx(gClasses.MR12, gClasses.red22)}
            onClickHandler={() => onClearClick()}
          />
        )}
        <Button
          buttonText={BUTTON_TEXTS.TRY_IT}
          size={EButtonSizeType.MD}
          type={EButtonType.PRIMARY}
          onClickHandler={() => onTryItClick()}
        />
      </div>

      {showResult &&
        <>
          <div className={cx(styles.Description, gClasses.W100)}>
            <Text
              content={RESULT_TAB.RESULT}
              size={ETextSize.MD}
              className={cx(gClasses.MT16, gClasses.FontWeight500, styles.MFALabel)}
            />
          </div>
          <div className={styles.TryItResultContainer}>
            {isDataLoadingOnTryIt ?
              (<WorkHallPageLoader color={colorSchema?.activeColor && colorSchema?.activeColor} className={gClasses.H60VH} />) : (
                <div>
                  {!isDataLoadingOnTryIt && showResult && isEmpty(mlModelReducer?.common_server_error) ? (
                    <div>
                      {resultHeaderComponent}
                      <div className={cx(gClasses.PB15, gClasses.MT15)}>
                        <div>{getCurrentTab()}</div>
                      </div>
                    </div>
                  ) : (
                    <ErrorDisplay onButtonClick={onTryItClick} />
                  )}
                </div>
              )}
          </div>
        </>
      }
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    modelData: state.MlModelListReducer.modelData,
    outputResponseData: state.MlModelListReducer.outputResponseData,
    isDataLoadingOnTryIt: state.MlModelListReducer.isDataLoadingOnTryIt,
    mlModelReducer: state.MlModelListReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOutputModelResponse: (params) => {
      dispatch(getMLModelOutputResponseThunk(params));
    },
    resetOutputModelResponse: (params) => {
      dispatch(updateMlModelDetailStarted(params));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TryItYourself);
