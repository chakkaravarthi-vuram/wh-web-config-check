import React from 'react';
import styles from './MoonLoader.module.scss';

function MoonLoader() {
    return (
        <div className={styles.Loader}>
            <div className={styles.LoaderAnimation} />
        </div>
    );
}

export default MoonLoader;
