import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { TextArea, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import { FLOW_STRINGS } from '../../Flow.strings';
import { VALIDATION_CONSTANT } from '../../../../utils/constants/validation.constant';
import { FLOW_VALIDATION_STRINGS } from '../../../edit_flow/EditFlow.strings';
import { NAME_VALIDATION_ALLOWED_CHARACTERS } from '../../../edit_flow/EditFlow.constants';

function BasicDetails(props) {
  const { t } = useTranslation();
  const { error_list, onDataListBasicDetailsChangeHandler, basicDetails } = props;

  const { BASIC_INFO } = FLOW_STRINGS(t).CREATE_DATA_LIST;
  let nameError = error_list.data_list_name;
  if (nameError?.includes(`${t(VALIDATION_CONSTANT.INVALID)} ${BASIC_INFO.DATA_SET_NAME.LABEL}`)) {
    nameError = `${FLOW_VALIDATION_STRINGS(t).CHARACTERS_ALLOWED} ${NAME_VALIDATION_ALLOWED_CHARACTERS}`;
  }

  return (
    <div>
            <TextInput
                id={BASIC_INFO.DATA_SET_NAME.ID}
                labelText={BASIC_INFO.DATA_SET_NAME.LABEL}
                required
                onChange={onDataListBasicDetailsChangeHandler}
                errorMessage={nameError}
                value={basicDetails.data_list_name}
                placeholder={BASIC_INFO.DATA_SET_NAME.PLACEHOLDER}
                autoFocus
            />
            <TextArea
                id={BASIC_INFO.DATA_SET_DESCRIPTION.ID}
                labelText={BASIC_INFO.DATA_SET_DESCRIPTION.LABEL}
                className={gClasses.MT16}
                inputInnerClassName={cx(gClasses.FontWeightNormal, gClasses.Height96)}
                onChange={onDataListBasicDetailsChangeHandler}
                errorMessage={error_list.data_list_description}
                value={basicDetails.data_list_description}
                placeholder={BASIC_INFO.DATA_SET_DESCRIPTION.PLACEHOLDER}
            />
    </div>
  );
}

BasicDetails.defaultProps = {
  error_list: {},
};
BasicDetails.propTypes = {
  basicDetails: PropTypes.objectOf(PropTypes.any).isRequired,
  onDataListBasicDetailsChangeHandler: PropTypes.func.isRequired,
  error_list: PropTypes.objectOf(PropTypes.any),
};

export default BasicDetails;
