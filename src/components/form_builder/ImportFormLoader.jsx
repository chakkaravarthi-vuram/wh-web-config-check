import React from 'react';

import Input from '../form_components/input/Input';
import TextArea from '../form_components/text_area/TextArea';

function ImportFormLoader() {
  return (
    <>
      <Input isDataLoading />
      <Input isDataLoading />
      <TextArea isDataLoading />
      <Input isDataLoading />
      <Input isDataLoading />
      <TextArea isDataLoading />
    </>
  );
}
export default ImportFormLoader;
ImportFormLoader.defaultProps = {};
ImportFormLoader.propTypes = {};
