import React, { useMemo, useRef } from 'react';
import cx from 'classnames';
import { useDrag } from 'react-dnd';
import { ETooltipType, ETooltipPlacements, Tooltip, Text } from '@workhall-pvt-lmt/wh-ui-library';
import styles from '../FormFieldsList.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { FORM_LAYOUT_TYPE, FORM_TYPE } from '../../../Form.string';
import { RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';

function DraggableFieldIcon(props) {
   const { field, formType } = props;
   const ref = useRef();

   const [type, item] = useMemo(() => {
    let type = FORM_LAYOUT_TYPE.FIELD_TEMPLATE;
    let item = {
      type: FORM_LAYOUT_TYPE.FIELD_TEMPLATE,
      [RESPONSE_FIELD_KEYS.FIELD_TYPE]: field?.type,
    };

     if (field?.type === FORM_LAYOUT_TYPE.LAYOUT) {
      type = FORM_LAYOUT_TYPE.LAYOUT;
      item = {
         type: FORM_LAYOUT_TYPE.LAYOUT,
         [RESPONSE_FIELD_KEYS.LAYOUT_TYPE]: field?.layoutType,
       };
     }

     return [type, item];
   }, []);

   const [, drag] = useDrag({
      type,
      canDrag: (formType === FORM_TYPE.CREATION_FORM),
      item,
   });

   drag(ref);
   return (
    <Tooltip
      text={
        <div className={gClasses.TextAlignLeft}>
          <div className={cx(gClasses.FTwo13, gClasses.MB4)}>{field.elementName}</div>
          <div className={gClasses.FTwo11}>{field.elementDesc}</div>
        </div>
      }
      tooltipType={ETooltipType.INFO}
      tooltipPlacement={ETooltipPlacements.TOP}
      icon={
        <div
          ref={ref}
          key={field.type}
          id={field.type}
          className={cx(styles.DragElement, gClasses.CenterVH)}
        >
          {/* <div> */}
            <field.icon className={styles.IconStyle} />
            <Text
              className={cx(gClasses.FTwo12BlackV18, gClasses.MT4, gClasses.TextAlignCenter)}
              content={field.elementName}
            />
          {/* </div> */}
        </div>
      }
      enableDelay
    />
   );
}

export default DraggableFieldIcon;
