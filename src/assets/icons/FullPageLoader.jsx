import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import ThemeContext from '../../hoc/ThemeContext';
import WorkHallLoader from '../workhall_loader/WorkHallLoader';
import { isBasicUserMode } from '../../utils/UtilityFunctions';

function FullPageLoader(props) {
  const { show, isDataLoading } = props;
  const history = useHistory();
  const isBasicUser = isBasicUserMode(history);
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;
  return show || isDataLoading ? (
    <WorkHallLoader color={colorSchema?.activeColor} />
  ) : null;
}
export default FullPageLoader;

FullPageLoader.defaultProps = {
  show: false,
  testId: null,
  title: null,
};
FullPageLoader.propTypes = {
  show: PropTypes.bool,
  testId: PropTypes.string,
  title: PropTypes.string,
};
