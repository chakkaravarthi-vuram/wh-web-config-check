import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useDispatch } from 'react-redux';
import gClasses from '../../../../scss/Typography.module.scss';
import { COLUMN_LAYOUT } from './FormLayout.string';
import styles from './FormLayout.module.scss';
import { FORM_ACTIONS, FORM_LAYOUT_TYPE, FORM_TYPE } from '../../Form.string';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import RowLayout from '../../layout/row_layout/RowLayout';
import { constructSinglePath, updateLayoutByResize } from './FormLayout.utils';
import LayoutDropZone from '../../layout/layout_drop_zone/LayoutDropZone';
import { getUpdatedOriginalAndPostSectionData } from '../sections.utils';
import { updateFormFieldOrder } from '../../../../redux/actions/Form.Action';

const ACCEPT_LAYOUT_TYPES = [FORM_LAYOUT_TYPE.TABLE, FORM_LAYOUT_TYPE.BOX, FORM_LAYOUT_TYPE.LAYOUT, FORM_LAYOUT_TYPE.EXISTING_FIELD, FORM_LAYOUT_TYPE.EXISTING_TABLE];

function FormLayout(props) {
  const {
    // Common to all type
    section,
    section: { section_uuid: sectionUUID, layout: layouts },
    metaData,
    moduleType,
    cols,
    fields,
    formType,
    dataListAuditfields,
    formVisibility,
    validationMessage,
    dispatch,
    userProfileData,

    // Creation
    onDropHandler,
    // onFieldsLayoutChange,

    // Import
    onImportFieldClick,
    onImportTypeChange,

    // Edit
    onFieldDataChange,

    // Edit, ReadOnly
    formData = {},
    informationFieldFormContent = {},
    documentDetails,
    showAllFields,
    isAuditView = false,

    // ReadOnly
    disableVisibilityForReadOnlyForm = false,
  } = props;
  const reduxDispatch = useDispatch();

  const onUpdateLayoutByResize = (
    path,
    existingColumnLayout = null,
    columnWidth = null,
  ) => {
    const consolidatedLayout = updateLayoutByResize(layouts, path, existingColumnLayout, columnWidth);
    const currentSection = { ...section, layout: consolidatedLayout };
    const { postData: reorderPostData } = getUpdatedOriginalAndPostSectionData([currentSection], metaData, moduleType);
    console.log('xyz consolidatedLayout', reorderPostData);

    reduxDispatch(updateFormFieldOrder(reorderPostData, moduleType)).then(() => {
      dispatch(FORM_ACTIONS.UPDATE_LAYOUT_IN_SECTION, { sectionUUID, layout: consolidatedLayout });
    });
  };

  const getLayoutBasedOnType = (layout, path) => {
     switch (layout?.type) {
      case FORM_LAYOUT_TYPE.ROW:
           return (
              <RowLayout
                path={path}
                sectionUUID={sectionUUID}
                layout={layout}
                metaData={metaData}
                moduleType={moduleType}
                formType={formType}
                column={cols}
                fields={fields}
                formData={formData}
                informationFieldFormContent={informationFieldFormContent}
                documentDetails={documentDetails}
                visibility={formVisibility}
                validationMessage={validationMessage}
                onFormDataChangeHandler={onFieldDataChange}
                onDropHandler={onDropHandler}
                dispatch={dispatch}
                onImportTypeChange={onImportTypeChange}
                onImportFieldClick={onImportFieldClick}
                dataListAuditfields={dataListAuditfields}
                userProfileData={userProfileData}
                showAllFields={showAllFields}
                isAuditView={isAuditView}
                disableVisibilityForReadOnlyForm={disableVisibilityForReadOnlyForm}
                onUpdateLayoutByResize={onUpdateLayoutByResize}
              />
           );
      default: return null;
     }
  };

  const getAllLayout = () => {
     const layoutComponents = (layouts || []).map((eachLayout, index) => {
        const currentPath = constructSinglePath(index, eachLayout?.type);
        const eachLayoutUI = getLayoutBasedOnType(eachLayout, currentPath);

        return (
          <>
            <LayoutDropZone
              id={index}
              type={FORM_LAYOUT_TYPE.ROW}
              dropPath={currentPath}
              sectionUUID={sectionUUID}
              onDrop={onDropHandler}
              formType={formType}
              accept={ACCEPT_LAYOUT_TYPES}
            />
            {eachLayoutUI}
          </>
        );
     });

     return (
       <>
         {layoutComponents}
         <LayoutDropZone
            id={(layouts || []).length}
            type={FORM_LAYOUT_TYPE.ROW}
            dropPath={constructSinglePath((layouts || []).length, FORM_LAYOUT_TYPE.ROW)}
            sectionUUID={sectionUUID}
            onDrop={onDropHandler}
            formType={formType}
            accept={ACCEPT_LAYOUT_TYPES}
         />
       </>
     );
  };

  return (
        <div id={sectionUUID} className={cx(styles.LayoutContainer, formType === FORM_TYPE.EDITABLE_FORM && gClasses.gap12)}>
            {getAllLayout()}
        </div>
    );
}

FormLayout.defaultProps = {
    sectionUUID: EMPTY_STRING,
    cols: COLUMN_LAYOUT[2],
    fields: [],
    formType: FORM_TYPE.CREATION_FORM,
    onFieldsLayoutChange: null,
    dataListAuditfields: {},
};

FormLayout.propTypes = {
    sectionUUID: PropTypes.string,
    cols: PropTypes.number,
    fields: PropTypes.arrayOf(PropTypes.object),
    formType: PropTypes.oneOf(FORM_TYPE),
    onFieldsLayoutChange: PropTypes.func,
    onImportFieldClick: PropTypes.func,
    onImportTypeChange: PropTypes.func,
    dispatch: PropTypes.func,
    dataListAuditfields: PropTypes.object,
};

export default React.memo(FormLayout);
