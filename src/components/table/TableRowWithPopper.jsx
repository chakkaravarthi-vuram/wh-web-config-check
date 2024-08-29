import React, { useState } from 'react';
import Radium from 'radium';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { ARIA_ROLES } from 'utils/UIConstants';
import cx from 'classnames/bind';
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
    isReassignPopper = false,
    isErrorRow,
  } = props;
  const [referencePopperElement, setReferencePopperElement] = useState(null);
  const [isPopperVisible, setPopperVisibility] = useState(false);
  return (
    <tr
      tabIndex={0}
      key={`table_row_${index}`}
      role={ARIA_ROLES.BUTTON}
      ref={setReferencePopperElement}
      onKeyDown={(e) => {
        e.stopPropagation();
        keydownOrKeypessEnterHandle(e) ? isDataListEntryTable ? onRowClick(id) : onRowClick() : null;
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (e.target.localName === 'a') {
          e.stopPropagation();
        } else {
          isDataListEntryTable ? onRowClick(id) : onRowClick();
        }
      }}
      onMouseLeave={() => {
        if (isPopperVisible) {
          setPopperVisibility(false);
        }
      }}
      onMouseEnter={() => {
        setPopperVisibility(true);
      }}
      className={cx(rowClassName, isErrorRow && styles.ErrorRow)}
    >
      {rowData}
      {/* to prevent event bubbling of click event of pop-up option to table row */}
      <div
        onClick={(e) => { e.stopPropagation(); }}
        role="presentation"
      >
        <AutoPositioningPopper
          className={popperClassName}
          placement={popperPlacement}
          allowedAutoPlacements={popperAllowedAutoPlacements}
          fixedStrategy={popperFixedStrategy}
          referenceElement={referencePopperElement}
          isPopperOpen={isPopperVisible && !isTestBed && !isReassignPopper}
          showTooltip={popperShowTooltip}
        >
          {children}
        </AutoPositioningPopper>
      </div>
    </tr>
  );
}

export default Radium(TableRowWithPopper);
