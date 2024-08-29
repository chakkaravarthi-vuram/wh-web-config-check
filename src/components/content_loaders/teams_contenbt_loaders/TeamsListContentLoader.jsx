import React from 'react';
import ContentLoader from 'react-content-loader';
import Skeleton from 'react-loading-skeleton';
import { calcwidth } from '../../../utils/UtilityFunctions';
import styles from './TeamsListContentLoader.module.scss';

const width = window.innerWidth;

function TeamListContentLoader(props) {
  const { disableLoader, isFileTypeLoader, count } = props;
  if (disableLoader) {
    return null;
  }
  if (isFileTypeLoader) {
    return (
      new Array(count).fill(undefined).map((_, index) => (
        <Skeleton key={`contentLoader${index}`} className={styles.Loader} />
        // <ContentLoader
        //   height={50}
        //   width={width}
        //   speed={2}
        //   primaryColor="#d6d6d6"
        //   secondaryColor="#d6d6d6"
        //   key={`contentLoader${index}`}
        // >
        //   <rect x="10" y="46" rx="0" ry="0" width={calcwidth(20, 35, width)} height="30" />
        // </ContentLoader>
      ))
    );
  }
  return (
    new Array(count).fill(undefined).map((_, index) => (
      <ContentLoader
        height={150}
        width={width}
        speed={2}
        primaryColor="#d6d6d6"
        secondaryColor="#d6d6d6"
        key={`contentLoader${index}`}
      >
        <circle cx="125" cy="70" r="60" />
        <rect x="290" y="46" rx="0" ry="0" width={calcwidth(10, 75, width)} height="9" />
        <rect x="290" y="64" rx="0" ry="0" width={calcwidth(30, 75, width)} height="9" />
        <rect x="0" y="147" rx="0" ry="0" width={calcwidth(567, 0, width)} height="2" />
      </ContentLoader>
    ))
  );
}

export default TeamListContentLoader;
