import React from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';

import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import Tooltip from 'components/tooltip/Tooltip';
import CloseIcon from '../../../assets/icons/CloseIcon';

import styles from './Tag.module.scss';
import gClasses from '../../../scss/Typography.module.scss';

import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { CLOSE_ICON } from './Tag.strings';

function Tag(props) {
  const {
    readonly, children, onCloseClick, className, id, noCloseButton, onClick,
    showTagTooltip, tagValue,
  } = props;

  let tagClass = null;
  if (readonly) {
    tagClass = cx(
      gClasses.FTwo11BlackV2,
      styles.Tag,
      className,
      gClasses.CenterV,
      gClasses.ClickableElement,
      styles.ReadOnly,
    );
  } else {
    tagClass = cx(
      gClasses.FTwo11GrayV2,
      styles.Tag,
      className,
      gClasses.CenterV,
      gClasses.ClickableElement,
    );
  }
  const btnId = id ? `${id}_tag` : 'tag';
  function onCloseButtonClick(event) {
    onCloseClick(event, id);
  }
  return (
    <>
    <button id={`tag_${btnId}`} className={tagClass} onClick={onClick || (() => {})} tabIndex={onClick ? 0 : -1} key={id}>
      {children}
      {!noCloseButton && onCloseClick ? (
        <CloseIcon
          className={cx(styles.CloseIcon, gClasses.CursorPointer)}
          isButtonColor
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && !noCloseButton && onCloseButtonClick(e)}
          role="button"
          tabIndex={0}
          title={CLOSE_ICON}
          onClick={!noCloseButton ? onCloseButtonClick : () => {}}
          ariaLabelledby={!onClick ? btnId : null}
        />
      ) : null}
    </button>
    {showTagTooltip && id && <Tooltip id={`tag_${btnId}`} isCustomToolTip content={tagValue} outerClass={styles.TagTooltip} customInnerClasss={styles.CustomTag} />}
    </>
  );
}
export default Tag;

Tag.defaultProps = {
  readonly: false,
  children: null,
  onCloseClick: null,
  className: EMPTY_STRING,
  id: EMPTY_STRING,
  noCloseButton: false,
  onClick: null,
};
Tag.propTypes = {
  readonly: PropTypes.bool,
  children: PropTypes.node,
  onCloseClick: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  noCloseButton: PropTypes.bool,
  onClick: PropTypes.func,
};
