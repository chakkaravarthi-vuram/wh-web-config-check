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
import { EDIT_BASIC_DETAILS } from '../../FlowLanding.constant';
import styles from '../FlowHeader.module.scss';
import { ARIA_ROLES } from '../../../../../utils/UIConstants';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { keydownOrKeypessEnterHandle, validate } from '../../../../../utils/UtilityFunctions';
import { FLOW_ACTIONS } from '../../../useFlow';
import { isEmpty } from '../../../../../utils/jsUtility';
import { flowBasicDetailsSchema } from '../../../flow_create_or_edit/FlowCreateEdit.schema';

function DatalistEditBasicDetails(props) {
  const { metaData, data, onClose, dispatch, onSaveFlow } = props;
  const { t } = useTranslation();
  const [basicDetails, setBasicDetails] = useState(data);
  const [errorList, setErrorList] = useState({});
  const EDIT_BASIC_STRINGS = EDIT_BASIC_DETAILS(t);

  const onPublishClickHandler = () => {
    const validations = validate(basicDetails, flowBasicDetailsSchema(t));
    setErrorList(validations);
    if (!isEmpty(validations)) return;

    const postData = {
      flow_uuid: metaData.flowUUID,
      flow_name: basicDetails.name,
    };
    if (basicDetails.description) postData.flow_description = basicDetails.description;

    const options = {
      onSuccess: () => {
        dispatch(FLOW_ACTIONS.DATA_CHANGE, { ...basicDetails });
        onClose();
      },
    };
    onSaveFlow(postData, options, setErrorList);
  };

  const onChange = (id, value) => {
    const cloneBasicDetails = { ...basicDetails };
    cloneBasicDetails[id] = value;
    setBasicDetails(cloneBasicDetails);

    if (!isEmpty(errorList)) {
      const validations = validate(cloneBasicDetails, flowBasicDetailsSchema(t));
      setErrorList(validations);
    }
  };

  const closeBasicDetailsModal = () => {
    setBasicDetails({
      flowName: EMPTY_STRING,
      description: EMPTY_STRING,
      admins: {
        users: [],
        teams: [],
      },
      owners: {
        users: [],
        teams: [],
      },
    });
    onClose();
  };

  const headerComponent = (
    <div className={cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw, gClasses.W100)}>
      <Title
        className={cx(gClasses.FTwoBlackV20)}
        content={EDIT_BASIC_STRINGS.EDIT_BASIC_DETAILS_HEADER}
        headingLevel={ETitleHeadingLevel.h3}
        size={ETitleSize.medium}
      />
      <CloseIcon
        className={cx(styles.CloseIcon, gClasses.JusEnd, gClasses.CursorPointer)}
        role={ARIA_ROLES.BUTTON}
        tabIndex={0}
        ariaLabel="Close App Mo"
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
        {EDIT_BASIC_STRINGS.BASIC_DETAILS}
      </div>
      <TextInput
        id="name"
        labelText={EDIT_BASIC_STRINGS.NAME.LABEL}
        placeholder={EDIT_BASIC_STRINGS.NAME.PLACEHOLDER}
        onChange={(e) => onChange('name', e.target.value)}
        className={cx(gClasses.DisplayFlex, gClasses.FirstChild100)}
        labelClassName={styles.LabelNameClass}
        inputInnerClassName={gClasses.W100}
        required
        errorMessage={errorList.name}
        value={basicDetails.name}
      />
      <TextArea
        id="description"
        labelText={EDIT_BASIC_STRINGS.DESCRIPTION.LABEL}
        placeholder={EDIT_BASIC_STRINGS.DESCRIPTION.PLACEHOLDER}
        onChange={(e) => onChange('description', e.target.value)}
        className={cx(
          styles.DatalistName,
          gClasses.DisplayFlex,
          gClasses.FirstChild100,
        )}
        labelClassName={styles.DescriptionClass}
        size={Size.sm}
        value={basicDetails.description}
        errorMessage={errorList.description}
        inputInnerClassName={styles.DescriptionContainerLabel}
      />
    </div>
  );

  const footerComponent = (
    <div className={styles.BorderBottom}>
      <div className={cx(gClasses.DisplayFlex, gClasses.JusEnd, gClasses.W100)}>
        <LibraryButton
          type={EButtonType.OUTLINE_SECONDARY}
          className={cx(gClasses.TextNoWrap, gClasses.MR16, styles.SecondaryButton)}
          buttonText={EDIT_BASIC_STRINGS.BUTTONS.CANCEL}
          onClickHandler={closeBasicDetailsModal}
          noBorder
        />
        <LibraryButton
          buttonText={EDIT_BASIC_STRINGS.BUTTONS.SAVE}
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
