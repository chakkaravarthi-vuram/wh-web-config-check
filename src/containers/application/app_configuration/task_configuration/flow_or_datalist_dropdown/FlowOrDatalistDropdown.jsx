import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { DropdownList, NestedDropdown, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { isEmpty } from 'lodash';
import { getAllFlows } from '../../../../../axios/apiService/flowList.apiService';
import { getAllViewDataList } from '../../../../../axios/apiService/dataList.apiService';
import useApiCall from '../../../../../hooks/useApiCall';
import gClasses from '../../../../../scss/Typography.module.scss';
import { BS } from '../../../../../utils/UIConstants';
import { DL_LABEL, FLOW_LABEL, TASK_COMPONENT_CONFIG_KEYS } from '../TaskConfiguration.constants';
import LeftDirArrowIcon from '../../../../../assets/icons/app_builder_icons/LeftDirArrow';
import styles from '../TaskConfiguration.module.scss';
import { EMPTY_STRING, SEARCH_LABEL } from '../../../../../utils/strings/CommonStrings';
import RightMultiNavigateIcon from '../../../../../assets/icons/RightMultiNavigateIcon';

const API_CALL_TYPE = {
    FLOW: TASK_COMPONENT_CONFIG_KEYS.FLOW_UUIDS,
    DATALIST: TASK_COMPONENT_CONFIG_KEYS.DATA_LISTS_UUIDS,
};
const MAX_COUNT_PER_PAGE = 15;
const INITIAL_PAGE = 1;

function FlowOrDataListDropdown(props) {
    const { t } = useTranslation();
    const {
        label,
        placeholder,
        errorMessage,
        instruction,
        values,
        valueLabel,
        onSelect,
        isLoading,
        required,
    } = props;
    const [displayValue, setDisplayValue] = useState(valueLabel);
    const [type, setType] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => setDisplayValue(valueLabel), [valueLabel]);

    const loadData = (page, search, type) => {
       let apiCall = null;

       const param = {
        page,
        size: MAX_COUNT_PER_PAGE,
        ...(((search || '').trim()) ? { search } : {}),
       };

       if (type === API_CALL_TYPE.FLOW) apiCall = getAllFlows;
       else if (type === API_CALL_TYPE.DATALIST) apiCall = getAllViewDataList;

       if (!apiCall) return () => new Promise(() => {});
       return apiCall(param);
    };

    const { data: flowOrDataListList, fetch } = useApiCall({}, true);

    const onSearch = async (event) => {
        const search = event.target.value;
        setSearch(event.target.value);
        await fetch(loadData(1, search, type));
    };

    const getInitialView = (onNextView) => (
            <div>
            <DropdownList
             optionList={[
                { label: t(FLOW_LABEL), value: API_CALL_TYPE.FLOW },
                { label: t(DL_LABEL), value: API_CALL_TYPE.DATALIST },
             ]}
             customDropdownListView={
                (option) => (
                        <button
                            className={cx(styles.ViewContainer, gClasses.CenterV, BS.JC_BETWEEN, BS.W100, gClasses.PX12, gClasses.PY10)}
                            onClick={async () => {
                                setType(option.value);
                                setSearch(() => EMPTY_STRING);
                                await fetch(loadData(INITIAL_PAGE, '', option.value));
                                onNextView();
                            }}
                        >
                            <div className={cx(gClasses.FTwo13, styles.FlowOrDlLabel)}>{option.label}</div>
                            <RightMultiNavigateIcon />
                        </button>
                    )
             }
             className={gClasses.Zindex1}
            />
            </div>
    );

    const getFlowOrDataListView = (onPreviousView) => {
        const quickLinkLabel = (type === API_CALL_TYPE.FLOW) ? t(FLOW_LABEL)
            : ((type === API_CALL_TYPE.DATALIST) ? t(DL_LABEL) : null);
        const optionList = (flowOrDataListList || []).map((eachOption) => {
             if (type === API_CALL_TYPE.FLOW) return { label: eachOption.flow_name, value: eachOption.flow_uuid };
             else if (type === API_CALL_TYPE.DATALIST) return { label: eachOption.data_list_name, value: eachOption.data_list_uuid };
             return null;
        });
        return (
            <div className={styles.FlowOrDlContainer}>
                <button className={cx(gClasses.PX12, gClasses.PY10, BS.D_FLEX, BS.ALIGN_ITEM_CENTER)} onClick={onPreviousView}>
                    <LeftDirArrowIcon className={gClasses.MR5} fill="#217CF5" />
                    <Text content={quickLinkLabel} />
                </button>
                <DropdownList
                   className={styles.Dropdown}
                   optionList={optionList}
                   onClick={(value, label) => {
                    let current_type = null;
                    if (type === API_CALL_TYPE.FLOW) current_type = TASK_COMPONENT_CONFIG_KEYS.FLOW_UUIDS;
                    else if (type === API_CALL_TYPE.DATALIST) current_type = TASK_COMPONENT_CONFIG_KEYS.DATA_LISTS_UUIDS;

                    onSelect(current_type, value, label);
                   }}
                   searchProps={{
                     searchPlaceholder: `${t(SEARCH_LABEL)} ${quickLinkLabel}`,
                     searchValue: search,
                     onChangeSearch: onSearch,
                   }}
                   infiniteScrollProps={{
                    dataLength: (flowOrDataListList || []).length,
                    next: () => {},
                    hasMore: false,
                   }}
                   selectedListValue={values}
                />
            </div>
        );
    };
    return (
        <NestedDropdown
          displayText={isEmpty(displayValue) ? null : displayValue.join(', ')}
          dropdownViewProps={{
            instruction: instruction,
            labelName: label,
            isLoading: isLoading,
            required: required,
          }}
          placeholder={placeholder}
          errorMessage={errorMessage}
          totalViews={2}
        >
            {({ view, nextView: onNextView, prevView: onPreviousView }) => {
                switch (view) {
                   case 1: return getInitialView(onNextView);
                   case 2: return getFlowOrDataListView(onPreviousView);
                   default: return null;
                }
            }}
        </NestedDropdown>
    );
}

FlowOrDataListDropdown.defaultProps = {
    value: [],
    valueLabel: [],
    onSelect: () => {},
};

export default FlowOrDataListDropdown;
