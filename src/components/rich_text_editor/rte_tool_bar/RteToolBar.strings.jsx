import React from 'react';
import cx from 'classnames/bind';

import UnderLineIcon from '../../../assets/icons/rich_text_editor/UnderLineIcon';
import BoldIcon from '../../../assets/icons/rich_text_editor/BoldIcon';
import ItalicsIcon from '../../../assets/icons/rich_text_editor/ItalicsIcon';
// import LinkIcon from '../../../assets/icons/rich_text_editor/LinkIcon';
import UnOrderdListIcon from '../../../assets/icons/rich_text_editor/UnOrderdListIcon';
import OrderdListIcon from '../../../assets/icons/rich_text_editor/OrderdListIcon';
// import BlockQuoteIcon from '../../../assets/icons/rich_text_editor/BlockQuoteIcon';
import JustifyAlignIcon from '../../../assets/icons/rich_text_editor/JustifyAlignIcon';
// import UnderLineIcon from '../../../assets/icons/rich_text_editor/UnderLineIcon';
import UndoRedoIcon from '../../../assets/icons/rich_text_editor/UndoRedoIcon';
import LeftAlignIcon from '../../../assets/icons/rich_text_editor/LeftAlignIcon';
import RightAlignIcon from '../../../assets/icons/rich_text_editor/RightAlignIcon';
import CenterAlignIcon from '../../../assets/icons/rich_text_editor/CenterAlignIcon';

import styles from './RteToolBar.module.scss';
import gClasses from '../../../scss/Typography.module.scss';

export const DRAFT_EDITOR = {
  BOLD: 'BOLD',
  ITALIC: 'ITALIC',
  UNDERLINE: 'UNDERLINE',
};

export const DRAFT_TEXT_ALIGNMENT = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
  JUSTIFY: 'justify',
};

export const CORE_DEFAULT_BLOCKS = {
  UL: 'unordered-list-item',
  OL: 'ordered-list-item',
  BLOCK_QUOTE: 'blockquote',
  PARAGRAPH: 'paragraph',
  HEADER_ONE: 'header-one',
  HEADER_TWO: 'header-two',
  HEADER_THREE: 'header-three',
  HEADER_FOUR: 'header-four',
  HEADER_FIVE: 'header-five',
  HEADER_SIX: 'header-six',
};

export const COMPOSED_ENTITY = {
  LINK: 'LINK',
  IMAGE: 'IMAGE',
};

export const EDITOR_CHANGE_TYPE = {
  UNDO: 'undo',
  REDO: 'redo',
};

export const INLINE_STYLES = [
  {
    style: DRAFT_EDITOR.BOLD,
    icon: <BoldIcon className={styles.Icon} title="Bold" />,
  },
  {
    style: DRAFT_EDITOR.ITALIC,
    icon: <ItalicsIcon className={styles.Icon} title="Italic" />,
  },
  // {
  //   style: COMPOSED_ENTITY.LINK,
  //   icon: <LinkIcon className={styles.Icon} title="Link" />,
  // },
  {
    style: DRAFT_EDITOR.UNDERLINE,
    icon: <UnderLineIcon className={styles.Icon} title="Underline" />,
  },
  {
    style: DRAFT_TEXT_ALIGNMENT.LEFT,
    icon: <LeftAlignIcon className={styles.Icon} title="Left Align" />,
  },
  {
    style: DRAFT_TEXT_ALIGNMENT.CENTER,
    icon: <CenterAlignIcon className={styles.Icon} title="Center Align" />,
  },
  {
    style: DRAFT_TEXT_ALIGNMENT.RIGHT,
    icon: <RightAlignIcon className={styles.Icon} title="Right Align" />,
  },
  {
    style: DRAFT_TEXT_ALIGNMENT.JUSTIFY,
    icon: <JustifyAlignIcon className={styles.Icon} title="Justify Align" />,
  },
  {
    style: CORE_DEFAULT_BLOCKS.UL,
    icon: <UnOrderdListIcon className={styles.Icon} title="UnOrdered List" />,
  },
  {
    style: CORE_DEFAULT_BLOCKS.OL,
    icon: <OrderdListIcon className={styles.Icon} title="Ordered List" />,
  },
  // {
  //   style: COMPOSED_ENTITY.IMAGE,
  //   icon: <ImageIcon className={styles.Icon} title="Image" />,
  // },
  // {
  //   style: CORE_DEFAULT_BLOCKS.BLOCK_QUOTE,
  //   icon: <BlockQuoteIcon className={styles.Icon} title="Block Quote" />,
  // },
  // {
  //   label: 'TABLE',
  //   style: 'TAbLE',
  //   icon: <TableIcon className={styles.Icon} title="Table" />,
  // },
  // {
  //   label: 'VIDEO',
  //   style: 'VIDEO',
  //   icon: <VideoIcon className={styles.Icon} title="Video" />,
  // },
  {
    style: EDITOR_CHANGE_TYPE.UNDO,
    icon: <UndoRedoIcon className={styles.Icon} title="Undo" />,
  },
  {
    style: EDITOR_CHANGE_TYPE.REDO,
    icon: <UndoRedoIcon className={cx(styles.Icon, gClasses.Rotate180)} title="Redo" />,
  },
];

export const BLOCK_TYPE_DROPDOWN = [
  {
    option_text: 'Paragraph',
    value: CORE_DEFAULT_BLOCKS.PARAGRAPH,
  },
  {
    option_text: 'Header 1',
    value: CORE_DEFAULT_BLOCKS.HEADER_ONE,
  },
  {
    option_text: 'Header 2',
    value: CORE_DEFAULT_BLOCKS.HEADER_TWO,
  },
  {
    option_text: 'Header 3',
    value: CORE_DEFAULT_BLOCKS.HEADER_THREE,
  },
  {
    option_text: 'Header 3',
    value: CORE_DEFAULT_BLOCKS.HEADER_THREE,
  },
  {
    option_text: 'Header 5',
    value: CORE_DEFAULT_BLOCKS.HEADER_FOUR,
  },
  {
    option_text: 'Header 5',
    value: CORE_DEFAULT_BLOCKS.HEADER_FIVE,
  },
];
export default INLINE_STYLES;
