import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { Button, Checkbox, EButtonType, ECheckboxSize, ETextSize, ETitleSize, Modal, ModalSize, ModalStyleType, SingleDropdown, Text, Title } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { getModuleIdByModuleType } from '../../../../Form.utils';
import { CancelToken, validate } from '../../../../../../utils/UtilityFunctions';
import { getDataRules } from '../../../../../../axios/apiService/form.apiService';
import CloseIconNew from '../../../../../../assets/icons/CloseIconNew';
import gClasses from '../../../../../../scss/Typography.module.scss';
import styles from './ExternalSourceColumnConfiguration.module.scss';
import { FIELD_CONFIGURATION_STRINGS } from '../../FieldConfiguration.strings';
import { RESPONSE_FIELD_KEYS } from '../../../../../../utils/constants/form/form.constant';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { deconstructDataRules } from './ExternalSourceColumnConfiguration.utils';
import { FORM_ACTIONS } from '../../../../Form.string';
import { EXTERNAL_SOURCE_STRINGS } from './ExternalSourceColumnConfiguration.strings';
import { cloneDeep, isEmpty } from '../../../../../../utils/jsUtility';
import { externalColumnConfigurationSchema } from './ExternalSourceColumnConfiguration.validation.schema';

const fieldsCancelToken = new CancelToken();

function ExternalSourceColumnConfiguration(props) {
    const { metaData, moduleType, dispatch, externalConfigurationData, tableUtils, sectionUUID,
        onSave, tableData } = props;
    const { errorList = {} } = externalConfigurationData;
    console.log('errorListerrorList', errorList, externalConfigurationData);
    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);
    const [rulesList, setRulesList] = useState([]);
    const [fieldList, setFieldList] = useState([]);
    const processExistingData = (rules) => {
        const selectedRule = rules?.find?.((eachRule) => eachRule.value === externalConfigurationData?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA]?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_RULE_UUID]);
        if (selectedRule) {
            setFieldList(selectedRule.fields);
        }
    };

    const getExternalSourceData = () => {
        const moduleObj = getModuleIdByModuleType(metaData, moduleType);
        delete moduleObj.step_id;
        const apiParams = {
            ...moduleObj,
            page: 1,
            size: 100,
        };
        getDataRules(apiParams, fieldsCancelToken?.setCancelToken)
          .then((res) => {
            const rules = deconstructDataRules(res?.pagination_data);
            console.log('xyz getDataRules', rules);
            setRulesList(rules);
            !isEmpty(externalConfigurationData) && processExistingData(rules);
          })
          .catch((error) => {
            console.log('getDataRules err', error);
          })
          .finally(() => setLoading(false));
    };

    useEffect(() => {
        getExternalSourceData();
    }, []);

    const getModalTitle = () => {
        let title = FIELD_CONFIGURATION_STRINGS(t).TITLE;
          if (tableUtils?.isNew) {
              title += ' - Add column from external source';
         } else {
              title += ' - Edit column from external source';
        }
        return title;
      };

    const closeExternalSourceConfiguration = () => {
        dispatch(FORM_ACTIONS.ACTIVE_EXTERNAL_SOURCE_CLEAR);
    };

    const getExternalSourceConfigurationHeader = () => (
          <div className={styles.NewFieldHeader}>
            <div className={gClasses.DisplayFlex}>
                <span className={styles.NewFieldHeaderText}>
                {getModalTitle()}
                </span>
            </div>
            <CloseIconNew
              onClick={closeExternalSourceConfiguration}
              className={styles.NewFieldCloseIcon}
            />
          </div>
    );

    const chooseRule = (value, label) => {
        const selectedRule = rulesList?.find((eachRule) => eachRule.value === value);
        if (selectedRule) {
            console.log('xyz externalconfig', selectedRule);
            setFieldList(selectedRule.fields);
            const data = {
                ...cloneDeep(externalConfigurationData),
                [RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA]: {
                    [RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_RULE_UUID]: value,
                    [RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_RULE_NAME]: label,
                    [RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_TABLE_UUID]: EMPTY_STRING,
                    [RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_TABLE_NAME]: EMPTY_STRING,
                    [RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_TABLE_COLUMNS]: [],
                    [RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DIRECT_FIELDS]: selectedRule?.directFields || [],
                },

            };
            dispatch(FORM_ACTIONS.ACTIVE_FIELD_EXTERNAL_SOURCE_DATA_CHANGE, { data: data });
        }
    };

    const addColumn = (value) => {
        let selectedColumns = cloneDeep(externalConfigurationData)?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA]?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_TABLE_COLUMNS] || [];
        if (selectedColumns.includes(value)) {
            const index = selectedColumns.findIndex((column) => column === value);
            selectedColumns = selectedColumns.slice(0, index).concat(selectedColumns.slice(index + 1));
        } else selectedColumns.push(value);
        const data = {
            ...cloneDeep(externalConfigurationData),
            [RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA]: {
                ...externalConfigurationData[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA] || {},
                [RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_TABLE_COLUMNS]: selectedColumns,
            },

        };
        dispatch(FORM_ACTIONS.ACTIVE_FIELD_EXTERNAL_SOURCE_DATA_CHANGE, { data: data });
    };

    const getColumnsComponents = () =>
      fieldList?.map((eachColumn) => (
        <div className={styles.TableColumnContainer} key={eachColumn}>
          <Checkbox
            disabled={externalConfigurationData?.[
              RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA
            ]?.[
              RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_EXISTING_TABLE_COLUMNS
            ]?.includes(eachColumn.value)}
            className={cx(gClasses.CenterV, gClasses.MY8)}
            isValueSelected={externalConfigurationData?.[
              RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA
            ]?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_TABLE_COLUMNS]?.includes(
              eachColumn.value,
            )}
            details={eachColumn}
            size={ECheckboxSize.SM}
            onClick={addColumn}
            checkboxViewLabelClassName={cx(
              gClasses.FTwo13BlackV20,
              gClasses.CheckboxClass,
            )}
          />
        </div>
      ));
    const getModifiedRuleList =
        rulesList.map((eachrow) => { return { ...eachrow, optionLabelClassName: cx(gClasses.Ellipsis, styles.FlexBasisMaxWidth) }; });
    const getExternalSourceConfigurationBody = () => {
        console.log('dummy');
        return (
            <div className={cx(gClasses.PX24, gClasses.MT16)}>
                <div className={cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw, gClasses.GAP8)}>
                    <div className={styles.FlexBasis}>
                    <SingleDropdown
                        id={EXTERNAL_SOURCE_STRINGS(t).CHOOSE_RULE.ID}
                        optionList={getModifiedRuleList}
                        onClick={chooseRule}
                        placeholder={EXTERNAL_SOURCE_STRINGS(t).CHOOSE_RULE.PLACEHOLDER}
                        selectedValue={externalConfigurationData?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA]?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_RULE_UUID]}
                        dropdownViewProps={{
                            disabled: externalConfigurationData?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA]?.[RESPONSE_FIELD_KEYS.IS_EXTERNAL_SOURCE_SAVED_RULE],
                            labelName: EXTERNAL_SOURCE_STRINGS(t).CHOOSE_RULE.LABEL,
                            selectedLabel: externalConfigurationData?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA]?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_RULE_NAME],
                            isLoading: loading,
                        }}
                        errorMessage={errorList?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_RULE_UUID]}
                    />
                    </div>
                </div>
                {(!isEmpty(fieldList)) &&
                    <div className={gClasses.MT16}>
                        <Title
                            content={EXTERNAL_SOURCE_STRINGS(t).TABLE_COLUMNS.LABEL}
                            size={ETitleSize.xs}
                        />
                        {errorList[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_TABLE_COLUMNS] &&
                            <Text
                                content={errorList[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_TABLE_COLUMNS]}
                                size={ETextSize.XS}
                                className={cx(gClasses.FTwo11RedV22, gClasses.MT8)}
                            />
                        }
                        <div className={cx(styles.TwoColGrid, gClasses.MT8)}>
                            {getColumnsComponents()}
                        </div>
                    </div>
                }
            </div>
        );
    };

    const onSaveExternalSource = () => {
        const validateData = externalConfigurationData?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA];
        delete validateData[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_TABLE_NAME];
        delete validateData[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_TABLE_UUID];
        const errorList = validate(
            externalConfigurationData?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA],
            externalColumnConfigurationSchema(t));
        if (isEmpty(errorList)) {
            onSave(
                {
                    ...tableData,
                    ...externalConfigurationData,
                },
                sectionUUID,
                {
                path: externalConfigurationData?.path,
                dropType: externalConfigurationData?.dropType,
                },
              );
        } else {
            const data = {
                ...cloneDeep(externalConfigurationData),
                errorList: errorList,

            };
            dispatch(FORM_ACTIONS.ACTIVE_FIELD_EXTERNAL_SOURCE_DATA_CHANGE, { data: data });
        }
    };

    const getExternalSourceConfigurationFooter = () => (
        <div className={styles.NewFieldFooter}>
            {
            externalConfigurationData?.[RESPONSE_FIELD_KEYS.FIELD_UUID] ?
                <Button
                    buttonText="Delete"
                    type={EButtonType.OUTLINE_SECONDARY}
                    className={styles.DeleteFormField}
                    onClickHandler={null}
                /> : <div />
            }
          <div className={styles.SaveAndCancelButtons}>
            <Button
              buttonText="Cancel"
              type={EButtonType.OUTLINE_SECONDARY}
              className={styles.Cancel}
              onClickHandler={closeExternalSourceConfiguration}
            />
            <Button
              buttonText="Save"
              type={EButtonType.PRIMARY}
              onClickHandler={onSaveExternalSource}
            />
          </div>
        </div>
      );

    return (
        <div>
            <Modal
                isModalOpen
                headerContent={getExternalSourceConfigurationHeader()}
                mainContent={getExternalSourceConfigurationBody()}
                footerContent={getExternalSourceConfigurationFooter()}
                modalStyle={ModalStyleType.modal}
                modalSize={ModalSize.md}
            />
        </div>
    );
}

export default ExternalSourceColumnConfiguration;
