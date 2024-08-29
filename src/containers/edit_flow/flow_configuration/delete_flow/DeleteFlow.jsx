import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import cx from 'classnames/bind';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import modalStyles from 'components/form_components/modal_layout/CustomClasses.module.scss';
import Label from 'components/form_components/label/Label';
import gClasses from 'scss/Typography.module.scss';
import RadioGroup, { RADIO_GROUP_TYPE } from 'components/form_components/radio_group/RadioGroup';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import { BS } from 'utils/UIConstants';
import ErrorDataIcon from 'assets/icons/response_status_handler/ErrorDataIcon';
import { FLOW_STRINGS, STEP_CARD_STRINGS } from '../../EditFlow.strings';

function DeleteFlow(props) {
  const { t } = useTranslation();
  const { onCancelClick, isDraft, id, isModalOpen, onCloseClick } = props;
  const [selectedValue, setSelectedValue] = useState(FLOW_STRINGS.DELETE_FLOW(t).RADIO_GROUP_OPTION_LIST[0].value);

  const onDeleteFlowClickHandler = () => {
    const { onClick } = props;
    onClick(selectedValue);
  };
  return (
    <ModalLayout
      id={id}
      isModalOpen={isModalOpen}
      onCloseClick={onCloseClick}
      headerContent={(
        <h2 className={cx(modalStyles.PageTitle)}>{FLOW_STRINGS.DELETE_FLOW(t).TITLE}</h2>
      )}
      mainContent={(
        <>
          <div className={cx(gClasses.CenterH, gClasses.MT50)}>
            <ErrorDataIcon />
          </div>
          {isDraft ? <Label className={cx(gClasses.MT35, gClasses.CenterH)} content={FLOW_STRINGS.DELETE_FLOW(t).DRAFT} /> : (
            <RadioGroup
              id="delete_flow_radio_group"
              className={cx(gClasses.ML30, gClasses.MT35)}
              optionList={FLOW_STRINGS.DELETE_FLOW(t).RADIO_GROUP_OPTION_LIST}
              selectedValue={selectedValue}
              type={RADIO_GROUP_TYPE.TYPE_2}
              onClick={(value) => setSelectedValue(value)}
              isRequired
              hideLabel
            />
          )}
        </>
      )}
      footerContent={(
        <div className={cx(BS.W100, BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
          <Button
            id="delete_flow_cancel"
            buttonType={BUTTON_TYPE.SECONDARY}
            onClick={onCancelClick}
          >
            {STEP_CARD_STRINGS(t).CANCEL_BUTTON}
          </Button>
          <Button
            id="delete_flow_save"
            buttonType={BUTTON_TYPE.PRIMARY}
            onClick={onDeleteFlowClickHandler}
            className={gClasses.ML30}
          >
            {STEP_CARD_STRINGS(t).DELETE_BUTTON}
          </Button>
        </div>
      )}
    />
  );
}

export default withRouter(DeleteFlow);

DeleteFlow.propTypes = {
  onClick: PropTypes.func,
  onCancelClick: PropTypes.func,
  flowUuid: PropTypes.string.isRequired,
};
