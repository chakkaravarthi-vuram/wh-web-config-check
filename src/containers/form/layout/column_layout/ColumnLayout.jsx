import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';
import FormField from '../../sections/form_field/FormField';
import { FORM_TYPE, FORM_LAYOUT_TYPE, FORM_ACTIONS } from '../../Form.string';
import RowLayout from '../row_layout/RowLayout';
import { COMMA, EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { constructSinglePath, isOverallBoxLayoutEmpty } from '../../sections/form_layout/FormLayout.utils';
import { RESPONSE_FIELD_KEYS } from '../../../../utils/constants/form/form.constant';
import jsUtility, { get } from '../../../../utils/jsUtility';
import { FIELD_TYPES } from '../../sections/field_configuration/FieldConfiguration.strings';
import { constructTableDataForFieldRender, isEmptyChecker } from '../../../../components/form_components/table/Table.utils';
import { isTableVisibleBasedOnDisable } from '../Layout.utils';
import styles from './ColumnLayout.module.scss';
import { getAllColumnBreakpoints, SECTION_CONTAINER_ID } from './ColumnLayout.utils';
import ExpandIcon from '../../../../assets/icons/app_builder_icons/ExpandIcon';
import FieldSettingIcon from '../../../../assets/icons/FieldSettingIcon';
import { FIELD_TYPE } from '../../../../utils/constants/form.constant';
import BoxLayout from '../box_layout/BoxLayout';
import { MODULE_TYPES } from '../../../../utils/Constants';

function ColumnLayout(props) {
    const {
      path = EMPTY_STRING,
      sectionUUID,
      layout,
      metaData,
      moduleType,
      formData,
      informationFieldFormContent,
      documentDetails,
      formType,
      dataListAuditfields,
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
      onUpdateLayoutByResize,
      isRecursiveLayout,
    } = props;
    const firstChildLayout = get(layout, ['children', 0], {});
    const isFirstChildTable = firstChildLayout.type === FORM_LAYOUT_TYPE.TABLE;
    const { columnBreakpoints } = getAllColumnBreakpoints(path, isFirstChildTable ? 1 : column);
    const didMountRef = useRef(false);
    const [drag, setDrag] = useState({
      active: false,
      x: '',
      y: '',
    });

    const [dims, setDims] = useState({
      w: columnBreakpoints[layout?.width || 1],
    });

    // const [, setOverlayDim] = useState({
    //   w: columnBreakpoints[(layout?.width || 1) - 1],
    // });

    const [columnSize, setColumnSize] = useState(layout?.width || 1);
    const refCursor = useRef(null);
    const isSummaryCreationBuilder = formType === FORM_TYPE.CREATION_FORM && moduleType === MODULE_TYPES.SUMMARY;

    const updateInitialDimensions = () => {
      setDims({ w: columnBreakpoints[(layout?.width || 1) - 1] });
      // setOverlayDim({ w: columnBreakpoints[(layout?.width || 1) - 1] });
    };

    useEffect(() => {
      // need not run this useEffect when the component gets mounted
      if (didMountRef.current) onUpdateLayoutByResize(path, column, columnSize);
      else didMountRef.current = true;
    }, [columnSize]);

    useEffect(() => {
      const handleResize = jsUtility.debounce(() => updateInitialDimensions(), 100);
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    useEffect(() => {
      updateInitialDimensions();
    }, [document.getElementById(SECTION_CONTAINER_ID)?.clientWidth, layout?.node_uuid]);

    useEffect(() => {
      // if (!refCursor?.current) return;
      let overlayData = { w: EMPTY_STRING, h: EMPTY_STRING };
      let dragData = { active: false, x: 0, y: 0 };
      let dimension = { w: columnBreakpoints[(layout?.width || 1) - 1] };
      const resizeFrame = (e) => {
        const { active, x, y } = dragData;

        if (active) {
          const xDiff = Math.abs(x - e.clientX);
          const yDiff = Math.abs(y - e.clientY);
          const newW = x > e.clientX ? dimension.w - xDiff : dimension.w + xDiff;
          const newH = y > e.clientY ? dimension.h + yDiff : dimension.h - yDiff;
          const widthBreakpoint = columnBreakpoints.reduce((prev, curr) => Math.abs(curr - newW) < Math.abs(prev - newW) ? curr : prev);

          // if (columnBreakpoints[0] <= newW && newW <= containerWidth) {
            // setDrag({ ...drag, x: e.clientX, y: e.clientY });
            setDims({ w: newW, h: newH });
            dimension = { w: newW, h: newH };
            dragData = { ...dragData, x: e.clientX, y: e.clientY };
            overlayData = { w: widthBreakpoint };
            // setOverlayDim({ w: widthBreakpoint, h: newH });
          // }
        }
      };

      const stopResize = () => {
        if (dragData?.active) {
          const columnSize = columnBreakpoints.findIndex((col) => col === overlayData.w) + 1;
          setDrag({ ...drag, active: false });
          dragData = { ...dragData, active: false };
          setDims({ w: overlayData.w, h: overlayData.h });
          dimension = { w: overlayData.w, h: overlayData.h };
          if (columnSize > 0) setColumnSize(columnSize);
        }
        document.removeEventListener('mousemove', resizeFrame);
      };

      const startResize = (e) => {
        setDrag({
          active: true,
          x: e.clientX,
          y: e.clientY,
        });
        dragData = { active: true, x: e.clientX, y: e.clientY };
        document.addEventListener('mousemove', resizeFrame);
        document.addEventListener('mouseup', stopResize);
      };
      const resizer = refCursor?.current;
      resizer?.addEventListener('mousedown', startResize);

      return () => {
        resizer?.removeEventListener('mousedown', startResize);
      };
    }, [refCursor?.current]);

    let VISIBILITY_ALLOWED_FORM_TYPES = [FORM_TYPE.EDITABLE_FORM, FORM_TYPE.READONLY_FORM];

    if (disableVisibilityForReadOnlyForm || isAuditView) {
      VISIBILITY_ALLOWED_FORM_TYPES = [FORM_TYPE.EDITABLE_FORM];
    }
    const getColumnChild = (eachLayout, index) => {
        const currentPath = [path, constructSinglePath(index, eachLayout?.type)].join(COMMA);
        switch (eachLayout.type) {
          case FORM_LAYOUT_TYPE.FIELD:
          case FORM_LAYOUT_TYPE.TABLE: {
            const { FIELD_TYPE, FIELD_UUID } = RESPONSE_FIELD_KEYS;
            let fieldData = fields[eachLayout.field_uuid];
            const fieldType = get(fieldData, [FIELD_TYPE], null);
            const fieldUUID = get(fieldData, [FIELD_UUID], null);
            const isEditableForm = formType === FORM_TYPE.EDITABLE_FORM;
            const visible =
              fieldType === FIELD_TYPES.TABLE
                ? visibility?.visible_tables
                : visibility?.visible_fields;
            const visibleDisableFields = visibility?.visible_disable_fields;
            const visibleTableFields = visibility?.visible_tables;
            const visibleFields = visibility?.visible_fields;
            const isVisible = get(visible, [fieldUUID], false);
            const isVisibleDisable = get(visibleDisableFields, [fieldUUID], false);

            if (fieldType === FIELD_TYPES.TABLE) {
              const isTableVisible = isTableVisibleBasedOnDisable(visibleDisableFields, visibleFields, visibleTableFields, fieldData);
              if (VISIBILITY_ALLOWED_FORM_TYPES.includes(formType) && !isTableVisible) return null;

              fieldData = constructTableDataForFieldRender(fieldData, eachLayout, fields);
            } else if ((VISIBILITY_ALLOWED_FORM_TYPES.includes(formType) && (!isVisible && !isVisibleDisable)) && !isAuditView) return null;

            if ([FORM_TYPE.READONLY_FORM, FORM_TYPE.EDITABLE_FORM].includes(formType) &&
                 fieldData?.hideFieldIfNull &&
                   isEmptyChecker(fieldData, formData[fieldUUID])) return null;

            return (
              <div className={formType !== FORM_TYPE.CREATION_FORM && formType !== FORM_TYPE.READ_ONLY_CREATION_FORM && formType !== FORM_TYPE.EDITABLE_FORM && gClasses.MB12}>
                <FormField
                  layout={eachLayout}
                  path={currentPath}
                  sectionUUID={sectionUUID}
                  key={eachLayout.field_uuid}
                  formType={formType}
                  dataListAuditfields={dataListAuditfields}
                  metaData={metaData}
                  moduleType={moduleType}
                  fieldData={fieldData}
                  fieldValue={formData[fieldUUID]}
                  documentDetails={documentDetails}
                  onFieldDataChange={onFormDataChangeHandler}
                  validationMessage={validationMessage}
                  dispatch={dispatch}
                  onImportTypeChange={onImportTypeChange}
                  onImportFieldClick={onImportFieldClick}
                  formData={formData}
                  informationFieldFormContent={informationFieldFormContent}
                  readOnly={isEditableForm && !isVisible && isVisibleDisable}
                  visibility={visibility}
                  userProfileData={userProfileData}
                  column={column}
                  showAllFields={showAllFields}
                  isRecursiveLayout={isRecursiveLayout}
                />
              </div>
            );
          }
          case FORM_LAYOUT_TYPE.ROW:
            return (
              <RowLayout
                path={currentPath}
                key={eachLayout.field_uuid}
                sectionUUID={sectionUUID}
                layout={eachLayout}
                metaData={metaData}
                moduleType={moduleType}
                formType={formType}
                dataListAuditfields={dataListAuditfields}
                column={column}
                fields={fields}
                visibility={visibility}
                validationMessage={validationMessage}
                onFormDataChangeHandler={onFormDataChangeHandler}
                onDropHandler={onDropHandler}
                formData={formData}
                informationFieldFormContent={informationFieldFormContent}
                dispatch={dispatch}
                userProfileData={userProfileData}
                showAllFields={showAllFields}
                onUpdateLayoutByResize={onUpdateLayoutByResize}
                isRecursiveLayout={isRecursiveLayout}
              />
            );
          case FORM_LAYOUT_TYPE.BOX: {
            const isBoxLayoutEmpty =
              (moduleType === MODULE_TYPES.SUMMARY
                ? metaData?.instanceId
                : true) &&
              [FORM_TYPE.READONLY_FORM, FORM_TYPE.EDITABLE_FORM].includes(
                formType,
              ) &&
              isOverallBoxLayoutEmpty(
                eachLayout,
                visibility?.visible_fields,
                fields,
              );

            if (isBoxLayoutEmpty) return null;

            return (
              <BoxLayout
                path={currentPath}
                key={eachLayout.field_uuid}
                sectionUUID={sectionUUID}
                layout={eachLayout}
                metaData={metaData}
                moduleType={moduleType}
                formType={formType}
                dataListAuditfields={dataListAuditfields}
                column={eachLayout.number_of_columns}
                fields={fields}
                visibility={visibility}
                validationMessage={validationMessage}
                onFormDataChangeHandler={onFormDataChangeHandler}
                onDropHandler={onDropHandler}
                formData={formData}
                informationFieldFormContent={informationFieldFormContent}
                dispatch={dispatch}
                userProfileData={userProfileData}
                showAllFields={showAllFields}
                onUpdateLayoutByResize={onUpdateLayoutByResize}
                isAuditView={isAuditView}
              />
            );
          }
          default: return null;
        }
    };

    const onEditClick = (childLayout, index, fieldData) => {
      const firstChild = get(layout, ['children', 0]);
      if (firstChild?.type === FORM_LAYOUT_TYPE.BOX) {
        dispatch?.(FORM_ACTIONS.ACTIVE_LAYOUT_DATA_CHANGE, {
          bgColor: firstChild.bg_color,
          noOfColumns: firstChild.number_of_columns,
          path: [path, constructSinglePath(0, FORM_LAYOUT_TYPE.BOX)].join(COMMA),
          sectionUUID,
          layout: firstChild,
         });
        return;
      }

      dispatch?.(FORM_ACTIONS.ACTIVE_FIELD_DATA_CHANGE, { fieldData: {
          ...fieldData,
          path: [path, constructSinglePath(index, childLayout?.type)].join(COMMA),
          [RESPONSE_FIELD_KEYS.NODE_UUID]: firstChild?.node_uuid,
          sectionUUID,
       } });
    };

    return (
    <div
      className={cx(
        gClasses.DisplayFlex,
        // gClasses.FlexDirectionColumn,
        gClasses.Gap16,
        gClasses.PositionRelative,
        formType === FORM_TYPE.CREATION_FORM && styles.ColumnContainer,
      )}
    >
        {layout.children.map((child, index) => {
          const fieldData = fields[child.field_uuid];
          const colStyle = { backgroundColor: fieldData?.background_color, padding: '2px', width: '100%' };
          if (isSummaryCreationBuilder && !isRecursiveLayout && !isFirstChildTable) colStyle.width = `${dims.w}px`;
          return (
            <div style={colStyle} key={child?.field_uuid}>
              {getColumnChild(child, index)}
              {!isRecursiveLayout && isSummaryCreationBuilder &&
                <button className={cx(styles.IconDrag)} ref={refCursor}>
                  <ExpandIcon className={styles.ExpandIcon} />
                </button>
              }
              {
                formType === FORM_TYPE.CREATION_FORM && ((moduleType === MODULE_TYPES.SUMMARY || fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] !== FIELD_TYPE.TABLE) && !(fieldData?.[RESPONSE_FIELD_KEYS.IS_SYSTEM_DEFINED] && !fieldData?.[RESPONSE_FIELD_KEYS.IS_ALLOW_VALUE_UPDATE])) &&
                (<button className={cx(styles.Overlay, gClasses.CenterVH)} onClick={() => onEditClick(child, index, fieldData)}>
                  <FieldSettingIcon />
                 </button>)
              }
            </div>
            );
        },
        )}
    </div>
    );
}

export default ColumnLayout;

ColumnLayout.propTypes = {
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

ColumnLayout.defaultProps = {
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
