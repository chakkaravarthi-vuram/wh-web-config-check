import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Button,
  EButtonType,
  Modal,
  ModalSize,
  ModalStyleType,
  RadioGroup,
  Text,
  TextInput,
  ETextSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';
import CloseIconV2 from 'assets/icons/CloseIconV2';
import { unset, isEmpty } from 'utils/jsUtility';
import styles from './InsertButton.module.scss';
import { ARIA_ROLES } from '../../../utils/UIConstants';
import {
  keydownOrKeypessEnterHandle,
  validate,
} from '../../../utils/UtilityFunctions';
import { WIDGET_STRINGS } from '../InformationWidget.strings';
import { BUTTON_INIT_TEXT, FIELD_IDS } from '../InformationWidget.constants';
import { getWidgetButtonHtml } from '../InformationWidget.utils';
import { getInsertButtonSchema } from './InsertButton.validation.schema';
import { emptyFunction, emptyRef } from '../../../utils/jsUtility';

function InsertButton(props) {
  const { t } = useTranslation();
  const { isModalOpen, handleModalOpen, parentEditorRef } = props;

  const { INSERT_BUTTON, CANCEL } = WIDGET_STRINGS(t);

  const [localState, setLocalState] = useState(BUTTON_INIT_TEXT);

  const onCloseClick = () => {
    if (handleModalOpen) handleModalOpen(false);
    setLocalState(BUTTON_INIT_TEXT);
  };

  const onInsertButtonClick = () => {
    const currentErrorList = validate(
      {
        buttonLabel: localState?.buttonLabel,
        buttonStyle: localState?.buttonStyle,
        buttonLink: localState?.buttonLink,
      },
      getInsertButtonSchema(t),
    );

    if (isEmpty(currentErrorList)) {
      if (parentEditorRef?.current) {
        const button = getWidgetButtonHtml(
          localState?.buttonLink,
          localState?.buttonLabel,
          localState?.buttonStyle,
        );

        parentEditorRef?.current?.insertContent(button);
        onCloseClick();
      }
    } else {
      setLocalState({
        ...localState,
        [FIELD_IDS.ERROR_LIST]: currentErrorList,
      });
    }
  };

  const onChangeHandler = (event) => {
    const {
      target: { id, value },
    } = event;

    unset(localState, ['errorList', id]);

    setLocalState({
      ...localState,
      [id]: value,
    });
  };

  const onRadioChangeHandler = (_event, id, value) => {
    unset(localState, ['errorList', id]);

    setLocalState({
      ...localState,
      [id]: value,
    });
  };

  return (
    <Modal
      id={FIELD_IDS.INSERT_BUTTON_MODAL}
      isModalOpen={isModalOpen}
      modalStyle={ModalStyleType.dialog}
      modalSize={ModalSize.sm}
      headerContent={
        <div className={cx(gClasses.CenterVSpaceBetween, styles.HeaderContent)}>
          <Text
            size={ETextSize.XL}
            className={gClasses.FontWeight500}
            content={INSERT_BUTTON.INSERT_TEXT}
          />
          <CloseIconV2
            className={cx(gClasses.CursorPointer)}
            ariaLabel="Close"
            role={ARIA_ROLES.IMG}
            height="16"
            width="16"
            onClick={onCloseClick}
          />
        </div>
      }
      mainContent={
        <div className={styles.InsertButtonCardContainer}>
          <TextInput
            onChange={onChangeHandler}
            labelText={INSERT_BUTTON.BUTTON_LABEL.LABEL}
            id={INSERT_BUTTON.BUTTON_LABEL.ID}
            value={localState?.buttonLabel}
            errorMessage={localState?.errorList?.buttonLabel}
            labelClassName={styles.LabelClassName}
            required
          />
          <RadioGroup
            id={INSERT_BUTTON.BUTTON_STYLE.ID}
            labelText={INSERT_BUTTON.BUTTON_STYLE.LABEL}
            selectedValue={localState?.buttonStyle}
            errorMessage={localState?.errorList?.buttonStyle}
            options={INSERT_BUTTON.BUTTON_STYLE.OPTIONS}
            className={gClasses.MT8}
            onChange={onRadioChangeHandler}
            onKeyDown={(e) =>
              keydownOrKeypessEnterHandle(e) && onRadioChangeHandler(e)
            }
            labelClassName={styles.LabelClassName}
            required
          />
          <TextInput
            onChange={onChangeHandler}
            labelText={INSERT_BUTTON.BUTTON_LINK.LABEL}
            id={INSERT_BUTTON.BUTTON_LINK.ID}
            value={localState?.buttonLink}
            errorMessage={localState?.errorList?.buttonLink}
            className={gClasses.MT8}
            labelClassName={styles.LabelClassName}
            required
          />
        </div>
      }
      footerContent={
        <div className={cx(gClasses.RightH, styles.FooterContent)}>
          <Button
            buttonText={CANCEL}
            type={EButtonType.TERTIARY}
            onClickHandler={onCloseClick}
            className={gClasses.ML16}
          />
          <Button
            buttonText={INSERT_BUTTON.INSERT_TEXT}
            type={EButtonType.PRIMARY}
            onClickHandler={onInsertButtonClick}
            className={gClasses.ML16}
          />
        </div>
      }
    />
  );
}

export default InsertButton;

InsertButton.defaultProps = {
  isModalOpen: false,
  handleModalOpen: emptyFunction,
  parentEditorRef: emptyRef,
};

InsertButton.propTypes = {
  isModalOpen: PropTypes.bool,
  handleModalOpen: PropTypes.func,
  parentEditorRef: PropTypes.object,
};
