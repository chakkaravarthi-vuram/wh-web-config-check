import React, { useState } from 'react';
import cx from 'classnames/bind';
import PropType from 'prop-types';
import { Collapse } from 'reactstrap';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import styles from './CollapseDD.module.scss';

import gClasses from '../../scss/Typography.module.scss';
import { BS } from '../../utils/UIConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function CollapseDD(props) {
  const {
    label,
    children,
    className,
    initiallyOpened = false,
    isError,
  } = props;
  const [isCollapseOpen, setIsCollapseOpen] = useState(initiallyOpened);
  return (
    <div>
      <div
        className={cx(
          BS.D_FLEX,
          BS.JC_BETWEEN,
          gClasses.CenterV,
          gClasses.MT10,
          gClasses.MB10,
          className,
        )}
        onClick={() => setIsCollapseOpen(!isCollapseOpen)}
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && setIsCollapseOpen(!isCollapseOpen)}
        role="link"
        tabIndex="0"
      >
        <div
          className={cx(
            gClasses.FTwo14BlackV2,
            gClasses.FontWeight500,
            isError && styles.CollapseDDIsError,
          )}
        >
          {label}
        </div>
        <div
          className={cx(
            isCollapseOpen ? gClasses.DropdownArrowUp : gClasses.DropdownArrow,
          )}
          style={{
            borderTopColor: '#959BA3',
            borderBottomColor: '#959BA3',
          }}
        />
      </div>
      <Collapse isOpen={isCollapseOpen}>{children}</Collapse>
    </div>
  );
}
export default CollapseDD;

CollapseDD.defaultProps = {
  className: EMPTY_STRING,
  label: EMPTY_STRING,
  initiallyOpened: false,
  isError: false,
};
CollapseDD.propTypes = {
  children: PropType.oneOfType([PropType.object, PropType.element]).isRequired,
  label: PropType.string,
  className: PropType.string,
  initiallyOpened: PropType.bool,
  isError: PropType.bool,
};
