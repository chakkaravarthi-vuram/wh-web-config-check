import React, { useContext, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getUpdatedMetricFields } from 'containers/edit_flow/settings/metrics/Metrics.utils';
import EditIconV2 from 'assets/icons/form_fields/EditIconV2';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { Button, EButtonSizeType, EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import styles from './Metric.module.scss';
import { BS } from '../../../../../../../utils/UIConstants';
import { get, cloneDeep, compact, isEmpty, has } from '../../../../../../../utils/jsUtility';

import { getDataListMetricsSelector } from '../../../../../../../redux/selectors/CreateDataList.selectors';
import { dataListStateChangeAction } from '../../../../../../../redux/reducer/CreateDataListReducer';
import { METRIC_BUTTON_ACTION, FIELD } from '../../Metrics.strings';
// import Button, { BUTTON_TYPE } from '../../../../../../../components/form_components/button/Button';
import Dropdown from '../../../../../../../components/form_components/dropdown/Dropdown';
import ThemeContext from '../../../../../../../hoc/ThemeContext';
import Input from '../../../../../../../components/form_components/input/Input';
import { getFieldLabelWithRefName } from '../../../../../../../utils/UtilityFunctions';
import Trash from '../../../../../../../assets/icons/application/Trash';
import { METRICS } from '../../../../../../edit_flow/settings/default_report_fields_list/Metrics.strings';

const mapStateToProps = (state) => {
  return {
    metricsDataList: getDataListMetricsSelector(state.CreateDataListReducer),
    metrics: state.CreateDataListReducer.metrics,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDataListStateChange: (data, id) => {
      dispatch(dataListStateChangeAction(data, id));
    },
  };
};

function Metric(props) {
  const {
    metricsDataList,
    metricsDataList: {
      lstAllFields,
      metrics: { metric_fields, err_l_field },
      hasMore,
    },
    index,
    metricData,
    metricData: { reference_name, field_name, isFieldDeleted },
    onDataListStateChange,
    onSaveHandler,
    validateMetric,
    onChangeHandler,
    onLoadMoreData,
    onSearchFieldData,
    list,
  } = props;
  const { t } = useTranslation();
  const [currentField, setCurrentField] = useState(EMPTY_STRING);
  const { colorSchemeDefault } = useContext(ThemeContext);
  const alternate_name = get(props, ['metricData', 'label'], field_name);
  const consolidated_label = `${alternate_name} (Ref: ${reference_name})`;

  const existing_id = get(metricData, ['existing_data', '_id']);
  const errorMessage = {
    label: get(err_l_field, [`${existing_id},label`], null),
    field_uuid: get(err_l_field, [`${existing_id},field_uuid`], null),
  };

  const getOptionList = () => {
    const optionListData = cloneDeep(lstAllFields);
    const selectedMetric = cloneDeep(list);
    return optionListData.filter((list) => !selectedMetric.some((metric) => list._id === metric._id && list.field_uuid !== currentField && list.field_uuid !== metricData.field_uuid));
  };

  const onButtonAction = (action) => {
    let metric_field = cloneDeep(metricData);
    const clonedMetrics = cloneDeep(metricsDataList.metrics);
    let updatedMetricFields = cloneDeep(clonedMetrics.metric_fields);
    let isUpdated = false;
    switch (action) {
      case METRIC_BUTTON_ACTION.EDIT:
          metric_field.is_edit = true;
          clonedMetrics.err_l_field = { ...err_l_field, ...validateMetric(metric_fields, existing_id) };
          isUpdated = true;
          break;

      case METRIC_BUTTON_ACTION.DELETE:
      case METRIC_BUTTON_ACTION.CANCEL:
        const lstMetrics = updatedMetricFields.map((metricData, i) => {
          if (
            (action === METRIC_BUTTON_ACTION.CANCEL) ?
               !has(metricData, ['is_add'], false) :
               index !== i) return metricData;
          return null;
        });
        updatedMetricFields = compact(lstMetrics);
        metric_field = [];
        clonedMetrics.isShowMetricAdd = false;

        if (action === METRIC_BUTTON_ACTION.CANCEL) {
          has(clonedMetrics, ['err_l_field', `${existing_id},label`], false) &&
            delete clonedMetrics.err_l_field[`${existing_id},label`];
          has(clonedMetrics, ['err_l_field', `${existing_id},field_uuid`], false) &&
            delete clonedMetrics.err_l_field[`${existing_id},field_uuid`];
        }

        isUpdated = true;
        break;

      case METRIC_BUTTON_ACTION.DISCARD:
          (!isEmpty(metric_field)) && delete metric_field.is_edit;
          metric_field = {
            ...(metric_field || {}),
            ...(metric_field.existing_data || {}),
          };
          has(clonedMetrics, ['err_l_field', `${existing_id},label`], false) &&
            delete clonedMetrics.err_l_field[`${existing_id},label`];
          has(clonedMetrics, ['err_l_field', `${existing_id},field_uuid`], false) &&
            delete clonedMetrics.err_l_field[`${existing_id},field_uuid`];

          isUpdated = true;
          break;

      case METRIC_BUTTON_ACTION.SAVE:
      case METRIC_BUTTON_ACTION.ADD:
        onSaveHandler(metricData, action);
        break;
      default:
          break;
    }
    if (isUpdated) {
      updatedMetricFields = getUpdatedMetricFields(updatedMetricFields, metric_field);
      clonedMetrics.metric_fields = updatedMetricFields;
      onDataListStateChange(clonedMetrics, 'metrics');
    }
  };

  const onEditClickHandler = () => onButtonAction(METRIC_BUTTON_ACTION.EDIT);

  const onDeleteClickHandler = () => onButtonAction(METRIC_BUTTON_ACTION.DELETE);

  const onFieldChangeHandler = (event) => {
    setCurrentField(event?.target?.field_uuid);
    onChangeHandler(event, metricData.existing_data.field_uuid);
  };

  const getCardMainContent = () => {
    if (metricData.is_edit || metricData.is_add) {
      let button_actions = null;
      const buttons = (metricData.is_edit) ? {
        primary: METRIC_BUTTON_ACTION.SAVE,
        secondary: METRIC_BUTTON_ACTION.DISCARD,
      } : {
        primary: METRIC_BUTTON_ACTION.ADD,
        secondary: METRIC_BUTTON_ACTION.CANCEL,
      };
      const colorSchema = colorSchemeDefault;
       button_actions = (
          <>
              <Button
                type={EButtonType.OUTLINE_SECONDARY}
                onClickHandler={() => onButtonAction(buttons.secondary)}
                size={EButtonSizeType.SM}
                buttonText={buttons.secondary}
                className={cx(styles.ActionBtn, styles.SecondaryBtn)}
                noBorder
                colorSchema={colorSchema}
              />
              <Button
                type={EButtonType.OUTLINE_SECONDARY}
                onClickHandler={() => onButtonAction(buttons.primary)}
                size={EButtonSizeType.SM}
                buttonText={buttons.primary}
                className={cx(styles.ActionBtn, styles.PrimaryBtn)}
                noBorder
                colorSchema={colorSchema}
              />
          </>
        );
   const hasSelectedValueInLst = !isEmpty(lstAllFields) && (
          (lstAllFields || []).some((eachField) => eachField.field_uuid === metricData.field_uuid)
        );
      return (
          <div className={cx(gClasses.CenterV, styles.MetricMainContent, BS.JC_BETWEEN)}>
            {console.log('gasdgasfgas', getOptionList(), hasSelectedValueInLst, metricData)}
            <Dropdown
              id={FIELD.METRICS.ID}
              optionList={getOptionList()}
              innerClass={cx(styles.BgWhite)}
              selectedValue={hasSelectedValueInLst ?
                                  metricData.field_uuid :
                                  getFieldLabelWithRefName(metricData?.field_name, metricData?.reference_name)}
              onChange={onFieldChangeHandler}
              // onKeyDownHandler={onFieldChangeHandler}
              className={cx(gClasses.MR16, styles.Dropdown)}
              innerClassName={cx(styles.BgWhite)}
              hideLabel
              hideMessage={!errorMessage.field_uuid}
              placeholder={FIELD.METRICS.PLACEHOLDER}
              errorMessage={errorMessage.field_uuid}
              errorMessageClassName={BS.MB_0}
              disableClass={styles.BgWhite}
              hasMore={hasMore}
              strictlySetSelectedValue
              selectedLabelClass={cx(styles.BgWhite)}
              isPaginated
              disableFocusFilter
              enableSearch
              loadDataHandler={onLoadMoreData}
              onSearchInputChange={onSearchFieldData}
              showNoDataFoundOption
              setSelectedValue={!hasSelectedValueInLst}
            />
            <Input
              id={FIELD.ALTERNATE_LABEL.ID}
              onChangeHandler={onFieldChangeHandler}
              className={cx(styles.Input)}
              inputContainerClasses={styles.BgWhite}
              inneinputContainerClasses={styles.FieldCommonProperties}
              hideLabel
              hideMessage={!errorMessage.label}
              innerClass={styles.BgWhite}
              placeholder={t(FIELD.ALTERNATE_LABEL.PLACEHOLDER)}
              value={metricData.label}
              errorMessage={errorMessage.label}
              errorMessageClassName={BS.MB_0}
            />
            <div className={cx(BS.D_FLEX, BS.ALIGN_ITEMS_START, styles.BtnContainer)}>
            {button_actions}
            </div>
          </div>
          );
  }
    return (
      <div
        className={cx(
          gClasses.FTwo13GrayV3,
          gClasses.FlexGrow1,
          gClasses.WordBreakBreakWord,
        )}
      >
        {consolidated_label}
      </div>
    );
  };

  const icons = (metricData.is_edit || metricData.is_add) ? null : (
    <div className={cx(gClasses.CenterV, gClasses.ML15)} role="presentation">
        <button
          className={cx(gClasses.CenterVH, gClasses.MR15)}
          onClick={onEditClickHandler}
          aria-label="Edit Metrics"
        >
          <EditIconV2
            className={cx(styles.EditIcon)}
            title={t(METRICS.EDIT_DASHBOARD_DATA_LABEL)}
          />
        </button>
        <button
          className={cx(gClasses.CenterVH)}
          onClick={onDeleteClickHandler}
          aria-label="Delete Metrics"
        >
          <Trash
            className={cx(styles.DeleteIcon)}
            title={t(METRICS.DELETE_DASHBOARD_DATA_LABEL)}
          />
        </button>
    </div>
  );

  return (
    <div
      className={cx(
        gClasses.InputBorder,
        styles.Container,
        BS.P_RELATIVE,
        gClasses.MB5,
        isFieldDeleted && gClasses.ErrorInputBorder,
      )}
    >
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, styles.Header)}>
        <div className={cx(gClasses.P0, BS.W100)}>
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
            <div
              className={cx(
                styles.StepNumber,
                gClasses.CenterVH,
                gClasses.FTwo13White,
                gClasses.FontWeight500,
                gClasses.FlexShrink0,
                gClasses.MR24,
              )}
            >
              {index + 1}
            </div>
            {getCardMainContent()}
          </div>
        </div>
        {icons}
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Metric);
