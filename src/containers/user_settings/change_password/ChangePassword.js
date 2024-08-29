import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import PasswordHint from 'components/password_hint/PasswordHint';
import PasswordEyeOpen from 'assets/icons/PasswordEyeNew';
import { useTranslation } from 'react-i18next';
import { Button, EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import { useHistory } from 'react-router-dom';
import {
  CURRENT_PASSWORD,
  NEW_PASSWORD,
  NEW_PASSWORD_ID,
  CURRENT_PASSWORD_ID,
  CHANGE_PASSWORD_LABELS,
  CHANGE_PASSWORD_UPDATE_FAILURE,
  CURRENT_PASSWORD_PLACEHOLDER,
} from './ChangePassword.strings';
import gClasses from '../../../scss/Typography.module.scss';
import Input from '../../../components/form_components/input/Input';
// import styles from './ChangePassword.module.scss';
import {
  ACTION_STRINGS,
  EMPTY_STRING,
} from '../../../utils/strings/CommonStrings';
import {
  validate,
  updateErrorPopoverInRedux,
  mergeObjects,
  evaluateAriaLabelMessage,
  evaluateFocusOnError,
  isBasicUserMode,
} from '../../../utils/UtilityFunctions';
import { changePasswordValidationSchema } from './ChangePassword.validation.schema';

import { generatePostServerErrorMessage } from '../../../server_validations/ServerValidation';
import { ARIA_ROLES, BS, INPUT_TYPES } from '../../../utils/UIConstants';
import { cancelChangePassword } from '../../../axios/apiService/changePassword.apiService';
import {
  changePasswordThunk,
  clearStateDataThunk,
  setStateThunk,
} from '../../../redux/actions/ChangePassword.Action';
import { store } from '../../../Store';
import jsUtils from '../../../utils/jsUtility';
import styles from './ChangePassword.module.scss';
import { POPPER_PLACEMENTS } from '../../../components/auto_positioning_popper/AutoPositioningPopper';
import ThemeContext from '../../../hoc/ThemeContext';

function ChangePassword(props) {
  const { t } = useTranslation();
  const { state } = props;
  const { server_error, error_list, current_password, new_password } = state;
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);

  const errors = mergeObjects(error_list, server_error);
  let actionButtons = null;
  const [isPopperOpen, setisPopperOpen] = useState(false);
  const [referencePopperElement, setReferencePopperElement] = useState(null);
  const [focusOnErrorFieldId, setFocusOnErrorFieldId] = useState(null);
  const [focusOnErrorRefresher, setFocusOnErrorRefresher] = useState(false);
  const allFormFieldIds = [CURRENT_PASSWORD_ID, NEW_PASSWORD_ID];

  const onCancelClicked = (event) => {
    const { clearState } = props;
    event.preventDefault();
    clearState();
  };

  const getChangePasswordValidateData = () => {
    const { state } = props;
    const { current_password, new_password } = state;
    return {
      current_password,
      new_password,
    };
  };

  const setfocusonError = (errors) => {
    setFocusOnErrorFieldId((previous_value) => {
      const currentFocusableFieldId = evaluateFocusOnError(
        allFormFieldIds,
        errors,
      );
      if (previous_value === currentFocusableFieldId) {
        setFocusOnErrorRefresher((refresher) => !refresher);
      }
      return currentFocusableFieldId;
    });
  };

  const updateError = (error) => {
    const { setState } = props;
    const errors = generatePostServerErrorMessage(
      error,
      [],
      CHANGE_PASSWORD_LABELS(t),
    );
    setfocusonError && setfocusonError({ ...errors.state_error });
    setState({
      server_error: errors.state_error ? errors.state_error : [],
      common_server_error: errors.common_server_error
        ? errors.common_server_error
        : EMPTY_STRING,
    });
    if (jsUtils.isEmpty(errors.state_error)) {
      updateErrorPopoverInRedux(
        CHANGE_PASSWORD_UPDATE_FAILURE,
        errors.common_server_error,
      );
    }
  };

  const onChangeClicked = (event) => {
    event.preventDefault();
    const errorList = validate(
      getChangePasswordValidateData(),
      changePasswordValidationSchema(t),
      t,
    );
    setfocusonError && setfocusonError(errorList);
    store
      .dispatch(
        setStateThunk({
          error_list: errorList,
          server_error: [],
        }),
      )
      .then(() => {
        const { changePasswordApiCall } = props;
        if (jsUtils.isEmpty(errorList)) {
          const data = getChangePasswordValidateData();
          changePasswordApiCall(data, updateError);
        }
      });
    setisPopperOpen(false);
  };

  const onChangeHandler = (event) => {
    const { setState } = props;
    setState({
      [event.target.id]: event.target.value,
    });
  };

  const onNewPasswordChangeHandler = (event) => {
    const { setState } = props;

    setState({
      [event.target.id]: event.target.value,
    });
  };

  const onBlurHandler = () => {
    setisPopperOpen(false);
  };

  const [currentPasswordIcon, setCurrentPasswordIcon] = useState(false);
  const [newPasswordIcon, setNewPasswordIcon] = useState(false);
  // let eyeIcon = null;

  useEffect(() => {
    const { setState } = props;
    setState({
      server_error: [],
      common_server_error: EMPTY_STRING,
    });
    return () => {
      const { clearState } = props;
      cancelChangePassword();
      clearState();
    };
  }, []);

  // useEffect(() => {
  //   if (isCharacterLimit && isNumericDetection) {
  //     setisPopperOpen(false);
  //   }
  // }, [isCharacterLimit, isNumericDetection]);

  console.log('errors[NEW_PASSWORD_ID]', errors[NEW_PASSWORD_ID]);

  if (!isEmpty(current_password) || !isEmpty(new_password)) {
    actionButtons = (
      <Row className={cx(BS.JC_CENTER)}>
        <Button
          id="change_password_cancel"
          type={EButtonType.SECONDARY}
          onClick={onCancelClicked}
          className={cx(styles.PrimaryButtonClass)}
          primaryNameClass={styles.PrimaryNameClass}
          width100
          buttonText={t('user_settings_strings.user_change_password.discard')}
          colorSchema={isNormalMode ? colorScheme : colorSchemeDefault}
        />

        <Button
          id="change_password_save"
          type={EButtonType.PRIMARY}
          onClick={onChangeClicked}
          className={cx(styles.SecondaryButtonClass)}
          SecondaryNameClass={styles.SecondaryNameClass}
          width100
          buttonText={t('user_settings_strings.user_change_password.change')}
          colorSchema={isNormalMode ? colorScheme : colorSchemeDefault}
        />
      </Row>
    );
  }

  const previewIconButton = () => {
    setCurrentPasswordIcon(!currentPasswordIcon);
  };

  // const onMouseLeaveHandler = () => {
  //   setNewPasswordIcon(false);
  // };

  const newPasswordPreview = () => {
    setNewPasswordIcon(!newPasswordIcon);
  };

  const onFocusHandler = () => {
    setisPopperOpen(true);
  };

  return (
    <>
      {/* Will remove the browser behaviour for adding user name value in other inputs */}
      <input
        type={INPUT_TYPES.TEXT}
        autoComplete={ACTION_STRINGS.OFF}
        className={styles.VisibleHide}
      />
      <input
        type={INPUT_TYPES.PASSWORD}
        autoComplete={ACTION_STRINGS.OFF}
        className={styles.VisibleHide}
      />
      <Row>
        <Col sm={6}>
          <Input
            id={CURRENT_PASSWORD_ID}
            label={t(CURRENT_PASSWORD)}
            value={current_password}
            placeholder={t(CURRENT_PASSWORD_PLACEHOLDER)}
            onBlurHandler={onBlurHandler}
            onChangeHandler={onChangeHandler}
            errorMessage={errors[CURRENT_PASSWORD_ID]}
            type={currentPasswordIcon ? null : INPUT_TYPES.PASSWORD}
            isRequired
            autoFocus
            labelClass={styles.TitleClass}
            focusOnError={focusOnErrorFieldId === CURRENT_PASSWORD_ID}
            focusOnErrorRefresher={focusOnErrorRefresher}
            helperAriaHidden={
              focusOnErrorFieldId === CURRENT_PASSWORD_ID && true
            }
            ariaLabelHelperMessage={evaluateAriaLabelMessage(
              error_list[CURRENT_PASSWORD_ID],
            )}
            onKeyDownHandler={(e) => {
              if (
                e.keyCode === 13 &&
                (!isEmpty(current_password) || !isEmpty(new_password))
              ) {
                onChangeClicked(e);
              }
            }}
            isHideTitle
            icon={
              current_password ? (
                <PasswordEyeOpen
                  // onMouseDown={previewIconButton}
                  // onMouseUp={previewIconButton}
                  tabIndex={0}
                  onClick={previewIconButton}
                  onKeyPress={previewIconButton}
                  role={ARIA_ROLES.SWITCH}
                  onEyeClick={currentPasswordIcon}
                  className={gClasses.CursorPointer}
                  // onMouseLeave={() => setCurrentPasswordIcon(false)}
                />
              ) : null
            }
          />
        </Col>
        <Col sm={6}>
          <div ref={setReferencePopperElement}>
            <Input
              id={NEW_PASSWORD_ID}
              label={t(NEW_PASSWORD)}
              value={new_password}
              placeholder={t(CURRENT_PASSWORD_PLACEHOLDER)}
              onChangeHandler={onNewPasswordChangeHandler}
              onBlurHandler={onBlurHandler}
              autoComplete="new-password"
              errorMessage={errors[NEW_PASSWORD_ID]}
              type={newPasswordIcon ? null : INPUT_TYPES.PASSWORD}
              isRequired
              focusOnError={focusOnErrorFieldId === NEW_PASSWORD_ID}
              focusOnErrorRefresher={focusOnErrorRefresher}
              helperAriaHidden={focusOnErrorFieldId === NEW_PASSWORD_ID && true}
              ariaLabelHelperMessage={evaluateAriaLabelMessage(
                errors[NEW_PASSWORD_ID],
              )}
              onKeyDownHandler={(e) => {
                if (
                  e.keyCode === 13 &&
                  (!isEmpty(current_password) || !isEmpty(new_password))
                ) {
                  onChangeClicked(e);
                }
              }}
              labelClass={styles.TitleClass}
              isHideTitle
              icon={
                new_password ? (
                  <PasswordEyeOpen
                    // onMouseDown={newPasswordPreview}
                    // onMouseUp={newPasswordPreview}
                    className={gClasses.CursorPointer}
                    // onMouseLeave={onMouseLeaveHandler}
                    tabIndex={0}
                    onClick={newPasswordPreview}
                    onKeyPress={newPasswordPreview}
                    role={ARIA_ROLES.SWITCH}
                    onEyeClick={newPasswordIcon}
                  />
                ) : null
              }
              onFocusHandler={() => onFocusHandler()}
            />
            <PasswordHint
              referencePopperElement={referencePopperElement}
              isPopperOpen={isPopperOpen}
              passwordValue={new_password}
              errorMessage={errors[NEW_PASSWORD_ID] || null}
              placement={POPPER_PLACEMENTS.BOTTOM_END}
            />
          </div>
        </Col>
      </Row>
      {actionButtons}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    state: state.ChangePasswordReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearState: () => {
      dispatch(clearStateDataThunk());
    },
    setState: (data) => {
      dispatch(setStateThunk(data));
    },
    changePasswordApiCall: (data, func) => {
      dispatch(changePasswordThunk(data, func));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);

ChangePassword.propTypes = {
  changePasswordApiCall: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired,
  state: PropTypes.objectOf().isRequired,
  setState: PropTypes.func.isRequired,
};
