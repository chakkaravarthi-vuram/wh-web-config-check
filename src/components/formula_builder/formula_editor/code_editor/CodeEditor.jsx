/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useRef, useEffect } from 'react';
import * as ReactDomServer from 'react-dom/server';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { ARIA_ROLES } from 'utils/UIConstants';
import jsUtility, { isEmpty } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { FORMULA_BUILDER, LINE_HEIGHT } from 'components/formula_builder/FormulaBuilder.strings';
import { useTranslation } from 'react-i18next';
import styles_ from './CodeTheme.module.scss';
import styles from './CodeEditor.module.scss';
import FormulaEditorToolTip from '../tool_tip/FormulaEditorToolTip';
import { BS } from '../../../../utils/UIConstants';

const CodeEditor = React.forwardRef((props, ref) => {
  const {
    className,
    style,
    onInputHandler,
    onClickHandler,
    onKeyDownHandler,
    textValue,
    lstFunctions,
    onKeyUpHandler,
    onCopyHandler,
  } = props;
  const { t } = useTranslation();

  const containerRef = useRef(null);
  const popperRef = useRef(null);
  const lineRef = useRef(null);
  // const clearRef = useRef(null);
  let popperTimeout = null;

  useEffect(() => {
    if (isEmpty(textValue) && ref.current && ref.current.innerText === '\n') {
      ref.current.innerHTML = EMPTY_STRING;
    }
  }, [textValue]);

  const childNodesCount = ref && ref.current && ref.current.childNodes && ref.current.childNodes.length;

  useEffect(() => {
    const lineElement = document.getElementById(FORMULA_BUILDER(t).LINE_NUMBER);
    if (!jsUtility.isEmpty(lineElement) && ref && ref.current && ref.current.childNodes) {
      lineElement.innerHTML = Array(childNodesCount).fill('<span></span>').join('');
      if (ref.current) ref.current.setAttribute('style', `height: ${(childNodesCount + 5) * LINE_HEIGHT}px`);
      if (!childNodesCount) lineElement.innerHTML = '<span></span>';
    }
  }, [childNodesCount]);

  const setAutoPositionPopper = (event) => {
      const { target } = event;
      const attributes = { ...target.dataset };
      const popperContent = ReactDomServer.renderToStaticMarkup(
                                <FormulaEditorToolTip
                                  attributes={attributes}
                                  lstFunction={lstFunctions}
                                />,
                              );
      if (popperRef.current && !isEmpty(attributes) && popperContent) {
          const rect = ref.current.getBoundingClientRect();
          popperRef.current.innerHTML = popperContent;
          popperRef.current.setAttribute(
           'style',
           'display: inline-block; visibility: hidden',
          );
          const coordinates = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            height: containerRef.current.clientHeight,
            width: containerRef.current.clientWidth,
            tooltipWidth: popperRef.current.clientWidth,
            tooltipHeigth: popperRef.current.clientHeight,
          };
          let { x, y } = coordinates;
          const lineContainer = document.getElementById(FORMULA_BUILDER(t).LINE_NUMBER);
          const lineContainerWidth = lineContainer.clientWidth >= 0 ? lineContainer.clientWidth : 0;

          // X - AXIS
          // here the bar minimum for x is 5px;
          if ((coordinates.width - coordinates.x) < coordinates.tooltipWidth) {
            // exceeds right side of the editor - x axis
              x -= (coordinates.tooltipWidth - (coordinates.width - coordinates.x));
          } else if (coordinates.x < coordinates.tooltipWidth) {
            // exceeds left side with negative x
              x = 5;
          } else {
              x += 5;
          }

          // Y- AXIS
          // here the line height + 2px  = 20px(18px + 2px) and bar min position is 10px.
           if (coordinates.height - coordinates.y <= coordinates.tooltipHeigth + 20) {
             // exceeds downwards
               y -= (coordinates.tooltipHeigth - (coordinates.height - coordinates.y)) + 20;
            } else if (coordinates.y < coordinates.tooltipHeigth) {
             // exceeds upwards
               y = 20;
            } else {
              y += 10;
            }

          // popperRef.current.innerText = error;
          popperTimeout = setTimeout(
            () => {
              popperTimeout && clearTimeout(popperTimeout);
              popperRef.current.setAttribute(
                'style',
                `visibility: visible; left: ${x + lineContainerWidth}px; top: ${y}px; z-index: 2`,
               );
            }, 500,
          );
      } else {
        popperRef.current.innerHTML = null;
        popperRef.current.setAttribute('style', 'visibility: visible; z-index: -1;');
      }
  };

  const onMouseOver = (event) => setAutoPositionPopper(event);

  const onMouseLeave = () => {
    popperRef.current.innerHTML = null;
    popperRef.current.setAttribute('style', 'visibility: visible; z-index: -1;');
  };

  return (
    <div
      style={{ ...style }}
      className={cx(`${className || ''}`, styles.Container, BS.P_RELATIVE, styles_.LightTheme)}
    >
      <div className={cx(styles.EditorContainer, BS.D_FLEX)} onMouseLeave={onMouseLeave}>
        <div className={cx(styles.LineNumberContainer, gClasses.MR5)} id={FORMULA_BUILDER(t).LINE_NUMBER} ref={lineRef}>
          <span />
        </div>
        <div
          className={cx(styles.EditorNew)}
          ref={containerRef}
        >
          <div
            placeholder={FORMULA_BUILDER(t).ALL_PLACEHOLDER.ENTER_FORMULA_HERE}
            onFocusOut
            role={ARIA_ROLES.TEXT_BOX}
            tabIndex="0"
            // className={cx(styles.EditorNew, gClasses.MR20)}
            ref={ref}
            contentEditable="true"
            spellCheck="false"
            onKeyDown={onKeyDownHandler}
            onClick={onClickHandler}
            onMouseOver={onMouseOver}
            onInput={onInputHandler}
            onKeyUp={onKeyUpHandler}
            onCopy={onCopyHandler}
          />
        </div>
        <div className={styles.ErrorContainer} ref={popperRef} />
      </div>
    </div>
  );
});

export default CodeEditor;
