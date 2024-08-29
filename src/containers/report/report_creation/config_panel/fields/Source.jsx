import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import LeftIcon from 'assets/icons/LeftIcon';
import styles from './Fields.module.scss';

function Source(props) {
  const { dashboardList, context, onClickSource } = props;

  return (
    <div className={styles.FieldType}>
      {dashboardList?.map((d) => (
        <button
          className={cx(
            gClasses.ClickableElement,
            styles.FieldTypeItem,
            gClasses.CursorPointer,
            BS.W100,
            {
              [styles.Selected]: context?.context_id === d?.context_id,
            },
          )}
          key={d?.context_id ?? d?.fieldId}
          onClick={() => onClickSource(d)}
        >
          <div
            className={cx(BS.FLOAT_LEFT, styles.Text, gClasses.Ellipsis)}
            title={d?.context_name ?? d?.fieldDisplayName}
          >
            {d?.context_name ?? d?.fieldDisplayName}
          </div>
          <div className={cx(BS.FLOAT_RIGHT, gClasses.CenterV)}>
            <LeftIcon className={gClasses.Rotate180} />
          </div>
        </button>
      ))}
    </div>
  );
}

Source.propTypes = {
  dashboardList: PropTypes.array,
  context: PropTypes.objectOf({
    context_id: PropTypes.string,
  }),
  onClickSource: PropTypes.func,
};

export default Source;
