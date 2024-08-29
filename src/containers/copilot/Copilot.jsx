import React, { useContext, useRef, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  EPopperPlacements,
  Input,
  Popper,
  Text,
  ETextSize,
  Button,
  EButtonType,
  Tooltip,
  ETooltipType,
  ETooltipPlacements,
} from '@workhall-pvt-lmt/wh-ui-library';
import { v4 as uuid } from 'uuid';
import CopilotSearchIcon from 'assets/icons/copilot/CopilotSearchIcon';
import SearchArrow from 'assets/icons/app_builder_icons/SearchArrow';
import CloseIconV2 from 'assets/icons/CloseIconV2';
import InfoIconNew from 'assets/icons/InfoIconNew';
import gClasses from 'scss/Typography.module.scss';
import { COPILOT_STRINGS } from './Copilot.strings';
import styles from './Copilot.module.scss';

import {
  clearCopilot,
  setCopilotChatContextId,
  setCopilotDataChange,
} from '../../redux/reducer/CopilotReducer';
import ThemeContext from '../../hoc/ThemeContext';
import { useClickOutsideDetector } from '../../utils/UtilityFunctions';
import SearchResult from './search_result/SearchResult';
import Chat from './chat/Chat';
import { postCopilotInferenceActionThunk } from '../../redux/actions/Copilot.Action';
import { KEY_CODES } from '../../utils/Constants';

function Copilot(props) {
  const { isResponsiveView = false, closeSearch } = props;
  const { t } = useTranslation();
  const [isCopilotModelOpen, setIsCopilotModelOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const popperRef = useRef();
  const dispatch = useDispatch();

  const { colorScheme } = useContext(ThemeContext);
  const { PLACEHOLDER, INSTRUCTION, ID } = COPILOT_STRINGS(t);
  const { search } = useSelector((store) => store.CopilotReducer);

  const onClosePopper = () => {
    setIsSubmit(false);
    setIsCopilotModelOpen(false);
    closeSearch?.();
    dispatch(clearCopilot());
  };
  useClickOutsideDetector(popperRef, onClosePopper);

  const getPopperContent = () => {
    const isDisableSubmit = search.length < 3;
    const onSearchChange = (event) => {
      const { value } = event.target;
      dispatch(setCopilotDataChange({ data: { search: value } }));
    };

    const onFocus = (refs) => {
      refs.current?.focus();
    };

    const onClickHandler = () => {
      const context_uuid = uuid();
      const params = {
        prompt: search,
        context_uuid,
      };
      dispatch(setCopilotChatContextId(context_uuid));
      dispatch(postCopilotInferenceActionThunk(params, t));
      setIsSubmit(true);
    };

    const onInputKeyDownHandler = (event) => {
      event.stopPropagation();
      if (event.keyCode === KEY_CODES.ENTER) {
        onClickHandler();
      }
    };

    return (
      <section className={styles.MainContent}>
        <Input
          className={cx(styles.AISearch)}
          refCallBackFunction={onFocus}
          prefixIcon={
            <CopilotSearchIcon className={styles.CopilotIcon} isGray />
          }
          placeholder={PLACEHOLDER}
          onFocusHandler={() => setIsCopilotModelOpen(true)}
          content={search}
          onChange={onSearchChange}
          onInputKeyDownHandler={onInputKeyDownHandler}
          suffixIcon={
            <Button
              iconOnly
              noBorder
              disabled={!isSubmit && isDisableSubmit}
              className={styles.SubmitButton}
              icon={
                isSubmit ? (
                  <CloseIconV2 className={styles.CloseIcon} />
                ) : (
                  <SearchArrow
                    fillColor={!isDisableSubmit && colorScheme.activeColor}
                    className={styles.SearchArrowIcon}
                  />
                )
              }
              type={EButtonType.TERTIARY}
              colorSchema={colorScheme}
              onClickHandler={isSubmit ? onClosePopper : onClickHandler}
            />
          }
        />
        <div className={cx(styles.Results, gClasses.OverflowYAuto)}>
          {!isSubmit ? (
            <SearchResult search={search} onSubmit={onClickHandler} closeSearch={closeSearch} />
          ) : (
            <Chat />
          )}
        </div>
        <div className={cx(styles.Info)}>
          <div className={cx(gClasses.CenterV, gClasses.Gap8)}>
            <InfoIconNew className={cx(styles.InfoIcon)} />
            <Text
              content={t(INSTRUCTION.RESULT_MAY_CHANGE)}
              size={ETextSize.XS}
            />
          </div>
        </div>
      </section>
    );
  };

  return !isResponsiveView ? (
    <div>
        <div className={styles.MagicInput}>
          <div
            style={{
              backgroundColor: colorScheme.highlight,
            }}
            className={gClasses.BorderRadius6}
          >
            <Tooltip
              id={ID}
              text={PLACEHOLDER}
              tooltipType={ETooltipType.INFO}
              tooltipPlacement={ETooltipPlacements.BOTTOM}
              icon={
                <Input
                  id={ID}
                  className={cx(styles.AIInput)}
                  placeholder={PLACEHOLDER}
                  prefixIcon={<CopilotSearchIcon className={styles.CopilotIcon} />}
                  onFocusHandler={() => setIsCopilotModelOpen(true)}
                />
              }
            />
          </div>
        </div>
      {isCopilotModelOpen && (
        <div ref={popperRef}>
          <Popper
            className={styles.CopilotAnimation}
            targetRef={popperRef}
            open={isCopilotModelOpen}
            content={getPopperContent()}
            placement={EPopperPlacements.BOTTOM_START}
          />
        </div>
      )}
    </div>
  ) : getPopperContent();
}

export default Copilot;
