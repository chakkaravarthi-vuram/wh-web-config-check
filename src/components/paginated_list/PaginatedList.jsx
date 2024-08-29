import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import Pagination from '../form_components/pagination/Pagination';

import { nullCheck } from '../../utils/jsUtility';
import gClasses from '../../scss/Typography.module.scss';
import ResponseHandler from '../response_handlers/ResponseHandler';
import { getServerErrorMessageObject } from '../../utils/UtilityFunctions';

function PaginatedList(props) {
  const {
    className,
    list = [],
    isDataLoading,
    loaderCount = 5,
    loaderElement,
    disablePagination = false,
    dataCountPerPage = 5,
  } = props;
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  const getPaginatedData = () => {
    if (!disablePagination && nullCheck(list, 'length', true)) {
      return list.slice(
        (currentPage - 1) * dataCountPerPage,
        currentPage * dataCountPerPage,
      );
    }
    if (nullCheck(list, 'length', true)) return list;
    return (
      <ResponseHandler
        className={gClasses.MT50}
        messageObject={getServerErrorMessageObject(null, [], null, t)}
      />
    );
  };

  let paginatedList = [];
  if (isDataLoading) paginatedList = new Array(loaderCount).fill(loaderElement);
  else paginatedList = getPaginatedData();

  const pagination = !disablePagination && (
    <Pagination
      activePage={currentPage}
      itemsCountPerPage={dataCountPerPage}
      totalItemsCount={list.length}
      onChange={(currPage) => setCurrentPage(currPage)}
      className={gClasses.MT15}
      isDataLoading={isDataLoading}
    />
  );

  return (
    <div className={className}>
      {paginatedList}
      {pagination}
    </div>
  );
}

export default PaginatedList;
