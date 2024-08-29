import React from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { integrationDataChange } from 'redux/reducer/IntegrationReducer';
import { cloneDeep, set, get, isEmpty } from 'utils/jsUtility';
import MaskedInput from 'components/masked_input/MaskedInput';
import { useTranslation } from 'react-i18next';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import gClasses from 'scss/Typography.module.scss';
import { Col, Row } from 'reactstrap';
import { AUTHENTICATION_TYPE_CONSTANTS, AUTHORIZATION_STATUS } from 'containers/integration/Integration.utils';
import { AUTHORIZATION_STATUS_STRINGS, CALL_BACK_URL_STRINGS } from 'containers/integration/Integration.strings';
import { BS } from 'utils/UIConstants';
import { keydownOrKeypessEnterHandle, updatePostLoader } from 'utils/UtilityFunctions';
import RefreshIcon from 'assets/icons/integration/RefreshIcon';
import AlertIcon from 'assets/icons/integration/AlertIcon';
import NewCorrectIcon from 'assets/icons/NewCorrectIcon';
import { Button, Checkbox, EButtonType, ECheckboxSize, SingleDropdown, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import styles from '../Authentication.module.scss';
import { generateEventTargetObject } from '../../../../../utils/generatorUtils';
import CopyClipboard from '../../../../../components/copy_clipboard/CopyClipboard';
import { INTEGRATION_STRINGS } from '../../../Integration.utils';

function BasicAuth(props) {
  const {
    authentication = {},
    displayCallbackUrl,
    initiateAuthorization,
    needToAuthorize,
    // initialAuthType,
    // currentAuthType,
    error_list,
    integrationDataChange,
    keyLabel,
    keyId,
    addToId,
    addToLabel,
    valueLabel,
    valueId,
    addonKeyLabel,
    addonKeyId,
    addonValueLabel,
    addonValueId,
    scopeId,
    scopeLabel,
    tokenUrlId,
    tokenUrlLabel,
    authUrlId,
    authUrlLabel,
    hasSaved,
    addToOptions,
    isExternalIntegration,
    isEditView,
    updateAuthTokenUrl,
    authenticationType,
    state: {
      selected_template_details = {},
    },
    isLoadingIntegrationDetail,
  } = cloneDeep(props);
  const { t } = useTranslation();

  const enablePreview = (id) => {
    set(authentication, [`${id}_preview`], !authentication[`${id}_preview`]);
    integrationDataChange({
      authentication,
    });
  };

  const handleChangeHandler = (e) => {
    const clonedErrorList = cloneDeep(error_list) || {};
    if ([AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE, AUTHENTICATION_TYPE_CONSTANTS.OAUTH_CLIENT_CODE].includes(authentication.type)) {
      set(authentication, ['authorization_status'], AUTHORIZATION_STATUS.YET_TO_INITIATE);
    }
    if (e.target.id === INTEGRATION_STRINGS.AUTHENTICATION.PKCE.ID) {
      set(authentication, [e.target.id], !authentication[e.target.id]);
    } else {
      set(authentication, [e.target.id], e.target.value);
    }

    delete clonedErrorList?.[`authentication,${e.target.id}`];

    integrationDataChange({
      authentication,
      error_list: clonedErrorList,
    });
  };
  const toggleEdit = (toggle, id) => {
    set(authentication, [`${id}_toggle`], toggle);
    if (!toggle) {
      set(authentication, [id], EMPTY_STRING);
      set(authentication, [`${id}_preview`], false);
    }
    integrationDataChange({
      authentication,
    });
  };

  let authrizationAction = null;
  let callbackUrlComponent = null;

  if (displayCallbackUrl) {
    callbackUrlComponent = (
      <div className={styles.CallbackContainer}>
        <div className={cx(styles.CallbackTitle, gClasses.FTwo13GrayV89)}>{t(CALL_BACK_URL_STRINGS.TITLE)}</div>
        <div className={cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw, gClasses.AlignCenter)}>
          <p className={cx(gClasses.FTwo16GrayV3, styles.Link)}>{authentication?.redirect_uri}</p>
          <CopyClipboard id={t(CALL_BACK_URL_STRINGS.TITLE)} copyText={authentication?.redirect_uri} />
        </div>
        {/* yet to update */}
        <div className={cx(styles.InfoContainer, gClasses.FOne13OrangeV25)}>
          <p>{t(CALL_BACK_URL_STRINGS.DESCRIPTION_1)}</p>
          <p className={gClasses.MB0}>{t(CALL_BACK_URL_STRINGS.DESCRIPTION_2)}</p>
        </div>
      </div>
    );
  }

  if (isEditView && needToAuthorize) {
    switch (authentication?.authorization_status) {
      case AUTHORIZATION_STATUS.IN_PROGRESS:
      case AUTHORIZATION_STATUS.API_IN_PROGRESS:
        authrizationAction = (
          <Button
            buttonText={t(AUTHORIZATION_STATUS_STRINGS.YET_TO_START)}
            type={EButtonType.PRIMARY}
            className={gClasses.MB16}
            disabled
          />
        );
        updatePostLoader(true);
        break;
      case AUTHORIZATION_STATUS.SUCCESS:
        updatePostLoader(false);
        authrizationAction = (
          <div className={cx(styles.Success, gClasses.CenterV, gClasses.MB14)}>
            <NewCorrectIcon className={cx(gClasses.MR8, styles.SuccessIcon)} />
            {t(AUTHORIZATION_STATUS_STRINGS.SUCCESS)}
          </div>
        );
        break;
      case AUTHORIZATION_STATUS.FAILURE:
      case AUTHORIZATION_STATUS.ABORTED:
        updatePostLoader(false);
        authrizationAction = (
          <div className={cx(BS.D_FLEX, gClasses.MB16)}>
            <div className={styles.AuthFailed}>
              {AUTHORIZATION_STATUS.FAILURE ? (
                <div className={gClasses.CenterV}>
                  <AlertIcon className={cx(gClasses.MR8, styles.AuthIcon)} />
                  {t(AUTHORIZATION_STATUS_STRINGS.FAILURE)}
                </div>
              ) : t(AUTHORIZATION_STATUS_STRINGS.ABORTED)}
            </div>
            <div
              tabIndex={0}
              role="button"
              onClick={initiateAuthorization}
              onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && initiateAuthorization()}
              className={cx(gClasses.CenterV, styles.TryAgain, gClasses.ML18, gClasses.CursorPointer)}
            >
              <RefreshIcon className={cx(gClasses.MR8, styles.AuthIcon)} />
              {t(AUTHORIZATION_STATUS_STRINGS.TRY_AGAIN)}
            </div>
          </div>
        );
        break;
      case AUTHORIZATION_STATUS.SUCCESS_WITH_WARNING:
        authrizationAction = (
          <>
            <div className={cx(styles.InfoContainer, gClasses.FOne13OrangeV25, gClasses.MB10)}>
              {t(AUTHORIZATION_STATUS_STRINGS.WARNING)}
            </div>
            <Button
              buttonText={t(AUTHORIZATION_STATUS_STRINGS.AUTHORIZE_AGAIN)}
              type={EButtonType.PRIMARY}
              className={gClasses.MB24}
              onClickHandler={initiateAuthorization}
            />
          </>
        );
        break;
      default:
        authrizationAction = (
          <Button
            buttonText={t(AUTHORIZATION_STATUS_STRINGS.YET_TO_START)}
            type={EButtonType.PRIMARY}
            className={gClasses.MB24}
            onClickHandler={initiateAuthorization}
          />
        );
        break;
    }
  }

  const externalAuthDetails = get(selected_template_details, 'authentication', {});

  let authUrlComponent = null;
  let tokenUrlComponent = null;

  const getAuthTokenUrlOptions = (urlArray) => {
    if (!isEmpty(urlArray)) {
      return urlArray?.map((apiUrl) => {
        return {
          label: apiUrl,
          value: apiUrl,
        };
      });
    }
    return [];
  };

  if (isExternalIntegration) {
    authUrlComponent = authUrlId && (
      <Row>
        <Col sm={12}>
          {!isLoadingIntegrationDetail && (
            <SingleDropdown
              id={authUrlId}
              dropdownViewProps={{
                labelName: authUrlLabel,
                isRequired: true,
                disabled:
                  (isExternalIntegration && !updateAuthTokenUrl) || !isEditView,
                labelClassName: styles.LabelClassName,
              }}
              optionList={getAuthTokenUrlOptions(
                get(
                  selected_template_details,
                  ['authentication', 'authorization_url'],
                  [],
                ),
              )}
              onClick={(value, _label, _list, id) =>
                handleChangeHandler(generateEventTargetObject(id, value))
              }
              selectedValue={authentication[authUrlId]}
              errorMessage={get(
                error_list,
                [`authentication,${authUrlId}`],
                EMPTY_STRING,
              )}
              className={styles.AdminFormFields}
            />
          )}
        </Col>
      </Row>
    );
    tokenUrlComponent = tokenUrlId && (
      <Row>
        <Col sm={12}>
          {!isLoadingIntegrationDetail && (
            <SingleDropdown
              id={tokenUrlId}
              dropdownViewProps={{
                labelName: tokenUrlLabel,
                isRequired: true,
                disabled:
                  (isExternalIntegration && !updateAuthTokenUrl) || !isEditView,
                labelClassName: styles.LabelClassName,
              }}
              optionList={getAuthTokenUrlOptions(
                get(
                  selected_template_details,
                  ['authentication', 'token_request_url'],
                  [],
                ),
              )}
              onClick={(value, _label, _list, id) =>
                handleChangeHandler(generateEventTargetObject(id, value))
              }
              selectedValue={authentication[tokenUrlId]}
              errorMessage={get(
                error_list,
                [`authentication,${tokenUrlId}`],
                EMPTY_STRING,
              )}
              className={styles.AdminFormFields}
            />
          )}
        </Col>
      </Row>
    );
  } else {
    authUrlComponent = authUrlId && (
      <Row>
        <Col sm={12}>
          <TextInput
            labelText={authUrlLabel}
            onChange={handleChangeHandler}
            id={authUrlId}
            value={authentication[authUrlId]}
            errorMessage={get(error_list, [`authentication,${authUrlId}`], EMPTY_STRING)}
            readOnly={(isExternalIntegration && !updateAuthTokenUrl) || !isEditView}
            labelClassName={styles.LabelClassName}
            className={styles.AdminFormFields}
            required
          />
        </Col>
      </Row>
    );
    tokenUrlComponent = tokenUrlId && (
      <Row>
        <Col sm={12}>
          <TextInput
            labelText={tokenUrlLabel}
            onChange={handleChangeHandler}
            id={tokenUrlId}
            value={authentication[tokenUrlId]}
            errorMessage={get(error_list, [`authentication,${tokenUrlId}`], EMPTY_STRING)}
            readOnly={(isExternalIntegration && !updateAuthTokenUrl) || !isEditView}
            labelClassName={styles.LabelClassName}
            className={styles.AdminFormFields}
            required
          />
        </Col>
      </Row>
    );
  }

  return (
    <div>
      {callbackUrlComponent}
      {authUrlComponent}
      <Row>
        {keyId && (
          <Col sm={12} md={6}>
            <TextInput
              labelText={keyLabel}
              onChange={handleChangeHandler}
              id={keyId}
              value={authentication[keyId]}
              errorMessage={get(
                error_list,
                [`authentication,${keyId}`],
                EMPTY_STRING,
              )}
              readOnly={
                (isExternalIntegration &&
                  !isEmpty(externalAuthDetails[keyId])) ||
                !isEditView
              }
              labelClassName={styles.LabelClassName}
              className={styles.AdminFormFields}
              required
            />
          </Col>
        )}
        {valueId && (
          <Col sm={12} md={6}>
            <MaskedInput
              className={styles.MaskedInput}
              isEdit={authentication[`${valueId}_toggle`]}
              hasSavedValue={hasSaved}
              toggleEdit={(value) => toggleEdit(value, valueId)}
              label={valueLabel}
              onChangeHandler={handleChangeHandler}
              id={valueId}
              errorMessage={get(
                error_list,
                [`authentication,${valueId}`],
                EMPTY_STRING,
              )}
              enablePreview={() => enablePreview(valueId)}
              isPreviewEnabled={authentication[`${valueId}_preview`]}
              value={authentication[valueId]}
              isRequired
              labelClassName={styles.LabelClassName}
              readOnly={!isEditView}
            />
          </Col>
        )}
      </Row>
      <Row>
        {addonKeyId && (
          <Col sm={12} md={6}>
            <TextInput
              labelText={addonKeyLabel}
              onChange={handleChangeHandler}
              id={addonKeyId}
              value={authentication[addonKeyId]}
              errorMessage={get(
                error_list,
                [`authentication,${addonKeyId}`],
                EMPTY_STRING,
              )}
              readOnly={
                (isExternalIntegration &&
                  !isEmpty(externalAuthDetails[addonKeyId])) ||
                !isEditView
              }
              labelClassName={styles.LabelClassName}
              className={styles.AdminFormFields}
              required
            />
          </Col>
        )}
        {addonValueId && (
          <Col sm={12} md={6}>
            <MaskedInput
              className={styles.MaskedInput}
              isEdit={authentication[`${addonValueId}_toggle`]}
              hasSavedValue={hasSaved}
              toggleEdit={(value) => toggleEdit(value, addonValueId)}
              label={addonValueLabel}
              onChangeHandler={handleChangeHandler}
              id={addonValueId}
              errorMessage={get(
                error_list,
                [`authentication,${addonValueId}`],
                EMPTY_STRING,
              )}
              enablePreview={() => enablePreview(addonValueId)}
              isPreviewEnabled={authentication[`${addonValueId}_preview`]}
              value={authentication[addonValueId]}
              isRequired
              labelClassName={styles.LabelClassName}
              readOnly={!isEditView}
            />
          </Col>
        )}
      </Row>
      {addToId && (
        <Row>
          <Col sm={12} md={6}>
            {!isLoadingIntegrationDetail && (
              <SingleDropdown
                id={addToId}
                dropdownViewProps={{
                  labelName: addToLabel,
                  isRequired: true,
                  disabled:
                    (isExternalIntegration &&
                      !isEmpty(externalAuthDetails[addToId])) ||
                    !isEditView,
                  labelClassName: styles.LabelClassName,
                }}
                optionList={addToOptions}
                onClick={(value, _label, _list, id) =>
                  handleChangeHandler(generateEventTargetObject(id, value))
                }
                selectedValue={authentication[addToId]}
                errorMessage={get(
                  error_list,
                  [`authentication,${addToId}`],
                  EMPTY_STRING,
                )}
                className={styles.AdminFormFields}
              />
            )}
          </Col>
        </Row>
      )}
      {scopeId && (
        <Row>
          <Col sm={12}>
            <TextInput
              labelText={scopeLabel}
              onChange={handleChangeHandler}
              id={scopeId}
              value={authentication[scopeId]}
              errorMessage={get(
                error_list,
                [`authentication,${scopeId}`],
                EMPTY_STRING,
              )}
              labelClassName={styles.LabelClassName}
              readOnly={
                (isExternalIntegration &&
                  !isEmpty(externalAuthDetails[scopeId])) ||
                !isEditView
              }
              className={styles.AdminFormFields}
            />
          </Col>
        </Row>
      )}
      {tokenUrlComponent}
      {
        (authenticationType === AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE) && (
          <Checkbox
            id={INTEGRATION_STRINGS.AUTHENTICATION.PKCE.ID}
            className={cx(gClasses.MB16)}
            isValueSelected={authentication[INTEGRATION_STRINGS.AUTHENTICATION.PKCE.ID]}
            details={INTEGRATION_STRINGS.AUTHENTICATION.PKCE_OPTION(t)}
            size={ECheckboxSize.SM}
            onClick={(value) => handleChangeHandler(
              generateEventTargetObject(INTEGRATION_STRINGS.AUTHENTICATION.PKCE.ID, value),
            )}
            disabled={!isEditView}
            labelClassName={styles.LabelClassName}
          />
        )
      }
      {authrizationAction}
    </div>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    authentication: IntegrationReducer.authentication,
    error_list: IntegrationReducer.error_list,
    state: IntegrationReducer,
  };
};

const mapDispatchToProps = {
  integrationDataChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(BasicAuth);
