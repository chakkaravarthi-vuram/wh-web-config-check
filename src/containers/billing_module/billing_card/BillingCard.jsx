/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import Skeleton from 'react-loading-skeleton';
import Input from 'components/form_components/input/Input';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import Button from 'components/form_components/button/Button';
import TextArea from 'components/form_components/text_area/TextArea';
import { BUTTON_TYPE } from 'utils/Constants';
import jsUtils, { isEmpty } from 'utils/jsUtility';
import AddMembers from 'components/member_list/add_members/AddMembers';
import { setMemberTeamSearchValue, setSelectedUserData, setAddMemberData, setPaymentState } from 'redux/reducer/BillingModuleReducer';
import { editpaymentDataThunk } from 'redux/actions/BillingModule.Action';
import { getAddNewPaymentUser } from 'redux/selectors/BillingModule.selectors';
import { validate } from 'utils/UtilityFunctions';
import PreviewIcon from 'assets/icons/PreviewIcon';
import ViewPreviewIcon from 'assets/icons/ViewPreviewIcon';
import CardExpiry from 'components/card_expiry/CardExpiry';
import RadioGroup, { RADIO_GROUP_TYPE } from 'components/form_components/radio_group/RadioGroup';
import RefreshIcon from 'assets/icons/RefreshIcon';
import { getAddRowButton } from 'components/form_builder/section/create_table/CreateTable.utils';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import { useTranslation } from 'react-i18next';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { addPaymentUserValidationSchema } from '../BillingModule.validation.schema';
import { BS, INPUT_TYPES } from '../../../utils/UIConstants';
import styles from './BillingCard.module.scss';
import TablePagination from '../../../components/table_pagination/TablePagination';
import { BILLING_USER_TYPE_DROPDOWN, BILL_FORM_TYPE, INVOICE_HEADER, PAYMENT_HEADER, FORM_FIELD_DIMENSIONS, BILLING_EDITABLE_VIEW, BILLING_DROPDOWN_VALUE, PERIOD_LIST, PAY_METHOD, RESTRICTION_INFO_BILLING, BILLING_DEBIT_ENABLE_DISABLE, PAYMENT_DETAILS, BILLING_USER_TYPE_DROPDOWN_PRIMARY, USER_DET, BILLING_PLACEHOLDER, BILLING_CONSTANTS_VALUES, PAY_BUTTON_STRINGS, BILLING_ROLE } from '../BillingModule.string';
import DownloadIcon from '../../../assets/icons/DownloadIcon';
import {
  getTimeZoneLookUpDataThunk,
} from '../../../redux/actions/TimeZoneLookUp.Action';
import { getAddUserValidation, getFormattedBillingCurrencyDropDownList, getInvoiceFormattedData } from '../BillingModule.utils';
import { SETPAYMENT_METHOD_STRINGS, verificationInfoString } from '../payment_flow/set_payment_method/SetPaymentMethod.string';

function BillingCard(props) {
  const {
    details,
    isTableView,
    tableType,
    isDataLoading,
    editDataType,
    onEditActionClick,
    editTypeValue,
    onChangeHandlerforPaymentUser,
    onCancelClickHandler,
    onChangeHandler,
    onUpdateClick,
    state,
    setMemberSearchValue,
    setSelectedUserData,
    paymentAPIDetails,
    editpaymentDataThunk,
    errorList,
    onDeletClickHandler,
    setAddMemberData,
    addUserBillingError,
    setPaymentStateChange,
    invoiceCurrentPage,
    invoiceTotalCount,
    timezone_list,
    onPageChandler,
    currencyOptions,
    onDropDownSelect,
    periodicChangeHandler,
    activeCount,
    tableIssue,
    refreshPaymentData,
    methodCurrency,
    paymentCustomizedDetails,
    setPaymentCustomizedDetails,
  } = props;
  const { selectedUserData, addMemberData } = state;
  const { t } = useTranslation();
  const [invoiceExpand, setInvoiceExpand] = useState(false);
  const [isEnableAddUser, setEnableAddUser] = useState(false);
  const [periodValue, setPeriodValue] = useState('All Invoices');
  const [addError, setAddError] = useState(EMPTY_STRING);
  const [onEyeClick, setOnEyeClick] = useState(false);
  const [dummyRender, setDummyRender] = useState(1);
  const [searchText, setSeachText] = useState(EMPTY_STRING);

  let submitActionButtons = null;

  const tableHeaders =
    tableType === t(PAYMENT_DETAILS.INVOICES)
      ? INVOICE_HEADER.map((val) => t(val))
      : PAYMENT_HEADER.map((val) => t(val));

  const getBillingDropdownData = (DropdownType) => {
      switch (DropdownType) {
        case BILLING_DROPDOWN_VALUE.TIMEZONE:
          return timezone_list;
        case BILLING_DROPDOWN_VALUE.CURRENCY:
          return getFormattedBillingCurrencyDropDownList(currencyOptions);
        default:
          return BILLING_USER_TYPE_DROPDOWN(t);
      }
  };

  const previewIconButton = () => {
    setOnEyeClick(!onEyeClick);
  };

  const expiryChangeHandle = (expiryValue) => {
    const editedData = jsUtils.cloneDeep(paymentCustomizedDetails);
    editedData.paymentMethodDetails.DETAILS[2].VALUE = expiryValue;
    setPaymentCustomizedDetails(editedData);
  };

  const getBillFormElements = (value, index, type) => {
    const editedData = paymentCustomizedDetails && jsUtils.cloneDeep(paymentCustomizedDetails);
    switch (value.FORM_TYPE) {
      case BILL_FORM_TYPE.INPUT:
        value.FORM_ELEMENT = (
          <Input
            label={t(value.FORM_LABEL)}
            instructionMessage={t(value.INSTRUCTION)}
            className={
              value.FORM_FIELD_WIDTH === FORM_FIELD_DIMENSIONS.FULL_WIDTH
                ? styles.width100
                : value.FORM_FIELD_WIDTH === FORM_FIELD_DIMENSIONS.HALF_WIDTH
                ? styles.width50
                : value.FORM_FIELD_WIDTH === FORM_FIELD_DIMENSIONS.QUARTER_WIDTH
                ? styles.width25
                : null
            }
            value={value.VALUE}
            onChangeHandler={(e) => {
              onChangeHandler(type, e.target.value, index);
            }}
            errorMessage={errorList ? errorList[value.ID] : null}
            isRequired
          />
        );
        break;
      case BILL_FORM_TYPE.INPUT_NUMBER:
        value.FORM_ELEMENT = (
          <Input
            type="number"
            label={t(value.FORM_LABEL)}
            className={
              value.FORM_FIELD_WIDTH === FORM_FIELD_DIMENSIONS.FULL_WIDTH
                ? styles.width100
                : value.FORM_FIELD_WIDTH === FORM_FIELD_DIMENSIONS.HALF_WIDTH
                ? styles.width50
                : value.FORM_FIELD_WIDTH === FORM_FIELD_DIMENSIONS.QUARTER_WIDTH
                ? styles.width25
                : null
            }
            value={value.VALUE}
            onChangeHandler={(e) => {
              onChangeHandler(type, e.target.value, index);
            }}
            errorMessage={errorList ? errorList[value.ID] : null}
            isRequired
          />
        );
        break;
      case BILL_FORM_TYPE.DROPDOWN:
        value.FORM_ELEMENT = (
          <Dropdown
            id={t(value.FORM_LABEL)}
            selectedValue={value.VALUE}
            hideMessage
            optionList={getBillingDropdownData(value.FORM_DROPDOWN_TYPE)}
            label={t(value.FORM_LABEL)}
            className={
              value.FORM_FIELD_WIDTH === FORM_FIELD_DIMENSIONS.FULL_WIDTH
                ? styles.width100
                : value.FORM_FIELD_WIDTH === FORM_FIELD_DIMENSIONS.HALF_WIDTH
                ? styles.width50
                : value.FORM_FIELD_WIDTH === FORM_FIELD_DIMENSIONS.QUARTER_WIDTH
                ? styles.width25
                : null
            }
            innerClassName={styles.DropdownHeight}
            isRequired
            onChange={(e) => onDropDownSelect(value.FORM_DROPDOWN_TYPE, e.target.value, index)}
          />
        );
        break;
      case BILL_FORM_TYPE.TEXTAREA:
        value.FORM_ELEMENT = (
          <TextArea
            value={value.VALUE}
            label={t(value.FORM_LABEL)}
          />
        );
        break;
        case BILL_FORM_TYPE.EXPIRY_DATE:
          value.FORM_ELEMENT = (
          <div className={cx(styles.ExpiryContainer, BS.D_FLEX, BS.JC_BETWEEN)}>
            <div className={gClasses.MR10}>
              <CardExpiry
                id={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH_YEAR.ID}
                inputContainerClasses={cx(styles.ExpiryDropdown)}
                label={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH_YEAR.LABEL}
                placeholder={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH_YEAR.PLACEHOLDER}
                inputTextClasses={gClasses.FTwo12GrayV3}
                value={value.VALUE}
                onChangeHandler={expiryChangeHandle}
                errorMessage={errorList ? errorList[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH.ID] : null}
                isRequired
              />
            </div>
            <Input
              id={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CVC_NUMBER.ID}
              inputContainerClasses={cx(styles.ExpiryDropdown)}
              className={styles.ExpiryDropdown}
              innerClass={!onEyeClick ? styles.Password : null}
              placeholder={
                SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CVC_NUMBER.PLACEHOLDER
              }
              label={SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CVC_NUMBER.LABEL}
              onChangeHandler={(e) => onChangeHandler(type, e.target.value, 3)}
              value={editedData.paymentMethodDetails.DETAILS[3].VALUE}
              errorMessage={errorList ? errorList[PAY_METHOD.LABEL.BILLING_CVC_NUMBER] : null}
              icon={editedData.paymentMethodDetails.DETAILS[3].VALUE && <PreviewIcon onMouseDown={previewIconButton} onMouseUp={previewIconButton} className={gClasses.CursorPointer} />}
              type={INPUT_TYPES.TEXT}
              isRequired
            />
          </div>
          );
          break;
        case BILL_FORM_TYPE.CHECK_BOX:
          value.FORM_ELEMENT = (
            <RadioGroup
              label={BILLING_DEBIT_ENABLE_DISABLE.TITLE}
              optionList={BILLING_DEBIT_ENABLE_DISABLE.OPTION_LIST}
              onClick={(value) => onChangeHandler(type, value, index, true)}
              selectedValue={value.FORM_VALUE}
              type={RADIO_GROUP_TYPE.TYPE_1}
              innerClassName={BS.D_BLOCK}
            />
          );
          break;
      default:
        break;
    }
    return value.FORM_ELEMENT;
  };

  const getBillingCardDetails = (detailValue, index, type) => {
    const cardDetails = jsUtils.cloneDeep(detailValue);
    if (editDataType === editTypeValue && cardDetails.isEditable) {
      return (
        <div className={cx(styles.InfoContainer, gClasses.MT15)}>
          {getBillFormElements(cardDetails, index, type)}
        </div>
      );
    } else {
      if (editDataType === editTypeValue && (t(cardDetails.SUB_TITLE) === t(PAY_METHOD.DETAILS[0].SUB_TITLE) || t(cardDetails.SUB_TITLE) === t(PAY_METHOD.DETAILS[3].SUB_TITLE))) return null;
      else {
          if (cardDetails.DEPENDENT) {
            if (activeCount < cardDetails.VALUE) {
              return (
                  <div className={cx(styles.InfoContainer, gClasses.MT15)} key={index}>
                      <h5>{t(cardDetails.SUB_TITLE)}</h5>
                      <h6>{cardDetails.VALUE}</h6>
                  </div>
              );
            }
          } else {
            return (
                <div className={cx(styles.InfoContainer, gClasses.MT15)} key={index}>
                    <h5>{t(cardDetails.SUB_TITLE)}</h5>
                    {(t(cardDetails.SUB_TITLE) === t(USER_DET.DETAILS[0].SUB_TITLE)) ? <h6>{activeCount}</h6> : <h6>{cardDetails.VALUE}</h6>}
                </div>
            );
          }
      }
    }
    return null;
  };

  const addUserValid = (addMemberDataLocal) => {
    if (!jsUtils.isEmpty(addUserBillingError)) {
      const apiBillingOwnersData = jsUtils.cloneDeep(addMemberDataLocal);
      const error = validate(
      apiBillingOwnersData,
      addPaymentUserValidationSchema,
      );
      const multipleUserValid = getAddUserValidation(paymentAPIDetails.billing_owners, apiBillingOwnersData, t);
      setPaymentStateChange({ addUserBillingError: { ...error, ...multipleUserValid } });
    }
  };

  const tableRowDatas =
    details &&
    details.DETAILS &&
    details.DETAILS.map((value) => {
      if (tableType === t(PAYMENT_DETAILS.INVOICES)) {
        const incoiceId = (
          <div
            className={cx(
              BS.D_FLEX,
              gClasses.FlexDirectionColumn,
            )}
          >
            <div className={cx(gClasses.Ellipsis)}>{value.ID}</div>
          </div>
        );

        const invoiceDate = (
          <div
            className={cx(
              BS.D_FLEX,
              gClasses.FlexDirectionColumn,
            )}
          >
            <div className={cx(gClasses.Ellipsis)}>{value.DATE.replace(/-/g, ' - ')}</div>
          </div>
        );

        const invoiceAmount = (
          <div
            className={cx(
              BS.D_FLEX,
              gClasses.FlexDirectionColumn,
            )}
          >
            <div className={cx(gClasses.Ellipsis)}>{value.AMOUNT}</div>
          </div>
        );

        let statusValue;
        if (!value.IS_PAID) {
          statusValue = (
            <div className={cx(BS.D_FLEX, BS.JC_END, styles.InfoContainerExpiry)}>
              <div className={cx(gClasses.FTwo12RedV5, gClasses.MR20, BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}>{getInvoiceFormattedData(value.DUE_DATE, value.REMAINING_DAY, t)}</div>
                <a href={value.PAYMENT_URL} target="_blank" rel="noreferrer" className={gClasses.MR20}>
                  <Button
                    buttonType={BUTTON_TYPE.PRIMARY}
                    className={styles.MakePayment}
                  >
                    {t(PAY_BUTTON_STRINGS.PAY_NOW)}
                  </Button>
                </a>
            </div>
          );
        } else {
          statusValue = (
            <div className={cx(BS.D_FLEX, BS.JC_END)}>
              <Button
                buttonType={BUTTON_TYPE.SECONDARY}
                className={cx(gClasses.MR20, styles.PaidButton, gClasses.FTwo12Important, gClasses.FontWeight700Important)}
                disabled
              >
                {t(PAY_BUTTON_STRINGS.PAID)}
              </Button>
            </div>
          );
        }

        const icons = (
          <div
            className={cx(
              styles.IconContainer,
              gClasses.DisplayFlex,
            )}
          >
            {statusValue}
        {value.PREVIEW_PDF && (
          <a href={value.PREVIEW_PDF} target="_blank" download rel="noreferrer">
            <ViewPreviewIcon
              className={cx(
                gClasses.MR20,
                gClasses.MT2,
                gClasses.CursorPointer,
              )}
            />
          </a>
          )}
            <a href={value.DOWNLOAD_PDF} target="_self" download rel="noreferrer" className={!value.PREVIEW_PDF && styles.DownloadEmpty}><DownloadIcon className={gClasses.CursorPointer} /></a>
          </div>
        );
        return [incoiceId, invoiceDate, invoiceAmount, icons];
      } else {
        const name = (
          <div className={cx(BS.D_FLEX, gClasses.FlexDirectionColumn)}>
            {editDataType === editTypeValue && !isEnableAddUser ? (
              <Input
                hideLabel
                hideMessage
                value={`${value.first_name} ${value.last_name}`}
                className={styles.InputContainer}
                disabled
                onChangeHandler={(event) => {
                  onChangeHandlerforPaymentUser(
                    event.target.value,
                    value.roworder,
                    'NAME',
                  );
                }}
              />
            ) : (
              <div className={cx(gClasses.Ellipsis, gClasses.TextTransformCap, styles.AddMemberContainerWidth)}>
                {`${value.first_name} ${value.last_name}`}
              </div>
            )}
          </div>
        );

        const mail = (
          <div className={cx(BS.D_FLEX, gClasses.FlexDirectionColumn)}>
            {editDataType === editTypeValue && !isEnableAddUser ? (
              <Input
                hideLabel
                hideMessage
                value={value.EMAIL}
                disabled
                className={styles.InputContainer}
                onChangeHandler={(event) => {
                  onChangeHandlerforPaymentUser(
                    event.target.value,
                    value.roworder,
                    'EMAIL',
                  );
                }}
              />
            ) : (
              <div className={cx(gClasses.Ellipsis)}>
                {value.EMAIL}
              </div>
            )}
          </div>
        );

        const type = (
          <div className={cx(BS.D_FLEX, gClasses.FlexDirectionColumn)}>
            {console.log('value.TYPEvalue.TYPE', value.TYPE)}
            {editDataType === editTypeValue && !isEnableAddUser ? (
              <Dropdown
                selectedValue={value.TYPE}
                hideLabel
                hideMessage
                optionList={details?.DETAILS?.length === 1 ? BILLING_USER_TYPE_DROPDOWN_PRIMARY(t) : BILLING_USER_TYPE_DROPDOWN(t)}
                onChange={(event) => {
                  onChangeHandlerforPaymentUser(
                    event.target.value,
                    value.roworder,
                    'TYPE',
                  );
                }}
              />
            ) : (
              <div className={cx(gClasses.Ellipsis, styles.RoleValueWidth)}>
                {value.TYPE}
              </div>
            )}
          </div>
        );
        const icons =
          value.TYPE === t(BILLING_ROLE.SECONDARY) && editDataType !== editTypeValue ? (
            <div
              className={cx(
                styles.IconContainer,
                gClasses.CenterV,
                styles.IconContain,
              )}
            >
              <DeleteIconV2
                className={cx(gClasses.CursorPointer)}
                onClick={() => {
                  onDeletClickHandler(value.roworder);
                }}
              />
            </div>
          ) : null;
         return [type, name, mail, icons];
      }
    });

  const handleAddMemberChange = (event, index) => {
    const { value } = event.target;
    const tempData = jsUtils.cloneDeep(addMemberData);
    tempData[index].search_value = value;
    setSeachText(tempData);
  };

  const onCancelAddPaymentUser = () => {
    setEnableAddUser(false);
    setDummyRender(1);
    onEditActionClick('');
    setPaymentStateChange({ addUserBillingError: {}, addMemberData: [] });
  };

  const onTableAddRowClick = () => {
    const tempData = jsUtils.cloneDeep(addMemberData);
    setDummyRender(dummyRender + 1);
    tempData.push({ userRole: EMPTY_STRING });
    setAddMemberData(tempData);
  };

  const addRowButton = getAddRowButton(() => onTableAddRowClick(), { add_new_row: true }, true, false, false, false, t);

  const onAddPaymentUser = () => {
    const apiBillingOwnersData = jsUtils.cloneDeep(addMemberData);
    const error = validate(
      apiBillingOwnersData,
      addPaymentUserValidationSchema,
    );
    const multipleUserValid = getAddUserValidation(paymentAPIDetails.billing_owners, apiBillingOwnersData, t);
    setPaymentStateChange({ addUserBillingError: { ...error, ...multipleUserValid } });
    if (isEmpty({ ...error, ...multipleUserValid })) {
        editpaymentDataThunk(getAddNewPaymentUser(apiBillingOwnersData, paymentAPIDetails.billing_owners), 'Added', t);
        setPaymentStateChange({ addMemberData: [] });
        setEnableAddUser(false);
        setDummyRender(1);
        setMemberSearchValue(EMPTY_STRING);
        setSelectedUserData({});
        setMemberSearchValue('');
        onEditActionClick('');
        setAddError(EMPTY_STRING);
    }
  };

  if (
    isEnableAddUser &&
    editTypeValue === BILLING_EDITABLE_VIEW.PAYMENT_USERS
  ) {
    const newUserName = (index) =>
      (
        <AddMembers
          hideLabel
          id="billingOwners"
          onUserSelectHandler={(event) => {
            const { value } = event.target;
            const tempData = jsUtils.cloneDeep(addMemberData);
            tempData[index].email = value.email;
            tempData[index].user = value;
            setAddMemberData(tempData);
            setPaymentStateChange({ addUserBillingError: {} });
          }}
          selectedData={(addMemberData[index] && addMemberData[index].email) ? [addMemberData[index] && addMemberData[index].user] : null}
          removeSelectedUser={() => {
            const tempData = jsUtils.cloneDeep(addMemberData);
            tempData[index].email = EMPTY_STRING;
            delete tempData[index].user;
            setAddMemberData(tempData);
            setPaymentStateChange({ addUserBillingError: {} });
          }}
          errorText={addUserBillingError[`${index},user`]}
          selectedSuggestionData={[]}
          memberSearchValue={searchText[index] && searchText[index].search_value}
          setMemberSearchValue={(e) => handleAddMemberChange(e, index)}
          placeholder={
            jsUtils.isEmpty(selectedUserData.email) ? t(BILLING_PLACEHOLDER.SELECT_USER) : ''
          }
          lastSignin
          isActive
          className={styles.AddMember}
          popperFixedStrategy
          popperClassName={styles.AddMemberContainerWidth}
          customClass={styles.InputSelect}
          allowOnlySingleSelection
        />
      );
    const email = (index) => (
        <Input
          placeholder={t(BILLING_PLACEHOLDER.EMAIL)}
          hideLabel
          value={addMemberData[index] && addMemberData[index].email}
          innerClass={cx(gClasses.Ellipsis, styles.ElipImp)}
          disabled
          errorMessage={addUserBillingError[`${index},email`]}
        />
      );

    const deleteAddUser = (index) => (
        <div
          className={cx(
            styles.IconContainer,
            gClasses.CenterV,
            gClasses.MT6,
            styles.IconContain,
          )}
        >
          <DeleteIconV2
            className={cx(gClasses.CursorPointer)}
            onClick={() => {
              const tempData = jsUtils.cloneDeep(addMemberData);
              tempData.splice(index, 1);
              addUserValid(tempData);
              setAddMemberData(tempData);
              setDummyRender(dummyRender - 1);
            }}
          />
        </div>
      );
    if (dummyRender) {
      Array(dummyRender).fill(0).forEach((value, index) => {
        tableRowDatas.push([
          <Dropdown
            id="paymentUserRole"
            hideLabel
            placeholder={t(BILLING_PLACEHOLDER.USER_ROLE)}
            selectedValue={addMemberData[index] && addMemberData[index].userRole}
            onChange={(event) => {
              const tempData = jsUtils.cloneDeep(addMemberData);
              tempData[index].userRole = event.target.value;
              setAddMemberData(tempData);
              setPaymentStateChange({ addUserBillingError: {} });
            }}
            optionList={BILLING_USER_TYPE_DROPDOWN(t)}
            errorMessage={addUserBillingError[`${index},userRole`]}
          />,
          newUserName(index),
          email(index),
          dummyRender !== 1 && deleteAddUser(index),
        ]);
      });
    }
  }

  const actionButtonClick = (actionType) => {
    if (tableType === t(PAYMENT_DETAILS.PAYMENT_DETAILS) && actionType === 'primary') {
      setEnableAddUser(true);
      const tempData = jsUtils.cloneDeep(addMemberData);
      tempData.push({ userRole: EMPTY_STRING, email: EMPTY_STRING });
      setAddMemberData(tempData);
    } else {
      if (tableType !== t(PAYMENT_DETAILS.INVOICES)) {
        setPaymentStateChange({ addMemberData: [] });
        setEnableAddUser(false);
        setDummyRender(1);
      }
    }
    tableType !== t(PAYMENT_DETAILS.INVOICES) && onEditActionClick(editDataType);
    setInvoiceExpand(false);
    if (tableType === t(PAYMENT_DETAILS.INVOICES)) {
      setInvoiceExpand(true);
      onPageChandler(1);
    }
  };

  if (editDataType === editTypeValue) {
    if (isEnableAddUser) {
      submitActionButtons = (
        <div
          className={cx(
            BS.D_FLEX,
            BS.FLEX_ROW,
            styles.ButtonContainer,
            gClasses.MT15,
            tableType === t(PAYMENT_DETAILS.PAYMENT_DETAILS) && styles.ButtonContainerRight,
          )}
        >
          <Button
            className={cx(gClasses.MR15, styles.ButtonCancel)}
            buttonType={BUTTON_TYPE.SECONDARY}
            onClick={onCancelAddPaymentUser}
          >
            {t(BILLING_CONSTANTS_VALUES.CANCEL)}
          </Button>
          <Button buttonType={BUTTON_TYPE.OUTLINE_PRIMARY} onClick={onAddPaymentUser}>
            {t(BILLING_CONSTANTS_VALUES.ADD)}
          </Button>
        </div>
      );
    } else {
      submitActionButtons = (
        <div
          className={cx(
            BS.D_FLEX,
            BS.FLEX_ROW,
            styles.ButtonContainer,
            gClasses.MT15,
            tableType === t(PAYMENT_DETAILS.PAYMENT_DETAILS) && styles.ButtonContainerRight,
          )}
        >
          <Button
            className={cx(gClasses.MR15, styles.ButtonCancel)}
            buttonType={BUTTON_TYPE.SECONDARY}
            onClick={onCancelClickHandler}
            isDataLoading={isDataLoading}
          >
            {t(BILLING_CONSTANTS_VALUES.CANCEL)}
          </Button>
          <Button buttonType={BUTTON_TYPE.OUTLINE_PRIMARY} onClick={onUpdateClick} isDataLoading={isDataLoading}>
            {(editDataType === BILLING_EDITABLE_VIEW.PAYMENT_METHOD) ? t(BILLING_CONSTANTS_VALUES.VERIFY) : t(BILLING_CONSTANTS_VALUES.UPDATE) }
          </Button>
        </div>
      );
    }
  }

  return (
    <div className={cx(styles.Container, gClasses.PY30, gClasses.PX30)}>
      <div className={cx(gClasses.DisplayFlex)}>
        <h3 className={cx(gClasses.SectionSubTitle)}>
          {!isDataLoading ? ((editDataType === editTypeValue && invoiceExpand && !isDataLoading) ? t(BILLING_CONSTANTS_VALUES.ALL_INVOICE) : t(details && details.TITLE)) : <Skeleton width={FORM_FIELD_DIMENSIONS.SKELETON_60} />}
        </h3>
        <div className={cx(styles.ActionButton, gClasses.DisplayFlex, gClasses.CenterV)}>
          {tableType === t(PAYMENT_DETAILS.PAYMENT_DETAILS) && editDataType !== editTypeValue && (!isDataLoading ?
            (
              <div
                className={styles.individual}
                onClick={() => actionButtonClick('secondary')}
              >
                {t(PAYMENT_DETAILS.EDIT_USER)}
              </div>
            ) : <Skeleton width={FORM_FIELD_DIMENSIONS.SKELETON_60} className={gClasses.MR20} />
          )}
          {!isDataLoading ? (
            !invoiceExpand && !isEmpty(tableRowDatas) &&
            details && details.ACTION && editDataType !== editTypeValue && (
              <div
                className={cx(styles.individual)}
                onClick={() => actionButtonClick('primary')}
              >
                {t(details.ACTION)}
              </div>
            )
          ) : (
            <Skeleton width={FORM_FIELD_DIMENSIONS.SKELETON_40} />
          )}
          { invoiceExpand && !isDataLoading && (
            <Dropdown
              hideMessage
              hideLabel
              optionList={PERIOD_LIST}
              selectedValue={periodValue || null}
              onChange={(event) => {
                setPeriodValue(event.target.value);
                periodicChangeHandler(event.target.value);
              }}
              className={cx(styles.FilterDropdown, gClasses.MR15)}
            />
          )}
          {tableType === t(PAYMENT_DETAILS.INVOICES) && (!isDataLoading ?
            (
              <RefreshIcon onClick={() => { invoiceExpand ? periodicChangeHandler(periodValue) : refreshPaymentData(); }} className={cx(gClasses.CursorPointer)} />
            ) : <Skeleton width={FORM_FIELD_DIMENSIONS.SKELETON_40} className={gClasses.MR20} />
          )}
        </div>
      </div>
      {!isTableView ? (
          !isDataLoading ?
            details &&
            details.DETAILS &&
            details.DETAILS.map((info, index) => getBillingCardDetails(info, index, t(details.TITLE)))
          :
          (
              <div className={gClasses.MT20}>
                <Skeleton width={FORM_FIELD_DIMENSIONS.FULL_WIDTH} />
                <Skeleton width={FORM_FIELD_DIMENSIONS.HALF_WIDTH} />
                <Skeleton width={FORM_FIELD_DIMENSIONS.FULL_WIDTH} />
                <Skeleton width={FORM_FIELD_DIMENSIONS.HALF_WIDTH} />
              </div>
            )
      ) : (
        <div>

        {(!isDataLoading && tableType === t(PAYMENT_DETAILS.INVOICES) && isEmpty(tableRowDatas)) ? t(BILLING_CONSTANTS_VALUES.NO_INVOICE)
        : (
          <>
          <TablePagination
            tblClassName={cx(tableType === t(PAYMENT_DETAILS.INVOICES) ? styles.InvoiceTable : styles.Table)}
            tblRowClassName={styles.RowContainer}
            tblHeader={tableHeaders}
            tblData={tableRowDatas}
            paginationItemsCountPerPage={10}
            paginationTotalItemsCount={invoiceExpand && invoiceTotalCount}
            paginationClassName={gClasses.MT15}
            paginationItem=" "
            tblIsDataLoading={isDataLoading}
            paginationIsDataLoading={isDataLoading}
            tblLoaderRowCount={3}
            tblLoaderColCount={4}
            showItemDisplayInfoStrictly
            tblBilling
            paginationFlowDashboardView={invoiceExpand}
            paginationActivePage={invoiceExpand && invoiceCurrentPage}
            paginationOnChange={onPageChandler}
            tableErrorMessage={tableIssue || (isEnableAddUser && addError)}
          />
          {isEnableAddUser && tableType !== t(PAYMENT_DETAILS.INVOICES) && addRowButton}
          </>
        ) }
        </div>
      )}

      {!isDataLoading && editDataType === editTypeValue && editDataType === BILLING_EDITABLE_VIEW.PAYMENT_METHOD && (
        <div className={cx(styles.VerificationInfo)}>
          <p className={cx(BS.TEXT_CENTER, gClasses.FTwo12)}>{verificationInfoString(methodCurrency === 'INR')}</p>
        </div>
      )}

      {!isDataLoading && editDataType === editTypeValue && editDataType === BILLING_EDITABLE_VIEW.PAYMENT_PROFILE && (
        <div className={cx(styles.VerificationInfo)}>
          <p className={cx(BS.TEXT_CENTER, gClasses.FTwo12)}>{t(RESTRICTION_INFO_BILLING)}</p>
        </div>
      )}

      {(tableType !== t(PAYMENT_DETAILS.INVOICES)) && submitActionButtons}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    taskState: state.CreateTaskReducer,
    state: state.BillingModuleReducer,
    paymentAPIDetails: state.BillingModuleReducer.paymentAPIDetails,
    addUserBillingError: state.BillingModuleReducer.addUserBillingError,
    timezone_list: state.TimeZoneLookUpReducer.timezone_list,
    currencyOptions: state.BillingModuleReducer.paymentAPIDetails.allowed_currency_types,
    subscriptionData: state.BillingModuleReducer.subscriptionApiDetais,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMemberSearchValue: (searchValue) =>
      dispatch(setMemberTeamSearchValue(searchValue)),
    setSelectedUserData: (userData) => dispatch(setSelectedUserData(userData)),
    editpaymentDataThunk: (data, message, t) => dispatch(editpaymentDataThunk(data, message, t)),
    setAddMemberData: (userData) => dispatch(setAddMemberData(userData)),
    setPaymentStateChange: (data) => dispatch(setPaymentState(data)),
    getTimeZoneLookUpData: (params) => dispatch(getTimeZoneLookUpDataThunk(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BillingCard);
BillingCard.propTypes = {
  isTableView: PropTypes.bool,
};
BillingCard.defaultProps = {
  isTableView: false,
};
