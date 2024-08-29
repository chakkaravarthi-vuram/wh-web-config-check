import { EToastType, Picker, toastPopOver } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { getAllDataListEntries } from '../../../axios/apiService/form.apiService';
import { get, uniqBy, isEmpty } from '../../../utils/jsUtility';
import { FORM_TYPE } from '../../../containers/form/Form.string';
import { EMPTY_STRING, HYPHEN } from '../../../utils/strings/CommonStrings';
import styles from './DatalistPicker.module.scss';

function DatalistPicker(props) {
  const { t } = useTranslation();
  const {
    id,
    className,
    labelClassName,
    required,
    labelText,
    selectedValue,
    instruction,
    helpTooltip,
    onChange,
    getParams,
    disabled,
    errorMessage,
    errorVariant,
    formType,
    maxSelectionCount,
    onRemove,
    popperPlacement,
    colorScheme,
    referenceName,
    maxCountLimit,
    getPopperContainerClassName,
    hideLabel,
    choiceObj = {},
    displayLength = 30,
    addLabel,
    onChipClick = null,
  } = props;
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState(EMPTY_STRING);
  const [loading, setLoading] = useState(false);
  const [, setPaginationDetails] = useState({});
  const [localError, setLocalError] = useState('');
  const hiddenVisibilityRef = useRef(null);
  const cancelTokenRef = useRef();

  const setCancelToken = (c) => { cancelTokenRef.current = c; };

  const isCreationForm = formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.IMPORT_FROM;
  const error = localError || errorMessage;

  const getDisplayLabel = (values) => {
    const filteredValues = values.filter((eachValue) => eachValue !== undefined && eachValue !== null && eachValue !== EMPTY_STRING);
    return filteredValues.join(HYPHEN);
  };

  const loadData = (page = 1, search = '') => {
    cancelTokenRef.current?.();
    const params = {
      ...(getParams?.() || {}),
      size: 15,
      page,
    };
    if (search) params.search = search;

    setLoading(true);
    getAllDataListEntries(params, setCancelToken)
      .then((data) => {
        setLoading(false);
        const pagination_data = get(data, ['pagination_data'], []);
        const pagination_details = get(data, ['pagination_details', 0], {});
        const _list = [];
        pagination_data.forEach((d) => {
          const displayField = get(d, ['display_fields'], []);
          if (displayField) {
            const labels = [d[displayField[0]], d[displayField[1]]];
            if (choiceObj[displayField[0]]) labels[0] = choiceObj[displayField[0]][d[displayField[0]]] || d[displayField[0]];
            if (choiceObj[displayField[1]]) labels[1] = choiceObj[displayField[1]][d[displayField[1]]] || d[displayField[1]];
            const label = getDisplayLabel(labels);
            if (label) {
              _list.push({ id: d._id, label, value: d._id });
            }
          }
        });
        if (pagination_details?.page > 1) {
          setList((prev) => uniqBy([...prev, ..._list], (option) => option.id));
        } else {
          setList(_list);
        }
        setLocalError('');
        setPaginationDetails(pagination_details);
      })
      .catch((err) => {
        if (get(err, ['message'], '') === 'canceled') return;
        setLoading(false);

        const fieldName = labelText || referenceName;
        const error = get(err, ['response', 'data', 'errors', 0], {});
        if (error.type === 'AuthorizationError') {
          setLocalError(t('error_popover_status.no_access_to_this_datalist'));
          toastPopOver({
            title: t('error_popover_status.no_access_to_this_datalist'),
            subtitle: `Field: ${fieldName}`,
            toastType: EToastType.error,
          });
        } else if (error.type === 'not_exist') {
          setLocalError(t('error_popover_status.datalist_does_not_exists'));
          toastPopOver({
            title: t('error_popover_status.datalist_does_not_exists'),
            subtitle: `Field: ${fieldName}`,
            toastType: EToastType.error,
          });
        } else {
          toastPopOver({
            title: t('server_error_code_string.somthing_went_wrong'),
            subtitle: `${t('error_popover_status.unable_to_get_datalist_entries')} (Field: ${fieldName})`,
            toastType: EToastType.error,
          });
        }
      });
  };

  const onSearch = (e) => {
    console.log('api call here1');
    setSearchText(e.target.value);
    loadData(1, e.target.value);
  };

  const onselectEntry = (field) => {
    onChange(field);
  };

  const onRemoveEntry = (id) => {
    onRemove(id);
  };

  const stablizedList = Array.isArray(list) ? list : [];
  const stablizedSelectedValue = isEmpty(selectedValue) ? [] : (Array.isArray(selectedValue) ? selectedValue : [selectedValue]);
  const optionsListExcludingSelectedValue = stablizedList.filter((eachValue) => !stablizedSelectedValue?.find((eachSelectedValue) => eachSelectedValue.value === eachValue.value));

  const optionList = loading ? [] : optionsListExcludingSelectedValue;

  return (
    <>
    <Picker
      id={id}
      allLabels={{
        ADD_BUTTON: addLabel || t('common_strings.add_new_data'),
      }}
      className={cx(className, styles.DatalistPicker)}
      popperPlacement={popperPlacement}
      labelClassName={labelClassName}
      labelText={labelText}
      required={required}
      instruction={instruction}
      helpTooltip={helpTooltip}
      selectedValue={selectedValue || []}
      onChipClick={onChipClick}
      maxSelectionCount={maxSelectionCount}
      optionList={optionList}
      onSelect={onselectEntry}
      onRemove={onRemoveEntry}
      disabled={disabled}
      colorScheme={colorScheme}
      referenceName={referenceName}
      noDataFoundMessage={
        loading
          ? t('common_strings.searching')
          : t('common_strings.no_results_found')
      }
      errorMessage={error}
      errorVariant={errorVariant}
      onPopperOutsideClick={() => hiddenVisibilityRef?.current?.click()}
      maxDisplayCountLimit={maxCountLimit}
      dropdownSearchProps={{
        isSearchable: true,
        onSearch: onSearch,
        searchPlaceholder: t('common_strings.search'),
        searchText,
      }}
      getPopperContainerClassName={(isPopperOpen) => cx(styles.SelectedDataPopper, getPopperContainerClassName?.(isPopperOpen))}
      getRemainingPopperContainerClassName={() => cx(styles.RemainingDataPopper)}
      hideLabel={hideLabel}
      onPopperRefClick={(isPopperOpen) => {
        !isCreationForm && isPopperOpen && loadData(1, EMPTY_STRING);
      }}
      displayLength={displayLength}
    />
    <button
      className={gClasses.DisplayNone}
      onClick={() => {
        setSearchText(EMPTY_STRING);
      }}
      ref={hiddenVisibilityRef}
    />
    </>
  );
  // <SingleDropdown
  //   id={id}
  //   selectedValue={selectedValue}
  //   optionList={list}
  //   onClick={(v) => onChange(v)}
  //   placeholder={t('common_strings.select_a_value')}
  //   noDataFoundMessage={t('common_strings.no_results_found')}
  //   dropdownViewProps={{
  //     labelName: labelText,
  //     selectedLabel: list.find((v) => v.value === selectedValue)?.label || '',
  //     disabled,
  //     errorMessage,
  //   }}
  //   infiniteScrollProps={{
  //     dataLength: list.length,
  //     next: loadMoreData,
  //     hasMore: get(paginationDetails, 'total_count', 0) > list.length,
  //     scrollableId: 'when_field_scroll_id',
  //   }}
  // />
}

export default DatalistPicker;
