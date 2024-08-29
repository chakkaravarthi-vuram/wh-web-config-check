import React, { useContext } from 'react';
import Style from './Loading.module.scss';
import ThemeContext from '../../../../hoc/ThemeContext';

function Loading() {
  const { colorScheme } = useContext(ThemeContext);
  const styles = { backgroundColor: colorScheme.activeColor };

  return (
    <div className={Style.DotsLoaderContainer}>
      <div className={Style.dot} style={styles} />
      <div className={Style.dot} style={styles} />
      <div className={Style.dot} style={styles} />
    </div>
  );
}

export default Loading;
