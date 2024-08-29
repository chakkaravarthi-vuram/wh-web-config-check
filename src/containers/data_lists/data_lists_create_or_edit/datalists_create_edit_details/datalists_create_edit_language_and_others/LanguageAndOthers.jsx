import React from 'react';
import PropTypes from 'prop-types';
import UniqueIdentifier from './UniqueIdentifier';
import styles from '../../DatalistsCreateEdit.module.scss';
import TechnicalConfiguration from './TechnicalConfiguration';
import { DL_ACTIONS, useDatalistReducer } from '../../useDatalistReducer';
import Category from '../../../../flow/create_data_list/settings/category/Category';
import { cloneDeep } from '../../../../../utils/jsUtility';

function DatalistsCreateEditLanguageAndOthers(props) {
    const { dataListID, addOnData, onDataChangeHandler, errorList } = props;
    const { state, dispatch: dataListDispatch } = useDatalistReducer();

    const setAddOnData = (data) => {
        onDataChangeHandler(data, DL_ACTIONS.ADD_ON_DATA_CHANGE);
    };

    const deleteCategoryError = () => {
        const clonedErrorList = cloneDeep(errorList);
        if (clonedErrorList?.createCategoryError) {
          delete clonedErrorList?.createCategoryError;
          dataListDispatch(DL_ACTIONS.UPDATE_ERROR_LIST, {
            ...state?.errorList,
            addOnError: clonedErrorList,
          });
        }
    };

    const populateCategoryErrorMessage = (errorMessage) => {
        if (!errorMessage) { deleteCategoryError(); return; }
        dataListDispatch(DL_ACTIONS.UPDATE_ERROR_LIST, {
            ...state?.errorList,
            addOnError: {
                ...errorList,
                createCategoryError: errorMessage,
            },
        });
    };

    const setCategoryData = (newData) => {
        setAddOnData({
            ...addOnData,
            ...newData,
        });
    };

    return (
        <div className={styles.LanguageContainer}>
           <UniqueIdentifier addOnData={addOnData} errorList={errorList} setAddOnData={setAddOnData} dataListID={dataListID} />
           <Category addOnErrorList={errorList} addOnData={addOnData} setCategoryData={setCategoryData} deleteCategoryError={deleteCategoryError} populateCategoryErrorMessage={populateCategoryErrorMessage} />
           {/* To be implemented in next sprint */}
           {/* <Translation dataListID={dataListID} /> */}
           <TechnicalConfiguration shortCode={addOnData?.dataListShortCode} technicalReferenceName={addOnData?.technicalReferenceName} errorList={errorList} />
        </div>
    );
}
export default DatalistsCreateEditLanguageAndOthers;

DatalistsCreateEditLanguageAndOthers.propTypes = {
    dataListID: PropTypes.string,
    addOnData: PropTypes.object,
    onDataChangeHandler: PropTypes.func,
    errorList: PropTypes.object,
};
