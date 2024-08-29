import React from 'react';
import ContentLoader from 'react-content-loader';
import Skeleton from 'react-loading-skeleton';
import { calcwidth } from '../../../utils/UtilityFunctions';

const width = window.innerWidth;

function EmbedUrlTableContentLoader(props) {
  const { count } = props;
  const tableListContentLoader = new Array(count).fill(undefined).map((value, index) => (
    <ContentLoader
      height={80}
      width={width / 2}
      speed={2}
      primaryColor="#ecebeb"
      secondaryColor="#ecebeb"
      key={`holiday_table_list_content_loader_${index}`}
    >
      <rect x="25" y="26" rx="0" ry="0" width={calcwidth(13, 75, width)} height="9" />
      <rect x="25" y="44" rx="0" ry="0" width={calcwidth(33, 75, width)} height="9" />
      <rect x="0" y="77" rx="0" ry="0" width={calcwidth(567, 0, width)} height="5" />
    </ContentLoader>
  ));
  return (
    <>
      <Skeleton height={34} />
      {tableListContentLoader}
    </>
  );
}

export default EmbedUrlTableContentLoader;
