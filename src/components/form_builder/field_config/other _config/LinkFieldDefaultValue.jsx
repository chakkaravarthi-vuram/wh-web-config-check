import React, { useContext } from 'react';
import { Col, Row } from 'reactstrap';
import cx from 'classnames/bind';
import { translate } from 'language/config';
import { LINK_FIELD_PROTOCOL } from 'utils/Constants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import { useTranslation } from 'react-i18next';
import { isEmpty, get, cloneDeep } from '../../../../utils/jsUtility';

import Input from '../../../form_components/input/Input';

import { FIELD_CONFIG } from '../../FormBuilder.strings';

import { ARIA_ROLES, BS, COLOR_CONSTANTS } from '../../../../utils/UIConstants';
import gClasses from '../../../../scss/Typography.module.scss';
import ThemeContext from '../../../../hoc/ThemeContext';
import ADD_NEW_LINK from './LinkFieldDefaultValue.strings';
import styles from './LinkFieldDefaultValue.module.scss';

function LinkFieldDefaultValue(props) {
  const { t } = useTranslation();
  const { BASIC_CONFIG } = FIELD_CONFIG(t);
  const { fieldData, onDefaultChangeHandler, defaultValueError } = props;
  const { buttonColor } = useContext(ThemeContext);
  const defaultValue = get(fieldData, ['default_value'], [{ link_text: '', link_url: LINK_FIELD_PROTOCOL.HTTPS }]);
  const linkDefaultValueChangeHandler = (event, index) => {
    if (event) {
      event.target.index = index;
    }
    if (get(defaultValue, index)) {
      const newDefaultValue = cloneDeep(defaultValue);
      if (event.target.id === BASIC_CONFIG.DEFAULT_LINK_URL.ID) {
        newDefaultValue[index].link_url = event.target.value;
      } else newDefaultValue[index].link_text = event.target.value;
      onDefaultChangeHandler({ target: { value: newDefaultValue } });
    }
  };

  const onAddNewClick = () => {
      const newDefaultValue = [...cloneDeep(defaultValue), { link_text: '', link_url: LINK_FIELD_PROTOCOL.HTTPS }];
      onDefaultChangeHandler({ target: { value: newDefaultValue } });
  };

  const onDefaultValueDeleteHandler = (deleteIndex) => {
    const newDefaultValue = cloneDeep(defaultValue);
    onDefaultChangeHandler({ target: { value: newDefaultValue.filter((_value, index) => deleteIndex !== index) } });
  };

  const defaultValueView = defaultValue.map((currentDefaultValue, index) => (
    <Row>
      <Col xl={5} sm={5}>
        <Input
          label={BASIC_CONFIG.DEFAULT_LINK_URL.LABEL}
          id={BASIC_CONFIG.DEFAULT_LINK_URL.ID}
          onChangeHandler={(event) => linkDefaultValueChangeHandler(event, index)}
          value={get(currentDefaultValue, ['link_url'])}
          key={index}
          errorMessage={!isEmpty((get(defaultValueError, [index, 'link_url'], ''))) && get(defaultValueError, [index, 'link_url'], '').replace('uri', 'url')}
          placeholder={BASIC_CONFIG.DEFAULT_LINK_URL.PLACEHOLDER}
        />
      </Col>
      <Col xl={5} sm={5}>
        <Input
          label={BASIC_CONFIG.DEFAULT_LINK_TEXT.LABEL}
          id={BASIC_CONFIG.DEFAULT_LINK_TEXT.ID}
          key={index}
          onChangeHandler={(event) => linkDefaultValueChangeHandler(event, index)}
          value={get(currentDefaultValue, ['link_text'])}
          errorMessage={get(defaultValueError, [index, 'link_text'])}
          placeholder={BASIC_CONFIG.DEFAULT_LINK_TEXT.PLACEHOLDER}
        />
      </Col>
      <div className={cx(styles.DeleteIconContainer, BS.D_FLEX, BS.JC_CENTER, BS.ALIGN_ITEM_CENTER)}>
        <DeleteIconV2
          className={styles.DeleteIcon}
          onClick={() => onDefaultValueDeleteHandler(index)}
          role={ARIA_ROLES.BUTTON}
          tabIndex={0}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onDefaultValueDeleteHandler(index)}
          ariaLabel={translate('form_field_strings.form_field_constants.delete_link')}
        />
      </div>
    </Row>
  ));
  let isAddNewEnabled = false;
  let alertInformation = null;
 if (
    !isEmpty(fieldData.validations) &&
    fieldData.validations.is_multiple &&
    (!fieldData.validations.maximum_count || (fieldData.validations.maximum_count > defaultValue.length))
  ) {
    isAddNewEnabled = true;
    alertInformation = (get(defaultValueError, ['default_value'], null)) && (
      <div className={cx(styles.ErrorNote, gClasses.FTwo10, gClasses.MB10)}>
        {get(defaultValueError, ['default_value'], null)}
      </div>
    );
  } else {
    alertInformation = (
      <div className={cx(styles.AlertNote, gClasses.FTwo10, gClasses.MB10)}>
        {ADD_NEW_LINK.ENABLE_ADD_NEW_LINK}
      </div>
    );
  }
  return (
    <>
      {defaultValueView}
      <Row>
        <div className={gClasses.ML15}>
          <div
            className={cx(BS.ML_AUTO, isAddNewEnabled && gClasses.CursorPointer, gClasses.WidthFitContent, gClasses.FTwo13, gClasses.MB10)}
            onClick={isAddNewEnabled && onAddNewClick}
            id={ADD_NEW_LINK.ID}
            role="button"
            tabIndex={isAddNewEnabled ? 0 : -1}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && isAddNewEnabled && onAddNewClick()}
            style={{ color: (isAddNewEnabled) ? buttonColor : COLOR_CONSTANTS.GRAY }}
          >
            {ADD_NEW_LINK.LABEL}
          </div>
        </div>
      </Row>
      {alertInformation}
    </>
  );
}

export default LinkFieldDefaultValue;
