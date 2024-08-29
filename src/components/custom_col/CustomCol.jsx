import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';

function CustomCol(props) {
  const { size, children, className } = props;
  const { xs, sm, md, lg } = size;
  console.log('propsty', props);
  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} className={className}>
      {children}
    </Col>
  );
}
export default CustomCol;
CustomCol.defaultProps = {
  size: {},
  children: null,
};
CustomCol.propTypes = {
  size: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.node,
};
