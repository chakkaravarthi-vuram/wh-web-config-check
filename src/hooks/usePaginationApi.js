import { useEffect, useState } from 'react';

import jsUtils from 'utils/jsUtility';

function usePaginationApi(apiCall, { paginationDetails, currentData, cancelToken }) {
  const hasMoreInitialData = !!(jsUtils.get(paginationDetails, 'total_count', 0) > jsUtils.get(currentData, 'length', 0));
  const [hasMore, setHasMore] = useState(hasMoreInitialData);
  useEffect(() => setHasMore(hasMoreInitialData), [hasMoreInitialData]);
  const onLoadMoreData = () => {
    if (currentData && jsUtils.get(paginationDetails, 'total_count', 0) > currentData.length) {
      if (cancelToken) cancelToken();
      apiCall(paginationDetails.page + 1);
    } else if (hasMore) setHasMore(false);
  };
  return {
    hasMore,
    onLoadMoreData,
  };
}

export default usePaginationApi;
