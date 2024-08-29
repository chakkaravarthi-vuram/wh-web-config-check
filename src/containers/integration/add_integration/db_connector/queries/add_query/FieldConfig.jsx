import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Label,
  TextInput,
  SingleDropdown,
  Button,
  EButtonType,
} from '@workhall-pvt-lmt/wh-ui-library';
import { Col, Row } from 'reactstrap';
import gClasses from 'scss/Typography.module.scss';
import ThemeContext from 'hoc/ThemeContext';
import { validate } from 'utils/UtilityFunctions';
import { isEmpty, cloneDeep, find, set } from 'utils/jsUtility';
import styles from './AddQuery.module.scss';
import FieldToFetch from './field_to_fetch/FieldToFetch';
import FilterDataBy from './filter_data_by/FilterDataBy';
import { DB_CONNECTION_QUERIES_STRINGS } from '../../DBConnector.strings';
import {
  generateDropDownOptions,
  generateSaveQueryData,
  generateSortDataByList,
} from '../../DBConnector.utils';
import {
  constructSelectedFieldsSchema,
  constructSelectedFiltersSchema,
  dbConnectorQueryConfigSchema,
} from '../../DBConnector.validation.schema';

function FieldConfig(props) {
  const {
    query,
    query: { selected_fields, selected_filters, sort_fields },
    dbOptions,
    tableInfo,
    onInputChangeHandler,
    dbConnectorDataChange,
    errorList,
    fieldErrorList,
    filterErrorList,
    connector_id,
    connector_uuid,
    fetchDBDataApi,
    isEditView,
  } = props;

  const { t } = useTranslation();
  const { colorSchemeDefault } = useContext(ThemeContext);
  const {
    QUERY_CONFIG: { SORT_PARAMETERS, BUTTON, VALUES },
  } = DB_CONNECTION_QUERIES_STRINGS(t);

  const onChangesQuery = (queryData, errorList = {}) => {
    const updateData = {
      query: {
        ...query,
        ...queryData,
      },
      ...errorList,
    };
    dbConnectorDataChange(updateData);
  };

  const onSortDataByChanges = (value, id) => {
    const cloneSortFields = cloneDeep(sort_fields) || {};
    const cloneErrorList = cloneDeep(errorList);
    switch (id) {
      case SORT_PARAMETERS.SORT_DATA_BY.ID:
        set(cloneSortFields, 'field_name', value);
        const selectedDisplayName = find(query.selected_fields, {
          field_name: value,
        })?.display_name;
        set(cloneSortFields, 'display_name', selectedDisplayName);
        delete cloneErrorList['sort_fields,field_name'];
        break;
      case SORT_PARAMETERS.SORT_TYPE.ID:
        set(cloneSortFields, 'order_type', value);
        delete cloneErrorList[`sort_fields,${id}`];
        break;
      default:
        break;
    }
    onChangesQuery(
      { sort_fields: cloneSortFields },
      { error_list: cloneErrorList },
    );
  };

  const getClearSortDataBy = (changeValue, display_name = null) => {
    const cloneSortFields = cloneDeep(sort_fields);
    if (changeValue === sort_fields.field_name) {
      if (isEmpty(display_name)) {
        delete cloneSortFields.field_name;
        delete cloneSortFields.display_name;
      } else {
        cloneSortFields.display_name = display_name;
      }
    }
    return cloneSortFields;
  };

  const onTestQuery = () => {
    dbConnectorDataChange({
      query_data: [],
      query_details: [],
    });
    onChangesQuery({ isTestSuccess: false });
    const cloneQuery = cloneDeep(query);
    if (isEmpty(cloneQuery?.selected_fields)) {
      set(cloneQuery, 'selected_fields', []);
    }
    if (isEmpty(cloneQuery?.selected_filters)) {
      set(cloneQuery, 'selected_filters', []);
    }
    if (isEmpty(cloneQuery?.sort_fields)) {
      set(cloneQuery, 'sort_fields', {});
    }
    const currentErrorList = validate(
      cloneQuery,
      dbConnectorQueryConfigSchema(t),
    );
    const currentFieldErrorList = validate(
      cloneQuery.selected_fields,
      constructSelectedFieldsSchema(t),
    );
    const currentFilterErrorList = validate(
      cloneQuery.selected_filters,
      constructSelectedFiltersSchema(t),
    );
    if (currentFilterErrorList?.['0']?.includes(VALUES.LABEL)) {
      currentFilterErrorList[`0,${VALUES.ID},0`] = currentFilterErrorList['0'];
      delete currentFilterErrorList['0'];
    }
    if (
      isEmpty(currentErrorList) &&
      isEmpty(currentFieldErrorList) &&
      isEmpty(currentFilterErrorList)
    ) {
      const queryData = generateSaveQueryData(
        cloneQuery,
        connector_id,
        connector_uuid,
        false,
        true,
      );
      fetchDBDataApi(queryData).then((response) => {
        onChangesQuery(
          { isTestSuccess: response.is_connection_established && response?.query_data?.status !== false },
          {
            error_list: {},
            field_error_list: {},
            filter_error_list: {},
          },
        );
      });
    } else {
      dbConnectorDataChange({
        error_list: currentErrorList,
        field_error_list: currentFieldErrorList,
        filter_error_list: currentFilterErrorList,
      });
    }
  };

  return (
    <>
      <FieldToFetch
        fieldToFetchData={selected_fields}
        onChangesQuery={onChangesQuery}
        errorList={fieldErrorList}
        tableInfo={tableInfo}
        readOnlyView={!isEditView}
        getClearSortDataBy={getClearSortDataBy}
      />
      <FilterDataBy
        filterDataByData={selected_filters}
        onChangesQuery={onChangesQuery}
        errorList={filterErrorList}
        tableInfo={tableInfo}
        readOnlyView={!isEditView}
      />
      <div>
        <Label
          labelName={SORT_PARAMETERS.TITLE}
          className={styles.SectionLabelClassName}
        />
        <Row className={gClasses.MB16}>
          <Col>
            <SingleDropdown
              id={SORT_PARAMETERS.SORT_DATA_BY.ID}
              dropdownViewProps={{
                labelName: SORT_PARAMETERS.SORT_DATA_BY.LABEL,
                labelClassName: styles.LabelClassName,
                isRequired: true,
                disabled: !isEditView,
              }}
              required
              optionList={generateSortDataByList(selected_fields)}
              selectedValue={sort_fields?.field_name}
              onClick={(value, _label, _list, id) =>
                onSortDataByChanges(value, id)
              }
              errorMessage={errorList['sort_fields,field_name']}
            />
          </Col>
          <Col>
            <SingleDropdown
              id={SORT_PARAMETERS.SORT_TYPE.ID}
              dropdownViewProps={{
                labelName: SORT_PARAMETERS.SORT_TYPE.LABEL,
                labelClassName: styles.LabelClassName,
                isRequired: true,
                disabled: !isEditView,
              }}
              required
              optionList={generateDropDownOptions(dbOptions?.sort_order)}
              selectedValue={sort_fields?.order_type}
              onClick={(value, _label, _list, id) =>
                onSortDataByChanges(value, id)
              }
              errorMessage={
                errorList[`sort_fields,${SORT_PARAMETERS.SORT_TYPE.ID}`]
              }
            />
          </Col>
        </Row>
        <Row className={gClasses.MB16}>
          <Col>
            <TextInput
              id={SORT_PARAMETERS.SKIP.ID}
              labelText={SORT_PARAMETERS.SKIP.LABEL}
              labelClassName={styles.LabelClassName}
              type="number"
              value={query.skip_data.toString()}
              onChange={(event) => {
                const { value, id } = event.target;
                onInputChangeHandler(value, id);
              }}
              inputInnerClassName={styles.NumberInput}
              errorMessage={errorList[SORT_PARAMETERS.SKIP.ID]}
              readOnly={!isEditView}
              required
            />
          </Col>
          <Col>
            <TextInput
              id={SORT_PARAMETERS.LIMIT.ID}
              labelText={SORT_PARAMETERS.LIMIT.LABEL}
              labelClassName={styles.LabelClassName}
              type="number"
              value={query.limit_data.toString()}
              onChange={(event) => {
                const { value, id } = event.target;
                onInputChangeHandler(value, id);
              }}
              inputInnerClassName={styles.NumberInput}
              errorMessage={errorList[SORT_PARAMETERS.LIMIT.ID]}
              readOnly={!isEditView}
              required
            />
          </Col>
        </Row>
      </div>
      {isEditView && (
        <Button
          buttonText={
            query.isTestSuccess
              ? BUTTON.TEST_QUERY.LABEL2
              : BUTTON.TEST_QUERY.LABEL
          }
          type={EButtonType.SECONDARY}
          className={gClasses.MB24}
          colorSchema={colorSchemeDefault}
          onClickHandler={onTestQuery}
        />
      )}
    </>
  );
}

export default FieldConfig;
