import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './FormConfiguration.module.scss';
import FieldVisibilityRuleList from './field_visibility/FieldVisibilityRuleList';
import { MODULE_TYPES } from '../../utils/Constants';
import AddDataFromAnotherSource from './add_data_from_another_source/AddDataFromAnotherSource';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import FieldValueRuleList from './field_value/FieldValueRuleList';
import { ExternalSourceProvider } from '../form/external_source_data/useExternalSource';

function FormConfiguration(props) {
  const {
    moduleType,
    metaData,
  } = props;

  const getMainComponent = () => (
      <div className={styles.FormConfiguration}>
          <ExternalSourceProvider>
            <AddDataFromAnotherSource
              metaData={metaData}
              moduleType={moduleType}
            />
          </ExternalSourceProvider>
          <FieldVisibilityRuleList
            metaData={metaData}
            moduleType={moduleType}
          />
          <FieldValueRuleList
            metaData={metaData}
            moduleType={moduleType}
          />
      </div>
    );

    return getMainComponent();
}

const mapStateToProps = (state) => {
  return {
    flowData: state.EditFlowReducer.flowData,
  };
};

FormConfiguration.defaultProps = {
  formUUID: EMPTY_STRING,
  formId: EMPTY_STRING,
  moduleId: EMPTY_STRING,
  moduleType: MODULE_TYPES.FLOW,
  // formUUID = '3c262efd-e367-444f-850c-e9558be801ba',
  // formId = '65447deafcde0dbfccd1de11',
  // moduleId = '65447dd7fcde0dbfccd1de0d',
};

FormConfiguration.propTypes = {
  formUUID: PropTypes.string,
  formId: PropTypes.string,
  moduleId: PropTypes.string,
  moduleType: PropTypes.oneOf(Object.values(MODULE_TYPES)),
};

export default connect(mapStateToProps)(FormConfiguration);
