import React, { useEffect, useMemo, useState } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Text, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from '../../../../../scss/Typography.module.scss';
import CreateDropdown from '../../../../../components/create_dropdown/CreateDropdown';
import styles from './StatusDropdown.module.scss';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { saveStepStatusesAPIThunk } from '../../../../../redux/actions/EditFlow.Action';
import { isEmpty, cloneDeep, safeTrim } from '../../../../../utils/jsUtility';
import {
    showToastPopover,
    validate,
} from '../../../../../utils/UtilityFunctions';
import { statusCreationValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';
import { STATUS_ERROR_LIST_KEYS } from '../../../node_configuration/NodeConfiguration.constants';
import {
    STEP_NAME_AND_STATUS_STRINGS,
    STEP_STATUS_STRINGS,
} from '../../../node_configuration/NodeConfiguration.strings';
import { DEFAULT_STEP_STATUS } from '../../../EditFlow.constants';
import { FORM_POPOVER_STATUS } from '../../../../../utils/Constants';
import { displayErrorToast } from '../../../../../utils/flowErrorUtils';

function StatusDropdown(props) {
    const { t } = useTranslation();
    const { flowData } = useSelector((sel) => sel.EditFlowReducer);
    const {
        selectedValue, instruction, contentSubTitle, isContentSubTitleNotNeeded,
        onClickHandler, hideStatusDropdown, contentTitle, stepName,
        onChangeHandler, stepNameError, stepStatusError, hideStepName, textClassName,
    } = props;

    const [statusSearchText, setStatusSearchText] = useState(EMPTY_STRING);
    const [statusOptionsList, setStatusOptionsList] = useState([]);
    const [filterStatusOptionsList, setFilterStatusOptionsList] = useState([]);
    const [statusErrorMessage, setStatusErrorMessage] = useState({});
    const reduxDispatch = useDispatch();

    const { STATUS, TITLE, STEP_NAME } = STEP_NAME_AND_STATUS_STRINGS(t);

    const formattedStatusValueWithLabel = (status) => {
        return {
            label: status,
            value: status,
        };
    };

    useEffect(() => {
        const optionsList = [];
        (flowData?.stepStatuses || [DEFAULT_STEP_STATUS]).forEach((status) => {
            optionsList.push(formattedStatusValueWithLabel(status));
        });
        setStatusOptionsList(optionsList);
    }, [flowData?.stepStatuses]);

    useMemo(() => {
        if (!isEmpty(statusSearchText)) {
            const filteredValues = statusOptionsList?.filter((status) => status?.value?.toLowerCase().includes(statusSearchText.toLowerCase()));
            setFilterStatusOptionsList(filteredValues);
        } else {
            setFilterStatusOptionsList(statusOptionsList);
        }
        return filterStatusOptionsList;
    }, [statusOptionsList, statusSearchText]);

    const onOutSideClick = () => {
        setStatusSearchText(EMPTY_STRING);
        setStatusErrorMessage({});
    };

    const onDropDownClickHandler = (value) => {
        onClickHandler(value);
        setStatusSearchText(EMPTY_STRING);
    };

    const onCreateButtonClickHandler = (_value, isCustomDropdownOpen) => {
        const trimmedStr = safeTrim(statusSearchText);
        const tempStatusOptionList = [...statusOptionsList, formattedStatusValueWithLabel(trimmedStr)];
        const dataToBeValidated = { [STATUS_ERROR_LIST_KEYS.STEP_STATUS]: trimmedStr, [STATUS_ERROR_LIST_KEYS.STATUS_OPTION_LIST]: tempStatusOptionList };
        const validatedData = validate(dataToBeValidated, statusCreationValidationSchema(t));
        const errorList = {};
        Object.keys(validatedData).forEach((key) => {
            if (isEmpty(validatedData[key])) return;
            key.includes(STATUS_ERROR_LIST_KEYS.STATUS_OPTION_LIST) ? errorList[STATUS_ERROR_LIST_KEYS.STATUS_OPTION_LIST] = validatedData[key] : errorList[STATUS_ERROR_LIST_KEYS.STEP_STATUS] = validatedData[key];
        });
        setStatusErrorMessage(errorList);
        if (!isEmpty(trimmedStr) && isEmpty(errorList)) {
            const clonedStepStatuses = cloneDeep(flowData?.stepStatuses) || [DEFAULT_STEP_STATUS];
            const list = [...clonedStepStatuses, trimmedStr];
            reduxDispatch(saveStepStatusesAPIThunk({ flow_id: flowData?.flow_id, step_statuses: list }))
                .then((response) => {
                    console.log('stepStatusResponse', response);
                    onClickHandler(trimmedStr, {
                        ...flowData,
                        stepStatuses: list,
                    });
                    onOutSideClick();
                    isCustomDropdownOpen(false);
                    showToastPopover(
                        STEP_STATUS_STRINGS(t).CREATED_TITLE,
                        STEP_STATUS_STRINGS(t).CREATED_SUCCESS_SUBTITLE,
                        FORM_POPOVER_STATUS.SUCCESS,
                        true,
                    );
                })
                .catch((error) => {
                    console.log('stepStatusError', error);
                    displayErrorToast({
                        title: STEP_STATUS_STRINGS(t).CREATION_FAILURE_TITLE,
                        subTitle: STEP_STATUS_STRINGS(t).CREATION_FAILURE_SUBTITLE,
                    });
                });
        }
    };

    const onSearchChangeHandler = (event) => {
        setStatusSearchText(event?.target?.value);
        setStatusErrorMessage({});
    };

    console.log('statusErrorMessagestatusErrorMessage', statusErrorMessage);

    return (
        <div>
            <Text
                className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3)}
                content={contentTitle || TITLE}
            />
            {
                !hideStepName && (
                    <TextInput
                        placeholder={STEP_NAME.PLACEHOLDER}
                        labelText={STEP_NAME.LABEL}
                        id={STEP_NAME.ID}
                        className={cx(gClasses.MT8, gClasses.W50, textClassName)}
                        onChange={onChangeHandler}
                        onBlurHandler={(e) => onChangeHandler(e, true)}
                        value={stepName}
                        errorMessage={stepNameError}
                        required
                    />
                )
            }
            {
                !hideStatusDropdown && (
                    <div className={cx(styles.StatusDropdown, gClasses.MT8)}>
                        <CreateDropdown // Status
                            id={STATUS.ID}
                            onClick={onDropDownClickHandler}
                            optionList={cloneDeep(filterStatusOptionsList) || []}
                            searchProps={{
                                searchPlaceholder: STATUS.SEARCH_STATUS.PLACEHOLDER,
                                searchValue: statusSearchText,
                                onChangeSearch: onSearchChangeHandler,
                                searchLabel: STATUS.SEARCH_STATUS.LABEL,
                                searchLabelClass: styles.SearchLabel,
                                searchInputClass: styles.SearchInput,
                            }}
                            infiniteScrollProps={{
                                dataLength: 15,
                                next: null,
                                hasMore: false,
                                scrollableId: STATUS.CREATE_STATUS.ID,
                                scrollThreshold: 0.8,
                            }}
                            createProps={{
                                createButtonLabel: STATUS.CREATE_STATUS.BUTTON_LABEL,
                                onCreateButtonClick: onCreateButtonClickHandler,
                                createError: statusErrorMessage?.[STATUS_ERROR_LIST_KEYS.STATUS_OPTION_LIST] || statusErrorMessage?.[STATUS_ERROR_LIST_KEYS.STEP_STATUS],
                            }}
                            dropdownViewProps={{
                                labelName: !isContentSubTitleNotNeeded && (contentSubTitle || STATUS.LABEL),
                                selectedLabel: selectedValue,
                                labelClassName: cx(gClasses.FTwo12BlackV20, gClasses.FontWeight500),
                            }}
                            instruction={instruction}
                            selectedValue={selectedValue}
                            onOutSideClick={onOutSideClick}
                            errorMessage={stepStatusError}
                        />
                    </div>
                )
            }
        </div>
    );
}

export default StatusDropdown;
