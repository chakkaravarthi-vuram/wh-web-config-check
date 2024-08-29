import React from 'react';
import { useDrag } from 'react-dnd';
import cx from 'classnames';
import {
  ETooltipPlacements,
  ETooltipType,
  Text,
  Tooltip,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { FORM_LAYOUT_TYPE } from '../../../Form.string';
import { RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';
import styles from '../Components.module.scss';
import { FIELD_TYPE } from '../../../../../utils/constants/form.constant';

function DraggableComponent(props) {
  const { componentData } = props;

  const [, drag] = useDrag(() => {
    let type = FORM_LAYOUT_TYPE.EXISTING_FIELD;
    let item = {
      type: FORM_LAYOUT_TYPE.EXISTING_FIELD,
      data: { [RESPONSE_FIELD_KEYS.FIELD_TYPE]: componentData?.type },
    };

    if (componentData?.type === FORM_LAYOUT_TYPE.LAYOUT) {
      type = FORM_LAYOUT_TYPE.LAYOUT;
      item = {
        type: FORM_LAYOUT_TYPE.LAYOUT,
        [RESPONSE_FIELD_KEYS.LAYOUT_TYPE]: componentData?.layoutType,
      };
    }

    return { type, item };
  });

  return (
    <Tooltip
      text={
        <div className={gClasses.TextAlignLeft}>
          <div className={cx(gClasses.FTwo13, gClasses.MB4)}>
            {componentData.elementName}
          </div>
          <div className={gClasses.FTwo11}>{componentData.elementDesc}</div>
        </div>
      }
      tooltipType={ETooltipType.INFO}
      tooltipPlacement={ETooltipPlacements.TOP}
      icon={
        <div
          ref={(node) => drag(node)}
          key={componentData.type}
          id={componentData.type}
          className={styles.DragElement}
        >
          <componentData.icon
            className={cx(styles.IconStyle, {
              [styles.GStickIcon]: [FIELD_TYPE.RICH_TEXT].includes(
                componentData.type,
              ),
            })}
          />
          <Text
            content={componentData.elementName}
            className={cx(gClasses.FontWeight500)}
          />
        </div>
      }
    />
  );
}

export default DraggableComponent;
