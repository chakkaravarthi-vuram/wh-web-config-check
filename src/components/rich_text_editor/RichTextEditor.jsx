import React from 'react';
// import ReactDOM from 'react-dom';
import cx from 'classnames/bind';
import { Editor, EditorState, convertFromHTML, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import PropTypes from 'prop-types';

import Label from '../form_components/label/Label';
import RteToolBar from './rte_tool_bar/RteToolBar';

import styles from './RichTextEditor.module.scss';
import gClasses from '../../scss/Typography.module.scss';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { CORE_DEFAULT_BLOCKS, DRAFT_TEXT_ALIGNMENT } from './rte_tool_bar/RteToolBar.strings';
// import { BS } from '../../utils/UIConstants';
import jsUtils from '../../utils/jsUtility';

const getEditorStateFromHtml = (description) => {
  const blocksFromHtml = convertFromHTML(description);
  const state = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks);
  return EditorState.createWithContent(state);
};
class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.description);
    this.state = {
      editorState: !jsUtils.isEmpty(props.description) ? getEditorStateFromHtml(props.description) : EditorState.createEmpty(),
    };
  }

  //   getDescriptionValue = (description) => {
  //     const convertedState = convertFromRaw(JSON.parse(description))
  // const editorValue = EditorState.createWithContent(convertedState.getCurrentContent());
  // return editorValue
  //   }

  render() {
    const { className, label, placeholder, innerClass, readOnly, hideToolbar } = this.props;
    const { editorState } = this.state;
    const placeholderView = !editorState.getCurrentContent().hasText() ? (
      <div className={styles.Placeholder}>{placeholder}</div>
    ) : null;
    return (
      <div className={className}>
        <Label content={label} />
        <div className={cx(gClasses.InputBorder, gClasses.InputBorderRadius, innerClass)}>
          {hideToolbar ? null : (
            <RteToolBar
              editorState={editorState}
              updateEditorState={this.updateEditorState}
              updateAlignment={this.updateAlignment}
            />
          )}
          <div className={cx(styles.TextEditorContainer)}>
            <Editor
              editorState={editorState}
              onChange={this.updateEditorState}
              blockStyleFn={this.updateBlockStyle}
              readOnly={readOnly}
              // placeholder={placeholder}
            />
            {placeholderView}
          </div>
        </div>
      </div>
    );
  }

  updateEditorState = (editorState) => {
    const { onChangeHandler } = this.props;
    this.setState({
      editorState,
    });
    onChangeHandler({ target: { value: stateToHTML(editorState.getCurrentContent()) } });
  };

  updateBlockStyle = (contentBlock) => {
    switch (contentBlock.getType()) {
      case CORE_DEFAULT_BLOCKS.BLOCK_QUOTE:
        return styles.BlockQuote;
      case DRAFT_TEXT_ALIGNMENT.LEFT:
        return styles.AlignLeft;
      case DRAFT_TEXT_ALIGNMENT.RIGHT:
        return styles.AlignRight;
      case DRAFT_TEXT_ALIGNMENT.CENTER:
        return styles.AlignCenter;
      case DRAFT_TEXT_ALIGNMENT.JUSTIFY:
        return styles.AlignJustify;
      default:
        return null;
    }
  };
}

export default RichTextEditor;

RichTextEditor.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  description: PropTypes.objectOf(PropTypes.any),
  innerClass: PropTypes.string,
  readOnly: PropTypes.bool,
  hideToolbar: PropTypes.bool,
  onChangeHandler: PropTypes.func.isRequired,
};

RichTextEditor.defaultProps = {
  className: null,
  label: EMPTY_STRING,
  placeholder: EMPTY_STRING,
  description: {},
  innerClass: EMPTY_STRING,
  readOnly: false,
  hideToolbar: false,
};
