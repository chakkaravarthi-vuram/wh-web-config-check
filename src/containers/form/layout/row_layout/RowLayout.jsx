import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ColumnLayout from '../column_layout/ColumnLayout';
import { FORM_ACTIONS, FORM_LAYOUT_STRINGS, FORM_LAYOUT_TYPE, FORM_TYPE } from '../../Form.string';
import { COMMA, EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { constructSinglePath } from '../../sections/form_layout/FormLayout.utils';
import { get, isEmpty } from '../../../../utils/jsUtility';
import styles from './RowLayout.module.scss';
import LayoutDropZone from '../layout_drop_zone/LayoutDropZone';
import { MODULE_TYPES } from '../../../../utils/Constants';
import { RESPONSE_FIELD_KEYS } from '../../../../utils/constants/form/form.constant';
import { FIELD_TYPE } from '../../../../utils/constants/form.constant';

const ACCEPT_LAYOUT_TYPES = [FORM_LAYOUT_TYPE.LAYOUT, FORM_LAYOUT_TYPE.BOX, FORM_LAYOUT_TYPE.EXISTING_TABLE];

function RowLayout(props) {
    const {
      path = EMPTY_STRING,
      sectionUUID,
      layout,
      metaData,
      moduleType,
      formType,
      dataListAuditfields,
      formData,
      informationFieldFormContent,
      documentDetails,
      column,
      fields,
      visibility,
      validationMessage,
      onFormDataChangeHandler,
      onDropHandler,
      dispatch,
      userProfileData,

      onImportFieldClick,
      onImportTypeChange,
      showAllFields,
      isAuditView = false,
      disableVisibilityForReadOnlyForm = false,
      onUpdateLayoutByResize = null,
      isRecursiveLayout = false,
    } = props;

    const { t } = useTranslation();

    const getColumnTemplateStyle = (isSingleColumnLayout = false, columnSize = []) => {
      console.log('dsbfaklsn;f', columnSize);
      if (isSingleColumnLayout) {
        return { gridTemplateColumns: 'calc(100% - 4px)' };
      }
      const colPercent = 100 / column;
      let size = '';
      columnSize.forEach((eachSize) => { size += `${eachSize}fr `; });
      if (formType === FORM_TYPE.EDITABLE_FORM) {
        return {
          gridTemplateColumns: `repeat(${column}, calc(${colPercent}% - ${24 / column}px)`,
        };
      }
      return {
        gridTemplateColumns: size,
      };
    };

    const getAddFieldPlaceholder = (currentPath) => {
      const onClick = () => {
        dispatch?.(FORM_ACTIONS.ACTIVE_FIELD_DATA_CHANGE, { fieldData: {
            dropType: FORM_LAYOUT_TYPE.FIELD,
            path: [currentPath, constructSinglePath(0, FORM_LAYOUT_TYPE.ADD_FIELD)].join(COMMA),
            sectionUUID,
        } });
      };

      return (
            <button
                key={path}
                className={styles.AddField}
                onClick={onClick}
            >
              {moduleType === MODULE_TYPES.TASK ? `+ ${FORM_LAYOUT_STRINGS(t).CLICK_ADD}` : `+ ${FORM_LAYOUT_STRINGS(t).CLICK_DRAG}`}
            </button>
      );
    };

    const allColumnLayout = layout?.children || [];

   // ETF-12937 - For making nfo field to occupy entire row only on editable form
    let nonEmptyColumnCount = 0;
    let hasInfoField = false;

    (allColumnLayout).forEach((column) => {
      if (!isEmpty(column?.children)) {
        nonEmptyColumnCount++;
      }
      const fieldUUID = get(column, ['children', 0, 'field_uuid'], null);
      if (
        fieldUUID &&
        get(fields, [fieldUUID, RESPONSE_FIELD_KEYS.FIELD_TYPE], null) === FIELD_TYPE.INFORMATION
      ) hasInfoField = true;
    });

    const isOccupyEntireRow = (
      [FORM_TYPE.EDITABLE_FORM, FORM_TYPE.READONLY_FORM].includes(formType) &&
      nonEmptyColumnCount === 1 &&
      hasInfoField
    );

    // Grid Style
    let style = {};
    if (allColumnLayout.length > 1) {
      const columnSize = [];
      layout.children.forEach((layout) => { columnSize.push(layout.width || 1); });
      style = { display: 'grid', ...getColumnTemplateStyle(isOccupyEntireRow, columnSize), gap: '8px' };
      // style = { display: 'flex', gap: '8px' };
      if (formType === FORM_TYPE.EDITABLE_FORM) style.gap = `${24 / column}px`;
    }

    return (
      <div
        style={style}
      >
        {layout.children?.map((eachLayout, index) => {
          const currentPath = [path, constructSinglePath(index, eachLayout?.type)].join(COMMA);

          if (isOccupyEntireRow &&
              isEmpty(eachLayout?.children)
            ) return null;

          if (isEmpty(eachLayout?.children)) {
                return (
                    <LayoutDropZone
                      type={FORM_LAYOUT_TYPE.COLUMN}
                      dropPath={[currentPath, constructSinglePath(0, FORM_LAYOUT_TYPE.ADD_FIELD)].join(COMMA)}
                      sectionUUID={sectionUUID}
                      onDrop={onDropHandler}
                      formType={formType}
                      isRecursiveLayout={isRecursiveLayout}
                      accept={!isRecursiveLayout ? ACCEPT_LAYOUT_TYPES : []}
                    >
                      {getAddFieldPlaceholder(currentPath)}
                    </LayoutDropZone>
                  );
            }

          return (
              <ColumnLayout
                sectionUUID={sectionUUID}
                path={currentPath}
                layout={eachLayout}
                metaData={metaData}
                moduleType={moduleType}
                formType={formType}
                dataListAuditfields={dataListAuditfields}
                column={column}
                fields={fields}
                visibility={visibility}
                isAuditView={isAuditView}
                validationMessage={validationMessage}
                onFormDataChangeHandler={onFormDataChangeHandler}
                onDropHandler={onDropHandler}
                formData={formData}
                informationFieldFormContent={informationFieldFormContent}
                documentDetails={documentDetails}
                dispatch={dispatch}
                onImportTypeChange={onImportTypeChange}
                onImportFieldClick={onImportFieldClick}
                userProfileData={userProfileData}
                showAllFields={showAllFields}
                disableVisibilityForReadOnlyForm={disableVisibilityForReadOnlyForm}
                onUpdateLayoutByResize={onUpdateLayoutByResize}
                isRecursiveLayout={isRecursiveLayout}
              />
          );
        },
        )}
      </div>
    );
}

export default RowLayout;

RowLayout.propTypes = {
    metaData: PropTypes.object,
    fields: PropTypes.object,
    layout: PropTypes.array,
    formData: PropTypes.object,
    visibility: PropTypes.object,
    validationMessage: PropTypes.object,
    onFormDataChangeHandler: PropTypes.func,
    column: PropTypes.object,
    formType: PropTypes.oneOf(Object.values(FORM_TYPE)),
    dataListAuditfields: PropTypes.object,
};

RowLayout.defaultProps = {
    metaData: {},
    fields: {},
    layout: [],
    formData: {},
    visibility: {},
    validationMessage: {},
    onFormDataChangeHandler: () => {},
    column: 2,
    formType: FORM_TYPE.CREATION_FORM,
    dataListAuditfields: {},
};
