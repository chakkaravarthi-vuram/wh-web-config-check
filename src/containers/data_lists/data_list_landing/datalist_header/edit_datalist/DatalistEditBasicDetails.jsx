import React, { useState } from 'react';
import cx from 'classnames';
import {
  Modal,
  ModalStyleType,
  Title,
  ETitleHeadingLevel,
  ETitleSize,
  TextInput,
  TextArea,
  Size,
  Button as LibraryButton,
  EButtonType,
  ModalSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import CloseIcon from '../../../../../assets/icons/CloseIcon';
import gClasses from '../../../../../scss/Typography.module.scss';
import { EDIT_BASIC_DETAILS } from '../../DatalistsLanding.constant';
import styles from '../DatalistsHeader.module.scss';
import { ARIA_ROLES } from '../../../../../utils/UIConstants';
import { keydownOrKeypessEnterHandle } from '../../../../../utils/UtilityFunctions';
import { getErrorMessage } from '../../../data_lists_create_or_edit/DatalistsCreateEdit.utils';
import { isEmpty } from '../../../../../utils/jsUtility';

function DatalistEditBasicDetails(props) {
  const { onClose, basicDetails, onSaveBasicDetails, errorList, getTabWiseValidation } = props;
  const { t } = useTranslation();

  const [localBasicDetails, setLocalBasicDetails] = useState(basicDetails);

  const {
    DATALIST_NAME,
    DATALIST_DESCRIPTION,
    BASIC_DETAILS,
    BUTTONS,
    EDIT_BASIC_DETAILS_HEADER,
  } = EDIT_BASIC_DETAILS(t);

  const onChangeDetails = (id, event) => {
    const { value } = event.target;
    const updatedData = {
      ...localBasicDetails,
      [id]: value,
    };
    setLocalBasicDetails(updatedData);
    if (!isEmpty(errorList)) {
      getTabWiseValidation(updatedData, true);
    }
  };

  const onPublishClickHandler = () => {
    onSaveBasicDetails(localBasicDetails, onClose);
  };

  const closeBasicDetailsModal = () => {
    onClose();
    getTabWiseValidation(basicDetails, true);
  };
  const headerComponent = (
    <div className={cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw, gClasses.W100)}>
      <Title
        className={cx(gClasses.FTwoBlackV20)}
        content={EDIT_BASIC_DETAILS_HEADER}
        headingLevel={ETitleHeadingLevel.h3}
        size={ETitleSize.medium}
      />
      <CloseIcon
        className={cx(styles.CloseIcon, gClasses.JusEnd, gClasses.CursorPointer)}
        role={ARIA_ROLES.BUTTON}
        tabIndex={0}
        onKeyDown={(e) =>
          keydownOrKeypessEnterHandle(e) && closeBasicDetailsModal()
        }
        onClick={closeBasicDetailsModal}
      />
    </div>
  );
  const mainComponent = (
    <div className={cx(gClasses.W100)}>
      <div
        className={cx(
          gClasses.MB12,
          gClasses.FontWeight500,
          styles.SubHeadingText,
        )}
      >
        {BASIC_DETAILS}
      </div>
      <TextInput
        id={DATALIST_NAME.ID}
        labelText={DATALIST_NAME.LABEL}
        isLoading={false}
        placeholder={DATALIST_NAME.PLACEHOLDER}
        onChange={(event) =>
          onChangeDetails(DATALIST_NAME.ID, event)
        }
        className={cx(gClasses.DisplayFlex, gClasses.FirstChild100)}
        labelClassName={styles.LabelNameClass}
        inputInnerClassName={gClasses.W100}
        required
        value={localBasicDetails?.dataListName}
        errorMessage={getErrorMessage(errorList, 'dataListName')}
      />
      <TextArea
        id={DATALIST_DESCRIPTION.ID}
        labelText={DATALIST_DESCRIPTION.LABEL}
        isLoading={false}
        placeholder={DATALIST_DESCRIPTION.PLACEHOLDER}
        onChange={(event) =>
          onChangeDetails(DATALIST_DESCRIPTION.ID, event)
        }
        className={cx(styles.DatalistName, gClasses.DisplayFlex, gClasses.FirstChild100)}
        labelClassName={styles.DescriptionClass}
        size={Size.sm}
        value={localBasicDetails?.dataListDescription}
        inputInnerClassName={styles.DescriptionContainerLabel}
        errorMessage={getErrorMessage(errorList, 'dataListDescription')}
      />
    </div>
  );
  const footerComponent = (
    <div className={styles.BorderBottom}>
      <div className={cx(gClasses.DisplayFlex, gClasses.JusEnd, gClasses.W100)}>
        <LibraryButton
          type={EButtonType.OUTLINE_SECONDARY}
          className={cx(gClasses.TextNoWrap, gClasses.MR16, styles.SecondaryButton)}
          buttonText={BUTTONS.CANCEL}
          onClickHandler={closeBasicDetailsModal}
          noBorder
        />
        <LibraryButton
          buttonText={BUTTONS.SAVE}
          type={EButtonType.PRIMARY}
          onClickHandler={onPublishClickHandler}
        />
      </div>
    </div>
  );

  return (
    <Modal
      id="datalist_basic_settings"
      isModalOpen
      headerContentClassName={cx(styles.HeaderClass, gClasses.DisplayFlex)}
      headerContent={headerComponent}
      mainContent={mainComponent}
      modalStyle={ModalStyleType.modal}
      mainContentClassName={cx(gClasses.DisplayFlex, styles.MainComponent)}
      modalSize={ModalSize.md}
      footerContent={footerComponent}
    />
  );
}

export default DatalistEditBasicDetails;

DatalistEditBasicDetails.propTypes = {
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
};
