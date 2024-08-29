import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { RichUtils, EditorState } from 'draft-js';
import _ from 'lodash';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';

// import Dropdown from '../../form_components/dropdown/Dropdown';

import styles from './RteToolBar.module.scss';
import gClasses from '../../../scss/Typography.module.scss';

import {
  INLINE_STYLES,
  DRAFT_EDITOR,
  CORE_DEFAULT_BLOCKS,
  EDITOR_CHANGE_TYPE,
  DRAFT_TEXT_ALIGNMENT,
} from './RteToolBar.strings';
import { BS } from '../../../utils/UIConstants';

function RteToolBar(props) {
  const { updateEditorState, editorState } = props;

  const onStyleClick = (style) => {
    const draftEditorValues = _.values(DRAFT_EDITOR);
    const defaultBlockValues = _.values(CORE_DEFAULT_BLOCKS);
    const editorChangeTypeValues = _.values(EDITOR_CHANGE_TYPE);
    const textAlignmentValues = _.values(DRAFT_TEXT_ALIGNMENT);
    if (_.includes(draftEditorValues, style)) {
      updateEditorState(RichUtils.toggleInlineStyle(editorState, style));
    } else if (_.includes(textAlignmentValues, style)) {
      updateEditorState(RichUtils.toggleBlockType(editorState, style));
    } else if (_.includes(defaultBlockValues, style)) {
      updateEditorState(RichUtils.toggleBlockType(editorState, style));
    } else if (_.includes(editorChangeTypeValues, style)) {
      if (style === EDITOR_CHANGE_TYPE.UNDO) updateEditorState(EditorState.undo(editorState));
      if (style === EDITOR_CHANGE_TYPE.REDO) updateEditorState(EditorState.redo(editorState));
    }
  };

  const isActive = (style) => {
    const currentStyles = editorState.getCurrentInlineStyle();
    return currentStyles.has(style);
  };

  // const onOptionClick = (event) => {
  //   const style = event.target.value;
  //   updateEditorState(RichUtils.toggleBlockType(editorState, style));
  // };

  const toolBar = INLINE_STYLES.map((inline_style) => {
    const selectedClass = isActive(inline_style.style) ? styles.SelectedIconContainer : null;
    return (
      <li
        className={cx(
          styles.IconContainer,
          gClasses.CenterVH,
          gClasses.CursorPointer,
          selectedClass,
        )}
        key={inline_style.label}
      >
        <div
        onClick={() => onStyleClick(inline_style.style)}
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onStyleClick(inline_style.style)}
        role="button"
        tabIndex={0}
        >
        {inline_style.icon}
        </div>
      </li>
    );
  });
  return (
    <ul className={cx(BS.D_FLEX, styles.Container)}>
      {/* <Dropdown
        optionList={BLOCK_TYPE_DROPDOWN}
        onChange={onOptionClick}
        className={cx(gClasses.CenterV, styles.Dropdown)}
        isBorderLess
      /> */}
      <ul className={cx(styles.IconList, BS.D_FLEX)}>{toolBar}</ul>
    </ul>
  );
}

RteToolBar.defaultProps = {};

RteToolBar.propTypes = {
  updateEditorState: PropTypes.func.isRequired,
  updateAlignment: PropTypes.func.isRequired,
  editorState: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default RteToolBar;
