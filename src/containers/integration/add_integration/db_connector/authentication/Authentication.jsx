import React, { useContext } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import {
  ETextSize,
  Text,
  SingleDropdown,
  TextInput,
  Button,
  EButtonType,
} from '@workhall-pvt-lmt/wh-ui-library';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { cloneDeep, set, isEmpty } from 'utils/jsUtility';
import { validate } from 'utils/UtilityFunctions';
import ThemeContext from 'hoc/ThemeContext';
import gClasses from 'scss/Typography.module.scss';
import MaskedInput from 'components/masked_input/MaskedInput';
import { dbConnectorDataChange } from 'redux/reducer/IntegrationReducer';
import styles from './Authentication.module.scss';
import TestSuccess from '../test_success/TestSuccess';
import { DB_CONNECTION_AUTHTICATION_STRINGS, TEST_SUCCESS_STRINGS } from '../DBConnector.strings';
import { saveDBConnectorPostApiThunk } from '../../../../../redux/actions/Integration.Action';
import {
  generateDropDownOptions,
  genreateSaveDBConnectorData,
} from '../DBConnector.utils';
import { dbConnectorAuthenticationSchema } from '../DBConnector.validation.schema';
import { DB_TYPE } from '../DBConnector.constant';

function Authentication(props) {
  const {
    dbConnector: {
      _id,
      db_connector_uuid,
      authentication,
      allowed_db_types,
      error_list,
    },
    dbConnectorDataChange,
    saveDBConnectorPostApi,
    isEditView,
  } = props;
  const { t } = useTranslation();
  const { colorSchemeDefault } = useContext(ThemeContext);
  const AUTHENTICATION_STRING = DB_CONNECTION_AUTHTICATION_STRINGS(t);

  let DB_NAME_DETAILS = {
    ...AUTHENTICATION_STRING.DATABASE_NAME,
    value: authentication.db_name,
  };
  if (authentication.db_type === DB_TYPE.ORACLE) {
    DB_NAME_DETAILS = {
      ...AUTHENTICATION_STRING.SERVICE_NAME,
      value: authentication.service_name,
    };
  }

  const onInputChangeHandler = (value, id) => {
    const inputData = cloneDeep(authentication);
    const cloneErrorList = cloneDeep(error_list);
    switch (id) {
      case DB_CONNECTION_AUTHTICATION_STRINGS(t).CONNECTOR_NAME.ID:
        set(inputData, [id], value);
        delete cloneErrorList[id];
        delete cloneErrorList.name;
        break;
      case DB_CONNECTION_AUTHTICATION_STRINGS(t).EXTERNAL_DB_TYPE.ID:
      case DB_CONNECTION_AUTHTICATION_STRINGS(t).DATABASE_HOST_NAME.ID:
      case DB_CONNECTION_AUTHTICATION_STRINGS(t).USERNAME.ID:
      case DB_CONNECTION_AUTHTICATION_STRINGS(t).PASSWORD.ID:
      case DB_CONNECTION_AUTHTICATION_STRINGS(t).DATABASE_NAME.ID:
      case DB_CONNECTION_AUTHTICATION_STRINGS(t).SERVICE_NAME.ID:
        set(inputData, [id], value);
        delete cloneErrorList[id];
        break;
      case DB_CONNECTION_AUTHTICATION_STRINGS(t).PORT.ID:
        inputData.port = Number(value);
        delete cloneErrorList[id];
        break;
      default:
        break;
    }
    dbConnectorDataChange({
      authentication: inputData,
      error_list: cloneErrorList,
    });
  };

  const toggleEdit = (toggle, id) => {
    const inputData = cloneDeep(authentication);
    set(inputData, [`${id}_toggle`], toggle);
    if (!toggle) {
      delete inputData[id];
      set(inputData, [`${id}_preview`], false);
    }
    dbConnectorDataChange({
      authentication: inputData,
    });
  };

  const enablePreview = (id) => {
    const inputData = cloneDeep(authentication);
    set(inputData, [`${id}_preview`], !inputData[`${id}_preview`]);
    dbConnectorDataChange({
      authentication: inputData,
    });
  };

  const onTestAndSaveConnection = () => {
    const cloneAuth = cloneDeep(authentication);
    const errorList = validate(cloneAuth, dbConnectorAuthenticationSchema(t));
    if (isEmpty(errorList)) {
      const data = genreateSaveDBConnectorData(
        authentication,
        _id,
        db_connector_uuid,
      );
      saveDBConnectorPostApi(data, t, false);
    } else {
      dbConnectorDataChange({ error_list: errorList });
    }
  };

  return (
    <div className={styles.OuterContainer}>
      <Text
        content={AUTHENTICATION_STRING.TITLE}
        className={cx(gClasses.MB16)}
        size={ETextSize.XL}
      />
      <TextInput
        id={AUTHENTICATION_STRING.CONNECTOR_NAME.ID}
        className={gClasses.MB16}
        labelText={AUTHENTICATION_STRING.CONNECTOR_NAME.LABEL}
        labelClassName={styles.LabelClassName}
        value={authentication.db_connector_name}
        onChange={(event) => {
          const { value, id } = event.target;
          onInputChangeHandler(value, id);
        }}
        errorMessage={
          error_list[AUTHENTICATION_STRING.CONNECTOR_NAME.ID] ||
          error_list?.name
        }
        required
        readOnly={!isEditView}
      />
      <SingleDropdown
        id={AUTHENTICATION_STRING.EXTERNAL_DB_TYPE.ID}
        className={gClasses.MB16}
        dropdownViewProps={{
          labelName: AUTHENTICATION_STRING.EXTERNAL_DB_TYPE.LABEL,
          labelClassName: styles.LabelClassName,
          isRequired: true,
          disabled: !isEditView,
        }}
        optionList={generateDropDownOptions(allowed_db_types)}
        selectedValue={authentication.db_type}
        onClick={(value, _label, _list, id) => onInputChangeHandler(value, id)}
        errorMessage={error_list[AUTHENTICATION_STRING.EXTERNAL_DB_TYPE.ID]}
      />
      <TextInput
        id={AUTHENTICATION_STRING.DATABASE_HOST_NAME.ID}
        className={gClasses.MB16}
        labelText={AUTHENTICATION_STRING.DATABASE_HOST_NAME.LABEL}
        labelClassName={styles.LabelClassName}
        value={authentication.host}
        onChange={(event) => {
          const { value, id } = event.target;
          onInputChangeHandler(value, id);
        }}
        errorMessage={error_list[AUTHENTICATION_STRING.DATABASE_HOST_NAME.ID]}
        required
        readOnly={!isEditView}
      />
      <TextInput
        id={AUTHENTICATION_STRING.PORT.ID}
        className={cx(gClasses.MB16, gClasses.W150)}
        labelText={AUTHENTICATION_STRING.PORT.LABEL}
        labelClassName={styles.LabelClassName}
        type="number"
        value={authentication.port}
        onChange={(event) => {
          const { value, id } = event.target;
          onInputChangeHandler(value, id);
        }}
        inputInnerClassName={styles.NumberInput}
        errorMessage={error_list[AUTHENTICATION_STRING.PORT.ID]}
        required
        readOnly={!isEditView}
      />
      <Row>
        <Col>
          <TextInput
            id={AUTHENTICATION_STRING.USERNAME.ID}
            className={gClasses.MB16}
            labelText={AUTHENTICATION_STRING.USERNAME.LABEL}
            labelClassName={styles.LabelClassName}
            value={authentication.username}
            onChange={(event) => {
              const { value, id } = event.target;
              onInputChangeHandler(value, id);
            }}
            errorMessage={error_list[AUTHENTICATION_STRING.USERNAME.ID]}
            required
            readOnly={!isEditView}
          />
        </Col>
        <Col>
          <MaskedInput
            id={AUTHENTICATION_STRING.PASSWORD.ID}
            className={cx(gClasses.FlexGrow1, gClasses.MB16)}
            label={AUTHENTICATION_STRING.PASSWORD.LABEL}
            labelClassName={styles.LabelClassName}
            hasSavedValue={authentication?.is_credentials_saved}
            isEdit={
              authentication[`${AUTHENTICATION_STRING.PASSWORD.ID}_toggle`]
            }
            toggleEdit={(value) =>
              toggleEdit(value, AUTHENTICATION_STRING.PASSWORD.ID)
            }
            value={authentication.password}
            onChangeHandler={(event) => {
              const { value, id } = event.target;
              onInputChangeHandler(value, id);
            }}
            isPreviewEnabled={
              authentication[`${AUTHENTICATION_STRING.PASSWORD.ID}_preview`]
            }
            enablePreview={() =>
              enablePreview(AUTHENTICATION_STRING.PASSWORD.ID)
            }
            errorMessage={error_list[AUTHENTICATION_STRING.PASSWORD.ID]}
            isRequired
            readOnly={!isEditView}
          />
        </Col>
      </Row>
      <TextInput
        id={DB_NAME_DETAILS.ID}
        className={gClasses.MB16}
        labelText={DB_NAME_DETAILS.LABEL}
        labelClassName={styles.LabelClassName}
        value={DB_NAME_DETAILS.value}
        onChange={(event) => {
          const { value, id } = event.target;
          onInputChangeHandler(value, id);
        }}
        errorMessage={error_list[DB_NAME_DETAILS.ID]}
        required={authentication.db_type !== DB_TYPE.ORACLE}
        readOnly={!isEditView}
      />
      {isEditView && authentication.is_connection_established && (
        <TestSuccess
          className={gClasses.MB16}
          description={TEST_SUCCESS_STRINGS(t).AUTH_DESCRIPTION}
        />
      )}
      {isEditView && (
        <Button
          buttonText={
            authentication.is_connection_established
              ? AUTHENTICATION_STRING.BUTTON.TEST_AGAIN
              : AUTHENTICATION_STRING.BUTTON.TEST_AND_SAVE
          }
          type={EButtonType.SECONDARY}
          colorSchema={colorSchemeDefault}
          onClickHandler={onTestAndSaveConnection}
        />
      )}
    </div>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    dbConnector: IntegrationReducer.dbConnector,
  };
};

const mapDispatchToProps = {
  dbConnectorDataChange,
  saveDBConnectorPostApi: saveDBConnectorPostApiThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);
