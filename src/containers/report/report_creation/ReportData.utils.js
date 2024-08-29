import jsUtility, { formatLocale, formatter, getLocale } from '../../../utils/jsUtility';
import {
  COMMA,
  EMPTY_STRING,
  FLOW_DASHBOARD_DATE_TIME,
  FLOW_SHORTCUT,
  NA,
  SPACE,
  UNDERSCORE,
} from '../../../utils/strings/CommonStrings';
import { FIELD_TYPE } from '../../../utils/constants/form_fields.constant';
import { getFormattedDateFromUTC } from '../../../utils/dateUtils';
// for June Sprint we need this LinkField component
// import LinkField from '../../../components/form_components/link_field/LinkField';
import { store } from '../../../Store';
import { fieldYesNoData, getOutputKey } from './ReportCreation.utils';
import { AGGREGATE_SUM_AVG_TYPE, AGGREGATE_TYPE } from '../Report.strings';

const getYesOrNoByMetricData = (metricData, nA, isMeasure = false) => {
  if (metricData) {
    if (!isMeasure) {
      const yesOrNoLabel =
        metricData === fieldYesNoData[0].label
          ? fieldYesNoData[0].label
          : fieldYesNoData[1].label;
      return yesOrNoLabel;
    } else return metricData;
  }
  return nA;
};

const getDateTimeByMetricData = (metricData, isDateTime, nA) => {
  const getDate = getFormattedDateFromUTC(
    metricData,
    isDateTime ? FLOW_DASHBOARD_DATE_TIME : FLOW_SHORTCUT,
  );
  const dateTime = getDate === 'Invalid date' ? nA : getDate || nA;
  return dateTime;
};

const getPickerByMetricData = (metricData, nA) => {
  if (!jsUtility.isEmpty(metricData)) {
    if (jsUtility.isArray(metricData)) {
      const pickerList = metricData.flat(Infinity).join(', ');
      return pickerList;
    } else return metricData.toString();
  }
  return nA;
};

export const getFormatNumberByLocate = (number) => {
  const accountLocale = formatLocale(store.getState().RoleReducer.acc_locale);
  const formattedValue = formatter(number, accountLocale);
  return formattedValue;
};

const getNumberByMetricData = (metricData, options) => {
  const { nA, isDigitFormatted = false } = options;
  const numberMetricData = Number(metricData);
  if (jsUtility.isEmpty(metricData) || jsUtility.isNaN(numberMetricData)) {
    return metricData ?? nA;
  } else {
    const formattedMetricData =
      numberMetricData || numberMetricData === 0
        ? jsUtility.round(parseFloat(numberMetricData), 2) || 0
        : nA;
    const numberValue = isDigitFormatted
      ? getFormatNumberByLocate(formattedMetricData)
      : formattedMetricData;
    return numberValue;
  }
};

const getCurrencyByMetricData = (metricData, nA, isStats = false) => {
  if (isStats) return jsUtility.round(metricData, 2) ?? nA;
  else if (metricData) {
    const number = jsUtility.round(
      metricData.replace(/[^\d.-]/g, EMPTY_STRING),
      2,
    );
    const currencyCode = metricData.replace(/[^a-z]/gi, EMPTY_STRING);
    if ((number || number === 0) && currencyCode) {
      const currencyData = `${currencyCode} ${formatter(
        number,
        getLocale(currencyCode),
      )}`;
      return currencyData ?? nA;
    }
  }
  return nA;
};

const getLinkByMetricData = (metricData, nA) => {
  let linkData = metricData;
  if (jsUtility.isObject(metricData)) {
    linkData = [metricData];
  }
  if (!jsUtility.isEmpty(linkData) && jsUtility.isArray(linkData)) {
    // for June Sprint we need this LinkField component
    // strData = (
    //   <LinkField
    //     links={linkData}
    //     hideLabel
    //     isNameWithHyperlink
    //     readOnly
    //   />
    // );
    const linkTexts = linkData.map((link) => link.link_text).join(', ');
    return linkTexts;
  }
  return nA;
};

const getMetricDataByType = (type, metricData, options = {}) => {
  const { nA = NA } = options;
  let strData;
  switch (type) {
    case FIELD_TYPE.BOOLEAN:
    case FIELD_TYPE.YES_NO:
      strData = getYesOrNoByMetricData(metricData, nA, options.isMeasure);
      break;
    case FIELD_TYPE.DATE:
      strData = getDateTimeByMetricData(metricData, false, nA);
      break;
    case FIELD_TYPE.DATETIME:
      strData = getDateTimeByMetricData(metricData, true, nA);
      break;
    case FIELD_TYPE.USER_TEAM_PICKER:
    case FIELD_TYPE.DATA_LIST:
      strData = getPickerByMetricData(metricData, nA);
      break;
    case FIELD_TYPE.PARAGRAPH:
    case FIELD_TYPE.SINGLE_LINE:
      strData = metricData || nA;
      break;
    case FIELD_TYPE.NUMBER:
      strData = getNumberByMetricData(metricData, { nA, ...options });
      break;
    case FIELD_TYPE.CURRENCY:
      strData = getCurrencyByMetricData(metricData, nA, options.isStats);
      break;
    case FIELD_TYPE.LINK: {
      strData = getLinkByMetricData(metricData, nA);
      break;
    }
    default:
      if (jsUtility.isArray(metricData) && metricData.length > 0) {
        strData = metricData.join(COMMA + SPACE);
      } else {
        strData = metricData || nA;
      }
      break;
  }
  return strData;
};

const colorList = [
  '#0073e6',
  '#3399ff',
  '#99ccff',
  '#00cc44',
  '#1aff66',
  '#80ffaa',
  '#ffcc00',
  '#ffdb4d',
  '#ffeb99',
  '#ff704d',
  '#ffad99',
  '#ffd6cc',
  '#9933ff',
  '#cc66ff',
  '#ff99ff',
  '#ff5050',
  '#ff8080',
  '#ffcccb',
  '#8c1aff',
  '#ff66b3',
  '#ccffcc',
  '#ccff99',
  '#99ffcc',
  '#ccffdd',
  '#ff6666',
  '#ffb366',
  '#ffff66',
  '#66ff66',
  '#66ccff',
  '#ff99cc',
  '#ff66ff',
  '#e6e6e6',
];

const getChartDataData = (
  outputValue,
  fieldType,
  aggregation_type,
  ddMonthYearSelectedValue,
  is_digit_formatted,
  is_roundup,
) => {
  let data;
  if (
    ddMonthYearSelectedValue &&
    ddMonthYearSelectedValue !== AGGREGATE_TYPE.NONE
  ) {
    data = is_digit_formatted
      ? getMetricDataByType(fieldType, outputValue, {
          nA: 0,
          isStats: true,
        })
      : outputValue;
  } else {
    const measureData = outputValue;
    const isMetric = !is_roundup && measureData && !Number.isNaN(measureData);
    const nA = AGGREGATE_SUM_AVG_TYPE.includes(aggregation_type) ? 0 : NA;
    if (isMetric) {
      data = getMetricDataByType(
        is_digit_formatted ? fieldType : FIELD_TYPE.CURRENCY,
        measureData,
        {
          nA,
          isStats: true,
        },
      );
    } else {
      data = measureData ?? nA;
    }
  }
  return data;
};

const getChartDataLabel = (
  outputValue,
  ddMonthYearSelectedValue,
  fieldType,
  is_digit_formatted,
) => {
  let label;
  if (
    ddMonthYearSelectedValue &&
    ddMonthYearSelectedValue !== AGGREGATE_TYPE.NONE
  ) {
    label = outputValue || NA;
  } else if (fieldType === FIELD_TYPE.LINK) {
    label = outputValue?.link_text ?? NA;
  } else {
    label = getMetricDataByType(fieldType, outputValue, {
      isDigitFormatted: is_digit_formatted,
    });
  }
  return label;
};

const getChartsIsShow = (inputFieldsForReport) => {
  const chartIsShow = {
    isBarBtn: false,
    isPieBtn: false,
    isTableBtn: true,
    isGroupedBar: false,
    isStatsBtn: false,
    isShowTotalBasedOnMeasureCount: false,
  };

  const arrDimensions = [];
  const arrMeasures = [];
  if (
    jsUtility.isArray(inputFieldsForReport) &&
    inputFieldsForReport.length > 0
  ) {
    inputFieldsForReport.forEach((dimensions) => {
      const { dimension_field, isMeasure, measureDimension, axis } = dimensions;
      if (axis !== 'x' && isMeasure) {
        arrMeasures.push(measureDimension);
      } else {
        arrDimensions.push(dimension_field);
      }
    });
  }

  // Show Total Disabled based on Measures Count
  if (arrMeasures.length > 0) {
    chartIsShow.isShowTotalBasedOnMeasureCount = true;
  }

  // Table -> Rule -> More than one Dimension, One or more Aggregate
  if (arrDimensions.length > 1 && arrMeasures.length > 1) {
    chartIsShow.isBarBtn = false;
    chartIsShow.isPieBtn = false;
    chartIsShow.isTableBtn = true;
    chartIsShow.isStatsBtn = false;
    return chartIsShow;
  }

  // Grouped Bar -> Rule -> One Dimension, More than one Measure
  if (arrDimensions.length === 1 && arrMeasures.length > 1) {
    chartIsShow.isBarBtn = false;
    chartIsShow.isPieBtn = false;
    chartIsShow.isTableBtn = true;
    chartIsShow.isGroupedBar = true;
    chartIsShow.isStatsBtn = false;
    return chartIsShow;
  }

  // single Bar & Pie -> Rule -> One Dimension, One Aggregate
  if (arrDimensions.length === 1 && arrMeasures.length === 1) {
    chartIsShow.isBarBtn = true;
    chartIsShow.isPieBtn = true;
    chartIsShow.isTableBtn = true;
    chartIsShow.isGroupedBar = false;
    chartIsShow.isStatsBtn = false;
    return chartIsShow;
  }

  // Stats -> Rule -> One Aggregate
  if (arrDimensions.length === 0 && arrMeasures.length === 1) {
    chartIsShow.isBarBtn = false;
    chartIsShow.isPieBtn = false;
    chartIsShow.isTableBtn = false;
    chartIsShow.isGroupedBar = false;
    chartIsShow.isStatsBtn = true;
    return chartIsShow;
  }

  return chartIsShow;
};

export const getChartData = (chart_data, inputFieldsForReport) => {
  const chartData = { label: [], data: [] };

  if (
    !jsUtility.isEmpty(chart_data) &&
    jsUtility.isArray(chart_data) &&
    chart_data.length > 0
  ) {
    const { isGroupedBar } = getChartsIsShow(inputFieldsForReport);

    // Single Bar & Pie then GroupedBar Chart
    if (inputFieldsForReport.length > 0) {
      inputFieldsForReport.forEach((dimensions, index) => {
        const { fieldDisplayName } = dimensions;
        const dataSetName = fieldDisplayName;
        const colorPallet = isGroupedBar ? colorList[index] : colorList;
        chartData.data.push({
          label: dataSetName,
          backgroundColor: colorPallet,
          borderColor: colorPallet,
          borderWidth: 1,
          data: [],
        });
      });

      chart_data.forEach((cData) => {
        inputFieldsForReport.forEach((dimensions, index) => {
          const {
            isMeasure,
            fieldType,
            ddMonthYearSelectedValue,
            output_key,
            aggregation_type,
            axis,
            is_digit_formatted,
            is_roundup,
          } = dimensions;
          const outputKey = getOutputKey(output_key, aggregation_type);
          const outputValue = cData[outputKey];
          const isDateTimeField = [
            FIELD_TYPE.DATE,
            FIELD_TYPE.DATETIME,
          ].includes(fieldType);
          if (
            isMeasure &&
            (!isDateTimeField || (isDateTimeField && axis === 'y'))
          ) {
            const isNumberData = !jsUtility.isNaN(Number(outputValue));
            if (isNumberData) {
              const data = getChartDataData(
                outputValue,
                fieldType,
                aggregation_type,
                ddMonthYearSelectedValue,
                is_digit_formatted,
                is_roundup,
              );
              chartData.data[index].data.push(data || 0);
            }
          } else {
            const label = getChartDataLabel(
              outputValue,
              ddMonthYearSelectedValue,
              fieldType,
              is_digit_formatted,
            );
            chartData.label.push(label);
          }
        });
      });
    }

    if (chartData.data && chartData.data.length > 0) {
      chartData.data = chartData.data.filter((cData) => cData.data.length > 0);
    }
  }
  return chartData;
};

export const getChartDataForBreakDown = (chart_data, inputFieldsForReport) => {
  const chartData = { label: [], data: [] };
  const uniqueLabels = [];
  chart_data.forEach((item) => {
    const keyEndingWith = (key, search) => key.endsWith(search);

    const breakdownKey = Object.keys(item).find((key) =>
      keyEndingWith(key, '_breakdown'),
    );
    if (breakdownKey) {
      const breakdownData = item[breakdownKey];
      breakdownData.forEach((subItem) => {
        const { label } = subItem;
        if (!uniqueLabels.includes(label)) {
          uniqueLabels.push(label);
        }
      });
    }
  });

  chartData.data = uniqueLabels.map((item, index) => {
    const colorPallet = colorList[index];
    return {
      label: item ?? NA,
      backgroundColor: colorPallet,
      borderColor: colorPallet,
      borderWidth: 1,
      data: Array(chart_data.length).fill(0),
    };
  });
  chart_data.forEach((item, index) => {
    const keyEndingWith = (key, search) => key.endsWith(search);
    const breakdownKey = Object.keys(item).find((key) =>
      keyEndingWith(key, '_breakdown'),
    );
    if (breakdownKey) {
      const breakdownData = item[breakdownKey];
      breakdownData.forEach((subItem) => {
        const { label } = subItem;
        const matchingDataItemIndex = chartData.data.findIndex(
          (dataItem) => dataItem.label === (label ?? NA),
        );
        if (matchingDataItemIndex !== -1) {
          chartData.data[matchingDataItemIndex].data[index] = subItem.value;
        }
      });
    }
  });

  chart_data.forEach((cData) => {
    inputFieldsForReport.forEach((dimensions) => {
      const {
        isMeasure,
        fieldType,
        ddMonthYearSelectedValue,
        output_key,
        aggregation_type,
        is_digit_formatted,
      } = dimensions;
      const _output_key = getOutputKey(output_key, aggregation_type);
      if (
        !isMeasure ||
        [FIELD_TYPE.DATE, FIELD_TYPE.DATETIME].includes(fieldType)
      ) {
        const label = getChartDataLabel(
          cData[_output_key],
          ddMonthYearSelectedValue,
          fieldType,
          is_digit_formatted,
        );
        chartData.label.push(label);
      }
    });
  });
  return chartData;
};

export const getRollupNumericData = (chart_data, inputFieldsForReport) => {
  const chartData = { label: [], data: [] };
  const nA = 'N/A';
  const isStats = true;
  if (
    !jsUtility.isEmpty(chart_data) &&
    jsUtility.isArray(chart_data) &&
    chart_data.length > 0
  ) {
    // Stats Data
    jsUtility.isArray(inputFieldsForReport) &&
      inputFieldsForReport.forEach((cDimension) => {
        const {
          isMeasure,
          output_key,
          fieldDisplayName,
          aggregation_type,
          is_digit_formatted,
        } = cDimension;
        const _output_key = getOutputKey(output_key, aggregation_type);
        let { fieldType } = cDimension;
        if (isMeasure) {
          if (
            fieldType !== FIELD_TYPE.NUMBER ||
            fieldType !== FIELD_TYPE.CURRENCY
          ) {
            fieldType = FIELD_TYPE.NUMBER;
          }
          chartData.label.push(fieldDisplayName);
          chartData.data.push(
            chart_data &&
              chart_data.length > 0 &&
              getMetricDataByType(fieldType, chart_data[0][_output_key], {
                nA,
                isStats,
                isDigitFormatted: is_digit_formatted,
              }),
          );
        }
      });
  }
  return chartData;
};

const getTableDataData = (outputValue, currencyTypeValue, field) => {
  const { type, isMeasure, aggregation_type, is_digit_formatted, is_roundup } =
    field;
  let data = outputValue;
  if (isMeasure) {
    if ([FIELD_TYPE.DATE, FIELD_TYPE.DATETIME].includes(type)) {
      data = outputValue || NA;
      return data;
    }
    if (!is_roundup) {
      data = getMetricDataByType(type, data, {
        nA: AGGREGATE_SUM_AVG_TYPE.includes(aggregation_type) ? 0 : NA,
        isStats: true,
        isDigitFormatted: is_digit_formatted,
        isMeasure: true,
      });
    }
    if (
      type === FIELD_TYPE.CURRENCY &&
      aggregation_type !== AGGREGATE_TYPE.COUNT
    ) {
      data = `${currencyTypeValue} ${data}`;
    }
  } else {
    data = getMetricDataByType(type, data, {
      isDigitFormatted: is_digit_formatted,
    });
  }
  return data;
};

export const getTabularData = (
  pagination_data,
  inputFieldsForReport,
  show_total = {},
) => {
  const chartData = { label: [], data: [], isCurrencyTypeSameFormat: false };
  if (
    !jsUtility.isEmpty(pagination_data) &&
    jsUtility.isArray(pagination_data) &&
    pagination_data.length > 0
  ) {
    const chartFieldWithType = [];
    jsUtility.isArray(inputFieldsForReport) &&
      inputFieldsForReport.forEach((cDimension) => {
        const {
          fieldType,
          label,
          fieldDisplayName,
          isMeasure,
          query_to_pass,
          output_key,
          aggregation_type = AGGREGATE_TYPE.NONE,
          is_digit_formatted,
          is_roundup,
        } = cDimension;
        const labelData = {
          id: output_key,
          label: fieldDisplayName || label,
        };
        chartData.label.push(labelData);
        const _output_key = getOutputKey(output_key, aggregation_type);
        chartFieldWithType.push({
          isMeasure: isMeasure,
          type: fieldType,
          label,
          query_to_pass,
          output_key: _output_key,
          aggregation_type,
          is_digit_formatted,
          is_roundup,
        });
      });

    let arrUniqueCurrencyType = [];
    if (chartFieldWithType.length > 0) {
      const arrCurrencyType = [];
      pagination_data.forEach((pData, index) => {
        const colData = { value: [] };
        chartFieldWithType.forEach((cFieldType) => {
          const { type, aggregation_type } = cFieldType;
          const data = getTableDataData(
            pData[cFieldType.output_key],
            pData[`${cFieldType.output_key}_type`],
            cFieldType,
          );
          if (
            type === FIELD_TYPE.CURRENCY &&
            aggregation_type !== AGGREGATE_TYPE.COUNT
          ) {
            const currencyTypeValue = pData[`${cFieldType.output_key}_type`];
            if (
              currencyTypeValue &&
              !arrCurrencyType.includes(currencyTypeValue)
            ) {
              arrCurrencyType.push(currencyTypeValue);
            }
          }
          colData.value.push(data);
        });
        if (pData?.instance_id || pData?.entry_id) {
          const id = pData?.instance_id || pData?.entry_id;
          colData.id = `${id}${UNDERSCORE}${index}`;
        }
        chartData.data.push(colData);
      });
      arrUniqueCurrencyType = jsUtility.uniq(arrCurrencyType);
      if (arrUniqueCurrencyType.length > 1) {
        chartData.isCurrencyTypeSameFormat = true;
      }
    }

    if (!jsUtility.isEmpty(show_total)) {
      const rowData = { value: [] };
      chartFieldWithType.forEach((pData) => {
        const { output_key } = pData;
        if (jsUtility.has(show_total, output_key)) {
          rowData.value.push(show_total[output_key]);
        } else {
          rowData.value.push(EMPTY_STRING);
        }
      });
      chartData.data.push(rowData);
    }

    return chartData;
  }

  return chartData;
};
