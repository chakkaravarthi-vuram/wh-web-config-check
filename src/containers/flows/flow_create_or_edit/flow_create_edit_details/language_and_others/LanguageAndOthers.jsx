import React, { useEffect } from 'react';
import { getFlowAddOnInfoApi } from '../../../../../axios/apiService/flow.apiService';
import { setLoaderAndPointerEvent, somethingWentWrongErrorToast } from '../../../../../utils/UtilityFunctions';
import { cloneDeep, has } from '../../../../../utils/jsUtility';
import { FLOW_ACTIONS } from '../../../useFlow';
import styles from '../../FlowCreateOrEdit.module.scss';
import TechnicalConfiguration from './TechnicalConfiguration';
import Translation from './Translation';
import UniqueIdentifier from './UniqueIdentifier';
import { deconstructFlowAddOnData } from './LanguageAndOther.utils';
import Category from '../../../../flow/create_data_list/settings/category/Category';

function FlowCreateEditLanguageAndOthers(props) {
  const { metaData, addOn, dispatch } = props;
  const errorList = addOn.errorList || {};
  console.log('addon', addOn);

  useEffect(() => {
    if (!metaData.flowId) return null;
    const params = { flow_id: metaData.flowId };

    setLoaderAndPointerEvent(true);
    getFlowAddOnInfoApi(params)
      .then((data) => {
        const _addOn = deconstructFlowAddOnData(data);
        console.log('xyz addOn', data, _addOn);
        dispatch(FLOW_ACTIONS.UPDATE_ADD_ON, _addOn);
      })
      .catch((err) => {
        console.error('xyz err', err);
        somethingWentWrongErrorToast();
      })
      .finally(() => {
        setLoaderAndPointerEvent(false);
      });

    return () => dispatch(FLOW_ACTIONS.SET_ADD_ON, {});
  }, [metaData.flowId]);

  const onChange = (id, value, options = {}) => {
    const cloneAddOn = {};
    switch (id) {
      case 'isSystemIdentifier': {
        cloneAddOn.isSystemIdentifier = value;
        cloneAddOn.customIdentifier = {};
        break;
      }
      case 'customIdentifier': {
        cloneAddOn.customIdentifier = value;
        break;
      }

      case 'taskIdentifier': {
        cloneAddOn.taskIdentifier = [...(addOn.taskIdentifier || [{}])];
        if (has(options, ['taskIdentifierIdx'])) {
          cloneAddOn.taskIdentifier[options.taskIdentifierIdx] = value;
        } else if (options.addTaskIdentifier) {
          cloneAddOn.taskIdentifier.push({});
        }
        break;
      }
      case 'category': {
        cloneAddOn.category = value.category;
        break;
      }
      default:
        cloneAddOn[id] = value;
    }
    dispatch(FLOW_ACTIONS.UPDATE_ADD_ON, cloneAddOn);
  };

  const setCategoryData = (newData) => {
    onChange('category', newData);
  };

  const deleteCategoryError = () => {
    const clonedErrorList = cloneDeep(errorList);
    const clonedAddOn = {};
    if (clonedErrorList?.createCategoryError) {
      delete clonedErrorList?.createCategoryError;
      clonedAddOn.errorList = clonedErrorList;
      dispatch(FLOW_ACTIONS.UPDATE_ADD_ON, clonedAddOn);
    }
  };

  const populateCategoryErrorMessage = (errorMessage) => {
    if (!errorMessage) { deleteCategoryError(); return; }
    const clonedAddOn = {};
    clonedAddOn.errorList = {
      ...errorList?.addOn,
      createCategoryError: errorMessage,
    };
    dispatch(FLOW_ACTIONS.UPDATE_ADD_ON, clonedAddOn);
  };

  return (
    <div className={styles.LanguageContainer}>
      <UniqueIdentifier
        metaData={metaData}
        addOn={addOn}
        onChange={onChange}
        errorList={errorList}
      />
      <Category addOnData={addOn} addOnErrorList={errorList} setCategoryData={setCategoryData} populateCategoryErrorMessage={populateCategoryErrorMessage} deleteCategoryError={deleteCategoryError} isFlow />
      <Translation metaData={metaData} addOn={addOn} setCategoryData={setCategoryData} />
      <TechnicalConfiguration
        errorList={errorList}
        shortCode={addOn.flowShortCode}
        technicalReferenceName={addOn.technicalReferenceName}
        onChange={onChange}
      />
    </div>
  );
}

// comments - can we use hooks instead of this?

export default FlowCreateEditLanguageAndOthers;
