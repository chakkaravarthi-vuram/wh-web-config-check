import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import cx from 'classnames/bind';
import { connect } from 'react-redux';

import Dropdown from '../../../../../../components/form_components/dropdown/Dropdown';
import FormTitle from '../../../../../../components/form_components/form_title/FormTitle';

import { OTHER_DETAILS_FORM } from './OtherDetails.strings';
import { BS_LAYOUT_COL, BS } from '../../../../../../utils/UIConstants';
import gClasses from '../../../../../../scss/Typography.module.scss';

function OtherDetails(props) {
  const [isDetailsVisible, setDetailsVisibility] = useState(false);
  const {
    isDataLoading,
    role_list,
    role,
    onChangeHandler,
    errors,
    newRoleOrBusinessUnitError,
    addNewRole,
    isAddRoleLoading,
    roles,
    onEnterForAddNewRolePressed,
    business_unit_list,
    business_unit,
    addNewBusinessUnit,
    business_units,
    isAddBusinessUnitLoading,
    onEnterForAddNewBusinessUnitPressed,
  } = props;
  const onAccodionClick = () => {
    setDetailsVisibility(!isDetailsVisible);
  };
  console.log('propsprops', props);

  return (
    <>
      <button
        onClick={onAccodionClick}
        className={cx(gClasses.ClickableElement, BS.W100, gClasses.CursorPointer)}
      >
        <FormTitle isDataLoading={isDataLoading} isAccordion isAccordionOpen={isDetailsVisible}>
          {OTHER_DETAILS_FORM.TITLE}
        </FormTitle>
      </button>

      {isDetailsVisible ? (
          <Row>
            <Col sm={BS_LAYOUT_COL.SIX}>
              <Dropdown
                id={OTHER_DETAILS_FORM.ROLE.ID}
                label={OTHER_DETAILS_FORM.ROLE.LABEL}
                placeholder={OTHER_DETAILS_FORM.ROLE.PLACEHOLDER}
                optionList={role_list}
                selectedValue={role}
                onChange={onChangeHandler}
                onInputChangeHandler={(data) => onChangeHandler(data)}
                errorMessage={
                  errors[OTHER_DETAILS_FORM.ROLE.ID] ||
                  newRoleOrBusinessUnitError[OTHER_DETAILS_FORM.ADD_ROLE.ID]
                }
                onButtonClick={addNewRole}
                textId={OTHER_DETAILS_FORM.ADD_ROLE.ID}
                isDataLoading={isDataLoading || isAddRoleLoading}
                textError={newRoleOrBusinessUnitError[OTHER_DETAILS_FORM.ADD_ROLE.ID]}
                inputValue={roles}
                onKeyDownHandler={onEnterForAddNewRolePressed}
                showDropdownListIfError
                disableFocusFilter
              />
            </Col>
            <Col sm={BS_LAYOUT_COL.SIX}>
              <Dropdown
                id={OTHER_DETAILS_FORM.BUSSINESS_UNIT.ID}
                label={OTHER_DETAILS_FORM.BUSSINESS_UNIT.LABEL}
                placeholder={OTHER_DETAILS_FORM.BUSSINESS_UNIT.PLACEHOLDER}
                optionList={business_unit_list}
                onChange={onChangeHandler}
                selectedValue={business_unit}
                onInputChangeHandler={(data) => onChangeHandler(data)}
                onButtonClick={addNewBusinessUnit}
                errorMessage={
                  errors[OTHER_DETAILS_FORM.BUSSINESS_UNIT.ID] ||
                  newRoleOrBusinessUnitError[OTHER_DETAILS_FORM.ADD_BUSINESS_UIT.ID]
                }
                textId={OTHER_DETAILS_FORM.ADD_BUSINESS_UIT.ID}
                isDataLoading={isDataLoading || isAddBusinessUnitLoading}
                textError={newRoleOrBusinessUnitError[OTHER_DETAILS_FORM.ADD_BUSINESS_UIT.ID]}
                inputValue={business_units}
                onKeyDownHandler={onEnterForAddNewBusinessUnitPressed}
                showDropdownListIfError
                disableFocusFilter
              />
            </Col>
          </Row>
      ) : null}
    </>
  );
}

const mapStateToProps = (state) => {
  const {
    role,
    business_unit,
    role_list,
    business_unit_list,
    roles,
    business_units,
  } = state.AddMemberReducer;
  console.log(
    'addMemberUpdateApiSuccess',
    role,

    role_list,

    roles,
  );

  return {
    role,
    business_unit,
    role_list,
    business_unit_list,
    roles,
    business_units,
  };
};

export default connect(mapStateToProps, null)(OtherDetails);
