import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { getAllExternalFieldsThunk, getFormulaBuilderFunctionsThunk, getRuleDetailforExpression } from 'redux/actions/FormulaBuilder.Actions';
import { INITIAL_PAGE, MAX_PAGINATION_SIZE_V2 } from 'utils/constants/form.constant';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { setFormulaTokenChange } from 'redux/reducer/FormulaBuilderReducer';
import { isEmpty, get } from '../../utils/jsUtility';
import styles from './FormulaBuilder.module.scss';
import FormulaEditor from './formula_editor/FormulaEditor';
import { FORMULA_EXPRESSION_COMMON_STRINGS } from './FormulaBuilder.strings';
import { combineFieldsAndMetadata } from './formula_tokenizer_utils/formulaBuilder.utils';

function FormulaBuilder(props) {
    const {
            modalId,
            currentFieldUUID,
            isTaskForm,
            taskId,
            // stepOrder,
            isDataListForm,
            fieldError = {},
            refreshOnCodeChange,
            lstFunctions,
            ruleId,
            existingData,
            state,

            setFormulaBuilderChange,
            getFormulaBuilderFunctions,
            getRuleDetails,
            onCodeChange,
            onErrorChange,
            dispatch,
        } = props;
    const { t } = useTranslation();

    const [loader, setLoader] = useState({ isFieldLoaded: false, isExpressionLoaded: false });
    const [fieldsWithMetadata, setFieldsWithMetadata] = useState([]);
    const [isClearTrigger, setIsClearTrigger] = useState(EMPTY_STRING);

    const loadExternalFields = (page = INITIAL_PAGE, isSearch = false, searchText = EMPTY_STRING) => {
        const paginationDetails = {
            page: page || INITIAL_PAGE,
            size: MAX_PAGINATION_SIZE_V2,
            include_property_picker: 1,
        };

        if (currentFieldUUID) paginationDetails.exclude_field_uuids = [currentFieldUUID];
        if (isSearch && searchText) {
            paginationDetails.search = searchText;
        }
        return new Promise((resolve, reject) => {
                dispatch(getAllExternalFieldsThunk(
                    paginationDetails,
                    taskId,
                    { isTaskForm, isDataListForm },
                    false,
                    t,
                )).then((response) => {
                    setLoader((previous_state) => { return { ...previous_state, isFieldLoaded: true }; });
                    resolve(response.pagination_data || []);
                }).catch(() => {
                    setLoader((previous_state) => { return { ...previous_state, isFieldLoaded: true }; });
                    reject();
                });
            });
     };

    const getRuleDetailsByRuleId = (callBackFn = null) => {
        if (ruleId && isEmpty(existingData)) {
            getRuleDetails(ruleId, callBackFn)
            .then(({ code }) => {
                onCodeChange?.(code, true);
                setFormulaBuilderChange({ refreshOnCodeChange: !refreshOnCodeChange });
                setLoader((previous_state) => { return { ...previous_state, isExpressionLoaded: true }; });
            })
            .catch(() => {
                setLoader((previous_state) => { return { ...previous_state, isExpressionLoaded: true }; });
            });
        } else {
            callBackFn(get(state, ['field_metadata'], [])).then(() => {
                setFormulaBuilderChange({ refreshOnCodeChange: !refreshOnCodeChange });
                setLoader((previous_state) => { return { ...previous_state, isExpressionLoaded: true }; });
            });
        }
    };

    useEffect(() => {
        if (isEmpty(lstFunctions)) getFormulaBuilderFunctions();

        return () => {
          setFormulaBuilderChange({ tokenizedOutput: [] });
        };
      }, []);

    useEffect(() => {
        if (taskId) {
            loadExternalFields()
            .then((allFields) => {
                getRuleDetailsByRuleId(
                    (response_field_metadata) =>
                    combineFieldsAndMetadata(allFields, response_field_metadata, setFieldsWithMetadata),
                );
            });
        } else {
            setLoader((previous_state) => { return { ...previous_state, isFieldLoaded: true }; });
            getRuleDetailsByRuleId(
                (response_field_metadata) =>
                combineFieldsAndMetadata([], response_field_metadata, setFieldsWithMetadata),
            );
        }
      }, []);

    const onButtonClick = (data) => {
        setIsClearTrigger(data);
    };

    return (
        <div
         className={cx(styles.FormulaBuilderContainer, gClasses.MB15)}
        >
            <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER, gClasses.MB8)}>
                {/* <Label content={FORMULA_BUILDER(t).ALL_LABELS.EXPRESSION_BUILDER} innerClassName={cx(styles.TitleDisplay, gClasses.FieldName)} isRequired /> */}
                <div className={cx(styles.TitleButtonContainer)}>
                    {/* Undo and Redo for upcoming sprint */}
                    {/* <button>
                        <UndoIcon />
                    </button>
                    <button>
                        <ReDoIcon />
                    </button> */}
                    {/* <button
                       ref={clearRef}
                       className={cx(gClasses.FTwo12BlackV13, gClasses.FontWeight500, gClasses.MR8, BS.P_RELATIVE)}
                       title={FORMULA_EXPRESSION_COMMON_STRINGS(t).CLEAR_TITLE}
                       onClick={() => setIsCloseModalOpen(!isCloseModalOpen)}
                    >
                        <EraseFormulaIcon role={ARIA_ROLES.IMG} ariaLabel={FORMULA_EXPRESSION_COMMON_STRINGS(t).CLEAR} ariaHidden className={cx(gClasses.MR5)} />
                        {FORMULA_EXPRESSION_COMMON_STRINGS(t).CLEAR}
                    </button>
                    <ClearFormulaConfirmation
                        referenceElement={clearRef.current}
                        isPopperOpen={isCloseModalOpen}
                        closeClearModal={() => setIsCloseModalOpen(false)}
                        onClearClick={() => onButtonClick(FORMULA_EXPRESSION_COMMON_STRINGS(t).CLEAR)}
                    />
                    <button
                       className={cx(gClasses.FTwo12BlackV13, gClasses.FontWeight500)}
                       title={FORMULA_EXPRESSION_COMMON_STRINGS(t).BEAUTIFY_TITLE}
                       onClick={() => onButtonClick(FORMULA_EXPRESSION_COMMON_STRINGS(t).BEAUTIFY)}
                    >
                        <BeautifyIcon role={ARIA_ROLES.IMG} ariaHidden ariaLabel={FORMULA_EXPRESSION_COMMON_STRINGS(t).BEAUTIFY} className={cx(gClasses.MR5)} />
                        {FORMULA_EXPRESSION_COMMON_STRINGS(t).BEAUTIFY}
                    </button> */}
                </div>
            </div>
              <div className={BS.P_RELATIVE}>
                {
                    (!loader.isExpressionLoaded || !loader.isFieldLoaded) ?
                    (
                        <div className={styles.FormulaBuilderLoader}>
                            <h1>&lt;/&gt;</h1>
                            <p>{FORMULA_EXPRESSION_COMMON_STRINGS(t).LOADER_TEXT}</p>
                        </div>
                    ) :
                    (
                        <FormulaEditor
                            modalId={modalId}
                            onLoadMoreFields={loadExternalFields}
                            onCodeChange={onCodeChange}
                            onErrorChange={onErrorChange}
                            error={fieldError}
                            refreshOnCodeChange={refreshOnCodeChange}
                            fieldsWithMetadata={fieldsWithMetadata}
                            setFieldsWithMetadata={setFieldsWithMetadata}
                            isClearTrigger={isClearTrigger}
                            onClearOrBeautifyInitial={() => setIsClearTrigger(EMPTY_STRING)}
                            onButtonClick={onButtonClick}
                        />
                    )
                }
              </div>
        </div>
    );
}
const mapStateToProps = (state) => {
    return {
        refreshOnCodeChange: state.FormulaBuilderReducer.refreshOnCodeChange,
        lstFunctions: state.FormulaBuilderReducer.lstFunctions,
        state: state.FormulaBuilderReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getExternalFields: (
            paginationDetails,
            id,
            { isTaskForm, isDataListForm },
            ) => dispatch(getAllExternalFieldsThunk(
                    paginationDetails,
                    id,
                    { isTaskForm, isDataListForm },
                    false,
                )),
        getRuleDetails: (ruleId, callBackFn) => dispatch(getRuleDetailforExpression(ruleId, callBackFn)),
        setFormulaBuilderChange: (value) => {
            dispatch(setFormulaTokenChange(value));
        },
        getFormulaBuilderFunctions: () => {
            dispatch(getFormulaBuilderFunctionsThunk());
          },
        dispatch,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormulaBuilder);

FormulaBuilder.propTypes = {
    isTaskForm: PropType.bool,
    taskId: PropType.string,
    stepOrder: PropType.number,
    isDataListForm: PropType.bool,
    getExternalFields: PropType.func,
    saveRuleApi: PropType.func,
};

FormulaBuilder.defaultProps = {
    isTaskForm: false,
    taskId: null,
    stepOrder: 0,
    isDataListForm: false,
    getExternalFields: () => {},
    saveRuleApi: () => {},
};
