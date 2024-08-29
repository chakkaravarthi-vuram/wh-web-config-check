import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import FormBuilder from '../../../../../components/form_builder/FormBuilder';
import Button, {
  BUTTON_TYPE,
} from '../../../../../components/form_components/button/Button';
import Modal from '../../../../../components/form_components/modal/Modal';
import gClasses from '../../../../../scss/Typography.module.scss';
import { FLOW_STRINGS } from '../../../Flow.strings';
import { getAccountConfigurationDetailsApiService } from '../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';

function ImportDataSetFields() {
  const { t } = useTranslation();
  const { IMPORT_FORM_POP_UP } =
    FLOW_STRINGS(t).CREATE_FLOW.STEPS.STEP.FORMS;

  const onModalClose = () => {};
  const onCancelClicked = () => {};
  const onImportClicked = () => {};

  const onSelectSectionHandler = () => {};
  const onSelectFieldHandler = () => {};
  const onReadOnlySelectHandler = () => {};
  const onEditableSelectHandler = () => {};
  const [userProfileData, setUserProfileData] = useState({});
  useEffect(() => {
    getAccountConfigurationDetailsApiService().then((response) => {
      setUserProfileData(response);
    });
  }, []);

  const content = (
    <>
      <FormBuilder
        sections={[]}
        onSelectSection={onSelectSectionHandler}
        onSelectFieldHandler={onSelectFieldHandler}
        onReadOnlySelectHandler={onReadOnlySelectHandler}
        onEditableSelectHandler={onEditableSelectHandler}
        isImportableForm
        userDetails={userProfileData}
      />
      <Row className={gClasses.MT25}>
        <Col sm={{ size: 4, offset: 2 }}>
          <Button onClick={onCancelClicked} width100>
            Cancel
          </Button>
        </Col>
        <Col sm={4}>
          <Button
            buttonType={BUTTON_TYPE.PRIMARY}
            onClick={onImportClicked}
            width100
          >
            Import
          </Button>
        </Col>
      </Row>
    </>
  );

  return (
    <Modal
      id="import_form"
      right
      contentClass={cx(
        gClasses.ModalContentClass,
      )}
      isModalOpen
      onCloseClick={onModalClose}
    >
      <div className={cx(gClasses.PageTitle, gClasses.MB30)}>
        {IMPORT_FORM_POP_UP.TITLE}
      </div>
      {content}
    </Modal>
  );
}

export default ImportDataSetFields;
