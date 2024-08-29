import React from 'react';
import ContentLoader from 'react-content-loader';
import { calcwidth } from '../../../utils/UtilityFunctions';

const width = window.innerWidth;

const UserManagementListContentLoader = (props) =>
  new Array(props.count).fill(undefined).map((value, index) => (
    <ContentLoader
      height={80}
      width={props.width || width}
      speed={2}
      primaryColor="#ecebeb"
      secondaryColor="#ecebeb"
      key={`user_management_content_loader_${index}`}
    >
      {/* <circle cx="193" cy="299" r="1" />
      <rect x="205" y="176" rx="0" ry="0" width={calcwidth(0, 205, width)} height="0" />
      <rect x="165" y="204" rx="0" ry="0" width={calcwidth(0, 165, width)} height="0" />
      <rect x="58" y="193" rx="0" ry="0" width={calcwidth(0, 58, width)} height="0" />
      <rect x="275" y="98" rx="0" ry="0" width={calcwidth(0, 275, width)} height="0" />
      <rect x="169" y="93" rx="0" ry="0" width={calcwidth(0, 169, width)} height="0" />
      <rect x="34" y="63" rx="0" ry="0" width={calcwidth(0, 34, width)} height="0" />
      <rect x="262" y="119" rx="0" ry="0" width={calcwidth(0, 262, width)} height="0" />
      <rect x="188" y="166" rx="0" ry="0" width={calcwidth(0, 188, width)} height="0" />
      <rect x="281" y="147" rx="0" ry="0" width={calcwidth(0, 281, width)} height="0" />
      <rect x="256" y="233" rx="0" ry="0" width={calcwidth(0, 256, width)} height="0" />
      <rect x="365" y="329" rx="0" ry="0" width={calcwidth(0, 365, width)} height="0" /> */}
      <circle cx="45" cy="40" r="17" />
      <rect x="75" y="26" rx="0" ry="0" width={calcwidth(13, 75, width)} height="9" />
      <rect x="75" y="44" rx="0" ry="0" width={calcwidth(33, 75, width)} height="9" />
      <rect x="0" y="77" rx="0" ry="0" width={calcwidth(567, 0, width)} height="2" />
    </ContentLoader>
  ));

export default UserManagementListContentLoader;
