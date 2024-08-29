import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { translate } from 'language/config';
import MenuIcon from 'assets/icons/MenuIcon';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NavToggle } from 'redux/actions/NavBar.Action';
import { BS } from '../../../utils/UIConstants';
import styles from './BillingHeader.module.scss';

function BillingHeader(props) {
    const { toggleFunction } = props;

    const MenuToggle = () => {
        toggleFunction();
    };

    return (
        <div className={cx(gClasses.Sticky, gClasses.ZIndex1, styles.BillingHeader, gClasses.CenterV)}>
            <MenuIcon className={cx(gClasses.MR15, gClasses.CursorPointer, styles.MenuToggleDisplay)} onClick={() => MenuToggle()} />
            <h2 className={cx(gClasses.FontWeight600, gClasses.FTwo24, BS.MARGIN_0, gClasses.PB18, gClasses.PT18)}>{translate('billing_module.header.billing_header')}</h2>
        </div>
    );
}

const mapStateToprops = (state) => {
    return {
        toggleState: state.NavBarReducer.isNavOpen,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleFunction: () => {
            dispatch(NavToggle());
        },
    };
};
export default withRouter(connect(mapStateToprops, mapDispatchToProps)(BillingHeader));
