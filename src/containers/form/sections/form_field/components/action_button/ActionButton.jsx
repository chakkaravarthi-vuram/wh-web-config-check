import React, { useContext, useState } from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { Button, EButtonType, EToastType, ETooltipPlacements, ETooltipType, toastPopOver, Tooltip } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import ThemeContext from 'hoc/ThemeContext';
import { useTranslation } from 'react-i18next';
import { initiateFlow } from '../../../../../../axios/apiService/flowList.apiService';
import { OPEN_TASKS, TASKS } from '../../../../../../urls/RouteConstants';
import { isEmpty } from '../../../../../../utils/jsUtility';
import {
  openInNewTab,
  somethingWentWrongErrorToast,
} from '../../../../../../utils/UtilityFunctions';
import {
  ACTION_BUTTON_STYLE_TYPE,
  BUTTON_LINK_TYPE,
} from '../../../field_configuration/FieldConfiguration.constants';
import styles from './ActionButton.module.scss';
import { RESPONSE_FIELD_KEYS } from '../../../../../../utils/constants/form/form.constant';

function ActionButton(props) {
  const { fieldDetails, isViewOnly = false, metaData } = props;
  const [hover, setHover] = useState(false);
  const { colorScheme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const onClickLink = async () => {
    if (!isViewOnly) {
      if (
        fieldDetails?.buttonActionType ===
        BUTTON_LINK_TYPE.INTERNAL_EXTERNAL_LINK
      ) {
        if (fieldDetails?.linkURL) {
          openInNewTab(fieldDetails?.linkURL);
        }
      } else if (
        fieldDetails?.buttonActionType === BUTTON_LINK_TYPE.START_SUB_FLOW &&
        !isEmpty(fieldDetails?.triggerUUID) &&
        !isEmpty(fieldDetails?.childFlowUUID)
      ) {
        const params = {
          flow_uuid: fieldDetails?.childFlowUUID,
          is_test_bed: 0,
          parent_id: metaData.instanceId,
          trigger_uuid: fieldDetails.triggerUUID,
        };
        if (!isEmpty(metaData.dataListUUID)) {
          params.parent_data_list_uuid = metaData.dataListUUID;
        } else if (!isEmpty(metaData.flowUUID)) {
          params.parent_flow_uuid = metaData.flowUUID;
        }

        try {
          const res = await initiateFlow(params);
          if (res?.task_log_id) {
            const openTaskIdPathName = `${TASKS}/${OPEN_TASKS}/${res?.task_log_id}`;
            openInNewTab(openTaskIdPathName);
          } else {
            toastPopOver({
              title: t('common_strings.form_popover_strings.flow_initiated_successfully'),
              toastType: EToastType.success,
            });
          }
        } catch (e) {
          somethingWentWrongErrorToast();
        }
      }
    }
  };

  const getLinkComponent = () => {
    const marginClass = !isViewOnly ? cx(gClasses.MT10, gClasses.MT15) : null;
    switch (fieldDetails.buttonStyle) {
      case ACTION_BUTTON_STYLE_TYPE.LINK:
        return (
          <div
            key={
              fieldDetails[RESPONSE_FIELD_KEYS.FIELD_UUID] ||
              fieldDetails?.buttonName
            }
            className={cx(marginClass, gClasses.Ellipsis)}
          >
            <Link
              className={cx(gClasses.FTwo13, gClasses.PL0)}
              style={{
                color: colorScheme?.activeColor,
              }}
              onClick={onClickLink}
            >
              {fieldDetails?.buttonName}
            </Link>
          </div>
        );
      case ACTION_BUTTON_STYLE_TYPE.BUTTON:
      case ACTION_BUTTON_STYLE_TYPE.OUTLINE: {
        const isButton =
          fieldDetails.buttonStyle === ACTION_BUTTON_STYLE_TYPE.BUTTON;
        const onHover = (isIn = false) => {
          if (isViewOnly && isIn && !hover) {
            setHover(true);
          } else if (!isIn && hover) {
            setHover(false);
          }
        };
        return (
          <div
            key={
              fieldDetails[RESPONSE_FIELD_KEYS.FIELD_UUID] ||
              fieldDetails?.buttonName
            }
            onMouseOver={() => onHover(true)}
            onMouseOut={() => onHover()}
            onFocus={() => onHover(true)}
            onBlur={() => onHover()}
            className={cx(marginClass, gClasses.OverflowHiddenImportant)}
          >
          <Tooltip
            id={fieldDetails[RESPONSE_FIELD_KEYS.FIELD_UUID] ||
              fieldDetails?.buttonName}
            text={fieldDetails?.buttonName}
            tooltipType={ETooltipType.INFO}
            tooltipPlacement={ETooltipPlacements.BOTTOM}
            icon={
              <Button
              id={fieldDetails[RESPONSE_FIELD_KEYS.FIELD_UUID] ||
                fieldDetails?.buttonName}
              buttonText={fieldDetails?.buttonName}
              type={isButton ? EButtonType.PRIMARY : EButtonType.SECONDARY}
              onClickHandler={onClickLink}
              className={cx(styles.LinkStyle, {
                [styles.OutlineButton]: !isButton,
              })}
              colorSchema={{
                ...colorScheme,
                activeColor:
                  hover && !isButton
                    ? `${colorScheme?.activeColor}90`
                    : colorScheme?.activeColor,
              }}
              />
            }
          />
          </div>
        );
      }
      default:
        return null;
    }
  };

  return <div>{getLinkComponent()}</div>;
}

export default ActionButton;
