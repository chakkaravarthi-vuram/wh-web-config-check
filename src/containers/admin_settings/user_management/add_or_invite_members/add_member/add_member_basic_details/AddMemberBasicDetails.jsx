import React from 'react';
import { Row, Col } from 'reactstrap';
import { isEmpty } from 'lodash';

import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import Input from '../../../../../../components/form_components/input/Input';
import RadioGroup from '../../../../../../components/form_components/radio_group/RadioGroup';
import FormTitle from '../../../../../../components/form_components/form_title/FormTitle';
import CheckboxGroup from '../../../../../../components/form_components/checkbox_group/CheckboxGroup';

import { ADD_MEMBER_BASIC_DETAILS_FORM } from './AddMemberBasicDetails.strings';
import {
  BS_LAYOUT_COL,
  INPUT_NAME,
} from '../../../../../../utils/UIConstants';

import { OTHER_DETAILS_FORM } from '../other_details/OtherDetails.strings';
import gClasses from '../../../../../../scss/Typography.module.scss';
import styles from './AddMemberBasicDetails.module.scss';
import AddMembers from '../../../../../../components/member_list/add_members/AddMembers';

function AddMemberBasicDetails(props) {
  const { t } = useTranslation();
  const { not_reporting, removeUserHandler, isDataLoading, formDetails, onChangeHandler, onKeyDownHandler, errors, onBlurHandler, isEditable, onUserTypeSelect, reportingManagerSearchText, setReportingManagerSearchText, onReportingManagerCBToggle, onFocusHandler } = props;
  const { focusOnErrorFieldId, focusOnErrorRefresher } = props;
  const memmberArray = [];
  if (!isEmpty(formDetails[OTHER_DETAILS_FORM.REPORTING_MANAGER.ID])) {
    memmberArray.push(
      formDetails[OTHER_DETAILS_FORM.REPORTING_MANAGER.ID],
    );
  }
  return (
    <>
      <FormTitle isDataLoading={isDataLoading}>
        {t(ADD_MEMBER_BASIC_DETAILS_FORM.TITLE)}
      </FormTitle>
      <Row>
        <Col sm={BS_LAYOUT_COL.SIX}>
          <Input
            id={ADD_MEMBER_BASIC_DETAILS_FORM.FIRST_NAME.ID}
            label={t(ADD_MEMBER_BASIC_DETAILS_FORM.FIRST_NAME.LABEL)}
            placeholder={t(ADD_MEMBER_BASIC_DETAILS_FORM.FIRST_NAME.PLACEHOLDER)}
            value={formDetails.first_name}
            onChangeHandler={onChangeHandler}
            errorMessage={
              errors[ADD_MEMBER_BASIC_DETAILS_FORM.FIRST_NAME.ID]
            }
            isRequired
            onKeyDownHandler={onKeyDownHandler}
            isDataLoading={isDataLoading}
            focusOnError={focusOnErrorFieldId === ADD_MEMBER_BASIC_DETAILS_FORM.FIRST_NAME.ID}
            focusOnErrorRefresher={focusOnErrorRefresher}
          />
        </Col>
        <Col sm={BS_LAYOUT_COL.SIX}>
          <Input
            id={ADD_MEMBER_BASIC_DETAILS_FORM.LAST_NAME.ID}
            label={t(ADD_MEMBER_BASIC_DETAILS_FORM.LAST_NAME.LABEL)}
            placeholder={t(ADD_MEMBER_BASIC_DETAILS_FORM.LAST_NAME.PLACEHOLDER)}
            value={formDetails.last_name}
            onChangeHandler={onChangeHandler}
            errorMessage={
              errors[ADD_MEMBER_BASIC_DETAILS_FORM.LAST_NAME.ID]
            }
            isRequired
            onKeyDownHandler={onKeyDownHandler}
            isDataLoading={isDataLoading}
            focusOnError={focusOnErrorFieldId === ADD_MEMBER_BASIC_DETAILS_FORM.LAST_NAME.ID}
            focusOnErrorRefresher={focusOnErrorRefresher}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={BS_LAYOUT_COL.TWELVE}>
          <Input
            id={ADD_MEMBER_BASIC_DETAILS_FORM.EMAIL.ID}
            label={t(ADD_MEMBER_BASIC_DETAILS_FORM.EMAIL.LABEL)}
            placeholder={t(ADD_MEMBER_BASIC_DETAILS_FORM.EMAIL.PLACEHOLDER)}
            value={formDetails.email}
            onChangeHandler={onChangeHandler}
            onBlurHandler={onBlurHandler}
            errorMessage={errors[ADD_MEMBER_BASIC_DETAILS_FORM.EMAIL.ID]}
            isRequired
            onKeyDownHandler={onKeyDownHandler}
            isDataLoading={isDataLoading}
            focusOnError={focusOnErrorFieldId === ADD_MEMBER_BASIC_DETAILS_FORM.EMAIL.ID}
            focusOnErrorRefresher={focusOnErrorRefresher}
            onFocusHandler={onFocusHandler}
          />
        </Col>
        <Col sm={BS_LAYOUT_COL.TWELVE}>
          <Input
            id={ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.ID}
            label={t(ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.LABEL)}
            placeholder={t(ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.PLACEHOLDER)}
            value={formDetails.username}
            onChangeHandler={onChangeHandler}
            onBlurHandler={onBlurHandler}
            errorMessage={
              errors[ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.ID]
            }
            isRequired
            onKeyDownHandler={onKeyDownHandler}
            readOnly={isEditable}
            isDataLoading={isDataLoading}
            focusOnError={focusOnErrorFieldId === ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.ID}
            focusOnErrorRefresher={focusOnErrorRefresher}
            onFocusHandler={onFocusHandler}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <RadioGroup
            optionList={
              ADD_MEMBER_BASIC_DETAILS_FORM.USER_TYPE_RADIO(t).OPTION_LIST
            }
            name={INPUT_NAME.RADIO_GROUP_NAME}
            onClick={onUserTypeSelect}
            selectedValue={formDetails.user_type}
            label={ADD_MEMBER_BASIC_DETAILS_FORM.USER_TYPE_RADIO(t).LABEL}
            isRequired
            isDataLoading={isDataLoading}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <AddMembers
            id={OTHER_DETAILS_FORM.REPORTING_MANAGER.ID}
            className={cx(not_reporting && styles.isSelectCheckBox)}
            label={t(OTHER_DETAILS_FORM.REPORTING_MANAGER.LABEL)}
            onUserSelectHandler={onChangeHandler}
            selectedData={memmberArray}
            removeSelectedUser={removeUserHandler}
            errorText={
              not_reporting
                ? null
                : errors[OTHER_DETAILS_FORM.REPORTING_MANAGER.ID]
            }
            selectedSuggestionData={
              formDetails[OTHER_DETAILS_FORM.REPORTING_MANAGER.ID]
            }
            memberSearchValue={reportingManagerSearchText}
            setMemberSearchValue={setReportingManagerSearchText}
            isActive
            lastSignin
            focusOnError={focusOnErrorFieldId === OTHER_DETAILS_FORM.REPORTING_MANAGER.ID}
            focusOnErrorRefresher={focusOnErrorRefresher}
            disabled={not_reporting}
          />
          <CheckboxGroup
            optionList={ADD_MEMBER_BASIC_DETAILS_FORM.REPORTING_MANAGER_CB(t)}
            onClick={onReportingManagerCBToggle}
            selectedValues={not_reporting ? [1] : []}
            className={gClasses.MT5}
            hideLabel
            isDataLoading={isDataLoading}
          />
        </Col>
      </Row>
    </>
  );
}
export default AddMemberBasicDetails;
