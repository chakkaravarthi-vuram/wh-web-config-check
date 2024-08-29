import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { translate } from 'language/config';
import EditIconV2 from 'assets/icons/form_fields/EditIconV2';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import styles from './LinkField.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import LINK_FIELD_STRINGS from './LinkField.Utils';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import ThemeContext from '../../../hoc/ThemeContext';
import Input from '../input/Input';
import { EMPTY_STRING, SPACE } from '../../../utils/strings/CommonStrings';
import { FIELD_CONFIG } from '../../form_builder/FormBuilder.strings';
import ADD_NEW_LINK from '../../form_builder/field_config/other _config/LinkFieldDefaultValue.strings';
import { cloneDeep, get, isEmpty, set } from '../../../utils/jsUtility';
import { keydownOrKeypessEnterHandle, showToastPopover } from '../../../utils/UtilityFunctions';
import { FORM_POPOVER_STATUS } from '../../../utils/Constants';
import HelperMessage, { HELPER_MESSAGE_TYPE } from '../helper_message/HelperMessage';
import Label from '../label/Label';
import SkeletonWrapper from '../../skeleton_wrapper/SkeletonWrapper';

function LinkField(props) {
  const {
    className, onChangeHandler, id, innerClassName, bgClassName,
    label, hideLabel, readOnly, disabled, links = [], fieldVisibility,
    helperTooltipMessage, helperToolTipId, instructionMessage,
    errorMessage, isRequired, creationView, isMultiple, isDataLoading, editIcon, deleteIcon, labelClass,
    fieldTypeInstruction, referenceName, isImported, isNameWithHyperlink, isTable,
    isCreationField,
    instructionClass,
  } = props;
  const { t } = useTranslation();
  const { buttonColor } = useContext(ThemeContext);
  const [currentEditIndex, setCurrentEditIndex] = useState();
  const [stateLink, setLink] = useState(isEmpty(links) ? [] : [...links]);
  const isLinkEmpty = !!isEmpty(links);
  useEffect(() => {
    if (!disabled && !readOnly && isEmpty(stateLink) && onChangeHandler) {
      setCurrentEditIndex(0);
      setLink([{ link_text: '', link_url: '' }]);
    }
  }, []);

  useEffect(() => {
    if (!disabled && !readOnly && isEmpty(links) && onChangeHandler) {
      setCurrentEditIndex(0);
      setLink([{ link_text: '', link_url: '' }]);
    }
  }, [isLinkEmpty]);

  useEffect(() => {
    if (fieldVisibility === true && !disabled && !readOnly && isEmpty(stateLink) && onChangeHandler) {
      setCurrentEditIndex(0);
      setLink([{ link_text: '', link_url: '' }]);
    }
  }, [fieldVisibility]);

  const onAddNewClickHandler = () => {
    if (!isEmpty(stateLink)) {
      if (isEmpty(get(stateLink, [stateLink.length - 1, 'link_text'])) || isEmpty(get(stateLink, [stateLink.length - 1, 'link_url']))) {
        return showToastPopover(
          translate('error_popover_status.link_required'),
          translate('error_popover_status.enter_link'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
    }
    const newIndex = stateLink ? stateLink.length : 0;
    setCurrentEditIndex(newIndex);
    return setLink([...(stateLink || []), { link_text: '', link_url: '' }]);
  };

  const onEditHandler = (index) => {
    if (index === currentEditIndex) {
      onChangeHandler([...stateLink]);
      return setCurrentEditIndex(null);
    }
    return setCurrentEditIndex(index);
  };

  const onInputChangeHandler = (value, id, index) => {
    const editedLink = { ...get(stateLink, [index], null) };
    if (editedLink) {
      if (id === FIELD_CONFIG(t).BASIC_CONFIG.LINK_URL.ID) editedLink[id] = value ? value.trim() : value;
      else editedLink[id] = value;
      const newLinks = cloneDeep(stateLink);
      set(newLinks, [index], editedLink);
      setLink(newLinks);
      onChangeHandler([...newLinks]);
    }
  };
  const onLinkTextURLHandeler = (value) => {
    if (value.link_text && value.link_url) {
      const newIndex = stateLink ? stateLink.length : 0;
      setCurrentEditIndex(newIndex);
      return setLink([...(stateLink || [])]);
    } else if (
      isEmpty(value.link_text) &&
      isEmpty(value.link_url) &&
      (currentEditIndex === stateLink.length - 1)
      ) {
      const newLinks = cloneDeep(stateLink);
      newLinks.splice(currentEditIndex, 1);
      return onChangeHandler([...newLinks]);
    }
    return null;
  };

  const onDeleteHandler = (index) => {
    // if (index === currentEditIndex) setCurrentEditIndex(null);
    // let found = false;
    const newLinks = stateLink.filter((_link, linkIndex) => {
      if (index === linkIndex) {
        // found = true;
        return false;
      }
      return true;
    });
    if (isEmpty(newLinks)) {
      onChangeHandler(null);
    } else {
      onChangeHandler(newLinks);
    }
    setLink(newLinks);
    // if (found) setCurrentEditIndex(currentEditIndex - 1);
  };

  const instructionComponent = (instructionMessage && (
    <div className={cx(gClasses.MT5, gClasses.FontStyleNormal, gClasses.FOne13GrayV14, gClasses.WordWrap, instructionClass)}>
      {instructionMessage}
    </div>
  ));

  const linkTextAndLinkUrl = (
    <>
    <div className={cx(styles.ContainerCreationView, gClasses.CenterV, innerClassName)}>
      <Input
      className={gClasses.Flex1}
        inputContainerClasses={cx(
          styles.LinkInputCreationView,
          gClasses.PL10,
          styles.LinkInputRightBorderCreationView,
        )}
        id={FIELD_CONFIG(t).BASIC_CONFIG.LINK_TEXT.ID}
        readOnly={readOnly}
        hideLabel
        hideMessage
        disabled={disabled}
        placeholder={LINK_FIELD_STRINGS.LINK_TEXT_PLACEHOLDER}
        referenceName={referenceName}
      />
      <Input
        className={gClasses.Flex1}
        hideLabel
        hideMessage
        readOnly={readOnly}
        id={FIELD_CONFIG(t).BASIC_CONFIG.LINK_URL.ID}
        disabled={disabled}
        inputContainerClasses={cx(styles.LinkInputCreationView)}
        placeholder={LINK_FIELD_STRINGS.LINK_URL_PLACEHOLDER}
        value=""
        referenceName={referenceName}
      />
    </div>
    {instructionComponent}
    </>
  );

  const getLinkUrlContent = (index, value, linkUrlErrorMessage, linkTextErrorMessage, errorMessage, id, enable) => {
    console.log('getUrlContent', enable);
    const link = (<a tabIndex={disabled || readOnly ? -1 : 0} href={value.link_url} target="_blank" className={cx(gClasses.FOne13, gClasses.PL10, gClasses.Ellipsis)} rel="noreferrer" title={value.link_text}>{value.link_url}</a>);
    if (disabled) {
      return (
        link
        // <Input
        // className={cx(styles.LinkInput, gClasses.PL10, gClasses.DisabledField)}
        // inputContainerClasses={cx(styles.LinkInputContainer)}
        // innerClass={BS.PADDING_0}
        //   hideLabel
        //   hideMessage
        //   value={value.link_url}
        //   onChangeHandler={(event) => onInputChangeHandler(event.target.value, FIELD_CONFIG(t).BASIC_CONFIG.LINK_URL.ID, index)}
        //   placeholder="Link URL"
        // referenceName={referenceName}
        // >
        // </Input>
);
    }
    if (!enable) {
      let updatedLink = value.link_url;
      if ((!(updatedLink.includes('http'))) && (!(updatedLink.includes('https'))) && (!(updatedLink.includes('://'))) && (!(updatedLink.includes(':/')))) {
        updatedLink = `http://${updatedLink}`;
      }
      const link = (<a href={updatedLink} target="_blank" className={cx(gClasses.FTwo13, gClasses.PL10, gClasses.Ellipsis, styles.link, gClasses.FontWeight500)} rel="noreferrer" title={value.link_text}>{updatedLink}</a>);
      return link;
    }
      let errorIdKeys = Object.keys(id)[0];
      let errorId = EMPTY_STRING;
      if (errorIdKeys) {
        errorIdKeys = errorIdKeys.split(',');
        [errorId] = errorIdKeys;
      }
      const inputAriaLabelledBy = (isEmpty(linkTextErrorMessage) && !isEmpty(linkUrlErrorMessage)) && errorId;
    // if (true) {
      return (
        <Input
        className={cx(styles.LinkInput, gClasses.PL10, gClasses.FTwo11BlueV21)}
        inputContainerClasses={cx(styles.LinkInputContainer)}
        onBlurHandler={() => onLinkTextURLHandeler(value)}
        inputTextClasses={gClasses.FTwo13BlueV39}
          hideLabel
          hideMessage
          value={value.link_url}
          onChangeHandler={(event) => onInputChangeHandler(event.target.value, FIELD_CONFIG(t).BASIC_CONFIG.LINK_URL.ID, index)}
          placeholder={translate('form_field_strings.field_config.link_url.placeholder')}
          inputAriaLabelledBy={inputAriaLabelledBy}
        referenceName={referenceName}
        innerClass={BS.PADDING_0}
        />
);
    // }
    // return link;
  };

  const getLinkTextContent = (index, value, linkTextErrorMessage, error, id, enable) => {
    console.log('disable check');
    const linkText = <div className={cx(gClasses.FOne13GrayV3, gClasses.PR10, gClasses.Ellipsis, gClasses.DisabledField)} title={value.link_text}>{value.link_text}</div>;
    const ariaLabelledBy = `${(linkTextErrorMessage || get(errorMessage, [id])) ? (id + SPACE) : EMPTY_STRING}${isTable ? `${id}_label` : `${id}_linkfield_label`}`;
    if (disabled) return linkText;
    // if (true) {
      return (
        <Input
        className={cx(styles.LinkInput, gClasses.PR10, !enable ? gClasses.DisabledField : null)}
        inputContainerClasses={cx(styles.LinkInputContainer)}
        onBlurHandler={() => onLinkTextURLHandeler(value)}
        innerClass={BS.PADDING_0}
        id={`${id}_linkfield`}
          hideLabel
          hideMessage
          readOnly={readOnly}
          disabled={readOnly ? 'disabled' : null}
          value={value.link_text}
          placeholder={translate('form_field_strings.field_config.link_text.label')}
          inputAriaLabelledBy={ariaLabelledBy}
          onChangeHandler={(event) => onInputChangeHandler(event.target.value, FIELD_CONFIG(t).BASIC_CONFIG.LINK_TEXT.ID, index)}
        referenceName={referenceName}
        />
      );
    // }
    // return linkText;
  };

  const elementNameWithHyperlink = (objLink) => {
    const { link_url = EMPTY_STRING, link_text = EMPTY_STRING } = objLink;
    let updatedLink = link_url;
    if ((!(updatedLink.includes('http'))) && (!(updatedLink.includes('https')))) {
      updatedLink = `http://${updatedLink}`;
    }
    return (<div className={BS.D_FLEX}><a onKeyDown={(e) => e.stopPropagation()} href={updatedLink} target="_blank" className={cx(gClasses.FTwo13, gClasses.Ellipsis, styles.link, gClasses.FontWeight500)} title={link_text} rel="noreferrer">{link_text}</a></div>);
  };

  const readOnlyLinks = () => {
    let newLink = [];
    console.log('readonlylinkscheck', disabled, readOnly, label, isImported);
    if (isEmpty(stateLink)) {
      newLink = [{ link_text: '', link_url: '' }];
    } else newLink = stateLink;
    if (fieldVisibility === false && currentEditIndex !== null) {
      setCurrentEditIndex(null);
    }
    console.log('fdasdsaf', creationView, newLink, 'fieldVisibility', fieldVisibility, stateLink);
    console.log('errorMessage in link', errorMessage);
    return (
    !creationView && newLink && newLink.map((value, index) => {
      // Only Name with hyperlink
      if (isNameWithHyperlink) {
        return elementNameWithHyperlink(value);
      }
      const linkUrlErrorMessage = errorMessage && get(errorMessage, [`${id},${index},${FIELD_CONFIG(t).BASIC_CONFIG.LINK_URL.ID}`]);
      const linkTextErrorMessage = get(errorMessage, [`${id},${index},${FIELD_CONFIG(t).BASIC_CONFIG.LINK_TEXT.ID}`]);
      return (
        <div>
          <div
            className={cx(
              styles.Container,
              bgClassName,
              gClasses.CenterV,
              currentEditIndex === index ? styles.ContainerBorderEditableView : cx(styles.ContainerBorderReadonlyView),
              (!isEmpty(errorMessage)) && gClasses.ErrorInputBorderImp,
            )}
          >
            <div className={cx(BS.W100, BS.MARGIN_0, BS.D_FLEX, BS.FLEX_WRAP_NO_WRAP)}>
             <div className={cx(gClasses.CenterV, BS.PADDING_0, styles.ContainerRightBorderEditableView, styles.W40)}>
              {getLinkTextContent(index, value, linkTextErrorMessage, errorMessage, id, currentEditIndex === index)}
             </div>
             <div className={cx(gClasses.CenterV, BS.JC_BETWEEN, BS.PADDING_0, styles.W60)}>
             {getLinkUrlContent(index, value, linkUrlErrorMessage, linkTextErrorMessage, errorMessage, id, currentEditIndex === index) || EMPTY_STRING}
             <div className={cx(gClasses.CenterV, gClasses.PL5)}>
                  { !disabled && !readOnly && currentEditIndex !== index && (
                    <div
                    role="button"
                    onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onEditHandler(index)}
                    tabIndex={disabled || readOnly ? -1 : 0}
                    onClick={() => onEditHandler(index)}
                    aria-label={translate('form_field_strings.form_field_constants.edit_link')}
                    className={styles.editContainer}
                    >
                      <EditIconV2 isButtonColor className={cx(styles.EditIcon, gClasses.CursorPointer)} />
                    </div>
                  )}
                  {!disabled && !readOnly && (
                    <div
                    role="button"
                    onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onDeleteHandler(index)}
                    tabIndex={disabled || readOnly ? -1 : 0}
                    className={cx(gClasses.ML6, styles.DeleteContainer)}
                    onClick={() => onDeleteHandler(index)}
                    aria-label={translate('form_field_strings.form_field_constants.delete_link')}
                    >
                      <DeleteIconV2 role={ARIA_ROLES.IMG} title={LINK_FIELD_STRINGS.DELETE_LINK_TITLE} className={cx(styles.DeleteIcon, gClasses.CursorPointer)} />
                    </div>
                  )}
             </div>
            {/* {currentEditIndex === index && (
              <div className={cx(gClasses.CenterV)}>
                <div
                  role="presentation"
                  style={{ color: buttonColor }}
                  className={cx(gClasses.FOne13, gClasses.CursorPointer, gClasses.PL5)}
                  onClick={() => onEditHandler(index)}
                >
                  Set
                </div>
              </div>
            )} */}
             </div>
            </div>
          </div>
          <div className={cx(BS.D_FLEX)}>
            {!isEmpty(linkTextErrorMessage) && (
              <HelperMessage
                message={linkTextErrorMessage}
                type={HELPER_MESSAGE_TYPE.ERROR}
                id={id}
                className={cx(gClasses.ErrorMarginV2)}
              />
              )}
              {isEmpty(linkTextErrorMessage) && !isEmpty(linkUrlErrorMessage) && (
                <HelperMessage
                  message={!isEmpty(linkUrlErrorMessage) && linkUrlErrorMessage.replace('uri', 'url')}
                  type={HELPER_MESSAGE_TYPE.ERROR}
                  id={id}
                  className={cx(gClasses.ErrorMarginV2)}
                />
            )}
          </div>
        </div>
        );
      })
    );
  };
  console.log('!creationViewcreationView', !creationView, disabled === false, readOnly, readOnly === false);
  return (
    <div className={cx(isMultiple ? gClasses.PB15 : !isCreationField && gClasses.PB5, className)}>
      {!hideLabel && (
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
          <Label
            content={label}
            id={`${id}_linkfield_label`}
            labelFor={`${id}_linkfield`}
            isRequired={isRequired}
            isDataLoading={isDataLoading}
            message={helperTooltipMessage}
            toolTipId={helperToolTipId}
            labelFontClass={labelClass}
            formFieldBottomMargin
            hideLabelClass
          />
          {(fieldTypeInstruction || editIcon || deleteIcon) ? (
         <div className={cx(gClasses.CenterV, gClasses.Height24)}>
            {fieldTypeInstruction}
         </div>
       ) : null}
        </div>
      )}
    <SkeletonWrapper isLoading={isDataLoading} height={38}>
      {readOnlyLinks()}
      {creationView && linkTextAndLinkUrl}
      {!creationView && disabled === false && readOnly === false && (
        <>
        {
          isMultiple && (
            <div
            className={cx(gClasses.FTwo13, gClasses.WidthFitContent, gClasses.FontWeight500, BS.D_FLEX, BS.JC_START, innerClassName)}
            id={ADD_NEW_LINK.ID}
            role="button"
            style={{ color: buttonColor }}
            onClick={onAddNewClickHandler}
            tabIndex={0}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onAddNewClickHandler()}
            >
              <span className={cx(gClasses.CursorPointer, gClasses.MT5)}>{ADD_NEW_LINK.LABEL}</span>
            </div>
          )
        }
        {instructionComponent}
          {get(errorMessage, [id]) && (
            <HelperMessage
              message={errorMessage[id]}
              type={HELPER_MESSAGE_TYPE.ERROR}
              id={id}
              className={cx(gClasses.ErrorMarginV2)}
            />
          )}
        </>
      )}
    </SkeletonWrapper>
    </div>
  );
}

export default LinkField;

LinkField.defaultProps = {
  className: EMPTY_STRING,
  onClick: null,
  editIcon: null,
  deleteIcon: null,
  labelClass: null,
  disabled: false,
  isImported: false,
};

LinkField.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  editIcon: PropTypes.element,
  deleteIcon: PropTypes.element,
  labelClass: PropTypes.element,
  disabled: PropTypes.bool,
  isImported: PropTypes.bool,
};
