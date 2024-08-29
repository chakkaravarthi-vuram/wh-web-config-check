import React, { useState } from 'react';
import { Button, EButtonType, ETextSize, Modal, ModalSize, ModalStyleType, Text, TextArea, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import styles from '../FormHeader.module.scss';
import { FORM_CONFIG_STRINGS } from '../../../Form.string';
import CloseIconV2 from '../../../../../assets/icons/CloseIconV2';
import { saveFormHeaderApiThunk } from '../../../../../redux/actions/Form.Action';
import jsUtility from '../../../../../utils/jsUtility';
import { getModuleIdByModuleType } from '../../../Form.utils';
import { MODULE_TYPES } from '../../../../../utils/Constants';

function FormHeaderConfiguration(props) {
  const {
    headerData,
    metaData,
    onSuccess,
    onValidate,
    isFormConfigModalOpen,
    onCloseClickHandler,
    formConfigErrorList,
  } = props;

  const { t } = useTranslation();
  const [title, setTitle] = useState(headerData.title);
  const [description, setDescription] = useState(headerData.description);

  const onFormTitleConfigSaveHandler = () => {
    const moduleObj = getModuleIdByModuleType(metaData, MODULE_TYPES.FLOW);
    const params = {
      _id: moduleObj.step_id,
      flow_id: moduleObj.flow_id,
      title: title,
      description: description || null,
      is_dynamic_title: false,
    };
    const error = onValidate?.({
      title,
      description,
    });
    if (jsUtility.isEmpty(error)) {
      saveFormHeaderApiThunk(params, () => {
        onSuccess?.({
          title,
          description,
        });
        onCloseClickHandler?.();
      });
    }
  };

  const formConfigHeader = (
    <div className={styles.FormConfigHeader}>
      <Text
        size={ETextSize.XL}
        className={cx(styles.FormConfigHeaderContent, gClasses.LineHeightNormal)}
        content={FORM_CONFIG_STRINGS(t).FORM_CONFIG.HEADER.CONTENT}
      />
      <div className={cx(styles.CloseIconContainer, gClasses.CenterVH, gClasses.PositionAbsolute)}>
        <CloseIconV2
          className={styles.CloseIcon}
          onClick={onCloseClickHandler}
        />
      </div>
    </div>
  );

  const formConfigContent = (
    <div className={styles.FormConfigBody}>
      <Text
        className={cx(styles.FormConfigBodyTitle, gClasses.LineHeightNormal)}
        size={ETextSize.LG}
        content={FORM_CONFIG_STRINGS(t).FORM_CONFIG.HEADER.TITLE}
      />
      <div className={gClasses.MT15}>
        <TextInput
          id={FORM_CONFIG_STRINGS(t).FORM_CONFIG.HEADER.FORM_TITLE_ID}
          labelText={FORM_CONFIG_STRINGS(t).FORM_CONFIG.HEADER.FORM_TITLE_LABEL}
          placeholder={
            FORM_CONFIG_STRINGS(t).FORM_CONFIG.HEADER.FORM_TITLE_PLACEHOLDER
          }
          errorMessage={
            formConfigErrorList[
              FORM_CONFIG_STRINGS(t).FORM_CONFIG.HEADER.FORM_TITLE_ID
            ]
          }
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            !jsUtility.isEmpty(formConfigErrorList) && onValidate({
              title: e.target.value,
              description,
            });
          }}
          required
        />
      </div>
      <div className={gClasses.MT15}>
        <TextArea
          id={FORM_CONFIG_STRINGS(t).FORM_CONFIG.HEADER.FORM_DESCRIPTION_ID}
          labelText={FORM_CONFIG_STRINGS(t).FORM_CONFIG.HEADER.FORM_DESCRIPTION_LABEL}
          placeholder={
            FORM_CONFIG_STRINGS(t).FORM_CONFIG.HEADER.FORM_DESCRIPTION_PLACEHOLDER
          }
          errorMessage={
            formConfigErrorList[
              FORM_CONFIG_STRINGS(t).FORM_CONFIG.HEADER.FORM_DESCRIPTION_ID
            ]
          }
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            !jsUtility.isEmpty(formConfigErrorList) && onValidate({
              title,
              description: event.target.value,
            });
          }}
        />
      </div>
    </div>
  );

  const formConfigFooter = (
    <div className={styles.FormButtonsListContainer}>
      <Button
        buttonText={FORM_CONFIG_STRINGS(t).FORM_CONFIG.FOOTER.CANCEL_BUTTON}
        type={EButtonType.TERTIARY}
        className={cx(gClasses.MR24, gClasses.P0, gClasses.FontSize12)}
        onClickHandler={onCloseClickHandler}
      />
      <Button
        type={EButtonType.PRIMARY}
        buttonText={FORM_CONFIG_STRINGS(t).FORM_CONFIG.FOOTER.SAVE_BUTTON}
        onClickHandler={onFormTitleConfigSaveHandler}
      />
    </div>
  );

  return (
    <Modal
      id={FORM_CONFIG_STRINGS(t).FORM_CONFIG.MODAL_ID}
      headerContentClassName={cx(
        gClasses.PB0,
        styles.RemoveBackground,
      )}
      footerContentClassName={styles.FormConfigFooter}
      isModalOpen={isFormConfigModalOpen}
      headerContent={formConfigHeader}
      mainContent={formConfigContent}
      footerContent={formConfigFooter}
      modalStyle={ModalStyleType.modal}
      modalSize={ModalSize.md}
    />
  );
}

export default FormHeaderConfiguration;
