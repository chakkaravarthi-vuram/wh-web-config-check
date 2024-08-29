import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { v4 as uuidv4 } from 'uuid';
import { ROW_COUNT_DROPDOWN } from 'containers/admin_settings/user_management/UserManagement.strings';
import WarningTriangleIcon from 'assets/icons/WarningTriangle';
import { COMMA, DOT } from 'utils/strings/CommonStrings';
import HELPER_MESSAGE_TYPE from 'components/form_components/helper_message/HelperMessage.strings';
import HelperMessage from 'components/form_components/helper_message/HelperMessage';
import { ROWS_PER_PAGE } from 'components/form_components/pagination/Pagination.strings';
import { BorderRadiusVariant, ButtonContentVaraint, PaginationButtonPlacement } from '@workhall-pvt-lmt/wh-ui-library';
import ThemeContext from '../../../../../hoc/ThemeContext';
import styles from './PreviewUpload.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { PREVIEW_UPLOAD, BULK_UPLOAD_SUPPROTED_FIELDS, OVERWRITE_PREVIEW_UPLOAD } from './PreviewUpload.strings';
import { BS } from '../../../../../utils/UIConstants';
import Pagination from '../../../../../components/form_components/pagination/Pagination';
import Dropdown from '../../../../../components/form_components/dropdown/Dropdown';
import jsUtils from '../../../../../utils/jsUtility';
import { getBulkUploadData, getBulkUploadValidationMessage, isUploading } from '../../../../../redux/reducer';
import { bulkDataListEntryChangeAction, bulkDataListEntryValidationChangeAction, bulkDataListEntryDeleteRowAction } from '../../../../../redux/actions/BulkUpload.action';
import { FIELD_LIST_TYPE } from '../../../../../utils/constants/form.constant';
import Table from '../../../../../components/form_components/table/Table';
import { FORM_TYPE } from '../../../../form/Form.string';
import { getModifiedFieldData } from '../../../../form/form_builder/form_body/FormBody.utils';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';
import { formatData } from '../../../../form/editable_form/EditableForm.utils';

const getSlice = (data = [], page = 1, pageSize = 5) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return data.slice(startIndex, endIndex);
};

function PreviewBulkUpload(props) {
  const {
    formMetadata,
    bulkDataListEntries = [],
    validationMessage = [],
    isLoading,
  } = props;

  const { buttonColor } = useContext(ThemeContext);
  const [duplicateFields, setDuplicateFields] = useState([]);
  const [showDuplicateMessage, setShowDuplicateMessage] = useState(false);
  const [headers] = useState([]);
  const [totalRowData, setTotalRowData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [fieldDetails] = useState(new Map());
  const [fieldData, setFieldData] = useState({ columns: [], validations: {} });
  const onChangeCell = (field, value, action, options = {}) => {
    const { updatedValue } = formatData(field, value, action, bulkDataListEntries[options?.rowIndex], options);
    let formatedValue = updatedValue;
    const { bulkDataListEntryChange } = props;
    if (fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === 'number') {
      formatedValue = Number(value) || value;
    }
    bulkDataListEntryChange(options?.rowIndex, formatedValue, field?.[RESPONSE_FIELD_KEYS.FIELD_UUID]);
  };

  const constructTableRow = (selectedPageNumber = page, size = pageSize) => {
    // let deleteEnabled = true;
    // if (bulkDataListEntries.length === 1) deleteEnabled = false;
    const data = getSlice(bulkDataListEntries, selectedPageNumber, size);
    console.log('getSliced entries', totalRowData, bulkDataListEntries, data, selectedPageNumber, size);
    if (!jsUtils.isEmpty(bulkDataListEntries)) {
      setTotalRowData([...data]);
    }
  };

  const onPageChange = (selectedPageNumber) => {
    if (selectedPageNumber !== page) {
      constructTableRow(selectedPageNumber, pageSize);
      setPage(selectedPageNumber);
    }
  };
  const onRowChange = (selectedRow) => {
    if (selectedRow !== pageSize) {
      constructTableRow(1, selectedRow);
      setPageSize(selectedRow);
      setPage(1);
    }
  };

  useEffect(() => {
    if (jsUtils.isEmpty(headers)) {
      // const fieldMap = new Map();
      // const tempHeader = [];
      // const headerReference = [];
      const errorList = {};
      const tableUuid = uuidv4();
      const fieldDataValues = [];
      const supportedFields = BULK_UPLOAD_SUPPROTED_FIELDS;
      const tableData = {
        columns: [],
        validations: {
        allowModifyExisting: true,
        allowDeleteExisting: true,
        addNewRow: false,
      },
        _id: tableUuid,
        // validationMessage: { [tableUuid]: validationMessage },
        [RESPONSE_FIELD_KEYS.FIELD_UUID]: tableUuid,
      };
      Object.keys(validationMessage)?.forEach((key) => {
        Object.keys(validationMessage?.[key])?.forEach((fieldKey) => {
          if (validationMessage?.[key]?.[fieldKey]) errorList[`${tableUuid},${key},${fieldKey}`] = validationMessage?.[key]?.[fieldKey];
        });
      });
      formMetadata && formMetadata.sections.forEach((section) => {
        if (section) {
          section?.field_metadata.forEach((eachField) => {
            if (eachField.field_list_type !== FIELD_LIST_TYPE.TABLE) {
                fieldDataValues.push(eachField.field_name);
                if (section?.contents?.find((eachContent) => eachContent?.field_uuid === eachField.field_uuid)) {
                  if (supportedFields.includes(eachField.field_type)) {
                    tableData.columns.push(getModifiedFieldData(eachField, null, EMPTY_STRING));
                  }
                }
              // });
            }
          });
          console.log('check fields tableData', tableData);
        }
      });
      tableData.errorList = errorList;
      setFieldData(tableData);
      if (!jsUtils.isEmpty(fieldDataValues)) {
        const repeatedFields = fieldDataValues.filter((item, index, array) => array.indexOf(item) !== index);
        setDuplicateFields(repeatedFields);
        if (repeatedFields && repeatedFields.length) setShowDuplicateMessage(true);
        }
      // if (!jsUtils.isEmpty(tempHeader)) {
      //   tempHeader.push('');
      //   headerReference.push('');
      //   setHeader([...tempHeader]);
      //   setHeaderReference([...headerReference]);
        constructTableRow(page, pageSize);
      //   setFieldDetails(fieldMap);
      //   setTotalCount(bulkDataListEntries.length);
      // }
    } else {
      setTotalCount(bulkDataListEntries.length);
      if (bulkDataListEntries.length <= (page - 1) * pageSize) {
        return onPageChange(Math.ceil((bulkDataListEntries.length - 1) / pageSize));
      }
      constructTableRow(page, pageSize);
    }
    return () => {
    };
  }, [formMetadata, headers, validationMessage]);

  let invalidValues = '';
  if (!jsUtils.isEmpty(validationMessage)) {
    const errorPages = new Set();
    Object.keys(validationMessage).forEach((key) => {
      const currentPage = Math.floor(Number(key) / pageSize) + 1;
      if (!errorPages.has(currentPage)) errorPages.add(currentPage);
    });
    invalidValues = 'invalid values found in pages:';
    [...errorPages].forEach((errorPage, index) => {
      if (index === 0) invalidValues = `${invalidValues} ${errorPage}`;
      else invalidValues = `${invalidValues}, ${errorPage}`;
    });
  }

  return (
    <>
      <div className={cx(gClasses.MT20, BS.TEXT_CENTER, gClasses.FOne13GrayV6, gClasses.Italics)}>
        {PREVIEW_UPLOAD.CONTENT}
      </div>
      <div
        className={cx(gClasses.MT10, gClasses.FTwo12GrayV9, gClasses.FontWeight500, gClasses.MB10, BS.D_FLEX, BS.JC_BETWEEN)}
        style={{ color: buttonColor }}
      >
        {PREVIEW_UPLOAD.PREVIEW}
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
          <span className={cx(styles.RowsPerPage)}>{ROWS_PER_PAGE.ROW_LABEL}</span>
          <Dropdown
            hideLabel
            optionList={ROW_COUNT_DROPDOWN}
            selectedValue={pageSize}
            onChange={(event) => { onRowChange(event.target.value); }}
          />
        </div>
      </div>
      <Table
        fieldData={fieldData}
        fieldValue={[...getSlice(bulkDataListEntries, page, pageSize)]}
        documentDetails={[]}
        onChangeHandler={onChangeCell}
        formType={FORM_TYPE.EDITABLE_FORM}
        metaData={{}}
        validationMessage={fieldData?.errorList || {}}
        isLoading={isLoading}
        formData={bulkDataListEntries}
        visibility={formMetadata?.fields?.form_visibility || {}}
        isPaginated
        minimumLimit={1}
        paginationData={{
          totalItemsCount: bulkDataListEntries?.length,
          activePage: page,
          itemsCountPerPage: pageSize,
          constructItemsCountMessage: (itemStart, itemEnd, totalCount) =>
            `Showing ${itemStart} - ${itemEnd} of ${totalCount}`,
          prevAndNextButtonContentVariant: ButtonContentVaraint.icon,
          prevAndNextButtonPlacement: PaginationButtonPlacement.connected,
          shape: BorderRadiusVariant.square,
          onChange: (_event, page) => onPageChange(page),
        }}
      />
      {invalidValues && (
        <HelperMessage
          message={invalidValues}
          type={HELPER_MESSAGE_TYPE.ERROR}
          className={cx(gClasses.FOne12RedV5, gClasses.Italics)}
          noMarginBottom
          ariaHidden={!invalidValues}
        />
      )}
      <Pagination
        className={cx(gClasses.MT5, gClasses.MB5)}
        itemsCountPerPage={pageSize}
        activePage={page}
        totalItemsCount={totalCount}
        flowDashboardView
        isDataLoading={isLoading}
        responseTableView
        tblIsDashboard
        onChange={onPageChange}
      />
      {showDuplicateMessage && (
      <div className={cx(styles.ValidationContainer, BS.D_FLEX, gClasses.CenterV)}>
        <WarningTriangleIcon className={cx(styles.WarningTrailIcon, gClasses.MR10)} />
        <p className={cx(gClasses.FTwo12)}>
          {OVERWRITE_PREVIEW_UPLOAD}
          {duplicateFields && duplicateFields.map((field, index) => (<span>{` ${field}${duplicateFields.length === index + 1 ? DOT : COMMA}`}</span>))}
        </p>
      </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    bulkDataListEntries: getBulkUploadData(state),
    isLoading: isUploading(state),
    validationMessage: getBulkUploadValidationMessage(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    bulkDataListEntryChange: (index, value, fieldUuid) => dispatch(bulkDataListEntryChangeAction(index, value, fieldUuid)),
    bulkDataListEntryDeleteRow: (index) => dispatch(bulkDataListEntryDeleteRowAction(index)),
    bulkDataListEntyValidationChange: bulkDataListEntryValidationChangeAction,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreviewBulkUpload);
