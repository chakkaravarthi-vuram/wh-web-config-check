import React, { useState } from 'react';
import Radium from 'radium';

import AutoPositioningPopper from '../auto_positioning_popper/AutoPositioningPopper';
import styles from './Table.module.scss';

function TableRowWithPopper(props) {
  const {
    rowData,
    id,
    index,
    children,
    rowClassName,
    onRowClick,
    popperClassName,
    popperPlacement,
    popperAllowedAutoPlacements,
    popperFixedStrategy,
    popperShowTooltip,
    isDataListEntryTable,
    isTestBed = false,
  } = props;
  const [referencePopperElement, setReferencePopperElement] = useState(null);
  const [isPopperVisible, setPopperVisiblity] = useState(false);
  return (
      <tr
        tabIndex={0}
        key={`table_row_${index}`}
        ref={setReferencePopperElement}
        onMouseDown={() =>
          isDataListEntryTable ? onRowClick(id) : onRowClick()
        }
        onMouseLeave={() => {
          console.log('rerendering..... mouseleave');
          if (isPopperVisible) {
            setPopperVisiblity(false);
            // onPopupBlur();
          }
        }}
        onMouseEnter={() => {
          // onRowHover(id);
          setPopperVisiblity(true);
        }}
        className={rowClassName}
      >
        {rowData}
        <td className={styles.PopperRow}>
        <AutoPositioningPopper
          className={popperClassName}
          placement={popperPlacement}
          allowedAutoPlacements={popperAllowedAutoPlacements}
          fixedStrategy={popperFixedStrategy}
          referenceElement={referencePopperElement}
          isPopperOpen={isPopperVisible && !isTestBed}
          showTooltip={popperShowTooltip}
        >
          {children}
        </AutoPositioningPopper>
        </td>
      </tr>
  );
}

export default Radium(TableRowWithPopper);
