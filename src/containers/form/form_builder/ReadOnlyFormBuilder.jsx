import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames';
import FormBody from './form_body/FormBody';
import style from './FormBuilder.module.scss';
import { FORM_TYPE } from '../Form.string';
import { MODULE_TYPES } from '../../../utils/Constants';

// comments - can we remove the not required props from form body
function ReadOnlyFormBuilder(props) {
  const {
    headerData = {
      formTitle: null,
      formDescription: null,
    },
    metaData,
    activeField,
    sections,
    fields,
    formVisibility,
    validationMessage,
    dispatch,
    getFormHeader = () => null,
    getFormFooter = () => null,
    moduleType = MODULE_TYPES.FLOW,
    saveField = null,
    userProfileData,
  } = props;
   return (
    <div className={style.FormBuilder}>
      {/* Left Panel */}
       <div className={cx(style.ReadOnlyLeftPanel, moduleType === MODULE_TYPES.TASK && gClasses.P0)}>
       <div className={style.FormOverlay} />
         {getFormHeader(metaData, headerData)}
         <FormBody
            metaData={metaData}
            activeField={activeField}
            sections={sections}
            fields={fields}
            formVisibility={formVisibility}
            validationMessage={validationMessage}
            formType={FORM_TYPE.READ_ONLY_CREATION_FORM}
            dispatch={dispatch}
            moduleType={moduleType}
            saveField={saveField}
            userProfileData={userProfileData}
         />
         {getFormFooter(metaData, [])}
       </div>

      {/* Right Panel */}
      {/* <ReadOnlyFormConfiguration /> */}
    </div>
   );
}

export default ReadOnlyFormBuilder;
