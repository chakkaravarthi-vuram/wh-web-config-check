import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import cx from 'classnames/bind';

import Input from '../../../../../../components/form_components/input/Input';
import MobileNumber from '../../../../../../components/form_components/mobile_number/MobileNumber';
import FormTitle from '../../../../../../components/form_components/form_title/FormTitle';

import { CONTACT_DETAILS_FORM } from './ContactDetails.strings';
import { BS_LAYOUT_COL, BS } from '../../../../../../utils/UIConstants';
import gClasses from '../../../../../../scss/Typography.module.scss';

function ContactDetails(props) {
  const [isDetailsVisible, setDetailsVisibility] = useState(false);

  const onAccodionClick = () => {
    setDetailsVisibility(!isDetailsVisible);
  };

  const { formDetails, onChangeHandler, onKeyDownHandler, errors, setCountryCode, isDataLoading } = props;

  return (
    <>
      <button onClick={onAccodionClick} className={cx(gClasses.ClickableElement, BS.W100, gClasses.CursorPointer)}>
        <FormTitle isDataLoading={isDataLoading} isAccordion isAccordionOpen={isDetailsVisible}>
          {CONTACT_DETAILS_FORM.TITLE}
        </FormTitle>
      </button>
      {isDetailsVisible ? (
        <Row>
          <Col sm={BS_LAYOUT_COL.SIX}>
            <Input
              id={CONTACT_DETAILS_FORM.PHONE_NUMBER.ID}
              label={CONTACT_DETAILS_FORM.PHONE_NUMBER.LABEL}
              placeholder={CONTACT_DETAILS_FORM.PHONE_NUMBER.PLACEHOLDER}
              value={formDetails.phone_number}
              onChangeHandler={onChangeHandler}
              errorMessage={errors[CONTACT_DETAILS_FORM.PHONE_NUMBER.ID]}
              onKeyDownHandler={onKeyDownHandler}
              isDataLoading={isDataLoading}
            />
          </Col>
          <Col sm={BS_LAYOUT_COL.SIX}>
            <MobileNumber
              onCountryCodeChange={setCountryCode}
              onChangeHandler={onChangeHandler}
              countryCodeId={formDetails.mobile_number_country_code}
              mobile_number={formDetails.mobile_number}
              errorMessage={errors[CONTACT_DETAILS_FORM.MOBILE_NUMBER.ID]}
              label={CONTACT_DETAILS_FORM.MOBILE_NUMBER.LABEL}
              placeholder={CONTACT_DETAILS_FORM.MOBILE_NUMBER.PLACEHOLDER}
              id={CONTACT_DETAILS_FORM.MOBILE_NUMBER.ID}
              onKeyDownHandler={onKeyDownHandler}
              isDataLoading={isDataLoading}
            />
          </Col>
        </Row>
      ) : null}
    </>
  );
}
export default ContactDetails;
