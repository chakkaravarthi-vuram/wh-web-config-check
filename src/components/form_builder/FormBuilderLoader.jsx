import React from 'react';

import Input from '../form_components/input/Input';
import CheckboxGroup from '../form_components/checkbox_group/CheckboxGroup';
import TextArea from '../form_components/text_area/TextArea';

function FormBuilderLoader() {
  return (
    <>
      <Input isDataLoading />
      <CheckboxGroup isDataLoading />
      <TextArea isDataLoading />
    </>
  );
}
export default FormBuilderLoader;
FormBuilderLoader.defaultProps = {};
FormBuilderLoader.propTypes = {};
