import React from 'react';
import { BorderRadiusVariant, Checkbox, Chip, ETextSize, Text, EChipSize } from '@workhall-pvt-lmt/wh-ui-library';
import { isEmpty } from 'lodash';
import i18next from 'i18next';
import cx from 'classnames';
import gClasses from '../../../scss/Typography.module.scss';
import FieldPicker from '../../../components/form_components/field_picker/FieldPicker';
import jsUtility from '../../../utils/jsUtility';
import { COLOR_CONSTANTS } from '../../../utils/UIConstants';
import { RULE_TYPE } from '../../../utils/constants/rule/rule.constant';
import { FIELD_VISIBILITY_HEADER_STRINGS } from '../field_visibility/FieldVisibilityRule.utils';

const FIELD_VALUE_HEADER_STRINGS = {
  FIELD_NAME: 'default_value_rule_strings.field_visibility_header_strings.field_name',
  CONFIG_TYPE: 'default_value_rule_strings.field_visibility_header_strings.config_type',
  RULE_NAME: 'default_value_rule_strings.field_visibility_header_strings.rule_name',
};

export const CONFIG_OPTIONS = [
  {
    label: 'Configuration Rule',
    value: true,
  },
  {
    label: 'Expression Rule',
    value: false,
  },
];

export const HIDE_DISABLE_OPTIONS = [
  {
    label: 'Hide field',
    value: true,
  },
  {
    label: 'Disable field',
    value: false,
  },
];

export const constructTableHeader = (
  ruleType = null,
  selectAll = false,
  onSelectAllClicked,
  formUUID,
  t = i18next.t,
) => {
  {
    return jsUtility.compact([
      {
        label: '',
        id: 'field_value_checkbox',
        component: (
          <Checkbox
            hideLabel
            details={[{ value: 'selectAll' }]}
            isValueSelected={selectAll}
            onClick={() => onSelectAllClicked(formUUID)}
          />
        ),
        widthWeight: 0.25,
      },
      {
        label: t(FIELD_VALUE_HEADER_STRINGS.FIELD_NAME),
        _id: 'field_name',
        widthWeight: 1.75,
        sortBy: 'name',
      },
      {
        label: t(FIELD_VALUE_HEADER_STRINGS.CONFIG_TYPE),
        _id: 'config_type',
        widthWeight: 1.25,
        sortBy: 'name',
      },
      ruleType === RULE_TYPE.DEFAULT_VALUE
        ? {
            label: t(FIELD_VISIBILITY_HEADER_STRINGS.HIDE_OR_DISABLE),
            _id: 'hide_or_disable',
            widthWeight: 1,
          }
        : null,
      {
        label: t(FIELD_VALUE_HEADER_STRINGS.RULE_NAME),
        _id: 'rule_name',
        widthWeight: 1.25,
        sortBy: 'name',
      },
    ]);
  }
};

export const constructTableData = (
   ruleType = null,
   ruleList = [],
   currentFormUUID,
   isRuleSelected,
   t = i18next.t,
) => {
  if (isEmpty(ruleList)) return [];
  const getEachRow = (ruleDetail = {}) => {
      const isImported = jsUtility.get(ruleDetail, ['form_uuids'], []).includes(currentFormUUID);
      const constructMetadata = (ruleDetail.field_metadata || [])?.map((field) => { return { label: field.field_name }; });
      return {
        id: ruleDetail._id,
        disabled: isImported,
        component: jsUtility.compact([
          <div>
            <Checkbox
              hideLabel
              details={[{ value: ruleDetail._id }]}
              isValueSelected={isImported ? true : isRuleSelected(ruleDetail._id)}
              disabled={isImported}
            />
          </div>,
          <div className={cx(gClasses.CenterV)}>
            <FieldPicker selectedValue={constructMetadata} disabled />
          </div>,
          <Chip
            size={EChipSize.md}
            className={cx(gClasses.CenterVH, gClasses.PY2, gClasses.PX8)}
            textColor={
              isImported ? COLOR_CONSTANTS.GREY_500 : COLOR_CONSTANTS.BLUE_500
            }
            backgroundColor={
              isImported ? COLOR_CONSTANTS.GREY_10 : COLOR_CONSTANTS.BLUE_10
            }
            text={isImported ? t('default_value_rule_strings.existing') : t('default_value_rule_strings.new')}
            borderRadiusType={BorderRadiusVariant.circle}
          />,
          ruleType === RULE_TYPE.DEFAULT_VALUE ? (
            <Text
              className={cx(
                gClasses.WidthFitContent,
                gClasses.WhiteSpaceNoWrap,
              )}
              content={ruleDetail.visibility === 'hide' ? t('default_value_rule_strings.hide') : t('default_value_rule_strings.disable')}
              size={ETextSize.MD}
            />
          ) : null,
          <Text
            className={cx(gClasses.WidthFitContent, gClasses.WhiteSpaceNoWrap)}
            content={ruleDetail.rule_name}
            size={ETextSize.MD}
          />,
        ]),
      };
  };

  const tableBody = ruleList.map((eachApp) => getEachRow(eachApp));
  return tableBody;
};
