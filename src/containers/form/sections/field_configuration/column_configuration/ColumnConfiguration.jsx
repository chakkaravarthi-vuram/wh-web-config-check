import React from 'react';
import cx from 'classnames';
import { Button, Text, EButtonSizeType, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import styles from './ColumnConfiguration.module.scss';
import PlusIconBlueNew from '../../../../../assets/icons/PlusIconBlueNew';
import Edit from '../../../../../assets/icons/application/EditV2';
import { COMMA, EDITABLE, EMPTY_STRING, READ_ONLY } from '../../../../../utils/strings/CommonStrings';
import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';
import { FORM_ACTIONS, FORM_LAYOUT_TYPE } from '../../../Form.string';
import { constructSinglePath, getLayoutByPath, getTableColumnFromLayout } from '../../form_layout/FormLayout.utils';
import { cloneDeep, get } from '../../../../../utils/jsUtility';
import { MODULE_TYPES } from '../../../../../utils/Constants';
import { checkAllFieldsAreReadOnly } from '../validation_and_visibility_configuration/validation_configuration/ValidationConfiguration.utils';
import { TABLE_CONTROL_ACCESS } from '../validation_and_visibility_configuration/validation_configuration/ValidationConfiguration.strings';
import { BS } from '../../../../../utils/UIConstants';
import gClasses from '../../../../../scss/Typography.module.scss';
import { validate } from '../../../../../utils/UtilityFunctions';
import { fieldNameSchema } from '../basic_configuration/BasicConfiguration.validate.schema';
import { FIELD_LIST_OBJECT } from '../basic_configuration/BasicConfiguration.constants';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from '../basic_configuration/BasicConfiguration.strings';
import { getExternalSourceData } from './external_source_column_configuration/ExternalSourceColumnConfiguration.utils';
import { DEFAULT_VALUE_FIELD_CONFIG_STRINGS } from '../field_value_configuration/FieldValueConfiguration.strings';

function ColumnConfiguration(props) {
    const {
        moduleType = null,
        fieldData = {},
        overAllLayout = [],
        tablePath = EMPTY_STRING,
        fields = {},
        sectionUUID = null,
        dispatch,
    } = props;

    const { t } = useTranslation();

    const layout = getLayoutByPath(overAllLayout, fieldData?.path);
    const columns = getTableColumnFromLayout(cloneDeep(layout), fields, sectionUUID);
    const tableUUID = layout?.[REQUEST_FIELD_KEYS.FIELD_UUID];

    const isTableNameEmpty = () => {
        const value = { fieldName: fieldData[RESPONSE_FIELD_KEYS.FIELD_NAME] };
        const error = validate(value, fieldNameSchema(t));
        if (!isEmpty(error)) {
            dispatch(FORM_ACTIONS.ACTIVE_FIELD_ERROR_LIST, { error });
            return true;
        }
        return false;
    };

    const onAdd = () => {
        if (isTableNameEmpty()) return;

        const index = columns.length;
        const path = [tablePath, constructSinglePath(index, FORM_LAYOUT_TYPE.FIELD)].join(COMMA);
        const data = {
            path,
            dropType: FORM_LAYOUT_TYPE.FIELD,
            [RESPONSE_FIELD_KEYS.TABLE_UUID]: tableUUID,
        };
        dispatch?.(FORM_ACTIONS.ACTIVE_FIELD_COLUMN_DATA_CHANGE, { fieldData: data });
    };

    const onAddExternalSourceColumn = () => {
        if (isTableNameEmpty()) return;
        const data = {
            path: tablePath,
            dropType: (tableUUID) ? FORM_LAYOUT_TYPE.FIELD : fieldData?.dropType,
            [RESPONSE_FIELD_KEYS.TABLE_UUID]: tableUUID,
            ...getExternalSourceData(fieldData, columns),
        };
        console.log('check columns of field', data, columns, fieldData);
        dispatch?.(FORM_ACTIONS.ACTIVE_FIELD_EXTERNAL_SOURCE_DATA_CHANGE, { data: data });
    };

    const getActions = () => {
        const externalSource = (moduleType === MODULE_TYPES.TASK) ? null : (
            <button id="two" className={styles.Link} onClick={onAddExternalSourceColumn}>
                    <PlusIconBlueNew />
                    <span>Add Column from external source</span>
            </button>
        );
        return (
            <div className={styles.ActionContainer}>
                <button id="one" className={styles.Link} onClick={onAdd}>
                    <PlusIconBlueNew />
                    <span>Add Column</span>
                </button>
                {(moduleType === MODULE_TYPES.TASK) ? null : <Text className={cx(gClasses.FTwo13BlackV20)} content={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.OR} />}
                {externalSource}
            </div>
        );
    };

    // Edge case warning.
    const getWarning = () => {
        const isAllColumnReadOnly = checkAllFieldsAreReadOnly(columns);
        if (!isAllColumnReadOnly) return null;

        return (
            <div className={cx(BS.ALERT, BS.ALERT_WARNING, gClasses.FTwo11)}>
            {TABLE_CONTROL_ACCESS(t).REVOKE_ADD_AND_EDIT_VALIDATION_CONFIG}
            </div>
        );
    };

    const getEachColumn = (column) => {
       const onEdit = () => {
            const path = [tablePath, constructSinglePath(column?.index, FORM_LAYOUT_TYPE.FIELD)].join(COMMA);
            dispatch?.(FORM_ACTIONS.ACTIVE_FIELD_COLUMN_DATA_CHANGE, { fieldData: { ...column, path } });
       };

       return (
       <div className={styles.EachColumn}>
            <Text
               className={styles.EachValue}
               content={column?.[RESPONSE_FIELD_KEYS.FIELD_NAME]}
            />
            <Text
              className={styles.EachValue}
              content={FIELD_LIST_OBJECT(t)?.[column?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]]}
            />
            <Text
               className={styles.EachValue}
               content={column?.[RESPONSE_FIELD_KEYS.READ_ONLY] ? t(READ_ONLY) : t(EDITABLE)}
            />
            <div className={styles.ButtonContainer}>
                <Button
                    icon={<Edit className={styles.EditIcon} />}
                    onClickHandler={onEdit}
                    size={EButtonSizeType.SM}
                    iconOnly
                    type={EMPTY_STRING}
                    className={styles.Button}
                />
            </div>
       </div>
       );
    };

    const getColumnComponent = () => {
        if (isEmpty(columns)) return null;
        return (
            <div>
                <div className={styles.ColumnHeader}>
                    <Text
                    className={cx(styles.EachValue, gClasses.LabelStyle)}
                    content={BASIC_FORM_FIELD_CONFIG_STRINGS(t).COLUMN_CONFIG.COLUMN_NAME}
                    fontClass={gClasses.FontWeight500}
                    />
                    <Text
                    className={cx(styles.EachValue, gClasses.LabelStyle)}
                    content={BASIC_FORM_FIELD_CONFIG_STRINGS(t).COLUMN_CONFIG.COLUMN_TYPE}
                    fontClass={gClasses.FontWeight500}
                    />
                    <Text
                    className={cx(styles.EachValue, gClasses.LabelStyle)}
                    content={BASIC_FORM_FIELD_CONFIG_STRINGS(t).COLUMN_CONFIG.EDITABILITY}
                    fontClass={gClasses.FontWeight500}
                    />
                    <div className={styles.EmptyDiv} />
                </div>
                <div className={styles.AllColumn}>
                    {columns.map((column) => getEachColumn(column))}
                </div>
            </div>
        );
    };

    const getErrorMessage = () => {
        const columnsErrorMessage = get(fieldData, ['errorList', 'columns'], null);
        if (isEmpty(columnsErrorMessage) || columns.length > 0) return null;
        return (
            <Text
                content={columnsErrorMessage}
                size={ETextSize.XS}
                className={styles.ErrorMessage}
            />
        );
    };

    return (
        <div>
          {getWarning()}
          <div className={styles.ColumnConfig}>
            {/* All Link */}
            {getActions()}
            {getColumnComponent()}
            {getErrorMessage()}
          </div>
        </div>
    );
}

export default ColumnConfiguration;
