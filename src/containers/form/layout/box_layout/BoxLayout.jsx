import React, { useRef } from 'react';
import cx from 'classnames';
import { useDrag } from 'react-dnd';
import RowLayout from '../row_layout/RowLayout';
import gClasses from '../../../../scss/Typography.module.scss';
import { constructSinglePath } from '../../sections/form_layout/FormLayout.utils';
import { FORM_LAYOUT_TYPE, FORM_TYPE } from '../../Form.string';
import { COMMA } from '../../../../utils/strings/CommonStrings';
import styles from './BoxLayout.module.scss';
import DragIcon from '../../../../assets/icons/form_fields/DragIcon';
import LayoutDropZone from '../layout_drop_zone/LayoutDropZone';

function BoxLayout(props) {
    const { layout, path, ...remainingProps } = props;
    const { formType, sectionUUID, onDropHandler } = remainingProps;
    const isCreationForm = (formType === FORM_TYPE.CREATION_FORM);
    const ref = useRef();
    const [, drag] = useDrag({
        type: FORM_LAYOUT_TYPE.BOX,
        canDrag: isCreationForm,
        item: { type: FORM_LAYOUT_TYPE.BOX, sectionUUID, path, data: layout },
    });

    const boxLayoutStyle = {
      backgroundColor: layout.bg_color,
      // backgroundImage: `url(${layout.image_url})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };

   drag(ref);

   const getAllBoxLayouts = (layout) =>
     layout.children.map((rowLayout, idx) => (
       <>
         <LayoutDropZone
           id={idx}
           type={FORM_LAYOUT_TYPE.ROW}
           dropPath={[path, constructSinglePath(idx, FORM_LAYOUT_TYPE.ROW)].join(COMMA)}
           sectionUUID={sectionUUID}
           onDrop={onDropHandler}
           formType={formType}
           accept={[]}
         />
         <RowLayout
           {...remainingProps}
           path={[path, constructSinglePath(idx, FORM_LAYOUT_TYPE.ROW)].join(COMMA)}
           layout={rowLayout}
           isRecursiveLayout
         />
       </>
     ));

    return (
      <div
        id={path}
        ref={ref}
        style={boxLayoutStyle}
        className={cx(
          gClasses.P8,
          gClasses.DisplayFlex,
          gClasses.FlexDirectionColumn,
          gClasses.Gap8,
          gClasses.PositionRelative,
          styles.BoxLayout,
          { [gClasses.CursorGrab]: isCreationForm },
        )}
      >
        {isCreationForm && (
          <button className={styles.DragButton}>
            <DragIcon />
          </button>
        )}
        {getAllBoxLayouts(layout)}
        <LayoutDropZone
          id={layout.children.length}
          type={FORM_LAYOUT_TYPE.ROW}
          dropPath={path}
          sectionUUID={sectionUUID}
          onDrop={onDropHandler}
          formType={formType}
          accept={[]}
        />
      </div>
    );
}

export default BoxLayout;
