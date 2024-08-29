import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import styles from './DeleteStatusPopover.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';

function DeleteStatusPopover(props) {
    const { onDeleteStatusPopoverUndo, isShow } = props;

    return (
        isShow ? (
            <div
                className={cx(
                    styles.Container,
                    BS.D_FLEX,
                    // BS.P_ABSOLUTE,
                    styles.ServerError,
                    gClasses.InputBorderRadius,
                )}

            >
                <div className={gClasses.ML15}>
                    <div className={cx(gClasses.FTwo12White, gClasses.Opacity7)}>
                        Condition moved to Trash
                    </div>
                </div>
                <div
                onClick={onDeleteStatusPopoverUndo}
                className={cx(styles.Undo, gClasses.FTwo13White, gClasses.FontWeight500, gClasses.CursorPointer)}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onDeleteStatusPopoverUndo}
                role="button"
                tabIndex={0}
                >
                    Undo
                </div>
            </div>
          )
            :
            null
    );
}

DeleteStatusPopover.propTypes = {
    isShow: PropTypes.bool.isRequired,
    onDeleteStatusPopoverUndo: PropTypes.func.isRequired,
};

export default DeleteStatusPopover;
