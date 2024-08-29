import React, { useState } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';

import gClasses from '../../../scss/Typography.module.scss';
import styles from './TaskResponseTable.module.scss';

import TaskResponseTableCard from './TaskResponseTableCard';
import Pagination from '../../form_components/pagination/Pagination';
import { FIELD_TYPE } from '../../../utils/constants/form.constant';

const getResponse = (response, fieldType) => {
  switch (fieldType) {
    case FIELD_TYPE.CURRENCY:
      return `${response.value} ${response.currency_type}`;
    case FIELD_TYPE.LINK:
      return (response && response.map((eachLink) => <a href={eachLink.link_url} target="_blank" rel="noreferrer">{eachLink.link_text}</a>));
    default:
      return response;
  }
};
function TaskResponseTable(props) {
  const { responseList, className, fieldType } = props;
  const totalResponseLength = responseList.length;
  const numberOfResCard = Math.floor(window.innerHeight / 4.2 / 67);
  const itemsPerPage = numberOfResCard > 2 ? numberOfResCard : 2;
  const [activePage, setActivePage] = useState(1);

  const getCurrentPageResponseList = () => {
    if (totalResponseLength > itemsPerPage) {
      const lRange = (activePage - 1) * itemsPerPage;
      const rRange = lRange + itemsPerPage;
      return responseList.slice(lRange, rRange);
    }
    return responseList;
  };

  const handlePageChange = (selectedPage) => {
    if (selectedPage !== activePage) {
      setActivePage(selectedPage);
    }
  };

  return (
    <div className={className}>
      <div className={cx(gClasses.Table, styles.TableOverFlow)}>
        <div
          className={cx(
            gClasses.InputBorder,
            gClasses.InputBorderRadius,
            gClasses.FOne13BlackV2,
            gClasses.Ellipsis,
            styles.Table,
          )}
        >
          <div style={{ flex: 2, marginRight: '40px' }}>Response</div>
          <div style={{ flex: 1 }}>Responded by</div>
        </div>
        {getCurrentPageResponseList().map((response) => {
          response.response = getResponse(response.response, fieldType);
          return <TaskResponseTableCard responseData={response} />;
        })}
      </div>
      <div>
        <Pagination
          activePage={activePage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={totalResponseLength}
          className={gClasses.MT20}
          pageRangeDisplayed={3}
          onChange={handlePageChange}
          responseTableView
        />
      </div>
    </div>
  );
}

export default TaskResponseTable;

TaskResponseTable.defaultProps = {
  responseList: [],
};

TaskResponseTable.propTypes = {
  responseList: PropTypes.arrayOf(PropTypes.any),
};
