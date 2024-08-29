import React from 'react';
import { TableAlignOption } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './MLModels.module.scss';
import modelOutputStyles from './model_details/ModelDetails.module.scss';
import { translateFunction } from '../../utils/jsUtility';
import { ML_MODEL_STRINGS } from './MLModels.strings';
import { EMPTY_STRING, NA } from '../../utils/strings/CommonStrings';
import { MODEL_LIST_CONSTANTS, VIEW_LABELS, ML_MODEL_DESC_ELLIPSIS_CHARS, SENTIMENT_ANALYSIS_OUTPUT } from './MlModels.constants';
import * as ROUTE_CONSTANTS from '../../urls/RouteConstants';
import { getRouteLink } from '../../utils/UtilityFunctions';

export const getModelListHeaders = (t = translateFunction) => [
  {
    label: ML_MODEL_STRINGS(t).MODEL_LIST.TBL_COL_MODEL_NAME,
    id: MODEL_LIST_CONSTANTS.TABLE.DATA_FIELD.MODEL_NAME,
    widthWeight: 20,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
      isChangeIconColorOnHover: true,
    },
  },
  {
    label: ML_MODEL_STRINGS(t).MODEL_LIST.TBL_COL_MODEL_DESC,
    id: MODEL_LIST_CONSTANTS.TABLE.DATA_FIELD.MODEL_DEC,
    widthWeight: 35,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
    },
  },
  // commented models used in
  // {
  //   label: ML_MODEL_STRINGS(t).MODEL_LIST.TBL_COL_MODEL_USED_IN,
  //   id: MODEL_LIST_CONSTANTS.TABLE.DATA_FIELD.MODEL_USED_IN,
  //   widthWeight: 25,
  //   headerStyleConfig: {
  //     align: TableAlignOption.MIDDLE,
  //   },
  //   bodyStyleConfig: {
  //     align: TableAlignOption.MIDDLE,
  //   },
  // },
];

export const getDataFieldValue = (model, dataField) => {
  switch (dataField) {
    case MODEL_LIST_CONSTANTS.TABLE.DATA_FIELD.MODEL_NAME:
      return (model?.model_name || NA);
    case MODEL_LIST_CONSTANTS.TABLE.DATA_FIELD.MODEL_DEC:
      return (model?.model_description || NA);
    case MODEL_LIST_CONSTANTS.TABLE.DATA_FIELD.MODEL_USED_IN:
      return (model?.model_used_in || NA);
    default: return EMPTY_STRING;
  }
};

export const getMLModelsBreadcrumb = (model_name, history) => {
  const defaultRoute = `${ROUTE_CONSTANTS.ML_MODELS}`;
  return [
    {
      text: VIEW_LABELS.ML_Models,
      route: getRouteLink(defaultRoute, history),
      className: styles.BreadcrumbText,
    },
    {
      text: model_name,
      isText: true,
      className: styles.BreadcrumbText,
    },
  ];
};

export const generateContent = (content, maxChar, buttonText, showFullText) => {
  console.log('generateContent ', content);
  if (content) {
    if (content.length <= ML_MODEL_DESC_ELLIPSIS_CHARS.MAX) {
      return content;
    } else if (content.length > ML_MODEL_DESC_ELLIPSIS_CHARS.MAX && !showFullText) {
      return (
        <div>
          {`${content.slice(0, ML_MODEL_DESC_ELLIPSIS_CHARS.MAX)}...`}
          {buttonText}
        </div>
      );
    } else {
      return (
        <div>
          {content}
          {buttonText}
        </div>
      );
    }
  } else {
    return null;
  }
};

export const getFormattedText = (text) => {
  if (!text || text.trim() === '') {
    return { formattedText: '', className: '' }; // Return default values for empty text
  }

  let formattedText = text?.replace(/_/g, ' ');
  formattedText = formattedText.replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
  // formattedText = formattedText.charAt(0).toUpperCase() + formattedText.slice(1);

  let className = '';
  if (text.toLowerCase().includes(SENTIMENT_ANALYSIS_OUTPUT.POSITIVE)) {
    className = modelOutputStyles.ModelTextOutputPositive;
  } else if (text.toLowerCase().includes(SENTIMENT_ANALYSIS_OUTPUT.NEGATIVE)) {
      className = modelOutputStyles.ModelTextOutputNegative;
  } else {
      className = modelOutputStyles.ModelTextOutputNeutral;
  }

  return { formattedText, className };
};

export const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
